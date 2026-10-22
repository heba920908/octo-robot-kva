# Coding Standards

Baseline: Angular 22 workspace (`agency-portfolio`), standalone APIs, zoneless change
detection, SCSS, strict TypeScript, Vitest unit tests, Prettier (`.prettierrc`).

## Angular
* Standalone components only. Do not add `NgModule`s.
* Use signals for component state (`signal`, `computed`, `input()`, `output()`, `model()`).
  Do not use `@Input`/`@Output` decorators in new code.
* Set `ChangeDetectionStrategy.OnPush` on every component. Do not rely on `zone.js`.
* Use built-in control flow (`@if`, `@for` with `track`, `@switch`), not structural directives.
* Use `inject()` for dependency injection, not constructor parameters.
* Use the 2025 file naming style (`hero.ts`, `hero.html`, `hero.scss`, `hero.spec.ts`).
* Organize code by feature: `src/app/features/<feature>/`, with shared pieces in
  `src/app/shared/` and data/services in `src/app/core/`.
* Forms: use typed reactive forms (or signal forms once stable) with native validators.
  Put custom validators in `shared/validators/`.

## Styling
* **UI library: Angular Material first**, decided in the architecture spine
  (`_bmad-output/planning-artifacts/architecture/architecture-agency-portfolio-2026-10-22/
  ARCHITECTURE-SPINE.md`, AD-4). Use Angular CDK only where Material has no suitable control.
  Theme Material only through its supported theme and override APIs, fed by project tokens.
  Do not style private Material DOM classes or add another component library.
* SCSS with design tokens as CSS custom properties defined in `src/styles/_tokens.scss`
  (see `spec-kit-rules.md`). Components must use tokens, not hard-coded colours or spacing.
* Mobile-first layouts and semantic HTML. Meet WCAG 2.2 AA: labelled controls,
  visible focus states, and `prefers-reduced-motion` support.

## TypeScript & quality
* `strict` mode stays on. Do not use `any`; use `unknown` and narrow it.
* Every component, service, and validator has a colocated `*.spec.ts`.
  `npm test` must pass before a story is marked done.
* Format with Prettier and follow `.editorconfig`.
* Do not commit generated agent tooling (see AGENTS.md → "Agent Tooling").
