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
  ],
  '03-javascript-dom': [
    {
      id: 'event-propagation',
      title: 'Event Propagation Visualizer',
      description: 'Capture down, bubble up: watch a click travel the DOM tree, stop it mid-flight, and see why delegation works.',
    },
  ],
  '05-node-express': [
    {
      id: 'middleware-pipeline',
      title: 'Express Middleware Pipeline',
      description: 'Follow a request through logger → auth → validate → handler, short-circuit a 401, and crash into the error middleware.',
    },
  ],
};
