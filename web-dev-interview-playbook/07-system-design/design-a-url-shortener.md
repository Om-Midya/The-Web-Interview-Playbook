# Design a URL Shortener (Student-Level Walkthrough)

The classic system design warm-up. Compact but covers hashing, redirects, storage, caching, and analytics.

---

## Step 1: Clarify Requirements (2–3 min)

| Question | Assumed answer |
|----------|----------------|
| Core function? | Convert long URL → short URL; short URL redirects to original |
| Custom aliases? | Optional — user can pick `short.ly/my-link` if available |
| Expiration? | Optional TTL per link (default: never) |
| Analytics? | Track click count and timestamp per click |
| Scale? | 10M URLs stored, 100M redirects/month |
| Who creates links? | Anyone (public) or logged-in users only? → Logged-in users |

**Functional requirements:**
1. Submit long URL → receive short URL
2. Visit short URL → 301/302 redirect to original
3. Optional custom alias
4. View click analytics for own links

**Non-functional requirements:**
- Redirect latency < 100ms (p95)
- Short codes should be unique
- System available 99.9%

---

## Step 2: Rough Estimates (2 min)

| Metric | Calculation |
|--------|-------------|
| Writes | 10M URLs total; ~4 new URLs/sec average |
| Reads | 100M/month ≈ 40 redirects/sec average; peak ~200/sec |
| Read:write ratio | ~50:1 (very read-heavy → cache aggressively) |
| Storage (10M URLs) | 10M × ~500 bytes/row ≈ 5 GB |
| 7-char base62 codes | 62^7 ≈ 3.5 trillion combinations (plenty of space) |

---

## Step 3: High-Level Architecture

```
┌──────────┐  POST /api/urls     ┌─────────────┐
│  Client  │ ──────────────────►│  API Server │
│          │  GET /:code         │  (Node.js)  │
│          │ ◄── 302 Redirect ──│             │
└──────────┘                     └──────┬──────┘
                                        │
                               ┌────────┼────────┐
                               ▼        ▼        ▼
                          [Redis]  [Postgres] [Analytics]
                          (cache)   (urls)     (clicks)
```

**Read path (hot — 99% of traffic):**
1. `GET /abc123` hits API (or dedicated redirect service)
2. Check Redis: `url:abc123` → long URL
3. Cache hit → 302 redirect immediately
4. Cache miss → query Postgres → populate cache → redirect
5. Async: log click to analytics (don't block redirect)

---

## Step 4: Database Schema

```sql
urls (
  id            BIGSERIAL PK,
  short_code    VARCHAR(10) UNIQUE NOT NULL,  -- e.g. "abc123"
  long_url      TEXT NOT NULL,
  user_id       UUID FK → users,              -- who created it
  custom_alias  BOOLEAN DEFAULT FALSE,
  expires_at    TIMESTAMPTZ,                  -- NULL = never
  created_at    TIMESTAMPTZ DEFAULT NOW()
)
-- INDEX: short_code (unique, primary lookup)

clicks (
  id            BIGSERIAL PK,
  url_id        BIGINT FK → urls,
  clicked_at    TIMESTAMPTZ DEFAULT NOW(),
  referrer      VARCHAR(500),
  user_agent    VARCHAR(500),
  ip_hash       VARCHAR(64)                  -- hashed, not raw IP (privacy)
)
-- INDEX: (url_id, clicked_at DESC) for analytics queries
```

---

## Step 5: API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/urls` | Create short URL |
| GET | `/:shortCode` | Redirect to long URL |
| GET | `/api/v1/urls/:code/stats` | Click analytics (owner only) |
| DELETE | `/api/v1/urls/:code` | Delete link (owner only) |

### Create Short URL

```json
// Request
POST /api/v1/urls
{
  "longUrl": "https://example.com/very/long/path?with=params",
  "customAlias": "my-demo",       // optional
  "expiresInDays": 30             // optional
}

// Response 201
{
  "shortUrl": "https://short.ly/my-demo",
  "shortCode": "my-demo",
  "longUrl": "https://example.com/very/long/path?with=params",
  "expiresAt": "2025-07-30T00:00:00Z"
}
```

---

## Step 6: Deep Dive — Generating Short Codes

### Approach 1: Auto-Increment ID + Base62 (Recommended)

```javascript
const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function toBase62(num) {
  if (num === 0) return '0';
  let result = '';
  while (num > 0) {
    result = BASE62[num % 62] + result;
    num = Math.floor(num / 62);
  }
  return result;
}

// id = 125 → "1Z"
// id = 1000000 → "4c92"
```

**Flow:**
1. Insert long URL into DB → get auto-increment `id`
2. Convert `id` to base62 → `short_code`
3. Update row with `short_code`

**Pros:** No collisions, deterministic, short codes grow slowly
**Cons:** Predictable (users can guess next code — acceptable for non-sensitive URLs)

### Approach 2: Random String

```javascript
function randomCode(length = 7) {
  return crypto.randomBytes(length).toString('base64url').slice(0, length);
}
```

**Pros:** Unpredictable
**Cons:** Must check for collisions and retry

### Approach 3: Hash (MD5/SHA of URL)

**Don't use alone** — same URL → same hash (good for dedup) but long hashes need truncation (collision risk).

**Hybrid:** Hash for dedup check + auto-increment for unique code.

### Custom Alias

```javascript
async function createUrl({ longUrl, customAlias }) {
  if (customAlias) {
    const exists = await db.findByCode(customAlias);
    if (exists) throw new ConflictError('Alias already taken');
    // validate: alphanumeric + hyphens only, 3-20 chars
    return db.insert({ short_code: customAlias, long_url: longUrl, custom_alias: true });
  }
  // auto-generate via base62
}
```

---

## Step 7: Deep Dive — Redirect Path

```javascript
// Express route
app.get('/:code', async (req, res) => {
  const { code } = req.params;

  // 1. Cache lookup
  let longUrl = await redis.get(`url:${code}`);
  if (!longUrl) {
    const row = await db.query('SELECT long_url, expires_at FROM urls WHERE short_code = $1', [code]);
    if (!row) return res.status(404).send('Not found');
    if (row.expires_at && row.expires_at < new Date()) return res.status(410).send('Expired');
    longUrl = row.long_url;
    await redis.setex(`url:${code}`, 3600, longUrl); // cache 1 hour
  }

  // 2. Async analytics (don't await — don't slow redirect)
  logClick(code, req).catch(console.error);

  // 3. Redirect
  res.redirect(302, longUrl);  // 302 = temporary (allows changing destination)
  // Use 301 if URL never changes (better for SEO, browser caches aggressively)
});
```

### 301 vs 302

| | 301 Permanent | 302 Temporary |
|---|---------------|---------------|
| Browser behavior | Caches redirect | Doesn't cache |
| Use when | URL mapping never changes | Might update destination |
| Analytics | Browser may not hit server again | Every click hits server |

**For URL shortener:** 302 is safer (allows editing destination). Mention 301 tradeoff.

---

## Step 8: Caching Strategy

| Data | Where | TTL | Why |
|------|-------|-----|-----|
| `short_code → long_url` | Redis | 1 hour | 50:1 read:write ratio |
| Popular codes | Redis (always hot) | Refresh on access | 80/20 rule — few codes get most clicks |

**Cache invalidation:**
- On URL delete → `redis.del(`url:${code}`)`
- On URL update (if allowed) → delete cache key

**At scale:** Dedicated redirect service (separate from API) that only does cache lookup + redirect. API server handles creates/analytics.

---

## Step 9: Analytics (Async)

Don't block the redirect for analytics.

```
Redirect path → fire-and-forget → queue (Redis list / SQS)
                                        │
                                   Worker batches inserts
                                   into clicks table every 5 seconds
```

**Stats endpoint:**
```sql
SELECT DATE(clicked_at) as day, COUNT(*) as clicks
FROM clicks
WHERE url_id = $1
GROUP BY day
ORDER BY day DESC
LIMIT 30;
```

---

## Step 10: Security

| Threat | Mitigation |
|--------|------------|
| **Open redirect abuse** | Validate `longUrl` is http/https; block internal IPs (SSRF) |
| **Spam URL creation** | Rate limit: 10 URLs/hour per user, CAPTCHA for anonymous |
| **Malicious URLs** | Optional: check against malware blocklist API |
| **Enumeration** | Random codes instead of sequential (if privacy matters) |
| **Phishing** | Display interstitial warning page for flagged domains (advanced) |

```javascript
function validateLongUrl(url) {
  const parsed = new URL(url);
  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Invalid protocol');
  if (isPrivateIP(parsed.hostname)) throw new Error('Internal URLs not allowed');
}
```

---

## Step 11: Tradeoffs Summary

| Decision | Choice | Why |
|----------|--------|-----|
| Code generation | Auto-increment + base62 | No collisions, simple |
| Redirect | 302 + Redis cache | Fast, allows destination updates |
| Analytics | Async queue | Doesn't slow redirect path |
| Database | PostgreSQL | ACID, relational analytics queries |
| Scale path | Separate redirect service + CDN edge | Redirect is 99% of traffic |

---

## Scale Path (Mention If Asked)

| Users | Architecture change |
|-------|---------------------|
| 10M URLs | Single Postgres + Redis — fine |
| 1B URLs | Shard `urls` table by `short_code` prefix |
| 1M RPS redirects | Redis cluster; redirect service at edge (Cloudflare Workers) |
| Global | Geo-distributed Redis replicas |

---

## Whiteboard Diagram

```
POST /urls → [API] → [Postgres] → return short.ly/abc123

GET /abc123 → [Redirect Service] → [Redis hit?] → 302 → long URL
                                    [miss] → [Postgres] → cache → 302
                                    [async] → [Click Queue] → [Analytics DB]
```

---

## Common Follow-Up Questions

**Q: How many URLs fit in 7 base62 characters?**
A: 62^7 ≈ 3.5 trillion. At 10M URLs, you're using 0.0003% of the space.

**Q: What if two users submit the same long URL?**
A: Option A: create duplicate short codes (simple). Option B: dedup — return existing short code (saves storage).

**Q: How do you handle a viral link with 1M clicks/hour?**
A: Redis cache absorbs reads. Async analytics queue. CDN edge redirect for known hot codes.

---

**Why interviewers love this question:** It touches encoding, caching, redirects, read-heavy optimization, and security — all in a problem you can fully explain in 20 minutes.
