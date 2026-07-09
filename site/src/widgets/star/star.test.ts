import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { BehavioralQuestion } from '../../lib/prep';
import { STAR_PARTS, STARS_KEY, coverage, exportStory, loadStories, saveStories, wordCount, type Story } from './star';

const QS: BehavioralQuestion[] = [
  { n: 1, text: 'Teamwork?' },
  { n: 2, text: 'Deadline?' },
  { n: 3, text: 'Conflict?' },
];

const story = (over: Partial<Story> = {}): Story => ({
  id: 'x1', title: 'Migration crunch', s: 'ctx', t: 'task', a: 'did things', r: 'won',
  questions: [1, 3], updatedAt: 0, ...over,
});

function stubStorage() {
  const map = new Map<string, string>();
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
    removeItem: (k: string) => void map.delete(k),
  });
  return map;
}

describe('star logic', () => {
  it('STAR_PARTS carry the corpus budgets and sum to 75s', () => {
    expect(STAR_PARTS.map((p) => p.seconds)).toEqual([10, 10, 40, 15]);
    expect(STAR_PARTS.reduce((s, p) => s + p.seconds, 0)).toBe(75);
  });
  it('wordCount handles empties and whitespace', () => {
    expect(wordCount('')).toBe(0);
    expect(wordCount('   ')).toBe(0);
    expect(wordCount('one two\n three')).toBe(3);
  });
  it('coverage unions across stories', () => {
    const { covered, uncovered } = coverage([story(), story({ id: 'x2', questions: [2] })], QS);
    expect(covered).toEqual([1, 2, 3]);
    expect(uncovered).toEqual([]);
    expect(coverage([], QS).uncovered).toEqual([1, 2, 3]);
  });
  it('exportStory contains every part and mapped question text', () => {
    const text = exportStory(story(), QS);
    expect(text).toContain('Migration crunch');
    expect(text).toContain('SITUATION (10s):');
    expect(text).toContain('ACTION (40s):');
    expect(text).toContain('- Teamwork?');
    expect(text).toContain('- Conflict?');
    expect(text).not.toContain('Deadline?');
  });
});

describe('star storage', () => {
  beforeEach(() => vi.unstubAllGlobals());
  it('round-trips through localStorage', () => {
    stubStorage();
    saveStories([story()]);
    expect(loadStories()).toHaveLength(1);
    expect(loadStories()[0].title).toBe('Migration crunch');
  });
  it('fails soft on corrupted or missing storage', () => {
    const map = stubStorage();
    map.set(STARS_KEY, '{not json');
    expect(loadStories()).toEqual([]);
    vi.unstubAllGlobals(); // no localStorage global at all (node)
    expect(loadStories()).toEqual([]);
    expect(() => saveStories([story()])).not.toThrow();
  });
});
