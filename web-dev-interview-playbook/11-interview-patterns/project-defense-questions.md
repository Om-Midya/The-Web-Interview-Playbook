# Project Defense Question Patterns

> 20 patterns interviewers use to probe your project. Prepare these before any technical round.

Pair with [08-project-interview-bible](../08-project-interview-bible/) when available.

---

## Question: Why did you choose this tech stack?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Opening project defense question.

### Answer
Answer with problem → constraints → choices. Mention team familiarity, time, deployment, and one alternative you rejected.

### Example
Needed fast CRUD + React job skills → MERN. Considered Firebase, wanted own API control.

### Follow-up Questions
- Why not X?
- Would you change?
- Hardest integration?

### Common Mistakes
Tutorial stack copy with no reasoning.

### Project Connection
Write 3 sentences: problem, stack, one rejected alternative.

---

## Question: What was YOUR contribution vs teammates?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Ownership verification.

### Answer
Be specific: 'I built auth API and login UI' not 'we used React.' Percent optional if team project.

### Example
Team of 4: I owned payment integration and order status page.

### Follow-up Questions
- Conflict resolution?
- Git commits proof?
- What if solo?

### Common Mistakes
Vague 'we did everything.'

### Project Connection
List 3 files/features you wrote personally.

---

## Question: What was the hardest bug you fixed?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Depth and debugging proof.

### Answer
STAR format: symptom, investigation, root cause, fix, prevention.

### Example
CORS only in prod → wrong API env var; added CI env check.

### Follow-up Questions
- How long?
- Who helped?
- Test added?

### Common Mistakes
No real bug story; fabricated vague answer.

### Project Connection
Prepare one bug with console/network/log evidence path.

---

## Question: What would you improve with 2 more weeks?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Shows growth mindset.

### Answer
Pick 2-3 concrete improvements: tests, TypeScript, error handling, accessibility, performance — not rewrite entire app.

### Example
Add integration tests for auth, paginate admin table, lazy load images.

### Follow-up Questions
- Priority why?
- Tech debt list?
- Metrics?

### Common Mistakes
Say 'nothing' or 'rebuild in Next' without specifics.

### Project Connection
Honest top 3 from your README todo list.

---

## Question: How does data flow in your application?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Architecture understanding.

### Answer
User action → event handler → API call → server validates → DB → response → state update → re-render.

### Example
Click Add Task → POST /api/tasks → Mongo insert → setTasks in React.

### Follow-up Questions
- Optimistic UI?
- Error path?
- Loading state?

### Common Mistakes
Can't trace one feature end-to-end.

### Project Connection
Draw flow for your main feature on paper.

---

## Question: How do you handle errors in your project?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Production readiness.

### Answer
Client: try/catch, user-friendly message, loading states. Server: validation, status codes, logging. Optional error boundary in React.

### Example
API returns { message: 'Invalid email' } 400; toast shows message.

### Follow-up Questions
- Global handler?
- Retry?
- Sentry?

### Common Mistakes
White screen on error; console.log only.

### Project Connection
Show one user-visible error handling example.

---

## Question: Why this database for this project?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Data model justification.

### Answer
Match data shape and access patterns. Relational integrity vs flexible documents.

### Example
Expense line items per user → Mongo embed categories; considered SQL for reports.

### Follow-up Questions
- Migrations?
- Indexes?
- Sample query?

### Common Mistakes
Default Mongo with relational data needing joins.

### Project Connection
One collection/table schema explained.

---

## Question: How did you handle authentication?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Security drill.

### Answer
Registration, hashing, token/session, protected routes, logout, where secrets live.

### Example
JWT in httpOnly cookie; middleware checks on /api/private/*.

### Follow-up Questions
- Refresh?
- OAuth?
- Password reset?

### Common Mistakes
Auth check only in React router.

### Project Connection
Walk login request byte-by-byte verbally.

---

## Question: What security measures did you implement?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Beyond basic auth.

### Answer
HTTPS, env secrets, input validation, helmet, rate limit, CORS restrict, no sensitive data in client.

### Example
express-validator on email, rate limit login 5/min.

### Follow-up Questions
- SQL injection?
- XSS?
- CSRF?

### Common Mistakes
Claim 'fully secure' with no specifics.

### Project Connection
Checklist: which apply to your project.

---

## Question: How did you test your application?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Quality awareness.

### Answer
Manual test cases, Postman collection, optional Jest/Vitest unit tests, React Testing Library for components.

### Example
Postman tests for auth flow; Vitest for util formatDate.

### Follow-up Questions
- CI tests?
- E2E?
- Coverage?

### Common Mistakes
Never opened app after coding.

### Project Connection
One test you'd write first if starting today.

---

## Question: How is your project deployed?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Ship proof.

### Answer
Frontend host, backend host, DB host, env vars, domain, CI/CD if any.

### Example
Vercel frontend + Railway API + Atlas MongoDB.

### Follow-up Questions
- Cold start?
- Env mismatch bugs?
- Rollback?

### Common Mistakes
Only localhost demo.

### Project Connection
Live URL and deploy steps in 5 bullets.

---

## Question: What happens when the API is down?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Resilience UX.

### Answer
Loading spinner, error message, retry button, optional cached data, don't infinite spin.

### Example
Error state component: 'Could not load tasks. Retry.'

### Follow-up Questions
- Offline?
- Timeout?
- Fallback data?

### Common Mistakes
Infinite loading spinner forever.

### Project Connection
Your error UI screenshot or description.

---

## Question: Why should we hire you based on this project?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Closing defense.

### Answer
Connect project to role: ownership, learning, problem solved, metrics if any.

### Example
Shipped full-stack app solo, integrated payments, documented API — shows I deliver end-to-end.

### Follow-up Questions
- Weakness honest?
- Scale?
- Team fit?

### Common Mistakes
Generic 'I'm passionate.'

### Project Connection
2 receipts: feature shipped + problem solved.

---

## Question: Is this a tutorial project? What did you change?

### Difficulty
🔴 Hard

### Why Interviewers Ask This
Honesty trap.

### Answer
If tutorial-based: admit it, then list custom features, bug fixes, styling, deployed, extra endpoints.

### Example
Started from MERN tutorial, added group chat, dark mode, admin dashboard.

### Follow-up Questions
- Git history?
- Unique feature?
- Would start from scratch?

### Common Mistakes
Claim tutorial as original with no additions.

### Project Connection
List 3 customizations not in tutorial.

---

## Question: How would you add feature X to your project?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Live extension test.

### Answer
DB change → API → client UI → edge cases. Ask clarifying questions first.

### Example
Add comments: Comment model, POST /posts/:id/comments, CommentList component.

### Follow-up Questions
- Migration?
- Auth who can comment?
- Notifications?

### Common Mistakes
Only UI change mention.

### Project Connection
Practice: 'add forgot password' end-to-end.

---

## Question: What was a tradeoff you made?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Engineering judgment.

### Answer
Speed vs polish, Mongo vs SQL, client filter vs server pagination — pick real one.

### Example
Shipped without tests to meet deadline; added Postman collection as minimum.

### Follow-up Questions
- Regret?
- Would decide same?
- Debt tracked?

### Common Mistakes
Claim no tradeoffs ever.

### Project Connection
One speed vs quality choice you made.

---

## Question: How many users can your app handle?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Scale realism.

### Answer
Honest: hundreds on single small server maybe; bottleneck is DB queries and no cache.

### Example
Without indexes, 1000 users slow on list endpoint — I'd add pagination and index userId.

### Follow-up Questions
- Load test?
- First monitor?
- Vertical scale?

### Common Mistakes
Millions of users on free tier.

### Project Connection
Name your first bottleneck realistically.

---

## Question: Explain this line of code from your project

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Ownership verification.

### Answer
They paste YOUR code from GitHub. Explain every token, why pattern used.

### Example
useEffect(() => { const id = setInterval(...); return () => clearInterval(id); }, []);

### Follow-up Questions
- Alternative?
- Bug here?
- Write differently?

### Common Mistakes
Can't explain own code.

### Project Connection
Re-read your 3 most complex files before interview.

---

## Question: What did you learn from building this?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Reflection question.

### Answer
Technical + soft: async debugging, reading docs, git workflow, estimating time.

### Example
Learned auth is harder than CRUD; now I always diagram data flow first.

### Follow-up Questions
- Biggest surprise?
- Next skill?
- Mentor?

### Common Mistakes
Nothing / only 'coding is fun.'

### Project Connection
One technical and one process lesson.

---

## Question: If we gave you legacy code instead, how does this project prepare you?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Transferability.

### Answer
Skills transfer: reading code, API integration, debugging, git, collaborating, shipping.

### Example
My project taught me to trace bugs across layers — same in legacy maintenance.

### Follow-up Questions
- Code review?
- Documentation?
- Onboarding?

### Common Mistakes
Only greenfield experience claim.

### Project Connection
Connect 2 project skills to job JD bullets.
