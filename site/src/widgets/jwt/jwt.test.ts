import { describe, expect, it } from 'vitest';
import { validateSample } from '../lib/stepper';
import { AUTH_FLOW_TRACE } from './flow';
import {
  DEFAULT_PAYLOAD, DEFAULT_SECRET, b64urlDecode, b64urlEncode, hasWebCrypto,
  signToken, splitToken, tamperToken, verifyToken,
} from './jwt';

describe('base64url codec', () => {
  it('round-trips ascii and unicode', () => {
    for (const s of ['hello', '{"role":"user"}', 'ü ✓ €', '']) {
      expect(b64urlDecode(b64urlEncode(s))).toBe(s);
    }
  });
  it('output is url-safe with no padding', () => {
    expect(b64urlEncode('??>>~~')).not.toMatch(/[+/=]/);
  });
});

describe('token structure', () => {
  it('splitToken rejects malformed tokens', () => {
    expect(splitToken('a.b')).toBeNull();
    expect(splitToken('')).toBeNull();
    expect(splitToken('a..c')).toBeNull();
  });
  it('DEFAULT_PAYLOAD parses and carries role user', () => {
    expect((JSON.parse(DEFAULT_PAYLOAD) as { role: string }).role).toBe('user');
  });
});

describe('webcrypto signing', () => {
  it('canary: SubtleCrypto is available in the test environment', () => {
    expect(hasWebCrypto()).toBe(true);
  });
  it('sign → verify roundtrip; wrong secret fails', async () => {
    const tok = await signToken(DEFAULT_PAYLOAD, DEFAULT_SECRET);
    expect(await verifyToken(tok, DEFAULT_SECRET)).toBe(true);
    expect(await verifyToken(tok, 'wrong-secret')).toBe(false);
  });
  it('tampering breaks verification without touching header or signature', async () => {
    const tok = await signToken(DEFAULT_PAYLOAD, DEFAULT_SECRET);
    const bad = tamperToken(tok);
    const [h1, , s1] = tok.split('.');
    const [h2, p2, s2] = bad.split('.');
    expect(h2).toBe(h1);
    expect(s2).toBe(s1);
    expect((JSON.parse(b64urlDecode(p2)) as { role: string }).role).toBe('admin');
    expect(await verifyToken(bad, DEFAULT_SECRET)).toBe(false);
  });
});

describe('auth flow trace', () => {
  it('every trace is structurally valid', () => {
    for (const s of AUTH_FLOW_TRACE) expect(validateSample(s)).toEqual([]);
  });
});
