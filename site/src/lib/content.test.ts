import { describe, it, expect } from 'vitest';
import { sectionOf, sectionTitle, extractTitle, sortDocs, isSectionReadme } from './content';

describe('sectionOf', () => {
  it('returns the section dir for nested ids', () => {
    expect(sectionOf('02-javascript-core/polyfills')).toBe('02-javascript-core');
  });
  it('returns null for root-level ids', () => {
    expect(sectionOf('roadmap')).toBeNull();
  });
});

describe('sectionTitle', () => {
  it('uses the override map', () => {
    expect(sectionTitle('01-html-css')).toBe('HTML & CSS');
    expect(sectionTitle('06-nextjs')).toBe('Next.js');
  });
  it('falls back to title case for unknown sections', () => {
    expect(sectionTitle('13-company-questions')).toBe('Company Questions');
  });
});

describe('extractTitle', () => {
  it('takes the first h1', () => {
    expect(extractTitle('# JavaScript Core Interview Questions\n\ntext', 'x')).toBe(
      'JavaScript Core Interview Questions'
    );
  });
  it('humanizes the id when no h1 exists', () => {
    expect(extractTitle('no heading here', '02-javascript-core/tricky-output-questions')).toBe(
      'Tricky Output Questions'
    );
  });
});

describe('sortDocs', () => {
  it('puts readme first, then preferred order, then alphabetical', () => {
    const input = [
      '02-javascript-core/polyfills',
      '02-javascript-core/readme',
      '02-javascript-core/interview-questions',
      '02-javascript-core/topics-not-to-miss',
      '02-javascript-core/aaa-unknown',
    ];
    expect(sortDocs(input)).toEqual([
      '02-javascript-core/readme',
      '02-javascript-core/topics-not-to-miss',
      '02-javascript-core/interview-questions',
      '02-javascript-core/polyfills',
      '02-javascript-core/aaa-unknown',
    ]);
  });
});

describe('isSectionReadme', () => {
  it('detects section readmes only', () => {
    expect(isSectionReadme('02-javascript-core/readme')).toBe(true);
    expect(isSectionReadme('readme')).toBe(false);
    expect(isSectionReadme('02-javascript-core/polyfills')).toBe(false);
  });
});
