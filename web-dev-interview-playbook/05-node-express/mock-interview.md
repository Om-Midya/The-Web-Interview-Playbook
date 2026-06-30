# Node.js & Express: Mock Interview (45 Minutes)

---

## Section 1: Warm-up (5 min)

1. "Describe your backend project."
2. "Why Node.js for this project?"
3. "What database did you use and why?"

---

## Section 2: Node & Express Basics (10 min)

1. "What is Node.js?"
2. "What is middleware in Express?"
3. "Difference between `req.params`, `req.query`, `req.body`?"
4. "How does the middleware chain work?"

---

## Section 3: API Design (8 min)

1. "Design REST routes for a todo resource."
2. "Which status code for: created, not found, validation error, unauthorized?"
3. "How implement pagination?"

---

## Section 4: Live Coding (12 min)

**Pick ONE:**

### Option A: Auth middleware

> "Write middleware that checks JWT in Authorization header."

### Option B: CRUD route

> "Write POST /api/posts that validates title and creates a post."

### Option C: Error handler

> "Write centralized error handling middleware."

---

## Section 5: Auth & Security (7 min)

1. "How store passwords?"
2. "JWT vs sessions?"
3. "What is CORS?"
4. "How prevent brute force login?"

---

## Section 6: Project (3 min)

1. "Walk through your auth flow end-to-end."
2. "One security improvement you'd add."

---

## Rubric

| Area | 1 | 3 | 5 |
|------|---|---|---|
| REST design | Verbs in URLs | Correct routes | Pagination, consistent JSON |
| Auth | Plain passwords | JWT basics | bcrypt, middleware, roles |
| Errors | No handling | try/catch | Centralized, correct codes |
| Security | No awareness | CORS + validation | Helmet, rate limit, httpOnly |

**Homework:** Implement one route from `api-design.md` from scratch in 15 minutes.
