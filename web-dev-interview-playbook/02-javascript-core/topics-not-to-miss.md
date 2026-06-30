# JavaScript Core: Topics Not to Miss

Check off each topic before your interview.

## Variables & Scope

- [ ] `var` vs `let` vs `const` — hoisting, temporal dead zone
- [ ] Block scope vs function scope
- [ ] Global scope pollution and IIFE pattern
- [ ] Shadowing variables in nested scopes

## Data Types & Coercion

- [ ] Primitives: string, number, boolean, null, undefined, symbol, bigint
- [ ] Reference types: objects, arrays, functions
- [ ] `typeof` quirks (`typeof null === 'object'`)
- [ ] `==` vs `===` and when coercion happens
- [ ] Truthy/falsy values
- [ ] `NaN` checks (`Number.isNaN` vs `isNaN`)

## Functions

- [ ] Function declarations vs expressions vs arrow functions
- [ ] Arrow functions: no own `this`, no `arguments`, no constructor
- [ ] Closures — what they capture and why they matter
- [ ] IIFE use cases
- [ ] Higher-order functions (functions taking/returning functions)
- [ ] Default parameters and rest/spread (`...args`)

## `this` Keyword

- [ ] Implicit binding (method call)
- [ ] Explicit binding (`call`, `apply`, `bind`)
- [ ] `new` binding
- [ ] Arrow functions inherit `this` from enclosing scope
- [ ] Losing `this` in callbacks (classic interview trap)

## Prototypes & OOP

- [ ] Prototype chain and `__proto__` vs `prototype`
- [ ] `Object.create()`, `new`, constructor functions
- [ ] ES6 classes — syntactic sugar over prototypes
- [ ] `instanceof` how it works
- [ ] Inheritance patterns

## Arrays & Objects

- [ ] Mutating vs non-mutating methods (`map` vs `push`)
- [ ] `map`, `filter`, `reduce`, `find`, `some`, `every`
- [ ] Destructuring arrays and objects
- [ ] Spread and rest operators
- [ ] Shallow vs deep copy (`structuredClone`, JSON trick)
- [ ] `Object.keys`, `values`, `entries`, `assign`, `freeze`

## Async JavaScript

- [ ] Callbacks and callback hell
- [ ] Promises: states, chaining, error handling
- [ ] `async/await` syntax and error handling with try/catch
- [ ] `Promise.all`, `Promise.race`, `Promise.allSettled`
- [ ] Event loop: call stack, task queue, microtask queue
- [ ] `setTimeout` vs `setImmediate` vs `queueMicrotask` (conceptual)

## ES6+ Features

- [ ] Template literals
- [ ] Optional chaining (`?.`) and nullish coalescing (`??`)
- [ ] Modules: `import`/`export` vs CommonJS
- [ ] `Set`, `Map`, `WeakMap`, `WeakSet` basics
- [ ] Generators and iterators (awareness level)

## Error Handling

- [ ] try/catch/finally
- [ ] Throwing custom errors
- [ ] Unhandled promise rejections

## Performance & Patterns

- [ ] Debounce vs throttle — when to use each
- [ ] Memoization concept
- [ ] Event delegation pattern
- [ ] Currying (basic understanding)

## Browser APIs (JS side)

- [ ] `fetch` API basics
- [ ] `localStorage` vs `sessionStorage`
- [ ] `JSON.parse` / `JSON.stringify` pitfalls

---

**Self-test:** Can you explain closures, implement `bind`, predict the output of a `setTimeout` + `Promise` chain, and write `debounce` from scratch in 20 minutes? If not, start with `polyfills.md` and `tricky-output-questions.md`.
