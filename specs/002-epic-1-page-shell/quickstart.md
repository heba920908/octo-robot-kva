# Quickstart: Epic 1 Validation

Runnable checks for [spec.md](./spec.md). Sections are added story by story.

## Prerequisites

```bash
npm ci
```

## US1 — Brand design tokens and component theme (BMAD 1.1)

| # | Run | Expected | Proves |
|---|---|---|---|
| 1 | `npm run tokens:build && git status --short src/styles src/app/core/schemas` | No change after a second run | FR-006 determinism |
| 2 | `npm run tokens:check` | Exit 0 | FR-005 no drift |
| 3 | Change one value in `src/styles/_tokens.scss`, then `npx ng test --watch=false` | `design-tokens.spec.ts` fails and names the token; revert | FR-005, SC-003 |
| 4 | Change `colors.accent` in DESIGN.md without rebuilding, then `npm run tokens:check` | Exit 1 naming `color.accent`; revert | FR-001 |
| 5 | `npx ng test --watch=false` | All green, including the theme style-guard test | FR-007, FR-008 |
| 6 | `npm run build:pages` | Initial bundle < 1 MB; record JS and CSS sizes before and after Material in the story artifact | FR-010, SC-004 |
| 7 | `npm run verify:static` | Passes; CSP unchanged; no third-party origin; no inline script | FR-009, FR-011, SC-005 |
| 8 | `npm run preview:pages`, open `http://localhost:4300/octo-robot-kva/` | Ink text on a paper background with token fonts or their fallbacks; DevTools shows `--kva-*` on `:root`; at ≥ 1024 px `--kva-typography-display-font-size` is `60px`, below that `32px`; no console errors, failed requests or CSP violations; `lang="es-MX"`, one `h1`, `app-root[ng-server-context="ssg"]` and `#ng-state` present | FR-003, FR-012, AGENTS.md browser check |

Stop the preview server when finished.
