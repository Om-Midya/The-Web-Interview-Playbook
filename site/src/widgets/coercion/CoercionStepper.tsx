import Stepper from '../engine/Stepper';
import { COERCION_TRACES, type CoercionState } from './traces';

function Rewrite(state: CoercionState) {
  return (
    <div>
      <div className="co-chain" aria-label="Rewrite chain">
        {state.history.map((form, i) => (
          <div key={i} className={`co-form${i === state.history.length - 1 ? ' current' : ''}`}>
            {form}
          </div>
        ))}
      </div>
      {state.rule && <span className="co-rule">{state.rule}</span>}
      {state.verdict && (
        <div>
          <span className="co-verdict">= {state.verdict}</span>
        </div>
      )}
    </div>
  );
}

export default function CoercionStepper() {
  return <Stepper samples={COERCION_TRACES} renderState={Rewrite} />;
}
