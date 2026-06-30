# JavaScript Core: Coding Questions

15 problems ranked by interview frequency. Solve on paper or in an editor — no AI. Time yourself.

---

## 1. Reverse a String

**Problem:** Write a function that reverses a string.

```javascript
function reverseString(str) {
  return str.split('').reverse().join('');
}

// Without built-in reverse
function reverseString(str) {
  let reversed = '';
  for (let i = str.length - 1; i >= 0; i--) {
    reversed += str[i];
  }
  return reversed;
}
```

**Follow-up:** Reverse words in a sentence: `"hello world"` → `"world hello"`

```javascript
function reverseWords(sentence) {
  return sentence.trim().split(/\s+/).reverse().join(' ');
}
```

---

## 2. Find Duplicates in Array

**Problem:** Return elements that appear more than once.

```javascript
function findDuplicates(arr) {
  const seen = new Set();
  const duplicates = new Set();

  for (const item of arr) {
    if (seen.has(item)) duplicates.add(item);
    else seen.add(item);
  }
  return [...duplicates];
}
```

---

## 3. Two Sum

**Problem:** Given array and target, return indices of two numbers that add to target.

```javascript
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement), i];
    map.set(nums[i], i);
  }
  return null;
}
```

---

## 4. Flatten Nested Array

**Problem:** Flatten `[[1, 2], [3, [4, 5]]]` → `[1, 2, 3, 4, 5]`

```javascript
function flatten(arr) {
  return arr.reduce((acc, val) =>
    acc.concat(Array.isArray(val) ? flatten(val) : val), []);
}
```

---

## 5. Deep Clone Object

**Problem:** Clone nested object without reference sharing.

```javascript
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (Array.isArray(obj)) return obj.map(deepClone);

  const cloned = {};
  for (const key of Object.keys(obj)) {
    cloned[key] = deepClone(obj[key]);
  }
  return cloned;
}

// Modern: structuredClone(obj) — mention in interview
```

---

## 6. Curry Function

**Problem:** `sum(1)(2)(3)()` → `6`

```javascript
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return (...nextArgs) => curried(...args, ...nextArgs);
  };
}

const sum = curry((a, b, c) => a + b + c);
sum(1)(2)(3); // 6
```

---

## 7. Memoize

**Problem:** Cache function results by arguments.

```javascript
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
```

---

## 8. Group By Property

**Problem:** Group array of objects by a key.

```javascript
function groupBy(arr, key) {
  return arr.reduce((groups, item) => {
    const groupKey = item[key];
    (groups[groupKey] ??= []).push(item);
    return groups;
  }, {});
}

// groupBy(users, 'role') → { admin: [...], user: [...] }
```

---

## 9. Anagram Check

**Problem:** Are two strings anagrams?

```javascript
function isAnagram(s1, s2) {
  if (s1.length !== s2.length) return false;
  const count = {};
  for (const char of s1) count[char] = (count[char] || 0) + 1;
  for (const char of s2) {
    if (!count[char]) return false;
    count[char]--;
  }
  return true;
}
```

---

## 10. Debounce Implementation

**Problem:** Implement debounce from scratch.

```javascript
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
```

---

## 11. Promise Retry

**Problem:** Retry a promise-returning function up to `n` times.

```javascript
async function retry(fn, retries = 3, delay = 1000) {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 0) throw err;
    await new Promise(r => setTimeout(r, delay));
    return retry(fn, retries - 1, delay);
  }
}
```

---

## 12. Event Emitter

**Problem:** Basic pub/sub.

```javascript
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    (this.events[event] ??= []).push(listener);
    return this;
  }

  off(event, listener) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(l => l !== listener);
  }

  emit(event, ...args) {
    (this.events[event] || []).forEach(listener => listener(...args));
  }

  once(event, listener) {
    const wrapper = (...args) => {
      listener(...args);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }
}
```

---

## 13. Palindrome Check

**Problem:** Is string a palindrome? Ignore case and non-alphanumeric.

```javascript
function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}

// Two-pointer (no extra string)
function isPalindrome(str) {
  const s = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0, right = s.length - 1;
  while (left < right) {
    if (s[left++] !== s[right--]) return false;
  }
  return true;
}
```

---

## 14. Merge Sorted Arrays

**Problem:** Merge two sorted arrays into one sorted array.

```javascript
function mergeSorted(a, b) {
  const result = [];
  let i = 0, j = 0;
  while (i < a.length && j < b.length) {
    result.push(a[i] <= b[j] ? a[i++] : b[j++]);
  }
  return result.concat(a.slice(i), b.slice(j));
}
```

---

## 15. LRU Cache (Simplified)

**Problem:** Cache with max size; evict least recently used.

```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map(); // Map maintains insertion order
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value); // move to end (most recent)
    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) this.cache.delete(key);
    this.cache.set(key, value);
    if (this.cache.size > this.capacity) {
      const oldest = this.cache.keys().next().value;
      this.cache.delete(oldest);
    }
  }
}
```

---

## Practice Schedule

| Day | Problems |
|-----|----------|
| 1–2 | 1, 2, 3, 4 |
| 3–4 | 5, 6, 7, 8 |
| 5–6 | 9, 10, 11, 12 |
| 7 | 13, 14, 15 + redo weakest 3 |

**Interview tip:** Talk while coding. State brute force first, then optimize.
