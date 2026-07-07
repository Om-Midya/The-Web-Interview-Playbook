import { useState } from 'react';
import PlaygroundFrame, { OptionRow } from '../engine/PlaygroundFrame';
import {
  INITIAL_ROSTER,
  explain,
  jsxSnippet,
  moveFirstToEnd,
  removeAt,
  type KeyMode,
  type Person,
} from './keys';

function Row({ person, actualKey }: { person: Person; actualKey: string }) {
  const [done, setDone] = useState(false);
  return (
    <div className={`kr-row${done ? ' is-checked' : ''}`}>
      <span className="kr-key">key={actualKey}</span>
      <span className="kr-name">{person.name}</span>
      <label className="kr-check">
        <input type="checkbox" checked={done} onChange={(e) => setDone(e.target.checked)} />
        warmed up
      </label>
    </div>
  );
}

export default function KeysReconciliation() {
  const [roster, setRoster] = useState<Person[]>(INITIAL_ROSTER);
  const [keyMode, setKeyMode] = useState<KeyMode>('index');
  const [generation, setGeneration] = useState(0);
  const [lastAction, setLastAction] = useState<'remove' | 'move' | null>(null);

  const priyaIndex = roster.findIndex((p) => p.id === 'p2');

  function selectMode(mode: string) {
    setKeyMode(mode as KeyMode);
    setRoster(INITIAL_ROSTER);
    setGeneration((g) => g + 1);
    setLastAction(null);
  }

  function reset() {
    setRoster(INITIAL_ROSTER);
    setGeneration((g) => g + 1);
    setLastAction(null);
  }

  return (
    <PlaygroundFrame
      controls={<OptionRow label="key strategy" options={['index', 'id']} value={keyMode} onChange={selectMode} />}
      preview={
        <div>
          <div className="kr-list" key={`${generation}-${keyMode}`}>
            {roster.map((p, i) => (
              <Row
                key={keyMode === 'index' ? i : p.id}
                person={p}
                actualKey={keyMode === 'index' ? String(i) : p.id}
              />
            ))}
          </div>
          <div className="kr-actions">
            <button
              onClick={() => {
                setRoster((r) => removeAt(r, r.findIndex((p) => p.id === 'p2')));
                setLastAction('remove');
              }}
              disabled={priyaIndex < 0}
            >
              Remove Priya
            </button>
            <button
              onClick={() => {
                setRoster((r) => moveFirstToEnd(r));
                setLastAction('move');
              }}
              disabled={roster.length < 2}
            >
              Move first to end
            </button>
            <button onClick={reset}>Reset</button>
          </div>
          <p className="kr-note" aria-live="polite">{explain(keyMode, lastAction)}</p>
        </div>
      }
      css={jsxSnippet(keyMode)}
    />
  );
}
