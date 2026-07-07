import type { StepperSample } from '../lib/stepper';

export interface RenderState {
  build: string[];
  server: string[];
  browser: { screen: 'blank' | 'shell' | 'content' | 'stale'; label: string; interactive: boolean };
}

const S = (over: Partial<RenderState>): RenderState => ({
  build: [],
  server: [],
  browser: { screen: 'blank', label: '(blank)', interactive: false },
  ...over,
});

export const RENDER_TRACES: StepperSample<RenderState>[] = [
  {
    id: 'csr',
    label: 'CSR',
    code: ['user requests /dashboard', 'server returns empty HTML shell + JS bundle', 'browser downloads and runs the JS', 'React renders in the browser', 'data fetched from the API', 'page finally shows content'].join('\n'),
    steps: [
      { line: 1, note: 'Client-Side Rendering: the server does almost nothing per-request.', state: S({ server: ['static file server'] }) },
      { line: 2, note: 'The HTML is an empty <div id="root"> — view-source shows nothing. Bad for SEO and slow first paint.', state: S({ server: ['sends shell + bundle'], browser: { screen: 'blank', label: '<div id="root"></div>', interactive: false } }) },
      { line: 3, note: 'The browser must download, parse, and execute the bundle before ANYTHING renders.', state: S({ browser: { screen: 'blank', label: 'downloading JS…', interactive: false } }) },
      { line: 5, note: 'Then data fetching starts — a second round trip. Spinners live here.', state: S({ browser: { screen: 'shell', label: 'layout + spinner', interactive: true } }) },
      { line: 6, note: 'Content at last. Fully interactive, cheap servers — but the slowest first meaningful paint of the four.', state: S({ browser: { screen: 'content', label: 'dashboard ✓', interactive: true } }) },
    ],
  },
  {
    id: 'ssr',
    label: 'SSR',
    code: ['user requests /dashboard', 'server fetches data NOW', 'server renders full HTML', 'browser paints it immediately', 'JS loads → hydration → interactive'].join('\n'),
    steps: [
      { line: 1, note: 'Server-Side Rendering: every request does real work on the server.', state: S({ server: ['request in'] }) },
      { line: 2, note: 'Data is fetched server-side — close to the database, before any HTML is sent.', state: S({ server: ['fetching data…'] }) },
      { line: 4, note: 'The browser paints REAL content on arrival — fast first paint, great SEO. But buttons don\'t work yet.', state: S({ server: ['HTML rendered'], browser: { screen: 'content', label: 'dashboard (not clickable yet)', interactive: false } }) },
      { line: 5, note: 'Hydration: React attaches listeners to the existing HTML. Now it\'s interactive. Fresh data every request — at the cost of server work per request.', state: S({ browser: { screen: 'content', label: 'dashboard ✓', interactive: true } }) },
    ],
  },
  {
    id: 'ssg',
    label: 'SSG',
    code: ['at BUILD time: fetch data, render HTML', 'deploy static files to a CDN', 'user requests /dashboard', 'CDN returns pre-built HTML instantly', 'hydration → interactive'].join('\n'),
    steps: [
      { line: 1, note: 'Static Site Generation: the rendering work happens ONCE, at build time.', state: S({ build: ['fetch + render at build'] }) },
      { line: 2, note: 'The output is plain files — servable from a CDN edge near every user.', state: S({ build: ['HTML files emitted'], server: ['CDN'] }) },
      { line: 4, note: 'Requests never touch an origin server. Fastest possible response; scales for free.', state: S({ build: ['HTML files emitted'], server: ['CDN hit'], browser: { screen: 'content', label: 'dashboard (pre-built)', interactive: false } }) },
      { line: 5, note: 'Hydrate → interactive. The catch: content is frozen at build time — stale until you rebuild. (This site you\'re reading is SSG.)', state: S({ build: ['HTML files emitted'], server: ['CDN hit'], browser: { screen: 'content', label: 'dashboard ✓', interactive: true } }) },
    ],
  },
  {
    id: 'isr',
    label: 'ISR',
    code: ['page built at build time (revalidate: 60)', 'requests within 60s: cached page, instant', 'a request arrives AFTER 60s…', 'user STILL gets the cached (stale) page', 'regeneration runs in the background', 'NEXT visitor gets the fresh page'].join('\n'),
    steps: [
      { line: 1, note: 'Incremental Static Regeneration: SSG plus a freshness window per page.', state: S({ build: ['built with revalidate: 60'] }) },
      { line: 2, note: 'Inside the window it behaves exactly like SSG — instant cached responses.', state: S({ build: ['built with revalidate: 60'], server: ['cache hit'], browser: { screen: 'content', label: 'dashboard (cached)', interactive: true } }) },
      { line: 4, note: 'Past the window, the visitor does NOT wait: they get the stale page immediately (stale-while-revalidate).', state: S({ server: ['cache STALE — serving anyway'], browser: { screen: 'stale', label: 'dashboard (stale)', interactive: true } }) },
      { line: 5, note: 'Meanwhile the server re-renders the page in the background.', state: S({ server: ['cache STALE — serving anyway', 'regenerating in background…'], browser: { screen: 'stale', label: 'dashboard (stale)', interactive: true } }) },
      { line: 6, note: 'The regenerated page replaces the cache — the NEXT visitor gets fresh content instantly. Nobody ever waited for a render.', state: S({ server: ['cache fresh again'], browser: { screen: 'content', label: 'dashboard ✓ (fresh)', interactive: true } }) },
    ],
  },
];
