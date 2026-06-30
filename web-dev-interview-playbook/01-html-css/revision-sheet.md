# HTML & CSS: Revision Sheet

One-page rapid review. Read this the night before your interview.

## Box Model
`content → padding → border → margin` | Use `box-sizing: border-box`

## Specificity (low → high)
Element (1) < Class (10) < ID (100) < Inline (1000) | Avoid `!important`

## Flexbox (1D layout)
Parent: `display:flex`, `justify-content`, `align-items`, `gap`, `flex-wrap`
Child: `flex: 1`, `align-self`

## Grid (2D layout)
`display:grid`, `grid-template-columns: repeat(3, 1fr)`, `gap`, `grid-template-areas`

## Flexbox vs Grid
- **Flexbox:** navbar, card row, centering, 1D
- **Grid:** page layout, card grid, dashboard, 2D

## Positioning
- `relative` — offset, still in flow
- `absolute` — relative to positioned parent
- `fixed` — viewport
- `sticky` — scroll-based fixed

## Responsive
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```
Mobile-first: `@media (min-width: 768px)`

## Semantic HTML
`header`, `nav`, `main`, `article`, `section`, `footer` — not div soup

## Accessibility Quick Hits
- `alt` on images
- `<label for="id">` on form inputs
- `<button>` for actions, `<a>` for navigation
- Don't remove focus outlines
- Color contrast 4.5:1 minimum

## Centering
```css
.parent { display: flex; justify-content: center; align-items: center; }
/* OR */
.parent { display: grid; place-items: center; }
```

## Common Display Values
- `block` — full width, new line
- `inline` — no width/height
- `inline-block` — width/height, flows with text
- `none` — removed from layout

## Pseudo-classes vs Pseudo-elements
- `:hover`, `:focus`, `:nth-child()` — one colon
- `::before`, `::after` — two colons

## Script Loading
- `defer` — after HTML parse, keeps order (preferred)
- `async` — when ready, no order guarantee

## CSS Variables
```css
:root { --primary: #3498db; }
.btn { background: var(--primary); }
```

## z-index
Only works within same stacking context. New context: positioned + z-index, opacity < 1, transform.

## Quick Answers
| Question | Answer |
|----------|--------|
| margin vs padding | margin = outside border, padding = inside |
| em vs rem | em = parent relative, rem = root relative |
| id vs class | id = unique, class = reusable |
| strong vs b | strong = semantic importance, b = visual only |
| display:none vs visibility:hidden | none = no space, hidden = takes space |

---

**Last check:** Open your project, resize to mobile, and explain your layout choices out loud.
