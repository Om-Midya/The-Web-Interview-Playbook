export interface BoxConfig {
  width: number;
  padding: number;
  border: number;
  margin: number;
  boxSizing: 'content-box' | 'border-box';
}

export function boxMetrics(c: BoxConfig): { contentWidth: number; visibleWidth: number; totalWidth: number } {
  if (c.boxSizing === 'content-box') {
    const visible = c.width + 2 * c.padding + 2 * c.border;
    return { contentWidth: c.width, visibleWidth: visible, totalWidth: visible + 2 * c.margin };
  }
  const content = Math.max(0, c.width - 2 * c.padding - 2 * c.border);
  return { contentWidth: content, visibleWidth: c.width, totalWidth: c.width + 2 * c.margin };
}
