import { describe, it, expect } from 'vitest';
import { validateSample } from '../lib/stepper';
import { MW_TRACES, PIPELINE } from './traces';

describe('middleware traces', () => {
  it('every trace is structurally valid', () => {
    for (const sample of MW_TRACES) expect(validateSample(sample)).toEqual([]);
  });
  it('positions are pipeline members and every trace ends with a status', () => {
    for (const sample of MW_TRACES) {
      for (const step of sample.steps) expect(PIPELINE).toContain(step.state.at);
      const last = sample.steps[sample.steps.length - 1].state;
      expect(last.status).not.toBeNull();
      expect(last.at).toBe('response');
    }
  });
});
