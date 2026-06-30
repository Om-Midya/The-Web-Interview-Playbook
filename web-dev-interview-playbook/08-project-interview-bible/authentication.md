# Explaining Authentication in Your Project

Auth questions appear in almost every fullstack project interview. Know your flow cold.

---

## What to Cover

1. How users register and log in
2. How subsequent requests are authenticated
3. How you protect routes (frontend and backend)
4. Password security
5. What you'd improve

---

## Common Student Auth Patterns

### Pattern A: JWT (Most Common in Student Projects)

```
Register:
  POST /api/auth/register { email, password, name }
  → hash password with bcrypt
  → insert user in DB
  → return 201 (don't auto-login, or return JWT)

Login:
  POST /api/auth/login { email, password }
  → find user by email
  → bcrypt.compare(password, user.passwordHash)
  → sign JWT: { userId, role, exp: 15min }
  → return { accessToken, refreshToken }

Protected request:
  GET /api/profile
  Header: Authorization: Bearer <accessToken>
  → authMiddleware: jwt.verify(token, SECRET)
  → attach req.user = { id, role }
  → next()
```

**Where tokens live:**
- **Best:** Access token in memory (React state), refresh token in HTTP-only cookie
- **Common (mention the risk):** Both in localStorage — vulnerable to XSS
- **Better:** Access token in memory, refresh in HTTP-only cookie

### Pattern B: Session Cookies

```
Login:
  POST /api/auth/login { email, password }
  → validate credentials
  → create session in Redis: { sessionId: { userId, role } }
  → res.cookie('sessionId', id, { httpOnly: true, secure: true, sameSite: 'strict' })

Protected request:
  → read sessionId from cookie
  → lookup Redis → get userId
  → attach req.user
```

---

## How to Explain Your Auth Flow (Script)

> "Authentication uses **[JWT / session cookies]**. When a user logs in, the server validates credentials with **bcrypt** — passwords are never stored in plaintext. On success, the server issues a **[JWT / session cookie]**.
>
> On every protected request, **[auth middleware / axios interceptor]** attaches the token. The server middleware verifies it and loads the user into `req.user`. Role-based checks on admin routes use a separate **authorize middleware**.
>
> On the frontend, **[React Context / protected routes]** redirect unauthenticated users to login. Tokens expire after **[15 minutes / session ends]** and users must re-login — or use a refresh token flow."

---

## Backend Middleware Chain (Know This Code)

```javascript
// middleware/auth.js
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId, role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

// routes/posts.js
router.delete('/:id', authenticate, authorize('admin'), deletePost);
```

**Interview tip:** Be ready to write or explain this middleware from memory.

---

## Frontend Auth (React)

```javascript
// Protected route pattern
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" />;
  return children;
}

// Axios interceptor — attach token to every request
api.interceptors.request.use((config) => {
  const token = getAccessToken(); // from memory or context
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

---

## Password Security Checklist

Mention these even if you didn't implement all:

| Measure | Status | What to say |
|---------|--------|-------------|
| bcrypt hashing | ✅ Must have | "Passwords hashed with bcrypt, cost factor 12" |
| No plaintext storage | ✅ Must have | "Never store or log raw passwords" |
| HTTPS in production | ✅ Must have | "Railway/Vercel enforces HTTPS" |
| Input validation | ✅ Should have | "Email format validated, password min 8 chars" |
| Rate limiting on login | ⚠️ Nice to have | "I'd add rate limiting to prevent brute force" |
| Password reset flow | ⚠️ Nice to have | "Not implemented yet — would use email token with 1hr expiry" |

---

## OAuth / Social Login (If You Have It)

> "Users can also sign in with Google. Flow: redirect to Google consent → Google returns auth code → server exchanges code for tokens server-side → find or create user in our DB → issue our own JWT. Google's client secret never touches the frontend."

---

## Common Interview Questions

**Q: Why JWT over sessions?**
A: "JWT is stateless — server doesn't store session data, easier to scale horizontally. Tradeoff: harder to revoke before expiry. For this project size, either works; I'd use sessions with Redis if I needed instant logout everywhere."

**Q: Where do you store the JWT on the frontend?**
A: "Access token in React Context (memory) — cleared on page refresh, so user re-logins. Refresh token in HTTP-only cookie. I avoided localStorage because it's accessible to any JavaScript, including XSS attacks."

**Q: How do you handle logout?**
A: "Clear token from memory/Context, remove cookie, redirect to login. With sessions: delete session from Redis."

**Q: What happens if someone steals the token?**
A: "They can impersonate the user until expiry. Mitigations: short expiry (15 min), HTTPS only, HTTP-only cookies, refresh token rotation. For higher security: server-side session with instant revocation."

**Q: How do you protect admin routes?**
A: "Backend: `authorize('admin')` middleware checks `req.user.role`. Frontend: hide admin UI, but real security is always server-side — frontend checks are UX only."

---

## Auth Mistakes to Acknowledge Honestly

| If you did this | Say this |
|-----------------|----------|
| JWT in localStorage | "I know this is an XSS risk — I'd move to HTTP-only cookies or in-memory storage" |
| No password strength rules | "I'd add minimum length and complexity validation" |
| No refresh token | "Access token expires in 1 hour; user must re-login. I'd add refresh tokens for better UX" |
| Auth check only on frontend | "Real authorization is enforced on every API route — frontend redirect is just UX" |

---

## Checklist

- [ ] Can trace login flow in 8 steps (client → server → DB → response)
- [ ] Can explain bcrypt and why not plaintext
- [ ] Can show or describe auth middleware
- [ ] Know where token is stored and the security tradeoff
- [ ] Can explain how protected routes work on frontend AND backend

---

**Next:** [database-design.md](./database-design.md) | [security.md](./security.md)
