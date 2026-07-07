import { describe, it, expect } from 'vitest';
import { INITIAL_ROSTER, explain, jsxSnippet, moveFirstToEnd, removeAt } from './keys';

describe('roster ops', () => {
  it('removeAt drops exactly the given index, immutably', () => {
    const out = removeAt(INITIAL_ROSTER, 1);
    expect(out.map((p) => p.id)).toEqual(['p1', 'p3', 'p4']);
    expect(INITIAL_ROSTER).toHaveLength(4);
  });
  it('removeAt with an out-of-range index changes nothing', () => {
    expect(removeAt(INITIAL_ROSTER, 9)).toEqual(INITIAL_ROSTER);
    expect(removeAt(INITIAL_ROSTER, -1)).toEqual(INITIAL_ROSTER);
  });
  it('moveFirstToEnd rotates the list', () => {
    expect(moveFirstToEnd(INITIAL_ROSTER).map((p) => p.id)).toEqual(['p2', 'p3', 'p4', 'p1']);
  });
  it('moveFirstToEnd handles empty and single-item lists', () => {
    expect(moveFirstToEnd([])).toEqual([]);
    expect(moveFirstToEnd([INITIAL_ROSTER[0]])).toEqual([INITIAL_ROSTER[0]]);
  });
});

describe('teaching copy', () => {
  it('jsxSnippet shows the actual key expression per mode', () => {
    expect(jsxSnippet('index')).toContain('key={i}');
    expect(jsxSnippet('id')).toContain('key={p.id}');
  });
  it('explain covers every mode/action pair with distinct, substantial copy', () => {
    const texts = (['index', 'id'] as const).flatMap((m) =>
      (['remove', 'move'] as const).map((a) => explain(m, a)),
    );
    expect(new Set(texts).size).toBe(4);
    for (const t of texts) expect(t.length).toBeGreaterThan(40);
    expect(explain('index', null)).toContain('Tick');
  });
});
