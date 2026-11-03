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

## US4 - Responsive Images

### ImageManifest

Version 1 object: `photos` and `logos` arrays. Photo: unique `id`, original `source`
under assets/media/brochure, extensionless output `base` under media/backgrounds
or media/projects, positive integer `widths` and `budgetBytes`. Logo: unique `id`,
white original `source`, `base` under media/logo, positive integer `heights` and
`densities` of 1/2. Reject unknown fields, traversal, absolute paths, symlink
escapes, duplicate IDs/destinations and invalid dimensions with item diagnostics.
Encoder settings are fixed in the generator and recorded in provenance.

### ResponsiveImageMetadata

Readonly `base` (safe base-relative path without extension), sorted unique
`widths`, positive intrinsic `width`/`height`, and content-owned `alt`. Decorative
backgrounds permit empty alt; projects require a descriptive nonblank alt. All
candidates must exist in AVIF/WebP/JPEG, decode to the expected aspect ratio and
never exceed the intrinsic source width. No project business entities are added.

### LogoDerivative

Role/density maps to a capped physical height. Files use base-height.png; identical
heights share a file. Preserve RGBA alpha. Source is 459x241; Hero 2x caps to 241px,
so it must not be described as a full 400px derivative.

The schema is src/app/core/schemas/image.schema.json. Accepted snapshots live in
.agents/workspace/spec-kit/baselines/image@2026-10-28.json; metadata samples in
.agents/workspace/spec-kit/data/images; layout cases in
.agents/workspace/spec-kit/layout-cases/responsive-image. No runtime validation.

## US5 - Contact, Footer and Privacy Content

### SiteContent (extended)

Existing fields remain. Added, all governed by `site.schema.json` (`additionalProperties: false`):
`contact` `{ name?, email, phone? { e164, display }, whatsapp? }`, `facts`
`{ yearsInBusiness, coverage }`, optional `legalIdentity` and `retentionPeriod`,
integer `footerYear`, and `footerLogo` `{ src, src2x, width, height }` for the
24/48px white-logo derivatives. Email is required. `phone.e164` matches
`^\+52[1-9][0-9]{9}$`; `display` is `(AA|AAA) BBBB|BBB CCCC` and its digits must equal
the E.164 national digits (test-enforced). A second channel is never representable.

### PrivacyNoticeContent

`{ id: 'privacy-notice', title, sections[1..] { id, heading, paragraphs[1..] } }`, governed by
`privacy-notice.schema.json`. Non-blank Spanish text; section ids unique. The text names the
responsible party (legal identity or stand-in) and the site contact email.

### ContactLinks (pure builder, `core/contact`)

`buildMailtoLink({ email, topic })` -> `mailto:<email>?subject=<encode("[kvainstalaciones.mx] " + topic)>`;
`buildTelLink(e164)` -> `tel:<e164>`. Blank email, blank topic or non-E.164 input throws.

### DirectContactLinks (behavior model)

State `{ kind: 'idle' }`; events `activate-email | activate-phone`; both return the same state
with `effects: []`. Any other event returns `null`. Acceptance `1.5-AC-03`.

### Effect (types only)

Closed union `focus | layer | navigate | copy | announce | scroll` with typed payloads in
`core/effects`; executors arrive with Story 1.6.

Archives: `.agents/workspace/spec-kit/baselines/{site,privacy-notice}@2026-10-28.json`,
`.agents/workspace/spec-kit/data/{site,privacy-notice}/`,
`.agents/workspace/spec-kit/layout-cases/footer/`.

## US6 - Contact Section, Copy-Address Behavior and Effect Executors

### SiteContent (extended for US6)

Adds required `contactLogo: { src, src2x, width, height }` governed by `site.schema.json`
(`additionalProperties: false`) pointing to `media/logo/kva-logo-white-40.png` (76×40) and
2x `media/logo/kva-logo-white-80.png` (152×80). PNG IHDR dimensions are verified in unit
tests. `ContentFacade.visibleSections` registers `{ id: 'contacto', content: this.site.contact.email }`.

### CopyAddress (behavior model, `src/app/behaviors/copy-address.behavior.ts`)

Conforms to `BehaviorModel<CopyAddressState, CopyAddressEvent>` with `id: 'copy-address'`
and `acceptance: ['1.6-AC-03', '1.6-AC-04', '1.6-AC-05']`.

- States: `{ kind: 'idle' } | { kind: 'copying' } | { kind: 'copied'; message: string } | { kind: 'failed'; message: string }`.
- Events:
  - `{ type: 'request-copy'; address: string }` (non-blank address from `idle`, `copied`, or `failed`) -> `{ state: { kind: 'copying' }, effects: [{ kind: 'copy', text: event.address }] }`.
  - `{ type: 'copy-succeeded'; message: string }` (non-blank message from `copying`) -> `{ state: { kind: 'copied', message: event.message }, effects: [{ kind: 'announce', message: event.message }] }`.
  - `{ type: 'copy-failed'; message: string }` (non-blank message from `copying`) -> `{ state: { kind: 'failed', message: event.message }, effects: [{ kind: 'announce', message: event.message }] }`.
  - `{ type: 'status-timeout' }` (from `copied`) -> `{ state: { kind: 'idle' }, effects: [] }`.
- Any other state/event pair or blank payload returns `null`.

### EffectRunner (`src/app/core/effects/effects.ts`)

Injectable service executing effects from the closed `Effect` union:

- `copy`: writes `effect.text` via `navigator.clipboard.writeText(effect.text)` when available;
  returns `Promise<boolean>` (`true` on resolve, `false` when clipboard is unavailable or rejects).
  Exposes DOM text-selection fallback `selectElementText(element)` using `document.createRange()`
  and `window.getSelection()`.
- `announce`: clears persistent live-region state immediately, sets the announced message after
  ~100 ms (`ANNOUNCEMENT_DELAY_MS = 100`), and schedules optional hold-duration callback after
  2500 ms (`COPY_STATUS_HOLD_MS = 2500`), clearing pending timers on re-invocation or destroy.

### Shell Rhythm & Section Headings (`src/styles.scss`)

Responsive custom properties defined at `:root`, `@media (width >= 768px)` and
`@media (width >= 1024px)`:

- `--kva-shell-margin`: `20px` -> `32px` (`>= 768px`) -> `48px` (`>= 1024px`)
- `--kva-shell-section-y`: `64px` -> `112px` (`>= 1024px`)
- `--kva-shell-columns`: `4` -> `12` (`>= 1024px`)
- `--kva-contact-column`: `1 / -1` -> `7 / 13` (`>= 1024px`)
- `--kva-contact-align`: `flex-start` -> `flex-end` (`>= 1024px`)
- `--kva-contact-text-align`: `left` -> `right` (`>= 1024px`)
- `.kva-section-heading`, `.kva-corner-rule` (`┘` default), and `.kva-corner-rule--mirrored` (`└` for `#contacto`).

Archives: `.agents/workspace/spec-kit/baselines/site@2026-10-29.json`,
`.agents/workspace/spec-kit/data/site/`,
`.agents/workspace/spec-kit/layout-cases/contact/`.

## US7 - Hero Section

### HeroContent (`hero.content.ts`, `hero.schema.json`, `content/hero.md`)

`{ id: 'hero', overline, headline (<= 60), lead (<= 120), primaryCta, secondaryCta,
proofPoint, logo: { src, src2x, width, height } }`, all required, no extra fields. Every
`·`-separated proof-point segment MUST equal a `siteContent.facts` value (test-only check).

### VisibleSection (extended)

`ContentFacade.visibleSections` registers `{ id: 'hero', content: hero.headline }`. The Hero
secondary CTA renders only when the list includes `servicios`.

### Hero shell properties (`src/styles.scss`)

`--kva-hero-align`, `--kva-hero-text-align`, `--kva-hero-logo-display`,
`--kva-hero-ornament-display`, `--kva-hero-actions-direction`, `--kva-hero-actions-align` and
`--kva-hero-pad-y`: mobile values at `:root`, centered/row/logo/ornament values at `>= 768px`.
