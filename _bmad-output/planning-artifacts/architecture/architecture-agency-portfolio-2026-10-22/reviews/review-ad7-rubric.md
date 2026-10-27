---
title: "Good-spine rubric review after AD-7 update"
reviewed: ../ARCHITECTURE-SPINE.md
date: 2026-10-27
inputs:
  - ../../../../../.specify/memory/constitution.md
  - ../../../../../specs/002-epic-1-page-shell/spec.md
  - ../../../../../specs/002-epic-1-page-shell/plan.md
  - ../../../../implementation-readiness.md
verdict: REVISE
---

# Good-spine rubric review — AD-7 update

## Verdict

**REVISE.** The AD-7 update is aligned with the constitution and Epic 1 plan: it selects a
declarative model, rules out per-model `transition()` functions, attaches effects to
transitions, and keeps model/test work in Plan before Act. However, the contract still does
not make the descriptor authoritative over the feature's executable transition behavior.
Two feature teams can satisfy the stated shape and row-coverage requirement while implementing
different transition/effect semantics. The Deferred table also still lists token-sync
implementation after the current plan and readiness report say it is built by US1.

## Rubric

| Criterion | Result | Assessment |
|---|---|---|
| Decisions are enforceable invariants | **Partial** | AD-1–6 and AD-8–14 have sufficiently explicit owners, constraints, or verification hooks for this review. AD-7 requires a typed descriptor and transition tests, but does not specify a shared contract or how tests prove that feature behavior conforms to descriptor rows. |
| Units following the behavior-model contract can still diverge | **Yes** | AD-7 says features implement transitions and `core/effects` executes effects, but does not define a shared model/effect type or the runtime/test conformance boundary. Independent features can assign different meanings or payloads to the same effect category, or test model rows without exercising their implementation. |
| Deferred is adequate | **Partial** | Host/header protections and Lighthouse have stated constraints or revisit triggers; image tooling leaves the AD-14 runtime contract fixed. Token-sync implementation is stale: the plan and readiness report say US1 builds it. |
| The AD-7 change remains aligned to the project | **Pass** | The update preserves the accepted interaction requirements, transition coverage, pre-Act model gate, static-site constraints, and no-JavaScript behavior. No scope or UX regression is introduced by choosing declarative descriptors. |

## Findings

### F1 — AD-7 does not bind declared transitions to executable behavior

**Location:** `ARCHITECTURE-SPINE.md:87–91`; `.specify/memory/constitution.md:32–39`;
`specs/002-epic-1-page-shell/spec.md:421–425`.

The documents agree on the descriptor's fields and the closed set of effect categories, but
do not require one shared `BehaviorModel` type, define effect payload/dispatch semantics, or
state that transition tests must drive the actual feature implementation from the descriptor.
“Feature code implements the declared transitions” is therefore a review expectation rather
than a mechanically checkable relationship. For example, two features can both declare
`closed --OPEN--> open` with a `layer` effect and cover that row, yet interpret the effect
payload or precondition differently; tests that only inspect each model's rows still pass.
That leaves the model/implementation drift AD-7 is intended to prevent.

**Recommendation:** Define a shared model type and discriminated effect payload contract, and
require a common conformance test/harness that applies declared rows to the actual feature
transition handling and verifies state and effect outcomes, including preconditions. This
does not require per-model `transition()` functions.

### F2 — Token-sync deferral contradicts current planning status

**Location:** `ARCHITECTURE-SPINE.md:211–219`, especially line 219;
`specs/002-epic-1-page-shell/plan.md:127–128`;
`_bmad-output/planning-artifacts/implementation-readiness.md:46–51`.

The spine says token-sync implementation “can follow story work,” while the plan says token
sync is now built by US1 and the readiness report flags the Deferred entry as out of date.
This makes the status of the parity mechanism ambiguous to implementers and reviewers.

**Recommendation:** Reconcile the Deferred entry with US1's delivered scope; retain only any
remaining unbuilt token-sync work, if applicable.

## No additional material findings

No additional material findings for AD-1–6 or AD-8–14, or for alignment with the current
project behavior and delivery constraints. The host/header, Lighthouse, and image-tooling
deferrals state a rationale or trigger; the token-sync entry above is the stale exception.
