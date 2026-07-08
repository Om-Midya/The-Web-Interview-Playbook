import { TICK_MS, runScript, type SimSpec } from '../lib/sim';
import type { SimSnapshot } from '../engine/Simulation';

export interface PubSubParams {
  pubsub: boolean;
}

export type Client = 0 | 1 | 2 | 3;
export type MsgHop = 'toServer' | 'bus' | 'fanout' | 'done';

export interface Message {
  id: number;
  sender: Client;
  hop: MsgHop;
  phaseStart: number;
  phaseEnd: number;
  deliveries: number[];
  missed: number[];
}

export interface PubSubState {
  now: number;
  sent: number;
  messages: Message[];
  received: [number, number, number, number];
  lastDeliveryAt: [number, number, number, number];
  missedTotal: number;
}

export const HOP_MS = 256;
const DONE_LINGER_MS = 400;

export function serverOf(c: Client): 0 | 1 {
  return c < 2 ? 0 : 1;
}

function clientsOf(server: 0 | 1): Client[] {
  return server === 0 ? [0, 1] : [2, 3];
}

export function expectedRecipients(sender: Client, pubsub: boolean): number[] {
  const local = clientsOf(serverOf(sender)).filter((c) => c !== sender);
  const remote = pubsub ? clientsOf((1 - serverOf(sender)) as 0 | 1) : [];
  return [...local, ...remote].sort((a, b) => a - b);
}

export function sendFrom(s: PubSubState, sender: Client): PubSubState {
  return {
    ...s,
    sent: s.sent + 1,
    messages: [
      ...s.messages,
      {
        id: s.sent,
        sender,
        hop: 'toServer',
        phaseStart: s.now,
        phaseEnd: s.now + HOP_MS,
        deliveries: [],
        missed: [],
      },
    ],
  };
}

export const PUBSUB_SPEC: SimSpec<PubSubState, PubSubParams> = {
  init: () => ({
    now: 0,
    sent: 0,
    messages: [],
    received: [0, 0, 0, 0],
    lastDeliveryAt: [0, 0, 0, 0],
    missedTotal: 0,
  }),
  tick(state, p) {
    const now = state.now + TICK_MS;
    const s: PubSubState = {
      ...state,
      now,
      messages: state.messages.map((m) => ({ ...m, deliveries: [...m.deliveries], missed: [...m.missed] })),
      received: [...state.received] as PubSubState['received'],
      lastDeliveryAt: [...state.lastDeliveryAt] as PubSubState['lastDeliveryAt'],
    };
    const deliver = (m: Message, clients: Client[]) => {
      for (const c of clients) {
        if (c === m.sender) continue;
        s.received[c] += 1;
        s.lastDeliveryAt[c] = now;
        m.deliveries.push(c);
      }
    };
    for (const m of s.messages) {
      if (m.hop === 'done' || now < m.phaseEnd) continue;
      if (m.hop === 'toServer') {
        deliver(m, clientsOf(serverOf(m.sender)));
        if (p.pubsub) {
          m.hop = 'bus';
          m.phaseStart = now;
          m.phaseEnd = now + HOP_MS;
        } else {
          m.missed = clientsOf((1 - serverOf(m.sender)) as 0 | 1);
          s.missedTotal += m.missed.length;
          m.hop = 'done';
          m.phaseStart = now;
          m.phaseEnd = now + DONE_LINGER_MS;
        }
      } else if (m.hop === 'bus') {
        m.hop = 'fanout';
        m.phaseStart = now;
        m.phaseEnd = now + HOP_MS;
      } else if (m.hop === 'fanout') {
        deliver(m, clientsOf((1 - serverOf(m.sender)) as 0 | 1));
        m.hop = 'done';
        m.phaseStart = now;
        m.phaseEnd = now + DONE_LINGER_MS;
      }
    }
    s.messages = s.messages.filter((m) => m.hop !== 'done' || now < m.phaseEnd);
    return s;
  },
};

export function pubsubSnapshots(p: PubSubParams): SimSnapshot<PubSubState>[] {
  const ev = [{ atTick: 0, apply: (st: PubSubState) => sendFrom(st, 0) }];
  const at = (n: number) => runScript(PUBSUB_SPEC, p, n, ev);
  const final = at(80);
  const reached = expectedRecipients(0, p.pubsub);
  return [
    { atTick: 8, events: ev, caption: 'Client A (on server 1) sends a message.' },
    { atTick: 20, events: ev, caption: p.pubsub
      ? 'Server 1 delivers to its local client B — and publishes to the Redis bus.'
      : 'Server 1 delivers to its local client B. It has no idea clients C and D exist.' },
    { atTick: 45, events: ev, caption: p.pubsub
      ? 'The bus fans out to server 2, which delivers to C and D.'
      : `C and D never receive it — ${final.missedTotal} missed deliveries.` },
    { atTick: 80, events: ev, caption: `Final: ${reached.length} of 3 other clients received A's message${p.pubsub ? ' — the bus makes two servers feel like one.' : '.'}` },
  ];
}
