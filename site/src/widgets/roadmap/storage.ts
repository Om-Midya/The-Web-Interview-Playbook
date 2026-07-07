const KEY = 'playbook-progress-v1';
export const PROGRESS_EVENT = 'playbook:progress-changed';

export function loadProgress(): Record<string, true> {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

export function saveKey(key: string, on: boolean): void {
  try {
    const all = loadProgress();
    if (on) all[key] = true;
    else delete all[key];
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* storage unavailable: interaction still works, just not persisted */
  }
  document.dispatchEvent(new CustomEvent(PROGRESS_EVENT));
}

export function countWithPrefix(prefix: string): number {
  return Object.keys(loadProgress()).filter((k) => k.startsWith(prefix)).length;
}

export function replaceAll(next: Record<string, true>): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
  document.dispatchEvent(new CustomEvent(PROGRESS_EVENT));
}
