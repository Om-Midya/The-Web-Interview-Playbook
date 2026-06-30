# React Hooks: Deep Dive

Detailed guide with examples for the hooks interviewers ask about most. Read each section, then close the file and explain it out loud.

---

## Rules of Hooks

1. Only call hooks at the **top level** — not in loops, conditions, or nested functions
2. Only call hooks from **React function components** or **custom hooks**

**Why:** React relies on call order to associate state with each hook. Breaking order breaks state.

---

## useState

Adds local state to a function component. Returns `[value, setValue]`.

### Basic Example

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}
```

### Functional Updates

When new state depends on previous state, use the updater function:

```jsx
// Wrong in rapid clicks — stale closure
setCount(count + 1);

// Correct
setCount(prev => prev + 1);
```

### Object State

```jsx
const [user, setUser] = useState({ name: '', email: '' });

// Merge — don't mutate
setUser(prev => ({ ...prev, name: 'Alice' }));
```

### Lazy Initial State

Expensive computation runs once:

```jsx
const [data, setData] = useState(() => {
  const stored = localStorage.getItem('data');
  return stored ? JSON.parse(stored) : [];
});
```

### Batching

React 18 batches multiple `setState` calls in event handlers into one re-render:

```jsx
function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // One re-render, not two
}
```

**Interview point:** State updates are asynchronous. Reading `count` right after `setCount` still shows old value.

---

## useEffect

Runs side effects after render: fetch, subscriptions, DOM sync, timers.

### Basic Example

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(setUser);
  }, [userId]); // re-run when userId changes

  if (!user) return <p>Loading...</p>;
  return <h1>{user.name}</h1>;
}
```

### Dependency Array

| Deps | Behavior |
|------|----------|
| Omitted | Runs after **every** render |
| `[]` | Runs once on mount |
| `[a, b]` | Runs when `a` or `b` changes |

### Cleanup

Return a function to clean up subscriptions, timers, listeners:

```jsx
useEffect(() => {
  const timer = setInterval(() => setCount(c => c + 1), 1000);
  return () => clearInterval(timer); // cleanup on unmount or before re-run
}, []);
```

### Fetch with Abort (avoid race conditions)

```jsx
useEffect(() => {
  const controller = new AbortController();

  async function load() {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        signal: controller.signal
      });
      const data = await res.json();
      setUser(data);
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message);
    }
  }

  load();
  return () => controller.abort();
}, [userId]);
```

### When NOT to use useEffect

- **Deriving state from props** — compute during render instead
- **Event responses** — put logic in event handler
- **Expensive filtering** — use `useMemo`

```jsx
// Bad — unnecessary effect
const [fullName, setFullName] = useState('');
useEffect(() => {
  setFullName(`${first} ${last}`);
}, [first, last]);

// Good — derive during render
const fullName = `${first} ${last}`;
```

---

## useRef

Holds a mutable value that **persists across renders** without causing re-render when changed.

### DOM Reference

```jsx
function FocusInput() {
  const inputRef = useRef(null);

  const focus = () => inputRef.current.focus();

  return (
    <>
      <input ref={inputRef} />
      <button onClick={focus}>Focus</button>
    </>
  );
}
```

### Mutable Value (no re-render)

```jsx
function Timer() {
  const intervalRef = useRef(null);
  const [count, setCount] = useState(0);

  const start = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
  };

  const stop = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  return (
    <div>
      <p>{count}</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}
```

### Previous Value Pattern

```jsx
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
```

**Interview point:** `useRef` is NOT `document.getElementById`. It's React's way to hold a box that survives re-renders.

---

## useContext

Shares data through the tree without prop drilling.

### Setup

```jsx
const ThemeContext = createContext('light');

function App() {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function ThemedButton() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <button
      className={theme}
      onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
    >
      Toggle theme
    </button>
  );
}
```

### Custom Hook Wrapper

```jsx
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
```

**Caveats:**
- All consumers re-render when context value changes
- Memoize provider value if it's an object: `useMemo(() => ({ theme, setTheme }), [theme])`
- Don't put everything in context — use for truly global data (theme, auth, locale)

---

## useMemo

Caches the **result** of an expensive computation between renders.

```jsx
function ProductList({ products, filter }) {
  const filtered = useMemo(() => {
    console.log('Filtering...');
    return products.filter(p =>
      p.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [products, filter]);

  return (
    <ul>
      {filtered.map(p => <li key={p.id}>{p.name}</li>)}
    </ul>
  );
}
```

**When to use:**
- Expensive calculations (sorting large arrays, heavy transforms)
- Stabilizing object reference for deps of other hooks

**When NOT to use:**
- Cheap operations — overhead isn't worth it
- "Just in case" — profile first

---

## useCallback

Caches a **function reference** between renders.

```jsx
function Parent() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    console.log('Clicked, count is', count);
  }, [count]);

  return <MemoizedChild onClick={handleClick} />;
}

const MemoizedChild = React.memo(function Child({ onClick }) {
  console.log('Child rendered');
  return <button onClick={onClick}>Click</button>;
});
```

**Why it matters:** `React.memo` does shallow compare on props. New function every render = child re-renders anyway. `useCallback` keeps same reference.

**Interview answer:** "useMemo memoizes a value, useCallback memoizes a function. useCallback is essentially useMemo(() => fn, deps)."

**Don't overuse:** Only helps when passing to memoized children or as effect dependency.

---

## useReducer

For complex state logic with multiple sub-values or next state depending on previous.

```jsx
const initialState = { count: 0, step: 1 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + state.step };
    case 'decrement':
      return { ...state, count: state.count - state.step };
    case 'setStep':
      return { ...state, step: action.payload };
    case 'reset':
      return initialState;
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <p>Count: {state.count}</p>
      <input
        type="number"
        value={state.step}
        onChange={e => dispatch({ type: 'setStep', payload: +e.target.value })}
      />
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
}
```

**When to prefer over useState:**
- Multiple related state values updated together
- Next state depends on complex previous state
- State transitions are well-defined (like a state machine)
- Testing reducer as pure function is valuable

---

## Custom Hooks

Extract reusable logic. Must start with `use`.

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    fetch(url, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(setData)
      .catch(err => {
        if (err.name !== 'AbortError') setError(err.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}

// Usage
function Users() {
  const { data, loading, error } = useFetch('/api/users');
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return <ul>{data.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

---

## Hook Comparison Table

| Hook | Purpose | Re-render on change? |
|------|---------|---------------------|
| useState | Local state | Yes |
| useEffect | Side effects | No (triggers after render) |
| useRef | DOM / mutable box | No |
| useContext | Shared data | Yes (when context changes) |
| useMemo | Cache computed value | No |
| useCallback | Cache function | No |
| useReducer | Complex state | Yes |

---

## Interview Rapid Fire

1. **Why is my useEffect running twice in dev?** — React Strict Mode intentionally double-invokes effects to surface bugs.
2. **Can I use useEffect without deps?** — Yes, but it runs every render (usually a bug).
3. **useState vs useRef?** — useState triggers re-render; useRef doesn't.
4. **When useReducer over useState?** — Complex transitions, multiple fields, testable reducer logic.
