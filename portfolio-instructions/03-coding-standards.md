# 03 — Coding Standards

## Naming

- Files: `kebab-case`, suffixed by type — `project-case-study.component.ts`, `content.service.ts`, `project.model.ts`, `relative-date.pipe.ts`.
- Classes/types/interfaces: `PascalCase` — `ProjectCaseStudyComponent`, `Project`, `TechBadge`.
- Signals, variables, functions, methods: `camelCase`. Don't decorate signal names with a `$` suffix (that's an RxJS `Observable` convention) — reserve `$` for actual `Observable`s (e.g. `scroll$`) so the two reactive primitives stay visually distinguishable.
- Booleans: prefix `is`/`has`/`should`/`can` — `isExpanded`, `hasLiveDemo`, `shouldReduceMotion`.
- Angular selectors: prefixed `app-` for features/layout, and also `app-` for shared UI (Angular's default convention) — e.g. `app-panel`, `app-pill-button`.

## Comments — the explicit policy you asked for

**Default to no comment.** Clear naming and small functions should make most code self-explanatory. When a comment is used, it must earn its place:

- **Write a comment only to explain *why*, never *what*.** `// debounce to avoid hammering the GitHub API on every keystroke` is good. `// loop through projects` above a `for` loop is not — delete it.
- **JSDoc is required, and only required, on the public surface of `shared/ui` components and `core` services** — i.e. `@Input`/signal-input properties, `@Output`/signal-output events, and exported service methods that another developer will call without reading the implementation. One line is usually enough: `/** Renders a dashboard-style panel with an optional label header. */`.
- **No commented-out code, ever.** Delete it — git history is the undo button, not a `//`.
- **`TODO` comments must name an owner or a ticket** (`// TODO(shantanu): wire real GitHub token once API quota is confirmed`) or they get removed before merge — an untraceable TODO is noise.
- **No comment banners** (`// ============ SECTION ============`) — if a file needs section dividers to stay readable, it's a sign the file should be split.

## Components

- `standalone: true`, `changeDetection: ChangeDetectionStrategy.OnPush` on every `@Component` — no exceptions, including trivial ones.
- Prefer signal-based inputs/outputs: `input<string>()`, `input.required<Project>()`, `output<void>()` — over the legacy `@Input()`/`@Output()` decorators, for new components. (Existing generated boilerplate from `ng generate` should be adjusted to this pattern.)
- Derived values are `computed()`, not re-computed inline in the template and not stored as a separately-set signal that can drift out of sync.
- `effect()` is reserved for actual side effects (writing to `localStorage`, imperative DOM/analytics calls) — never used as a way to "sync" one signal into another; use `computed()` for that.
- Templates use the new control-flow blocks only: `@if`/`@else`, `@for ( ... ; track ...)`, `@switch`. Every `@for` must have an explicit `track` expression (typically `track item.id`) — untracked loops are a performance bug in review.
- No function calls inside template expressions (`{{ formatDate(post.date) }}`) — use a `computed()` signal or a pure `Pipe` instead, so the value isn't recalculated on every change-detection pass.
- Keep templates declarative: a component's `.html` should describe structure and bindings, not contain branching logic more complex than a single `@if`/`@for`. Non-trivial branching belongs in a `computed()` in the `.ts` file.

## Reusability & DRY

- Before writing a new visual pattern, check `05-component-inventory.md` and `shared/ui/` — panels, pill buttons, icon chips, status dots, and the accordion are used across nearly every section and must never be recreated ad hoc inside a `feature` component.
- A `shared/ui` component takes plain data via inputs (strings, numbers, small POJOs, or `ng-content`) — it never imports a `core` model directly if a smaller, generic shape will do (e.g. `PillButtonComponent` takes a `label` and `variant`, not a whole `Project`).
- Repeated small pure-logic snippets (date formatting, slugifying a title, truncating a description) go in `shared/pipes/` or a `shared/utils/` function — never copy-pasted between components.
- Favor composition over configuration flags: if a component starts accumulating `showX`/`showY`/`variant` boolean inputs to handle unrelated use cases, split it into two components or use content projection instead.

## Styling

- Every component owns one `.component.scss` file (default emulated encapsulation) — no global CSS overrides sprinkled outside `styles/`.
- Every color, spacing, radius, and font value must come from `styles/tokens/*.scss` custom properties — a hardcoded hex code or pixel value in a component stylesheet is a review blocker (see `04-design-system-tokens.md`).
- Class naming inside a component follows a light BEM convention (`.panel__header`, `.panel--highlighted`) — this keeps encapsulated styles readable without needing a utility-class framework.

## State & data flow

- `ContentService` (in `core/services`) loads the static JSON content once (via `HttpClient` + `toSignal()`) and exposes readonly signals (`projects = signal<Project[]>([])` populated on init, or `toSignal(this.http.get<Project[]>(...), { initialValue: [] })`). Feature components read these signals — they do not fetch JSON themselves.
- No global state library (NgRx, Akita, etc.) — a portfolio site's state (loaded-once content, UI toggles like theme/accordion-open) is fully covered by signals in a couple of root-provided services. Introducing a state library here would be exactly the kind of over-engineering `01-tech-stack-and-principles.md` warns against.

## Testing

- Every `shared/ui` component: a spec asserting it renders with minimal inputs, reacts correctly to input changes, and (where interactive) exposes the correct ARIA roles/attributes.
- Every `core` service: a spec covering its public methods/signals, with `HttpClient` mocked via `HttpTestingController`.
- Every `features/*` component: at minimum a smoke test (renders without error given mocked service data).
- Target coverage: 80%+ on `core` and `shared/ui`; `features` coverage is expected to be lower and that's acceptable (most of their value is markup/composition, better verified by the smoke test + manual/E2E check than by unit-test line coverage).

## Enforcement

- ESLint (`angular-eslint` + `@typescript-eslint`) and Prettier run via `lint-staged` on every commit (`husky` pre-commit hook) — a commit that fails lint or formatting does not land.
- Commit messages follow Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`) so the history itself documents the project the way a professional team's would.
