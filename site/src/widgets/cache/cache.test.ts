import { describe, it, expect } from 'vitest';
import { runTicks } from '../lib/sim';
import { CACHE_SPEC, HERD_SIZE, burstTimes, cacheSnapshots, type CacheParams } from './cache';

const P = (over: Partial<CacheParams> = {}): CacheParams => ({
  ttlMs: 3000,
  ratePerSec: 0.5,
  herd: false,
  ...over,
});

describe('burstTimes', () => {
  it('herd = 5 simultaneous, no herd = none', () => {
    expect(burstTimes(1660, true)).toEqual([1660, 1660, 1660, 1660, 1660]);
    expect(burstTimes(1660, false)).toEqual([]);
  });
});

describe('cache flow', () => {
  it('a cold request pierces to the DB and repopulates every layer', () => {
    const s = runTicks(CACHE_SPEC, P(), 100); // 1600ms: round trip done
    expect(s.dbQueries).toBe(1);
    expect(s.total).toBe(1);
    expect(s.fresh).toEqual([true, true, true]);
  });
  it('a warm request hits the browser cache', () => {
    const s = runTicks(CACHE_SPEC, P(), 150); // 2400ms: r2 at 2000 hit layer 0
    expect(s.dbQueries).toBe(1);
    expect(s.hits[0]).toBe(1);
    expect(s.total).toBe(2);
  });
  it('after TTL expiry the next request pierces again', () => {
    const s = runTicks(CACHE_SPEC, P({ ttlMs: 700 }), 200); // r2 at 2000, all stale
    expect(s.dbQueries).toBe(2);
    expect(s.hits).toEqual([0, 0, 0]);
  });
  it('the herd costs exactly HERD_SIZE - 1 extra DB queries vs the same run without it', () => {
    const plain = runTicks(CACHE_SPEC, P({ ttlMs: 700 }), 200);
    const herd = runTicks(CACHE_SPEC, P({ ttlMs: 700, herd: true }), 200);
    expect(herd.dbQueries - plain.dbQueries).toBe(HERD_SIZE - 1);
  });
  it('accounting: every resolved request is a hit or a DB query', () => {
    for (const herd of [false, true]) {
      const s = runTicks(CACHE_SPEC, P({ ttlMs: 700, herd }), 200);
      expect(s.hits[0] + s.hits[1] + s.hits[2] + s.dbQueries).toBe(s.total);
    }
  });
});

describe('snapshots', () => {
  it('captions embed the computed DB query count', () => {
    const p = P({ ttlMs: 700, herd: true });
    const snaps = cacheSnapshots(p);
    expect(snaps).toHaveLength(4);
    const last = runTicks(CACHE_SPEC, p, snaps[3].atTick);
    expect(snaps[3].caption).toContain(String(last.dbQueries));
  });
});
