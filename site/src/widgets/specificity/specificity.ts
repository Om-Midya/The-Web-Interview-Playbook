export type Spec = [number, number, number];

/** Simplified CSS specificity. Documented limitations (shown in the UI):
 * :not()/:is()/:has() wrappers count zero but their arguments count as written;
 * :where() and everything inside it counts zero; `*` and combinators count zero. */
export function specificity(selector: string): Spec {
  let s = ` ${selector} `;
  s = s.replace(/:where\([^)]*\)/g, ' ');
  s = s.replace(/:(not|is|has)\(/g, ' (');
  const take = (re: RegExp): number => {
    const n = (s.match(re) ?? []).length;
    s = s.replace(re, ' ');
    return n;
  };
  const pseudoElements = take(/::[a-zA-Z][\w-]*/g);
  const ids = take(/#[a-zA-Z][\w-]*/g);
  const attrs = take(/\[[^\]]*\]/g);
  const classes = take(/\.[a-zA-Z][\w-]*/g);
  const pseudoClasses = take(/:[a-zA-Z][\w-]*/g);
  const elements = (s.match(/[a-zA-Z][\w-]*/g) ?? []).length;
  return [ids, classes + attrs + pseudoClasses, elements + pseudoElements];
}

export function compareSpec(x: Spec, y: Spec): -1 | 0 | 1 {
  for (let i = 0; i < 3; i++) {
    if (x[i] !== y[i]) return x[i] > y[i] ? 1 : -1;
  }
  return 0;
}
