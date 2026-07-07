import { describe, it, expect } from 'vitest';
import { validateSample } from '../lib/stepper';
import { CLOSURE_TRACES } from './traces';

describe('closure traces', () => {
  it('every trace is structurally valid', () => {
    for (const s of CLOSURE_TRACES) expect(validateSample(s)).toEqual([]);
  });
  it('every ref and parent link points at a frame that exists in that step', () => {
    for (const s of CLOSURE_TRACES) {
      for (const step of s.steps) {
        const ids = new Set(step.state.frames.map((f) => f.id));
        for (const f of step.state.frames) {
          if (f.parentId !== null) expect(ids.has(f.parentId), `${s.id}: ${f.id} parent`).toBe(true);
        }
        for (const r of step.state.refs) {
          expect(ids.has(r.toFrameId), `${s.id}: ref "${r.from}"`).toBe(true);
        }
      }
    }
  });
  it('every sample shows at least one environment kept alive by a closure', () => {
    for (const s of CLOSURE_TRACES) {
      const anyRetained = s.steps.some((st) => st.state.frames.some((f) => f.status === 'retained'));
      expect(anyRetained, s.id).toBe(true);
    }
  });
  it('the loop traces teach the right outputs', () => {
    const byId = (id: string) => CLOSURE_TRACES.find((t) => t.id === id)!;
    const finalOut = (id: string) => byId(id).steps[byId(id).steps.length - 1].state.output;
    expect(finalOut('var-loop')).toEqual(['3', '3', '3']);
    expect(finalOut('let-loop')).toEqual(['0', '1', '2']);
  });
  it('two independent counters end at 1, 2, 1', () => {
    const s = CLOSURE_TRACES.find((t) => t.id === 'two-counters')!;
    expect(s.steps[s.steps.length - 1].state.output).toEqual(['1', '2', '1']);
  });
});
