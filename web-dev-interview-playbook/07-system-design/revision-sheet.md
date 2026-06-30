# System Design: Revision Sheet

One-page rapid review. Read this the night before your interview.

## Answer Framework (R.U.D.T.S.)
1. **Requirements** — functional + non-functional, ask clarifying questions
2. **Estimates** — users, RPS, storage (rough math is fine)
3. **Design** — draw boxes: client → API → DB → cache
4. **Deep dive** — 1–2 areas interviewer picks
5. **Tradeoffs** — what changes at 10x scale

## Scalability
- **Vertical:** bigger machine (limits, single point of failure)
- **Horizontal:** more machines (needs load balancer, stateless apps)
- Start simple → scale what breaks first

## Availability
- Redundancy, health checks, no in-memory sessions
- 99.9% ≈ 8.7 hrs downtime/year

## Latency Reduction
Cache → CDN → indexes → fewer round trips → compression

## CAP Theorem
During network partition: pick **Consistency** OR **Availability**
- Bank balance → consistent
- Like counts → eventually consistent OK

## Load Balancer
Distributes traffic across servers. Algorithms: round-robin, least connections.
- **L4:** IP/port | **L7:** URL/header routing
- WebSockets need sticky sessions OR Redis pub/sub

## Caching Layers
```
Browser → CDN → Redis → Database
```
- **Cache-aside:** check cache → miss → DB → write cache
- **TTL:** auto-expire stale data
- **Invalidate on write** for user-owned data

## CDN
Static assets (JS, CSS, images) at edge locations near users.
Cache busting: `app.a3f2b1.js` (content hash in filename).

## API Design Quick Hits
| Method | Use |
|--------|-----|
| GET | Read |
| POST | Create |
| PUT/PATCH | Update |
| DELETE | Remove |

- Nouns not verbs: `/users` not `/getUsers`
- Cursor pagination for feeds (not offset)
- Status codes: 200, 201, 400, 401, 403, 404, 429, 500
- Rate limit auth endpoints

## Auth Flow
```
Login → validate bcrypt → session cookie (HTTP-only) OR JWT
→ middleware verifies → attach user → authorize by role
```
Never: plaintext passwords, JWT in localStorage

## Database
- **PostgreSQL default** for relational data
- Index: foreign keys, WHERE columns, ORDER BY columns
- Read replicas for read-heavy workloads
- Denormalize counts (like_count) for fast reads

## WebSockets (Chat)
```
Client ←WS→ Server → Postgres (persist)
              ↓
         Redis pub/sub (multi-server fan-out)
```
REST for history, WebSocket for real-time

## URL Shortener Pattern
```
POST long URL → base62(auto-id) → store → return short link
GET /:code → Redis cache → 302 redirect (async analytics)
```

## Social Feed Pattern
- **Pull model:** query on read (simple, start here)
- **Fan-out on write:** precompute feed (scale path)
- Cache feed page 1 in Redis (60s TTL)
- Images: S3 + CDN, not in DB

## Frontend Design Hits
- Feature-based folder structure
- React Query for server state, local state for UI
- Code splitting (React.lazy), virtualization (react-window)
- Infinite scroll: cursor pagination + IntersectionObserver
- Autocomplete: debounce 300ms, min 2 chars

## Security Checklist (Always Mention)
- [ ] HTTPS
- [ ] bcrypt passwords
- [ ] Input validation
- [ ] Auth on every protected route
- [ ] Rate limiting
- [ ] No secrets in git

## Quick Math
| Assumption | Result |
|------------|--------|
| 1M DAU | ~12 RPS average |
| Peak ≈ 3x average | ~36 RPS |
| 7-char base62 | 62^7 ≈ 3.5 trillion codes |

## Designs to Practice
1. **URL Shortener** (easiest — 20 min)
2. **Chat App** (WebSockets + persistence)
3. **Social Media Feed** (pull vs fan-out)

---

**Last check:** Draw URL shortener on paper in 5 minutes. Say every box out loud.
