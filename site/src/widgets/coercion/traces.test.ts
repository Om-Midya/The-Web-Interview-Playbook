import { describe, it, expect } from 'vitest';
import { validateSample } from '../lib/stepper';
import { COERCION_TRACES } from './traces';

describe('coercion traces', () => {
  it('every trace is structurally valid', () => {
    for (const s of COERCION_TRACES) expect(validateSample(s)).toEqual([]);
  });
  it('every rewrite step names the rule it applied', () => {
    for (const s of COERCION_TRACES) {
      for (const step of s.steps) {
        if (step.state.history.length > 1) {
          expect(step.state.rule, `${s.id}: "${step.state.expr}"`).toBeTruthy();
        }
      }
    }
  });
  it('the current expression is always the last history entry', () => {
    for (const s of COERCION_TRACES) {
      for (const step of s.steps) {
        expect(step.state.history[step.state.history.length - 1]).toBe(step.state.expr);
      }
    }
  });
  it('every trace ends with a verdict', () => {
    for (const s of COERCION_TRACES) {
      expect(s.steps[s.steps.length - 1].state.verdict, s.id).not.toBeNull();
    }
  });
  it('teaches the right answers', () => {
    const final = (id: string) => {
      const s = COERCION_TRACES.find((t) => t.id === id)!;
      return s.steps[s.steps.length - 1].state.verdict;
    };
    expect(final('truthiness-trap')).toBe('true');
    expect(final('plus-minus')).toBe('2');
    expect(final('null-family')).toBe('true');
    expect(final('object-plus')).toBe("'[object Object]'");
  });
});
