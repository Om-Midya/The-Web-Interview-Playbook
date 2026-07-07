import { loadProgress, saveKey, countWithPrefix, PROGRESS_EVENT } from '../widgets/roadmap/storage';

function restoreChecklists() {
  const saved = loadProgress();
  document.querySelectorAll<HTMLInputElement>('input.progress-check[data-progress-key]').forEach((box) => {
    const key = box.dataset.progressKey!;
    box.checked = key in saved;
    box.closest('li')?.classList.toggle('task-done', box.checked);
    box.addEventListener('change', () => {
      saveKey(key, box.checked);
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

restoreChecklists();
paintProgress();
document.addEventListener(PROGRESS_EVENT, paintProgress);
