import { TICK_MS, mulberry32, runTicks, type SimSpec } from '../lib/sim';
import type { SimSnapshot } from '../engine/Simulation';

export interface LbParams {
  algorithm: 'round-robin' | 'least-connections' | 'ip-hash';
  slowServer: boolean;
  ratePerSec: number;
}

export type LbPhase = 'toLb' | 'toServer' | 'serving' | 'queued' | 'done';

export interface LbRequest {
  id: number;
  client: 0 | 1 | 2;
  phase: LbPhase;
  server: number | null;
  phaseStart: number;
  phaseEnd: number;
}

export interface LbState {
  now: number;
  seed: number;
  nextSpawnAt: number;
  spawned: number;
  requests: LbRequest[];
  rrCounter: number;
  handled: [number, number, number];
  queues: [number[], number[], number[]];
  serving: [number | null, number | null, number | null];
}

export const TRAVEL_MS = 240;
export const SERVICE_MS = 400;
export const SLOW_FACTOR = 3;
const DONE_LINGER_MS = 400;

function serviceMs(server: number, p: LbParams): number {
  return SERVICE_MS * (p.slowServer && server === 1 ? SLOW_FACTOR : 1);
}

export function assignServer(s: LbState, p: LbParams, client: 0 | 1 | 2): number {
  if (p.algorithm === 'ip-hash') return client % 3;
  if (p.algorithm === 'least-connections') {
    let best = 0;
    let bestLoad = Infinity;
    for (let k = 0; k < 3; k++) {
      const load = (s.serving[k] !== null ? 1 : 0) + s.queues[k].length;
      if (load < bestLoad) {
        best = k;
        bestLoad = load;
      }
    }
    return best;
  }
  return s.rrCounter % 3;
}

export const LB_SPEC: SimSpec<LbState, LbParams> = {
  init: () => ({
    now: 0,
    seed: 1,
    nextSpawnAt: 0,
    spawned: 0,
    requests: [],
    rrCounter: 0,
    handled: [0, 0, 0],
    queues: [[], [], []],
    serving: [null, null, null],
  }),
  tick(state, p) {
    const now = state.now + TICK_MS;
    const s: LbState = {
      ...state,
      now,
      requests: state.requests.map((r) => ({ ...r })),
      queues: state.queues.map((q) => [...q]) as LbState['queues'],
      serving: [...state.serving] as LbState['serving'],
      handled: [...state.handled] as LbState['handled'],
    };
    for (const r of s.requests) {
      if (r.phase === 'done' || r.phase === 'queued' || now < r.phaseEnd) continue;
      if (r.phase === 'toLb') {
        r.server = assignServer(s, p, r.client);
        if (p.algorithm === 'round-robin') s.rrCounter += 1;
        r.phase = 'toServer';
        r.phaseStart = now;
        r.phaseEnd = now + TRAVEL_MS;
      } else if (r.phase === 'toServer') {
        const k = r.server as number;
        if (s.serving[k] === null) {
          s.serving[k] = r.id;
          r.phase = 'serving';
          r.phaseStart = now;
          r.phaseEnd = now + serviceMs(k, p);
        } else {
          r.phase = 'queued';
          r.phaseStart = now;
          r.phaseEnd = Number.MAX_SAFE_INTEGER;
          s.queues[k].push(r.id);
        }
      } else if (r.phase === 'serving') {
        const k = r.server as number;
        s.handled[k] += 1;
        s.serving[k] = null;
        r.phase = 'done';
        r.phaseStart = now;
        r.phaseEnd = now + DONE_LINGER_MS;
        const nextId = s.queues[k].shift();
        if (nextId !== undefined) {
          const nxt = s.requests.find((q) => q.id === nextId);
          if (nxt) {
            s.serving[k] = nxt.id;
            nxt.phase = 'serving';
            nxt.phaseStart = now;
            nxt.phaseEnd = now + serviceMs(k, p);
          }
        }
      }
    }
    s.requests = s.requests.filter((r) => r.phase !== 'done' || now < r.phaseEnd);
    while (now >= s.nextSpawnAt) {
      const client = (s.spawned % 3) as 0 | 1 | 2;
      s.requests.push({
        id: s.spawned,
        client,
        phase: 'toLb',
        server: null,
        phaseStart: now,
        phaseEnd: now + TRAVEL_MS,
      });
      s.spawned += 1;
      const jitter = 0.75 + 0.5 * mulberry32(s.seed)();
      s.seed += 1;
      s.nextSpawnAt = s.nextSpawnAt + (1000 / p.ratePerSec) * jitter;
    }
    return s;
  },
};

export function lbSnapshots(p: LbParams): SimSnapshot<LbState>[] {
  const frames = [125, 250, 440, 625];
  return frames.map((n, i) => {
    const st = runTicks(LB_SPEC, p, n);
    const q = st.queues.map((qq) => qq.length);
    const captions = [
      `${(st.now / 1000).toFixed(1)}s of traffic, routed by ${p.algorithm}: ${st.spawned} requests so far.`,
      `Queues per server: [${q.join(', ')}] — handled: [${st.handled.join(', ')}].`,
      `Server 2${p.slowServer ? ' is 3× slower' : ''}: its queue is ${q[1]}, neighbors ${q[0]} and ${q[2]}.`,
      `After ${(st.now / 1000).toFixed(0)}s — handled [${st.handled.join(', ')}], queued [${q.join(', ')}].${p.slowServer && p.algorithm === 'round-robin' && q[1] > 0 ? ' Round-robin never noticed the slow server.' : ''}`,
    ];
    return { atTick: n, caption: captions[i] };
  });
}
