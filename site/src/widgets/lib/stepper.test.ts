import { describe, it, expect } from 'vitest';
import { clampStep, validateSample, type StepperSample } from './stepper';

describe('clampStep', () => {
  it('clamps below zero to zero', () => {
    expect(clampStep(-2, 5)).toBe(0);
  });
  it('clamps past the end to the last step', () => {
    expect(clampStep(9, 5)).toBe(4);
  });
  it('passes through valid indices', () => {
    expect(clampStep(3, 5)).toBe(3);
  });
});

describe('validateSample', () => {
  const base: StepperSample<{ n: number }> = {
    id: 's',
    label: 'S',
    code: 'line one\nline two',
    steps: [{ line: 1, note: 'start', state: { n: 0 } }],
  };
  it('accepts a valid sample', () => {
    expect(validateSample(base)).toEqual([]);
  });
  it('rejects empty steps', () => {
    expect(validateSample({ ...base, steps: [] })).toContain('s: no steps');
  });
  it('rejects out-of-range line numbers', () => {
    const bad = { ...base, steps: [{ line: 3, note: 'x', state: { n: 0 } }] };
    expect(validateSample(bad)).toContain('s: step 0 line 3 outside 1..2');
  });
  it('allows null lines', () => {
    const ok = { ...base, steps: [{ line: null, note: 'x', state: { n: 0 } }] };
    expect(validateSample(ok)).toEqual([]);
  });
});
