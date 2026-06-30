# JavaScript Core Interview Questions

> 50+ questions with full answers. Practice out loud.

---

## Question: What is the difference between var, let, and const?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Scope and reassignment rules appear in almost every interview and code review.

### Answer
`var` is function-scoped and can be redeclared. `let` and `const` are block-scoped. `let` can be reassigned; `const` cannot be rebound, but object properties can still change.

### Example
```js
if (true) {
  var a = 1;
  let b = 2;
}
console.log(a); // 1
// console.log(b); // ReferenceError
const cfg = { theme: 'dark' };
cfg.theme = 'light'; // OK
```

### Follow-up Questions
- Can you redeclare let in the same block?
- Does const freeze objects?
- Why avoid var in new code?

### Common Mistakes
- Using var in loops with async callbacks
- Thinking const makes nested objects immutable
- Creating accidental globals

### Project Connection
Use const for DOM nodes and let for filter state in a todo app so bugs surface early.

---

## Question: What is hoisting in JavaScript?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Hoisting explains undefined variables and function declaration surprises.

### Answer
Declarations are registered before execution. var becomes undefined until its line runs. let/const are hoisted but in the TDZ until initialized. Function declarations hoist fully; function expressions follow variable rules.

### Example
```js
console.log(x); // undefined
var x = 5;
hi();
function hi() { console.log('hello'); }
```

### Follow-up Questions
- Are let and const hoisted?
- What hoists for var fn = function(){}?
- Module hoisting?

### Common Mistakes
- Assuming let is not hoisted
- Expecting expressions to hoist like declarations
- Relying on hoisting instead of clear order

### Project Connection
Helper used before declaration in a bundle may work with function declarations but fail with const arrow helpers.

---

## Question: What is the Temporal Dead Zone (TDZ)?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
TDZ tests real understanding of let and const beyond memorizing block scope.

### Answer
From the start of the block until the let/const line runs, the binding exists but cannot be read. Access throws ReferenceError. This prevents using variables before initialization.

### Example
```js
{
  // console.log(n); // ReferenceError — TDZ
  let n = 10;
  console.log(n); // 10
}
```

### Follow-up Questions
- TDZ for default parameters?
- typeof in TDZ?
- var vs TDZ behavior?

### Common Mistakes
- Accessing let before declaration
- Using var to avoid TDZ instead of reordering
- Confusing TDZ with no binding

### Project Connection
Form validation that destructures let { email } after an early return must keep declaration before use.

---

## Question: What is a closure?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Closures underpin callbacks, modules, and many React patterns.

### Answer
A closure is when an inner function remembers variables from the scope where it was created, even after the outer function finishes. The inner function keeps a live reference to those bindings.

### Example
```js
function makeAdder(x) {
  return function (y) { return x + y; };
}
const add5 = makeAdder(5);
console.log(add5(3)); // 8
```

### Follow-up Questions
- Value vs reference in closures?
- Memory leaks?
- Relation to lexical scope?

### Common Mistakes
- var in loops sharing one index
- Expecting fresh primitives incorrectly in timers
- Forgetting shared outer let

### Project Connection
Modal setTimeout still sees old state unless you close over refs or clear timers on unmount.

---

## Question: Why do closures in loops with var print the wrong index?

### Difficulty
🔴 Hard

### Why Interviewers Ask This
Classic async + scope interview puzzle.

### Answer
var is function-scoped, so one shared i exists. When timeouts run, i is already 3. Use let per iteration, an IIFE, or forEach with a parameter.

### Example
```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 3,3,3
}
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 0); // 0,1,2
}
```

### Follow-up Questions
- What does let do per iteration?
- Fix without let?
- Event listeners in a loop?

### Common Mistakes
- var in button click loops
- Wrong copy of index tricks
- Not testing async timing

### Project Connection
List of delete buttons: each handler needs the correct id via let, data-id, or delegation.

---

## Question: What is an IIFE?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Shows knowledge of pre-module isolation patterns.

### Answer
An Immediately Invoked Function Expression runs once at definition time, creating a private scope so variables do not leak globally. Less common with ES modules but still valid for isolating scripts.

### Example
```js
const api = (function () {
  let key = 'secret';
  return { getKey: () => key };
})();
```

### Follow-up Questions
- IIFE vs module?
- Arrow IIFE?
- Module pattern?

### Common Mistakes
- Missing wrapping parentheses
- IIFE instead of modules everywhere
- Thinking it runs later

### Project Connection
Legacy widget on a page without a bundler can expose one global via IIFE.

---

## Question: How does the this keyword work?

### Difficulty
🔴 Hard

### Why Interviewers Ask This
this breaks method callbacks, classes, and DOM handlers regularly.

### Answer
this depends on call site: implicit (obj.method), explicit (call/apply/bind), new binding, or default (undefined in strict mode). Arrow functions have no own this; they use lexical this from enclosing scope.

### Example
```js
const o = { name: 'A', f() { return this.name; } };
const g = o.f;
g(); // undefined in strict\ o.f(); // A
```

### Follow-up Questions
- this in class methods?
- Event listeners?
- Strict default binding?

### Common Mistakes
- Passing methods without bind
- Arrow as object method when dynamic this needed
- Assuming this is always the instance

### Project Connection
Submit handler passed to addEventListener loses this unless bound or arrow field.

---

## Question: What is the difference between call, apply, and bind?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Explicit this control appears in tests, utilities, and interviews.

### Answer
call invokes with thisArg and comma args. apply invokes with thisArg and an args array. bind returns a new function with fixed this and optional partial args without invoking yet.

### Example
```js
function show(a, b) { return `${this.tag}:${a}+${b}`; }
const ctx = { tag: 'X' };
show.call(ctx, 1, 2);
show.apply(ctx, [1, 2]);
const bound = show.bind(ctx, 1);
bound(2);
```

### Follow-up Questions
- bind vs arrow wrapper?
- Partial application?
- Binding constructors?

### Common Mistakes
- apply when call is clearer
- Forgetting bind returns new fn
- Re-bind every render unnecessarily

### Project Connection
Borrowing Array.prototype.slice.call(nodeList) is historical apply usage.

---

## Question: What is a prototype in JavaScript?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Prototypes explain how objects share methods, including under classes.

### Answer
Objects delegate to another object on missing properties. Functions have a prototype property used with new. Object.getPrototypeOf reads the link.

### Example
```js
const base = { greet() { return 'hi'; } };
const child = Object.create(base);
child.greet();
```

### Follow-up Questions
- __proto__ vs prototype?
- Prototype of {}?
- Classes vs prototypes?

### Common Mistakes
- Thinking classes are not prototypal
- Mutating Object.prototype
- Own vs inherited props

### Project Connection
array.map works via Array.prototype shared by all arrays.

---

## Question: How does prototypal inheritance work?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Interviewers want delegation explained without Java class copying.

### Answer
Instances link to a constructor's prototype object. Lookup walks the chain. Methods live once on the prototype.

### Example
```js
function Cat(name) { this.name = name; }
Cat.prototype.speak = function () { return this.name; };
const c = new Cat('Milo');
c.speak();
```

### Follow-up Questions
- What does new do?
- Shadowing prototype fields?
- instanceof checks?

### Common Mistakes
- Mutable data on prototype shared by instances
- Replacing prototype without constructor
- Lookup confusion

### Project Connection
Shared array on prototype mutates for all instances — put instance data in constructor.

---

## Question: How do ES6 classes relate to prototypes?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Modern syntax still sits on prototypes.

### Answer
class is syntactic sugar: methods go on the prototype, extends wires the chain, super calls parent prototype methods. typeof MyClass is function.

### Example
```js
class Point {
  constructor(x, y) { this.x = x; this.y = y; }
  len() { return Math.hypot(this.x, this.y); }
}
```

### Follow-up Questions
- Class fields vs prototype?
- super in constructor?
- Private #fields?

### Common Mistakes
- Forgetting super() in child
- Thinking methods copy per instance
- Overusing classes

### Project Connection
Legacy React class components use extends Component — same prototype idea.

---

## Question: What is the difference between == and ===?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Equality mistakes are common in forms and APIs.

### Answer
=== is strict equality without coercion. == coerces types and can surprise. Prefer === unless you intentionally coerce.

### Example
```js
0 == false; // true
0 === false; // false
null == undefined; // true
```

### Follow-up Questions
- When is == OK?
- Object.is?
- NaN checks?

### Common Mistakes
- == with strings and numbers
- === expecting deep object equality
- Truthy confusion

### Project Connection
Query params are strings; parseInt before comparing to numeric constants.

---

## Question: What is type coercion?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Coercion powers trick questions and real bugs with + and ==.

### Answer
JS converts values to string, number, or boolean in expressions. Implicit: ==, +, if. Explicit: Number(), String(), Boolean().

### Example
```js
'5' - 1; // 4
'5' + 1; // '51'
Boolean(''); // false
```

### Follow-up Questions
- Truthy/falsy list?
- Symbol coercion?
- + with objects?

### Common Mistakes
- String concat instead of add
- == across types
- null treated as 0 in math

### Project Connection
Normalize JSON price fields with Number() before cart math.

---

## Question: What is the JavaScript event loop?

### Difficulty
🔴 Hard

### Why Interviewers Ask This
Async ordering separates candidates who only use async/await syntax.

### Answer
JS runs one call stack. When empty, the event loop schedules macrotasks (timers, I/O) and microtasks (promises). Sync runs first, then microtasks, then next macrotask.

### Example
```js
console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve().then(() => console.log(3));
console.log(4); // 1,4,3,2
```

### Follow-up Questions
- Multithreaded JS?
- requestAnimationFrame?
- Web Workers?

### Common Mistakes
- setTimeout(0) immediate myth
- Ignoring microtasks
- Blocking main thread

### Project Connection
Promise then updates DOM before timeout — explains some paint ordering bugs.

---

## Question: What is the difference between microtasks and macrotasks?

### Difficulty
🔴 Hard

### Why Interviewers Ask This
Deepens event loop knowledge for promise/timer ordering.

### Answer
Macrotasks: setTimeout, setInterval, I/O. Microtasks: promise reactions, queueMicrotask. After each macrotask, all microtasks drain.

### Example
```js
setTimeout(() => console.log('macro'));
Promise.resolve().then(() => console.log('micro'));
```

### Follow-up Questions
- async/await queue?
- Infinite microtasks?
- Node nextTick?

### Common Mistakes
- Microtask starvation of timers
- await always macrotask myth
- Nested promise order confusion

### Project Connection
Search debounce vs promise microtasks affects which result wins.

---

## Question: What is a Promise?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Promises standardize async flow before and beside async/await.

### Answer
A Promise is pending, fulfilled, or rejected. then/catch/finally chain async results and errors.

### Example
```js
fetch('/api/data')
  .then(r => r.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

### Follow-up Questions
- Settled promises?
- Chaining?
- Unhandled rejection?

### Common Mistakes
- Missing return in then
- Callback pyramid inside then
- No final catch

### Project Connection
Refactoring nested fetch in a project to promises is a solid interview story.

---

## Question: How do async and await work?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Most codebases use async/await daily.

### Answer
async functions return a Promise. await pauses only inside the async function until a Promise settles. Use try/catch for errors.

### Example
```js
async function load() {
  try {
    const res = await fetch('/api/me');
    return await res.json();
  } catch (e) { return null; }
}
```

### Follow-up Questions
- Top-level await?
- Parallel await?
- Thrown errors become?

### Common Mistakes
- Sequential await in loops unnecessarily
- No try/catch
- async everywhere

### Project Connection
Promise.all for profile + settings parallel fetch improves load time.

---

## Question: When use Promise.all vs Promise.race?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Concurrent API design shows up in real apps.

### Answer
all waits for all (fails fast on any reject unless allSettled). race settles with the first fulfill or reject.

### Example
```js
const [a, b] = await Promise.all([fetchA(), fetchB()]);
const first = await Promise.race([slow(), timeout(5000)]);
```

### Follow-up Questions
- allSettled?
- Partial failure?
- Empty all?

### Common Mistakes
- race ignoring rejections win
- all with one failure
- Too many parallel calls

### Project Connection
Timeout wrapper with race is a practical pattern for slow APIs.

---

## Question: What is scope in JavaScript?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Scope is the foundation for closures and bugs with globals.

### Answer
Scope determines visibility. var is function-scoped; let/const are block-scoped. Inner reads outer; not vice versa.

### Example
```js
const g = 1;
function f() {
  const x = 2;
  if (true) { const y = 3; }
}
```

### Follow-up Questions
- Shadowing?
- Module scope?
- Implicit globals?

### Common Mistakes
- Missing const creates global
- Shadowing confusion
- var in blocks

### Project Connection
type=module scripts do not leak globals — fixes accidental window pollution.

---

## Question: What is lexical scope?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Lexical scope explains closures and arrow this.

### Answer
Scope is determined by source structure, not runtime call stack. Nested functions see outer bindings where written.

### Example
```js
function wrap(msg) {
  return () => console.log(msg);
}
const log = wrap('done');
log();
```

### Follow-up Questions
- Dynamic scope in JS?
- Blocks with let?
- vs this binding?

### Common Mistakes
- Confusing this with variable scope
- Expecting dynamic variable scope
- Hoisting mix-ups

### Project Connection
Hook closing over props uses lexical scope from the hook call.

---

## Question: What is a higher-order function?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
HOFs appear in array methods, React, and middleware.

### Answer
A function that takes and/or returns another function. Examples: map, filter, middleware, timers.

### Example
```js
function twice(fn) {
  return (x) => fn(fn(x));
}
const inc = (n) => n + 1;
twice(inc)(3); // 5
```

### Follow-up Questions
- HOF vs callback?
- React examples?
- Currying?

### Common Mistakes
- Side effects inside map
- New function each render without reason
- Unclear naming

### Project Connection
Express middleware chain is a higher-order function pattern.

---

## Question: What are callback functions?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Callbacks remain in DOM APIs and older Node code.

### Answer
A function passed to be run later — on events, timers, or async completion.

### Example
```js
btn.addEventListener('click', () => alert('hi'));
[1,2].forEach(n => console.log(n));
```

### Follow-up Questions
- Callback hell?
- Error-first style?
- vs promises?

### Common Mistakes
- Pyramid of doom
- Ignored err in Node
- No named callbacks

### Project Connection
Upload onprogress callback is a concrete UX story.

---

## Question: How does Array.prototype.map work?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Transforming lists is core UI work.

### Answer
map builds a new array from callback return values. Does not mutate the original.

### Example
```js
const ids = users.map(u => u.id);
```

### Follow-up Questions
- map vs forEach?
- Forgotten return?
- async map?

### Common Mistakes
- map for side effects
- undefined results
- map with async without Promise.all

### Project Connection
products.map to JSX list items is standard React.

---

## Question: How does Array.prototype.filter work?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Filtering drives search and tabs in student projects.

### Answer
filter returns elements where callback is truthy. New array; original unchanged.

### Example
```js
const active = users.filter(u => u.isActive);
```

### Follow-up Questions
- filter vs find?
- Mutating inside?
- Big arrays?

### Common Mistakes
- Mutating while filtering
- filter one item — use find
- Many chained filters

### Project Connection
Todo active tab: todos.filter(t => !t.done).

---

## Question: How does Array.prototype.reduce work?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
reduce tests accumulation and grouping skills.

### Answer
reduce combines array into one value via accumulator. Provide initial value for safety on empty arrays.

### Example
```js
const total = items.reduce((sum, i) => sum + i.price, 0);
```

### Follow-up Questions
- reduce vs loop?
- Build objects?
- No initial value?

### Common Mistakes
- Unreadable reduce
- Empty array without initial
- Inconsistent accumulator

### Project Connection
Cart total with reduce and initial 0 shows money handling.

---

## Question: What is array destructuring?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Destructuring simplifies unpacking arrays and swap patterns.

### Answer
Pull values from arrays into variables in one statement. Skip slots with commas; defaults apply when undefined.

### Example
```js
const [first, , third] = [1, 2, 3];
const [a = 0, b = 0] = [5];
```

### Follow-up Questions
- Rest in arrays?
- Nested destructuring?
- Swap variables?

### Common Mistakes
- Confusing holes with undefined
- Default vs null
- Mutating source

### Project Connection
const [err, data] = tuple-style results from a helper.

---

## Question: What is object destructuring?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Unpacking props and API JSON is everyday frontend work.

### Answer
Extract properties into variables, rename with colon, defaults for missing keys.

### Example
```js
const { name, age = 18 } = user;
const { title: job } = profile;
```

### Follow-up Questions
- Nested destructuring?
- Default with null?
- In function parameters?

### Common Mistakes
- Default not applied for null
- Wrong rename syntax
- Destructuring undefined

### Project Connection
function Card({ title, onClick }) — props destructuring in React.

---

## Question: What is the spread operator?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Spread copies and merges immutably in React state updates.

### Answer
Expands iterables into elements or object properties. Common for shallow copies and merging.

### Example
```js
const next = { ...user, name: 'New' };
const all = [...a, ...b];
```

### Follow-up Questions
- Spread vs rest?
- Shallow copy?
- Order in objects?

### Common Mistakes
- Expecting deep clone
- Mutating after spread assuming isolation of nested
- Spreading non-iterables

### Project Connection
setState({ ...state, count: state.count + 1 }) pattern.

---

## Question: What is the rest parameter?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Rest collects remaining args or array tail.

### Answer
In parameters, rest gathers extra arguments into an array. In destructuring, rest collects remaining properties.

### Example
```js
function sum(first, ...rest) {
  return rest.reduce((a, n) => a + n, first);
}
const { id, ...meta } = record;
```

### Follow-up Questions
- rest vs arguments?
- rest position rules?
- rest in destructuring?

### Common Mistakes
- rest not last in params
- Using arguments in arrow functions
- Confusing spread and rest

### Project Connection
Forward unknown props with ...rest in a wrapper component.

---

## Question: How do ES modules import and export work?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Modules are standard in Vite, React, and Node ESM.

### Answer
export names values; import pulls bindings (live for exports). Default vs named exports. import() for dynamic loading.

### Example
```js
// math.js
export const PI = 3.14;
export default function add(a, b) { return a + b; }
// app.js
import add, { PI } from './math.js';
```

### Follow-up Questions
- Default vs named?
- Tree shaking?
- Circular imports?

### Common Mistakes
- Mixing require and import
- No .js extension in browser bare imports without bundler
- Importing default wrong

### Project Connection
Vite project structure story: splitting utils into named exports.

---

## Question: How does try/catch/finally work?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Error handling shows production-minded coding.

### Answer
try runs code; catch handles thrown errors; finally runs always (cleanup). throw creates errors. async/await uses try/catch around await.

### Example
```js
try {
  JSON.parse('bad');
} catch (e) {
  console.error(e.message);
} finally {
  console.log('done');
}
```

### Follow-up Questions
- Custom errors?
- finally return behavior?
- Errors in promises?

### Common Mistakes
- Empty catch swallowing errors
- throw string not Error
- No catch on async

### Project Connection
Parse localStorage JSON in try/catch to avoid blank screen on corrupt data.

---

## Question: What causes memory leaks in JavaScript?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Leaks show up in SPAs with listeners and detached DOM.

### Answer
Common causes: forgotten event listeners, timers, closures holding large objects, detached DOM nodes still referenced, unbounded caches.

### Example
```js
const huge = new Array(1e6).fill(0);
window._cache = huge; // never cleared
```

### Follow-up Questions
- GC basics?
- WeakMap use?
- DevTools heap snapshot?

### Common Mistakes
- No removeEventListener
- setInterval without clear
- Global caches growing forever

### Project Connection
SPA route change: remove listeners and abort fetch in cleanup.

---

## Question: How does garbage collection work (basics)?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
GC explains why leaks matter and when objects die.

### Answer
Engines reclaim memory when objects are unreachable from roots (global, call stack, closures). Mark-and-sweep is common. You do not free manually; drop references and avoid retaining graphs.

### Example
```js
let obj = { big: new Uint8Array(1e7) };
obj = null; // data may be collected if no other refs
```

### Follow-up Questions
- Generational GC?
- FinalizationRegistry?
- Circular refs?

### Common Mistakes
- Assuming delete frees memory
- Retaining via closure
- Debugging without heap tools

### Project Connection
Clearing cache Map on logout prevents retained user objects.

---

## Question: What is debouncing?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Debounce improves search and resize handlers.

### Answer
Debounce delays invoking a function until calls stop for a wait period. Only the last call runs. Great for search input.

### Example
```js
function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}
```

### Follow-up Questions
- Debounce vs throttle?
- Leading edge?
- Cancel debounce?

### Common Mistakes
- Debounce on every keystroke with 0ms confusion
- No cleanup on unmount
- Throttle when debounce needed

### Project Connection
Search-as-you-type with 300ms debounce reduces API load.

---

## Question: What is throttling?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Throttle limits high-frequency events like scroll.

### Answer
Throttle runs at most once per interval while events fire. Useful for scroll, resize, mousemove.

### Example
```js
function throttle(fn, wait) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= wait) { last = now; fn(...args); }
  };
}
```

### Follow-up Questions
- throttle vs debounce?
- trailing vs leading?
- requestAnimationFrame scroll?

### Common Mistakes
- Throttle search input
- Debounce scroll
- No passive listeners on touch

### Project Connection
Infinite scroll loads next page on throttled scroll near bottom.

---

## Question: What is currying?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Currying transforms multi-arg functions into a chain of unary functions.

### Answer
Transform f(a,b) into f(a)(b) for partial application and reusable specialized functions.

### Example
```js
const multiply = a => b => a * b;
const double = multiply(2);
double(5); // 10
```

### Follow-up Questions
- Currying vs partial bind?
- Practical uses?
- Auto curry utilities?

### Common Mistakes
- Currying everything unreadably
- Confusing with bind
- Arity mistakes

### Project Connection
Create locale formatters with curried Intl options.

---

## Question: What is shallow copy vs deep copy?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Copy bugs mutate shared nested state in React.

### Answer
Shallow copy duplicates top level; nested objects shared. Spread/Object.assign are shallow. Deep copy duplicates nested structure (structuredClone, JSON trick, libraries).

### Example
```js
const a = { x: { y: 1 } };
const b = { ...a };
b.x.y = 2;
console.log(a.x.y); // 2
```

### Follow-up Questions
- structuredClone limits?
- JSON deep copy caveats?
- Immer?

### Common Mistakes
- Spread thinking deep clone
- JSON losing Date/Map
- Expensive deep clone always

### Project Connection
Immutable update: copy top level and nested path you change.

---

## Question: What do Object.freeze, seal, and preventExtensions do?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Immutability helpers appear in state management discussions.

### Answer
preventExtensions: no new properties. seal: preventExtensions + cannot delete/reconfigure properties. freeze: seal + cannot change values (shallow).

### Example
```js
const o = Object.freeze({ a: 1 });
o.a = 2; // fails silently or throws in strict
```

### Follow-up Questions
- Deep freeze?
- freeze vs const?
- Writable flags?

### Common Mistakes
- Thinking freeze is deep
- Mutating nested objects
- Relying on freeze for all immutability

### Project Connection
Document why you use immer instead of manual freeze for nested state.

---

## Question: What useful array methods should you know beyond map/filter?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Breadth of array API signals practical JS fluency.

### Answer
find, findIndex, some, every, includes, flat, flatMap, at, toSorted (non-mutating sort in modern JS).

### Example
```js
const user = users.find(u => u.id === 3);
const ok = items.every(i => i.qty > 0);
const nested = [1, [2, 3]].flat();
```

### Follow-up Questions
- find vs filter?
- sort mutates?
- at(-1)?

### Common Mistakes
- filter()[0] instead of find
- Mutating sort on shared state
- indexOf with NaN

### Project Connection
find user by id in admin table instead of manual loop.

---

## Question: What string methods are commonly used in interviews?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
String parsing appears in forms, URLs, and slugs.

### Answer
includes, startsWith, endsWith, slice, substring, split, trim, replace, replaceAll, padStart.

### Example
```js
const slug = title.trim().toLowerCase().replaceAll(' ', '-');
const ext = file.slice(file.lastIndexOf('.'));
```

### Follow-up Questions
- slice vs substring negative index?
- Immutable strings?
- Template literals vs concat?

### Common Mistakes
- Mutating strings like arrays
- split regex pitfalls
- Locale case issues

### Project Connection
Validate email with includes and regex, not only includes('@').

---

## Question: What are JSON.stringify and JSON.parse?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
JSON is the lingua franca of APIs and localStorage.

### Answer
stringify converts JS values to JSON text; parse converts JSON text to values. Dates become strings; undefined/functions omitted in objects.

### Example
```js
const raw = JSON.stringify({ a: 1 });
const obj = JSON.parse(raw);
```

### Follow-up Questions
- reviver/replacer?
- BigInt?
- Security parse untrusted?

### Common Mistakes
- Parse without try/catch
- Assuming Date auto-revives
- Circular structure stringify error

### Project Connection
Persist todos to localStorage with JSON.stringify.

---

## Question: What does typeof return?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
typeof helps quick type checks with known quirks.

### Answer
Returns string labels: undefined, boolean, string, number, bigint, symbol, function, object. typeof null is 'object' (historical bug).

### Example
```js
typeof 42; // 'number'
typeof null; // 'object'
typeof (() => {}); // 'function'
```

### Follow-up Questions
- typeof array?
- Safe typeof undeclared?
- undefined vs undeclared?

### Common Mistakes
- Checking arrays with typeof only
- typeof null as object confusion
- typeof NaN

### Project Connection
Guard API fields: typeof fn === 'function' before calling callback.

---

## Question: What does instanceof check?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
instanceof tests prototype chain membership.

### Answer
Returns true if prototype of constructor appears in object's chain. Useful for built-ins and custom classes; fragile across realms/iframes.

### Example
```js
[] instanceof Array; // true
({}) instanceof Object; // true
```

### Follow-up Questions
- instanceof vs Array.isArray?
- Symbol.hasInstance?
- Cross-realm?

### Common Mistakes
- instanceof for primitives
- Array.isArray forgotten
- Custom inheritance breaks instanceof

### Project Connection
Use Array.isArray on API JSON before map.

---

## Question: What is nullish coalescing (??)?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
?? avoids bugs where || treats 0 and '' as missing.

### Answer
?? returns right side only when left is null or undefined, not other falsy values.

### Example
```js
const port = config.port ?? 3000;
const name = input ?? 'Guest';
0 ?? 5; // 0
```

### Follow-up Questions
- ?? vs ||?
- Mixing with && without parens?
- Default params?

### Common Mistakes
- || when 0 is valid
- Precedence bugs with &&
- ?? with undefined only confusion

### Project Connection
Pagination page 0 must use ?? not || for default page.

---

## Question: What is optional chaining (?.)?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Optional chaining shortens safe deep reads from APIs.

### Answer
?. stops evaluation and returns undefined if base is null/undefined before property, call, or bracket access.

### Example
```js
const city = user?.address?.city;
const len = arr?.length;
obj?.method?.();
```

### Follow-up Questions
- ?. with calls?
- Combining with ??
- Performance?

### Common Mistakes
- Optional chain instead of validation
- ?. on guaranteed values overuse
- Bracket optional chaining syntax

### Project Connection
Render profile city without crashing when address missing from API.

---

## Question: What are generator functions (basics)?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Generators introduce pause/resume iteration beyond arrays.

### Answer
function* yields values lazily. Returns iterator with next(). Useful for infinite sequences and custom iteration.

### Example
```js
function* ids() {
  let i = 0;
  while (true) yield i++;
}
const gen = ids();
gen.next().value; // 0
```

### Follow-up Questions
- yield* delegation?
- Generators vs async?
- for..of over generator?

### Common Mistakes
- Generator without calling next
- Confusing with async function*
- Infinite generator without take limit

### Project Connection
Paginate API with generator yielding pages until empty.

---

## Question: What is a Symbol (basics)?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Symbols provide unique property keys.

### Answer
Symbol() creates unique identifiers, useful for meta keys and avoiding name clashes. Well-known symbols like Symbol.iterator customize behavior.

### Example
```js
const id = Symbol('id');
const user = { [id]: 42, name: 'Sam' };
Object.keys(user); // ['name'] only
```

### Follow-up Questions
- Symbol.for?
- JSON serialization?
- iterator symbol?

### Common Mistakes
- Expecting Symbol in JSON
- Symbol as string key typo
- Overusing Symbol everywhere

### Project Connection
Library adds hidden metadata with Symbol so it does not collide with user keys.

---

## Question: What are WeakMap and WeakSet?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Weak collections tie to GC for metadata without leaks.

### Answer
WeakMap keys must be objects, held weakly (no prevent GC). WeakSet stores objects weakly. Not iterable.

### Example
```js
const wm = new WeakMap();
let el = document.createElement('div');
wm.set(el, { clicks: 0 });
```

### Follow-up Questions
- WeakMap vs Map?
- Primitive keys?
- Use cases?

### Common Mistakes
- Trying to iterate WeakMap
- Expecting size property reliably
- Using WeakMap as general cache

### Project Connection
Attach private data to DOM nodes without expanding global registries.

---

## Question: What is an execution context?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Execution context links hoisting, scope, and this.

### Answer
Each time code runs, an execution context is created with variable environment, lexical environment, and this binding. Call stack holds contexts for nested calls.

### Example
```js
function outer() {
  const a = 1;
  function inner() { console.log(a); }
  inner();
}
outer();
```

### Follow-up Questions
- Creation vs execution phase?
- Global vs function context?
- ES6 block context?

### Common Mistakes
- Confusing context with scope object only
- this in nested arrow
- Stack overflow recursion

### Project Connection
Explaining why inner function sees a is lexical environment + context.

---

## Question: How do arrow functions differ from regular functions?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Arrows change this, arguments, and constructor use.

### Answer
Arrows have no own this, arguments, super, or new.target. Cannot be constructors. Concise syntax; implicit return for expressions.

### Example
```js
const obj = {
  n: 1,
  regular() { return this.n; },
  arrow: () => this, // lexical this (often window)
};
```

### Follow-up Questions
- Arrow in object methods?
- Arrow as constructor?
- Returning objects with implicit return?

### Common Mistakes
- Arrow object methods losing this
- new Arrow()
- Implicit return { key: 1 } needs parens

### Project Connection
Use regular methods in class/object; arrows for callbacks needing lexical this.

---

## Question: What are template literals?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Template literals simplify strings and interpolation.

### Answer
Backtick strings support ${expression} interpolation and multiline text without concatenation.

### Example
```js
const name = 'Lee';
const msg = `Hello, ${name}!
Welcome.`;
```

### Follow-up Questions
- Tagged templates?
- Nesting ${}?
- Security XSS?

### Common Mistakes
- HTML injection in templates
- Using quotes instead of backticks
- Forgetting escape in user HTML

### Project Connection
Build email preview strings with multiline templates in a Node script.

---

## Question: What are default parameters?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Defaults document API and avoid undefined checks.

### Answer
Default values apply when argument is undefined (not necessarily for null). Can use expressions evaluated at call time.

### Example
```js
function greet(name = 'Guest', punct = '!') {
  return `Hi ${name}${punct}`;
}
greet(undefined, '!!');
```

### Follow-up Questions
- null vs undefined defaults?
- TDZ in defaults?
- Default object literals?

### Common Mistakes
- || defaults when 0 valid
- Mutable default object shared
- Parameter order mistakes

### Project Connection
API wrapper function sets default timeout ms for fetch helper.

---

## Question: What is rest in destructuring?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Rest collects remaining properties when picking a few fields.

### Answer
In object destructuring, ...rest gathers leftover own enumerable properties into a new object.

### Example
```js
const { password, ...safeUser } = user;
console.log(safeUser); // no password field
```

### Follow-up Questions
- rest must be last?
- rest in arrays?
- Shallow copy via rest?

### Common Mistakes
- rest before other props
- Expecting deep omit
- Renaming and rest confusion

### Project Connection
Strip sensitive fields before logging user object to analytics.

---

## Question: What is the difference between function declarations and expressions?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Declaration vs expression ties directly to hoisting interviews.

### Answer
Declarations: function name() {} — hoisted wholly. Expressions: const fn = function() {} or arrow — follow variable hoisting rules.

### Example
```js
foo();
function foo() {}
// bar(); // error
const bar = () => {};
```

### Follow-up Questions
- Named function expression?
- Anonymous vs named for stacks?
- Conditional declarations?

### Common Mistakes
- Using expression before line
- function if(true){} pitfalls in blocks
- Mixing forms inconsistently

### Project Connection
Put hoisted helpers as declarations or define expressions before use in modules.

---

## Question: How does Promise chaining work?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Chaining shows fluency before async/await.

### Answer
then returns a new Promise, allowing sequential async steps. Return values wrap in resolved Promise; thrown errors reject.

### Example
```js
return fetch('/a')
  .then(r => r.json())
  .then(data => fetch(`/b/${data.id}`))
  .then(r => r.json());
```

### Follow-up Questions
- then vs catch order?
- Returning promises inside then?
- Anti-pattern nested then?

### Common Mistakes
- Nested then pyramids
- Forgot return Promise in then
- Swallowing errors

### Project Connection
Chain token refresh then retry original request in auth interceptor story.

---

## Question: What is the difference between slice and splice?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Students confuse mutating vs non-mutating array methods.

### Answer
slice returns a shallow copy portion without mutating. splice mutates array by removing/replacing/adding elements.

### Example
```js
const a = [1,2,3,4];
a.slice(1,3); // [2,3], a unchanged
a.splice(1,2,'x'); // mutates a
```

### Follow-up Questions
- Negative slice index?
- splice return value?
- Copy array best practice?

### Common Mistakes
- splice when slice intended
- Mutating shared state array
- slice on string vs substring

### Project Connection
Immutable update: use slice/spread instead of splice on Redux state.

---

## Question: What is strict mode?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Strict mode catches silent errors and changes this binding.

### Answer
'use strict' enables stricter parsing and runtime: no implicit globals, duplicate params error, this undefined in plain calls, etc.

### Example
```js
'use strict';
function f() { console.log(this); }
f(); // undefined
```

### Follow-up Questions
- Modules strict by default?
- delete non-configurable?
- Octal literals?

### Common Mistakes
- Strict in only one file mixed bundle
- Deleting variables
- with statement in strict

### Project Connection
ES modules are strict — explains why top-level this is undefined.

---

## Question: What is the difference between null and undefined?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
API JSON and defaults interviews love this distinction.

### Answer
undefined means missing or uninitialized. null is an intentional empty value. typeof null is object; typeof undefined is undefined.

### Example
```js
let x;
console.log(x); // undefined
const y = null;
```

### Follow-up Questions
- JSON null?
- Default params undefined?
- == null check?

### Common Mistakes
- Using both interchangeably in APIs
- Not documenting which API returns
- null prototype confusion

### Project Connection
Document whether your API uses null or omits keys for missing optional fields.

---

## Question: How do you copy an array immutably?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Immutable updates are expected in React state.

### Answer
Use spread [...arr], slice(), Array.from(arr), or toSorted/toReversed for non-mutating variants.

### Example
```js
const copy = [...items];
const sorted = [...items].sort((a,b)=>a-b);
// or items.toSorted() in modern JS
```

### Follow-up Questions
- Shallow array copy?
- Nested arrays?
- structuredClone?

### Common Mistakes
- sort() mutating original
- Assigning reference only
- Deep nested copy forgotten

### Project Connection
Add item: setItems([...items, newItem]) in React.

---

## Question: What is event delegation?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Delegation connects DOM chapter to JS core callbacks.

### Answer
Attach one listener on parent; use event.target to handle children. Works with dynamic nodes and fewer listeners.

### Example
```js
document.querySelector('#list').addEventListener('click', (e) => {
  if (e.target.matches('button.delete')) { /* ... */ }
});
```

### Follow-up Questions
- Propagation phases?
- matches vs closest?
- Performance?

### Common Mistakes
- Listener per row on big tables
- Wrong target without closest
- Stopping propagation too aggressively

### Project Connection
Todo list: one listener on ul instead of per li button.

---

## Question: What is the module pattern vs ES modules?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Clarifies history and modern bundler workflow.

### Answer
Module pattern uses closures/IIFE to hide private state and expose public API. ES modules use import/export with static structure and browser/Node support.

### Example
```js
// ES module
export function createStore() { let s = 0; return { inc: () => ++s }; }
```

### Follow-up Questions
- CJS vs ESM?
- Dynamic import?
- Tree shaking?

### Common Mistakes
- Mixing patterns in one file
- Expecting IIFE private fields in ESM without closure
- Circular deps unhandled

### Project Connection
Migrate school script tags to Vite ESM for clearer dependencies.

---

