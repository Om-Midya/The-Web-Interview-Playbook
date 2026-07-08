import { useMemo, useState } from 'react';
import Simulation from '../engine/Simulation';
import { OptionRow, Slider } from '../engine/PlaygroundFrame';
import { RACE_SPEC, raceSnapshots, startRace, type RaceParams, type RaceState, type RaceUser } from './race';

const PHASES = ['read', 'validate', 'write', 'commit'] as const;

function chipClass(user: RaceUser, phase: string): string {
  if (user.phase === phase) return 'race-chip is-current';
  if (user.phase === 'confirmed') return 'race-chip is-done';
  if (user.phase === 'rejected' && phase === 'validate') return 'race-chip is-rejected';
  const order = ['waiting', 'blocked', 'read', 'validate', 'write', 'commit'];
  const past = order.indexOf(user.phase) > order.indexOf(phase) || user.phase === 'confirmed';
  return past ? 'race-chip is-done' : 'race-chip';
}

export default function DoubleBookingRace() {
  const [lock, setLock] = useState<string>('off');
  const [staggerMs, setStaggerMs] = useState(80);
  const params: RaceParams = { lock: lock === 'on', staggerMs };
  const snapshots = useMemo(() => raceSnapshots(params), [lock, staggerMs]);

  return (
    <div>
      <div className="playground-controls">
        <OptionRow label="row lock (SELECT … FOR UPDATE)" options={['off', 'on']} value={lock} onChange={setLock} />
        <Slider label="B starts after" min={0} max={1000} value={staggerMs} onChange={setStaggerMs} unit="ms" />
      </div>
      <Simulation
        spec={RACE_SPEC}
        params={params}
        snapshots={snapshots}
        ariaLabel="Double booking race simulation"
        render={(s: RaceState, api) => {
          const done = s.users.every((u) => u.phase === 'confirmed' || u.phase === 'rejected');
          return (
            <div className="sim">
              {!api.snapshot && (
                <div className="sim-actions">
                  <button
                    className="is-primary"
                    onClick={() => {
                      api.dispatch(startRace);
                      api.play();
                    }}
                  >
                    ▶ Run the race
                  </button>
                </div>
              )}
              <div className="race-lanes">
                {(['A', 'B'] as const).map((name, u) => (
                  <div className="race-lane" key={name}>
                    <span className="race-user">User {name}</span>
                    {s.users[u].phase === 'blocked' && <span className="race-chip is-blocked">blocked 🔒</span>}
                    {PHASES.map((ph) => (
                      <span key={ph} className={chipClass(s.users[u], ph)}>{ph}</span>
                    ))}
                    {s.users[u].phase === 'confirmed' && <span className="race-chip is-done">confirmed ✓</span>}
                    {s.users[u].phase === 'rejected' && <span className="race-chip is-rejected">409</span>}
                  </div>
                ))}
              </div>
              <div>
                <span className={`race-stock${s.stock < 0 ? ' is-oversold' : ''}`}>
                  stock: {s.stock}{s.lockHolder !== null && params.lock ? ` · 🔒 ${'AB'[s.lockHolder]}` : ''}
                </span>
              </div>
              <div className="el-console" aria-label="Transaction log">
                {s.log.map((line, i) => (
                  <div className="el-console-line" key={i}>{line}</div>
                ))}
              </div>
              {done && (
                <p className="sim-note">
                  {s.stock < 0
                    ? 'Both transactions read stock = 1 before either wrote. Read-modify-write without a lock is a race — the seat sold twice.'
                    : 'The row lock serialized the two transactions: the second one saw the real stock and failed cleanly with a 409.'}
                </p>
              )}
            </div>
          );
        }}
      />
    </div>
  );
}
