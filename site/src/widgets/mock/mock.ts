export interface Attempt {
  id: string;
  roundSlug: string;
  date: number;
  scores: Record<number, number>; // rubric dimension n → 1..5
  total: number;
}

export const MOCKS_KEY = 'playbook-mocks-v1';

export function newAttemptId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `m-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
  }
}

export function totalScore(scores: Record<number, number>): number {
  return Object.values(scores).reduce((a, b) => a + b, 0);
}

/** Bands follow the rubric's 1–5 meanings, scaled by dimension count. */
export function verdictFor(total: number, dims: number): string {
  if (dims === 0) return '';
  const avg = total / dims;
  if (avg >= 4) return 'Strong — clear answers, good tradeoffs, confident live tasks';
  if (avg >= 3) return 'Good — solid junior level, hireable with coaching';
  if (avg >= 2) return 'Below average — drill the follow-up questions';
  return 'Keep drilling — significant gaps to close before a real round';
}

/** SVG polygon points; axis 0 at 12 o'clock, clockwise. Pure trig. */
export function radarPoints(scores: number[], max: number, cx: number, cy: number, r: number): string {
  const n = scores.length;
  if (n === 0 || max <= 0) return '';
  return scores
    .map((s, i) => {
      const angle = -Math.PI / 2 + (2 * Math.PI * i) / n;
      const rad = (Math.max(0, Math.min(max, s)) / max) * r;
      const x = cx + rad * Math.cos(angle);
      const y = cy + rad * Math.sin(angle);
      return `${Math.round(x * 10) / 10},${Math.round(y * 10) / 10}`;
    })
    .join(' ');
}

export function loadAttempts(): Attempt[] {
  try {
    const raw = localStorage.getItem(MOCKS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveAttempts(attempts: Attempt[]): void {
  try {
    localStorage.setItem(MOCKS_KEY, JSON.stringify(attempts));
  } catch {
    /* storage unavailable — session-only */
  }
}
