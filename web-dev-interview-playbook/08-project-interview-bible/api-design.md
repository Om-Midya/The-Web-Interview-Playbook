# Explaining API Design in Your Project

How to talk about your backend endpoints, patterns, and error handling.

---

## API Overview Script (30 seconds)

> "The backend is a REST API built with Express. It has **[N] route groups**: auth, users, posts, and comments. All routes are prefixed with `/api/v1`. Protected routes require a JWT in the Authorization header. Responses follow a consistent JSON shape with `data` for success and `error` for failures."

---

## Document Your Endpoints

Create a table like this for YOUR project:

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/auth/register` | No | Create account |
| POST | `/api/v1/auth/login` | No | Login, return JWT |
| GET | `/api/v1/auth/me` | Yes | Current user profile |
| GET | `/api/v1/posts` | No | List posts (paginated) |
| POST | `/api/v1/posts` | Yes | Create post |
| GET | `/api/v1/posts/:id` | No | Single post with comments |
| PATCH | `/api/v1/posts/:id` | Yes | Update own post |
| DELETE | `/api/v1/posts/:id` | Yes | Delete own post |
| POST | `/api/v1/posts/:id/comments` | Yes | Add comment |
| POST | `/api/v1/posts/:id/like` | Yes | Like post |

**Interview tip:** Know your endpoints without looking. Pick 3–4 to explain in detail.

---

## Request/Response Examples

### Create Post

```http
POST /api/v1/posts
Authorization: Bearer eyJhbG...
Content-Type: application/json

{
  "title": "My First Post",
  "body": "Hello world!",
  "published": true
}
```

```json
// 201 Created
{
  "data": {
    "id": "a1b2c3d4-...",
    "title": "My First Post",
    "body": "Hello world!",
    "published": true,
    "author": { "id": "...", "username": "priya" },
    "createdAt": "2025-06-30T10:00:00Z"
  }
}
```

### Validation Error

```json
// 400 Bad Request
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      { "field": "title", "message": "Title is required" },
      { "field": "title", "message": "Title must be under 200 characters" }
    ]
  }
}
```

### Pagination

```http
GET /api/v1/posts?page=2&limit=10
```

```json
{
  "data": [...],
  "meta": {
    "page": 2,
    "limit": 10,
    "total": 47,
    "totalPages": 5
  }
}
```

---

## Middleware Stack (Explain This)

```
Request
  → cors()           // allow frontend domain
  → express.json()   // parse JSON body
  → morgan('dev')    // request logging
  → routes
      → authenticate // JWT verification (protected routes)
      → validate     // input validation (Joi/Zod)
      → controller   // business logic
  → errorHandler     // catch-all, consistent error JSON
```

**Interview line:** *"Every request passes through CORS and JSON parsing globally. Protected routes add auth middleware. Validation runs before the controller. A centralized error handler catches thrown errors and returns consistent JSON — never a raw stack trace to the client."*

---

## Validation

```javascript
// Using Zod
const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  body: z.string().min(1),
  published: z.boolean().optional(),
});

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          details: result.error.issues.map(i => ({
            field: i.path.join('.'),
            message: i.message,
          })),
        },
      });
    }
    req.body = result.data;
    next();
  };
}
```

**What to say:** "I validate all inputs with Zod before they reach the controller. Invalid requests return 400 with field-level error messages — the frontend can display them next to form fields."

---

## Error Handling

```javascript
// Centralized error handler
function errorHandler(err, req, res, next) {
  console.error(err); // log full error server-side

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: err.message } });
  }
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid token' } });
  }
  if (err.code === 'P2002') { // Prisma unique constraint
    return res.status(409).json({ error: { code: 'DUPLICATE', message: 'Email already exists' } });
  }

  res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' } });
}
```

---

## Authorization Patterns

| Rule | Implementation |
|------|----------------|
| Only author can edit/delete post | `if (post.userId !== req.user.id) return 403` |
| Admin can delete any post | `if (req.user.role !== 'admin' && post.userId !== req.user.id) return 403` |
| Users can only see own orders | `WHERE user_id = req.user.id` in query |

**Critical:** Authorization happens on the **server**, not just hiding buttons on the frontend.

---

## API Design Decisions to Justify

| Decision | Good answer |
|----------|-------------|
| REST vs GraphQL | "REST — simple CRUD, team familiar, no complex nested queries needed" |
| `/api/v1` prefix | "Versioning — can ship v2 without breaking existing clients" |
| Pagination style | "Offset for admin tables (< 1000 rows). Would use cursor for infinite scroll feed." |
| Nested routes | "`/posts/:id/comments` — comments belong to a post, clear hierarchy" |
| Status codes | "201 for create, 204 for delete, 409 for duplicate email" |

---

## Common Interview Questions

**Q: How does your frontend know if a request failed?**
A: "Axios interceptor checks response status. 401 → redirect to login. 400 → show validation errors. 500 → show generic error toast. React Query handles loading/error states per query."

**Q: How would you add rate limiting?**
A: "express-rate-limit middleware: 100 req/min general, 5 req/min on login. At scale, Redis-backed limiter shared across server instances."

**Q: How do you handle file uploads?**
A: "Client requests presigned S3 URL from `POST /api/uploads/presign`. Uploads directly to S3. Then `POST /api/posts` includes the S3 URL. API never handles file bytes — saves bandwidth."

**Q: REST vs GraphQL for your project?**
A: "REST fits — resource-oriented, cacheable GETs, simple client. GraphQL shines when clients need flexible nested queries. My app's data needs are predictable."

---

## Checklist

- [ ] Can list your main endpoints from memory
- [ ] Can show one request/response example
- [ ] Can explain middleware chain
- [ ] Can describe validation and error handling approach
- [ ] Can explain one authorization rule

---

**Next:** [deployment.md](./deployment.md) | [performance.md](./performance.md)
