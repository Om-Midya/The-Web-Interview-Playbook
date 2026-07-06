export type PromiseNodeState = 'pending' | 'fulfilled' | 'rejected';
export type PromiseAction = 'resolve' | 'reject' | 'reset';

/** Core lesson: a settled promise never changes state again. */
export function transition(current: PromiseNodeState, action: PromiseAction): PromiseNodeState {
  if (action === 'reset') return 'pending';
  if (current !== 'pending') return current;
  return action === 'resolve' ? 'fulfilled' : 'rejected';
}

export function handlersFor(state: PromiseNodeState): { then: boolean; catch: boolean; finally: boolean } {
  return {
    then: state === 'fulfilled',
    catch: state === 'rejected',
    finally: state !== 'pending',
  };
}
