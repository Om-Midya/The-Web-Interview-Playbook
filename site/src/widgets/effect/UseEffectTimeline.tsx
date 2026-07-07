import { useState } from 'react';
import { OptionRow } from '../engine/PlaygroundFrame';
import { effectStep, type DepsMode, type EffectAction, type EffectEvent } from './effect';

const DEPS_OPTIONS = ['none', 'empty', 'count'] as const;
const DEPS_DISPLAY: Record<DepsMode, string> = { none: 'useEffect(fn)', empty: 'useEffect(fn, [])', count: 'useEffect(fn, [count])' };

export default function UseEffectTimeline() {
  const [deps, setDeps] = useState<DepsMode>('count');
  const [mounted, setMounted] = useState(false);
  const [log, setLog] = useState<EffectEvent[]>([]);

  function act(action: EffectAction) {
    const result = effectStep(deps, action, mounted);
    setMounted(result.mounted);
    setLog((prev) => [...prev, ...result.events]);
  }
  function changeDeps(v: string) {
    setDeps(v as DepsMode);
    setMounted(false);
    setLog([]);
  }

  return (
    <div className="playground">
      <div className="playground-controls">
        <OptionRow label="dependencies" options={DEPS_OPTIONS} value={deps} onChange={changeDeps} />
      </div>
      <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>{DEPS_DISPLAY[deps]}</p>
      <div className="pm-actions">
        <button className="is-primary" onClick={() => act('mount')} disabled={mounted}>mount</button>
        <button onClick={() => act('setCount')} disabled={!mounted}>setCount(c+1)</button>
        <button onClick={() => act('setOther')} disabled={!mounted}>setOther(!o)</button>
        <button onClick={() => act('unmount')} disabled={!mounted}>unmount</button>
      </div>
      <div className="fx-log" aria-live="polite">
        {log.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Mount the component to start the timeline.</p>}
        {log.map((e, i) => (
          <div className="fx-event" key={i}>
            <span className={`fx-kind ${e.kind}`}>{e.kind}</span>
            <span>{e.detail}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
