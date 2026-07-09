import { describe, it, expect } from 'vitest';
import { readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SECTION_WIDGETS } from './manifest';
import { REGISTERED_WIDGET_IDS } from './WidgetHost';

describe('widget manifest ↔ registry', () => {
  it('every manifest entry has a registered component', () => {
    for (const entries of Object.values(SECTION_WIDGETS)) {
      for (const w of entries) {
        expect(REGISTERED_WIDGET_IDS).toContain(w.id);
      }
    }
  });
  it('every registered widget is placed in some section (or allow-listed as page-mounted)', () => {
    const placed = new Set(Object.values(SECTION_WIDGETS).flat().map((w) => w.id));
    for (const id of REGISTERED_WIDGET_IDS) {
      expect(placed.has(id), `registered widget "${id}" is not in any section`).toBe(true);
    }
  });
  it('every manifest section key is a real corpus section directory', () => {
    const here = dirname(fileURLToPath(import.meta.url)); // …/site/src/widgets
    const corpus = join(here, '..', '..', '..', 'web-dev-interview-playbook');
    const dirs = new Set(
      readdirSync(corpus, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name),
    );
    for (const key of Object.keys(SECTION_WIDGETS)) {
      expect(dirs.has(key), `manifest key "${key}" is not a corpus section dir`).toBe(true);
    }
  });
  it('no widget source files differ only in casing (breaks resolution on case-insensitive filesystems)', () => {
    const widgetsDir = dirname(fileURLToPath(import.meta.url));
    const walk = (dir: string): void => {
      const stems = new Map<string, string>();
      for (const e of readdirSync(dir, { withFileTypes: true })) {
        if (e.isDirectory()) {
          walk(join(dir, e.name));
          continue;
        }
        const m = e.name.match(/^(.+?)\.(ts|tsx)$/);
        if (!m || e.name.includes('.test.')) continue;
        const stem = m[1].toLowerCase();
        const prev = stems.get(stem);
        expect(prev, `${dir}: "${e.name}" collides with "${prev}" (names differ only in casing)`).toBeUndefined();
        stems.set(stem, e.name);
      }
    };
    walk(widgetsDir);
  });
});
