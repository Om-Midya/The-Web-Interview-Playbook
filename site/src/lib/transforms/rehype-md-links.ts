import type { Root, Element } from 'hast';
import { visit } from 'unist-util-visit';
import { docIdFromPath } from './doc-id';

/** Resolve a corpus-relative `.md` href to its site URL (no base prefix), or
 * null when the href should be left untouched (external, absolute, non-md,
 * or escaping the corpus root — fail-soft). */
export function resolveMdHref(currentDocId: string, href: string): string | null {
  if (!href || /^([a-z][a-z0-9+.-]*:|\/|#)/i.test(href)) return null; // scheme, absolute, fragment-only
  const [pathPart, fragment] = href.split('#');
  if (!/\.md$/i.test(pathPart)) return null;

  // Resolve relative to the current doc's directory, posix-style.
  const baseSegments = currentDocId.split('/').slice(0, -1);
  const segments = [...baseSegments];
  for (const seg of pathPart.split('/')) {
    if (seg === '' || seg === '.') continue;
    if (seg === '..') {
      if (segments.length === 0) return null; // escapes the corpus root
      segments.pop();
    } else {
      segments.push(seg);
    }
  }
  let id = segments.join('/').toLowerCase().replace(/\.md$/, '');

  // Special routes mirroring the site's page rules. ('roadmap' stays as-is:
  // the raw doc is remapped to /roadmap-source/, but readers belong on the
  // interactive planner at /roadmap/.)
  if (id === 'readme') id = ''; // repo root README → home
  else if (id.endsWith('/readme')) id = id.slice(0, -'/readme'.length); // section README → section index

  const path = id === '' ? '/' : `/${id}/`;
  return fragment ? `${path}#${fragment}` : path;
}

/** Rewrites corpus-internal `.md` links (authored for GitHub browsing) to the
 * extension-less site URLs they render at. Base-aware via ASTRO_BASE, the same
 * env var astro.config.mjs reads. */
export function rehypeMdLinks() {
  return (tree: Root, file: { path?: string }) => {
    const docId = docIdFromPath(file.path);
    if (!docId) return;
    const rawBase = process.env.ASTRO_BASE ?? '';
    const base = rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase;
    visit(tree, 'element', (node: Element) => {
      if (node.tagName !== 'a' || typeof node.properties?.href !== 'string') return;
      const resolved = resolveMdHref(docId, node.properties.href);
      if (resolved) node.properties.href = `${base}${resolved}`;
    });
  };
}
