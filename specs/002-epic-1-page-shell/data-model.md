# Data Model: Epic 1 — Branded Page Shell, Hero and Navigation

Entities for [spec.md](./spec.md). Sections are added story by story. Only US1 (BMAD 1.1) is
modeled so far.

## US1 — Design tokens

### DesignSource

The YAML frontmatter of
`_bmad-output/planning-artifacts/ux-designs/ux-agency-portfolio-2026-10-21/DESIGN.md`. This
is the only hand-edited token source.

| Group (source key) | Export prefix | Value shape | Validation |
|---|---|---|---|
| `colors` | `color` | `#RRGGBB` or `#RRGGBBAA` | hex only |
| `typography` | `typography` | role → `{fontFamily, fontSize, fontWeight, lineHeight, letterSpacing?}` | `fontSize` in px; every `<role>-lg` has a base `<role>` |
| `spacing` | `spacing` | length (`px`) | non-negative px |
| `rounded` | `rounded` | length (`px`) | `none` and `DEFAULT` present |
| `elevation` | `elevation` | `none` or box-shadow string | string |
| `motion` | `motion` | duration (`ms`), easing (`cubic-bezier(...)`), length, or unitless number string | string |
| `breakpoints` | `bp` | length (`px`) | must include `desktop` (used for `-lg` switching) |
| `components` | `component` | name → `{prop: literal \| '{group.key}'}` | every reference resolves |

Out of scope: non-token frontmatter keys (`title`, `status`, `sources`, `version`, `name`,
`description` and similar) are ignored.

### TokenExport (generated, never hand-edited)

| File | Format | Values |
|---|---|---|
| `src/styles/_tokens.scss` | `:root { --kva-…: …; }` plus one `@media (min-width: <bp.desktop>)` block for `-lg` roles | Component references are `var(--kva-…)` |
| `src/app/core/schemas/design-tokens.json` | `{ "$comment", "color": {…}, "typography": {…}, "spacing": {…}, "rounded": {…}, "elevation": {…}, "motion": {…}, "bp": {…}, "component": {…} }` | References resolved to literals; `-lg` roles kept as their own keys |

**Invariant (drift)**: `findTokenDrift()` returns an empty list exactly when both files are
byte-identical to `buildTokenFiles(DesignSource)` after Prettier formatting.

**Invariant (determinism)**: `buildTokenFiles(x)` is pure, so the same input gives the same
bytes.

### Theme

`src/styles/_theme.scss` maps token custom properties to Angular Material's supported theme
and override APIs. It holds no literal colors, lengths or font names. Every value is a
`var(--kva-…)`.

| Material system role | Token |
|---|---|
| primary / on-primary | `--kva-color-accent` / `--kva-color-on-accent` |
| surface / on-surface | `--kva-color-paper` / `--kva-color-ink` |
| error | `--kva-color-danger` |
| all corner shapes | `--kva-rounded-none` |
| brand / plain typeface | `--kva-typography-h1-font-family` (Quicksand) / `--kva-typography-body-font-family` (Outfit) |
| focus indicator | `--kva-color-focus` / `--kva-color-focus-on-light` |
