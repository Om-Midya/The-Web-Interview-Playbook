import { useEffect, useRef, useState, type ReactNode } from 'react';
import { clampStep, type StepperSample } from '../lib/stepper';
import { maybeAnimate } from '../lib/motion';

interface StepperProps<S> {
  samples: StepperSample<S>[];
  renderState: (state: S) => ReactNode;
  autoPlayMs?: number;
}

export default function Stepper<S>({ samples, renderState, autoPlayMs = 1400 }: StepperProps<S>) {
  const [sampleIndex, setSampleIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const stateRef = useRef<HTMLDivElement>(null);

  const sample = samples[sampleIndex];
  const total = sample?.steps.length ?? 0;
  const step = sample?.steps[clampStep(stepIndex, total)];
  const lines = sample?.code.split('\n') ?? [];
  const atEnd = stepIndex >= total - 1;

  function goTo(i: number) {
    setStepIndex(clampStep(i, total));
  }
  function selectSample(i: number) {
    setSampleIndex(i);
    setStepIndex(0);
    setPlaying(false);
  }

  useEffect(() => {
    if (!playing) return;
    if (atEnd) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setStepIndex((i) => clampStep(i + 1, total)), autoPlayMs);
    return () => clearTimeout(t);
  }, [playing, stepIndex, atEnd, total, autoPlayMs]);

  useEffect(() => {
    if (stateRef.current) {
      maybeAnimate(stateRef.current, { opacity: [0.55, 1], duration: 320 });
    }
  }, [stepIndex, sampleIndex]);

  if (!sample || sample.steps.length === 0) return null;

  return (
    <div>
      {samples.length > 1 && (
        <div className="stepper-tabs" aria-label="Code samples">
          {samples.map((s, i) => (
            <button
              key={s.id}
              aria-pressed={i === sampleIndex}
              className={i === sampleIndex ? 'is-active' : ''}
              onClick={() => selectSample(i)}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
      <div className="stepper">
        <pre className="stepper-code" aria-label="Code being executed">
          {lines.map((text, i) => (
            <code
              key={i}
              className={`stepper-code-line${step.line === i + 1 ? ' is-active' : ''}`}
            >
              {text || ' '}
            </code>
          ))}
        </pre>
        <div ref={stateRef}>{renderState(step.state)}</div>
      </div>
      <p className="stepper-note" aria-live="polite">{step.note}</p>
      <div className="stepper-controls">
        <button onClick={() => goTo(0)} disabled={stepIndex === 0} aria-label="Restart">
          ⏮
        </button>
        <button onClick={() => goTo(stepIndex - 1)} disabled={stepIndex === 0}>
          ← Prev
        </button>
        <button className="is-primary" onClick={() => goTo(stepIndex + 1)} disabled={atEnd}>
          Next →
        </button>
        <button onClick={() => setPlaying((p) => !p)} disabled={atEnd}>
          {playing ? '⏸ Pause' : '▶ Play'}
        </button>
        <span className="stepper-progress">
          {clampStep(stepIndex, total) + 1} / {total}
        </span>
      </div>
    </div>
  );
}
