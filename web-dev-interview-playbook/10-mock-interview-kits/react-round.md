# React Mock Interview (45 Minutes)

> **Role:** React-focused round — common at startups, product companies, and any role listing React in the JD.

**Interviewer:** Prioritize understanding over API memorization. Ask "what happens when state updates?" often.  
**Candidate:** Have one React project open or memorized. Know your component tree.

---

## Pre-Interview Setup

- [ ] Timer, rubric, IDE with React (or paper for pseudocode)
- [ ] Candidate should have a project with hooks, state, and at least one API call
- [ ] Interviewer: skim candidate's project if they shared a repo link

---

## Section 1: Warm-up & Project (5 min)

| Time | Question |
|------|----------|
| 0:00 | "Tell me about a React project you've built." |
| 2:00 | "What was the component structure? How did you organize folders?" |
| 3:30 | "Why React for that project instead of vanilla JS or another framework?" |
| 4:30 | "What version of React? Hooks or class components?" |

**Follow-ups:**
- "What was the hardest React-specific bug you faced?"
- "Did you use any state management library? Why or why not?"

---

## Section 2: React Fundamentals (10 min)

| Time | Question |
|------|----------|
| 5:00 | "What is JSX? What does it compile to?" |
| 6:00 | "Explain the virtual DOM. Why does React use it?" |
| 7:00 | **Follow-up:** "Does virtual DOM always mean faster than vanilla DOM?" |
| 8:00 | "What is the difference between state and props?" |
| 9:00 | "What is lifting state up? When would you do it?" |
| 10:00 | "Explain one-way data flow in React." |
| 11:00 | "What are keys in lists? What happens if you use index as key?" |
| 12:00 | **Follow-up:** "When is index-as-key actually okay?" |
| 13:00 | "Controlled vs uncontrolled components — explain with a form input example." |
| 14:00 | "What is a React fragment? Why use it?" |

---

## Section 3: Hooks Deep-Dive (10 min)

| Time | Question |
|------|----------|
| 15:00 | "Explain `useState`. What happens when you call the setter?" |
| 16:00 | **Follow-up:** "Why shouldn't you mutate state directly?" |
| 17:00 | "Explain `useEffect`. What is the dependency array for?" |
| 18:00 | **Follow-up:** "What happens with an empty `[]` dependency array?" |
| 19:00 | "Give me an example where missing a dependency causes a bug." |
| 20:00 | "What is `useRef`? How is it different from `useState`?" |
| 21:00 | "When would you use `useMemo` or `useCallback`? Are they always needed?" |
| 22:00 | **Follow-up:** "What's the cost of premature optimization with these hooks?" |
| 23:00 | "What are the rules of hooks? Why do they exist?" |
| 24:00 | "Have you used custom hooks? Give an example." |

**Tricky follow-up:**

> "This component fetches on every render. What's wrong?"

```jsx
function UserList() {
  const [users, setUsers] = useState([]);
  fetch('/api/users').then(r => r.json()).then(setUsers);
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

**Expected:** Fetch belongs in `useEffect` with proper dependencies; mention loading/error states.

---

## Section 4: Live Task — Component Build (12 min)

**Interviewer reads aloud:**

> "Build a `Counter` component with:
> - Display current count
> - Increment and decrement buttons
> - A reset button
> - Count should not go below 0
> - Bonus: extract logic into a custom hook `useCounter`
>
> Talk through your approach first."

**Timing:**

| Time | Phase |
|------|-------|
| 25:00–26:00 | Approach explanation |
| 26:00–34:00 | Live code |
| 34:00–37:00 | Follow-ups |

**Follow-ups:**

1. "How would you persist the count to `localStorage`?"
2. "How would you test this component?"
3. "What if two counters on the same page need shared state?"
4. "How would you add an async increment that waits 1 second?"

**Alternate task (if candidate finishes early):**

> "Build a search filter: given a list of names, filter as user types in an input."

**Evaluation:**

| Criteria | Weak | Strong |
|----------|------|--------|
| State design | Mutates variables | `useState` correctly |
| Edge cases | Ignores min 0 | Guards decrement |
| Structure | One giant component | Extracts hook or subcomponents |
| JSX quality | Inline chaos | Readable, keyed lists |
| Communication | Silent | Explains re-render behavior |

---

## Section 5: Performance & Patterns (5 min)

**Pick 2:**

| # | Question |
|---|----------|
| 1 | "What causes unnecessary re-renders in React?" |
| 2 | "What is `React.memo`? When would you use it?" |
| 3 | "How does code splitting work in React? (`React.lazy`, dynamic import)" |
| 4 | "What is prop drilling? How do you solve it?" |
| 5 | "Context API vs Redux/Zustand — when to use which?" |
| 6 | "What is error boundary? Can you make one with hooks?" |

---

## Section 6: Routing & Data (3 min)

| Time | Question |
|------|----------|
| 38:00 | "How do you fetch data in React? Where does the fetch live?" |
| 39:30 | "Have you used React Router? Explain nested routes briefly." |
| 41:00 | "Server Components vs Client Components — have you heard of this? (Next.js)" |

---

## Wrap-up (2 min)

| Time | Action |
|------|--------|
| 42:00 | "Walk me through how a state change in your project triggers a re-render — pick one feature." |
| 44:00 | Candidate questions + close |

---

## Post-Interview Debrief

### Homework by gap

| Gap | Action |
|-----|--------|
| useEffect bugs | Build same fetch with loading/error states |
| Performance | Profile one component in React DevTools |
| State management | Add Context to a small app |
| Live task | Retry counter + custom hook in 15 min |
| Project depth | Draw component tree on paper from memory |

### Retry challenge

Second attempt: live task becomes **Todo list item with edit/delete** in 15 minutes.

---

## Interviewer Cheat Sheet

**Pass signals:** Explains re-renders; knows when NOT to use `useMemo`; describes real project state flow; mentions accessibility (`label`, `button type`).

**Fail signals:** Can't explain own project's hooks; says "I just use ChatGPT for React"; doesn't know what `useEffect` deps do.
