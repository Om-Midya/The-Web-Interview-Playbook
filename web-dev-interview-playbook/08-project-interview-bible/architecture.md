# Explaining Your Project Architecture

How to describe, draw, and defend your system's structure in interviews.

---

## What Interviewers Want

- A clear mental model of how pieces connect
- Justification for technology choices
- Awareness of what would break at scale
- Honesty about shortcuts you took (and why)

---

## The Standard Student Architecture

Most student fullstack projects follow this pattern:

```
┌─────────────────────────────────────────────────┐
│                   CLIENT                         │
│  React / Next.js (browser)                       │
│  - UI components, routing, state management      │
└──────────────────────┬──────────────────────────┘
                       │ HTTPS (REST API / WebSocket)
┌──────────────────────▼──────────────────────────┐
│                   SERVER                         │
│  Node.js + Express                               │
│  - Routes, middleware, business logic            │
│  - Auth middleware, validation                   │
└──────────┬───────────────────────┬──────────────┘
           │                       │
┌──────────▼──────────┐  ┌────────▼────────────┐
│     DATABASE        │  │  EXTERNAL SERVICES   │
│  PostgreSQL/MongoDB │  │  - Cloudinary (images) │
│  - Users, data      │  │  - SendGrid (email)    │
│  - Migrations       │  │  - Stripe (payments)   │
└─────────────────────┘  └───────────────────────┘
```

**Say this:** *"It's a classic three-tier architecture: React SPA, Express REST API, PostgreSQL database, deployed separately so each layer can scale independently."*

---

## How to Draw It (2 Minutes on Whiteboard)

Draw these boxes left to right, then add arrows:

```
[Browser/React] ──HTTPS──► [Express API] ──► [PostgreSQL]
                                │
                                ├──► [Redis] (if you use caching)
                                ├──► [S3/Cloudinary] (if file uploads)
                                └──► [Socket.io] (if real-time)
```

Label arrows with protocol: `REST JSON`, `WebSocket`, `SQL queries`

**Pro tip:** Practice drawing this in under 60 seconds. Muscle memory matters in interviews.

---

## Explaining Your Tech Stack Choices

Use the format: **"I chose X because Y. Alternative was Z, but..."**

### Frontend

| Choice | Good reason to give |
|--------|---------------------|
| React | Component reusability, large ecosystem, I know it best |
| Next.js | SSR for SEO, file-based routing, API routes in one repo |
| React Query | Server state caching, less boilerplate than Redux for API data |
| Tailwind CSS | Fast prototyping, consistent design system |
| Zustand | Lightweight global state without Redux complexity |

### Backend

| Choice | Good reason to give |
|--------|---------------------|
| Node.js + Express | Same language as frontend, fast to build, huge npm ecosystem |
| PostgreSQL | Relational data with joins, ACID for transactions, free tier on Railway |
| MongoDB | Flexible schema for rapid prototyping, nested documents fit my data |
| Prisma | Type-safe queries, migrations built-in, great DX |

### Deployment

| Choice | Good reason to give |
|--------|---------------------|
| Vercel (frontend) | Zero-config deploys, CDN, preview URLs per PR |
| Railway/Render (API) | Simple Node deploy, managed Postgres addon |
| Docker | Consistent environments, easy to hand off to teammates |

---

## Architecture Patterns to Name-Drop (If Applicable)

| Pattern | When it applies | Example sentence |
|---------|-----------------|------------------|
| **MVC** | Routes → controllers → models | "Express routes map to controller functions that call Prisma models." |
| **Middleware chain** | Auth, logging, validation | "Every protected route passes through auth middleware before the controller." |
| **Repository pattern** | Abstracting DB access | "I wrapped all user queries in a UserRepository so controllers don't touch SQL directly." |
| **Client-server** | Any web app | "Thin client — business logic lives on the server, frontend just renders and sends requests." |
| **Monolith** | Single deployable app | "It's a monolith — one Express app. Fine for this scale; I'd extract a notification service if we grew." |

---

## Folder Structure (Show You Thought About Organization)

### Frontend (Feature-Based)

```
src/
├── components/ui/       # Reusable: Button, Modal, Input
├── features/
│   ├── auth/            # Login, Register, useAuth
│   ├── dashboard/       # Dashboard-specific components
│   └── [feature]/
├── hooks/               # Shared custom hooks
├── lib/api.js           # Axios instance, interceptors
├── pages/ or app/       # Route entry points
└── utils/               # Helpers
```

### Backend (Layered)

```
src/
├── routes/              # Route definitions
├── controllers/         # Request handlers
├── middleware/           # auth.js, validate.js, errorHandler.js
├── models/ or prisma/   # Database schema and queries
├── services/            # Business logic (optional layer)
├── utils/               # Helpers, email templates
└── config/              # DB connection, env vars
```

**Interview line:** *"Backend is layered — routes define endpoints, controllers handle request/response, and Prisma handles all database access. Keeps concerns separated."*

---

## Data Flow Example (Trace One User Action)

Practice narrating a complete flow. Example: **User creates a post**

```
1. User fills form in React → clicks Submit
2. React calls POST /api/v1/posts with JSON body + JWT in Authorization header
3. Express receives request
4. authMiddleware verifies JWT → attaches req.user
5. validateMiddleware checks title/body present
6. postController.create() called
7. Prisma: db.post.create({ data: { title, body, userId: req.user.id } })
8. Returns 201 { data: { id, title, body, createdAt } }
9. React Query invalidates 'posts' cache → feed refetches
10. UI shows new post at top of feed
```

This 10-step walkthrough impresses interviewers more than any diagram.

---

## Scale Questions (Always Prep This)

**"What breaks first at 10,000 users?"**

Honest student answers:
1. **Database** — unindexed queries slow down → add indexes, connection pooling
2. **Single server** — CPU/memory maxed → horizontal scaling behind load balancer
3. **File uploads** — disk fills up → move to S3/Cloudinary (if not already)
4. **In-memory sessions** — lost on restart/multi-server → move to Redis
5. **No caching** — repeated DB hits → Redis cache for hot data

**"How would you scale this?"**

```
Current:  [React on Vercel] → [1 Express server] → [1 Postgres]

10x:      [React on Vercel] → [Load Balancer] → [3 Express servers] → [Postgres + Redis cache]
                                              → [Read replica]

100x:     Add CDN for assets, queue for async jobs (email), separate file service
```

---

## Common Architecture Mistakes Students Make

| Mistake | What to say if true | Fix narrative |
|---------|---------------------|---------------|
| Everything in one `server.js` | "Started monolithic for speed" | "I'd split into routes/controllers/services" |
| No environment variables | "Learned this the hard way" | "Now all secrets in .env, .env in .gitignore" |
| Frontend calls DB directly | Never do this | N/A |
| No error handling middleware | "Added after debugging production errors" | "Centralized error handler returns consistent JSON" |
| CORS not configured | "Fixed when frontend couldn't reach API" | "Configured CORS for my Vercel domain only" |

Turn mistakes into learning stories — interviewers respect growth.

---

## Checklist: Can You Answer These?

- [ ] Draw your architecture in 60 seconds
- [ ] Explain why you chose each technology
- [ ] Trace one user action end-to-end (10 steps)
- [ ] Name what breaks first at 10x scale
- [ ] Describe your folder structure and why
- [ ] Identify one architectural decision you'd change

---

**Next:** [authentication.md](./authentication.md) | [database-design.md](./database-design.md)
