# System Design Interview Questions

> 30+ student-level frontend/backend/fullstack questions. Practice out loud.

---

## Question: What does scalability mean for a web application?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Baseline vocabulary before any design question.

### Answer
Scalability is the ability to handle more load (users, requests, data) by adding resources without redesigning core architecture. Often discussed as handling 10x traffic with acceptable latency and cost.

### Example
A student project API might serve 10 RPS; production might need 10,000 RPS via horizontal scaling and caching.

### Follow-up Questions
- Difference between scalability and performance?
- What metrics define 'handles load'?
- Vertical vs horizontal?

### Common Mistakes
- Equating scalability only with cloud spend
- Ignoring database bottlenecks
- Designing for Google scale on day one

### Project Connection
Frame your capstone: what breaks first if 1000 users hit it at once?

---

## Question: Explain horizontal vs vertical scaling.

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Foundational tradeoff in every system design intro.

### Answer
Vertical scaling adds power to one machine (CPU/RAM). Horizontal scaling adds more machines. Vertical has limits and single point of failure; horizontal needs load balancing and often stateless app servers.

### Example
Upgrade one Node server from 2GB to 8GB RAM (vertical). Run four identical Node instances behind a load balancer (horizontal).

### Follow-up Questions
- When is vertical scaling enough?
- Stateful vs stateless with horizontal?
- Database scaling differences?

### Common Mistakes
- Only mentioning auto-scaling without app changes
- Forgetting session stickiness issues
- Assuming horizontal is always cheaper

### Project Connection
Mention which approach your deployed MERN app would use first.

---

## Question: What is load balancing and why is it used?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Connects scaling to traffic distribution.

### Answer
A load balancer distributes incoming requests across multiple backend servers using algorithms (round-robin, least connections). Improves availability, throughput, and enables rolling deploys.

### Example
Users → ALB → [API-1, API-2, API-3]. Health checks remove unhealthy instances.

### Follow-up Questions
- Layer 4 vs Layer 7 LB?
- Sticky sessions?
- What is health check?

### Common Mistakes
- Single server with no failover plan
- Not considering WebSocket stickiness
- Ignoring SSL termination at LB

### Project Connection
Sketch LB in front of two Express instances in a whiteboard answer.

---

## Question: Why is caching important and what are common layers?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Caching is the highest-ROI student-level design topic.

### Answer
Caching stores frequently read data closer to the consumer to cut latency and database load. Layers: browser cache, CDN, reverse proxy, application memory (Redis), database query cache.

### Example
Cache user profile in Redis with 5-minute TTL; serve feed from cache on cache hit.

### Follow-up Questions
- Cache invalidation strategies?
- TTL vs write-through?
- Thundering herd?

### Common Mistakes
- Caching everything with no invalidation
- Stale data breaking auth
- Using cache as source of truth

### Project Connection
Add Redis caching to a slow GET endpoint and cite hit rate in interviews.

---

## Question: What is a CDN and when would you use one?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Frontend-heavy roles expect CDN basics for static assets.

### Answer
A Content Delivery Network caches static assets (JS, CSS, images, video) at edge locations near users. Reduces origin load and latency. Great for global audiences and large media.

### Example
Host React build on S3 + CloudFront; images served from nearest PoP.

### Follow-up Questions
- CDN for dynamic HTML?
- Cache busting with hashes?
- Invalidation?

### Common Mistakes
- Putting API responses on CDN without thought
- Forgetting HTTPS at edge
- Not versioning asset filenames

### Project Connection
Deploy portfolio on Vercel/Netlify and explain their CDN briefly.

---

## Question: How do databases scale for read-heavy vs write-heavy workloads?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Shows you think beyond a single Postgres instance.

### Answer
Read-heavy: replicas, caching, read replicas, materialized views. Write-heavy: sharding, partitioning, queue-based writes, choosing DB suited to access pattern. Often start with one primary DB and optimize reads first.

### Example
Instagram-like read: replicas + cache for feeds. Write-heavy logging: append-only store or partitioned tables.

### Follow-up Questions
- What is replication lag?
- When to shard?
- SQL vs NoSQL scaling?

### Common Mistakes
- Sharding on day one
- Ignoring connection pool limits
- Master-replica without handling stale reads

### Project Connection
Describe one table in your project that would need indexes first.

---

## Question: Explain the CAP theorem at a student level.

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Common theory question for backend/fullstack interviews.

### Answer
In a network partition, distributed systems trade off Consistency (all nodes see same data) vs Availability (every request gets a response). Partition tolerance is assumed in distributed systems. Pick CP or AP based on product needs.

### Example
Bank balance updates favor consistency; social like counts might tolerate eventual consistency.

### Follow-up Questions
- What is eventual consistency?
- Examples of CP systems?
- Does CAP apply to single DB?

### Common Mistakes
- Memorizing without examples
- Claiming you can have all three during partition
- Confusing CAP with ACID

### Project Connection
Say whether your chat 'last seen' must be strongly consistent or not.

---

## Question: What makes a good REST API design for students?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
API design is practical fullstack interview bread and butter.

### Answer
Use nouns for resources (`/users`, `/posts`), HTTP verbs correctly, meaningful status codes, pagination, versioning (`/v1`), consistent error shape, and idempotent updates where needed. Document with OpenAPI.

### Example
GET /v1/posts?page=2&limit=20; POST /v1/posts; PATCH /v1/posts/:id

### Follow-up Questions
- REST vs GraphQL tradeoffs?
- HATEOAS needed?
- Nested routes limits?

### Common Mistakes
- Verbs in URLs like /getUsers
- 200 OK with error body
- No pagination on list endpoints

### Project Connection
Refactor your Express routes to resource-oriented URLs before interviews.

---

## Question: What is rate limiting and how might you implement it?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Security and reliability question for public APIs.

### Answer
Rate limiting caps requests per client/IP/API key in a time window to prevent abuse and protect resources. Implement with token bucket or sliding window in Redis; return 429 with Retry-After.

### Example
100 requests/minute per API key; increment counter in Redis with TTL.

### Follow-up Questions
- Difference from throttling?
- Distributed rate limits?
- User-facing UX?

### Common Mistakes
- No limits on login endpoint
- Rate limit per server only without shared store
- Blocking legit traffic behind NAT

### Project Connection
Propose rate limits for login vs public read endpoints in your API.

---

## Question: When would you use WebSockets instead of HTTP polling?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Real-time features appear in chat and notification designs.

### Answer
WebSockets give persistent bidirectional connection — good for chat, live scores, collaborative edits. HTTP polling/simple SSE work for lower complexity or one-way server push.

### Example
Chat app: WebSocket channel per room. Notification badge: SSE or long poll might suffice.

### Follow-up Questions
- WebSocket scaling?
- Heartbeat/reconnect?
- SSE vs WebSocket?

### Common Mistakes
- WebSockets for every CRUD page
- Ignoring load balancer sticky sessions
- No auth on socket handshake

### Project Connection
If you built chat, explain message flow client → server → other clients.

---

## Question: What is pub/sub and where does it help?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Decoupling async work is common in backend design interviews.

### Answer
Publishers send messages to topics; subscribers receive without knowing publishers. Enables async processing, fan-out notifications, and microservice communication via brokers (Redis Pub/Sub, SNS/SQS, Kafka at scale).

### Example
Order placed event → email service + inventory service subscribe independently.

### Follow-up Questions
- Pub/sub vs message queue?
- At-least-once delivery?
- Ordering guarantees?

### Common Mistakes
- Using pub/sub without durability needs
- Tight coupling disguised as events
- No idempotent consumers

### Project Connection
Describe emailing users after signup using a queue instead of blocking HTTP.

---

## Question: Monolith vs microservices — what should a student say?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Interviewers want pragmatism, not buzzwords.

### Answer
Monolith: one deployable codebase — simpler for small teams and MVPs. Microservices: split by bounded context — independent deploys, more ops complexity. Start monolith; extract services when clear pain (scale, team boundaries).

### Example
Student e-commerce MVP as monolith; split payments service only when compliance/isolation needed.

### Follow-up Questions
- How do services communicate?
- Distributed tracing?
- Data ownership per service?

### Common Mistakes
- Microservices for 3-person internship project
- Shared database across all services
- Ignoring network latency between services

### Project Connection
Defend keeping your final-year project a monolith with a migration path.

---

## Question: Why do we want stateless application servers?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Ties to sessions, scaling, and deploys.

### Answer
Stateless servers don't store user session data in memory between requests. Any instance can handle any request — simplifies horizontal scaling and rolling updates. Session state moves to DB, Redis, or JWT.

### Example
Express app stores sessions in Redis, not in-process Map.

### Follow-up Questions
- What about WebSocket state?
- Sticky sessions downside?
- JWT pros/cons?

### Common Mistakes
- In-memory sessions on scaled fleet
- Assuming stateless means no auth
- Huge JWT payloads

### Project Connection
Note if your app uses express-session in memory and how you'd fix it.

---

## Question: How would you design session management for a web app?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Auth flow questions often include sessions vs tokens.

### Answer
Options: server-side session ID in HTTP-only secure cookie pointing to Redis/DB; or stateless JWT (access + refresh). Rotate refresh tokens, set expiry, invalidate on logout, use HTTPS, CSRF protection for cookies.

### Example
Login → set session cookie → middleware loads user from Redis on each request.

### Follow-up Questions
- JWT vs session cookies?
- SameSite cookie attribute?
- OAuth role?

### Common Mistakes
- localStorage for session JWT with XSS risk
- No refresh/expiry strategy
- Session fixation ignored

### Project Connection
Walk through login → authenticated request in your Express middleware.

---

## Question: How do you approach file storage in a system design?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Upload features are common in student fullstack projects.

### Answer
Don't store files on app server disk at scale. Use object storage (S3) with metadata in DB. Generate pre-signed URLs for direct upload/download; virus scan async; CDN for public assets.

### Example
Client uploads to S3 via presigned PUT; DB stores key, mime, owner_id.

### Follow-up Questions
- Multipart upload?
- Image resizing pipeline?
- Access control?

### Common Mistakes
- Storing blobs in SQL rows
- Public bucket for private files
- No size/type validation

### Project Connection
If your app has avatars, describe S3 + DB metadata pattern.

---

## Question: Design a notification system at a high level.

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Classic product + backend design prompt for students.

### Answer
Components: event producer, notification service, preference store, channel workers (email, push, in-app), template engine, delivery queue, read/unread store. Fan-out via queue; respect user opt-in.

### Example
New comment → event → queue → in-app row + optional email if enabled.

### Follow-up Questions
- Push notification providers?
- Idempotent delivery?
- Batching digests?

### Common Mistakes
- Sending email synchronously in request path
- No user preferences
- Duplicate notifications on retry

### Project Connection
Map notifications for 'friend request' across DB, queue, and UI badge.

---

## Question: How does search work at a basic system level?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Search bars appear in many design exercises.

### Answer
Simple: SQL `LIKE` or full-text indexes for small data. Scale: dedicated search engine (Elasticsearch/OpenSearch) fed by change data capture or async indexing. Support ranking, facets, typo tolerance.

### Example
Products table in Postgres for MVP; sync to Elasticsearch for autocomplete at scale.

### Follow-up Questions
- Inverted index idea?
- Search vs filter?
- Reindex strategy?

### Common Mistakes
- Elasticsearch for 500 rows
- Searching only on client for huge catalogs
- No pagination of results

### Project Connection
Propose SQL full-text for your project search before jumping to Elastic.

---

## Question: What pagination strategies should APIs support?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
List endpoints are in every CRUD design.

### Answer
Offset/limit is simple but slow on large offsets. Cursor/keyset pagination uses last seen id/timestamp for stable, efficient next pages. Return `next_cursor` and consistent sort order.

### Example
GET /posts?cursor=eyJpZCI6MTIzfQ&limit=20

### Follow-up Questions
- When is offset ok?
- Deep paging problems?
- Total count needed?

### Common Mistakes
- No limit allowing huge responses
- Unstable sort breaking pages
- Exposing internal DB ids without thought

### Project Connection
Add cursor pagination to a long list endpoint in your API design answer.

---

## Question: What is idempotency and why does it matter for APIs?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Payment and write APIs expect this term.

### Answer
An operation is idempotent if repeating it has the same effect as doing it once. Critical for retries after network failures. Use idempotency keys on POST, or design PUT/DELETE idempotently.

### Example
Client sends `Idempotency-Key: uuid` on payment POST; server stores result for key.

### Follow-up Questions
- Which HTTP methods are idempotent?
- Duplicate message handling?
- Database upsert?

### Common Mistakes
- Double-charging on retry
- POST that always creates new row
- No dedup on webhooks

### Project Connection
Explain idempotent webhook handler for Stripe-like events.

---

## Question: What is an API gateway and what problems does it solve?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Microservice interviews introduce gateway as single entry.

### Answer
API gateway is a front door routing clients to backend services, often handling auth, rate limiting, SSL, request routing, and aggregation. Examples: Kong, AWS API Gateway, NGINX.

### Example
Mobile app → API Gateway → users service / orders service

### Follow-up Questions
- Gateway vs load balancer?
- BFF pattern?
- GraphQL at gateway?

### Common Mistakes
- God gateway with all business logic
- Skipping auth at gateway and duplicating
- Single point of failure without HA

### Project Connection
Place gateway in diagram between React app and multiple microservices.

---

## Question: Frontend system design: how do you structure components at scale?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Frontend system design is growing for student React roles.

### Answer
Organize by feature or domain, shared UI kit for primitives, container/presentational split or hooks for logic, lazy routes for code splitting, clear props/contracts, Storybook for reusable components, avoid prop drilling with context sparingly.

### Example
features/feed/FeedList.tsx, components/ui/Button.tsx, hooks/useFeed.ts

### Follow-up Questions
- Atomic design?
- When to extract a hook?
- Barrel files pitfalls?

### Common Mistakes
- One giant App.tsx
- Duplicated fetch logic in every page
- No design tokens for spacing/color

### Project Connection
Describe folder structure of your React portfolio like a mini design doc.

---

## Question: Frontend system design: state management at scale — what are the options?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Shows you won't put everything in global Redux by reflex.

### Answer
Local component state for UI-only; Context for theme/auth light usage; server state libraries (React Query) for API cache; Redux/Zustand for complex client-global state. Prefer colocation and server cache over global soup.

### Example
React Query caches posts; Zustand holds UI filters; form state stays in component.

### Follow-up Questions
- When is Redux still justified?
- Stale closure issues?
- SSR hydration?

### Common Mistakes
- Global store for every fetch
- Duplicating server data in Redux
- No loading/error states

### Project Connection
Justify your state choices in your React project in one minute.

---

## Question: Backend system design: describe a typical auth flow.

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Fullstack students must whiteboard login securely.

### Answer
User submits credentials → server validates hash (bcrypt) → issue session cookie or JWT pair → client sends cookie/Authorization header → middleware verifies → attach user to request → authorize by role/resource.

### Example
POST /login → HTTP-only cookie → GET /me protected route.

### Follow-up Questions
- OAuth social login?
- Password reset flow?
- RBAC vs ABAC?

### Common Mistakes
- Plaintext passwords
- JWT in localStorage
- No HTTPS mention

### Project Connection
Narrate auth middleware chain in your Express app line by line.

---

## Question: Backend system design: how do you approach data modeling?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Schema design supports feature and performance stories.

### Answer
Start from entities and relationships, access patterns, and normalization tradeoffs. Define primary keys, indexes for queries, avoid N+1 with joins or batching, use migrations, consider soft deletes and audit fields.

### Example
Users 1—N Posts; index posts(user_id, created_at) for profile feed query.

### Follow-up Questions
- Normalization vs denormalization?
- Many-to-many join tables?
- UUID vs int ids?

### Common Mistakes
- Schema with no indexes on foreign keys
- Storing arrays in strings
- No created_at for sorting

### Project Connection
Draw ER diagram for your project's main three tables in interviews.

---

## Question: Design an Instagram-like feed (student-level).

### Difficulty
🔴 Hard

### Why Interviewers Ask This
Classic product design question scaled for interns.

### Answer
MVP: users follow users; posts table; home feed query joins following list + posts ordered by time with pagination. Scale: precompute fan-out on write (push) or pull model with caching; media on CDN; like counts with async counters.

### Example
Pull model: on open app, fetch ids user follows, query recent posts WHERE user_id IN (...) LIMIT 20.

### Follow-up Questions
- Fan-out on write vs read?
- Celebrity user problem?
- Ranking beyond chronological?

### Common Mistakes
- Feed from single SQL with no index
- Loading all images at once
- Ignoring cache for hot users

### Project Connection
Compare your Twitter/feed clone approach to push vs pull in one slide.

---

## Question: Design a real-time chat application (student-level).

### Difficulty
🔴 Hard

### Why Interviewers Ask This
Combines WebSockets, storage, and presence.

### Answer
Clients connect via WebSocket to chat service; messages persisted in DB (conversation_id, sender, body, ts); presence optional in Redis; history via REST pagination; delivery acks; auth on connection; scale with room sharding or dedicated chat nodes.

### Example
WS message → validate membership → insert message → broadcast to room subscribers.

### Follow-up Questions
- Message ordering?
- Offline delivery?
- End-to-end encryption scope?

### Common Mistakes
- No persistence — reload loses chat
- Broadcast to all users globally
- No backpressure on spam

### Project Connection
If you have a chat demo, walk message path from send click to peer UI.

---

## Question: Design a URL shortener (concepts only).

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Compact design problem teaching hashing, redirects, analytics.

### Answer
Generate short code (base62) mapping to long URL in DB; 301/302 redirect on GET /:code; handle collisions; optional analytics click table; cache hot codes in Redis; rate limit creation.

### Example
POST {url} → store → return short link; GET /abc123 → lookup → redirect.

### Follow-up Questions
- Custom aliases?
- Expiration?
- How many URLs fit in 7 chars?

### Common Mistakes
- Only hash without collision check
- Storing only in memory
- Open redirect security hole

### Project Connection
Relate base62 codes to primary keys vs random strings in interview.

---

## Question: How would you handle failures and retries in distributed systems?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Reliability questions round out student backend design.

### Answer
Use timeouts, retries with exponential backoff and jitter, circuit breakers, idempotent handlers, dead-letter queues for poison messages, and health checks. Log correlation ids across services.

### Example
HTTP client retries 3 times on 503; then surfaces error; webhook worker DLQ after 5 fails.

### Follow-up Questions
- Exactly-once myth?
- Saga pattern basics?
- Graceful degradation?

### Common Mistakes
- Infinite retries hammering DB
- No timeout on external APIs
- Retry without idempotency

### Project Connection
Add timeout + retry to a fetch to third-party API in your design narrative.

---

## Question: What is the difference between sync and async processing in APIs?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Explains why queues appear in designs.

### Answer
Synchronous: client waits until work completes in same request (good for quick reads/writes). Asynchronous: API enqueues job, returns 202, client polls or gets webhook when done — for emails, PDF generation, heavy transforms.

### Example
POST /export → job id → worker builds CSV → notify user.

### Follow-up Questions
- When is 202 Accepted used?
- Webhooks vs polling?
- Backpressure?

### Common Mistakes
- Blocking HTTP for 2-minute report
- No job status endpoint
- Losing jobs on server restart without queue

### Project Connection
Move image resize off request path in your upload feature story.

---

## Question: How do you think about security in system design (student checklist)?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Interviewers expect HTTPS, authz, and input validation mentions.

### Answer
HTTPS everywhere, hash passwords, validate/sanitize input, authn + authz on every route, secrets in env/vault, least privilege DB users, rate limits, CORS configured intentionally, audit logs for sensitive actions.

### Example
Admin routes check role; SQL via parameterized queries; CSP headers on frontend.

### Follow-up Questions
- OWASP top 10?
- Secrets in git?
- SSRF on webhooks?

### Common Mistakes
- Security only as afterthought
- CORS * with credentials
- Logging passwords

### Project Connection
Close every design answer with 2–3 security bullets — interviewers notice.

---

## Question: What monitoring and logging would you add to a student project in production?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Operational awareness distinguishes thoughtful candidates.

### Answer
Structured logs (JSON), request ids, error tracking (Sentry), basic metrics (latency, error rate, RPS), uptime checks, alerts on 5xx spikes. Don't log PII.

### Example
Middleware logs method, path, duration; Sentry captures stack traces.

### Follow-up Questions
- Distributed tracing?
- Log aggregation?
- SLI/SLO basics?

### Common Mistakes
- console.log only in production
- No alerting
- Logging full JWT tokens

### Project Connection
Mention one metric you'd watch after deploying your capstone.

---

## Question: How does database indexing relate to system performance?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Links data modeling to query speed in designs.

### Answer
Indexes speed up reads on filtered/sorted columns but slow writes and use storage. Design indexes around query patterns (WHERE, JOIN, ORDER BY). Explain plans for slow queries.

### Example
INDEX on posts(created_at DESC) for recent posts feed.

### Follow-up Questions
- Composite indexes?
- Covering index?
- When indexes hurt?

### Common Mistakes
- Index every column
- No index on foreign keys
- Ignoring N+1 query problem

### Project Connection
Name one slow query you'd EXPLAIN ANALYZE in your project DB.

---

