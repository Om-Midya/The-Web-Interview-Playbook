import { useState, type CSSProperties } from 'react';
import PlaygroundFrame, { OptionRow } from '../engine/PlaygroundFrame';

const DIRECTIONS = ['row', 'row-reverse', 'column', 'column-reverse'] as const;
const JUSTIFY = ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'] as const;
const ALIGN = ['stretch', 'flex-start', 'center', 'flex-end', 'baseline'] as const;
const WRAP = ['nowrap', 'wrap'] as const;

/** Varied heights make align-items differences visible. */
const ITEM_HEIGHTS = [48, 72, 56, 88, 64, 52];

export default function FlexboxPlayground() {
  const [direction, setDirection] = useState<string>('row');
  const [justify, setJustify] = useState<string>('flex-start');
  const [align, setAlign] = useState<string>('stretch');
  const [wrap, setWrap] = useState<string>('nowrap');
  const [count, setCount] = useState(4);

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: direction as CSSProperties['flexDirection'],
    justifyContent: justify,
    alignItems: align,
    flexWrap: wrap as CSSProperties['flexWrap'],
    gap: '0.5rem',
    height: '220px',
  };

  const css = [
    '.container {',
    '  display: flex;',
    `  flex-direction: ${direction};`,
    `  justify-content: ${justify};`,
    `  align-items: ${align};`,
    `  flex-wrap: ${wrap};`,
    '  gap: 0.5rem;',
    '}',
  ].join('\n');

  return (
    <PlaygroundFrame
      controls={
        <>
          <OptionRow label="flex-direction" options={DIRECTIONS} value={direction} onChange={setDirection} />
          <OptionRow label="justify-content" options={JUSTIFY} value={justify} onChange={setJustify} />
          <OptionRow label="align-items" options={ALIGN} value={align} onChange={setAlign} />
          <OptionRow label="flex-wrap" options={WRAP} value={wrap} onChange={setWrap} />
          <OptionRow
            label="items"
            options={['3', '4', '5', '6'] as const}
            value={String(count)}
            onChange={(v) => setCount(Number(v))}
          />
        </>
      }
      preview={
        <div style={containerStyle}>
          {Array.from({ length: count }, (_, i) => (
            <div
              key={i}
              className="flex-item"
              style={align === 'stretch' ? undefined : { height: ITEM_HEIGHTS[i] }}
            >
              {i + 1}
            </div>
          ))}
        </div>
      }
      css={css}
    />
  );
}
