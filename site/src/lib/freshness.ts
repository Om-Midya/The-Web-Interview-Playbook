import { execFileSync } from 'node:child_process';
import { dirname, isAbsolute, resolve } from 'node:path';

const cache = new Map<string, string | null>();

let shallowChecked = false;
let shallowRepo = false;

function isShallowRepo(cwd: string): boolean {
  if (shallowChecked) return shallowRepo;
  shallowChecked = true;
  try {
    shallowRepo =
      execFileSync('git', ['rev-parse', '--is-shallow-repository'], {
        cwd,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }).trim() === 'true';
  } catch {
    shallowRepo = false;
  }
  return shallowRepo;
}

export function getLastCommitISO(filePath: string): string | null {
  const abs = isAbsolute(filePath) ? filePath : resolve(process.cwd(), filePath);
  if (cache.has(abs)) return cache.get(abs)!;
  if (isShallowRepo(dirname(abs))) {
    cache.set(abs, null);
    return null;
  }
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
  if (Number.isNaN(Date.parse(iso))) return '';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(iso));
}
