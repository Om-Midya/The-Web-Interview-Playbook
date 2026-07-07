import type { StepperSample } from '../lib/stepper';

export type RuleStatus = 'pending' | 'checking' | 'matched' | 'skipped';

export interface ThisState {
  ladder: { rule: string; status: RuleStatus }[];
  thisValue: string;
  output: string[];
}

const RULES = [
  'new Fn()? → the new object',
  'fn.call / fn.apply / bound? → the given thisArg',
  'obj.fn()? → the object before the dot',
  'arrow function? → this of the enclosing scope',
  'default → undefined (strict) / globalThis',
];

const ladder = (statuses: RuleStatus[] = []): { rule: string; status: RuleStatus }[] =>
  RULES.map((rule, i) => ({ rule, status: statuses[i] ?? 'pending' }));

export const THIS_TRACES: StepperSample<ThisState>[] = [
  {
    id: 'method-vs-standalone',
    label: 'method vs standalone',
    code: ['const user = {', "  name: 'Ada',", '  hi() { console.log(this.name); }', '};', 'user.hi();', 'const f = user.hi;', 'f();'].join('\n'),
    steps: [
      { line: 5, note: 'user.hi() — walk the priority ladder top-down for THIS call site.', state: { ladder: ladder(['checking']), thisValue: '?', output: [] } },
      { line: 5, note: 'Not a `new` call, not call/apply/bind…', state: { ladder: ladder(['skipped', 'skipped', 'checking']), thisValue: '?', output: [] } },
      { line: 5, note: 'It IS obj.fn() — there\'s an object before the dot. this = user.', state: { ladder: ladder(['skipped', 'skipped', 'matched']), thisValue: 'user', output: [] } },
      { line: 3, note: 'this.name is user.name → logs "Ada".', state: { ladder: ladder(['skipped', 'skipped', 'matched']), thisValue: 'user', output: ['Ada'] } },
      { line: 6, note: 'f = user.hi COPIES the function reference. The object is NOT part of the function.', state: { ladder: ladder(), thisValue: '?', output: ['Ada'] } },
      { line: 7, note: 'f() — same ladder, new call site: no new, no bind, NO dot…', state: { ladder: ladder(['skipped', 'skipped', 'skipped', 'skipped', 'checking']), thisValue: '?', output: ['Ada'] } },
      { line: 7, note: 'Default binding: undefined in strict mode (modules are strict). this.name throws or logs undefined.', state: { ladder: ladder(['skipped', 'skipped', 'skipped', 'skipped', 'matched']), thisValue: 'undefined (strict)', output: ['Ada', '💥 TypeError: Cannot read properties of undefined'] } },
      { line: null, note: 'Takeaway: this is decided by HOW a function is CALLED — not where it was defined.', state: { ladder: ladder(['skipped', 'skipped', 'skipped', 'skipped', 'matched']), thisValue: 'undefined (strict)', output: ['Ada', '💥 TypeError: Cannot read properties of undefined'] } },
    ],
  },
  {
    id: 'arrow-lexical',
    label: 'arrow in a callback',
    code: ['const timer = {', "  name: 'T1',", '  start() {', '    setTimeout(() => {', '      console.log(this.name);', '    }, 0);', '  }', '};', 'timer.start();'].join('\n'),
    steps: [
      { line: 9, note: 'timer.start() — method call: inside start, this = timer.', state: { ladder: ladder(['skipped', 'skipped', 'matched']), thisValue: 'timer', output: [] } },
      { line: 4, note: 'The arrow function is created inside start(). Arrows have NO own this.', state: { ladder: ladder(), thisValue: '?', output: [] } },
      { line: 5, note: 'When the timer fires, the ladder for the arrow: rule 4 — arrow → use the ENCLOSING scope\'s this.', state: { ladder: ladder(['skipped', 'skipped', 'skipped', 'matched']), thisValue: 'timer (lexical)', output: [] } },
      { line: 5, note: 'this.name is timer.name → logs "T1". A regular function here would have gotten undefined instead.', state: { ladder: ladder(['skipped', 'skipped', 'skipped', 'matched']), thisValue: 'timer (lexical)', output: ['T1'] } },
      { line: null, note: 'Takeaway: arrows capture this from where they are WRITTEN; regular functions get this from how they are CALLED.', state: { ladder: ladder(['skipped', 'skipped', 'skipped', 'matched']), thisValue: 'timer (lexical)', output: ['T1'] } },
    ],
  },
];
