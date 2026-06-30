# Architecture Questions

> 15 "how would you design/structure" questions at student level. Draw diagrams while practicing.

See Framework 8 in [answer-frameworks.md](../00-start-here/answer-frameworks.md).

---

## Question: How would you structure a React project?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Tests organization and scalability thinking.

### Answer
Feature or domain folders: components, hooks, pages, services/api, utils, contexts. Shared UI in components/ui. Colocate tests. Avoid deep generic folders dumping ground.

### Example
src/features/auth/, src/features/dashboard/, src/components/Button/

### Follow-up Questions
- Barrel exports?
- Absolute imports?
- When split by type?

### Common Mistakes
Everything in components/ flat 40 files.

### Project Connection
Your folder tree in 4 sentences.

---

## Question: How would you design a REST API for a blog?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
API design pattern.

### Answer
Resources: posts, comments, users, tags. Nouns not verbs. Pagination, filtering, consistent errors, status codes, versioning /api/v1.

### Example
GET /posts?tag=react&page=2. POST /posts. PATCH /posts/:id.

### Follow-up Questions
- Auth which routes?
- Nested comments?
- Rate limit?

### Common Mistakes
POST /createPost. No error format.

### Project Connection
Map to your project's resource naming.

---

## Question: How would you add authentication to an existing app?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Incremental architecture.

### Answer
Choose JWT or session. Register/login routes, hash passwords, auth middleware, protect routes, client storage + redirect on 401, optional refresh token.

### Example
middleware verifyToken → req.user → next() or 401.

### Follow-up Questions
- OAuth add-on?
- Role-based?
- Frontend route guard?

### Common Mistakes
Auth only on frontend route hide.

### Project Connection
Your auth layers: client + server + DB.

---

## Question: How would you scale a MERN app to 10k users?

### Difficulty
🔴 Hard

### Why Interviewers Ask This
Student system design.

### Answer
Start: single server + DB indexes + CDN for static. Then: cache hot reads (Redis), connection pooling, horizontal app servers behind load balancer, DB read replica, image CDN.

### Example
Don't jump to microservices — vertical scale + cache first.

### Follow-up Questions
- Bottleneck find how?
- Session store?
- File uploads?

### Common Mistakes
Kubernetes day one.

### Project Connection
First thing that breaks in YOUR app at 10k users.

---

## Question: How would you structure Express backend?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Backend maintainability.

### Answer
routes → controllers → services → models. Middleware for auth, validation, errors. config/ for env. app.js wires middleware.

### Example
routes/userRoutes.js requires userController.createUser.

### Follow-up Questions
- Validation library?
- Async errors?
- Testing structure?

### Common Mistakes
500-line app.js.

### Project Connection
Your backend file structure.

---

## Question: How would you handle file uploads?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Common feature architecture.

### Answer
Client FormData → multer middleware → validate type/size → store disk or S3 → save URL in DB. Never trust client mime. Scan/async processing for images.

### Example
POST /upload multipart → S3 URL in user.avatar.

### Follow-up Questions
- Direct S3 presigned?
- CDN?
- Virus scan?

### Common Mistakes
Store files in MongoDB documents.

### Project Connection
If no uploads: design profile picture feature.

---

## Question: How would you implement search?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Feature design.

### Answer
Simple: SQL LIKE or Mongo regex with indexes cautiously. Better: dedicated search (Elasticsearch/Atlas Search). Debounce client input. Paginate results.

### Example
GET /api/products?q=phone&page=1. Index on title text.

### Follow-up Questions
- Full-text index?
- Frontend debounce?
- Empty state?

### Common Mistakes
Full table scan on every keystroke.

### Project Connection
Search in your app or how you'd add it.

---

## Question: How would you design real-time notifications?

### Difficulty
🔴 Hard

### Why Interviewers Ask This
WebSocket architecture.

### Answer
WebSocket server or Socket.io room per user. On event → push to connected clients. Fallback SSE/polling. Store notifications in DB for offline users.

### Example
Order status change → emit to user:123 room.

### Follow-up Questions
- Scale sockets?
- Redis adapter?
- Auth on connect?

### Common Mistakes
Polling every 1s at scale.

### Project Connection
Polling vs push for your use case.

---

## Question: How would you separate frontend and backend repos?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Team workflow.

### Answer
Separate deploy cycles, API contract documented (OpenAPI), shared types optional npm package, CORS config, env for API URL, versioning.

### Example
frontend .env VITE_API_URL=https://api.example.com

### Follow-up Questions
- Monorepo when?
- Contract testing?
- Breaking changes?

### Common Mistakes
Tight coupling no API docs.

### Project Connection
Monorepo vs separate — your preference and why.

---

## Question: How would you add admin panel?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Authorization design.

### Answer
Role field on user. Admin routes middleware check role === admin. Separate /admin routes or app. Audit sensitive actions.

### Example
authorize('admin') middleware after authenticate.

### Follow-up Questions
- Separate app?
- RBAC?
- Hide UI enough?

### Common Mistakes
Hidden URL security through obscurity.

### Project Connection
Any role distinction in your project.

---

## Question: How would you design multi-tenant SaaS (basic)?

### Difficulty
🔴 Hard

### Why Interviewers Ask This
Stretch architecture.

### Answer
tenant_id on rows or schema per tenant. Subdomain → resolve tenant. Middleware injects tenant scope on queries. Isolate data strictly.

### Example
WHERE tenant_id = req.tenant.id on every query.

### Follow-up Questions
- Shared DB vs DB per tenant?
- Billing?
- Onboarding?

### Common Mistakes
Forgot tenant filter → data leak.

### Project Connection
Even college ERP: batches as tenants analogy.

---

## Question: How would you handle errors across the stack?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Observability design.

### Answer
API: consistent JSON { error, code, details }. Global error middleware. Client: toast + retry. Log server errors with request id. Don't leak stack traces prod.

### Example
404 handler app.use((req,res) => res.status(404).json(...)).

### Follow-up Questions
- Sentry?
- Error boundaries React?
- Validation errors 400?

### Common Mistakes
alert('error') only.

### Project Connection
Your API error JSON shape.

---

## Question: How would you design caching?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Performance architecture.

### Answer
Browser cache static assets. CDN edge. Server Redis for hot DB reads. HTTP Cache-Control headers. Invalidate on write.

### Example
GET /posts popular → cache 60s Redis key posts:popular.

### Follow-up Questions
- Cache stampede?
- Client React Query?
- Stale data OK?

### Common Mistakes
Cache everything forever.

### Project Connection
What you'd cache first in your read-heavy route.

---

## Question: How would you migrate from CRA to Vite?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Practical migration.

### Answer
Create Vite template, move src, replace env vars REACT_APP_ → VITE_, update index.html entry, fix absolute imports, test build, update CI.

### Example
import.meta.env.VITE_API_URL

### Follow-up Questions
- Jest config?
- Public assets?
- Proxy?

### Common Mistakes
Big bang no incremental test.

### Project Connection
Build tool in your project and migration pain.

---

## Question: How would you design offline-first mobile web?

### Difficulty
🔴 Hard

### Why Interviewers Ask This
Advanced PWA.

### Answer
Service worker cache shell + API responses. IndexedDB for data. Background sync queue mutations. Conflict resolution last-write-wins or CRDT simplified.

### Example
Todo app: queue POST /todos when offline, sync on online.

### Follow-up Questions
- Workbox?
- Stale offline data?
- Push notifications?

### Common Mistakes
localStorage only offline.

### Project Connection
Service worker awareness — used in project?
