# How to Explain Your Project

Three frameworks for different interview contexts. Write yours for each length, then practice out loud until it feels natural — not memorized.

---

## The 2-Minute Pitch (Most Common)

Use when: HR round, intro to technical round, "tell me about a project you've built."

### Framework: P.S.T.A.R.-Tech

| Letter | Meaning | Your notes |
|--------|---------|------------|
| **P** | Problem | What problem? Who has it? |
| **S** | Solution | What did you build? One sentence. |
| **T** | Tech | Stack + why you chose it |
| **A** | Action | What YOU specifically built |
| **R** | Result | Outcome, users, or key learning |

### Template

> "I built **[Project Name]** — a **[one-line description]** for **[target users]**.
>
> The problem was **[problem in one sentence]**. I solved it with **[tech stack]**. I personally handled **[your specific contributions — frontend, API, database, deployment]**.
>
> The hardest part was **[one challenge]**, which I solved by **[brief solution]**.
>
> **[Result: deployed at URL / used by X people / learned Y]**. If I continued, I'd add **[one improvement]**."

### Example (2 minutes spoken)

> "I built **StudyBuddy** — a collaborative study group app for college students.
>
> The problem was students struggle to find study partners for specific courses. I built a MERN stack app where students create study groups, post resources, and chat in real time.
>
> I used React with React Query for the frontend, Node.js with Express for the API, PostgreSQL for data, and Socket.io for real-time chat. I personally built the entire backend, the chat feature, and deployed it on Railway.
>
> The hardest part was handling real-time messages across page refreshes — I solved it by persisting messages in Postgres and syncing via WebSockets with a fallback REST fetch on reconnect.
>
> It's deployed at studybuddy.railway.app and my classmates used it during exam week. Next, I'd add notification emails when someone joins your group."

**Timing check:** Read aloud. If over 2 minutes, cut the tech list. If under 90 seconds, add one more sentence about the challenge.

---

## The 5-Minute Deep Dive

Use when: Technical round opener, "walk me through your project."

### Framework: Problem → Architecture → Deep Dive → Tradeoffs

**Minute 1 — Problem & Overview**
- What problem, who uses it, core features (3–4 bullets)

**Minute 2 — Architecture**
- Draw or describe: frontend → API → database → external services
- Mention deployment

**Minutes 3–4 — Deep Dive (pick ONE area)**
- Choose your strongest area: auth flow, a tricky feature, database design, real-time, etc.
- Walk through step by step as if tracing a user action

**Minute 5 — Tradeoffs & Improvements**
- One decision you'd change
- One thing you'd add next
- What you learned

### Template

```
1. PROBLEM (30 sec)
   "[Users] need [X]. My app lets them [Y, Z, W]."

2. ARCHITECTURE (60 sec)
   "React frontend on Vercel → Express API on Railway → PostgreSQL.
    Auth via JWT. Images on Cloudinary. [Draw diagram here.]"

3. DEEP DIVE (90 sec)
   "Let me walk through [feature X]...
    User clicks → frontend calls → API validates → DB query → response flow."

4. TRADEOFFS (60 sec)
   "I chose [X] over [Y] because [reason]. At scale, I'd [change].
    Next I'd add [improvement]."
```

### What to Deep-Dive On (Pick Your Strongest)

| If you're strong in... | Deep dive on... |
|------------------------|-----------------|
| Frontend | Component architecture, state management, a complex UI feature |
| Backend | API design, middleware chain, a complex endpoint |
| Fullstack | End-to-end flow of one feature (login, checkout, chat message) |
| Database | Schema design, a query you optimized, migration you handled |

---

## The 15-Minute Full Walkthrough

Use when: Dedicated project round, internship presentation, or interviewer says "take your time."

### Framework: Full System Tour

| Section | Time | Content |
|---------|------|---------|
| 1. Context | 2 min | Problem, users, features list |
| 2. Architecture | 3 min | Diagram, tech stack justification, deployment |
| 3. Feature walkthrough #1 | 3 min | Demo or trace most impressive feature |
| 4. Feature walkthrough #2 | 3 min | Second feature OR deep technical area |
| 5. Data layer | 2 min | Schema, key relationships, one indexing decision |
| 6. Challenges | 2 min | 2 problems you solved with specifics |
| 7. Future & learnings | 2 min | Improvements, what you'd do differently |

### Tips for 15 Minutes

- **Screen share your deployed app** if possible — live demo beats slides
- **Show code selectively** — one well-chosen file, not scrolling through everything
- **Pause for questions** — "I can go deeper on auth or the chat system — which interests you?"
- **Have your architecture diagram ready** — draw it in Excalidraw beforehand

### Questions to Prep Answers For

- "Why did you choose [technology]?"
- "What was the hardest bug?"
- "How would this scale to 10,000 users?"
- "What would you refactor if you had another week?"
- "Show me the code for [feature]."
- "How did you test this?"
- "What did you learn?"

---

## Do's and Don'ts

### Do
- Say "I built" for parts you built, "we built" if team project (and clarify your part)
- Mention specific technologies and why
- Have a deployed URL ready
- Connect features to user problems
- Admit what you'd improve (shows maturity)

### Don't
- Recite your entire resume
- Claim you built everything if it was a tutorial fork (be honest)
- Say "it's just a simple project" (underselling)
- Apologize for your stack ("it's only MERN…")
- Go over time without checking in

---

## Practice Exercise

**Today:** Fill in this mad-lib for your project:

```
Project name: ___________
One-line description: ___________
Problem: ___________
Tech stack: ___________
My specific contributions: ___________
Hardest challenge: ___________
How I solved it: ___________
Result: ___________
Next improvement: ___________
```

**Tomorrow:** Record a 2-minute video of your pitch. Watch it. Cut filler words. Repeat until under 2 minutes.

---

**Next:** Fill in [architecture.md](./architecture.md) for your project, then read [sample-project-explanations.md](./sample-project-explanations.md).
