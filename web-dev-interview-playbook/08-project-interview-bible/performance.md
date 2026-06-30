# Explaining Performance in Your Project

You don't need a blazing-fast app — you need to show you **think about performance** and know what you'd optimize.

---

## What Interviewers Want

- Awareness of bottlenecks (even if you didn't fix them all)
- Specific optimizations you made
- Knowledge of tools to measure performance
- Realistic scale thinking

---

## Performance Talking Points Framework

Structure your answer as: **Measure → Identify → Fix → Verify**

> "I used **[tool]** to measure. The bottleneck was **[X]**. I fixed it by **[Y]**. Result: **[metric improvement]**."

---

## Frontend Performance

### Optimizations You Can Mention

| Optimization | What to say | Tool to cite |
|--------------|-------------|--------------|
| Code splitting | "React.lazy for route-level splitting — login page doesn't load dashboard JS" | Lighthouse bundle analysis |
| Image optimization | "Used WebP format, `loading='lazy'` on below-fold images, thumbnails in lists" | Lighthouse LCP score |
| React Query caching | "Posts cached for 60s — navigating back to feed doesn't refetch" | React Query DevTools |
| Debouncing search | "Search input debounced 300ms — reduced API calls from 10/sec to 3/sec while typing" | Network tab |
| Memoization | "Memoized expensive sort/filter with useMemo — re-renders dropped noticeably" | React DevTools Profiler |
| Virtualized lists | "Used react-window for 500+ item list — only renders ~20 DOM nodes" | Performance tab |

### Core Web Vitals (Know the Names)

| Metric | What it measures | Your target |
|--------|------------------|-------------|
| **LCP** | Largest Contentful Paint | < 2.5s |
| **INP** | Interaction to Next Paint | < 200ms |
| **CLS** | Cumulative Layout Shift | < 0.1 |

**Script:** "I ran Lighthouse on my deployed app. LCP was 3.2s — mainly a large hero image. I compressed it and added explicit width/height, bringing LCP to 1.8s."

---

## Backend Performance

### Optimizations You Can Mention

| Optimization | What to say |
|--------------|-------------|
| Database indexes | "Added index on posts(user_id, created_at) — profile page query went from 200ms to 8ms" |
| N+1 fix | "Feed was doing 1 query for posts + N for authors. Fixed with Prisma `include: { author: true }` — one query" |
| Pagination | "Limited all list endpoints to 20 items — no unbounded SELECT *" |
| Connection pooling | "Prisma manages connection pool — prevents exhausting DB connections under load" |
| Select specific fields | "Changed from SELECT * to selecting only needed columns — smaller payloads" |
| Compression | "Enabled gzip middleware — JSON responses 70% smaller" |

### Example Story (N+1 Fix)

> "Loading the feed with 20 posts was slow. I checked the logs and saw 21 database queries — one for posts, then one per author. I used Prisma's `include: { author: { select: { id: true, username: true, avatar: true } } }` to JOIN in a single query. Load time dropped from ~400ms to ~50ms."

---

## Caching (If You Implemented It)

```javascript
// Simple in-memory cache (mention Redis for production)
const cache = new Map();

async function getPopularPosts() {
  if (cache.has('popular')) return cache.get('popular');
  const posts = await db.post.findMany({ orderBy: { likeCount: 'desc' }, take: 10 });
  cache.set('popular', posts);
  setTimeout(() => cache.delete('popular'), 60_000); // 1 min TTL
  return posts;
}
```

**What to say:** "Cached the popular posts endpoint in memory with 60-second TTL. For production with multiple servers, I'd use Redis so all instances share the cache."

---

## What You Haven't Optimized (Honest + Forward-Looking)

It's OK to say what you'd do next:

| Area | Current state | Improvement |
|------|---------------|-------------|
| Images | Stored as-is on Cloudinary | Add responsive srcset, auto-format |
| Feed | Offset pagination | Cursor pagination for infinite scroll |
| Search | Client-side filter | Server-side full-text search with Postgres GIN index |
| Bundle size | No analysis done | Run `webpack-bundle-analyzer`, tree-shake unused libs |
| API caching | No cache headers | Add `Cache-Control` on public GET endpoints |
| Database | Single instance | Read replica for heavy read endpoints |

**Interview line:** "Performance wasn't the top priority for MVP, but I know the first bottlenecks would be the feed query and image loading. Here's what I'd tackle first..."

---

## Load Testing (Bonus Points)

If you ran any load tests:

```bash
# Using autocannon (mention even if you just tried it)
npx autocannon -c 10 -d 30 https://myapi.railway.app/api/v1/posts
```

> "I ran autocannon with 10 concurrent connections for 30 seconds. The API handled ~50 RPS with p99 latency under 200ms. At 50 concurrent connections, latency spiked — that's where I'd add caching."

---

## Common Interview Questions

**Q: How would you make your app faster?**
A: Pick 2–3 concrete items from your improvement list. Prioritize by impact: database indexes > caching > code splitting > micro-optimizations.

**Q: What's the slowest part of your app?**
A: Be honest. "The admin dashboard loads all users without pagination — fine for 50 users, would break at 10,000. I'd add server-side pagination and search."

**Q: How do you prevent performance regressions?**
A: "Lighthouse CI on deploy, monitor API response times in logs, set a budget: no page over 500KB JS bundle."

**Q: Frontend vs backend — where is the bottleneck?**
A: "For my app, backend — the feed query before I added the index. After that, frontend image loading is the main LCP contributor."

---

## Checklist

- [ ] Ran Lighthouse (or similar) at least once — know your scores
- [ ] Have one specific optimization story with before/after
- [ ] Know what you'd optimize next (prioritized list)
- [ ] Can explain N+1 problem and how you'd fix it
- [ ] Mention pagination on list endpoints

---

**Next:** [security.md](./security.md) | [future-improvements.md](./future-improvements.md)
