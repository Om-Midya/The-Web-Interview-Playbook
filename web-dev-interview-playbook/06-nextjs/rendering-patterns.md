# Next.js: Rendering Patterns

Deep dive into SSR, SSG, ISR, and CSR — the #1 Next.js interview topic.

---

## Overview

| Pattern | When HTML is generated | Freshness | Best for |
|---------|------------------------|-----------|----------|
| **CSR** | Browser (JS) | Real-time client data | Dashboards, auth-gated apps |
| **SSR** | Server per request | Always fresh | Personalized, frequently changing |
| **SSG** | Build time | Static until rebuild | Blogs, marketing, docs |
| **ISR** | Build + periodic regen | Stale-while-revalidate | Large catalogs, news |

---

## CSR — Client-Side Rendering

Browser downloads minimal HTML + JS bundle. React renders in browser. Data fetched client-side.

### How it works

1. Server sends shell HTML + JS
2. JS loads, React mounts (hydration if SSR shell exists)
3. `useEffect` or React Query fetches data
4. UI updates

### App Router Example

```tsx
'use client';

import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/metrics')
      .then(r => r.json())
      .then(setData);
  }, []);

  if (!data) return <p>Loading...</p>;
  return <Chart data={data} />;
}
```

### Pros
- Simple mental model (classic React)
- Great for highly interactive, user-specific UI
- No server load for data fetching

### Cons
- Slower First Contentful Paint
- Poor SEO for content-heavy pages (empty until JS runs)
- Loading spinners on first visit

### When to use
- Admin dashboards
- Pages behind authentication
- Heavy client interactivity (charts, drag-drop editors)

---

## SSR — Server-Side Rendering

HTML generated on **every request** on the server. Sent complete to browser. React hydrates for interactivity.

### How it works

1. User requests page
2. Server runs React, fetches data, renders HTML
3. Full HTML sent to browser (fast FCP, SEO-friendly)
4. JS loads → hydration attaches event listeners

### App Router Example (Server Component)

```tsx
// app/users/[id]/page.tsx — Server Component by default
async function getUser(id: string) {
  const res = await fetch(`https://api.example.com/users/${id}`, {
    cache: 'no-store' // SSR — no caching
  });
  if (!res.ok) throw new Error('Failed');
  return res.json();
}

export default async function UserPage({ params }: { params: { id: string } }) {
  const user = await getUser(params.id);
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

### Pages Router Example

```javascript
// pages/users/[id].js
export async function getServerSideProps({ params }) {
  const res = await fetch(`https://api.example.com/users/${params.id}`);
  const user = await res.json();
  return { props: { user } };
}

export default function UserPage({ user }) {
  return <h1>{user.name}</h1>;
}
```

### Pros
- Fresh data every request
- Great SEO
- Fast initial paint with real content

### Cons
- Server load scales with traffic
- Slower TTFB than static CDN
- Can't cache page at CDN edge (by default)

### When to use
- Personalized pages (user profile, feed)
- Data changes frequently
- SEO matters AND content is dynamic

---

## SSG — Static Site Generation

HTML generated at **build time**. Same HTML served to all users from CDN.

### How it works

1. `next build` fetches data and renders pages to HTML
2. Static files deployed to CDN
3. Every user gets identical pre-built HTML
4. Hydration on client

### App Router Example

```tsx
// fetch cached by default in Server Components
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    cache: 'force-cache' // default — static at build
  });
  return res.json();
}

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <ul>
      {posts.map(p => <li key={p.id}>{p.title}</li>)}
    </ul>
  );
}
```

### Pages Router Example

```javascript
export async function getStaticProps() {
  const res = await fetch('https://api.example.com/posts');
  const posts = await res.json();
  return { props: { posts } };
}

export async function getStaticPaths() {
  const posts = await getAllPosts();
  return {
    paths: posts.map(p => ({ params: { slug: p.slug } })),
    fallback: false // or 'blocking' / true
  };
}
```

### Pros
- Fastest possible delivery (CDN)
- Lowest server cost
- Excellent SEO

### Cons
- Data stale until rebuild
- Build time grows with page count
- Not for personalized per-user content

### When to use
- Marketing pages, landing pages
- Blog posts, documentation
- Product catalogs that change infrequently

---

## ISR — Incremental Static Regeneration

SSG + automatic background revalidation. Serve stale page instantly, regenerate in background.

### How it works

1. Page built at build time (or first request)
2. Cached at CDN with revalidation interval
3. After interval, next request triggers background rebuild
4. Subsequent requests get fresh page

### App Router Example

```tsx
async function getProducts() {
  const res = await fetch('https://api.example.com/products', {
    next: { revalidate: 60 } // regenerate at most every 60 seconds
  });
  return res.json();
}
```

### Pages Router Example

```javascript
export async function getStaticProps() {
  const products = await fetchProducts();
  return {
    props: { products },
    revalidate: 60 // seconds
  };
}
```

### `fallback` in dynamic SSG

```javascript
// getStaticPaths with fallback: 'blocking'
// First visit to unknown path → server renders, caches, then serves
```

### Pros
- CDN speed + reasonably fresh data
- No full rebuild for content updates
- Scales to millions of pages

### Cons
- Users may see slightly stale content (stale-while-revalidate)
- Harder to reason about than pure SSG
- First visitor after expiry waits for regen (with blocking)

### When to use
- E-commerce product pages
- News sites
- Large blogs (10k+ pages)

---

## Decision Flowchart

```
Does page need to be personalized per user?
├── YES → SSR or CSR (behind auth)
└── NO → Does content change frequently?
    ├── YES (every few minutes) → ISR
    ├── YES (every request) → SSR
    └── NO → SSG
```

---

## Hydration

Server sends HTML. Client JS "hydrates" — React attaches to existing DOM without re-creating it.

**Mismatch error:** Server HTML ≠ client render. Causes:
- `Date.now()` or `Math.random()` in render
- Browser-only APIs in Server Components
- Invalid HTML nesting

**Fix:** Use `useEffect` for client-only values, or `'use client'` boundary.

---

## Server vs Client Components (App Router)

| Server Component | Client Component |
|------------------|------------------|
| Default in App Router | `'use client'` directive |
| Can async/await directly | Uses hooks, event handlers |
| No useState/useEffect | Full interactivity |
| Smaller JS bundle | Ships JS to browser |

**Pattern:** Server Component fetches data → passes to Client Component as props.

```tsx
// app/page.tsx (Server)
import { ProductList } from './ProductList';

async function getProducts() {
  const res = await fetch('...', { next: { revalidate: 3600 } });
  return res.json();
}

export default async function Page() {
  const products = await getProducts();
  return <ProductList initialProducts={products} />;
}
```

```tsx
// ProductList.tsx
'use client';

export function ProductList({ initialProducts }) {
  const [filter, setFilter] = useState('');
  // interactive filtering on client
}
```

---

## fetch Caching Cheat Sheet (App Router)

| Option | Behavior |
|--------|----------|
| Default | Cache (SSG-like at build) |
| `{ cache: 'no-store' }` | SSR — fresh every request |
| `{ next: { revalidate: 60 } }` | ISR — 60 second window |
| `{ next: { tags: ['posts'] } }` | On-demand revalidation |

---

## Interview Comparison Table

| | CSR | SSR | SSG | ISR |
|---|-----|-----|-----|-----|
| SEO | Poor | Excellent | Excellent | Excellent |
| TTFB | Fast shell | Slower | Fastest | Fast |
| Data freshness | Client fetch | Per request | Build time | Configurable |
| Server cost | Low | High | Lowest | Low |
| CDN cacheable | Limited | No | Yes | Yes |

---

## What to Say in Interviews

> "For my blog I used SSG because content rarely changes and SEO matters. For the user dashboard I used CSR with client fetch because it's behind auth and highly interactive. If I had a product catalog updating hourly, I'd use ISR with a 60-second revalidate."

That sentence alone shows more maturity than listing definitions.
