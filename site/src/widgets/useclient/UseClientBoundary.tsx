import { useState } from 'react';
import { APP_TREE, RUNTIME_KB, clientSet, shippedKb, type TreeNode } from './boundary';

function Node({ node, clients, directives, onToggle }: {
  node: TreeNode;
  clients: Set<string>;
  directives: Set<string>;
  onToggle: (id: string) => void;
}) {
  const isClient = clients.has(node.id);
  const isDirective = directives.has(node.id);
  return (
    <div>
      <button
        className={`uc-node${isClient ? ' is-client' : ''}${isDirective ? ' is-directive' : ''}`}
        aria-pressed={isDirective}
        onClick={() => onToggle(node.id)}
      >
        <span>{isDirective ? "'use client' " : ''}&lt;{node.label} /&gt;</span>
        <span className={`uc-badge ${isClient ? 'is-client' : 'is-server'}`}>
          {isClient ? `client · ${node.kb}kb shipped` : 'server · 0kb shipped'}
        </span>
        <span className="uc-kb">{node.kb}kb source</span>
      </button>
      {node.children.length > 0 && (
        <div className="rtree-children">
          {node.children.map((c) => (
            <Node key={c.id} node={c} clients={clients} directives={directives} onToggle={onToggle} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function UseClientBoundary() {
  const [directives, setDirectives] = useState<Set<string>>(new Set());
  const clients = clientSet(APP_TREE, directives);
  const kb = shippedKb(APP_TREE, clients);

  function toggle(id: string) {
    setDirectives((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="sim">
      <p className="sim-summary">Click a component to add or remove a 'use client' directive.</p>
      <div className="rtree">
        <Node node={APP_TREE} clients={clients} directives={directives} onToggle={toggle} />
      </div>
      <div className="sim-readout">
        <span>shipped JS <strong>{kb} kb</strong></span>
        {clients.size > 0 ? (
          <span>runtime {RUNTIME_KB}kb + components {kb - RUNTIME_KB}kb</span>
        ) : (
          <span>everything renders on the server</span>
        )}
      </div>
      <div className="sim-actions">
        <button onClick={() => setDirectives(new Set())} disabled={directives.size === 0}>
          Reset
        </button>
      </div>
      <p className="sim-note">
        A client component's imports become client too — but server components passed as
        children/props through a client boundary stay on the server. That escape hatch is the
        follow-up interviewers probe.
      </p>
    </div>
  );
}
