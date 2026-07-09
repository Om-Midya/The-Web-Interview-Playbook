# The Web Interview Playbook

**Train for it. Don't just read it.**

An interactive learning site built on top of a structured web-dev interview-prep
guide for 2nd/3rd-year engineering students. The written guide teaches the
material; the site makes you *do* it — predict outputs before answers unlock,
watch the event loop and a load balancer actually run, rehearse STAR stories
against a real 75-second clock, and track your progress across ~100 documents.

**Live staging/demo:** https://om-midya.github.io/The-Web-Interview-Playbook/

## What's on the site

- **26 interactive visualizers** across the technical sections — among them the
  JavaScript event loop, closures and coercion steppers, a CSS grid/flexbox
  playground, React re-render and `key` reconciliation demos, an Express
  middleware pipeline, a JWT sign–verify–tamper lab (real WebCrypto), a browser
  rendering-pipeline stepper, and live simulations of load balancing, caching,
  CAP theorem, a double-booking race, and WebSocket pub/sub.
- **Two prep tools** — a [STAR Answer Builder](https://om-midya.github.io/The-Web-Interview-Playbook/star-builder/)
  (draft stories against the guide's timing budgets, map them to every
  behavioral question, export your bank) and a
  [Timed Mock Interview Simulator](https://om-midya.github.io/The-Web-Interview-Playbook/mock-interviews/)
  (run any mock round on its real section clocks, score yourself on the rubric,
  watch your radar chart grow between attempts).
- **An interactive content layer** generated from the markdown at build time:
  every checklist item becomes a persistent checkbox feeding per-section
  progress rings; interview-question docs render as think-first reveal cards;
  tricky-output questions lock their answers until you *type a prediction*;
  the roadmap doc becomes a clickable 4-week planner.
- Full-text search (Cmd/Ctrl+K), light/dark "coach's chalkboard" themes,
  freshness badges on recently updated docs. Everything is fully static —
  progress lives in your browser's localStorage.

## Repository layout

```
web-dev-interview-playbook/   The guide itself — plain markdown, 13 sections.
                              SOURCE OF TRUTH. The site never modifies it.
site/                         The Astro 7 app that renders the guide
                              interactively. See site/README.md for commands.
```

Two READMEs go deeper: [the guide's](web-dev-interview-playbook/README.md)
(content philosophy, how to study with it) and [the site's](site/README.md)
(commands, deployment requirements).

## Running locally

```bash
cd site
npm install
npm run dev        # localhost:4321 (search unavailable in dev)
npm run test       # Vitest suite
npm run build      # static build + search index → dist/
npm run preview    # serve dist/ with working search
```

Node ≥ 22.12 (pinned in `site/.node-version`).

## How pages come to exist (and how to add one)

The site glob-loads the guide as an [Astro content collection] — **markdown in,
pages out**. There is no per-page wiring.

### Add a document to an existing section

Drop a `.md` file into the section's folder (e.g.
`web-dev-interview-playbook/04-react/my-new-topic.md`). That's the whole
process: it gets a page, appears in the sidebar and the section's doc list,
is indexed for search, and its checklists/questions pick up interactivity
automatically if they follow the conventions below.

### Add a whole new section

Create a numbered folder with a `README.md`
(e.g. `web-dev-interview-playbook/13-company-questions/README.md` plus docs).
New sections self-register: navigation, search, progress tracking, and a
section index page all appear without touching the site code.

### Conventions that unlock interactivity

The build-time transforms key off ordinary markdown patterns:

| You write… | The site renders… |
| --- | --- |
| `- [ ] task` checklists | Persistent checkboxes + progress rings |
| `### Question` / `**Answer:**` / `**Follow-ups:**` in an `interview-questions.md` | Think-first reveal cards |
| `**Answer:** … **Why:** …` in a `tricky-output-questions.md` | Type-a-prediction gates (answer locked until the reader commits a guess) |
| The `ROADMAP.md` week tables | The interactive planner at `/roadmap/` |

### Add an interactive widget (site code)

Widgets follow a strict three-step recipe, enforced by tests:

1. Create the component in `site/src/widgets/<name>/` (default export). Most
   widgets ride an existing engine — `Stepper` (hand-authored state traces),
   `PlaygroundFrame` (controls → live preview), or `Simulation` + `topo-svg`
   (deterministic tick-based animations). Hand-authored trace/model data gets
   its own `.ts` file with semantic unit tests.
2. Add one `lazy()` line to the `REGISTRY` in `site/src/widgets/WidgetHost.tsx`.
3. Add one metadata entry to `SECTION_WIDGETS` in `site/src/widgets/manifest.ts`
   (which section page shows it, title, description).

Drift-guard tests fail if a widget is registered but unplaced or placed but
unregistered, and if any manifest key isn't a real section folder. One rule of
thumb from this codebase: the teaching data is the product — model semantics
and trace notes are tested against real behavior, not just structure.

### Add a standalone tool page

Tool pages (like `/star-builder/`) are Astro pages that parse guide documents
at build time and pass the data to a React island:
`site/src/pages/<tool>.astro` + a widget folder + a card entry in
`SECTION_TOOLS` (`site/src/widgets/manifest.ts`) so the section page links it.
Parsers live in `site/src/lib/` and must fail soft — a malformed source doc
renders a link to the original, never a broken page.

### Two house rules for any new page or component

- **Internal links go through `withBase()`** (`site/src/lib/base.ts`) — never a
  raw `href="/…"`. This keeps the site deployable at a domain root *or* under a
  subpath (the staging deploy checks for leaks and fails loudly on violations).
- **Styling uses the design tokens** in `site/src/styles/tokens.css`
  (light "playbook paper" / dark "chalkboard"). Token names are a contract —
  retune values freely, never rename.

## Quality bar

~216 unit tests run in CI and locally (`npm run test`): parser and transform
tests against real corpus shapes, semantic tests on every hand-authored widget
trace (the event-loop, coercion, and CAP models are verified against actual
language/system behavior), storage round-trips, and the wiring drift guards.
Everything is fail-soft: a malformed doc, missing git metadata, or blocked
localStorage never breaks a build or crashes a page.

## Deployment

The build output (`site/dist/`) is a fully static site deployable anywhere.
Two knobs make it location-independent: `ASTRO_SITE` (canonical origin) and
`ASTRO_BASE` (subpath), both optional env vars read by `site/astro.config.mjs`.

This repository's `staging` branch deploys the demo to GitHub Pages on every
push to that branch (workflow lives only on that branch; sync it with
`git checkout staging && git merge main && git push`). Production deployments
are up to the repository owner's own strategy — `main` intentionally carries
no deployment configuration.

[Astro content collection]: https://docs.astro.build/en/guides/content-collections/
