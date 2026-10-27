# AD-7 Consistency Review

**Scope:** Current uncommitted changes to the architecture spine, constitution, Epic 1 spec and plan, implementation-readiness report, and architecture decision log; checked against the BMAD source stories in `epics.md`.

## Verdict

**Needs revision before treating the AD-7 conflict and Plan-before-Act gate as resolved.** The changed documents mostly repeat the new declarative direction, but the contract still leaves implementers room to create incompatible descriptors and tests. More importantly, the authoritative BMAD epic still requires the removed per-model `transition()` function, and the constitution's actual gate does not require the transition tests that the spec, plan, and readiness report say must merge before Act. Story-to-spec divergence is also not reliably caught by the stated gate.

## Findings

1. **[High] Authoritative BMAD architecture contract still requires `transition()`.**  
   `_bmad-output/planning-artifacts/epics.md:62` defines AD-7 as exporting `State`, `Event`, and a pure `transition()` function returning state and effects. The changed constitution, architecture spine, spec, and readiness report explicitly prohibit or disclaim that function. The spec says BMAD acceptance criteria are authoritative (`specs/002-epic-1-page-shell/spec.md:164-169`), so story authors and implementers still receive conflicting instructions. Update the source AD-7 and any dependent story acceptance criteria to the adopted declarative contract before claiming the conflict is resolved.

2. **[High] Effect names have no executable payload contract.**  
   `.specify/memory/constitution.md:35-38` and `ARCHITECTURE-SPINE.md:91` list the closed effect names but not their required data or executor interface. For example, the contract does not say how a `focus` effect identifies its target or how a `copy` effect carries its value. Define a discriminated effect type with required per-effect payloads and the dispatch contract; otherwise effect data cannot be implemented consistently or safely typed.

3. **[High] “Typed descriptor” has no canonical type or field schema.**  
   `.specify/memory/constitution.md:32-39` and `ARCHITECTURE-SPINE.md:91` name fields but do not define their types or a shared descriptor interface. Models can therefore encode states, events, preconditions, acceptance references, and effect arrays differently while each claims to be typed. Specify one reusable model type/schema and require models to conform to it.

4. **[Medium] Runtime conformance to the descriptor is not specified.**  
   `ARCHITECTURE-SPINE.md:91` says feature code implements the declared state changes, while only `core/effects` executes effects, but gives no contract for how feature code consumes a row or returns the matching next state/effects. Define that boundary and require tests to compare the actual feature transition result with its descriptor row; otherwise separate implementation logic can drift from the declarative model.

5. **[Medium] Preconditions have no representation or evaluation semantics.**  
   `.specify/memory/constitution.md:32-36` requires `preconditions` without saying whether they are model-level or transition-level, how they are represented declaratively, or what happens when one fails. Specify the guard shape and the rejected-transition outcome, including how tests exercise it.

6. **[Medium] Transition-table behavior for missing or duplicate rows is undefined.**  
   `.specify/memory/constitution.md:33-39` and `ARCHITECTURE-SPINE.md:91` define `from`/`event`/`to` rows but do not say whether every state-event pair must have a row, whether pairs must be unique, or what an unlisted event does. Define whether tables are total or partial, enforce uniqueness, and specify the unmatched-event result so implementations do not choose incompatible fallback behavior.

7. **[Medium] “Every declared transition” does not define what the tests exercise.**  
   `.specify/memory/constitution.md:38-39`, `specs/002-epic-1-page-shell/spec.md:421-425`, and `plan.md:141-143` require colocated/table-driven transition tests, but do not say whether they test descriptor data alone or execute the feature behavior. With the per-model function removed, tests that only assert row contents could pass while runtime behavior diverges. Require tests to drive the actual transition implementation and verify the resulting state and effects against the descriptor.

8. **[Medium] The constitution's Plan → Act gate does not require the tests to be merged.**  
   `.specify/memory/constitution.md:38-40,130-133` requires tests to cover transitions but makes only the behavior model an explicit Plan → Act merge prerequisite. The changed spec and plan, and the readiness report, require both model and tests to merge during Plan (`spec.md:421-425`, `plan.md:141-143`, `implementation-readiness.md:34-44`). Amend the normative gate to require both artifacts before Act; otherwise the documents disagree on when the gate is satisfied.

9. **[Medium] Acceptance IDs cannot yet identify the source story criteria.**  
   `.specify/memory/constitution.md:34-35` requires model acceptance IDs matching BMAD Given/When/Then criteria, but the source criteria are unnumbered (for example, `_bmad-output/planning-artifacts/epics.md:294-308`). Define stable IDs for each source criterion and use those IDs in both the spec and model; otherwise a model's “matching” IDs have no unambiguous target.

10. **[Medium] The stated story-to-spec trace is not an explicit merge/verification gate.**  
    `spec.md:164-169` says the BMAD criteria are authoritative and the scenarios restate them; constitution §Workflow (`.specify/memory/constitution.md:121-138`) requires traceability and later checks spec/plan/code consistency, but does not require a criterion-by-criterion BMAD-to-spec comparison. Add a stable mapping and make that comparison part of the gate so edits to either source cannot silently leave the other stale.

11. **[Medium] Readiness marks the conflict resolved while its listed source still contradicts it.**  
    `_bmad-output/planning-artifacts/implementation-readiness.md:34-44` says the constitution and AD-7 now require the same descriptor and that the gate is resolved, while the same report lists `epics.md` as an input (`:7-12`) and that file still defines the old function contract at line 62. Keep the readiness status unresolved until the source epic is reconciled, then re-evaluate the gate against the updated source.

## Editorial lenses

No separate structure or prose findings; recommendations are limited to behavioral-contract consistency and implementability.
