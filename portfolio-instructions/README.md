# Engineering Instructions — Angular Portfolio Build

This folder is the source of truth for **how** this project gets built, as distinct from `portfolio-strategy-report.md` (which defines **what** gets built — sections, copy, design tokens, recruiter psychology). Any human developer or AI coding agent working on this repository must read these files before writing code, and every pull request should be checkable against them.

**Non-negotiables, in one paragraph:** Angular only (standalone APIs, no NgModules), signals for state, `OnPush` on every component, the new `@if`/`@for`/`@switch` control-flow syntax, strict TypeScript, a strict `core/shared/features` folder split, comments kept minimal and reserved for "why" not "what," every visual pattern built once as a generic component in `shared/ui` rather than copy-pasted, and every release semantically versioned with a `CHANGELOG.md` entry split into **Fixed**/**Enhanced**. If a change violates one of these without a documented reason, it should not be merged.

**"Production grade, simple product"** means the opposite of over-engineering: no state-management library, no CSS framework, no speculative abstractions for features that don't exist yet — but real discipline where it actually matters: strict typing, tests on shared code, accessibility, SSR/SEO, and an honest release process. Simplicity and rigor are not in tension here; the whole point of `core/shared/features` and the token system is that they make the simple version *also* the correct one.

## Reading order

1. `01-tech-stack-and-principles.md` — the stack, the Angular idioms required, and why.
2. `02-project-folder-structure.md` — the exact directory tree and what belongs where.
3. `03-coding-standards.md` — naming, comments, component patterns, reusability rules.
4. `04-design-system-tokens.md` — the concrete SCSS token file, translated from the strategy doc.
5. `05-component-inventory.md` — every component the site needs, mapped to the blueprint sections.
6. `06-quality-checklist.md` — accessibility, performance, SEO, testing, and CI gates.
7. `07-ai-agent-workflow.md` — the build order an agent (or a solo dev) should follow, phase by phase.
8. `08-versioning-and-release-notes.md` — semantic versioning, the commit→changelog mapping, and the release checklist.
9. `CHANGELOG.md` — starter changelog file; copy it to the project root and keep appending to it (see file 8).

## Relationship to the strategy report

`portfolio-strategy-report.md` (in the parent folder) is the content/UX/positioning brief — hero copy direction, project case-study structure, the "Engineering Logbook" concept, the four adopted visual features (pill nav, highlight-boxed headline, gradient blob, 2x2 process grid). This `instructions/` folder assumes that brief and answers only the engineering question: *given that brief, how does a senior Angular developer actually build it?* Keep both in the repo — the strategy doc tells you what a section should say and look like; these files tell you what file it lives in, what it's called, and what rules its code must follow.
