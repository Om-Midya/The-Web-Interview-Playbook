import { describe, it, expect } from 'vitest';
import { transition, handlersFor } from './machine';

describe('transition', () => {
  it('pending resolves to fulfilled', () => {
    expect(transition('pending', 'resolve')).toBe('fulfilled');
  });
  it('pending rejects to rejected', () => {
    expect(transition('pending', 'reject')).toBe('rejected');
  });
  it('settled promises are immutable — resolve after reject is ignored', () => {
    expect(transition('rejected', 'resolve')).toBe('rejected');
    expect(transition('fulfilled', 'reject')).toBe('fulfilled');
  });
  it('reset returns to pending from any state', () => {
    expect(transition('fulfilled', 'reset')).toBe('pending');
    expect(transition('rejected', 'reset')).toBe('pending');
  });
});

describe('handlersFor', () => {
  it('nothing runs while pending', () => {
    expect(handlersFor('pending')).toEqual({ then: false, catch: false, finally: false });
  });
  it('then + finally run on fulfilled', () => {
    expect(handlersFor('fulfilled')).toEqual({ then: true, catch: false, finally: true });
  });
  it('catch + finally run on rejected', () => {
    expect(handlersFor('rejected')).toEqual({ then: false, catch: true, finally: true });
  });
});
