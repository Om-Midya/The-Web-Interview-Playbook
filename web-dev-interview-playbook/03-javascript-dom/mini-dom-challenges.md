# JavaScript DOM: Mini Challenges

8 challenges to build in plain HTML + CSS + JS. No frameworks. Each should take 30–60 minutes.

---

## Challenge 1: Interactive Counter

**Requirements:**
- Display a number starting at 0
- `+` and `-` buttons
- Reset button
- Don't go below 0

**Skills tested:** Selecting elements, click handlers, updating `textContent`

```javascript
const countEl = document.getElementById('count');
let count = 0;

document.getElementById('increment').addEventListener('click', () => {
  count++;
  countEl.textContent = count;
});

document.getElementById('decrement').addEventListener('click', () => {
  if (count > 0) {
    count--;
    countEl.textContent = count;
  }
});
```

**Stretch:** Add keyboard shortcuts (+/- keys).

---

## Challenge 2: Todo List

**Requirements:**
- Add todos via input + button (or Enter key)
- Mark complete (strikethrough)
- Delete individual todos
- Show count of remaining items

**Skills tested:** Creating elements, event delegation, form handling

```javascript
const list = document.getElementById('todo-list');

list.addEventListener('click', (e) => {
  if (e.target.matches('.delete-btn')) {
    e.target.closest('li').remove();
    updateCount();
  }
  if (e.target.matches('.toggle-btn')) {
    e.target.closest('li').classList.toggle('completed');
    updateCount();
  }
});
```

**Stretch:** Persist todos to `localStorage`.

---

## Challenge 3: Tabs Component

**Requirements:**
- 3+ tab buttons, one content panel visible at a time
- Active tab styled differently
- Clicking tab shows corresponding content

**Skills tested:** `classList`, `data-*` attributes, toggling visibility

```html
<button class="tab active" data-tab="tab1">Tab 1</button>
<div id="tab1" class="panel active">Content 1</div>
```

```javascript
document.querySelector('.tabs').addEventListener('click', (e) => {
  if (!e.target.matches('.tab')) return;
  const tabId = e.target.dataset.tab;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  e.target.classList.add('active');
  document.getElementById(tabId).classList.add('active');
});
```

---

## Challenge 4: Modal Dialog

**Requirements:**
- Open modal on button click
- Close on X button, overlay click, or Escape key
- Trap focus inside modal (stretch)
- Prevent body scroll when open

**Skills tested:** `classList`, keyboard events, `preventDefault`

```javascript
function openModal() {
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});
```

---

## Challenge 5: Live Search Filter

**Requirements:**
- List of items (names or products)
- Search input filters list in real time
- Show "No results" when nothing matches
- Debounce input (300ms)

**Skills tested:** `input` event, debounce, `filter`, toggling `display` or removing nodes

```javascript
const debouncedSearch = debounce((query) => {
  const items = document.querySelectorAll('.item');
  let visible = 0;
  items.forEach(item => {
    const match = item.textContent.toLowerCase().includes(query.toLowerCase());
    item.style.display = match ? '' : 'none';
    if (match) visible++;
  });
  noResultsEl.hidden = visible > 0;
}, 300);
```

---

## Challenge 6: Form Validation

**Requirements:**
- Registration form: name, email, password, confirm password
- Validate on submit (not just HTML5)
- Show inline error messages
- Don't submit if invalid

**Skills tested:** `submit` event, `preventDefault`, regex, DOM error display

```javascript
form.addEventListener('submit', (e) => {
  e.preventDefault();
  clearErrors();
  const errors = validateForm();
  if (errors.length) {
    errors.forEach(({ field, message }) => showError(field, message));
    return;
  }
  // submit via fetch or show success
});

function validateForm() {
  const errors = [];
  const email = form.email.value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push({ field: 'email', message: 'Invalid email' });
  }
  if (form.password.value !== form.confirm.value) {
    errors.push({ field: 'confirm', message: 'Passwords do not match' });
  }
  return errors;
}
```

---

## Challenge 7: Infinite Scroll (Simulated)

**Requirements:**
- Initial list of 20 items
- When user scrolls near bottom, load 20 more
- Show loading indicator while fetching
- Use `fetch` to a mock API (JSONPlaceholder `/posts`) or fake delay

**Skills tested:** Scroll events (throttled), `fetch`, appending DOM nodes

```javascript
const throttledScroll = throttle(() => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 200) {
    loadMore();
  }
}, 200);

window.addEventListener('scroll', throttledScroll);
```

---

## Challenge 8: Theme Toggle (Dark/Light)

**Requirements:**
- Toggle button switches theme
- Persist preference in `localStorage`
- Respect `prefers-color-scheme` on first visit
- Smooth transition between themes

**Skills tested:** CSS variables, `localStorage`, `matchMedia`

```javascript
const stored = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const theme = stored || (prefersDark ? 'dark' : 'light');
document.documentElement.setAttribute('data-theme', theme);

toggleBtn.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});
```

```css
:root[data-theme="light"] { --bg: #fff; --text: #111; }
:root[data-theme="dark"]  { --bg: #111; --text: #fff; }
body { background: var(--bg); color: var(--text); transition: 0.3s; }
```

---

## Completion Checklist

| # | Challenge | Done | Time |
|---|-----------|------|------|
| 1 | Counter | ☐ | ___ min |
| 2 | Todo List | ☐ | ___ min |
| 3 | Tabs | ☐ | ___ min |
| 4 | Modal | ☐ | ___ min |
| 5 | Live Search | ☐ | ___ min |
| 6 | Form Validation | ☐ | ___ min |
| 7 | Infinite Scroll | ☐ | ___ min |
| 8 | Theme Toggle | ☐ | ___ min |

**Interview tip:** Pick 2 challenges and be ready to walk through your code structure, event handling choices, and what you'd improve.
