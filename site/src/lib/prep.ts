/** Fail-soft parsers over prep-section corpus docs (pattern: lib/roadmap.ts).
 * Malformed input yields empty results / null — never throws. */

export interface BehavioralQuestion {
  n: number;
  text: string;
}

/** '## N. Question text' headings from 09-hr-interviews/behavioral-questions.md. */
export function parseBehavioralQuestions(md: string): BehavioralQuestion[] {
  const out: BehavioralQuestion[] = [];
  for (const line of md.split('\n')) {
    const m = line.match(/^## (\d+)\.\s+(.+?)\s*$/);
    if (m) out.push({ n: Number(m[1]), text: m[2] });
  }
  return out;
}

export interface KitSection {
  n: number;
  title: string;
  minutes: number;
}

export interface MockKit {
  slug: string;
  title: string;
  sections: KitSection[];
  totalMinutes: number;
}

/** '## Section N: Title (X min)' headings from 10-mock-interview-kits/<slug>.md. */
export function parseMockKit(slug: string, md: string): MockKit | null {
  const sections: KitSection[] = [];
  let title = slug;
  for (const line of md.split('\n')) {
    const h1 = line.match(/^# (.+?)\s*$/);
    if (h1 && title === slug) title = h1[1];
    const m = line.match(/^## Section (\d+):\s*(.+?)\s*\((\d+) min\)\s*$/);
    if (m) sections.push({ n: Number(m[1]), title: m[2], minutes: Number(m[3]) });
  }
  if (sections.length === 0) return null;
  return {
    slug,
    title,
    sections,
    totalMinutes: sections.reduce((sum, s) => sum + s.minutes, 0),
  };
}

export interface RubricDimension {
  n: number;
  name: string;
}

/** '### N. Name' under '## Core Dimensions' (stops at the next '## ' heading). */
export function parseRubric(md: string): RubricDimension[] {
  const out: RubricDimension[] = [];
  let inCore = false;
  for (const line of md.split('\n')) {
    if (/^## /.test(line)) inCore = /^## Core Dimensions/.test(line);
    if (!inCore) continue;
    const m = line.match(/^### (\d+)\.\s+(.+?)\s*$/);
    if (m) out.push({ n: Number(m[1]), name: m[2] });
  }
  return out;
}
