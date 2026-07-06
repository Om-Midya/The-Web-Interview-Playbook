import { animate } from 'animejs';

type AnimateParams = Parameters<typeof animate>[1];

/** anime.js v4 wrapper that no-ops for users preferring reduced motion. */
export function maybeAnimate(targets: Parameters<typeof animate>[0], params: AnimateParams): void {
  if (typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }
  animate(targets, params);
}
