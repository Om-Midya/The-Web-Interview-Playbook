# Next.js: Topics Not to Miss

Check off each topic before your interview.

## Core Concepts

- [ ] What Next.js adds to React (routing, rendering, optimizations)
- [ ] File-based routing
- [ ] App Router vs Pages Router
- [ ] Server Components vs Client Components (`'use client'`)
- [ ] Layouts and nested layouts
- [ ] Loading UI (`loading.tsx`) and error boundaries (`error.tsx`)

## Rendering Strategies

- [ ] CSR — client-side rendering
- [ ] SSR — server-side rendering per request
- [ ] SSG — static generation at build time
- [ ] ISR — incremental static regeneration
- [ ] When to use each (see `rendering-patterns.md`)

## Data Fetching

- [ ] Async Server Components (App Router)
- [ ] `fetch` with caching options (`cache`, `next.revalidate`)
- [ ] `getServerSideProps` / `getStaticProps` (Pages Router)
- [ ] Client-side fetch with `useEffect` or SWR/React Query
- [ ] Server Actions (awareness)

## Routing

- [ ] Dynamic routes `[id]`
- [ ] Catch-all `[...slug]`
- [ ] Route groups `(folder)` — don't affect URL
- [ ] `Link` component vs `<a>`
- [ ] `useRouter`, `useParams`, `useSearchParams`
- [ ] Middleware (`middleware.ts`) for auth redirects

## API Routes

- [ ] Route Handlers (`app/api/.../route.ts`)
- [ ] API routes in Pages Router (`pages/api/`)
- [ ] When API routes vs separate Express backend

## Performance & SEO

- [ ] `next/image` — optimization, lazy loading
- [ ] `next/font` — font optimization
- [ ] Metadata API (`export const metadata`)
- [ ] Hydration concept

## Deployment

- [ ] Vercel deployment flow
- [ ] Environment variables in Next.js
- [ ] Build output (`next build`)

## Authentication Patterns

- [ ] Middleware auth check
- [ ] NextAuth.js / Auth.js awareness
- [ ] Protecting routes server-side vs client-side

## Styling

- [ ] CSS Modules, Tailwind, styled-components — know what your project uses
- [ ] Global CSS in App Router (`app/globals.css`)

---

**Self-test:** For each route in your project, can you say SSR/SSG/CSR and defend the choice?
