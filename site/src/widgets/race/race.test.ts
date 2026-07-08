import { describe, it, expect } from 'vitest';
import { runScript } from '../lib/sim';
import { RACE_SPEC, raceSnapshots, startRace, type RaceParams } from './race';

const P = (over: Partial<RaceParams> = {}): RaceParams => ({ lock: false, staggerMs: 80, ...over });
const run = (p: RaceParams, ticks: number) =>
  runScript(RACE_SPEC, p, ticks, [{ atTick: 0, apply: startRace }]);

describe('double-booking race', () => {
  it('no lock: both buyers confirmed, stock oversold to -1', () => {
    const s = run(P(), 120);
    expect(s.stock).toBe(-1);
    expect(s.users[0].phase).toBe('confirmed');
    expect(s.users[1].phase).toBe('confirmed');
  });
  it('with the row lock: B blocks, reads 0, and is rejected', () => {
    const s = run(P({ lock: true }), 120);
    expect(s.stock).toBe(0);
    expect(s.users[0].phase).toBe('confirmed');
    expect(s.users[1].phase).toBe('rejected');
    expect(s.users[1].sawStock).toBe(0);
  });
  it('with the lock, B only reads after A commits', () => {
    const s = run(P({ lock: true }), 120);
    const blockedIdx = s.log.findIndex((l) => l.includes('B: blocked'));
    const readIdx = s.log.findIndex((l) => l.includes('B: SELECT'));
    expect(blockedIdx).toBeGreaterThanOrEqual(0);
    expect(readIdx).toBeGreaterThan(blockedIdx);
  });
  it('a large stagger closes the window even without a lock', () => {
    const s = run(P({ staggerMs: 1000 }), 160);
    expect(s.stock).toBe(0);
    expect(s.users[1].phase).toBe('rejected');
  });
  it('the log records what each transaction saw', () => {
    const noLock = run(P(), 120);
    expect(noLock.log).toContain('A: SELECT stock → 1');
    expect(noLock.log).toContain('B: SELECT stock → 1');
    const locked = run(P({ lock: true }), 120);
    expect(locked.log).toContain('B: SELECT stock → 0');
  });
});

describe('snapshots', () => {
  it('the final caption embeds the computed stock', () => {
    const snaps = raceSnapshots(P());
    const last = snaps[snaps.length - 1];
    expect(last.caption).toContain('-1');
  });

  it('no-lock captions stay truthful when the stagger closes the window', () => {
    const snaps = raceSnapshots(P({ staggerMs: 600 }));
    const last = snaps[snaps.length - 1].caption;
    expect(last).not.toContain('sold twice');
    expect(last).toContain('stock 0');
  });
});
