import { describe, it, expect } from 'vitest';
import { makeTestPipeline } from './test-pipeline';
import { rehypeChecklists } from './rehype-checklists';

const CORPUS_PATH = '/repo/web-dev-interview-playbook/02-javascript-core/topics-not-to-miss.md';

describe('rehypeChecklists', () => {
  it('enables checkboxes and assigns sequential progress keys', async () => {
    const html = await makeTestPipeline(rehypeChecklists, CORPUS_PATH)
      .process('- [ ] alpha\n- [x] beta');
    const out = String(html);
    expect(out).not.toContain('disabled');
    expect(out).toContain('data-progress-key="02-javascript-core/topics-not-to-miss:0"');
    expect(out).toContain('data-progress-key="02-javascript-core/topics-not-to-miss:1"');
  });
  it('fail-soft: leaves checkboxes disabled when path is not in the corpus', async () => {
    const html = await makeTestPipeline(rehypeChecklists, '/tmp/elsewhere.md')
      .process('- [ ] alpha');
    expect(String(html)).toContain('disabled');
    expect(String(html)).not.toContain('data-progress-key');
  });
});
