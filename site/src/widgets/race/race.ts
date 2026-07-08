import { TICK_MS, runScript, type SimSpec } from '../lib/sim';
import type { SimSnapshot } from '../engine/Simulation';

export interface RaceParams {
  lock: boolean;
  staggerMs: number; // 0–1000; window closes at ≥688 (A's write completion)
}

export type RacePhase =
  | 'idle' | 'waiting' | 'read' | 'validate' | 'write' | 'commit'
  | 'blocked' | 'confirmed' | 'rejected';

export interface RaceUser {
  phase: RacePhase;
  phaseEnd: number;
  sawStock: number | null;
}

export interface RaceState {
  now: number;
  running: boolean;
  raceStartAt: number;
  stock: number;
  lockHolder: 0 | 1 | null;
  users: [RaceUser, RaceUser];
  log: string[];
}

export const READ_MS = 192;
export const VALIDATE_MS = 304;
export const WRITE_MS = 192;
export const COMMIT_MS = 144;
const NAMES = ['A', 'B'] as const;

export function startRace(s: RaceState): RaceState {
  return {
    ...s,
    running: true,
    raceStartAt: s.now,
    stock: 1,
    lockHolder: null,
    users: [
      { phase: 'read', phaseEnd: s.now + READ_MS, sawStock: null },
      { phase: 'waiting', phaseEnd: 0, sawStock: null },
    ],
    log: [`stock reset to 1 — two buyers incoming`],
  };
}

export const RACE_SPEC: SimSpec<RaceState, RaceParams> = {
  init: () => ({
    now: 0,
    running: false,
    raceStartAt: 0,
    stock: 1,
    lockHolder: null,
    users: [
      { phase: 'idle', phaseEnd: 0, sawStock: null },
      { phase: 'idle', phaseEnd: 0, sawStock: null },
    ],
    log: [],
  }),
  tick(state, p) {
    const now = state.now + TICK_MS;
    if (!state.running) return { ...state, now };
    const s: RaceState = {
      ...state,
      now,
      users: [{ ...state.users[0] }, { ...state.users[1] }],
      log: state.log,
    };
    // In lock mode, whoever is inside the transaction holds the row lock.
    // (startRace is params-agnostic, so the holder is derived lazily here.)
    if (p.lock && s.lockHolder === null) {
      for (const u of [0, 1] as const) {
        const ph = s.users[u].phase;
        if (ph === 'read' || ph === 'validate' || ph === 'write' || ph === 'commit') {
          s.lockHolder = u;
          break;
        }
      }
    }
    // B enters when its stagger elapses
    if (s.users[1].phase === 'waiting' && now - s.raceStartAt >= p.staggerMs) {
      if (p.lock && s.lockHolder !== null && s.lockHolder !== 1) {
        s.users[1].phase = 'blocked';
        s.users[1].phaseEnd = Number.MAX_SAFE_INTEGER;
        s.log = [...s.log, `B: blocked — row lock held by A`];
      } else {
        s.users[1].phase = 'read';
        s.users[1].phaseEnd = now + READ_MS;
        if (p.lock) s.lockHolder = 1;
      }
    }
    for (const u of [0, 1] as const) {
      const user = s.users[u];
      if (
        user.phase === 'idle' || user.phase === 'waiting' || user.phase === 'blocked' ||
        user.phase === 'confirmed' || user.phase === 'rejected' || now < user.phaseEnd
      ) continue;
      if (user.phase === 'read') {
        user.sawStock = s.stock;
        s.log = [...s.log, `${NAMES[u]}: SELECT stock → ${s.stock}`];
        user.phase = 'validate';
        user.phaseEnd = now + VALIDATE_MS;
      } else if (user.phase === 'validate') {
        if ((user.sawStock ?? 0) > 0) {
          user.phase = 'write';
          user.phaseEnd = now + WRITE_MS;
        } else {
          user.phase = 'rejected';
          s.log = [...s.log, `${NAMES[u]}: 409 — no stock left`];
          if (p.lock && s.lockHolder === u) {
            s.lockHolder = null;
            unblockOther(s, u, now);
          }
        }
      } else if (user.phase === 'write') {
        s.stock -= 1;
        s.log = [...s.log, `${NAMES[u]}: UPDATE stock = ${s.stock}`];
        user.phase = 'commit';
        user.phaseEnd = now + COMMIT_MS;
      } else if (user.phase === 'commit') {
        user.phase = 'confirmed';
        s.log = [...s.log, `${NAMES[u]}: COMMIT — booking confirmed`];
        if (p.lock && s.lockHolder === u) {
          s.lockHolder = null;
          unblockOther(s, u, now);
        }
      }
    }
    return s;
  },
};

function unblockOther(s: RaceState, releasing: 0 | 1, now: number): void {
  const other = (1 - releasing) as 0 | 1;
  if (s.users[other].phase === 'blocked') {
    s.lockHolder = other;
    s.users[other].phase = 'read';
    s.users[other].phaseEnd = now + READ_MS;
    s.log = [...s.log, `${NAMES[other]}: lock acquired — retrying read`];
  }
}

export function raceSnapshots(p: RaceParams): SimSnapshot<RaceState>[] {
  const ev = [{ atTick: 0, apply: startRace }];
  const at = (n: number) => runScript(RACE_SPEC, p, n, ev);
  const mid = at(14);   // ~224ms: reads done/landing
  const late = at(46);  // ~736ms: writes landing (no-lock) / B blocked (lock)
  const final = at(120);
  return [
    { atTick: 14, events: ev, caption: p.lock
      ? `A holds the row lock; B is ${mid.users[1].phase}. A saw stock = ${mid.users[0].sawStock ?? '…'}.`
      : `Both transactions read: A saw ${mid.users[0].sawStock ?? '…'}, B saw ${mid.users[1].sawStock ?? '…'} — the same seat.` },
    { atTick: 46, events: ev, caption: p.lock
      ? `B is still ${late.users[1].phase} — the lock serializes access. Stock: ${late.stock}.`
      : `Both passed validation (they both saw 1). Stock is now ${late.stock} and falling.` },
    { atTick: 120, events: ev, caption: p.lock
      ? `Final: stock ${final.stock}. A ${final.users[0].phase}, B ${final.users[1].phase} — the lock turned a corruption into a clean 409.`
      : `Final: stock ${final.stock}. Both buyers ${final.users[0].phase} — the seat was sold twice.` },
  ];
}
