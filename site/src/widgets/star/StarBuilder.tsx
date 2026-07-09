import { useEffect, useRef, useState } from 'react';
import type { BehavioralQuestion } from '../../lib/prep';
import {
  STAR_PARTS, coverage, exportStory, loadStories, newId, saveStories, wordCount,
  type Story, type StarPartKey,
} from './star';

function blankStory(): Story {
  return { id: newId(), title: '', s: '', t: '', a: '', r: '', questions: [], updatedAt: Date.now() };
}

export default function StarBuilder({ questions }: { questions: BehavioralQuestion[] }) {
  const [stories, setStories] = useState<Story[]>(() => {
    const loaded = loadStories();
    return loaded.length > 0 ? loaded : [blankStory()];
  });
  const [activeId, setActiveId] = useState(() => stories[0]?.id ?? '');
  const [timerPart, setTimerPart] = useState<number | null>(null); // index into STAR_PARTS
  const [timerLeft, setTimerLeft] = useState(0);
  const [copied, setCopied] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const active = stories.find((s) => s.id === activeId) ?? stories[0];
  const cov = coverage(stories, questions);

  // Debounced autosave; cleanup FLUSHES a pending save (user data must not drop)
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveStories(stories), 400);
    return () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
        saveStories(stories);
      }
    };
  }, [stories]);

  // Practice timer: steps through parts on their budgets
  useEffect(() => {
    if (timerPart === null) return;
    const t = setInterval(() => {
      setTimerLeft((left) => {
        if (left > 1) return left - 1;
        setTimerPart((part) => {
          if (part === null || part >= STAR_PARTS.length - 1) return null;
          setTimerLeft(STAR_PARTS[part + 1].seconds);
          return part + 1;
        });
        return 0;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [timerPart]);

  function update(patch: Partial<Story>) {
    setStories((prev) => prev.map((s) => (s.id === active.id ? { ...s, ...patch, updatedAt: Date.now() } : s)));
  }

  function addStory() {
    const s = blankStory();
    setStories((prev) => [...prev, s]);
    setActiveId(s.id);
  }

  function deleteActive() {
    if (!window.confirm(`Delete "${active.title || 'Untitled story'}"?`)) return;
    setStories((prev) => {
      const next = prev.filter((s) => s.id !== active.id);
      const fallback = next.length > 0 ? next : [blankStory()];
      setActiveId(fallback[0].id);
      return fallback;
    });
  }

  function toggleQuestion(n: number) {
    const qs = active.questions.includes(n)
      ? active.questions.filter((q) => q !== n)
      : [...active.questions, n].sort((a, b) => a - b);
    update({ questions: qs });
  }

  async function copyExport() {
    try {
      await navigator.clipboard.writeText(exportStory(active, questions));
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  function downloadExport() {
    const blob = new Blob([exportStory(active, questions)], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(active.title || 'star-story').replace(/\W+/g, '-').toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const uncoveredTexts = questions.filter((q) => cov.uncovered.includes(q.n)).map((q) => q.text);

  return (
    <div className="star-grid">
      <div className="star-list" aria-label="Story bank">
        {stories.map((s) => (
          <button
            key={s.id}
            className={`star-item${s.id === active.id ? ' is-active' : ''}`}
            onClick={() => setActiveId(s.id)}
          >
            {s.title || 'Untitled story'}
          </button>
        ))}
        <div className="sim-actions">
          <button onClick={addStory}>+ New story</button>
        </div>
        <p className="star-coverage">
          Your {stories.length} {stories.length === 1 ? 'story covers' : 'stories cover'}{' '}
          <strong>{cov.covered.length}</strong> of {questions.length} questions
        </p>
        {uncoveredTexts.length > 0 && (
          <p className="star-uncovered">Uncovered: {uncoveredTexts.join(' · ')}</p>
        )}
      </div>
      <div>
        <input
          className="star-input"
          aria-label="Story title"
          placeholder="Story title — e.g. The midnight deploy that broke checkout"
          value={active.title}
          onChange={(e) => update({ title: e.target.value })}
        />
        {STAR_PARTS.map((p, i) => {
          const words = wordCount(active[p.key]);
          const over = words > p.targetWords * 1.5;
          return (
            <div key={p.key} className={`star-part${timerPart === i ? ' is-timing' : ''}`}>
              <div className="star-part-label">
                <span>{p.label} · {p.seconds}s · target ~{p.targetWords} words</span>
                <span className={over ? 'is-over' : ''}>
                  {words} words{timerPart === i ? ` · ${timerLeft}s` : ''}
                </span>
              </div>
              <textarea
                className="star-textarea"
                aria-label={p.label}
                value={active[p.key]}
                onChange={(e) => update({ [p.key]: e.target.value } as Partial<Story>)}
              />
            </div>
          );
        })}
        <div className="star-qmap" aria-label="Questions this story answers">
          {questions.map((q) => (
            <label key={q.n} className="star-q">
              <input
                type="checkbox"
                checked={active.questions.includes(q.n)}
                onChange={() => toggleQuestion(q.n)}
              />
              {q.text}
            </label>
          ))}
        </div>
        <div className="sim-actions">
          <button
            className="is-primary"
            onClick={() => {
              setTimerPart(0);
              setTimerLeft(STAR_PARTS[0].seconds);
            }}
            disabled={timerPart !== null}
          >
            ▶ Rehearse (75s)
          </button>
          {timerPart !== null && <button onClick={() => setTimerPart(null)}>■ Stop</button>}
          <button onClick={copyExport}>{copied ? 'Copied ✓' : 'Copy as text'}</button>
          <button onClick={downloadExport}>Download .txt</button>
          <button onClick={deleteActive}>Delete story</button>
        </div>
        <p className="sim-note">
          Action carries the answer — 40 of your 75 seconds. If your Action box isn't the longest, the story is out of balance.
        </p>
      </div>
    </div>
  );
}
