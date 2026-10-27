# Adversarial review: AD-7 and Constitution §II

## Summary

The declarative contract resolves the previous shape disagreement and the Plan → Act
sequencing gate. It does not yet guarantee deterministic transition behavior, exactly-once
effects, or tests that exercise the feature's implementation rather than the descriptor.

## Findings

### High — Duplicate `(from, event)` rows can define contradictory behavior

**Location:** `.specify/memory/constitution.md:33–39`; AD-7 in
`_bmad-output/planning-artifacts/architecture/architecture-agency-portfolio-2026-10-22/ARCHITECTURE-SPINE.md:91`

**Trigger:** A descriptor contains multiple rows for the same source state and event, with
different destinations or effects. Neither the finite-state requirement nor “every declared
transition” requires a unique match.

**Counterexample:** `mobile-menu` declares `closed + Escape → closed [layer]` and
`closed + Escape → open [focus]`. `section-navigation` similarly declares two different
destinations for `current + select-contact`. Both descriptors have finite states and
declared effects; each row can have a table-driven test. Feature code has no contractually
defined choice between the rows.

**Guard:** Require at most one transition per `(from, event)` (or define explicit,
deterministic guards and precedence), and test duplicate rejection.

**Consequence:** The descriptor does not determine one next state/effect list; implementations
can differ while claiming conformance.

### High — Transition tests can pass without validating feature behavior

**Location:** `.specify/memory/constitution.md:37–39`; AD-7 in
`_bmad-output/planning-artifacts/architecture/architecture-agency-portfolio-2026-10-22/ARCHITECTURE-SPINE.md:91`;
epic spec `specs/002-epic-1-page-shell/spec.md:423–425`

**Trigger:** Tests cover each row but are not required to invoke the feature code that
implements the declared transitions or verify its resulting state and effects.

**Counterexample:** A table-driven test iterates descriptor rows and checks that each `to`
state exists. It passes even if the mobile-menu handler always remains closed, or the
section-navigation handler selects the wrong section and emits no effect. This satisfies
“tests cover every declared transition” without testing the implementation.

**Guard:** Require each row test to drive the production transition/dispatch path and assert
the exact next state and effect list; reject unhandled and ambiguous inputs as well.

**Consequence:** Incorrect feature behavior can ship with green “transition” tests.

### Medium — The closed effect union does not establish effect semantics

**Location:** `.specify/memory/constitution.md:35–38`; AD-7 in
`_bmad-output/planning-artifacts/architecture/architecture-agency-portfolio-2026-10-22/ARCHITECTURE-SPINE.md:91`

**Trigger:** Two descriptors use the same effect name but the contract does not define its
payload, meaning, or ordering.

**Counterexample:** On the same “select contact” interaction, `mobile-menu` declares
`navigate` and `layer`, while `section-navigation` declares `navigate` and `scroll`.
The contract does not say whether `navigate` pushes history, replaces the fragment, or
changes a route, nor whether navigation precedes scrolling or closing the layer. The union
closes the vocabulary, not these behaviors.

**Guard:** Define a typed payload and normative semantics for each effect, plus whether list
order is significant and how shared effects compose.

**Consequence:** Components can satisfy the named-effect rule yet navigate, scroll, or close
in incompatible ways.

### Medium — Single execution ownership does not guarantee exactly-once effects

**Location:** `.specify/memory/constitution.md:37–39`; AD-7 in
`_bmad-output/planning-artifacts/architecture/architecture-agency-portfolio-2026-10-22/ARCHITECTURE-SPINE.md:91`

**Trigger:** Multiple feature handlers react to one user event, or one handler dispatches a
transition more than once. “Only `core/effects` executes” identifies the executor, not the
number of invocations or which unit owns a shared trigger.

**Counterexample:** A shared Escape key event reaches both `mobile-menu` and
`section-navigation`; both valid transitions request a `layer` or `navigate` effect and
both call the central executor. Each unit can separately pass its row tests while the
combined interaction runs effects twice or in conflicting order.

**Guard:** Specify event ownership/arbitration for overlapping triggers and require one
effect-executor invocation per accepted transition, verified in integration tests.

**Consequence:** One input can cause duplicate navigation, focus, scroll, or layer changes.

## Gate assessment

The merge gate is useful for sequencing: the epic spec and plan require the descriptor and
tests before Act (`specs/002-epic-1-page-shell/spec.md:38–40`,
`specs/002-epic-1-page-shell/plan.md:125–126`,
`_bmad-output/planning-artifacts/implementation-readiness.md:34–44`). It does not close
the runtime gaps above; it ensures an underspecified contract and tests can be merged earlier.
