export interface Pt {
  x: number;
  y: number;
}

/** Linear interpolation between two points; t clamps to [0, 1]. */
export function lerpPoint(a: Pt, b: Pt, t: number): Pt {
  const c = t < 0 ? 0 : t > 1 ? 1 : t;
  return { x: a.x + (b.x - a.x) * c, y: a.y + (b.y - a.y) * c };
}

export function NodeBox({ x, y, w, h, label, status }: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  status: 'idle' | 'busy' | 'blocked' | 'down';
}) {
  return (
    <g>
      <rect className={`topo-node is-${status}`} x={x} y={y} width={w} height={h} rx={6} />
      <text className="topo-label" x={x + w / 2} y={y + h / 2 + 3} textAnchor="middle">
        {label}
      </text>
    </g>
  );
}

export function Edge({ from, to }: { from: Pt; to: Pt }) {
  return <line className="topo-edge" x1={from.x} y1={from.y} x2={to.x} y2={to.y} />;
}

export function TravelDot({ from, to, progress, tone }: {
  from: Pt;
  to: Pt;
  progress: number;
  tone: 'a' | 'b' | 'c' | 'ok' | 'warn';
}) {
  const p = lerpPoint(from, to, progress);
  return <circle className={`topo-dot is-${tone}`} cx={p.x} cy={p.y} r={5} />;
}

export function QueueBadge({ x, y, count }: { x: number; y: number; count: number }) {
  if (count === 0) return null;
  return (
    <g>
      <circle className="topo-badge-bg" cx={x} cy={y} r={9} />
      <text className="topo-badge" x={x} y={y + 3} textAnchor="middle">
        {count}
      </text>
    </g>
  );
}
