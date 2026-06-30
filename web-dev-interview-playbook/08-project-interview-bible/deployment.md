# Explaining Deployment in Your Project

Interviewers want to know your app runs in production — not just on localhost.

---

## What to Cover

1. Where each part is deployed
2. How deploys work (manual vs CI/CD)
3. Environment variables and secrets
4. Database hosting
5. Domain and HTTPS

---

## Typical Student Deployment Stack

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Frontend       │     │  Backend API    │     │  Database       │
│  Vercel         │────►│  Railway        │────►│  Railway        │
│  (or Netlify)   │     │  (or Render)    │     │  Postgres addon │
└─────────────────┘     └─────────────────┘     └─────────────────┘
     CDN included            Auto HTTPS              Managed backups
```

**One-sentence summary:** *"React frontend on Vercel, Express API and PostgreSQL on Railway, all connected via environment variables, HTTPS everywhere."*

---

## Deployment Script (What to Say)

> "I deploy the frontend to **Vercel** — connected to my GitHub repo, so every push to `main` auto-deploys. Preview URLs are generated for every pull request.
>
> The backend runs on **Railway** with a managed PostgreSQL database. Railway builds from my Dockerfile / `package.json` start script and sets `PORT` automatically.
>
> Environment variables like `DATABASE_URL`, `JWT_SECRET`, and `FRONTEND_URL` are set in each platform's dashboard — never committed to git.
>
> The live app is at **https://myapp.vercel.app** and the API at **https://myapi.railway.app**."

---

## Environment Variables

| Variable | Where | Purpose |
|----------|-------|---------|
| `DATABASE_URL` | Backend | Postgres connection string |
| `JWT_SECRET` | Backend | Sign/verify tokens |
| `FRONTEND_URL` | Backend | CORS allowed origin |
| `VITE_API_URL` / `NEXT_PUBLIC_API_URL` | Frontend | API base URL |
| `NODE_ENV` | Backend | `production` enables optimizations |

**Security talking point:** ".env is in .gitignore. I use `.env.example` with placeholder values so teammates know what's needed. Secrets are in Railway/Vercel dashboard only."

---

## CI/CD (If You Have It)

### Simple (Platform Auto-Deploy)

> "Push to `main` → Vercel/Railway detects change → builds → deploys. Takes about 2 minutes."

### With GitHub Actions

```yaml
# .github/workflows/deploy.yml (example)
name: Test and Deploy
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm test
      # Vercel/Railway deploys automatically after merge if tests pass
```

**What to say:** "GitHub Actions runs tests on every PR. Merge to main triggers auto-deploy on Vercel and Railway. I don't SSH into servers — it's all git-push deploys."

---

## Database in Production

| Topic | What to say |
|-------|-------------|
| Hosting | "Railway managed Postgres — they handle backups and updates" |
| Migrations | "`prisma migrate deploy` runs on Railway's build step" |
| Seeding | "Seed script for dev only — never run seed in production" |
| Backups | "Railway does daily backups. For critical data I'd also export weekly." |
| Connection pooling | "Prisma handles connection pooling. At scale I'd add PgBouncer." |

---

## CORS Configuration

```javascript
// Only allow your frontend domain in production
const corsOptions = {
  origin: process.env.FRONTEND_URL, // https://myapp.vercel.app
  credentials: true, // if using cookies
};
app.use(cors(corsOptions));
```

**Common bug story:** "Initially my frontend couldn't reach the API — browser blocked requests with CORS error. Fixed by setting `FRONTEND_URL` in Railway to match my Vercel domain exactly."

---

## Docker (If You Use It)

```dockerfile
# Dockerfile (simplified)
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "src/server.js"]
```

**What to say:** "Dockerfile ensures the same Node version and dependencies in dev and production. Railway builds the image and runs it."

---

## Common Deployment Issues (Good Stories)

| Issue | Story |
|-------|-------|
| Build fails on deploy | "Forgot to add `engines` in package.json — Railway used Node 16, I needed 20" |
| Env var missing | "API returned 500 — `JWT_SECRET` wasn't set in Railway dashboard" |
| CORS errors | "Frontend on Vercel, API on Railway — had to whitelist exact Vercel URL" |
| Database connection | "Used `localhost` DATABASE_URL in production — switched to Railway's provided URL" |
| Static files 404 | "Forgot `VITE_API_URL` — frontend was calling localhost in production build" |

Turn bugs into learning moments.

---

## Common Interview Questions

**Q: How do you deploy without downtime?**
A: "Railway does rolling deploys — new container starts, health check passes, old one stops. For a student app this is automatic. At scale I'd use blue-green deployment."

**Q: How do you handle different environments (dev/staging/prod)?**
A: "Local uses `.env` with local Postgres. Production uses Railway env vars. I could add a staging branch that deploys to a preview Railway environment."

**Q: What if the database goes down?**
A: "API returns 503 with a friendly message. Frontend shows 'service unavailable' instead of crashing. Railway auto-restarts the DB; I'd set up uptime monitoring with UptimeRobot."

**Q: How do you monitor production?**
A: "Railway dashboard shows CPU/memory logs. I added Morgan for request logging. For errors I'd add Sentry — it's on my improvement list."

---

## Checklist

- [ ] Know your live URL(s) by heart
- [ ] Can explain frontend vs backend hosting
- [ ] Can explain how env vars are managed
- [ ] Can describe deploy flow (git push → auto deploy)
- [ ] Have one deployment bug story ready

---

**Next:** [performance.md](./performance.md) | [security.md](./security.md)
