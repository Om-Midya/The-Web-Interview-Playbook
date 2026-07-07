import { describe, it, expect } from 'vitest';
import { validateBackup } from './ProgressBackup';

describe('validateBackup', () => {
  it('accepts a valid backup', () => {
    expect(validateBackup({ version: 1, progress: { 'a/b:0': true } })).toBe(true);
  });
  it('rejects wrong versions, arrays, and non-true values', () => {
    expect(validateBackup({ version: 2, progress: {} })).toBe(false);
    expect(validateBackup({ version: 1, progress: [] })).toBe(false);
    expect(validateBackup({ version: 1, progress: { k: 'yes' } })).toBe(false);
    expect(validateBackup(null)).toBe(false);
  });
});
