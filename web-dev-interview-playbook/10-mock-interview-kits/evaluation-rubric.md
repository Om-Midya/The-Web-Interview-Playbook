# Mock Interview Evaluation Rubric

Use this rubric after every mock interview. Score each dimension **1–5**. Be honest — inflated scores don't help.

**Total score:** Sum of all dimensions (max 50 for standard round, max 60 if using optional dimensions).

| Score | Meaning |
|-------|---------|
| **1** | Weak — significant gaps, would likely fail a real round |
| **2** | Below average — knows surface level, struggles on follow-ups |
| **3** | Good — solid intern/junior level, hireable with coaching |
| **4** | Strong — clear answers, good tradeoffs, confident live tasks |
| **5** | Excellent — exceeds expectations for 2nd/3rd year student level |

---

## Core Dimensions (Score All Rounds)

### 1. Technical Accuracy

*Are the facts correct? Do follow-ups hold up?*

| Score | Description |
|-------|-------------|
| 1 | Frequent factual errors; guesses and wrong confidently |
| 2 | Basic definitions okay; breaks on "what if" questions |
| 3 | Core concepts correct; minor gaps on advanced topics |
| 4 | Accurate with nuance; self-corrects when prompted |
| 5 | Deep understanding; anticipates edge cases unprompted |

**Examples:**
- Score 2: Says "React virtual DOM is always faster than real DOM"
- Score 4: Explains virtual DOM tradeoff including overhead for simple pages

---

### 2. Problem-Solving & Live Tasks

*Approach before code? Handles edge cases? Recovers from mistakes?*

| Score | Description |
|-------|-------------|
| 1 | No approach; stuck; gives up quickly |
| 2 | Jumps to code; incomplete solution |
| 3 | Explains approach; working solution with hints |
| 4 | Clean approach; handles 1–2 follow-ups; minor bugs self-fixed |
| 5 | Structured approach; edge cases proactively; optimal or near-optimal solution |

**Live task modifiers:**
- Needed a hint within 30 sec: cap at 3
- Needed a hint after 2+ min: cap at 2
- Finished early with follow-ups: +0.5 (round up at end)

---

### 3. Communication & Clarity

*Could you follow their explanation? Appropriate pacing?*

| Score | Description |
|-------|-------------|
| 1 | One-word answers; rambling with no structure |
| 2 | Understandable but disorganized; too much or too little detail |
| 3 | Clear explanations; uses examples |
| 4 | Structured answers (definition → why → example → tradeoff) |
| 5 | Excellent teacher energy; checks understanding; adapts to follow-ups |

**Reference:** [answer-frameworks.md](../00-start-here/answer-frameworks.md) — Framework 1

---

### 4. Tradeoff & Depth Awareness

*Do they know when NOT to use something? Real-world judgment?*

| Score | Description |
|-------|-------------|
| 1 | Only memorized definitions; no "it depends" |
| 2 | One-sided answers; can't compare alternatives |
| 3 | Mentions one tradeoff when asked |
| 4 | Volunteers tradeoffs; compares 2 approaches |
| 5 | Context-aware recommendations; connects to scale and team |

**Examples:**
- Score 2: "Always use Redux for state"
- Score 4: "Context for theme/auth, local state for forms — I used Context in my project because…"

---

### 5. Project Connection

*Can they defend their own work? Specific, not generic?*

| Score | Description |
|-------|-------------|
| 1 | No project or can't explain it |
| 2 | Generic tutorial project; vague role |
| 3 | Describes project; some specifics |
| 4 | Clear ownership; tech choices justified |
| 5 | Deep walkthrough; knows weaknesses and improvements |

---

## Round-Specific Dimensions (Score 1 Additional)

Pick the dimension matching the kit you ran.

### HTML/CSS Round — Layout & Accessibility

| Score | Description |
|-------|-------------|
| 1 | Div soup; no responsive strategy |
| 3 | Semantic HTML; one layout method; basic breakpoint |
| 5 | Semantic + accessible; Grid/Flex justified; mobile-first |

### JavaScript Round — Async & Runtime

| Score | Description |
|-------|-------------|
| 1 | Cannot explain event loop or promises |
| 3 | Understands async/await; traces simple output |
| 5 | Event loop, microtasks, error handling, debugging process |

### React Round — Component & State Design

| Score | Description |
|-------|-------------|
| 1 | Cannot explain hooks used in own project |
| 3 | useState/useEffect correct; reasonable component split |
| 5 | State design, re-render awareness, custom hooks, performance instinct |

### Backend Round — API & Security Design

| Score | Description |
|-------|-------------|
| 1 | CRUD only; no status codes or auth awareness |
| 3 | RESTful endpoints; basic auth; validation mentioned |
| 5 | Complete API design; auth vs authorization; security instincts |

### Full-Stack Round — Integration Thinking

| Score | Description |
|-------|-------------|
| 1 | Frontend and backend stories don't connect |
| 3 | Can trace one request end-to-end |
| 5 | Clear architecture diagram; deployment and env awareness |

### System Design Round — Architecture & Requirements

| Score | Description |
|-------|-------------|
| 1 | Buzzwords; no diagram |
| 3 | Asks some questions; basic client-server-DB diagram |
| 5 | Requirements first; scaling path; honest scope; good deep dive |

---

## Behavioral Signals (Checkbox — Not Scored)

Mark ✓ or ✗ for interview presence:

| Signal | ✓ / ✗ |
|--------|-------|
| Showed up on time / prepared environment | |
| Asked clarifying questions before solving | |
| Said "I don't know" honestly when appropriate | |
| Recovered gracefully from mistakes | |
| Asked thoughtful question at the end | |
| Talked continuously without letting interviewer interject | |
| Read answers from notes ( disqualify for realistic mock) | |

---

## Score Interpretation

| Total (out of 30 core*) | Likely real interview outcome |
|-------------------------|--------------------------------|
| 10–14 | Not ready — focus fundamentals 2–3 weeks |
| 15–19 | Shaky — targeted practice on lowest 2 dimensions |
| 20–24 | Competitive for campus / intern roles |
| 25–29 | Strong — polish project defense and weak follow-ups |
| 30+ | Excellent — simulate pressure (stricter timer, harder follow-ups) |

*Core = 5 dimensions × score 1–5 = max 25, plus round-specific (max 5) = **30 total** for standard scoring.

### Dimension priority for improvement

Fix the **lowest score first**, not the easiest topic:

```
If Technical Accuracy = 2 but Communication = 4
→ Study concepts, not presentation

If Technical Accuracy = 4 but Project Connection = 2
→ Rewrite project explanation; practice 2-min pitch daily
```

---

## Written Feedback Template

Copy this after each mock:

```markdown
## Mock Interview Feedback

**Date:**
**Kit used:**
**Interviewer:**

### Scores
| Dimension | Score (1-5) |
|-----------|-------------|
| Technical Accuracy | |
| Problem-Solving | |
| Communication | |
| Tradeoff Awareness | |
| Project Connection | |
| Round-Specific | |
| **Total** | /30 |

### Top 3 strengths
1.
2.
3.

### Top 3 areas to improve
1.
2.
3.

### Questions that stumped the candidate
-

### Follow-ups that went well
-

### Homework (specific)
- [ ]
- [ ]
- [ ]

### Retry date:
```

---

## Interviewer Calibration

### Avoid score inflation

- **3 is good.** Most practice mocks should land 15–22 total.
- Don't give 5 for "I've heard of it."
- Live task with bugs but good process = 3, not 1.

### Avoid score deflation

- Nervousness ≠ wrong. Re-prompt once before scoring down.
- Student level ≠ senior level. Don't penalize for not knowing Kubernetes.

### Consistency across mocks

Use the same rubric when re-running a kit. Compare **delta**, not just absolute score:

| Attempt | Total | Weakest dimension |
|---------|-------|-------------------|
| Mock 1 | 17 | Async (2) |
| Mock 2 | 22 | Async (4) ← real progress |

---

## Pass / No-Pass Guide (For Realistic Simulation)

At **intern/campus level**, a mock "pass" typically means:

- [ ] Total score ≥ 20
- [ ] No dimension at 1
- [ ] Problem-Solving ≥ 3
- [ ] Project Connection ≥ 3
- [ ] Completed live task with working logic (syntax errors okay)

A "no-pass" doesn't mean quit — it means **2 weeks focused prep** before the real interview.

---

## Related Resources

- Answer structure: [answer-frameworks.md](../00-start-here/answer-frameworks.md)
- Pattern drills: [11-interview-patterns](../11-interview-patterns/)
- Topic deep dives: folders `01` through `07` in this playbook
