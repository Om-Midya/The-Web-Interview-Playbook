# System Design Mock Interview (45 Minutes)

> **Role:** Student-level system design — NOT FAANG staff-level. Expect high-level diagrams, tradeoffs, and one deep dive. Common in product company Round 2–3 and some campus special rounds.

**Interviewer:** Guide if candidate jumps to Kafka. Keep scope realistic for a student project scale.  
**Candidate:** Practice drawing boxes and arrows. Say "I'd start simple and scale when needed."

---

## Pre-Interview Setup

- [ ] Timer, rubric, whiteboard tool (Excalidraw, paper, Miro)
- [ ] Interviewer picks **one** design problem (Section 3) based on candidate level
- [ ] Candidate: review `07-system-design/interview-questions.md` beforehand (interviewer may have)

---

## Section 1: Warm-up (5 min)

| Time | Question |
|------|----------|
| 0:00 | "Have you done a system design interview before? What did it cover?" |
| 1:30 | "Describe the architecture of your main project in 60 seconds." |
| 3:00 | "If your project suddenly had 10,000 users, what would break first?" |
| 4:30 | "What's a system design concept you recently learned?" |

**Purpose:** Calibrate level. If they can't describe their own project architecture, note it for feedback.

---

## Section 2: Fundamentals Check (8 min)

| Time | Question |
|------|----------|
| 5:00 | "What is the difference between vertical and horizontal scaling?" |
| 6:00 | "What is a load balancer? When do you need one?" |
| 7:00 | "What is caching? Where would you put a cache in a web app?" |
| 8:00 | **Follow-up:** "What are cache invalidation challenges?" |
| 9:00 | "What is a CDN? What kind of assets go on a CDN?" |
| 10:00 | "SQL vs NoSQL — how do you decide for a new project?" |
| 11:00 | "What is the difference between monolith and microservices? Which would you start with?" |
| 12:00 | "What are environment variables and why do they matter in production?" |

**Stretch:** "What is a reverse proxy? How is Nginx used?"

---

## Section 3: Main Design Problem (22 min)

**Interviewer: choose ONE problem below.**

### Option A — URL Shortener (classic, good for beginners)

> "Design a URL shortener like bit.ly. Users paste a long URL and get a short link. Short links redirect to the original."

### Option B — Real-Time Chat (medium)

> "Design a simple group chat for a college club app. Up to 500 members, text messages only, online presence optional."

### Option C — Food Ordering (practical)

> "Design the backend for a food ordering app: browse restaurants, add to cart, place order, track status."

---

### Design Problem Structure (all options follow same timing)

| Time | Phase | What candidate should do |
|------|-------|--------------------------|
| 13:00–15:00 | **Requirements** | Ask clarifying questions; state assumptions |
| 15:00–20:00 | **High-level design** | Draw client, API, DB, cache, CDN if relevant |
| 20:00–28:00 | **Deep dive** | Interviewer picks one area (see below) |
| 28:00–33:00 | **Tradeoffs & scale** | Bottlenecks, what to add at 10x traffic |
| 33:00–35:00 | **Wrap design** | Summarize decisions in 60 seconds |

---

### Option A — URL Shortener: Interviewer Guide

**Clarifying questions candidate should ask:**

- How many URLs per day? (Say: ~10,000 for student scale; 1M for stretch)
- Custom short URLs? (Optional feature)
- Expiration? (Not required initially)
- Analytics on clicks? (Bonus)

**Expected components:**

```
Client → API Server → Database (short code → long URL mapping)
                     → (optional) Redis cache for hot links
Redirect: GET /abc123 → lookup → 301/302 to long URL
```

**Deep-dive options (pick one):**

1. "How do you generate short codes?" (base62, auto-increment ID + encode, collision handling)
2. "How do you handle 1M redirects/sec?" (cache, read replicas — keep it simple)
3. "Database schema?" (`id`, `short_code`, `long_url`, `created_at`, `user_id`)

**Follow-ups:**

- "What HTTP status for redirect — 301 or 302?"
- "How do you prevent abuse / malicious URLs?"

---

### Option B — Real-Time Chat: Interviewer Guide

**Expected components:**

```
Client (WebSocket) ↔ Chat Server ↔ Database (messages, rooms)
                  ↔ (optional) Redis pub/sub for multi-server
```

**Deep-dive options:**

1. "WebSocket vs polling — why WebSocket?"
2. "How do you store messages? Schema for room + message."
3. "User comes online — how does others know?" (presence channel, heartbeat)

**Follow-ups:**

- "What if user sends 1000 messages/sec?" (rate limit)
- "Message history — load last 50 how?"

---

### Option C — Food Ordering: Interviewer Guide

**Expected components:**

```
Mobile/Web → API Gateway / Express API
          → Order Service logic
          → DB: restaurants, menu, orders, users
          → (optional) notification on status change
```

**Deep-dive options:**

1. "Order state machine: placed → confirmed → preparing → delivered"
2. "How do you prevent ordering unavailable items?" (transaction, inventory check)
3. "Cart — client-side or server-side?"

---

## Section 4: Failure & Edge Cases (5 min)

**Pick 2 scenarios:**

| # | Scenario |
|---|----------|
| 1 | "Database goes down. What does the user see?" |
| 2 | "API is slow — 5 second response time. Frontend strategy?" |
| 3 | "You need to deploy a schema change without downtime." |
| 4 | "One server can't handle traffic. What do you add?" |
| 5 | "How do you handle duplicate order submissions (double click)?" |

**Expected themes:** Graceful degradation, loading states, idempotency keys, horizontal scaling, health checks.

---

## Section 5: Connect to Your Project (3 min)

| Time | Question |
|------|----------|
| 40:00 | "How is your project architected today? What would you add from today's design?" |
| 42:00 | "What's one over-engineering mistake students make in system design?" |
| 43:30 | Candidate questions + close |

---

## Post-Interview Debrief

### Scoring focus (student level)

| Score | Meaning |
|-------|---------|
| 1 | No diagram; buzzwords only |
| 3 | Clear boxes, reasonable DB, answers follow-ups |
| 5 | Asks requirements first, tradeoffs, scaling path, honest scope |

### Homework

| Gap | Action |
|-----|--------|
| Requirements | Practice 5 "clarifying question" lists for common problems |
| Diagrams | Draw 3 designs in 15 min each (URL shortener, chat, todo sync) |
| Deep dive | Write DB schema for chosen problem |
| Buzzwords | Read `07-system-design/interview-questions.md` |
| Tradeoffs | For each design: write "I chose X over Y because…" |

### Retry

Second attempt with a **different** problem option. Target: finish requirements + diagram in 10 minutes.

---

## Interviewer Anti-Patterns

**Don't:** Expect Kubernetes, sharding, or distributed consensus at intern level.  
**Do:** Reward "start with a monolith on one VPS" if reasoning is sound.  
**Don't:** Let candidate talk for 15 min without a diagram.  
**Do:** Interrupt politely: "Can you draw that?"

## Strong Candidate Phrases

- "Let me clarify requirements before I design."
- "I'd start simple and add caching when metrics show DB pressure."
- "This is a read-heavy system, so I'd optimize reads first."
- "I haven't used Redis in production, but I'd use it here for…"
