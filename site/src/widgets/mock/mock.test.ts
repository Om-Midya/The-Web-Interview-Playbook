import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MOCKS_KEY, loadAttempts, radarPoints, saveAttempts, totalScore, verdictFor, type Attempt } from './mock';

function stubStorage() {
  const map = new Map<string, string>();
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
    removeItem: (k: string) => void map.delete(k),
  });
  return map;
}

const attempt = (over: Partial<Attempt> = {}): Attempt => ({
  id: 'a1', roundSlug: 'backend-round', date: 1000, scores: { 1: 4, 2: 3 }, total: 7, ...over,
});

describe('scoring', () => {
  it('totals scores', () => {
    expect(totalScore({ 1: 4, 2: 3, 3: 5 })).toBe(12);
    expect(totalScore({})).toBe(0);
  });
  it('verdict bands scale with dimension count', () => {
    expect(verdictFor(40, 10)).toContain('Strong');
    expect(verdictFor(30, 10)).toContain('Good');
    expect(verdictFor(20, 10)).toContain('Below');
    expect(verdictFor(10, 10)).toContain('drilling');
    expect(verdictFor(0, 0)).toBe('');
  });
  it('partial scoring cannot inflate the verdict when scaled by the full rubric', () => {
    // one 5 out of a 5-dimension rubric averages 1.0, not 5.0
    expect(verdictFor(5, 5)).toContain('drilling');
  });
});

describe('radarPoints', () => {
  it('produces one point per axis, first at 12 o\'clock', () => {
    const pts = radarPoints([5, 5, 5, 5], 5, 100, 100, 80).split(' ');
    expect(pts).toHaveLength(4);
    const [x0, y0] = pts[0].split(',').map(Number);
    expect(x0).toBeCloseTo(100, 0);
    expect(y0).toBeCloseTo(20, 0); // cy - r
  });
  it('zero scores collapse to the center; empty input yields empty string', () => {
    const pts = radarPoints([0, 0, 0], 5, 100, 100, 80).split(' ');
    for (const p of pts) {
      const [x, y] = p.split(',').map(Number);
      expect(x).toBeCloseTo(100, 0);
      expect(y).toBeCloseTo(100, 0);
    }
    expect(radarPoints([], 5, 100, 100, 80)).toBe('');
  });
});

describe('attempt storage', () => {
  beforeEach(() => vi.unstubAllGlobals());
  it('round-trips attempts', () => {
    stubStorage();
    saveAttempts([attempt()]);
    expect(loadAttempts()).toHaveLength(1);
    expect(loadAttempts()[0].total).toBe(7);
  });
  it('fails soft on corrupted or missing storage', () => {
    const map = stubStorage();
    map.set(MOCKS_KEY, '[[[');
    expect(loadAttempts()).toEqual([]);
    vi.unstubAllGlobals();
    expect(loadAttempts()).toEqual([]);
    expect(() => saveAttempts([attempt()])).not.toThrow();
  });
});
