# X vs Y Comparison Questions

> 25 comparison questions. Use the framework: difference → when X → when Y → what you used.

See [answer-frameworks.md](../00-start-here/answer-frameworks.md) Framework 6.

---

## Question: React vs Vue

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Framework choice comparison — very common.

### Answer
React: library + ecosystem, JSX, huge job market. Vue: progressive, templates optional, gentler learning curve. Both component-based with virtual DOM.

### Example
React for larger ecosystem and job listings; Vue for faster onboarding on smaller teams.

### Follow-up Questions
- Which for enterprise?
- State management?
- Performance difference?

### Common Mistakes
Trash-talking either; no project-based reason.

### Project Connection
I chose React because [job market / course / reusable components in X project].

---

## Question: React vs Angular

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Enterprise vs startup framing.

### Answer
React is flexible library; Angular is full framework (routing, forms, DI built-in). Angular uses TypeScript by default, steeper curve, opinionated structure.

### Example
Startup MVP → React. Large enterprise with Java background team → Angular sometimes.

### Follow-up Questions
- Learning curve?
- When Angular wins?
- Google backing?

### Common Mistakes
Saying Angular is dead; ignoring enterprise adoption.

### Project Connection
Your project stack and whether you'd pick Angular for a bank intranet type app.

---

## Question: JavaScript vs TypeScript

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Type safety tradeoff.

### Answer
JS: faster start, dynamic. TS: compile-time types, better tooling, safer refactors. TS compiles to JS.

### Example
Hackathon → JS. Team project 10+ files → TS pays off.

### Follow-up Questions
- Gradual TS?
- Runtime validation still needed?
- any escape hatch?

### Common Mistakes
TS eliminates all bugs; refusing TS on tiny script.

### Project Connection
Would you migrate your project — what files first?

---

## Question: SQL vs MongoDB

### Difficulty
🟡 Medium

### Why Interviewers Ask This
The classic database comparison.

### Answer
SQL: tables, relations, ACID, joins. MongoDB: documents, flexible schema, embed related data, scale-out.

### Example
Orders + payments → SQL. Content feed with varied metadata → Mongo.

### Follow-up Questions
- Transactions in Mongo?
- Mongoose schemas?
- When hybrid?

### Common Mistakes
Mongo because 'JSON' with heavy relational queries.

### Project Connection
Your DB and one query that fits its model well.

---

## Question: JWT vs Session cookies

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Auth architecture staple.

### Answer
JWT: stateless, client stores token, hard to revoke. Session: server state, easy logout/revoke, cookie-based.

### Example
SPA mobile API → JWT + refresh. Server-rendered web app → session cookie httpOnly.

### Follow-up Questions
- XSS implications?
- CSRF?
- Storage location?

### Common Mistakes
JWT in localStorage without refresh strategy.

### Project Connection
Your auth approach and one security measure.

---

## Question: REST vs GraphQL

### Difficulty
🟡 Medium

### Why Interviewers Ask This
API design comparison.

### Answer
REST: multiple endpoints, HTTP caching, simple. GraphQL: one endpoint, client picks fields, schema typed.

### Example
CRUD blog → REST. Mobile + web different data needs → GraphQL.

### Follow-up Questions
- Over-fetching?
- Versioning?
- Learning curve?

### Common Mistakes
GraphQL for 4 endpoints.

### Project Connection
Your REST endpoints; one that would be awkward in GraphQL.

---

## Question: useState vs useReducer

### Difficulty
🟡 Medium

### Why Interviewers Ask This
React state pattern.

### Answer
useState: simple independent values. useReducer: complex state transitions, multiple sub-values, predictable updates via actions.

### Example
Counter → useState. Form with 10 fields + validation steps → useReducer.

### Follow-up Questions
- When Redux over both?
- Initializer function?
- Performance?

### Common Mistakes
useReducer for a single boolean.

### Project Connection
Complex state in your app — which hook and why.

---

## Question: useEffect vs React Query

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Server state separation.

### Answer
useEffect: side effects, manual fetch, you handle cache/loading. React Query: built for server data — cache, refetch, dedupe.

### Example
Document title sync → useEffect. API list with pagination → React Query.

### Follow-up Questions
- Stale time?
- Mutations?
- SSR?

### Common Mistakes
useEffect fetch copy-pasted in 5 components.

### Project Connection
If you fetch in useEffect, what pain React Query would remove.

---

## Question: Props vs Context

### Difficulty
🟢 Easy

### Why Interviewers Ask This
React data passing.

### Answer
Props: parent to child explicit. Context: avoid drilling through many layers for global-ish data.

### Example
Button label → props. Theme/locale → Context.

### Follow-up Questions
- Performance?
- When Redux?
- Split contexts?

### Common Mistakes
Context for every piece of state.

### Project Connection
What you put in Context vs props in your app.

---

## Question: CSS Flexbox vs Grid

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Layout comparison for frontend.

### Answer
Flexbox: 1D layout (row OR column), alignment, nav bars. Grid: 2D rows+columns, page layouts, card grids.

### Example
Navbar → Flex. Dashboard grid → Grid.

### Follow-up Questions
- Can combine?
- When floats?
- Responsive patterns?

### Common Mistakes
Grid for everything; Flex for full page layout without Grid areas.

### Project Connection
Your layout: which tool for header vs card grid.

---

## Question: GET vs POST

### Difficulty
🟢 Easy

### Why Interviewers Ask This
HTTP fundamentals.

### Answer
GET: retrieve, idempotent, cacheable, params in URL. POST: create/submit, body payload, not idempotent.

### Example
GET /api/users?page=1. POST /api/users with JSON body.

### Follow-up Questions
- PUT vs POST?
- GET with body?
- Safe methods?

### Common Mistakes
POST for everything; GET that mutates data.

### Project Connection
Map your project's methods to CRUD operations.

---

## Question: PUT vs PATCH

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Update semantics.

### Answer
PUT: replace entire resource. PATCH: partial update.

### Example
PUT /users/1 with full user object. PATCH with { name: 'New' } only.

### Follow-up Questions
- Idempotent?
- Which more common?
- Validation?

### Common Mistakes
Using them interchangeably.

### Project Connection
How your API updates a user profile.

---

## Question: npm vs yarn vs pnpm

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Package manager awareness.

### Answer
All install JS packages. npm default with Node. yarn: lockfile, parallel installs. pnpm: disk-efficient symlinks, strict node_modules.

### Example
Team standardizes on one; lockfile committed.

### Follow-up Questions
- package-lock?
- npx?
- Security audits?

### Common Mistakes
Deleting lockfiles randomly.

### Project Connection
Which you use; one dependency you added and why.

---

## Question: LocalStorage vs SessionStorage vs Cookies

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Client storage comparison.

### Answer
localStorage: persistent, 5MB+, same-origin, no auto HTTP send. sessionStorage: per tab session. Cookies: sent with requests, size limit, httpOnly option for security.

### Example
Theme preference → localStorage. Auth token debate → httpOnly cookie often safer than localStorage.

### Follow-up Questions
- JWT where?
- GDPR?
- IndexedDB?

### Common Mistakes
Storing passwords in localStorage.

### Project Connection
What your app stores client-side and why.

---

## Question: SSR vs CSR

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Rendering strategy.

### Answer
SSR: HTML on server per request, good SEO, faster first paint. CSR: browser renders, SPA feel, less server load.

### Example
Marketing site → SSR/SSG. Logged-in dashboard → CSR fine.

### Follow-up Questions
- Hydration?
- Next.js?
- TTFB vs TTI?

### Common Mistakes
CSR for public blog needing SEO.

### Project Connection
Your app: which pages could benefit from SSR.

---

## Question: SSG vs SSR

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Next.js specific nuance.

### Answer
SSG: build-time HTML, CDN fast, stale until rebuild. SSR: per-request HTML, always fresh, more server work.

### Example
Blog posts → SSG. User dashboard → SSR.

### Follow-up Questions
- ISR?
- On-demand revalidation?
- Cost?

### Common Mistakes
SSR for static content; SSG for personalized pages.

### Project Connection
Classify one route in a Next app.

---

## Question: Monolith vs Microservices

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Architecture at student level.

### Answer
Monolith: one deployable app. Microservices: many small services communicating over network.

### Example
Student project → monolith. Scale/team pain → consider split.

### Follow-up Questions
- Network failures?
- Docker?
- When to split?

### Common Mistakes
Microservices day one for todo app.

### Project Connection
Your app is a monolith — defend that choice.

---

## Question: MongoDB embed vs reference

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Schema design.

### Answer
Embed: nested docs, one query, duplication risk. Reference: ObjectId pointer, normalize, need populate/join.

### Example
Comments on post → embed if few. User on 1000 orders → reference.

### Follow-up Questions
- Array size limit?
- Atomic updates?
- Duplication?

### Common Mistakes
Embedding everything; 16MB doc limit surprise.

### Project Connection
One relationship in your schema — embed or ref and why.

---

## Question: Controlled vs uncontrolled inputs

### Difficulty
🟢 Easy

### Why Interviewers Ask This
React forms.

### Answer
Controlled: React state is source of truth. Uncontrolled: DOM holds value, ref to read.

### Example
Validated form → controlled. Simple file input → often uncontrolled.

### Follow-up Questions
- Performance?
- React Hook Form?
- Default values?

### Common Mistakes
Mixing without knowing which owns value.

### Project Connection
Your login form — controlled? Why?

---

## Question: debounce vs throttle

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Performance handlers.

### Answer
Debounce: wait until pause (search input). Throttle: max once per interval (scroll handler).

### Example
Search → debounce 300ms. Scroll position → throttle.

### Follow-up Questions
- Implement how?
- Leading edge?
- use case wrong swap?

### Common Mistakes
Same word for both; neither for button clicks.

### Project Connection
Where you'd add debounce in your UI.

---

## Question: async/await vs .then()

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Async style.

### Answer
Same Promise underlying. async/await: synchronous-looking, try/catch errors. .then(): chaining, older style.

### Example
async function load() { const d = await fetch(); }

### Follow-up Questions
- Error handling?
- Parallel await?
- Callbacks vs promises?

### Common Mistakes
await in loop sequentially when parallel possible.

### Project Connection
Your API call — rewrite mentally with .then chain.

---

## Question: var vs let vs const

### Difficulty
🟢 Easy

### Why Interviewers Ask This
JS fundamentals.

### Answer
var: function scoped, hoisted. let/const: block scoped. const: no reassignment (object mutable).

### Example
Prefer const; let when reassign; avoid var.

### Follow-up Questions
- Temporal dead zone?
- Hoisting interview snippet?
- const with objects?

### Common Mistakes
const means immutable object.

### Project Connection
Lint rule no-var in your project.

---

## Question: Express vs Fastify

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Node framework comparison.

### Answer
Express: most popular, huge middleware. Fastify: faster benchmarks, schema validation built-in, growing ecosystem.

### Example
Learning/portfolio → Express. Performance-sensitive API → consider Fastify.

### Follow-up Questions
- Migration?
- Middleware compat?
- When raw http?

### Common Mistakes
Speed claims without profiling.

### Project Connection
You know Express — name one Fastify advantage to show awareness.

---

## Question: Webpack vs Vite

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Build tooling.

### Answer
Webpack: bundles everything, flexible, slower dev cold start. Vite: ESM native dev, Rollup prod, faster HMR.

### Example
Legacy app → Webpack. New Vite React template → Vite.

### Follow-up Questions
- Next uses?
- Config complexity?
- Plugins?

### Common Mistakes
Saying Webpack unused everywhere.

### Project Connection
Your dev server startup — noticed Vite speed?

---

## Question: OAuth vs own auth

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Auth strategy.

### Answer
OAuth: delegate to Google/GitHub, less password liability, faster signup. Own auth: full control, custom flows, more security responsibility.

### Example
Side project → Google OAuth. Custom roles/billing → own auth + bcrypt.

### Follow-up Questions
- Passport.js?
- JWT after OAuth?
- GDPR?

### Common Mistakes
OAuth means you don't need backend auth checks.

### Project Connection
Your project: OAuth, email/password, or both.
