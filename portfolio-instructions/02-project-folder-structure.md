# 02 — Project Folder Structure

This is the exact tree. Do not invent parallel structures (e.g. a second "components" folder at root) — every new file has exactly one correct home below.

```
src/
├── app/
│   ├── app.component.ts / .html / .scss     # root shell: <app-nav/>, <router-outlet/>, <app-footer/>
│   ├── app.config.ts                        # providers: router, http, animations, SSR hydration
│   ├── app.routes.ts                        # top-level routes (home, /projects/:slug, /blog/:slug)
│   │
│   ├── core/                                # singleton, app-wide, no UI
│   │   ├── services/
│   │   │   ├── content.service.ts           # loads projects/experience/tech-stack JSON, exposes signals
│   │   │   ├── github.service.ts            # fetches + caches the GitHub contribution graph data
│   │   │   ├── seo.service.ts               # wraps Angular Meta/Title for per-route metadata + JSON-LD
│   │   │   └── theme.service.ts             # dark/light toggle, persists preference
│   │   ├── models/
│   │   │   ├── project.model.ts
│   │   │   ├── experience.model.ts
│   │   │   ├── blog-post.model.ts
│   │   │   └── tech.model.ts
│   │   └── guards/ · interceptors/          # only if/when actually needed — do not pre-create empty stubs
│   │
│   ├── shared/                              # presentational only — zero knowledge of app data models
│   │   ├── ui/
│   │   │   ├── panel/                       # the dashboard-card primitive used everywhere
│   │   │   ├── pill-button/
│   │   │   ├── pill-nav/
│   │   │   ├── icon-chip/
│   │   │   ├── status-dot/
│   │   │   ├── highlight-text/              # boxed-keyword span, hero-only usage but built generically
│   │   │   ├── gradient-blob/               # decorative background primitive, purely presentational
│   │   │   ├── accordion/                   # wraps @angular/cdk accordion — used by Experience + case studies
│   │   │   ├── tech-badge/
│   │   │   └── theme-toggle/
│   │   ├── pipes/
│   │   │   └── relative-date.pipe.ts
│   │   └── directives/
│   │       └── reduced-motion.directive.ts  # respects prefers-reduced-motion, see 06-quality-checklist.md
│   │
│   ├── features/                            # one folder per page section = one "smart" component
│   │   ├── nav/
│   │   ├── hero/
│   │   ├── proof-strip/                     # GitHub graph + tech stack row
│   │   ├── how-i-engineer/                  # the 2x2 process grid (Addendum A feature)
│   │   ├── selected-work/
│   │   │   ├── selected-work.component.*    # teaser grid
│   │   │   └── project-case-study/          # the expandable Problem→Result view, also used as a routed detail page
│   │   ├── try-it/                          # the one interactive technical demo
│   │   ├── writing/                         # blog teaser list + routed post detail
│   │   ├── experience/                      # accordion timeline
│   │   ├── about-taste/                     # human paragraph + bookmarks
│   │   ├── contact/                         # equal-weight links + persistent mobile CTA bar
│   │   └── footer/
│   │
│   └── layout/
│       └── shell/                           # composes nav + main + footer if app.component grows past trivial
│
├── assets/
│   ├── data/                                # static JSON content — see below
│   │   ├── projects.json
│   │   ├── experience.json
│   │   ├── tech-stack.json
│   │   └── bookmarks.json
│   ├── icons/
│   └── images/
│
├── styles/
│   ├── tokens/
│   │   ├── _colors.scss
│   │   ├── _spacing.scss
│   │   ├── _typography.scss
│   │   └── _radius.scss
│   ├── base/
│   │   ├── _reset.scss
│   │   └── _global.scss
│   └── styles.scss                          # single entry point, imports tokens + base, registered in angular.json
│
public/
├── llms.txt
├── robots.txt
└── sitemap.xml                              # generated at build time, see 06-quality-checklist.md
```

## Rules

- **`core/`** holds only singletons and things with no template — services, models, guards/interceptors. Nothing in `core/` renders UI.
- **`shared/ui/`** components must compile and render correctly with fabricated/mock inputs alone — if a component needs to import a `core` service to look right in Storybook-style isolation, it's not a `shared` component, it's a `feature` component.
- **`features/`** components own their section's data fetching (via `core` services) and compose `shared/ui` primitives to render it. A feature component's template should read like a list of `<app-*>` tags, not raw markup.
- **Content lives in JSON, not hardcoded in components.** Projects, experience entries, tech stack, and bookmarks are all data — putting them in `assets/data/*.json` (loaded through `ContentService`) means updating your resume/projects later never touches component code, and it makes the `[YOUR: ...]` placeholders from the strategy doc trivial to fill in in one place.
- **One component = one folder**, containing `*.component.ts`, `*.component.html` (unless truly trivial, e.g. under ~5 lines, in which case an inline template is fine), `*.component.scss`, and `*.component.spec.ts`. No orphaned `.ts` files sitting outside a folder.
- **Barrel files (`index.ts`) are allowed only inside `shared/ui/`** to keep feature-level imports clean (`import { Panel, PillButton } from '@shared/ui'`) — do not add barrels inside `features/`, where explicit deep imports keep dependency direction obvious.
