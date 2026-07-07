import type { StepperSample } from '../lib/stepper';

export interface EnvFrame {
  id: string;
  label: string;
  bindings: { name: string; value: string }[];
  status: 'executing' | 'retained' | 'gone';
  parentId: string | null;
}

export interface ClosureState {
  /** Creation order, outermost (Global) first. */
  frames: EnvFrame[];
  /** Closure links: which function value holds which environment alive. */
  refs: { from: string; toFrameId: string }[];
  output: string[];
}

const g = (counterA: string, counterB: string): EnvFrame => ({
  id: 'global',
  label: 'Global',
  bindings: [
    { name: 'makeCounter', value: 'ƒ' },
    { name: 'counterA', value: counterA },
    { name: 'counterB', value: counterB },
  ],
  status: 'executing',
  parentId: null,
});
const mc = (n: 1 | 2, count: number, status: EnvFrame['status']): EnvFrame => ({
  id: `mc${n}`,
  label: `makeCounter() call #${n}`,
  bindings: [{ name: 'count', value: String(count) }],
  status,
  parentId: 'global',
});

export const CLOSURE_TRACES: StepperSample<ClosureState>[] = [
  {
    id: 'two-counters',
    label: 'makeCounter()',
    code: [
      'function makeCounter() {',
      '  let count = 0;',
      '  return () => ++count;',
      '}',
      'const counterA = makeCounter();',
      'const counterB = makeCounter();',
      'console.log(counterA()); // 1',
      'console.log(counterA()); // 2',
      'console.log(counterB()); // 1',
    ].join('\n'),
    steps: [
      { line: 5, note: 'makeCounter() runs. Every call creates a FRESH environment record — this one holds its own count.', state: { frames: [g('—', '—'), mc(1, 0, 'executing')], refs: [], output: [] } },
      { line: 3, note: 'It returns an arrow function. At birth, the function stores a hidden link — [[Environment]] — to the record it was created in.', state: { frames: [g('—', '—'), mc(1, 0, 'executing')], refs: [{ from: 'the returned ƒ', toFrameId: 'mc1' }], output: [] } },
      { line: 5, note: 'makeCounter has RETURNED — but its record is NOT destroyed. counterA still links to it. That link is the closure.', state: { frames: [g('ƒ', '—'), mc(1, 0, 'retained')], refs: [{ from: 'counterA [[Environment]]', toFrameId: 'mc1' }], output: [] } },
      { line: 6, note: 'Second call → a COMPLETELY SEPARATE record with its own count. Closures never share by accident.', state: { frames: [g('ƒ', '—'), mc(1, 0, 'retained'), mc(2, 0, 'executing')], refs: [{ from: 'counterA [[Environment]]', toFrameId: 'mc1' }], output: [] } },
      { line: 6, note: 'It returns too. Two retained records now coexist, one per call.', state: { frames: [g('ƒ', 'ƒ'), mc(1, 0, 'retained'), mc(2, 0, 'retained')], refs: [{ from: 'counterA [[Environment]]', toFrameId: 'mc1' }, { from: 'counterB [[Environment]]', toFrameId: 'mc2' }], output: [] } },
      { line: 7, note: 'counterA() increments THROUGH its link: record #1 now says count: 1. The state lives in the environment, not in the function.', state: { frames: [g('ƒ', 'ƒ'), mc(1, 1, 'retained'), mc(2, 0, 'retained')], refs: [{ from: 'counterA [[Environment]]', toFrameId: 'mc1' }, { from: 'counterB [[Environment]]', toFrameId: 'mc2' }], output: ['1'] } },
      { line: 8, note: 'Same record again: count → 2.', state: { frames: [g('ƒ', 'ƒ'), mc(1, 2, 'retained'), mc(2, 0, 'retained')], refs: [{ from: 'counterA [[Environment]]', toFrameId: 'mc1' }, { from: 'counterB [[Environment]]', toFrameId: 'mc2' }], output: ['1', '2'] } },
      { line: 9, note: 'counterB() touches ITS record: count → 1. Two counters, two private worlds.', state: { frames: [g('ƒ', 'ƒ'), mc(1, 2, 'retained'), mc(2, 1, 'retained')], refs: [{ from: 'counterA [[Environment]]', toFrameId: 'mc1' }, { from: 'counterB [[Environment]]', toFrameId: 'mc2' }], output: ['1', '2', '1'] } },
      { line: null, note: 'A closure = a function + the environment record it was born in. Return the function and the record survives with it.', state: { frames: [g('ƒ', 'ƒ'), mc(1, 2, 'retained'), mc(2, 1, 'retained')], refs: [{ from: 'counterA [[Environment]]', toFrameId: 'mc1' }, { from: 'counterB [[Environment]]', toFrameId: 'mc2' }], output: ['1', '2', '1'] } },
    ],
  },
  {
    id: 'var-loop',
    label: 'var loop → 3,3,3',
    code: [
      'for (var i = 0; i < 3; i++) {',
      '  setTimeout(() => console.log(i));',
      '}',
      '// timers fire after the loop…',
    ].join('\n'),
    steps: [
      { line: 1, note: '`var` is function-scoped: ONE binding `i` in one shared record. The loop does NOT create per-iteration copies.', state: { frames: [{ id: 'shared', label: 'Enclosing scope (ONE shared record)', bindings: [{ name: 'i', value: '0' }], status: 'executing', parentId: null }], refs: [], output: [] } },
      { line: 2, note: 'Iteration 0 schedules a callback. It captures the RECORD — not the value 0.', state: { frames: [{ id: 'shared', label: 'Enclosing scope (ONE shared record)', bindings: [{ name: 'i', value: '0' }], status: 'executing', parentId: null }], refs: [{ from: 'callback #0', toFrameId: 'shared' }], output: [] } },
      { line: 2, note: 'Iterations 1 and 2 do the same. Three callbacks — all pointing at the SAME record.', state: { frames: [{ id: 'shared', label: 'Enclosing scope (ONE shared record)', bindings: [{ name: 'i', value: '2' }], status: 'executing', parentId: null }], refs: [{ from: 'callback #0', toFrameId: 'shared' }, { from: 'callback #1', toFrameId: 'shared' }, { from: 'callback #2', toFrameId: 'shared' }], output: [] } },
      { line: 3, note: 'The loop exits when i++ reaches 3. The shared record now reads i: 3 — and only the callbacks keep it alive.', state: { frames: [{ id: 'shared', label: 'Enclosing scope (ONE shared record)', bindings: [{ name: 'i', value: '3' }], status: 'retained', parentId: null }], refs: [{ from: 'callback #0', toFrameId: 'shared' }, { from: 'callback #1', toFrameId: 'shared' }, { from: 'callback #2', toFrameId: 'shared' }], output: [] } },
      { line: 4, note: 'The event loop runs callback #0 (see the Event Loop drill above): it reads i through its link → 3.', state: { frames: [{ id: 'shared', label: 'Enclosing scope (ONE shared record)', bindings: [{ name: 'i', value: '3' }], status: 'retained', parentId: null }], refs: [{ from: 'callback #0', toFrameId: 'shared' }, { from: 'callback #1', toFrameId: 'shared' }, { from: 'callback #2', toFrameId: 'shared' }], output: ['3'] } },
      { line: 4, note: 'Callbacks #1 and #2 read the very same binding. 3, 3, 3 — the classic.', state: { frames: [{ id: 'shared', label: 'Enclosing scope (ONE shared record)', bindings: [{ name: 'i', value: '3' }], status: 'retained', parentId: null }], refs: [{ from: 'callback #0', toFrameId: 'shared' }, { from: 'callback #1', toFrameId: 'shared' }, { from: 'callback #2', toFrameId: 'shared' }], output: ['3', '3', '3'] } },
      { line: null, note: 'One record shared by every iteration = every callback sees the FINAL value. The fix: let (next sample) — or, pre-ES6, an IIFE per iteration.', state: { frames: [{ id: 'shared', label: 'Enclosing scope (ONE shared record)', bindings: [{ name: 'i', value: '3' }], status: 'retained', parentId: null }], refs: [{ from: 'callback #0', toFrameId: 'shared' }, { from: 'callback #1', toFrameId: 'shared' }, { from: 'callback #2', toFrameId: 'shared' }], output: ['3', '3', '3'] } },
    ],
  },
  {
    id: 'let-loop',
    label: 'let loop → 0,1,2',
    code: [
      'for (let i = 0; i < 3; i++) {',
      '  setTimeout(() => console.log(i));',
      '}',
      '// timers fire after the loop…',
    ].join('\n'),
    steps: [
      { line: 1, note: '`let` in a for-header is special-cased by the spec: EACH iteration gets its OWN fresh record.', state: { frames: [{ id: 'it0', label: 'Iteration 0 record', bindings: [{ name: 'i', value: '0' }], status: 'executing', parentId: null }], refs: [], output: [] } },
      { line: 2, note: 'Callback #0 captures iteration 0\\\'s record — where i is frozen at 0.', state: { frames: [{ id: 'it0', label: 'Iteration 0 record', bindings: [{ name: 'i', value: '0' }], status: 'retained', parentId: null }], refs: [{ from: 'callback #0', toFrameId: 'it0' }], output: [] } },
      { line: 2, note: 'Two more iterations → two more records, two more captures. Three records, three different i values.', state: { frames: [{ id: 'it0', label: 'Iteration 0 record', bindings: [{ name: 'i', value: '0' }], status: 'retained', parentId: null }, { id: 'it1', label: 'Iteration 1 record', bindings: [{ name: 'i', value: '1' }], status: 'retained', parentId: null }, { id: 'it2', label: 'Iteration 2 record', bindings: [{ name: 'i', value: '2' }], status: 'retained', parentId: null }], refs: [{ from: 'callback #0', toFrameId: 'it0' }, { from: 'callback #1', toFrameId: 'it1' }, { from: 'callback #2', toFrameId: 'it2' }], output: [] } },
      { line: 4, note: 'The timers fire: each callback reads its OWN record. 0, 1, 2.', state: { frames: [{ id: 'it0', label: 'Iteration 0 record', bindings: [{ name: 'i', value: '0' }], status: 'retained', parentId: null }, { id: 'it1', label: 'Iteration 1 record', bindings: [{ name: 'i', value: '1' }], status: 'retained', parentId: null }, { id: 'it2', label: 'Iteration 2 record', bindings: [{ name: 'i', value: '2' }], status: 'retained', parentId: null }], refs: [{ from: 'callback #0', toFrameId: 'it0' }, { from: 'callback #1', toFrameId: 'it1' }, { from: 'callback #2', toFrameId: 'it2' }], output: ['0', '1', '2'] } },
      { line: null, note: 'Per-iteration environments are the whole fix. Same code, one keyword, opposite output.', state: { frames: [{ id: 'it0', label: 'Iteration 0 record', bindings: [{ name: 'i', value: '0' }], status: 'retained', parentId: null }, { id: 'it1', label: 'Iteration 1 record', bindings: [{ name: 'i', value: '1' }], status: 'retained', parentId: null }, { id: 'it2', label: 'Iteration 2 record', bindings: [{ name: 'i', value: '2' }], status: 'retained', parentId: null }], refs: [{ from: 'callback #0', toFrameId: 'it0' }, { from: 'callback #1', toFrameId: 'it1' }, { from: 'callback #2', toFrameId: 'it2' }], output: ['0', '1', '2'] } },
    ],
  },
];
