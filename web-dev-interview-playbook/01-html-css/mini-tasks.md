# HTML & CSS: Mini Tasks

Hands-on practice. Do these **without** Bootstrap or Tailwind. Use plain HTML + CSS.

## Task 1: Responsive Navbar (30 min)

**Requirements:**
- Logo on the left, nav links on the right
- Hamburger menu on mobile (< 768px)
- Sticky at top on scroll
- Active link highlighted

**Skills tested:** Flexbox, media queries, positioning

**Bonus:** Make hamburger toggle with pure CSS (checkbox hack) or minimal JS

---

## Task 2: Card Grid (20 min)

**Requirements:**
- 3 columns on desktop, 2 on tablet, 1 on mobile
- Each card: image, title, description, button
- Equal height cards
- 20px gap between cards

**Skills tested:** CSS Grid, responsive design

```css
/* Starter hint */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}
```

---

## Task 3: Centered Login Form (15 min)

**Requirements:**
- Form centered horizontally and vertically on page
- Inputs: email, password, submit button
- Proper `<label>` for each input
- Focus styles on inputs
- Max-width 400px

**Skills tested:** Flexbox centering, form semantics, accessibility

---

## Task 4: CSS-Only Tooltip (20 min)

**Requirements:**
- Hover over a button → tooltip appears above it
- No JavaScript
- Use `::after` or `::before`

**Skills tested:** Pseudo-elements, positioning

---

## Task 5: Dark Mode Toggle (25 min)

**Requirements:**
- Toggle button switches between light and dark theme
- Use CSS custom properties
- Preference persists (localStorage + JS is fine for toggle)
- Respect `prefers-color-scheme` as default

**Skills tested:** CSS variables, media queries

```css
:root {
  --bg: #ffffff;
  --text: #1a1a1a;
}
[data-theme="dark"] {
  --bg: #1a1a1a;
  --text: #ffffff;
}
```

---

## Task 6: Accessible Modal (30 min)

**Requirements:**
- Overlay + centered modal box
- Close button + click outside to close
- Trap focus inside modal when open
- `aria-modal="true"`, `role="dialog"`

**Skills tested:** Positioning, z-index, accessibility, basic JS

---

## Task 7: Holy Grail Layout (20 min)

**Requirements:**
- Header (full width, fixed height)
- Sidebar (left, 250px)
- Main content (fills remaining space)
- Footer (full width, bottom)

**Skills tested:** Grid or Flexbox layout

```css
/* Grid approach */
.layout {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 250px 1fr;
  min-height: 100vh;
}
```

---

## Task 8: Animated Loading Skeleton (15 min)

**Requirements:**
- Gray placeholder blocks mimicking text lines
- Shimmer animation left to right
- Use `@keyframes` and `background: linear-gradient`

**Skills tested:** Animations, pseudo-elements

---

## Self-Evaluation

After each task, check:
- [ ] Works on mobile (375px width)
- [ ] No horizontal scroll
- [ ] Keyboard navigable
- [ ] Clean class names (BEM or logical naming)
- [ ] No `!important` needed

**Share your solutions** — compare with a friend or push to GitHub for your portfolio.
