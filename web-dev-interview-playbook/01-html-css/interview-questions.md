# HTML & CSS Interview Questions

> 25+ questions with full answers. Practice out loud.

---

## Question: What is semantic HTML and why does it matter?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
They want to see if you write meaningful markup or just wrap everything in divs.

### Answer
Semantic HTML uses tags that describe the meaning of content — `<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`, `<section>`. This helps screen readers, improves SEO, and makes code readable for other developers.

### Example
```html
<article>
  <header><h1>Blog Post Title</h1></header>
  <p>Content here...</p>
  <footer>Published March 2025</footer>
</article>
```
Instead of `<div class="article">` everywhere.

### Follow-up Questions
- What's the difference between `<section>` and `<article>`?
- Does semantic HTML affect SEO?
- When is a `<div>` still appropriate?

### Common Mistakes
- Using `<div>` for everything
- Using `<b>` instead of `<strong>` for importance
- Skipping heading hierarchy (h1 → h4)

### Project Connection
In your portfolio project, replace generic divs with semantic tags. Interviewers often ask you to review your own HTML.

---

## Question: What is the CSS box model?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Fundamental layout concept — if you don't understand this, spacing bugs will haunt you.

### Answer
Every element is a rectangular box with four areas: content, padding (inside border), border, and margin (outside border). Total width = content + padding + border + margin (in default `box-sizing: content-box`).

### Example
```css
.box {
  width: 200px;
  padding: 20px;
  border: 2px solid black;
  margin: 10px;
  box-sizing: border-box; /* width includes padding + border */
}
```

### Follow-up Questions
- What does `box-sizing: border-box` do?
- How does margin collapse work?
- What's the difference between padding and margin?

### Common Mistakes
- Forgetting that width doesn't include padding by default
- Using margin for spacing inside a component instead of padding
- Not knowing about margin collapse

### Project Connection
When your navbar was 20px wider than expected, it was probably box model + padding.

---

## Question: Explain CSS specificity.

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Tests whether you can debug 'why isn't my style applying?' — a daily real-world problem.

### Answer
Specificity determines which CSS rule wins when multiple rules target the same element. Order: inline styles (1000) > IDs (100) > classes/attributes/pseudo-classes (10) > elements/pseudo-elements (1). `!important` overrides everything (avoid overusing).

### Example
```css
#nav .link { color: blue; }    /* 110 */
p.link { color: red; }           /* 11 */
/* #nav .link wins */
```

### Follow-up Questions
- What happens with `!important`?
- How do you keep specificity low?
- What's the specificity of `:not()`?

### Common Mistakes
- Using IDs for styling (hard to override)
- Adding `!important` everywhere instead of fixing specificity
- Not understanding why Bootstrap overrides fail

### Project Connection
In your project, if a global style broke a component, specificity was likely the cause.

---

## Question: What is Flexbox and when would you use it?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Layout is asked in almost every frontend interview. Flexbox is the default tool for 1D layouts.

### Answer
Flexbox is a CSS layout model for arranging items in a row or column. The parent is a flex container; children are flex items. Key properties: `display: flex`, `justify-content` (main axis), `align-items` (cross axis), `flex-wrap`, `gap`.

### Example
```css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
```

### Follow-up Questions
- Difference between `justify-content` and `align-items`?
- What does `flex: 1` mean?
- Flexbox vs Grid — when to use which?

### Common Mistakes
- Using floats for layout in 2024
- Confusing main axis and cross axis when direction is column
- Not using `gap` and using margins instead

### Project Connection
Your navbar, card rows, and centering a login form — all Flexbox candidates.

---

## Question: What is CSS Grid and when would you use it?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Tests 2D layout knowledge — important for dashboards and complex page layouts.

### Answer
CSS Grid creates a 2D layout with rows and columns. You define a grid on the parent and place children in grid cells. Use Grid for page layouts, card grids, and dashboards. Use Flexbox for navigation bars and small component layouts.

### Example
```css
.dashboard {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
```

### Follow-up Questions
- How is Grid different from Flexbox?
- What is `fr` unit?
- How do you make a responsive grid?

### Common Mistakes
- Using Grid for a simple navbar (overkill)
- Not using `repeat()` and `minmax()` for responsive grids
- Confusing `grid-template-areas` with flex order

### Project Connection
A product listing page with cards in rows and columns is a classic Grid use case.

---

## Question: How do you make a website responsive?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Every real project must work on mobile. This is non-negotiable.

### Answer
Responsive design adapts layout to screen size using: (1) fluid layouts (%, fr, max-width), (2) media queries for breakpoints, (3) responsive images, (4) mobile-first CSS (start small, add complexity), (5) viewport meta tag.

### Example
```css
/* Mobile first */
.container { padding: 1rem; }

@media (min-width: 768px) {
  .container { padding: 2rem; max-width: 1200px; }
}
```
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### Follow-up Questions
- What breakpoints do you use?
- Mobile-first vs desktop-first?
- How do you test responsiveness?

### Common Mistakes
- Only testing on laptop
- Using fixed pixel widths everywhere
- Forgetting the viewport meta tag

### Project Connection
Show your project on mobile during the interview — or explain your breakpoints.

---

## Question: What are CSS pseudo-classes and pseudo-elements?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Tests CSS depth beyond basic selectors.

### Answer
Pseudo-classes style elements in a specific state: `:hover`, `:focus`, `:nth-child()`, `:not()`. Pseudo-elements style specific parts: `::before`, `::after`, `::first-line`. Pseudo-classes use one colon; pseudo-elements use two (CSS3).

### Example
```css
button:hover { background: #0056b3; }
input:focus { outline: 2px solid blue; }
p::first-line { font-weight: bold; }
```

### Follow-up Questions
- `:nth-child` vs `:nth-of-type`?
- What can `::before` be used for?
- How do you style a checkbox without an image?

### Common Mistakes
- Confusing pseudo-classes with pseudo-elements
- Removing focus outlines without providing alternatives (accessibility)
- Overusing `::before` for content that should be in HTML

### Project Connection
Custom styled form inputs in your project likely use pseudo-classes.

---

## Question: What is the difference between `display: none`, `visibility: hidden`, and `opacity: 0`?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Common trick question — tests understanding of rendering and accessibility.

### Answer
`display: none` — element removed from layout, takes no space, not focusable. `visibility: hidden` — invisible but still takes space in layout. `opacity: 0` — invisible but takes space and can still receive pointer events unless you add `pointer-events: none`.

### Example
Use `display: none` for toggling components. Use `opacity` for fade animations. Use `visibility: hidden` rarely — mainly for accessibility tricks.

### Follow-up Questions
- Which is accessible for hiding content from screen readers?
- How do you animate hiding an element?
- What about `aria-hidden`?

### Common Mistakes
- Using `display: none` on focusable elements without managing focus
- Thinking all three behave identically
- Using opacity for modals without handling click-through

### Project Connection
Your modal/dropdown toggle logic depends on knowing these differences.

---

## Question: Explain CSS positioning: static, relative, absolute, fixed, sticky.

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Positioning bugs are common in student projects — interviewers probe this.

### Answer
`static` — default, normal flow. `relative` — offset from normal position, still in flow. `absolute` — removed from flow, positioned relative to nearest positioned ancestor. `fixed` — relative to viewport. `sticky` — hybrid: relative until scroll threshold, then fixed.

### Example
```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
}
.dropdown {
  position: absolute;
  top: 100%;
  right: 0;
}
```

### Follow-up Questions
- What is a positioned ancestor?
- When would you use `sticky`?
- What does `inset: 0` mean?

### Common Mistakes
- Using absolute without a relative parent (element flies to wrong place)
- Using fixed for elements that should scroll
- z-index wars without understanding stacking context

### Project Connection
Dropdown menus, modals, and sticky headers in your project use positioning.

---

## Question: What is z-index and stacking context?

### Difficulty
🔴 Hard

### Why Interviewers Ask This
Separates candidates who've debugged real CSS from those who haven't.

### Answer
`z-index` controls stacking order, but only within the same stacking context. A new stacking context is created by: positioned elements with z-index, opacity < 1, transform, filter, etc. Without understanding contexts, z-index appears 'broken'.

### Example
```css
.parent { position: relative; z-index: 1; }
.child { z-index: 9999; } /* Still below another parent's z-index: 2 */
```

### Follow-up Questions
- How do you create a new stacking context?
- Why doesn't z-index: 9999 always work?
- How do you debug stacking issues?

### Common Mistakes
- Throwing z-index: 9999 at everything
- Not understanding parent stacking contexts
- Using z-index on static elements (no effect)

### Project Connection
Modal appearing behind navbar? Stacking context issue.

---

## Question: What are CSS custom properties (variables)?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Modern CSS practice — shows you keep up with standards.

### Answer
CSS variables (custom properties) are defined with `--name: value` and used with `var(--name)`. They cascade and can be changed at runtime via JavaScript — unlike Sass variables which are compile-time.

### Example
```css
:root {
  --primary: #3498db;
  --spacing: 1rem;
}
.button {
  background: var(--primary);
  padding: var(--spacing);
}
```

### Follow-up Questions
- CSS variables vs Sass variables?
- Can you change them with JavaScript?
- What is `:root`?

### Common Mistakes
- Not using variables for repeated values (colors, spacing)
- Confusing with Sass variables
- Not providing fallback in var(): `var(--color, blue)`

### Project Connection
Theming in your project — dark mode toggle often uses CSS variables.

---

## Question: What is BEM naming convention?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Tests code organization — important for team projects.

### Answer
BEM = Block, Element, Modifier. `.card` (block), `.card__title` (element), `.card--featured` (modifier). Keeps class names predictable and avoids deep nesting in CSS.

### Example
```html
<div class="card card--featured">
  <h2 class="card__title">Title</h2>
</div>
```

### Follow-up Questions
- BEM vs utility-first (Tailwind)?
- Is BEM still relevant?
- How do you name modifiers?

### Common Mistakes
- Overly generic class names like `.box`, `.item`
- Deep nesting in CSS instead of flat BEM
- Using BEM with CSS Modules or scoped styles inconsistently

### Project Connection
If your team project has messy CSS, mention you'd adopt BEM or a consistent convention.

---

## Question: What is the difference between `<script>`, `<script async>`, and `<script defer>`?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Page performance and loading — increasingly asked.

### Answer
Normal `<script>` — blocks HTML parsing, executes immediately. `async` — downloads in parallel, executes as soon as ready (order not guaranteed). `defer` — downloads in parallel, executes after HTML parsing (maintains order). Use `defer` for most scripts; `async` for independent scripts like analytics.

### Example
```html
<script defer src="app.js"></script>
<script async src="analytics.js"></script>
```

### Follow-up Questions
- Where should scripts go — head or body?
- What is render-blocking?
- How does this relate to module scripts?

### Common Mistakes
- Putting all scripts in head without defer/async
- Using async for dependent scripts
- Not knowing the performance impact

### Project Connection
If your React app loads slowly, script loading strategy matters.

---

## Question: What are data attributes in HTML?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Tests HTML5 knowledge and clean JS-DOM interaction.

### Answer
Data attributes (`data-*`) store custom data on HTML elements. Access in JS via `element.dataset.userId` (camelCase). Useful for storing IDs, config, or state without non-standard attributes.

### Example
```html
<button data-product-id="42" data-action="add-to-cart">Add</button>
```
```js
btn.dataset.productId // "42"
```

### Follow-up Questions
- data attributes vs classes for JS hooks?
- Can you query by data attribute?
- Are there naming restrictions?

### Common Mistakes
- Using non-standard attributes like `productid="42"`
- Storing large JSON in data attributes
- Confusing dataset camelCase conversion

### Project Connection
Event delegation on a product list often uses data-product-id.

---

## Question: What is accessibility (a11y) and why should developers care?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Companies increasingly care about inclusive design.

### Answer
Accessibility means making websites usable by people with disabilities — screen reader users, keyboard-only users, color-blind users. Developers should use semantic HTML, alt text, proper labels, keyboard navigation, sufficient color contrast, and ARIA only when HTML isn't enough.

### Example
```html
<img src="chart.png" alt="Sales grew 40% in Q3 2024">
<label for="email">Email</label>
<input id="email" type="email">
<button aria-label="Close dialog">×</button>
```

### Follow-up Questions
- What is ARIA?
- How do you test accessibility?
- What is keyboard trap in a modal?

### Common Mistakes
- Empty alt on meaningful images
- Div buttons instead of `<button>`
- Removing focus outlines
- Using color alone to convey information

### Project Connection
Even one accessibility improvement in your project is worth mentioning.

---

## Question: What is the difference between `<em>` and `<i>`, and `<strong>` and `<b>`?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Semantic vs presentational HTML — quick filter question.

### Answer
`<em>` = emphasis (changes meaning when read aloud). `<i>` = italic styling without semantic meaning (icons, foreign words). `<strong>` = strong importance. `<b>` = bold styling without semantic importance. Prefer semantic tags; use `<i>`/`<b>` only for stylistic bold/italic.

### Example
Use `<strong>` for warnings: `<strong>Warning:</strong> This action is irreversible.`

### Follow-up Questions
- Does `<strong>` always render bold?
- Screen reader behavior for these tags?
- When is `<b>` appropriate?

### Common Mistakes
- Using `<b>` for all bold text
- Not understanding semantic meaning
- Using CSS font-weight instead of semantic tags for importance

### Project Connection
Proper semantic markup in your blog/project shows attention to detail.

---

## Question: How do CSS media queries work?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Core responsive design mechanism.

### Answer
Media queries apply CSS rules based on device characteristics — usually viewport width. Syntax: `@media (min-width: 768px) { ... }`. Mobile-first uses `min-width`; desktop-first uses `max-width`.

### Example
```css
@media (min-width: 768px) and (max-width: 1024px) {
  .sidebar { display: block; }
}
```

### Follow-up Questions
- What media features besides width?
- What is `prefers-color-scheme`?
- How many breakpoints should you use?

### Common Mistakes
- Too many breakpoints (5+)
- Only designing for one screen size
- Using device-specific breakpoints (iPhone width) instead of content-based

### Project Connection
Explain your project's breakpoints and why you chose them.

---

## Question: What are CSS transitions and animations?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
UI polish — shows you care about user experience.

### Answer
Transitions animate property changes over time on state change (hover, class toggle). Animations use `@keyframes` for complex multi-step animations. Transitions are simpler; animations are more powerful.

### Example
```css
.button {
  transition: background-color 0.3s ease;
}
.button:hover { background-color: #0056b3; }

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.modal { animation: fadeIn 0.3s ease; }
```

### Follow-up Questions
- transition vs animation?
- What properties can be animated efficiently?
- What is `will-change`?

### Common Mistakes
- Animating width/height instead of transform (performance)
- Transitions without reduced-motion consideration
- Over-animating everything

### Project Connection
Loading states, hover effects, and modal entrances in your UI.

---

## Question: What is CSS preprocessors (Sass/Less) and do you need them?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Tests awareness of modern CSS tooling.

### Answer
Sass/Less add features like variables, nesting, mixins, and functions. They compile to regular CSS. Modern CSS now has native variables, nesting (2023+), and `@layer`. For new projects, native CSS + PostCSS is often enough; Sass is still common in existing codebases.

### Example
```scss
$primary: #3498db;
.card {
  padding: 1rem;
  &--featured { border: 2px solid $primary; }
}
```

### Follow-up Questions
- Sass vs native CSS nesting?
- What is PostCSS?
- When would you still use Sass?

### Common Mistakes
- Thinking Sass runs in the browser
- Deep nesting creating high specificity
- Not knowing CSS now has native nesting

### Project Connection
If your project uses Tailwind, you might skip Sass entirely — know why.

---

## Question: Explain the CSS cascade and inheritance.

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Foundation for debugging any style conflict.

### Answer
Cascade resolves conflicting rules by: (1) importance (`!important`), (2) specificity, (3) source order. Inheritance passes certain properties (color, font) from parent to child — but not layout properties (margin, padding, border).

### Example
A `<p>` inside `<article>` inherits `color` but not `padding` from the article.

### Follow-up Questions
- Which properties inherit?
- What is `@layer` in CSS?
- How do inline styles fit in the cascade?

### Common Mistakes
- Expecting padding to inherit
- Not understanding why child styles override parent
- Ignoring source order when specificity is equal

### Project Connection
Global styles in your project affecting components — cascade debugging.

---

## Question: What is a CSS reset vs normalize?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Shows awareness of cross-browser consistency.

### Answer
CSS reset strips all default browser styles to zero (Eric Meyer's reset). Normalize.css preserves useful defaults while fixing inconsistencies across browsers. Most projects today use Normalize or a minimal reset + their own base styles.

### Example
Tailwind's Preflight is essentially a modern reset built into the framework.

### Follow-up Questions
- Why do browsers have different default styles?
- What does Tailwind Preflight do?
- Do you still need resets in 2024?

### Common Mistakes
- Not using any reset (inconsistent margins on h1, p across browsers)
- Resetting too aggressively and losing useful defaults
- Not knowing the difference between reset and normalize

### Project Connection
Starting a project from scratch — first thing you add after HTML skeleton.

---

## Question: How would you center an element horizontally and vertically?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Classic interview question — tests layout toolkit.

### Answer
Modern approaches: (1) Flexbox: `display: flex; justify-content: center; align-items: center;` on parent. (2) Grid: `display: grid; place-items: center;`. (3) For horizontal only: `margin: 0 auto` on block element with defined width.

### Example
```css
.center-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
```

### Follow-up Questions
- How did people center before Flexbox?
- Center without flex on the parent?
- Center an unknown-size element?

### Common Mistakes
- Using `position: absolute; top: 50%; transform` when flex works
- Not knowing multiple approaches
- Using `<center>` tag (deprecated)

### Project Connection
Login page, empty states, loading spinners — all need centering.

---

## Question: What is the difference between inline, block, and inline-block?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Fundamental display behavior — layout building blocks.

### Answer
Block: takes full width, starts on new line (div, p). Inline: flows with text, no width/height (span, a). Inline-block: flows with text but accepts width/height (button, img).

### Example
```css
span.badge {
  display: inline-block;
  width: 24px;
  height: 24px;
}
```

### Follow-up Questions
- What is `display: none` vs block?
- What about `inline-flex`?
- How does `display: flow-root` help?

### Common Mistakes
- Applying width/height to inline elements and wondering why it fails
- Using block when inline-block is needed
- Not understanding formatting context

### Project Connection
Navigation links, badges, and tags often need inline-block.

---

## Question: What are web fonts and how do you optimize them?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Performance awareness for real projects.

### Answer
Web fonts are loaded via `@font-face` or services like Google Fonts. Optimization: use `font-display: swap` (show fallback first), subset fonts (only needed characters), preload critical fonts, prefer woff2 format, limit font families/weights.

### Example
```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter.woff2') format('woff2');
  font-display: swap;
}
```

### Follow-up Questions
- What is FOUT vs FOIT?
- Should you self-host Google Fonts?
- What is `font-display: optional`?

### Common Mistakes
- Loading 6 font weights when you need 2
- No font-display strategy (invisible text flash)
- Not preloading critical fonts

### Project Connection
Your portfolio's custom font — mention how you handled loading.

---

## Question: What is CSS `clamp()` and fluid typography?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Modern responsive technique — shows up-to-date knowledge.

### Answer
`clamp(min, preferred, max)` sets a value that scales between min and max based on viewport. Great for fluid font sizes and spacing without many media queries.

### Example
```css
h1 {
  font-size: clamp(1.5rem, 4vw, 3rem);
}
```
Font scales smoothly from 1.5rem to 3rem based on viewport.

### Follow-up Questions
- clamp vs calc vs min/max?
- How do you choose clamp values?
- Browser support concerns?

### Common Mistakes
- Fixed font sizes at every breakpoint instead of fluid
- Not testing clamp at extreme viewport sizes
- Using clamp without understanding the middle value

### Project Connection
Responsive headings in your landing page without 5 media queries.

---

