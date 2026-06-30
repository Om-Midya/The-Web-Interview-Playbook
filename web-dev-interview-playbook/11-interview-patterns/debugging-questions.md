# Debugging Scenario Questions

> 15 realistic "something is broken" scenarios. Walk through: reproduce → inspect → isolate → hypothesize → fix → prevent.

See Framework 7 in [answer-frameworks.md](../00-start-here/answer-frameworks.md).

---

## Question: Blank page after deploy — works on localhost

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Classic deployment debugging.

### Answer
Check browser console for errors. Verify API base URL env vars in production. Check build output path and router (SPA needs redirect rules). Network tab for 404 on JS bundles.

### Example
VITE_API_URL still localhost → fix env on Vercel.

### Follow-up Questions
- CORS in prod?
- Mixed content HTTP/HTTPS?
- Base path wrong?

### Common Mistakes
Only saying 'CORS' without checking console first.

### Project Connection
Your deploy bug story or checklist you'd run.

---

## Question: API returns 401 on protected route after login

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Auth debugging staple.

### Answer
Verify token sent in Authorization header. Check token expiry. Confirm middleware order. Inspect JWT secret same on server. Clock skew rare but possible.

### Example
fetch without headers: { Authorization: `Bearer ${token}` }.

### Follow-up Questions
- Cookie vs header?
- Refresh flow?
- OPTIONS preflight stripping header?

### Common Mistakes
Storing token but never attaching to requests.

### Project Connection
Trace your login → stored token → API call chain.

---

## Question: CORS error in browser but Postman works

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Most common student full-stack bug.

### Answer
CORS is browser-only. Server must return Access-Control-Allow-Origin. Handle OPTIONS preflight. Don't use * with credentials.

### Example
Add cors({ origin: 'http://localhost:3000', credentials: true }).

### Follow-up Questions
- Proxy in dev?
- Production origins?
- Why Postman different?

### Common Mistakes
Browser CORS extension as 'fix' for production.

### Project Connection
Your cors() config or vite proxy setup.

---

## Question: React component renders twice / infinite loop

### Difficulty
🟡 Medium

### Why Interviewers Ask This
useEffect dependency bugs.

### Answer
Check useEffect deps — missing or unstable object/array causes re-run. setState in render causes loop. Strict Mode double-mount in dev.

### Example
useEffect(() => fetch(), []) not [user] object recreated each render.

### Follow-up Questions
- useCallback fix?
- Strict Mode?
- Abort controller?

### Common Mistakes
Removing deps array entirely 'to fix it'.

### Project Connection
useEffect in your project — what are deps.

---

## Question: Button click doesn't update UI but state logs correctly

### Difficulty
🟡 Medium

### Why Interviewers Ask This
State mutation bug.

### Answer
Likely mutating state directly instead of new reference. Arrays/objects need spread or map. React compares by reference.

### Example
setItems(items.push(x)) wrong → setItems([...items, x]).

### Follow-up Questions
- Immer?
- Why mutation fails?
- useState object update?

### Common Mistakes
items[0].done = true without new array.

### Project Connection
Find immutable update pattern in your code.

---

## Question: Form submits and page refreshes

### Difficulty
🟢 Easy

### Why Interviewers Ask This
HTML form default behavior.

### Answer
Missing e.preventDefault() in onSubmit. Or button type='submit' outside controlled handler.

### Example
<form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>

### Follow-up Questions
- type='button'?
- Server action?
- Uncontrolled form?

### Common Mistakes
onClick on button only without form onSubmit.

### Project Connection
Your form submit handler pattern.

---

## Question: Hydration mismatch error in Next.js

### Difficulty
🔴 Hard

### Why Interviewers Ask This
SSR/client HTML differ.

### Answer
Usually Date(), Math.random(), or window in render. Browser-only APIs during SSR. Invalid HTML nesting.

### Example
Move Date formatting to useEffect or suppressHydrationWarning sparingly.

### Follow-up Questions
- Client component boundary?
- typeof window?
- Third-party scripts?

### Common Mistakes
Ignoring error; client-only render everything.

### Project Connection
If using Next: client vs server component split.

---

## Question: Database connection works locally, fails in production

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Env and networking.

### Answer
Check DATABASE_URL env in hosting dashboard. IP whitelist on Atlas. SSL requirements. Connection string typo.

### Example
MongoDB Atlas → Network Access → allow 0.0.0.0/0 for PaaS.

### Follow-up Questions
- Connection pooling?
- Serverless cold start?
- Firewall?

### Common Mistakes
Same .env not uploaded; secrets in git history.

### Project Connection
How you configure prod DB env vars.

---

## Question: Slow API — requests take 5+ seconds

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Performance debugging.

### Answer
Log timestamps per middleware. Check N+1 queries. Add DB indexes. Profile with EXPLAIN. External API latency.

### Example
100 users fetched with 100 queries → use populate/join once.

### Follow-up Questions
- Caching?
- Pagination?
- Compression?

### Common Mistakes
Jumping to Redis before finding slow query.

### Project Connection
One query you'd optimize in your project.

---

## Question: Images not loading in production

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Asset path issues.

### Answer
Wrong relative paths after build. Case sensitivity Linux vs Windows. CDN/base URL. CORS on S3 bucket.

### Example
src='/logo.png' vs imported asset from src/.

### Follow-up Questions
- Next Image?
- Public folder?
- Lazy load?

### Common Mistakes
Works on Windows case-insensitive paths only.

### Project Connection
How you serve static assets.

---

## Question: npm install works, CI fails

### Difficulty
🟡 Medium

### Why Interviewers Ask This
DevOps debugging.

### Answer
Node version mismatch — use .nvmrc. Lockfile out of sync. DevDependency needed in CI. Native module build.

### Example
engines in package.json; actions/setup-node with version.

### Follow-up Questions
- npm ci vs install?
- Cache?
- ESLint in CI?

### Common Mistakes
Different Node 18 vs 20 behavior.

### Project Connection
Your CI yaml if any.

---

## Question: Memory leak — tab slows after usage

### Difficulty
🔴 Hard

### Why Interviewers Ask This
Advanced but asked at good companies.

### Answer
Detached DOM listeners, intervals not cleared, global arrays growing, closures holding large objects.

### Example
useEffect return () => clearInterval(id).

### Follow-up Questions
- Chrome Memory profiler?
- Event listener remove?
- WeakMap?

### Common Mistakes
Adding listeners in render without cleanup.

### Project Connection
useEffect cleanup in your subscriptions.

---

## Question: Race condition — stale data overwrites new

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Async UI bug.

### Answer
Slow request returns after fast one. Fix: abort controller, ignore stale responses with request id, disable UI while loading.

### Example
let seq = 0; const id = ++seq; if (id !== seq) return;

### Follow-up Questions
- React Query?
- Loading flags?
- Debounced search?

### Common Mistakes
No loading state; last write wins silently wrong.

### Project Connection
Search/filter in your app — race possible?

---

## Question: SQL injection concern in login

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Security debugging.

### Answer
Never concatenate user input in SQL. Use parameterized queries / ORM. Validate input.

### Example
db.query('SELECT * FROM users WHERE email = $1', [email]).

### Follow-up Questions
- NoSQL injection?
- ORM safe always?
- Input sanitize?

### Common Mistakes
ORM raw query with string concat.

### Project Connection
How your login query is built.

---

## Question: WebSocket connects then immediately disconnects

### Difficulty
🔴 Hard

### Why Interviewers Ask This
Real-time debugging.

### Answer
Check proxy/load balancer WS support. Auth during handshake. Heartbeat timeout. Mixed ws/wss.

### Example
Nginx proxy_set_header Upgrade $http_upgrade;

### Follow-up Questions
- Fallback polling?
- Socket.io vs raw WS?
- CORS on WS?

### Common Mistakes
Using ws:// on HTTPS site.

### Project Connection
If no WS: how you'd debug with Network → WS tab.
