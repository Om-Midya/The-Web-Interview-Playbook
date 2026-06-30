# Project Interview: Mock Practice (45 Minutes)

Use this script with a friend or mentor. One person is interviewer, one is candidate.

**Setup:** Candidate has project deployed and GitHub repo ready. Screen sharing enabled.

**Rules:**
- Candidate answers from memory — no reading notes
- Interviewer asks follow-ups and probes weak spots
- Candidate should draw architecture at least once

---

## Section 1: Opening Pitch (5 min)

**Interviewer:** "Tell me about a project you've built."

*Candidate delivers 2-minute pitch. Interviewer times it.*

**Follow-ups:**
- "What was YOUR specific contribution?" (especially if team project)
- "Why did you choose this tech stack?"
- "Is it deployed? Can you show me?"

**Evaluation:**
- [ ] Under 2 minutes
- [ ] Clear problem statement
- [ ] Mentioned personal contribution
- [ ] Ended with result or learning

---

## Section 2: Architecture Walkthrough (10 min)

**Interviewer:** "Walk me through the architecture. Draw it if you can."

*Candidate draws: client → API → database → external services.*

**Follow-ups (pick 3):**
- "Why [React/Next.js/Express/Postgres] specifically?"
- "How are the frontend and backend deployed?"
- "Show me your folder structure — how is code organized?"
- "What external services do you use and why?"
- "What would break first if 1,000 users hit this at once?"

**Evaluation:**
- [ ] Clear diagram with labeled arrows
- [ ] Justified tech choices
- [ ] Mentioned deployment
- [ ] Realistic scale awareness

---

## Section 3: Feature Deep Dive (10 min)

**Interviewer:** "Pick your most complex feature and walk me through what happens when a user uses it — step by step, from click to database and back."

*Candidate traces a complete flow (8–12 steps).*

**Follow-ups:**
- "What happens if the API call fails?"
- "How do you handle loading states?"
- "Show me the code for [one part of this flow]."
- "How would you test this feature?"

**Evaluation:**
- [ ] Traced full request lifecycle
- [ ] Mentioned error handling
- [ ] Can navigate to relevant code
- [ ] Explained clearly without jargon overload

---

## Section 4: Data & API (8 min)

**Interviewer asks 2–3 of these:**

1. "Draw your database schema — main tables and relationships."
2. "Walk me through your authentication flow."
3. "What does `POST /api/...` look like — request and response?"
4. "How do you handle authorization — can any user delete any post?"
5. "Do you have any database indexes? Why those columns?"

**Evaluation:**
- [ ] ER diagram or clear table description
- [ ] Auth flow includes password hashing
- [ ] Authorization is server-side
- [ ] Knows at least one index decision

---

## Section 5: Challenges & Improvements (7 min)

1. "What was the hardest bug or problem you faced?"
   - Follow-up: "How did you debug it?"
2. "What tradeoff did you make that you'd reconsider?"
3. "What would you improve if you had another two weeks?"
4. "What did you learn from building this?"

**Evaluation:**
- [ ] Specific challenge story (not "nothing was hard")
- [ ] Shows problem-solving process
- [ ] Honest about weaknesses
- [ ] Concrete improvement plans

---

## Section 6: Pressure Questions (5 min)

**Interviewer picks 2 — these are intentionally tough:**

1. "I see you used localStorage for JWT. Isn't that a security risk?"
2. "Your app doesn't have tests. How do you know it works?"
3. "This looks similar to [tutorial name]. What's actually yours?"
4. "How is this different from just using [existing product]?"
5. "Your feed query loads all posts — that won't scale. What would you change?"

**What good candidates do:**
- Acknowledge the concern honestly
- Explain why they made that choice at the time
- Describe what they'd do differently now
- Don't get defensive

---

## Evaluation Rubric

| Area | 1 (Weak) | 3 (Good) | 5 (Strong) |
|------|----------|----------|------------|
| Pitch | Rambling, no clear problem | Clear 2-min story | Crisp, compelling, quantified result |
| Architecture | Can't draw or explain | Clear diagram, justified choices | Scale path, tradeoffs unprompted |
| Deep dive | Vague "it calls the API" | 8+ step trace | Error handling, code ready to show |
| Data & auth | Doesn't know schema | Knows tables and auth flow | Indexes, authorization, security aware |
| Challenges | "No challenges" | One good story | Multiple stories with learnings |
| Composure | Defensive on criticism | Acknowledges gaps | Honest, thoughtful improvements |

---

## Debrief (5 min)

**Candidate asks:**
- Which sections felt weakest?
- Did I talk too much or too little?
- Were my technical terms clear?
- Did I successfully show MY contribution?

**Interviewer gives:**
- One strength to keep
- One area to study (point to specific file in this repo)
- Score out of 25 using rubric above

---

## Self-Practice (No Partner)

1. Open your deployed app and GitHub repo
2. Set 45-minute timer
3. Record yourself answering Section 1–5 questions
4. Watch the recording — note filler words, unclear explanations
5. Fill in your project details in each topic file
6. Repeat until the 2-minute pitch is smooth

---

## Quick Prep Checklist (Day Before Interview)

- [ ] 2-minute pitch rehearsed
- [ ] Architecture diagram drawn on paper once
- [ ] One feature flow traced (10 steps)
- [ ] One challenge story ready
- [ ] Three improvements ready
- [ ] App deployed and working
- [ ] GitHub repo clean (README, no secrets)
- [ ] Know your live URL
