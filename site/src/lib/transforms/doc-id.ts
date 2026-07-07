export function docIdFromPath(p: string | undefined): string | null {
  if (!p) return null;
  const normalized = p.replace(/\\/g, '/');
  const m = normalized.match(/web-dev-interview-playbook\/(.+)\.md$/i);
  return m ? m[1].toLowerCase() : null;
}

/** Counts GFM task-list items in raw markdown (build-time progress totals). */
export function countCheckboxes(body: string): number {
  return (body.match(/^\s*[-*]\s+\[[ xX]\]\s/gm) ?? []).length;
}
