# Node.js & Express: Auth & Security

Practical auth and security for student-level backend interviews.

---

## Password Storage

**Never** store plain-text passwords.

```javascript
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 12;

// Register
const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
await User.create({ email, password: hashedPassword });

// Login
const user = await User.findOne({ email });
const match = await bcrypt.compare(password, user.password);
if (!match) return res.status(401).json({ error: 'Invalid credentials' });
```

**Interview point:** bcrypt is slow by design (resists brute force). Salt is embedded in the hash.

---

## JWT Authentication

### Structure

`header.payload.signature` — base64url encoded. Signature prevents tampering.

### Sign on Login

```javascript
const jwt = require('jsonwebtoken');

const token = jwt.sign(
  { userId: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

res.json({ token, user: { id: user._id, email: user.email } });
```

### Verify Middleware

```javascript
function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Protected route
app.get('/api/profile', authMiddleware, (req, res) => {
  res.json({ userId: req.user.userId });
});
```

### Refresh Tokens (awareness)

Access token: short-lived (15 min). Refresh token: long-lived, stored httpOnly, used to get new access token. Reduces exposure if access token leaks.

---

## Session-Based Auth

```javascript
const session = require('express-session');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000
  }
}));
```

| JWT | Sessions |
|-----|----------|
| Stateless, scalable | Stateful, needs store (Redis) |
| Good for APIs/mobile | Good for traditional web apps |
| Token in header | Cookie-based |

---

## httpOnly Cookies vs localStorage

**Problem with localStorage:** Any XSS can steal token.

**Better:** Store JWT in httpOnly, Secure, SameSite cookie — JS cannot read it.

```javascript
res.cookie('token', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000
});
```

---

## CORS

Browsers block cross-origin requests unless server allows.

```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.CLIENT_URL, // not '*' with credentials
  credentials: true
}));
```

**Interview answer:** CORS is a browser security feature. Postman works without CORS because it's not a browser enforcing same-origin policy.

---

## Input Validation

Never trust client input.

```javascript
const { body, validationResult } = require('express-validator');

app.post('/api/register',
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // proceed
  }
);
```

Or with Zod:

```javascript
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const result = schema.safeParse(req.body);
if (!result.success) return res.status(400).json(result.error);
```

---

## Security Headers (Helmet)

```javascript
const helmet = require('helmet');
app.use(helmet());
```

Sets X-Content-Type-Options, X-Frame-Options, etc.

---

## Rate Limiting

Prevent brute force on login:

```javascript
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many attempts' }
});

app.post('/api/login', loginLimiter, loginHandler);
```

---

## Environment Variables

```javascript
// .env (NEVER commit)
JWT_SECRET=long-random-string
DATABASE_URL=mongodb://...
PORT=5000

// app.js
require('dotenv').config();
const secret = process.env.JWT_SECRET;
if (!secret) throw new Error('JWT_SECRET required');
```

---

## Authorization vs Authentication

- **Authentication:** Who are you? (login)
- **Authorization:** What can you do? (roles, permissions)

```javascript
function requireRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

app.delete('/api/users/:id', authMiddleware, requireRole('admin'), deleteUser);
```

---

## Common Vulnerabilities to Mention

| Threat | Prevention |
|--------|------------|
| XSS | Sanitize output, CSP, httpOnly cookies |
| SQL/NoSQL injection | Parameterized queries, validate input |
| CSRF | SameSite cookies, CSRF tokens for sessions |
| Brute force | Rate limiting, account lockout |
| Secret leak | .env, gitignore, rotate keys |

---

## Interview Sound Bites

- "Passwords hashed with bcrypt, never stored plain"
- "JWT verified on every protected request"
- "Validate input on server even if client validates"
- "CORS configured for specific frontend origin"
- "Secrets in environment variables, not code"
