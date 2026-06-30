# React: Mock Interview (45 Minutes)

Practice with a friend. Switch roles after.

---

## Section 1: Warm-up (5 min)

1. "Tell me about your React project."
2. "Why React over vanilla JS for that project?"
3. "What was hardest to learn in React?"

---

## Section 2: Core Concepts (10 min)

1. "What is JSX?"
2. "Props vs state?"
3. "What is the virtual DOM?"
   - Follow-up: "What triggers a re-render?"
4. "Controlled vs uncontrolled components?"

---

## Section 3: Hooks Deep Dive (10 min)

1. "Explain useState. When use functional updates?"
2. "Explain useEffect — dependency array and cleanup."
   - Follow-up: "When should you NOT use useEffect?"
3. "useRef vs useState?"
4. "Difference between useMemo and useCallback?"

---

## Section 4: Live Coding (12 min)

**Pick ONE:**

### Option A: Counter with step

> "Build a counter. User can set step size. Use useState."

### Option B: Fetch users

> "Fetch users from API. Show loading, error, and list. useEffect."

### Option C: Todo with useReducer

> "Todo list: add, toggle, delete. Use useReducer."

**Follow-ups:**
- "Add delete with event delegation equivalent in React?"
- "Why key={id} not key={index}?"

---

## Section 5: Architecture & Performance (5 min)

1. "Where would you put authentication state?"
2. "How prevent unnecessary re-renders?"
3. "React.memo — when helps, when doesn't?"

---

## Section 6: Project Connection (3 min)

1. "Walk through your component tree."
2. "One thing you'd refactor?"
3. "How do you handle API errors?"

---

## Evaluation Rubric

| Area | 1 | 3 | 5 |
|------|---|---|---|
| Hooks | Wrong deps | Correct basics | Cleanup, custom hooks, anti-patterns |
| State | Mutates directly | useState solid | Lifting, reducer, context tradeoffs |
| Data fetching | No error state | useEffect fetch | Abort, loading/error/empty |
| Performance | "useMemo everything" | Knows memo/keys | Profile-first mindset |
| Communication | Definitions only | Examples | Project + tradeoffs |

---

## Debrief

Redo weakest hook from `hooks-deep-dive.md`. Re-attempt Section 4 in 8 minutes.
