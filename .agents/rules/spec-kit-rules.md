# Spec-Kit Rules (Specification Verification & Archival)

spec-kit (`.venv/bin/specify`, `speckit-*` skills) is the **specification and verification
layer**. BMAD drives delivery (see `bmad-protocols.md`), and spec-kit ensures that what we
build matches a written, checkable spec.

## Governing documents
* **Constitution**: `.specify/memory/constitution.md` (committed). Set it up with
  `speckit-constitution`. It must not contradict `coding-standards.md` or `bmad-protocols.md`.
* **Feature specs**: one per BMAD epic, in `specs/<NNN>-epic-<E>-<slug>/` (committed),
  created with `speckit-specify`, then refined with `speckit-clarify`, `speckit-plan`, and
  `speckit-checklist`. Each BMAD story maps to one spec user story; a story's section must
  be clarified before that story enters **Act**. Do not create per-story specs.
* Run `speckit-analyze` before a story leaves **Verify** to check that spec, plan, and
  code are consistent.

## Every core layout must match a schema or token definition

Every core component layout (Hero, Services, Work/Portfolio grid, Contact panel, and any
shared layout primitive) must strictly align with **at least one** of the following:

1. **A schema validation document**: a JSON Schema (draft 2020-12) that describes the
   component's content contract, for example `src/app/core/schemas/portfolio-item.schema.json`.
   Local service data must validate against it in unit tests.
2. **A design token definition**: tokens in `src/styles/_tokens.scss`, mirrored in
   `src/app/core/schemas/design-tokens.json`, covering colour, typography, spacing,
   radius, elevation, motion, and breakpoints.

A component that has neither cannot be merged. Reference the governing schema or
token set in the component's spec under `specs/`.

## Archival in the workspace
* Archive layout test cases, data structures, and raw baseline JSON schemas for the
  portfolio content under `.agents/workspace/spec-kit/` (git-ignored):
  * `baselines/<schema-name>@<YYYY-MM-DD>.json`: snapshot of each schema when it is accepted.
  * `layout-cases/<component>/`: layout test cases and fixtures.
  * `data/`: raw structured content samples used for validation runs.
* Feature specs in `specs/` must reference the relevant archive path so that
  verification can be reproduced.
* The source-of-truth schemas stay in `src/app/core/schemas/` (committed). The
  workspace only holds archives and snapshots.
