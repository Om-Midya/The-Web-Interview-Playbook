import { useMemo, useState } from 'react';
import Simulation from '../engine/Simulation';
import { OptionRow, Slider } from '../engine/PlaygroundFrame';
import { Edge, NodeBox, TravelDot, type Pt } from '../engine/topo-svg';
import { CACHE_SPEC, cacheSnapshots, type CacheParams, type CacheRequest, type CacheState } from './cache';

const LAYER_X = [20, 180, 340, 500];
const LAYER_LABELS = ['Browser', 'CDN', 'Redis', 'DB'];
const NODE_Y = 60;
const NODE_W = 120;
const NODE_H = 34;
const ANCHOR_Y = NODE_Y + NODE_H / 2;

function anchor(layer: number, side: 'left' | 'right'): Pt {
  return { x: LAYER_X[layer] + (side === 'left' ? 0 : NODE_W), y: ANCHOR_Y };
}

function dotPosition(r: CacheRequest, now: number): { from: Pt; to: Pt; t: number } | null {
  if (!r.moving) return null;
  const span = r.phaseEnd - r.phaseStart;
  const t = span <= 0 ? 1 : Math.min(1, Math.max(0, (now - r.phaseStart) / span));
  const prev = r.dir === 'down' ? r.layer - 1 : r.layer + 1;
  return r.dir === 'down'
    ? { from: anchor(prev, 'right'), to: anchor(r.layer, 'left'), t }
    : { from: anchor(prev, 'left'), to: anchor(r.layer, 'right'), t };
}

export default function CacheFlow() {
  const [ttlMs, setTtlMs] = useState(4000);
  const [rate, setRate] = useState(2);
  const [herd, setHerd] = useState<string>('off');
  const params: CacheParams = { ttlMs, ratePerSec: rate, herd: herd === 'on' };
  const snapshots = useMemo(() => cacheSnapshots(params), [ttlMs, rate, herd]);

  return (
    <div>
      <div className="playground-controls">
        <Slider label="TTL" min={1000} max={8000} value={ttlMs} onChange={setTtlMs} unit="ms" />
        <Slider label="traffic" min={1} max={6} value={rate} onChange={setRate} unit="/s" />
        <OptionRow label="thundering herd" options={['off', 'on']} value={herd} onChange={setHerd} />
      </div>
      <Simulation
        spec={CACHE_SPEC}
        params={params}
        snapshots={snapshots}
        ariaLabel="Cache flow simulation"
        render={(s: CacheState) => (
          <div className="sim">
            <svg className="tl-svg" viewBox="0 0 640 128" role="img" aria-label="Request flow through browser, CDN, Redis, and database">
              {[0, 1, 2].map((k) => (
                <Edge key={k} from={anchor(k, 'right')} to={anchor(k + 1, 'left')} />
              ))}
              {LAYER_X.map((x, k) => (
                <NodeBox
                  key={k}
                  x={x}
                  y={NODE_Y}
                  w={NODE_W}
                  h={NODE_H}
                  label={k < 3 ? `${LAYER_LABELS[k]}${s.fresh[k] ? ' ✓' : ''}` : `DB · ${s.dbQueries}`}
                  status={k < 3 ? (s.fresh[k] ? 'busy' : 'idle') : 'busy'}
                />
              ))}
              {s.requests.map((r) => {
                const d = dotPosition(r, s.now);
                if (!d) return null;
                const tone = r.dir === 'up' ? (r.resolved === 'db' ? 'warn' : 'ok') : 'a';
                return <TravelDot key={r.id} from={d.from} to={d.to} progress={d.t} tone={tone} />;
              })}
            </svg>
            <div className="sim-readout">
              <span>hits — browser <strong>{s.hits[0]}</strong> · CDN <strong>{s.hits[1]}</strong> · Redis <strong>{s.hits[2]}</strong></span>
              <span>DB queries <strong>{s.dbQueries}</strong></span>
              <span>total <strong>{s.total}</strong></span>
            </div>
            {params.herd && (
              <p className="sim-note">
                Real systems soften the herd with request coalescing, locks, or stale-while-revalidate — one request rebuilds, the rest wait.
              </p>
            )}
          </div>
        )}
      />
    </div>
  );
}
