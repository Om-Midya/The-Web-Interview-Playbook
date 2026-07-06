import Stepper from '../engine/Stepper';
import { TRACES, type EventLoopState } from './traces';

function Zone({ title, items, className = '' }: { title: string; items: string[]; className?: string }) {
  return (
    <div className={`el-zone ${className}`}>
      <h4>{title}</h4>
      {items.map((item, i) => (
        <div className="el-item" key={`${item}-${i}`}>{item}</div>
      ))}
    </div>
  );
}

function Machine(state: EventLoopState) {
  return (
    <div className="el-machine">
      <Zone title="Call stack" items={[...state.callStack].reverse()} />
      <Zone title="Web APIs" items={state.webApis} />
      <Zone title="Microtask queue" items={state.microtasks} className="is-micro" />
      <Zone title="Macrotask queue" items={state.macrotasks} />
      <div className="el-console" aria-label="Console output">
        {state.output.map((line, i) => (
          <div className="el-console-line" key={i}>{line}</div>
        ))}
      </div>
    </div>
  );
}

export default function EventLoopStepper() {
  return <Stepper samples={TRACES} renderState={Machine} />;
}
