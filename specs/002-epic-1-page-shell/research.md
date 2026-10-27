# Research: Epic 1 — Branded Page Shell, Hero and Navigation

Phase 0 research for [plan.md](./plan.md). Sections are added story by story. Only US1
(BMAD 1.1) is researched so far.

## US1 — Brand design tokens and component theme

### R1. Reading the design source

- **Decision**: Parse the DESIGN.md frontmatter with `yaml` 2.9.1, pinned as an explicit
  devDependency (clarified 2026-10-27).
- **Rationale**: The frontmatter uses YAML flow mappings, quoted numeric keys (`'0'`) and a
  comment block, which a hand-written parser would get wrong. `yaml` is already in the
  install tree, is spec-compliant, and is used only by Node scripts and tests.
- **Alternatives considered**: `js-yaml` (works too, but the user chose `yaml`); a
  hand-written subset parser (fragile; rejected).
- **Verified 2026-10-27**: A throwaway spec running under `ng test` parsed DESIGN.md with
  `yaml` and read `colors.ink === '#1C1714'` and `typography.display-lg.fontSize === '60px'`.

### R2. Where the drift check runs

- **Decision**: Put the export logic in one Node ESM module, `scripts/design-tokens.mjs`. It
  exports pure functions (`buildTokenFiles(designMarkdown)`, `findTokenDrift()`) and has a CLI
  with `--check`. A hand-written type declaration, `scripts/design-tokens.d.mts`, types it for
  the colocated unit test `src/app/core/schemas/design-tokens.spec.ts`, which imports
  `findTokenDrift()` and asserts it returns no drift.
- **Rationale**: The Angular Vitest runner executes in Node, with the repository root as the
  working directory. A probe confirmed `node:fs` reads at runtime, but `@types/node` is not
  installed, so a spec that calls Node APIs directly fails type-checking (TS2591). Keeping
  every Node API call in the `.mjs` module and typing only its exported surface keeps the
  spec strict and avoids another dependency.
- **Alternatives considered**: Adding `@types/node` and `"node"` to `tsconfig.spec.json`
  (needs another dependency approval and leaks Node globals into every spec); a Node-only
  check chained in `npm test` (not a unit test, which the story's AC requires).

### R3. Custom-property naming and `-lg` switching

- **Decision**: Follow the DESIGN.md name map, with singular group prefixes:
  - colors → `--kva-color-<key>`
  - typography → `--kva-typography-<role>-<prop>` (font-family, font-size, font-weight,
    line-height, letter-spacing)
  - spacing → `--kva-spacing-<key>`
  - rounded → `--kva-rounded-<key>` (`DEFAULT` → `default`)
  - elevation → `--kva-elevation-<key>`
  - motion → `--kva-motion-<key>`
  - breakpoints → `--kva-bp-<key>`
  - components → `--kva-component-<name>-<prop>`

  A `<role>-lg` typography token is not a separate property. It overrides `<role>`'s
  properties inside `@media (min-width: 1024px)`, using the literal `breakpoints.desktop`
  value, because media queries cannot read custom properties.
- **Rationale**: This is the map DESIGN.md records, and the UX-DR1 AC requires the same
  property to switch.
- **Alternatives considered**: Separate `-lg` properties (break the single-property AC);
  Sass maps only (do not reach runtime CSS and the Material overrides).

### R4. Component token export rules

- **Decision**:
  - References such as `'{colors.accent}'` become `var(--kva-color-accent)` in SCSS and the
    resolved literal value in JSON.
  - A `typography` reference expands to one `var()` per typography property.
  - `height` exports as `min-height`.
  - On stroke-only tokens (`focus-ring*`, `*-outline`, `divider*`, `nav-link-current`,
    `carousel-thumb-current`), `backgroundColor` exports as `stroke-color`.
  - Camel-case properties become kebab-case.
  - An unknown group, a malformed value, an unresolvable reference, or a `-lg` role without a
    base role fails the export and names the token.
- **Rationale**: These rules come from the DESIGN.md export comment. Resolving references in
  JSON keeps the machine-readable file usable without a CSS engine.
- **Alternatives considered**: Keeping reference strings in JSON (consumers would need a
  resolver).

### R5. Deterministic, Prettier-stable output

- **Decision**: Emit keys in source order, then pass both outputs through the repository's
  Prettier 3 configuration (`.prettierrc`) before writing or comparing. Each file starts
  with a banner comment saying it is generated (the JSON gets a `$comment` key) and naming
  the source.
- **Rationale**: Running Prettier on the repository must not create drift, and running the
  export twice must produce identical bytes (FR-006).
- **Alternatives considered**: Adding a `.prettierignore` (hides formatting drift; rejected).

### R6. Adding Angular Material without remote assets

- **Decision**: Run `npm install @angular/material@22.2.4 @angular/cdk@22.2.4` exactly. Do
  **not** run `ng add @angular/material`. Theme in `src/styles/_theme.scss` with `mat.theme()`
  for the base system, then `mat.theme-overrides()` to map system tokens to `--kva-*`
  properties (primary → accent family, surface → paper, `corner-*` → `--kva-rounded-none`,
  typeface families → token font families). Use per-component `*-overrides` mixins only
  where a system token does not reach a value.
- **Rationale**: The `ng add` schematic adds Roboto and Material Icons links from Google
  Fonts and a prebuilt theme. AD-13 and AD-10 forbid all of these, so the clean path is to
  never add them. `mat.theme-overrides` and component `*-overrides` are the supported APIs
  (AD-4, UX-DR2).
- **Alternatives considered**: `ng add` then delete its edits (more churn, easy to miss one);
  prebuilt theme plus CSS overrides of `.mat-*`/`.mdc-*` classes (forbidden).
- **Verify at Act**: Confirm the `mat.theme-overrides` key names against the installed
  22.2.4 `_index.scss`, and adjust the mapping, not the approach.

### R7. Bundle impact measurement

- **Decision**: Record initial-bundle JS and CSS sizes from `npm run build:pages` output
  before installing Material and after theming. Record both, and the difference, in the BMAD
  story's implementation artifact.
- **Rationale**: AD-4 and NFR1 require the bundle impact to be recorded before merge. Theme
  styles add global CSS. JS should not change until a story imports a Material component.
- **Alternatives considered**: Lighthouse at this stage (no visible UI yet; SM-2 runs in
  Story 6.5).
