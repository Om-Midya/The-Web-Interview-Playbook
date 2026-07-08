import { describe, it, expect } from 'vitest';
import { lerpPoint } from './topo-svg';

describe('lerpPoint', () => {
  it('interpolates linearly between two points', () => {
    expect(lerpPoint({ x: 0, y: 0 }, { x: 10, y: 20 }, 0.5)).toEqual({ x: 5, y: 10 });
    expect(lerpPoint({ x: 0, y: 0 }, { x: 10, y: 20 }, 0)).toEqual({ x: 0, y: 0 });
    expect(lerpPoint({ x: 0, y: 0 }, { x: 10, y: 20 }, 1)).toEqual({ x: 10, y: 20 });
  });
  it('clamps t outside [0, 1]', () => {
    expect(lerpPoint({ x: 0, y: 0 }, { x: 10, y: 20 }, -1)).toEqual({ x: 0, y: 0 });
    expect(lerpPoint({ x: 0, y: 0 }, { x: 10, y: 20 }, 2)).toEqual({ x: 10, y: 20 });
  });
});
