import { describe, expect, it } from 'vitest';
import { parseBehavioralQuestions, parseMockKit, parseRubric } from './prep';

const QUESTIONS_MD = [
  '# Behavioral Interview Questions (STAR Format)',
  '## How to Use This File',
  'Some prose.',
  '## 1. Tell me about a time you worked in a team.',
  'Guidance…',
  '## 2. Describe a time you faced a tight deadline.',
  '## 11. How do you prioritize when you have multiple tasks?',
].join('\n');

const KIT_MD = [
  '# Backend Mock Round',
  'Intro prose.',
  '## Section 1: Warm-up (5 min)',
  '- Question a',
  '## Section 2: Node.js & Express Fundamentals (10 min)',
  '## Section 7: Project Wrap-up (2 min)',
].join('\n');

const RUBRIC_MD = [
  '# Mock Interview Evaluation Rubric',
  '## Core Dimensions (Score All Rounds)',
  '### 1. Technical Accuracy',
  'table…',
  '### 2. Problem-Solving & Live Tasks',
  '## Optional Dimensions',
  '### 11. Culture Add',
].join('\n');

describe('parseBehavioralQuestions', () => {
  it('captures numbered question headings and skips others', () => {
    const qs = parseBehavioralQuestions(QUESTIONS_MD);
    expect(qs).toHaveLength(3);
    expect(qs[0]).toEqual({ n: 1, text: 'Tell me about a time you worked in a team.' });
    expect(qs[2].n).toBe(11);
  });
  it('never throws on garbage', () => {
    expect(parseBehavioralQuestions('')).toEqual([]);
    expect(parseBehavioralQuestions('# just a title')).toEqual([]);
  });
});

describe('parseMockKit', () => {
  it('captures sections with minutes and totals them, title from H1', () => {
    const kit = parseMockKit('backend-round', KIT_MD)!;
    expect(kit.title).toBe('Backend Mock Round');
    expect(kit.sections).toHaveLength(3);
    expect(kit.sections[1]).toEqual({ n: 2, title: 'Node.js & Express Fundamentals', minutes: 10 });
    expect(kit.totalMinutes).toBe(17);
    expect(kit.slug).toBe('backend-round');
  });
  it('returns null when no sections parse (fail-soft)', () => {
    expect(parseMockKit('x', '# Title only')).toBeNull();
    expect(parseMockKit('x', '')).toBeNull();
  });
});

describe('parseRubric', () => {
  it('captures core dimensions only, stopping at Optional', () => {
    const dims = parseRubric(RUBRIC_MD);
    expect(dims).toEqual([
      { n: 1, name: 'Technical Accuracy' },
      { n: 2, name: 'Problem-Solving & Live Tasks' },
    ]);
  });
  it('never throws on garbage', () => {
    expect(parseRubric('')).toEqual([]);
  });
});
