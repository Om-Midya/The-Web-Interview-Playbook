import { describe, it, expect } from 'vitest';
import { makeTestPipeline } from './test-pipeline';
import { rehypePredict } from './rehype-predict';

const TRICKY_PATH = '/repo/web-dev-interview-playbook/02-javascript-core/tricky-output-questions.md';

const DOC = [
  '## Question 1',
  '```javascript\nconsole.log(typeof typeof 1);\n```',
  '**Answer:** `"string"`',
  '**Why:** typeof always returns a string.',
  '---',
  '## Question 2',
  '```javascript\nconsole.log(0.1 + 0.2 === 0.3);\n```',
  '**Answer:** `false`',
  '**Why:** Floating-point precision.',
].join('\n\n');

describe('rehypePredict', () => {
  it('hides answer+why behind details, keeps the question code visible', async () => {
    const out = String(await makeTestPipeline(rehypePredict, TRICKY_PATH).process(DOC));
    expect((out.match(/predict-reveal"/g) ?? []).length).toBe(2);
    expect(out).toContain('Think first');
    // the code block must NOT be inside a details element
    const firstDetails = out.indexOf('<details');
    const firstCode = out.indexOf('typeof typeof');
    expect(firstCode).toBeLessThan(firstDetails);
  });
  it('fail-soft: other docs untouched', async () => {
    const out = String(
      await makeTestPipeline(rehypePredict, '/repo/web-dev-interview-playbook/00-start-here/how-to-use-this-repo.md').process(DOC)
    );
    expect(out).not.toContain('predict-reveal');
  });
  it('matches qualified answers like "Answer (strict mode):"', async () => {
    const doc = [
      '## Question 17',
      '```javascript\nfoo();\n```',
      '**Answer (non-strict):** `undefined`',
      '**Why:** implicit globals.',
    ].join('\n\n');
    const out = String(await makeTestPipeline(rehypePredict, TRICKY_PATH).process(doc));
    expect((out.match(/predict-reveal"/g) ?? []).length).toBe(1);
    const details = out.indexOf('<details');
    const answer = out.indexOf('Answer (non-strict)');
    expect(details).toBeGreaterThan(-1);
    expect(answer).toBeGreaterThan(details); // answer sits inside the details block
  });
});
