import { execFileSync } from 'node:child_process';
import { dirname, isAbsolute, resolve } from 'node:path';

const cache = new Map<string, string | null>();

export function getLastCommitISO(filePath: string): string | null {
  const abs = isAbsolute(filePath) ? filePath : resolve(process.cwd(), filePath);
  if (cache.has(abs)) return cache.get(abs)!;
  let iso: string | null = null;
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', abs], {
      cwd: dirname(abs),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    iso = out || null;
  } catch {
    iso = null;
  }
  cache.set(abs, iso);
  return iso;
}

export function isRecent(iso: string | null, now: Date = new Date(), days = 14): boolean {
  if (!iso) return false;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return false;
  const ageMs = now.getTime() - t;
  return ageMs >= 0 && ageMs <= days * 24 * 60 * 60 * 1000;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(iso));
}
