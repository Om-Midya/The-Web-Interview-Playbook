import { describe, it, expect } from 'vitest';
import { validateSample } from '../lib/stepper';
import { RENDER_TRACES } from './traces';

describe('rendering pattern traces', () => {
  it('covers all four patterns and validates structurally', () => {
    expect(RENDER_TRACES.map((t) => t.id)).toEqual(['csr', 'ssr', 'ssg', 'isr']);
    for (const sample of RENDER_TRACES) expect(validateSample(sample)).toEqual([]);
  });
  it('every pattern ends interactive with content on screen', () => {
    for (const sample of RENDER_TRACES) {
      const last = sample.steps[sample.steps.length - 1].state;
      expect(last.browser.interactive).toBe(true);
      expect(['content']).toContain(last.browser.screen);
    }
  });
});
