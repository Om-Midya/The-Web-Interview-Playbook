export type DepsMode = 'none' | 'empty' | 'count';
export type EffectAction = 'mount' | 'setCount' | 'setOther' | 'unmount';

export interface EffectEvent {
  kind: 'render' | 'effect' | 'cleanup' | 'skip';
  detail: string;
}

const DEPS_LABEL: Record<DepsMode, string> = {
  none: 'no deps array',
  empty: '[]',
  count: '[count]',
};

/** One user action → the ordered React events it causes for a single
 * useEffect with the given deps mode. */
export function effectStep(
  deps: DepsMode,
  action: EffectAction,
  mounted: boolean
): { events: EffectEvent[]; mounted: boolean } {
  if (action === 'mount') {
    if (mounted) return { events: [], mounted };
    return {
      events: [
        { kind: 'render', detail: 'initial render' },
        { kind: 'effect', detail: `effect runs (${DEPS_LABEL[deps]}) — after paint` },
      ],
      mounted: true,
    };
  }
  if (!mounted) return { events: [], mounted };
  if (action === 'unmount') {
    return { events: [{ kind: 'cleanup', detail: 'cleanup runs on unmount' }], mounted: false };
  }
  const events: EffectEvent[] = [{ kind: 'render', detail: `re-render (${action})` }];
  const reruns = deps === 'none' || (deps === 'count' && action === 'setCount');
  if (reruns) {
    events.push({ kind: 'cleanup', detail: 'cleanup of the PREVIOUS effect runs first' });
    events.push({ kind: 'effect', detail: 'effect re-runs with fresh values' });
  } else {
    events.push({ kind: 'skip', detail: deps === 'empty' ? 'deps [] unchanged → effect skipped' : 'count unchanged → effect skipped' });
  }
  return { events, mounted };
}
