# React: Topics Not to Miss

Check off each topic before your interview.

## Fundamentals

- [ ] What React is (UI library, component-based, declarative)
- [ ] JSX — expressions, fragments, keys
- [ ] Components: function components (class awareness only)
- [ ] Props — read-only, drilling, children prop
- [ ] Conditional rendering (`&&`, ternary)
- [ ] Lists and `key` prop — why not index for dynamic lists

## State & Hooks

- [ ] `useState` — batching, functional updates
- [ ] `useEffect` — deps array, cleanup, when NOT to use
- [ ] `useRef` — DOM access, mutable values without re-render
- [ ] `useContext` — avoid prop drilling
- [ ] `useMemo` / `useCallback` — when they help vs hurt
- [ ] `useReducer` — complex state logic
- [ ] Rules of Hooks

## Rendering

- [ ] Virtual DOM concept (reconciliation)
- [ ] What triggers re-render
- [ ] Controlled vs uncontrolled inputs
- [ ] Lifting state up
- [ ] Composition vs inheritance

## Data Fetching

- [ ] `useEffect` + fetch pattern
- [ ] Loading, error, empty states
- [ ] Race conditions (abort controller)
- [ ] React Query / SWR awareness (optional bonus)

## Routing & Structure

- [ ] React Router basics (`Route`, `Link`, `useParams`, `useNavigate`)
- [ ] Folder structure for medium apps
- [ ] Custom hooks for reusable logic

## Forms

- [ ] Controlled components
- [ ] Form libraries awareness (React Hook Form)
- [ ] Validation approach

## Performance

- [ ] Unnecessary re-renders
- [ ] `React.memo`, `useMemo`, `useCallback`
- [ ] Code splitting / `lazy` + `Suspense`
- [ ] List virtualization (awareness)

## Testing & Tooling (awareness)

- [ ] Vite vs CRA
- [ ] ESLint + React hooks plugin
- [ ] Basic component test concept (React Testing Library)

## React 18+ (bonus)

- [ ] Concurrent features awareness
- [ ] `useTransition`, `useDeferredValue` (high level)
- [ ] Strict Mode double-invoke in dev

---

**Self-test:** Can you build a searchable product list with loading/error states using hooks in 45 minutes? Can you explain why your `useEffect` dependency array is correct?
