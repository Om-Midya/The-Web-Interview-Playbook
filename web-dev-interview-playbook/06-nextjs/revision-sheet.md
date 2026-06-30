# Next.js: Revision Sheet

## Rendering (MEMORIZE)

| Pattern | When | App Router |
|---------|------|------------|
| SSG | Static, build time | `fetch` default cache |
| SSR | Per request, fresh | `cache: 'no-store'` |
| ISR | Static + regen | `next: { revalidate: N }` |
| CSR | Client fetch | `'use client'` + useEffect |

## Decision Quick Pick

- Blog/docs → SSG
- Product catalog → ISR
- User dashboard → CSR/SSR + auth
- Personalized feed → SSR
- Landing page → SSG

## App Router Structure

```
app/
  layout.tsx      # wraps all pages
  page.tsx        # route UI
  loading.tsx     # Suspense fallback
  error.tsx       # error boundary
  [id]/page.tsx   # dynamic route
  api/.../route.ts
```

## Server vs Client

- **Server (default):** async fetch, no hooks, smaller bundle
- **Client:** `'use client'`, useState, onClick

## Key APIs

```tsx
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
```

## Pages Router (legacy)

- `getStaticProps` → SSG
- `getServerSideProps` → SSR
- `getStaticPaths` → dynamic SSG paths

## Hydration

Server HTML + client JS attach. Mismatch if server ≠ client render.

## Middleware

`middleware.ts` — auth redirects, headers, geo routing.

## Metadata

```tsx
export const metadata = { title: '...', description: '...' };
```

## Image

`next/image` — optimized, lazy, requires width/height or fill.

## Env Vars

- `NEXT_PUBLIC_*` → browser
- Others → server only

## Quick Answers

| Question | Answer |
|----------|--------|
| App vs Pages Router? | App = RSC, layouts; new projects use App |
| Why ISR? | CDN speed + periodic updates without full rebuild |
| Link vs a? | Link client-side navigation, prefetch |
| Route groups? | `(folder)` organizes, not in URL |
| Server Actions? | Run server code from forms — mutations |

## Red Flags

- SSR everything (expensive)
- SSG for personalized pages (wrong data)
- `'use client'` on entire app (defeats RSC)
- `useEffect` fetch what Server Component could do
