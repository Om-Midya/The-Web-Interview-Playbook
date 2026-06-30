# Explaining Security in Your Project

You don't need enterprise-grade security — show you understand the basics and avoided common student mistakes.

---

## Security Overview Script (30 seconds)

> "Security was considered from the start. Passwords are hashed with bcrypt. All production traffic is HTTPS. API routes are protected with JWT middleware. Inputs are validated with Zod. Secrets are in environment variables, never in git. I configured CORS to only allow my frontend domain."

---

## The Student Security Checklist

Go through this for YOUR project. Know which you implemented and which you'd add.

### Authentication & Authorization

| Measure | Implemented? | What to say |
|---------|--------------|-------------|
| Password hashing (bcrypt) | ✅ Required | "bcrypt with cost factor 12" |
| HTTPS in production | ✅ Required | "Vercel/Railway enforce HTTPS" |
| Protected API routes | ✅ Required | "JWT middleware on all write endpoints" |
| Server-side authorization | ✅ Required | "Users can only edit their own posts — checked in controller" |
| JWT expiry | ✅ Should have | "Access token expires in 1 hour" |
| Rate limiting on login | ⚠️ Nice | "Not yet — I'd add 5 attempts per 15 minutes" |
| Password reset | ⚠️ Nice | "On improvement list — email token with 1hr expiry" |

### Input & Data

| Measure | Implemented? | What to say |
|---------|--------------|-------------|
| Input validation (Zod/Joi) | ✅ Should have | "All POST/PATCH bodies validated before DB" |
| Parameterized queries (Prisma/ORM) | ✅ Required | "Prisma uses parameterized queries — no SQL injection" |
| XSS prevention | ✅ Should have | "React escapes output by default; sanitized user HTML if any" |
| File upload validation | If applicable | "Check MIME type and size server-side; max 5MB" |
| No sensitive data in logs | ✅ Should have | "Don't log passwords, tokens, or full credit card numbers" |

### Infrastructure

| Measure | Implemented? | What to say |
|---------|--------------|-------------|
| Secrets in env vars | ✅ Required | ".env in .gitignore, secrets in Railway dashboard" |
| CORS configured | ✅ Required | "Only my Vercel domain allowed, not `*`" |
| Dependencies updated | ⚠️ Nice | "Run `npm audit` periodically; fix high severity" |
| Helmet.js | ⚠️ Nice | "Sets security headers: X-Content-Type-Options, etc." |

---

## OWASP Top 10 — Student Relevance

You don't need to memorize all 10. Know these 5:

| Risk | Your defense |
|------|--------------|
| **Injection** | Prisma ORM, parameterized queries, input validation |
| **Broken Authentication** | bcrypt, JWT expiry, protected routes |
| **Sensitive Data Exposure** | HTTPS, no secrets in git, don't return password hash in API |
| **XSS** | React auto-escaping, CSP headers, no `dangerouslySetInnerHTML` with user content |
| **Security Misconfiguration** | CORS not `*`, env vars for secrets, disable debug mode in production |

**Interview line:** "I focused on the OWASP risks most relevant to my stack: injection via ORM, broken auth via proper JWT handling, and XSS via React's default escaping."

---

## Code Examples to Know

### Never Return Password Hash

```javascript
// BAD
res.json({ user }); // includes password_hash

// GOOD
const { password_hash, ...safeUser } = user;
res.json({ data: safeUser });
```

### Authorization Check

```javascript
// BAD — only checks if logged in
router.delete('/posts/:id', authenticate, deletePost);

// GOOD — checks ownership
router.delete('/posts/:id', authenticate, async (req, res) => {
  const post = await db.post.findUnique({ where: { id: req.params.id } });
  if (!post) return res.status(404).json({ error: 'Not found' });
  if (post.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  await db.post.delete({ where: { id: req.params.id } });
  res.status(204).send();
});
```

### Helmet.js (Easy Win)

```javascript
const helmet = require('helmet');
app.use(helmet()); // sets X-Content-Type-Options, X-Frame-Options, etc.
```

---

## Security Stories (Turn Mistakes into Learning)

| Mistake | Story |
|---------|-------|
| Committed `.env` to git | "Accidentally pushed API keys — immediately rotated secrets, added `.env` to `.gitignore`, used `git filter-branch` to remove from history" |
| CORS `*` in development left in prod | "Frontend worked locally but I learned CORS `*` is dangerous with credentials — restricted to my domain" |
| No auth on DELETE route | "Found during testing that anyone could delete posts — added ownership check in controller" |
| JWT in localStorage | "Aware of XSS risk — would move to HTTP-only cookies in next iteration" |

---

## Common Interview Questions

**Q: How do you prevent SQL injection?**
A: "Prisma uses parameterized queries — user input never gets concatenated into SQL strings. I also validate input types with Zod before they reach the database layer."

**Q: How do you handle XSS?**
A: "React escapes variables in JSX by default. I don't use `dangerouslySetInnerHTML` with user content. If I needed rich text, I'd use a sanitizer like DOMPurify."

**Q: What if someone steals a JWT?**
A: "They can act as that user until expiry. Mitigations: short expiry, HTTPS only, HTTP-only cookies. For higher security: server-side sessions with instant revocation."

**Q: How do you store secrets?**
A: "Environment variables in Railway/Vercel dashboard. `.env` locally (gitignored). `.env.example` in repo with placeholder names only. Never hardcode secrets."

**Q: What security would you add next?**
A: "Rate limiting on auth endpoints, Helmet.js for security headers, npm audit in CI, and Content Security Policy headers."

---

## Checklist

- [ ] Can explain password hashing approach
- [ ] Can explain auth middleware and authorization checks
- [ ] Know your CORS configuration
- [ ] Can explain how you prevent SQL injection
- [ ] Have one security learning story (mistake → fix)
- [ ] Know 2–3 security improvements you'd add

---

**Next:** [challenges-and-tradeoffs.md](./challenges-and-tradeoffs.md) | [mock-project-interview.md](./mock-project-interview.md)
