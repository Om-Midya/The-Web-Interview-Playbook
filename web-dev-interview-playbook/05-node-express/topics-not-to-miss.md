# Node.js & Express: Topics Not to Miss

Check off each topic before your interview.

## Node.js Fundamentals

- [ ] What Node.js is (JS runtime on V8, not a framework)
- [ ] Event-driven, non-blocking I/O
- [ ] `npm` / `package.json` / `node_modules`
- [ ] CommonJS (`require`) vs ES modules (`import`)
- [ ] `process.env` and environment variables
- [ ] `fs`, `path`, `http` modules (awareness)
- [ ] `__dirname` / `import.meta.url`

## Express Basics

- [ ] Creating an Express app
- [ ] Routing: `app.get`, `post`, `put`, `patch`, `delete`
- [ ] Route parameters (`:id`) and query strings (`?page=1`)
- [ ] `req.body`, `req.params`, `req.query`
- [ ] Middleware concept and execution order
- [ ] `express.json()` for parsing JSON bodies
- [ ] `express.static` for serving files

## Middleware

- [ ] Application-level vs router-level vs error middleware
- [ ] `next()` and `next(err)`
- [ ] Custom middleware (logging, auth check)
- [ ] Built-in vs third-party middleware

## REST API Design

- [ ] REST principles (resources, HTTP verbs, stateless)
- [ ] Status codes: 200, 201, 400, 401, 403, 404, 500
- [ ] Consistent URL naming (`/api/users`, not `/getUsers`)
- [ ] Request/response JSON structure
- [ ] Pagination, filtering, sorting query params

## Database

- [ ] MongoDB + Mongoose OR SQL + Prisma/Sequelize (know one well)
- [ ] CRUD operations from API
- [ ] Schema/model definition
- [ ] Relationships (one-to-many awareness)
- [ ] Connection handling

## Authentication

- [ ] Password hashing (bcrypt) — never store plain text
- [ ] JWT structure (header, payload, signature)
- [ ] Session vs token auth tradeoffs
- [ ] Protected routes middleware
- [ ] httpOnly cookies vs localStorage for tokens

## Security

- [ ] CORS — what it is and basic setup
- [ ] Input validation (express-validator, Zod)
- [ ] Rate limiting awareness
- [ ] Helmet.js for security headers
- [ ] SQL/NoSQL injection prevention
- [ ] `.env` for secrets — never commit

## Error Handling

- [ ] try/catch in async route handlers
- [ ] Centralized error middleware
- [ ] Consistent error response format
- [ ] `express-async-errors` or wrapper pattern

## Async Patterns

- [ ] Callbacks → Promises → async/await in routes
- [ ] Handling rejected promises in Express 4 vs 5

## Deployment Awareness

- [ ] `PORT` from environment
- [ ] Process managers (PM2 awareness)
- [ ] Logging in production

---

**Self-test:** Can you explain your auth flow end-to-end, design CRUD routes for a resource, and list 5 status codes with examples?
