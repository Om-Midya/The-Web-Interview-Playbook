# HTML & CSS: Mock Interview (45 Minutes)

Use this script with a friend. One person is interviewer, one is candidate. Switch roles after.

**Rules:**
- Candidate answers out loud, no reading from notes
- Interviewer asks at least 2 follow-ups per question
- Time each section

---

## Section 1: Warm-up (5 min)

1. "Tell me about a frontend project you've worked on."
2. "How did you approach styling it?"
3. "Did you face any CSS challenges?"

*Interviewer: Note if candidate mentions responsive design and semantic HTML.*

---

## Section 2: HTML Fundamentals (8 min)

1. "What is semantic HTML? Give me 3 semantic tags and when you'd use them."
   - Follow-up: "What's the difference between `<section>` and `<article>`?"
2. "How do you make a form accessible?"
   - Follow-up: "What happens if you use a `<div>` as a button?"
3. "Explain `defer` vs `async` on script tags."

---

## Section 3: CSS Core (10 min)

1. "Explain the CSS box model."
   - Follow-up: "What does `box-sizing: border-box` change?"
2. "How does CSS specificity work? Which wins: `#nav .link` or `ul li a`?"
   - Follow-up: "When would you use `!important`?" (Trick: almost never)
3. "What's the difference between `display: none`, `visibility: hidden`, and `opacity: 0`?"

---

## Section 4: Layout Live Challenge (12 min)

**Interviewer:** Share screen or use paper/whiteboard.

> "Build a responsive layout: header with logo + nav links, 3-column card grid below, footer. Cards should become 1 column on mobile. Talk through your approach."

*Candidate explains approach first, then writes HTML/CSS (or pseudocode).*

**Follow-ups:**
- "Why Grid instead of Flexbox here?" (or vice versa)
- "How would you center the logo and nav?"
- "Add a sticky header."

**Evaluation criteria:**
- Uses semantic HTML
- Chooses appropriate layout method
- Mentions responsive strategy
- Clean class naming

---

## Section 5: Advanced / Tricky (5 min)

Pick 2:

1. "What is z-index and when does it not work?"
2. "How would you implement dark mode?"
3. "What is `clamp()` and where would you use it?"
4. "How do you optimize web font loading?"

---

## Section 6: Project Connection (5 min)

1. "Open your project (or describe it). Walk me through the HTML structure."
2. "Show me one CSS decision you'd change if you rebuilt it."
3. "How did you handle mobile responsiveness?"

---

## Evaluation Rubric (Quick)

| Area | 1 (Weak) | 3 (Good) | 5 (Strong) |
|------|----------|----------|------------|
| Semantic HTML | div soup | Some semantic tags | Consistent semantic structure |
| Layout | Only knows floats | Flexbox comfortable | Flex + Grid, explains tradeoffs |
| Responsive | Desktop only | 1-2 breakpoints | Mobile-first, fluid design |
| Debugging | Guesses | Knows specificity | Systematic DevTools approach |
| Communication | One-word answers | Clear explanations | Examples + tradeoffs + project links |

---

## Debrief (5 min)

Candidate asks:
- Which answers were weak?
- Did I talk too much or too little?
- Was my live coding approach clear?

**Homework:** Redo weak sections from `interview-questions.md` and retry Section 4 in 20 minutes.
