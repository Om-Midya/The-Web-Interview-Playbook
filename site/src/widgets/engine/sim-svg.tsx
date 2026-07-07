import type { ReactNode } from 'react';

/** Logical SVG width; components scale responsively via viewBox. */
export const SVG_W = 640;

/** Sliding-window time→x mapping: the window's left edge is
 * max(0, now - windowMs), so `now` reaches the right edge and stays there. */
export function timeToX(t: number, now: number, windowMs: number): number {
  const left = Math.max(0, now - windowMs);
  return ((t - left) / windowMs) * SVG_W;
}

export function TimelineSvg({ height, label, children }: {
  height: number;
  label: string;
  children: ReactNode;
}) {
  return (
    <svg
      className="tl-svg"
      viewBox={`0 0 ${SVG_W} ${height}`}
      role="img"
      aria-label={label}
      preserveAspectRatio="xMidYMid meet"
    >
      {children}
    </svg>
  );
}

export function Lane({ y, label }: { y: number; label: string }) {
  return (
    <g>
      <text className="tl-label" x={4} y={y - 10}>{label}</text>
      <line className="tl-lane" x1={0} x2={SVG_W} y1={y} y2={y} />
    </g>
  );
}

export function EventDot({ x, y }: { x: number; y: number }) {
  return <circle className="tl-event" cx={x} cy={y} r={4} />;
}

export function FireMarker({ x, y }: { x: number; y: number }) {
  return <path className="tl-fire" d={`M ${x} ${y - 11} l 5.5 11 l -11 0 z`} />;
}

export function DurationBar({ x1, x2, y, label, status }: {
  x1: number;
  x2: number;
  y: number;
  label: string;
  status: 'running' | 'done' | 'pending';
}) {
  return (
    <g>
      <rect
        className={`tl-bar is-${status}`}
        x={x1}
        y={y - 8}
        width={Math.max(1, x2 - x1)}
        height={16}
        rx={3}
      />
      <text className="tl-bar-label" x={x1 + 5} y={y + 4}>{label}</text>
    </g>
  );
}
