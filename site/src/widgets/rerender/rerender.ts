export interface TreeNode {
  id: string;
  label: string;
  memo?: boolean;
  children?: TreeNode[];
}

export const APP_TREE: TreeNode = {
  id: 'app',
  label: 'App (state)',
  children: [
    { id: 'header', label: 'Header' },
    { id: 'counter', label: 'Counter (state)' },
    {
      id: 'list',
      label: 'List',
      children: [
        { id: 'item1', label: 'Item 1' },
        { id: 'item2', label: 'Item 2' },
        { id: 'item3', label: 'Item 3 (memo)', memo: true },
      ],
    },
    { id: 'footer', label: 'Footer (memo)', memo: true },
  ],
};

export type RerenderAction = 'counter-state' | 'app-state';

/** A state update re-renders its owner and every descendant — EXCEPT
 * React.memo components whose props are unchanged (when memo is enabled). */
export function rerenderSet(action: RerenderAction, memoEnabled: boolean): Set<string> {
  if (action === 'counter-state') return new Set(['counter']);
  const out = new Set<string>();
  const walk = (node: TreeNode) => {
    if (memoEnabled && node.memo) return; // props unchanged → memo bails out (children skipped too)
    out.add(node.id);
    node.children?.forEach(walk);
  };
  walk(APP_TREE);
  return out;
}
