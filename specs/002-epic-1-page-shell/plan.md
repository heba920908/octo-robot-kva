# Implementation Plan: Epic 1 — Branded Page Shell, Hero and Navigation

**Branch**: `002-epic-1-page-shell` | **Date**: 2026-10-27 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-epic-1-page-shell/spec.md`

**Scope of this plan revision**: US1 (BMAD Story 1.1) only. Constitution v2.0.0 allows an epic
plan to grow story by story. Each later story is added here, through its own
`speckit-clarify` / `speckit-plan` pass, before it enters Act.

## Summary

Generate brand design tokens from the DESIGN.md frontmatter into
`src/styles/_tokens.scss` (CSS custom properties `--kva-*`, `-lg` typography switched at
1024 px) and `src/app/core/schemas/design-tokens.json`, with a drift unit test. Then add
Angular Material and CDK 22.2.4 without the `ng add` schematic, and theme them only through
`mat.theme()` / `mat.theme-overrides()` fed by the token custom properties: square corners,
copper for actions and focus only, and no remote fonts, icons or prebuilt theme. Record the
bundle impact against NFR1.

## Technical Context

**Language/Version**: TypeScript 6.0, Angular 22.2 (standalone, zoneless), SCSS; Node.js 22
for scripts and CI

**Primary Dependencies**: New in US1: `@angular/material` 22.2.4 and `@angular/cdk` 22.2.4
(dependencies, AD-4); `yaml` 2.9.1 (pinned devDependency, clarified). Existing: Prettier 3
(used by the generator), Vitest 5 via `ng test`

**Storage**: N/A (generated files are committed)

**Testing**: Vitest through `npx ng test --watch=false`. The drift test imports the generator
module (research R2). A style-guard test scans `src/**/*.scss` for private Material
selectors and literal colors outside `_tokens.scss`. Static output is checked with
`npm run verify:static`.

**Target Platform**: Static prerendered site on GitHub Pages; NFR3 browsers

**Project Type**: Single-page static web application

**Performance Goals**: Initial bundle < 1 MB (error), with any growth past 500 kB justified;
US1 should add global CSS only and no JS

**Constraints**: AD-10 CSP unchanged; no third-party origins; no hand-edited generated files;
no `.mat-*` / `.mdc-*` selectors in project styles; no hard-coded colors or spacing outside
`_tokens.scss`

**Scale/Scope**: 8 token groups from DESIGN.md; 2 generated files; 1 theme file

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle | US1 status | Notes |
|---|---|---|
| I. BMAD-driven delivery | PASS | Delivered by `bmad-build` on Story 1.1; planning and implementation artifacts in `_bmad-output/` |
| II. Behaviour models before code | N/A | US1 adds no user action, so it needs no behaviour model. Stories introducing a model merge its shared `BehaviorModel` implementation and transition/adapter tests during Plan, before Act. |
| III. Test-first, colocated | PASS (planned) | Drift spec written before the generator; style-guard spec before the theme; both colocated. No behaviour transitions, so behaviour-flow JSONL logs are N/A |
| IV. Schema- and token-governed | PASS | This story creates the token set at the constitution's paths (`src/styles/_tokens.scss`, `src/app/core/schemas/design-tokens.json`), which resolves readiness finding 4 |
| V. Modern Angular | PASS | No components or NgModules added. Material is used for theming only in US1 |
| VI. Accessible, budgeted UI | PASS (planned) | Bundle measured before and after (research R7); focus tokens mapped into the theme |
| Tooling: Material first | PASS | AD-4 versions; supported theme and override APIs only; no `ng add` (research R6) |
| Tooling: no Markdown at runtime | PASS | DESIGN.md is read only by Node scripts and tests; nothing in `src/` imports it |
| Tooling: static, host-neutral | PASS | No build-pipeline change; generated files committed, so the build never runs the generator |

**Post-design re-check (after Phase 1)**: PASS. No violations, so Complexity Tracking is
empty.

## Project Structure

### Documentation (this feature)

```text
specs/002-epic-1-page-shell/
├── spec.md              # Epic spec (US1–US9)
├── plan.md              # This file; grows story by story
├── research.md          # Phase 0 (US1: R1–R7)
├── data-model.md        # Phase 1 (US1: tokens, export, theme)
├── quickstart.md        # Phase 1 validation guide
├── contracts/
│   └── design-tokens.md # US1 export CLI and module contract
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 (`speckit-tasks`, optional — bmad-build plans its own tasks)
```

### Source Code (repository root) — US1 changes

```text
scripts/
├── design-tokens.mjs            # NEW generator + --check CLI (pure build fn, drift fn)
└── design-tokens.d.mts          # NEW typed surface for the unit test
src/
├── styles.scss                  # CHANGED: @use tokens + theme; page color/bg/type from tokens
├── styles/
│   ├── _tokens.scss             # NEW, GENERATED
│   ├── _theme.scss              # NEW: mat.theme() + mat.theme-overrides() → var(--kva-*)
│   └── styles.spec.ts           # NEW style-guard test (no .mat-/.mdc- selectors, no literal colors)
└── app/core/schemas/
    ├── design-tokens.json       # NEW, GENERATED
    └── design-tokens.spec.ts    # NEW drift + rule tests (-lg switch, refs, stroke, min-height)
package.json                     # CHANGED: material, cdk, yaml; scripts tokens:build, tokens:check
```

**Structure Decision**: Follow AD-1 and constitution §IV paths exactly. Node-only code stays
in `scripts/` (like `verify-static-build.mjs`) and is reached from specs only through its typed
`.d.mts` surface. `src/styles/` is created by this story.

## Implementation order (test-first)

1. Pin `yaml` 2.9.1 as a devDependency. Write `design-tokens.spec.ts` (drift, determinism,
   `-lg` media block, reference resolution, stroke and `min-height` rules, failure naming) →
   red.
2. Implement `scripts/design-tokens.mjs` and `.d.mts`, add the `tokens:build` and
   `tokens:check` npm scripts, generate both files → green.
3. Record a baseline `npm run build:pages` size. Install Material and CDK 22.2.4 (no
   `ng add`).
4. Write `src/styles/styles.spec.ts` style guard → red where needed. Add `_theme.scss` and
   wire `styles.scss` → green.
5. Record the bundle size after the change, and the difference. Run `npm run verify:static`
   and the [quickstart](quickstart.md) browser check.

## Epic-wide implementation gate (not blocking US1)

- Stories 1.5, 1.6, 1.8 and 1.9 merge their shared `BehaviorModel` implementation and
  colocated transition/adapter tests during Plan, before Act, as required by constitution §II
  and AD-7.
- Architecture Deferred table is out of date (readiness finding 3): token sync is now built
  by US1. Update with `bmad-architecture`.

## Complexity Tracking

No constitution violations.
