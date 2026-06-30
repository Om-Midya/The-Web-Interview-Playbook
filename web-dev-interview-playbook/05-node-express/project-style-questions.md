# Node.js & Express: Project-Style Questions

15 scenario questions for backend interviews.

---

## 1. Design CRUD API for Blog Posts

**Q:** Design routes for posts (title, content, author).

**A:**
```
GET    /api/posts          — list (paginated)
GET    /api/posts/:id      — single post
POST   /api/posts          — create (auth required)
PATCH  /api/posts/:id      — update (author or admin)
DELETE /api/posts/:id      — delete (author or admin)
```
Include auth middleware on write operations. Return 404 if not found, 403 if not owner.

---

## 2. User Registration Flow

**Q:** Walk through register endpoint.

**A:** Validate email/password → check duplicate → hash password with bcrypt → save user → optionally auto-login with JWT → return 201 with user (no password field).

---

## 3. Login Flow

**Q:** Walk through login.

**A:** Find user by email → compare password with bcrypt → if match, sign JWT → return token + safe user object. Generic error message ("Invalid credentials") to prevent email enumeration.

---

## 4. Protected Route Middleware

**Q:** How ensure only logged-in users access `/api/profile`?

**A:** Auth middleware reads `Authorization: Bearer <token>`, verifies JWT, attaches `req.user`, calls `next()`. On failure, 401.

---

## 5. Role-Based Access

**Q:** Only admins can delete any user.

**A:** Chain middleware: `authMiddleware` → `requireRole('admin')` → handler. Return 403 if role insufficient.

---

## 6. File Upload

**Q:** User uploads profile picture.

**A:** Use `multer` middleware. Validate file type (image/jpeg, png) and size limit. Store in cloud (S3/Cloudinary) or local `uploads/` with unique filename. Save URL in user document. Never execute uploaded files.

---

## 7. Error Handling Strategy

**Q:** How handle errors across the app?

**A:** try/catch or asyncHandler in routes → `next(err)` → centralized error middleware. Operational errors (404, 400) vs programming errors (500). Log full error server-side, send safe message to client.

---

## 8. Database Connection

**Q:** How connect MongoDB to Express?

**A:**
```javascript
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('DB connected'))
  .catch(err => { console.error(err); process.exit(1); });
```
Connect once at startup. Handle connection errors. Use models for queries.

---

## 9. One-to-Many: User Has Many Posts

**Q:** Model relationship and query posts by user.

**A:** Post schema has `author: { type: ObjectId, ref: 'User' }`. Query: `Post.find({ author: userId }).populate('author', 'name email')`.

---

## 10. Search Endpoint

**Q:** `GET /api/products?q=phone&category=electronics`

**A:** Build dynamic filter from query params. Validate/sanitize input. Use indexed fields for performance. Return paginated results.

---

## 11. Rate Limiting Login

**Q:** Prevent brute force on `/api/login`.

**A:** `express-rate-limit` — 5 attempts per 15 minutes per IP. Consider exponential backoff or CAPTCHA after failures.

---

## 12. CORS Issue Debugging

**Q:** Frontend on `localhost:3000`, API on `localhost:5000` — fetch fails.

**A:** Browser CORS block. Configure `cors({ origin: 'http://localhost:3000', credentials: true })`. If using cookies, frontend needs `credentials: 'include'`.

---

## 13. Environment Config

**Q:** Different config for dev vs production.

**A:** `.env.development`, `.env.production` or single `.env` per environment. `NODE_ENV=production` toggles logging, cookie secure flag, error detail level. Never commit `.env`.

---

## 14. Logging Requests

**Q:** How log API requests in dev and prod?

**A:** `morgan('dev')` in development. Production: structured JSON logs (winston/pino), log method, URL, status, response time. Don't log passwords or tokens.

---

## 15. Deploy Checklist

**Q:** What before deploying Express API?

**A:**
- `PORT` from env
- `NODE_ENV=production`
- Secrets in env vars
- Helmet, CORS, rate limiting
- Error handler hides stack traces
- Database connection string secure
- Health check endpoint `GET /health`

---

## Practice Tip

For each question, draw a request flow: Client → Middleware → Route → DB → Response.
