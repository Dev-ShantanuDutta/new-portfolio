# 08 — Versioning & Release Notes

"Production grade" here means exactly what a small, senior-run product team actually does — not heavyweight process for its own sake. Simple, consistent, and real: every release is versioned, every release has notes, and every note says plainly what got fixed versus what got better.

## Versioning scheme

Standard [Semantic Versioning](https://semver.org) on `package.json`'s `version` field: `MAJOR.MINOR.PATCH`.

- **MAJOR** — a rebuild of a whole section's structure/IA, a framework/Angular-major upgrade, or any change that could break a previously-shared deep link (`/projects/:slug`, `/blog/:slug`).
- **MINOR** — a new section, a new project/case-study added, a new feature (e.g. the "Try It" demo shipping for the first time).
- **PATCH** — bug fixes, copy corrections, accessibility/perf fixes, dependency bumps, small visual polish.

Start the project at `0.1.0` while the core sections are still being built out; move to `1.0.0` the first time all ten blueprint sections (Section 28 of the strategy doc) are live, content is real (no `[YOUR: ...]` placeholders left), and the full `06-quality-checklist.md` passes.

## Commit → changelog pipeline

Commits already follow Conventional Commits (`03-coding-standards.md`). That mapping drives the changelog directly, so notes are never written from memory after the fact:

| Commit prefix | Changelog section | Version bump |
|---|---|---|
| `feat:` | **Enhanced** | minor |
| `fix:` | **Fixed** | patch |
| `perf:` | **Enhanced** (performance) | patch |
| `refactor:`, `style:`, `chore:`, `docs:`, `test:` | omitted from user-facing notes (internal only) | none |
| any commit with a `BREAKING CHANGE:` footer | **Enhanced**, called out explicitly | major |

## `CHANGELOG.md` format

Keep a single `CHANGELOG.md` at the project root, newest release first, following the [Keep a Changelog](https://keepachangelog.com) convention with exactly two user-facing headings per release — **Fixed** and **Enhanced** — since that's the pointer format you asked for. A starter file is included alongside this folder (`CHANGELOG.md`) — copy it to the project root and keep appending to it; don't start a new one per release.

```md
## [1.2.0] - 2026-11-03

### Enhanced
- Added the "Try It" interactive request/response demo to Selected Work
- Hero specialization line now reflects updated focus area

### Fixed
- Accordion focus outline was invisible in light theme (WCAG contrast)
- GitHub contribution graph occasionally showed a stale cached count
```

## Release checklist

1. Confirm `main` passes `06-quality-checklist.md` in full.
2. Bump `version` in `package.json` per the table above.
3. Move the `[Unreleased]` section of `CHANGELOG.md` under a new `## [x.y.z] - YYYY-MM-DD` heading, split into **Fixed**/**Enhanced** only (drop empty sections rather than leaving them blank).
4. Tag the commit (`git tag vX.Y.Z`) and push tags.
5. Deploy. Keep deploys 1:1 with tags — never deploy an untagged commit to production.

Keep this process itself simple: no changelog-generation tooling is required for a solo portfolio project — writing the two or three real bullet points by hand at release time is faster and more honest than automating prose from commit messages.
