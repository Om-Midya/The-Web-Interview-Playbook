# Backend System Design

How to discuss APIs, authentication, databases, and caching in interviews — practical patterns for student fullstack projects.

---

## API Design

### REST Conventions (What Interviewers Expect)

| Method | Purpose | Example | Idempotent? |
|--------|---------|---------|-------------|
| GET | Read resource(s) | `GET /api/v1/posts` | Yes |
| POST | Create resource | `POST /api/v1/posts` | No |
| PUT | Replace entire resource | `PUT /api/v1/posts/42` | Yes |
| PATCH | Partial update | `PATCH /api/v1/posts/42` | Yes |
| DELETE | Remove resource | `DELETE /api/v1/posts/42` | Yes |

### URL Design Rules

**Do:**
```
GET    /api/v1/users/123/posts          # posts by user 123
POST   /api/v1/posts                    # create post
GET    /api/v1/posts/456/comments       # comments on post 456
```

**Don't:**
```
GET    /api/getUserPosts?userId=123     # verb in URL
POST   /api/createPost                  # verb in URL
GET    /api/post/delete/456             # wrong method semantics
```

### Response Format (Consistent)

```json
// Success
{
  "data": { "id": 456, "title": "Hello" },
  "meta": { "page": 1, "total": 100 }
}

// Error
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Title is required",
    "details": [{ "field": "title", "message": "must not be empty" }]
  }
}
```

### HTTP Status Codes (Use Correctly)

| Code | When |
|------|------|
| 200 | Success (GET, PATCH, PUT) |
| 201 | Created (POST) |
| 204 | Success, no body (DELETE) |
| 400 | Bad request / validation error |
| 401 | Not authenticated |
| 403 | Authenticated but not authorized |
| 404 | Resource not found |
| 409 | Conflict (duplicate email) |
| 429 | Rate limited |
| 500 | Server error (log it, don't expose internals) |

### Pagination

**Offset (simple, OK for small data):**
```
GET /api/v1/posts?page=2&limit=20
```

**Cursor (better for feeds, large tables):**
```
GET /api/v1/posts?cursor=eyJpZCI6MTIzfQ&limit=20

Response: { "data": [...], "nextCursor": "eyJpZCI6MTQzfQ" }
```

### Versioning

- URL path: `/api/v1/posts` (most common, clearest)
- Header: `Accept: application/vnd.myapp.v1+json` (less common for students)

### Rate Limiting

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1712345678
```

Implement with Redis counter per IP or API key. Return `429 Too Many Requests` with `Retry-After` header.

**Interview line:** *"RESTful nouns, correct HTTP verbs, consistent error shape, cursor pagination on feeds, and rate limits on auth endpoints."*

---

## Authentication Flow

### Session-Based Auth (Good Default for Web Apps)

```
1. POST /api/login { email, password }
2. Server validates → bcrypt.compare(password, hash)
3. Server creates session in Redis: sessionId → { userId, role }
4. Server sets HTTP-only, Secure, SameSite cookie: sessionId=abc123
5. Subsequent requests: browser sends cookie automatically
6. Auth middleware: read cookie → lookup Redis → attach req.user
7. POST /api/logout → delete session from Redis → clear cookie
```

**Why HTTP-only cookie?** JavaScript can't read it — protects against XSS stealing tokens.

### JWT-Based Auth (Common for SPAs + Mobile)

```
1. POST /api/login → returns { accessToken, refreshToken }
2. Client stores accessToken in memory (not localStorage if avoidable)
3. Client sends: Authorization: Bearer <accessToken>
4. Server verifies signature + expiry on each request
5. Access token expires (15 min) → POST /api/refresh with refreshToken
6. Refresh token in HTTP-only cookie or secure storage
```

| | Session Cookie | JWT |
|---|----------------|-----|
| **Revocation** | Easy — delete session | Hard — need blocklist or short expiry |
| **Storage** | Server (Redis) | Client holds token |
| **Scaling** | Needs shared session store | Stateless verification |
| **XSS risk** | Low (HTTP-only cookie) | Higher if in localStorage |

### OAuth / Social Login (Google, GitHub)

```
1. User clicks "Login with Google"
2. Redirect to Google consent screen
3. Google redirects back with authorization code
4. Your server exchanges code for tokens (server-side, never expose client secret)
5. Your server finds or creates user, issues your own session/JWT
```

**Don't:** Send Google access token to your frontend for API auth long-term.

### Password Security Checklist

- [ ] Hash with **bcrypt** or **argon2** (never MD5/SHA alone)
- [ ] Salt is built into bcrypt (don't roll your own)
- [ ] Minimum password rules (length ≥ 8)
- [ ] Rate limit login attempts (prevent brute force)
- [ ] HTTPS only in production

### Authorization (AuthN vs AuthZ)

- **Authentication (AuthN):** Who are you?
- **Authorization (AuthZ):** What can you do?

```javascript
// Middleware chain
app.get('/api/posts/:id', authenticate, authorize('admin'), deletePost);

function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}
```

**Interview line:** *"I'd use HTTP-only session cookies with Redis for a web app. bcrypt for passwords, rate-limited login, middleware chain for role checks on admin routes."*

---

## Database Choices

### SQL vs NoSQL (Student Decision Guide)

| Factor | Choose SQL (PostgreSQL) | Choose NoSQL (MongoDB) |
|--------|-------------------------|------------------------|
| Relationships | Many joins, foreign keys | Flexible/nested documents |
| Schema | Stable, well-defined | Evolving, varied shapes |
| Transactions | Critical (payments) | Less critical |
| Team familiarity | Most students know SQL | Good for JS-native projects |
| Example use | E-commerce, bookings | CMS, activity logs, prototypes |

**Interview default:** *"I'd start with PostgreSQL unless there's a strong reason not to."*

### Schema Design Basics

```sql
-- Users and posts (1-to-many)
CREATE TABLE users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      VARCHAR(255) UNIQUE NOT NULL,
  password   VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE posts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title      VARCHAR(200) NOT NULL,
  body       TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for "get posts by user, newest first"
CREATE INDEX idx_posts_user_created ON posts(user_id, created_at DESC);
```

### Indexing Strategy

**Index columns you:**
- Filter by (`WHERE user_id = ?`)
- Join on (`JOIN posts ON users.id = posts.user_id`)
- Sort by (`ORDER BY created_at DESC`)

**Don't index everything** — each index slows writes.

### Normalization vs Denormalization

| | Normalized | Denormalized |
|---|------------|--------------|
| **Data** | No duplication; separate tables | Duplicate data for faster reads |
| **Writes** | Update one place | Update multiple places |
| **Reads** | May need joins | Faster single-table reads |
| **When** | Default choice | Read-heavy, rare updates (like counts) |

**Example:** Store `author_name` on each post (denormalized) to avoid joining users table on every feed query. Update if user renames (or accept slight staleness).

### Scaling Databases

1. **Indexes + query optimization** (do this first)
2. **Read replicas** — writes to primary, reads from replicas
3. **Caching** (Redis) — hot data
4. **Sharding** — split data across DBs (last resort, complex)

**Interview line:** *"PostgreSQL with indexes on foreign keys and sort columns. Read replicas if read load grows. Redis cache for the home feed."*

---

## Caching Layer

### Where Redis Fits

```
Client → API Server → Redis (cache hit? return) → PostgreSQL (cache miss)
```

### Cache-Aside Pattern (Most Common)

```javascript
async function getUserProfile(userId) {
  const cacheKey = `user:${userId}:profile`;
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const user = await db.query('SELECT id, name, avatar FROM users WHERE id = $1', [userId]);
  await redis.setex(cacheKey, 300, JSON.stringify(user)); // 5 min TTL
  return user;
}

async function updateUserProfile(userId, data) {
  await db.query('UPDATE users SET name = $1 WHERE id = $2', [data.name, userId]);
  await redis.del(`user:${userId}:profile`); // invalidate cache
}
```

### What to Cache

| Data | TTL | Invalidate on |
|------|-----|---------------|
| User profile | 5 min | Profile update |
| Product catalog | 15 min | Admin edit |
| Feed page 1 | 30–60 sec | New post (or accept staleness) |
| Session data | Session lifetime | Logout |

### What NOT to Cache

- Sensitive data without encryption
- Rapidly changing data with strong consistency needs
- Large objects that exceed Redis memory

### Cache Problems to Mention

| Problem | Solution |
|---------|----------|
| **Cache stampede** | Lock during rebuild; stale-while-revalidate |
| **Stale data** | TTL + explicit invalidation on writes |
| **Cold start** | Warm cache on deploy; lazy populate |

**Interview line:** *"Cache-aside with Redis. TTL based on how stale the data can be. Always invalidate on write for user-owned data."*

---

## Typical Backend Architecture (Say This)

```
                    ┌──────────────┐
                    │   Clients    │
                    │ (Web/Mobile) │
                    └──────┬───────┘
                           │ HTTPS
                    ┌──────▼───────┐
                    │ Load Balancer│
                    └──────┬───────┘
              ┌────────────┼────────────┐
              ▼            ▼            ▼
         [API Server] [API Server] [API Server]  (stateless)
              │            │            │
              └────────────┼────────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
         [Redis Cache] [PostgreSQL] [S3 / Object Storage]
                           │
                      [Read Replica]
```

---

## Backend Design Checklist

- [ ] RESTful API with correct status codes
- [ ] Auth flow (session or JWT) with security details
- [ ] Database choice justified with schema sketch
- [ ] Indexes mentioned for hot queries
- [ ] Caching layer with TTL and invalidation
- [ ] Rate limiting on sensitive endpoints
- [ ] Error handling and logging (no password in logs)

---

**Next:** [design-a-url-shortener.md](./design-a-url-shortener.md) (easiest full design walkthrough)
