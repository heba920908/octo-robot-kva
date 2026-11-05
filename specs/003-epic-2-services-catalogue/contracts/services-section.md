# US10 Services Section Contract

The approved Story 2.1 spec controls this contract (FR-021; BMAD FR5, UX-DR13/28, AD-12).

## Content

`content/services/<slug>.md` x4 are the editorial source (YAML frontmatter + notes);
`src/app/core/content/services.content.ts` is the typed ordered array; `src/app/core/schemas/service.schema.json`
(draft 2020-12, `additionalProperties: false`) governs it. Required: `id` (= slug, kebab-case pattern),
`name`, `description`, `order` (integer >= 1), `subServices` (non-empty array of non-blank strings).
Optional: `image { id, alt }` (`alt` non-blank), `cta` (non-blank). Test-only: unique ids, md/typed parity,
`order` strictly ascending in doc order, Ajv never imported from non-spec `src/`.

Launch order: desarrollo-e-ingenieria-de-proyecto (9), instalaciones (6), puesta-en-marcha-y-validaciones (5),
servicios-de-datos (3). Hook Sub-services first; "Mantenimiento preventivo y correctivo a: ..." is one item.

`ContentFacade` exposes frozen `services` sorted by `order` and registers `{ id: 'servicios', content: services }`.

## Services (`features/services`)

Standalone `OnPush`, `ContentFacade` only. `<section id="servicios" aria-labelledby="servicios-title">` paper surface,
`h2#servicios-title[tabindex=-1]` from `servicesTitle`. One `<article>` per Service: optional 3:1 darkened
`ResponsiveImage` band, `h3` in a decorative corner-bracket frame, description, `<ul>` with en-dash markers,
CTA `<a class="button-primary-on-light" href="#contacto">` (label `cta` or `serviceQuote`) pinned to the bottom.
Grid 1 / 2 / 2×2 / 4 columns at <768 / >=768 / >=1024 / >=1440.
