# Explaining Database Design in Your Project

Interviewers want to see you understand your data model — not just that you used an ORM.

---

## What to Cover

1. Main entities and relationships
2. Why you chose SQL or NoSQL
3. Key indexes and why
4. One query you optimized or would optimize
5. How you handle migrations/schema changes

---

## How to Present Your Schema

### Step 1: Name Your Entities (30 seconds)

> "My app has four main entities: **Users**, **Posts**, **Comments**, and **Likes**. Users create posts. Users comment on posts. Users like posts."

### Step 2: Draw ER Diagram (60 seconds)

```
users ──────────< posts
  │                 │
  │                 │
  └───────< comments >┘
  │
  └───────< likes >──── posts
```

Use crow's foot notation or simple arrows. Label relationships: one-to-many, many-to-many.

### Step 3: Show Key Tables (60 seconds)

```sql
users (id, email, name, password_hash, role, created_at)
posts (id, user_id FK, title, body, image_url, created_at)
comments (id, post_id FK, user_id FK, body, created_at)
likes (user_id FK, post_id FK) -- composite PK
```

---

## SQL vs NoSQL — Your Justification

| If you used PostgreSQL/MySQL | If you used MongoDB |
|------------------------------|---------------------|
| "Data has clear relationships — users own posts, posts have comments. JOINs are natural." | "Document structure matched my nested data — a blog post with embedded comments." |
| "Needed transactions for [payments/order placement]." | "Rapid prototyping — schema evolved a lot during development." |
| "Team and I are more comfortable with SQL." | "Mongoose gave me validation and easy Node.js integration." |

**Honest upgrade path:** "If I needed complex reporting or strict relationships, I'd choose Postgres. MongoDB was fine for MVP."

---

## Relationships Explained Simply

| Type | Example | Implementation |
|------|---------|----------------|
| **One-to-many** | User → Posts | `posts.user_id` foreign key |
| **Many-to-many** | Users ↔ Groups | Join table `group_members(user_id, group_id)` |
| **One-to-one** | User → Profile | `profiles.user_id` unique FK |

**Many-to-many example (students in courses):**
```sql
students (id, name)
courses (id, title)
enrollments (student_id, course_id, enrolled_at)
-- composite PK on (student_id, course_id)
```

---

## Indexing (Interview Gold)

### What to Say

> "I added an index on `posts(user_id, created_at DESC)` because the profile page queries all posts by a user sorted by newest first. Without it, Postgres does a full table scan."

### Common Indexes in Student Projects

| Query pattern | Index |
|---------------|-------|
| Get posts by user, newest first | `INDEX (user_id, created_at DESC)` |
| Login by email | `UNIQUE INDEX (email)` |
| Feed: posts from followed users | `INDEX (user_id, created_at DESC)` on posts |
| Search by title | `GIN INDEX` on `to_tsvector(title)` (Postgres full-text) |

### How to Find Slow Queries

> "I'd run `EXPLAIN ANALYZE` on my feed query. If it shows Seq Scan on a large table, I add an index on the filtered/sorted columns."

---

## Normalization vs Denormalization

**Normalized (default):**
```sql
-- Like count requires COUNT query
SELECT p.*, COUNT(l.user_id) as like_count
FROM posts p LEFT JOIN likes l ON p.id = l.post_id
GROUP BY p.id;
```

**Denormalized (faster reads):**
```sql
-- like_count stored on posts table, updated on like/unlike
posts (id, title, body, like_count DEFAULT 0)
```

**What to say:** "I denormalized `like_count` on the posts table because it's displayed on every feed item. I increment/decrement it in the same transaction as the like insert/delete. Slight risk of drift if a transaction fails — I'd add a periodic reconciliation job at scale."

---

## Migrations

**If using Prisma:**
> "Schema changes go through Prisma migrations. I run `prisma migrate dev` locally, commit the migration SQL, and `prisma migrate deploy` runs automatically on Railway deploy."

**If using raw SQL:**
> "I keep migration files in `/migrations` numbered sequentially. Each file is a forward-only SQL script. I never edit production data manually."

**Interview question:** "How do you add a column without downtime?"
> "Add nullable column first → deploy code that writes to it → backfill existing rows → add NOT NULL constraint if needed. Never drop and recreate in production."

---

## Sample Schema Walkthrough (Blog App)

```sql
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) UNIQUE NOT NULL,
  username      VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(20) DEFAULT 'user',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE posts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title      VARCHAR(200) NOT NULL,
  body       TEXT,
  published  BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_posts_user_created ON posts(user_id, created_at DESC);

CREATE TABLE comments (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body       TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_comments_post ON comments(post_id, created_at ASC);
```

**Talking points:**
- `ON DELETE CASCADE` — deleting a user removes their posts and comments
- `UUID` vs `SERIAL` — "UUIDs are harder to guess, safe to expose in URLs"
- `updated_at` — "track when post was last edited"
- Indexes match actual query patterns

---

## Common Interview Questions

**Q: How would your schema change for 1 million users?**
A: "Add indexes on all foreign keys and sort columns. Consider read replicas for feed queries. Partition large tables by date if we have years of data. Archive old posts."

**Q: N+1 query problem — what is it?**
A: "Fetching a list of posts, then looping to fetch each author's name — 1 + N queries. Fix with JOIN or Prisma `include: { author: true }` to batch in one query."

**Q: How do you handle soft deletes?**
A: "Add `deleted_at TIMESTAMPTZ` column. Queries filter `WHERE deleted_at IS NULL`. Preserves data for audit; can hard-delete later."

**Q: Why UUID over auto-increment?**
A: "Non-guessable in URLs, safe to generate client-side, no collision across distributed systems. Tradeoff: larger storage, slightly slower indexes than integers."

---

## Checklist

- [ ] Can draw ER diagram in 60 seconds
- [ ] Can explain each relationship type in your schema
- [ ] Know at least one index you added (or would add) and why
- [ ] Can explain one normalization/denormalization choice
- [ ] Know how you run migrations

---

**Next:** [api-design.md](./api-design.md) | [challenges-and-tradeoffs.md](./challenges-and-tradeoffs.md)
