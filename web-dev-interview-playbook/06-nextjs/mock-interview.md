# Next.js: Mock Interview (45 Minutes)

---

## Section 1: Warm-up (5 min)

1. "Tell me about your Next.js project."
2. "App Router or Pages Router — why?"
3. "How did you deploy it?"

---

## Section 2: Rendering (12 min)

1. "Explain SSR, SSG, CSR, and ISR."
   - Follow-up: "When would you pick each?"
2. "What's hydration?"
3. "Blog vs dashboard — different rendering?"
4. **Scenario:** "E-commerce with 5000 products, prices change hourly."
   - Expected: ISR with revalidate

---

## Section 3: App Router (10 min)

1. "Server Components vs Client Components?"
2. "How fetch data in App Router?"
3. "What is `layout.tsx`?"
4. "Dynamic route `[id]` — how access the id?"

---

## Section 4: Live Discussion / Pseudo-code (10 min)

**Pick ONE:**

### Option A: Route design

> "Design folder structure for: home, blog list, blog post, dashboard (auth), API for comments."

### Option B: Rendering choice

> "Given these 4 pages [marketing, blog, profile, admin], assign SSR/SSG/ISR/CSR and justify."

### Option C: Middleware

> "Write pseudocode for middleware that redirects unauthenticated users from /dashboard to /login."

---

## Section 5: Performance & SEO (5 min)

1. "Why `next/image`?"
2. "How set page title and meta description?"
3. "What is `loading.tsx`?"

---

## Section 6: Project (3 min)

1. "For each route in your app — what rendering strategy and why?"
2. "What would you change if you rebuilt it?"

---

## Rubric

| Area | 1 | 3 | 5 |
|------|---|---|---|
| Rendering | Defines only | Picks correctly | Tradeoffs: SEO, TTFB, cost |
| App Router | Confuses with Pages | Server vs Client | Layouts, caching, RSC patterns |
| Routing | Unclear | File-based basics | Dynamic, groups, middleware |
| Practical | No project | Deployed once | Per-route rendering decisions |

---

## Debrief

Re-read `rendering-patterns.md` decision flowchart. Re-answer Section 2 without notes.

**Homework:** Label every route in your project with its rendering strategy in a comment or doc.
