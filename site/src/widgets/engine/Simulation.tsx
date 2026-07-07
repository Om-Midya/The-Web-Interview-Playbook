import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { TICK_MS, runScript, type SimEvent, type SimSpec } from '../lib/sim';

export interface SimApi<S> {
  /** Queue a pure state transition; applies on the next tick boundary
   * (immediately if paused). No-op in snapshot mode. */
  dispatch: (fn: (s: S) => S) => void;
  playing: boolean;
  play: () => void;
  reset: () => void;
}

export interface SimSnapshot<S> {
  atTick: number;
  caption: string;
  events?: SimEvent<S>[];
}

interface SimulationProps<S, P> {
  spec: SimSpec<S, P>;
  params: P;
  render: (state: S, api: SimApi<S>) => ReactNode;
  snapshots: SimSnapshot<S>[];
  ariaLabel: string;
}

const SPEEDS = [1, 2, 4] as const;
/** Cap accumulated time so a backgrounded tab doesn't fast-forward on return. */
const MAX_ACC_MS = TICK_MS * 60;

function prefersReducedMotion(): boolean {
  return typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function Simulation<S, P>(props: SimulationProps<S, P>) {
  const snapshotMode = useMemo(
    () => prefersReducedMotion() || typeof requestAnimationFrame === 'undefined',
    [],
  );
  return snapshotMode ? <SnapshotView {...props} /> : <LiveView {...props} />;
}

function LiveView<S, P>({ spec, params, render, ariaLabel }: SimulationProps<S, P>) {
  const [state, setState] = useState<S>(() => spec.init(params));
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(1);
  const stateRef = useRef(state);
  const queueRef = useRef<((s: S) => S)[]>([]);
  const paramsRef = useRef(params);
  paramsRef.current = params;
  const speedRef = useRef(speed);
  speedRef.current = speed;

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last: number | null = null;
    let acc = 0;
    const frame = (ts: number) => {
      if (last !== null) {
        acc = Math.min(acc + (ts - last) * speedRef.current, MAX_ACC_MS);
        let s = stateRef.current;
        let advanced = false;
        while (acc >= TICK_MS) {
          acc -= TICK_MS;
          const q = queueRef.current;
          queueRef.current = [];
          for (const fn of q) s = fn(s);
          s = spec.tick(s, paramsRef.current);
          advanced = true;
        }
        if (advanced) {
          stateRef.current = s;
          setState(s);
        }
      }
      last = ts;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [playing, spec]);

  function applyNow(fn: (s: S) => S) {
    const s = fn(stateRef.current);
    stateRef.current = s;
    setState(s);
  }

  function flushQueue() {
    if (queueRef.current.length === 0) return;
    const q = queueRef.current;
    queueRef.current = [];
    let s = stateRef.current;
    for (const fn of q) s = fn(s);
    stateRef.current = s;
    setState(s);
  }

  function reset() {
    setPlaying(false);
    queueRef.current = [];
    applyNow(() => spec.init(paramsRef.current));
  }

  function togglePlaying() {
    if (playing) flushQueue(); // pausing: apply anything still queued, in order
    setPlaying(!playing);
  }

  const api: SimApi<S> = {
    dispatch: (fn) => {
      if (playing) queueRef.current.push(fn);
      else applyNow(fn);
    },
    playing,
    play: () => setPlaying(true),
    reset,
  };

  return (
    <div className="sim" aria-label={ariaLabel}>
      <div className="stepper-controls">
        <button className="is-primary" onClick={togglePlaying}>
          {playing ? '⏸ Pause' : '▶ Play'}
        </button>
        {SPEEDS.map((x) => (
          <button
            key={x}
            aria-pressed={speed === x}
            className={speed === x ? 'is-active' : ''}
            onClick={() => setSpeed(x)}
          >
            {x}×
          </button>
        ))}
        <button onClick={reset} aria-label="Reset simulation">↺ Reset</button>
      </div>
      {render(state, api)}
    </div>
  );
}

function SnapshotView<S, P>({ spec, params, render, snapshots, ariaLabel }: SimulationProps<S, P>) {
  const [frame, setFrame] = useState(0);
  const states = useMemo(
    () => snapshots.map((sn) => runScript(spec, params, sn.atTick, sn.events ?? [])),
    [spec, params, snapshots],
  );
  if (states.length === 0) return null; // fail-soft: no snapshots authored
  const idx = Math.min(frame, states.length - 1);
  const api: SimApi<S> = {
    dispatch: () => {},
    playing: false,
    play: () => {},
    reset: () => setFrame(0),
  };
  return (
    <div className="sim" aria-label={ariaLabel}>
      <p className="sim-caption" aria-live="polite">{snapshots[idx].caption}</p>
      {render(states[idx], api)}
      <div className="stepper-controls">
        <button onClick={() => setFrame(Math.max(0, idx - 1))} disabled={idx === 0}>
          ← Prev
        </button>
        <button
          className="is-primary"
          onClick={() => setFrame(Math.min(states.length - 1, idx + 1))}
          disabled={idx === states.length - 1}
        >
          Next →
        </button>
        <span className="stepper-progress">{idx + 1} / {states.length}</span>
      </div>
    </div>
  );
}
