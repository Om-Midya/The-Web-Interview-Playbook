const SECTION_TITLES: Record<string, string> = {
  '00-start-here': 'Start Here',
  '01-html-css': 'HTML & CSS',
  '02-javascript-core': 'JavaScript Core',
  '03-javascript-dom': 'JavaScript & DOM',
  '04-react': 'React',
  '05-node-express': 'Node & Express',
  '06-nextjs': 'Next.js',
  '07-system-design': 'System Design',
  '08-project-interview-bible': 'Project Interview Bible',
  '09-hr-interviews': 'HR Interviews',
  '10-mock-interview-kits': 'Mock Interview Kits',
  '11-interview-patterns': 'Interview Patterns',
  '12-interview-experiences': 'Interview Experiences',
};

/** Pedagogical reading order; unknown docs sort after these, alphabetically. */
const PREFERRED_DOC_ORDER = [
  'readme',
  'topics-not-to-miss',
  'interview-questions',
  'tricky-output-questions',
  'polyfills',
  'coding-questions',
  'mini-tasks',
  'mini-dom-challenges',
  'hooks-deep-dive',
  'rendering-patterns',
  'api-design',
  'auth-security',
  'performance',
  'project-style-questions',
  'common-mistakes',
  'revision-sheet',
  'mock-interview',
];

export function sectionOf(id: string): string | null {
  const slash = id.indexOf('/');
  return slash === -1 ? null : id.slice(0, slash);
}

export function sectionTitle(sectionDir: string): string {
  if (SECTION_TITLES[sectionDir]) return SECTION_TITLES[sectionDir];
  return sectionDir
    .replace(/^\d+-/, '')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function extractTitle(body: string, fallbackId: string): string {
  const m = body.match(/^#\s+(.+)$/m);
  if (m) return m[1].trim();
  const base = fallbackId.split('/').pop() ?? fallbackId;
  return base
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function docRank(id: string): number {
  const base = id.split('/').pop() ?? id;
  const i = PREFERRED_DOC_ORDER.indexOf(base);
  return i === -1 ? PREFERRED_DOC_ORDER.length : i;
}

export function sortDocs(ids: string[]): string[] {
  return [...ids].sort((a, b) => docRank(a) - docRank(b) || a.localeCompare(b));
}

export function isSectionReadme(id: string): boolean {
  return /^[^/]+\/readme$/.test(id);
}

export function allSectionDirs(ids: string[]): string[] {
  const dirs = new Set<string>();
  for (const id of ids) {
    const s = sectionOf(id);
    if (s && /^\d{2}-/.test(s)) dirs.add(s);
  }
  return [...dirs].sort();
}
