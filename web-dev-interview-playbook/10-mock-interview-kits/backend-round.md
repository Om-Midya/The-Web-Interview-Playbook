# Backend (Node/Express) Mock Interview (45 Minutes)

> **Role:** Backend/API round — typical for Node.js roles, full-stack rounds (backend half), and startup technical screens.

**Interviewer:** Focus on API design, security instincts, and error handling — not algorithm puzzles.  
**Candidate:** Know one API you've built end-to-end. Be ready to sketch request/response flows.

---

## Pre-Interview Setup

- [ ] Timer, rubric, paper or whiteboard for API design
- [ ] Candidate: one project with REST API, auth (if any), and database
- [ ] Interviewer: prepare a "design this endpoint" prompt (Section 4)

---

## Section 1: Warm-up (5 min)

| Time | Question |
|------|----------|
| 0:00 | "Tell me about a backend or API you've built." |
| 2:00 | "What stack did you use? Why that database?" |
| 3:30 | "What was your role — did you design the API or follow a spec?" |
| 4:30 | "What's the most complex endpoint you implemented?" |

**Follow-up:** "What would you improve if you had another week?"

---

## Section 2: Node.js & Express Fundamentals (10 min)

| Time | Question |
|------|----------|
| 5:00 | "What is Node.js? How is it different from browser JavaScript?" |
| 6:00 | "What is the event loop in Node? How does it handle I/O?" |
| 7:00 | "Explain middleware in Express. Give an example." |
| 8:00 | **Follow-up:** "In what order does middleware run?" |
| 9:00 | "How do you structure an Express app for maintainability?" |
| 10:00 | "What is `req`, `res`, and `next` in Express?" |
| 11:00 | "How do you handle errors in Express? Sync vs async errors?" |
| 12:00 | **Follow-up:** "What happens if you don't catch a rejected Promise in a route?" |
| 13:00 | "What is `process.env`? How do you manage environment variables?" |
| 14:00 | "Difference between `require` and `import` in Node?" |

---

## Section 3: REST APIs & HTTP (8 min)

| Time | Question |
|------|----------|
| 15:00 | "What makes an API RESTful? What are the main HTTP methods?" |
| 16:00 | "When do you use POST vs PUT vs PATCH?" |
| 17:00 | "What HTTP status codes would you return for: success create, not found, validation error, unauthorized?" |
| 18:00 | **Follow-up:** "What's the difference between 401 and 403?" |
| 19:00 | "How do you version an API?" |
| 20:00 | "What is idempotency? Which methods are idempotent?" |
| 21:00 | "How do you validate request body data?" |
| 22:00 | "What is CORS? Why does the browser block cross-origin requests?" |

**Quick scenario:**

> "Frontend at `localhost:3000` calls API at `localhost:5000` and gets CORS error. How do you fix it?"

**Expected:** `cors` middleware or manual headers; explain it's browser security, not server unreachable.

---

## Section 4: Live Task — Design an Endpoint (10 min)

**Interviewer reads aloud:**

> "Design a REST API for a **library book checkout system**:
> - Users can borrow and return books
> - A user cannot borrow more than 3 books at a time
> - Books have title, author, and availability status
>
> List your endpoints (method + path), request/response shape for borrow, and how you'd enforce the 3-book limit."

**Timing:**

| Time | Phase |
|------|-------|
| 23:00–25:00 | Candidate asks clarifying questions |
| 25:00–31:00 | Candidate designs endpoints + logic |
| 31:00–33:00 | Follow-ups |

**Clarifying questions candidate should ask:**

- Are users pre-registered or do we need signup?
- What happens if two users try to borrow the last copy?
- Do we need due dates / fines? (Interviewer: "Not for now.")

**Reference endpoints (interviewer only):**

```
POST   /api/books              — add book (admin)
GET    /api/books              — list available
POST   /api/users/:id/borrow   — body: { bookId }
POST   /api/users/:id/return   — body: { bookId }
GET    /api/users/:id/loans    — current borrowed books
```

**Follow-ups:**

1. "How do you prevent race condition on the last book?" (transaction, optimistic lock, DB constraint)
2. "How would you paginate `GET /api/books`?"
3. "Write the pseudo-code for the borrow handler."
4. "What indexes would you add in the database?"

---

## Section 5: Authentication & Security (7 min)

| Time | Question |
|------|----------|
| 33:00 | "How does JWT authentication work? Where is the token stored?" |
| 34:30 | **Follow-up:** "What are risks of storing JWT in localStorage?" |
| 35:30 | "What is bcrypt used for? Why not store plain passwords?" |
| 36:30 | "What is SQL/NoSQL injection? How do you prevent it?" |
| 37:30 | "What is rate limiting? When would you add it?" |
| 38:30 | "What is helmet.js? What headers does it help with?" |

**Scenario:**

> "A user reports they can see another user's orders by changing the ID in the URL. What's wrong?"

**Expected:** Missing authorization check — authentication ≠ authorization.

---

## Section 6: Database (3 min)

**Pick 2:**

| # | Question |
|---|----------|
| 1 | "SQL vs MongoDB — when would you pick each?" |
| 2 | "What is a database schema / model?" |
| 3 | "What is an ORM? (Mongoose, Prisma, Sequelize)" |
| 4 | "What is a database transaction? Give an example." |
| 5 | "How do you handle DB connection in a Node app?" |

---

## Section 7: Project Wrap-up (2 min)

| Time | Question |
|------|----------|
| 41:00 | "Walk me through one API request from client click to database and back." |
| 43:00 | "What logging or monitoring did you add, or what would you add?" |
| 44:30 | Candidate questions + close |

---

## Post-Interview Debrief

### Homework by gap

| Gap | Resource |
|-----|----------|
| HTTP/status codes | `05-node-express/interview-questions.md` |
| Auth | Implement refresh token flow on paper |
| API design | Redesign one project endpoint RESTfully |
| Error handling | Add global error middleware to a project |
| Security | Read OWASP Top 3 for APIs |

### Retry task

Design API for **event ticket booking** with seat locking — 10 min solo.

---

## Interviewer Cheat Sheet

**Strong:** Asks clarifying questions before designing; mentions auth vs authorization; knows 401 vs 403; discusses transactions for race conditions.

**Weak:** Only CRUD with no business rules; can't trace request through middleware; says "I'd use MongoDB because it's easy" with no data model reasoning.
