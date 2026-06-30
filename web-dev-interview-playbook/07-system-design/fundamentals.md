# System Design Fundamentals (Student Level)

Core concepts you'll use in every system design interview. No PhD required — just clear thinking and real examples.

---

## Scalability

**What it means:** Your system can handle more load (users, requests, data) by adding resources — without rewriting everything from scratch.

**Two types:**

| Type | What you do | Example | Limit |
|------|-------------|---------|-------|
| **Vertical** | Bigger machine (more CPU/RAM) | Upgrade VPS from 2GB → 8GB RAM | Hardware ceiling, single point of failure |
| **Horizontal** | More machines | 3 identical Node.js servers behind a load balancer | Needs stateless apps + load balancing |

**Student framing:** Your MERN capstone on one $5 VPS handles ~50 concurrent users fine. At 5,000 concurrent users, the database and single server become the bottleneck — you'd add caching, read replicas, or more app servers.

**Scalability ≠ performance:** A fast app on one server isn't scalable if adding users requires a redesign. Scalability is about *growth path*.

**Interview line:** *"I'd start with a monolith on one server. When CPU hits 70% consistently, I'd horizontally scale the API tier and add Redis for hot reads."*

---

## Availability

**What it means:** The system stays up and serves requests — even when parts fail.

**Key terms:**
- **Uptime:** "99.9%" = ~8.7 hours downtime/year
- **Redundancy:** Multiple copies so one failure doesn't take everything down
- **Health checks:** Load balancer pings servers; removes unhealthy ones

**How students achieve availability (realistically):**
- Deploy on managed platforms (Vercel, Railway, Render) with auto-restart
- Database backups + replication (most cloud DBs offer this)
- Don't store sessions in server memory (use Redis or DB)
- Graceful error handling — one failed API call shouldn't white-screen the app

**Example:** Two Express instances behind Nginx. If API-1 crashes, Nginx routes traffic to API-2. Users might see one slow request, not a total outage.

---

## Latency

**What it means:** Time between a request and a response. Users feel latency above ~200ms on interactions.

**Where latency comes from:**

```
Browser → DNS lookup → TLS handshake → Network travel → Server processing → DB query → Response travel → Render
```

**Typical numbers (rough):**
- In-memory cache read: < 1ms
- Local DB query (indexed): 1–10ms
- Cross-region network: 50–150ms
- Unindexed DB scan on large table: 100ms–seconds

**How to reduce latency:**
1. **Caching** — don't recompute or re-query what's already known
2. **CDN** — serve static assets from edge locations near users
3. **Database indexes** — match indexes to your query patterns
4. **Fewer round trips** — batch API calls, use connection pooling
5. **Compression** — gzip/Brotli for JSON and assets

**Interview line:** *"The feed endpoint is read-heavy. I'd cache the first page per user in Redis with a 60-second TTL to cut p95 latency from 200ms to under 20ms on cache hits."*

---

## CAP Theorem (Student Level)

**The idea:** In a distributed system, when a network partition happens (nodes can't talk to each other), you must choose:

| | Meaning | Student example |
|---|---------|-----------------|
| **C** — Consistency | Every read gets the latest write | Bank balance must be exact |
| **A** — Availability | Every request gets a response (maybe stale) | Instagram like count can be slightly off |
| **P** — Partition tolerance | System works even if network splits | Assumed in any distributed setup |

**You can't have all three during a partition.** Pick two:

- **CP** — Consistent but might reject requests (e.g., Zookeeper, some bank systems)
- **AP** — Available but data might be briefly inconsistent (e.g., DynamoDB-style, social feeds)

**Does CAP apply to your single Postgres database?** Not really — CAP is about *distributed* systems with multiple nodes.

**Practical takeaway for interviews:**
- Ask: *"Does this data need to be exactly right, or is eventually consistent OK?"*
- Chat message order → strong consistency within a conversation
- View counts on a blog post → eventual consistency is fine

---

## Load Balancing

**What it does:** Distributes incoming traffic across multiple backend servers.

```
                    ┌─────────┐
Users ─────────────►│   LB    │
                    └────┬────┘
           ┌─────────────┼─────────────┐
           ▼             ▼             ▼
        [API-1]       [API-2]       [API-3]
```

**Common algorithms:**
- **Round-robin** — requests go to each server in turn (simple, fair)
- **Least connections** — send to server with fewest active connections
- **IP hash** — same client always hits same server (useful for sticky sessions)

**Layer 4 vs Layer 7:**
- **L4 (transport):** Routes by IP/port — fast, no HTTP awareness
- **L7 (application):** Routes by URL path, headers — can send `/api` to API servers and `/static` to CDN

**Student tools:** Nginx, HAProxy, AWS ALB, Cloudflare load balancing

**Gotcha — sessions:** If sessions live in server memory, users get logged out when LB sends them to a different server. Fix: store sessions in Redis or use JWT.

**Gotcha — WebSockets:** Need sticky sessions or a shared pub/sub layer (Redis) so messages reach the right server.

---

## Caching

**What it does:** Stores frequently accessed data in fast storage so you don't hit the slow path (usually the database) every time.

**Cache layers (fast → slow):**

```
Browser cache → CDN → Application cache (Redis) → Database
```

| Layer | What to cache | TTL example |
|-------|---------------|-------------|
| Browser | Static assets (JS, CSS, images) | Long (days/weeks with cache busting) |
| CDN | Same static assets, globally | Long |
| Redis | API responses, sessions, hot data | Short (seconds to minutes) |
| DB query cache | Rarely needed if you have Redis | — |

**Cache strategies:**
- **Cache-aside (lazy loading):** App checks cache → miss → read DB → write cache
- **Write-through:** Write to cache and DB together (consistent but slower writes)
- **TTL (Time To Live):** Auto-expire cached data after N seconds

**Cache invalidation (the hard part):**
- Delete cache key when underlying data changes
- Short TTL for data that changes often
- Version keys: `user:123:profile:v2`

**Thundering herd:** Cache expires → 1,000 requests hit DB at once. Fix: lock/mutex on rebuild, or stale-while-revalidate.

**Interview line:** *"I'd cache the product catalog in Redis with a 5-minute TTL. On admin update, I'd invalidate the specific product key, not the entire cache."*

---

## CDN (Content Delivery Network)

**What it does:** Copies your static files to servers around the world. Users download from the nearest location (edge PoP).

```
User in Mumbai ──► Mumbai edge server (cached) ── fast!
User in Mumbai ──► Origin server in US-East ── slow (200ms+ extra)
```

**What belongs on a CDN:**
- JavaScript bundles, CSS, fonts
- Images, videos, PDFs
- Any file that doesn't change per-user

**What usually does NOT belong on a CDN:**
- Personalized API responses (`/api/me`)
- HTML that varies by auth state (unless carefully configured)

**Cache busting:** Filenames with content hashes (`app.a3f2b1.js`) — new deploy = new filename = no stale cache issues.

**Student reality:** If you deploy on Vercel, Netlify, or Cloudflare Pages — you already use a CDN. Say that in interviews.

**Example:** React build uploaded to S3, served via CloudFront. A 2MB bundle downloads in 50ms from Singapore instead of 400ms from Virginia.

---

## Quick Mental Math for Interviews

Interviewers sometimes ask rough estimates. Show your thinking:

| Assumption | Calculation |
|------------|-------------|
| 1M daily active users | ~12 users/second average |
| Peak = 3x average | ~36 RPS |
| Each user views 20 pages/day | 20M page views/day |
| 500KB per page (with assets) | ~10TB/day bandwidth (CDN helps a lot) |

You don't need exact numbers — show you can reason about scale.

---

## Putting It Together: Student Checklist

Before ending any design answer, mention:

- [ ] **Scaling path:** vertical first, then horizontal
- [ ] **Single point of failure:** what's the weakest link?
- [ ] **Caching:** what would I cache and for how long?
- [ ] **CDN:** for static assets
- [ ] **Monitoring:** how would I know something broke? (error rate, latency, uptime)

---

**Next:** [frontend-system-design.md](./frontend-system-design.md) or [backend-system-design.md](./backend-system-design.md)
