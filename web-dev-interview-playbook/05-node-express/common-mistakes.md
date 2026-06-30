# Node.js & Express: Common Mistakes

---

## 1. Storing Plain-Text Passwords

Always hash with bcrypt. Mention salt rounds (10–12).

---

## 2. No Input Validation

Trusting `req.body` directly into database. Validate type, length, format server-side.

---

## 3. Returning Password in API Response

```javascript
// Bad
res.json(user);

// Good
res.json({ data: { id: user._id, email: user.email } });
// Or .select('-password') in Mongoose
```

---

## 4. Wrong HTTP Status Codes

- 200 for everything
- 404 when validation fails (should be 400)
- 500 for "user not found" (should be 404)

---

## 5. Not Handling Async Errors

```javascript
// Bad — unhandled rejection in Express 4
app.get('/users', async (req, res) => {
  const users = await User.find(); // if throws, no response
  res.json(users);
});

// Good
app.get('/users', async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) { next(err); }
});
```

---

## 6. Middleware Order Wrong

`express.json()` must come before routes that read body. Error handler must be last. 404 handler after all routes.

---

## 7. CORS `*` with Credentials

```javascript
// Invalid combo
cors({ origin: '*', credentials: true });
```

Specify exact origin when using cookies.

---

## 8. JWT Secret in Code

Hardcoded `'mysecret'`. Use `process.env.JWT_SECRET` with strong random value.

---

## 9. Verbs in URLs

`POST /api/deleteUser` — use `DELETE /api/users/:id`.

---

## 10. No `.env` in `.gitignore`

Secrets pushed to GitHub. Rotate immediately if this happens.

---

## 11. Blocking the Event Loop

Synchronous heavy computation in request handler blocks all requests. Offload to worker or async.

---

## 12. No Pagination on Lists

Returning 10,000 records crashes client and slows server. Always paginate list endpoints.

---

## 13. Leaking Stack Traces

```javascript
res.status(500).json({ error: err.stack }); // Bad in production
```

---

## 14. Confusing 401 and 403

- 401: not authenticated
- 403: authenticated but not allowed

---

## 15. Not Using `next()` in Middleware

Middleware that doesn't call `next()` or send response hangs the request forever.
