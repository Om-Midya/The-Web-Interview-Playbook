# Node.js & Express: API Design

How to design REST APIs that interviewers recognize as professional.

---

## REST Principles

1. **Resources** are nouns (`/users`, `/posts`), not verbs (`/getUsers`)
2. **HTTP verbs** express actions
3. **Stateless** — each request has all info needed (auth in header/token)
4. **Consistent** JSON responses

---

## HTTP Verbs & CRUD

| Verb | Action | Example | Success Code |
|------|--------|---------|--------------|
| GET | Read | `GET /api/users` | 200 |
| GET | Read one | `GET /api/users/:id` | 200 / 404 |
| POST | Create | `POST /api/users` | 201 |
| PUT | Replace | `PUT /api/users/:id` | 200 |
| PATCH | Partial update | `PATCH /api/users/:id` | 200 |
| DELETE | Remove | `DELETE /api/users/:id` | 200 or 204 |

---

## URL Naming

```
✅ GET    /api/users
✅ GET    /api/users/42
✅ POST   /api/users
✅ GET    /api/users/42/posts        # nested resource
✅ GET    /api/posts?authorId=42     # filter via query

❌ GET    /api/getUsers
❌ POST   /api/createUser
❌ GET    /api/user/delete/42
```

**Rules:**
- Plural nouns for collections
- Lowercase, kebab-case for multi-word (`/order-items`)
- Nesting max 2 levels deep (`/users/:id/posts` OK; deeper → flatten)

---

## Status Codes (Must Know)

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Not logged in / bad token |
| 403 | Forbidden | Logged in but no permission |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate email, etc. |
| 422 | Unprocessable | Validation failed (also use 400) |
| 500 | Server Error | Unhandled exception |

---

## Request/Response Format

### Consistent Success Response

```json
{
  "data": { "id": 1, "name": "Alice" }
}
```

Or for lists:

```json
{
  "data": [...],
  "meta": { "page": 1, "total": 100, "pageSize": 20 }
}
```

### Consistent Error Response

```json
{
  "error": {
    "message": "Email already exists",
    "code": "EMAIL_TAKEN"
  }
}
```

Don't leak stack traces in production.

---

## Express CRUD Example

```javascript
const express = require('express');
const router = express.Router();

// List
router.get('/', async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json({ data: users });
  } catch (err) { next(err); }
});

// Get one
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: { message: 'User not found' } });
    res.json({ data: user });
  } catch (err) { next(err); }
});

// Create
router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ data: user });
  } catch (err) { next(err); }
});

// Update
router.patch('/:id', async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ error: { message: 'User not found' } });
    res.json({ data: user });
  } catch (err) { next(err); }
});

// Delete
router.delete('/:id', async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: { message: 'User not found' } });
    res.status(204).send();
  } catch (err) { next(err); }
});

module.exports = router;
```

---

## Pagination

```
GET /api/posts?page=2&limit=20&sort=-createdAt
```

```javascript
const page = Math.max(1, parseInt(req.query.page) || 1);
const limit = Math.min(100, parseInt(req.query.limit) || 20);
const skip = (page - 1) * limit;

const [posts, total] = await Promise.all([
  Post.find().sort('-createdAt').skip(skip).limit(limit),
  Post.countDocuments()
]);

res.json({
  data: posts,
  meta: { page, limit, total, totalPages: Math.ceil(total / limit) }
});
```

---

## Filtering & Search

```
GET /api/products?category=shoes&minPrice=50&q=sneaker
```

```javascript
const filter = {};
if (req.query.category) filter.category = req.query.category;
if (req.query.minPrice) filter.price = { $gte: Number(req.query.minPrice) };
if (req.query.q) filter.name = { $regex: req.query.q, $options: 'i' };
```

---

## Versioning

```
/api/v1/users
/api/v2/users
```

Or header: `Accept: application/vnd.myapi.v1+json`

For student projects, `/api/` prefix is enough.

---

## Middleware Stack Order

```javascript
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json({ limit: '10kb' }));
app.use(morgan('dev'));

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ error: { message: 'Route not found' } });
});

// Error handler (4 args)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: { message: err.message || 'Internal server error' }
  });
});
```

---

## Async Error Handling

```javascript
// Wrapper to avoid try/catch in every route
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.get('/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: { message: 'Not found' } });
  res.json({ data: user });
}));
```

---

## API Design Checklist

- [ ] Nouns in URLs, verbs in HTTP methods
- [ ] Correct status codes
- [ ] Consistent JSON shape
- [ ] Passwords never in responses
- [ ] Validation on all inputs
- [ ] Pagination on list endpoints
- [ ] Centralized error handling
- [ ] Auth on protected routes
