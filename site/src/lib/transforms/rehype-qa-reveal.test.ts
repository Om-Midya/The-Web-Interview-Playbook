import { describe, it, expect } from 'vitest';
import { makeTestPipeline } from './test-pipeline';
import { rehypeQaReveal } from './rehype-qa-reveal';

const QA_PATH = '/repo/web-dev-interview-playbook/02-javascript-core/interview-questions.md';
const OTHER_PATH = '/repo/web-dev-interview-playbook/02-javascript-core/revision-sheet.md';

const DOC = [
  '## Question: What is hoisting?',
  '### Difficulty',
  '🟡 Medium',
  '### Answer',
  'Declarations are registered first.',
  'Second answer paragraph.',
  '### Follow-up Questions',
  '- Are let and const hoisted?',
  '### Common Mistakes',
  '- Assuming let is not hoisted',
].join('\n\n');

describe('rehypeQaReveal', () => {
  it('wraps Answer/Follow-ups/Mistakes sections in details, keeps Difficulty visible', async () => {
    const out = String(await makeTestPipeline(rehypeQaReveal, QA_PATH).process(DOC));
    expect(out).toContain('<details class="qa-reveal"><summary>Answer</summary>');
    expect(out).toContain('<summary>Follow-up Questions</summary>');
    expect(out).toContain('<summary>Common Mistakes</summary>');
    expect(out).toContain('Second answer paragraph.'); // content preserved inside details
    expect(out).toContain('<h3>Difficulty</h3>'); // untouched heading stays a heading
    expect(out).not.toContain('<h3>Answer</h3>'); // wrapped heading is consumed
  });
  it('fail-soft: leaves non-interview-questions docs untouched', async () => {
    const out = String(await makeTestPipeline(rehypeQaReveal, OTHER_PATH).process(DOC));
    expect(out).not.toContain('qa-reveal');
    expect(out).toContain('<h3>Answer</h3>');
  });
});
