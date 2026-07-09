/** Prefix a root-absolute path with Astro's configured base.
 * BASE_URL is '/' at root deployments, making this an identity there.
 * Works in .astro files AND client islands (Vite inlines import.meta.env). */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL ?? '/';
  const b = base.endsWith('/') ? base.slice(0, -1) : base;
  return `${b}${path.startsWith('/') ? path : `/${path}`}`;
}
