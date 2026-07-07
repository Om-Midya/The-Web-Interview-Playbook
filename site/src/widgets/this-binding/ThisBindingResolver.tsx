import Stepper from '../engine/Stepper';
import { THIS_TRACES, type ThisState } from './traces';

function Ladder(state: ThisState) {
  return (
    <div>
      <div className="ladder">
        {state.ladder.map((r) => (
          <div key={r.rule} className={`ladder-rule ${r.status}`}>
            <span>{r.rule}</span>
            <span>{r.status === 'matched' ? '✓' : r.status === 'skipped' ? '✗' : r.status === 'checking' ? '…' : ''}</span>
          </div>
        ))}
      </div>
      <p className="this-value">this = {state.thisValue}</p>
      <div className="el-console" aria-label="Console output">
        {state.output.map((line, i) => (
          <div className="el-console-line" key={i}>{line}</div>
        ))}
      </div>
    </div>
  );
}

export default function ThisBindingResolver() {
  return <Stepper samples={THIS_TRACES} renderState={Ladder} />;
}
