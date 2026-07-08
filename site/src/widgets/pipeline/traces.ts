import type { StepperSample } from '../lib/stepper';

export type StageStatus = 'idle' | 'running' | 'done' | 'skipped';

export interface PipelineState {
  /** Order matches STAGE_NAMES. */
  stages: StageStatus[];
  /** Stages that ran for this change (excludes skipped). */
  rerun: number;
  output: string[];
}

/** 'Style' = style recalculation over the CSSOM; the first-load trace explains
 * that CSS parsing / CSSOM construction lives here. */
export const STAGE_NAMES = ['DOM', 'Style', 'Render Tree', 'Layout', 'Paint', 'Composite'];

const S = (...s: StageStatus[]): StageStatus[] => s;

export const PIPELINE_TRACES: StepperSample<PipelineState>[] = [
  {
    id: 'first-load',
    label: 'first load',
    code: ['<h1>Hello</h1>', '<style>', '  h1 { color: green; }', '</style>'].join('\n'),
    steps: [
      { line: null, note: 'The pipeline every frame potentially walks: six stages from markup to pixels on screen.', state: { stages: S('idle', 'idle', 'idle', 'idle', 'idle', 'idle'), rerun: 0, output: [] } },
      { line: 1, note: 'PARSE: the HTML becomes the DOM tree — one node per element.', state: { stages: S('running', 'idle', 'idle', 'idle', 'idle', 'idle'), rerun: 0, output: ['DOM: tree built'] } },
      { line: 3, note: 'STYLE: CSS is parsed into the CSSOM and every DOM node gets its computed style.', state: { stages: S('done', 'running', 'idle', 'idle', 'idle', 'idle'), rerun: 1, output: ['DOM: tree built', 'Style: 1 rule matched'] } },
      { line: null, note: 'RENDER TREE: DOM × computed styles → only what will actually render. display:none drops out HERE (visibility:hidden does not).', state: { stages: S('done', 'done', 'running', 'idle', 'idle', 'idle'), rerun: 2, output: ['DOM: tree built', 'Style: 1 rule matched', 'Render tree: 1 visible box'] } },
      { line: null, note: 'LAYOUT ("reflow"): exact geometry — x, y, width, height — for every box. The expensive stage: one change can cascade to ancestors AND descendants.', state: { stages: S('done', 'done', 'done', 'running', 'idle', 'idle'), rerun: 3, output: ['DOM: tree built', 'Style: 1 rule matched', 'Render tree: 1 visible box', 'Layout: geometry computed'] } },
      { line: null, note: 'PAINT: boxes become pixels in layers — text, colors, borders, shadows.', state: { stages: S('done', 'done', 'done', 'done', 'running', 'idle'), rerun: 4, output: ['DOM: tree built', 'Style: 1 rule matched', 'Render tree: 1 visible box', 'Layout: geometry computed', 'Paint: layers rasterized'] } },
      { line: null, note: 'COMPOSITE: the GPU stacks the painted layers into the final frame.', state: { stages: S('done', 'done', 'done', 'done', 'done', 'running'), rerun: 5, output: ['DOM: tree built', 'Style: 1 rule matched', 'Render tree: 1 visible box', 'Layout: geometry computed', 'Paint: layers rasterized', 'Composite: frame on screen'] } },
      { line: null, note: 'First load runs everything: 6 of 6 stages. Every LATER change re-runs only a suffix of this pipeline — which suffix is what the next three tabs teach.', state: { stages: S('done', 'done', 'done', 'done', 'done', 'done'), rerun: 6, output: ['DOM: tree built', 'Style: 1 rule matched', 'Render tree: 1 visible box', 'Layout: geometry computed', 'Paint: layers rasterized', 'Composite: frame on screen'] } },
    ],
  },
  {
    id: 'width',
    label: 'width change',
    code: ["el.style.width = '300px';"].join('\n'),
    steps: [
      { line: 1, note: 'A geometry property changes. No HTML changed — the DOM stage has nothing to do.', state: { stages: S('skipped', 'idle', 'idle', 'idle', 'idle', 'idle'), rerun: 0, output: ['DOM: unchanged — skipped'] } },
      { line: 1, note: 'Style recalculation runs for ANY style change. Cheap, but never free.', state: { stages: S('skipped', 'running', 'idle', 'idle', 'idle', 'idle'), rerun: 0, output: ['DOM: unchanged — skipped', 'Style: recalculated'] } },
      { line: 1, note: 'The render tree is the SAME boxes — structure unchanged, so it is skipped. The new width is geometry, and geometry is Layout\'s job.', state: { stages: S('skipped', 'done', 'skipped', 'running', 'idle', 'idle'), rerun: 1, output: ['DOM: unchanged — skipped', 'Style: recalculated', 'Layout: REFLOW…'] } },
      { line: 1, note: 'Layout done — and not just for this box: its ancestors, siblings, and descendants may all have moved. This is the expensive part.', state: { stages: S('skipped', 'done', 'skipped', 'done', 'running', 'idle'), rerun: 2, output: ['DOM: unchanged — skipped', 'Style: recalculated', 'Layout: REFLOW…', 'Paint: repainting…'] } },
      { line: 1, note: 'New geometry means new pixels: Paint re-rasterizes the affected layers, then Composite rebuilds the frame.', state: { stages: S('skipped', 'done', 'skipped', 'done', 'done', 'running'), rerun: 3, output: ['DOM: unchanged — skipped', 'Style: recalculated', 'Layout: REFLOW…', 'Paint: repainting…', 'Composite: frame rebuilt'] } },
      { line: 1, note: 'width = Style + Layout + Paint + Composite: 4 stages. This is why animating width janks — every frame pays for Layout.', state: { stages: S('skipped', 'done', 'skipped', 'done', 'done', 'done'), rerun: 4, output: ['DOM: unchanged — skipped', 'Style: recalculated', 'Layout: REFLOW…', 'Paint: repainting…', 'Composite: frame rebuilt'] } },
    ],
  },
  {
    id: 'transform',
    label: 'transform change',
    code: ["el.style.transform = 'translateX(100px)';"].join('\n'),
    steps: [
      { line: 1, note: 'A transform changes. No DOM mutation — skipped. Style recalculation still runs (any style change).', state: { stages: S('skipped', 'running', 'idle', 'idle', 'idle', 'idle'), rerun: 0, output: ['Style: recalculated'] } },
      { line: 1, note: 'Here is the magic: nothing about geometry or pixels changes. The browser already has the painted layer — Render Tree, Layout, and Paint are ALL skipped.', state: { stages: S('skipped', 'done', 'skipped', 'skipped', 'skipped', 'running'), rerun: 1, output: ['Style: recalculated', 'Composite: moving the existing layer…'] } },
      { line: 1, note: 'transform = Style + Composite: 2 stages, GPU-only. This is why transform animations hold 60fps where width animations jank.', state: { stages: S('skipped', 'done', 'skipped', 'skipped', 'skipped', 'done'), rerun: 2, output: ['Style: recalculated', 'Composite: moving the existing layer…', 'Frame on screen — no reflow, no repaint'] } },
    ],
  },
  {
    id: 'opacity',
    label: 'opacity change',
    code: ["el.style.opacity = '0.5';"].join('\n'),
    steps: [
      { line: 1, note: 'Opacity changes. No DOM mutation; Style recalculation runs.', state: { stages: S('skipped', 'running', 'idle', 'idle', 'idle', 'idle'), rerun: 0, output: ['Style: recalculated'] } },
      { line: 1, note: 'Like transform, the compositor can blend the EXISTING layer at the new opacity — no geometry, no repaint.', state: { stages: S('skipped', 'done', 'skipped', 'skipped', 'skipped', 'running'), rerun: 1, output: ['Style: recalculated', 'Composite: blending the existing layer…'] } },
      { line: 1, note: 'Honesty note: this Composite-only path needs the element to have its OWN compositor layer (animation or will-change promotes it). Without one, opacity still triggers Paint.', state: { stages: S('skipped', 'done', 'skipped', 'skipped', 'skipped', 'done'), rerun: 2, output: ['Style: recalculated', 'Composite: blending the existing layer…', 'Frame on screen'] } },
    ],
  },
];
