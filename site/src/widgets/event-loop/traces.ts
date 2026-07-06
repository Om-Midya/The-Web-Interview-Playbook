import type { StepperSample } from '../lib/stepper';

export interface EventLoopState {
  callStack: string[];
  webApis: string[];
  microtasks: string[];
  macrotasks: string[];
  output: string[];
}

const EMPTY: EventLoopState = { callStack: [], webApis: [], microtasks: [], macrotasks: [], output: [] };
const s = (over: Partial<EventLoopState>): EventLoopState => ({ ...EMPTY, ...over });

export const TRACES: StepperSample<EventLoopState>[] = [
  {
    id: 'timeout-vs-promise',
    label: 'setTimeout vs Promise',
    code: [
      "console.log('start');",
      'setTimeout(() => {',
      "  console.log('timeout');",
      '}, 0);',
      'Promise.resolve().then(() => {',
      "  console.log('promise');",
      '});',
      "console.log('end');",
    ].join('\n'),
    steps: [
      { line: null, note: 'The script starts running — main() is pushed onto the call stack.', state: s({ callStack: ['main()'] }) },
      { line: 1, note: "console.log runs synchronously: 'start' is printed immediately.", state: s({ callStack: ['main()', "console.log('start')"], output: ['start'] }) },
      { line: 2, note: 'setTimeout does NOT run your callback — it hands it to the browser timer (a Web API) and returns instantly.', state: s({ callStack: ['main()', 'setTimeout(cb, 0)'], output: ['start'] }) },
      { line: 4, note: 'The timer (0 ms) is counting down in the Web APIs area, outside JavaScript.', state: s({ callStack: ['main()'], webApis: ['⏱ timer 0ms → cb'], output: ['start'] }) },
      { line: 5, note: 'The promise is ALREADY resolved, so its .then callback is scheduled — into the MICROTASK queue, not the timer queue.', state: s({ callStack: ['main()', '.then(cb)'], webApis: ['⏱ timer 0ms → cb'], output: ['start'] }) },
      { line: 7, note: 'Even a 0 ms timer must wait: its callback moved to the macrotask (callback) queue, where it sits until the stack is empty AND microtasks are done.', state: s({ callStack: ['main()'], microtasks: ['promise cb'], macrotasks: ['timeout cb'], output: ['start'] }) },
      { line: 8, note: "Still synchronous code left, so 'end' prints before either queued callback.", state: s({ callStack: ['main()', "console.log('end')"], microtasks: ['promise cb'], macrotasks: ['timeout cb'], output: ['start', 'end'] }) },
      { line: null, note: 'main() finishes — the call stack is empty. The event loop now checks the queues: MICROTASKS ALWAYS GO FIRST.', state: s({ microtasks: ['promise cb'], macrotasks: ['timeout cb'], output: ['start', 'end'] }) },
      { line: 6, note: "The microtask runs: 'promise' prints. The macrotask is still waiting.", state: s({ callStack: ['promise cb'], macrotasks: ['timeout cb'], output: ['start', 'end', 'promise'] }) },
      { line: null, note: 'Microtask queue drained. ONLY NOW does the event loop take the next macrotask.', state: s({ macrotasks: ['timeout cb'], output: ['start', 'end', 'promise'] }) },
      { line: 3, note: "The timer callback finally runs: 'timeout' prints last — even though the delay was 0 ms.", state: s({ callStack: ['timeout cb'], output: ['start', 'end', 'promise', 'timeout'] }) },
      { line: null, note: 'Done. Final order: start → end → promise → timeout. Sync code, then microtasks, then macrotasks.', state: s({ output: ['start', 'end', 'promise', 'timeout'] }) },
    ],
  },
  {
    id: 'async-await',
    label: 'async/await',
    code: [
      'async function main() {',
      "  console.log('A');",
      '  await Promise.resolve();',
      "  console.log('B');",
      '}',
      'main();',
      "console.log('C');",
    ].join('\n'),
    steps: [
      { line: 6, note: 'main() is called and pushed onto the stack. An async function starts running synchronously.', state: s({ callStack: ['main()'] }) },
      { line: 2, note: "'A' prints — everything before the first await is ordinary synchronous code.", state: s({ callStack: ['main()', "console.log('A')"], output: ['A'] }) },
      { line: 3, note: 'await SUSPENDS main() here. The rest of the function is scheduled as a microtask; main() pops off the stack.', state: s({ microtasks: ['resume main() after await'], output: ['A'] }) },
      { line: 7, note: "Execution continues after the main() call: 'C' prints while main() is suspended.", state: s({ callStack: ["console.log('C')"], microtasks: ['resume main() after await'], output: ['A', 'C'] }) },
      { line: null, note: 'The script finishes — stack empty. The event loop drains the microtask queue.', state: s({ microtasks: ['resume main() after await'], output: ['A', 'C'] }) },
      { line: 4, note: "main() resumes where it paused: 'B' prints last.", state: s({ callStack: ['main() (resumed)'], output: ['A', 'C', 'B'] }) },
      { line: null, note: 'Final order: A → C → B. await = "pause me, run me as a microtask when the value is ready".', state: s({ output: ['A', 'C', 'B'] }) },
    ],
  },
];
