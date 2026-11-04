---
title: 'Story 1.2: Self-Hosted Fonts and Icon Set'
type: 'feature'
created: '2026-10-28'
status: 'done'
route: 'dispatch'
baseline_commit: '6b22b13ea154a7f198835487b2688765e6edcfaf'
story_key: '1-2-self-hosted-fonts-and-icon-set'
review_loop_iteration: 0
context:
  - '{project-root}/specs/002-epic-1-page-shell/spec.md'
  - '{project-root}/specs/002-epic-1-page-shell/plan.md'
---

<frozen-after-approval reason="human-owned intent - do not modify unless human renegotiates">

## Intent

**Problem:** The theme names Quicksand and Outfit, but neither font is shipped and components have no registered icon set. Visitors currently see fallback typography rather than the approved brand faces.

**Approach:** Ship licensed, local variable fonts with measured fallback metrics and a shared registered SVG line-icon set. Preserve static prerendering, privacy, and GitHub Pages deployment.

## Boundaries & Constraints

**Always:** Follow Story 1.2, UX-DR3/4 and AD-10/13. Ship latin variable WOFF2 Quicksand/Outfit, weights 300-600, swap and metric-matched size-adjust fallbacks. Preload only Quicksand. Preserve tokens, theme APIs, es-MX, title, single h1, hydration and CSP. Retain licenses/source evidence. Icons: 24px line SVGs, 1.5px stroke, square caps. Test first.

**Never:** Add remote runtime assets, icon fonts, private Material selectors, dynamic SVG URLs or Markdown application imports. No later-story UI or behavior models. No commits, branches, pushes, deployments or external settings.

## I/O & Edge-Case Matrix

| Scenario              | Input / State                                                                             | Expected Output / Behavior                                                                                     | Error Handling                                              |
| --------------------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Font loading          | Development root or Pages base path                                                       | Both local variable families load; only Quicksand has a matching crossorigin preload                           | Missing assets fail verification                            |
| Slow or blocked fonts | Font loading delayed or denied                                                            | Readable metric-adjusted local fallback; content remains visible and unclipped                                 | No invisible-text dependency                                |
| Typography            | Quicksand roles and label; sentence-case Project title                                    | CSS casing with Project-title exception; weights at least 400 under 28px; display mobile sizing follows UX-DR3 | Tests cover role and breakpoint boundaries                  |
| Named icon            | menu, close, arrow-left, arrow-right, copy, check, phone, mail, chat, chevron-down, error | Registered same-origin SVG, 24px viewBox, no fill, 1.5px stroke, square caps                                   | Unknown names use registry failure; never a remote fallback |
| Icon access           | Decorative glyph or future icon-only control                                              | Glyph remains decorative; consuming control owns its accessible name                                           | No hard-coded user-facing labels added                      |

</frozen-after-approval>

## Code Map

- `src/styles.scss` composes generated tokens/theme; `src/styles/_theme.scss` already uses family tokens. Preserve generated files and focus rules.
- `src/index.html` owns base/CSP; `src/app/app.config.ts` provides hydration/error listeners, but no HTTP/icons.
- `src/styles/styles.spec.ts` owns reusable style guards; `public/media/` owns published assets.
- `specs/002-epic-1-page-shell/`: US2 is drafted, US1 complete. Clarify/plan US2 before Act; retain other stories.

## Tasks & Acceptance

**Execution:**

- [x] `specs/002-epic-1-page-shell/{spec,plan,research,data-model,tasks}.md`, `contracts/fonts-and-icons.md` -- clarify/plan US2 and trace its tasks before Act.
- [x] `public/media/fonts/`, `public/media/icons/` -- source OFL variable latin fonts and licensed Lucide-derived icons; retain notices/provenance and normalize SVGs.
- [x] `src/styles/styles.spec.ts` -- failing font/preload/typography/asset matrix guards first.
- [x] `src/styles/_fonts.scss`, `src/styles.scss`, `src/index.html` -- font faces, measured fallbacks, role styles and preload; CSS/preload must resolve to one asset in both deployments.
- [x] `src/app/core/icons/icons.spec.ts`, `icons.ts`, `src/app/app.config.ts` -- test then implement MatIconRegistry, fixed sanitized local URLs and HTTP; cover actual SVG retrieval, unknown names, caching and Pages paths.
- [x] This spec and `_bmad-output/implementation-artifacts/sprint-status.yaml` -- record evidence; advance only this story as gates pass.

**Acceptance Criteria:**

- Given US2 planning, when Act starts, then clarified requirements and tasks cover every criterion; behavior models are inapplicable.
- Given implementation, when focused tests run, then the matrix passes without token drift.
- Given both previews, when desktop/mobile, delayed-font and named-icon fixtures run, then same-origin assets, readable fallbacks, contracted typography and CLS <= 0.1 are verified.
- Given Pages output, when verified, then CSP, SSG/state and no executable inline scripts are preserved; initial bundles remain below 1MB. Record delta from Story 1.1's 183.75kB.

## Implementation Notes

- Approved by the user on 2026-10-28 after rereading the externally edited draft.
- Keep this build spec and the Epic 1 US2 specification synchronized throughout implementation and verification.
- US2 clarification, plan, research, data model, asset contract and tasks now cover fonts, typography and icons. Later stories remain drafted.
- Independent focused checks passed: 32 style/icon cases; after temporary fixture removal, 29 shell/icon cases; after font metadata correction, six style cases.
- Temporary development/Pages fixtures verified all eleven decorative SVGs, token roles, casing exceptions, mobile display/weight boundaries and no overflow at 320-1440px. Fixtures and MatIcon shell import were removed afterward.
- Delayed font checks measured CLS 0 at 360px development and 320/1440px Pages. Blocked fonts remain readable at 320px with loaded local fallbacks. Each font requested once from the site origin; no third-party requests, application errors or CSP/hydration warnings. Pages retained SSG root/state and development logged healthy hydration.
- Quicksand's modified subset was internally renamed to KVA Titles for its reserved-name notice; original attribution and CSS alias remain. fontTools verified embedded names, latin repertoire and the 300-600 axis. Updated checksum is in font provenance; metrics are unchanged.
- Clean-install verification passed: npm ci, all 56 tests in five files, token parity, Pages build and static verification. Final fixture-free initial JS 177.50kB (+34.55), CSS 46.73kB (+5.93), total 224.23kB (+40.48 versus Story 1.1); estimated transfer 57.36kB. Fonts total 54,076 bytes outside initial JS/CSS. No budget warnings.
- Final clean development/Pages checks passed after metadata correction and fixture removal: local fonts each requested once, no third-party requests/errors, one h1, es-MX, healthy one-component development hydration and production SSG/state. No-JS production content reflows at 320px. Desktop/mobile screenshots inspected; no new keyboard controls ship.
- npm ci retains the five previously reported audit vulnerabilities (one low, three moderate, one high); unrelated dependency changes are outside this story.
- US2-scoped speckit-analyze completed read-only: FR-013 and shared SC-005 have 100% task coverage, all three US2 scenarios covered, no blocking constitution conflicts. Non-blocking findings: qualify fallback behavior when Arial is unavailable and annotate historical US1-only wording. Integrated review follows.
- All three integrated review layers completed. Their thirteen findings received individual verdicts below. Verification fixes add dev-only fontkit 2.0.4, decoded-font metadata/checksum/glyph tests, emitted-font validation and reusable browser helpers; no Playwright dependency or fixture UI ships.
- Review regression tests failed first (missing parser and Linux fallback), then seven style cases passed. A truncated emitted font was rejected by the static gate. A browser mutation removing h1 from the narrow-screen weight selector changed actual weight to 300 and was rejected by the retained assertion.
- Retained browser helpers passed at eight widths on development/Pages, including every typography role, actual h1 weight, casing and font decode/preload reuse. Twelve delayed/blocked/no-local runs at 320/1440px passed visibility/reflow and measured CLS 0. Font-local failure is intentionally simulated; fallback metrics remain platform-dependent when neither local face exists.
- The pre-existing 72ch prose-width omission is recorded in deferred-work.md for section layout work. Rare font-regeneration automation and a future public icon-name type were rejected as disproportionate additions, not unresolved runtime defects.
- Final authoritative verification supersedes earlier measurements: npm ci, all 57 tests across five files, token parity, full touched-file formatting, Pages build and strengthened static verification pass. Initial JS 177.50kB, CSS 46.78kB, total 224.27kB (+40.52kB versus Story 1.1); estimated transfer 57.37kB. fontkit is absent from production JavaScript; decoded emitted fonts match source assets.
- Final US2-scoped speckit-analyze confirms 100% task coverage for four scoped/shared requirements, all three acceptance scenarios covered, no blocking findings or constitution conflicts. Earlier pending-review/count summaries are historical; this entry and the Epic US2 verification summary are authoritative.
- All implementation/review tasks are complete. One pre-existing reading-width issue is deferred; no Story 1.2 runtime defect is left open. Browser helpers require a compatible existing page runner rather than an automatic npm browser gate; future content must repeat layout checks.
- Development and Pages preview servers were stopped. Changes remain uncommitted; explicit user approval is required before any commit, push or external publication.

## Spec Change Log

## Review Triage Log

| ID | Verdict | Evidence and route |
| --- | --- | --- |
| B1 | low | Without installed Arial, metric adjustment can be lost. Direct patch adds metric-compatible Liberation Sans; no-local browser probes pass readability/reflow and CLS 0. Provenance qualifies generic fallback metrics. |
| B2 | medium | Static Arial was falsely declared variable 300-600. Patch declares 400 so browser weight synthesis remains available; focused guard passes. |
| B3 | low | Baseline body already lacks the 72ch prose limit; not introduced by fonts. Defer to prose section layouts, without narrowing the page body. |
| B4 | low | No current consumer requires a public IconName type; registry rejects unknown names at runtime. Reject: speculative caller typing would add public surface for future features. |
| B5 | medium | Four signature bytes did not validate font contents. Patch uses fontkit to decode both assets, inspect axes/Spanish glyphs/family/checksums and reject truncated data. |
| B6 | medium | Hard-coded URL unit assertions alone did not establish emitted URL/preload reuse. Patch retained browser helper verifies actual requests for both families at both bases. |
| B7 | medium | Source-string checks could miss selector/cascade regressions. Patch retained computed-style assertions for every role and actual h1 across eight widths. |
| B8 | medium | Externalized font paths escaped bundler validation. Patch static verifier decodes emitted files and checks glyphs/axis; corrupt-output mutation correctly fails. |
| B9 | low | Provenance records pinned revisions, tool version, ranges, commands, renaming and hashes; it is not an executable regeneration pipeline. Reject: rare asset regeneration does not justify a new maintained build pipeline in this integration story. |
| B10 | medium | Removed browser fixture was not repeatable. Patch scripts/verify-typography.mjs retains normal/delayed/blocked/no-local tests outside shipped UI, with quickstart instructions. |
| E1 | low | Same local-font availability limitation as B1. Patch compatible local fallback and qualify missing-local behavior; mobile/desktop probes pass CLS 0 even with all local faces absent. |
| V1 | medium | Pre-verified: removing only h1 from the narrow weight selector bypassed string guards. Patch retained actual-heading assertions; browser mutation confirms rejection at 320px. |
| V2 | medium | Pre-verified: truncated WOFF2 could pass signature-only tests. Patch fontkit unit/static decoding and browser load assertions; corrupt emitted font is rejected. |

## Design Notes

Register fixed URLs centrally; registration does not preload SVGs. Use modern Angular initialization APIs. Verify SSR/browser icons with a temporary fixture, not a permanent gallery. Derive fallback metrics from shipped fonts and a named local fallback; record the calculation.

## Verification

- `npm ci`; focused style/icon tests via `npx ng test --watch=false --include=...`, red then green; full tests; Prettier; `npm run tokens:check`.
- `npm run build:pages`; `npm run verify:static`; record asset/bundle sizes.
- Integrated browser tools with `npx ng serve` and `npm run preview:pages`: desktop/mobile, 320px reflow, computed fonts, preload reuse, icons, delayed fonts, console/network/CSP, hydration, SSG/state, no-JS. Stop owned servers.
- BMAD review and US2-scoped `speckit-analyze` before Done; behavior logs inapplicable.
