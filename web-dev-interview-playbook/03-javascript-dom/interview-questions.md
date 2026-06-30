# JavaScript DOM Interview Questions

> 25+ questions with full answers. Practice out loud.

---

## Question: What is the DOM and how does the browser build the DOM tree?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Every frontend role assumes you can explain how HTML becomes interactive objects in JavaScript.

### Answer
The Document Object Model is a tree-shaped API representing HTML/XML documents. When the browser parses HTML, it creates nodes (document, elements, text). JavaScript can read and mutate this tree; changes can trigger rendering updates.

### Example
```html
<ul id="menu"><li>Home</li></ul>
```
```javascript
const menu = document.getElementById('menu');
console.log(menu.children.length); // 1
```

### Follow-up Questions
- What is the difference between DOM and BOM?
- What is a live vs static NodeList?
- How does the DOM relate to accessibility trees?

### Common Mistakes
- Confusing DOM with the rendered pixels on screen
- Thinking the DOM is only HTML strings
- Forgetting text nodes exist between elements

### Project Connection
Draw the tree for a page in your portfolio (header, main, footer) before an interview whiteboard question.

---

## Question: What are common ways to select elements in the DOM?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Selectors are daily work; interviewers check API breadth beyond `getElementById`.

### Answer
Legacy APIs: `getElementById`, `getElementsByClassName`, `getElementsByTagName` (often live HTMLCollections). Modern: `querySelector` / `querySelectorAll` (CSS selectors, static NodeLists). Prefer `querySelector` for flexibility; cache references if queried often.

### Example
```javascript
document.querySelector('nav .active');
document.querySelectorAll('button[data-action]');
```

### Follow-up Questions
- When would you avoid `querySelector`?
- What is a live collection?
- How do you scope queries to a subtree?

### Common Mistakes
- Calling `querySelector` inside hot loops without caching
- Using `#id` incorrectly in older IE contexts
- Assuming `getElementsByClassName` returns an array

### Project Connection
Refactor one page to use `data-*` attributes and `querySelectorAll` for event delegation.

---

## Question: How does `document.querySelector` differ from `getElementById`?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Tests practical API choice and performance habits.

### Answer
`getElementById` only finds by ID and is very fast. `querySelector` accepts any CSS selector (first match only). IDs must be unique; querySelector can target classes, attributes, and combinators.

### Example
```javascript
document.getElementById('submit');
document.querySelector('#submit');
document.querySelector('form button.primary');
```

### Follow-up Questions
- Can IDs contain special characters?
- What does `querySelectorAll` return?
- How do you escape CSS in selectors?

### Common Mistakes
- Using non-unique IDs then querying with querySelector
- Overusing complex selectors on huge documents
- Forgetting querySelector returns null

### Project Connection
Use `element.querySelector` inside a modal component to limit search scope.

---

## Question: How do you create and insert new elements with `createElement` and `appendChild`?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Core imperative DOM manipulation still appears in vanilla JS and interview live coding.

### Answer
`document.createElement(tag)` builds an element node. Set content/properties, then attach with `appendChild`, `insertBefore`, or newer `append`/`prepend`/`replaceChildren`. Parent-child links update the tree immediately.

### Example
```javascript
const li = document.createElement('li');
li.textContent = 'New item';
document.querySelector('ul').appendChild(li);
```

### Follow-up Questions
- What is `DocumentFragment`?
- Difference between `append` and `appendChild`?
- How do you remove a node?

### Common Mistakes
- Appending HTML strings with innerHTML when structured nodes are safer
- Forgetting to set text before append
- Creating elements in a loop without a fragment (extra reflows)

### Project Connection
Build a todo list that only uses createElement — great portfolio talking point.

---

## Question: When should you use `innerHTML` vs `textContent`?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Security (XSS) and correctness come up constantly in web interviews.

### Answer
`textContent` sets plain text; HTML characters are escaped and scripts won't run. `innerHTML` parses HTML strings — powerful but dangerous with untrusted input. For user data, prefer `textContent` or sanitize HTML.

### Example
```javascript
el.textContent = userInput; // safe
el.innerHTML = '<strong>Hi</strong>'; // trusted HTML only
```

### Follow-up Questions
- What is `insertAdjacentHTML`?
- Does innerHTML execute script tags?
- What about `innerText`?

### Common Mistakes
- Injecting user input via innerHTML
- Using innerHTML for simple text labels
- Assuming innerHTML is faster in all cases

### Project Connection
Audit your project for any `dangerouslySetInnerHTML` or innerHTML with API data.

---

## Question: Explain event bubbling in the DOM.

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Event flow questions separate juniors who only use `addEventListener` blindly.

### Answer
After the target phase, most events bubble from the target up through ancestors to `document`. Handlers on parents run after the target's handler (unless capture). Useful for delegation.

### Example
```javascript
button.addEventListener('click', () => console.log('button'));
div.addEventListener('click', () => console.log('div'));
// click button logs: button, then div
```

### Follow-up Questions
- Which events do not bubble?
- What is the target vs currentTarget?
- How does capture phase work?

### Common Mistakes
- Assuming all events bubble (focus/blur do not)
- Attaching duplicate handlers on every child
- Not understanding order with capture listeners

### Project Connection
Explain how a click on a nested icon still triggers a card handler in your UI.

---

## Question: What is the event capturing phase?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Shows deeper knowledge of the DOM event model.

### Answer
Capture travels from window down to the target before bubbling. Register with `addEventListener(type, fn, { capture: true })` or third argument `true`. Rare for app logic; used for analytics, focus traps, or intercepting early.

### Example
```javascript
div.addEventListener('click', () => console.log('capture'), true);
button.addEventListener('click', () => console.log('target'));
```

### Follow-up Questions
- Default capture value?
- How do stopPropagation and capture interact?
- Event delegation in capture phase?

### Common Mistakes
- Enabling capture without reason and breaking expected order
- Confusing capture with passive listeners
- Forgetting removeEventListener needs same capture flag

### Project Connection
Mention capture when discussing modal focus management in interviews.

---

## Question: What is event delegation and why use it?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Efficiency and dynamic lists are classic frontend interview topics.

### Answer
Attach one listener on a parent; use `event.target` (and `closest`) to handle child interactions. Works for elements added later without rebinding. Reduces memory and setup cost for long lists.

### Example
```javascript
list.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-id]');
  if (!btn || !list.contains(btn)) return;
  deleteItem(btn.dataset.id);
});
```

### Follow-up Questions
- When is delegation a bad idea?
- How does `closest` help?
- Performance on huge tables?

### Common Mistakes
- Checking target without closest and mis-clicking nested spans
- Delegating on too high a node (document) carelessly
- Not filtering non-matching targets

### Project Connection
Your dynamic comment list or table rows should use one delegated listener.

---

## Question: What does `event.preventDefault()` do?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Forms and links are everywhere; default actions matter.

### Answer
Cancels the browser's default behavior for that event if `cancelable` is true — e.g. following a link, submitting a form, context menu. Does not stop propagation.

### Example
```javascript
form.addEventListener('submit', (e) => {
  e.preventDefault();
  submitViaFetch(new FormData(form));
});
```

### Follow-up Questions
- Difference from stopPropagation?
- Is preventDefault always allowed?
- passive touch listeners?

### Common Mistakes
- Calling preventDefault on non-cancelable events
- Preventing default but not handling validation UX
- Using return false in old inline handlers inconsistently

### Project Connection
SPA login forms should preventDefault and show inline errors — demo in portfolio.

---

## Question: What does `event.stopPropagation()` do?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Nested interactive UIs need controlled event flow.

### Answer
Stops the event from traveling to other elements in bubble or capture phases after the current listener runs (unless stopped earlier). Does not prevent default browser action.

### Example
```javascript
inner.addEventListener('click', (e) => {
  e.stopPropagation();
});
```

### Follow-up Questions
- What is stopImmediatePropagation?
- Modal overlay clicks?
- Does it affect other event types on same element?

### Common Mistakes
- Stopping propagation instead of fixing delegation logic
- Breaking document-level escape handlers unintentionally
- Mixing up with preventDefault

### Project Connection
Card with inner buttons: explain when you stop propagation so row click doesn't fire.

---

## Question: Attributes vs properties on DOM elements — what's the difference?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
React and form interviews love this distinction.

### Answer
Attributes are in HTML markup (strings). Properties are JS object fields on DOM nodes; some mirror attributes, some don't (`value`, `checked`). `getAttribute`/`setAttribute` vs `.value` / `.checked`.

### Example
```html
<input id="x" value="initial">
```
```javascript
const i = document.getElementById('x');
i.value = 'typed';
console.log(i.getAttribute('value')); // still 'initial'
```

### Follow-up Questions
- How does boolean attribute reflection work?
- custom data attributes?
- Why React uses value/checked carefully?

### Common Mistakes
- Using setAttribute('value') expecting current input text
- Reading href attribute vs property on anchors
- Confusing class attribute with className property

### Project Connection
Debug a form bug by comparing attribute default vs live property value.

---

## Question: How do you work with `element.classList`?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Toggling UI state in vanilla JS or understanding what frameworks compile to.

### Answer
`classList` provides `add`, `remove`, `toggle`, `contains`, `replace` without manual string parsing. Respects multiple classes. For whole replacement, `className` or `setAttribute('class')` still exist.

### Example
```javascript
panel.classList.toggle('open');
btn.classList.add('active');
```

### Follow-up Questions
- classList vs className performance?
- SVG classList quirks?
- How do frameworks batch class updates?

### Common Mistakes
- Splitting className strings manually
- Assuming toggle returns void (it returns boolean)
- Forgetting to remove classes on state exit

### Project Connection
Implement accordion open/close with classList only — simple interview exercise.

---

## Question: What is `element.dataset` and how do `data-*` attributes work?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Clean hooks for JS behavior without extra IDs.

### Answer
HTML `data-*` attributes expose a `dataset` object with camelCase keys (`data-user-id` → `dataset.userId`). Values are strings. Useful for config, delegation targets, and testing selectors.

### Example
```html
<button data-action="delete" data-id="42">Del</button>
```
```javascript
btn.dataset.action; // 'delete'
```

### Follow-up Questions
- Are dataset names validated?
- Can you store JSON in data attributes?
- Accessibility concerns?

### Common Mistakes
- Storing large JSON in data attributes
- Wrong camelCase mapping
- Using dataset for visible content instead of text

### Project Connection
Mark interactive cards with data-id for delegation in your project.

---

## Question: How does `localStorage` differ from `sessionStorage`?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Client storage basics appear in fullstack student interviews.

### Answer
Both are key-value Web Storage APIs (strings only). `localStorage` persists until cleared per origin. `sessionStorage` lasts for the page session (tab). Same origin policy applies; ~5MB typical limit. Not sent on HTTP requests unlike cookies.

### Example
```javascript
localStorage.setItem('theme', 'dark');
sessionStorage.setItem('draft', formText);
```

### Follow-up Questions
- How do you store objects?
- Storage events?
- IndexedDB when?

### Common Mistakes
- Storing tokens without understanding XSS risk
- Not handling quota errors
- Using localStorage for large binary data

### Project Connection
Theme toggle with localStorage is an easy portfolio feature to discuss.

---

## Question: When does `DOMContentLoaded` fire vs `window.load`?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Script placement and performance tuning depend on lifecycle events.

### Answer
`DOMContentLoaded` fires when HTML is parsed and deferred scripts run — DOM ready, images may still load. `load` fires when all resources (images, styles) finish. Prefer DOMContentLoaded for early DOM setup.

### Example
```javascript
document.addEventListener('DOMContentLoaded', initUI);
window.addEventListener('load', () => console.log('all assets ready'));
```

### Follow-up Questions
- What about `defer` and `async` scripts?
- Is DOMContentLoaded before body end?
- document.readyState values?

### Common Mistakes
- Waiting for window.load before harmless DOM work
- Attaching DOMContentLoaded after it already fired
- Blocking parse with sync scripts in head

### Project Connection
Move init code to DOMContentLoaded to improve perceived load in demos.

---

## Question: What are reflow and repaint in the browser?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Performance questions often start with layout thrashing vocabulary.

### Answer
Reflow (layout) recalculates geometry when size/position affecting styles change. Repaint redraws pixels (e.g. color) without layout. Reading layout properties after writes forces synchronous layout (thrashing). Batch DOM reads/writes.

### Example
```javascript
// bad: interleaved read/write
els.forEach(el => { el.style.width = el.offsetWidth + 10 + 'px'; });
```

### Follow-up Questions
- What triggers reflow?
- What is `requestAnimationFrame` for?
- CSS containment?

### Common Mistakes
- Measuring offsetHeight in a loop after style changes
- Animating top/left instead of transform
- Inserting many nodes one-by-one without fragment

### Project Connection
Optimize a list filter that felt janky by batching DOM updates.

---

## Question: How do you traverse the DOM (parents, siblings, children)?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Navigation APIs help in scraping-like tasks and event delegation debugging.

### Answer
Use `parentElement`, `children` (elements only), `childNodes` (includes text), `nextElementSibling` / `previousElementSibling`, and `closest` for upward matching. Avoid brittle `parentNode` chains when `closest` works.

### Example
```javascript
const row = btn.closest('tr');
const next = row.nextElementSibling;
```

### Follow-up Questions
- childNodes vs children?
- What is Node.ELEMENT_NODE?
- TreeWalker use cases?

### Common Mistakes
- Using nextSibling and hitting text nodes
- Long parentElement loops instead of closest
- Assuming children includes text nodes

### Project Connection
Walk from a click target to table row in a CRUD app exercise.

---

## Question: What form-related events should you know?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Forms bridge DOM and backend validation interviews.

### Answer
Key events: `submit`, `input`, `change`, `focus`, `blur`, `invalid` (constraint validation). `input` fires on each keystroke; `change` often on commit (select, blur). Use `submit` on form, not click on button only.

### Example
```javascript
input.addEventListener('input', debounce(validate, 300));
form.addEventListener('submit', onSubmit);
```

### Follow-up Questions
- How does HTML5 validation work?
- preventDefault on invalid submit?
- FormData API?

### Common Mistakes
- Listening only to click on submit button
- Confusing change vs input for text fields
- Not resetting validation UI on resubmit

### Project Connection
Show client-side validation with `reportValidity()` in a portfolio form.

---

## Question: How do keyboard events work (`keydown`, `keyup`, `keypress`)?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Accessibility and shortcuts come up for product-minded frontend roles.

### Answer
Prefer `keydown`/`keyup`; `keypress` is deprecated. Check `event.key` or `code` (physical key). Handle Enter/Space on custom controls; respect focus. Use modifiers (`shiftKey`) carefully.

### Example
```javascript
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});
```

### Follow-up Questions
- key vs code?
- How to avoid trapping keys globally?
- Roving tabindex?

### Common Mistakes
- Breaking browser shortcuts without checking
- Relying on keypress
- Forgetting keyboard support on div buttons

### Project Connection
Add Escape-to-close on modals and mention it in a11y interviews.

---

## Question: What is `MutationObserver` used for?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Shows awareness of modern DOM observation beyond events.

### Answer
MutationObserver asynchronously watches DOM tree changes (child list, attributes, character data). Useful for widgets, testing, or syncing third-party DOM inserts — prefer framework patterns when possible.

### Example
```javascript
const obs = new MutationObserver((mutations) => {
  console.log('DOM changed', mutations.length);
});
obs.observe(container, { childList: true, subtree: true });
```

### Follow-up Questions
- Performance cost?
- Difference from deprecated Mutation Events?
- disconnect when?

### Common Mistakes
- Observing entire document subtree casually
- Doing heavy sync work in callback
- Using MO when events or framework state suffice

### Project Connection
Mention MO when discussing embedding external scripts that mutate the DOM.

---

## Question: What is the Shadow DOM at a high level?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Web components and framework encapsulation questions reference shadow roots.

### Answer
Shadow DOM attaches a hidden subtree to an element with scoped styles and DOM (`element.attachShadow({ mode: 'open' })`). Encapsulates internal structure from `document.querySelector`. Used in design systems and native elements.

### Example
```javascript
const host = document.createElement('my-widget');
const shadow = host.attachShadow({ mode: 'open' });
shadow.innerHTML = '<style>p{color:red}</style><p>Hi</p>';
```

### Follow-up Questions
- open vs closed shadow root?
- How do slots work?
- Shadow DOM vs React shadowing?

### Common Mistakes
- Thinking Shadow DOM is the same as virtual DOM
- Piercing shadow for styling without ::part
- Assuming all frameworks use shadow DOM by default

### Project Connection
Relate Shadow DOM to browser built-ins like `<video>` internals.

---

## Question: How does DOM manipulation relate to accessibility?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
A11y is increasingly required even for junior frontend hires.

### Answer
Use semantic elements, label controls, manage focus on dynamic updates, update ARIA live regions for async content, don't rely on div-click alone. DOM changes should preserve logical tab order and announce important changes.

### Example
```javascript
status.textContent = 'Saved';
status.setAttribute('role', 'status');
```

### Follow-up Questions
- When are ARIA roles needed?
- What is focus trap?
- aria-live polite vs assertive?

### Common Mistakes
- Adding buttons as divs without keyboard support
- Removing focus outline in CSS
- Updating DOM without announcing errors to screen readers

### Project Connection
After adding a toast via DOM, tie it to role="status" in your app.

---

## Question: How do you efficiently update many list items in the DOM?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Practical performance question tied to reflow and patterns.

### Answer
Build off-document with `DocumentFragment` or clone template, batch insert once. Or update data and re-render with a virtual DOM library. Avoid removing/re-adding entire list per keystroke.

### Example
```javascript
const frag = document.createDocumentFragment();
items.forEach(t => { const li = document.createElement('li'); li.textContent = t; frag.appendChild(li); });
ul.replaceChildren(frag);
```

### Follow-up Questions
- When is innerHTML batch ok?
- Keyed lists in React?
- Virtual scrolling?

### Common Mistakes
- innerHTML = '' then many appendChild in loop on live parent
- Re-querying list each iteration
- Not using replaceChildren/append with fragment

### Project Connection
Compare naive vs fragment approach when profiling your todo app.

---

## Question: What is the difference between `node` and `element` in the DOM?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Clarifies APIs like childNodes vs children.

### Answer
Nodes include elements, text, comments, document. Elements are nodeType ELEMENT_NODE only. Many properties exist on Node; Element adds tag-specific APIs (`classList`, `attributes`).

### Example
```javascript
console.log(div.childNodes); // may include text nodes
console.log(div.children);   // elements only
```

### Follow-up Questions
- What is a Text node?
- Node.contains?
- Element.matches?

### Common Mistakes
- Trimming HTML but leaving whitespace text nodes
- Using childNodes when you meant children
- Ignoring comment nodes in templates

### Project Connection
Explain a bug where extra spacing came from text nodes between `<li>` elements.

---

## Question: How do `remove`, `replaceWith`, and `cloneNode` work?

### Difficulty
🟢 Easy

### Why Interviewers Ask This
Modern DOM APIs reduce jQuery-style patterns.

### Answer
`element.remove()` detaches from parent. `replaceWith(newNode)` swaps nodes. `cloneNode(deep)` copies; shallow omits children. Cloned nodes must be inserted to appear in document.

### Example
```javascript
oldBanner.replaceWith(newBanner);
const copy = template.content.cloneNode(true);
```

### Follow-up Questions
- Does clone copy event listeners?
- template element?
- importNode?

### Common Mistakes
- Expecting cloneNode to copy listeners
- Shallow clone losing nested structure
- Forgetting to insert cloned template content

### Project Connection
Use `<template>` and cloneNode for repeatable card components in vanilla JS.

---

## Question: What should you know about `addEventListener` options?

### Difficulty
🟡 Medium

### Why Interviewers Ask This
Passive listeners and once/capture appear in senior-leaning junior questions.

### Answer
Third argument can be boolean (capture) or `{ capture, once, passive, signal }`. `passive: true` helps scroll performance; prevents preventDefault on touch/wheel. `once` auto-removes after one invoke. `signal` from AbortController removes cleanly.

### Example
```javascript
el.addEventListener('click', handler, { once: true });
ctrl.signal; // AbortController
el.addEventListener('scroll', onScroll, { passive: true });
```

### Follow-up Questions
- Why passive for touch?
- Memory leaks from anonymous listeners?
- Event listener on shadow root?

### Common Mistakes
- Not matching capture flag on removeEventListener
- preventDefault on passive listener (ignored)
- Duplicating listeners on every render in SPAs

### Project Connection
Use AbortController to tear down listeners when unmounting vanilla widgets.

---

