import { describe, it, expect } from 'vitest';
import { validateSample } from '../lib/stepper';
import { PIPELINE_TRACES, STAGE_NAMES } from './traces';

const byId = (id: string) => PIPELINE_TRACES.find((t) => t.id === id)!;
const final = (id: string) => byId(id).steps[byId(id).steps.length - 1].state;

describe('pipeline traces', () => {
  it('every trace is structurally valid with six stages per step', () => {
    for (const s of PIPELINE_TRACES) {
      expect(validateSample(s)).toEqual([]);
      for (const step of s.steps) expect(step.state.stages).toHaveLength(STAGE_NAMES.length);
    }
  });
  it('no stage is left running or idle at the end of a sample', () => {
    for (const s of PIPELINE_TRACES) {
      for (const st of final(s.id).stages) expect(['done', 'skipped']).toContain(st);
    }
  });
  it('first load runs all six stages', () => {
    expect(final('first-load').stages).toEqual(['done', 'done', 'done', 'done', 'done', 'done']);
    expect(final('first-load').rerun).toBe(6);
  });
  it('width reruns 4 stages including Layout, skipping DOM and Render Tree', () => {
    const f = final('width');
    expect(f.rerun).toBe(4);
    expect(f.stages[0]).toBe('skipped'); // DOM
    expect(f.stages[2]).toBe('skipped'); // Render Tree
    expect(f.stages[3]).toBe('done');    // Layout
  });
  it('transform and opacity run only Style and Composite', () => {
    for (const id of ['transform', 'opacity']) {
      const f = final(id);
      expect(f.rerun).toBe(2);
      expect(f.stages[1]).toBe('done');    // Style always runs
      expect(f.stages[2]).toBe('skipped'); // Render Tree
      expect(f.stages[3]).toBe('skipped'); // Layout
      expect(f.stages[4]).toBe('skipped'); // Paint
      expect(f.stages[5]).toBe('done');    // Composite
    }
  });
});
