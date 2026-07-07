import { TICK_MS, runScript, type SimEvent, type SimSpec } from '../lib/sim';
import type { SimSnapshot } from '../engine/Simulation';

export interface DebounceParams {
  waitMs: number;
  debounceMode: 'trailing' | 'leading';
  throttleMode: 'leading' | 'trailing';
}

export interface DebounceState {
  now: number;
  /** Raw input event timestamps. */
  events: number[];
  debounceFires: number[];
  throttleFires: number[];
  /** When the pending debounce window expires (exact ms), or null. */
  debounceDeadline: number | null;
  /** When the open throttle window closes (exact ms), or null. */
  throttleWindowEnd: number | null;
  /** trailing throttle: an event arrived inside the open window. */
  throttlePending: boolean;
  /** Future event times queued by the "Simulate burst" button. */
  scheduled: number[];
}

/** Two keystroke clusters and a straggler — chosen so default params (wait 300,
 * trailing debounce, leading throttle) produce 2 debounced and 3 throttled fires. */
export const BURST_OFFSETS = [0, 48, 96, 144, 192, 400, 448, 960];

/** Apply one input event at time t (exact ms). */
function applyEventAt(s: DebounceState, p: DebounceParams, t: number): DebounceState {
  let { debounceFires, throttleFires, debounceDeadline, throttleWindowEnd, throttlePending } = s;
  // debounce
  if (p.debounceMode === 'leading' && debounceDeadline === null) {
    debounceFires = [...debounceFires, t];
  }
  debounceDeadline = t + p.waitMs;
  // throttle
  if (throttleWindowEnd === null) {
    if (p.throttleMode === 'leading') {
      throttleFires = [...throttleFires, t];
    } else {
      throttlePending = true;
    }
    throttleWindowEnd = t + p.waitMs;
  } else if (p.throttleMode === 'trailing') {
    throttlePending = true;
  }
  return {
    ...s,
    events: [...s.events, t],
    debounceFires,
    throttleFires,
    debounceDeadline,
    throttleWindowEnd,
    throttlePending,
  };
}

/** Live-mode event: stamp at the current sim time. */
export function addEvent(s: DebounceState, p: DebounceParams): DebounceState {
  return applyEventAt(s, p, s.now);
}

/** Resolve any expiry due at or before `uptoT`: fire a pending debounce
 * deadline and close/chain the throttle window. The throttle branch loops —
 * a trailing fire reopens a window that may itself have already expired
 * within the same span (e.g. waitMs smaller than the gap being settled). */
function settle(s: DebounceState, p: DebounceParams, uptoT: number): DebounceState {
  let { debounceFires, debounceDeadline, throttleFires, throttleWindowEnd, throttlePending } = s;
  if (debounceDeadline !== null && uptoT >= debounceDeadline) {
    if (p.debounceMode === 'trailing') {
      debounceFires = [...debounceFires, debounceDeadline];
    }
    debounceDeadline = null;
  }
  while (throttleWindowEnd !== null && uptoT >= throttleWindowEnd) {
    if (p.throttleMode === 'trailing' && throttlePending) {
      throttleFires = [...throttleFires, throttleWindowEnd];
      throttleWindowEnd = throttleWindowEnd + p.waitMs; // rate limiting continues
      throttlePending = false;
    } else {
      throttleWindowEnd = null;
      throttlePending = false;
    }
  }
  return { ...s, debounceFires, debounceDeadline, throttleFires, throttleWindowEnd, throttlePending };
}

/** Queue the demo burst relative to now; tick() consumes each when due. */
export function scheduleBurst(s: DebounceState): DebounceState {
  return { ...s, scheduled: [...s.scheduled, ...BURST_OFFSETS.map((o) => s.now + o)].sort((a, b) => a - b) };
}

export const DEBOUNCE_SPEC: SimSpec<DebounceState, DebounceParams> = {
  init: () => ({
    now: 0,
    events: [],
    debounceFires: [],
    throttleFires: [],
    debounceDeadline: null,
    throttleWindowEnd: null,
    throttlePending: false,
    scheduled: [],
  }),
  tick(state, p) {
    const now = state.now + TICK_MS;
    let s: DebounceState = { ...state, now };
    // Due scheduled events, at their exact times, ascending. Settle any
    // expiry due at the event's own time BEFORE applying it, so an event
    // landing in the same tick as a deadline/window-end can never clobber
    // an expiry that was strictly earlier.
    while (s.scheduled.length > 0 && s.scheduled[0] <= now) {
      const [t, ...rest] = s.scheduled;
      s = settle(s, p, t);
      s = applyEventAt({ ...s, scheduled: rest }, p, t);
    }
    // Settle anything left expiring by `now` itself.
    s = settle(s, p, now);
    return s;
  },
};

/** Reduced-motion frames. Captions embed counts COMPUTED from the burst run,
 * so they stay accurate for any params. */
export function debounceSnapshots(p: DebounceParams): SimSnapshot<DebounceState>[] {
  const burst: SimEvent<DebounceState>[] = [{ atTick: 0, apply: scheduleBurst }];
  const at = (n: number) => runScript(DEBOUNCE_SPEC, p, n, burst);
  const midTick = 15;
  const mid = at(midTick);
  // After the second keystroke cluster (last cluster event + wait) — where the
  // first debounce fire lands under default params.
  const afterClustersTick = Math.ceil((BURST_OFFSETS[6] + p.waitMs) / TICK_MS) + 2;
  const afterClusters = at(afterClustersTick);
  const settledTick = Math.ceil((BURST_OFFSETS[BURST_OFFSETS.length - 1] + 2 * p.waitMs) / TICK_MS) + 2;
  const settled = at(settledTick);
  // Captions embed COMPUTED counts only — behavioral phrasing must stay true
  // for any waitMs, so the numbers come from the actual run.
  return [
    {
      atTick: 1,
      events: burst,
      caption: `A burst of ${BURST_OFFSETS.length} keystrokes arrives — watch all three lanes respond differently.`,
    },
    {
      atTick: midTick,
      events: burst,
      caption: `Mid-burst: throttle has fired ${mid.throttleFires.length}×, debounce ${mid.debounceFires.length}× — every keystroke restarts the ${p.waitMs}ms debounce timer.`,
    },
    {
      atTick: afterClustersTick,
      events: burst,
      caption: `After the typing clusters: ${afterClusters.debounceFires.length} debounced call(s) vs ${afterClusters.throttleFires.length} throttled so far.`,
    },
    {
      atTick: settledTick,
      events: burst,
      caption: `Settled: ${settled.events.length} keystrokes → ${settled.debounceFires.length} debounced call(s) · ${settled.throttleFires.length} throttled call(s).`,
    },
  ];
}
