# HTML & CSS: Common Mistakes

What interviewers hear from students — and what to say instead.

## 1. "I only know Bootstrap/Tailwind, not raw CSS"

**Why it's a problem:** Interviewers want to know you understand what's happening under the utility classes.

**Fix:** Learn Flexbox and Grid fundamentals. Say: "I use Tailwind for speed, but I understand the CSS it generates — here's how I'd build this layout with Flexbox..."

## 2. Using `<div>` for Everything

**Why it's a problem:** Shows no awareness of semantic HTML or accessibility.

**Fix:** Use `<nav>`, `<main>`, `<article>`, `<button>`. Review your project's HTML before the interview.

## 3. Not Knowing Why a Style Isn't Applying

**Why it's a problem:** You'll waste hours in real jobs without specificity/cascade knowledge.

**Fix:** Learn specificity rules. Use DevTools "Computed" tab to see which rule wins.

## 4. Fixed Pixel Layouts Only

**Why it's a problem:** Your project breaks on mobile, and interviewers will notice.

**Fix:** Use relative units (`rem`, `%`, `fr`), `max-width`, and at least 2 breakpoints.

## 5. Removing Focus Outlines

```css
/* NEVER do this without a replacement */
*:focus { outline: none; }
```

**Why it's a problem:** Keyboard users can't navigate your site.

**Fix:** Style focus states: `button:focus-visible { outline: 2px solid blue; }`

## 6. Using `<br>` for Spacing

**Why it's a problem:** `<br>` is for line breaks in text, not layout spacing.

**Fix:** Use margin/padding/gap.

## 7. Inline Styles Everywhere

**Why it's a problem:** Unmaintainable, high specificity, can't reuse.

**Fix:** Use classes. Inline styles only for dynamic JS-generated values.

## 8. Not Testing Cross-Browser

**Why it's a problem:** Works in Chrome, breaks in Safari.

**Fix:** Test in at least Chrome + Firefox or Safari. Check caniuse.com for new CSS features.

## 9. z-index: 9999

**Why it's a problem:** Shows you don't understand stacking contexts.

**Fix:** Debug the stacking context. Fix the parent, not the number.

## 10. Confusing `margin` and `padding`

**Quick rule:**
- **Padding** = space inside the border (background color extends into padding)
- **Margin** = space outside the border (between elements)

## 11. Not Using `box-sizing: border-box`

```css
*, *::before, *::after {
  box-sizing: border-box;
}
```

Put this in every project. Prevents width calculation surprises.

## 12. Float for Layout (in 2024)

**Why it's a problem:** Outdated technique; Flexbox/Grid exist.

**Fix:** Use Flexbox for 1D, Grid for 2D. Know floats exist for text wrapping around images.

---

**Interview tip:** If you catch yourself making one of these mistakes during a live coding round, say "I'd normally use gap here instead of margin" — self-awareness is valued.
