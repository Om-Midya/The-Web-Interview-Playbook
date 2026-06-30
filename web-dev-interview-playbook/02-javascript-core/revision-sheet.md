# JavaScript Core: Revision Sheet

One-page rapid review. Read this the night before your interview.

## Types & Coercion

| Expression | Result |
|------------|--------|
| `typeof null` | `"object"` |
| `typeof NaN` | `"number"` |
| `[] + []` | `""` |
| `0.1 + 0.2 === 0.3` | `false` |
| Falsy values | `0`, `""`, `null`, `undefined`, `NaN`, `false` |

## var vs let vs const

- `var`: function-scoped, hoisted as `undefined`
- `let`/`const`: block-scoped, TDZ until declaration
- `const`: binding constant, object contents can still mutate

## Event Loop Order

1. Synchronous code (call stack)
2. Microtasks (Promises, `queueMicrotask`)
3. Macrotasks (`setTimeout`, `setInterval`, I/O)

## Closures

Inner function + access to outer variables after outer returns.
**Use:** data privacy, factories, debounce/throttle.

## `this` Binding (priority)

1. `new` → new object
2. `call`/`apply`/`bind` → explicit
3. Method call → object
4. Standalone → `undefined` (strict) / global (sloppy)
5. Arrow → lexical (outer scope)

## Array Methods

| Method | Mutates? | Returns |
|--------|----------|---------|
| `map` | No | New array |
| `filter` | No | New array |
| `reduce` | No | Single value |
| `push`/`pop`/`splice` | Yes | Varies |
| `slice` | No | Shallow copy |
| `sort` | Yes | Same array |

## Object Copy

```javascript
const shallow = { ...obj };
const deep = structuredClone(obj);
```

## Promises

```javascript
Promise.all([p1, p2])      // all resolve or first reject
Promise.race([p1, p2])     // first settle
Promise.allSettled([...])  // wait for all, never reject
```

## async/await

```javascript
async function getData() {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.status);
    return await res.json();
  } catch (e) {
    // handle
  }
}
```

## Debounce vs Throttle

- **Debounce:** wait until activity stops (search input)
- **Throttle:** max once per interval (scroll)

## Prototype Chain

```javascript
obj.__proto__ === Constructor.prototype
instanceof checks prototype chain
```

## ES6 Destructuring

```javascript
const { name, age = 18 } = user;
const [first, ...rest] = arr;
```

## Optional Chaining & Nullish

```javascript
user?.address?.city
value ?? 'default'  // only null/undefined, not 0 or ''
```

## Quick Polyfill Reminders

- **bind:** return function that calls original with fixed `this` + args
- **debounce:** `clearTimeout` + `setTimeout`
- **Promise.all:** array in order, fail fast

## Interview Phrases That Impress

- "I'd use `===` to avoid type coercion"
- "That's a microtask, so it runs before setTimeout"
- "Arrow function inherits `this` lexically"
- "I'd shallow copy with spread, deep copy with structuredClone"
- "Debounce for search, throttle for scroll"

## Red Flags to Avoid

- "Closures are just nested functions"
- Using `var` in new code
- Ignoring promise error handling
- Arrow functions as object methods when `this` is needed
