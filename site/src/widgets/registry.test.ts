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
});
