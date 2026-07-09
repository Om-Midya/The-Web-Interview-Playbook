import { useEffect, useState } from 'react';
import type { MockKit, RubricDimension } from '../../lib/prep';
import {
  loadAttempts, newAttemptId, radarPoints, saveAttempts, totalScore, verdictFor,
  type Attempt,
} from './mock';

type Mode = 'pick' | 'run' | 'score';

function fmt(seconds: number): string {
  const sign = seconds < 0 ? '−' : '';
  const s = Math.abs(seconds);
  return `${sign}${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export default function MockSimulator({ kits, rubric }: { kits: MockKit[]; rubric: RubricDimension[] }) {
  const [mode, setMode] = useState<Mode>('pick');
  const [slug, setSlug] = useState<string>('');
  const [sectionIdx, setSectionIdx] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const [flash, setFlash] = useState(false);
  const [scores, setScores] = useState<Record<number, number>>({});
  const [attempts, setAttempts] = useState<Attempt[]>(() => loadAttempts());

  const kit = kits.find((k) => k.slug === slug) ?? null;
  const section = kit?.sections[sectionIdx] ?? null;

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setRemaining((r) => r - 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  // Auto-advance when a section hits zero (last section keeps counting into
  // negative — overrun). Flash reset lives in its own effect: this effect's
  // deps change on advance, so a cleanup here would cancel the flash-off timer.
  useEffect(() => {
    if (!running || remaining !== 0 || !kit) return;
    setFlash(true);
    if (sectionIdx < kit.sections.length - 1) {
      setSectionIdx(sectionIdx + 1);
      setRemaining(kit.sections[sectionIdx + 1].minutes * 60);
    }
  }, [remaining, running, kit, sectionIdx]);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(false), 700);
    return () => clearTimeout(t);
  }, [flash]);

  function startRound(s: string) {
    const k = kits.find((x) => x.slug === s);
    if (!k) return;
    setSlug(s);
    setSectionIdx(0);
    setRemaining(k.sections[0].minutes * 60);
    setRunning(true);
    setMode('run');
  }

  function nextSection() {
    if (!kit) return;
    if (sectionIdx >= kit.sections.length - 1) {
      finishRound();
      return;
    }
    setSectionIdx(sectionIdx + 1);
    setRemaining(kit.sections[sectionIdx + 1].minutes * 60);
  }

  function finishRound() {
    setRunning(false);
    setScores({});
    setMode('score');
  }

  function saveAttempt() {
    const a: Attempt = {
      id: newAttemptId(),
      roundSlug: slug,
      date: Date.now(),
      scores,
      total: totalScore(scores),
    };
    const next = [a, ...attempts];
    setAttempts(next);
    saveAttempts(next);
    setMode('pick');
  }

  function deleteAttempt(id: string) {
    const next = attempts.filter((a) => a.id !== id);
    setAttempts(next);
    saveAttempts(next);
  }

  const scored = rubric.filter((d) => scores[d.n] !== undefined);
  const radar = radarPoints(rubric.map((d) => scores[d.n] ?? 0), 5, 100, 100, 80);
  const gridOuter = radarPoints(rubric.map(() => 5), 5, 100, 100, 80);
  const gridMid = radarPoints(rubric.map(() => 3), 5, 100, 100, 80);

  if (mode === 'run' && kit && section) {
    const totalSecs = section.minutes * 60;
    const pct = Math.max(0, Math.min(100, ((totalSecs - Math.max(0, remaining)) / totalSecs) * 100));
    return (
      <div className={flash ? 'mock-section-flash' : ''}>
        <p className="sim-summary">
          {kit.title} — section {section.n} of {kit.sections.length}
        </p>
        <h2>{section.title}</h2>
        <div className={`mock-timer${remaining < 0 ? ' is-over' : ''}`} aria-live="off">
          {fmt(remaining)}
        </div>
        <div className="mock-bar"><div className="mock-bar-fill" style={{ width: `${pct}%` }} /></div>
        <div className="sim-actions">
          <button className="is-primary" onClick={() => setRunning((r) => !r)}>
            {running ? '⏸ Pause' : '▶ Resume'}
          </button>
          <button onClick={nextSection}>Next section →</button>
          <button onClick={finishRound}>Finish & score</button>
          <a href={`/10-mock-interview-kits/${slug}/`} target="_blank" rel="noopener">
            Open the script ↗
          </a>
        </div>
        {remaining < 0 && (
          <p className="sim-note">You're over time — interviewers let you overrun; the clock doesn't lie.</p>
        )}
      </div>
    );
  }

  if (mode === 'score' && kit) {
    return (
      <div>
        <h2>Score yourself — {kit.title}</h2>
        {rubric.map((d) => (
          <div key={d.n} className="mock-score-row">
            <span className="name">{d.n}. {d.name}</span>
            {[1, 2, 3, 4, 5].map((v) => (
              <button
                key={v}
                aria-pressed={scores[d.n] === v}
                className={scores[d.n] === v ? 'is-active' : ''}
                onClick={() => setScores((s) => ({ ...s, [d.n]: v }))}
              >
                {v}
              </button>
            ))}
          </div>
        ))}
        <div className="sim-readout">
          <span>total <strong>{totalScore(scores)}</strong> / {rubric.length * 5}</span>
          <span>{verdictFor(totalScore(scores), scored.length)}</span>
        </div>
        <svg className="radar-svg" viewBox="0 0 200 200" role="img" aria-label="Score radar chart">
          <polygon className="radar-grid" points={gridOuter} />
          <polygon className="radar-grid" points={gridMid} />
          {radar && <polygon className="radar-poly" points={radar} />}
        </svg>
        <div className="sim-actions">
          <button className="is-primary" onClick={saveAttempt} disabled={scored.length === 0}>
            Save attempt
          </button>
          <button onClick={() => setMode('pick')}>Discard</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mock-rounds">
        {kits.map((k) => (
          <button key={k.slug} className="mock-round" onClick={() => startRound(k.slug)}>
            <h3>{k.title}</h3>
            <span className="meta">{k.sections.length} sections · {k.totalMinutes} min</span>
          </button>
        ))}
      </div>
      {attempts.length > 0 && (
        <>
          <h2>Past attempts</h2>
          <div className="mock-history">
            {attempts.map((a) => (
              <div key={a.id} className="mock-attempt">
                <span>{kits.find((k) => k.slug === a.roundSlug)?.title ?? a.roundSlug}</span>
                <span>{new Date(a.date).toLocaleDateString()}</span>
                <span>score {a.total} / {rubric.length * 5}</span>
                <button onClick={() => deleteAttempt(a.id)} aria-label="Delete attempt">✕</button>
              </div>
            ))}
          </div>
        </>
      )}
      <p className="sim-note">
        The scripts live in the round docs — the simulator keeps time and score. Run the same round
        weekly and watch the radar grow.
      </p>
    </div>
  );
}
