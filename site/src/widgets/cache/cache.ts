import { TICK_MS, runTicks, type SimSpec } from '../lib/sim';
import type { SimSnapshot } from '../engine/Simulation';

export interface CacheParams {
  ttlMs: number;
  ratePerSec: number;
  herd: boolean;
}

export interface CacheRequest {
  id: number;
  layer: 0 | 1 | 2 | 3;
  dir: 'down' | 'up';
  moving: boolean;
  phaseStart: number;
  phaseEnd: number;
  resolved: 'hit' | 'db' | null;
  hitLayer: number | null;
}

export interface CacheState {
  now: number;
  nextSpawnAt: number;
  spawned: number;
  requests: CacheRequest[];
  fresh: [boolean, boolean, boolean];
  expiresAt: [number, number, number];
  pendingBurst: number[];
  dbQueries: number;
  hits: [number, number, number];
  total: number;
}

export const HOP_MS = 192;
export const HERD_SIZE = 5;
const DONE_LINGER_MS = 300;

/** Herd = 5 users hammering the moment the CDN entry dies; without the herd
 * toggle there is no synthetic burst (normal traffic repopulates). */
export function burstTimes(now: number, herd: boolean): number[] {
  return herd ? Array.from({ length: HERD_SIZE }, () => now) : [];
}

function spawn(s: CacheState, now: number, startLayer: 0 | 1): void {
  const r: CacheRequest = {
    id: s.spawned,
    layer: startLayer,
    dir: 'down',
    moving: false,
    phaseStart: now,
    phaseEnd: now,
    resolved: null,
    hitLayer: null,
  };
  s.spawned += 1;
  arrive(s, r, now);
  s.requests.push(r);
}

/** Handle a DOWNWARD request that is AT its current layer right now.
 * (Upward arrivals — refresh + climb — are handled inline in tick().) */
function arrive(s: CacheState, r: CacheRequest, now: number): void {
  if (r.layer < 3 && s.fresh[r.layer]) {
    s.hits[r.layer] += 1;
    s.total += 1;
    r.resolved = 'hit';
    r.hitLayer = r.layer;
    r.dir = 'up';
    settleUpward(s, r, now);
    return;
  }
  if (r.layer === 3) {
    s.dbQueries += 1;
    s.total += 1;
    r.resolved = 'db';
    r.dir = 'up';
    settleUpward(s, r, now);
    return;
  }
  r.layer = (r.layer + 1) as CacheRequest['layer'];
  r.moving = true;
  r.phaseStart = now;
  r.phaseEnd = now + HOP_MS;
}

function settleUpward(s: CacheState, r: CacheRequest, now: number): void {
  if (r.layer === 0) {
    r.moving = false;
    r.phaseStart = now;
    r.phaseEnd = now + DONE_LINGER_MS;
    return;
  }
  r.layer = (r.layer - 1) as CacheRequest['layer'];
  r.moving = true;
  r.phaseStart = now;
  r.phaseEnd = now + HOP_MS;
}

export const CACHE_SPEC: SimSpec<CacheState, CacheParams> = {
  init: () => ({
    now: 0,
    nextSpawnAt: 0,
    spawned: 0,
    requests: [],
    fresh: [false, false, false],
    expiresAt: [0, 0, 0],
    pendingBurst: [],
    dbQueries: 0,
    hits: [0, 0, 0],
    total: 0,
  }),
  tick(state, p) {
    const now = state.now + TICK_MS;
    const s: CacheState = {
      ...state,
      now,
      requests: state.requests.map((r) => ({ ...r })),
      fresh: [...state.fresh] as CacheState['fresh'],
      expiresAt: [...state.expiresAt] as CacheState['expiresAt'],
      pendingBurst: [...state.pendingBurst],
      hits: [...state.hits] as CacheState['hits'],
    };
    // 1. expiry (+ herd trigger on CDN death)
    for (let k = 0 as 0 | 1 | 2; k <= 2; k = (k + 1) as 0 | 1 | 2) {
      if (s.fresh[k] && now >= s.expiresAt[k]) {
        s.fresh[k] = false;
        if (k === 1) s.pendingBurst.push(...burstTimes(now, p.herd));
      }
    }
    // 2. arrivals / advance
    for (const r of s.requests) {
      if (!r.moving) continue;
      if (now < r.phaseEnd) continue;
      r.moving = false;
      if (r.dir === 'up') {
        // upward arrival: refresh this layer, keep climbing (or linger at 0)
        if (r.layer <= 2) {
          s.fresh[r.layer] = true;
          s.expiresAt[r.layer] = now + p.ttlMs;
        }
        settleUpward(s, r, now);
      } else {
        arrive(s, r, now);
      }
    }
    // prune finished lingerers
    s.requests = s.requests.filter((r) => r.moving || r.resolved === null || now < r.phaseEnd);
    // 3. spawns: regular then burst
    while (now >= s.nextSpawnAt) {
      spawn(s, now, 0);
      s.nextSpawnAt = s.nextSpawnAt + 1000 / p.ratePerSec;
    }
    while (s.pendingBurst.length > 0 && s.pendingBurst[0] <= now) {
      s.pendingBurst.shift();
      spawn(s, now, 1);
    }
    return s;
  },
};

export function cacheSnapshots(p: CacheParams): SimSnapshot<CacheState>[] {
  const expiryTick = Math.ceil((960 + p.ttlMs) / TICK_MS) + 2; // ≈ first CDN expiry window
  const frames = [40, 140, expiryTick, expiryTick + 80];
  return frames.map((n, i) => {
    const st = runTicks(CACHE_SPEC, p, n);
    const freshStr = `[${st.fresh.map((f) => (f ? '✓' : '✗')).join(' ')}]`;
    // Captions derive from the computed state — never assert what a frame
    // might not show (traffic keeps refreshing layers, so expiry timing shifts).
    const captions = [
      `Cold start: the first request found every cache empty and pierced to the DB (DB queries so far: ${st.dbQueries}).`,
      `Warm: ${st.hits[0] + st.hits[1] + st.hits[2]} of ${st.total} requests resolved from a cache layer. Fresh: ${freshStr}.`,
      st.fresh[1]
        ? `TTLs at work — fresh layers ${freshStr}, DB queries ${st.dbQueries}.`
        : `The CDN entry has expired${p.herd ? ' — and 5 users hit refresh at once' : ''}. Fresh layers: ${freshStr}.`,
      `DB has now answered ${st.dbQueries} queries for ${st.total} requests${p.herd ? ' — a herd pierces together before the first response can repopulate.' : '.'}`,
    ];
    return { atTick: n, caption: captions[i] };
  });
}
