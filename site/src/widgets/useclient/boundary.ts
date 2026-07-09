export interface TreeNode {
  id: string;
  label: string;
  kb: number;
  children: TreeNode[];
}

/** React runtime baseline, shipped once ANY client boundary exists. */
export const RUNTIME_KB = 85;

export const APP_TREE: TreeNode = {
  id: 'root', label: 'RootLayout', kb: 12,
  children: [
    {
      id: 'header', label: 'Header', kb: 3,
      children: [
        { id: 'nav', label: 'NavLinks', kb: 2, children: [] },
        { id: 'search', label: 'SearchBar', kb: 4, children: [] },
      ],
    },
    {
      id: 'page', label: 'Page', kb: 5,
      children: [
        { id: 'list', label: 'ProductList', kb: 8, children: [
          { id: 'card', label: 'ProductCard', kb: 3, children: [] },
        ] },
        { id: 'sidebar', label: 'Sidebar', kb: 2, children: [] },
      ],
    },
    { id: 'footer', label: 'Footer', kb: 1, children: [] },
  ],
};

/** Every node that carries a directive or descends from one. */
export function clientSet(root: TreeNode, directives: Set<string>): Set<string> {
  const out = new Set<string>();
  const walk = (node: TreeNode, inClient: boolean): void => {
    const isClient = inClient || directives.has(node.id);
    if (isClient) out.add(node.id);
    for (const c of node.children) walk(c, isClient);
  };
  walk(root, false);
  return out;
}

export function shippedKb(root: TreeNode, clients: Set<string>): number {
  let sum = 0;
  const walk = (n: TreeNode): void => {
    if (clients.has(n.id)) sum += n.kb;
    n.children.forEach(walk);
  };
  walk(root);
  return sum + (clients.size > 0 ? RUNTIME_KB : 0);
}
