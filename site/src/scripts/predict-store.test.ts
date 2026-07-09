import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PREDICT_KEY, loadPredictions, savePrediction } from './predict-store';

function stubStorage() {
  const map = new Map<string, string>();
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
    removeItem: (k: string) => void map.delete(k),
  });
  return map;
}

describe('predict store', () => {
  beforeEach(() => vi.unstubAllGlobals());
  it('saves and merges predictions', () => {
    stubStorage();
    savePrediction('doc:0', 'false');
    savePrediction('doc:1', '"string"');
    const all = loadPredictions();
    expect(all['doc:0'].text).toBe('false');
    expect(all['doc:1'].text).toBe('"string"');
  });
  it('fails soft on corrupted or missing storage', () => {
    const map = stubStorage();
    map.set(PREDICT_KEY, 'nope[');
    expect(loadPredictions()).toEqual({});
    vi.unstubAllGlobals();
    expect(loadPredictions()).toEqual({});
    expect(() => savePrediction('k', 'v')).not.toThrow();
  });
});
