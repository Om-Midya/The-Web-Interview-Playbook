# Next.js Interview Questions

> 30+ questions with full answers. Practice out loud.

---

## Question: What is the difference between SSR, SSG, and CSR?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Rendering strategy defines performance, SEO, and complexity — core Next.js literacy.

### Answer
CSR: browser fetches JS and renders (SPA). SSR: server renders HTML per request (dynamic, fresh). SSG: HTML built at build time (fast CDN, great for static content). Next.js supports all; pick per page needs.

### Example
```
SSG: blog posts | SSR: personalized dashboard | CSR: heavy client-only widgets
```

### Follow-up Questions
- What is ISR?
- Hydration in each?
- TTFB vs TTI tradeoffs?

### Common Mistakes
- SSR everything by default
- SSG for highly personalized pages
- Ignoring SEO needs

### Project Connection
Label each route in your app as SSR/SSG/CSR and why.

---

## Question: App Router vs Pages Router — what changed?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Modern Next jobs expect App Router; you must know both migration paths.

### Answer
Pages Router (pages/): getServerSideProps, getStaticProps, file-based pages. App Router (app/): React Server Components, layouts, nested loading/error, colocated data fetching with async server components.

### Example
```
pages/index.js  vs  app/page.tsx
```

### Follow-up Questions
- Can you mix both?
- Default in new projects?
- Routing differences?

### Common Mistakes
- Using pages patterns in app dir
- Client fetching what server components could do
- Ignoring layout.tsx

### Project Connection
Say which router your portfolio uses and one benefit of App Router.

---

## Question: How does file-based routing work in Next.js?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
No separate route config — folder structure is the API.

### Answer
Folders define routes; page.tsx (App) or index.js (Pages) is the UI. layout.tsx wraps segments. Dynamic [id], catch-all [...slug], route groups (folder) don't affect URL.

### Example
```
app/blog/[slug]/page.tsx  →  /blog/hello-world
```

### Follow-up Questions
- Optional catch-all?
- private folders _folder?
- parallel routes?

### Common Mistakes
- Wrong file names (Page.tsx)
- Multiple page in one segment
- Confusing app vs pages paths

### Project Connection
Walk through your app's folder tree for two URLs.

---

## Question: What does getServerSideProps do in the Pages Router?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Legacy but still in brownfield codebases and interviews.

### Answer
Runs on every request on the server, fetches data, passes props to page. Use for personalized or always-fresh data. Cannot be used with static export.

### Example
```js
export async function getServerSideProps() {
  const data = await fetch(...);
  return { props: { data } };
}
```

### Follow-up Questions
- vs getStaticProps?
- Context object?
- Redirects/notFound?

### Common Mistakes
- Fetching in useEffect instead when SSR needed
- Heavy work blocking TTFB
- Secrets leaked to client in props

### Project Connection
If you learned App Router only, explain equivalent async Server Component fetch.

---

## Question: What does getStaticProps do?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Static generation is a major Next selling point for marketing sites and docs.

### Answer
Runs at build time, generates static HTML/JSON. Props passed to page. revalidate enables ISR. Great when data changes infrequently.

### Example
```js
export async function getStaticProps() {
  return { props: { posts }, revalidate: 60 };
}
```

### Follow-up Questions
- getStaticPaths?
- fallback true?
- Build time with 10k pages?

### Common Mistakes
- SSG for user-specific data
- No revalidate when content changes hourly
- Fetching private data at build

### Project Connection
Use SSG for a projects list page with weekly updates.

---

## Question: What is generateStaticParams in the App Router?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
App Router equivalent of getStaticPaths for dynamic segments.

### Answer
Returns list of param objects to pre-render at build time for dynamic routes. Can combine with dynamic segments and revalidate for ISR.

### Example
```ts
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map(p => ({ slug: p.slug }));
}
```

### Follow-up Questions
- dynamic = 'force-static'?
- Empty array behavior?
- With catch-all routes?

### Common Mistakes
- Forgetting async params in page
- Not handling new slugs after build
- Duplicate fetches in page and generateStaticParams

### Project Connection
Pre-render top 100 blog slugs; rest on demand.

---

## Question: What are React Server Components in Next.js?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Default in App Router — changes where JS ships to the client.

### Answer
Server Components render on server only; not shipped as client JS. Can async fetch DB directly. Cannot use hooks or browser APIs. Compose with Client Components for interactivity.

### Example
```tsx
// app/users/page.tsx — Server Component by default
export default async function Page() {
  const users = await db.users.findMany();
  return <ul>{users.map(...)}</ul>;
}
```

### Follow-up Questions
- Serialization boundaries?
- Passing functions to client?
- RSC payload?

### Common Mistakes
- 'use client' on every file
- Fetching secret APIs from client unnecessarily
- Huge props to client components

### Project Connection
Fetch data in server page; pass serializable props to a small client chart.

---

## Question: What are Client Components?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Interactivity requires client — interviewers check you know the split.

### Answer
Marked with 'use client'. Run in browser, support useState, useEffect, event handlers. Import Server Components as children where allowed. Keep boundary small.

### Example
```tsx
'use client';
export function Counter() {
  const [n, setN] = useState(0);
  return <button onClick={() => setN(n+1)}>{n}</button>;
}
```

### Follow-up Questions
- Can server import client?
- Bundle size impact?
- Third-party libs?

### Common Mistakes
- Entire page client for one button
- use client deep in tree unnecessarily
- Secrets in client components

### Project Connection
Split: server shell + client interactive form.

---

## Question: When do you need 'use client' at the top of a file?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Boundary mistakes cause build errors or bloated bundles.

### Answer
Required when using React hooks, browser APIs, event listeners, or state. First line of file. Only that module and its imports become client — not parent server files.

### Example
```tsx
'use client';
import { useState } from 'react';
```

### Follow-up Questions
- Re-export server component?
- 'use client' in layout?
- Transitive client boundary?

### Common Mistakes
- use client in server-only data file
- Forgetting directive when adding useState
- Marking layout client collapsing RSC benefits

### Project Connection
Add 'use client' only to modal with onClick, not parent page.

---

## Question: What are common data fetching patterns in Next.js App Router?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Where and when you fetch affects caching, security, and UX.

### Answer
Server Components: async fetch with default caching; fetch options next: { revalidate }. Server Actions for mutations. Client: SWR/React Query for highly interactive client cache. Route Handlers for REST.

### Example
```tsx
const res = await fetch(url, { next: { revalidate: 3600 } });
```

### Follow-up Questions
- cache: 'no-store'?
- Parallel routes fetching?
- Deduplication?

### Common Mistakes
- Client fetch for public SEO content
- No loading states
- Duplicate fetch in layout and page

### Project Connection
Describe one server fetch with revalidate for a product catalog.

---

## Question: How do API routes / Route Handlers work?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Backend in the same repo — auth webhooks, BFF pattern.

### Answer
Pages: pages/api/*.ts exports default handler. App Router: app/api/route.ts exports GET, POST, etc. Run on server; access secrets; return Response/json.

### Example
```ts
// app/api/health/route.ts
export async function GET() {
  return Response.json({ ok: true });
}
```

### Follow-up Questions
- Edge runtime?
- vs Server Actions?
- CORS in route handlers?

### Common Mistakes
- Heavy logic in route instead of service
- Exposing admin routes without auth
- Wrong HTTP method exports

### Project Connection
BFF route that proxies to your Express API with server-only API key.

---

## Question: What is middleware.ts in Next.js?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Edge middleware for auth, redirects, geo — common interview topic.

### Answer
Runs before request completes; on Edge by default. Rewrite, redirect, set headers, check cookies/JWT. matcher config limits paths. Not for heavy DB — keep fast.

### Example
```ts
export function middleware(req) {
  if (!req.cookies.get('session')) return NextResponse.redirect('/login');
}
export const config = { matcher: ['/dashboard/:path*'] };
```

### Follow-up Questions
- middleware vs route handler?
- Edge limitations?
- NextResponse?

### Common Mistakes
- Full DB lookup in middleware
- Matcher too broad slowing site
- Infinite redirect loops

### Project Connection
Protect /dashboard with cookie check in middleware.

---

## Question: How does next/image optimize images?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Performance and Core Web Vitals — Next provides built-in wins.

### Answer
Serves responsive sizes, lazy loading, modern formats (WebP/AVIF) when configured, prevents layout shift with width/height. Requires remotePatterns for external domains.

### Example
```tsx
import Image from 'next/image';
<Image src="/hero.jpg" alt="" width={1200} height={600} priority />
```

### Follow-up Questions
- fill prop?
- placeholder blur?
- unoptimized?

### Common Mistakes
- Regular img for LCP hero
- Missing sizes for responsive
- Remote image without config

### Project Connection
Replace img tags on landing page with next/image.

---

## Question: Why use the Next.js Link component?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Client-side navigation without full reload — SPA feel with MPAs.

### Answer
Link prefetches routes in viewport (production), does client-side transitions, accepts href and legacyBehavior notes in v13+. Use for internal navigation; <a> for external.

### Example
```tsx
import Link from 'next/link';
<Link href="/about">About</Link>
```

### Follow-up Questions
- prefetch false?
- Link with button styles?
- App Router href rules?

### Common Mistakes
- <a> for internal routes losing prefetch
- Nested interactive elements invalid HTML
- Wrong href with dynamic segments unencoded

### Project Connection
Nav bar using Link for all internal routes.

---

## Question: How do metadata and SEO work in the App Router?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Marketing and content sites need correct titles, OG tags, robots.

### Answer
Export metadata object or generateMetadata async in layout/page. Sets title, description, openGraph, twitter, robots. Server-only; reflects per route.

### Example
```ts
export const metadata = { title: 'Blog', description: '...' };
```

### Follow-up Questions
- generateMetadata dynamic?
- metadataBase?
- JSON-LD?

### Common Mistakes
- Client component exporting metadata
- Duplicate titles in layout+page confusion
- Missing OG image

### Project Connection
Add generateMetadata for blog slug pages with post title.

---

## Question: What is layout.tsx and how do nested layouts work?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Shared UI and data boundaries without re-rendering children unnecessarily.

### Answer
layout.tsx wraps child segments; persists across navigation within segment. Root layout has html/body. Nested layouts for dashboard shell. Accept children and optional parallel slots.

### Example
```tsx
export default function Layout({ children }) {
  return <section><Sidebar />{children}</section>;
}
```

### Follow-up Questions
- layout vs template?
- Fetching in layout?
- Multiple root layouts?

### Common Mistakes
- Putting page-only state in layout
- Missing children render
- Client layout forcing all children client

### Project Connection
Dashboard layout with sidebar wrapping all /dashboard/* pages.

---

## Question: What is loading.tsx?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Streaming UI — better perceived performance during slow fetches.

### Answer
Automatic Suspense boundary for route segment. Shows instant loading UI while server component data loads. Can nest per folder.

### Example
```tsx
export default function Loading() {
  return <p>Loading...</p>;
}
```

### Follow-up Questions
- loading vs suspense manual?
- Skeleton patterns?
- Affects SEO?

### Common Mistakes
- One global spinner only
- Heavy loading component
- Confusing with client loading states

### Project Connection
Add skeleton loading.tsx for slow product list route.

---

## Question: What is error.tsx?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Error boundaries per segment — production resilience.

### Answer
Client Component boundary catches errors in child segments. Shows fallback UI; reset() retries. error.js does not catch layout errors in same segment — place thoughtfully.

### Example
```tsx
'use client';
export default function Error({ error, reset }) {
  return <button onClick={reset}>Try again</button>;
}
```

### Follow-up Questions
- error vs global-error?
- Logging errors?
- notFound()?

### Common Mistakes
- No error boundary
- Throwing in error.tsx
- Expecting to catch event handler errors

### Project Connection
error.tsx on checkout with retry and support link.

---

## Question: How do environment variables work in Next.js?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
NEXT_PUBLIC_ exposure rules trip people up in interviews.

### Answer
Server-only vars without prefix. NEXT_PUBLIC_ inlined into client bundle — never put secrets there. Use .env.local, .env.production. Access process.env in server components and route handlers.

### Example
```env
DATABASE_URL=postgres://...
NEXT_PUBLIC_API_URL=https://api.example.com
```

### Follow-up Questions
- Runtime env on Vercel?
- Edge vs Node env?
- .env loading order?

### Common Mistakes
- NEXT_PUBLIC_DATABASE_URL
- Secrets in client fetch headers visible
- No .env.example

### Project Connection
List which vars are server-only in your deployment.

---

## Question: How do you deploy Next.js on Vercel?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Vercel created Next — deployment story is a common question.

### Answer
Connect Git repo; auto builds on push. Detects Next config, serverless functions for API/route handlers, edge for middleware. Set env vars in dashboard. Preview deployments per PR.

### Example
```bash
git push origin main  # triggers production deploy
```

### Follow-up Questions
- Self-hosting?
- Docker?
- Build output standalone?

### Common Mistakes
- Wrong Node version
- Missing env in preview
- Ignoring build errors in CI

### Project Connection
Describe your Vercel project settings and preview URL workflow.

---

## Question: What is ISR (Incremental Static Regeneration)?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Best of static + fresh content without full rebuilds.

### Answer
Serve cached static page, after revalidate seconds regenerate in background on next request. Pages Router: revalidate in getStaticProps. App Router: fetch revalidate or route segment config.

### Example
```js
return { props: { data }, revalidate: 60 };
```

### Follow-up Questions
- On-demand revalidation?
- stale-while-revalidate behavior?
- ISR vs SSR cost?

### Common Mistakes
- revalidate 0 misunderstanding
- ISR for highly sensitive real-time data
- No cache invalidation strategy

### Project Connection
News homepage revalidates every 60 seconds.

---

## Question: How do dynamic routes work?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Params drive product pages, user profiles, etc.

### Answer
Bracket folder [id] or [slug]. Page receives params (async in App Router 15). generateStaticParams prebuilds subset; dynamicParams controls unknown paths.

### Example
```tsx
export default async function Page({ params }) {
  const { id } = await params;
}
```

### Follow-up Questions
- Optional segments [[id]]?
- Type-safe params?
- generateStaticParams?

### Common Mistakes
- Not awaiting params in Next 15
- No notFound() for missing id
- Slug injection

### Project Connection
Product page at /products/[sku] with DB lookup.

---

## Question: What are catch-all and optional catch-all routes?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Docs sites and CMS paths use [...slug] patterns.

### Answer
Catch-all [...slug] matches one or more segments. Optional [[...slug]] matches zero or more. params.slug is array of segments.

### Example
```
app/docs/[...slug]/page.tsx  →  /docs/a/b/c
```

### Follow-up Questions
- Difference from dynamic single?
- Priority with static routes?
- i18n routing?

### Common Mistakes
- Wrong bracket count
- Not handling empty slug
- Conflicting routes

### Project Connection
Docs site where all paths under /docs/* render one page component.

---

## Question: How does next/font help performance?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Font loading affects CLS and privacy — Next optimizes self-hosting.

### Answer
Downloads and self-hosts Google/fonts at build time, no layout shift with size-adjust, subsets, CSS variables for Tailwind integration.

### Example
```tsx
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
```

### Follow-up Questions
- localFont?
- Variable fonts?
- FOIT/FOUT?

### Common Mistakes
- External Google link in head instead
- Loading too many weights
- Wrong className application

### Project Connection
Apply next/font in root layout for body text.

---

## Question: What is next/script for?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Third-party scripts (analytics, chat) hurt performance without strategy.

### Answer
Loads external scripts with strategy: afterInteractive, lazyOnload, beforeInteractive, worker. Avoids blocking main thread unnecessarily.

### Example
```tsx
import Script from 'next/script';
<Script src="https://analytics.example.com/script.js" strategy="afterInteractive" />
```

### Follow-up Questions
- Partytown?
- Inline scripts?
- GDPR/consent?

### Common Mistakes
- Raw script in head for analytics
- beforeInteractive everywhere
- Duplicate script loads

### Project Connection
Load analytics with afterInteractive after consent.

---

## Question: What is hydration and what problems can occur?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Mismatch errors confuse juniors — senior interviews probe causes.

### Answer
Hydration attaches React event listeners to server HTML. Mismatch if server HTML !== client first render (Date.now, random, browser-only APIs in SSR). Fix: render same on server/client or use useEffect for client-only bits.

### Example
```tsx
// bad: {typeof window !== 'undefined' && ...} causing mismatch
```

### Follow-up Questions
- suppressHydrationWarning?
- Streaming hydration?
- RSC reducing hydration?

### Common Mistakes
- Math.random in SSR markup
- Invalid HTML nesting (p inside p)
- Extensions modifying DOM

### Project Connection
Fix a hydration warning from rendering locale date on server vs client.

---

## Question: When should you choose Next.js for a project?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Shows judgment, not hype — tradeoffs matter.

### Answer
Choose when you need SEO, mixed rendering (SSG/SSR), file-based routing, image/font optimizations, or full-stack React with API routes. Skip for purely internal SPA with no SEO and simple hosting needs.

### Example
```
Marketing + app + blog → Next | Admin SPA only → maybe Vite
```

### Follow-up Questions
- Next vs Remix?
- Next vs Astro?
- Mobile app?

### Common Mistakes
- Next for everything
- Ignoring team familiarity
- Overkill for static 3-page site without using SSG

### Project Connection
Defend why your portfolio is Next vs CRA/Vite.

---

## Question: What are the main tradeoffs of using Next.js?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Balanced answer beats fanboyism.

### Answer
Pros: rendering flexibility, ecosystem, Vercel integration, conventions. Cons: complexity (RSC, caching), vendor coupling perception, build times at scale, learning curve, deployment opinions.

### Example
```
Caching mental model + server/client split = learning cost
```

### Follow-up Questions
- Lock-in?
- Cold starts?
- Monorepo?

### Common Mistakes
- Ignoring caching surprises
- Assuming all pages must be server components
- No static export when needed

### Project Connection
Name one thing that surprised you learning App Router caching.

---

## Question: What is the Pages Router API routes pattern?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Legacy APIs still appear in tutorials and older code.

### Answer
File in pages/api/hello.js exports default function handler(req, res). Method check on req.method. res.status(200).json({}).

### Example
```js
export default function handler(req, res) {
  if (req.method === 'GET') res.status(200).json({ ok: true });
}
```

### Follow-up Questions
- Body parsing?
- Edge API routes?
- Migration to route.ts?

### Common Mistakes
- No method guard
- CORS not set for external callers
- Mixing App and Pages API paths confusingly

### Project Connection
Compare pages/api to app/api/route.ts in your words.

---

## Question: How does revalidation work in the App Router?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Cache control is the hardest part of modern Next — interviewers love it.

### Answer
Time-based: fetch { next: { revalidate: N } } or export const revalidate = N. On-demand: revalidatePath/revalidateTag after mutations (Server Actions or route handlers).

### Example
```ts
import { revalidatePath } from 'next/cache';
revalidatePath('/posts');
```

### Follow-up Questions
- cache tags?
- no-store?
- dynamic = 'force-dynamic'?

### Common Mistakes
- Expecting instant updates with long revalidate
- Not tagging related fetches
- force-dynamic everywhere killing performance

### Project Connection
After creating a post, call revalidatePath('/blog').

---

## Question: What are Server Actions?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Mutations without manual API route boilerplate — App Router feature.

### Answer
'use server' functions called from forms or events; run on server; integrate with revalidation. Progressive enhancement with form action.

### Example
```tsx
'use server';
export async function createPost(formData) {
  await db.post.create(...);
  revalidatePath('/blog');
}
```

### Follow-up Questions
- Security CSRF?
- vs Route Handlers?
- Serialization?

### Common Mistakes
- Exposing sensitive logic without auth check
- Large payloads via actions
- Mixing client and server files wrongly

### Project Connection
Contact form submitting via Server Action instead of client POST.

---

## Question: What is the not-found.tsx convention?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Proper 404 UX per segment.

### Answer
Call notFound() in server component when resource missing; renders not-found.tsx in that segment. HTTP 404. Can be nested per route.

### Example
```tsx
import { notFound } from 'next/navigation';
if (!post) notFound();
```

### Follow-up Questions
- notFound vs error?
- global not-found?
- Metadata on 404?

### Common Mistakes
- return null instead of 404
- Generic site-wide 404 only
- notFound in client component incorrectly

### Project Connection
Product page calls notFound() when SKU missing.

---

## Question: How do dynamic = 'force-static' and 'force-dynamic' affect routes?

### Difficulty
🔴 Hard

### Why Interviewers Ask This
Explicit cache control for tricky routes.

### Answer
export const dynamic = 'force-dynamic' opts out of static caching — always server-render. force-static forces static where possible. Use when defaults guess wrong.

### Example
```ts
export const dynamic = 'force-dynamic';
```

### Follow-up Questions
- Relation to fetch cache?
- cookies() forcing dynamic?
- generateStaticParams interaction?

### Common Mistakes
- force-dynamic everywhere
- Surprised cookies opt into dynamic
- Not documenting why override set

### Project Connection
Dashboard with cookies uses dynamic; marketing page stays static.

---

