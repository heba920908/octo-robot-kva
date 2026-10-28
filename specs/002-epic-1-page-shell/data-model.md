# Data Model: Epic 1 — Branded Page Shell, Hero and Navigation

Entities for [spec.md](./spec.md). Sections are added story by story. Only US1 (BMAD 1.1) is
modeled initially; US2 asset contracts follow below.

## US1 — Design tokens

### DesignSource

The YAML frontmatter of
`_bmad-output/planning-artifacts/ux-designs/ux-agency-portfolio-2026-10-21/DESIGN.md`. This
is the only hand-edited token source.

| Group (source key) | Export prefix | Value shape                                                                      | Validation                                              |
| ------------------ | ------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `colors`           | `color`       | `#RRGGBB` or `#RRGGBBAA`                                                         | hex only                                                |
| `typography`       | `typography`  | role → `{fontFamily, fontSize, fontWeight, lineHeight, letterSpacing?}`          | `fontSize` in px; every `<role>-lg` has a base `<role>` |
| `spacing`          | `spacing`     | length (`px`)                                                                    | non-negative px                                         |
| `rounded`          | `rounded`     | length (`px`)                                                                    | `none` and `DEFAULT` present                            |
| `elevation`        | `elevation`   | `none` or box-shadow string                                                      | string                                                  |
| `motion`           | `motion`      | duration (`ms`), easing (`cubic-bezier(...)`), length, or unitless number string | string                                                  |
| `breakpoints`      | `bp`          | length (`px`)                                                                    | must include `desktop` (used for `-lg` switching)       |
| `components`       | `component`   | name → `{prop: literal \| '{group.key}'}`                                        | every reference resolves                                |

Out of scope: non-token frontmatter keys (`title`, `status`, `sources`, `version`, `name`,
`description` and similar) are ignored.

### TokenExport (generated, never hand-edited)

| File                                      | Format                                                                                                                                          | Values                                                              |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `src/styles/_tokens.scss`                 | `:root { --kva-…: …; }` plus one `@media (min-width: <bp.desktop>)` block for `-lg` roles                                                       | Component references are `var(--kva-…)`                             |
| `src/app/core/schemas/design-tokens.json` | `{ "$comment", "color": {…}, "typography": {…}, "spacing": {…}, "rounded": {…}, "elevation": {…}, "motion": {…}, "bp": {…}, "component": {…} }` | References resolved to literals; `-lg` roles kept as their own keys |

**Invariant (drift)**: `findTokenDrift()` returns an empty list exactly when both files are
byte-identical to `buildTokenFiles(DesignSource)` after Prettier formatting.

**Invariant (determinism)**: `buildTokenFiles(x)` is pure, so the same input gives the same
bytes.

### Theme

`src/styles/_theme.scss` maps token custom properties to Angular Material's supported theme
and override APIs. The original US1 theme holds no literal colors, lengths or primary
font names; its values use `var(--kva-…)`. US2 additionally supplies named metric
fallback faces and generic sans-serif after the token-governed primary families.

| Material system role   | Token                                                                                        |
| ---------------------- | -------------------------------------------------------------------------------------------- |
| primary / on-primary   | `--kva-color-accent` / `--kva-color-on-accent`                                               |
| surface / on-surface   | `--kva-color-paper` / `--kva-color-ink`                                                      |
| error                  | `--kva-color-danger`                                                                         |
| all corner shapes      | `--kva-rounded-none`                                                                         |
| brand / plain typeface | `--kva-typography-h1-font-family` (Quicksand) / `--kva-typography-body-font-family` (Outfit) |
| focus indicator        | `--kva-color-focus` / `--kva-color-focus-on-light`                                           |

## US2 - Static Asset Contracts

FontFace: family (Quicksand or Outfit), local latin WOFF2 path, weight range 300-600,
display swap, named metric fallback, size-adjust/ascent/descent/line-gap percentages.
Provenance records upstream revision, OFL notice, sha256 and measurement method.

IconName: closed allowlist menu, close, arrow-left, arrow-right, copy, check, phone,
mail, chat, chevron-down, error. Each maps to one media/icons/<name>.svg. Every SVG
has viewBox 0 0 24 24, fill none, stroke currentColor, width 1.5 and square caps.
Registration does not fetch; consumers retrieve cached SVG clones through Material.
Unknown names fail through the registry. Glyphs have no user-facing labels.

TypographyRole: existing token role; CSS consumes tokens without changing them.
Project titles override casing only. No state transitions or behavior model apply.

## US3 - Executable Content Boundary

### UiStringsContent

Editorial source: `content/ui-strings.md`. Executable source:
`src/app/core/content/ui-strings.content.ts`. Governing draft-2020-12 schema:
`src/app/core/schemas/ui-strings.schema.json` (test-only).

- Stable keys identify each non-Hero default from EXPERIENCE, including distinct
  full/short CTA, singular/plural and filtered/unfiltered variants.
- Values are readonly, non-blank Spanish text; parameterized strings declare an
  exact named parameter contract. Missing keys, wrong types, blank values, unexpected
  fields and incompatible parameter contracts fail item/field-specific tests.
- Hero copy stays in its future Hero content object. No feature content dataset is
  invented by this story. Editorial and executable changes are reviewed together.

### FormattingRequest

Known string key plus exactly the required named values (`string | number`). Zero
and repeated occurrences are supported. Output is deterministic plain text, never
HTML. Missing/unknown parameter names or keys fail explicitly; no silent unresolved
tokens. Content is not mutated. A parameterless key requires no values.

### ContentFacade

Single Angular-injectable content boundary: readonly site metadata, UI strings,
formatting and ordered visible sections. Only this module imports raw executable
content in production; tests may import fixtures for independent assertions.
The App migrates from direct siteContent access to the facade with unchanged output.

### VisibleSection

Finite section identifier in page order: Hero, Servicios, Proyectos, Nosotros,
Confianza, Contacto. Inclusion requires actual renderable content, not a label,
truthy empty object or future section name. Unit fixtures cover missing/empty and
populated candidates and stable ordering. With no section datasets implemented yet,
the foundation shell exposes no invented navigation sections. Footer is not a
section-navigation destination. Later stories extend this boundary with real data.

No lifecycle, behavior model, storage or runtime content fetch is introduced.
