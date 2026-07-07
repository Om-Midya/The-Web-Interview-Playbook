import type { StepperSample } from '../lib/stepper';

export const PIPELINE = ['request', 'logger', 'auth', 'validate', 'handler', 'error mw', 'response'] as const;

export interface MwState {
  at: string;
  notes: string[];
  status: number | null;
  body: string | null;
  errored: boolean;
}

const S = (over: Partial<MwState>): MwState => ({ at: 'request', notes: [], status: null, body: null, errored: false, ...over });

export const MW_TRACES: StepperSample<MwState>[] = [
  {
    id: 'happy-path',
    label: '200 OK',
    code: ['app.use(logger);', 'app.use(auth);', "app.post('/orders', validate, handler);", 'app.use(errorHandler);'].join('\n'),
    steps: [
      { line: 1, note: 'POST /orders arrives. Middleware run IN REGISTRATION ORDER; each calls next() to pass the request on.', state: S({ at: 'logger', notes: ['📝 logged: POST /orders'] }) },
      { line: 2, note: 'auth reads the Authorization header, verifies the token, attaches req.user, calls next().', state: S({ at: 'auth', notes: ['📝 logged: POST /orders', '🔑 req.user = { id: 7 }'] }) },
      { line: 3, note: 'validate checks the body shape — ok, next().', state: S({ at: 'validate', notes: ['📝 logged: POST /orders', '🔑 req.user = { id: 7 }', '✅ body valid'] }) },
      { line: 3, note: 'handler does the real work and sends the response. No next() — the chain ends by RESPONDING.', state: S({ at: 'handler', notes: ['📝 logged: POST /orders', '🔑 req.user = { id: 7 }', '✅ body valid'], status: 201, body: '{ "orderId": 42 }' }) },
      { line: null, note: 'Response leaves. The error middleware never ran — it only runs when something calls next(err) or throws.', state: S({ at: 'response', notes: ['📝 logged: POST /orders', '🔑 req.user = { id: 7 }', '✅ body valid'], status: 201, body: '{ "orderId": 42 }' }) },
    ],
  },
  {
    id: 'auth-401',
    label: '401 short-circuit',
    code: ['app.use(logger);', 'app.use(auth); // no token!', "app.post('/orders', validate, handler);", 'app.use(errorHandler);'].join('\n'),
    steps: [
      { line: 1, note: 'Same request, but no Authorization header this time.', state: S({ at: 'logger', notes: ['📝 logged: POST /orders'] }) },
      { line: 2, note: 'auth finds no token and RESPONDS DIRECTLY with 401 — it never calls next().', state: S({ at: 'auth', notes: ['📝 logged: POST /orders', '⛔ no token'], status: 401, body: '{ "error": "unauthorized" }' }) },
      { line: null, note: 'validate and handler NEVER RUN. Middleware order is your security boundary — auth must come before handlers.', state: S({ at: 'response', notes: ['📝 logged: POST /orders', '⛔ no token'], status: 401, body: '{ "error": "unauthorized" }' }) },
    ],
  },
  {
    id: 'thrown-error',
    label: 'error middleware',
    code: ['app.use(logger);', 'app.use(auth);', "app.post('/orders', validate, handler); // handler throws!", 'app.use(errorHandler); // (err, req, res, next)'].join('\n'),
    steps: [
      { line: 3, note: 'Everything passes… until the handler throws (say, the DB is down).', state: S({ at: 'handler', notes: ['📝 logged', '🔑 authed', '✅ valid', '💥 throw new Error("db down")'], errored: true }) },
      { line: 4, note: 'Express catches it and SKIPS to the first middleware with FOUR args (err, req, res, next).', state: S({ at: 'error mw', notes: ['📝 logged', '🔑 authed', '✅ valid', '💥 throw new Error("db down")'], errored: true }) },
      { line: 4, note: 'The error middleware turns the crash into a clean 500 — one place to shape ALL error responses.', state: S({ at: 'error mw', notes: ['📝 logged', '🔑 authed', '✅ valid', '💥 throw new Error("db down")'], status: 500, body: '{ "error": "internal" }', errored: true }) },
      { line: null, note: 'Response leaves. Takeaway: the 4-arg signature is what makes it an error handler; register it LAST.', state: S({ at: 'response', notes: ['📝 logged', '🔑 authed', '✅ valid', '💥 throw new Error("db down")'], status: 500, body: '{ "error": "internal" }', errored: true }) },
    ],
  },
];
