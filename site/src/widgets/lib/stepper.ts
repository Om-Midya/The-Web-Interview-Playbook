export interface StepperStep<S> {
  /** 1-based code line to highlight; null = no line (e.g. "stack empty"). */
  line: number | null;
  note: string;
  state: S;
}

export interface StepperSample<S> {
  id: string;
  label: string;
  code: string;
  steps: StepperStep<S>[];
}

export function clampStep(index: number, total: number): number {
  if (index < 0) return 0;
  if (index > total - 1) return total - 1;
  return index;
}

/** Data-integrity check for hand-authored traces. Returns problems; [] = valid. */
export function validateSample(sample: StepperSample<unknown>): string[] {
  const problems: string[] = [];
  const lineCount = sample.code.split('\n').length;
  if (sample.steps.length === 0) problems.push(`${sample.id}: no steps`);
  sample.steps.forEach((step, i) => {
    if (step.line !== null && (step.line < 1 || step.line > lineCount)) {
      problems.push(`${sample.id}: step ${i} line ${step.line} outside 1..${lineCount}`);
    }
  });
  return problems;
}
