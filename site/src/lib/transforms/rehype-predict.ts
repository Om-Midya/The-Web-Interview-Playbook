import type { Root, Element, ElementContent, RootContent } from 'hast';
import { docIdFromPath } from './doc-id';

function isTag(node: RootContent, ...tags: string[]): node is Element {
  return node.type === 'element' && tags.includes((node as Element).tagName);
}

function startsAnswer(node: RootContent): boolean {
  if (!isTag(node, 'p')) return false;
  const first = (node as Element).children[0];
  if (!first || first.type !== 'element' || first.tagName !== 'strong') return false;
  const text = first.children
    .map((c) => ('value' in c ? String(c.value) : ''))
    .join('');
  return text.startsWith('Answer:');
}

/** Moves Answer and Why blocks of tricky-output docs behind a reveal. */
export function rehypePredict() {
  return (tree: Root, file: { path?: string }) => {
    const docId = docIdFromPath(file.path);
    if (!docId || !docId.endsWith('/tricky-output-questions')) return;

    const out: RootContent[] = [];
    const children = tree.children;
    for (let i = 0; i < children.length; i++) {
      const node = children[i];
      if (startsAnswer(node)) {
        const body: ElementContent[] = [];
        let j = i;
        while (j < children.length && !isTag(children[j], 'h2', 'hr')) {
          body.push(children[j] as ElementContent);
          j++;
        }
        out.push({
          type: 'element',
          tagName: 'details',
          properties: { className: ['predict-reveal'] },
          children: [
            {
              type: 'element',
              tagName: 'summary',
              properties: {},
              children: [{ type: 'text', value: '🤔 Think first — then reveal the answer' }],
            },
            { type: 'element', tagName: 'div', properties: { className: ['predict-reveal-body'] }, children: body },
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
