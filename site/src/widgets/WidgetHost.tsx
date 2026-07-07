import { Suspense, lazy, type ComponentType, type LazyExoticComponent } from 'react';

/** Client-side widget registry. Literal dynamic imports let Vite code-split
 * one chunk per widget; only widgets on the current page are ever fetched. */
const REGISTRY: Record<string, LazyExoticComponent<ComponentType>> = {
  'event-loop-stepper': lazy(() => import('./event-loop/EventLoopStepper')),
  'flexbox-playground': lazy(() => import('./flexbox/FlexboxPlayground')),
  'promise-state-machine': lazy(() => import('./promise/PromiseStateMachine')),
  'specificity-calculator': lazy(() => import('./specificity/SpecificityCalculator')),
  'box-model-explorer': lazy(() => import('./box-model/BoxModelExplorer')),
  'hoisting-tdz-stepper': lazy(() => import('./hoisting/HoistingStepper')),
  'this-binding-resolver': lazy(() => import('./this-binding/ThisBindingResolver')),
  'event-propagation': lazy(() => import('./propagation/EventPropagation')),
  'middleware-pipeline': lazy(() => import('./middleware/MiddlewarePipeline')),
  'rerender-visualizer': lazy(() => import('./rerender/ReRenderVisualizer')),
  'useeffect-timeline': lazy(() => import('./effect/UseEffectTimeline')),
};

export const REGISTERED_WIDGET_IDS = Object.keys(REGISTRY);

export default function WidgetHost({ widgetId }: { widgetId: string }) {
  const Widget = REGISTRY[widgetId];
  if (!Widget) return null; // fail-soft: unknown id renders nothing
  return (
    <Suspense fallback={<p className="widget-loading">Loading interactive…</p>}>
      <Widget />
    </Suspense>
  );
}
