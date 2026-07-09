import { useMemo, useState } from 'react';
import Simulation from '../engine/Simulation';
import { OptionRow } from '../engine/PlaygroundFrame';
import { NodeBox, TravelDot, type Pt } from '../engine/topo-svg';
import {
  CAP_SPEC, REPLICATION_MS, capSnapshots, readFromB, writeToA,
  type CapParams, type CapState,
} from './cap';

const NODE_A = { x: 60, y: 46, w: 150, h: 40 };
const NODE_B = { x: 430, y: 46, w: 150, h: 40 };
const A_OUT: Pt = { x: 210, y: 66 };
const B_IN: Pt = { x: 430, y: 66 };

export default function CapTheorem() {
  const [partition, setPartition] = useState<string>('healthy');
  const [mode, setMode] = useState<string>('AP');
  const [scenario, setScenario] = useState<string>('bank');
  const params: CapParams = {
    partitioned: partition === 'partitioned',
    mode: mode as CapParams['mode'],
    scenario: scenario as CapParams['scenario'],
  };
  const snapshots = useMemo(() => capSnapshots(params), [partition, mode, scenario]);
  const unit = params.scenario === 'bank' ? '₹' : '♥';

  return (
    <div>
      <div className="playground-controls">
        <OptionRow label="network" options={['healthy', 'partitioned']} value={partition} onChange={setPartition} />
        <OptionRow label="system chooses" options={['CP', 'AP']} value={mode} onChange={setMode} />
        <OptionRow label="scenario" options={['bank', 'likes']} value={scenario} onChange={setScenario} />
      </div>
      <Simulation
        spec={CAP_SPEC}
        params={params}
        snapshots={snapshots}
        ariaLabel="CAP theorem simulation"
        render={(s: CapState, api) => (
          <div className="sim">
            {!api.snapshot && (
              <div className="sim-actions">
                <button
                  className="is-primary"
                  onClick={() => {
                    api.dispatch((st) => writeToA(st, params));
                    api.play();
                  }}
                >
                  Write to A (+{unit}{params.scenario === 'bank' ? 100 : 1})
                </button>
                <button
                  onClick={() => {
                    api.dispatch((st) => readFromB(st, params));
                    api.play();
                  }}
                >
                  Read from B
                </button>
              </div>
            )}
            <svg className="tl-svg" viewBox="0 0 640 132" role="img" aria-label="Two database replicas and their replication link">
              <line
                className={`topo-edge${params.partitioned ? ' is-cut' : ''}`}
                x1={A_OUT.x} y1={A_OUT.y} x2={B_IN.x} y2={B_IN.y}
              />
              {params.partitioned && (
                <text className="cap-cut-label" x={320} y={56} textAnchor="middle">✂ partition</text>
              )}
              <NodeBox {...NODE_A} label={`Node A · ${unit}${s.valueA}`} status="busy" />
              <NodeBox
                {...NODE_B}
                label={`Node B · ${unit}${s.valueB}`}
                status={params.partitioned && params.mode === 'CP' ? 'down' : 'busy'}
              />
              {s.inFlight.map((r, i) => (
                <TravelDot
                  key={i}
                  from={A_OUT}
                  to={B_IN}
                  progress={(s.now - r.sentAt) / REPLICATION_MS}
                  tone="b"
                />
              ))}
              {s.queued.length > 0 && (
                <text className="topo-label" x={A_OUT.x + 8} y={94}>{s.queued.length} queued ⏸</text>
              )}
            </svg>
            <div className="sim-readout">
              <span>A <strong>{unit}{s.valueA}</strong></span>
              <span>B <strong>{unit}{s.valueB}</strong></span>
              <span>rejected <strong>{s.rejected}</strong></span>
            </div>
            <div className="el-console" aria-label="Operation log">
              {s.log.slice(-6).map((l, i) => (
                <div className="el-console-line" key={i}>{l}</div>
              ))}
            </div>
            {params.partitioned && (
              <p className="sim-note">
                {params.mode === 'AP'
                  ? `B answers instantly but may lie${params.scenario === 'bank' ? ' — catastrophic for money.' : ' — fine for likes.'}`
                  : 'Nobody gets a wrong answer, but the system says no — availability is the price.'}
              </p>
            )}
          </div>
        )}
      />
    </div>
  );
}
