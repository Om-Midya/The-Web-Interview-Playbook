# Project Interview Question Bank

> 140+ questions tied to YOUR capstone, internship, or portfolio project. Adapt the Answer templates to your stack and story.

---

## Table of Contents

- **Why this project?** (12 questions)
- **Why this tech stack?** (12 questions)
- **Architecture & design** (16 questions)
- **Authentication & authorization** (11 questions)
- **Database design & queries** (11 questions)
- **API design** (10 questions)
- **Error handling** (6 questions)
- **Security** (10 questions)
- **Deployment & DevOps** (9 questions)
- **Scaling & performance** (9 questions)
- **Tradeoffs & decisions** (9 questions)
- **Challenges faced** (9 questions)
- **Future improvements** (6 questions)
- **Team project / your contribution** (9 questions)
- **Debugging stories** (6 questions)
- **Testing** (6 questions)
- **Code quality & best practices** (6 questions)

---

# Why this project?

## Question: Why did you pick this project idea?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
They want to see genuine motivation, user empathy, and that you did not copy a tutorial blindly.

### Answer
State the real problem you noticed (on campus, in your family, during internship), who is affected, and one measurable goal. Mention constraints (time, team size, exam schedule) and why this problem was worth 8–12 weeks.

### Example
"College event management app: Our fest had 200+ registrations on paper forms. I wanted organizers to approve events and send QR tickets in one place. Goal was to cut registration time by half for the cultural committee."

### Follow-up Questions
- Who is the target user?
- Did you validate the idea before building?
- What if the idea came from a professor?

### Common Mistakes
- Saying 'it was assigned' with no personal angle
- Problem too vague ('make an app')
- No link between problem and features

### Project Connection
Open your demo with the problem in one sentence, then show the feature that solves it.

---

## Question: What problem does your project solve?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Checks that you think in outcomes, not just features.

### Answer
Describe the before/after: pain today, your solution, and how you would know it worked (metrics, user feedback, time saved).

### Example
"E-commerce clone: Small sellers on campus needed a simple catalog without marketplace fees. Before, they used Instagram DMs; after, buyers get stock visibility and order history."

### Follow-up Questions
- How big is the problem?
- Existing tools you compared?
- What happens if you do not solve it?

### Common Mistakes
- Listing features instead of user pain
- No real user
- Claiming millions of users without evidence

### Project Connection
Map each main screen to a user pain you mentioned in the README.

---

## Question: Who are the users of your application?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Role-based thinking matters for auth, UI, and prioritization.

### Answer
Name 2–3 personas (role, goal, technical comfort). Explain which features each uses and what you deprioritized for v1.

### Example
"Library seat-booking system: Students book seats; librarians approve rules; admin sees occupancy. I optimized the student mobile flow first because 90% of traffic is bookings."

### Follow-up Questions
- Primary vs secondary users?
- Accessibility needs?
- Did you interview users?

### Common Mistakes
- Everyone is the user
- No difference between admin and customer flows
- Invented personas with no feature mapping

### Project Connection
Draw a simple role diagram and keep it next to your laptop in interviews.

---

## Question: How is your project different from existing solutions?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Shows market awareness and scope control.

### Answer
Name 2–3 alternatives (commercial, open source, spreadsheets). Explain your niche: local context, learning goals, integration, or cost. Be honest about what you do worse.

### Example
"college event management app: Eventbrite is overkill for our college budget. We focused on department approvals and UPI receipts, which generic tools do not handle."

### Follow-up Questions
- Why not use Notion/Airtable?
- Competitive moat?
- Would you productize this?

### Common Mistakes
- Claiming no alternatives exist
- Only comparing to another student project
- Trash-talking without understanding tradeoffs

### Project Connection
Add a 'Compared to…' bullet in your README to rehearse this answer.

---

## Question: What was the scope of version 1 and what did you cut?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Proves you can ship and manage scope like a real team.

### Answer
List must-haves for demo day, nice-to-haves deferred, and why. Mention how you tracked scope (issues, MVP doc).

### Example
"e-commerce clone: v1 had catalog, cart, and COD only. I cut reviews and recommendations because payment flow was the riskiest unknown."

### Follow-up Questions
- How did you decide what to cut?
- Feature creep examples?
- Backlog for v2?

### Common Mistakes
- Trying to build every Amazon feature
- No working demo path
- Cannot name a single cut

### Project Connection
Keep a 'Out of scope for v1' section in your project report.

---

## Question: What impact or results did your project achieve?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
They probe whether you measure success beyond 'it runs'.

### Answer
Share quantitative or qualitative results: users, time saved, bugs found in UAT, demo feedback, grades, or internship stakeholder sign-off. Use honest ranges if exact numbers are unknown.

### Example
"college event management app: 40 organizers used it for Tech Fest; average registration dropped from ~6 minutes on paper to ~2 minutes online. We had 3 bugs on event day, all fixed within an hour."

### Follow-up Questions
- How did you collect feedback?
- Failure metrics?
- Long-term usage?

### Common Mistakes
- Fake vanity metrics
- Only 'my friends liked it'
- No post-launch reflection

### Project Connection
Prepare one chart or screenshot of usage/analytics even if small.

---

## Question: Why is this project relevant to the role you are applying for?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Connects your work to their job description.

### Answer
Pick 2–3 JD skills (e.g., React, REST, SQL, testing) and tie each to a module you owned with a one-line proof.

### Example
"Applying for fullstack intern: e-commerce clone used React + Express + PostgreSQL — I owned checkout API and integration tests, similar to your listing checkout squad."

### Follow-up Questions
- Which module best maps to our stack?
- What would you rebuild for production?
- Team size vs company scale?

### Common Mistakes
- Generic 'it shows I can code'
- Unrelated project with no bridge
- Misrepresenting your role

### Project Connection
Customize this answer per company using their stack keywords.

---

## Question: How long did the project take and how did you plan milestones?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Tests planning and consistency with resume dates.

### Answer
Give total duration, weekly milestones (design, API, UI, testing, deploy), and what slipped. Mention tools (GitHub Projects, Notion).

### Example
"library seat-booking system: 10 weeks — weeks 1–2 schema + auth, 3–5 booking flow, 6–7 admin dashboard, 8 testing, 9–10 deploy and documentation."

### Follow-up Questions
- Part-time vs full-time?
- Parallel exams?
- Critical path task?

### Common Mistakes
- Timeline that does not match resume
- No milestones
- Everything done last week

### Project Connection
Align spoken timeline with README and resume bullets.

---

## Question: Did you work on this solo or in a team? Why that choice?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Sets up follow-ups on collaboration and ownership.

### Answer
Explain team size, why solo/team, how you split work, and communication rhythm. If solo, emphasize discipline; if team, emphasize clear interfaces.

### Example
"college event management app: Team of 4 — I chose backend because I wanted API design practice; we synced twice a week and used shared Postman collections."

### Follow-up Questions
- What if a teammate left?
- Solo disadvantages?
- How were grades split?

### Common Mistakes
- Hiding that it was mostly one person
- Unclear ownership
- Blaming team for delays only

### Project Connection
Know exactly which files/modules you wrote vs teammates.

---

## Question: What would you do differently if you started the project today?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Shows reflection without pretending the project was perfect.

### Answer
Pick 2 technical and 1 process change: earlier testing, better ERD, feature flags, CI, user interviews. Explain cost of not doing them.

### Example
"e-commerce clone: I would add integration tests before UI polish and use Stripe webhooks from day one instead of bolting them on last week."

### Follow-up Questions
- Would you change the stack?
- Biggest regret?
- Still worth starting?

### Common Mistakes
- Saying nothing
- Rewriting entire project casually
- Only blaming tools

### Project Connection
Frame changes as lessons, not excuses.

---

## Question: How did you gather requirements for your project?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Requirements skill separates toy apps from usable ones.

### Answer
Describe sources: user interviews, surveys, mentor, client brief, observing manual process. List top 5 requirements as user stories with acceptance hints.

### Example
"library seat-booking system: I shadowed the library desk for two afternoons, noted peak hours, and wrote stories like 'As a student I can see only free seats on my floor.'"

### Follow-up Questions
- Changing requirements mid-way?
- Conflicting stakeholders?
- Non-functional requirements?

### Common Mistakes
- Only your imagination
- Copying assignment PDF without interpretation
- No acceptance criteria

### Project Connection
Bring one user story written in interview-friendly language.

---

## Question: What is the elevator pitch for your project in 30 seconds?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Interviewers mimic how you would explain work to PMs or clients.

### Answer
Structure: user + problem + solution + tech headline + result. Practice under 30 seconds.

### Example
"college event management app: Organizers run college events; registration was chaotic. We built a web app for approvals, payments, and QR check-in. React and Node, used by 40 volunteers last fest."

### Follow-up Questions
- Shorter 15-second version?
- Technical depth after pitch?
- Demo order?

### Common Mistakes
- Buzzword soup
- No problem statement
- Over 60 seconds

### Project Connection
Record yourself and cut filler words.

---

# Why this tech stack?

## Question: Why did you choose this frontend framework?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Validates intentional learning vs resume-driven choices.

### Answer
Name learning goals, ecosystem (hiring, docs, components), and project needs (SEO, interactivity). Mention what you considered and rejected.

### Example
"e-commerce clone: I picked React because our team knew JS, component reuse mattered for product cards, and I wanted hooks practice for interviews."

### Follow-up Questions
- Why not Vue/Svelte?
- CRA vs Vite vs Next?
- TypeScript?

### Common Mistakes
- Cannot name alternatives
- Only 'it is popular'
- Framework mismatch with project needs

### Project Connection
Point to one component that would be painful in plain JS.

---

## Question: Why did you choose this backend language and framework?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Same as frontend — intention and fit.

### Answer
Explain productivity, team skill, libraries for your domain (auth, payments, websockets), and performance needs at your scale.

### Example
"college event management app: Node + Express — JSON APIs matched our React client, npm had good QR and mail libraries, and one language reduced context switching."

### Follow-up Questions
- Why not Python/Django?
- Serverless?
- Monolith vs microservices?

### Common Mistakes
- Backend chosen randomly
- Overkill microservices for CRUD
- Cannot explain middleware

### Project Connection
Mention one middleware you wrote and why.

---

## Question: Why this database (SQL vs NoSQL)?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Data modeling interviews start here.

### Answer
Describe data shape, relationships, transactions, reporting needs, and consistency. Compare one alternative fairly.

### Example
"library seat-booking system: PostgreSQL — bookings relate to users, seats, and time slots; I needed ACID for double-booking prevention."

### Follow-up Questions
- When would MongoDB fit?
- Migrations strategy?
- Indexing plan?

### Common Mistakes
- SQL vs NoSQL slogans only
- No schema
- Database as key-value dump

### Project Connection
Sketch your ERD when answering.

---

## Question: Why did you use an ORM vs raw SQL?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Tradeoff question common for student projects.

### Answer
Explain velocity, type safety, migrations, and where you dropped to raw SQL for reports or performance.

### Example
"e-commerce clone: Prisma sped up CRUD and migrations; for admin sales report I used a raw query with GROUP BY for clarity."

### Follow-up Questions
- N+1 problems?
- Migration failures?
- Stored procedures?

### Common Mistakes
- ORM magic without understanding SQL
- Never using migrations
- Raw SQL everywhere with SQL injection risk

### Project Connection
Show one migration file and what it changed.

---

## Question: Why this hosting or cloud provider?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Connects dev work to real deployment.

### Answer
Mention free tier, ease, region, HTTPS, DB hosting, and CI integration. Acknowledge limits.

### Example
"college event management app: Vercel for frontend and Render for API — free tiers, simple Git deploys, and automatic HTTPS for demo links on resume."

### Follow-up Questions
- Cost at scale?
- Vendor lock-in?
- Environment variables?

### Common Mistakes
- Only localhost
- Cannot explain deploy path
- Secrets in Git

### Project Connection
Have a live URL ready and know deploy steps.

---

## Question: Why TypeScript instead of JavaScript?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Type discipline is a hiring signal.

### Answer
Explain catch bugs early, better IDE help, shared types with API, and learning curve you accepted.

### Example
"e-commerce clone: TypeScript caught undefined price fields at compile time; I shared Order types between client and server DTOs."

### Follow-up Questions
- any vs strict?
- Gradual adoption?
- Build time cost?

### Common Mistakes
- Types everywhere with any
- Cannot explain a type you wrote
- Saying TypeScript is always required

### Project Connection
Show one interface that prevented a real bug.

---

## Question: Why did you use a UI library (Tailwind, MUI, shadcn, etc.)?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
UI choices affect velocity and accessibility.

### Answer
Speed vs customization vs bundle size. Mention accessibility and design consistency.

### Example
"library seat-booking system: Tailwind — fast layout for deadline, consistent spacing, and I still learned CSS by reading generated styles."

### Follow-up Questions
- Custom design system?
- Dark mode?
- Mobile-first?

### Common Mistakes
- Library as black box
- Inaccessible components
- Huge bundle with no tree-shaking

### Project Connection
Point to one accessible form you built.

---

## Question: Why JWT / sessions for auth?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Auth tradeoffs are frequent deep dives.

### Answer
Explain stateless vs server sessions, mobile/SPA fit, refresh strategy, and logout needs.

### Example
"e-commerce clone: JWT in httpOnly cookies for SPA — fewer DB hits on each request; refresh token rotation for longer sessions."

### Follow-up Questions
- Where is token stored?
- Revocation?
- OAuth later?

### Common Mistakes
- localStorage + JWT without understanding XSS
- No refresh/expiry plan
- Rolling your own crypto

### Project Connection
Diagram login flow on whiteboard if asked.

---

## Question: Why REST instead of GraphQL (or vice versa)?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
API paradigm choice.

### Answer
REST: simple resources, caching, team familiarity. GraphQL: flexible clients, fewer round trips — justify with your UI needs.

### Example
"college event management app: REST — clear resources (/events, /registrations) matched our screens; we did not need flexible nested queries."

### Follow-up Questions
- Versioning?
- Over-fetching?
- tRPC?

### Common Mistakes
- GraphQL for one CRUD app with no reason
- REST with 50 arbitrary endpoints
- No API docs

### Project Connection
Map endpoints to UI pages in a table.

---

## Question: Why did you add Redis / caching (if used)?

### Difficulty
🔴 Hard

### Why Interviewers Ask This
Separates students who optimize from those who only CRUD.

### Answer
If used: what you cache, TTL, invalidation. If not: what you would cache first and why you skipped (scale, time).

### Example
"e-commerce clone: I skipped Redis for v1; at ~100 daily users Postgres was enough. I would cache product list first because it is read-heavy."

### Follow-up Questions
- Cache stampede?
- Session store?
- CDN vs Redis?

### Common Mistakes
- Caching without invalidation story
- Premature Redis on localhost only
- Cannot measure hit rate

### Project Connection
Know p95 latency before claiming cache need.

---

## Question: Why Git and this branching strategy?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Collaboration hygiene matters in teams.

### Answer
Describe trunk vs GitFlow, PR reviews, commit message habits, and how you avoided breaking main.

### Example
"library seat-booking system: main + feature branches, PR required, squash merge. Protected main after a teammate pushed broken auth."

### Follow-up Questions
- Merge conflicts story?
- Tags/releases?
- Monorepo?

### Common Mistakes
- All work on main
- Huge commits
- No README on how to run

### Project Connection
Show a clean PR with description and screenshots.

---

## Question: Why Docker (or why not)?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Container literacy without overengineering.

### Answer
If used: reproducible env for team/CI. If not: explain manual setup and when Docker would help next.

### Example
"college event management app: No Docker — team on mixed laptops; we documented Node 20 + Postgres version. Docker would help CI parity next."

### Follow-up Questions
- docker-compose services?
- Image size?
- Production same as dev?

### Common Mistakes
- Dockerfile copy-paste without understanding
- Containers for static site only
- Secrets baked in image

### Project Connection
Be ready to explain Dockerfile lines if you used it.

---

# Architecture & design

## Question: Walk me through the high-level architecture of your project.

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Interviewers use this to see if you see the big picture, not only a single component. Baseline system design for your own app.

### Answer
Describe clients, API, database, third parties (payment, email, storage). Use a simple diagram: browser → API → DB → external services.

### Example
"college event management app: React SPA → Express API → PostgreSQL; SendGrid for mail; Razorpay for payments; admin and student UIs share API with role guards."

### Follow-up Questions
- Single point of failure?
- How to add mobile app later?
- What is synchronous vs async here?

### Common Mistakes
- Only naming technologies
- No data flow
- Diagram with no arrows/labels

### Project Connection
Keep a PNG architecture diagram in your repo root.

---

## Question: How did you separate frontend and backend concerns?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Interviewers use this to see if you see the big picture, not only a single component. Layering and maintainability.

### Answer
Explain folder structure, API contracts, no business logic in components (or where you violated that and why).

### Example
"e-commerce clone: UI calls service modules; services hit REST; validation on server is source of truth; client validation for UX only."

### Follow-up Questions
- Single point of failure?
- How to add mobile app later?
- What is synchronous vs async here?

### Common Mistakes
- Only naming technologies
- No data flow
- Diagram with no arrows/labels

### Project Connection
Keep a PNG architecture diagram in your repo root.

---

## Question: What design patterns did you use?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Interviewers use this to see if you see the big picture, not only a single component. Shows depth beyond tutorials.

### Answer
Mention patterns you actually used: MVC, repository, factory, observer (state), singleton (db pool). Do not name ten patterns.

### Example
"library seat-booking system: Repository-style data access for seats; middleware chain in Express; React context for auth user only."

### Follow-up Questions
- Single point of failure?
- How to add mobile app later?
- What is synchronous vs async here?

### Common Mistakes
- Only naming technologies
- No data flow
- Diagram with no arrows/labels

### Project Connection
Keep a PNG architecture diagram in your repo root.

---

## Question: How is your codebase organized (folder structure)?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Interviewers use this to see if you see the big picture, not only a single component. Navigation speed in interviews and on the job.

### Answer
Walk top-level folders and what belongs where; mention colocation vs layer-based.

### Example
"e-commerce clone: /client (components, hooks, pages), /server (routes, controllers, services, models), shared types in /packages if monorepo."

### Follow-up Questions
- Single point of failure?
- How to add mobile app later?
- What is synchronous vs async here?

### Common Mistakes
- Only naming technologies
- No data flow
- Diagram with no arrows/labels

### Project Connection
Keep a PNG architecture diagram in your repo root.

---

## Question: How do you handle environment-specific configuration?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Interviewers use this to see if you see the big picture, not only a single component. 12-factor style thinking.

### Answer
.env for secrets, config module, never commit secrets, different values dev/staging/prod.

### Example
"college event management app: dotenv locally; Vercel/Render env vars in prod; DATABASE_URL and JWT_SECRET only in env."

### Follow-up Questions
- Single point of failure?
- How to add mobile app later?
- What is synchronous vs async here?

### Common Mistakes
- Only naming technologies
- No data flow
- Diagram with no arrows/labels

### Project Connection
Keep a PNG architecture diagram in your repo root.

---

## Question: Monolith vs microservices — what did you build and why?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Interviewers use this to see if you see the big picture, not only a single component. Scale-appropriate architecture.

### Answer
Student projects should defend monolith; discuss boundaries that could become services later.

### Example
"e-commerce clone: Single deployable API monolith; clear modules (catalog, orders, users) so order service could split if traffic grew."

### Follow-up Questions
- Single point of failure?
- How to add mobile app later?
- What is synchronous vs async here?

### Common Mistakes
- Only naming technologies
- No data flow
- Diagram with no arrows/labels

### Project Connection
Keep a PNG architecture diagram in your repo root.

---

## Question: How does data flow when a user submits a main form?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Interviewers use this to see if you see the big picture, not only a single component. End-to-end tracing skill.

### Answer
Step through UI event → validation → API → DB → response → UI update/error.

### Example
"library seat-booking system: Book seat → disable button → POST /bookings → service checks overlap transaction → 201 + UI toast → calendar refetch."

### Follow-up Questions
- Single point of failure?
- How to add mobile app later?
- What is synchronous vs async here?

### Common Mistakes
- Only naming technologies
- No data flow
- Diagram with no arrows/labels

### Project Connection
Keep a PNG architecture diagram in your repo root.

---

## Question: How did you handle file uploads or media?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Interviewers use this to see if you see the big picture, not only a single component. Common feature with security implications.

### Answer
Client upload → API validation → cloud storage or disk → URL in DB; size/type limits.

### Example
"college event management app: Event posters to Cloudinary; store URL only; max 2MB; server checks MIME."

### Follow-up Questions
- Single point of failure?
- How to add mobile app later?
- What is synchronous vs async here?

### Common Mistakes
- Only naming technologies
- No data flow
- Diagram with no arrows/labels

### Project Connection
Keep a PNG architecture diagram in your repo root.

---

## Question: What is stateless vs stateful in your app?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Interviewers use this to see if you see the big picture, not only a single component. Scalability vocabulary.

### Answer
API stateless with JWT/cookies; state in DB; any in-memory session limitations.

### Example
"e-commerce clone: API instances stateless; cart persisted in DB after login; no sticky sessions needed."

### Follow-up Questions
- Single point of failure?
- How to add mobile app later?
- What is synchronous vs async here?

### Common Mistakes
- Only naming technologies
- No data flow
- Diagram with no arrows/labels

### Project Connection
Keep a PNG architecture diagram in your repo root.

---

## Question: How do you manage shared types or contracts between client and server?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Interviewers use this to see if you see the big picture, not only a single component. Reduces integration bugs.

### Answer
OpenAPI, shared package, or manual duplication with discipline.

### Example
"e-commerce clone: Zod schemas on server; inferred types copied to client DTOs; considering tRPC later."

### Follow-up Questions
- Single point of failure?
- How to add mobile app later?
- What is synchronous vs async here?

### Common Mistakes
- Only naming technologies
- No data flow
- Diagram with no arrows/labels

### Project Connection
Keep a PNG architecture diagram in your repo root.

---

## Question: What third-party services integrate with your system?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Interviewers use this to see if you see the big picture, not only a single component. Real systems are not islands.

### Answer
List payment, email, maps, analytics; failure modes and secrets.

### Example
"college event management app: Razorpay checkout, SendGrid OTP mail, optional Google Calendar export."

### Follow-up Questions
- Single point of failure?
- How to add mobile app later?
- What is synchronous vs async here?

### Common Mistakes
- Only naming technologies
- No data flow
- Diagram with no arrows/labels

### Project Connection
Keep a PNG architecture diagram in your repo root.

---

## Question: How would you draw your architecture on a whiteboard in 2 minutes?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Interviewers use this to see if you see the big picture, not only a single component. Communication under time pressure.

### Answer
Boxes: User, Web App, API, DB, External APIs; arrows labeled HTTP/SQL; call out auth.

### Example
Practice with library seat-booking system: student phone → HTTPS → API → Postgres; highlight booking transaction."

### Follow-up Questions
- Single point of failure?
- How to add mobile app later?
- What is synchronous vs async here?

### Common Mistakes
- Only naming technologies
- No data flow
- Diagram with no arrows/labels

### Project Connection
Keep a PNG architecture diagram in your repo root.

---

## Question: What are the main modules or bounded contexts?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Interviewers use this to see if you see the big picture, not only a single component. Domain decomposition.

### Answer
Name modules and their public interfaces; avoid circular dependencies.

### Example
"e-commerce clone: Users, Catalog, Cart, Orders, Payments — Orders depends on Catalog and Users, not vice versa."

### Follow-up Questions
- Single point of failure?
- How to add mobile app later?
- What is synchronous vs async here?

### Common Mistakes
- Only naming technologies
- No data flow
- Diagram with no arrows/labels

### Project Connection
Keep a PNG architecture diagram in your repo root.

---

## Question: How do you handle background jobs or scheduled tasks?

### Difficulty
🔴 Hard

### Why Interviewers Ask This
Interviewers use this to see if you see the big picture, not only a single component. Async work beyond request/response.

### Answer
Cron, queue, or 'not needed yet' with example of future job (email digest, cleanup).

### Example
"college event management app: node-cron nightly to expire pending registrations; would move to BullMQ if volume grew."

### Follow-up Questions
- Single point of failure?
- How to add mobile app later?
- What is synchronous vs async here?

### Common Mistakes
- Only naming technologies
- No data flow
- Diagram with no arrows/labels

### Project Connection
Keep a PNG architecture diagram in your repo root.

---

## Question: What would break first if 10x traffic hit tomorrow?

### Difficulty
🔴 Hard

### Why Interviewers Ask This
Interviewers use this to see if you see the big picture, not only a single component. Practical scaling intuition.

### Answer
DB connections, hot queries, rate limits on third parties, cold starts.

### Example
"e-commerce clone: Product search without index; I would add index on category + add read replica before splitting services."

### Follow-up Questions
- Single point of failure?
- How to add mobile app later?
- What is synchronous vs async here?

### Common Mistakes
- Only naming technologies
- No data flow
- Diagram with no arrows/labels

### Project Connection
Keep a PNG architecture diagram in your repo root.

---

## Question: How did you document architecture decisions?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Interviewers use this to see if you see the big picture, not only a single component. ADR light for students.

### Answer
README diagram, ADR markdown, or wiki; why decisions were recorded.

### Example
"library seat-booking system: Short ADR for Postgres vs Mongo and JWT cookies vs localStorage."

### Follow-up Questions
- Single point of failure?
- How to add mobile app later?
- What is synchronous vs async here?

### Common Mistakes
- Only naming technologies
- No data flow
- Diagram with no arrows/labels

### Project Connection
Keep a PNG architecture diagram in your repo root.

---

# Authentication & authorization

## Question: How does user registration work in your project?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Auth questions are standard in project deep dives; weak answers suggest security risk in production.

### Answer
Walk through validation, duplicate email check, hash password, create user, optional email verify, return safe response without password.

### Example
"e-commerce clone: POST /register validates email, bcrypt hash, welcome email async; duplicate returns 409 generic message."

### Follow-up Questions
- Refresh token rotation?
- CSRF with cookies?
- Multi-device logout?

### Common Mistakes
- Auth only on client
- Plaintext passwords
- Admin flag in JWT without server check

### Project Connection
Rehearse a sequence diagram for login on paper.

---

## Question: How does login and logout work?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Auth questions are standard in project deep dives; weak answers suggest security risk in production.

### Answer
Credentials → verify hash → issue session/JWT → httpOnly cookie → logout clears cookie and server denylist if any.

### Example
"library seat-booking system: Login sets httpOnly cookie; logout POST clears cookie; protected /admin returns 403 for students."

### Follow-up Questions
- Refresh token rotation?
- CSRF with cookies?
- Multi-device logout?

### Common Mistakes
- Auth only on client
- Plaintext passwords
- Admin flag in JWT without server check

### Project Connection
Rehearse a sequence diagram for login on paper.

---

## Question: How do you store and hash passwords?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Auth questions are standard in project deep dives; weak answers suggest security risk in production.

### Answer
bcrypt/argon2 with salt; never plaintext; cost factor choice; password rules without leaking user existence.

### Example
"college event management app: bcrypt cost 12; passwords never logged; seed users only in dev env."

### Follow-up Questions
- Refresh token rotation?
- CSRF with cookies?
- Multi-device logout?

### Common Mistakes
- Auth only on client
- Plaintext passwords
- Admin flag in JWT without server check

### Project Connection
Rehearse a sequence diagram for login on paper.

---

## Question: What roles or permissions exist?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Auth questions are standard in project deep dives; weak answers suggest security risk in production.

### Answer
List roles (admin, user, vendor); permission matrix; enforce on server always.

### Example
"college event management app: Roles organizer vs student; organizers approve events; enforced in service layer."

### Follow-up Questions
- Refresh token rotation?
- CSRF with cookies?
- Multi-device logout?

### Common Mistakes
- Auth only on client
- Plaintext passwords
- Admin flag in JWT without server check

### Project Connection
Rehearse a sequence diagram for login on paper.

---

## Question: How do you protect routes on the frontend?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Auth questions are standard in project deep dives; weak answers suggest security risk in production.

### Answer
Protected routes wrapper; redirect to login; do not rely on hiding buttons only.

### Example
"e-commerce clone: React Router loader checks /api/me before rendering checkout."

### Follow-up Questions
- Refresh token rotation?
- CSRF with cookies?
- Multi-device logout?

### Common Mistakes
- Auth only on client
- Plaintext passwords
- Admin flag in JWT without server check

### Project Connection
Rehearse a sequence diagram for login on paper.

---

## Question: How do you authorize API endpoints on the backend?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Auth questions are standard in project deep dives; weak answers suggest security risk in production.

### Answer
Middleware reads token, attaches user, role check per route; 401 vs 403 distinction.

### Example
"library seat-booking system: bookingId DELETE checks booking.userId === req.user.id."

### Follow-up Questions
- Refresh token rotation?
- CSRF with cookies?
- Multi-device logout?

### Common Mistakes
- Auth only on client
- Plaintext passwords
- Admin flag in JWT without server check

### Project Connection
Rehearse a sequence diagram for login on paper.

---

## Question: How do you handle forgotten password / reset flow?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Auth questions are standard in project deep dives; weak answers suggest security risk in production.

### Answer
Reset token hashed in DB, short expiry, email link, one-time use, no user enumeration in messages.

### Example
"e-commerce clone: Reset token SHA-256 in DB, 15 min expiry, neutral API message."

### Follow-up Questions
- Refresh token rotation?
- CSRF with cookies?
- Multi-device logout?

### Common Mistakes
- Auth only on client
- Plaintext passwords
- Admin flag in JWT without server check

### Project Connection
Rehearse a sequence diagram for login on paper.

---

## Question: What happens when a token or session expires?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Auth questions are standard in project deep dives; weak answers suggest security risk in production.

### Answer
Refresh flow or re-login; graceful 401 handling on client; queue requests optional.

### Example
"college event management app: Access token 15m, refresh 7d; axios interceptor refreshes once."

### Follow-up Questions
- Refresh token rotation?
- CSRF with cookies?
- Multi-device logout?

### Common Mistakes
- Auth only on client
- Plaintext passwords
- Admin flag in JWT without server check

### Project Connection
Rehearse a sequence diagram for login on paper.

---

## Question: How would you add Google OAuth to your project?

### Difficulty
🔴 Hard

### Why Interviewers Ask This
Auth questions are standard in project deep dives; weak answers suggest security risk in production.

### Answer
OAuth callback route, link existing email, store provider id, still set session cookie.

### Example
"e-commerce clone: Would add /auth/google with passport-google-oauth20 and merge accounts by email."

### Follow-up Questions
- Refresh token rotation?
- CSRF with cookies?
- Multi-device logout?

### Common Mistakes
- Auth only on client
- Plaintext passwords
- Admin flag in JWT without server check

### Project Connection
Rehearse a sequence diagram for login on paper.

---

## Question: What auth-related bugs or issues did you fix?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Auth questions are standard in project deep dives; weak answers suggest security risk in production.

### Answer
Honest story: e.g., fixed JWT in localStorage moved to httpOnly; role check missing on DELETE.

### Example
"library seat-booking system: Found students could hit /admin/users by URL — added role middleware on all /admin routes."

### Follow-up Questions
- Refresh token rotation?
- CSRF with cookies?
- Multi-device logout?

### Common Mistakes
- Auth only on client
- Plaintext passwords
- Admin flag in JWT without server check

### Project Connection
Rehearse a sequence diagram for login on paper.

---

## Question: How do you prevent IDOR (insecure direct object reference)?

### Difficulty
🔴 Hard

### Why Interviewers Ask This
Auth questions are standard in project deep dives; weak answers suggest security risk in production.

### Answer
Always check resource owner id matches auth user unless admin; never trust client-sent userId alone.

### Example
"e-commerce clone: GET /orders/:id returns 404 if order.userId !== current user."

### Follow-up Questions
- Refresh token rotation?
- CSRF with cookies?
- Multi-device logout?

### Common Mistakes
- Auth only on client
- Plaintext passwords
- Admin flag in JWT without server check

### Project Connection
Rehearse a sequence diagram for login on paper.

---

# Database design & queries

## Question: Explain your database schema / ERD.

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Schema questions test real ownership of data model.

### Answer
Walk through core tables, PKs, FKs, cardinality, and one tricky relationship.

### Example
"library seat-booking system: users, seats, bookings (user_id, seat_id, slot); unique constraint on seat+slot."

### Follow-up Questions
- One-to-many vs many-to-many?
- Soft delete?
- Audit tables?

### Common Mistakes
- Cannot draw ERD
- No foreign keys
- Everything in one table

### Project Connection
Export ERD from dbdiagram.io or ORM tool.

---

## Question: Why did you normalize (or denormalize) certain tables?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Normalization tradeoffs separate juniors who only use ORM.

### Answer
Explain 3NF for transactional data; denormalize for read-heavy dashboards with tradeoff.

### Example
"e-commerce clone: Order line items snapshot price at purchase — denormalized to keep history if product price changes."

### Follow-up Questions
- When is JSON column ok?
- Cache vs denormalize?

### Common Mistakes
- Denormalize everything
- No reason for duplicate data

### Project Connection
Point to one column you duplicated on purpose.

---

## Question: What indexes did you add and why?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Indexes show performance awareness.

### Answer
List indexes on FK and filter columns; explain EXPLAIN if you used it.

### Example
"e-commerce clone: Index on products(category_id, created_at) for catalog sort."

### Follow-up Questions
- Too many indexes?
- Partial indexes?

### Common Mistakes
- Index every column
- No indexes on FK

### Project Connection
Run EXPLAIN on your slowest query before interview.

---

## Question: Write or explain a important SQL query in your project.

### Difficulty
🟡 Medium

### Why Interviewers Ask This
They may ask you to sketch SQL live.

### Answer
Pick JOIN + WHERE + GROUP BY query; explain in plain English.

### Example
"college event management app: COUNT registrations per event JOIN events WHERE status=approved GROUP BY event_id."

### Follow-up Questions
- Subquery vs join?
- Window functions?

### Common Mistakes
- Cannot explain your own query
- SELECT * in production code only

### Project Connection
Memorize one reporting query from your app.

---

## Question: How do you handle database migrations?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Migrations prove team-ready workflow.

### Answer
Tool (Prisma, Flyway, Alembic), up/down, never edit prod manually.

### Example
"library seat-booking system: Prisma migrate; migration 003 added unique (seat_id, slot_start)."

### Follow-up Questions
- Failed migration on deploy?
- Zero-downtime migrations?

### Common Mistakes
- Manual prod schema edits
- No migration history

### Project Connection
Show migration that fixed a production bug.

---

## Question: How do you seed development data?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Seeding speeds demos and tests.

### Answer
seed.js script, faker data, idempotent seeds, separate from prod.

### Example
"e-commerce clone: npm run seed creates 50 products and test user buyer@sandbox.local."

### Follow-up Questions
- PII in seeds?
- Prod data copy?

### Common Mistakes
- Seed passwords committed
- Non-idempotent seeds break CI

### Project Connection
Document seed credentials in README for evaluators.

---

## Question: How do you prevent duplicate bookings or race conditions?

### Difficulty
🔴 Hard

### Why Interviewers Ask This
Concurrency is a favorite follow-up.

### Answer
Unique constraints, transactions, SELECT FOR UPDATE, or optimistic locking version field.

### Example
"library seat-booking system: BEGIN; check seat free; INSERT booking; COMMIT; unique violation returns friendly error."

### Follow-up Questions
- Load test result?
- Retry logic?

### Common Mistakes
- Check-then-act race
- No unique constraint

### Project Connection
Demo two tabs booking same seat if safe environment.

---

## Question: What is a transaction you used and why?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Transactions show ACID understanding.

### Answer
Describe multi-step operation that must all succeed or roll back.

### Example
"e-commerce clone: Order creation debits inventory and inserts order rows in one transaction."

### Follow-up Questions
- Isolation levels?
- Distributed transactions?

### Common Mistakes
- Transaction for single INSERT only
- No rollback handling

### Project Connection
Name one failure case that rollback saved.

---

## Question: How would you backup and restore your database?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Ops basics for projects with real data.

### Answer
pg_dump schedule, restore drill, managed DB backups.

### Example
"college event management app: Render Postgres automatic backups; I practiced restore to local once."

### Follow-up Questions
- RPO/RTO?
- Point-in-time recovery?

### Common Mistakes
- No backup plan
- Only export CSV manually

### Project Connection
Know your provider backup retention.

---

## Question: N+1 query problem — did you have it? How did you fix it?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
ORM performance classic.

### Answer
Describe N+1, eager loading, dataloader pattern.

### Example
"e-commerce clone: Product list N+1 on category — fixed with include/category join."

### Follow-up Questions
- Monitoring queries?
- Caching query results?

### Common Mistakes
- Ignore slow lists
- Blame ORM without profiling

### Project Connection
Enable query logging once and note slow query.

---

## Question: How do you paginate large lists?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Pagination UX and DB load.

### Answer
Offset/limit vs cursor; default page size; total count cost.

### Example
"e-commerce clone: Cursor pagination on created_at for infinite scroll; limit 20."

### Follow-up Questions
- Deep offset problem?
- Server-driven filters?

### Common Mistakes
- Return all rows
- No index on sort column

### Project Connection
Show API params page/limit in docs.

---

# API design

## Question: How did you design your REST API endpoints?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
API design reveals how you collaborate with frontend and mobile devs.

### Answer
Resource naming, HTTP verbs, plural nouns, nested routes sparingly.

### Example
"e-commerce clone: /products, /cart/items, /orders — nouns, verbs via HTTP method."

### Follow-up Questions
- REST vs RPC style?
- HATEOAS?
- Webhooks design?

### Common Mistakes
- GET with body
- 200 on error
- Inconsistent naming

### Project Connection
Maintain a one-page API cheat sheet for interviews.

---

## Question: What status codes does your API return and when?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
API design reveals how you collaborate with frontend and mobile devs.

### Answer
200/201/204, 400 validation, 401 auth, 403 forbidden, 404 not found, 409 conflict, 500 server.

### Example
"library seat-booking system: 409 when seat already booked; 401 missing cookie; 422 validation errors array."

### Follow-up Questions
- REST vs RPC style?
- HATEOAS?
- Webhooks design?

### Common Mistakes
- GET with body
- 200 on error
- Inconsistent naming

### Project Connection
Maintain a one-page API cheat sheet for interviews.

---

## Question: How do you validate request bodies?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
API design reveals how you collaborate with frontend and mobile devs.

### Answer
Zod/Joi/class-validator on server; never trust client; consistent error shape.

### Example
"college event management app: Zod schema on POST /events; strip unknown keys."

### Follow-up Questions
- REST vs RPC style?
- HATEOAS?
- Webhooks design?

### Common Mistakes
- GET with body
- 200 on error
- Inconsistent naming

### Project Connection
Maintain a one-page API cheat sheet for interviews.

---

## Question: How is API versioning handled?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
API design reveals how you collaborate with frontend and mobile devs.

### Answer
URL /v1, header, or no version yet with plan before breaking changes.

### Example
"e-commerce clone: No version yet; would add /v1 before mobile app ships."

### Follow-up Questions
- REST vs RPC style?
- HATEOAS?
- Webhooks design?

### Common Mistakes
- GET with body
- 200 on error
- Inconsistent naming

### Project Connection
Maintain a one-page API cheat sheet for interviews.

---

## Question: How do you document your API?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
API design reveals how you collaborate with frontend and mobile devs.

### Answer
Swagger/OpenAPI, Postman collection, README table.

### Example
"college event management app: Postman collection linked in README; examples for each role."

### Follow-up Questions
- REST vs RPC style?
- HATEOAS?
- Webhooks design?

### Common Mistakes
- GET with body
- 200 on error
- Inconsistent naming

### Project Connection
Maintain a one-page API cheat sheet for interviews.

---

## Question: What is your error response JSON shape?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
API design reveals how you collaborate with frontend and mobile devs.

### Answer
{ code, message, details[] } — no stack trace to client in prod.

### Example
"e-commerce clone: { "error": { "code": "OUT_OF_STOCK", "message": "..." } }".

### Follow-up Questions
- REST vs RPC style?
- HATEOAS?
- Webhooks design?

### Common Mistakes
- GET with body
- 200 on error
- Inconsistent naming

### Project Connection
Maintain a one-page API cheat sheet for interviews.

---

## Question: How do you handle pagination and filtering query params?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
API design reveals how you collaborate with frontend and mobile devs.

### Answer
?page=&limit=&sort=&filter=

### Example
"e-commerce clone: /products?category=books&minPrice=10&page=2".

### Follow-up Questions
- REST vs RPC style?
- HATEOAS?
- Webhooks design?

### Common Mistakes
- GET with body
- 200 on error
- Inconsistent naming

### Project Connection
Maintain a one-page API cheat sheet for interviews.

---

## Question: Rate limiting — do you have it?

### Difficulty
🔴 Hard

### Why Interviewers Ask This
API design reveals how you collaborate with frontend and mobile devs.

### Answer
express-rate-limit or gateway; per IP; 429 response.

### Example
"college event management app: 100 req/15min per IP on /auth/login to reduce brute force."

### Follow-up Questions
- REST vs RPC style?
- HATEOAS?
- Webhooks design?

### Common Mistakes
- GET with body
- 200 on error
- Inconsistent naming

### Project Connection
Maintain a one-page API cheat sheet for interviews.

---

## Question: How do you handle file download endpoints?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
API design reveals how you collaborate with frontend and mobile devs.

### Answer
Correct Content-Type, Content-Disposition, auth check.

### Example
"library seat-booking system: GET /receipts/:id returns PDF stream after ownership check."

### Follow-up Questions
- REST vs RPC style?
- HATEOAS?
- Webhooks design?

### Common Mistakes
- GET with body
- 200 on error
- Inconsistent naming

### Project Connection
Maintain a one-page API cheat sheet for interviews.

---

## Question: Idempotency for payments or critical POSTs?

### Difficulty
🔴 Hard

### Why Interviewers Ask This
API design reveals how you collaborate with frontend and mobile devs.

### Answer
Idempotency-Key header, store key result, safe retries.

### Example
"e-commerce clone: POST /payments with Idempotency-Key stored 24h — retry safe on network fail."

### Follow-up Questions
- REST vs RPC style?
- HATEOAS?
- Webhooks design?

### Common Mistakes
- GET with body
- 200 on error
- Inconsistent naming

### Project Connection
Maintain a one-page API cheat sheet for interviews.

---

# Error handling

## Question: How do you handle errors on the backend?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Consistent server errors reduce debugging time and improve UX.

### Answer
Central error middleware; operational vs programmer errors; log with request id; return safe messages.

### Example
"e-commerce clone: Express error handler maps ZodError to 400 and logs 500 with stack server-side only."

### Follow-up Questions
- Custom error classes?
- Sentry integration?
- Retry for transient DB errors?

### Common Mistakes
- try/catch in every route with duplicate code
- Stack trace to client in prod

### Project Connection
Show your error middleware file.

---

## Question: How do you show errors to users on the frontend?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
UX and security balance.

### Answer
Toast vs inline field errors; map API codes; generic message for 500; retry actions.

### Example
"college event management app: Registration shows field errors from details[]; 500 shows Something went wrong with support email."

### Follow-up Questions
- Optimistic UI rollback?
- Network offline?
- Form accessibility for errors?

### Common Mistakes
- alert() only
- Show raw SQL errors

### Project Connection
Demo a validation error live in interview.

---

## Question: How do you log errors and debug production issues?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Observability basics.

### Answer
Structured logs, levels, correlation id, Sentry/Logtail; no secrets in logs.

### Example
"library seat-booking system: Winston JSON logs; requestId middleware; Sentry free tier on API."

### Follow-up Questions
- PII in logs?
- Log retention?
- Alerting?

### Common Mistakes
- console.log only in prod
- Log passwords on failed login

### Project Connection
Know where to find logs on your host.

---

## Question: What happens if the database is down?

### Difficulty
🔴 Hard

### Why Interviewers Ask This
Resilience storytelling.

### Answer
Health check fails; 503 to clients; graceful message; retries with backoff; circuit breaker optional.

### Example
"e-commerce clone: /health checks DB ping; UI banner if API returns 503 on bootstrap."

### Follow-up Questions
- Fallback cache?
- Maintenance page?

### Common Mistakes
- Infinite hang
- Crash whole Node process on first query fail

### Project Connection
Implement /health if you have not.

---

## Question: How do you handle third-party API failures (payment, email)?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Distributed system reality.

### Answer
Timeouts, retries idempotent, user-visible state, queue for retry, admin alert.

### Example
"e-commerce clone: Payment gateway timeout → order stays pending; user can retry; webhook eventually reconciles."

### Follow-up Questions
- Dead letter queue?
- Compensating transaction?

### Common Mistakes
- Mark order paid without confirmation
- No timeout on fetch

### Project Connection
Walk through failed payment happy-unhappy path.

---

## Question: Global vs local error handling in React — what did you do?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Frontend architecture.

### Answer
Error boundaries for render errors; try/catch in async handlers; React Query error states.

### Example
"college event management app: Error boundary on route level; React Query shows error UI on failed fetch."

### Follow-up Questions
- error boundary limitations?
- Reporting to Sentry?

### Common Mistakes
- No loading/error state
- White screen on throw

### Project Connection
Show a component with loading/error/success trinity.

---

# Security

## Question: What security measures did you implement?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Security gaps in student projects are common; interviewers want awareness.

### Answer
HTTPS, helmet, rate limit, authz, validation, dependency audit npm audit, least privilege DB user.

### Example
"e-commerce clone: helmet, rate limit on auth, bcrypt, role checks, npm audit in CI."

### Follow-up Questions
- HTTPS everywhere?
- Dependency vulnerabilities?
- Security vs deadline?

### Common Mistakes
- Security through obscurity
- Disabled CORS * with credentials
- Secrets in Git history

### Project Connection
Run npm audit and fix one real vulnerability before interview.

---

## Question: How do you prevent SQL injection?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Security gaps in student projects are common; interviewers want awareness.

### Answer
Parameterized queries/ORM; never string concat SQL; escape only as last resort.

### Example
"library seat-booking system: Prisma parameterized; one raw query uses $1 placeholders."

### Follow-up Questions
- HTTPS everywhere?
- Dependency vulnerabilities?
- Security vs deadline?

### Common Mistakes
- Security through obscurity
- Disabled CORS * with credentials
- Secrets in Git history

### Project Connection
Run npm audit and fix one real vulnerability before interview.

---

## Question: How do you mitigate XSS?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Security gaps in student projects are common; interviewers want awareness.

### Answer
Escape output, CSP, avoid dangerouslySetInnerHTML, sanitize markdown if any.

### Example
"college event management app: React escapes by default; CSP via helmet limits inline scripts."

### Follow-up Questions
- HTTPS everywhere?
- Dependency vulnerabilities?
- Security vs deadline?

### Common Mistakes
- Security through obscurity
- Disabled CORS * with credentials
- Secrets in Git history

### Project Connection
Run npm audit and fix one real vulnerability before interview.

---

## Question: How do you handle CSRF for cookie-based auth?

### Difficulty
🔴 Hard

### Why Interviewers Ask This
Security gaps in student projects are common; interviewers want awareness.

### Answer
SameSite cookies, CSRF token for state-changing requests if cookie session.

### Example
"e-commerce clone: SameSite=strict on session cookie; CSRF token on POST forms if using cookies."

### Follow-up Questions
- HTTPS everywhere?
- Dependency vulnerabilities?
- Security vs deadline?

### Common Mistakes
- Security through obscurity
- Disabled CORS * with credentials
- Secrets in Git history

### Project Connection
Run npm audit and fix one real vulnerability before interview.

---

## Question: What HTTP security headers did you set?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Security gaps in student projects are common; interviewers want awareness.

### Answer
helmet: CSP, X-Frame-Options, HSTS on prod.

### Example
"college event management app: helmet defaults on API; HSTS from hosting provider."

### Follow-up Questions
- HTTPS everywhere?
- Dependency vulnerabilities?
- Security vs deadline?

### Common Mistakes
- Security through obscurity
- Disabled CORS * with credentials
- Secrets in Git history

### Project Connection
Run npm audit and fix one real vulnerability before interview.

---

## Question: How are secrets managed?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Security gaps in student projects are common; interviewers want awareness.

### Answer
.env + platform secrets; rotate on leak; no keys in client bundle.

### Example
"e-commerce clone: Razorpay secret only on server; .env.example without values."

### Follow-up Questions
- HTTPS everywhere?
- Dependency vulnerabilities?
- Security vs deadline?

### Common Mistakes
- Security through obscurity
- Disabled CORS * with credentials
- Secrets in Git history

### Project Connection
Run npm audit and fix one real vulnerability before interview.

---

## Question: Input sanitization — what do you validate?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Security gaps in student projects are common; interviewers want awareness.

### Answer
Whitelist types, lengths, enums; server-side always; upload MIME verify.

### Example
"college event management app: Event title max 120 chars; date ISO validated."

### Follow-up Questions
- HTTPS everywhere?
- Dependency vulnerabilities?
- Security vs deadline?

### Common Mistakes
- Security through obscurity
- Disabled CORS * with credentials
- Secrets in Git history

### Project Connection
Run npm audit and fix one real vulnerability before interview.

---

## Question: How do you secure file uploads?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Security gaps in student projects are common; interviewers want awareness.

### Answer
Size cap, allowlist extensions, store outside web root, virus scan optional.

### Example
"college event management app: Posters: jpeg/png only, 2MB, Cloudinary unsigned preset restricted."

### Follow-up Questions
- HTTPS everywhere?
- Dependency vulnerabilities?
- Security vs deadline?

### Common Mistakes
- Security through obscurity
- Disabled CORS * with credentials
- Secrets in Git history

### Project Connection
Run npm audit and fix one real vulnerability before interview.

---

## Question: What is your CORS policy?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Security gaps in student projects are common; interviewers want awareness.

### Answer
Allow only frontend origin in prod; credentials true only if needed.

### Example
"library seat-booking system: CORS allow https://myapp.vercel.app only in production."

### Follow-up Questions
- HTTPS everywhere?
- Dependency vulnerabilities?
- Security vs deadline?

### Common Mistakes
- Security through obscurity
- Disabled CORS * with credentials
- Secrets in Git history

### Project Connection
Run npm audit and fix one real vulnerability before interview.

---

## Question: How would you conduct a basic security review of your project?

### Difficulty
🔴 Hard

### Why Interviewers Ask This
Security gaps in student projects are common; interviewers want awareness.

### Answer
OWASP top 10 checklist, npm audit, manual authz test, dependency updates.

### Example
"e-commerce clone: Ran OWASP ZAP baseline; fixed missing auth on export endpoint."

### Follow-up Questions
- HTTPS everywhere?
- Dependency vulnerabilities?
- Security vs deadline?

### Common Mistakes
- Security through obscurity
- Disabled CORS * with credentials
- Secrets in Git history

### Project Connection
Run npm audit and fix one real vulnerability before interview.

---

# Deployment & DevOps

## Question: How did you deploy your application?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Prove the project is not localhost-only.

### Answer
Frontend host, API host, DB host, DNS, HTTPS, env vars, build command.

### Example
"e-commerce clone: Git push → Vercel builds React; Render deploys Dockerless Node; Neon Postgres."

### Follow-up Questions
- Blue-green?
- Rollback process?
- Build failures?

### Common Mistakes
- Never deployed
- Manual FTP upload with no process

### Project Connection
Memorize deploy URLs and last deploy date.

---

## Question: What is your CI/CD pipeline?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Automation signal.

### Answer
GitHub Actions: lint, test, build on PR; optional deploy on main.

### Example
"library seat-booking system: Actions run eslint + jest on PR; main auto-deploys to Render."

### Follow-up Questions
- Secrets in CI?
- Required checks?
- Deploy approval?

### Common Mistakes
- No CI
- CI that always passes empty

### Project Connection
Show green workflow run screenshot.

---

## Question: How do you manage environment variables across environments?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Config discipline.

### Answer
dev .env.local; staging/prod in platform; document required keys.

### Example
"college event management app: .env.example lists 8 vars; production set in Vercel/Render dashboards."

### Follow-up Questions
- Rotating secrets?
- Client-exposed vars?

### Common Mistakes
- NEXT_PUBLIC_ for secrets
- Committed .env

### Project Connection
Explain difference public vs server env vars.

---

## Question: How do you run database migrations on deploy?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Common production footgun.

### Answer
Migration step in CI/CD before traffic; backup first; backward compatible migrations.

### Example
"e-commerce clone: Render pre-deploy hook runs prisma migrate deploy."

### Follow-up Questions
- Failed migration rollback?
- Long migrations?

### Common Mistakes
- Manual SQL in prod console
- Migrate without backup

### Project Connection
Practice migrate on staging clone.

---

## Question: What monitoring or health checks do you have?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Ops maturity.

### Answer
/health endpoint, uptime robot, basic metrics, error tracking.

### Example
"college event management app: UptimeRobot pings /health; Sentry for API exceptions."

### Follow-up Questions
- SLA?
- Alert fatigue?
- Logs vs metrics?

### Common Mistakes
- No idea if site is down
- Health check without DB

### Project Connection
Open monitoring dashboard during interview if allowed.

---

## Question: How do you handle static assets and CDN?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Performance and caching.

### Answer
Vercel/CloudFront serves static; cache headers; image optimization.

### Example
"e-commerce clone: Vercel CDN for JS/CSS; long cache hashed filenames."

### Follow-up Questions
- Cache busting?
- Image CDN?

### Common Mistakes
- Huge unoptimized images in repo
- No cache headers

### Project Connection
Check Network tab cache headers once.

---

## Question: Domain, DNS, and HTTPS — how did you set them up?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Real-world polish.

### Answer
Custom domain, A/CNAME records, auto TLS from host.

### Example
"library seat-booking system: Custom subdomain on college club domain; CNAME to Vercel; TLS automatic."

### Follow-up Questions
- Certificate renewal?
- WWW redirect?

### Common Mistakes
- HTTP only
- Cannot explain DNS record type

### Project Connection
Know whether you use A or CNAME.

---

## Question: What is your rollback strategy if a deploy breaks production?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Incident response.

### Answer
Redeploy previous git tag, feature flag off, DB migration revert plan.

### Example
"e-commerce clone: Render one-click rollback to previous image; hotfix branch within 30 minutes once."

### Follow-up Questions
- Database backward compatible?
- Feature flags?

### Common Mistakes
- Panic edit on prod
- No tagged releases

### Project Connection
Tag release commits in Git.

---

## Question: How do you separate staging and production?

### Difficulty
🔴 Hard

### Why Interviewers Ask This
Environment hygiene.

### Answer
Separate DB, API keys (test mode), branches; promote after QA.

### Example
"e-commerce clone: Staging on preview deploy with test Stripe keys; prod only from main."

### Follow-up Questions
- Seed data in staging?
- Prod data copy legal issues?

### Common Mistakes
- Test payments in prod
- Same DB for staging and prod

### Project Connection
Demo staging URL if available.

---

# Scaling & performance

## Question: What are the performance bottlenecks in your project?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Shows profiling mindset.

### Answer
Identify slow API, heavy images, N+1, large bundles; how you measured (Lighthouse, Network tab).

### Example
"e-commerce clone: Lighthouse showed LCP 4.2s due to hero images — fixed with WebP and lazy load."

### Follow-up Questions
- Largest Contentful Paint?
- DB slow queries?

### Common Mistakes
- No measurement
- Blaming hosting only

### Project Connection
Bring before/after Lighthouse scores.

---

## Question: How did you optimize frontend load time?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Core web vitals awareness.

### Answer
Code splitting, lazy routes, image opt, bundle analyze, remove unused deps.

### Example
"college event management app: React.lazy for admin routes; cut initial bundle ~30%."

### Follow-up Questions
- SSR/SSG?
- Font loading?

### Common Mistakes
- Import entire lodash
- No lazy loading

### Project Connection
Run bundle analyzer once.

---

## Question: How did you optimize database queries?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Backend performance.

### Answer
Indexes, EXPLAIN, pagination, select specific columns, caching.

### Example
"library seat-booking system: Added composite index; booking list query 800ms → 40ms locally."

### Follow-up Questions
- Read replicas?
- Connection pooling?

### Common Mistakes
- SELECT * on huge tables
- No pool in serverless

### Project Connection
Know your slowest endpoint latency.

---

## Question: Caching strategy at different layers?

### Difficulty
🔴 Hard

### Why Interviewers Ask This
CDN, HTTP cache, app cache, DB.

### Answer
What is cached, TTL, invalidation; what you would add at 10k users.

### Example
"e-commerce clone: CDN for static; would add Redis for product list at higher traffic."

### Follow-up Questions
- Cache invalidation hard problem?
- Stale data UX?

### Common Mistakes
- Cache everything forever
- Redis with no metrics

### Project Connection
Name one stale-data bug cache could cause.

---

## Question: Horizontal vs vertical scaling for your app?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Scaling vocabulary applied.

### Answer
Stateless API scales out; DB scales up or read replicas; session store external.

### Example
"e-commerce clone: Stateless Node instances behind load balancer; Postgres vertical first."

### Follow-up Questions
- Auto-scaling?
- Serverless limits?

### Common Mistakes
- Scale before measuring
- Stateful API on local disk

### Project Connection
Draw scale-out diagram simply.

---

## Question: How would you load test your application?

### Difficulty
🔴 Hard

### Why Interviewers Ask This
Validation beyond manual clicks.

### Answer
k6/Artillery scenarios, targets (RPS, p95), fix bottlenecks, test in staging.

### Example
"college event management app: k6 script on registration spike; found connection pool too small."

### Follow-up Questions
- Soak test?
- Stress test?

### Common Mistakes
- No load test ever
- Test only on laptop

### Project Connection
Run a small k6 script and mention results.

---

## Question: Database connection pooling — how does your app handle it?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Serverless and Node nuance.

### Answer
Pool size, Prisma/PgBouncer, serverless driver if applicable.

### Example
"library seat-booking system: Prisma pool max 10; documented for Render free tier limits."

### Follow-up Questions
- Too many connections?
- Idle timeout?

### Common Mistakes
- New connection per request
- Pool size unconfigured

### Project Connection
Know default pool settings.

---

## Question: What happens when your app grows from 100 to 100,000 users?

### Difficulty
🔴 Hard

### Why Interviewers Ask This
Roadmap thinking.

### Answer
Phases: optimize monolith, cache, CDN, DB tuning, split services, queue, observability.

### Example
"e-commerce clone: Phase 1 indexes + CDN; phase 2 Redis; phase 3 split payments worker."

### Follow-up Questions
- Cost estimate?
- Team size?

### Common Mistakes
- Jump to microservices day one
- No observability plan

### Project Connection
Tie growth plan to your actual modules.

---

## Question: How do you handle peak traffic (e.g., event day registration)?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Real spike scenario for student apps.

### Answer
Queue, rate limit, pre-scale, read-heavy caching, communicate wait time.

### Example
"college event management app: Opened registrations at fixed time; queued writes with optimistic UI; monitored CPU."

### Follow-up Questions
- DDoS vs real spike?
- Database locks?

### Common Mistakes
- No plan for fest day
- Crash without message

### Project Connection
Relate to your project's busiest day.

---

# Tradeoffs & decisions

## Question: What was the biggest technical tradeoff you made?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Tradeoff articulation is senior skill practiced early.

### Answer
Choose speed vs quality, consistency vs availability, build vs buy; explain both sides and decision.

### Example
"e-commerce clone: Used COD instead of live payments to ship on time; planned Stripe in v2."

### Follow-up Questions
- Would you decide same again?
- Stakeholder buy-in?

### Common Mistakes
- No tradeoffs ever
- Only downsides without upside

### Project Connection
Use format: We chose A over B because… at cost of…

---

## Question: Build vs buy for payment/email/maps?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Integration judgment.

### Answer
Stripe vs custom; SendGrid vs SMTP; justify risk and time.

### Example
"e-commerce clone: Razorpay test mode — PCI scope reduced; would not build card storage."

### Follow-up Questions
- Vendor lock-in?
- Cost at scale?

### Common Mistakes
- Build payment vault
- Skip email verification entirely

### Project Connection
List third parties and why not build.

---

## Question: Consistency vs speed of delivery?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Project management realism.

### Answer
Where you accepted tech debt with ticket to fix; where you refused shortcuts (auth).

### Example
"library seat-booking system: Shipped without email verify; refused to skip password hashing."

### Follow-up Questions
- Tech debt register?
- Refactor sprint?

### Common Mistakes
- All speed no quality
- Perfect code never shipped

### Project Connection
Show GitHub issue labeled tech-debt.

---

## Question: SQL vs NoSQL tradeoff in hindsight?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Reflect on data choice.

### Answer
Would you change? What broke or shined?

### Example
"college event management app: Postgres was right for relational registrations; JSON column for flexible form fields worked."

### Follow-up Questions
- Graph DB case?
- Event sourcing?

### Common Mistakes
- Religious SQL/NoSQL
- No hindsight

### Project Connection
Connect to one query that was easier due to SQL.

---

## Question: Monorepo vs separate repos?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Team workflow tradeoff.

### Answer
Sharing types vs simpler deploy; what you used.

### Example
"e-commerce clone: Separate repos for client/server; duplicated DTOs — monorepo would help types."

### Follow-up Questions
- Turborepo?
- Version coupling?

### Common Mistakes
- Monorepo with no tooling
- Cannot explain choice

### Project Connection
Align answer with your actual Git setup.

---

## Question: Client-side vs server-side rendering tradeoff?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Next.js style question even for SPAs.

### Answer
SEO, TTFB, interactivity, hosting complexity.

### Example
"e-commerce clone: CSR React ok for authenticated shop; would add SSR for product landing SEO."

### Follow-up Questions
- Hydration cost?
- Partial prerender?

### Common Mistakes
- SSR everything without reason
- SPA for public blog content

### Project Connection
Know which pages are public vs private.

---

## Question: Optimistic UI vs wait for server?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
UX vs correctness.

### Answer
When you optimistically updated and rolled back on error.

### Example
"library seat-booking system: Optimistic seat hold with rollback if 409 conflict."

### Follow-up Questions
- Double submit?
- Offline queue?

### Common Mistakes
- Optimistic on payment
- Never show loading state

### Project Connection
Demo rollback behavior.

---

## Question: Strict TypeScript vs faster JavaScript?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Velocity tradeoff.

### Answer
Where types saved you; where you used any temporarily.

### Example
"college event management app: Strict on API contracts; relaxed on one legacy util during crunch."

### Follow-up Questions
- Gradual strictNullChecks?
- Codegen from OpenAPI?

### Common Mistakes
- any everywhere
- Types as decoration

### Project Connection
Show typed API response interface.

---

## Question: Micro-optimizations you skipped?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Prioritization signal.

### Answer
Name things you did not do because low ROI: premature Redis, custom webpack.

### Example
"e-commerce clone: Skipped memoizing every component; profiled first, optimized list render only."

### Follow-up Questions
- When is memo worth it?
- Virtualization?

### Common Mistakes
- Optimized without profiling
- Ignored O(n^2) loop

### Project Connection
Mention one thing you profiled before fixing.

---

# Challenges faced

## Question: What was the hardest bug you fixed in this project?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Debugging stories show persistence and method.

### Answer
Symptom, hypothesis, tools, root cause, fix, prevention.

### Example
"e-commerce clone: Checkout total wrong — race on cart fetch; fixed with serializing updates and server-side recalc."

### Follow-up Questions
- Time spent?
- Help from others?
- Regression test?

### Common Mistakes
- Cannot remember any bug
- Vague 'it did not work'

### Project Connection
Prepare one 2-minute bug story.

---

## Question: Tell me about a technical challenge that almost made you miss the deadline.

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Pressure and problem solving.

### Answer
Scope cut, mentor help, pivot approach, extra time box.

### Example
"college event management app: Payment webhook signature verification failed until we matched raw body parser config."

### Follow-up Questions
- Communicate to stakeholders?
- Quality sacrificed?

### Common Mistakes
- Blame only tools
- No resolution

### Project Connection
End with what you learned for next project.

---

## Question: How did you handle conflicting requirements from teammates or mentor?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Soft + technical.

### Answer
Listen, document, prototype, decide with data or authority.

### Example
"library seat-booking system: Debate on 30 vs 60 min slots — surveyed 20 students, picked 60."

### Follow-up Questions
- Escalation?
- Documentation?

### Common Mistakes
- Avoided conversation
- Built both full versions

### Project Connection
Show requirements doc with decisions.

---

## Question: What did you not know at the start that you had to learn mid-project?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Learning agility.

### Answer
Pick one technology concept; resources used; how you applied it.

### Example
"e-commerce clone: Learned webhooks and idempotency while integrating payments."

### Follow-up Questions
- Tutorial hell?
- Docs vs video?

### Common Mistakes
- Knew everything claim
- No concrete resource

### Project Connection
Match to skills on resume.

---

## Question: How did you handle performance issues discovered late?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Late discovery realism.

### Answer
Measure, prioritize hot path, ship fix, defer polish.

### Example
"college event management app: Admin dashboard slow — missing index on registrations.event_id."

### Follow-up Questions
- Load test before?
- User complaints?

### Common Mistakes
- Ignore perf
- Rewrite entire stack

### Project Connection
Quantify improvement if possible.

---

## Question: Integration challenge between frontend and backend?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Contract mismatches common.

### Answer
CORS, date formats, null vs undefined, auth cookie domain.

### Example
"library seat-booking system: Dates as UTC ISO strings; fixed timezone display with date-fns-tz."

### Follow-up Questions
- Mock server?
- OpenAPI codegen?

### Common Mistakes
- Blame other team only
- No API contract

### Project Connection
Show Postman example matching UI.

---

## Question: Data migration or schema change challenge?

### Difficulty
🔴 Hard

### Why Interviewers Ask This
Schema evolution pain.

### Answer
Breaking change, backfill, dual write, downtime window.

### Example
"e-commerce clone: Split name into first/last — migration script backfilled from full_name."

### Follow-up Questions
- Zero downtime?
- Rollback plan?

### Common Mistakes
- Drop column without backup
- Manual prod edits

### Project Connection
Explain one migration file in detail.

---

## Question: Challenge deploying to production for the first time?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
First deploy learning curve.

### Answer
Env vars, build errors, CORS prod URL, DB SSL.

### Example
"college event management app: Prod DB required SSL — added ?sslmode=require to connection string."

### Follow-up Questions
- Who helped?
- Docs you wrote after?

### Common Mistakes
- Gave up on deploy
- Secrets in build log

### Project Connection
Turn deploy steps into README checklist.

---

## Question: What non-technical challenge did you face?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Holistic project experience.

### Answer
Time management, team coordination, motivation, exams.

### Example
"library seat-booking system: Exams overlapped week 7 — renegotiated scope with guide to drop PDF export."

### Follow-up Questions
- Communication tools?
- Risk early warning?

### Common Mistakes
- Only technical answers
- Trash teammates

### Project Connection
Show maturity and accountability.

---

# Future improvements

## Question: What features would you add in version 2?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Product thinking and backlog.

### Answer
Prioritize by user value and risk; 3–5 features with why.

### Example
"e-commerce clone: v2: Stripe live mode, product reviews, admin analytics dashboard."

### Follow-up Questions
- MoSCoW prioritization?
- User requests?

### Common Mistakes
- Infinite feature list
- Only cosmetic changes

### Project Connection
Link v2 to user feedback you received.

---

## Question: What technical debt would you pay down first?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Maintainability focus.

### Answer
Name debt, interest (bugs slowed), payment plan.

### Example
"college event management app: Extract god-component EventForm into hooks + smaller components; add tests."

### Follow-up Questions
- How track debt?
- When pay down?

### Common Mistakes
- No debt exists
- Rewrite from scratch

### Project Connection
Point to a messy file you know needs refactor.

---

## Question: How would you make your project production-ready for real users?

### Difficulty
🔴 Hard

### Why Interviewers Ask This
Gap between demo and prod.

### Answer
Tests, monitoring, security review, backups, legal (privacy), SLAs.

### Example
"library seat-booking system: Add rate limits, privacy policy, audit logs, on-call rotation — not needed for college demo."

### Follow-up Questions
- Compliance?
- Multi-tenant?

### Common Mistakes
- Ship demo as-is to public
- Ignore legal/privacy

### Project Connection
List top 5 prod gaps honestly.

---

## Question: Would you migrate to a different stack? Why or why not?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Strategic thinking.

### Answer
Cost of rewrite vs incremental improvements; when migration justified.

### Example
"e-commerce clone: Keep React/Node; would add Next.js incrementally for SEO pages only."

### Follow-up Questions
- Team skills?
- Hiring?

### Common Mistakes
- Rewrite for hype
- Never evolve stack

### Project Connection
Show incremental path not big bang.

---

## Question: How would you add mobile apps to your project?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
API-first validation.

### Answer
Reuse API; React Native/Flutter; auth token flow; push notifications later.

### Example
"college event management app: Mobile app would consume same JWT API; add push for event reminders."

### Follow-up Questions
- GraphQL needed?
- Offline mode?

### Common Mistakes
- Duplicate business logic in app
- No API versioning plan

### Project Connection
Emphasize API you already built.

---

## Question: What analytics or metrics would you add?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Data-informed product.

### Answer
Event tracking, funnel, error rates, business KPIs.

### Example
"e-commerce clone: Track add-to-cart → checkout → paid funnel with Plausible or PostHog."

### Follow-up Questions
- Privacy GDPR?
- Sampling?

### Common Mistakes
- Track everything PII
- No metrics

### Project Connection
Pick one KPI your users care about.

---

# Team project / your contribution

## Question: What was your specific contribution to the team project?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Ownership clarity.

### Answer
Percent or modules: APIs you wrote, UI flows, DevOps, testing, docs.

### Example
"college event management app: I owned registration API, payment webhook, and deployment docs — ~40% of backend."

### Follow-up Questions
- How decided tasks?
- Cross-help?

### Common Mistakes
- We did everything together vagueness
- Credit others' work

### Project Connection
List 3 PRs that are clearly yours.

---

## Question: How did you divide work in your team?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Planning and interfaces.

### Answer
Split by layer or feature; API contract meeting; shared board.

### Example
"e-commerce clone: Feature slices: I did cart+checkout, teammate did catalog admin."

### Follow-up Questions
- Integration points?
- Code review?

### Common Mistakes
- No division until last week
- Overlapping edits daily

### Project Connection
Show GitHub contributor graph if accurate.

---

## Question: How did you handle a teammate who was not pulling their weight?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Mature conflict without drama.

### Answer
Private talk, clarify tasks, involve mentor if needed, document.

### Example
"library seat-booking system: Teammate missed API deadlines — split tasks smaller and paired for two sessions."

### Follow-up Questions
- Escalate when?
- Carry whole project?

### Common Mistakes
- Public shaming
- Do nothing then complain to interviewer

### Project Connection
Focus on project outcome not personal attack.

---

## Question: Code review process in your team?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Quality culture.

### Answer
PR template, review checklist, what you looked for.

### Example
"e-commerce clone: PR needs screenshot, test steps; I check auth and SQL injection patterns."

### Follow-up Questions
- Review turnaround?
- Disagreements?

### Common Mistakes
- No reviews
- Merge without reading

### Project Connection
Show example review comment you gave.

---

## Question: How did you integrate your module with others' code?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Integration skills.

### Answer
API contracts, mock servers, integration branch, end-to-end test.

### Example
"college event management app: Mocked payment service until webhook PR merged; weekly integration branch."

### Follow-up Questions
- Breaking changes?
- Versioning internal APIs?

### Common Mistakes
- Big bang merge
- No communication

### Project Connection
Describe one interface agreement.

---

## Question: What meetings or rituals did your team use?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Agile familiarity.

### Answer
Standup, sprint planning, retro — even lightweight for college.

### Example
"library seat-booking system: Twice-weekly 15-min standup on Discord; Notion board for tasks."

### Follow-up Questions
- Remote tools?
- Documentation?

### Common Mistakes
- No coordination
- Only chat chaos

### Project Connection
Map ritual to problem it solved.

---

## Question: If you could redo team dynamics, what would you change?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Reflection.

### Answer
Earlier integration, clearer roles, more pair programming.

### Example
"e-commerce clone: Start integration in week 3 not week 8; define OpenAPI first."

### Follow-up Questions
- Personality vs process?
- Team size?

### Common Mistakes
- Perfect team fiction
- Blame individuals harshly

### Project Connection
Keep constructive tone.

---

## Question: How did you document your work for teammates?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Communication.

### Answer
README, setup script, API docs, architecture diagram, handoff video.

### Example
"college event management app: 5-min Loom setup walkthrough reduced onboarding from 2 hours to 30 min."

### Follow-up Questions
- Onboarding new member?
- Comments in code?

### Common Mistakes
- Tribal knowledge only
- Outdated README

### Project Connection
Open README during screen share.

---

## Question: Presenting the project as a team — what was your part?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Presentation skills.

### Answer
Who demoed what; handling Q&A; backup if live demo fails.

### Example
"college event management app: I demoed payment flow; teammate covered admin; we had recorded backup video."

### Follow-up Questions
- Slide vs live demo?
- Division of slides?

### Common Mistakes
- Read slides only
- No dry run

### Project Connection
Practice handoff between speakers.

---

# Debugging stories

## Question: Walk me through how you debug a failing API request.

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Methodical debugging is daily work.

### Answer
Reproduce, Network tab/Postman, logs, isolate layer, fix, regression test.

### Example
"e-commerce clone: 401 on checkout — cookie not sent; fixed SameSite and proxy domain."

### Follow-up Questions
- curl vs Postman?
- Binary search commits?

### Common Mistakes
- Random changes
- No reproduction steps

### Project Connection
Live-demo Postman in interview if asked.

---

## Question: A bug only happens in production, not locally — what do you do?

### Difficulty
🔴 Hard

### Why Interviewers Ask This
Environment parity thinking.

### Answer
Compare env vars, data, HTTPS, CORS, build mode, logging, source maps.

### Example
"library seat-booking system: Prod-only bug: timezone on server UTC vs local IST — fixed display and tests."

### Follow-up Questions
- Staging env?
- Feature flags?

### Common Mistakes
- Cannot explain difference prod vs dev
- Debug only on prod with println

### Project Connection
Maintain parity checklist.

---

## Question: How do you debug React state issues?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Frontend depth.

### Answer
React DevTools, minimal repro, lift state, useEffect deps, stale closures.

### Example
"college event management app: Infinite loop from useEffect missing deps — fixed dependency array."

### Follow-up Questions
- Why did this render?
- Context overuse?

### Common Mistakes
- console.log everywhere no hypothesis
- Mutating state directly

### Project Connection
Prepare one React DevTools screenshot story.

---

## Question: Tell me about a time logs helped you find the root cause.

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Observability practice.

### Answer
What you logged, correlation id, log level, what you added after fix.

### Example
"e-commerce clone: Logged webhook payload hash mismatch — found body parser eating raw body."

### Follow-up Questions
- Structured logging?
- Too much logging?

### Common Mistakes
- No logs
- Logs with secrets

### Project Connection
Redact PII in log example.

---

## Question: How do you use Git to debug (bisect, blame)?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Version control as debugging tool.

### Answer
git bisect for regressions; blame to ask author; small commits help.

### Example
"library seat-booking system: git bisect found registration bug introduced in commit adding timezone lib."

### Follow-up Questions
- Revert vs fix forward?
- Cherry-pick hotfix?

### Common Mistakes
- One giant commit
- Never use bisect

### Project Connection
Show clean commit history message.

---

## Question: Debugging a slow page — what is your checklist?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Performance debugging.

### Answer
Network waterfall, bundle size, rerenders, API latency, images.

### Example
"e-commerce clone: Waterfall showed 6 serial API calls — batched into one endpoint."

### Follow-up Questions
- Chrome Performance tab?
- Backend traces?

### Common Mistakes
- Guess optimization
- Ignore backend

### Project Connection
Walk checklist top to bottom confidently.

---

# Testing

## Question: What tests did you write for your project?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Testing culture signal.

### Answer
Unit, integration, e2e counts; frameworks; what you prioritized.

### Example
"e-commerce clone: Jest unit tests for cart total; Supertest for POST /orders; one Playwright happy path."

### Follow-up Questions
- Coverage %?
- What not tested?

### Common Mistakes
- No tests
- Tests that assert true

### Project Connection
Run tests live if interview allows.

---

## Question: How do you test authentication flows?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Security-critical paths.

### Answer
Test protected routes 401/403; hash not exposed; cookie flags in integration test.

### Example
"library seat-booking system: Supertest with agent jar keeps cookie; student cannot DELETE others booking."

### Follow-up Questions
- Mock JWT?
- E2E login?

### Common Mistakes
- Skip auth tests
- Hardcode prod password in test

### Project Connection
Show one auth test file.

---

## Question: What is your approach to testing database code?

### Difficulty
🔴 Hard

### Why Interviewers Ask This
DB tests are tricky for students.

### Answer
Test DB, transactions rollback per test, factories, avoid prod DB.

### Example
"e-commerce clone: Testcontainers Postgres for integration; each test rolls back transaction."

### Follow-up Questions
- SQLite substitute?
- Seed in tests?

### Common Mistakes
- Tests hit production
- No isolation

### Project Connection
Explain test DB setup in README.

---

## Question: Manual vs automated testing — how did you balance?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Pragmatism.

### Answer
Manual test checklist for demo; automate regressions; exploratory testing.

### Example
"college event management app: Manual test script for fest day; automated tests for registration API."

### Follow-up Questions
- QA teammate?
- Bug bash?

### Common Mistakes
- Only manual
- Only unit no e2e

### Project Connection
Show test checklist doc if exists.

---

## Question: A test failed in CI but passes locally — what now?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Flaky test awareness.

### Answer
Timezone, env, race, port, parallel tests; fix determinism.

### Example
"library seat-booking system: CI failed on date test — set TZ=UTC in workflow."

### Follow-up Questions
- Retry in CI?
- Skip test?

### Common Mistakes
- Disable CI
- Ignore flake

### Project Connection
Share one flake fix story.

---

## Question: How would you improve test coverage if you had one more week?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Prioritized testing roadmap.

### Answer
Cover payment edge cases, authz, e2e critical path, contract tests.

### Example
"e-commerce clone: Add webhook signature tests and out-of-stock concurrent order test."

### Follow-up Questions
- Mutation testing?
- Snapshot tests?

### Common Mistakes
- 100% coverage goal blindly
- No plan

### Project Connection
Name highest-risk untested flow.

---

# Code quality & best practices

## Question: What coding standards or linting do you use?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Consistency and professionalism.

### Answer
ESLint, Prettier, husky pre-commit, CI lint step.

### Example
"e-commerce clone: ESLint airbnb-base + Prettier; lint-staged on pre-commit."

### Follow-up Questions
- Enforced in CI?
- Disagree with rule?

### Common Mistakes
- No formatter
- Lint disabled

### Project Connection
Show .eslintrc or eslint.config once.

---

## Question: How do you keep components and functions small and readable?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Maintainability.

### Answer
Single responsibility, extract hooks, naming, max file length guideline.

### Example
"college event management app: Split 400-line EventPage into EventHeader, RegistrationForm, useEvent hook."

### Follow-up Questions
- When not to split?
- Comments when?

### Common Mistakes
- God files
- Clever one-liners

### Project Connection
Open a refactored file in IDE.

---

## Question: How do you handle secrets and sensitive data in code?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Security hygiene.

### Answer
.gitignore, git-secrets scan, env vars, never log PII.

### Example
"library seat-booking system: Removed accidental API key from history with git filter-repo lesson learned."

### Follow-up Questions
- Pre-commit hooks?
- Vault?

### Common Mistakes
- Secrets in repo
- Keys in frontend

### Project Connection
Run git log --all -- '*.env' safely awareness.

---

## Question: Dependency management — how do you update packages?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Supply chain basics.

### Answer
npm audit, renovate/dependabot, read changelogs, test after bump.

### Example
"e-commerce clone: Monthly npm audit fix; locked package-lock; CI runs tests on bump."

### Follow-up Questions
- Pin versions?
- Breaking major upgrades?

### Common Mistakes
- Never update
- npm install latest always

### Project Connection
Mention one security advisory you fixed.

---

## Question: How do you write README and setup docs for contributors?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Docs as part of quality.

### Answer
Prereqs, env copy, migrate seed run, scripts table, architecture link.

### Example
"college event management app: README: clone, cp .env.example, docker optional, npm run dev, test, deploy links."

### Follow-up Questions
- Troubleshooting section?
- Screenshots?

### Common Mistakes
- README default template only
- Wrong setup steps

### Project Connection
Ask friend to setup from README timed.

---

## Question: Refactoring you are proud of?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Shows growth.

### Answer
Before/after, metric (lines, bugs), tests added.

### Example
"e-commerce clone: Moved pricing logic from React to server service — single source of truth, fewer client bugs."

### Follow-up Questions
- When to refactor?
- Boy scout rule?

### Common Mistakes
- Refactor with no tests
- Cannot explain benefit

### Project Connection
Before/after diagram optional.

---

