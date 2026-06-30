# JavaScript DOM: Topics Not to Miss

Check off each topic before your interview.

## DOM Tree Basics

- [ ] Document, Element, Node — difference
- [ ] `document.getElementById`, `querySelector`, `querySelectorAll`
- [ ] When to use `getElementById` vs `querySelector`
- [ ] Node types: Element (1), Text (3), Comment (8)
- [ ] `parentNode`, `children`, `firstElementChild`, `nextElementSibling`
- [ ] `childNodes` vs `children` (includes text nodes vs elements only)

## Reading & Modifying DOM

- [ ] `textContent` vs `innerHTML` vs `innerText`
- [ ] `setAttribute` / `getAttribute` / `dataset` (`data-*`)
- [ ] `classList.add`, `remove`, `toggle`, `contains`
- [ ] `style` property vs `classList` (prefer classes)
- [ ] `createElement`, `appendChild`, `insertBefore`, `remove`
- [ ] `DocumentFragment` for batch inserts

## Events

- [ ] `addEventListener` vs inline `onclick`
- [ ] Event object: `target` vs `currentTarget`
- [ ] Bubbling vs capturing (3 phases)
- [ ] `stopPropagation` vs `preventDefault`
- [ ] Event delegation pattern
- [ ] `once` option, `{ passive: true }` for scroll
- [ ] Common events: `click`, `submit`, `input`, `keydown`, `change`

## Forms

- [ ] `form` submit event and `preventDefault`
- [ ] `FormData` API
- [ ] Input types and validation attributes
- [ ] `input` vs `change` events
- [ ] Reading values: `value`, `checked`, `selectedIndex`

## Browser APIs

- [ ] `fetch` + JSON for API calls
- [ ] `localStorage` / `sessionStorage`
- [ ] `JSON.parse` / `JSON.stringify`
- [ ] `setTimeout` / `setInterval` / `clearInterval`
- [ ] `window.location`, `history.pushState` (SPA basics)

## Performance & Best Practices

- [ ] Minimize DOM queries (cache selectors)
- [ ] Batch DOM updates (fragment, `display: none` trick)
- [ ] Reflow vs repaint (conceptual)
- [ ] Event delegation for dynamic lists
- [ ] Debounce for search inputs

## Security Basics

- [ ] XSS risk with `innerHTML` and user input
- [ ] `textContent` for user-generated text
- [ ] CSP awareness (conceptual)

## Module Organization

- [ ] Separating HTML, CSS, JS
- [ ] IIFE or ES modules for scope
- [ ] DOMContentLoaded vs script at end of body

---

**Self-test:** Can you build a todo list with add, delete, and filter in 30 minutes using only vanilla JS? If not, start `mini-dom-challenges.md`.
