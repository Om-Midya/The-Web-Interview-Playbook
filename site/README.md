# Playbook Site

Static [Astro](https://astro.build) site that renders the markdown in
`../web-dev-interview-playbook/` as an interactive learning site. The
markdown is the source of truth — this app never modifies it.

## Commands

| Command | Action |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Dev server at `localhost:4321` (search is unavailable in dev) |
| `npm run build` | Build to `dist/` and index search (Astro + Pagefind) |
| `npm run preview` | Serve `dist/` — includes search (custom static server; `astro preview` can't see post-build Pagefind assets) |
| `npm run test` | Vitest unit tests |

## Deploying

Any static host works (`dist/` is the whole site). Two requirements:

- **Node ≥ 22.12** (Astro 7 engine floor).
- **Full git history at build time** — freshness badges read `git log` per file.
  On shallow clones (CI default) badges are skipped rather than shown wrong;
  use `fetch-depth: 0` (GitHub Actions) or equivalent to enable them.
