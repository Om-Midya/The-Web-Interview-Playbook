import { describe, it, expect } from 'vitest';
import { runScript } from '../lib/sim';
import {
  NPLUSONE_SPEC,
  elapsedMs,
  firedCount,
  nplusoneSnapshots,
  planQueries,
  startRun,
  type NPlusOneParams,
} from './nplusone';

const P = (over: Partial<NPlusOneParams> = {}): NPlusOneParams => ({
  rows: 4,
  latencyMs: 50,
  mode: 'lazy',
  ...over,
});

describe('planQueries', () => {
  it('lazy: 1 parent + N strictly sequential children', () => {
    const qs = planQueries(P());
    expect(qs).toHaveLength(5);
    expect(qs[0]).toMatchObject({ start: 0, end: 50 });
    for (let k = 1; k < qs.length; k++) {
      expect(qs[k].start).toBe(qs[k - 1].end); // the sequential invariant
      expect(qs[k].end - qs[k].start).toBe(50);
    }
    expect(qs[4].end).toBe(250); // (N+1) × latency
  });
  it('join: one query at 1.5× latency', () => {
    const qs = planQueries(P({ mode: 'join' }));
    expect(qs).toHaveLength(1);
    expect(qs[0].end).toBe(75);
  });
});

describe('run lifecycle', () => {
  it('a lazy run completes and records its summary once', () => {
    const p = P();
    const s = runScript(NPLUSONE_SPEC, p, 20, [{ atTick: 0, apply: (st) => startRun(st, p) }]);
    expect(s.lastRun.lazy).toEqual({ count: 5, totalMs: 250, rows: 4, latencyMs: 50 });
    expect(firedCount(s)).toBe(5);
  });
  it('running both modes keeps both summaries', () => {
    const p = P();
    const pJoin = P({ mode: 'join' });
    const s = runScript(NPLUSONE_SPEC, p, 40, [
      { atTick: 0, apply: (st) => startRun(st, p) },
      { atTick: 20, apply: (st) => startRun(st, pJoin) },
    ]);
    expect(s.lastRun.lazy).toEqual({ count: 5, totalMs: 250, rows: 4, latencyMs: 50 });
    expect(s.lastRun.join).toEqual({ count: 1, totalMs: 75, rows: 4, latencyMs: 50 });
  });
  it('a run at one latency does not get compared against a run at a different latency', () => {
    // Guards against the cross-parameter comparison lie: lastRun must record
    // the params each run actually executed under, not the current controls.
    const pLazy = P({ latencyMs: 50 });
    const pJoin = P({ mode: 'join', latencyMs: 10 });
    const s = runScript(NPLUSONE_SPEC, pLazy, 40, [
      { atTick: 0, apply: (st) => startRun(st, pLazy) },
      { atTick: 20, apply: (st) => startRun(st, pJoin) },
    ]);
    expect(s.lastRun.lazy?.latencyMs).toBe(50);
    expect(s.lastRun.join?.latencyMs).toBe(10);
    expect(s.lastRun.lazy?.latencyMs).not.toBe(s.lastRun.join?.latencyMs);
  });
  it('elapsed and fired counts derive mid-run', () => {
    const p = P();
    const s = runScript(NPLUSONE_SPEC, p, 8, [{ atTick: 0, apply: (st) => startRun(st, p) }]);
    expect(elapsedMs(s)).toBe(128);
    expect(firedCount(s)).toBe(3); // parent (0) + children starting at 50, 100
  });
});

describe('snapshots', () => {
  it('the comparison caption embeds both computed summaries', () => {
    const snaps = nplusoneSnapshots(P());
    const last = snaps[snaps.length - 1].caption;
    expect(last).toContain('5 queries');
    expect(last).toContain('250');
    expect(last).toContain('1 query');
    expect(last).toContain('75');
  });
});
