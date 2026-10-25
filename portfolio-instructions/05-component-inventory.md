# 05 — Component Inventory

Every component the site needs, mapped to the Final Master Blueprint (Section 28 of `portfolio-strategy-report.md`). Build `shared/ui` primitives before the `features` that consume them — see `07-ai-agent-workflow.md` for the actual build order.

## `shared/ui/` — presentational primitives (build once, reuse everywhere)

| Component | Inputs | Notes |
|---|---|---|
| `PanelComponent` | `label?: string`, content via `ng-content` | The dashboard-card primitive. Used by Proof Strip, How I Engineer, Selected Work, Experience, About/Taste. |
| `PillButtonComponent` | `label`, `variant: 'primary' \| 'secondary'`, `icon?`, `href?` | Renders as `<a>` or `<button>` depending on whether `href` is set. |
| `PillNavComponent` | `links: {label, routerLink}[]` | The capsule nav; composed into `layout/nav`. |
| `IconChipComponent` | `icon` (name or projected SVG) | Small bordered square, used next to contact rows, tech logos, experience entries. |
| `StatusDotComponent` | `status: 'live' \| 'pinned' \| 'none'` | Renders nothing visible for `'none'` — always include the input rather than conditionally omitting the component, so layout doesn't shift. |
| `HighlightTextComponent` | content via `ng-content` | Boxed-keyword span — hero headline only (see `04-design-system-tokens.md`). |
| `GradientBlobComponent` | `size?`, `position?` | Decorative hero background, `aria-hidden="true"`. |
| `AccordionComponent` / `AccordionItemComponent` | `title`, `expanded` (two-way via `model()`) | Thin wrapper over `@angular/cdk/accordion` — used by Experience and Project Case Study. |
| `TechBadgeComponent` | `name`, `icon` | Tech-stack row + per-project tech tags. |
| `ThemeToggleComponent` | none (reads/writes `ThemeService`) | Nav-corner dark/light switch. |

## `features/` — smart, data-aware section components

| Section (blueprint #) | Component | Data source | Composes |
|---|---|---|---|
| 00 Nav | `layout/nav` | — | `PillNavComponent`, `PillButtonComponent`, `ThemeToggleComponent` |
| 01 Hero | `features/hero` | `ContentService` (identity/specialization copy), `GithubService` (contribution count) | `GradientBlobComponent`, `HighlightTextComponent`, `PanelComponent` (identity card), `PillButtonComponent` |
| 02 Proof Strip | `features/proof-strip` | `GithubService`, `ContentService` (tech list) | `PanelComponent`, `TechBadgeComponent` |
| 03 How I Engineer | `features/how-i-engineer` | `ContentService` (static process steps) | `PanelComponent` (one instance rendered with an `isHighlighted` modifier class using `--color-accent`) |
| 04 Selected Work | `features/selected-work` + `features/selected-work/project-case-study` | `ContentService` (projects.json) | `PanelComponent`, `StatusDotComponent`, `TechBadgeComponent`, `AccordionComponent` |
| 05 Try It | `features/try-it` | Self-contained (the one real interactive demo — content depends on your final specialization) | `PanelComponent` + whatever the demo itself needs |
| 06 Writing | `features/writing` | `ContentService` (blog metadata) or a routed markdown-rendering detail page | `PanelComponent`, `IconChipComponent` |
| 07 Experience | `features/experience` | `ContentService` (experience.json) | `AccordionComponent`, `StatusDotComponent`, `IconChipComponent` |
| 08 About/Taste | `features/about-taste` | `ContentService` (bio paragraph + bookmarks.json) | `PanelComponent` |
| 09 Contact | `features/contact` | `ContentService` (identity/contact info) | `PillButtonComponent`, `IconChipComponent` — plus a fixed-position mobile CTA bar variant |
| 10 Footer | `features/footer` | Static | Plain markup; links to `/llms.txt`, `/robots.txt`, RSS feed route |

## Routing

- `/` — the single-page scroll composing all `features/*` in order.
- `/projects/:slug` — deep-linkable, SSR-prerendered version of a single `project-case-study` (so a recruiter can be sent a direct link, and so it's independently indexable/SEO-able).
- `/blog/:slug` — routed post detail, same reasoning.

Both detail routes reuse the exact same `shared/ui` and `project-case-study`/`writing` components as the home page sections — never a forked/duplicated template.
