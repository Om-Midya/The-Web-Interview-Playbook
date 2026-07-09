import { describe, expect, it } from 'vitest';
import { runScript } from '../lib/sim';
import {
  CAP_SPEC, REPLICATION_MS, WRITE_AMOUNT, capSnapshots, readFromB, writeToA,
  type CapParams, type CapState,
} from './cap';

const P = (over: Partial<CapParams> = {}): CapParams => ({
  partitioned: false,
  mode: 'AP',
  scenario: 'bank',
  ...over,
});

describe('replication', () => {
  it('a healthy write reaches B after exactly REPLICATION_MS', () => {
    const p = P();
    const s = runScript(CAP_SPEC, p, 35, [{ atTick: 0, apply: (st) => writeToA(st, p) }]);
    expect(s.valueA).toBe(100);
    expect(s.valueB).toBe(100);   // 35 ticks = 560ms > 480
    expect(s.inFlight).toHaveLength(0);
  });
  it('scenario amounts: bank +100, likes +1', () => {
    expect(WRITE_AMOUNT.bank).toBe(100);
    expect(WRITE_AMOUNT.likes).toBe(1);
  });
});

describe('partition', () => {
  it('AP: the write lands on A, diverges from B, and reads on B are stale', () => {
    const p = P({ partitioned: true });
    const s = runScript(CAP_SPEC, p, 50, [
      { atTick: 0, apply: (st) => writeToA(st, p) },
      { atTick: 40, apply: (st) => readFromB(st, p) },
    ]);
    expect(s.valueA).toBe(100);
    expect(s.valueB).toBe(0);
    expect(s.queued).toHaveLength(1);
    expect(s.log.some((l) => l.includes('STALE'))).toBe(true);
  });
  it('CP: writes and reads are rejected, values never diverge', () => {
    const p = P({ partitioned: true, mode: 'CP' });
    const s = runScript(CAP_SPEC, p, 50, [
      { atTick: 0, apply: (st) => writeToA(st, p) },
      { atTick: 40, apply: (st) => readFromB(st, p) },
    ]);
    expect(s.valueA).toBe(0);
    expect(s.valueB).toBe(0);
    expect(s.rejected).toBe(2);
    expect(s.log.filter((l) => l.includes('REJECTED'))).toHaveLength(2);
  });
  it('healing drains the queue and converges', () => {
    const pPart = P({ partitioned: true });
    let s: CapState = runScript(CAP_SPEC, pPart, 10, [{ atTick: 0, apply: (st) => writeToA(st, pPart) }]);
    expect(s.valueB).toBe(0);
    const pHealed = P();
    for (let i = 0; i < 40; i++) s = CAP_SPEC.tick(s, pHealed);
    expect(s.valueB).toBe(100);
    expect(s.queued).toHaveLength(0);
    expect(s.log.some((l) => l.includes('healed'))).toBe(true);
  });
});

describe('snapshots', () => {
  it('partitioned captions branch truthfully per mode', () => {
    const cp = capSnapshots(P({ partitioned: true, mode: 'CP' }));
    const ap = capSnapshots(P({ partitioned: true, mode: 'AP' }));
    expect(cp[0].caption).toContain('REJECTED');
    expect(ap[0].caption).toContain('disagree');
    expect(ap[1].caption).toContain('stale');
  });
});
