/** Build-time widget placement data. Rendering happens through WidgetHost
 * (client directives cannot be used on dynamically-referenced components,
 * so section pages statically render WidgetHost and pass the id). */
export interface WidgetMeta {
  id: string;
  title: string;
  description: string;
}

export const SECTION_WIDGETS: Record<string, WidgetMeta[]> = {
  '01-html-css': [
    {
      id: 'flexbox-playground',
      title: 'Flexbox Playground',
      description: 'Flip one flex property at a time and watch the layout respond — the fastest way to internalize the main/cross axis.',
    },
    {
      id: 'specificity-calculator',
      title: 'CSS Specificity Calculator',
      description: 'Type two competing selectors and see the (IDs, classes, elements) scores battle — and why source order breaks ties.',
    },
    {
      id: 'box-model-explorer',
      title: 'Box Model Explorer',
      description: 'Drag the sliders and flip box-sizing to see exactly where width goes — the classic border-box interview question, live.',
    },
    {
      id: 'grid-playground',
      title: 'CSS Grid Playground',
      description: 'Flip between fr, minmax(), and auto-fit tracks — every item shows its real pixel width, so the fr math finally clicks. Then lay out a whole page with named areas.',
    },
  ],
  '02-javascript-core': [
    {
      id: 'event-loop-stepper',
      title: 'Event Loop Stepper',
      description:
        'Step through real code and watch the call stack, Web APIs, and both queues — see WHY promises beat setTimeout.',
    },
    {
      id: 'promise-state-machine',
      title: 'Promise State Machine',
      description: 'resolve, reject, and try to change a settled promise — see which handlers fire and why settled means locked.',
    },
    {
      id: 'hoisting-tdz-stepper',
      title: 'Hoisting & TDZ Stepper',
      description: 'Watch the creation phase register var, let, and functions differently — then see exactly why the TDZ throws.',
    },
    {
      id: 'this-binding-resolver',
      title: 'this Binding Resolver',
      description: 'Walk the priority ladder (new → bind → method → arrow → default) for real call sites and see what this becomes.',
    },
    {
      id: 'closure-scope-stepper',
      title: 'Closure Scope-Chain Diagram',
      description: 'Watch makeCounter() return — and its scope refuse to die. See exactly what a closure keeps alive, and why var loops print 3, 3, 3.',
    },
    {
      id: 'coercion-stepper',
      title: 'Type Coercion Stepper',
      description: 'Walk [] == ![] one spec rule at a time and watch the expression rewrite itself to true — then never fear a coercion question again.',
    },
    {
      id: 'debounce-throttle',
      title: 'Debounce vs Throttle Timeline',
      description: 'Type into a real input and watch your keystrokes race down three lanes — see the debounce timer restart on every key, and why throttle fires anyway.',
    },
  ],
  '03-javascript-dom': [
    {
      id: 'event-propagation',
      title: 'Event Propagation Visualizer',
      description: 'Capture down, bubble up: watch a click travel the DOM tree, stop it mid-flight, and see why delegation works.',
    },
    {
      id: 'rendering-pipeline',
      title: 'Browser Rendering Pipeline',
      description: 'Step through DOM → Style → Layout → Paint → Composite, then change width vs transform and see exactly which stages relight — and why transform stays at 60fps.',
    },
  ],
  '04-react': [
    {
      id: 'rerender-visualizer',
      title: 'React Re-render Visualizer',
      description: 'Fire state updates at different tree levels and watch exactly which components re-render — and what React.memo saves you.',
    },
    {
      id: 'useeffect-timeline',
      title: 'useEffect Timeline',
      description: 'Pick a deps array, mount, update, unmount — and see precisely when the effect runs, skips, and cleans up.',
    },
    {
      id: 'keys-reconciliation',
      title: 'Keys & Reconciliation Bug Demo',
      description: 'Tick a row’s checkbox, delete another row under key={index}, and watch the state land on the WRONG person — then fix it with key={id}.',
    },
  ],
  '05-node-express': [
    {
      id: 'middleware-pipeline',
      title: 'Express Middleware Pipeline',
      description: 'Follow a request through logger → auth → validate → handler, short-circuit a 401, and crash into the error middleware.',
    },
  ],
  '06-nextjs': [
    {
      id: 'rendering-patterns',
      title: 'Rendering Patterns: CSR vs SSR vs SSG vs ISR',
      description: 'Step through all four strategies and watch WHERE the work happens — build, server, or browser — and who ever sees a stale page.',
    },
  ],
  '07-system-design': [
    {
      id: 'load-balancer',
      title: 'Load Balancer Algorithms',
      description: 'Crank the traffic, slow one server down, and watch round-robin drown it while least-connections routes around — the difference explained in one animation.',
    },
    {
      id: 'cache-flow',
      title: 'Cache Flow Simulator',
      description: 'Follow every request through Browser → CDN → Redis → DB, tune the TTL, then unleash a thundering herd and watch the database take the hit.',
    },
    {
      id: 'websocket-pubsub',
      title: 'WebSocket + Redis Pub/Sub',
      description: 'Send a message from a client on server 1 and watch clients on server 2 miss it — then switch on the Redis bus and see the fan-out fix scaling.',
    },
  ],
  '08-project-interview-bible': [
    {
      id: 'nplusone-query',
      title: 'N+1 Query Visualizer',
      description: 'Press Run and watch an innocent ORM loop fire query after sequential query — then run the JOIN and watch one bar do the same work in a fraction of the time.',
    },
    {
      id: 'double-booking-race',
      title: 'Double-Booking Race',
      description: 'Two buyers, one seat, 80 milliseconds apart. Watch the oversell happen — then turn on the row lock and watch the database say no.',
    },
  ],
};
