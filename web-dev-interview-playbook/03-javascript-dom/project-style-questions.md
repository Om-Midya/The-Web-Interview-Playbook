# JavaScript DOM: Project-Style Questions

15 scenario questions interviewers ask about real DOM work. Practice answering with structure: **approach → code outline → tradeoffs**.

---

## 1. Build a Todo App Without a Framework

**Question:** How would you build a todo app with vanilla JS?

**Answer outline:**
- HTML: form (input + button), `<ul>` for list
- JS: on submit, `preventDefault`, create `<li>` with `createElement`, append to list
- Event delegation on `<ul>` for delete/complete clicks
- Optional: `localStorage` for persistence

**Tradeoffs:** Simple and no build step; doesn't scale to complex state. Fine for learning and small apps.

---

## 2. Event Delegation on Dynamic Lists

**Question:** You add list items dynamically. Why attach one listener to the parent instead of each item?

**Answer:** Items may not exist at page load. One listener on parent handles current and future children via bubbling. Fewer listeners = better memory and simpler cleanup.

```javascript
document.getElementById('list').addEventListener('click', (e) => {
  if (e.target.matches('.delete')) {
    e.target.closest('li').remove();
  }
});
```

---

## 3. textContent vs innerHTML

**Question:** When would you use each?

**Answer:**
- `textContent`: plain text, safe from XSS, faster
- `innerHTML`: when you need HTML markup (trusted content only)
- Never use `innerHTML` with unsanitized user input

---

## 4. Fetch and Render a List from API

**Question:** Load users from an API and display them. Walk through your approach.

**Answer:**
```javascript
async function loadUsers() {
  const container = document.getElementById('users');
  container.innerHTML = '<p>Loading...</p>';
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/users');
    if (!res.ok) throw new Error('Failed to fetch');
    const users = await res.json();
    container.innerHTML = users
      .map(u => `<li>${escapeHtml(u.name)}</li>`)
      .join('');
  } catch (err) {
    container.innerHTML = '<p class="error">Could not load users</p>';
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
```

---

## 5. Form Submit Without Page Reload

**Question:** How do you handle form submission in a SPA-like page?

**Answer:** Listen for `submit`, call `e.preventDefault()`, read values via `FormData` or individual inputs, validate, then `fetch` to API. Show success/error in DOM.

---

## 6. Debounce a Search Input

**Question:** User types in search box. How do you avoid firing on every keystroke?

**Answer:** Wrap handler in debounce (300ms). Only search after user pauses typing. Mention throttle is wrong here — we want trailing edge, not rate limit.

---

## 7. Modal Accessibility Basics

**Question:** What DOM/UX concerns for a modal?

**Answer:**
- Focus moves to modal when opened
- Escape closes it
- Focus returns to trigger on close
- `aria-modal="true"`, `role="dialog"`, label with `aria-labelledby`
- Trap focus inside (Tab cycles within modal)
- `overflow: hidden` on body

---

## 8. Optimize DOM Updates for 1000 Items

**Question:** You need to render 1000 list items. How?

**Answer:**
- Use `DocumentFragment` to batch append
- Virtual scrolling for very large lists (only render visible)
- Avoid `innerHTML` in a loop — build string once or use fragment
- Event delegation instead of 1000 click listeners

---

## 9. localStorage for User Preferences

**Question:** Save theme/language preference. Implementation?

**Answer:**
```javascript
// Save
localStorage.setItem('theme', 'dark');

// Load on init
const theme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', theme);
```

**Caveats:** ~5MB limit, synchronous (blocks main thread), strings only, same-origin.

---

## 10. Detect Click Outside Element

**Question:** Close dropdown when clicking outside. How?

**Answer:**
```javascript
document.addEventListener('click', (e) => {
  if (!dropdown.contains(e.target) && !trigger.contains(e.target)) {
    dropdown.classList.remove('open');
  }
});
```

Use capturing phase or check on `document` after toggle opens.

---

## 11. Lazy Load Images

**Question:** Load images only when they enter viewport.

**Answer:** Use `IntersectionObserver`:

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      observer.unobserve(img);
    }
  });
});

document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
```

---

## 12. Custom Dropdown (No `<select>`)

**Question:** Build accessible custom select. Key concerns?

**Answer:** Keyboard nav (arrow keys, Enter, Escape), `aria-expanded`, `aria-activedescendant`, announce selection to screen readers. Often easier to style native `<select>` unless design demands custom.

---

## 13. Drag and Drop File Upload

**Question:** Implement drag-drop zone for files.

**Answer:** Listen to `dragover` (preventDefault to allow drop), `drop` event, read `e.dataTransfer.files`, validate type/size, preview with `FileReader` or upload via `FormData`.

---

## 14. Single Page Tab Navigation

**Question:** Multi-section page, nav highlights active section on scroll.

**Answer:** `IntersectionObserver` on sections OR throttled scroll listener comparing `getBoundingClientRect()`. Update nav `active` class on visible section.

---

## 15. Error Handling in DOM Apps

**Question:** How do you show errors to users for failed API calls?

**Answer:**
- Loading state (spinner/skeleton)
- Try/catch around fetch
- User-friendly message in DOM (not `alert()`)
- Retry button for transient failures
- Log technical details to console, not UI

**Structure:**
```javascript
function setState({ loading, error, data }) {
  loader.hidden = !loading;
  errorEl.hidden = !error;
  errorEl.textContent = error || '';
  content.hidden = loading || !!error;
  if (data) render(data);
}
```

---

## How to Practice

For each question:
1. Answer in 2 minutes out loud
2. Mention one thing you'd do differently at scale
3. Connect to a project if possible
