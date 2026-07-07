import type { ReactNode } from 'react';

/** One-degree-of-freedom playground shell: controls on top, live preview,
 * then the CSS this configuration generates. */
export default function PlaygroundFrame({
  controls,
  preview,
  css,
}: {
  controls: ReactNode;
  preview: ReactNode;
  css: string;
}) {
  return (
    <div className="playground">
      <div className="playground-controls">{controls}</div>
      <div className="playground-preview">{preview}</div>
      <pre className="playground-css"><code>{css}</code></pre>
    </div>
  );
}

export function OptionRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="playground-control">
      <span className="label">{label}</span>
      <div className="options" aria-label={label}>
        {options.map((opt) => (
          <button
            key={opt}
            aria-pressed={opt === value}
            className={opt === value ? 'is-active' : ''}
            onClick={() => onChange(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Slider({
  label,
  min,
  max,
  value,
  onChange,
  unit = 'px',
}: {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
  unit?: string;
}) {
  return (
    <label className="playground-control pg-slider">
      <span className="label">{label}: {value}{unit}</span>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}
