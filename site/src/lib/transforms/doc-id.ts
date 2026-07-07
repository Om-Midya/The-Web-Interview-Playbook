export function docIdFromPath(p: string | undefined): string | null {
  if (!p) return null;
  const normalized = p.replace(/\\/g, '/');
  const m = normalized.match(/web-dev-interview-playbook\/(.+)\.md$/i);
  return m ? m[1].toLowerCase() : null;
}

/** Counts GFM task-list items in raw markdown (build-time progress totals).
 * Fence-aware: task-list syntax inside ``` / ~~~ code blocks is not a checkbox.
 * Breadth is intentional: `-`/`*` bullets and upper/lowercase X match remark-gfm. */
export function countCheckboxes(body: string): number {
  let inFence = false;
  let count = 0;
  for (const line of body.split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (!inFence && /^\s*[-*]\s+\[[ xX]\]\s/.test(line)) count++;
  }
  return count;
}
