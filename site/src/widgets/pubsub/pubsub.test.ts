import { describe, it, expect } from 'vitest';
import { runScript } from '../lib/sim';
import { PUBSUB_SPEC, expectedRecipients, pubsubSnapshots, sendFrom, type PubSubParams } from './pubsub';

const send = (sender: 0 | 1 | 2 | 3, p: PubSubParams, ticks = 80) =>
  runScript(PUBSUB_SPEC, p, ticks, [{ atTick: 0, apply: (s) => sendFrom(s, sender) }]);

describe('expectedRecipients', () => {
  it('covers all senders in both modes', () => {
    expect(expectedRecipients(0, false)).toEqual([1]);
    expect(expectedRecipients(1, false)).toEqual([0]);
    expect(expectedRecipients(2, false)).toEqual([3]);
    expect(expectedRecipients(3, false)).toEqual([2]);
    expect(expectedRecipients(0, true)).toEqual([1, 2, 3]);
    expect(expectedRecipients(2, true)).toEqual([0, 1, 3]);
  });
});

describe('delivery', () => {
  it("without pub/sub, the other server's clients miss the message", () => {
    const s = send(0, { pubsub: false });
    expect(s.received).toEqual([0, 1, 0, 0]);
    expect(s.missedTotal).toBe(2);
  });
  it('with pub/sub, everyone except the sender receives', () => {
    const s = send(0, { pubsub: true });
    expect(s.received).toEqual([0, 1, 1, 1]);
    expect(s.missedTotal).toBe(0);
  });
  it('messages from different senders accumulate counters', () => {
    const s = runScript(PUBSUB_SPEC, { pubsub: true }, 160, [
      { atTick: 0, apply: (st) => sendFrom(st, 0) },
      { atTick: 80, apply: (st) => sendFrom(st, 2) },
    ]);
    expect(s.received).toEqual([1, 2, 1, 2]);
  });
});

describe('snapshots', () => {
  it('captions match expectedRecipients for the current mode', () => {
    for (const pubsub of [false, true]) {
      const snaps = pubsubSnapshots({ pubsub });
      const last = snaps[snaps.length - 1].caption;
      expect(last).toContain(String(expectedRecipients(0, pubsub).length));
    }
  });
});
