# React: Common Mistakes

What interviewers spot in student React code and answers.

---

## 1. Mutating State Directly

```jsx
// Wrong
state.items.push(newItem);
setState(state);

// Right
setState(prev => ({ ...prev, items: [...prev.items, newItem] }));
```

---

## 2. Wrong useEffect Dependencies

```jsx
// Missing userId — stale data when prop changes
useEffect(() => { fetchUser(userId); }, []);

// ESLint exhaustive-deps exists for a reason
useEffect(() => { fetchUser(userId); }, [userId]);
```

---

## 3. useEffect for Derived State

```jsx
// Wrong — extra render cycle
useEffect(() => setFullName(first + ' ' + last), [first, last]);

// Right
const fullName = `${first} ${last}`;
```

---

## 4. Index as Key

```jsx
// Breaks on reorder/delete
{items.map((item, i) => <Row key={i} />)}

// Use stable id
{items.map(item => <Row key={item.id} />)}
```

---

## 5. Creating Functions/Objects in Render

```jsx
// New reference every render — defeats React.memo
<Child style={{ color: 'red' }} onClick={() => doThing()} />
```

Fix: constants outside component, `useMemo`, `useCallback`, or colocate Child.

---

## 6. Conditional Hooks

```jsx
// ILLEGAL — breaks rules of hooks
if (loggedIn) {
  const [user, setUser] = useState(null);
}
```

Hooks must be unconditional at top level.

---

## 7. Forgetting Keys in Lists

React warns: "Each child in a list should have a unique key prop." Ignoring this causes subtle UI bugs.

---

## 8. Overusing Context

Putting entire app state in one Context → everything re-renders on any change. Split contexts or use dedicated state library.

---

## 9. Fetch in Render

```jsx
// Never
function Bad() {
  const [data, setData] = useState([]);
  fetch('/api').then(r => r.json()).then(setData); // runs every render!
}
```

Use `useEffect` or a data-fetching library.

---

## 10. Not Handling Loading/Error/Empty

```jsx
// Only happy path
return <List data={data} />;
```

Always handle: loading spinner, error message, empty state.

---

## 11. Controlled vs Uncontrolled Confusion

```jsx
// Controlled needs value + onChange
<input value={name} onChange={e => setName(e.target.value)} />

// Uncontrolled uses ref — don't mix both on same input
```

---

## 12. Premature useMemo/useCallback

Adding memoization everywhere without profiling. Adds complexity and can slow things down.

---

## 13. Prop Drilling vs Context vs Redux

Using Redux for theme color is overkill. Using prop drilling through 8 levels is painful. Match tool to problem size.

---

## 14. Ignoring Strict Mode Warnings

Double effects in dev expose missing cleanups. Fix the effect, don't disable Strict Mode.

---

## 15. Saying "React is MVC"

React is a view library. State management and routing are separate choices. You control architecture.

---

## Interview Recovery

If you catch yourself making these points in a live interview, say: "Actually, I'd revise that — the better pattern is..." Interviewers respect self-correction.
