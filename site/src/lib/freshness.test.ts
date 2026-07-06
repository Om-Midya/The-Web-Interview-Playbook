import { describe, it, expect } from 'vitest';
import { getLastCommitISO, isRecent, formatDate } from './freshness';

describe('isRecent', () => {
  const now = new Date('2026-07-07T00:00:00Z');
  it('true within 14 days', () => {
    expect(isRecent('2026-07-01T12:00:00+05:30', now)).toBe(true);
  });
  it('false beyond 14 days', () => {
    expect(isRecent('2026-06-01T12:00:00Z', now)).toBe(false);
  });
  it('false for null', () => {
    expect(isRecent(null, now)).toBe(false);
  });
  it('respects a custom window', () => {
    expect(isRecent('2026-06-01T12:00:00Z', now, 60)).toBe(true);
  });
});

describe('formatDate', () => {
  it('formats human-readably', () => {
    expect(formatDate('2026-07-01T12:00:00Z')).toBe('Jul 1, 2026');
  });
});

describe('formatDate with bad input', () => {
  it('returns empty string for unparseable dates', () => {
    expect(formatDate('not-a-date')).toBe('');
  });
});

describe('getLastCommitISO', () => {
  it('returns an ISO date for a committed file in this repo', () => {
    const iso = getLastCommitISO('../web-dev-interview-playbook/README.md');
    expect(iso).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
  it('returns null for a nonexistent file', () => {
    expect(getLastCommitISO('../does-not-exist.md')).toBeNull();
  });
});
