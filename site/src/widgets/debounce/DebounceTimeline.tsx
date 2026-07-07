import { useMemo, useState } from 'react';
import Simulation from '../engine/Simulation';
import { OptionRow, Slider } from '../engine/PlaygroundFrame';
import { EventDot, FireMarker, Lane, SVG_W, TimelineSvg, timeToX } from '../engine/sim-svg';
import {
  DEBOUNCE_SPEC,
  addEvent,
  debounceSnapshots,
  scheduleBurst,
  type DebounceParams,
} from './debounce';

const WINDOW_MS = 4000;
const Y = { raw: 34, debounce: 76, throttle: 118 };

export default function DebounceTimeline() {
  const [waitMs, setWaitMs] = useState(300);
  const [debounceMode, setDebounceMode] = useState<string>('trailing');
  const [throttleMode, setThrottleMode] = useState<string>('leading');
  const params: DebounceParams = {
    waitMs,
    debounceMode: debounceMode as DebounceParams['debounceMode'],
    throttleMode: throttleMode as DebounceParams['throttleMode'],
  };
  const snapshots = useMemo(() => debounceSnapshots(params), [waitMs, debounceMode, throttleMode]);

  return (
    <div>
      <div className="playground-controls">
        <Slider label="wait" min={100} max={1000} value={waitMs} onChange={setWaitMs} />
        <OptionRow label="debounce" options={['trailing', 'leading']} value={debounceMode} onChange={setDebounceMode} />
        <OptionRow label="throttle" options={['leading', 'trailing']} value={throttleMode} onChange={setThrottleMode} />
      </div>
      <Simulation
        spec={DEBOUNCE_SPEC}
        params={params}
        snapshots={snapshots}
        ariaLabel="Debounce versus throttle timeline"
        render={(s, api) => {
          const x = (t: number) => timeToX(t, s.now, WINDOW_MS);
          const lastEvent = s.events.length > 0 ? s.events[s.events.length - 1] : null;
          return (
            <div className="sim">
              <div className="sim-actions">
                <input
                  className="sim-input"
                  aria-label="Type here to generate input events"
                  placeholder={api.playing ? 'type here — every keystroke is an event' : 'press Play, then type here'}
                  onInput={() => api.dispatch((st) => addEvent(st, params))}
                />
                <button onClick={() => { api.dispatch(scheduleBurst); api.play(); }}>
                  Simulate burst
                </button>
              </div>
              <TimelineSvg height={136} label="Timeline: raw events, debounced calls, throttled calls">
                <Lane y={Y.raw} label="raw events" />
                <Lane y={Y.debounce} label={`debounce(${waitMs}ms, ${debounceMode})`} />
                <Lane y={Y.throttle} label={`throttle(${waitMs}ms, ${throttleMode})`} />
                {s.debounceDeadline !== null && lastEvent !== null && (
                  <rect
                    className="tl-cooldown"
                    x={x(lastEvent)}
                    y={Y.debounce - 8}
                    width={Math.max(1, x(s.debounceDeadline) - x(lastEvent))}
                    height={16}
                    rx={3}
                  />
                )}
                {s.throttleWindowEnd !== null && (
                  <rect
                    className="tl-window"
                    x={Math.max(0, x(s.throttleWindowEnd - waitMs))}
                    y={Y.throttle - 8}
                    width={Math.max(1, x(s.throttleWindowEnd) - Math.max(0, x(s.throttleWindowEnd - waitMs)))}
                    height={16}
                    rx={3}
                  />
                )}
                {s.events.map((t, i) => <EventDot key={i} x={x(t)} y={Y.raw} />)}
                {s.debounceFires.map((t, i) => <FireMarker key={i} x={x(t)} y={Y.debounce} />)}
                {s.throttleFires.map((t, i) => <FireMarker key={i} x={x(t)} y={Y.throttle} />)}
              </TimelineSvg>
              <p className="sim-summary">
                {s.events.length} events → {s.debounceFires.length} debounced · {s.throttleFires.length} throttled calls
              </p>
            </div>
          );
        }}
      />
    </div>
  );
}
