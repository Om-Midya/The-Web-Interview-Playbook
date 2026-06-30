# React: Revision Sheet

One-page rapid review. Night before interview.

## JSX Essentials

```jsx
{condition && <Component />}
{a ? <A /> : <B />}
<>{multiple}{elements}</>
```

## useState

```jsx
const [x, setX] = useState(initial);
setX(prev => prev + 1);  // functional update
```

## useEffect

```jsx
useEffect(() => {
  // side effect
  return () => { /* cleanup */ };
}, [dep1, dep2]);  // [] = mount only
```

**Don't:** sync derived state, respond to clicks

## useRef

DOM access + mutable values without re-render.

## useContext

`createContext` → `Provider` → `useContext` — avoid overuse.

## useMemo / useCallback

- `useMemo(() => compute(a), [a])` — cache value
- `useCallback(() => fn(), [deps])` — cache function

## useReducer

`(state, action) => newState` — complex state transitions.

## Rules of Hooks

Top level only. React functions or custom hooks only.

## Re-render Triggers

State change, parent re-render, context change.

## React.memo

Skip re-render if props shallow-equal.

## Keys

Stable unique `id` — not index for dynamic lists.

## Controlled Input

```jsx
<input value={v} onChange={e => setV(e.target.value)} />
```

## Fetch Pattern

Loading + error + empty + abort controller.

## Lifting State

Share state at lowest common ancestor.

## Code Splitting

```jsx
const Page = lazy(() => import('./Page'));
<Suspense fallback={...}><Page /></Suspense>
```

## Virtual DOM

Reconciliation — diff old vs new virtual tree, update real DOM minimally.

## Props vs State

- **Props:** passed in, read-only
- **State:** internal, triggers re-render

## Children Prop

```jsx
<Card>{content}</Card>
// props.children inside Card
```

## Custom Hooks

`function useX() { ... }` — extract reusable logic.

## Quick Answers

| Question | Answer |
|----------|--------|
| Why keys? | Identity for reconciliation |
| Strict Mode double effect? | Intentional dev check |
| Context perf issue? | All consumers re-render |
| Error boundary catches? | Render errors, not event/async |
| When useReducer? | Complex multi-field state |

## Red Flags

- Mutating state
- Missing effect deps
- Index keys on sortable list
- Fetch without loading/error
- Hooks in conditions
