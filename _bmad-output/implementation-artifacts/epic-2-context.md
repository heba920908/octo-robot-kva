# Epic 2 Context: Services Catalogue

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Let a plant engineer or facilities manager confirm that kVA covers their electrical need: the four brochure Services appear as content-driven cards listing every Sub-service (hook items first), long lists collapse on mobile, and each card offers a CTA toward contact. It builds on the Epic 1 shell, content facade, and shared image component, and adds the Servicios section to the page and navigation.

## Stories

- Story 2.1: Services Section with the Four Brochure Service Cards
- Story 2.2: Collapsible Sub-Service Lists on Mobile

## Requirements & Constraints

- Exactly one card per Service in Content doc order. The four launch Services are Desarrollo e Ingeniería de Proyecto, Instalaciones, Puesta en marcha y Validaciones, and Servicios de Datos. Adding, editing, or removing a Service or Sub-service is a content-only change: a fifth valid Service yields a fifth card with no component change.
- Every Sub-service is present in the prerendered HTML, even when visually collapsed. The no-JS baseline shows the full list.
- Sub-services are seeded from the brochure with hook items first. "Mantenimiento preventivo y correctivo a:" stays as a single item.
- A Service has an immutable `id` equal to its content slug, name, description, order, Sub-service list, optional image (with `alt`), and optional CTA label. Invalid content must fail validation naming the item and field. A test proves Service IDs are unique.
- The section is `#servicios` with the title "Servicios integrales de instalaciones eléctricas". It joins the facade's visible-section list, which makes the "Servicios" header link appear.
- CTA defaults to "Cotiza este servicio". A Service may override it with a visit-led label, "Solicita una visita técnica". Before Epic 3 the CTA is a plain `<a href="#contacto">` that works without JS.
- All visible and accessibility strings (toggle labels, CTA labels, section title) come from validated executable content and UI strings. No literal template text or literal `aria-label`/`alt` values.
- The WCAG 2.2 AA floor, the performance budgets, and the 24 px minimum target size (primary touch targets 44 px) apply. Card images count against the lazy-image budget (<= 120 KB at 2x).

## Technical Decisions

- Service data lives in `content/services/<slug>.md` (editorial authority only), with executable content in `services.content.ts` validated against `service.schema.json` (draft 2020-12, Ajv in unit tests only). Angular never reads Markdown. The content PR updates the doc and the executable content together.
- Only the content facade orders Services and resolves references. Feature code consumes the facade, not raw content. Later epics reference Services by typed `serviceId`.
- The feature lives in `features/services` and must not import other features. It stays standalone, OnPush, signals-based, and strict-typed, with colocated tests and Angular 2025 file naming.
- Service images use the Epic 1 shared responsive-image component (lazy, `decoding="async"`, 4:3 placeholder rules per its contract). Do not add a separate image mechanism.
- Story 2.2 requires the `service-card-disclosure` behavior model in `src/app/behaviors/service-card-disclosure.behavior.ts`. It exports finite `State` and `Event` types and conforms to `BehaviorModel`, with stable acceptance IDs and a pure `transition(state, event)` returning `{ state, effects }` or `null`. Effects use the closed union from `core/effects`, so a focus/announce effect for the toggle is possible. The model and table-driven tests (calling the production function) merge before implementation. Interaction tests verify the adapter applies results once, in order, and never for `null`.
- A single JS-only `enhanced` signal reveals the toggle. Responsive collapse is CSS-driven with no platform-branched markup. Don't wrap the Sub-service content in `@defer`.

## UX & Interaction Patterns

- Card: light (paper) surface, frameless. Optional 3:1 darkened image band at the top; a Service without an image renders no empty slot. The title sits in a decorative corner-bracket frame hidden from assistive technology. The description is followed by an en-dash Sub-service list. The `button-primary-on-light` CTA is pinned to the card bottom.
- Grid: 1 column below 768 px, 2 columns from 768, 2x2 from 1024, 4 across from 1440. Heights are minimums, text never clips, and the section follows the page rhythm (1200 px content width, 64 to 112 px padding, corner rule under the title). Section `h2` is a focusable heading target (`tabindex="-1"`, scroll margin for the sticky header).
- Mobile disclosure (below 768 px, JS on, more than 4 Sub-services): show the first 4 plus a text-button toggle "Ver los {n} servicios" with a chevron and `aria-expanded="false"`. Activating it shows the full list, changes the label to "Ver menos", sets `aria-expanded="true"`, and keeps focus on the toggle. From 768 px up, or with JS off, show the full list and render no toggle.
- Copper is for actions and focus only. Use a 2 px focus ring with 2 px offset (the light-surface variant).

## Cross-Story Dependencies

- Story 2.2 extends the card from Story 2.1 and depends on its list markup.
- Depends on Epic 1: design tokens and theme, the content facade and UI strings, the shared responsive image, the section navigation and visible-section list, and the Contact section anchor `#contacto`.
- Epic 3 (Story 3.4) later upgrades the Service CTA from the `#contacto` anchor to a composer pre-fill with the Service selected. The card must expose the Service `id` for this, but the composer is out of scope here.
- Epic 6 verifies the no-JS state and Services in the served HTML.
