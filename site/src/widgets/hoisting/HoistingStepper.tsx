import Stepper from '../engine/Stepper';
import { HOIST_TRACES, type HoistState } from './traces';

function Memory(state: HoistState) {
  return (
    <div>
      <span className="phase-badge">{state.phase} phase</span>
      <table className="mem-table">
        <thead>
          <tr><th>binding</th><th>kind</th><th>value</th></tr>
        </thead>
        <tbody>
          {state.bindings.length === 0 && (
            <tr><td colSpan={3}>scope is empty…</td></tr>
          )}
          {state.bindings.map((b) => (
            <tr key={b.name}>
              <td>{b.name}</td>
              <td>{b.kind}</td>
              <td className={b.value === 'TDZ' ? 'mem-tdz' : ''}>{b.value === 'TDZ' ? '⛔ TDZ' : b.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="el-console" aria-label="Console output">
        {state.output.map((line, i) => (
          <div className="el-console-line" key={i}>{line}</div>
        ))}
      </div>
    </div>
  );
}

export default function HoistingStepper() {
  return <Stepper samples={HOIST_TRACES} renderState={Memory} />;
}
