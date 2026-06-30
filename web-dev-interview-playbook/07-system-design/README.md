# System Design Interview Preparation

System design interviews test whether you can **think about real products** — not whether you can design Twitter for 1 billion users on day one.

For student and junior roles, interviewers want:
- Clear requirements gathering
- A sensible high-level diagram
- Knowledge of common building blocks (API, DB, cache, CDN)
- Honest tradeoffs ("I'd start simple, then scale X if needed")

## What Interviewers Look For

- You ask clarifying questions before jumping to solutions
- You explain *why* you chose each component
- You mention scalability, but at a realistic student-project level
- You connect concepts to something you've actually built

## Files in This Section

| File | Purpose |
|------|---------|
| [fundamentals.md](./fundamentals.md) | Scalability, availability, latency, CAP, load balancing, caching, CDN |
| [frontend-system-design.md](./frontend-system-design.md) | Component architecture, state, performance, infinite scroll, autocomplete |
| [backend-system-design.md](./backend-system-design.md) | API design, auth, database choices, caching layer |
| [design-a-social-media-app.md](./design-a-social-media-app.md) | Full walkthrough: feed, posts, likes, media |
| [design-a-chat-app.md](./design-a-chat-app.md) | Full walkthrough with WebSockets |
| [design-a-url-shortener.md](./design-a-url-shortener.md) | Full walkthrough: encoding, redirects, analytics |
| [interview-questions.md](./interview-questions.md) | 30+ questions with full answers |
| [revision-sheet.md](./revision-sheet.md) | One-page cram before interview |
| [mock-interview.md](./mock-interview.md) | 45-minute practice flow |

## Study Order

1. `fundamentals.md` — vocabulary you'll use in every answer
2. `frontend-system-design.md` + `backend-system-design.md` — split by your role focus
3. One full design walkthrough (`url-shortener` is easiest, then `chat`, then `social-media`)
4. `interview-questions.md` — 5 questions/day, out loud
5. `mock-interview.md` — practice with a friend on a whiteboard
6. `revision-sheet.md` — night before interview

## Time Estimate

- **Minimum viable prep:** 3–4 days (fundamentals + one design + 15 questions)
- **Solid prep:** 1–2 weeks (all designs + mock interview)

## How to Answer Any Design Question

Use this framework (say it out loud):

1. **Clarify** — users, scale, features in/out of scope (2–3 min)
2. **Estimate** — rough numbers (users, QPS, storage) (2 min)
3. **High-level design** — draw boxes: client → API → DB → cache (5 min)
4. **Deep dive** — pick 1–2 areas the interviewer cares about (15 min)
5. **Tradeoffs** — what you'd do differently at 10x scale (5 min)

## Project Connection

Every design answer gets stronger when you say: *"In my project, I did something similar when…"*

Be ready to explain what breaks first if 1,000 users hit your capstone at once.
