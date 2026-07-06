/** Build-time widget placement data. Rendering happens through WidgetHost
 * (client directives cannot be used on dynamically-referenced components,
 * so section pages statically render WidgetHost and pass the id). */
export interface WidgetMeta {
  id: string;
  title: string;
  description: string;
}

export const SECTION_WIDGETS: Record<string, WidgetMeta[]> = {
  '02-javascript-core': [
    {
      id: 'event-loop-stepper',
      title: 'Event Loop Stepper',
      description:
        'Step through real code and watch the call stack, Web APIs, and both queues — see WHY promises beat setTimeout.',
    },
  ],
};
