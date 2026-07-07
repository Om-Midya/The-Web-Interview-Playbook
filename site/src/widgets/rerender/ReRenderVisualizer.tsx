import { useState } from 'react';
import { APP_TREE, rerenderSet, type TreeNode, type RerenderAction } from './rerender';

function countNodes(node: TreeNode): number {
  return 1 + (node.children?.reduce((sum, c) => sum + countNodes(c), 0) ?? 0);
}

function Tree({ node, flashed, version }: { node: TreeNode; flashed: Set<string>; version: number }) {
  const isFlashed = flashed.has(node.id);
  return (
    <div className="rtree">
      <div key={`${node.id}-${version}-${isFlashed}`} className={`rtree-node${isFlashed ? ' flash' : ''}`}>
        {node.label}
      </div>
      {node.children && (
        <div className="rtree-children">
          {node.children.map((c) => (
            <Tree key={c.id} node={c} flashed={flashed} version={version} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ReRenderVisualizer() {
  const [memoEnabled, setMemoEnabled] = useState(true);
  const [flashed, setFlashed] = useState<Set<string>>(new Set());
  const [version, setVersion] = useState(0);
  const total = countNodes(APP_TREE);

  function fire(action: RerenderAction) {
    setFlashed(rerenderSet(action, memoEnabled));
    setVersion((v) => v + 1);
  }

  return (
    <div>
      <div className="pm-actions" style={{ marginBottom: '0.8rem' }}>
        <button className="is-primary" onClick={() => fire('counter-state')}>setState in Counter</button>
        <button onClick={() => fire('app-state')}>setState in App</button>
        <button onClick={() => setMemoEnabled((m) => !m)} aria-pressed={memoEnabled}>
          React.memo: {memoEnabled ? 'on' : 'off'}
        </button>
      </div>
      <Tree node={APP_TREE} flashed={flashed} version={version} />
      <p className="rtree-count" aria-live="polite">
        {flashed.size === 0 ? 'Click a button — flashing components re-render.' : `${flashed.size} of ${total} components re-rendered.`}
      </p>
    </div>
  );
}
