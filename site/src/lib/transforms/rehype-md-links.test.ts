import { afterEach, describe, expect, it, vi } from 'vitest';
import { makeTestPipeline } from './test-pipeline';
import { rehypeMdLinks, resolveMdHref } from './rehype-md-links';

const DOC_PATH = '/repo/web-dev-interview-playbook/09-hr-interviews/mock-hr-interview.md';

describe('resolveMdHref', () => {
  it('resolves sibling and parent-relative .md links to site URLs', () => {
    expect(resolveMdHref('09-hr-interviews/mock-hr-interview', './behavioral-questions.md'))
      .toBe('/09-hr-interviews/behavioral-questions/');
    expect(resolveMdHref('09-hr-interviews/mock-hr-interview', '../00-start-here/answer-frameworks.md'))
      .toBe('/00-start-here/answer-frameworks/');
    expect(resolveMdHref('09-hr-interviews/mock-hr-interview', 'behavioral-questions.md'))
      .toBe('/09-hr-interviews/behavioral-questions/');
  });
  it('maps README links to section indexes and the repo root README to home', () => {
    expect(resolveMdHref('09-hr-interviews/mock-hr-interview', './README.md'))
      .toBe('/09-hr-interviews/');
    expect(resolveMdHref('09-hr-interviews/mock-hr-interview', '../README.md')).toBe('/');
  });
  it('maps ROADMAP.md to the interactive planner and preserves fragments', () => {
    expect(resolveMdHref('00-start-here/how-to-use-this-repo', '../ROADMAP.md')).toBe('/roadmap/');
    expect(resolveMdHref('09-hr-interviews/mock-hr-interview', './behavioral-questions.md#how-to-use-this-file'))
      .toBe('/09-hr-interviews/behavioral-questions/#how-to-use-this-file');
  });
  it('leaves external, absolute, fragment-only, and non-md links unchanged', () => {
    for (const href of ['https://example.com/x.md', '/already/absolute/', '#anchor', './diagram.png', 'mailto:a@b.c']) {
      expect(resolveMdHref('09-hr-interviews/mock-hr-interview', href)).toBeNull();
    }
  });
  it('fails soft on links escaping the corpus root', () => {
    expect(resolveMdHref('09-hr-interviews/mock-hr-interview', '../../outside.md')).toBeNull();
  });
});

describe('rehypeMdLinks (pipeline)', () => {
  afterEach(() => vi.unstubAllEnvs());
  it('rewrites .md hrefs in rendered HTML', async () => {
    const md = 'See [behavioral](./behavioral-questions.md) and [frameworks](../00-start-here/answer-frameworks.md).';
    const out = String(await makeTestPipeline(rehypeMdLinks, DOC_PATH).process(md));
    expect(out).toContain('href="/09-hr-interviews/behavioral-questions/"');
    expect(out).toContain('href="/00-start-here/answer-frameworks/"');
    expect(out).not.toContain('.md');
  });
  it('prefixes the configured base', async () => {
    vi.stubEnv('ASTRO_BASE', '/The-Web-Interview-Playbook');
    const md = 'See [behavioral](./behavioral-questions.md).';
    const out = String(await makeTestPipeline(rehypeMdLinks, DOC_PATH).process(md));
    expect(out).toContain('href="/The-Web-Interview-Playbook/09-hr-interviews/behavioral-questions/"');
  });
  it('does not touch non-corpus or external links', async () => {
    const md = '[ext](https://example.com/a.md) and [img](./pic.png)';
    const out = String(await makeTestPipeline(rehypeMdLinks, DOC_PATH).process(md));
    expect(out).toContain('href="https://example.com/a.md"');
    expect(out).toContain('href="./pic.png"');
  });
});
