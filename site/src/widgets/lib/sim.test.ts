import { describe, it, expect } from 'vitest';
import { TICK_MS, mulberry32, runScript, runTicks, type SimSpec } from './sim';

interface CounterState { now: number; count: number }
const COUNTER: SimSpec<CounterState, { inc: number }> = {
  init: () => ({ now: 0, count: 0 }),
  tick: (s, p) => ({ now: s.now + TICK_MS, count: s.count + p.inc }),
};

describe('mulberry32', () => {
  it('same seed produces the same sequence', () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    const seqA = [a(), a(), a(), a()];
    const seqB = [b(), b(), b(), b()];
    expect(seqA).toEqual(seqB);
  });
  it('different seeds diverge', () => {
    expect(mulberry32(1)()).not.toBe(mulberry32(2)());
  });
  it('outputs stay in [0, 1)', () => {
    const r = mulberry32(7);
    for (let i = 0; i < 100; i++) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe('runTicks / runScript', () => {
  it('runTicks advances exactly n ticks', () => {
    const s = runTicks(COUNTER, { inc: 1 }, 10);
    expect(s.now).toBe(160);
    expect(s.count).toBe(10);
  });
  it('an event at atTick k applies before tick k runs', () => {
    const s = runScript(COUNTER, { inc: 1 }, 4, [
      { atTick: 3, apply: (st) => ({ ...st, count: 100 }) },
    ]);
    // ticks 0,1,2 add 3; event sets 100 before tick 3 adds 1
    expect(s.count).toBe(101);
  });
  it('events apply in ascending atTick order regardless of input order', () => {
    const s = runScript(COUNTER, { inc: 0 }, 3, [
      { atTick: 2, apply: (st) => ({ ...st, count: st.count * 2 }) },
      { atTick: 0, apply: (st) => ({ ...st, count: st.count + 5 }) },
    ]);
    expect(s.count).toBe(10); // (0 + 5) * 2, not (0 * 2) + 5
  });
  it('an event at atTick 0 applies before the first tick', () => {
    const s = runScript(COUNTER, { inc: 1 }, 1, [
      { atTick: 0, apply: (st) => ({ ...st, count: 50 }) },
    ]);
    expect(s.count).toBe(51);
  });
});
