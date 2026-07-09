import { loadProgress, saveKey, countWithPrefix, PROGRESS_EVENT } from '../widgets/roadmap/storage';
import { loadPredictions, savePrediction } from './predict-store';

function syncCheckboxStates() {
  const saved = loadProgress();
  document.querySelectorAll<HTMLInputElement>('input.progress-check[data-progress-key]').forEach((box) => {
    const key = box.dataset.progressKey!;
    box.checked = key in saved;
    box.closest('li')?.classList.toggle('task-done', box.checked);
  });
}

function bindChecklists() {
  document.querySelectorAll<HTMLInputElement>('input.progress-check[data-progress-key]').forEach((box) => {
    box.addEventListener('change', () => {
      saveKey(box.dataset.progressKey!, box.checked);
      box.closest('li')?.classList.toggle('task-done', box.checked);
    });
  });
}

/** Fills ring/label elements annotated at build time:
 * data-progress-ring + data-progress-prefix + data-progress-total */
function paintProgress() {
  document.querySelectorAll<HTMLElement>('[data-progress-ring]').forEach((el) => {
    const prefix = el.dataset.progressPrefix ?? '';
    const total = Number(el.dataset.progressTotal ?? '0');
    const done = prefix === ''
      ? Object.keys(loadProgress()).filter((k) => /^\d{2}-/.test(k)).length
      : countWithPrefix(prefix);
    const pct = total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0;
    const circle = el.querySelector<SVGCircleElement>('circle[data-ring-fill]');
    if (circle) {
      const r = circle.r.baseVal.value;
      const c = 2 * Math.PI * r;
      circle.style.strokeDasharray = `${c}`;
      circle.style.strokeDashoffset = `${c * (1 - pct / 100)}`;
    }
    const label = el.querySelector('[data-ring-label]');
    if (label) label.textContent = `${pct}%`;
  });
}

/** Commit-first gate on tricky-output reveals: the summary won't open until a
 * prediction is locked; locked predictions render beside the answer. */
function bindPredicts() {
  const saved = loadPredictions();
  document.querySelectorAll<HTMLElement>('details[data-predict-key]').forEach((details) => {
    if (details.dataset.predictBound === '1') return; // idempotent across pageshow
    details.dataset.predictBound = '1';
    const key = details.dataset.predictKey!;
    const commit = document.querySelector<HTMLElement>(`.predict-commit[data-predict-for="${key}"]`);
    const input = commit?.querySelector<HTMLTextAreaElement>('.predict-input');
    const lock = commit?.querySelector<HTMLButtonElement>('.predict-lock');
    const yours = details.querySelector<HTMLElement>('.predict-yours');
    const compare = details.querySelector<HTMLElement>('.predict-compare');

    const markCommitted = (text: string) => {
      commit?.classList.add('is-committed');
      if (input) {
        input.value = text;
        input.readOnly = true;
      }
      if (lock) lock.textContent = 'Locked ✓';
      if (yours) yours.textContent = `You said: ${text}`;
      if (compare) compare.hidden = false;
    };

    const pulse = () => {
      if (!commit) return;
      commit.classList.remove('pulse');
      void commit.offsetWidth; // restart the animation
      commit.classList.add('pulse');
      input?.focus();
    };

    const existing = saved[key];
    if (existing) markCommitted(existing.text);

    details.querySelector('summary')?.addEventListener('click', (e) => {
      if (!commit || commit.classList.contains('is-committed')) return;
      e.preventDefault();
      pulse();
    });

    lock?.addEventListener('click', () => {
      if (commit?.classList.contains('is-committed')) return;
      const text = input?.value.trim() ?? '';
      if (!text) {
        pulse();
        return;
      }
      savePrediction(key, text);
      markCommitted(text);
    });
  });
}

syncCheckboxStates();
bindChecklists();
paintProgress();
bindPredicts();
document.addEventListener(PROGRESS_EVENT, paintProgress);
window.addEventListener('pageshow', (e) => {
  if ((e as PageTransitionEvent).persisted) {
    syncCheckboxStates();
    paintProgress();
    bindPredicts();
  }
});
