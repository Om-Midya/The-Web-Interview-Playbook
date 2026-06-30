# Node.js & Express Interview Questions

> 40+ questions with full answers. Practice out loud.

---

## Question: What is Node.js and how does its architecture work?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
They want to know you understand Node is not a language or framework — it's a runtime.

### Answer
Node.js is a JavaScript runtime built on Chrome's V8 engine. It runs JS outside the browser using libuv for async I/O, an event loop, and a thread pool for blocking work. Single-threaded for JS execution, but handles concurrency via non-blocking I/O.

### Example
```js
// server.js
const http = require('http');
http.createServer((req, res) => res.end('OK')).listen(3000);
```

### Follow-up Questions
- How does Node differ from browser JS?
- What is libuv?
- Is Node multi-threaded?

### Common Mistakes
- Saying Node is multi-threaded for all JS code
- Confusing Node with Express
- Ignoring the event loop

### Project Connection
Explain your API project as: V8 runs your JS, libuv handles sockets and disk I/O.

---

## Question: Explain the Node.js event loop.

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Core concurrency model — senior interviews dig here when APIs stall or CPU spikes.

### Answer
The event loop processes callbacks in phases: timers, pending callbacks, idle/prepare, poll (I/O), check, close. Microtasks (promises, queueMicrotask) run between phases. Long synchronous CPU work blocks the entire loop.

### Example
```js
setTimeout(() => console.log('timer'), 0);
Promise.resolve().then(() => console.log('microtask'));
console.log('sync');
// sync, microtask, timer
```

### Follow-up Questions
- What is the thread pool?
- process.nextTick vs setImmediate?
- How do you avoid blocking the loop?

### Common Mistakes
- Thinking setTimeout(0) runs before promises
- Running heavy JSON parse on every request on main thread
- Using sync fs in production hot paths

### Project Connection
If your Express server froze under load, mention checking for sync crypto or large loops on the main thread.

---

## Question: How do CommonJS and ES modules work in Node?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Every real codebase picks a module system; mixing them wrong breaks builds.

### Answer
CommonJS uses require/module.exports (default in older Node). ESM uses import/export; enable via .mjs or "type": "module" in package.json. ESM is static, enables tree-shaking; CJS is dynamic require().

### Example
```js
// CommonJS
const fs = require('fs');
module.exports = { read: fs.readFile };

// ESM
import fs from 'fs';
export function read(p) { return fs.promises.readFile(p); }
```

### Follow-up Questions
- Can you require ESM from CJS?
- What is __dirname in ESM?
- Dual package hazard?

### Common Mistakes
- Using import in a .js file without type module
- Mixing default export styles
- Circular requires without refactoring

### Project Connection
Match your project's package.json type field when explaining how you structure routes and models.

---

## Question: What is npm and how do package.json fields matter?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Daily tooling — they check you know dependencies vs devDependencies and scripts.

### Answer
npm is Node's package manager. package.json lists metadata, scripts, dependencies (^semver ranges), and engines. package-lock.json pins exact versions for reproducible installs.

### Example
```json
{
  "scripts": { "start": "node server.js", "dev": "nodemon server.js" },
  "dependencies": { "express": "^4.19.0" },
  "devDependencies": { "jest": "^29.0.0" }
}
```

### Follow-up Questions
- npm ci vs npm install?
- What does ^ mean?
- npx?

### Common Mistakes
- Committing node_modules
- Using * for versions in production
- No lockfile in CI

### Project Connection
Mention npm run dev and how lockfiles keep teammate machines consistent.

---

## Question: What is Express and why is it used?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Baseline for backend Node roles — can you build HTTP APIs?

### Answer
Express is a minimal web framework for Node. It wraps http.createServer with routing, middleware pipeline, and helpers for req/res. Unopinionated — you choose DB, auth, structure.

### Example
```js
const express = require('express');
const app = express();
app.get('/health', (req, res) => res.json({ ok: true }));
app.listen(3000);
```

### Follow-up Questions
- Express vs Fastify?
- Is Express still relevant?
- What is app.use?

### Common Mistakes
- Calling app.listen in every route file
- No error handling for async routes
- Huge monolithic app.js forever

### Project Connection
Frame your REST API as Express routes + middleware + a data layer.

---

## Question: What is middleware in Express?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Middleware is how auth, logging, and parsing compose — central to Express design.

### Answer
Middleware functions have (req, res, next). They run in order; call next() to pass control or end the response. Types: application-level, router-level, error-handling (4 args), built-in, third-party.

### Example
```js
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});
```

### Follow-up Questions
- What if you forget next()?
- Order of middleware?
- Async middleware errors?

### Common Mistakes
- Mounting auth after routes that need it
- Calling next() after res.send
- Not using error middleware

### Project Connection
Describe a logging middleware you added before protected /api routes.

---

## Question: How does routing work in Express?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
REST design and clean URLs show up in every backend interview.

### Answer
Routes map HTTP methods + paths to handlers. express.Router() groups routes. Path params (:id), optional chaining, and route-specific middleware keep APIs organized.

### Example
```js
const router = express.Router();
router.get('/users/:id', (req, res) => {
  res.json({ id: req.params.id });
});
app.use('/api', router);
```

### Follow-up Questions
- Route vs middleware?
- How to handle 404?
- app.all?

### Common Mistakes
- Duplicate route paths with different methods unordered
- No API prefix versioning
- Fat handlers with DB + validation inline

### Project Connection
Split users.routes.js and mount at /api/users — interviewers like modular structure.

---

## Question: Explain the req and res objects in Express.

### Difficulty
🟢 Easy

### Why Interviewers Ask This
You must read input and send correct responses on real endpoints.

### Answer
req carries method, url, headers, query (req.query), body (after parser), params. res sends responses: status(), json(), send(), set headers, cookies. Extended from Node's http.IncomingMessage/ServerResponse.

### Example
```js
app.post('/items', (req, res) => {
  const name = req.body.name;
  res.status(201).json({ name });
});
```

### Follow-up Questions
- req.body without middleware?
- Difference query vs params?
- res.locals?

### Common Mistakes
- Not validating req.body
- Sending 200 for errors
- Leaking stack traces in res.json

### Project Connection
Walk through POST /login reading email/password from body and returning JSON tokens.

---

## Question: How do you design a REST API in Express?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Tests resource naming, HTTP verbs, and statelessness.

### Answer
Use nouns for resources (/users, /users/:id), correct verbs (GET read, POST create, PUT/PATCH update, DELETE remove), consistent JSON, proper status codes, and versioning if needed. Keep handlers thin; delegate to services.

### Example
```js
// GET /api/users, POST /api/users, GET /api/users/:id
```

### Follow-up Questions
- REST vs GraphQL?
- When is POST idempotent?
- HATEOAS?

### Common Mistakes
- Verbs in URLs like /getUser
- Using GET to delete
- No pagination on lists

### Project Connection
Map your project's CRUD endpoints to REST verbs and explain why.

---

## Question: Which HTTP status codes should a Node API return?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Wrong codes confuse clients and break monitoring.

### Answer
Common: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable, 429 Too Many Requests, 500 Internal Server Error.

### Example
```js
if (!user) return res.status(404).json({ error: 'Not found' });
res.status(201).json(user);
```

### Follow-up Questions
- 401 vs 403?
- When 204?
- 502 vs 503?

### Common Mistakes
- Always 200 with { success: false }
- 500 for validation errors
- 404 for wrong auth

### Project Connection
Audit one endpoint and justify each status code you'd return.

---

## Question: How do you implement error-handling middleware in Express?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Unhandled errors crash requests or leak internals without a central handler.

### Answer
Error middleware signature is (err, req, res, next) — four parameters. Place after routes. Sync errors need try/catch or wrappers; async errors must reach next(err) or use express-async-errors / wrapper.

### Example
```js
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message });
});
```

### Follow-up Questions
- Why 4 args?
- Handling unhandled promise rejections?
- Operational vs programmer errors?

### Common Mistakes
- No error middleware at all
- Sending full err.stack in production
- Forgetting next(err) in async handlers

### Project Connection
Show a global handler that logs internally but returns safe messages to clients.

---

## Question: What does body-parser / express.json do?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
POST/PUT APIs fail mysteriously without parsing middleware.

### Answer
express.json() parses JSON bodies into req.body (built-in since Express 4.16). express.urlencoded() for forms. Set size limits to prevent huge payloads. Raw body needed for webhooks — use verify option.

### Example
```js
app.use(express.json({ limit: '100kb' }));
```

### Follow-up Questions
- Content-Type requirements?
- multipart forms?
- Why limit body size?

### Common Mistakes
- Parsing before routes that need raw body
- Trusting req.body without validation
- No limit — DoS risk

### Project Connection
Mention validating JSON shape after parsing for your signup endpoint.

---

## Question: How do you enable and configure CORS in Express?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Frontend on another origin will block API calls without CORS.

### Answer
CORS is browser-enforced. Server sends Access-Control-Allow-Origin and related headers. Use cors package: cors() for dev, or whitelist origins in production. Preflight OPTIONS for non-simple requests.

### Example
```js
const cors = require('cors');
app.use(cors({ origin: 'https://myapp.com', credentials: true }));
```

### Follow-up Questions
- Simple vs preflight?
- credentials with *?
- CORS on server-to-server?

### Common Mistakes
- cors() wide open in production
- Forgetting credentials for cookies
- Only setting CORS on some routes

### Project Connection
If React on localhost:5173 hits API on :3000, explain the headers you set.

---

## Question: How do environment variables work in Node?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Secrets and config must not live in code — basic production hygiene.

### Answer
process.env holds env vars set by the shell, Docker, or hosting platform. Never commit secrets. Use different values per environment (development, staging, production).

### Example
```js
const port = process.env.PORT || 3000;
```

### Follow-up Questions
- 12-factor config?
- NODE_ENV?
- Validating env at startup?

### Common Mistakes
- Hardcoding API keys
- No default for PORT locally
- Reading env inside tight loops unnecessarily

### Project Connection
Describe PORT and DATABASE_URL coming from Railway/Render/Heroku-style hosting.

---

## Question: What is dotenv and when should you use it?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Local dev ergonomics vs production injection.

### Answer
dotenv loads .env into process.env at startup. Great for local development. In production, platforms inject env vars — don't rely on .env files on disk. Add .env to .gitignore.

### Example
```js
require('dotenv').config();
const secret = process.env.JWT_SECRET;
```

### Follow-up Questions
- dotenv in production?
- .env.example?
- Multiple env files?

### Common Mistakes
- Committing .env
- Calling config() in every file
- No validation that JWT_SECRET exists

### Project Connection
Show .env.example with placeholder keys for contributors.

---

## Question: How does JWT authentication work in an Express API?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Stateless auth is standard for SPAs and mobile clients.

### Answer
User logs in; server signs a JWT with a secret/private key containing claims (sub, exp). Client sends Authorization: Bearer <token>. Middleware verifies signature and expiry, attaches user to req.

### Example
```js
const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
// middleware: jwt.verify(token, secret)
```

### Follow-up Questions
- JWT vs session cookie?
- Where to store tokens on client?
- Refresh tokens?

### Common Mistakes
- Storing passwords in JWT
- No exp claim
- Using alg none attacks — verify alg

### Project Connection
Explain login route issuing JWT and middleware protecting /api/profile.

---

## Question: Why use bcrypt for passwords?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Storing plain or weakly hashed passwords is an instant fail.

### Answer
bcrypt hashes passwords with a salt and adaptive cost factor (rounds). Slow by design to resist brute force. Compare with bcrypt.compare; never store plaintext or reversible encryption.

### Example
```js
const hash = await bcrypt.hash(password, 12);
const ok = await bcrypt.compare(password, hash);
```

### Follow-up Questions
- bcrypt vs argon2?
- How many rounds?
- Pepper?

### Common Mistakes
- MD5/SHA for passwords
- Same salt for all users manually wrong
- Logging passwords

### Project Connection
Walk through register hashing and login compare in your auth flow.

---

## Question: Sessions vs JWT — when to use which?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Architecture choice for auth — tradeoffs matter.

### Answer
Sessions: server stores session state (memory/Redis), cookie holds session ID, easier revoke, more server state. JWT: stateless, scales horizontally, harder to revoke instantly, client holds token. SPAs often use JWT + refresh; traditional web apps often sessions.

### Example
```js
// session: req.session.userId = user.id
// JWT: Authorization header
```

### Follow-up Questions
- Where to store session store?
- JWT revocation strategies?
- CSRF with cookies?

### Common Mistakes
- JWT in localStorage ignoring XSS risk
- Huge JWT payloads
- Session without secure/httpOnly cookies

### Project Connection
Pick what your project uses and defend it with one tradeoff.

---

## Question: MongoDB and Mongoose basics for Node APIs.

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Many Node jobs use document DBs — can you model and query?

### Answer
MongoDB stores BSON documents. Mongoose adds schemas, validation, middleware, and models. Connect once at startup; use Model.find/create/update with async/await.

### Example
```js
const userSchema = new Schema({ email: { type: String, unique: true } });
const User = model('User', userSchema);
const users = await User.find().limit(10);
```

### Follow-up Questions
- Embedded vs referenced docs?
- Indexes?
- Transactions?

### Common Mistakes
- No schema validation
- N+1 populate queries
- Storing unbounded arrays in one doc

### Project Connection
Describe one Mongoose model from your project and a typical query.

---

## Question: SQL basics when using Node with PostgreSQL/MySQL.

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Relational data and joins still dominate many backends.

### Answer
Use parameterized queries to prevent injection. Tables, primary keys, foreign keys, JOINs. In Node use pg, mysql2, or an ORM (Prisma, Sequelize). Migrations version schema.

### Example
```js
const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
```

### Follow-up Questions
- ORM vs raw SQL?
- Migrations?
- Indexes for performance?

### Common Mistakes
- String concatenation in SQL
- SELECT * in hot paths
- No connection pooling

### Project Connection
Explain a users + orders relationship query you would run from Express.

---

## Question: What is connection pooling and why use it?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Opening a DB connection per request does not scale.

### Answer
A pool maintains reusable DB connections. Requests borrow a connection and return it. Limits max connections, reduces handshake overhead. pg Pool and mongoose connection are common patterns.

### Example
```js
const pool = new Pool({ max: 20, connectionString: process.env.DATABASE_URL });
```

### Follow-up Questions
- Pool size tuning?
- What happens when pool exhausted?
- Serverless + DB?

### Common Mistakes
- New connection every request
- Never closing pool on shutdown
- One global client with no limits

### Project Connection
Mention pool max when discussing deployment under concurrent traffic.

---

## Question: How does the MVC pattern apply to Express apps?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Shows you can structure code beyond a single app.js.

### Answer
Model: data layer (Mongoose/Prisma). View: often JSON for APIs or templates for SSR. Controller: route handlers orchestrating request/response. Routes wire URLs to controllers.

### Example
```
routes/ → controllers/ → services/ → models/
```

### Follow-up Questions
- Service layer?
- Fat models?
- Where does validation live?

### Common Mistakes
- Business logic only in routes
- Models importing Express
- Circular imports between layers

### Project Connection
Draw your folder structure: routes, controllers, models.

---

## Question: How do you validate request data in Express?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Bad input causes bugs, security issues, and 500s.

### Answer
Validate body, query, and params with libraries like Zod, Joi, or express-validator. Fail fast with 400/422 and clear messages. Do not trust client input.

### Example
```js
const schema = z.object({ email: z.string().email() });
const body = schema.parse(req.body);
```

### Follow-up Questions
- Validation vs sanitization?
- Where to validate — middleware?
- OpenAPI?

### Common Mistakes
- Only frontend validation
- Generic 'invalid' errors
- Validating after DB call

### Project Connection
Show validating registration fields before creating a user.

---

## Question: How do you handle file uploads in Express?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Resumes, avatars, and CSV imports come up in product APIs.

### Answer
Use multer or similar for multipart/form-data. Configure storage (disk, memory, S3). Enforce file size, MIME checks, and auth. Never execute uploaded files.

### Example
```js
const upload = multer({ limits: { fileSize: 2 * 1024 * 1024 } });
app.post('/avatar', upload.single('file'), handler);
```

### Follow-up Questions
- Stream to S3?
- Virus scan?
- multipart without multer?

### Common Mistakes
- No size limits
- Trusting client MIME type only
- Serving uploads from same origin without caution

### Project Connection
Describe an avatar upload endpoint with size cap.

---

## Question: What is streaming in Node and when use it?

### Difficulty
🔴 Hard

### Why Interviewers Ask This
Large files and real-time data need streams, not loading all into memory.

### Answer
Streams process data in chunks via Readable, Writable, Duplex, Transform. pipe() connects them. Good for file download/upload, logs, video. Backpressure handled by stream API.

### Example
```js
fs.createReadStream('big.csv').pipe(res);
```

### Follow-up Questions
- Backpressure?
- Stream vs buffer entire file?
- HTTP chunked encoding?

### Common Mistakes
- Reading multi-GB file with readFileSync
- Ignoring stream errors
- No timeout on slow clients

### Project Connection
Mention streaming a CSV export instead of building one giant string.

---

## Question: What is the cluster module in Node?

### Difficulty
🔴 Hard

### Why Interviewers Ask This
Uses all CPU cores for HTTP servers on one machine.

### Answer
cluster forks worker processes sharing a server port. Primary distributes connections; workers run Express. Does not replace horizontal scaling across machines.

### Example
```js
if (cluster.isPrimary) {
  for (let i = 0; i < cpus().length; i++) cluster.fork();
} else {
  require('./server');
}
```

### Follow-up Questions
- cluster vs PM2?
- Sticky sessions?
- When not to use cluster?

### Common Mistakes
- Cluster for CPU-heavy JS on one worker misunderstanding
- No process manager in prod
- Shared in-memory state across workers

### Project Connection
Note PM2 cluster mode as production alternative.

---

## Question: What are child processes in Node?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Offload CPU work or run CLI tools without blocking the event loop.

### Answer
child_process.spawn/exec/fork runs separate processes. fork() has IPC channel. Use for image processing, ffmpeg, or isolated scripts — not for every request without pooling.

### Example
```js
const { spawn } = require('child_process');
const ls = spawn('ls', ['-la']);
```

### Follow-up Questions
- worker_threads vs child_process?
- Security of user input in shell?
- fork IPC?

### Common Mistakes
- exec with unsanitized user input
- Unbounded child spawns
- Ignoring exit codes

### Project Connection
Example: spawning a worker script for PDF generation off the hot path.

---

## Question: What are Buffers in Node?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Binary data — files, crypto, networks — lives in buffers.

### Answer
Buffer is a fixed-length raw binary allocation (Uint8Array under the hood in modern Node). Used with fs, crypto, net. Encoding: utf8, hex, base64.

### Example
```js
const buf = Buffer.from('hello', 'utf8');
console.log(buf.toString('hex'));
```

### Follow-up Questions
- Buffer vs TypedArray?
- Why not strings for binary?
- Alloc unsafe?

### Common Mistakes
- Concatenating buffers in a loop inefficiently
- Assuming JSON for binary uploads
- Ignoring encoding

### Project Connection
Tie to hashing passwords or reading file headers.

---

## Question: How do the path and fs modules help in Node?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
File paths and I/O are everyday backend tasks.

### Answer
path joins segments safely cross-platform (path.join, resolve, basename). fs reads/writes files; prefer fs.promises or fs/promises over sync APIs in servers.

### Example
```js
const filePath = path.join(__dirname, 'data', 'config.json');
const data = await fs.promises.readFile(filePath, 'utf8');
```

### Follow-up Questions
- path.join vs resolve?
- fs streams?
- __dirname in ESM?

### Common Mistakes
- fs.readFileSync in request handler
- Manual string paths with .. bugs
- No error handling for missing files

### Project Connection
Loading a JSON config at startup with path.join.

---

## Question: How do you secure an Express API with Helmet and rate limiting?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Security headers and abuse prevention are expected in production APIs.

### Answer
helmet sets HTTP headers (X-Content-Type-Options, CSP helpers, etc.). express-rate-limit caps requests per IP/window to reduce brute force and DoS. Combine with auth, validation, HTTPS.

### Example
```js
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
```

### Follow-up Questions
- Rate limit behind proxy?
- CSP breaking frontend?
- Distributed rate limits?

### Common Mistakes
- Only helmet, no input validation
- Rate limit too loose on /login
- Trust proxy not set on Render/Heroku

### Project Connection
List headers helmet adds and rate limit on auth routes.

---

## Question: How should you approach logging in a Node API?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
You cannot debug production without structured logs.

### Answer
Use a logger (pino, winston) with levels (info, warn, error). Log request IDs, errors with context, not passwords. In production, ship logs to a aggregator. Morgan complements HTTP access logs.

### Example
```js
logger.info({ userId, route }, 'user login');
```

### Follow-up Questions
- Structured vs console.log?
- PII in logs?
- Correlation IDs?

### Common Mistakes
- console.log only
- Logging tokens/passwords
- No log rotation / volume control

### Project Connection
Add request id middleware and log failed auth attempts.

---

## Question: How do you test Express APIs?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Proves your endpoints behave — supertest is the common tool.

### Answer
Use Jest/Vitest + supertest to hit app without listening on a port. Test status codes, JSON bodies, auth. Mock DB layer for unit tests; integration tests hit real test DB.

### Example
```js
const res = await request(app).get('/api/health').expect(200);
expect(res.body.ok).toBe(true);
```

### Follow-up Questions
- Unit vs integration?
- Test databases?
- Coverage goals?

### Common Mistakes
- Only manual Postman
- Tests sharing production DB
- No auth negative tests

### Project Connection
Describe one supertest case for a protected route.

---

## Question: What are deployment basics for a Node/Express app?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Can you ship code — process managers, env, health checks?

### Answer
Set NODE_ENV=production, use process manager (PM2, Docker, platform). Listen on process.env.PORT. Health endpoint, graceful shutdown on SIGTERM, run migrations separately, monitor errors.

### Example
```js
process.on('SIGTERM', () => server.close(() => process.exit(0)));
```

### Follow-up Questions
- Docker multi-stage?
- Zero-downtime deploy?
- Secrets management?

### Common Mistakes
- node server.js in prod without restart policy
- No health check
- Running as root in container

### Project Connection
Walk through deploying to Render/Railway/Fly with env vars.

---

## Question: How does async programming work in Node?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Non-blocking I/O is why Node exists — callbacks, promises, async/await.

### Answer
I/O operations are async: callbacks (legacy), Promises, async/await (syntactic sugar). await pauses the function, not the thread. Parallelism with Promise.all for independent tasks.

### Example
```js
const [user, posts] = await Promise.all([
  User.findById(id),
  Post.find({ userId: id }),
]);
```

### Follow-up Questions
- Promise.all vs allSettled?
- Sequential await in loops?
- Error handling in async?

### Common Mistakes
- await inside forEach (does not wait)
- Mixing callbacks and promises badly
- Unbounded parallel requests

### Project Connection
Refactor callback-style fs to fs.promises in an example.

---

## Question: What is callback hell and how do you avoid it?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Historical pain point — shows you know modern patterns.

### Answer
Deep nested callbacks become unreadable and error-prone. Fix with modular functions, Promises, async/await, and centralized error handling.

### Example
```js
// avoid: getUser(id, (e,u) => getPosts(u, (e,p) => ...))
const user = await getUser(id);
const posts = await getPosts(user);
```

### Follow-up Questions
- What is pyramid of doom?
- Error-first callbacks?
- util.promisify?

### Common Mistakes
- Ignoring first err argument in callbacks
- Async await without try/catch
- Creating promise anti-patterns

### Project Connection
Show before/after refactoring a nested DB callback chain.

---

## Question: How do you prevent SQL injection in Node?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Critical security — parameterized queries are mandatory.

### Answer
Never interpolate user input into SQL strings. Use placeholders ($1, ?) via pg/mysql2 or ORM. Validate types server-side. Least privilege DB users.

### Example
```js
// BAD: `SELECT * FROM users WHERE email = '${email}'`
await pool.query('SELECT * FROM users WHERE email = $1', [email]);
```

### Follow-up Questions
- ORM always safe?
- Second-order injection?
- NoSQL injection?

### Common Mistakes
- Raw SQL with template strings
- Trusting ORM without understanding
- DB user with superuser perms

### Project Connection
Audit one query in your project for parameterization.

---

## Question: How can XSS affect the backend and how do you mitigate?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
XSS is often taught for frontend — backends store and reflect data too.

### Answer
Stored XSS: malicious scripts saved via API and rendered in a client. Backend should validate/sanitize stored HTML, set Content-Type correctly, encode output in templates, use CSP headers. APIs returning user HTML are risky.

### Example
```js
// sanitize before save; JSON APIs usually escape on render in React
```

### Follow-up Questions
- sanitize-html?
- JSON is not auto-safe in innerHTML
- Markdown rendering?

### Common Mistakes
- Storing raw script tags from users
- text/html responses with user content
- No CSP

### Project Connection
If your API returns bios rendered on a site, explain sanitization strategy.

---

## Question: How do you implement pagination in APIs?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Listing endpoints without pagination break at scale.

### Answer
Offset/limit (page, pageSize) simple but slow on large offsets. Cursor-based (after=id) scales better for feeds. Return metadata: total or nextCursor, items array.

### Example
```js
// GET /users?page=2&limit=20
const users = await User.find().skip((page-1)*limit).limit(limit);
```

### Follow-up Questions
- Keyset pagination?
- Default limits?
- Sorting stability?

### Common Mistakes
- No max limit (limit=999999)
- Inconsistent sort keys
- Offset on million-row tables

### Project Connection
Add page/limit query params to your list users endpoint.

---

## Question: How do you version a REST API?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Breaking changes without versioning break mobile apps and partners.

### Answer
Version via URL (/api/v1/users), header (Accept-Version), or query. URL is clearest for many teams. Deprecate old versions with timeline and docs.

### Example
```js
app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router);
```

### Follow-up Questions
- Semantic versioning for APIs?
- Backward compatible changes?
- GraphQL versioning?

### Common Mistakes
- Breaking changes without bump
- Two versions diverging same logic duplicated forever
- No deprecation headers

### Project Connection
If you only have v1, explain how you'd add v2 for a renamed field.

---

## Question: What is process.env.NODE_ENV used for?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Libraries change behavior based on environment — you should too.

### Answer
NODE_ENV commonly 'development', 'test', or 'production'. Express enables less verbose errors in production; some libs enable caching. Set explicitly in deployment — not a security boundary alone.

### Example
```js
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}
```

### Follow-up Questions
- Does webpack set it?
- production vs development errors?
- Other env vars?

### Common Mistakes
- Relying on NODE_ENV for auth
- Undefined NODE_ENV in prod
- Different behavior not documented

### Project Connection
Toggle detailed error stacks off in production in your error handler.

---

## Question: What is the difference between libuv thread pool and worker threads?

### Difficulty
🔴 Hard

### Why Interviewers Ask This
Advanced but shows deep Node knowledge when discussing performance.

### Answer
libuv thread pool (default 4) runs some blocking ops: fs, crypto, dns. Worker threads run JS in parallel for CPU tasks. Event loop stays on main thread per process.

### Example
```js
// UV_THREADPOOL_SIZE=8 for more pool threads
```

### Follow-up Questions
- When does DNS use pool?
- crypto.pbkdf2 async?
- worker_threads use case?

### Common Mistakes
- Confusing with cluster workers
- CPU work on main thread
- Huge thread pool without reason

### Project Connection
Mention bcrypt async using thread pool under the hood.

---

