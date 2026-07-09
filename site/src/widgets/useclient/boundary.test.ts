import { describe, expect, it } from 'vitest';
import { APP_TREE, RUNTIME_KB, clientSet, shippedKb, type TreeNode } from './boundary';

const ids = (s: Set<string>) => [...s].sort();

describe('clientSet', () => {
  it('a directive floods exactly its subtree', () => {
    expect(ids(clientSet(APP_TREE, new Set(['header'])))).toEqual(['header', 'nav', 'search']);
  });
  it('a nested directive inside an existing client subtree adds nothing', () => {
    const outer = clientSet(APP_TREE, new Set(['header']));
    const both = clientSet(APP_TREE, new Set(['header', 'search']));
    expect(ids(both)).toEqual(ids(outer));
  });
  it('disjoint boundaries union', () => {
    expect(ids(clientSet(APP_TREE, new Set(['search', 'sidebar'])))).toEqual(['search', 'sidebar']);
  });
});

describe('shippedKb', () => {
  it('no boundaries → empty set and 0 kb (no runtime)', () => {
    const none = clientSet(APP_TREE, new Set());
    expect(none.size).toBe(0);
    expect(shippedKb(APP_TREE, none)).toBe(0);
  });
  it('boundary sums: whole tree, single leaf; tree ids unique with positive sizes', () => {
    expect(shippedKb(APP_TREE, clientSet(APP_TREE, new Set(['root'])))).toBe(40 + RUNTIME_KB);
    expect(shippedKb(APP_TREE, clientSet(APP_TREE, new Set(['search'])))).toBe(4 + RUNTIME_KB);
    const seen = new Set<string>();
    const walk = (n: TreeNode): void => {
      expect(seen.has(n.id)).toBe(false);
      seen.add(n.id);
      expect(n.kb).toBeGreaterThan(0);
      n.children.forEach(walk);
    };
    walk(APP_TREE);
  });
});
