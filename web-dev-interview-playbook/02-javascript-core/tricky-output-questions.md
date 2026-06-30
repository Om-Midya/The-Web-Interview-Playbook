# JavaScript Core: Tricky Output Questions

Predict the output **before** reading the answer. Say it out loud — interviewers care about your reasoning, not just the final value.

---

## Question 1

```javascript
console.log(typeof typeof 1);
```

**Answer:** `"string"`

**Why:** `typeof 1` returns `"number"`. `typeof "number"` returns `"string"` (typeof always returns a string).

---

## Question 2

```javascript
console.log(0.1 + 0.2 === 0.3);
```

**Answer:** `false`

**Why:** Floating-point precision. `0.1 + 0.2` is `0.30000000000000004`. Use `Number.EPSILON` or round for comparisons.

---

## Question 3

```javascript
var a = 1;
function foo() {
  console.log(a);
  var a = 2;
}
foo();
```

**Answer:** `undefined`

**Why:** Hoisting. `var a` inside `foo` is hoisted to the top of the function, shadowing outer `a`. At `console.log`, local `a` exists but is uninitialized (TDZ doesn't apply to `var` — it's `undefined`).

---

## Question 4

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
```

**Answer:** `3`, `3`, `3`

**Why:** `var` is function-scoped. By the time callbacks run, loop finished and `i` is 3. Fix: use `let` (block scope) or IIFE/closure.

---

## Question 5

```javascript
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
```

**Answer:** `0`, `1`, `2`

**Why:** `let` creates a new binding per iteration. Each callback captures its own `i`.

---

## Question 6

```javascript
console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve().then(() => console.log(3));
console.log(4);
```

**Answer:** `1`, `4`, `3`, `2`

**Why:** Sync first (`1`, `4`). Microtasks (Promises) run before macrotasks (`setTimeout`). Order: call stack → microtask queue → macrotask queue.

---

## Question 7

```javascript
const obj = { a: 1, b: 2 };
const { a, b = 3 } = { a: undefined };
console.log(a, b);
```

**Answer:** `undefined`, `3`

**Why:** Default values apply only when the property is `undefined`, not when missing. Here `a` is explicitly `undefined`, so default for `b` still works since `b` is missing from destructuring... Wait, let me re-read.

Actually: `const { a, b = 3 } = { a: undefined };`
- `a` = `undefined` (property exists with value undefined)
- `b` = `3` (property `b` doesn't exist on source, default applies)

**Answer:** `undefined`, `3` ✓

---

## Question 8

```javascript
console.log([] + []);
console.log([] + {});
console.log({} + []);
```

**Answer:** `""` (empty string), `"[object Object]"`, `"[object Object]"`

**Why:** `+` with objects triggers `ToPrimitive`. Arrays become `""`. `{}` becomes `"[object Object]"`. In `{} + []`, the `{}` can be parsed as empty block in some contexts — in expression context it's `"[object Object]" + ""`.

---

## Question 9

```javascript
function foo() {
  return
  {
    bar: 1
  };
}
console.log(foo());
```

**Answer:** `undefined`

**Why:** Automatic semicolon insertion (ASI). `return` is treated as `return;` — the object on the next line is unreachable dead code.

---

## Question 10

```javascript
console.log(1 < 2 < 3);
console.log(3 > 2 > 1);
```

**Answer:** `true`, `false`

**Why:** Left-to-right evaluation. `1 < 2` → `true`. `true < 3` → `1 < 3` → `true`. `3 > 2` → `true`. `true > 1` → `1 > 1` → `false`.

---

## Question 11

```javascript
const x = { n: 1 };
const y = x;
y.n = 2;
console.log(x.n);
```

**Answer:** `2`

**Why:** Objects are assigned by reference. `x` and `y` point to the same object.

---

## Question 12

```javascript
console.log([1, 2, 3] + [4, 5, 6]);
```

**Answer:** `"1,2,34,5,6"`

**Why:** Arrays convert to strings via `toString()` (`"1,2,3"` + `"4,5,6"`), then concatenated.

---

## Question 13

```javascript
function createCounter() {
  let count = 0;
  return {
    increment: () => ++count,
    getCount: () => count
  };
}
const c = createCounter();
c.increment();
c.increment();
console.log(c.getCount());
console.log(c.count);
```

**Answer:** `2`, `undefined`

**Why:** Closure keeps `count` private. It's not exposed as `c.count` — only accessible via returned methods.

---

## Question 14

```javascript
async function foo() {
  return 1;
}
console.log(foo());
```

**Answer:** `Promise { <fulfilled>: 1 }` (or `Promise { 1 }`)

**Why:** Async functions always return a Promise. `return 1` wraps in resolved Promise.

---

## Question 15

```javascript
console.log('5' - 1);
console.log('5' + 1);
```

**Answer:** `4`, `"51"`

**Why:** `-` triggers numeric coercion (`'5'` → `5`). `+` with string does concatenation if either operand is string.

---

## Question 16

```javascript
const arr = [10, 20, 30];
arr[5] = 50;
console.log(arr.length);
console.log(arr[3]);
```

**Answer:** `6`, `undefined`

**Why:** Setting index 5 creates sparse array. Length becomes 6. Index 3 was never set — `undefined` (empty slot).

---

## Question 17

```javascript
function test() {
  console.log(this);
}
test();
test.call(null);
```

**Answer (non-strict):** Global object (`window` in browser), then global object (null/undefined coerced to global in sloppy mode).

**Answer (strict mode):** `undefined`, `null`

**Why:** In sloppy mode, standalone function calls bind `this` to global. `call(null)` also becomes global. In strict mode, `this` is `undefined` for standalone calls.

---

## Question 18

```javascript
const obj = {
  name: 'JS',
  greet: function() {
    console.log(this.name);
  },
  greetArrow: () => {
    console.log(this.name);
  }
};
obj.greet();
obj.greetArrow();
```

**Answer (browser):** `"JS"`, `undefined` (or empty — arrow inherits `this` from outer scope, likely `window` where `name` may be `""` or undefined)

**Why:** Regular method: `this` = `obj`. Arrow function: `this` lexically bound to enclosing scope (module/global), not `obj`.

---

## Practice Tip

When stuck, narrate: "Is this sync or async? What's hoisted? Is `this` involved? Any coercion?" Interviewers reward the reasoning chain.
