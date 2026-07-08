import type { StepperSample } from '../lib/stepper';

export interface FlowState {
  active: 'client' | 'server';
  wire: string;
  clientHas: boolean;   // client holds a token
  serverAction: string | null;
}

export const AUTH_FLOW_TRACE: StepperSample<FlowState>[] = [
  {
    id: 'auth-flow',
    label: 'the stateless auth flow',
    code: [
      'POST /login { user, pass }',
      '← 200 { token }',
      'GET /orders',
      'Authorization: Bearer <token>',
      '← 200 [ ...orders ]',
    ].join('\n'),
    steps: [
      { line: 1, note: 'The client proves identity ONCE, with credentials.', state: { active: 'client', wire: 'credentials →', clientHas: false, serverAction: null } },
      { line: 2, note: 'The server checks the credentials and SIGNS a token with its secret. Nothing is stored — no session table, no server memory.', state: { active: 'server', wire: '← signed token', clientHas: true, serverAction: 'sign(HS256, secret)' } },
      { line: 4, note: 'Every later request carries the token in the Authorization header. The client is holding its own session.', state: { active: 'client', wire: 'Bearer token →', clientHas: true, serverAction: null } },
      { line: 5, note: 'The server verifies the SIGNATURE — statelessly. ANY server holding the secret can do it; nothing is looked up. That is why JWTs scale horizontally.', state: { active: 'server', wire: '← 200', clientHas: true, serverAction: 'verify signature ✓' } },
    ],
  },
];
