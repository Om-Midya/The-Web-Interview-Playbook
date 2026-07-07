import Stepper from '../engine/Stepper';
import { MW_TRACES, PIPELINE, type MwState } from './traces';

function Pipe(state: MwState) {
  return (
    <div>
      <div className="pipeline">
        {PIPELINE.map((node, i) => (
          <span key={node} style={{ display: 'contents' }}>
            {i > 0 && <span aria-hidden="true">→</span>}
            <span className={`pipe-node${state.at === node ? ' at' : ''}${node === 'error mw' && state.errored ? ' error' : ''}`}>
              {node}
            </span>
          </span>
        ))}
      </div>
      <ul className="fx-log" style={{ marginTop: '0.6rem', marginBottom: 0, paddingLeft: 0, listStyle: 'none' }}>
        {state.notes.map((n, i) => (
          <li className="fx-event" key={i}>{n}</li>
        ))}
      </ul>
      {state.status !== null && (
        <p className="pipe-res">
          <span className={`status-${Math.floor(state.status / 100)}xx`}>HTTP {state.status}</span> {state.body}
        </p>
      )}
    </div>
  );
}

export default function MiddlewarePipeline() {
  return <Stepper samples={MW_TRACES} renderState={Pipe} />;
}
