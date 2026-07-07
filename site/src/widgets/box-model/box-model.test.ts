import { describe, it, expect } from 'vitest';
import { boxMetrics } from './box-model';

describe('boxMetrics', () => {
  const base = { width: 200, padding: 20, border: 5, margin: 10 };
  it('content-box: width is the content; padding/border add on', () => {
    expect(boxMetrics({ ...base, boxSizing: 'content-box' })).toEqual({
      contentWidth: 200,
      visibleWidth: 250,
      totalWidth: 270,
    });
  });
  it('border-box: width is the visible box; content shrinks', () => {
    expect(boxMetrics({ ...base, boxSizing: 'border-box' })).toEqual({
      contentWidth: 150,
      visibleWidth: 200,
      totalWidth: 220,
    });
  });
  it('border-box clamps content at zero', () => {
    expect(boxMetrics({ width: 20, padding: 20, border: 5, margin: 0, boxSizing: 'border-box' }).contentWidth).toBe(0);
  });
});
