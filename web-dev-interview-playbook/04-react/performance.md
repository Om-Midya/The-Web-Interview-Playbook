# React: Performance

Practical performance guide for interviews. **Know when to optimize — premature optimization is a common student mistake.**

---

## What Causes Re-renders?

A component re-renders when:
1. Its **state** changes
2. Its **parent** re-renders (unless prevented)
3. **Context** it consumes changes

Re-render ≠ DOM update. React diffs virtual DOM and updates only what changed.

---

## Debugging Re-renders

```jsx
function MyComponent(props) {
  console.log('MyComponent rendered');
  // Or use React DevTools Profiler
}
```

**Questions to ask:**
- Is state too high in the tree?
- Is a new object/array/function created every render and passed as prop?
- Is context value a new object every render?

---

## React.memo

Prevents re-render if props are shallow-equal to previous.

```jsx
const UserCard = React.memo(function UserCard({ user, onSelect }) {
  return (
    <div onClick={() => onSelect(user.id)}>
      {user.name}
    </div>
  );
});
```

**Works when:** Parent re-renders often but child's props haven't changed.

**Doesn't help when:** Props include new function/object references every time — pair with `useCallback`/`useMemo`.

---

## useMemo & useCallback

See `hooks-deep-dive.md` for details.

**Rule of thumb:**
- `useMemo` — expensive computation or stable object for deps
- `useCallback` — stable function for memoized children or effect deps

```jsx
// Provider value — new object every render breaks memoization
const value = useMemo(() => ({ user, logout }), [user, logout]);
return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
```

---

## List Performance

### Keys

```jsx
// Good — stable unique id
{items.map(item => <Row key={item.id} item={item} />)}

// Bad for dynamic lists — reorder bugs
{items.map((item, index) => <Row key={index} item={item} />)}
```

### Virtualization

For 1000+ rows, render only visible items. Libraries: `react-window`, `@tanstack/react-virtual`.

**Interview answer:** "I'd profile first. If list is under ~100 items, keys and memo are enough. Beyond that, virtualization."

---

## Code Splitting

Load components only when needed:

```jsx
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./Dashboard'));

function App() {
  return (
    <Suspense fallback={<p>Loading dashboard...</p>}>
      <Dashboard />
    </Suspense>
  );
}
```

**Route-based splitting** with React Router is the most common pattern.

---

## State Colocation

Keep state as close to where it's used as possible.

```jsx
// Bad — entire app re-renders on every keystroke
function App() {
  const [search, setSearch] = useState('');
  return (
    <>
      <SearchInput value={search} onChange={setSearch} />
      <HeavyChart />
      <Sidebar />
    </>
  );
}

// Good — lift only what's needed
function App() {
  return (
    <>
      <SearchPanel />  {/* search state inside */}
      <HeavyChart />
      <Sidebar />
    </>
  );
}
```

---

## Avoid Inline Objects and Functions in JSX

```jsx
// Creates new function every render — breaks React.memo on child
<Button onClick={() => handleClick(id)} />

// Better if child is memoized
const onClick = useCallback(() => handleClick(id), [id]);
<Button onClick={onClick} />

// Or pass id and let child call handler
<Button id={id} onClick={handleClick} />
```

---

## useEffect Performance Traps

```jsx
// Bad — effect runs every render if options is inline object
useEffect(() => {
  fetchData(options);
}, [options]); // { page: 1 } !== { page: 1 }

// Good — depend on primitives
useEffect(() => {
  fetchData({ page, filter });
}, [page, filter]);
```

---

## Images & Assets

- Lazy load images (`loading="lazy"`)
- Correct image sizes (don't ship 4000px for thumbnails)
- SVG for icons

---

## What NOT to Do

| Anti-pattern | Why |
|--------------|-----|
| `useMemo` on everything | Adds complexity, often slower |
| `React.memo` every component | Shallow compare has cost |
| Context for frequently changing data | All consumers re-render |
| Putting fetch in render | Infinite loop risk |
| Index as key on sortable lists | Wrong component state |

---

## Interview Answer Template

> "I'd start with React DevTools Profiler to find the actual bottleneck. Common fixes: colocate state, fix keys, memoize expensive lists, code-split routes. I wouldn't add useMemo/useCallback until I measured unnecessary re-renders."

---

## Quick Checklist

- [ ] State lives at lowest necessary level
- [ ] Stable keys on lists
- [ ] Context split by concern (don't one giant context)
- [ ] Route-level code splitting
- [ ] Fetch abort on unmount / id change
- [ ] Profile before memoizing
