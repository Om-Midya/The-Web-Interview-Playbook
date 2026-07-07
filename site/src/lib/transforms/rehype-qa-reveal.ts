import type { Root, Element, ElementContent, RootContent } from 'hast';
import { docIdFromPath } from './doc-id';

const REVEAL_TITLES = new Set([
  'Answer',
  'Example',
  'Follow-up Questions',
  'Common Mistakes',
  'Project Connection',
]);

function headingText(node: Element): string {
  return node.children
    .map((c) => ('value' in c ? String(c.value) : ''))
    .join('')
    .trim();
}

function isTag(node: RootContent, ...tags: string[]): node is Element {
  return node.type === 'element' && tags.includes((node as Element).tagName);
}

/** Wraps recognized h3 sections of interview-questions docs in <details>.
 * Operates on top-level children only; fail-soft for other docs. */
export function rehypeQaReveal() {
  return (tree: Root, file: { path?: string }) => {
    const docId = docIdFromPath(file.path);
    if (!docId || !docId.endsWith('/interview-questions')) return;

    const out: RootContent[] = [];
    const children = tree.children;
    for (let i = 0; i < children.length; i++) {
      const node = children[i];
      if (isTag(node, 'h3') && REVEAL_TITLES.has(headingText(node))) {
        const title = headingText(node);
        const body: ElementContent[] = [];
        let j = i + 1;
        while (j < children.length && !isTag(children[j], 'h2', 'h3', 'hr')) {
          body.push(children[j] as ElementContent);
          j++;
        }
        out.push({
          type: 'element',
          tagName: 'details',
          properties: { className: ['qa-reveal'] },
          children: [
            { type: 'element', tagName: 'summary', properties: {}, children: [{ type: 'text', value: title }] },
            { type: 'element', tagName: 'div', properties: { className: ['qa-reveal-body'] }, children: body },
          ],
        });
        i = j - 1;
      } else {
        out.push(node);
      }
    }
    tree.children = out;
  };
}
