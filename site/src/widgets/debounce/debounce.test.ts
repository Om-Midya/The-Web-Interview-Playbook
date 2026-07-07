import { describe, it, expect } from 'vitest';
import { runScript, type SimEvent } from '../lib/sim';
import {
  BURST_OFFSETS,
  DEBOUNCE_SPEC,
  addEvent,
  debounceSnapshots,
  scheduleBurst,
  type DebounceParams,
  type DebounceState,
} from './debounce';

const P = (over: Partial<DebounceParams> = {}): DebounceParams => ({
  waitMs: 300,
  debounceMode: 'trailing',
  throttleMode: 'leading',
  ...over,
});
const evAt = (tick: number, p: DebounceParams): SimEvent<DebounceState> => ({
  atTick: tick,
  apply: (s) => addEvent(s, p),
});

describe('debounce semantics', () => {
  it('trailing: burst of events → exactly one fire, waitMs after the last', () => {
    const p = P();
    const s = runScript(DEBOUNCE_SPEC, p, 30, [evAt(0, p), evAt(3, p), evAt(6, p)]);
    expect(s.events).toEqual([0, 48, 96]);
    expect(s.debounceFires).toEqual([396]); // 96 + 300, exact
  });
  it('leading: fires on the first event only; later events just extend the window', () => {
    const p = P({ debounceMode: 'leading' });
    const s = runScript(DEBOUNCE_SPEC, p, 30, [evAt(0, p), evAt(3, p), evAt(6, p)]);
    expect(s.debounceFires).toEqual([0]);
  });
  it('a new event during a pending deadline extends it', () => {
    const p = P();
    const s = runScript(DEBOUNCE_SPEC, p, 40, [evAt(0, p), evAt(16, p)]); // t=0, t=256
    expect(s.debounceFires).toEqual([556]); // 256 + 300 — NOT 300
  });
});

describe('throttle semantics', () => {
  it('leading: fires immediately, swallows in-window events, fires again after', () => {
    const p = P();
    const s = runScript(DEBOUNCE_SPEC, p, 30, [evAt(0, p), evAt(3, p), evAt(6, p), evAt(22, p)]);
    expect(s.throttleFires).toEqual([0, 352]); // window 0–300 swallows 48/96; 352 opens anew
  });
  it('trailing: one fire at window close', () => {
    const p = P({ throttleMode: 'trailing' });
    const s = runScript(DEBOUNCE_SPEC, p, 40, [evAt(0, p), evAt(3, p), evAt(6, p)]);
    expect(s.throttleFires).toEqual([300]); // exact window end
  });
});

describe('scheduled burst', () => {
  it('scheduleBurst feeds all offsets through tick at their exact times', () => {
    const p = P();
    const s = runScript(DEBOUNCE_SPEC, p, 100, [{ atTick: 0, apply: scheduleBurst }]);
    expect(s.events).toEqual(BURST_OFFSETS);
    expect(s.scheduled).toEqual([]);
  });
  it('default-params burst teaches the expected pattern', () => {
    const p = P();
    const s = runScript(DEBOUNCE_SPEC, p, 100, [{ atTick: 0, apply: scheduleBurst }]);
    expect(s.debounceFires).toEqual([748, 1260]);
    expect(s.throttleFires).toEqual([0, 400, 960]);
  });
});

describe('snapshots', () => {
  it('the settled caption embeds the actual computed counts', () => {
    const snaps = debounceSnapshots(P());
    const last = snaps[snaps.length - 1];
    expect(last.caption).toContain('8 keystrokes');
    expect(last.caption).toContain('2 debounced');
    expect(last.caption).toContain('3 throttled');
  });
  it('addEvent stamps the event at the current sim time', () => {
    const p = P();
    const s0 = DEBOUNCE_SPEC.init(p);
    const s1 = addEvent({ ...s0, now: 128 }, p);
    expect(s1.events).toEqual([128]);
  });
});
