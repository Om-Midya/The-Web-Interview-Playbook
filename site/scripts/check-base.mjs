// Fails the build if any root-absolute href/src in dist HTML lacks the base
// prefix — catches future main merges that add raw '/...' links.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const [, , distDir, base] = process.argv;
if (!distDir || !base) {
  console.error('usage: node scripts/check-base.mjs <dist-dir> <base-prefix>');
  process.exit(2);
}

const offenders = [];
function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      walk(p);
    } else if (e.name.endsWith('.html')) {
      const html = readFileSync(p, 'utf8');
      for (const m of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
        const url = m[1];
        if (url.startsWith('//')) continue; // protocol-relative
        if (url === `${base}/` || url === base || url.startsWith(`${base}/`)) continue;
        offenders.push(`${p}: ${url}`);
      }
    }
  }
}
walk(distDir);

if (offenders.length > 0) {
  console.error(`check-base: ${offenders.length} root-absolute URL(s) missing the base prefix:`);
  for (const o of offenders.slice(0, 40)) console.error(`  ${o}`);
  process.exit(1);
}
console.log('check-base: OK — all root-absolute URLs carry the base prefix.');
