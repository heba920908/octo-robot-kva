# Implementation Plan: Epic 1 — Branded Page Shell, Hero and Navigation

**Branch**: `002-epic-1-page-shell` | **Date**: 2026-10-27 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-epic-1-page-shell/spec.md`

**Scope of this plan revision**: US1-US4 (BMAD Stories 1.1-1.4). Constitution v2.0.0 allows an epic
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

_GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design._

| Principle                        | US1 status     | Notes                                                                                                                                                                                      |
| -------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| I. BMAD-driven delivery          | PASS           | Delivered by `bmad-build` on Story 1.1; planning and implementation artifacts in `_bmad-output/`                                                                                           |
| II. Behaviour models before code | N/A            | US1 adds no user action, so it needs no behaviour model. Stories introducing a model merge its shared `BehaviorModel` implementation and transition/adapter tests during Plan, before Act. |
| III. Test-first, colocated       | PASS (planned) | Drift spec written before the generator; style-guard spec before the theme; both colocated. No behaviour transitions, so behaviour-flow JSONL logs are N/A                                 |
| IV. Schema- and token-governed   | PASS           | This story creates the token set at the constitution's paths (`src/styles/_tokens.scss`, `src/app/core/schemas/design-tokens.json`), which resolves readiness finding 4                    |
| V. Modern Angular                | PASS           | No components or NgModules added. Material is used for theming only in US1                                                                                                                 |
| VI. Accessible, budgeted UI      | PASS (planned) | Bundle measured before and after (research R7); focus tokens mapped into the theme                                                                                                         |
| Tooling: Material first          | PASS           | AD-4 versions; supported theme and override APIs only; no `ng add` (research R6)                                                                                                           |
| Tooling: no Markdown at runtime  | PASS           | DESIGN.md is read only by Node scripts and tests; nothing in `src/` imports it                                                                                                             |
| Tooling: static, host-neutral    | PASS           | No build-pipeline change; generated files committed, so the build never runs the generator                                                                                                 |

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

## US2 Plan (2026-10-28)

Use the approved Story 1.2 spec and [fonts-and-icons contract](contracts/fonts-and-icons.md).
No new runtime dependencies: Material registry and Angular HttpClient already exist.
fontkit 2.0.4 is test/tool-only. `scripts/verify-static-build.mjs` also decodes emitted
fonts, and `scripts/verify-typography.mjs` retains browser assertions outside shipped UI.
Source licensed fonts and Lucide SVGs at build time only; retain source revisions,
checksums and licenses under public/media. Subset fonts to latin and weights 300-600.
Measure fallback size-adjust and vertical overrides from font tables.

1. T011: Clarify US2 and extend this plan, research, data model, contract and tasks.
2. T012: Extend src/styles/styles.spec.ts first; observe missing font/preload/role/asset failures.
3. T013: Ship assets; add src/styles/_fonts.scss and token-fed role styles, then the
   relative crossorigin preload in src/index.html. Preserve generated tokens/theme APIs.
4. T014: Write src/app/core/icons/icons.spec.ts first; cover every real SVG, both base
   paths, unknown names, caching and decorative MatIcon rendering.
5. T015: Add icons.ts fixed allowlist with sanitized relative URLs through MatIconRegistry,
   provideHttpClient and provideAppInitializer in app.config.ts; no eager SVG requests.
6. T016: Run focused/full tests, formatting, tokens, Pages/static and both browser previews,
   including temporary typography/icon fixtures, delayed fonts, CLS, 320px and no-JS.
7. T017: BMAD review and US2-scoped spec-kit analysis; record evidence and only advance US2.

Constitution pre/post-design: PASS. No behavior models or flow logs apply because US2
adds assets and shared styling, not a portfolio user action. No tokens are changed.
Runtime URLs are fixed, same-origin and base-relative. Initial bundle <1MB; record
delta against 183.75kB. US3-US9 remain outside this plan revision.

## US3 Plan (2026-10-28)

Approved, implemented, verified and independently reviewed on 2026-10-28. All
191 tests and the build/static/browser gates pass. Follow
[contracts/content-facade.md](contracts/content-facade.md). No new dependencies:
Ajv2020/ajv-formats already exist as devDependencies and Angular supplies a template
parser. Keep validation, schema loading and filesystem access test/tool-only.

1. T018: Clarify US3 and extend this feature's research, data model, contract,
   quickstart and tasks without changing completed US1/US2 records.
2. T019: Write `src/app/core/content/ui-strings.content.spec.ts` first. Validate
   positive content and mutations with item/field diagnostics; implement
   `src/app/core/schemas/ui-strings.schema.json`, `content/ui-strings.md` and
   `src/app/core/content/ui-strings.content.ts` from EXPERIENCE defaults.
3. T020: Write `src/app/core/content/content-facade.spec.ts` first, then implement
   `content-facade.ts`: readonly site/UI access, exact placeholder formatting,
   content-driven ordered visible sections. Migrate `app.ts` and `app.spec.ts`
   without changing the existing shell's rendered copy or metadata.
4. T021: Add `scripts/content-checks.mjs` and `scripts/content-checks.d.mts` for
   test-only source enumeration and structured TypeScript/Angular parsing. Exercise
   them from `src/app/core/content/template-content.spec.ts` and facade tests:
   external/inline templates, nested blocks, interpolation, literal attributes,
   parser errors and raw-content import bypasses. No regex-only HTML/import scan.
5. T022: Test then strengthen `scripts/verify-static-build.mjs` to reject bundled
   validation dependencies/content schemas. Confirm production import closure and
   built output, with a negative fixture proving the check rejects leakage.
6. T023: Full tests, formatting, tokens, Pages/static and development/Pages browser
   checks. Record initial bundle delta against US2's 224.27kB. Archive accepted
   schema and validation cases at the paths in US3's spec.
7. T024: Complete BMAD review and US3-scoped speckit-analyze; resolve findings and
   record evidence before advancing sprint status or marking implementation done.

Constitution pre/post-design and final US3-scoped analysis: PASS. No behavior model or transition log:
US3 adds no portfolio user action. The content schema governs strings; the existing
token set continues to govern the unchanged shell. Markdown remains editorial only;
no schema/Ajv import reaches browser code. No new sections, links or network origins.
US4-US9 remained unplanned at the US3 handoff. No commit, branch creation or publication is authorized.

## US4 Plan (2026-10-28)

The approved Story 1.4 spec is the sole source of implementation intent. Extend,
do not replace, this existing epic plan. Follow
[contracts/responsive-images.md](contracts/responsive-images.md).

1. T025: Clarify US4 and record manifest/metadata/schema/token contracts here,
   in spec.md, data-model.md and tasks.md before application changes.
2. T026: Establish discovery of scripts/build-images.spec.ts through the Angular
   test runner. Write fixture-first tests for invalid paths/widths, collisions,
   no-upscale, formats, deterministic inventory/bytes, budgets and logo alpha.
3. T027: Pin development-only Sharp; implement exported generator/CLI/declarations,
   explicit images:build command and all 25 manifest photos plus white-logo roles.
4. T028: Generate public/media derivatives twice; compare inventories/SHA-256;
   record original hashes, encoder settings, derivative hashes and resolution limits.
5. T029: Test then add image.schema.json, typed images.content.ts and editorial
   content/images.md; expose immutable images through ContentFacade only.
6. T030: Test then implement standalone OnPush/signal-input ResponsiveImage,
   AVIF/WebP sources and JPEG fallback, sizes, intrinsic ratio, content alt and priority.
7. T031: Extend static/runtime exclusion checks and README. Run full tests,
   clean install, tokens, Pages/static and formatting. Compare derivative hashes
   before/after builds and record bundle delta from 230.25kB.
8. T032: Use removable fixtures for dev/Pages desktop/mobile/320px and no-JS
   browser checks. Archive schema/data/layout cases; independent BMAD review and
   US4-scoped spec-kit analysis precede completion. Remove fixtures/stop servers.

Constitution pre/post-design: PASS. No behavior model applies to this non-interactive
infrastructure. No new tokens are needed: the shared primitive uses structural
display/width/height rules, with no literal colors or spacing. Schema and Sharp
remain test/tool-only. No application import may reach scripts or schemas. No
later-story UI, generation during builds/CI, remote service, commit or branch.

US4 verification and independent review completed on 2026-10-28: 246 tests,
token parity, production/static gates and both browser paths pass. Reviewed
generator determinism and build-independent assets are verified. Final bundle
235.14kB (+4.89kB); source resolution remains the physical ceiling. No behavior
model applies. Schema/metadata/layout cases are archived and owned servers stopped.
Final US4-scoped spec-kit analysis passes with all applicable requirements and
tasks covered, no inconsistencies and no constitution conflicts. T025-T032 are
complete; only Story 1.4 advances to review. All work remains uncommitted.
