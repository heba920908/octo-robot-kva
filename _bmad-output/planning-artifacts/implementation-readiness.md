---
type: implementation-readiness
date: 2026-10-27
verdict: CONCERNS
decision: proceed (resolve concerns 1–2 before the first story enters Act)
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

Two governance conflicts would make a developer decide something the documents do not record.

## Findings (by severity)

### 1. Behaviour model shape conflict (medium; blocks Story 1.6)

- **Constitution §II:** a model declares `id`, `actor`, `trigger`, `preconditions`, `states`,
  `transitions`, `effects`, and `acceptance`.
- **Architecture AD-7:** a model exports `State` and `Event` types and a pure `transition()`
  that returns the next state and its effects.
- **Rule:** the constitution prevails until it is amended.
- **Fix:** amend the constitution to accept the AD-7 shape, with `id` and `acceptance`
  metadata (`speckit-constitution`). Or change AD-7 (`bmad-correct-course`).

### 2. Plan → Act gate not planned (medium; blocks every story)

**Status: spec granularity resolved (2026-10-27).** Constitution v1.2.0 sets one spec-kit
feature spec per epic. Behaviour-model PR sequencing is still open; Story 1.1 builds no
model, so it is not blocked.

- The constitution requires a merged behaviour model and a clarified `specs/NNN-*` feature
  spec before Act.
- The stories build the model and its implementation together.
- No spec beyond `specs/001` is planned.
- **Decide:**
  - Spec granularity: one spec per epic or one per story.
  - Whether each behaviour model ships as a separate PR before the story's Act PR.
- **Fix:** record the decision with `speckit-constitution` or `bmad-correct-course`.

### 3. Architecture Deferred table out of date (low)

- `ARCHITECTURE-SPINE.md` › Deferred lists image derivative tooling and token sync.
- Stories 1.4 (`sharp`, `npm run images:build`) and 1.1 (token export and parity test) build
  them.
- **Fix:** update the Deferred table (`bmad-architecture`).

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
