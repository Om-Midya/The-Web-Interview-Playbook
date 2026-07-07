import type { StepperSample } from '../lib/stepper';

export interface HoistState {
  phase: 'creation' | 'execution';
  bindings: { name: string; kind: string; value: string }[];
  output: string[];
}

export const HOIST_TRACES: StepperSample<HoistState>[] = [
  {
    id: 'var-let-tdz',
    label: 'var vs let (TDZ)',
    code: ['console.log(a);', 'console.log(b);', 'var a = 1;', 'let b = 2;'].join('\n'),
    steps: [
      { line: null, note: 'CREATION PHASE: before any line runs, the engine registers every declaration in scope.', state: { phase: 'creation', bindings: [], output: [] } },
      { line: 3, note: '`var a` is hoisted AND initialized to undefined — usable (as undefined) from line 1.', state: { phase: 'creation', bindings: [{ name: 'a', kind: 'var', value: 'undefined' }], output: [] } },
      { line: 4, note: '`let b` is ALSO hoisted — but left uninitialized. Until line 4 executes, b is in the Temporal Dead Zone.', state: { phase: 'creation', bindings: [{ name: 'a', kind: 'var', value: 'undefined' }, { name: 'b', kind: 'let', value: 'TDZ' }], output: [] } },
      { line: 1, note: 'EXECUTION PHASE: a exists with value undefined, so this logs "undefined" — no error.', state: { phase: 'execution', bindings: [{ name: 'a', kind: 'var', value: 'undefined' }, { name: 'b', kind: 'let', value: 'TDZ' }], output: ['undefined'] } },
      { line: 2, note: 'b is still in the TDZ — accessing it THROWS: ReferenceError: Cannot access \'b\' before initialization.', state: { phase: 'execution', bindings: [{ name: 'a', kind: 'var', value: 'undefined' }, { name: 'b', kind: 'let', value: 'TDZ' }], output: ['undefined', '💥 ReferenceError: Cannot access \'b\' before initialization'] } },
      { line: null, note: 'Key takeaway: BOTH are hoisted. var initializes to undefined; let/const hoist uninitialized (TDZ) until their declaration line runs.', state: { phase: 'execution', bindings: [{ name: 'a', kind: 'var', value: 'undefined' }, { name: 'b', kind: 'let', value: 'TDZ' }], output: ['undefined', '💥 ReferenceError: Cannot access \'b\' before initialization'] } },
    ],
  },
  {
    id: 'function-hoisting',
    label: 'declaration vs expression',
    code: ['hi();', 'bye();', 'function hi() {', "  console.log('hi');", '}', 'var bye = function () {', "  console.log('bye');", '};'].join('\n'),
    steps: [
      { line: 3, note: 'CREATION: function DECLARATIONS hoist completely — name and body. hi is callable before its line.', state: { phase: 'creation', bindings: [{ name: 'hi', kind: 'function', value: 'ƒ hi()' }], output: [] } },
      { line: 6, note: 'CREATION: bye is just a `var` holding a function EXPRESSION — only the var hoists, as undefined.', state: { phase: 'creation', bindings: [{ name: 'hi', kind: 'function', value: 'ƒ hi()' }, { name: 'bye', kind: 'var', value: 'undefined' }], output: [] } },
      { line: 1, note: 'EXECUTION: hi is a complete function already — this works.', state: { phase: 'execution', bindings: [{ name: 'hi', kind: 'function', value: 'ƒ hi()' }, { name: 'bye', kind: 'var', value: 'undefined' }], output: ['hi'] } },
      { line: 2, note: 'bye is undefined right now — calling undefined THROWS: TypeError: bye is not a function.', state: { phase: 'execution', bindings: [{ name: 'hi', kind: 'function', value: 'ƒ hi()' }, { name: 'bye', kind: 'var', value: 'undefined' }], output: ['hi', '💥 TypeError: bye is not a function'] } },
      { line: null, note: 'Takeaway: declarations hoist fully; function expressions follow their variable\'s rules (var → undefined, let/const → TDZ).', state: { phase: 'execution', bindings: [{ name: 'hi', kind: 'function', value: 'ƒ hi()' }, { name: 'bye', kind: 'var', value: 'undefined' }], output: ['hi', '💥 TypeError: bye is not a function'] } },
    ],
  },
];
