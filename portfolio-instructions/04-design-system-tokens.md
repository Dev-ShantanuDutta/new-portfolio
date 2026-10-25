# 04 — Design System Tokens

Translated from `portfolio-strategy-report.md` (Section 26, and the Addendum A additions) into concrete SCSS. These live in `src/styles/tokens/` and are the *only* place color/spacing/radius/type values are declared — everything else in the app consumes them via `var(--token-name)`.

## `_colors.scss`

```scss
:root {
  /* base */
  --color-bg-page: #0b0b0d;
  --color-bg-panel: #16161a;
  --color-border-subtle: rgba(255, 255, 255, 0.08);
  --color-text-primary: #f2f2f0;
  --color-text-secondary: #9a9aa1;

  /* the ONE accent — used in the hero highlight-box, gradient blob, status
     dots, and the highlighted "How I Engineer" card only. [YOUR: replace
     this placeholder with your final chosen accent — do not use the
     reference sites' teal/magenta or neon-green verbatim; pick your own] */
  --color-accent: #f5a623;
  --color-accent-contrast: #16161a; /* text color used ON TOP of --color-accent */

  --color-status-live: #3b82f6;
  --color-status-pinned: #22c55e;

  /* light theme overrides — applied via [data-theme="light"] on <html> */
  &[data-theme='light'] {
    --color-bg-page: #fafafa;
    --color-bg-panel: #ffffff;
    --color-border-subtle: rgba(0, 0, 0, 0.08);
    --color-text-primary: #16161a;
    --color-text-secondary: #55555c;
  }
}
```

## `_spacing.scss`

```scss
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;

  /* the two-tier rhythm from the primary reference: tight inside a panel,
     generous between panels */
  --panel-padding: var(--space-5);
  --panel-gap: var(--space-6);
}
```

## `_radius.scss`

```scss
:root {
  --radius-panel: 12px; /* cards, panels, the identity card */
  --radius-chip: 8px;   /* icon chips, tech badges, tags */
  --radius-pill: 9999px; /* nav, CTA buttons, status pills — Addendum A */
}
```

## `_typography.scss`

```scss
:root {
  --font-body: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, 'SFMono-Regular', monospace;

  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.5rem;
  --text-2xl: 2rem;
  --text-3xl: 2.75rem; /* hero headline */

  --leading-tight: 1.2;
  --leading-normal: 1.6;
}
```

## Component-level conventions built on top of these tokens

- **`HighlightTextComponent`** (`shared/ui/highlight-text`): wraps projected content in `background: var(--color-accent); color: var(--color-accent-contrast); border-radius: var(--radius-chip); padding: 0 6px;`. Used **only** inside the hero headline, on 2-3 words max — see Addendum A in the strategy doc for why this must stay rare.
- **`GradientBlobComponent`** (`shared/ui/gradient-blob`): a purely decorative, `aria-hidden="true"`, absolutely-positioned element behind the hero content, using a radial-gradient built from `--color-accent` fading to transparent. It is rendered once, only in the hero — never reused as a background elsewhere on the page, which is what keeps it feeling like a signature rather than a texture.
- **Pill vs. panel radius stay semantically separate.** `--radius-pill` is used exclusively by `PillButtonComponent` and `PillNavComponent` (and small status/tag chips); `--radius-panel`/`--radius-chip` are used by everything else. Do not mix — a panel with `--radius-pill` or a nav pill with `--radius-panel` breaks the "two intentional shapes" rule from the strategy doc's Addendum A.
- **Dark mode is the default; light mode is the override**, matching the primary reference's instinct (Section 5 of the strategy doc) that dark reads as the "engineering" choice for this audience. `ThemeService` toggles `document.documentElement.dataset['theme']` between `'dark'` (or unset) and `'light'`.
