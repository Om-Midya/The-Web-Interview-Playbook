# Frontend System Design

How to discuss React/SPA architecture in interviews — component structure, state, performance, and common UI patterns at scale.

---

## Component Architecture

### The Problem

As apps grow, a single `App.tsx` with 2,000 lines becomes impossible to maintain, test, or onboard new developers to.

### How to Structure (Student-Realistic)

**Feature-based folders** (recommended for projects and interviews):

```
src/
├── components/          # Shared UI primitives
│   └── ui/
│       ├── Button.tsx
│       ├── Modal.tsx
│       └── Input.tsx
├── features/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── useAuth.ts
│   │   └── authApi.ts
│   ├── feed/
│   │   ├── FeedList.tsx
│   │   ├── FeedItem.tsx
│   │   ├── useFeed.ts
│   │   └── feedApi.ts
│   └── profile/
│       ├── ProfileHeader.tsx
│       └── EditProfileForm.tsx
├── hooks/               # Cross-feature hooks
├── lib/                 # Utilities, API client
├── pages/ or app/       # Route-level components
└── types/
```

### Design Principles to Mention

| Principle | What it means | Example |
|-----------|---------------|---------|
| **Single responsibility** | One component, one job | `FeedItem` renders one post; doesn't fetch the whole feed |
| **Composition** | Build complex UI from small pieces | `Card` + `CardHeader` + `CardBody` |
| **Container vs presentational** | Logic separate from UI | `FeedList` (container) fetches; `FeedItem` (presentational) just renders props |
| **Colocation** | Keep related code together | Hook + API + components in same feature folder |

### Atomic Design (Know the Terms)

- **Atoms:** Button, Input, Label
- **Molecules:** SearchBar (Input + Button)
- **Organisms:** Header (Logo + Nav + SearchBar)
- **Templates/Pages:** Full page layout

You don't need to name-drop every level — just show you think in layers.

**Interview line:** *"I'd organize by feature — `features/feed/` owns everything feed-related. Shared primitives like Button live in `components/ui/` so we don't duplicate styles."*

---

## State Management

### The Golden Rule

**Don't put everything in global state.** Most state is local. Start simple; add complexity only when needed.

### State Categories

| Type | Where it lives | Example |
|------|----------------|---------|
| **UI state** | Component `useState` | Modal open/closed, form input values |
| **Server state** | React Query / SWR | Posts from API, user profile |
| **Global client state** | Context / Zustand / Redux | Auth user, theme, shopping cart |
| **URL state** | React Router search params | Filters, pagination page, search query |

### Decision Tree (Say This in Interviews)

```
Is it server data?
  YES → React Query (cache, refetch, loading states built-in)
  NO → Is it needed by many unrelated components?
    YES → Context (light) or Zustand (heavier global state)
    NO → useState in the component (or lift one level up)
```

### React Query Example (Server State)

```javascript
// hooks/useFeed.js
function useFeed(page) {
  return useQuery({
    queryKey: ['feed', page],
    queryFn: () => fetch(`/api/feed?page=${page}`).then(r => r.json()),
    staleTime: 60_000, // treat as fresh for 1 minute
  });
}

// FeedList.jsx
function FeedList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useFeed(page);
  // ...
}
```

**Why React Query over Redux for API data:**
- Automatic caching and deduplication
- Background refetching
- Loading/error states without boilerplate
- No stale data sync bugs between Redux and server

### When Redux Still Makes Sense

- Complex client-side state with many interdependencies (e.g., a visual page builder)
- Time-travel debugging requirements
- Large team with established Redux patterns

For most student projects: **React Query + Context for auth + local state** is the right answer.

### Prop Drilling vs Context

**Prop drilling:** Passing props through 5 layers of components that don't use them.

**Fix:** Context for truly global data (theme, auth). Don't Context everything — it causes unnecessary re-renders.

**Interview line:** *"API data goes in React Query. Auth user in Context. Form state stays local. I'd avoid Redux unless we have complex client-only state like a multi-step wizard with cross-step validation."*

---

## Performance

### What Interviewers Want to Hear

Not micro-optimizations — **architectural choices** that keep the app fast.

### Code Splitting (Route-Level)

```javascript
// React.lazy — each route loads its own JS bundle
const FeedPage = lazy(() => import('./features/feed/FeedPage'));
const ProfilePage = lazy(() => import('./features/profile/ProfilePage'));

<Suspense fallback={<Spinner />}>
  <Routes>
    <Route path="/feed" element={<FeedPage />} />
    <Route path="/profile" element={<ProfilePage />} />
  </Routes>
</Suspense>
```

**Impact:** User visiting `/login` doesn't download the entire app's JavaScript.

### List Virtualization

Rendering 10,000 DOM nodes kills performance. **Virtualization** only renders visible rows.

```javascript
// react-window — renders ~20 visible items, not 10,000
import { FixedSizeList } from 'react-window';

<FixedSizeList height={600} itemCount={10000} itemSize={80}>
  {({ index, style }) => <FeedItem post={posts[index]} style={style} />}
</FixedSizeList>
```

### Image Optimization

- Use `loading="lazy"` on below-fold images
- Serve WebP/AVIF with fallbacks
- Correct `width`/`height` to prevent layout shift (CLS)
- Thumbnail URLs for list views; full size on detail page

### Memoization (Use Sparingly)

```javascript
// Re-render only when post.id changes
const FeedItem = memo(function FeedItem({ post }) { ... });

// Expensive computation cached
const sortedPosts = useMemo(() => posts.sort(byDate), [posts]);
```

**Don't memo everything** — measure first. Premature `memo` adds complexity without benefit.

### Core Web Vitals (Know the Names)

| Metric | What it measures | Target |
|--------|------------------|--------|
| **LCP** | Largest Contentful Paint (loading) | < 2.5s |
| **INP** | Interaction to Next Paint (responsiveness) | < 200ms |
| **CLS** | Cumulative Layout Shift (visual stability) | < 0.1 |

**Interview line:** *"I'd lazy-load routes, virtualize long lists, and use React Query's staleTime to avoid refetching on every navigation. I'd measure with Lighthouse before optimizing."*

---

## Infinite Scroll

### Requirements to Clarify

- Load more when user scrolls near bottom?
- "New items available" banner at top (Twitter-style)?
- How many items per page?
- What if user scrolls fast — debounce load requests?

### Architecture

```
┌─────────────┐     GET /posts?cursor=abc&limit=20     ┌─────────────┐
│   Browser   │ ──────────────────────────────────────►│     API     │
│             │◄────────────────────────────────────── │             │
│ FeedList    │     { items: [...], nextCursor: "xyz" }└─────────────┘
│ + sentinel  │
└─────────────┘
```

### Implementation Pattern (React Query Infinite)

```javascript
function useInfiniteFeed() {
  return useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: ({ pageParam }) =>
      fetch(`/api/feed?cursor=${pageParam || ''}&limit=20`).then(r => r.json()),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

function FeedList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteFeed();
  const sentinelRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const posts = data?.pages.flatMap(p => p.items) ?? [];

  return (
    <>
      {posts.map(post => <FeedItem key={post.id} post={post} />)}
      <div ref={sentinelRef}>{isFetchingNextPage && <Spinner />}</div>
    </>
  );
}
```

### API Design for Infinite Scroll

Use **cursor-based pagination**, not offset:

```
GET /api/feed?cursor=eyJpZCI6MTIzfQ&limit=20

Response:
{
  "items": [...],
  "nextCursor": "eyJpZCI6MTQzfQ"
}
```

**Why not offset?** `OFFSET 10000` scans 10,000 rows — slow and unstable if new items are inserted.

### Tradeoffs to Mention

| Approach | Pros | Cons |
|----------|------|------|
| Infinite scroll | Seamless UX for feeds | Hard to reach footer; bad for SEO pages |
| Pagination buttons | Clear position, shareable URLs | More clicks |
| Virtualized infinite scroll | Best of both for huge lists | More complex |

---

## Autocomplete / Typeahead Search

### Requirements to Clarify

- Search products? Users? Addresses?
- How many results to show (5–10)?
- Debounce delay (300ms typical)?
- Minimum characters before search (2–3)?
- Keyboard navigation (arrow keys, Enter)?

### Architecture

```
User types "lap" ──► debounce 300ms ──► GET /api/search?q=lap&limit=8
                                              │
                                              ▼
                                        ┌───────────┐
                                        │ Search    │
                                        │ Index     │
                                        │ (SQL FTS  │
                                        │  or ES)   │
                                        └───────────┘
```

### Frontend Implementation

```javascript
function useAutocomplete(query) {
  const debouncedQuery = useDebounce(query, 300);

  return useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () =>
      fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}&limit=8`)
        .then(r => r.json()),
    enabled: debouncedQuery.length >= 2, // don't search on 1 character
  });
}
```

### Accessibility (Interviewers Notice)

- `role="combobox"` on input
- `role="listbox"` on dropdown
- `aria-activedescendant` for keyboard highlight
- Announce result count to screen readers

### Backend at Scale

| Scale | Approach |
|-------|----------|
| < 10K rows | SQL `LIKE` or PostgreSQL full-text search |
| 10K – 1M rows | Dedicated index (Elasticsearch, Typesense, Algolia) |
| Any scale | Debounce + rate limit on client and server |

**Search index sync:** On product create/update → async job updates search index (eventual consistency OK for search).

### Caching Autocomplete

- Cache popular prefixes in Redis: `search:lap` → top 8 results
- Short TTL (30–60 seconds) — search data changes often
- CDN not useful (dynamic, per-query)

**Interview line:** *"I'd debounce input 300ms, cancel in-flight requests with AbortController, and use cursor pagination on the full results page. For the index, I'd start with Postgres full-text and move to Elasticsearch if we exceed 100K products."*

---

## Frontend System Design Checklist

Before ending any frontend design answer:

- [ ] Component/folder structure explained
- [ ] State management choice justified (local vs server vs global)
- [ ] Performance: code splitting, virtualization, image strategy
- [ ] API contract for lists (cursor pagination)
- [ ] Loading, error, and empty states mentioned
- [ ] Accessibility for interactive patterns

---

**Next:** [design-a-social-media-app.md](./design-a-social-media-app.md) or [backend-system-design.md](./backend-system-design.md)
