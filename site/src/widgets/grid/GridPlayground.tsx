import { useEffect, useRef, useState } from 'react';
import PlaygroundFrame, { OptionRow, Slider } from '../engine/PlaygroundFrame';
import {
  AREA_PRESETS,
  COLUMN_PRESETS,
  areaLayout,
  areasCss,
  gridCss,
  type AreaPreset,
} from './grid';

export default function GridPlayground() {
  const [mode, setMode] = useState<string>('tracks');
  const [columns, setColumns] = useState<string>('1fr 1fr 1fr');
  const [gap, setGap] = useState(12);
  const [count, setCount] = useState(6);
  const [alignItems, setAlignItems] = useState<string>('stretch');
  const [areaPreset, setAreaPreset] = useState<string>('holy-grail');
  const [side, setSide] = useState<string>('left');

  const containerRef = useRef<HTMLDivElement>(null);
  const [widths, setWidths] = useState<number[]>([]);

  useEffect(() => {
    if (mode !== 'tracks') return;
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const next = Array.from(el.children).map((c) => Math.round(c.getBoundingClientRect().width));
      setWidths((prev) => (prev.join(',') === next.join(',') ? prev : next));
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return; // fail-soft: no px labels
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [mode, columns, gap, count, alignItems]);

  const layout = areaLayout(areaPreset as AreaPreset, side as 'left' | 'right');
  const css =
    mode === 'tracks'
      ? gridCss({ columns, gap, count, alignItems })
      : areasCss(areaPreset as AreaPreset, side as 'left' | 'right', gap);

  return (
    <PlaygroundFrame
      controls={
        <>
          <OptionRow label="mode" options={['tracks', 'areas']} value={mode} onChange={setMode} />
          {mode === 'tracks' ? (
            <>
              <OptionRow label="grid-template-columns" options={COLUMN_PRESETS} value={columns} onChange={setColumns} />
              <OptionRow
                label="items"
                options={['4', '6', '8']}
                value={String(count)}
                onChange={(v) => setCount(Number(v))}
              />
              <OptionRow label="align-items" options={['stretch', 'start', 'center', 'end']} value={alignItems} onChange={setAlignItems} />
            </>
          ) : (
            <>
              <OptionRow label="layout" options={AREA_PRESETS} value={areaPreset} onChange={setAreaPreset} />
              <OptionRow label="sidebar side" options={['left', 'right']} value={side} onChange={setSide} />
            </>
          )}
          <Slider label="gap" min={0} max={32} value={gap} onChange={setGap} />
        </>
      }
      preview={
        mode === 'tracks' ? (
          <div
            ref={containerRef}
            style={{ display: 'grid', gridTemplateColumns: columns, gap, alignItems, minHeight: 180 }}
          >
            {Array.from({ length: count }, (_, i) => (
              <div key={i} className="grid-item">
                {i + 1}
                {widths[i] ? <small>{widths[i]}px</small> : null}
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: layout.colSizes,
              gridTemplateRows: layout.rowSizes,
              gridTemplateAreas: layout.rows.map((r) => `"${r}"`).join(' '),
              gap,
              minHeight: 220,
            }}
          >
            {layout.areas.map((a) => (
              <div key={a} className={`ga-cell ga-${a}`} style={{ gridArea: a }}>
                {a}
              </div>
            ))}
          </div>
        )
      }
      css={css}
    />
  );
}
