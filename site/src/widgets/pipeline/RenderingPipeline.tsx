import Stepper from '../engine/Stepper';
import { PIPELINE_TRACES, STAGE_NAMES, type PipelineState } from './traces';

const STATUS_TAG: Record<string, string> = { skipped: 'skipped', running: '…', done: '✓', idle: '' };

function Chain(state: PipelineState) {
  return (
    <div>
      <div className="pl-chain" aria-label="Rendering pipeline stages">
        {STAGE_NAMES.map((name, i) => (
          <span key={name} style={{ display: 'contents' }}>
            {i > 0 && <span className="pl-arrow" aria-hidden="true">→</span>}
            <span className={`pl-stage is-${state.stages[i]}`}>
              {name}
              {state.stages[i] !== 'idle' && <em>{STATUS_TAG[state.stages[i]]}</em>}
            </span>
          </span>
        ))}
      </div>
      <p className="pl-cost">
        stages re-run: <strong>{state.rerun}</strong> / 6
      </p>
      <div className="el-console" aria-label="Stage log">
        {state.output.map((l, i) => (
          <div className="el-console-line" key={i}>{l}</div>
        ))}
      </div>
    </div>
  );
}

export default function RenderingPipeline() {
  return <Stepper samples={PIPELINE_TRACES} renderState={Chain} />;
}
