# 01 — Tech Stack & Principles

## Framework

**Angular only** — latest stable major (Angular 18+/19), generated with `ng new --standalone --style=scss --ssr`. No React, Vue, Svelte, or meta-frameworks. No NgModules anywhere in application code — the app is 100% standalone components, directives, and pipes.

| Concern | Choice | Why |
|---|---|---|
| Components | Standalone only | Current Angular idiom; removes NgModule boilerplate, matches what a senior Angular dev ships in 2025+ |
| State | Signals (`signal`, `computed`, `effect`) | Simpler mental model than RxJS for UI state, fine-grained reactivity, no subscription cleanup to manage |
| Async data | RxJS at the edges (HTTP, router events) → converted to signals via `toSignal()` as soon as it enters component-land | Keeps signals as the single state model app-wide; RxJS only where Angular's platform APIs are inherently stream-based |
| Change detection | `OnPush` on every component, no exceptions | Forces signal/immutable-data discipline, keeps the (mostly static, content-heavy) site fast |
| Templates | New control-flow (`@if`, `@for`, `@switch`) | `*ngIf`/`*ngFor` are legacy syntax as of recent Angular versions; a 5-years-experience dev builds new projects with the current syntax, not the deprecated one |
| Dependency injection | `inject()` function at field-initializer time, not constructor injection | Idiomatic in standalone components, works cleanly with functional guards/resolvers |
| Styling | SCSS, component-scoped (Angular's default `Emulated` view encapsulation) + a small global token layer | No utility-CSS framework (Tailwind, etc.) — this project's design language is dense/editorial (see design tokens doc), which SCSS + BEM-ish class names expresses more precisely than utility classes, and it keeps templates readable |
| Accessible primitives | `@angular/cdk` (`a11y`, `overlay`, `layout`) | Don't hand-roll focus-trapping, disclosure semantics, or breakpoint logic — the CDK gives it for free and correctly |
| Images | `NgOptimizedImage` | Built-in Angular directive for responsive, lazy-loaded images with LCP priority hints — required for the perf targets in `06-quality-checklist.md` |
| Rendering | Angular SSR (`@angular/ssr`) + prerendering for static routes | This site's whole purpose is external discoverability (recruiters, search engines, `llms.txt` consumers) — SSR/prerendering is not optional |
| Testing | Jest (via `@angular-builders/jest` or the Angular CLI's Jest builder) + Angular Testing Library | Faster feedback loop than Karma/Jasmine, and Testing Library encourages testing behavior over implementation detail |
| Linting/formatting | ESLint (`angular-eslint`) + Prettier, enforced via `husky` + `lint-staged` pre-commit | Non-negotiable for a project claiming "industry standard" quality |
| Package manager | pnpm (or npm if the team standardizes on it) | Faster installs, stricter dependency resolution than npm; either is acceptable, just be consistent |

## Principles a 5-years-experience Angular dev applies here

1. **Smart/dumb component split, strictly.** Every component is either a *feature* component (owns data/business logic, lives in `features/`) or a *presentational* component (pure function of its inputs, lives in `shared/ui/`). A presentational component never injects a data service.
2. **Signals over RxJS for state, RxJS only for streams.** If something is "a value that changes over time and the template reads it," it's a signal. If something is "a sequence of async events" (HTTP calls, router navigation, keyboard/scroll streams), it's RxJS until it's consumed, then it becomes a signal via `toSignal()`.
3. **No prop-drilling — use signal-based inputs and content projection.** Deeply nested `@Input()` chains are a smell; prefer composition (`ng-content`, `ng-template` context) or a scoped service with `providedIn: 'component'` for shared local state within a feature.
4. **Immutability by default.** Never mutate an array/object held in a signal in place — always produce a new reference (`update()` with spread/map/filter), so `OnPush` and signal equality checks behave correctly.
5. **One responsibility per file.** A component's `.ts` should not also contain unrelated pure functions — extract them to a `*.util.ts` or a pipe if they're display logic.
6. **No dead code, no commented-out code, no console.log left behind.** All three fail code review by default in a professional codebase.
7. **Reusability is a design requirement, not a nice-to-have.** Before adding a new component, check `05-component-inventory.md` and `shared/ui/` — most visual patterns on this site (panel, pill button, status dot, icon chip, accordion) repeat across sections and must be built once.

See `03-coding-standards.md` for the concrete rules this produces, and `07-ai-agent-workflow.md` for the order to build things in.
