import Stepper from '../engine/Stepper';
import { CLOSURE_TRACES, type ClosureState, type EnvFrame } from './traces';

const STATUS_TEXT: Record<EnvFrame['status'], string> = {
  executing: 'executing',
  retained: 'kept alive by closure',
  gone: 'gone',
};

function frameLabel(state: ClosureState, id: string): string {
  return state.frames.find((f) => f.id === id)?.label ?? id;
}

function EnvDiagram(state: ClosureState) {
  const frames = [...state.frames].reverse(); // innermost on top, Global at the bottom
  return (
    <div>
      <div className="env-stack" aria-label="Environment records">
        {frames.map((f) => (
          <div key={f.id} className={`env-frame ${f.status}`}>
            <div className="env-label">
              <span>{f.label}</span>
              <span className="env-status">{STATUS_TEXT[f.status]}</span>
            </div>
            {f.bindings.map((b) => (
              <div key={b.name} className="env-binding">
                <strong>{b.name}</strong>: {b.value}
              </div>
            ))}
            {f.parentId && <div className="env-outer">outer → {frameLabel(state, f.parentId)}</div>}
          </div>
        ))}
      </div>
      {state.refs.length > 0 && (
        <div className="env-refs" aria-label="Closure references">
          {state.refs.map((r, i) => (
            <div key={i} className="env-ref">
              {r.from} ⤳ {frameLabel(state, r.toFrameId)}
            </div>
          ))}
        </div>
      )}
      <div className="el-console" aria-label="Console output">
        {state.output.map((line, i) => (
          <div className="el-console-line" key={i}>{line}</div>
        ))}
      </div>
    </div>
  );
}

export default function ClosureScopeStepper() {
  return <Stepper samples={CLOSURE_TRACES} renderState={EnvDiagram} />;
}
