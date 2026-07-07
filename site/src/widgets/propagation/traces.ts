import type { StepperSample } from '../lib/stepper';

export const CHAIN = ['window', 'document', 'div#app', 'ul#list', 'li.item', 'button'] as const;

export interface PropState {
  current: string | null;
  phase: 'capture' | 'target' | 'bubble' | 'done';
  fired: { node: string; label: string }[];
  stopped: boolean;
}

const S = (over: Partial<PropState>): PropState => ({ current: null, phase: 'done', fired: [], stopped: false, ...over });

export const PROP_TRACES: StepperSample<PropState>[] = [
  {
    id: 'bubble-basics',
    label: 'bubbling',
    code: ["ul.addEventListener('click', () => log('ul heard it'));", "li.addEventListener('click', () => log('li heard it'));", '// user clicks the <button> inside the <li>'].join('\n'),
    steps: [
      { line: 3, note: 'Click on <button>. First the event travels DOWN from window to the target — the CAPTURE phase. No capture listeners here, so nothing fires yet.', state: S({ current: 'window', phase: 'capture' }) },
      { line: 3, note: 'Capture continues down…', state: S({ current: 'ul#list', phase: 'capture' }) },
      { line: 3, note: 'TARGET phase: the event reaches the button itself.', state: S({ current: 'button', phase: 'target' }) },
      { line: 2, note: 'Now the BUBBLE phase — back UP. The li\'s listener fires first (closest ancestor).', state: S({ current: 'li.item', phase: 'bubble', fired: [{ node: 'li.item', label: 'li heard it' }] }) },
      { line: 1, note: 'The bubble continues up: ul\'s listener fires too — one click, two handlers.', state: S({ current: 'ul#list', phase: 'bubble', fired: [{ node: 'li.item', label: 'li heard it' }, { node: 'ul#list', label: 'ul heard it' }] }) },
      { line: null, note: 'The event finishes at window. Default listener phase is BUBBLE — that\'s why parents hear child clicks.', state: S({ phase: 'done', fired: [{ node: 'li.item', label: 'li heard it' }, { node: 'ul#list', label: 'ul heard it' }] }) },
    ],
  },
  {
    id: 'stop-propagation',
    label: 'stopPropagation',
    code: ["ul.addEventListener('click', () => log('ul heard it'));", "li.addEventListener('click', (e) => {", '  e.stopPropagation();', "  log('li heard it — and stopped it');", '});', '// user clicks the <button>'].join('\n'),
    steps: [
      { line: 6, note: 'Capture travels down (nothing fires), then the target phase at the button.', state: S({ current: 'button', phase: 'target' }) },
      { line: 3, note: 'Bubble reaches li — its handler calls e.stopPropagation().', state: S({ current: 'li.item', phase: 'bubble', fired: [{ node: 'li.item', label: 'li heard it — and stopped it' }], stopped: true }) },
      { line: 1, note: 'The event NEVER reaches ul. stopPropagation kills the rest of the journey (but not other listeners on li itself — that\'s stopImmediatePropagation).', state: S({ phase: 'done', fired: [{ node: 'li.item', label: 'li heard it — and stopped it' }], stopped: true }) },
    ],
  },
  {
    id: 'delegation',
    label: 'event delegation',
    code: ["ul.addEventListener('click', (e) => {", "  const li = e.target.closest('li');", "  if (li) log('delegated: ' + li.textContent);", '});', '// ONE listener handles clicks for EVERY li — even future ones'].join('\n'),
    steps: [
      { line: 5, note: 'Click any button inside any li. Capture → target as usual; no listener on li or button at all.', state: S({ current: 'button', phase: 'target' }) },
      { line: 1, note: 'Bubble carries the event up to ul, where the single delegated listener fires…', state: S({ current: 'ul#list', phase: 'bubble', fired: [{ node: 'ul#list', label: 'delegated: Item text' }] }) },
      { line: 2, note: 'e.target is the REAL clicked element (the button); closest(\'li\') walks up to identify which row. One listener, unlimited rows.', state: S({ current: 'ul#list', phase: 'bubble', fired: [{ node: 'ul#list', label: 'delegated: Item text' }] }) },
      { line: null, note: 'Delegation = bubbling put to work: fewer listeners, and dynamically added rows just work.', state: S({ phase: 'done', fired: [{ node: 'ul#list', label: 'delegated: Item text' }] }) },
    ],
  },
];
