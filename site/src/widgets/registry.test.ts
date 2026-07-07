import { describe, it, expect } from 'vitest';
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
});
