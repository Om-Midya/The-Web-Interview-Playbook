# System Design: Mock Interview (45 Minutes)

Use this script with a friend. One person is interviewer, one is candidate. Switch roles after.

**Setup:** Whiteboard, paper, or Excalidraw. Candidate must draw and talk simultaneously.

**Rules:**
- Candidate asks clarifying questions before designing
- Interviewer pushes on tradeoffs ("what if 10x users?")
- No reading from notes during design sections

---

## Section 1: Warm-up (5 min)

1. "What does scalability mean to you?"
   - Follow-up: "Vertical vs horizontal — when would you pick each?"
2. "Explain caching in a web app. Where would you put cache layers?"
   - Follow-up: "What happens when cached data is stale?"
3. "What's the CAP theorem? Give a real example."

*Interviewer: Candidate should use concrete examples, not textbook definitions only.*

---

## Section 2: API & Backend Fundamentals (8 min)

1. "Design a REST API for a blog — posts and comments. What endpoints would you create?"
   - Follow-up: "How do you paginate a list of 100,000 posts?"
2. "Walk me through what happens when a user logs in."
   - Follow-up: "Session cookie vs JWT — which would you use and why?"
3. "When would you choose SQL vs NoSQL?"

---

## Section 3: Main Design Challenge — URL Shortener (20 min)

**Interviewer reads:**

> "Design a URL shortener like bit.ly. Users submit a long URL and get a short link. Visiting the short link redirects to the original. Assume 10 million stored URLs and 100 million redirects per month."

**Candidate should:**
1. Ask 2–3 clarifying questions (custom aliases? analytics? auth?)
2. Give rough estimates (RPS, storage)
3. Draw architecture diagram
4. Explain short code generation
5. Walk through the redirect path (emphasize caching)
6. Mention security (open redirect, rate limiting)

**Interviewer follow-ups (pick 2–3):**
- "How do you generate unique short codes?"
- "301 vs 302 redirect — which and why?"
- "How do you track click analytics without slowing redirects?"
- "What if one short link gets 1 million clicks in an hour?"
- "How would you prevent someone from creating links to malicious sites?"

**Evaluation criteria:**
- Asked clarifying questions before designing
- Drew a clear diagram with data flow
- Identified read-heavy pattern and cached appropriately
- Mentioned tradeoffs without being asked
- Gave realistic student-scale answer (not over-engineered)

---

## Section 4: Frontend or Real-Time (7 min)

**Pick ONE based on role:**

### Option A: Frontend (for frontend-focused candidates)

> "Design the frontend for an infinite-scroll social feed. 20 posts per page, images, like button."

Follow-ups:
- "How do you manage state?"
- "How do you handle a user liking a post — optimistic UI?"
- "What if the list has 10,000 posts?"

### Option B: Real-Time (for fullstack candidates)

> "How would you add real-time chat to this social app?"

Follow-ups:
- "WebSocket vs polling?"
- "How do messages reach users on different servers?"
- "What happens when a user reconnects after disconnect?"

---

## Section 5: Scale & Tradeoffs (5 min)

1. "Your URL shortener is successful — 100x more traffic. What breaks first?"
2. "How would you monitor this system in production?"
3. "What's one thing you'd do differently if you rebuilt from scratch?"

---

## Evaluation Rubric

| Area | 1 (Weak) | 3 (Good) | 5 (Strong) |
|------|----------|----------|------------|
| Requirements | Jumps to solution | Asks some questions | Structured clarifying questions |
| Architecture | Vague boxes | Clear diagram | Data flows labeled, justified choices |
| Depth | Surface buzzwords | Explains key components | Tradeoffs, scale path, security |
| Communication | Silent drawing | Talks through design | Engaging, checks in with interviewer |
| Realism | Designs for Google scale | Student-appropriate | "Start simple, scale when needed" |

---

## Debrief (5 min)

**Candidate asks:**
- Which parts of the design were weak?
- Did I ask enough clarifying questions?
- Was my diagram clear?
- Did I mention caching and security?

**Interviewer gives:**
- One thing done well
- One thing to improve
- Suggested file to study: `design-a-url-shortener.md` or whichever design was weakest

---

## Bonus Round (If Time Permits)

**Interviewer:** "Design Instagram's home feed in 10 minutes."

Candidate covers: pull vs fan-out, caching, image CDN, cursor pagination.

See [design-a-social-media-app.md](./design-a-social-media-app.md) for reference answer.

---

## Self-Practice (No Partner)

1. Set a 25-minute timer
2. Open Excalidraw
3. Design URL shortener from memory
4. Record yourself on phone
5. Watch back — did you ask questions first? Did you mention cache?
