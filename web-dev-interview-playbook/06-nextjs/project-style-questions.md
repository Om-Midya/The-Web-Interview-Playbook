# Next.js: Project-Style Questions

10 scenario questions for Next.js interviews.

---

## 1. Blog with Markdown Posts

**Q:** Build a blog. Which rendering strategy?

**A:** **SSG** for post pages — content changes only on publish. Use `generateStaticParams` (App Router) or `getStaticPaths` (Pages) for all slugs. **ISR** with `revalidate: 3600` if you want new posts without full rebuild. Homepage can list posts from same static fetch.

```tsx
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map(p => ({ slug: p.slug }));
}
```

---

## 2. E-commerce Product Page

**Q:** 10,000 products, prices update every hour.

**A:** **ISR** with `revalidate: 3600`. CDN serves cached pages. Background regen after expiry. Use `generateStaticParams` for popular products + `dynamicParams: true` for long tail (on-demand generation).

---

## 3. User Dashboard (Authenticated)

**Q:** Personalized metrics, charts, real-time feel.

**A:** **CSR** or **SSR**. Most student projects: Client Component with fetch to protected API. SSR if SEO needed (rare for dashboards). Protect with middleware:

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  if (!token) return NextResponse.redirect(new URL('/login', request.url));
}
export const config = { matcher: ['/dashboard/:path*'] };
```

---

## 4. Marketing Landing Page

**Q:** Fast, SEO-critical, rarely changes.

**A:** **SSG**. Static at build. `next/image` for hero images. Export metadata for OG tags:

```tsx
export const metadata = {
  title: 'My Product',
  description: '...',
  openGraph: { images: ['/og.png'] }
};
```

---

## 5. Search Page with Query Params

**Q:** `/search?q=react` — results depend on query.

**A:** **SSR** or client fetch. App Router:

```tsx
// app/search/page.tsx
export default async function SearchPage({
  searchParams
}: { searchParams: { q?: string } }) {
  const q = searchParams.q ?? '';
  const results = q ? await searchProducts(q) : [];
  return <SearchResults query={q} results={results} />;
}
```

Use `cache: 'no-store'` for fresh results per query.

---

## 6. When Server vs Client Component?

**Q:** Product page with image gallery (zoom on click).

**A:** Server Component fetches product data. Client Component for interactive gallery:

```
page.tsx (Server) → fetches product
  └── Gallery.tsx ('use client') → zoom, swipe
  └── ProductInfo.tsx (Server) → static description
```

Minimize `'use client'` boundary — push it down the tree.

---

## 7. API Route vs Separate Backend

**Q:** When use Next.js API routes vs Express?

**A:**
- **Next.js API/Route Handlers:** Simple CRUD, BFF layer, serverless deployment, same repo as frontend
- **Separate Express:** Complex auth, WebSockets, microservices, team separation, heavy background jobs

Student projects: Next.js route handlers are fine for `/api/*`.

```typescript
// app/api/posts/route.ts
export async function GET() {
  const posts = await db.post.findMany();
  return Response.json({ data: posts });
}

export async function POST(request: Request) {
  const body = await request.json();
  const post = await db.post.create({ data: body });
  return Response.json({ data: post }, { status: 201 });
}
```

---

## 8. Image Optimization

**Q:** How handle images in Next.js?

**A:** Use `next/image`:

```tsx
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority // above fold
/>
```

Automatic WebP/AVIF, lazy loading, prevents layout shift. Remote images need `next.config.js` `images.domains`.

---

## 9. Migrating Pages Router to App Router

**Q:** What changes?

**A:**
| Pages | App |
|-------|-----|
| `pages/index.js` | `app/page.tsx` |
| `getServerSideProps` | async Server Component + `cache: 'no-store'` |
| `getStaticProps` | async Server Component + default cache |
| `pages/api/hello.js` | `app/api/hello/route.ts` |
| `_app.js` layout | `app/layout.tsx` |

Can run both routers during migration.

---

## 10. Deployment & Environment Variables

**Q:** Deploy to Vercel. How manage secrets?

**A:**
- `NEXT_PUBLIC_*` — exposed to browser (API URLs only if safe)
- Other vars — server-only (DB URL, API keys)
- Set in Vercel dashboard or `.env.local` locally
- `next build` validates pages at build time — SSG pages fetch during build

**Health check:** Ensure `DATABASE_URL` set in production env before deploy.

---

## Practice Method

For each scenario: state rendering choice → justify with SEO/freshness/cost → sketch folder structure.
