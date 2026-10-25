# Changelog

All notable changes to this project are documented here, newest first, following [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org). See `08-versioning-and-release-notes.md` for how this file is maintained.

Copy this file to the project root when the repository is created, and keep appending to it from there.

## [1.0.0] - 2026-10-01

### Enhanced

- Full design system and `shared/ui` component library (Panel, Pill Button/Nav, Icon Chip, Status Dot, Highlight Text, Gradient Blob, Accordion, Tech Badge, Theme Toggle), each with its own spec
- All nine home-page sections built end-to-end on real `ContentService` data: Hero, Proof Strip, How I Engineer, Selected Work (expandable Problem→Result case studies), Try It (a live server-backed health-check demo), Writing, Experience, About/Taste, and Contact
- Routing for `/projects/:slug` and `/blog/:slug`, SSR-prerendered, reusing the exact case-study/post-detail components the home page uses — no duplicated templates
- Full SEO wiring: unique title/description/Open Graph/Twitter Card tags and JSON-LD (`Person`, `CreativeWork`, `BlogPosting`) on every route, plus a build-time `sitemap.xml`, `robots.txt`, and `llms.txt` for AI-assisted recruiting tools
- CI pipeline (lint/test/build on every push/PR) and pre-commit hooks (lint-staged), closing a gap where neither actually existed despite being documented as required
- Accessibility pass: verified full keyboard operability, accordion disclosure semantics, icon accessible names, and WCAG AA contrast in both themes
- `core/` and `shared/ui/` test coverage brought to ~100%

### Fixed

- `ThemeService` crashed during SSR prerendering by reading `dataset['theme']`, which Angular's server-side DOM implementation doesn't support
- The accordion's custom-trigger buttons overrode their accessible name to just the title, silently hiding visible content (tech tags, dates, status) from screen readers — a WCAG 2.5.3 violation
- Every `app-panel` heading skipped a level (`h1` straight to `h3`), with no `h2` anywhere on the page
- `robots.txt`'s `Sitemap:` directive was a literal unresolved placeholder string, failing validation outright
- The "Try It" health-check request wasn't cancelled if the component was destroyed mid-request
- The server's PM2 startup guard didn't account for PM2 importing the module rather than executing it directly

> **Note:** this release is code/infrastructure-complete, not content-complete — `[YOUR: ...]` placeholders (bio, projects, blog posts, bookmarks, contact links, GitHub username, production domain) still need real content before the site is actually published. See the project README/report for the full remaining list.

## [0.1.0] - TBD

### Enhanced

- Initial scaffold: standalone Angular + SSR project, design tokens, and the `shared/ui` component primitives (Panel, Pill Button/Nav, Icon Chip, Status Dot, Highlight Text, Gradient Blob, Accordion, Tech Badge, Theme Toggle).
