# Tasks: Epic 1, US1-US2 / BMAD Stories 1.1-1.2

Scope: US1 and US2, as allowed by constitution v2.0.0. US3-US9 remain drafted and are
not authorized for implementation by this task list. Sources: the approved Stories 1.1
and 1.2 implementation specs and this feature's plan, research, data model and contracts.

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

US2 behavior models and transition logs are inapplicable. US3-US9 remain unplanned.
