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
  ],
};
