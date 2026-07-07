import { describe, it, expect } from 'vitest';
import { effectStep } from './effect';

const kinds = (r: { events: { kind: string }[] }) => r.events.map((e) => e.kind);

describe('effectStep', () => {
  it('mount always renders then runs the effect', () => {
    expect(kinds(effectStep('empty', 'mount', false))).toEqual(['render', 'effect']);
  });
  it('empty deps: updates render but skip the effect', () => {
    expect(kinds(effectStep('empty', 'setCount', true))).toEqual(['render', 'skip']);
  });
  it('[count] deps: setCount cleans up then re-runs; setOther skips', () => {
    expect(kinds(effectStep('count', 'setCount', true))).toEqual(['render', 'cleanup', 'effect']);
    expect(kinds(effectStep('count', 'setOther', true))).toEqual(['render', 'skip']);
  });
  it('no deps array: every update cleans up and re-runs', () => {
    expect(kinds(effectStep('none', 'setOther', true))).toEqual(['render', 'cleanup', 'effect']);
  });
  it('unmount runs cleanup only', () => {
    const r = effectStep('count', 'unmount', true);
    expect(kinds(r)).toEqual(['cleanup']);
    expect(r.mounted).toBe(false);
  });
  it('actions on an unmounted component do nothing', () => {
    expect(effectStep('count', 'setCount', false).events).toEqual([]);
  });
});
