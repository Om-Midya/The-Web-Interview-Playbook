import { unified, type Plugin } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

/** Mirrors Astro's markdown pipeline closely enough to test rehype plugins.
 * Sets file.path so plugins can derive the doc id, via a tiny wrapper plugin. */
export function makeTestPipeline(plugin: Plugin<any[], any>, path: string) {
  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(() => (_tree: unknown, file: { path?: string }) => {
      file.path = path;
    })
    .use(plugin)
    .use(rehypeStringify);
}
