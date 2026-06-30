# JavaScript Core: Mock Interview (45 Minutes)

Use with a friend. One interviewer, one candidate. Switch roles after.

**Rules:**
- Candidate answers out loud — no reading notes
- Interviewer asks 2+ follow-ups per question
- Section 4 requires writing code on paper or editor

---

## Section 1: Warm-up (5 min)

1. "Tell me about a project where JavaScript was central."
2. "What was the hardest bug you fixed in JS?"
3. "Which JS concept took you longest to understand?"

*Interviewer: Note if they mention async, closures, or debugging process.*

---

## Section 2: Fundamentals (10 min)

1. "Explain the difference between `var`, `let`, and `const`."
   - Follow-up: "What is the temporal dead zone?"
2. "What is a closure? Give a real use case."
   - Follow-up: "Why does `var` in a loop with setTimeout print 3 three times?"
3. "Explain `==` vs `===` with an example that behaves differently."

---

## Section 3: `this` & Prototypes (8 min)

1. "How does `this` work in JavaScript?"
   - Follow-up: "What's different about arrow functions and `this`?"
2. "What is the prototype chain?"
   - Follow-up: "How does `instanceof` work?"
3. "What do `call`, `apply`, and `bind` do?"

---

## Section 4: Live Coding (12 min)

**Pick ONE:**

### Option A: Implement debounce

> "Write a debounce function. Explain when you'd use it."

**Evaluation:** Correct timer logic, mentions search/resize use case.

### Option B: Flatten array

> "Flatten a nested array one level deep without `.flat()`."

```javascript
function flatten(arr) {
  return arr.reduce((acc, val) =>
    acc.concat(Array.isArray(val) ? val : [val]), []);
}
```

### Option C: Promise.all polyfill

> "Implement a basic `Promise.all`."

**Follow-ups:**
- "What happens if one promise rejects?"
- "Does order of results match input order?"

---

## Section 5: Async & Event Loop (5 min)

1. **Output question:** "What prints and in what order?"

```javascript
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');
```

**Answer:** A, D, C, B

2. "Explain the difference between microtasks and macrotasks."
   - Follow-up: "Where does `async/await` fit in?"

---

## Section 6: Tricky & Project (5 min)

Pick 2:

1. "What is `0.1 + 0.2 === 0.3`? Why?"
2. "Shallow vs deep copy — how do you do each?"
3. "Walk me through how `fetch` works in your project."
4. "What would you use: debounce or throttle for infinite scroll?"

**Project connection:**
- "Show me one async flow in your codebase."
- "If you refactored one JS file, what would you improve?"

---

## Evaluation Rubric

| Area | 1 (Weak) | 3 (Good) | 5 (Strong) |
|------|----------|----------|------------|
| Closures/scope | Vague definition | Correct with example | Explains loop fix + use cases |
| `this` | Always global | Knows rules | Arrow vs regular + fixes |
| Async | "Promises are async" | Event loop order | Micro/macrotask + error handling |
| Live coding | Can't start | Working with hints | Clean, explains edge cases |
| Communication | Memorized defs | Clear examples | Tradeoffs + project links |

---

## Debrief (5 min)

Candidate asks:
- Which topics felt shaky?
- Did I explain my code while writing?
- Was I honest when I didn't know something?

**Homework:** Redo missed sections from `interview-questions.md` + one polyfill from `polyfills.md` blind.
