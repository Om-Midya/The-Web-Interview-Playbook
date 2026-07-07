import { useMemo, useState } from 'react';
import Simulation from '../engine/Simulation';
import { OptionRow, Slider } from '../engine/PlaygroundFrame';
import { DurationBar, SVG_W, TimelineSvg } from '../engine/sim-svg';
import {
  NPLUSONE_SPEC,
  elapsedMs,
  firedCount,
  nplusoneSnapshots,
  startRun,
  type NPlusOneParams,
} from './nplusone';

export default function NPlusOneVisualizer() {
  const [rows, setRows] = useState(4);
  const [latencyMs, setLatencyMs] = useState(50);
  const [mode, setMode] = useState<string>('lazy');
  const params: NPlusOneParams = { rows, latencyMs, mode: mode as NPlusOneParams['mode'] };
  const snapshots = useMemo(() => nplusoneSnapshots(params), [rows, latencyMs, mode]);
  const maxMs = (rows + 1) * latencyMs; // x-scale anchored to the lazy total

  return (
    <div>
      <div className="playground-controls">
        <OptionRow label="rows" options={['4', '8', '12']} value={String(rows)} onChange={(v) => setRows(Number(v))} />
        <Slider label="query latency" min={10} max={100} value={latencyMs} onChange={setLatencyMs} unit="ms" />
        <OptionRow label="strategy" options={['lazy', 'join']} value={mode} onChange={setMode} />
      </div>
      <Simulation
        spec={NPLUSONE_SPEC}
        params={params}
        snapshots={snapshots}
        ariaLabel="N plus one query visualizer"
        render={(s, api) => {
          const el = elapsedMs(s);
          const xs = (t: number) => (t / maxMs) * SVG_W;
          const height = Math.max(120, 28 + s.queries.length * 22);
          const total = s.queries.length > 0 ? s.queries[s.queries.length - 1].end : 0;
          return (
            <div className="sim">
              {!api.snapshot && (
                <div className="sim-actions">
                  <button
                    className="is-primary"
                    onClick={() => {
                      api.dispatch((st) => startRun(st, params));
                      api.play();
                    }}
                  >
                    ▶ Run {mode === 'lazy' ? `lazy (${rows} rows)` : 'JOIN'}
                  </button>
                </div>
              )}
              {s.queries.length === 0 ? (
                <p className="sim-summary">Press Run and watch the queries fire.</p>
              ) : (
                <TimelineSvg height={height} label="Query gantt chart">
                  {s.queries.map((q, i) => {
                    const y = 22 + i * 22;
                    const status = el >= q.end ? 'done' : el > q.start ? 'running' : 'pending';
                    const x2 = status === 'pending' ? xs(q.end) : xs(Math.min(el, q.end));
                    return (
                      <DurationBar
                        key={i}
                        x1={xs(q.start)}
                        x2={status === 'pending' ? xs(q.end) : Math.max(xs(q.start) + 1, x2)}
                        y={y}
                        label={q.label}
                        status={status}
                      />
                    );
                  })}
                </TimelineSvg>
              )}
              <div className="npo-readout">
                <span>queries <strong>{firedCount(s)}/{s.queries.length || '—'}</strong></span>
                <span>elapsed <strong>{Math.min(el, total)} ms</strong></span>
              </div>
              {s.lastRun.lazy &&
                s.lastRun.join &&
                s.lastRun.lazy.rows === s.lastRun.join.rows &&
                s.lastRun.lazy.latencyMs === s.lastRun.join.latencyMs && (
                  <p className="sim-note">
                    Same data, two strategies: lazy = {s.lastRun.lazy.count} queries · {s.lastRun.lazy.totalMs} ms —
                    JOIN = {s.lastRun.join.count} query · {s.lastRun.join.totalMs} ms.
                    The database was never the problem; the round trips were.
                  </p>
                )}
            </div>
          );
        }}
      />
    </div>
  );
}
