# Tasks: Epic 1, US1-US4 / BMAD Stories 1.1-1.4

Scope: US1-US4, as allowed by constitution v2.0.0. US4 is approved and implemented;
US5-US9 were drafted here; each was authorized by its own approved story spec.
Sources: Stories 1.1-1.4 implementation specs and this feature's plan, research,
data model and contracts. A drafted BMAD spec is not implementation authorization.

## Phase 1: Setup

The existing Angular/static Pages baseline is delivered. No project initialization is needed.

## Phase 2: Foundational

US1 is clarified and planned. It adds no user action, so behavior models are not prerequisites.

## Phase 3: US1 - Brand Tokens and Material Theme (P1)

**Goal:** Generate synchronized kVA tokens and a supported square, flat Material theme.

**Independent test:** Token export/check, drift and style tests, production/static checks,
and the browser scenarios in quickstart.md all pass.

### Export (Test First)

- [x] T001 [US1] Pin Node-only `yaml` 2.9.1 in package.json and package-lock.json (FR-001).
- [x] T002 [US1] Write failing src/app/core/schemas/design-tokens.spec.ts tests for eight-group fidelity, deterministic ordering, responsive type, references, validation and drift (FR-001-FR-006).
- [x] T003 [US1] Implement scripts/design-tokens.mjs and scripts/design-tokens.d.mts; add tokens:build and tokens:check to package.json, with no writes on import or check (FR-001-FR-006).
- [x] T004 [US1] Generate src/styles/_tokens.scss and src/app/core/schemas/design-tokens.json from DESIGN frontmatter using Prettier; pass exporter tests (FR-001-FR-006).

### Theme (Depends on Export)

- [x] T005 [US1] Record pre-Material JS/CSS sizes in _bmad-output/implementation-artifacts/spec-1-1-brand-design-tokens-and-material-theme.md; pin Material/CDK 22.2.4 without schematics (FR-007, FR-010).
- [x] T006 [US1] Write failing src/styles/styles.spec.ts guards for private selectors, literal colors/spacing and theme wiring (FR-007-FR-010).
- [x] T007 [US1] Add supported token-fed Material APIs in src/styles/_theme.scss; load tokens then theme in src/styles.scss; apply page colors/type, square corners and semantic copper (FR-007-FR-009).

## Phase 4: Verification and Cross-Cutting Gates

- [x] T008 Run npm ci, formatting, token build/check, all unit tests, Pages build and static verification; record final bundle delta and unchanged CSP in _bmad-output/implementation-artifacts/spec-1-1-brand-design-tokens-and-material-theme.md (FR-005-FR-006, FR-010-FR-012).
- [x] T009 Check development and Pages previews per specs/002-epic-1-page-shell/quickstart.md at mobile/desktop and the 1024px boundary, metadata, keyboard, hydration, console/network/CSP, SSG root and ng-state; stop servers (US1 AC3, AC6-AC7).
- [x] T010 Run BMAD code review and speckit-analyze against US1; record findings, verification and risks in _bmad-output/implementation-artifacts/spec-1-1-brand-design-tokens-and-material-theme.md, then update _bmad-output/implementation-artifacts/sprint-status.yaml when gates are met (constitution I, III, IV, VI).

## Dependencies and Delivery Strategy

Execute sequentially: T001 -> T002 (red) -> T003-T004 (green) -> T005 -> T006 (red)
-> T007 (green) -> T008-T009 -> T010. US1 has no earlier-story dependency. Later
stories remain unplanned and cannot start from this task list.

Exporter and style-test design are independent review opportunities, but this BMAD run
requires sequential execution; no parallel implementation tasks are authorized. The MVP
is US1 alone, verified independently before another story starts. No deployment or commit
is authorized.

## Traceability

| Requirement | Tasks           |
| ----------- | --------------- |
| FR-001      | T001-T004       |
| FR-002      | T002-T004       |
| FR-003      | T002-T004, T009 |
| FR-004      | T002-T004       |
| FR-005      | T002-T004, T008 |
| FR-006      | T002-T004, T008 |
| FR-007      | T005-T007       |
| FR-008      | T006-T007       |
| FR-009      | T006-T009       |
| FR-010      | T005, T008      |
| FR-011      | T008-T009       |
| FR-012      | T006-T008       |

| Success Criterion | Tasks           |
| ----------------- | --------------- |
| SC-001            | T002-T004       |
| SC-002            | T002-T004, T009 |
| SC-003            | T002-T004, T008 |
| SC-004            | T005, T008      |
| SC-005            | T008-T009       |

SC-006 and SC-007 belong to later epic stories, not US1.

Behavior models and runtime transition logs are not applicable: US1 adds no portfolio user action.

## US2 - Self-Hosted Fonts and Icon Set

Execute sequentially, test first. FR-013 and US2 AC1-3 map to every task below;
the complete matrix is in [contracts/fonts-and-icons.md](contracts/fonts-and-icons.md).

- [x] T011 [US2] Clarify/plan US2 in spec.md, plan.md, research.md, data-model.md and contracts/fonts-and-icons.md before Act.
- [x] T012 [US2] Write failing src/styles/styles.spec.ts font, preload, typography and real asset guards (AC1-3).
- [x] T013 [US2] Source fonts/icons and provenance under public/media; implement src/styles/_fonts.scss, styles.scss and index.html, then pass style guards (AC1-3).
- [x] T014 [US2] Write failing src/app/core/icons/icons.spec.ts for actual SVG retrieval, unknown names, caching, base paths and decorative glyphs (AC2).
- [x] T015 [US2] Implement icons.ts and app.config.ts initialization/HTTP with fixed sanitized local URLs; pass icon tests (AC2).
- [x] T016 [US2] Run full tests, token/format checks, Pages/static build and development/Pages browser matrix; record sizes and CLS in Story 1.2 (AC1-3).
- [x] T017 [US2] Run BMAD review and US2-scoped speckit-analyze; resolve findings, update Story 1.2 and sprint status only when gates pass (AC1-3).

US2 behavior models and transition logs are inapplicable. At the US2 handoff,
US3-US9 remained unplanned; the US3 plan and completed tasks follow below.

## US3 - Content Facade and UI Strings

Execute sequentially after BMAD approval, test first. FR-014 and US3 AC1-5 govern
this slice; shared static/privacy criteria remain applicable. Earlier scope notes
describe the historical US1/US2 revisions, not US3's current readiness.

- [x] T018 [US3] Clarify/plan spec.md, plan.md, research.md, data-model.md, quickstart.md and contracts/content-facade.md; extend tasks before Act (AC1-5).
- [x] T019 [US3] First write src/app/core/content/ui-strings.content.spec.ts validation/mutation tests; implement src/app/core/schemas/ui-strings.schema.json, content/ui-strings.md and src/app/core/content/ui-strings.content.ts from EXPERIENCE defaults except Hero-owned rows (AC1).
- [x] T020 [US3] First write src/app/core/content/content-facade.spec.ts; implement content-facade.ts and migrate src/app/app.ts/app.spec.ts for readonly content, exact formatting, import ownership and ordered populated sections (AC2-3).
- [x] T021 [US3] Implement test-only scripts/content-checks.mjs/.d.mts with structured parsers and src/app/core/content/template-content.spec.ts positive/negative fixtures; scan external/inline templates and production raw imports in npm test (AC3-4).
- [x] T022 [US3] First add a negative validation-leak fixture, then strengthen scripts/verify-static-build.mjs runtime graph/output exclusions without weakening existing checks (AC5).
- [x] T023 [US3] Run full tests, touched-file formatting, tokens, Pages/static and development/Pages/no-JS browser checks; archive schema/cases at spec.md's paths and record bundle delta in Story 1.3 (AC1-5).
- [x] T024 [US3] Complete BMAD review and US3-scoped speckit-analyze; resolve findings, record evidence and update _bmad-output/implementation-artifacts/sprint-status.yaml only when gates pass (AC1-5).

| Requirement / Scenario       | Tasks                |
| ---------------------------- | -------------------- |
| FR-014 / AC1                 | T018-T019, T023-T024 |
| FR-014 / AC2                 | T020, T023-T024      |
| FR-014 / AC3                 | T020-T021, T023-T024 |
| FR-014 / AC4                 | T021, T023-T024      |
| FR-014 / AC5                 | T022-T024            |
| Shared static/security gates | T022-T024            |

US3 behavior models and flow logs are inapplicable. US4-US9 remained unplanned at that handoff.

## US4 - Image Pipeline and Shared Renderer

The approved Story 1.4 spec authorizes US4 only. Execute sequentially, test first.
FR-015 and Story 1.4 AC1-4 govern these tasks; US5-US9 remain unplanned.

- [x] T025 [US4] Clarify/plan spec.md, plan.md, data-model.md and contracts/responsive-images.md before Act (AC1-4).
- [x] T026 [US4] Establish scripts/build-images.spec.ts discovery and fixture red tests (AC1-2).
- [x] T027 [US4] Implement scripts/build-images.mjs/.d.mts, images.manifest.json and pinned dev-only Sharp with explicit images:build (AC1-2).
- [x] T028 [US4] Generate all public/media photos/logo roles; decode, budget-check and compare two-run hashes; retain PROVENANCE.md (AC1-2).
- [x] T029 [US4] Test then implement images.content.ts/.spec.ts, image.schema.json, facade exposure and content/images.md (AC3).
- [x] T030 [US4] Test then implement shared/responsive-image component, template and styles (AC3).
- [x] T031 [US4] Extend static checks/README; full tests, clean install, tokens, formatting, build/static, bundle delta and build-independence checks (AC4).
- [x] T032 [US4] Temporary browser fixtures, archives, independent BMAD review and US4-scoped spec-kit analysis; record evidence and advance only Story 1.4 when gates pass (AC1-4).

| Acceptance | Tasks           |
| ---------- | --------------- |
| AC1        | T026-T028, T032 |
| AC2        | T026-T028, T032 |
| AC3        | T029-T030, T032 |
| AC4        | T031-T032       |

## US5 - Footer, Direct Contact Links and Privacy Notice

The approved Story 1.5 spec authorizes US5 only. Execute sequentially, test first.
FR-003, FR-014, FR-020 and Story 1.5 AC1-4 govern; US6-US9 remain unplanned.

- [x] T033 [US5] Clarify/plan spec.md, plan.md, data-model.md and contracts/footer-contact-privacy.md before Act (AC1-4).
- [x] T034 [US5] Test then implement core/effects types, behaviors/behavior-model.ts and direct-contact-links model (AC3).
- [x] T035 [US5] Test then implement core/contact builder with encoding and parity (AC2).
- [x] T036 [US5] Test then extend site schema/content/content doc and forbidden-channel scan (AC1).
- [x] T037 [US5] Test then add privacy-notice schema/content/doc and facade exposure (AC4).
- [x] T038 [US5] Test then implement features/footer (AC3).
- [x] T039 [US5] Test then implement features/privacy and app-shell wiring (AC4).
- [x] T040 [US5] Full gates, browser/no-JS checks, archives, independent BMAD review and US5-scoped spec-kit analysis; advance only Story 1.5 (AC1-4).

| Acceptance | Tasks            |
| ---------- | ---------------- |
| AC1        | T036, T040       |
| AC2        | T035, T040       |
| AC3        | T034, T038, T040 |
| AC4        | T037, T039, T040 |

## US6 - Contact Section with Direct Links and Copy-Address Fallback

The approved Story 1.6 spec authorizes US6 only. Execute sequentially, test first.
FR-017 (PRD FR12, FR17, FR20) and Story 1.6 AC1-6 govern; US7-US9 remain unplanned.

- [x] T041 [US6] Clarify/plan spec.md, plan.md, data-model.md and contracts/contact-section.md before Act (AC1-6).
- [x] T042 [US6] Write table-driven tests first in src/app/behaviors/copy-address.behavior.spec.ts; implement copy-address.behavior.ts and write JSONL flow log (AC3).
- [x] T043 [US6] Write unit tests first in src/app/core/effects/effects.spec.ts; implement EffectRunner for copy and announce in src/app/core/effects/effects.ts (AC3-5).
- [x] T044 [US6] Test first then extend site.schema.json, site.content.ts, content/site.md and ContentFacade.visibleSections with contactLogo and 'contacto' (AC2).
- [x] T045 [US6] Test then implement shared shell rhythm and section heading corner-rule styles in src/styles.scss, src/styles/styles.spec.ts, src/app/app.scss, footer.scss and privacy (AC1).
- [x] T046 [US6] Test first then implement src/app/features/contact/{contact.ts,contact.html,contact.scss,contact.spec.ts} and wire into src/app/app.{ts,html,spec.ts} (AC2-6).
- [x] T047 [US6] Extend scripts/verify-static-build.mjs and scripts/content-checks.mjs fixture for prerendered #contacto and hidden copy button (AC2, AC6).
- [x] T048 [US6] Full gates, browser/no-JS checks, archives, independent BMAD review and US6-scoped spec-kit analysis; advance only Story 1.6 (AC1-6).

| Acceptance | Tasks                  |
| ---------- | ---------------------- |
| AC1        | T041, T045, T048       |
| AC2        | T041, T044, T046-T048  |
| AC3        | T041-T043, T046, T048  |
| AC4        | T041, T043, T046, T048 |
| AC5        | T041, T043, T046, T048 |
| AC6        | T041, T046-T048        |

## US7 - Hero Section

The approved Story 1.7 spec authorizes US7 only. Execute sequentially, test first.
FR-018 (PRD FR4) and Story 1.7 AC1-5 govern; US8-US9 remain unplanned.

- [x] T049 [US7] Clarify/plan spec.md, plan.md, data-model.md, tasks.md and contracts/hero-section.md before Act (AC1-5).
- [x] T050 [US7] Test first then add content/hero.md, hero.schema.json, hero.content.ts/.spec.ts with copy limits, required proof point and proof-point fact check (AC1).
- [x] T051 [US7] Test first then expose `hero` and register the `'hero'` visible section in content-facade.ts/.spec.ts (AC1, AC5).
- [x] T052 [US7] Test first then implement features/hero/{hero.ts,hero.html,hero.scss,hero.spec.ts} and `--kva-hero-*` shell properties in src/styles.scss (AC1-5).
- [x] T053 [US7] Wire `<app-hero />` first in `<main>`, drop the placeholder h1/p, update app tests, add the image preload to src/index.html (AC1, AC3).
- [x] T054 [US7] Extend scripts/verify-static-build.mjs and scripts/content-checks.mjs fixture for `#inicio`, single h1, `#contacto` CTA, no `#servicios` link and preload (AC1, AC3, AC5).
- [x] T055 [US7] Full gates, browser checks at 360x640/320/768/1440, independent BMAD review; advance only Story 1.7 (AC1-5). US7-scoped spec-kit analysis not run.

| Acceptance | Tasks                      |
| ---------- | -------------------------- |
| AC1        | T049-T051, T053-T055       |
| AC2        | T049, T052, T055           |
| AC3        | T049, T052-T055            |
| AC4        | T049, T052, T055           |
| AC5        | T049, T051-T052, T054-T055 |

## US8 - Sticky Header and Section Navigation

The approved Story 1.8 spec authorizes US8 only. Execute sequentially, test first.
FR-019 (PRD FR1-FR3) and Story 1.8 AC1-5 govern; US9 remains unplanned.

- [x] T056 [US8] Clarify/plan spec.md, plan.md, data-model.md, tasks.md and contracts/section-navigation.md before Act (AC1-5).
- [x] T057 [US8] Test first then add behaviors/section-navigation.behavior.ts/.spec.ts (AC3).
- [x] T058 [US8] Test first then add core/layers/layers.ts/.spec.ts, EffectRunner focus/scroll/navigate and the history-ownership guard (AC3, AC4).
- [x] T059 [US8] Test first then add core/navigation/section-navigation.ts/.spec.ts adapter (AC3, AC4).
- [x] T060 [US8] Test first then add `headerWordmark` UI string and `headerLogo` site content (AC1).
- [x] T061 [US8] Test first then implement `features/header/*`, skip-link, Hero tweaks, `app.*` and `--kva-header-*` shell properties (AC1, AC2, AC4, AC5).
- [x] T062 [US8] Extend scripts/verify-static-build.mjs, scripts/content-checks.mjs fixture and template-content.spec.ts (AC1, AC5).
- [x] T063 [US8] Full gates, browser checks at 360x640/320/768/1024/1440 and no-JS, review; advance only Story 1.8 (AC1-5).

| Acceptance | Tasks                        |
| ---------- | ---------------------------- |
| AC1        | T056, T060-T063              |
| AC2        | T056, T061, T063             |
| AC3        | T056-T059, T063              |
| AC4        | T056, T058, T059, T061, T063 |
| AC5        | T056, T061-T063              |

## US9 - Mobile Menu

The approved Story 1.9 spec authorizes US9 only. Execute sequentially, test first.
FR-020 (PRD FR1, UX-DR10/30) and Story 1.9 AC1-6 govern.

- [x] T064 [US9] Clarify/plan spec.md, plan.md, data-model.md, tasks.md and contracts/mobile-menu.md before Act (AC1-6).
- [x] T065 [US9] Test first then add behaviors/mobile-menu.behavior.ts/.spec.ts (AC2-5).
- [x] T066 [US9] Test first then extend core/layers/layers.ts/.spec.ts and add the EffectRunner `layer` executor (AC3, AC4).
- [x] T067 [US9] Test first then add core/navigation/mobile-menu.ts/.spec.ts adapter and export isPlainClick (AC2-5).
- [x] T068 [US9] Test first then add the `menuNavLabel` UI string in content/ui-strings.md, ui-strings.content.ts and the schema (AC1).
- [x] T069 [US9] Test first then implement features/header toggle, sheet, focus trap, wide-resize close and the styles.scss shell properties (AC1, AC3-6).
- [x] T070 [US9] Extend scripts/verify-static-build.mjs, scripts/content-checks.mjs fixture and template-content.spec.ts (AC1, AC6).
- [x] T071 [US9] Full gates, browser checks at 360x640/320/768/1023/1024/1440 and no-JS, review; advance only Story 1.9 (AC1-6).

| Acceptance | Tasks                  |
| ---------- | ---------------------- |
| AC1        | T064, T068-T071        |
| AC2        | T064-T067, T071        |
| AC3        | T064, T066, T069, T071 |
| AC4        | T064-T067, T069, T071  |
| AC5        | T064-T067, T069, T071  |
| AC6        | T064, T069-T071        |
