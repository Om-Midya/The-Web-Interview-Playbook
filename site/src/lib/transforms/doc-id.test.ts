import { describe, it, expect } from 'vitest';
import { docIdFromPath, countCheckboxes } from './doc-id';

describe('docIdFromPath', () => {
  it('extracts and lowercases the id', () => {
    expect(
      docIdFromPath('/Users/x/repo/web-dev-interview-playbook/02-javascript-core/README.md')
    ).toBe('02-javascript-core/readme');
  });
  it('handles relative and windows-style paths', () => {
    expect(docIdFromPath('..\\web-dev-interview-playbook\\ROADMAP.md')).toBe('roadmap');
  });
  it('returns null for paths outside the corpus', () => {
    expect(docIdFromPath('/tmp/other.md')).toBeNull();
    expect(docIdFromPath(undefined)).toBeNull();
  });
});

describe('countCheckboxes', () => {
  it('counts checked and unchecked task items', () => {
    const md = '- [ ] one\n- [x] two\n- plain\n  - [ ] nested\ntext';
    expect(countCheckboxes(md)).toBe(3);
  });
  it('returns 0 when there are none', () => {
    expect(countCheckboxes('# heading\n- plain item')).toBe(0);
  });
});
