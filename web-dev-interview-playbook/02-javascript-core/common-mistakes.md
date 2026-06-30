# JavaScript Core: Common Mistakes

What interviewers hear from 2nd/3rd year students — and what to say instead.

---

## 1. Confusing `==` and `===`

**Mistake:** Using `==` everywhere "because it works."

**Reality:** `==` coerces types (`0 == false`, `'' == false`, `null == undefined`). Unexpected bugs.

**Fix:** Default to `===`. Only use `==` when you explicitly want coercion (rare).

---

## 2. Not Understanding Closures

**Mistake:** "A closure is when a function returns another function."

**Better answer:** A closure is when an inner function retains access to variables from its outer scope even after the outer function has finished executing. Used for data privacy, factories, and callbacks.

**Classic trap:** `var` in loops with `setTimeout` — always mention `let` or IIFE fix.

---

## 3. Arrow Functions Everywhere

**Mistake:** Using arrow functions as object methods or event handlers when `this` matters.

```javascript
// Wrong — this is NOT the button
button.addEventListener('click', () => {
  this.classList.toggle('active');
});

// Right
button.addEventListener('click', function() {
  this.classList.toggle('active');
});
```

**Rule:** Arrow functions don't have their own `this`, `arguments`, or `new`.

---

## 4. Mutating State Directly

**Mistake:** Pushing to arrays or modifying objects that should be immutable (especially before learning React).

```javascript
const user = { name: 'A' };
user.name = 'B'; // mutation
const updated = { ...user, name: 'B' }; // non-mutating
```

---

## 5. Async/Await Without try/catch

**Mistake:**

```javascript
async function fetchData() {
  const res = await fetch('/api');
  const data = await res.json();
  return data;
}
```

Unhandled rejection if fetch fails.

**Fix:**

```javascript
async function fetchData() {
  try {
    const res = await fetch('/api');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Fetch failed:', err);
    throw err;
  }
}
```

---

## 6. Forgetting `return` in Array Methods

**Mistake:**

```javascript
const doubled = nums.map(n => { n * 2 }); // undefined array!
```

**Fix:** Implicit return needs no braces, OR explicit `return`:

```javascript
nums.map(n => n * 2);
nums.map(n => { return n * 2; });
```

---

## 7. Shallow Copy When Deep Copy Needed

**Mistake:**

```javascript
const copy = { ...original };
copy.nested.value = 99; // mutates original.nested too
```

**Fix:** `structuredClone(original)` or a proper deep clone for nested objects.

---

## 8. Misunderstanding Hoisting

**Mistake:** "Hoisting moves everything to the top."

**Better:** Declarations are registered before execution. `var` → `undefined` until assignment. `let`/`const` → temporal dead zone until declaration line. Function declarations are fully hoisted.

---

## 9. Event Loop Confusion

**Mistake:** Thinking `setTimeout(fn, 0)` runs immediately.

**Reality:** It goes to the macrotask queue. Promises (microtasks) always run first.

**Study:** `tricky-output-questions.md` Question 6.

---

## 10. `this` in Callbacks

**Mistake:**

```javascript
const user = {
  name: 'Alice',
  greet() {
    setTimeout(function() {
      console.log(this.name); // undefined — lost this
    }, 100);
  }
};
```

**Fixes:** Arrow function, `.bind(this)`, or store `const self = this`.

---

## 11. JSON.parse/stringify for Everything

**Mistake:** Using JSON clone for dates, functions, `undefined`, circular refs.

**Reality:** Loses types, fails on circular structures. Use `structuredClone` when available.

---

## 12. Not Checking Array Methods Return New Arrays

**Mistake:** `arr.map()` then expecting `arr` to change. `map`/`filter`/`slice` return new arrays. `push`/`splice`/`sort` mutate in place.

---

## 13. Ignoring Error in Promises

**Mistake:**

```javascript
fetchData().then(data => render(data));
// No .catch() — silent failure
```

**Fix:** Always chain `.catch()` or use try/catch with async/await.

---

## 14. Overusing `bind`/`call`/`apply`

**Mistake:** Reaching for these when arrow functions or passing arguments directly would work.

**When they matter:** Polyfill questions, borrowing methods, partial application.

---

## 15. Saying "JavaScript is Single-Threaded" Without Nuance

**Better:** JS runtime is single-threaded for execution, but Web APIs (fetch, timers, DOM) run asynchronously and callbacks enter the event loop. Mention microtasks vs macrotasks.

---

## Self-Check Before Interview

- [ ] I can explain closures with a real example from my project
- [ ] I know when NOT to use arrow functions
- [ ] I always use `===` unless I have a reason
- [ ] I handle async errors properly
- [ ] I can predict event loop output
