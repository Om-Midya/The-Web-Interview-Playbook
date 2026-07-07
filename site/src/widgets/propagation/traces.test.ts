import { describe, it, expect } from 'vitest';
import { validateSample } from '../lib/stepper';
import { PROP_TRACES, CHAIN } from './traces';

describe('propagation traces', () => {
  it('every trace is structurally valid', () => {
    for (const sample of PROP_TRACES) expect(validateSample(sample)).toEqual([]);
  });
  it('current nodes are always chain members and traces end done', () => {
    for (const sample of PROP_TRACES) {
      for (const step of sample.steps) {
        if (step.state.current) expect(CHAIN).toContain(step.state.current);
      }
      expect(sample.steps[sample.steps.length - 1].state.phase).toBe('done');
    }
  });
});
