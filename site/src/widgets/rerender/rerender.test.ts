import { describe, it, expect } from 'vitest';
import { rerenderSet } from './rerender';

describe('rerenderSet', () => {
  it('state in a leaf re-renders only that component', () => {
    expect(rerenderSet('counter-state', true)).toEqual(new Set(['counter']));
  });
  it('state at the root re-renders the whole tree except memoized nodes', () => {
    const set = rerenderSet('app-state', true);
    expect(set).toEqual(new Set(['app', 'header', 'counter', 'list', 'item1', 'item2']));
    expect(set.has('footer')).toBe(false);
    expect(set.has('item3')).toBe(false);
  });
  it('without memo, root state re-renders everything', () => {
    expect(rerenderSet('app-state', false).size).toBe(8);
  });
});
