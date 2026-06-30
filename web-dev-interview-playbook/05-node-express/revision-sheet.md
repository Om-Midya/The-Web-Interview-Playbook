# Node.js & Express: Revision Sheet

## Node.js

- JS runtime on V8, event-driven, non-blocking I/O
- `npm start` / `package.json` scripts
- `process.env` for config

## Express Setup

```javascript
const express = require('express');
const app = express();
app.use(express.json());
app.listen(process.env.PORT || 5000);
```

## Middleware

`(req, res, next) => { ...; next(); }` — order matters.

## REST Verbs

GET read | POST create | PUT replace | PATCH partial | DELETE remove

## Status Codes

200 OK | 201 Created | 400 Bad Request | 401 Unauthorized | 403 Forbidden | 404 Not Found | 500 Server Error

## Auth Flow

Register → bcrypt hash → Login → bcrypt compare → JWT sign → Client sends `Authorization: Bearer <token>` → Middleware verify

## bcrypt

```javascript
const hash = await bcrypt.hash(pw, 12);
const ok = await bcrypt.compare(pw, hash);
```

## JWT Middleware Sketch

```javascript
const token = req.headers.authorization?.split(' ')[1];
const payload = jwt.verify(token, process.env.JWT_SECRET);
req.user = payload;
```

## CORS

Browser blocks cross-origin. Configure allowed origin on server.

## Validation

express-validator or Zod before DB operations.

## Error Handler

```javascript
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: { message: err.message } });
});
```

## Mongoose Quick

```javascript
const user = await User.findById(id).select('-password');
const users = await User.find({ role: 'admin' });
await User.create({ email, password: hash });
```

## Security Checklist

- [ ] bcrypt passwords
- [ ] JWT secret in env
- [ ] Input validation
- [ ] Helmet + CORS
- [ ] Rate limit login
- [ ] No secrets in git

## Quick Answers

| Question | Answer |
|----------|--------|
| Stateless? | Server doesn't store session between requests (JWT) |
| next(err)? | Passes to error middleware |
| 401 vs 403 | Not logged in vs no permission |
| Why httpOnly cookie? | XSS can't steal token |
