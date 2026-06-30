# Design a Social Media App (Student-Level Walkthrough)

A complete interview-style answer for designing something like Instagram/Twitter at student scale. Practice saying this out loud with a whiteboard.

---

## Step 1: Clarify Requirements (2–3 min)

**Ask the interviewer:**

| Question | Assumed answer for this walkthrough |
|----------|-------------------------------------|
| What are core features? | Sign up, create posts (text + image), follow users, home feed, like posts |
| What's out of scope? | DMs, stories, video, recommendations/ML ranking |
| How many users? | 100K DAU, 10K concurrent at peak |
| Read vs write ratio? | 100:1 (mostly reading feeds) |
| Latency target? | Feed loads in < 500ms |

**Functional requirements:**
1. Users can register and log in
2. Users can create posts with text and one image
3. Users can follow/unfollow other users
4. Home feed shows posts from followed users, newest first
5. Users can like/unlike posts

**Non-functional requirements:**
- Feed should feel fast (cache hot data)
- Images served via CDN
- System should handle 10x user growth without redesign

---

## Step 2: Rough Estimates (2 min)

| Metric | Estimate |
|--------|----------|
| 100K DAU | ~1.2 average requests/sec; peak ~5 RPS (student scale) |
| Posts per day | 10K DAU post once/day = 10K posts/day |
| Storage (1 year) | 10K posts × 500KB image × 365 ≈ 1.8 TB images |
| Feed reads | 100K users × 20 feed views/day = 2M feed reads/day |

*At student scale, a single Postgres + one API server works. Mention what breaks at 10x.*

---

## Step 3: High-Level Architecture

```
┌──────────┐     HTTPS      ┌─────────────┐
│  React   │ ──────────────►│  API Server │
│  Web App │ ◄──────────────│  (Node.js)  │
└──────────┘                └──────┬──────┘
                                   │
                    ┌──────────────┼──────────────┐
                    ▼              ▼              ▼
              ┌──────────┐  ┌──────────┐  ┌──────────┐
              │  Redis   │  │ Postgres │  │ S3 + CDN │
              │  (cache) │  │   (DB)   │  │ (images) │
              └──────────┘  └──────────┘  └──────────┘
```

**Data flow — create post:**
1. User uploads image → pre-signed S3 URL → direct upload to S3
2. User submits post text + image URL → `POST /api/v1/posts`
3. API validates, inserts into `posts` table
4. Invalidate user's followers' feed caches (or let TTL expire)

**Data flow — read feed:**
1. `GET /api/v1/feed?cursor=...&limit=20`
2. Check Redis: `feed:userId:page1` → cache hit? return
3. Cache miss → query DB → store in Redis (60s TTL) → return

---

## Step 4: Database Schema

```sql
users (
  id            UUID PK,
  username      VARCHAR(50) UNIQUE,
  email         VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  avatar_url    VARCHAR(500),
  created_at    TIMESTAMPTZ
)

posts (
  id            UUID PK,
  user_id       UUID FK → users,
  caption       TEXT,
  image_url     VARCHAR(500),
  created_at    TIMESTAMPTZ
)
-- INDEX: (user_id, created_at DESC) for profile page

follows (
  follower_id   UUID FK → users,
  following_id  UUID FK → users,
  created_at    TIMESTAMPTZ,
  PRIMARY KEY (follower_id, following_id)
)
-- INDEX: (follower_id) for "who I follow" list

likes (
  user_id       UUID FK → users,
  post_id       UUID FK → posts,
  created_at    TIMESTAMPTZ,
  PRIMARY KEY (user_id, post_id)
)

-- Denormalized counter (optional, for performance)
posts.like_count INT DEFAULT 0
```

---

## Step 5: API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Create account |
| POST | `/api/v1/auth/login` | Login, set session cookie |
| POST | `/api/v1/posts` | Create post |
| GET | `/api/v1/posts/:id` | Single post |
| GET | `/api/v1/users/:id/posts` | User's profile posts |
| POST | `/api/v1/users/:id/follow` | Follow user |
| DELETE | `/api/v1/users/:id/follow` | Unfollow |
| GET | `/api/v1/feed?cursor=&limit=20` | Home feed |
| POST | `/api/v1/posts/:id/like` | Like post |
| DELETE | `/api/v1/posts/:id/like` | Unlike |

---

## Step 6: Deep Dive — Home Feed

This is where interviewers spend the most time.

### Approach 1: Pull Model (Start Here)

On feed request, query posts from users you follow:

```sql
SELECT p.*, u.username, u.avatar_url
FROM posts p
JOIN users u ON p.user_id = u.id
WHERE p.user_id IN (
  SELECT following_id FROM follows WHERE follower_id = $currentUserId
)
ORDER BY p.created_at DESC
LIMIT 20;
```

**Pros:** Simple, always fresh, easy to build
**Cons:** Slow if you follow 5,000 people; DB does heavy work per request

**Optimizations:**
- Index on `follows(follower_id)` and `posts(created_at DESC)`
- Cache feed in Redis (60-second TTL)
- Cursor pagination, not offset

### Approach 2: Fan-Out on Write (Scale Path)

When user posts → push post ID into each follower's feed cache (Redis list).

**Pros:** Feed read is O(1) — just read pre-built list
**Cons:** Slow post if user has 1M followers ("celebrity problem")

**Hybrid (what real systems do):**
- Fan-out for normal users (< 10K followers)
- Pull model for celebrities

### Frontend Feed

- Infinite scroll with cursor pagination
- React Query `useInfiniteQuery`
- Virtualized list for performance
- Optimistic UI for likes (update count immediately, rollback on error)

---

## Step 7: Image Handling

1. Client requests pre-signed S3 upload URL from API
2. Client uploads directly to S3 (doesn't burden API server)
3. API stores `image_url` in post record
4. CloudFront CDN serves images globally
5. Store thumbnails (200px) for feed; full size on detail page

**Why not store images in Postgres?** Blobs bloat the DB, slow backups, expensive.

---

## Step 8: Tradeoffs Summary

| Decision | Choice | Why | At 10x scale |
|----------|--------|-----|--------------|
| Feed model | Pull + Redis cache | Simple for 100K users | Fan-out on write for hot users |
| Database | PostgreSQL | Relationships, ACID | Read replicas for feed queries |
| Images | S3 + CDN | Cheap, scalable storage | Same, add image processing pipeline |
| Auth | Session + Redis | Easy revocation | Same |
| Like counts | Denormalized column | Fast reads | Async counter in Redis, periodic sync |

---

## Step 9: Security & Reliability

- HTTPS everywhere
- bcrypt password hashing
- Auth middleware on all write endpoints
- Users can only delete their own posts (authorization check)
- Rate limit: 10 posts/hour, 100 feed requests/minute
- Validate image type and size server-side
- Pre-signed S3 URLs expire in 15 minutes

---

## What to Draw on a Whiteboard

```
[Browser] → [API] → [Postgres]
              ↓
           [Redis]
              ↓
           [S3/CDN]

Tables: users, posts, follows, likes
Feed query: pull model + cache
```

---

## Common Follow-Up Questions

**Q: How do you handle a celebrity with 10M followers?**
A: Don't fan-out on write. Pull model for their posts only. Cache aggressively.

**Q: How do you add real-time notifications for likes?**
A: WebSocket or SSE connection. On like → insert notification → push to post author's socket.

**Q: How do you rank feed beyond chronological?**
A: Score = recency + engagement (likes/comments) + relationship strength. Precompute scores in a background job. (Mention as future improvement.)

---

**Practice tip:** Time yourself — 25 minutes for the full walkthrough, leaving 20 minutes for follow-ups.
