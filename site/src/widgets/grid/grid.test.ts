import { describe, it, expect } from 'vitest';
import { AREA_PRESETS, COLUMN_PRESETS, areaLayout, areasCss, gridCss, mirrorRow } from './grid';

describe('gridCss', () => {
  it('emits every declaration', () => {
    const css = gridCss({ columns: '1fr 2fr 1fr', gap: 12, count: 6, alignItems: 'center' });
    expect(css).toContain('display: grid;');
    expect(css).toContain('grid-template-columns: 1fr 2fr 1fr;');
    expect(css).toContain('gap: 12px;');
    expect(css).toContain('align-items: center;');
  });
});

describe('area layouts', () => {
  it('every preset row uses only declared area names, consistently sized', () => {
    for (const preset of AREA_PRESETS) {
      const l = areaLayout(preset, 'left');
      const width = l.rows[0].split(' ').length;
      for (const row of l.rows) {
        const cells = row.split(' ');
        expect(cells, `${preset}: "${row}"`).toHaveLength(width);
        for (const c of cells) expect(l.areas).toContain(c);
      }
      expect(l.colSizes.split(' ')).toHaveLength(width);
      expect(l.rowSizes.split(' ')).toHaveLength(l.rows.length);
    }
  });
  it('mirroring reverses every row and the column sizes', () => {
    const left = areaLayout('holy-grail', 'left');
    const right = areaLayout('holy-grail', 'right');
    left.rows.forEach((row, i) => expect(right.rows[i]).toBe(mirrorRow(row)));
    expect(right.colSizes.split(' ')).toEqual(left.colSizes.split(' ').reverse());
  });
  it('areasCss declares grid-area for every named area', () => {
    for (const preset of AREA_PRESETS) {
      const css = areasCss(preset, 'left', 8);
      const l = areaLayout(preset, 'left');
      for (const a of l.areas) expect(css).toContain(`.${a} { grid-area: ${a}; }`);
      expect(css).toContain('grid-template-areas:');
      expect(css).toContain('gap: 8px;');
    }
  });
  it('column presets cover the interview syntax (fr, repeat, minmax, auto-fit, px)', () => {
    const all = COLUMN_PRESETS.join(' | ');
    expect(all).toContain('fr');
    expect(all).toContain('repeat(');
    expect(all).toContain('minmax(');
    expect(all).toContain('auto-fit');
    expect(all).toContain('px');
  });
});
