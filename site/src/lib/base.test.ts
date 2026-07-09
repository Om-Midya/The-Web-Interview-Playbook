import { afterEach, describe, expect, it, vi } from 'vitest';
import { withBase } from './base';

describe('withBase', () => {
  afterEach(() => vi.unstubAllEnvs());
  it('is the identity at the default root base', () => {
    vi.stubEnv('BASE_URL', '/');
    expect(withBase('/roadmap/')).toBe('/roadmap/');
    expect(withBase('/')).toBe('/');
  });
  it('prefixes with the configured base without double slashes', () => {
    vi.stubEnv('BASE_URL', '/repo/');
    expect(withBase('/roadmap/')).toBe('/repo/roadmap/');
    expect(withBase('/')).toBe('/repo/');
    vi.stubEnv('BASE_URL', '/repo');
    expect(withBase('/roadmap/')).toBe('/repo/roadmap/');
  });
  it('normalizes a missing leading slash', () => {
    vi.stubEnv('BASE_URL', '/repo/');
    expect(withBase('roadmap/')).toBe('/repo/roadmap/');
  });
});
