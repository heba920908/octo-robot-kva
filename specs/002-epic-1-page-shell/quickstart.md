# Quickstart: Epic 1 Validation

Runnable checks for [spec.md](./spec.md). Sections are added story by story.

## Prerequisites

```bash
npm ci
```

## US1 — Brand design tokens and component theme (BMAD 1.1)

| #   | Run                                                                                 | Expected                                                                                                                                                                                                                                                                                                                             | Proves                                  |
| --- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------- |
| 1   | `npm run tokens:build && git status --short src/styles src/app/core/schemas`        | No change after a second run                                                                                                                                                                                                                                                                                                         | FR-006 determinism                      |
| 2   | `npm run tokens:check`                                                              | Exit 0                                                                                                                                                                                                                                                                                                                               | FR-005 no drift                         |
| 3   | Change one value in `src/styles/_tokens.scss`, then `npx ng test --watch=false`     | `design-tokens.spec.ts` fails and names the token; revert                                                                                                                                                                                                                                                                            | FR-005, SC-003                          |
| 4   | Change `colors.accent` in DESIGN.md without rebuilding, then `npm run tokens:check` | Exit 1 naming `color.accent`; revert                                                                                                                                                                                                                                                                                                 | FR-001                                  |
| 5   | `npx ng test --watch=false`                                                         | All green, including the theme style-guard test                                                                                                                                                                                                                                                                                      | FR-007, FR-008                          |
| 6   | `npm run build:pages`                                                               | Initial bundle < 1 MB; record JS and CSS sizes before and after Material in the story artifact                                                                                                                                                                                                                                       | FR-010, SC-004                          |
| 7   | `npm run verify:static`                                                             | Passes; CSP unchanged; no third-party origin; no inline script                                                                                                                                                                                                                                                                       | FR-009, FR-011, SC-005                  |
| 8   | `npm run preview:pages`, open `http://localhost:4300/octo-robot-kva/`               | Ink text on a paper background with token fonts or their fallbacks; DevTools shows `--kva-*` on `:root`; at ≥ 1024 px `--kva-typography-display-font-size` is `60px`, below that `32px`; no console errors, failed requests or CSP violations; `lang="es-MX"`, one `h1`, `app-root[ng-server-context="ssg"]` and `#ng-state` present | FR-003, FR-012, AGENTS.md browser check |

Stop the preview server when finished.

## US2 - Fonts and Icons (BMAD 1.2)

Run the unit, Pages and static checks above. Static verification now decodes both
emitted WOFF2 assets and checks the variable axis and Spanish glyphs. Font source,
licenses, checksums and fallback calculations are under `public/media/fonts/`.

The reusable browser helpers take an existing Playwright `page`; no Playwright
dependency is installed by this story. In an existing page runner, import and run:

```javascript
import { verifyTypography, verifyFontFallbacks } from './scripts/verify-typography.mjs';

for (const url of ['http://localhost:4200/', 'http://localhost:4300/octo-robot-kva/']) {
  await page.goto(url);
  await verifyTypography(page);
  await verifyFontFallbacks(page);
}
```

With integrated browser tools, execute the exported function bodies in
`run_playwright_code` with the provided page. Helpers create temporary DOM samples
and isolated contexts, verify actual h1 weight at 320/329/330px, all typography
roles, font decoding and preload reuse. Fallback checks cover delayed, blocked
and absent local fonts at 320/1440px with CLS <=0.1. No fixture UI is shipped.
Keep the AGENTS.md metadata, console/network, CSP and hydration checks as well.
Stop development and Pages servers afterward.

## US3 - Content Facade and UI Strings (BMAD 1.3)

These checks are executable; Story 1.3 records passing final verification and
all three completed independent review layers. Follow [the contract](contracts/content-facade.md).

1. Run `npx ng test --watch=false --include=src/app/core/content/*.spec.ts` and
   `npx ng test --watch=false --include=src/app/app.spec.ts`. Require positive content
   validation, missing/blank/type/extra-field mutations, exact parameter maps,
   repeated tokens, zero, visible-section ordering and no direct production imports.
2. Guard fixtures must reject literal text and aria-label/alt/title/placeholder in
   external and inline templates, including nested control flow. Binding-only and
   whitespace-only fixtures pass; malformed templates fail with source diagnostics.
   Compare the editorial/executable defaults with EXPERIENCE, excluding Hero rows.
3. Run all `npx ng test --watch=false`, `npm run tokens:check`, touched-file Prettier,
   `npm run build:pages` and `npm run verify:static`. Confirm no Ajv/ajv-formats/schema
   runtime import or emitted payload; prove the exclusion check with a negative
   fixture. Record initial bundle delta from 224.27kB and stay below 1MB.
4. Start `npx ng serve` and `npm run preview:pages`; use a free alternate port if an
   existing server owns the defaults. Inspect development root and Pages at 320px,
   mobile and desktop. Existing heading, brand, description and metadata must remain
   unchanged, including no-JS Pages output. Check es-MX, one h1, console/network/CSP,
   development hydration log, production SSG root and ng-state. Stop owned servers.
5. Archive the accepted schema at
   `.agents/workspace/spec-kit/baselines/ui-strings@2026-10-28.json`, mutation data
   under `.agents/workspace/spec-kit/data/ui-strings/` and template cases under
   `.agents/workspace/spec-kit/layout-cases/content-templates/`.
6. Complete BMAD review and US3-scoped speckit-analyze. Record evidence in Story 1.3
   and only then advance sprint tracking. Behavior-flow JSONL logs are inapplicable.
