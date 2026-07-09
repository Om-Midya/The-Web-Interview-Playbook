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
  // Matches "Answer:" and qualified forms like "Answer (strict mode):".
  return /^Answer\b[^:]*:/.test(text);
}

/** The commit bar rendered before each reveal; the client script gates the
 * details on it. Without JS the details works exactly as before (fail-soft). */
function commitBar(key: string): Element {
  return {
    type: 'element',
    tagName: 'div',
    properties: { className: ['predict-commit'], dataPredictFor: key },
    children: [
      {
        type: 'element',
        tagName: 'textarea',
        properties: {
          className: ['predict-input'],
          rows: 2,
          placeholder: 'What do you think it prints? Even a guess counts.',
          ariaLabel: 'Your prediction',
        },
        children: [],
      },
      {
        type: 'element',
        tagName: 'button',
        properties: { className: ['predict-lock'], type: 'button' },
        children: [{ type: 'text', value: 'Lock in my prediction' }],
      },
    ],
  };
}

function compareBlock(): Element {
  return {
    type: 'element',
    tagName: 'div',
    properties: { className: ['predict-compare'], hidden: true },
    children: [
      { type: 'element', tagName: 'p', properties: { className: ['predict-yours'] }, children: [] },
    ],
  };
}

/** Moves Answer and Why blocks of tricky-output docs behind a commit-gated
 * reveal. Keys are POSITIONAL (docId:n) — reordering questions upstream
 * misattributes stored predictions (same caveat as checkbox keys). */
export function rehypePredict() {
  return (tree: Root, file: { path?: string }) => {
    const docId = docIdFromPath(file.path);
    if (!docId || !docId.endsWith('/tricky-output-questions')) return;

    const out: RootContent[] = [];
    const children = tree.children;
    let n = 0;
    for (let i = 0; i < children.length; i++) {
      const node = children[i];
      if (startsAnswer(node)) {
        const body: ElementContent[] = [];
        let j = i;
        while (j < children.length && !isTag(children[j], 'h2', 'hr')) {
          body.push(children[j] as ElementContent);
          j++;
        }
        const key = `${docId}:${n}`;
        n += 1;
        out.push(commitBar(key));
        out.push({
          type: 'element',
          tagName: 'details',
          properties: { className: ['predict-reveal'], dataPredictKey: key },
          children: [
            {
              type: 'element',
              tagName: 'summary',
              properties: {},
              children: [{ type: 'text', value: '🤔 Predict first — then reveal the answer' }],
            },
            {
              type: 'element',
              tagName: 'div',
              properties: { className: ['predict-reveal-body'] },
              children: [compareBlock(), ...body],
            },
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
