# JavaScript Mock Interview (45 Minutes)

> **Role:** Core JavaScript round — appears in nearly every web dev interview, often as Round 1 or 2.

**Interviewer:** Stick to the timer. Push with "what happens if…?" follow-ups.  
**Candidate:** Think out loud. For output questions, trace line by line before answering.

---

## Pre-Interview Setup (Interviewer Only)

- [ ] Timer ready
- [ ] Live coding environment shared (or paper)
- [ ] Have 2 "tricky output" snippets ready (Section 4)
- [ ] Rubric: [evaluation-rubric.md](./evaluation-rubric.md)

---

## Section 1: Warm-up (5 min)

| Time | Question |
|------|----------|
| 0:00 | "How much JavaScript have you written? Classes, projects, internships?" |
| 1:30 | "What's the most interesting thing you've built with JavaScript?" |
| 3:00 | "Vanilla JS or framework-first — which did you learn first? Does it matter?" |
| 4:00 | "What's one JavaScript concept that clicked late for you?" |

**Follow-up:** "How did you finally understand it?"

**Interviewer notes:** Gauge confidence vs bluffing. Strong candidates name a specific concept (closures, async, `this`).

---

## Section 2: Language Fundamentals (10 min)

| Time | Question |
|------|----------|
| 5:00 | "Explain `var`, `let`, and `const`. What's hoisting?" |
| 6:00 | **Follow-up:** "What gets logged?" *(Show: `console.log(a); var a = 1;`)* |
| 7:00 | "What is a closure? Give a real use case." |
| 8:00 | **Follow-up:** "Can closures cause memory leaks? When?" |
| 9:00 | "Explain `==` vs `===`. Give an example where they differ." |
| 10:00 | "What is the event loop? How do `setTimeout` and Promises fit in?" |
| 11:00 | **Follow-up:** "What's the order of output?" *(Classic: sync → microtask → macrotask snippet)* |
| 12:00 | "What is `this` in JavaScript? How is it different in an arrow function?" |
| 13:00 | **Follow-up:** "What is `this` inside a method passed as a callback?" |

**Tricky output snippet #1 (read aloud, candidate traces):**

```javascript
console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve().then(() => console.log(3));
console.log(4);
// Expected: 1, 4, 3, 2
```

---

## Section 3: Data & Functions (8 min)

| Time | Question |
|------|----------|
| 15:00 | "Difference between primitive and reference types? What happens when you copy an object?" |
| 16:00 | **Follow-up:** "How do you clone an object shallowly vs deeply?" |
| 17:00 | "What are array methods `map`, `filter`, and `reduce`? When do you use each?" |
| 18:00 | "Explain `async/await`. How is it different from `.then()` chains?" |
| 19:00 | **Follow-up:** "How do you handle errors in async/await?" |
| 20:00 | "What is destructuring? Show me object and array destructuring." |
| 21:00 | "What is the spread operator? Give two use cases." |

**Stretch:** "What is optional chaining (`?.`) and nullish coalescing (`??`)?"

---

## Section 4: Tricky Output & Debugging (7 min)

**Interviewer:** Present one snippet at a time. Candidate must trace before answering.

**Snippet A — Closure in loop:**

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Expected: 3, 3, 3 — fix with let or IIFE
```

**Follow-up:** "How would you fix it?"

**Snippet B — Type coercion:**

```javascript
console.log([] + []);
console.log([] + {});
console.log({} + []);
// Expected: "", "[object Object]", "[object Object]"
```

**Interviewer question:** "A bug report says `if (user.count)` hides valid zero values. How do you fix it?"

**Expected:** Use `user.count != null` or `user.count !== undefined` or nullish coalescing.

---

## Section 5: Live Coding Task (10 min)

**Interviewer reads aloud:**

> "Write a function `debounce(fn, delay)` that delays calling `fn` until `delay` ms have passed since the last call. Explain your approach first. You don't need perfect syntax — I care about the logic."

**Timing:**

| Time | Phase |
|------|-------|
| 22:00–23:00 | Candidate explains approach |
| 23:00–30:00 | Candidate codes |
| 30:00–32:00 | Follow-ups |

**Reference solution (interviewer only):**

```javascript
function debounce(fn, delay) {
  let timerId;
  return function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn.apply(this, args), delay);
  };
}
```

**Follow-ups:**

1. "What's the difference between debounce and throttle?"
2. "Where would you use debounce in a real app?" (search input, resize handler)
3. "How would you add a `cancel` method?"
4. **Alternate task if finished early:** "Implement `Array.prototype.myMap` without using `.map`."

**Evaluation:**

| Criteria | Weak | Strong |
|----------|------|--------|
| Approach | Jumps to code | Explains closure + timer first |
| Correctness | Missing clearTimeout | Handles args and `this` |
| Edge cases | Ignores | Mentions immediate invoke option |
| Communication | Silent | Talks through test case |

---

## Section 6: DOM & Browser (3 min)

**Pick 2 — fast fire:**

| # | Question |
|---|----------|
| 1 | "What is event bubbling and capturing?" |
| 2 | "What is event delegation? Why use it?" |
| 3 | "Difference between `localStorage` and `sessionStorage`?" |
| 4 | "What is the difference between `preventDefault` and `stopPropagation`?" |

---

## Section 7: Project Connection (2 min)

| Time | Question |
|------|----------|
| 41:00 | "Where did you use async JavaScript in your project?" |
| 42:30 | "What's one bug you debugged in JavaScript? How did you find it?" |
| 44:00 | "If you could add TypeScript to your project, would you? Why or why not?" |

---

## Wrap-up (1 min)

Candidate asks one question. Interviewer ends professionally. **Debrief separately.**

---

## Post-Interview Debrief

### Score dimensions

- Language fundamentals (hoisting, closures, `this`, event loop)
- Async understanding
- Live coding (approach + correctness)
- Debugging mindset
- Communication

### Homework by weak area

| Gap | Resource |
|-----|----------|
| Event loop | `02-javascript-core/interview-questions.md` |
| Closures / `this` | Same + write 3 closure examples |
| Array methods | Build a small data transform pipeline |
| Live coding | Retry debounce, then implement throttle |
| DOM | `03-javascript-dom/interview-questions.md` |

**Retry:** Run again in 5 days. Add a second live task: `flatten` nested array or `groupBy`.

---

## Interviewer Notes

**Strong signals:** Traces code on paper before answering; mentions microtask vs macrotask unprompted; connects debounce to real UI.

**Red flags:** Guesses output without tracing; can't explain own project's API calls; says "I only use React, I don't know vanilla JS."
