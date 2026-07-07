import { useState, type ReactNode } from 'react';
import PlaygroundFrame, { OptionRow, Slider } from '../engine/PlaygroundFrame';
import { boxMetrics, type BoxConfig } from './box-model';

function Zone({ kind, pad, children }: { kind: string; pad: number; children: ReactNode }) {
  return (
    <div className={`bm-zone bm-${kind}`} style={{ padding: pad }}>
      <span className="bm-tag">{kind}</span>
      {children}
    </div>
  );
}

export default function BoxModelExplorer() {
  const [width, setWidth] = useState(200);
  const [padding, setPadding] = useState(20);
  const [border, setBorder] = useState(5);
  const [margin, setMargin] = useState(15);
  const [boxSizing, setBoxSizing] = useState<BoxConfig['boxSizing']>('content-box');
  const m = boxMetrics({ width, padding, border, margin, boxSizing });

  const css = [
    '.box {',
    `  box-sizing: ${boxSizing};`,
    `  width: ${width}px;   /* content: ${m.contentWidth}px */`,
    `  padding: ${padding}px;`,
    `  border: ${border}px solid;  /* visible box: ${m.visibleWidth}px */`,
    `  margin: ${margin}px;  /* total footprint: ${m.totalWidth}px */`,
    '}',
  ].join('\n');

  return (
    <PlaygroundFrame
      controls={
        <>
          <Slider label="width" min={100} max={300} value={width} onChange={setWidth} />
          <Slider label="padding" min={0} max={40} value={padding} onChange={setPadding} />
          <Slider label="border" min={0} max={20} value={border} onChange={setBorder} />
          <Slider label="margin" min={0} max={40} value={margin} onChange={setMargin} />
          <OptionRow label="box-sizing" options={['content-box', 'border-box']} value={boxSizing} onChange={(v) => setBoxSizing(v as BoxConfig['boxSizing'])} />
        </>
      }
      preview={
        <div className="bm-preview">
          <Zone kind="margin" pad={margin}>
            <Zone kind="border" pad={border}>
              <Zone kind="padding" pad={padding}>
                <div className="bm-content" style={{ width: m.contentWidth, minHeight: 48 }}>
                  content {m.contentWidth}px
                </div>
              </Zone>
            </Zone>
          </Zone>
          <div className="bm-readout">
            <span>content <strong>{m.contentWidth}px</strong></span>
            <span>visible box <strong>{m.visibleWidth}px</strong></span>
            <span>total footprint <strong>{m.totalWidth}px</strong></span>
          </div>
        </div>
      }
      css={css}
    />
  );
}
