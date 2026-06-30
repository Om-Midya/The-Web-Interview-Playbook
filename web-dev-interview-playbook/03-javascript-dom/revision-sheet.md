# JavaScript DOM: Revision Sheet

One-page rapid review. Read this the night before your interview.

## Selecting Elements

```javascript
document.getElementById('id')           // one element
document.querySelector('.class')        // first match
document.querySelectorAll('.class')     // NodeList (static)
element.closest('.parent')              // up the tree
element.matches('.selector')            // boolean
```

## Reading & Writing

| Property | Use |
|----------|-----|
| `textContent` | Plain text (safe) |
| `innerHTML` | HTML string (XSS risk) |
| `value` | Form inputs |
| `classList` | Add/remove/toggle classes |
| `dataset.foo` | `data-foo` attribute |

## Creating Elements

```javascript
const li = document.createElement('li');
li.textContent = 'Item';
li.classList.add('item');
list.appendChild(li);

// Batch with fragment
const frag = document.createDocumentFragment();
items.forEach(i => frag.appendChild(createItem(i)));
list.appendChild(frag);
```

## Events

```javascript
el.addEventListener('click', handler);
el.addEventListener('click', handler, { once: true, passive: true });
el.removeEventListener('click', handler); // same function ref
```

**Phases:** capturing → target → bubbling (default listens on bubbling)

| Method | Does |
|--------|------|
| `preventDefault()` | Stop default action (form submit, link) |
| `stopPropagation()` | Stop event traveling up/down |

## Event Delegation

One listener on parent for dynamic children:

```javascript
parent.addEventListener('click', (e) => {
  if (e.target.matches('.btn-delete')) { /* ... */ }
});
```

## Forms

```javascript
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const email = data.get('email');
});
```

## Fetch Pattern

```javascript
async function load() {
  try {
    const res = await fetch('/api/data');
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    render(data);
  } catch (err) {
    showError('Something went wrong');
  }
}
```

## Storage

```javascript
localStorage.setItem('key', JSON.stringify(obj));
const obj = JSON.parse(localStorage.getItem('key') || '{}');
sessionStorage // same API, cleared on tab close
```

## Performance Tips

- Cache DOM references
- Batch updates (fragment, innerHTML once)
- Delegate events on lists
- Debounce search, throttle scroll
- `IntersectionObserver` for lazy load

## Security

- Never `innerHTML` with user input
- Use `textContent` or sanitize
- Validate on client AND server

## DOMContentLoaded

```javascript
document.addEventListener('DOMContentLoaded', init);
// Or put <script defer src="app.js"> at end of body
```

## Quick Answers

| Question | Answer |
|----------|--------|
| `children` vs `childNodes` | children = elements only; childNodes includes text |
| `input` vs `change` | input = every keystroke; change = on blur/commit |
| Why delegation? | Works for dynamic elements, fewer listeners |
| Reflow trigger | layout reads after style changes (offsetHeight, etc.) |

## Mini Project Checklist

- [ ] preventDefault on forms
- [ ] Event delegation for lists
- [ ] Loading + error states for fetch
- [ ] No inline onclick handlers
- [ ] Accessible buttons (not divs)
