export type Spec = [number, number, number];

function specificityOfOne(selector: string): Spec {
  let s = ` ${selector} `;
  s = s.replace(/:where\([^)]*\)/g, ' ');
  s = s.replace(/:(not|is|has)\(/g, ' (');
  const take = (re: RegExp): number => {
    const n = (s.match(re) ?? []).length;
    s = s.replace(re, ' ');
    return n;
  };
  const pseudoElements = take(/::[a-zA-Z][\w-]*/g);
  const attrs = take(/\[[^\]]*\]/g); // before ids/classes: values may contain # or .
  const ids = take(/#[a-zA-Z_-][\w-]*/g);
  const classes = take(/\.[a-zA-Z_-][\w-]*/g);
  const pseudoClasses = take(/:[a-zA-Z][\w-]*(?:\([^)]*\))?/g); // consume args: :nth-child(2n+1)
  const elements = (s.match(/[a-zA-Z_][\w-]*/g) ?? []).length;
  return [ids, classes + attrs + pseudoClasses, elements + pseudoElements];
}

/** Simplified CSS specificity. Documented limitations (shown in the UI):
 * :not()/:is()/:has() wrappers count zero but their arguments count as written;
 * :where() and everything inside it counts zero; `*` and combinators count zero;
 * comma lists score as their highest member (each selector really scores alone). */
export function specificity(selector: string): Spec {
  const parts = selector.split(',').map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) return [0, 0, 0];
  return parts.map(specificityOfOne).reduce((best, cur) => (compareSpec(cur, best) === 1 ? cur : best));
}

export function compareSpec(x: Spec, y: Spec): -1 | 0 | 1 {
  for (let i = 0; i < 3; i++) {
    if (x[i] !== y[i]) return x[i] > y[i] ? 1 : -1;
  }
  return 0;
}
