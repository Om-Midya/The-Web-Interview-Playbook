# React: Project-Style Questions

20 scenario questions based on real React interviews. Answer with: **problem → approach → code sketch → tradeoff**.

---

## 1. Component Folder Structure

**Q:** How do you organize a medium React app?

**A:** Feature-based or type-based. Example:
```
src/
  components/     # shared UI (Button, Modal)
  features/       # auth/, products/, cart/
  hooks/          # useAuth, useFetch
  pages/          # route-level components
  utils/
  App.jsx
```
Co-locate feature-specific components inside feature folders.

---

## 2. Where Should State Live?

**Q:** Parent or child holds filter state for a list?

**A:** If only the list needs it → child. If siblings need it (list + filter count badge) → lift to common parent. If many components need it → Context or state library.

---

## 3. Fetch on Mount Pattern

**Q:** Load products when page loads. Show loading/error.

**A:**
```jsx
function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/products', { signal: controller.signal })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(setProducts)
      .catch(e => e.name !== 'AbortError' && setError(String(e)))
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <Error message={error} />;
  if (!products.length) return <Empty />;
  return <ProductGrid products={products} />;
}
```

---

## 4. Controlled Search Input

**Q:** Search filters a list in real time.

**A:** Controlled input + derive filtered list (no extra effect):
```jsx
const [query, setQuery] = useState('');
const filtered = products.filter(p =>
  p.name.toLowerCase().includes(query.toLowerCase())
);
```

---

## 5. Authentication Flow

**Q:** How handle login in React?

**A:** Login form → API → store token (httpOnly cookie preferred, or memory/localStorage with XSS awareness) → AuthContext provides user → protected routes check auth → redirect if not logged in.

---

## 6. Protected Routes

**Q:** Only logged-in users see `/dashboard`.

**A:**
```jsx
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
```

---

## 7. Form with Validation

**Q:** Registration form with client validation.

**A:** Controlled inputs, validate on submit (or on blur), show field errors object:
```jsx
const [errors, setErrors] = useState({});
const validate = () => {
  const e = {};
  if (!email.includes('@')) e.email = 'Invalid email';
  if (password.length < 8) e.password = 'Min 8 chars';
  return e;
};
const handleSubmit = (e) => {
  e.preventDefault();
  const e2 = validate();
  if (Object.keys(e2).length) return setErrors(e2);
  // submit
};
```

---

## 8. Modal in React

**Q:** Reusable modal component?

**A:** Portal to `document.body`, `isOpen` prop, close on overlay/Escape, focus trap. Consider headless UI or Radix for accessibility.

```jsx
import { createPortal } from 'react-dom';

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return createPortal(
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
}
```

---

## 9. Infinite Scroll

**Q:** Load more posts on scroll.

**A:** `IntersectionObserver` on sentinel element at list bottom OR throttled scroll. Append to state, track `page` and `hasMore`. Show loader while fetching.

---

## 10. Optimistic UI Update

**Q:** Like button — instant feedback before API confirms.

**A:** Update UI immediately, revert on error:
```jsx
const handleLike = async () => {
  setLiked(true);
  setCount(c => c + 1);
  try {
    await api.like(postId);
  } catch {
    setLiked(false);
    setCount(c => c - 1);
    toast.error('Failed to like');
  }
};
```

---

## 11. Debounced API Search

**Q:** Search calls API, not just filters local data.

**A:** Custom hook with debounced value:
```jsx
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
```

---

## 12. Theme Toggle

**Q:** Dark/light mode across app.

**A:** Context + `data-theme` on `<html>` + CSS variables + localStorage persistence.

---

## 13. Error Boundary

**Q:** Child component throws — app shouldn't white-screen.

**A:** Class component with `static getDerivedStateFromError` or `componentDidCatch`. Wrap route sections. Log to Sentry. Show fallback UI.

**Note:** Error boundaries don't catch event handlers or async errors.

---

## 14. Lifting State vs Context vs Redux

**Q:** When use each?

**A:**
- **Lift state:** 2–3 components share data
- **Context:** theme, auth, locale — low-frequency updates
- **Redux/Zustand:** complex global state, many updates, middleware needs

For student projects, Context + useReducer is often enough.

---

## 15. Key Prop Mistake

**Q:** List reorders but wrong item stays checked. Why?

**A:** Using `index` as `key`. React reuses component instances incorrectly. Use stable unique `id`.

---

## 16. useEffect Infinite Loop

**Q:** This crashes the browser. Why?

```jsx
const [data, setData] = useState([]);
useEffect(() => {
  setData([...data, fetchMore()]);
});
```

**A:** No dependency array → runs every render → setState → render → loop. Fix deps and fetch logic.

---

## 17. Custom Hook Extraction

**Q:** Three components use same fetch logic. Refactor?

**A:** Extract `useFetch(url)` custom hook. Returns `{ data, loading, error, refetch }`.

---

## 18. Pagination UI

**Q:** Server-side pagination with page buttons.

**A:** State: `page`, `totalPages`. Fetch when `page` changes. Disable prev/next at boundaries. Show page numbers with ellipsis for many pages.

---

## 19. File Upload Preview

**Q:** User selects image, show preview before upload.

**A:**
```jsx
const [preview, setPreview] = useState(null);

const handleFile = (e) => {
  const file = e.target.files[0];
  if (file) setPreview(URL.createObjectURL(file));
};

useEffect(() => () => {
  if (preview) URL.revokeObjectURL(preview);
}, [preview]);
```

---

## 20. Migrating to TypeScript (awareness)

**Q:** Benefits of TypeScript in React?

**A:** Prop type safety, better IDE autocomplete, catch errors at compile time. Start with `interface Props` on components, type API responses.

---

## Practice Method

Pick 5 questions daily. Answer in 3 minutes. Draw component tree on paper for UI questions.
