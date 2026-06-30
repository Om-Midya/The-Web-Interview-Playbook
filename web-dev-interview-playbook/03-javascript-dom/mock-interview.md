# JavaScript DOM: Mock Interview (45 Minutes)

Use with a friend. Switch interviewer/candidate roles after.

**Rules:**
- Candidate answers out loud
- Interviewer asks 2+ follow-ups per question
- Section 4 is live coding

---

## Section 1: Warm-up (5 min)

1. "Describe a vanilla JS project or feature you've built."
2. "Why learn DOM if frameworks exist?"
3. "What's the hardest DOM bug you've debugged?"

---

## Section 2: DOM Fundamentals (10 min)

1. "How do you select elements in the DOM?"
   - Follow-up: "`querySelectorAll` returns what type?"
2. "Difference between `textContent` and `innerHTML`?"
   - Follow-up: "Security concern with `innerHTML`?"
3. "How do you create and append a new list item?"

---

## Section 3: Events (8 min)

1. "Explain event bubbling."
   - Follow-up: "What is event capturing?"
2. "What is event delegation? When do you use it?"
   - Follow-up: "`target` vs `currentTarget`?"
3. "Difference between `preventDefault` and `stopPropagation`?"

---

## Section 4: Live Coding (12 min)

**Pick ONE:**

### Option A: Todo item add + delete

> "Build HTML structure and JS to add todos and delete them. Use event delegation for delete."

**Evaluate:** `preventDefault` or button type, `createElement`, delegation on parent.

### Option B: Filter list

> "Given a list of names in HTML, filter them as user types in a search box."

### Option C: Fetch and display

> "Fetch posts from JSONPlaceholder and render as a list. Handle loading and error."

**Follow-ups:**
- "How would you persist todos?"
- "How would you debounce the search?"

---

## Section 5: Forms & APIs (5 min)

1. "How do you submit a form without page reload?"
2. "How do you read form data in JS?"
3. "Walk through a fetch call — what can go wrong?"

---

## Section 6: Project & Advanced (5 min)

Pick 2:

1. "How would you implement a modal?"
2. "localStorage vs sessionStorage?"
3. "How to lazy-load images?"
4. "1000 list items — performance concerns?"

**Project connection:**
- "Open your project — show me where you manipulate the DOM."
- "What would you refactor?"

---

## Evaluation Rubric

| Area | 1 (Weak) | 3 (Good) | 5 (Strong) |
|------|----------|----------|------------|
| Selection/API | Only getElementById | querySelector + traversal | closest, matches, fragments |
| Events | Inline onclick | addEventListener | Delegation + phases |
| Dynamic DOM | innerHTML only | createElement | Fragment + XSS awareness |
| Fetch integration | No error handling | try/catch + loading | Full loading/error/empty states |
| Communication | Code only | Explains steps | Tradeoffs + accessibility |

---

## Debrief (5 min)

**Homework:** Complete 2 challenges from `mini-dom-challenges.md` you haven't built yet. Redo Section 4 in under 10 minutes.
