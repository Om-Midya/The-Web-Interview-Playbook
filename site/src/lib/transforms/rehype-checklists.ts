import { visit } from 'unist-util-visit';
import type { Root, Element } from 'hast';
import { docIdFromPath } from './doc-id';

/** Upgrades GFM task-list checkboxes (rendered disabled) to live checkboxes
 * carrying a stable per-file progress key. Fail-soft: unknown file → untouched. */
export function rehypeChecklists() {
  return (tree: Root, file: { path?: string }) => {
    const docId = docIdFromPath(file.path);
    if (!docId) return;
    let n = 0;
    visit(tree, 'element', (node: Element) => {
      if (
        node.tagName === 'input' &&
        node.properties?.type === 'checkbox'
      ) {
        delete node.properties.disabled;
        node.properties['data-progress-key'] = `${docId}:${n}`;
        node.properties.className = ['progress-check'];
        n += 1;
      }
    });
  };
}
