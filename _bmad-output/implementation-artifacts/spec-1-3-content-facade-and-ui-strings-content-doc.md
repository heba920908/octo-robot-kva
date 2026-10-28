---
title: 'Story 1.3: Content Facade and UI Strings Content Doc'
type: 'feature'
created: '2026-10-28'
status: 'done'
route: 'dispatch'
baseline_commit: '24bc928537617a8d52024178712b3e53486b435e'
story_key: '1-3-content-facade-and-ui-strings-content-doc'
review_loop_iteration: 0
context:
  - '{project-root}/specs/002-epic-1-page-shell/spec.md'
  - '{project-root}/specs/002-epic-1-page-shell/plan.md'
---

<frozen-after-approval reason="human-owned intent - do not modify unless human renegotiates">

## Intent

**Problem:** The shell imports raw content directly; shared strings, formatting, section visibility and template guards are missing.

**Approach:** Seed EXPERIENCE defaults into editorial/typed content behind one facade. Preserve current shell output and metadata.

## Boundaries & Constraints

**Always:** Follow Story 1.3, FR15, UX-DR27 and AD-3. Use test-only draft-2020-12 Ajv2020/ajv-formats. Update editorial/executable content together. Preserve es-MX, kVA casing, CSP, SSG, hydration, tokens/fonts/icons. Test first; retain OnPush/inject. Extend the existing Epic 1 spec-kit feature.

**Never:** Runtime Markdown/schemas, HTTP content loading, new dependencies or later-story UI/data/interactions. No behavior model applies. No commits, branches, pushes, deployments or external settings.

## I/O & Edge-Case Matrix

| Scenario           | Input / State                                                              | Expected Output / Behavior                                                               | Error Handling                                                                 |
| ------------------ | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Content validation | Default strings, missing key, blank/wrong-type value or extra field        | Valid content passes; invalid content fails with item/field path                         | Mutation tests prove diagnostics                                               |
| Formatting         | Known key and exact placeholder values, including zero and repeated tokens | Deterministic plain text; Spanish text preserved                                         | Missing/unknown parameters or key fail explicitly; no silent unresolved tokens |
| Content ownership  | Production component needs site or UI copy                                 | Facade is the sole production raw-content importer                                       | Automated import-boundary test rejects bypasses; tests may use fixtures        |
| Visible sections   | Ordered candidates with populated, absent or empty content                 | Only populated sections appear, in page order                                            | No links to unimplemented sections; current shell exposes no invented sections |
| Template guard     | External or inline Angular template, whitespace, bindings and control flow | Bindings/whitespace pass; literal text and literal aria-label/alt/title/placeholder fail | Report source file and offending text/attribute; parser errors fail closed     |
| Production         | Development root and Pages base path                                       | Identical current shell output and no runtime validation imports                         | Build/static and browser checks catch regressions                              |

</frozen-after-approval>

## Code Map

- `src/app/core/content/site.content.ts` mirrors `content/site.md`; preserve copy.
- `src/app/app.ts` imports raw content; inject facade instead. Existing `app.html` bindings and `app.spec.ts` metadata assertions establish regression checks.
- Existing Ajv/formats and Angular/TypeScript parsers require no dependencies. Reuse test-only `.mjs`/`.d.mts` filesystem pattern from token checks. Preserve Story 1.2 assets/static gates; baseline 224.27kB.

## Tasks & Acceptance

**Execution:**

- [x] `specs/002-epic-1-page-shell/` -- clarify/plan US3 with contract and task traceability.
- [x] `src/app/core/content/ui-strings.content.spec.ts`, `src/app/core/schemas/ui-strings.schema.json` -- test validation/mutations first, with item/field diagnostics.
- [x] `content/ui-strings.md`, `src/app/core/content/ui-strings.content.ts` -- seed non-Hero defaults and typed parameter contracts; Hero rows remain Hero-owned.
- [x] `src/app/core/content/content-facade.spec.ts`, `content-facade.ts` -- test then implement formatting, readonly access, visibility and import ownership.
- [x] `src/app/app.ts`, `app.spec.ts` -- migrate to facade, preserving copy/metadata.
- [x] `scripts/content-checks.mjs`, `scripts/content-checks.d.mts`, `src/app/core/content/template-content.spec.ts` -- test-only structured source/template scanning; positive/negative fixtures for the matrix.
- [x] `scripts/verify-static-build.mjs` -- negative fixture first, then exclude Ajv/formats/schemas from production graph/output; preserve existing gates.
- [x] This spec and `_bmad-output/implementation-artifacts/sprint-status.yaml` -- record checks, archives, bundle delta, review and analysis before advancing.

**Acceptance Criteria:**

- Given EXPERIENCE defaults, when validated, then non-Hero editorial/executable coverage is complete and mutations name item/field (AC1).
- Given formatter inputs, when tested, then exact maps substitute and invalid maps fail (AC2).
- Given production imports/content, when checked, then facade ownership and populated-only visibility hold (AC3).
- Given templates/fixtures, when npm test runs, then literal violations fail and bindings pass (AC4).
- Given production output, when inspected, then validation code is absent and shell/metadata/SSG/hydration remain intact (AC5).

## Implementation Notes

- Approved and continued by the user on 2026-10-28 after rereading the edited artifacts. The frozen intent is locked; implementation proceeds from this revision.
- Implemented 76 non-Hero defaults as editorial/typed pairs, with closed draft-2020-12 contracts and exact placeholder patterns. ContentFacade owns raw production imports, deeply freezes content, formats exact named maps, and exposes no invented shell destinations. App retains its copy, metadata and OnPush/inject pattern.
- Test-only TypeScript/Angular AST guards check external/inline templates, interpolation fragments, nested control flow, static metadata, parse errors and import ownership. Static verification follows the runtime import closure and scans emitted artifacts for validation/schema leakage.

## Spec Change Log

## Review Triage Log

- Local pre-review checks found and fixed shorthand/computed template-metadata bypasses and missing schema text-placeholder constraints. Both had failing regression tests before correction; focused reruns passed.
- Independent review is **incomplete**: the execution-only review delegate truncated the 95,886-byte/2,111-line diff. Blind-review output used an incorrect size and missed existing tests; verification-gap review explicitly failed, including a bounded-read retry. Edge-case review returned no findings, but that result alone is not sufficient. No independent review completion or Done gate is claimed.

| ID  | Verdict | Evidence / Disposition                                                                                                                                                                                                                  |
| --- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| B1  | low     | Readiness checklist retained pre-approval language after implementation. Updated the US3-only readiness/evidence labels; no intent or acceptance criteria changed.                                                                      |
| B2  | low     | Sprint remains in-progress while the story is in-review and independent review is pending. This is deliberate: no final gate has passed. Removed stale awaiting-approval prose from the feature artifacts.                              |
| B3  | false   | The claimed malformed schema path is not present: the contract and feature spec name `src/app/core/schemas/ui-strings.schema.json`, which exists and passes strict Ajv tests.                                                           |
| B4  | false   | 2026-10-28 is this execution's date, not an unexplained future scheduled revalidation date.                                                                                                                                             |
| B5  | low     | Source enumeration scans this Angular repository's `.ts` implementation files. No `.tsx`/`.jsx`/`.js` application sources exist under src. Additional dialect support would add unneeded branches for hypothetical files; not added.    |
| B6  | false   | Runtime validation exclusion concerns executable imports and emitted schema/JS payloads. Existing CSS/SVG contain no validation code; runtime closure and emitted JS/JSON/HTML/map checks pass. No current asset leak was demonstrated. |
| B7  | false   | `template-content.spec.ts` contains positive/negative runtime-graph and emitted-output leak fixtures, including an indirect import. These ran in the passing suite.                                                                     |
| B8  | false   | Missing dist does not pass: the existing index existence check fails static verification; schema checks do not replace that guard.                                                                                                      |
| B9  | false   | Editorial parity and schema tests require the content files; the App provider-override test proves facade consumption for copy and metadata. Production AST scans forbid bypass imports.                                                |

Final independent review completed all three layers against the complete
101,765-byte diff. The earlier failed delegate result above is historical, not
the final review. Each new finding has an individual verdict below.

| ID  | Verdict | Evidence / Disposition                                                                                                                                                                                                                                                           |
| --- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1  | medium  | ICU plural/select case text bypassed the template AST walk. Patch traverses Angular i18n case nodes; literal ICU and binding-only regressions pass.                                                                                                                              |
| R2  | medium  | Literal/conditional/concatenated rendered binding expressions bypassed the guard. Four tests failed first; patch inspects output expressions while permitting facade key arguments and empty decorative bindings. All focused tests pass.                                        |
| R3  | low     | Static host metadata is not scanned. No production host metadata exists. Reject: adding a second host-expression enforcement path for a currently unused pattern adds complexity beyond a direct correction.                                                                     |
| R4  | low     | A custom interpolation configuration produces a false positive; the probe confirms it. No current component changes delimiters. Reject: adding parser configuration support for an unused dialect is disproportionate here.                                                      |
| R5  | low     | Barrel-reexported Component decorators evade direct-import discovery. Every production decorator currently imports Angular directly. Reject: transitive decorator provenance resolution adds complexity for an absent pattern.                                                   |
| R6  | false   | Rejecting literal alt="" follows the approved literal-alt matrix. Decorative images can bind an empty value; the regression confirms [alt]="''" passes without a needless announcement.                                                                                          |
| R7  | low     | Erased raw-content type imports were incorrectly rejected. Direct patch reuses type-only reference classification; fixture now permits the type import and retains executable-import failures.                                                                                   |
| R8  | low     | Named type-only Ajv imports were classified as runtime dependencies. Direct patch distinguishes all-type named lists from mixed/default value imports; positive/negative fixtures pass.                                                                                          |
| R9  | medium  | Per-row default coverage could miss a secondary variant after schema/editorial changes. Patch asserts each multi-variant key's independent exact copy; schema-required keys and existing parity/default checks remain.                                                           |
| R10 | low     | The optional alternate-root scan retains a cwd-relative facade exemption. Production/test callers scan only the current repository. Reject: alternate-checkout ownership plumbing has no current consumer and is more than a direct correction.                                  |
| E1  | medium  | Same verified ICU defect as R1; grouped under its patch. Literal and binding-only ICU cases pass after traversal correction.                                                                                                                                                     |
| E2  | low     | Computed dynamic module references cannot be resolved by this static scanner. No production computed import/require exists. Reject: a new fail-closed dynamic-module policy would add guards for a pattern absent from this application. Literal dynamic imports remain covered. |
| E3  | low     | Same named type-only import issue as R8; grouped under the direct patch. Fully erased imports pass and mixed value imports fail.                                                                                                                                                 |
| E4  | medium  | Same secondary-default coverage defect as R9; grouped under exact per-key multi-variant assertions.                                                                                                                                                                              |
| V1  | medium  | Pre-verified integration gap: helper tests did not protect actual static-verifier wiring. Patch adds isolated clean/contaminated output fixtures and runs the real verifier subprocess; exit statuses 0/1 and leakage diagnostics pass.                                          |
| V2  | medium  | Pre-verified schema gap: individual multi-parameter requirements lacked rejection cases. Patch removes each declared placeholder independently across all parameterized strings and checks item/field diagnostics; all cases pass.                                               |

No intent gap, spec loopback, unresolved blocking finding or new deferred runtime
defect remains. Accepted fixes are local test/tool patches; shipped copy and
application behavior are unchanged. Final verification below supersedes earlier
test counts and pending-review summaries.

## Verification

- Focused content/App `npx ng test --watch=false --include=...`, red/green; full tests, `npm ci`, Prettier, tokens:check, build:pages and verify:static.
- Development/Pages browsers: desktop/mobile/320px/no-JS, unchanged copy/metadata, es-MX, one h1, console/network/CSP, hydration, SSG/state. Stop owned servers. Bundle delta versus 224.27kB; budget <1MB.
- Archive schema/cases at contract paths under `.agents/workspace/spec-kit/`. Complete BMAD review and US3-scoped speckit-analyze before Done. No behavior logs apply.

### Execution Evidence (2026-10-28)

- Red/green: missing schema/content, missing facade, missing parser exports; additional red/green regressions for metadata extraction and text-placeholder contracts. Final local full run: 114 tests passed in eight files. Independent review remains pending.
- `npm ci`, touched-file Prettier, `npm run tokens:check`, `npm run build:pages` and `npm run verify:static` passed. Initial bundle: 230.25kB (+5.98kB against 224.27kB), below 500kB warning and 1MB error budgets. CSS unchanged at 46.78kB.
- Integrated browser: development and Pages at 1440/390/320px preserve the exact heading, brand, description, title, es-MX and single h1 without horizontal overflow. Development logs one hydrated component/nine nodes; both paths have zero console/page errors, failed requests or CSP violations. Pages requests are same-origin, with SSG root and ng-state present. No controls or changed keyboard flow exist.
- Separate JavaScript-disabled browser context passes both paths at 320px with the same copy/title/language, single h1, SSG/state and no overflow. Desktop/mobile screenshots inspected.
- Archives created at `.agents/workspace/spec-kit/baselines/ui-strings@2026-10-28.json`, `data/ui-strings/` and `layout-cases/content-templates/`; final local snapshots refreshed after schema/parser refinements.
- `npm ci` reports five existing dependency vulnerabilities (one low, three moderate, one high). No dependency changes, audit fixes, commits, branches, publication or external settings are authorized or performed.

### US3 Spec-Kit Analysis (2026-10-28)

Read-only analysis used the prerequisite script with
`SPECIFY_FEATURE=002-epic-1-page-shell`, the feature spec/plan/tasks, the content
contract, constitution v2.0.0, implementation and passing checks. No extension
hooks are registered. Recording this result is a separate implementation-evidence update.

| Requirement                  | Has Tasks? | Tasks                | Evidence                                                                                              |
| ---------------------------- | ---------- | -------------------- | ----------------------------------------------------------------------------------------------------- |
| FR-014 / AC1                 | Yes        | T018-T019, T023-T024 | Strict Ajv mutations, editorial/default parity, ten archived accepted/negative cases                  |
| FR-014 / AC2                 | Yes        | T020, T023-T024      | Exact maps, unknown/missing values, zero, repeated tokens, Spanish/plain text, compile-time contracts |
| FR-014 / AC3                 | Yes        | T020-T021, T023-T024 | App provider override, readonly facade, ordered populated-only fixtures, real-source import scan      |
| FR-014 / AC4                 | Yes        | T021, T023-T024      | External/inline AST fixtures, nested control flow, static metadata, parse failures, real-source scan  |
| FR-014 / AC5                 | Yes        | T022-T024            | Negative graph/output fixtures, Pages/static pass, development/Pages/no-JS browser matrix             |
| Shared static/security gates | Yes        | T022-T024            | CSP/fonts/icons/tokens unchanged, SSG/state and hydration verified, 230.25kB initial bundle           |

- Task coverage: six requirement/scenario groups, seven US3 tasks, 100% mapped,
  zero unmapped tasks. No unresolved specification ambiguity, duplication or
  constitution conflict found in this slice. No behavior model/log applies.
- Delivery is **not Done**: T024 and the final execution checkbox remain open
  because independent BMAD review did not complete. Sprint status stays
  in-progress; this implementation spec is in-review. No later story is advanced.
- Next gate: complete the independent review against the final diff, triage its
  findings, and only then close T024/update final tracking. Local verification
  does not substitute for that gate.

### Final Gate Evidence (2026-10-28)

- All three independent review layers completed against the full diff. Every
  finding is triaged above; accepted patches cover ICU/bound literals, erased
  types, exact default variants, all individual placeholder removals and actual
  verifier enforcement. No blocking finding or new deferred runtime defect remains.
- Final authoritative run: all 191 tests in eight files pass, token parity passes,
  Pages build passes and static verification passes. Editor diagnostics are clear.
  Initial JS 183.47kB, CSS 46.78kB, total 230.25kB (+5.98kB from US2), estimated
  transfer 59.07kB. Review patches are test/tool-only; shipped output is unchanged.
- Final development/Pages browser matrix at 1440/390/320px confirms exact copy,
  title/description, es-MX, one h1 and no horizontal overflow. Zero console/page
  errors, failed requests or third-party requests. Development hydrates one
  component/nine nodes without warnings; production retains SSG root and ng-state.
  A separate no-JavaScript Pages context passes at 320px. Screenshots inspected.
- Final US3-scoped spec-kit analysis: FR-014's five scenarios and the shared
  security gate are 100% task-mapped across T018-T024; zero unmapped tasks or
  blocking constitution conflicts. Historical readiness heading corrected in the
  separate documentation update. US4-US9 remain drafted. No behavior logs apply.
- Accepted schema and validation samples remain archived; final template/schema
  regression snapshots are refreshed under the documented workspace paths.
- T024 and all implementation tasks are complete. BMAD spec is Done; sprint
  tracking advances only Story 1.3 to review, following the build workflow.
  All changes remain uncommitted; explicit approval is required for any commit.
