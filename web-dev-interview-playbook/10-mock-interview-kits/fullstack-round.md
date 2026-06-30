# Full-Stack Mock Interview (45 Minutes)

> **Role:** End-to-end round — connects frontend, backend, database, and deployment. Common for full-stack intern roles and startup hiring.

**Interviewer:** This round tests **integration thinking** — how pieces connect, not isolated trivia.  
**Candidate:** Bring one complete project (frontend + API + DB). Be ready to whiteboard the architecture.

---

## Pre-Interview Setup

- [ ] Timer, rubric, whiteboard or Excalidraw
- [ ] Candidate: project deployed or runnable locally
- [ ] Interviewer: read candidate's README or demo URL if shared

---

## Section 1: Project Overview (8 min)

**This section is longer than other kits — full-stack rounds often start with your project.**

| Time | Question |
|------|----------|
| 0:00 | "Give me a 2-minute overview of your full-stack project." |
| 2:30 | "Draw the architecture: client, server, database, external services." |
| 5:00 | "Why did you choose this tech stack?" |
| 6:30 | "What feature are you most proud of? Walk me through how it works." |
| 7:30 | "What would you rebuild if you started today?" |

**Interviewer probes:**

- "Where does state live — client, server, or both?"
- "How do you handle loading and error states in the UI?"
- "Is it deployed? What happens when you push to main?"

**Red flags:** Can't draw a simple diagram; frontend and backend are disconnected stories; no mention of API contract.

---

## Section 2: Frontend Slice (8 min)

| Time | Question |
|------|----------|
| 8:00 | "How does your frontend call the backend? Show me one fetch/axios call." |
| 9:30 | "How do you manage auth state on the client?" |
| 11:00 | "What happens when the API is slow or fails? What does the user see?" |
| 12:30 | "How is your frontend code organized? (folders, components, hooks)" |
| 14:00 | "One React/JS concept you used — explain it in context of your project." |

**Follow-ups (pick 1):**

- "Why not store everything in global state?"
- "How would you add optimistic UI for a like button?"

---

## Section 3: Backend & API Slice (8 min)

| Time | Question |
|------|----------|
| 16:00 | "Walk me through your most important API endpoint — request to response." |
| 18:00 | "How do you validate input? What if someone sends bad data?" |
| 19:30 | "How is your API secured? Auth flow in plain English." |
| 21:00 | "Show me your error response format. Is it consistent?" |
| 22:30 | "How do you connect to the database? ORM or raw queries?" |

**Scenario:**

> "User logs in on device A. Should they stay logged in on device B? How does your app handle that?"

---

## Section 4: Live Task — Add a Feature (12 min)

**Interviewer reads aloud:**

> "Your app is a **task manager**. Users can create and list tasks. I want to add:
> - **Due dates** on tasks
> - A **filter** on the frontend: show overdue / today / all
>
> Talk me through what changes on the **database**, **API**, and **frontend**. You don't need to write full code — walk me through files you'd touch and the data flow."

**Timing:**

| Time | Phase |
|------|-------|
| 24:00–26:00 | Clarifying questions |
| 26:00–33:00 | End-to-end walkthrough |
| 33:00–36:00 | Follow-ups |

**What a strong answer includes:**

1. **DB:** Add `dueDate` column/field; migration or schema update
2. **API:** Update POST/PATCH to accept `dueDate`; GET supports `?filter=overdue`
3. **Frontend:** Date picker in form; filter tabs; display formatted date
4. **Validation:** due date not in past on create? (candidate asks)
5. **Edge cases:** timezone handling mentioned (bonus)

**Follow-ups:**

1. "How do you migrate existing tasks without due dates?"
2. "How would you write a test for the overdue filter?"
3. "What if the list has 10,000 tasks — still filter on client?"
4. "How would you deploy this without downtime?"

**Alternate live task (simpler):**

> "Add a 'favorite' toggle to any resource in your own project — trace all layers."

---

## Section 5: Data & Consistency (4 min)

| Time | Question |
|------|----------|
| 36:00 | "Where could your app show stale data? How do you handle it?" |
| 37:30 | "What happens if two users edit the same record?" |
| 39:00 | "SQL or NoSQL in your project — still the right choice?" |

---

## Section 6: DevOps & Production (3 min)

**Pick 2 — fast fire:**

| # | Question |
|---|----------|
| 1 | "How is your app deployed? Frontend vs backend hosting?" |
| 2 | "What environment variables do you use? How do you keep secrets safe?" |
| 3 | "Have you used Git in a team? Branching strategy?" |
| 4 | "What happens when your production API goes down?" |
| 5 | "How would you add basic monitoring or logs?" |

---

## Section 7: Debugging Scenario (2 min)

**Interviewer reads:**

> "Users report: 'I logged in but the dashboard shows empty.' It works on your machine. How do you debug?"

**Expected path:** Check network tab → API response → auth token → CORS/env URL → server logs → DB query.

---

## Wrap-up (2 min)

| Time | Action |
|------|--------|
| 43:00 | "What's the weakest part of your stack right now?" |
| 44:00 | Candidate questions + close |

---

## Post-Interview Debrief

### Full-stack rubric emphasis

| Dimension | What to evaluate |
|-----------|------------------|
| Architecture clarity | Can draw and explain data flow |
| Integration | Frontend ↔ API contract is coherent |
| Tradeoffs | Mentions alternatives, not just "it works" |
| Production awareness | Env vars, deployment, errors |
| Ownership | Clear what THEY built vs tutorial |

### Homework

| Gap | Action |
|-----|--------|
| Architecture | Draw diagram from memory; label every arrow |
| API contract | Write OpenAPI-style doc for 3 endpoints |
| Auth flow | Document login flow step by step |
| Live task | Implement due-date feature for real in side project |
| Deployment | Deploy if not already; write deployment README |

### Retry

Run again in 7 days with a **different project** or after implementing the live task feature.

---

## Interviewer Notes

**Hire signal at intern level:** Clear project ownership, honest about gaps, systematic debugging, connects React state to API to DB without hand-waving.

**No-hire signal:** Tutorial project with zero modifications; can't explain auth; blames "CORS" for every bug without checking network tab.
