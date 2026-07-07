import { describe, it, expect } from 'vitest';
import { validateSample } from '../lib/stepper';
import { THIS_TRACES } from './traces';

describe('this-binding traces', () => {
  it('every trace is structurally valid', () => {
    for (const sample of THIS_TRACES) expect(validateSample(sample)).toEqual([]);
  });
  it('every trace resolves this and always shows the full 5-rule ladder', () => {
    for (const sample of THIS_TRACES) {
      const last = sample.steps[sample.steps.length - 1].state;
      expect(last.thisValue).not.toBe('?');
      for (const step of sample.steps) expect(step.state.ladder).toHaveLength(5);
    }
  });
});
