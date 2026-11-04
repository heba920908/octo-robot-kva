---
title: 'Story 1.4: Image Derivative Pipeline and Shared Responsive Image'
type: 'feature'
created: '2026-10-28'
status: 'done'
route: 'dispatch'
baseline_commit: '9622aca7588edc1e8336b2aaf0c77a81e4ff0d41'
story_key: '1-4-image-derivative-pipeline-and-shared-responsive-image'
review_loop_iteration: 0
context:
  - '{project-root}/specs/002-epic-1-page-shell/spec.md'
  - '{project-root}/specs/002-epic-1-page-shell/plan.md'
---

<frozen-after-approval reason="human-owned intent - do not modify unless human renegotiates">

## Intent

**Problem:** Brochure originals have no reproducible web derivative pipeline, and features have no shared responsive-photo renderer.

**Approach:** Add a manifest-driven, development-only Sharp command that generates local photo and logo derivatives, plus a standalone content-fed picture component. Preserve the current shell.

## Boundaries & Constraints

**Always:** Follow Story 1.4, UX-DR5, AD-14 and FR15. Pin Sharp as a devDependency, authorized by this story. Preserve aspect ratios, original assets, white-logo alpha, content-owned alt text, CSP, es-MX, SSG, hydration and Pages-relative URLs. Use OnPush, signal inputs and colocated tests. Clarify and plan US4 in the existing Epic 1 spec-kit feature before Act. No behavior model applies to this non-interactive infrastructure.

**Never:** Upscaling, automatic image generation during application builds/CI, remote image services, runtime Sharp/schema imports, invented project claims, later-story sections, Hero composition/preload, committed fixture UI, commits, branches, pushes or deployment. Generated assets belong in version control but remain uncommitted pending explicit permission.

## I/O & Edge-Case Matrix

| Scenario         | Input / State                                                            | Expected Output / Behavior                                                                                                         | Error Handling                                                                                        |
| ---------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Photos           | Five backgrounds and 20 project JPEGs; manifest widths                   | AVIF, WebP and JPEG at sorted unique widths capped to source width; include capped largest width; deterministic base-width names   | Reject missing sources, invalid widths, duplicate destinations and unsafe paths with item diagnostics |
| Repetition       | Same manifest, originals and pinned encoder                              | Identical file inventory and bytes on second run                                                                                   | Hash/inventory test detects drift                                                                     |
| Budgets          | Hero or project-card derivatives                                         | Every Hero output <=250,000 bytes; every card output <=120,000 bytes, including largest available 2x candidate                     | Fail command naming asset, format, width and byte limit; never silently skip oversized fallback       |
| Logos            | White 459x241 RGBA original                                              | Transparent PNG variants for header 32/40px heights, footer 24px, Hero 200px and band 40px, at 1x/2x where source permits          | Cap physical size to source; deduplicate identical variants; document unavailable full 2x Hero        |
| Default picture  | Content metadata: base, widths, intrinsic width/height, alt; sizes input | AVIF then WebP sources; JPEG fallback; matching width-descriptor srcsets/sizes, intrinsic dimensions, lazy loading, async decoding | Reject malformed metadata in tests/schema validation; empty decorative alt remains valid              |
| Priority picture | Priority input true                                                      | Eager loading and high fetch priority; otherwise no high priority                                                                  | Component tests verify both modes                                                                     |
| Hosting          | Development root or Pages subpath, with/without JS                       | Local media URLs resolve; prerendered picture remains useful; current shell unchanged                                              | Browser checks detect failures, layout shifts and hydration/CSP regressions                           |

</frozen-after-approval>

## Code Map

- `assets/media/brochure/` -- five backgrounds, 20 project photos, white/dark logos. Generate white-logo roles only; preserve dark original. Hero source is 740x556; project widths range 399-1308px. Do not invent missing resolution.
- `src/app/core/content/content-facade.ts` -- sole production raw-content importer. Reuse facade ownership for new image metadata; preserve existing visible sections and shell copy.
- `scripts/design-tokens.mjs`, `src/styles/styles.spec.ts` -- existing script/test integration patterns; use filesystem/hash/Sharp metadata assertions rather than visual guesses.
- `src/app/core/schemas/`, `scripts/content-checks.mjs` -- test-only schema validation and template/import guards; bound alt must pass existing checks.
- `package.json`, `scripts/verify-static-build.mjs` -- add explicit image command only; preserve existing build/security checks and exclude Sharp from runtime.

## Tasks & Acceptance

**Execution:**

- [x] `specs/002-epic-1-page-shell/{spec.md,plan.md,tasks.md,data-model.md,contracts/responsive-images.md}` -- clarify US4, specify metadata/manifest contracts, token alignment, archives and AC traceability before Act.
- [x] `scripts/build-images.spec.ts`, `scripts/build-images.mjs`, `scripts/build-images.d.mts` -- establish runner discovery; test fixtures first, then implement exported generator and CLI, validation, no-upscale, deterministic output and budget failures.
- [x] `scripts/images.manifest.json`, `package.json`, `package-lock.json` -- manifest all 25 photos and white-logo roles; pin Sharp and expose images:build. Use photo width targets 320/640/960/1280 capped to each source; retain source aspect ratios and explicit encoder settings.
- [x] `public/media/{backgrounds,projects,logo}/`, `public/media/PROVENANCE.md` -- generate derivatives, record originals/encoder/settings, checksums and resolution limits; compare inventories/hashes across two runs.
- [x] `src/app/core/content/{images.content.ts,images.content.spec.ts,content-facade.ts}`, `src/app/core/schemas/image.schema.json` -- typed metadata for generated photos with content-owned decorative/background alt and descriptive project alt; validate paths, dimensions and actual candidate files. Do not create later project entities or bypass the facade.
- [x] `content/images.md` -- document image metadata, alt descriptions, source/permission provenance and editorial synchronization; use supplied brochure provenance without claiming additional rights.
- [x] `src/app/shared/responsive-image/{responsive-image.ts,responsive-image.html,responsive-image.scss,responsive-image.spec.ts}` -- test then implement picture rendering, sizes, intrinsic ratio, bound alt and loading modes; use tokens for any styling.
- [x] `scripts/verify-static-build.mjs`, `README.md` -- protect runtime exclusion and build independence; document regeneration and asset review.
- [x] This spec and `_bmad-output/implementation-artifacts/sprint-status.yaml` -- record verification, bundle delta, independent review and US4-scoped spec-kit analysis before completion; advance only Story 1.4.

**Acceptance Criteria:**

- Given all brochure sources, when images:build runs twice, then the matrix passes with all expected photos and logo roles (AC1).
- Given oversized and invalid fixtures, when generation runs, then failures identify the offending asset and constraint (AC2).
- Given content metadata, when the shared component renders, then default and priority output satisfy the picture contract (AC3).
- Given development and Pages output, when browser/static checks run, then local assets, no-JS pictures and existing foundations remain intact without build-time generation (AC4).

## Implementation Notes

- Approved and continued by the user on 2026-10-28 after rereading the externally edited draft. Full-spec scope accepted; frozen intent is locked.
- Implemented all 25 photo metadata entries and 230 derivatives, transparent logo heights, development-only generator and standalone picture primitive. No later-story UI remains; temporary App fixtures were removed after browser verification.
- The implementation handoff returned no report. Verification therefore used the complete baseline diff, direct test executions and real-browser checks, not a delegate success claim. Angular script test includes are relative to src: use ../scripts/build-images.spec.ts for a focused run.
- Initial Sharp 0.34.5 introduced a high-severity audit advisory. Upgraded to pinned 0.35.5, regenerated outputs twice, updated guards and reran all checks. Only the five pre-existing dependency advisories remain. No new runtime dependency was introduced; @types/node is test-only.
- Replaced the initial one-byte budget probe with deterministic 1200x1200 fixtures that exceed the actual Hero/card limits and verify no partial writes. Two AVIF cases require a local 30-second test timeout; no global timeout was changed.

## Spec Change Log

## Review Triage Log

All three independent reviewers read the complete 212,971-byte diff. Each finding
is classified individually before grouping; direct corrections below add no public
surface and guard only demonstrated cases.

| ID  | Verdict | Evidence / Disposition                                                                                                                                                                                                                                                              |
| --- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| B1  | low     | Removing targets leaves obsolete files, but no current metadata references them and real-inventory tests detect extras. Reject automatic destructive reconciliation: uncommon manifest shrinkage does not justify ownership/deletion machinery in this command.                     |
| B2  | medium  | Positive-only budget validation permits raising project ceilings. Patch: cap manifest budgets independently at 120,000/250,000 by existing output category.                                                                                                                         |
| B3  | low     | Standard schema validation alone cannot enforce cross-field width relations; actual-content tests already compare every sorted/capped candidate list with its original and manifest. Reject a second validator/public surface for currently unreachable malformed shipped metadata. |
| B4  | low     | Alpha-channel presence accepts opaque RGBA inputs, but current white source/output transparency is independently decoded in tests. Reject expanding source policy for hypothetical replacement logos; this story preserves the supplied source alpha.                               |
| B5  | low     | An extreme ratio can round a target dimension to zero and leak an unlabelled encoder error. Patch preflight diagnostics for the demonstrated zero-dimension plan.                                                                                                                   |
| B6  | low     | Generic generator provenance repeats production-specific dimensions/targets for fixture or changed inputs. Patch by removing hard-coded facts and deriving unavailable-size notes from inspected role mappings.                                                                     |
| B7  | high    | CLI provenance write follows an existing external symlink; derivative checks do not protect that file. Patch provenance-destination preflight before generation and immediately before its write.                                                                                   |
| B8  | low     | A later filesystem write failure can leave earlier files written; budget/manifest errors already fail before writes. Reject transactional publication/rollback for uncommon disk/permission changes, which requires disproportionate new machinery.                                 |
| B9  | medium  | metadata() validates headers, not complete pixel payloads. Patch real-candidate tests to decode all pixel buffers as well as headers.                                                                                                                                               |
| B10 | low     | Existing provenance tests check present rows but not omitted rows or recorded sizes/dimensions. Patch exact source/derivative inventories and recorded measurements in the same test.                                                                                               |
| E1  | medium  | Same verified budget-ceiling bypass as B2; group under the direct budget correction.                                                                                                                                                                                                |
| E2  | low     | Same rounded-zero diagnostic defect as B5; group under its preflight correction.                                                                                                                                                                                                    |
| E3  | low     | Same obsolete-output observation as B1; reject the proposed destructive reconciliation for the same reasons.                                                                                                                                                                        |
| E4  | low     | Same partial-write observation as B8; reject transactional machinery for the same reasons.                                                                                                                                                                                          |
| E5  | low     | A concurrent local writer can replace ancestors after preflight. This trusted local generation command has no concurrent writer, and a user with those filesystem permissions already controls the tree. Reject directory-handle publication machinery for this unlikely race.      |
| E6  | high    | Same reproduced provenance symlink escape as B7; group under its preflight correction.                                                                                                                                                                                              |
| E7  | low     | Same schema-only relational-width limitation as B3; real shipped-content checks already enforce sorted/capped widths. Reject redundant validation machinery.                                                                                                                        |
| V1  | medium  | Pre-verified gap: oversized tests fail at AVIF and cannot detect a missing WebP/JPEG guard. Patch isolated per-format rejection fixtures with no-write assertions.                                                                                                                  |
| V2  | medium  | Pre-verified gap: replacement input test observes metadata/src but not all three srcsets. Patch existing test to assert replacement candidate lists.                                                                                                                                |

### Review Resolution

All surviving groups route to `patch`: B2/E1 (budget ceilings), B5/E2
(zero-dimension diagnostics), B6 (derived provenance), B7/E6 (provenance
symlinks), B9 (full decoding), B10 (provenance completeness), V1 (independent
WebP/JPEG rejection) and V2 (reactive srcsets). No intent_gap, bad_spec or defer
entry remains. Rejected low findings retain their individual rationale above.

The original implementation agent cannot be re-engaged by this tool, so patches
were applied directly. Three new regressions first reproduced the budget,
zero-dimension and symlink defects; the same cases passed after correction.
Per-format probes prove earlier formats pass before WebP/JPEG rejection, with
no public outputs written. Dynamic-provenance regression passed after removing
hard-coded source facts. The prior Hero overflow fixture was corrected to use
the background category rather than bypassing the project ceiling.

## Verification

- First validate the draft with `npx prettier <spec-path> --check`.
- During Act, run focused generator/component/schema red-green tests, then `npm ci`, `npx ng test --watch=false`, `npm run tokens:check`, `npm run build:pages`, `npm run verify:static` and touched-file formatting. Record bundle delta from 230.25kB.
- Hash derivatives across two images:build runs. Decode dimensions/formats/alpha; enforce budgets. Prove builds do not modify derivatives or invoke generation.
- Use temporary Angular fixtures for development/Pages browser checks at desktop/mobile/320px and no-JS: real AVIF/WebP/JPEG loading, local requests, sizes, intrinsic layout stability, priority, content alt, title/lang/single h1, console/network/CSP, hydration and production SSG/state. Remove fixtures and stop owned servers.
- Archive accepted image schema, metadata and layout cases under `.agents/workspace/spec-kit/{baselines,data,layout-cases}/`; complete independent BMAD review and US4-scoped speckit-analyze.

### Execution Evidence (2026-10-28)

- Clean npm ci passed with the reviewed dependency pin. Final full suite: 246 tests across 11 files pass, along with token parity, Pages build and static verification. Initial bundle: JS 188.36kB + CSS 46.78kB = 235.14kB (+4.89kB from Story 1.3), transfer estimate 60.19kB. No budget warnings or editor diagnostics.
- Two real patched-encoder image builds have identical inventories/SHA-256 across 230 derivatives and provenance. Tests decode every photo candidate, check actual dimensions/formats/budgets, verify source/provenance checksums and logo alpha/roles. Application build preserves all generated image inventories and bytes.
- Development and Pages temporary fixtures pass 1440/390/320px: local AVIF selection, content alt, intrinsic ratio, eager/high versus lazy/async, no overflow, one h1 and es-MX. Development CLS is 0; four fixture components hydrate without NG05xx. Forced WebP and JPEG selection loads all three fixture photos; no-JS contexts load them on both paths at 320px. Pages retains SSG root/ng-state. No console errors, failed or third-party requests; production has no warnings. Development's artificial above-fold lazy fixture can trigger NG0913 and is removed, not suppressed.
- Desktop/mobile fixture screenshots inspected. An older preview stalled in driver scrolling/decode; the fresh owned preview on 4314 passed bounded readiness checks. Final unchanged-shell browser matrix passes at development 4201 and Pages 4314 at 1440/390/320px: original title, es-MX, one h1, no fixture UI/overflow/remote requests, no console errors/warnings or failed requests. Development hydrates one component and nine nodes without warnings; production retains SSG root/ng-state. Both owned servers are stopped.
- After all review patches, two generator runs again yield identical inventories and SHA-256 for 230 derivatives plus provenance. Full pixel buffers decode for every real photo candidate; provenance tests require exact source/derivative inventories, original dimensions, derivative byte sizes and hashes. The final production build preserves all 231 public deliverables verbatim.
- Archived image@2026-10-28.json, accepted metadata and verified layout matrix under the contract's ignored spec-kit paths. No behavior model/log applies to this non-interactive infrastructure. Nothing committed, staged, pushed or deployed.
- Final US4-scoped speckit-analyze is complete and read-only: FR-015/AC1-4 maps to T025-T032; shared FR-011, SC-004 and SC-005 map to T031-T032. All four applicable requirements/criteria and eight tasks have coverage (100%); zero ambiguities, duplications, unmapped tasks, critical issues or constitution conflicts. Spec, plan, tasks and verified code are consistent. US5-US9 remain unplanned. Story spec is done and only Story 1.4 sprint tracking advances to review; no review finding is deferred by this story.
