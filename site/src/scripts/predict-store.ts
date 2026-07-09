export const PREDICT_KEY = 'playbook-predict-v1';

export interface Prediction {
  text: string;
  at: number;
}

export function loadPredictions(): Record<string, Prediction> {
  try {
    const raw = localStorage.getItem(PREDICT_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

export function savePrediction(key: string, text: string): void {
  try {
    const all = loadPredictions();
    all[key] = { text, at: Date.now() };
    localStorage.setItem(PREDICT_KEY, JSON.stringify(all));
  } catch {
    /* storage unavailable — the gate still works session-side */
  }
}
