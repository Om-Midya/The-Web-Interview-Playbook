/** Fixed simulation timestep (ms). The engine consumes whole ticks; widgets'
 * tick() advances state.now by exactly this much. */
export const TICK_MS = 16;

export interface SimSpec<S, P> {
  /** Fresh state. State must carry its own clock as `now` (ms). */
  init(params: P): S;
  /** Advance exactly one TICK_MS. Pure — no Date, no Math.random. */
  tick(state: S, params: P): S;
}

export interface SimEvent<S> {
  atTick: number;
  apply: (s: S) => S;
}

/** Deterministic PRNG (mulberry32). Same seed → same sequence. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Headless runner: n ticks from init. Used by tests and snapshot mode. */
export function runTicks<S, P>(spec: SimSpec<S, P>, params: P, n: number): S {
  return runScript(spec, params, n, []);
}

/** Headless runner with scripted events. An event with atTick <= k applies
 * BEFORE tick k runs (ascending atTick order) — mirroring the live engine,
 * where dispatches queue and apply on the next tick boundary. */
export function runScript<S, P>(
  spec: SimSpec<S, P>,
  params: P,
  n: number,
  events: SimEvent<S>[],
): S {
  const sorted = [...events].sort((a, b) => a.atTick - b.atTick);
  let state = spec.init(params);
  let e = 0;
  for (let k = 0; k < n; k++) {
    while (e < sorted.length && sorted[e].atTick <= k) {
      state = sorted[e].apply(state);
      e++;
    }
    state = spec.tick(state, params);
  }
  return state;
}
