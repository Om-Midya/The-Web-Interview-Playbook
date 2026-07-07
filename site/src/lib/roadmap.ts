export interface RoadmapDay {
  day: string;
  focus: string;
  files: string;
}

export interface RoadmapWeek {
  number: number;
  title: string;
  goal: string;
  days: RoadmapDay[];
  checkpoint: string;
}

/** Strips inline markdown (bold/italic/code markers) from a table cell. */
function stripInlineMd(cell: string): string {
  return cell.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1').replace(/`/g, '').trim();
}

/** Parses the corpus ROADMAP.md structure. Fail-soft: returns the weeks it
 * can parse; malformed sections are skipped rather than throwing. */
export function parseRoadmap(body: string): RoadmapWeek[] {
  const weeks: RoadmapWeek[] = [];
  const sections = body.split(/^## /m).slice(1);
  for (const section of sections) {
    const header = section.match(/^Week (\d+):\s*(.+)/);
    if (!header) continue;
    const number = Number(header[1]);
    const title = header[2].trim();
    const goal = section.match(/\*\*Goal:\*\*\s*(.+)/)?.[1]?.trim() ?? '';
    const checkpoint =
      section.match(/\*\*Week \d+ checkpoint:\*\*\s*(.+)/)?.[1]?.trim() ?? '';

    const days: RoadmapDay[] = [];
    for (const line of section.split('\n')) {
      const cells = line.split('|').map((c) => c.trim());
      // | Day | Focus | Files | rows have 5 cells after split: '', d, f, files, ''
      if (cells.length >= 4 && cells[1] && cells[1] !== 'Day' && !/^-+$/.test(cells[1])) {
        days.push({ day: cells[1], focus: stripInlineMd(cells[2] ?? ''), files: stripInlineMd(cells[3] ?? '') });
      }
    }
    weeks.push({ number, title, goal, days, checkpoint });
  }
  return weeks;
}
