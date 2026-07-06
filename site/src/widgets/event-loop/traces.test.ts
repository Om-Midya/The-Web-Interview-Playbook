import { describe, it, expect } from 'vitest';
import { validateSample } from '../lib/stepper';
import { TRACES } from './traces';

describe('event loop traces', () => {
  it('every hand-authored trace is structurally valid', () => {
    for (const sample of TRACES) {
      expect(validateSample(sample)).toEqual([]);
    }
  });
  it('every trace ends with an empty machine (no leftover queue items)', () => {
    for (const sample of TRACES) {
      const last = sample.steps[sample.steps.length - 1].state;
      expect(last.callStack).toEqual([]);
      expect(last.microtasks).toEqual([]);
      expect(last.macrotasks).toEqual([]);
      expect(last.webApis).toEqual([]);
    }
  });
});
