import { useState } from 'react';
import { specificity, compareSpec, type Spec } from './specificity';

function Pills({ spec }: { spec: Spec }) {
  const lead = spec[0] > 0 ? 0 : spec[1] > 0 ? 1 : 2;
  const names = ['IDs', 'classes', 'elements'];
  return (
    <span className="spec-pills">
      {spec.map((n, i) => (
        <span key={i} className={`spec-pill${i === lead && n > 0 ? ' lead' : ''}`} title={names[i]}>
          {n}
        </span>
      ))}
    </span>
  );
}

export default function SpecificityCalculator() {
  const [left, setLeft] = useState('#nav .item');
  const [right, setRight] = useState('div ul li.active');
  const ls = specificity(left);
  const rs = specificity(right);
  const cmp = compareSpec(ls, rs);
  const verdict =
    cmp === 0
      ? 'Tie — with equal specificity, the LATER rule in the stylesheet wins (source order).'
      : cmp === 1
        ? 'Left wins. Compare left-to-right: one ID beats any number of classes; one class beats any number of elements.'
        : 'Right wins. Compare left-to-right: one ID beats any number of classes; one class beats any number of elements.';

  return (
    <div className="spec-grid">
      <div className="spec-row">
        <input className="spec-input" aria-label="First selector" value={left} onChange={(e) => setLeft(e.target.value)} />
        <Pills spec={ls} />
      </div>
      <div className="spec-row">
        <input className="spec-input" aria-label="Second selector" value={right} onChange={(e) => setRight(e.target.value)} />
        <Pills spec={rs} />
      </div>
      <p className="spec-verdict" aria-live="polite">{verdict}</p>
      <p className="spec-limits">
        Scores are (IDs, classes+attributes+pseudo-classes, elements+pseudo-elements). Simplified: `:not()/:is()/:has()`
        wrappers count zero but their arguments count; `:where()` counts zero entirely; inline styles and `!important`
        sit outside this comparison.
      </p>
    </div>
  );
}
