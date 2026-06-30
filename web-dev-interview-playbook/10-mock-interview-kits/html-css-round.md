# HTML & CSS Mock Interview (45 Minutes)

> **Role:** Frontend fundamentals round — typical for campus placements, internship screens, and first technical rounds at service companies.

**Interviewer:** Read sections in order. Time each block strictly.  
**Candidate:** Answer out loud. No notes. Have one project in mind.

---

## Pre-Interview Setup (Interviewer Only)

- [ ] Timer ready (phone or stopwatch)
- [ ] Live task: share a blank CodePen, VS Code, or paper
- [ ] Rubric open: [evaluation-rubric.md](./evaluation-rubric.md)
- [ ] Note candidate name, date, and which follow-ups stumped them

---

## Section 1: Warm-up & Project Hook (5 min)

**Goal:** Ease in, check communication, set context for later questions.

| Time | Question |
|------|----------|
| 0:00 | "Tell me about yourself — keep it under 90 seconds." |
| 1:30 | "Walk me through a frontend project you've built. What was your role?" |
| 3:00 | "How did you approach styling and layout for that project?" |
| 4:00 | "What was the hardest CSS or HTML problem you faced?" |

**Interviewer notes:**
- Did they mention responsive design without being asked?
- Did they use semantic HTML in the project story?
- Red flag: only "I used Bootstrap" with no understanding of what's underneath.

**Follow-ups (pick 1):**
- "If you rebuilt it today, what would you change?"
- "Did you test on mobile? How?"

---

## Section 2: HTML Fundamentals (8 min)

| Time | Question | Expected depth |
|------|----------|----------------|
| 5:00 | "What is semantic HTML? Give me 3 semantic tags and when you'd use each." | `header`, `nav`, `main`, `article`, `section`, `footer` — purpose, not just names |
| 6:30 | **Follow-up:** "What's the difference between `<section>` and `<article>`?" | Article = self-contained; section = thematic grouping |
| 7:30 | "How do you make a form accessible?" | Labels, `for`/`id`, fieldset, error messages, keyboard nav |
| 8:30 | **Follow-up:** "What happens if you use a `<div>` with `onClick` instead of `<button>`?" | No keyboard focus by default, screen reader issues, role missing |
| 9:30 | "Explain `defer` vs `async` on `<script>` tags." | Both download in parallel; async runs immediately when ready; defer runs after HTML parse, in order |
| 10:30 | **Follow-up:** "Where should scripts go — head or end of body? Why?" | End of body historically; defer in head is fine today |

**Stretch (if ahead of time):**
- "What is the difference between `<b>` and `<strong>`?"
- "How does `loading='lazy'` on images work?"

---

## Section 3: CSS Core (10 min)

| Time | Question |
|------|----------|
| 13:00 | "Explain the CSS box model." |
| 14:00 | **Follow-up:** "What does `box-sizing: border-box` change? Why do people use it?" |
| 15:00 | "How does CSS specificity work? Which wins: `#nav .link` or `ul li a`?" |
| 16:00 | **Follow-up:** "When would you use `!important`?" (Expected: almost never; know specificity first) |
| 17:00 | "Difference between `display: none`, `visibility: hidden`, and `opacity: 0`?" |
| 18:00 | **Follow-up:** "Which one removes the element from layout flow? Which is animatable?" |
| 19:00 | "Explain Flexbox. When would you use it vs CSS Grid?" |
| 20:00 | **Follow-up:** "How do you center a div horizontally and vertically with Flexbox?" |

**Interviewer probe:**
- "You said Grid for the layout — what happens if you use Flexbox with `flex-wrap` instead?"
- "How would you make a 3-column layout that becomes 1 column on mobile?"

---

## Section 4: Live Task — Responsive Layout (12 min)

**Interviewer reads this aloud:**

> "Build a responsive page layout. Requirements:
> - Header with logo on the left and navigation links on the right
> - Main area with a 3-column card grid (equal-width cards)
> - Footer at the bottom
> - On screens under 768px, cards stack in a single column
> - Talk through your approach before you write code."

**Timing breakdown:**

| Time | Phase |
|------|-------|
| 21:00–22:00 | Candidate explains approach (HTML structure, layout method, breakpoint strategy) |
| 22:00–30:00 | Candidate writes HTML + CSS (or detailed pseudocode on paper) |
| 30:00–33:00 | Follow-up questions (below) |

**Follow-ups (ask at least 2):**

1. "Why did you choose Grid over Flexbox for the cards?" (or vice versa — either is fine if justified)
2. "How would you make the header sticky?"
3. "How would you add a hamburger menu for mobile without JavaScript?" (bonus: `checkbox` hack or note that JS is needed)
4. "Your third card is taller than the others — how do you keep the row aligned?"
5. "How would you name your CSS classes? BEM? Utility classes?"

**Evaluation criteria for live task:**

| Criteria | Weak (1) | Good (3) | Strong (5) |
|----------|----------|----------|------------|
| HTML structure | Div soup | Some semantic tags | `header`, `nav`, `main`, `footer` |
| Layout choice | Floats or random | Flexbox OR Grid | Right tool, explains tradeoff |
| Responsive | Desktop only | One breakpoint | Mobile-first or clear breakpoint strategy |
| Code clarity | Messy, no structure | Readable | Clean naming, logical order |
| Communication | Silent coding | Some explanation | Talks through decisions live |

---

## Section 5: Advanced / Tricky (5 min)

**Pick 2 questions based on time and candidate level:**

| # | Question |
|---|----------|
| 1 | "What is z-index? When does it NOT work as expected?" |
| 2 | "How would you implement dark mode?" |
| 3 | "What is `clamp()` and where would you use it?" |
| 4 | "How do you optimize web font loading?" |
| 5 | "What is a CSS reset vs normalize? Which do you prefer?" |
| 6 | "Explain `position: sticky` — how is it different from `fixed`?" |

**Good follow-up for any:** "Have you used this in your project? Show me or describe."

---

## Section 6: Project Deep-Dive (5 min)

| Time | Question |
|------|----------|
| 38:00 | "Open your project or describe it. Walk me through the HTML structure of one page." |
| 40:00 | "Show me one CSS decision you'd change if you rebuilt it." |
| 42:00 | "How did you handle mobile responsiveness? What breakpoint did you use and why?" |
| 43:30 | "If I gave you 2 hours to improve the UI, what would you do first?" |

**Interviewer:** Push for specifics. "Responsive" without a breakpoint number is incomplete.

---

## Wrap-up (2 min)

| Time | Action |
|------|--------|
| 43:00 | "Do you have any questions for me?" (candidate asks 1 question) |
| 44:00 | Interviewer: "We'll be in touch." — **Do not give pass/fail aloud during mock.** |
| 45:00 | Stop timer. Move to debrief. |

---

## Post-Interview Debrief (10 min — not part of 45)

### Candidate self-review

1. Which sections ran over time?
2. Did I explain tradeoffs or only definitions?
3. Was my live task approach clear before coding?
4. Did I connect answers to my project?

### Interviewer scoring

Use [evaluation-rubric.md](./evaluation-rubric.md) — score each dimension 1–5.

### Homework assignment

Based on weak areas:

| Weak area | Go to |
|-----------|-------|
| Semantic HTML | `01-html-css/interview-questions.md` — HTML section |
| Specificity / box model | `01-html-css/revision-sheet.md` |
| Layout live task | Retry Section 4 in 20 minutes solo |
| Responsive design | `01-html-css/mini-tasks.md` |
| Communication | `00-start-here/answer-frameworks.md` — Framework 1 |

**Retry goal:** Run this same kit again in 5 days. Target +1 point on your weakest rubric dimension.

---

## Interviewer Cheat Sheet — Strong Answer Signals

- Mentions **accessibility** without being prompted
- Says "mobile-first" and means it (min-width media queries)
- Knows when **not** to use a framework
- Uses DevTools vocabulary: inspect, computed styles, flex overlay
- Admits a gap honestly: "I haven't used Grid much, but I'd approach it by…"

## Red Flags

- Only knows Bootstrap/Tailwind class names, can't explain CSS underneath
- Says "I just copied from Stack Overflow" with no understanding
- Cannot explain their own project's HTML structure
- No responsive strategy at all
