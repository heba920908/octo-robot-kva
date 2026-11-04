---
title: 'Story 1.1: Brand Design Tokens and Material Theme'
type: 'feature'
created: '2026-10-27'
status: 'done'
route: 'dispatch'
baseline_commit: 'f948c328fd8af181d72b41954ead5d756c85f0f7'
story_key: '1-1-brand-design-tokens-and-material-theme'
review_loop_iteration: 0
context:
  - '{project-root}/specs/002-epic-1-page-shell/plan.md'
  - '{project-root}/specs/002-epic-1-page-shell/research.md'
  - '{project-root}/specs/002-epic-1-page-shell/data-model.md'
  - '{project-root}/specs/002-epic-1-page-shell/contracts/design-tokens.md'
---

<frozen-after-approval reason="human-owned intent - do not modify unless human renegotiates">

## Intent

**Problem:** The static Angular baseline has no brand tokens or Material theme. Later sections need a consistent, square, flat kVA foundation with automated protection against design drift.

**Approach:** Generate SCSS and JSON from DESIGN frontmatter, test export fidelity, and theme Material/CDK 22.2.4 through supported token-based APIs. Preserve static hosting and record production bundle impact.

## Boundaries & Constraints

**Always:** Follow Epic 1 US1 and its export contract. Pin Node-only `yaml` 2.9.1 and Material/CDK 22.2.4. Export all eight groups including components. Preserve Prettier, strict typing, AD-10 CSP, prerendering, Pages base path, title, single h1 and es-MX. Tests precede implementation.

**Never:** Hand-edit generated tokens; import Markdown/JSON into application code; add schematics, remote assets, prebuilt themes, private Material selectors, literal theme colors/spacing, UI features or behavior models. Fonts/icons belong to Story 1.2. No commits, branches, pushes or external changes without approval.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|---------------|----------------------------|----------------|
| Export | Valid DESIGN frontmatter | Deterministic, Prettier-stable SCSS and resolved JSON; source-order keys | Successful CLI exit |
| Responsive type | Base role and `-lg` variant | Same CSS property switches at desktop breakpoint (1024px); JSON retains both roles | Orphan variant names offending token |
| Component references | Scalar or typography reference | CSS `var()` references or expanded typography; JSON resolved literals; height becomes min-height; stroke-only backgrounds become stroke-color | Broken references name offending token |
| Invalid source | Unknown token group or malformed token value | Reject without silently skipping tokens; ignore documented non-token metadata | Error names token; CLI exits 1 |
| Drift check | Missing/edited output or changed source | `findTokenDrift()` reports file/token and expected/actual; `--check` writes nothing | Unit test and CLI fail on drift |

</frozen-after-approval>

## Code Map

- `specs/002-epic-1-page-shell/spec.md` US1 governs acceptance; context files above settle export details. Retain one spec-kit feature spec per epic.
- `_bmad-output/planning-artifacts/ux-designs/ux-agency-portfolio-2026-10-21/DESIGN.md` frontmatter is the sole token source; preserve values.
- `package.json` lacks Material/CDK, explicit YAML and token scripts; update lockfile through npm.
- `src/styles.scss` is empty apart from its starter comment; compose tokens before theme here.
- `scripts/verify-static-build.mjs` and existing Pages scripts provide security/build gates; reuse without weakening checks.

## Tasks & Acceptance

**Execution:**
- [x] `package.json`, `package-lock.json` -- pin approved YAML dev dependency; add `tokens:build` and `tokens:check` commands.
- [x] `src/app/core/schemas/design-tokens.spec.ts` -- test matrix cases first through the typed ESM surface.
- [x] `scripts/design-tokens.mjs`, `scripts/design-tokens.d.mts` -- implement contracted exports and CLI; no writes on import/check.
- [x] `src/styles/_tokens.scss`, `src/app/core/schemas/design-tokens.json` -- generate with contracted banners/formatting; focused tests green.
- [x] `_bmad-output/implementation-artifacts/spec-1-1-brand-design-tokens-and-material-theme.md` -- record baseline JS/CSS before Material installation, then final sizes/delta and verification/review evidence.
- [x] `package.json`, `package-lock.json` -- install Material/CDK 22.2.4 without `ng add`.
- [x] `src/styles/styles.spec.ts`, `src/styles/_theme.scss`, `src/styles.scss` -- guards first; supported token-fed APIs, square corners, semantic copper and page colors/type. Confirm 22.2.4 API keys.
- [x] `specs/002-epic-1-page-shell/tasks.md` -- supply US1 traceability for required analysis if needed; no later-story work.
- [x] `_bmad-output/implementation-artifacts/sprint-status.yaml` -- update the resolved story key only as workflow gates are met.

**Acceptance Criteria:**
- Given generated tokens and theme, when focused tests run, then all matrix cases pass and style guards reject private Material selectors and literal colors outside generated tokens.
- Given Material/CDK installation, when production builds, then APIs compile, no remote links/prebuilt theme appears, JS does not grow from theme-only use, and initial bundle stays below 1 MB; justify warnings above 500 kB.
- Given the Pages output, when static verification runs, then AD-10 CSP is unchanged and no executable inline script exists.
- Given both previews, when desktop/mobile checks run, then responsive tokens, metadata, keyboard flow, hydration, console/network and CSP checks pass.

## Implementation Notes

- Baseline before Material/CDK installation: `npm run build:pages` on baseline
  `f948c328fd8af181d72b41954ead5d756c85f0f7`, with exporter files present but no global
  style imports: initial JS 142.95 kB (`main-ZJ73WSUC.js`), CSS 0 bytes; total 142.95 kB,
  estimated transfer 43.33 kB. One route prerendered successfully.
- Exporter test-first evidence: initial focused test failed on missing module; after
  implementation all 17 tests passed. Prettier normalizes SCSS hex casing; JSON retains
  source literals. Behavior models and flow logs are not applicable to this story.
- Final verification: `npm ci`, focused style tests, Prettier checks, token build/check,
  all 25 tests across four files, Pages build and static verification pass. The matrix
  is covered by determinism/fidelity, responsive, reference/transformation, invalid-source,
  and isolated temporary-directory CLI/drift tests, all included in the passing suite.
- Material API audit removed ignored `neutral10`/`neutral-variant20` override keys;
  a regression assertion failed before removal and passed afterward.
- Final initial bundle: JS 142.95 kB (unchanged); CSS 40.55 kB (+40.55 kB);
  total 183.50 kB (+40.55 kB), below 500 kB warning and 1 MB error limits.
  No budget warning occurred. `npm ci` reports five dependency audit vulnerabilities;
  no unrelated dependency upgrades were attempted.
- Integrated browser verification passed on development and Pages previews: title,
  es-MX, one h1, no third-party links/requests, no failed requests or console/CSP errors.
  Development logged one hydrated component; production has the SSG root and ng-state.
  At 360/1023px, display/body tokens are 32/16px; at 1024/1440px, 60/18px.
  Production also passes at 320px without horizontal overflow. Material full corners
  compute to 0px. Desktop/mobile screenshots show clean reflow. Keyboard controls are
  inapplicable (none exist yet). Both workflow-owned servers were stopped.
- The first development inspection encountered a stale watcher after `npm ci` and
  one transient blocked blob-worker message. A clean server restart and monitored
  reload passed without errors or policy violations; production checks were clean.
- Spec-kit task generation completed for US1 only, using the feature-local setup
  script/template; ten tasks cover all 12 US1 FRs and five US1 success criteria.
  Independent test: the full export/theme/build/browser sequence above. Sequential
  execution follows the BMAD handoff; no parallel implementation or later-story work.
- `speckit-analyze` completed read-only with explicit feature selection: all 12 US1 FRs
  and five US1 success criteria map to ten tasks (100% coverage); zero ambiguity,
  duplication, unmapped tasks or constitution conflicts in US1. No blocking findings.
  US2-US9 remain drafted and outside this incremental analysis; no extension hooks exist.
- Post-review authoritative verification: direct clean install, focused tests, full
  Prettier check, token generation/check, all 27 tests across four files, Pages build
  and static verification pass. An execution helper returned stale pre-patch failures;
  direct commands verified current files and supersede that report. One test file
  needed formatting only; its 19 focused cases passed immediately afterward.
- Final reviewed bundle supersedes the earlier measurement: unchanged JS 142.95 kB,
  CSS 40.80 kB (+40.80 kB from baseline), total 183.75 kB (+40.80 kB), estimated
  transfer 47.12 kB. No budget warnings; original AD-10 CSP remains unchanged.
- All three BMAD integrated code-review layers completed. Twenty findings received
  individual verdicts below; nine findings were resolved in six localized patch groups,
  and eleven low-impact, rare-input findings were rejected under the workflow's
  complexity rule. No findings were deferred and no intent/spec loopback was needed.
  The new regression cases failed first, then all 22 focused cases passed.
- Independent tests now verify every source typography field in SCSS base/desktop
  blocks, selector-scoped body/h1 styling, transformed component references, supported
  button overrides, focus surface inheritance and additional style-guard violations.
- Fresh development/Pages browser checks passed after review, including computed body
  colors/background, font families, responsive body/h1 sizes and heading weight 300;
  no application console/network/CSP errors, healthy development hydration and production
  SSG/state. An isolated fixture using the installed Material button stylesheet verified
  0px corners, Outfit 14px labels, copper filled buttons and strong-copper text/outlined
  labels at 6.19:1 contrast on white, on mobile and desktop. Keyboard Tab/Shift+Tab
  verified 2px focus rings on dark marked elements, dark descendants and nested light
  surfaces. The fixture and temporary preview stylesheet were removed; servers stopped.
- Review probing intentionally hit Vite's sandbox allow-list once (403), then used a
  temporary generated local-preview asset. This test-tooling request is not an app
  request or production failure. No server security configuration was weakened.
- Final read-only US1 consistency re-check remains clear: all 17 in-scope requirements
  and criteria are covered; approved intent and epic design contracts are unchanged.
  Explicit variant references, improbable name collisions, malformed property/easing/
  shadow values and nonascending numeric YAML order retain the limits documented below.

## Spec Change Log

## Review Triage Log

| ID | Verdict | Evidence and route |
| --- | --- | --- |
| B1 | medium | Material text/outlined labels consume primary; accent on paper is 2.97:1. Patch their supported overrides to strong copper. |
| B2 | medium | Descendant-only dark focus misses the marked element and leaks through nested light surfaces. Patch with an inherited nearest-surface focus variable. |
| B3 | low | Probe confirms explicit scalar `body-lg` references emit undeclared variables, but DESIGN uses base roles only. Reject: rare variant-only references need new validation/semantics, not a direct correction. |
| B4 | low | Whole-role `body-lg` references use responsive base CSS but literal variant JSON. No DESIGN reference does this. Reject: rare explicit-variant semantics would add complexity. |
| B5 | low | Probe confirms a reference to literal component height uses the pre-transform name. Patch the reference naming through the existing export transformation. |
| B6 | low | Invented component/property names can collide; no current source names collide. Reject: improbable future names require a new validation guard. |
| B7 | low | Invented color-as-height and length-as-color fixtures are accepted; all source properties are typed correctly. Reject: property-specific schema validation adds branches for malformed cases outside everyday editing. |
| B8 | low | Probe accepts out-of-range bezier x values, but every source easing is valid. Reject: rare invalid easing requires extra validation rather than a direct correction. |
| B9 | low | Numeric object keys enumerate ascending, not arbitrary YAML order; current numeric keys are already ascending and values are unchanged. Reject: cosmetic reordering would require custom serialization/AST handling. |
| B10 | medium | No Material controls exist on the shipped page; root-variable checks alone do not prove every future control style. Patch focused supported button overrides and browser/computed-style checks; future feature stories test their actual controls. |
| E1 | low | Same reproduced responsive-scalar issue as B3. Reject under the same rare-input/complexity rule. |
| E2 | low | Same transformed height/stroke reference defect as B5. Patch shared naming. |
| E3 | low | A probe with rounded.DEFAULT and rounded.default emits duplicate names; source contains DEFAULT only. Reject: a new collision guard for improbable input is disproportionate here. |
| E4 | low | Same invalid easing fixture as B8; actual source is valid. Reject under rare-input/complexity rule. |
| E5 | low | A probe accepts unitless nonzero box-shadow lengths; source shadow is valid. Reject: extra shadow validation for improbable input adds complexity. |
| E6 | low | Same invented property-type mismatch as B7; actual references have correct types. Reject under rare-input/complexity rule. |
| E7 | medium | Guard regex omits oklab and cannot match named colors followed by !important. Patch the existing patterns and injected violation cases. |
| E8 | medium | Attribute selectors targeting Material classes bypass the dot-selector regex. Patch the existing pattern and injected violation cases. |
| V1 | medium | Pre-verified: whole-file token substring checks survive an unused h1 selector. Patch selector-scoped assertions and explicitly assert computed body/h1 styles in browser checks. |
| V2 | medium | Pre-verified: independent full-source checks cover JSON, not every SCSS typography field; regenerating an omitted weight could pass drift. Patch independent source-to-SCSS checks for all base/desktop fields. |

## Verification

- `npm ci` -- reproducible dependency installation.
- `npx ng test --watch=false --include=src/app/core/schemas/design-tokens.spec.ts` -- first red, then green; rerun after generator changes.
- `npx ng test --watch=false --include=src/styles/styles.spec.ts` -- focused style guard.
- `npm run tokens:build` and `npm run tokens:check` -- deterministic generation and no drift.
- `npx ng test --watch=false` -- all tests pass.
- `npm run build:pages` and `npm run verify:static` -- budgets, CSP and static output pass; record before/after sizes.
- Integrated browser tools with `npx ng serve` and `npm run preview:pages` -- desktop/mobile, 1024px switch and AGENTS browser checks; production SSG root and `#ng-state` exist. Stop servers afterward.
- BMAD code review and `speckit-analyze` -- findings resolved and US1 consistent before Done. Behavior-flow logs are inapplicable: no user action.