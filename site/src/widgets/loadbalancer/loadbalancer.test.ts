import { describe, it, expect } from 'vitest';
import { runTicks } from '../lib/sim';
import { LB_SPEC, assignServer, lbSnapshots, type LbParams, type LbState } from './loadbalancer';

const P = (over: Partial<LbParams> = {}): LbParams => ({
  algorithm: 'round-robin',
  slowServer: false,
  ratePerSec: 3,
  ...over,
});

function bareState(over: Partial<LbState> = {}): LbState {
  return { ...LB_SPEC.init(P()), ...over };
}

describe('assignServer', () => {
  it('round-robin follows the counter', () => {
    const p = P();
    expect(assignServer(bareState({ rrCounter: 0 }), p, 0)).toBe(0);
    expect(assignServer(bareState({ rrCounter: 1 }), p, 0)).toBe(1);
    expect(assignServer(bareState({ rrCounter: 2 }), p, 0)).toBe(2);
    expect(assignServer(bareState({ rrCounter: 3 }), p, 0)).toBe(0);
  });
  it('least-connections picks the emptiest server, ties to lowest index', () => {
    const p = P({ algorithm: 'least-connections' });
    const busy = bareState({ serving: [7, null, 9], queues: [[1], [], [2, 3]] });
    expect(assignServer(busy, p, 0)).toBe(1);
    expect(assignServer(bareState(), p, 2)).toBe(0); // all idle → lowest index
  });
  it('ip-hash is stable per client', () => {
    const p = P({ algorithm: 'ip-hash' });
    for (const c of [0, 1, 2] as const) {
      expect(assignServer(bareState(), p, c)).toBe(c % 3);
      expect(assignServer(bareState({ rrCounter: 99 }), p, c)).toBe(c % 3);
    }
  });
});

describe('simulation', () => {
  it('is deterministic: same params → identical state', () => {
    const a = runTicks(LB_SPEC, P(), 300);
    const b = runTicks(LB_SPEC, P(), 300);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    expect(a.spawned).toBeGreaterThan(10);
  });
  it('round-robin drowns the slow server: its queue grows while neighbors stay clear', () => {
    const s = runTicks(LB_SPEC, P({ slowServer: true }), 600);
    expect(s.queues[1].length).toBeGreaterThan(s.queues[0].length);
    expect(s.queues[1].length).toBeGreaterThan(s.queues[2].length);
  });
  it('least-connections routes around the slow server', () => {
    const s = runTicks(LB_SPEC, P({ slowServer: true, algorithm: 'least-connections' }), 600);
    expect(s.queues[1].length).toBeLessThanOrEqual(1);
  });
});

describe('snapshots', () => {
  it('captions embed computed queue and handled counts', () => {
    const p = P({ slowServer: true });
    const snaps = lbSnapshots(p);
    expect(snaps).toHaveLength(4);
    const last = runTicks(LB_SPEC, p, snaps[3].atTick);
    expect(snaps[3].caption).toContain(`[${last.handled.join(', ')}]`);
  });
});
