import { useMemo, useState } from 'react';
import Simulation from '../engine/Simulation';
import { OptionRow } from '../engine/PlaygroundFrame';
import { Edge, NodeBox, TravelDot, type Pt } from '../engine/topo-svg';
import { PUBSUB_SPEC, pubsubSnapshots, sendFrom, serverOf, type Client, type Message, type PubSubState } from './pubsub';

const CLIENT_POS: { x: number; y: number }[] = [
  { x: 16, y: 16 }, { x: 16, y: 116 }, { x: 560, y: 16 }, { x: 560, y: 116 },
];
const CLIENT_W = 64;
const CLIENT_H = 26;
const SERVER0 = { x: 160, y: 58, w: 88, h: 34 };
const BUS = { x: 296, y: 58, w: 88, h: 34 };
const SERVER1 = { x: 436, y: 58, w: 88, h: 34 };
const NAMES = ['A', 'B', 'C', 'D'];

const clientAnchor = (c: Client): Pt => ({
  x: CLIENT_POS[c].x + (c < 2 ? CLIENT_W : 0),
  y: CLIENT_POS[c].y + CLIENT_H / 2,
});
const boxAnchor = (b: { x: number; y: number; w: number; h: number }, side: 'left' | 'right'): Pt => ({
  x: b.x + (side === 'left' ? 0 : b.w),
  y: b.y + b.h / 2,
});

function dotFor(m: Message, now: number): { from: Pt; to: Pt; t: number } | null {
  const span = m.phaseEnd - m.phaseStart;
  const t = span <= 0 ? 1 : Math.min(1, Math.max(0, (now - m.phaseStart) / span));
  const srv = serverOf(m.sender) === 0 ? SERVER0 : SERVER1;
  const other = serverOf(m.sender) === 0 ? SERVER1 : SERVER0;
  if (m.hop === 'toServer') {
    return { from: clientAnchor(m.sender), to: boxAnchor(srv, m.sender < 2 ? 'left' : 'right'), t };
  }
  if (m.hop === 'bus') {
    return { from: boxAnchor(srv, serverOf(m.sender) === 0 ? 'right' : 'left'), to: boxAnchor(BUS, serverOf(m.sender) === 0 ? 'left' : 'right'), t };
  }
  if (m.hop === 'fanout') {
    return { from: boxAnchor(BUS, serverOf(m.sender) === 0 ? 'right' : 'left'), to: boxAnchor(other, serverOf(m.sender) === 0 ? 'left' : 'right'), t };
  }
  return null;
}

export default function PubSub() {
  const [pubsub, setPubsub] = useState<string>('off');
  const params = { pubsub: pubsub === 'on' };
  const snapshots = useMemo(() => pubsubSnapshots(params), [pubsub]);

  return (
    <div>
      <div className="playground-controls">
        <OptionRow label="Redis pub/sub bus" options={['off', 'on']} value={pubsub} onChange={setPubsub} />
      </div>
      <Simulation
        spec={PUBSUB_SPEC}
        params={params}
        snapshots={snapshots}
        ariaLabel="WebSocket pub/sub simulation"
        render={(s: PubSubState, api) => {
          const flashing = (c: Client) => s.lastDeliveryAt[c] > 0 && s.now - s.lastDeliveryAt[c] < 400;
          return (
            <div className="sim">
              {!api.snapshot && (
                <div className="sim-actions">
                  {([0, 1, 2, 3] as const).map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        api.dispatch((st) => sendFrom(st, c));
                        api.play();
                      }}
                    >
                      Send as {NAMES[c]}
                    </button>
                  ))}
                </div>
              )}
              <svg className="tl-svg" viewBox="0 0 640 158" role="img" aria-label="Two websocket servers, four clients, and a Redis bus">
                <Edge from={clientAnchor(0)} to={boxAnchor(SERVER0, 'left')} />
                <Edge from={clientAnchor(1)} to={boxAnchor(SERVER0, 'left')} />
                <Edge from={boxAnchor(SERVER0, 'right')} to={boxAnchor(BUS, 'left')} />
                <Edge from={boxAnchor(BUS, 'right')} to={boxAnchor(SERVER1, 'left')} />
                <Edge from={clientAnchor(2)} to={boxAnchor(SERVER1, 'right')} />
                <Edge from={clientAnchor(3)} to={boxAnchor(SERVER1, 'right')} />
                {([0, 1, 2, 3] as const).map((c) => (
                  <NodeBox
                    key={c}
                    x={CLIENT_POS[c].x}
                    y={CLIENT_POS[c].y}
                    w={CLIENT_W}
                    h={CLIENT_H}
                    label={`${NAMES[c]} · ${s.received[c]}`}
                    status={flashing(c) ? 'busy' : 'idle'}
                  />
                ))}
                <NodeBox {...SERVER0} label="server 1" status="busy" />
                <NodeBox {...BUS} label="Redis bus" status={params.pubsub ? 'busy' : 'down'} />
                <NodeBox {...SERVER1} label="server 2" status="busy" />
                {s.messages.map((m) => {
                  const d = dotFor(m, s.now);
                  if (!d) return null;
                  return <TravelDot key={m.id} from={d.from} to={d.to} progress={d.t} tone="b" />;
                })}
              </svg>
              <div className="sim-readout">
                <span>received — {NAMES.map((n, c) => `${n}: ${s.received[c]}`).join(' · ')}</span>
                <span>missed deliveries <strong>{s.missedTotal}</strong></span>
              </div>
              {!params.pubsub && s.missedTotal > 0 && (
                <p className="sim-note">
                  Clients on the other server never got the message — each server only knows its own sockets. The Redis bus is how scaled WebSocket servers share fan-out.
                </p>
              )}
            </div>
          );
        }}
      />
    </div>
  );
}
