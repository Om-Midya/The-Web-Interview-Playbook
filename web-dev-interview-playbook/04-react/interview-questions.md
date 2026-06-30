# React Interview Questions

> 50+ questions with full answers. Practice out loud.

---

## Question: What is React and why would you choose it?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
They want to know you understand React's role vs vanilla JS or other frameworks.

### Answer
React is a JavaScript library for building user interfaces with a component-based model. You describe UI as a function of state, and React updates the DOM efficiently when data changes. Teams choose it for its ecosystem, reusable components, strong hiring market, and declarative style that scales for complex UIs.

### Example
```jsx
function Welcome({ name }) {
  return <h1>Hello, {name}</h1>;
}

// App composes components instead of manipulating the DOM by hand
export default function App() {
  return <Welcome name="Alex" />;
}
```

### Follow-up Questions
- Is React a framework or a library?
- What problems does React solve that jQuery does not?
- What is the declarative vs imperative difference?

### Common Mistakes
- Calling React a 'framework' without mentioning routing/state libraries
- Saying React updates the DOM directly on every change
- Not mentioning components or one-way data flow

### Project Connection
Describe your portfolio or capstone as a tree of components (layout, pages, shared UI) instead of one big HTML file.

---

## Question: What is the Virtual DOM?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Tests whether you can explain React's performance story without hand-waving.

### Answer
The Virtual DOM is a lightweight in-memory representation of the real DOM. When state changes, React builds a new virtual tree, diffs it against the previous one (reconciliation), and applies the minimal set of updates to the actual DOM. You still write JSX as if the DOM updates wholesale; React batches and optimizes the work.

### Example
```jsx
// You think in UI updates:
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
// React figures out which DOM node text to change.
```

### Follow-up Questions
- Is the Virtual DOM always faster than direct DOM updates?
- What is reconciliation?
- Does React 18 change how updates are scheduled?

### Common Mistakes
- Claiming React never touches the real DOM
- Confusing Virtual DOM with Shadow DOM
- Saying VDOM is the same as the browser DOM

### Project Connection
When a list re-renders in your project, React's diffing is why changing one item does not rebuild the entire page manually.

---

## Question: What is JSX?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
JSX appears in every React codebase; interviewers check that you know what it compiles to.

### Answer
JSX is a syntax extension that lets you write HTML-like markup inside JavaScript. It is not HTML: `className` replaces `class`, you embed expressions with `{}`, and self-closing tags are required. Build tools (Babel, Vite) compile JSX to `React.createElement` calls or the automatic JSX runtime.

### Example
```jsx
const element = (
  <section className="card">
    <h2>{product.name}</h2>
    <p>{product.price.toFixed(2)}</p>
  </section>
);
```

### Follow-up Questions
- Can you use React without JSX?
- Why `className` instead of `class`?
- What gets returned from a component?

### Common Mistakes
- Treating JSX as a template language that runs in the browser raw
- Using `class` in JSX
- Forgetting a single parent or Fragment wrapper when returning siblings

### Project Connection
Your `.jsx` files are JSX; mentioning compile step shows you understand the toolchain (Vite/CRA).

---

## Question: Functional components vs class components — what is the difference?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Legacy codebases still have classes; modern interviews expect functional components and hooks.

### Answer
Functional components are plain functions that return JSX and use hooks for state and side effects. Class components extend `React.Component`, use `this.state`, and lifecycle methods. Since React 16.8+, functions + hooks are the standard; classes are mainly for maintenance or older tutorials.

### Example
```jsx
// Functional (preferred)
function Greeting({ name }) {
  const [wave, setWave] = useState(false);
  return <p onClick={() => setWave(!wave)}>Hi {name}{wave ? " 👋" : ""}</p>;
}

// Class (legacy)
class GreetingClass extends React.Component {
  state = { wave: false };
  render() {
    return <p onClick={() => this.setState({ wave: !this.state.wave })}>Hi {this.props.name}</p>;
  }
}
```

### Follow-up Questions
- Can hooks be used in class components?
- How do you migrate a class to a function?
- What is `this` binding in class components?

### Common Mistakes
- Starting new projects with class components
- Not knowing equivalent hooks for lifecycle methods
- Confusing function components with 'stateless' only

### Project Connection
Write new features in your project as function components; if you read old examples, map `componentDidMount` to `useEffect(..., [])`.

---

## Question: What are props in React?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Props are how data flows down the tree — fundamental for any React interview.

### Answer
Props (properties) are read-only inputs passed from a parent to a child. They make components reusable and configurable. A child must not mutate props; if the UI needs to change, the parent updates state and passes new props down.

### Example
```jsx
function Avatar({ src, alt, size = 48 }) {
  return <img src={src} alt={alt} width={size} height={size} />;
}

<Avatar src="/me.jpg" alt="Profile" size={64} />
```

### Follow-up Questions
- Props vs state?
- How do you pass a function as a prop?
- What is prop types / TypeScript for props?

### Common Mistakes
- Trying to modify `props` inside the child
- Drilling the same prop through many layers without Context
- Spreading unknown props without care (`{...props}`) onto DOM nodes

### Project Connection
Shared UI in your app (buttons, cards) should accept props for text, variants, and callbacks.

---

## Question: What is state in React?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
State drives interactivity; interviewers listen for immutability and update patterns.

### Answer
State is data owned by a component that can change over time. When state updates, React re-renders the component and typically its children. State updates should be treated as immutable — create new objects/arrays rather than mutating existing state.

### Example
```jsx
function Toggle() {
  const [on, setOn] = useState(false);
  return (
    <button onClick={() => setOn((prev) => !prev)}>
      {on ? "On" : "Off"}
    </button>
  );
}
```

### Follow-up Questions
- Where should state live?
- What triggers a re-render?
- State vs refs?

### Common Mistakes
- Mutating state directly (`state.push`, `state.count++`)
- Putting derived data in state when it can be computed
- Too much state in one component

### Project Connection
Form inputs, modals open/closed, and fetched data in your project are all state candidates — explain where you kept each.

---

## Question: What is prop drilling and how do you reduce it?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Shows you can scale component trees without messy intermediate props.

### Answer
Prop drilling is passing props through many intermediate components that do not use them, only to reach a deep child. Fixes include lifting state only as high as needed, Context for widely shared values (theme, auth user), composition (children/slots), or dedicated state libraries for complex global state.

### Example
```jsx
// Theme via Context instead of drilling through Layout > Sidebar > Link
const ThemeContext = createContext("light");

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Layout />
    </ThemeContext.Provider>
  );
}

function Link() {
  const theme = useContext(ThemeContext);
  return <a className={theme}>Home</a>;
}
```

### Follow-up Questions
- When is prop drilling acceptable?
- Context vs Redux?
- What is component composition?

### Common Mistakes
- Using Context for every piece of state
- Globalizing state that should stay local
- Not recognizing drilling in your own codebase

### Project Connection
If your navbar, sidebar, and page all needed the logged-in user, explain whether you drilled props or used Context.

---

## Question: How does useState work?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
The most common hook — expect follow-ups on batching and initial state.

### Answer
`useState` returns a state value and a setter function. Calling the setter schedules a re-render with the new value. You can pass an initial value or a lazy initializer function for expensive setup. Use functional updates `setCount(c => c + 1)` when the next state depends on the previous state.

### Example
```jsx
function Cart() {
  const [items, setItems] = useState([]);

  function addItem(item) {
    setItems((prev) => [...prev, item]);
  }

  return <button onClick={() => addItem({ id: 1 })}>Add</button>;
}
```

### Follow-up Questions
- Why functional updates?
- Does the setter merge objects?
- Can you call useState conditionally?

### Common Mistakes
- Mutating arrays/objects in state
- Assuming `setState` merges like class `setState` (it replaces for objects)
- Calling useState inside loops or conditions

### Project Connection
Shopping cart or todo list in your project is a perfect useState story with immutable array updates.

---

## Question: What does useEffect do?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Side effects (fetch, subscriptions, DOM sync) separate React UI from the outside world.

### Answer
`useEffect` runs after render when React has painted the DOM (by default). You use it to synchronize with external systems: fetching data, subscribing to events, timers, or integrating non-React libraries. Return a cleanup function to run before re-run or unmount.

### Example
```jsx
useEffect(() => {
  document.title = `Unread: ${count}`;
}, [count]);
```

### Follow-up Questions
- When does useEffect run?
- What is the dependency array?
- useEffect vs useLayoutEffect?

### Common Mistakes
- Using useEffect for every state change without need
- Missing dependencies (stale closures)
- No cleanup on subscriptions

### Project Connection
Fetching project list on mount or syncing a document title are classic useEffect examples you can cite.

---

## Question: Explain the useEffect dependency array.

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Incorrect dependencies cause bugs that are hard to spot in interviews and production.

### Answer
The second argument to `useEffect` lists values that the effect reads from the component scope. When any dependency changes, the effect re-runs. An empty array `[]` means run once after mount (and cleanup on unmount). Omitting the array runs the effect after every render (rarely what you want).

### Example
```jsx
useEffect(() => {
  let cancelled = false;
  fetch(`/api/user/${userId}`)
    .then((r) => r.json())
    .then((data) => { if (!cancelled) setUser(data); });
  return () => { cancelled = true; };
}, [userId]);
```

### Follow-up Questions
- Why do exhaustive-deps lint rules exist?
- Are setState functions stable dependencies?
- What is a stale closure in an effect?

### Common Mistakes
- Empty deps when the effect uses props/state
- Putting objects/functions in deps without memoization
- Disabling eslint instead of fixing deps

### Project Connection
When your effect fetched data for a selected id, `[selectedId]` in the dependency array prevented showing wrong user's data.

---

## Question: How do you clean up in useEffect?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Memory leaks and duplicate subscriptions are common junior mistakes.

### Answer
Return a function from `useEffect`. React calls it before the effect runs again (if dependencies changed) and when the component unmounts. Use cleanup to clear intervals, abort fetches, remove event listeners, or unsubscribe from sockets.

### Example
```jsx
useEffect(() => {
  const id = setInterval(() => setTick((t) => t + 1), 1000);
  return () => clearInterval(id);
}, []);
```

### Follow-up Questions
- What happens if you forget cleanup?
- Does cleanup run on first mount?
- How to abort fetch in cleanup?

### Common Mistakes
- Adding duplicate listeners on every render
- Not clearing timers
- Assuming cleanup runs only on unmount when deps change too

### Project Connection
A search-as-you-type feature should cancel in-flight requests or ignore stale responses in cleanup.

---

## Question: What is useRef used for?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Refs bridge React and the DOM or hold mutable values without re-renders.

### Answer
`useRef` returns a mutable object `{ current }` that persists across renders. Common uses: accessing DOM nodes (`inputRef.current.focus()`), storing timer IDs, or keeping previous values. Updating `ref.current` does not trigger a re-render.

### Example
```jsx
function Search() {
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  return <input ref={inputRef} />;
}
```

### Follow-up Questions
- useRef vs useState?
- Can refs hold any value?
- When to use callback refs?

### Common Mistakes
- Storing UI state in refs to avoid re-renders (wrong tool)
- Reading ref.current during render for UI logic
- Overusing refs instead of controlled components

### Project Connection
Auto-focus on a login field or measuring an element height are practical ref examples.

---

## Question: How does useContext work?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Context is the built-in way to share values without drilling — know its limits.

### Answer
`useContext(SomeContext)` reads the nearest matching `Provider` value above in the tree. Pair with `createContext` and `Provider`. Good for theme, locale, or auth snapshot. When the provided value changes, consuming components re-render.

### Example
```jsx
const AuthContext = createContext(null);

function Dashboard() {
  const user = useContext(AuthContext);
  if (!user) return <p>Please log in</p>;
  return <p>Welcome, {user.name}</p>;
}
```

### Follow-up Questions
- Does Context replace Redux?
- How to avoid unnecessary re-renders?
- Default context value?

### Common Mistakes
- Putting fast-changing data in Context for the whole app
- Creating context inside render
- Not memoizing Provider value objects

### Project Connection
If you shared login state across routes, Context is a simple story before introducing Redux.

---

## Question: When should you use useMemo?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Interviewers check you do not optimize prematurely but know the tool.

### Answer
`useMemo` caches the result of an expensive calculation between renders until dependencies change. Use it when profiling shows real cost, or when you need referential stability for child memoization. Do not wrap every computation — it has overhead.

### Example
```jsx
const sorted = useMemo(
  () => [...items].sort((a, b) => a.price - b.price),
  [items]
);
```

### Follow-up Questions
- useMemo vs useCallback?
- Does useMemo prevent re-renders?
- React Compiler and memoization?

### Common Mistakes
- Memoizing cheap operations
- Wrong dependency arrays
- Expecting useMemo to fix all performance issues

### Project Connection
Filtering a large product list before display is a believable useMemo example if sorting/filtering was slow.

---

## Question: When should you use useCallback?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Stable function references matter for memoized children and effect dependencies.

### Answer
`useCallback` returns a memoized function that only changes when its dependencies change. Useful when passing callbacks to `React.memo` children or listing functions in `useEffect` dependencies without re-firing every render.

### Example
```jsx
const handleSave = useCallback(() => {
  saveItem(draft);
}, [draft]);

return <MemoizedEditor onSave={handleSave} />;
```

### Follow-up Questions
- useCallback vs inline arrow functions?
- Do all children need memo?
- Inlining vs callback stability

### Common Mistakes
- Wrapping every handler in useCallback
- Empty deps when closure uses stale state
- Using useCallback without React.memo downstream

### Project Connection
Passing `onSubmit` to a memoized form component is a common useCallback scenario.

---

## Question: What is useReducer and when prefer it over useState?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Shows you can model complex state transitions clearly.

### Answer
`useReducer` takes a reducer `(state, action) => newState` and an initial state, returning `[state, dispatch]`. Prefer it when state logic has multiple sub-values, next state depends on previous in non-trivial ways, or actions are easier to name than many `setX` calls.

### Example
```jsx
function reducer(state, action) {
  switch (action.type) {
    case "add": return { ...state, items: [...state.items, action.item] };
    case "clear": return { ...state, items: [] };
    default: return state;
  }
}

const [state, dispatch] = useReducer(reducer, { items: [] });
```

### Follow-up Questions
- useReducer vs Redux?
- Can useReducer be combined with Context?
- Immer with reducers?

### Common Mistakes
- Using useReducer for a single boolean
- Mutating state inside reducer
- Huge switch statements without splitting logic

### Project Connection
A multi-step wizard or form with several fields can be explained with useReducer actions.

---

## Question: What are custom hooks and why create them?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Custom hooks signal mature React — reusable logic without duplication.

### Answer
A custom hook is a function whose name starts with `use` that calls other hooks. It lets you extract stateful logic (fetch, form, media query) into one place. Each component using the hook gets its own isolated state.

### Example
```jsx
function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initial;
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}
```

### Follow-up Questions
- Can custom hooks return anything?
- Rules of Hooks in custom hooks?
- Testing custom hooks?

### Common Mistakes
- Custom hooks that do not call hooks but use the `use` prefix
- Sharing one state instance across app incorrectly
- Putting JSX inside custom hooks

### Project Connection
Extract `useFetchProjects` from your portfolio if you repeated fetch + loading + error logic.

---

## Question: Controlled vs uncontrolled components — what is the difference?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Forms come up constantly; this distinction is textbook React.

### Answer
A controlled component has form values driven by React state — the input's `value` comes from state and `onChange` updates state. Uncontrolled components store values in the DOM; you read them via refs (e.g. on submit). Controlled gives validation and single source of truth; uncontrolled can be simpler for quick forms.

### Example
```jsx
// Controlled
const [email, setEmail] = useState("");
<input value={email} onChange={(e) => setEmail(e.target.value)} />

// Uncontrolled
const emailRef = useRef();
<input ref={emailRef} defaultValue="" />
// read emailRef.current.value on submit
```

### Follow-up Questions
- defaultValue vs value?
- When is file input uncontrolled?
- React Hook Form — controlled or not?

### Common Mistakes
- Mixing controlled and uncontrolled (value without onChange)
- Using defaultValue after first render to reset
- Not lifting controlled state for shared forms

### Project Connection
Your login form is likely controlled — say how you validated email before submit.

---

## Question: Why do we need keys in lists?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Keys tie directly to reconciliation and subtle UI bugs.

### Answer
Keys help React identify which list items changed, were added, or removed. Stable keys preserve component state and DOM nodes for the correct item. Use stable unique IDs from data, not array index when the list can reorder or items can be inserted in the middle.

### Example
```jsx
{tasks.map((task) => (
  <TaskRow key={task.id} task={task} />
))}
```

### Follow-up Questions
- Index as key — when is it OK?
- What happens if keys duplicate?
- Keys on Fragments?

### Common Mistakes
- Using `key={index}` on sortable lists
- Generating keys with `Math.random()` on each render
- Putting key on the wrong element in a map

### Project Connection
Buggy checkboxes after deleting a todo usually means wrong keys — mention fixing with `todo.id`.

---

## Question: What is reconciliation in React?

### Difficulty
🔴 Hard

### Why Interviewers Ask This
Deep React question connecting Virtual DOM, keys, and updates.

### Answer
Reconciliation is React's process of comparing the new element tree with the previous one and deciding the minimal DOM updates. It uses heuristics (same component type at same position updates in place; different types unmount/remount). Keys improve matching in lists. Fiber architecture enables interruptible work in React 18.

### Example
```jsx
// Swapping types remounts — state resets
{loggedIn ? <Dashboard key="dash" /> : <Login key="login" />}
```

### Follow-up Questions
- What is the Fiber reconciler?
- How do keys affect reconciliation?
- diff O(n) heuristic?

### Common Mistakes
- Thinking React diffs the whole DOM character by character
- Not understanding remount on key/type change
- Ignoring state loss on remount

### Project Connection
Explain why changing `key` on a component resets its internal state (useful for 'reset form' patterns).

---

## Question: What is lifting state up?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Classic pattern for sharing state between siblings.

### Answer
When two components need the same data, move state to their closest common ancestor and pass state plus updaters down as props. Siblings stay in sync because one parent owns the truth.

### Example
```jsx
function Parent() {
  const [text, setText] = useState("");
  return (
    <>
      <Editor value={text} onChange={setText} />
      <Preview text={text} />
    </>
  );
}
```

### Follow-up Questions
- Lift state vs Context?
- Colocation of state?
- Prop drilling after lifting?

### Common Mistakes
- Lifting state too high globally
- Duplicating state in siblings
- Not passing callback to update shared state

### Project Connection
Temperature converter or shared search box between list and map views are interview-friendly examples.

---

## Question: What are common patterns for conditional rendering?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Every UI has loading/error/empty states — show you handle them cleanly.

### Answer
Use JavaScript in JSX: `if` before return, ternary for two branches, `&&` for simple show/hide (careful with `0`), or early returns for guard clauses. Keep conditions readable; extract subcomponents when JSX gets nested.

### Example
```jsx
if (loading) return <Spinner />;
if (error) return <ErrorBanner message={error} />;
return items.length ? <List items={items} /> : <EmptyState />;
```

### Follow-up Questions
- Danger of `count && <Badge />`?
- Switch vs object map for many cases?
- Suspense for loading?

### Common Mistakes
- Using `&&` with numbers that can be 0
- Deeply nested ternaries
- Duplicating layout in every branch

### Project Connection
Your data-fetching page should mention loading, error, and empty UI — interviewers love that.

---

## Question: How do you set up basic client-side routing with React Router?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Most SPAs need routes; know the modern data/router API at a high level.

### Answer
Install `react-router-dom`, wrap the app in a router (`BrowserRouter` or `createBrowserRouter` + `RouterProvider`), define `Route` elements with `path` and `element`, and use `Link`/`NavLink` for navigation without full page reloads.

### Example
```jsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <nav><Link to="/">Home</Link></nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    BrowserRouter>
  );
}
```

### Follow-up Questions
- BrowserRouter vs HashRouter?
- Nested routes?
- 404 route?

### Common Mistakes
- Using `<a href>` for internal links causing full reload
- Routes outside Router
- Forgetting basename on deployed subpaths

### Project Connection
Your portfolio's `/projects` and `/contact` pages are natural React Router talking points.

---

## Question: What are useParams and useNavigate in React Router?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Dynamic routes and programmatic navigation appear in real apps.

### Answer
`useParams` reads URL parameters from dynamic segments like `/users/:id`. `useNavigate` returns a function to change routes in code (after form submit, logout, etc.), optionally with `replace` or state.

### Example
```jsx
function UserPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate("/users", { replace: true })}>
      User {id} — Back
    </button>
  );
}
```

### Follow-up Questions
- useSearchParams?
- Relative navigation?
- Protecting routes?

### Common Mistakes
- Parsing window.location manually
- Not handling missing params
- Navigate in render causing loops

### Project Connection
Project detail `/projects/:slug` is a strong useParams example from your own app.

---

## Question: When should you use the Context API?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Balance between props, Context, and external stores.

### Answer
Use Context when many components need the same moderately stable data (theme, auth, language) and prop drilling hurts. Avoid Context for high-frequency updates to the entire tree or when simple props suffice. You can combine Context with `useReducer` for richer logic.

### Example
```jsx
const LocaleContext = createContext("en");
// Provider at app root; consumers read with useContext
```

### Follow-up Questions
- Splitting contexts?
- Context performance?
- Server Components and context?

### Common Mistakes
- One giant context causing global re-renders
- Using Context as a full Redux replacement blindly
- Not documenting what belongs in context

### Project Connection
Explain what you would *not* put in Context (e.g. every keystroke in a huge form).

---

## Question: What are error boundaries in React?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Production apps need graceful failure; only class components qualify today.

### Answer
Error boundaries catch JavaScript errors in child component trees during render, in lifecycle methods, or in constructors. They show fallback UI via `getDerivedStateFromError` / `componentDidCatch` and do not catch event handlers, async code, or SSR errors by themselves. There is no hook equivalent yet — use a class boundary or library.

### Example
```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) { log(error, info); }
  render() {
    return this.state.hasError ? <h2>Something went wrong.</h2> : this.props.children;
  }
}
```

### Follow-up Questions
- What errors are not caught?
- Error boundary per route?
- react-error-boundary package?

### Common Mistakes
- Trying to catch errors in event handlers with boundaries only
- No logging in componentDidCatch
- Wrapping every tiny component separately

### Project Connection
Wrap route-level content so one broken widget does not white-screen your whole portfolio.

---

## Question: What is React.memo and when does it help?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Performance questions often start with memo and when it is useless.

### Answer
`React.memo` is a higher-order component that skips re-rendering a child if props are shallowly equal to last render. It helps when the parent re-renders often but the child is expensive and props are stable. Pair with `useCallback`/`useMemo` for object/function props.

### Example
```jsx
const Chart = React.memo(function Chart({ data }) {
  return <ExpensiveVisualization data={data} />;
});
```

### Follow-up Questions
- memo vs useMemo?
- Custom comparison function?
- Default shallow compare limitations?

### Common Mistakes
- Memoizing every component
- New object props every render defeating memo
- Optimizing without measuring

### Project Connection
If parent state toggled a sidebar but chart data unchanged, memo avoids redundant chart work.

---

## Question: What React performance optimizations do you know besides memo?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Shows breadth: virtualization, splitting, state structure, concurrent features.

### Answer
Techniques: keep state local and colocated, avoid unnecessary context updates, virtualize long lists, code-split routes with `React.lazy`, debounce expensive handlers, use Web Workers for heavy work off main thread, and profile with React DevTools Profiler. React 18 concurrent features help keep UI responsive during updates.

### Example
```jsx
const Admin = React.lazy(() => import("./Admin"));

<Suspense fallback={<Spinner />}>
  <Admin />
</Suspense>
```

### Follow-up Questions
- What is virtualization?
- startTransition?
- Bundle size optimizations?

### Common Mistakes
- Premature optimization
- Huge lists without keys or virtualization
- Storing everything in one context

### Project Connection
Mention lazy-loading an admin panel or heavy chart library in your project.

---

## Question: What is React Strict Mode?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Explains double-invocation in dev and extra warnings.

### Answer
`<StrictMode>` is a development helper that activates additional checks and warnings (deprecated APIs, unexpected side effects). In React 18 Strict Mode, certain functions including effects may run twice in development to surface impure side effects. It does not affect production builds.

### Example
```jsx
import { StrictMode } from "react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

### Follow-up Questions
- Why double useEffect in dev?
- Does StrictMode render twice in production?
- Finding StrictMode bugs?

### Common Mistakes
- Removing StrictMode instead of fixing non-idempotent effects
- Assuming production double-fetch
- Ignoring StrictMode warnings

### Project Connection
If fetch ran twice in dev only, explain Strict Mode and adding abort/cleanup.

---

## Question: What is a React Fragment and why use it?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Avoids extra DOM nodes while satisfying single-parent rule.

### Answer
Fragments let you group multiple children without adding a wrapper DOM element. Syntax: `<></>` or `<Fragment key={...}>`. Useful for table rows, lists, or layout where an extra `div` breaks CSS or semantics.

### Example
```jsx
return (
  <>
    <h1>Title</h1>
    <p>Paragraph</p>
  </>
);
```

### Follow-up Questions
- Fragment with key in lists?
- Fragment vs div?
- Short syntax limitations?

### Common Mistakes
- Wrapping everything in unnecessary divs
- Using short syntax when key needed
- Fragment in wrong place breaking flex layout

### Project Connection
Replacing wrapper divs in a card component keeps CSS grid/flex predictable.

---

## Question: What are React portals?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Modals and tooltips need to escape parent overflow/z-index.

### Answer
Portals render children into a different DOM node (often `document.body`) while keeping the same React tree and event bubbling. `createPortal(child, domNode)` is used for modals, dropdowns, and tooltips.

### Example
```jsx
import { createPortal } from "react-dom";

function Modal({ open, children }) {
  if (!open) return null;
  return createPortal(
    <div className="modal-backdrop">{children}</div>,
    document.getElementById("modal-root")
  );
}
```

### Follow-up Questions
- Do portal events bubble through React tree?
- SSR with portals?
- Focus trap in modals?

### Common Mistakes
- Rendering modals inline under `overflow: hidden` parent
- Forgetting accessibility (focus, aria)
- Multiple portals without container

### Project Connection
Your project's modal likely should portal to body — good architecture detail.

---

## Question: What are synthetic events in React?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Event questions separate React beginners from those who read the docs.

### Answer
React wraps native browser events in `SyntheticEvent` for cross-browser consistency and pooling (legacy). Handlers receive synthetic events; call `event.preventDefault()` as usual. React 17+ attaches listeners to the root — not per element — for performance.

### Example
```jsx
function Form() {
  function handleSubmit(e) {
    e.preventDefault();
    // submit logic
  }
  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Follow-up Questions
- passive events?
- Event delegation in React 17+?
- stopPropagation pitfalls?

### Common Mistakes
- Assuming `e.target` is always an input
- Reading async pooled event fields (older React)
- Attaching native listeners without cleanup when React could handle it

### Project Connection
Login form `preventDefault` to avoid full page POST is a simple synthetic event win.

---

## Question: Local state vs global state — how do you decide?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Architecture question for mid-level roles.

### Answer
Keep state as local as possible (colocation). Lift or use Context when multiple distant components need it. Global libraries (Redux, Zustand) help when many features share complex async state, caching, middleware, or devtools needs. Start simple; add global state when pain is real.

### Example
```jsx
// Local: modal open flag inside ModalTrigger
// Global: authenticated user available across routes
```

### Follow-up Questions
- URL as state?
- Server state vs client state?
- React Query role?

### Common Mistakes
- Redux on day one for every app
- Everything in useState at App root
- Duplicating server data in many places

### Project Connection
Argue which state in your project stayed in the page vs a context/store.

---

## Question: Explain Redux basics at a high level.

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Many companies still ask even if you use simpler tools.

### Answer
Redux stores application state in a single immutable tree. You dispatch actions (plain objects describing what happened) to a reducer (pure function) that returns new state. UI subscribes via `useSelector`; updates flow one direction. Redux Toolkit simplifies boilerplate today.

### Example
```jsx
// Conceptual flow: UI -> dispatch(action) -> reducer -> new state -> UI
const count = useSelector((s) => s.counter.value);
const dispatch = useDispatch();
<button onClick={() => dispatch(increment())}>{count}</button>
```

### Follow-up Questions
- Redux vs Context?
- What is RTK?
- When is Redux overkill?

### Common Mistakes
- Mutating state in reducers
- Putting non-serializable values in store without reason
- Using Redux for local UI toggles only

### Project Connection
Say whether your project used Redux or would reach for Zustand/Context first.

---

## Question: What is concurrent rendering in React 18?

### Difficulty
🔴 Hard

### Why Interviewers Ask This
Modern React interviews touch 18 features at a conceptual level.

### Answer
Concurrent rendering lets React prepare multiple versions of the UI, interrupt low-priority updates, and keep the app responsive. Features like `startTransition`, `useDeferredValue`, and Suspense integrate with this model. Updates have urgency — typing should beat background list filtering.

### Example
```jsx
const [query, setQuery] = useState("");
const [isPending, startTransition] = useTransition();

function onChange(e) {
  setQuery(e.target.value);
  startTransition(() => setFiltered(heavyFilter(e.target.value)));
}
```

### Follow-up Questions
- Concurrent vs parallel?
- Automatic batching in 18?
- createRoot requirement?

### Common Mistakes
- Claiming concurrent means multi-threaded React everywhere
- Blocking main thread with heavy sync work
- Ignoring `createRoot` migration from legacy render

### Project Connection
Mark search filtering as transition so input stays snappy — ties theory to UX.

---

## Question: What is Suspense in React?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Suspense is expanding beyond libraries — know the loading boundary idea.

### Answer
Suspense lets components 'wait' for something (lazy-loaded code, async data in supported setups) and shows a fallback while waiting. Wrap lazy components or experimental data APIs in `<Suspense fallback={...}>`. Nested Suspense boundaries allow granular loading UI.

### Example
```jsx
const Settings = React.lazy(() => import("./Settings"));

<Suspense fallback={<p>Loading settings...</p>}>
  <Settings />
</Suspense>
```

### Follow-up Questions
- Suspense for data fetching today?
- Error boundaries + Suspense?
- SSR Suspense?

### Common Mistakes
- One Suspense at root with generic spinner only
- Forgetting lazy import default export
- Treating Suspense as error handling

### Project Connection
Route-level lazy loading with a branded skeleton fallback looks polished in demos.

---

## Question: How do you handle forms in React?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Connects controlled inputs, validation, and submit flow.

### Answer
Typical approach: controlled inputs in state or a form library (React Hook Form, Formik), validate on change or submit, prevent default on submit, call API, show errors from server. For large forms, libraries reduce re-renders and boilerplate.

### Example
```jsx
function Signup() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      await api.signup(form);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      {error && <p role="alert">{error}</p>}
      <button type="submit">Sign up</button>
    </form>
  );
}
```

### Follow-up Questions
- Client vs server validation?
- Accessible form errors?
- Uncontrolled with React Hook Form?

### Common Mistakes
- No loading/disabled state on submit
- Password in plain state logged accidentally
- Missing `htmlFor` / labels

### Project Connection
Walk through your signup or contact form validation and error display.

---

## Question: What are basics of testing React components?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Teams want confidence you can verify UI behavior.

### Answer
Use React Testing Library with Vitest or Jest: render components, query as users do (`getByRole`, `getByLabelText`), fire events, assert outcomes. Test behavior not implementation. Mock network with MSW. Avoid testing internal state directly.

### Example
```jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

test("increments counter", async () => {
  render(<Counter />);
  await userEvent.click(screen.getByRole("button", { name: /increment/i }));
  expect(screen.getByText("1")).toBeInTheDocument();
});
```

### Follow-up Questions
- getBy vs queryBy?
- Testing async fetch?
- Snapshot tests?

### Common Mistakes
- Testing implementation details (state names)
- Using enzyme patterns on hooks code
- No tests for critical flows

### Project Connection
One test for your main CTA button or login validation is enough to mention in interviews.

---

## Question: What are class component lifecycle methods?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Legacy knowledge still asked; map to hooks mentally.

### Answer
Main phases: mount (`constructor`, `render`, `componentDidMount`), update (`render`, `componentDidUpdate`), unmount (`componentWillUnmount`). `getDerivedStateFromProps` and `shouldComponentUpdate` are advanced. `componentDidCatch` for errors.

### Example
```jsx
class Profile extends React.Component {
  componentDidMount() { this.loadUser(); }
  componentDidUpdate(prev) {
    if (prev.userId !== this.props.userId) this.loadUser();
  }
  componentWillUnmount() { this.cancel(); }
}
```

### Follow-up Questions
- Deprecated UNSAFE methods?
- PureComponent?
- Lifecycle in Strict Mode?

### Common Mistakes
- Using componentWillMount for data (deprecated)
- Not canceling async in unmount
- Confusing render with side effects

### Project Connection
If you read old tutorials, show you can translate lifecycle to useEffect.

---

## Question: How do class lifecycle methods map to useEffect?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Bridge question for maintainers of mixed codebases.

### Answer
`componentDidMount` + `componentWillUnmount` → `useEffect(fn, [])` with cleanup. `componentDidUpdate` for specific props → `useEffect(fn, [dep])`. There is no exact `getDerivedStateFromProps` hook — derive during render or adjust state carefully in effect. `shouldComponentUpdate` → `React.memo` or `useMemo`.

### Example
```jsx
useEffect(() => {
  load(userId);
  return () => cancel();
}, [userId]);
```

### Follow-up Questions
- Why not one effect emulating all lifecycles?
- useLayoutEffect mapping?
- Infinite loop in effect updates?

### Common Mistakes
- Single effect with empty deps that uses all props (stale data)
- Missing cleanup mapping from unmount
- Running side effects during render

### Project Connection
Explain how you refetched when route param changed using `[id]` dependency.

---

## Question: What is the children prop?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Composition is idiomatic React — more flexible than config props alone.

### Answer
`children` is the content nested between opening and closing tags of a component. It can be text, elements, or render functions. Layout components (`Card`, `Modal`, `Page`) often use `children` for flexible composition.

### Example
```jsx
function Card({ title, children }) {
  return (
    <section className="card">
      <h2>{title}</h2>
      <div className="card-body">{children}</div>
    </section>
  );
}

<Card title="Stats">{statsContent}</Card>
```

### Follow-up Questions
- children as function?
- React.Children utilities?
- children vs slots?

### Common Mistakes
- Overusing render props when children suffice
- Not typing children in TypeScript
- Passing children and duplicate content props

### Project Connection
Your layout wrapper likely wraps page content via children.

---

## Question: What is the render props pattern?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Historical pattern; still appears in libraries and interviews.

### Answer
A component receives a function prop (often `render` or `children`) that returns JSX, sharing logic/state with the caller. The parent handles behavior; the caller decides UI. Largely replaced by custom hooks but still valid.

### Example
```jsx
function MouseTracker({ render }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return render(pos);
}
```

### Follow-up Questions
- Render props vs hooks?
- Performance of render props?
- children as function naming?

### Common Mistakes
- Deep nesting callback hell
- Not memoizing render prop functions
- Using pattern when a custom hook is clearer

### Project Connection
Note you would refactor shared fetch logic to `useFetch` today instead of render props.

---

## Question: What are compound components?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Pattern for flexible APIs (tabs, accordions) without prop explosion.

### Answer
Compound components work together implicitly — often via Context — sharing state while letting the consumer arrange subparts (`Tabs`, `Tabs.List`, `Tabs.Panel`). Users compose markup instead of passing ten configuration props.

### Example
```jsx
// Consumer API sketch
<Tabs defaultValue="profile">
  <Tabs.List>
    <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Panel value="profile">...</Tabs.Panel>
</Tabs>
```

### Follow-up Questions
- Context in compound components?
- Radix/shadcn examples?
- vs single component with props?

### Common Mistakes
- Leaking internal context
- Breaking composition with required order docs missing
- Over-engineering simple UI

### Project Connection
If you used a UI library with Tab parts, describe that API as compound components.

---

## Question: How do code splitting and React.lazy work?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Bundle size affects load time — splitting is a practical win.

### Answer
Code splitting breaks the JS bundle into chunks loaded on demand. `React.lazy` accepts a dynamic `import()` and returns a component. Wrap with `Suspense` for fallback UI. Route-based splitting is the most common win.

### Example
```jsx
const Dashboard = React.lazy(() => import("./pages/Dashboard"));

<Route path="/dashboard" element={
  <Suspense fallback={<PageSkeleton />}>
    <Dashboard />
  </Suspense>
} />
```

### Follow-up Questions
- Vite/Webpack dynamic import?
- Preloading routes?
- lazy + named exports?

### Common Mistakes
- Lazy loading everything causing waterfall without planning
- Missing Suspense boundary
- Importing heavy lib in main bundle unnecessarily

### Project Connection
Split admin or chart routes in your app to shrink initial load for interviewers.

---

## Question: What is SSR in a React context?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Connects React to Next.js interviews without claiming expertise you lack.

### Answer
Server-Side Rendering generates HTML on the server per request (or at build time for SSG), sends markup to the client, then React hydrates — attaching event listeners and making the page interactive. Benefits: faster first paint, SEO for content pages. Frameworks like Next.js handle routing and data loading patterns.

### Example
```jsx
// Conceptual: server renders <App /> to HTML string; client hydrateRoot(container, <App />)
```

### Follow-up Questions
- SSR vs CSR?
- Hydration mismatch?
- RSC overview?

### Common Mistakes
- Using browser APIs during SSR without guards
- Hydration errors from random IDs
- Claiming all React apps need SSR

### Project Connection
If you used Next.js, explain one page that benefits from server render (marketing, blog).

---

## Question: What are good event handling patterns in React?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Daily coding — handlers, binding, and forms.

### Answer
Define handlers in the component (arrow functions or `useCallback` when needed). Pass reference to JSX: `onClick={handleClick}` not `onClick={handleClick()}` unless calling immediately. For lists, pass stable handlers or inline with id parameter. Debounce expensive handlers. Use form `onSubmit` for enter key behavior.

### Example
```jsx
function ItemList({ items, onDelete }) {
  return items.map((item) => (
    <button key={item.id} onClick={() => onDelete(item.id)}>
      Delete {item.name}
    </button>
  ));
}
```

### Follow-up Questions
- Synthetic events and async?
- passing arguments to handlers?
- Document-level listeners in useEffect?

### Common Mistakes
- Invoking handler in JSX causing instant run
- Creating new function each render when it breaks memo children
- forgetting preventDefault on forms

### Project Connection
Delete button on a list item should call parent with id — classic pattern.

---

## Question: What is ref forwarding with forwardRef?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Needed for reusable inputs and library components.

### Answer
`forwardRef` lets a parent pass a ref to a child's inner DOM node or imperative handle. Combine with `useImperativeHandle` to expose a limited API.

### Example
```jsx
const FancyInput = forwardRef(function FancyInput(props, ref) {
  return <input ref={ref} className="fancy" {...props} />;
});

const ref = useRef();
<FancyInput ref={ref} />;
ref.current?.focus();
```

### Follow-up Questions
- forwardRef in TypeScript?
- useImperativeHandle?
- Refs on function components without forwardRef?

### Common Mistakes
- Forwarding refs unnecessarily on every component
- Breaking ref by wrapping in div without merge
- Exposing entire DOM when only focus() needed

### Project Connection
Design system input that parent focuses on validation error uses forwardRef.

---

## Question: How do keys affect list performance?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Links keys to unnecessary remounts and lost state.

### Answer
Bad keys (random or index on reorderable lists) force React to remount items, losing internal state and hurting performance. Stable keys let React reuse instances and update in place. For dynamic lists, key on identity, not position.

### Example
```jsx
// Bad after sort: index keys shuffle identity
// Good: key={item.id} stable across reorder
```

### Follow-up Questions
- Reconciliation cost?
- Animating list reorder?
- key on component vs element?

### Common Mistakes
- Math.random() keys
- Index keys on filtered sorted tables
- Changing key to reset without understanding remount

### Project Connection
After fixing todo keys, explain smoother edits and preserved input focus.

---

## Question: What are common React anti-patterns?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Senior interviewers listen for smell recognition.

### Answer
Examples: mutating state, massive components, useEffect for everything, copying props to state unnecessarily, index keys on dynamic lists, overusing Context/global state, fetching in render, ignoring dependency arrays, prop drilling when composition works, and premature memoization without profiling.

### Example
```jsx
// Anti-pattern: derived state sync
const [fullName, setFullName] = useState("");
useEffect(() => {
  setFullName(`${first} ${last}`);
}, [first, last]); // just compute fullName in render
```

### Follow-up Questions
- God components?
- Boolean prop explosion?
- useEffect to respond to props?

### Common Mistakes
- Fighting React with imperative DOM hacks
- Not lifting or colocating state thoughtfully
- Disabling lint rules globally

### Project Connection
Pick one mistake you fixed in a project — interviewers prefer honest learning stories.

---

## Question: What are the Rules of Hooks?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Breaking rules causes cryptic bugs — must-know.

### Answer
Only call hooks at the top level of React functions (components or custom hooks) — not in loops, conditions, or nested functions. Only call hooks from React function components or custom hooks. ESLint `eslint-plugin-react-hooks` enforces this.

### Example
```jsx
// Wrong
if (loggedIn) {
  const [x, setX] = useState(0); // breaks rules
}
```

### Follow-up Questions
- Why do rules exist?
- Hooks in class components?
- Conditional hooks workaround?

### Common Mistakes
- Conditional useState
- Calling hooks from regular utilities
- Custom hooks not named with use

### Project Connection
Explain you extract conditional logic into child components so hooks stay unconditional.

---

## Question: What is automatic batching in React 18?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Batching explains multiple setStates → one render.

### Answer
React 18 batches multiple state updates from the same event into one re-render, including updates inside promises, timeouts, and native handlers (not only React events). This reduces redundant renders. `flushSync` forces synchronous flush when needed.

### Example
```jsx
function handleClick() {
  setA(1);
  setB(2);
  // React 18: typically one re-render
}
```

### Follow-up Questions
- React 17 batching limits?
- flushSync use cases?
- Batching in async tests?

### Common Mistakes
- Expecting immediate DOM read after setState in same function
- Overusing flushSync
- Confusing batching with concurrent features

### Project Connection
Multiple field updates on one submit batching is why you did not see flicker.

---

## Question: What is a Higher-Order Component (HOC)?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Legacy pattern; still in libraries like `connect` and `withRouter` history.

### Answer
A HOC is a function that takes a component and returns a new component with added props or behavior (auth, logging). Prefer hooks or composition today, but recognize HOCs in older code.

### Example
```jsx
function withAuth(Wrapped) {
  return function AuthComponent(props) {
    const user = useAuth();
    if (!user) return <Navigate to="/login" />;
    return <Wrapped {...props} user={user} />;
  };
}
```

### Follow-up Questions
- HOC vs custom hook?
- Display name debugging?
- Multiple HOC wrapper hell?

### Common Mistakes
- Wrapping HOCs without forwarding refs
- Using HOC for every tiny concern
- Not knowing modern hook alternative

### Project Connection
If you see `withAuth(Dashboard)` in a codebase, explain what it injects.

---

## Question: What is the useId hook?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Accessibility tie-in — ids for labels and aria.

### Answer
`useId` generates stable unique IDs across server and client, useful for linking `<label htmlFor>` and `id` on inputs or aria attributes. IDs are not for list keys.

### Example
```jsx
function Field({ label }) {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input id={id} />
    </>
  );
}
```

### Follow-up Questions
- useId vs increment counter?
- SSR id mismatch?
- useId for keys?

### Common Mistakes
- Using useId for list keys
- Hard-coded duplicate ids
- Skipping labels in forms

### Project Connection
Accessible forms in your project should mention label/input association.

---

## Question: What is one-way data flow in React?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Core mental model for debugging data bugs.

### Answer
Data flows down via props; events flow up via callbacks. Parents own state; children request changes through functions passed as props. This predictability makes debugging easier than two-way binding spaghetti.

### Example
```jsx
function Parent() {
  const [value, setValue] = useState("");
  return <Child value={value} onChange={setValue} />;
}
```

### Follow-up Questions
- Two-way binding in React?
- Unidirectional vs Flux?
- Props drilling limits?

### Common Mistakes
- Child mutating parent state without callback
- Syncing two states for same data
- Global event bus instead of React patterns

### Project Connection
Describe how a child search bar updated parent list via `onSearch` callback.

---

## Question: What is the purpose of keys on React.Fragment in lists?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Edge case that shows you read the key docs.

### Answer
When mapping to multiple sibling elements, you may need `<Fragment key={id}>` because short syntax `<>` does not accept keys. Keys must be on the outermost element in the map.

### Example
```jsx
{items.map((item) => (
  <Fragment key={item.id}>
    <dt>{item.term}</dt>
    <dd>{item.def}</dd>
  </Fragment>
))}
```

### Follow-up Questions
- dl/dt/dd grouping?
- key on first child only?
- React 19 changes?

### Common Mistakes
- Key on inner element instead of fragment wrapper
- Using `<>` in map without key
- Duplicate keys across list

### Project Connection
Glossary or FAQ list with term+definition pairs is a Fragment key example.

---

## Question: How do you avoid unnecessary re-renders from Context?

### Difficulty
🔴 Hard

### Why Interviewers Ask This
Advanced Context performance — common in mid/senior loops.

### Answer
Split contexts by concern (theme vs user), memoize provider value with `useMemo`, avoid putting rapidly changing values in wide providers, and consume context low in the tree. Sometimes pass selectors via libraries (use-context-selector) or move fast state local.

### Example
```jsx
const value = useMemo(() => ({ user, logout }), [user, logout]);
return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
```

### Follow-up Questions
- Context vs Zustand?
- React 19 context as provider?
- Measuring re-renders?

### Common Mistakes
- New object/function in Provider every render
- Single context for entire store
- Not splitting read/write contexts

### Project Connection
If theme toggle re-rendered entire app, explain splitting ThemeContext from AuthContext.

---

## Question: What is useLayoutEffect and when use it?

### Difficulty
🔴 Hard

### Why Interviewers Ask This
Distinguishes you from candidates who only know useEffect.

### Answer
`useLayoutEffect` fires synchronously after DOM mutations but before the browser paints. Use when you must measure layout or mutate DOM before user sees flicker (tooltips position, scroll sync). Default to `useEffect`; reach for layout effect when visual glitch proves it.

### Example
```jsx
useLayoutEffect(() => {
  const height = ref.current.getBoundingClientRect().height;
  setTooltipTop(height);
}, [open]);
```

### Follow-up Questions
- useLayoutEffect on server?
- Performance cost?
- ResizeObserver alternative?

### Common Mistakes
- Using useLayoutEffect for all data fetching
- Running on server without guard
- Layout effect causing jank if work is heavy

### Project Connection
Mention only if you fixed a flash of wrong tooltip position — otherwise say you would default to useEffect.

---

## Question: What is hydration?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
SSR/Next interviews bridge client and server React.

### Answer
Hydration is when client-side React attaches to server-rendered HTML, wiring event handlers and reconciling the tree. Mismatches between server HTML and client first render cause hydration warnings/errors (e.g. random dates, invalid nesting).

### Example
```jsx
// Server and client must render same initial markup for interactive islands
```

### Follow-up Questions
- hydrateRoot vs render?
- Suppressing hydration warning?
- Streaming HTML?

### Common Mistakes
- Date.now() in initial render
- Browser-only APIs in SSR render
- Different data on server vs client without sync

### Project Connection
If you saw hydration errors in Next.js, explain fixing `typeof window` guards or consistent data.

---

## Question: What is component composition vs inheritance?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
React favors composition — classic Facebook docs question.

### Answer
React recommends composing components via props, children, and hooks rather than subclassing components for reuse. Specialization happens by nesting components and passing configuration, not extending base classes.

### Example
```jsx
function Dialog({ title, children, footer }) {
  return (
    <div className="dialog">
      <header>{title}</header>
      <main>{children}</main>
      <footer>{footer}</footer>
    </div>
  );
}
```

### Follow-up Questions
- Inheritance in React ever?
- Mixin history?
- Hooks replacing mixins?

### Common Mistakes
- Deep inheritance hierarchies
- Copy-paste instead of small composable pieces
- Not using children for layout

### Project Connection
Prefer composing `PageHeader` + `PageBody` over one mega `Page` with twenty props.

---

## Question: What is useImperativeHandle?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Pairs with forwardRef for limited parent control.

### Answer
`useImperativeHandle(ref, createHandle, deps)` customizes the instance value exposed when parent uses ref on your component. Use sparingly for focus, scroll, or media play — keep React declarative by default.

### Example
```jsx
const Video = forwardRef(function Video(props, ref) {
  const videoRef = useRef();
  useImperativeHandle(ref, () => ({
    play: () => videoRef.current.play(),
  }), []);
  return <video ref={videoRef} {...props} />;
});
```

### Follow-up Questions
- When not to use imperative handle?
- TypeScript typing ref handle?
- Refs vs state?

### Common Mistakes
- Exposing entire internal API
- Overusing imperative patterns
- Missing forwardRef

### Project Connection
Parent calling `ref.current.play()` on a wrapped video component is the textbook case.

---

## Question: What are default props vs default parameters today?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Small but practical — defaults in function signatures are standard now.

### Answer
In function components, use ES6 default parameters (`function Btn({ size = 'md' })`). Class components historically used `static defaultProps`. Default parameters are simpler and work well with TypeScript.

### Example
```jsx
function Button({ variant = "primary", children }) {
  return <button className={`btn-${variant}`}>{children}</button>;
}
```

### Follow-up Questions
- defaultProps deprecation note?
- null vs undefined defaults?
- Default in destructuring vs defaultProps?

### Common Mistakes
- Mutating default object/array literals shared across calls
- Relying on defaultProps in new function components
- Undefined vs null breaking defaults

### Project Connection
Your design system button variants likely use default parameter for `variant`.

---

## Question: How does React handle lists and filtering without losing focus?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Practical UX + keys + state colocation.

### Answer
Keep stable `key` on item id, control filter state in parent or memoized derived list, avoid remounting the whole list when possible, and lift input state so filtering does not reset unrelated UI. For editable rows, key by id not index.

### Example
```jsx
const visible = useMemo(
  () => todos.filter((t) => t.text.includes(query)),
  [todos, query]
);
return visible.map((t) => <TodoRow key={t.id} todo={t} />);
```

### Follow-up Questions
- Controlled filter input?
- Virtualization?
- Resetting state on filter change intentionally?

### Common Mistakes
- Index keys while deleting filtered items
- Recreating list component with new key on each keystroke
- Filtering in render without memo on huge lists

### Project Connection
Searchable todo list in your project — explain keys and filtered array.

---

## Question: What is prop types vs TypeScript for React?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Type safety question for JS and TS candidates.

### Answer
PropTypes validate props at runtime in development (legacy in many TS projects). TypeScript checks types at compile time and is the modern default for new apps. Both encourage clear component contracts.

### Example
```tsx
interface ButtonProps {
  label: string;
  onClick?: () => void;
}
function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
```

### Follow-up Questions
- Runtime validation still needed?
- defaultProps with TS?
- children typing?

### Common Mistakes
- Using `any` everywhere
- Not typing public component props
- PropTypes on every file in TS project redundantly

### Project Connection
Mention TypeScript interfaces for your main components if your repo uses TS.

---

## Question: What is the difference between element and component?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Clarifies React.createElement mental model.

### Answer
A component is a function or class (e.g. `Button`). An element is a plain object describing what to render (`<Button />` or `React.createElement(Button)`). Elements are immutable descriptions; components are the recipes that produce elements.

### Example
```jsx
const element = <Button primary />; // element object
function Button(props) { return <button className={props.primary ? 'p' : ''} />; }
```

### Follow-up Questions
- Re-render creates new elements?
- Element type field?
- Host vs composite components?

### Common Mistakes
- Confusing component definition with instance
- Thinking JSX creates DOM nodes immediately
- Not knowing elements are lightweight

### Project Connection
Helps explain why you can store JSX in variables and return conditionally.

---

## Question: What is useSyncExternalStore (high level)?

### Difficulty
🔴 Hard

### Why Interviewers Ask This
Shows awareness of React 18 external store subscription API.

### Answer
`useSyncExternalStore` lets React subscribe to external stores (browser APIs, Redux, Zustand internals) safely with concurrent rendering, avoiding tearing. Library authors use it; app devs rarely touch it directly unless integrating custom stores.

### Example
```jsx
const width = useSyncExternalStore(subscribe, () => window.innerWidth, () => 0);
```

### Follow-up Questions
- Tearing in concurrent mode?
- Redux 8+ and this hook?
- Server snapshot arg?

### Common Mistakes
- Rolling custom global store without subscription pattern
- Reading window in render without subscribe
- Ignoring server snapshot for SSR

### Project Connection
Optional deep answer if asked about Zustand/Redux working with React 18.

---

