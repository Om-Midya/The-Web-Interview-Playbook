import type { StepperSample } from '../lib/stepper';

export interface CoercionState {
  /** Current rewritten form of the expression. */
  expr: string;
  /** Rule just applied to reach `expr`; null when a fresh expression is introduced. */
  rule: string | null;
  /** All forms of the CURRENT expression so far, oldest first, `expr` last. */
  history: string[];
  /** Final value, set only when the walk completes. */
  verdict: string | null;
}

export const COERCION_TRACES: StepperSample<CoercionState>[] = [
  {
    id: 'truthiness-trap',
    label: '[] == ![]',
    code: 'console.log([] == ![]);',
    steps: [
      { line: 1, note: 'The classic. `!` binds tighter than `==`, so evaluate `![]` first.', state: { expr: '[] == ![]', rule: null, history: ['[] == ![]'], verdict: null } },
      { line: 1, note: 'An array is an object, and EVERY object is truthy — even an empty one. So `![]` is false.', state: { expr: '[] == false', rule: '![] → false (objects are always truthy)', history: ['[] == ![]', '[] == false'], verdict: null } },
      { line: 1, note: 'Abstract Equality rule: a boolean operand converts to a NUMBER first — before the other side is touched.', state: { expr: '[] == 0', rule: 'ToNumber(false) → 0', history: ['[] == ![]', '[] == false', '[] == 0'], verdict: null } },
      { line: 1, note: 'Object vs number → the object goes through ToPrimitive. [].toString() joins zero elements: "".', state: { expr: "'' == 0", rule: "ToPrimitive([]) → ''", history: ['[] == ![]', '[] == false', '[] == 0', "'' == 0"], verdict: null } },
      { line: 1, note: 'String vs number → the string converts with ToNumber. An empty string is 0.', state: { expr: '0 == 0', rule: "ToNumber('') → 0", history: ['[] == ![]', '[] == false', '[] == 0', "'' == 0", '0 == 0'], verdict: null } },
      { line: 1, note: 'Same type at last: 0 equals 0. So [] == ![] is true — five silent conversions deep.', state: { expr: '0 == 0', rule: 'same type → strict compare', history: ['[] == ![]', '[] == false', '[] == 0', "'' == 0", '0 == 0'], verdict: 'true' } },
    ],
  },
  {
    id: 'plus-minus',
    label: "'5' + 3 vs '5' - 3",
    code: ["console.log('5' + 3);", "console.log('5' - 3);"].join('\n'),
    steps: [
      { line: 1, note: '`+` is the only arithmetic operator with a second job: if EITHER side is a string, it concatenates.', state: { expr: "'5' + 3", rule: null, history: ["'5' + 3"], verdict: null } },
      { line: 1, note: 'Left side is a string → concat wins. The number converts to a string.', state: { expr: "'5' + '3'", rule: "ToString(3) → '3'", history: ["'5' + 3", "'5' + '3'"], verdict: null } },
      { line: 1, note: 'Concatenate: "53". Not 8. This bites with form inputs — their values are ALWAYS strings.', state: { expr: "'53'", rule: 'concatenate', history: ["'5' + 3", "'5' + '3'", "'53'"], verdict: "'53'" } },
      { line: 2, note: 'Now `-`. Minus has no string meaning — it is numbers-only, so this time the STRING converts.', state: { expr: "'5' - 3", rule: null, history: ["'5' - 3"], verdict: null } },
      { line: 2, note: 'ToNumber("5") is 5.', state: { expr: '5 - 3', rule: "ToNumber('5') → 5", history: ["'5' - 3", '5 - 3'], verdict: null } },
      { line: 2, note: 'Same operands, opposite directions: + pulled toward strings, - pulled toward numbers.', state: { expr: '2', rule: 'subtract', history: ["'5' - 3", '5 - 3', '2'], verdict: '2' } },
    ],
  },
  {
    id: 'null-family',
    label: 'null == vs null >=',
    code: ['console.log(null == undefined);', 'console.log(null == 0);', 'console.log(null >= 0);'].join('\n'),
    steps: [
      { line: 1, note: 'The Abstract Equality algorithm has a hard-coded case: null and undefined equal EACH OTHER…', state: { expr: 'null == undefined', rule: null, history: ['null == undefined'], verdict: null } },
      { line: 1, note: '…with no coercion at all. True, by decree.', state: { expr: 'null == undefined', rule: 'null ↔ undefined special case', history: ['null == undefined'], verdict: 'true' } },
      { line: 2, note: 'So null == 0 must also be true, right? No — that special case is the ONLY loose equality null has.', state: { expr: 'null == 0', rule: null, history: ['null == 0'], verdict: null } },
      { line: 2, note: 'No branch of the algorithm matches null vs number → false. Nothing even converts.', state: { expr: 'null == 0', rule: 'no matching branch → false', history: ['null == 0'], verdict: 'false' } },
      { line: 3, note: 'But RELATIONAL operators run a different algorithm — they ToNumber both sides.', state: { expr: 'null >= 0', rule: null, history: ['null >= 0'], verdict: null } },
      { line: 3, note: 'ToNumber(null) is 0. (ToNumber(undefined) would be NaN — undefined >= 0 is false.)', state: { expr: '0 >= 0', rule: 'ToNumber(null) → 0', history: ['null >= 0', '0 >= 0'], verdict: null } },
      { line: 3, note: 'So null >= 0 is true while null == 0 is false. Different algorithms, different answers.', state: { expr: '0 >= 0', rule: '0 >= 0 → true', history: ['null >= 0', '0 >= 0'], verdict: 'true' } },
    ],
  },
  {
    id: 'object-plus',
    label: '[] + {}',
    code: 'console.log([] + {});',
    steps: [
      { line: 1, note: '`+` with two objects: both sides go through ToPrimitive before + decides what to do.', state: { expr: '[] + {}', rule: null, history: ['[] + {}'], verdict: null } },
      { line: 1, note: 'ToPrimitive([]) → "" — an empty array joins to an empty string.', state: { expr: "'' + {}", rule: "ToPrimitive([]) → ''", history: ['[] + {}', "'' + {}"], verdict: null } },
      { line: 1, note: 'ToPrimitive({}) → "[object Object]" — the default Object.prototype.toString.', state: { expr: "'' + '[object Object]'", rule: "ToPrimitive({}) → '[object Object]'", history: ['[] + {}', "'' + {}", "'' + '[object Object]'"], verdict: null } },
      { line: 1, note: 'A string on either side → concat. (Typed at a REPL, {} + [] can differ — a leading {} parses as a BLOCK, not an object.)', state: { expr: "'[object Object]'", rule: 'concatenate', history: ['[] + {}', "'' + {}", "'' + '[object Object]'", "'[object Object]'"], verdict: "'[object Object]'" } },
    ],
  },
];
