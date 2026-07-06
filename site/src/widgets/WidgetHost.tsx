import { Suspense, lazy, type ComponentType, type LazyExoticComponent } from 'react';

/** Client-side widget registry. Literal dynamic imports let Vite code-split
 * one chunk per widget; only widgets on the current page are ever fetched. */
const REGISTRY: Record<string, LazyExoticComponent<ComponentType>> = {
  'event-loop-stepper': lazy(() => import('./event-loop/EventLoopStepper')),
};

export default function WidgetHost({ widgetId }: { widgetId: string }) {
  const Widget = REGISTRY[widgetId];
  if (!Widget) return null; // fail-soft: unknown id renders nothing
  return (
    <Suspense fallback={<p className="widget-loading">Loading interactive…</p>}>
      <Widget />
    </Suspense>
  );
}
