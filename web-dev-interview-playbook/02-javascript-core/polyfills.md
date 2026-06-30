# JavaScript Core: Polyfills

Practice writing these **without looking**, then compare. Interviewers often ask for `bind`, `debounce`, or `Promise.all`.

---

## Array.prototype.map

```javascript
Array.prototype.myMap = function(callback, thisArg) {
  if (this == null) throw new TypeError('Array.prototype.myMap called on null or undefined');
  if (typeof callback !== 'function') throw new TypeError(callback + ' is not a function');

  const result = [];
  const arr = Object(this);
  const len = arr.length >>> 0;

  for (let i = 0; i < len; i++) {
    if (i in arr) {
      result[i] = callback.call(thisArg, arr[i], i, arr);
    }
  }
  return result;
};

// Test
[1, 2, 3].myMap(x => x * 2); // [2, 4, 6]
```

---

## Array.prototype.filter

```javascript
Array.prototype.myFilter = function(callback, thisArg) {
  if (this == null) throw new TypeError('Array.prototype.myFilter called on null or undefined');
  if (typeof callback !== 'function') throw new TypeError(callback + ' is not a function');

  const result = [];
  const arr = Object(this);
  const len = arr.length >>> 0;

  for (let i = 0; i < len; i++) {
    if (i in arr && callback.call(thisArg, arr[i], i, arr)) {
      result.push(arr[i]);
    }
  }
  return result;
};
```

---

## Array.prototype.reduce

```javascript
Array.prototype.myReduce = function(callback, initialValue) {
  if (this == null) throw new TypeError('Array.prototype.myReduce called on null or undefined');
  if (typeof callback !== 'function') throw new TypeError(callback + ' is not a function');

  const arr = Object(this);
  const len = arr.length >>> 0;
  let accumulator;
  let startIndex = 0;

  if (arguments.length >= 2) {
    accumulator = initialValue;
  } else {
    let found = false;
    for (; startIndex < len; startIndex++) {
      if (startIndex in arr) {
        accumulator = arr[startIndex];
        startIndex++;
        found = true;
        break;
      }
    }
    if (!found) throw new TypeError('Reduce of empty array with no initial value');
  }

  for (let i = startIndex; i < len; i++) {
    if (i in arr) {
      accumulator = callback(accumulator, arr[i], i, arr);
    }
  }
  return accumulator;
};
```

---

## Function.prototype.bind

```javascript
Function.prototype.myBind = function(context, ...boundArgs) {
  if (typeof this !== 'function') throw new TypeError('myBind must be called on a function');

  const fn = this;

  return function boundFunction(...callArgs) {
    // Support `new boundFunction()`
    const isNew = this instanceof boundFunction;
    return fn.apply(
      isNew ? this : context,
      boundArgs.concat(callArgs)
    );
  };
};

// Test
const person = { name: 'Alice' };
function greet(greeting, punct) {
  return `${greeting}, ${this.name}${punct}`;
}
const bound = greet.myBind(person, 'Hello');
bound('!'); // "Hello, Alice!"
```

---

## Function.prototype.call

```javascript
Function.prototype.myCall = function(context, ...args) {
  if (typeof this !== 'function') throw new TypeError('myCall must be called on a function');

  context = context ?? globalThis;
  const sym = Symbol('fn');
  context[sym] = this;
  const result = context[sym](...args);
  delete context[sym];
  return result;
};
```

---

## Function.prototype.apply

```javascript
Function.prototype.myApply = function(context, argsArray) {
  if (typeof this !== 'function') throw new TypeError('myApply must be called on a function');

  context = context ?? globalThis;
  const sym = Symbol('fn');
  context[sym] = this;
  const result = argsArray != null ? context[sym](...argsArray) : context[sym]();
  delete context[sym];
  return result;
};
```

---

## debounce

Waits until user stops firing events, then runs once. Use for: search input, resize handlers.

```javascript
function debounce(fn, delay) {
  let timerId;

  return function debounced(...args) {
    const context = this;
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
}

// Usage
const search = debounce((query) => {
  console.log('Searching:', query);
}, 300);

// input.addEventListener('input', (e) => search(e.target.value));
```

**Leading edge variant** (run immediately, then wait):

```javascript
function debounceLeading(fn, delay) {
  let timerId;
  return function(...args) {
    if (!timerId) fn.apply(this, args);
    clearTimeout(timerId);
    timerId = setTimeout(() => { timerId = null; }, delay);
  };
}
```

---

## throttle

Runs at most once per interval. Use for: scroll, mousemove.

```javascript
function throttle(fn, limit) {
  let inThrottle = false;

  return function throttled(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => { inThrottle = false; }, limit);
    }
  };
}
```

**Trailing call variant** (ensures last event fires):

```javascript
function throttleTrailing(fn, limit) {
  let lastArgs = null;
  let timerId = null;

  return function(...args) {
    lastArgs = args;
    if (!timerId) {
      fn.apply(this, lastArgs);
      timerId = setTimeout(() => {
        timerId = null;
        if (lastArgs) fn.apply(this, lastArgs);
      }, limit);
    }
  };
}
```

---

## flatten (array)

```javascript
function flatten(arr, depth = 1) {
  if (depth <= 0) return arr.slice();

  return arr.reduce((acc, item) => {
    if (Array.isArray(item)) {
      acc.push(...flatten(item, depth - 1));
    } else {
      acc.push(item);
    }
    return acc;
  }, []);
}

// flatten([1, [2, [3, [4]]]], Infinity) → [1, 2, 3, 4]

// Recursive one-liner (depth Infinity)
function flattenDeep(arr) {
  return arr.reduce(
    (acc, val) => acc.concat(Array.isArray(val) ? flattenDeep(val) : val),
    []
  );
}
```

---

## Promise.all

```javascript
function promiseAll(iterable) {
  return new Promise((resolve, reject) => {
    const results = [];
    let remaining = 0;
    let index = 0;

    if (iterable == null || typeof iterable[Symbol.iterator] !== 'function') {
      return reject(new TypeError('Argument is not iterable'));
    }

    for (const item of iterable) {
      const currentIndex = index++;
      remaining++;
      Promise.resolve(item).then(
        (value) => {
          results[currentIndex] = value;
          remaining--;
          if (remaining === 0) resolve(results);
        },
        reject
      );
    }

    if (index === 0) resolve([]);
  });
}
```

**Key points to mention in interview:**
- Returns array of results in **input order**, not completion order
- Fails fast on first rejection
- Non-promise values are wrapped with `Promise.resolve`

---

## Study Checklist

| Polyfill | Can you write it in 10 min? | Can you explain edge cases? |
|----------|------------------------------|----------------------------|
| map | ☐ | ☐ |
| filter | ☐ | ☐ |
| reduce | ☐ | ☐ |
| bind | ☐ | ☐ |
| debounce | ☐ | ☐ |
| throttle | ☐ | ☐ |
| flatten | ☐ | ☐ |
| Promise.all | ☐ | ☐ |
