# 07 — AI Agent Build Workflow

The order to actually build this project in, whether you're an AI coding agent or a solo developer following along. Do not skip ahead to `features/` before the foundation phase is real and passing lint/tests — every later phase depends on the tokens and primitives being correct first.

## Phase 1 — Foundation

1. `ng new portfolio --standalone --style=scss --ssr --routing` (adjust app name as needed).
2. Set up ESLint (`ng add angular-eslint`), Prettier, `husky` + `lint-staged`, and a CI workflow that runs `ng lint && ng test && ng build`.
3. Create `src/styles/tokens/*.scss` and `src/styles/base/*.scss` exactly per `04-design-system-tokens.md`; wire them into `src/styles/styles.scss` and register that as the global style in `angular.json`.
4. Scaffold the `core/shared/features` folders per `02-project-folder-structure.md` (empty is fine at this point — the structure existing is what matters).
5. Build the `shared/ui` primitives in this order, each with its spec: `PanelComponent` → `PillButtonComponent`/`PillNavComponent` → `IconChipComponent` → `StatusDotComponent` → `HighlightTextComponent` → `GradientBlobComponent` → `AccordionComponent` → `TechBadgeComponent` → `ThemeToggleComponent`. Verify each one renders correctly in isolation (a quick host page or Storybook-style harness is fine) before moving to the next.

## Phase 2 — Core data & shell

6. Define `core/models/*.ts` (`Project`, `Experience`, `BlogPost`, `TechEntry`) matching the shape of the `assets/data/*.json` files you'll fill in.
7. Build `ContentService` to load and expose those JSON files as signals; build `GithubService` (cached HTTP call to the GitHub contributions endpoint) and `SeoService` (Meta/Title wrapper) and `ThemeService`.
8. Build `layout/nav` and `features/footer`, and wire `app.component` to render nav → `router-outlet` → footer.

## Phase 3 — Sections, in blueprint order

9. Build `features/hero` (Concept C v2 from the strategy doc: identity card + highlight-boxed specialization line + gradient blob + log-line + pill CTAs).
10. Build `features/proof-strip` (GitHub graph + tech stack row).
11. Build `features/how-i-engineer` (2x2 process grid, one panel using the `isHighlighted` accent treatment).
12. Build `features/selected-work` and `features/selected-work/project-case-study` (teaser + accordion-expanded case study — this is the single highest-leverage section per the strategy doc, budget the most care here).
13. Build `features/try-it` (the one real interactive demo — confirm with the content owner what it actually demonstrates before building it; do not default to a generic placeholder widget).
14. Build `features/writing`, `features/experience`, `features/about-taste`, `features/contact`.

## Phase 4 — Routing & SSR

15. Add `/projects/:slug` and `/blog/:slug` routes reusing the Phase 3 components; confirm SSR/prerendering produces correct HTML for all three route types (`ng build` then inspect `dist/`).
16. Wire `SeoService` calls into each routed component (unique title/description/OG/JSON-LD per route).

## Phase 5 — Quality gates

17. Run every item in `06-quality-checklist.md`. Fix accessibility and Lighthouse findings before moving on — do not treat this phase as optional polish.
18. Grep the whole `src/` and `assets/` tree for `[YOUR:` and resolve every remaining placeholder from the strategy doc.
19. Final pass: re-read `03-coding-standards.md`'s comment policy against the actual diff — remove any comment that explains "what" instead of "why," and confirm no `shared/ui` component is missing its one-line JSDoc.

## Working agreement for an AI agent specifically

- Read this whole `instructions/` folder (and `portfolio-strategy-report.md`) at the start of a session before generating any code — don't infer the structure from partial context.
- When a requirement here and a request in chat conflict, prefer what's written here unless the user explicitly overrides it in the moment (and if they do, propose updating this file so the override becomes the new standard, rather than silently diverging).
- Prefer small, reviewable commits per component over one giant commit for a whole phase.
- If a genuinely new pattern is needed that isn't covered by `05-component-inventory.md`, add it to that file in the same change, so the inventory stays the accurate source of truth.
