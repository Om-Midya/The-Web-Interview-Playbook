import { useMemo, useState } from 'react';
import Simulation from '../engine/Simulation';
import { OptionRow, Slider } from '../engine/PlaygroundFrame';
import { Edge, NodeBox, QueueBadge, TravelDot, type Pt } from '../engine/topo-svg';
import { LB_SPEC, lbSnapshots, type LbParams, type LbRequest, type LbState } from './loadbalancer';

const CLIENT_Y = [18, 64, 110];
const SERVER_Y = [14, 63, 112];
const CLIENTS: Pt[] = CLIENT_Y.map((y) => ({ x: 80, y: y + 13 }));
const LB_IN: Pt = { x: 236, y: 83 };
const LB_OUT: Pt = { x: 324, y: 83 };
const SERVERS: Pt[] = SERVER_Y.map((y) => ({ x: 472, y: y + 15 }));
const TONES = ['a', 'b', 'c'] as const;

function progress(r: LbRequest, now: number): number {
  const span = r.phaseEnd - r.phaseStart;
  if (span <= 0) return 1;
  const t = (now - r.phaseStart) / span;
  return t < 0 ? 0 : t > 1 ? 1 : t;
}

export default function LoadBalancer() {
  const [algorithm, setAlgorithm] = useState<string>('round-robin');
  const [slow, setSlow] = useState<string>('off');
  const [rate, setRate] = useState(3);
  const params: LbParams = {
    algorithm: algorithm as LbParams['algorithm'],
    slowServer: slow === 'on',
    ratePerSec: rate,
  };
  const snapshots = useMemo(() => lbSnapshots(params), [algorithm, slow, rate]);

  return (
    <div>
      <div className="playground-controls">
        <OptionRow label="algorithm" options={['round-robin', 'least-connections', 'ip-hash']} value={algorithm} onChange={setAlgorithm} />
        <OptionRow label="server 2 is slow (3×)" options={['off', 'on']} value={slow} onChange={setSlow} />
        <Slider label="traffic" min={1} max={6} value={rate} onChange={setRate} unit="/s" />
      </div>
      <Simulation
        spec={LB_SPEC}
        params={params}
        snapshots={snapshots}
        ariaLabel="Load balancer simulation"
        render={(s: LbState) => (
          <div className="sim">
            <svg className="tl-svg" viewBox="0 0 640 156" role="img" aria-label="Clients, load balancer, and three servers">
              {CLIENTS.map((c, i) => <Edge key={`ce${i}`} from={c} to={LB_IN} />)}
              {SERVERS.map((sv, i) => <Edge key={`se${i}`} from={LB_OUT} to={sv} />)}
              {CLIENT_Y.map((y, i) => (
                <NodeBox key={`c${i}`} x={16} y={y} w={64} h={26} label={`client ${'ABC'[i]}`} status="idle" />
              ))}
              <NodeBox x={236} y={66} w={88} h={34} label="LB" status="busy" />
              {SERVER_Y.map((y, i) => (
                <NodeBox
                  key={`s${i}`}
                  x={472}
                  y={y}
                  w={120}
                  h={30}
                  label={`server ${i + 1}${params.slowServer && i === 1 ? ' (slow)' : ''}`}
                  status={s.serving[i] !== null ? 'busy' : 'idle'}
                />
              ))}
              {SERVER_Y.map((y, i) => (
                <QueueBadge key={`q${i}`} x={458} y={y + 15} count={s.queues[i].length} />
              ))}
              {s.requests.map((r) => {
                if (r.phase === 'toLb') {
                  return <TravelDot key={r.id} from={CLIENTS[r.client]} to={LB_IN} progress={progress(r, s.now)} tone={TONES[r.client]} />;
                }
                if (r.phase === 'toServer' && r.server !== null) {
                  return <TravelDot key={r.id} from={LB_OUT} to={SERVERS[r.server]} progress={progress(r, s.now)} tone={TONES[r.client]} />;
                }
                return null;
              })}
            </svg>
            <div className="sim-readout">
              {[0, 1, 2].map((i) => (
                <span key={i}>
                  server {i + 1}: handled <strong>{s.handled[i]}</strong> · queued <strong>{s.queues[i].length}</strong>
                </span>
              ))}
            </div>
            {params.slowServer && params.algorithm === 'round-robin' && s.queues[1].length >= 3 && (
              <p className="sim-note">
                Round-robin keeps feeding the slow server — it can't see the pile-up. Least-connections can.
              </p>
            )}
          </div>
        )}
      />
    </div>
  );
}
