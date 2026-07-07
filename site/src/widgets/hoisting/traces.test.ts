import { describe, it, expect } from 'vitest';
import { validateSample } from '../lib/stepper';
import { HOIST_TRACES } from './traces';

describe('hoisting traces', () => {
  it('every trace is structurally valid', () => {
    for (const sample of HOIST_TRACES) expect(validateSample(sample)).toEqual([]);
  });
  it('every trace reaches the execution phase and produces output', () => {
    for (const sample of HOIST_TRACES) {
      const last = sample.steps[sample.steps.length - 1].state;
      expect(last.phase).toBe('execution');
      expect(last.output.length).toBeGreaterThan(0);
    }
  });
});
