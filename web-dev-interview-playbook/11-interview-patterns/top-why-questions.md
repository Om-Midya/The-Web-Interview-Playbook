# Top "Why" Interview Questions

> 30 "why did you choose X?" questions with full answers. The most common project-defense pattern.

Practice replacing examples with **your** project.

---

## Question: Why use React?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Every React role asks this; they want reasoning, not hype.

### Answer
React uses a component model and virtual DOM for predictable UI updates. Large ecosystem, hiring demand, and JSX keep related logic together. Good for SPAs and teams that want reusable UI pieces.

### Example
Todo app: each task is a component; state change re-renders only affected parts.

### Follow-up Questions
- Why not Angular?
- Is React a framework or library?
- When would you NOT use React?

### Common Mistakes
Saying 'it's popular' with no technical reason; claiming React is always faster.

### Project Connection
Say why React fit YOUR project: component reuse, hooks for API data, team familiarity.

---

## Question: Why use Node.js for the backend?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Full-stack JS is common; they test if you understand tradeoffs.

### Answer
Node uses one language across stack, non-blocking I/O suits I/O-heavy APIs, huge npm ecosystem. Great for JSON APIs, real-time apps, and fast prototyping.

### Example
Express REST API serving a React app — one language for interns to context-switch less.

### Follow-up Questions
- When is Node a bad choice?
- What is the event loop?
- Node vs Deno?

### Common Mistakes
Saying Node is fast for CPU-heavy tasks; ignoring blocking code risks.

### Project Connection
Mention your API: async routes, JSON responses, npm packages you used.

---

## Question: Why MongoDB?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
NoSQL choice comes up in project defense constantly.

### Answer
Flexible schema for evolving data, JSON-like documents map well to JS objects, horizontal scaling path. Good when structure varies or you iterate quickly.

### Example
Blog with comments and tags — nested documents without heavy joins.

### Follow-up Questions
- When would SQL be better?
- What is schema design in Mongo?
- ACID concerns?

### Common Mistakes
Choosing Mongo 'because it's easy' with relational data needing joins.

### Project Connection
Explain your collections and one embedding vs referencing decision.

---

## Question: Why PostgreSQL / SQL?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Shows you know when relational DBs win.

### Answer
ACID transactions, strong consistency, joins for relational data, mature tooling. Best for orders, payments, reporting, and strict schemas.

### Example
E-commerce orders + order_items — foreign keys prevent orphan rows.

### Follow-up Questions
- ORM vs raw SQL?
- Indexes?
- When NoSQL instead?

### Common Mistakes
Saying SQL is outdated; not knowing when transactions matter.

### Project Connection
If you used SQL: describe one table relationship in your project.

---

## Question: Why JWT for authentication?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Auth appears in most full-stack interviews.

### Answer
Stateless tokens let any server verify requests without shared session store. Good for SPAs and mobile clients calling APIs. Payload carries claims (user id, role).

### Example
Login returns JWT; client sends Authorization: Bearer on each API call.

### Follow-up Questions
- JWT vs sessions?
- Where to store token?
- Refresh tokens?

### Common Mistakes
Storing JWT in localStorage ignoring XSS; no expiration.

### Project Connection
Describe your login flow: where token is stored and how routes are protected.

---

## Question: Why session-based auth instead of JWT?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Tests whether you know both sides.

### Answer
Server stores session; cookie is opaque id. Easier revocation, smaller client payload, httpOnly cookies reduce XSS token theft. Fits traditional server-rendered apps.

### Example
Express-session with Redis store; logout deletes session server-side.

### Follow-up Questions
- Cookie settings?
- Scaling sessions?
- When JWT wins?

### Common Mistakes
Claiming sessions don't scale — they do with Redis.

### Project Connection
If you used sessions, mention cookie flags (httpOnly, secure).

---

## Question: Why Express?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Most student Node projects use Express.

### Answer
Minimal, unopinionated, huge middleware ecosystem, easy to learn. Fast to ship REST APIs. Industry standard for Node HTTP servers.

### Example
app.use(express.json()); app.get('/api/users', handler);

### Follow-up Questions
- Express vs Fastify?
- How do you structure routes?
- Error middleware?

### Common Mistakes
Saying Express is the only option; messy single-file apps.

### Project Connection
Mention your folder structure: routes, controllers, middleware.

---

## Question: Why Next.js?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
React jobs increasingly expect Next knowledge.

### Answer
File-based routing, SSR/SSG/ISR for SEO and performance, API routes, React Server Components in App Router. One framework for frontend + light backend.

### Example
Marketing pages SSG; dashboard SSR for personalized data.

### Follow-up Questions
- vs Create React App?
- App Router vs Pages?
- When plain React?

### Common Mistakes
SSR everything without need; ignoring deployment (Vercel assumptions).

### Project Connection
Label one route in your app: SSR, SSG, or client-only and why.

---

## Question: Why TypeScript?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Growing expectation even for juniors.

### Answer
Catches type errors before runtime, better IDE autocomplete, self-documenting interfaces, safer refactors in teams.

### Example
interface User { id: string; email: string } — API responses typed.

### Follow-up Questions
- Cost of TS?
- any vs unknown?
- Gradual adoption?

### Common Mistakes
Saying TS makes code bug-free; fighting the compiler with any.

### Project Connection
One bug TS caught in your project, or why you'd add it next.

---

## Question: Why Tailwind CSS?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Utility-first CSS is interview fodder.

### Answer
Rapid UI building without naming CSS classes, consistent design tokens, small production CSS via purging. Great for prototypes and design systems.

### Example
className='flex items-center gap-2 p-4 rounded-lg bg-blue-500'

### Follow-up Questions
- vs Bootstrap?
- Maintainability concerns?
- When separate CSS files?

### Common Mistakes
Unreadable long class strings with no components; no @apply extraction.

### Project Connection
Say if you used Tailwind + one component library choice.

---

## Question: Why CSS Modules / styled-components?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Scoped styling choice in React projects.

### Answer
Colocated styles per component, avoid global class collisions, dynamic styles in JS when needed (styled-components).

### Example
Button.module.css — .btn only scopes to Button.jsx.

### Follow-up Questions
- Tailwind vs CSS Modules?
- Performance?
- SSR with styled-components?

### Common Mistakes
Global CSS chaos then blaming React.

### Project Connection
Which approach your project uses and one benefit you noticed.

---

## Question: Why Redux / Zustand / Context?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
State management 'why' is very common.

### Answer
Lift shared state out of prop drilling. Redux for large apps with predictable updates; Zustand simpler API; Context for low-frequency global data (theme, auth).

### Example
Auth user in Context; cart in Zustand for simpler boilerplate than Redux.

### Follow-up Questions
- When is useState enough?
- Redux Toolkit?
- Server state vs client state?

### Common Mistakes
Redux for everything including local form state.

### Project Connection
What global state you had and why it couldn't stay local.

---

## Question: Why React Query / TanStack Query?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Server state caching is a modern pattern.

### Answer
Handles fetching, caching, refetching, loading/error states. Avoids duplicating API logic in useEffect. Stale-while-revalidate UX.

### Example
useQuery(['users'], fetchUsers) — auto refetch on window focus.

### Follow-up Questions
- vs useEffect fetch?
- Mutations?
- Cache invalidation?

### Common Mistakes
Manual fetch in every component; no loading states.

### Project Connection
If you used it, describe cache key strategy; if not, say you'd add for API-heavy apps.

---

## Question: Why REST over GraphQL?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
API style comparison in backend rounds.

### Answer
Simple mental model, HTTP caching, easy debugging with curl/Postman, fits CRUD. Less setup than GraphQL schema and resolvers.

### Example
GET /api/posts, POST /api/posts — predictable for small teams.

### Follow-up Questions
- When GraphQL wins?
- Versioning?
- Over-fetching?

### Common Mistakes
Calling REST outdated; not knowing GraphQL tradeoffs either.

### Project Connection
Your API style and one endpoint you'd model differently at scale.

---

## Question: Why GraphQL?

### Difficulty
🔴 Hard

### Why Interviewers Ask This
Some product companies prefer GraphQL.

### Answer
Client requests exact fields, one endpoint, strong typing with schema, reduces over-fetching for mobile/varied clients.

### Example
Mobile app needs post title only; web needs full author object — same schema.

### Follow-up Questions
- N+1 problem?
- Caching difficulty?
- vs REST?

### Common Mistakes
GraphQL for 5-endpoint CRUD app — overkill.

### Project Connection
Honest: haven't used — explain when you'd evaluate it.

---

## Question: Why WebSockets?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Real-time features come up in system design.

### Answer
Full-duplex persistent connection. Low latency for chat, live scores, notifications vs polling overhead.

### Example
Chat app: server pushes message to room without client polling every second.

### Follow-up Questions
- WebSocket vs SSE?
- Scaling sockets?
- Fallback?

### Common Mistakes
WebSockets for static content; ignoring reconnection logic.

### Project Connection
If your project is polling, say how you'd upgrade to sockets.

---

## Question: Why Docker?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
DevOps awareness at student level.

### Answer
Consistent environments dev-to-prod, isolated dependencies, easy onboarding, deploy same image everywhere.

### Example
Dockerfile: node:20, copy package.json, npm ci, CMD node server.js

### Follow-up Questions
- Docker vs VM?
- docker-compose?
- When not needed?

### Common Mistakes
Docker fixes all deployment bugs magically.

### Project Connection
If you containerized, what problem it solved on your machine vs teammate's.

---

## Question: Why Git?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Basic professional workflow question.

### Answer
Version history, branching for features, collaboration via PRs, rollback when things break.

### Example
feature/login branch → PR → review → merge to main.

### Follow-up Questions
- merge vs rebase?
- What is .gitignore?
- Resolve conflicts?

### Common Mistakes
Only using GitHub upload button; no commit messages.

### Project Connection
Your branching habit on project: main + feature branches?

---

## Question: Why Vite over Webpack?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Build tool questions in frontend rounds.

### Answer
Native ESM dev server = fast HMR, simpler config for SPAs, modern default for React/Vue starters.

### Example
npm create vite@latest — dev server ready in seconds.

### Follow-up Questions
- What does Webpack do?
- Production build?
- Next.js uses what?

### Common Mistakes
Saying Webpack is dead — Next still uses bundlers under hood.

### Project Connection
What dev experience improved when you switched or started with Vite.

---

## Question: Why semantic HTML?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Accessibility and SEO fundamentals.

### Answer
Screen readers navigate by landmarks, SEO crawlers understand structure, clearer code intent than div soup.

### Example
<nav>, <main>, <article> instead of <div class='nav'>.

### Follow-up Questions
- SEO impact?
- ARIA when?
- section vs article?

### Common Mistakes
Div everything then adding ARIA as band-aid.

### Project Connection
Point to one page in your project with semantic structure.

---

## Question: Why mobile-first CSS?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Responsive design reasoning.

### Answer
Design for constraints first, progressive enhancement for larger screens, avoids desktop-first retrofit pain, aligns with traffic (often mobile-heavy).

### Example
Base styles 1 column; min-width 768px → grid.

### Follow-up Questions
- Breakpoints choice?
- Container queries?
- Touch targets?

### Common Mistakes
Only testing on laptop; tiny text on phones.

### Project Connection
Your breakpoint and what broke before you added it.

---

## Question: Why environment variables?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Production hygiene question.

### Answer
Secrets and config differ per environment without code changes. Keeps API keys out of git. 12-factor app practice.

### Example
DATABASE_URL=... in .env (gitignored); process.env.DATABASE_URL in code.

### Follow-up Questions
- .env vs config files?
- Client-side env?
- Vercel/Railway secrets?

### Common Mistakes
Committing .env to GitHub; REACT_APP_ exposing secrets.

### Project Connection
List env vars your project uses (names only, not values).

---

## Question: Why bcrypt for passwords?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Security basics for auth.

### Answer
Slow hashing with salt resists brute force. Never store reversible encryption or plain text for passwords.

### Example
await bcrypt.hash(password, 10) on register; compare on login.

### Follow-up Questions
- Salt rounds?
- bcrypt vs argon2?
- What if DB leaks?

### Common Mistakes
MD5/SHA for passwords; salt optional comment.

### Project Connection
Confirm your project hashes passwords or uses OAuth provider.

---

## Question: Why CORS exists?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Every full-stack dev hits CORS errors.

### Answer
Browser security: blocks JS from reading cross-origin responses unless server allows via Access-Control-Allow-Origin. Protects users from malicious sites calling banks.

### Example
Frontend localhost:3000 → API localhost:5000 needs cors() middleware.

### Follow-up Questions
- Preflight?
- Credentials?
- Production fix?

### Common Mistakes
Disabling CORS in browser 'to fix it'; wildcard with credentials.

### Project Connection
Describe your CORS config or proxy approach in dev.

---

## Question: Why use a linter (ESLint)?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Code quality and team workflow.

### Answer
Catches bugs (unused vars, eqeqeq), enforces style, consistent PRs, integrates with CI.

### Example
eslint --fix on save; no-var rule catches hoisting issues.

### Follow-up Questions
- Prettier vs ESLint?
- CI enforcement?
- False positives?

### Common Mistakes
Disabling all rules because 'annoying'.

### Project Connection
Any ESLint rule that caught a real bug for you.

---

## Question: Why use GitHub Actions / CI?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Shows production mindset.

### Answer
Automated test/lint on every PR, catch breaks before merge, deploy pipelines, consistent quality gate.

### Example
PR opens → run npm test + eslint → block merge if fail.

### Follow-up Questions
- What to run in CI?
- CD vs CI?
- Secrets in Actions?

### Common Mistakes
No CI until production fire; only runs locally.

### Project Connection
If you have a workflow YAML, what jobs it runs.

---

## Question: Why microservices?

### Difficulty
🔴 Hard

### Why Interviewers Ask This
System design trap — they want 'usually not yet'.

### Answer
Independent deploy, scale, and tech per service. Team autonomy at org scale. **Student answer:** I'd start monolith; split when team/size pain justifies ops cost.

### Example
Amazon scale — separate catalog, cart, payment services.

### Follow-up Questions
- Monolith first?
- Communication?
- Distributed tracing?

### Common Mistakes
Microservices for 3-person todo app; ignoring network failure modes.

### Project Connection
Your project is monolith — say that's correct for stage and why.

---

## Question: Why a monolith first?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Mature tradeoff thinking.

### Answer
Faster development, simpler deploy/debug, one codebase, no network calls between services. Split when scaling or team boundaries demand it.

### Example
MERN app on one server — ship features weekly.

### Follow-up Questions
- When to split?
- Modular monolith?
- Deployment?

### Common Mistakes
Thinking monolith means bad code; spaghetti vs architecture confusion.

### Project Connection
Describe your single-app deploy and what would split first at scale.

---

## Question: Why use Prisma / Mongoose?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
ORM/ODM choice in Node projects.

### Answer
Type-safe queries (Prisma), schema validation, migrations (Prisma), less raw string SQL/NoSQL. Mongoose adds schemas on MongoDB.

### Example
Mongoose User schema with required email unique index.

### Follow-up Questions
- ORM downsides?
- N+1?
- Raw queries when?

### Common Mistakes
ORM for one-line query adding complexity.

### Project Connection
One model/schema from your project and a validation rule.

---

## Question: Why deploy on Vercel / Railway / Render?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Hosting choice comes up in project demos.

### Answer
Low friction for students: git push deploy, free tiers, HTTPS, env UI. Vercel optimized for Next; Railway/Render good for Node APIs + DB.

### Example
Next on Vercel; Express + Postgres on Railway.

### Follow-up Questions
- Cold starts?
- Custom domain?
- When AWS?

### Common Mistakes
No deployment at all; only works on localhost.

### Project Connection
Your live URL, what broke in first deploy, how you fixed it.
