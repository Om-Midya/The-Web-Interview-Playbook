import { TICK_MS, runScript, type SimSpec } from '../lib/sim';
import type { SimSnapshot } from '../engine/Simulation';

export interface NPlusOneParams {
  rows: number;
  latencyMs: number;
  mode: 'lazy' | 'join';
}

export interface Query {
  label: string;
  start: number; // ms relative to run start
  end: number;
}

export interface Summary { count: number; totalMs: number; rows: number; latencyMs: number }

export interface NPlusOneState {
  now: number;
  /** Sim time the current run started; stays set after completion. */
  runStart: number | null;
  runMode: 'lazy' | 'join' | null;
  /** Params the current/last run was started with — captured at startRun so
   * a Summary always reflects the parameters it was actually run under, even
   * if the controls change before the next run starts. */
  runRows: number | null;
  runLatencyMs: number | null;
  recorded: boolean;
  queries: Query[];
  lastRun: { lazy?: Summary; join?: Summary };
}

export function planQueries(p: NPlusOneParams): Query[] {
  if (p.mode === 'join') {
    return [{
      label: 'SELECT p.*, u.name FROM posts p JOIN users u ON u.id = p.user_id',
      start: 0,
      end: Math.round(p.latencyMs * 1.5),
    }];
  }
  const qs: Query[] = [{ label: 'SELECT * FROM posts', start: 0, end: p.latencyMs }];
  for (let i = 1; i <= p.rows; i++) {
    const prev = qs[qs.length - 1];
    qs.push({
      label: `SELECT name FROM users WHERE id = ${i}  -- post.author`,
      start: prev.end,
      end: prev.end + p.latencyMs,
    });
  }
  return qs;
}

export function startRun(s: NPlusOneState, p: NPlusOneParams): NPlusOneState {
  return {
    ...s,
    runStart: s.now,
    runMode: p.mode,
    runRows: p.rows,
    runLatencyMs: p.latencyMs,
    recorded: false,
    queries: planQueries(p),
  };
}

/** ms since the current run started (0 when no run yet). */
export function elapsedMs(s: NPlusOneState): number {
  return s.runStart === null ? 0 : s.now - s.runStart;
}

/** Queries that have started so far in the current run. */
export function firedCount(s: NPlusOneState): number {
  if (s.runStart === null) return 0;
  const el = elapsedMs(s);
  return s.queries.filter((q) => q.start < el || q.start === 0).length;
}

export const NPLUSONE_SPEC: SimSpec<NPlusOneState, NPlusOneParams> = {
  init: () => ({
    now: 0,
    runStart: null,
    runMode: null,
    runRows: null,
    runLatencyMs: null,
    recorded: false,
    queries: [],
    lastRun: {},
  }),
  tick(s) {
    // Once a run is recorded (or none has started yet) there is nothing
    // time-dependent left to show. Returning the SAME reference lets
    // LiveView's identical-reference setState bail out, so the widget stops
    // re-rendering at 60fps forever after a run completes.
    if (s.runStart === null || s.recorded) return s;
    const now = s.now + TICK_MS;
    if (s.runMode !== null && s.queries.length > 0) {
      const endT = s.queries[s.queries.length - 1].end;
      if (now - s.runStart >= endT) {
        return {
          ...s,
          now,
          recorded: true,
          lastRun: {
            ...s.lastRun,
            [s.runMode]: {
              count: s.queries.length,
              totalMs: endT,
              rows: s.runRows ?? 0,
              latencyMs: s.runLatencyMs ?? 0,
            },
          },
        };
      }
    }
    return { ...s, now };
  },
};

/** Reduced-motion frames: a lazy run, then a join run, captions computed. */
export function nplusoneSnapshots(p: NPlusOneParams): SimSnapshot<NPlusOneState>[] {
  const pLazy: NPlusOneParams = { ...p, mode: 'lazy' };
  const pJoin: NPlusOneParams = { ...p, mode: 'join' };
  const lazyTotal = (p.rows + 1) * p.latencyMs;
  const lazyDoneTick = Math.ceil(lazyTotal / TICK_MS) + 2;
  const bothEvents = [
    { atTick: 0, apply: (st: NPlusOneState) => startRun(st, pLazy) },
    { atTick: lazyDoneTick, apply: (st: NPlusOneState) => startRun(st, pJoin) },
  ];
  const bothDoneTick = lazyDoneTick + Math.ceil((p.latencyMs * 1.5) / TICK_MS) + 2;
  const final = runScript(NPLUSONE_SPEC, pLazy, bothDoneTick, bothEvents);
  const lazyRun = [{ atTick: 0, apply: (st: NPlusOneState) => startRun(st, pLazy) }];
  const midTick = Math.ceil((lazyTotal / 2) / TICK_MS);
  const mid = runScript(NPLUSONE_SPEC, pLazy, midTick, lazyRun);
  // The "one innocent query" frame must land while the parent query is still
  // in flight — at low latency (e.g. 10ms) the parent finishes and children
  // start well before a fixed tick like 2 (32ms).
  const parentMidTick = Math.max(1, Math.floor(p.latencyMs / 2 / TICK_MS));
  return [
    {
      atTick: parentMidTick,
      events: lazyRun,
      caption: 'The ORM fetches the post list — one innocent query.',
    },
    {
      atTick: midTick,
      events: lazyRun,
      caption: `Now it loops over the rows: ${firedCount(mid) - 1} of ${p.rows} author lookups so far — each one waits for the previous.`,
    },
    {
      atTick: lazyDoneTick,
      events: lazyRun,
      caption: `Lazy loading finished: ${p.rows + 1} queries · ${lazyTotal} ms total.`,
    },
    {
      atTick: bothDoneTick,
      events: bothEvents,
      caption: `The JOIN does the same work in one round trip: ${final.lastRun.lazy?.count ?? 0} queries · ${final.lastRun.lazy?.totalMs ?? 0} ms vs 1 query · ${final.lastRun.join?.totalMs ?? 0} ms.`,
    },
  ];
}
