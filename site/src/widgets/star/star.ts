import type { BehavioralQuestion } from '../../lib/prep';

/** Budgets from mock-hr-interview.md's STAR timing table (~75s total);
 * word targets ≈ seconds × 2.5 (≈150 wpm). */
export const STAR_PARTS = [
  { key: 's', label: 'Situation', seconds: 10, targetWords: 25 },
  { key: 't', label: 'Task', seconds: 10, targetWords: 25 },
  { key: 'a', label: 'Action', seconds: 40, targetWords: 100 },
  { key: 'r', label: 'Result', seconds: 15, targetWords: 40 },
] as const;

export type StarPartKey = (typeof STAR_PARTS)[number]['key'];

export interface Story {
  id: string;
  title: string;
  s: string;
  t: string;
  a: string;
  r: string;
  questions: number[];
  updatedAt: number;
}

export const STARS_KEY = 'playbook-stars-v1';

export function newId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `s-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
  }
}

export function wordCount(text: string): number {
  const t = text.trim();
  return t === '' ? 0 : t.split(/\s+/).length;
}

export function coverage(
  stories: Story[],
  questions: BehavioralQuestion[],
): { covered: number[]; uncovered: number[] } {
  const hit = new Set<number>();
  for (const st of stories) for (const q of st.questions) hit.add(q);
  const covered: number[] = [];
  const uncovered: number[] = [];
  for (const q of questions) (hit.has(q.n) ? covered : uncovered).push(q.n);
  return { covered, uncovered };
}

export function exportStory(story: Story, questions: BehavioralQuestion[]): string {
  const mapped = questions
    .filter((q) => story.questions.includes(q.n))
    .map((q) => `- ${q.text}`);
  const parts = STAR_PARTS.map((p) => `${p.label.toUpperCase()} (${p.seconds}s):\n${story[p.key] || '—'}`);
  return [
    `# ${story.title || 'Untitled story'}`,
    '',
    'Answers:',
    ...(mapped.length > 0 ? mapped : ['- (not mapped yet)']),
    '',
    ...parts,
  ].join('\n');
}

export function loadStories(): Story[] {
  try {
    const raw = localStorage.getItem(STARS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStories(stories: Story[]): void {
  try {
    localStorage.setItem(STARS_KEY, JSON.stringify(stories));
  } catch {
    /* storage unavailable — session-only */
  }
}
