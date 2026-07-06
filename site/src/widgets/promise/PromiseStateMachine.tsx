import { useEffect, useRef, useState } from 'react';
import { transition, handlersFor, type PromiseNodeState, type PromiseAction } from './machine';
import { maybeAnimate } from '../lib/motion';

export default function PromiseStateMachine() {
  const [state, setState] = useState<PromiseNodeState>('pending');
  const [attemptedAfterSettle, setAttemptedAfterSettle] = useState(false);
  const diagramRef = useRef<HTMLDivElement>(null);

  function act(action: PromiseAction) {
    const next = transition(state, action);
    // transition() returns `current` unchanged for any resolve/reject on a settled promise, so next === state reliably means "attempted mutation was ignored".
    setAttemptedAfterSettle(action !== 'reset' && next === state && state !== 'pending');
    setState(next);
  }

  useEffect(() => {
    const current = diagramRef.current?.querySelector('.pm-node.is-current');
    if (current) maybeAnimate(current, { scale: [1, 1.08, 1], duration: 420 });
  }, [state]);

  const handlers = handlersFor(state);

  return (
    <div>
      <div className="pm-diagram" ref={diagramRef}>
        <div className={`pm-node${state === 'pending' ? ' is-current' : ''}`}>pending</div>
        <div className="pm-outcomes">
          <div className={`pm-node is-fulfilled${state === 'fulfilled' ? ' is-current' : ''}`}>
            fulfilled ✓
          </div>
          <div className={`pm-node is-rejected${state === 'rejected' ? ' is-current' : ''}`}>
            rejected ✗
          </div>
        </div>
      </div>
      <div className="pm-handlers" aria-label="Which handlers run">
        <span className={`pm-handler${handlers.then ? ' did-run' : ''}`}>.then(onFulfilled)</span>
        <span className={`pm-handler${handlers.catch ? ' did-run' : ''}`}>.catch(onRejected)</span>
        <span className={`pm-handler${handlers.finally ? ' did-run' : ''}`}>.finally(cleanup)</span>
      </div>
      <div className="pm-actions">
        <button className="is-primary" onClick={() => act('resolve')}>resolve(value)</button>
        <button onClick={() => act('reject')}>reject(error)</button>
        <button onClick={() => act('reset')}>new Promise()</button>
      </div>
      {attemptedAfterSettle && (
        <p className="pm-lock-note" role="status">
          Nothing happened — a settled promise is locked. resolve/reject after settling are silently ignored.
        </p>
      )}
    </div>
  );
}
