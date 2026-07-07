import Stepper from '../engine/Stepper';
import { PROP_TRACES, CHAIN, type PropState } from './traces';

function Chain(state: PropState) {
  return (
    <div>
      <div className="dom-chain">
        {CHAIN.map((node) => {
          const fired = state.fired.find((f) => f.node === node);
          return (
            <div key={node} className={`dom-node${state.current === node ? ' current' : ''}`}>
              <span>{node}</span>
              {state.current === node && <span className="phase-tag">{state.phase}</span>}
              {fired && <span className="dom-fired">🔔 {fired.label}</span>}
            </div>
          );
        })}
      </div>
      {state.stopped && <p className="pm-lock-note" role="status">Propagation stopped — ancestors never hear this event.</p>}
    </div>
  );
}

export default function EventPropagation() {
  return <Stepper samples={PROP_TRACES} renderState={Chain} />;
}
