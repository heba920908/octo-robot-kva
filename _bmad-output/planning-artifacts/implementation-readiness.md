---
type: implementation-readiness
date: 2026-10-27
verdict: CONCERNS
decision: proceed (Story 1.1 is ready for Act; later stories must clear their individual spec and behaviour-model gates)
inputs:
  - prds/prd-agency-portfolio-2026-10-19/prd.md
  - ux-designs/ux-agency-portfolio-2026-10-21/DESIGN.md
  - ux-designs/ux-agency-portfolio-2026-10-21/EXPERIENCE.md
  - architecture/architecture-agency-portfolio-2026-10-22/ARCHITECTURE-SPINE.md
  - epics.md
  - ../../.specify/memory/constitution.md
---

# Implementation Readiness: agency-portfolio

## Verdict: CONCERNS

The plan can be built. Brief, PRD, UX, architecture, and epics are all final.

- FR1–FR20 and NFR1–NFR5 each map to a story.
- UX-DR1–UX-DR32 are each cited by at least one story.
- AD-2 and AD-11 are covered by the `specs/001` baseline. The other ADs are cited by stories.
- Epics have no forward dependencies, and PRD §10 has no blocking question.

The previously identified governance conflicts are resolved. Story 1.1's epic-spec section is
clarified and planned, and it introduces no behaviour model, so it can enter Act. Later stories
must clear their own spec and behaviour-model gates before Act.

## Findings (by severity)

### 1. Behaviour-model contract (medium)

**Status: resolved (2026-10-27).** Constitution v2.0.0, BMAD protocols, the source epic and
AD-7 now require the same shared `BehaviorModel` contract: a pure transition function with
metadata and stable acceptance IDs. The function returns state and ordered typed effects (or
`null` for an unsupported pair), is exercised directly by table-driven tests, and is the only
transition source; interaction tests verify the adapter applies non-null results once and
applies no effects for `null`. Models and their colocated tests merge during Plan before the
story enters Act.

### 2. Plan → Act gate (medium)

**Status: resolved (2026-10-27).** Constitution v2.0.0 establishes one spec per epic and
defines the pure transition-function model. Story 1.1's section is clarified and planned.
Stories that introduce a model must merge that model and its transition/adapter tests during
Plan before their Act implementation begins.

### 3. Architecture Deferred table out of date (low)

**Status: resolved (2026-10-27).** Token sync is assigned to Story 1.1 and removed from
Deferred. Image derivative tooling remains deferred from the architecture but is explicitly
owned by Story 1.4.

### 4. `design-tokens.json` path not pinned (low)

**Status: resolved (2026-10-27)** in `specs/002-epic-1-page-shell` (FR-001):
`src/app/core/schemas/design-tokens.json`.

- Story 1.1 does not give a path.
- Constitution §IV requires `src/app/core/schemas/design-tokens.json`.
- **Fix:** follow the constitution path in Story 1.1.

### 5. Ordering problem between Stories 3.2 and 3.3 (low)

- Story 3.2's stacked-over-composer acceptance criterion needs the "Leer el Aviso de
  privacidad" link.
- Story 3.3 adds that link.
- **Fix:** move the link into Story 3.2, or test the stack through `core/layers` in 3.2.

### 6. Story 6.4 axe tooling unclear (low)

- The story requires "axe via Playwright" but forbids adding it as a dependency.
- **Fix:** name the ad-hoc mechanism, such as `npx` in `.agents/workspace/`, or approve a
  devDependency.

### 7. `epics.md` not committed (housekeeping)

- **Fix:** commit `_bmad-output/planning-artifacts/epics.md` with this file.
