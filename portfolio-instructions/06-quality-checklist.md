# 06 — Quality Checklist

A change is not "done" until it satisfies the relevant rows below. Use this as a PR checklist.

## Accessibility

- [ ] Every interactive element is reachable and operable by keyboard alone (tab order, Enter/Space activation) — verify manually, don't just trust semantics.
- [ ] `AccordionComponent` uses real disclosure semantics (via `@angular/cdk/a11y` + correct `aria-expanded`/`aria-controls`), not a plain `@if` toggle with a `<div>`.
- [ ] All icon-only elements (`IconChipComponent`, tech logos, social links, `StatusDotComponent`) have an accessible name via `aria-label` or visually-hidden text.
- [ ] `GradientBlobComponent` and any other purely decorative element carries `aria-hidden="true"`.
- [ ] Color contrast meets WCAG AA for both themes (verify `--color-text-secondary` on `--color-bg-panel` specifically — it's the most likely to fail).
- [ ] `ReducedMotionDirective`/`@media (prefers-reduced-motion: reduce)` is respected everywhere a CSS transition or Angular animation is used — reduced-motion users get the end state instantly, not a skipped/broken one.
- [ ] The one "Try It" interactive demo (`features/try-it`) has a non-interactive, text-equivalent fallback description for screen-reader users.

## Performance

- [ ] `NgOptimizedImage` used for every raster image; the LCP image (hero/identity avatar) has `priority`.
- [ ] Angular SSR + prerendering enabled for `/`, `/projects/:slug`, and `/blog/:slug`.
- [ ] `angular.json` bundle budgets set and passing (e.g. warn at 400kb initial, error at 600kb) — no bundle-budget warnings ignored.
- [ ] No component fetches data it doesn't render; no `features/*` component holds a subscription without `takeUntilDestroyed()` or a signal-based equivalent.
- [ ] Lighthouse (mobile, throttled) targets: Performance 90+, Accessibility 95+, Best Practices 95+, SEO 95+.

## SEO & discoverability

- [ ] `SeoService` sets a unique `<title>` and meta description per route (home, each project, each post).
- [ ] Open Graph + Twitter Card meta tags present on every route, with a real preview image.
- [ ] JSON-LD structured data: `Person` on the home route, `CreativeWork`/`SoftwareSourceCode` on project routes, `BlogPosting` on post routes.
- [ ] `public/sitemap.xml` generated at build time covering all routes; `public/robots.txt` present and permissive.
- [ ] `public/llms.txt` present — a short plain-text summary of who you are, what you've built, and where to find your resume/GitHub/contact, aimed at AI-assisted recruiting tools (see the strategy doc, Section 13 and Section 22).

## Testing

- [ ] `shared/ui` and `core` coverage ≥ 80% (see `03-coding-standards.md`).
- [ ] Every new `shared/ui` component ships with a spec in the same PR — not added later.
- [ ] `ng test` and `ng lint` both pass in CI before merge; CI also runs `ng build` to catch SSR/prerender failures.

## Content integrity

- [ ] No `[YOUR: ...]` placeholder token from the strategy doc remains in shipped `assets/data/*.json` or component templates at launch — grep for `[YOUR:` before declaring the site done.
- [ ] Every claimed metric/number in a project case study is honestly true, not illustrative filler (the strategy doc's whole thesis is verifiable proof over claims — a fabricated number undermines the entire design rationale).
