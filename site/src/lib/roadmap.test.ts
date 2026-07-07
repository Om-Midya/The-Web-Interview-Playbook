import { describe, it, expect } from 'vitest';
import { parseRoadmap } from './roadmap';

const SAMPLE = `# 4-Week Interview Preparation Roadmap

Intro text.

## Week 1: Foundations + Project Story

**Goal:** Solidify basics.

| Day | Focus | Files to Study |
|-----|-------|----------------|
| Mon | Setup + mindset | \`00-start-here/how-to-use-this-repo.md\` |
| Tue | HTML/CSS core | \`01-html-css/topics-not-to-miss.md\`, first 10 questions |

**Week 1 checkpoint:** Can you explain your main project in 2 minutes?

---

## Week 2: Deep Dive

**Goal:** Handle common topics.

| Day | Focus | Files to Study |
|-----|-------|----------------|
| Mon | JS tricky outputs | \`02-javascript-core/tricky-output-questions.md\` |

**Week 2 checkpoint:** Can you implement debounce?
`;

describe('parseRoadmap', () => {
  it('parses weeks with goal, days, and checkpoint', () => {
    const weeks = parseRoadmap(SAMPLE);
    expect(weeks).toHaveLength(2);
    expect(weeks[0]).toMatchObject({ number: 1, title: 'Foundations + Project Story', goal: 'Solidify basics.' });
    expect(weeks[0].days).toHaveLength(2);
    expect(weeks[0].days[1]).toEqual({
      day: 'Tue',
      focus: 'HTML/CSS core',
      files: '`01-html-css/topics-not-to-miss.md`, first 10 questions',
    });
    expect(weeks[0].checkpoint).toBe('Can you explain your main project in 2 minutes?');
    expect(weeks[1].number).toBe(2);
  });
  it('fail-soft on garbage input', () => {
    expect(parseRoadmap('no weeks here')).toEqual([]);
  });
});
