import { useEffect, useState } from 'react';
import type { RoadmapWeek } from '../../lib/roadmap';
import { loadProgress, saveKey } from './storage';

export default function RoadmapPlanner({ weeks }: { weeks: RoadmapWeek[] }) {
  const [done, setDone] = useState<Record<string, true>>({});

  useEffect(() => {
    setDone(loadProgress());
  }, []);

  function toggle(key: string, on: boolean) {
    saveKey(key, on);
    setDone(loadProgress());
  }

  return (
    <div>
      {weeks.map((week) => {
        const keys = week.days.map((_, i) => `roadmap:w${week.number}:${i}`);
        const doneCount = keys.filter((k) => k in done).length;
        const pct = week.days.length ? Math.round((doneCount / week.days.length) * 100) : 0;
        return (
          <section className="roadmap-week" key={week.number}>
            <h3>Week {week.number}: {week.title}</h3>
            {week.goal && <p className="week-goal">🎯 {week.goal}</p>}
            <div className="week-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
              <div style={{ width: `${pct}%` }} />
            </div>
            {week.days.map((day, i) => {
              const key = keys[i];
              const checked = key in done;
              return (
                <label className={`roadmap-day${checked ? ' done' : ''}`} key={key}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => toggle(key, e.target.checked)}
                  />
                  <span className="day-name">{day.day}</span>
                  <span className="day-focus">{day.focus}</span>
                  <span className="day-files">{day.files.replaceAll('`', '')}</span>
                </label>
              );
            })}
            {week.checkpoint && <p className="week-checkpoint">✅ Checkpoint: {week.checkpoint}</p>}
          </section>
        );
      })}
    </div>
  );
}
