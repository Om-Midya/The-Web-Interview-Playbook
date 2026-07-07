import { describe, it, expect } from 'vitest';
import { specificity, compareSpec } from './specificity';

describe('specificity', () => {
  it('counts ids, classes, elements', () => {
    expect(specificity('#nav .item')).toEqual([1, 1, 0]);
    expect(specificity('div ul li.active')).toEqual([0, 1, 3]);
  });
  it('counts attributes and pseudo-classes as class-level', () => {
    expect(specificity('input[type="text"]:focus')).toEqual([0, 2, 1]);
  });
  it('counts pseudo-elements as element-level', () => {
    expect(specificity('a:hover::before')).toEqual([0, 1, 2]);
  });
  it(':not() wrapper is zero but its argument counts; * is zero', () => {
    expect(specificity(':not(.foo) p')).toEqual([0, 1, 1]);
    expect(specificity('*')).toEqual([0, 0, 0]);
  });
  it(':where() and its contents are zero', () => {
    expect(specificity(':where(#a .b) span')).toEqual([0, 0, 1]);
  });
  it('functional pseudo-class arguments do not leak into element count', () => {
    expect(specificity('li:nth-child(2n+1)')).toEqual([0, 1, 1]);
    expect(specificity('li:nth-child(odd)')).toEqual([0, 1, 1]);
  });
  it('# inside attribute values is not an ID', () => {
    expect(specificity('a[href="#top"]')).toEqual([0, 1, 1]);
  });
  it('comma lists score as their highest selector', () => {
    expect(specificity('h1, h2')).toEqual([0, 0, 1]);
    expect(specificity('.title, h1')).toEqual([0, 1, 0]);
  });
  it('leading underscore/hyphen class names count', () => {
    expect(specificity('._private')).toEqual([0, 1, 0]);
  });
});

describe('compareSpec', () => {
  it('compares lexicographically', () => {
    expect(compareSpec([1, 0, 0], [0, 9, 9])).toBe(1);
    expect(compareSpec([0, 1, 0], [0, 1, 1])).toBe(-1);
    expect(compareSpec([0, 1, 1], [0, 1, 1])).toBe(0);
  });
});
