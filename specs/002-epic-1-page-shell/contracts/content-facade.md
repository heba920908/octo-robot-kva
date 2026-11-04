# US3 Contract: Content Facade and UI Strings

Status: implemented, verified and independently reviewed; all US3 tasks complete.
Authority: BMAD Story 1.3, FR15, UX-DR27, AD-3 and Epic 1 FR-014.

## Ownership

`content/ui-strings.md` is editorial; `src/app/core/content/ui-strings.content.ts`
implements it as typed, readonly content. Seed all EXPERIENCE Default UI strings
except Hero-owned rows. Preserve case, punctuation, accents, constant menu name and
distinct full/short, singular/plural and filtered/unfiltered variants. Strings for
future controls are data only; this story does not implement those controls.

`src/app/core/content/content-facade.ts` alone imports raw executable content in
production and exposes readonly site/UI content plus formatting/visible sections.
The App uses injection and preserves current text, title and description. Tests
may import raw fixtures. Markdown, schemas and test helpers never enter runtime.

## Validation and Formatting

`src/app/core/schemas/ui-strings.schema.json` uses draft 2020-12. Tests use Ajv2020
and ajv-formats with required closed keys and non-blank string constraints. Mutate
missing item/field, whitespace-only value, wrong type, extra field and placeholder
contract; errors identify the affected item/field, not just a generic failure.
Editorial/executable parity and complete default coverage are tested separately.

A known key plus exactly its declared named values returns plain text. Values
accept strings/numbers, including zero. Repeated placeholders substitute everywhere.
Keys with no placeholders require no values. Unknown keys and missing/extra values
fail explicitly; do not silently return unresolved tokens or interpret values as
HTML. Keep contracts type-safe and retain runtime guards for untyped misuse.

## Visibility

Expose populated sections only, in page order: Hero, Servicios, Proyectos, Nosotros,
Confianza, Contacto. A navigation label or empty object/list is not section content.
Unit fixtures cover absence, empty values, population and stable ordering. Current
shell has no section datasets; return no fabricated destinations. Later sections
extend the same facade with their actual data. Do not list Footer as a destination.

## Static Guards

- Parse external and inline Angular component templates, traversing nested blocks
  and interpolation. Whitespace and bound text/attributes pass. Literal text and
  literal aria-label/alt/title/placeholder values fail with file/violation details.
  Parser failures are failures, not permission to skip a template.
- Inspect production imports structurally; reject raw executable-content imports
  outside the facade. Do not treat test imports as application violations.
- Keep filesystem enumeration/AST helpers in test-only
  `scripts/content-checks.mjs` with `scripts/content-checks.d.mts`, exercised by
  colocated Angular specs. Use installed TypeScript/Angular parsers, not regex HTML.
- Prove production graph/output exclusion of Ajv, ajv-formats and schemas with a
  negative fixture. Preserve existing static, CSP, font and hydration gates.

## Evidence

AC1: schema mutations/default parity. AC2: exact formatter matrix. AC3: facade
import ownership and visibility fixtures plus unchanged App assertions. AC4:
template positive/negative fixtures and repository scan in npm test. AC5: built
artifact exclusion and negative leakage fixture, Pages/static and browser checks.

Archive accepted schema at
`.agents/workspace/spec-kit/baselines/ui-strings@2026-10-28.json`; raw validation
samples under `.agents/workspace/spec-kit/data/ui-strings/`; template cases under
`.agents/workspace/spec-kit/layout-cases/content-templates/`. Archive during Act,
not as evidence of tests before they run. Record results in the BMAD Story 1.3
artifact, then complete US3-scoped speckit-analyze and BMAD review before Done.
