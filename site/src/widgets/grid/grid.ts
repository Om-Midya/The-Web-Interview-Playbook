export interface TrackConfig {
  columns: string;
  gap: number;
  count: number;
  alignItems: string;
}

export const COLUMN_PRESETS = [
  '1fr 1fr 1fr',
  'repeat(3, 1fr)',
  '1fr 2fr 1fr',
  '200px 1fr',
  'repeat(auto-fit, minmax(120px, 1fr))',
] as const;

export function gridCss(c: TrackConfig): string {
  return [
    '.container {',
    '  display: grid;',
    `  grid-template-columns: ${c.columns};`,
    `  gap: ${c.gap}px;`,
    `  align-items: ${c.alignItems};`,
    '}',
  ].join('\n');
}

export const AREA_PRESETS = ['holy-grail', 'dashboard'] as const;
export type AreaPreset = (typeof AREA_PRESETS)[number];

export interface AreaLayout {
  /** grid-template-areas rows, space-separated area names. */
  rows: string[];
  rowSizes: string;
  colSizes: string;
  /** Unique area names, render order. */
  areas: string[];
}

const LAYOUTS: Record<AreaPreset, AreaLayout> = {
  'holy-grail': {
    rows: ['header header header', 'sidebar main main', 'footer footer footer'],
    rowSizes: 'auto 1fr auto',
    colSizes: '160px 1fr 1fr',
    areas: ['header', 'sidebar', 'main', 'footer'],
  },
  dashboard: {
    rows: ['header header header', 'nav main aside', 'nav footer footer'],
    rowSizes: 'auto 1fr auto',
    colSizes: '140px 1fr 160px',
    areas: ['header', 'nav', 'main', 'aside', 'footer'],
  },
};

export function mirrorRow(row: string): string {
  return row.split(' ').reverse().join(' ');
}

export function areaLayout(preset: AreaPreset, side: 'left' | 'right'): AreaLayout {
  const base = LAYOUTS[preset] ?? LAYOUTS['holy-grail']; // fail-soft on unknown preset
  if (side !== 'right') return base;
  return {
    ...base,
    rows: base.rows.map(mirrorRow),
    colSizes: base.colSizes.split(' ').reverse().join(' '),
  };
}

export function areasCss(preset: AreaPreset, side: 'left' | 'right', gap: number): string {
  const l = areaLayout(preset, side);
  const areaLines = l.rows.map((r, i) => `    "${r}"${i === l.rows.length - 1 ? ';' : ''}`);
  return [
    '.layout {',
    '  display: grid;',
    `  grid-template-columns: ${l.colSizes};`,
    `  grid-template-rows: ${l.rowSizes};`,
    '  grid-template-areas:',
    ...areaLines,
    `  gap: ${gap}px;`,
    '}',
    '',
    ...l.areas.map((a) => `.${a} { grid-area: ${a}; }`),
  ].join('\n');
}
