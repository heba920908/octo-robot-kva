# Agency Portfolio Constitution

## Core Principles

### I. BMAD-Driven Delivery

- BMAD Method is the primary delivery methodology. Every epic, story, and task MUST run the
  loop **Plan → Act → Verify → Refine** without skipping a stage.
- Other methodology skill packs (e.g. *superpowers*) MUST NOT be used in this repository.
- spec-kit is the specification and verification layer. It MUST NOT be used as a competing
  delivery workflow.
- Planning artifacts MUST live in `_bmad-output/planning-artifacts/` and implementation
  artifacts in `_bmad-output/implementation-artifacts/`, both committed.

Rationale: a single methodology keeps agent behaviour predictable and its output traceable.

### II. Behaviour Models Before Code (NON-NEGOTIABLE)

- Every portfolio user action (e.g. viewing a case study, filtering categories, opening the
  contact panel, submitting the contact form) MUST have an explicit behaviour model in
  `src/app/behaviors/<feature>.behavior.ts` before implementation begins.
- Each model MUST be typed and side-effect-free, and MUST declare `id`, `actor`, `trigger`,
  `preconditions`, a finite set of `states`, `transitions` (`from` → `event` → `to`),
  `effects`, and `acceptance` IDs matching the BMAD story's Given/When/Then criteria.
- A story MUST NOT enter **Act** until its behaviour model is merged.

Rationale: explicit state machines make the expected behaviour reviewable and testable
before any UI exists.

### III. Test-First, Colocated Verification

- The dev agent works test-first: a failing test MUST exist before the code that makes it pass.
- Every component, service, validator, and behaviour model MUST have a colocated `*.spec.ts`.
- Every behaviour-model transition MUST be covered by at least one unit test.
- `npm test` (Vitest) MUST pass before a story is marked done.
- Runtime behaviour-flow logs MUST be written as JSONL to
  `.agents/workspace/bmad/<YYYY-MM-DD>/<story-id>/` and summarized (pass/fail, gaps) in the
  story's implementation artifact.

Rationale: tests are the executable form of the acceptance criteria.

### IV. Schema- and Token-Governed Layouts

- Every core layout (Hero, Services, Work/Portfolio grid, Contact panel, and shared layout
  primitives) MUST align with at least one of:
  1. a JSON Schema (draft 2020-12) in `src/app/core/schemas/` that typed Executable content
     validates against in unit tests; or
  2. design tokens in `src/styles/_tokens.scss`, mirrored in
     `src/app/core/schemas/design-tokens.json` (colour, typography, spacing, radius,
     elevation, motion, breakpoints).
- A component with neither MUST NOT be merged. Its spec under `specs/` MUST reference the
  governing schema or token set and the relevant `.agents/workspace/spec-kit/` archive path.
- Components MUST use tokens and MUST NOT hard-code colours or spacing.

Rationale: content contracts and tokens keep layouts consistent and checkable by machine.

### V. Modern Angular Discipline

- Standalone components only; `NgModule`s MUST NOT be added.
- Component state MUST use signals (`signal`, `computed`, `input()`, `output()`, `model()`);
  `@Input`/`@Output` decorators MUST NOT appear in new code.
- Every component MUST use `ChangeDetectionStrategy.OnPush`; the app is zoneless and MUST
  NOT depend on `zone.js`.
- Templates MUST use built-in control flow (`@if`, `@for` with `track`, `@switch`).
- Dependency injection MUST use `inject()`.
- TypeScript `strict` stays on; `any` MUST NOT be used (use `unknown` and narrow).
- Code is organized by feature: `src/app/features/<feature>/`, shared pieces in
  `src/app/shared/`, data and services in `src/app/core/`.

Rationale: one modern, consistent idiom lowers review cost and runtime overhead.

### VI. Accessible, Mobile-First, Budgeted UI

- Layouts MUST be mobile-first and use semantic HTML.
- The UI MUST meet WCAG 2.2 AA: labelled controls, visible focus states, and
  `prefers-reduced-motion` support.
- Production builds MUST stay within the `angular.json` budgets (initial bundle error at
  1 MB, per-component styles error at 8 kB). Exceeding a warning threshold MUST be justified
  in the story's implementation artifact.

Rationale: an agency portfolio is judged on first impression, speed, and inclusiveness.

## Technology & Tooling Constraints

- Stack: Angular 22 (standalone, zoneless), SCSS, strict TypeScript, Vitest, Prettier
  (`.prettierrc`) and `.editorconfig`.
- **UI library: Angular Material first** (ADR: `_bmad-output/planning-artifacts/architecture/
  architecture-agency-portfolio-2026-10-22/ARCHITECTURE-SPINE.md`, AD-4). Angular CDK MAY be
  used only where Material has no suitable control. Material MUST be themed through its
  supported theme and override APIs using project tokens; private Material DOM/CSS overrides
  and other component libraries MUST NOT be added.
- Markdown Content docs in `content/` are the editorial source of truth. Angular MUST NOT
  import, fetch, parse, render, or build from them; typed Executable content in
  `src/app/core/content/` implements them and is changed in the same reviewed pull request.
- The app MUST build to static, prerendered output. GitHub Actions deploys it to GitHub Pages
  using built-in Pages permissions; the build MUST remain host-neutral.
- BMAD (`bmad-method` npm devDependency) and spec-kit (`.venv/bin/specify`) are installed
  project-locally. Their generated files MUST NOT be committed, and installer-managed files
  (`_bmad/config.toml`, `.specify/templates/*`, generated skills) MUST NOT be edited.
  Team overrides go in `_bmad/custom/config.toml`.
- Schemas in `src/app/core/schemas/` are the source of truth. `.agents/workspace/` holds only
  git-ignored archives, snapshots, and logs, and MUST NOT be referenced from `src/`.

## Development Workflow & Quality Gates

A story advances only when its gate is met:

1. **Plan → Act**: BMAD story with acceptance criteria exists; behaviour model merged;
   feature spec in `specs/<NNN>-<feature>/` created (`speckit-specify`) and clarified
   (`speckit-clarify`, `speckit-plan`); governing schema or token set identified.
2. **Act → Verify**: tests written first and passing; every behaviour transition covered;
   behaviour-flow logs recorded.
3. **Verify → Done**: `npm test` and production build pass within budgets;
   `bmad-code-review` findings resolved; `speckit-analyze` reports spec, plan, and code
   consistent; implementation artifact updated.
4. **Refine**: gaps feed back via `bmad-correct-course`; epics close with
   `bmad-retrospective`.

## Governance

- This constitution governs specification and verification. Day-to-day rules live in
  `AGENTS.md` and `.agents/rules/` (`coding-standards.md`, `bmad-protocols.md`,
  `spec-kit-rules.md`). They MUST NOT contradict each other; if they conflict, this
  constitution prevails until the conflict is resolved by amendment.
- Amendments are made with `speckit-constitution` in a dedicated commit that also updates any
  affected rule file, and MUST be reviewed by a human before merge.
- Versioning follows semantic versioning: MAJOR for removing or redefining a principle,
  MINOR for adding a principle or section or materially expanding guidance, PATCH for
  clarifications and wording.
- Every code review and every `speckit-analyze` run MUST check compliance with these
  principles. Any deviation MUST be justified in the story's implementation artifact.

**Version**: 1.1.0 | **Ratified**: 2026-10-19 | **Last Amended**: 2026-10-22
