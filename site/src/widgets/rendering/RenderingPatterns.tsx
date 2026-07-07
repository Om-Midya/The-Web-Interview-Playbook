import Stepper from '../engine/Stepper';
import { RENDER_TRACES, type RenderState } from './traces';

function Lanes(state: RenderState) {
  return (
    <div className="lanes">
      <div className="lane">
        <h4>Build time</h4>
        {state.build.map((b, i) => (
          <span className="el-item" key={i}>{b}</span>
        ))}
      </div>
      <div className="lane">
        <h4>Server / CDN</h4>
        {state.server.map((s, i) => (
          <span className="el-item" key={i}>{s}</span>
        ))}
      </div>
      <div className="browser-mock">
        <div className="browser-bar">
          example.com/dashboard
          <span className={`interactive-badge${state.browser.interactive ? '' : ' off'}`}>
            {state.browser.interactive ? 'interactive' : 'not interactive'}
          </span>
        </div>
        <div className={`browser-screen ${state.browser.screen}`}>{state.browser.label}</div>
      </div>
    </div>
  );
}

export default function RenderingPatterns() {
  return <Stepper samples={RENDER_TRACES} renderState={Lanes} />;
}
