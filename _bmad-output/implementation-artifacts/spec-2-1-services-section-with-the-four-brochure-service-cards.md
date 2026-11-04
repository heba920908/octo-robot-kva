---
title: 'Story 2.1: Services Section with the Four Brochure Service Cards'
type: 'feature'
created: '2026-11-04'
status: 'ready-for-dev'
route: 'dispatch'
story_key: '2-1-services-section-with-the-four-brochure-service-cards'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
  - '{project-root}/specs/003-epic-2-services-catalogue/spec.md'
  - '{project-root}/specs/003-epic-2-services-catalogue/contracts/services-section.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The page has no Services section, so a plant engineer cannot confirm kVA covers their electrical need; the header "Servicios" link and the Hero "Ver servicios" CTA stay hidden because `#servicios` is not a visible section.

**Approach:** Add four Content docs under `content/services/`, a typed `services.content.ts` governed by `service.schema.json`, expose them through `ContentFacade` (registering `servicios` as visible), and render a `features/services` section of cards between Hero and Contact. CTAs are plain `<a href="#contacto">` until Epic 3.

## Boundaries & Constraints

**Always:** Follow Story 2.1 ACs (2.1-AC-01..06), FR5, UX-DR13/28, AD-12, NFR5; contract `specs/003-epic-2-services-catalogue/contracts/services-section.md`. Service `id` equals its file slug and is immutable; unique ids tested. Sub-services keep brochure p05 wording and Content-doc order, hook items first, "Mantenimiento preventivo y correctivo a: Plantas de emergencia, UPS, reguladores; Transformadores (media y baja tensión); Sistemas de iluminación" is ONE item (UX-DR28). Standalone `OnPush`, `ContentFacade` only (raw `*.content` imports stay in the facade; Ajv/schema imports stay test-only), token-fed SCSS, no literal template text or literal `aria-label`/`alt`/`title`/`placeholder`, no `(click)` bindings. Card: section `h2` (`servicesTitle`), card title `h3` in a corner-bracket frame (decorative, `aria-hidden`), en-dash `<ul>`, CTA `button-primary-on-light` pinned to the card bottom; all Sub-services present in prerendered HTML. Optional image band 3:1, darkened, via `ResponsiveImage` with Service-doc `alt`; no empty slot when absent. Grid 1 col < 768, 2 cols ≥ 768, 2×2 ≥ 1024, 4 across ≥ 1440, short last row left-aligned at column width. Launch Service descriptions are agent-written from the brochure Sub-services only (outcome-led, no new claims, no numbers) and must be flagged `[ASSUMPTION]` in `content/services/*.md` notes for editorial confirmation. No launch Service sets an image or `cta`; support is exercised by fixtures. Preserve CSP, SSG, hydration, es-MX, single `<h1>`, style budgets.

**Never:** Disclosure toggle or viewport logic (Story 2.2); composer pre-fill (Epic 3); `service.schema.json`/Ajv imported from `src/` non-spec code; new dependencies; hand-edited generated tokens; new `ui-strings` keys unless unavoidable; commit/push by the implementer.

## I/O & Edge-Case Matrix

| Scenario           | Input / State                                                 | Expected Output / Behavior                                   | Error Handling                    |
| ------------------ | ------------------------------------------------------------- | ------------------------------------------------------------ | --------------------------------- |
| Valid docs         | 4 Service docs                                                | Schema passes; ids unique and equal slugs; `order` ascending | N/A                               |
| Invalid doc        | missing/blank field, extra key, bad `id`, empty `subServices` | Validation fails naming item and field                       | Test-only Ajv error path          |
| Duplicate id       | two docs same `id`                                            | Uniqueness test fails                                        | Names both items                  |
| Card render        | Service without image                                         | Name, description, list, CTA; no image slot                  | N/A                               |
| Image band         | Service with `image {id, alt}`                                | 3:1 band via `ResponsiveImage`                               | Unknown image id fails validation |
| CTA label          | `cta` absent / set                                            | `serviceQuote` / the doc's label                             | N/A                               |
| Fifth Service      | fixture with 5 docs                                           | 5 cards, no component change                                 | N/A                               |
| Section visibility | `servicios` in `visibleSections`                              | Header "Servicios" link and Hero secondary CTA appear        | Hidden if no Services             |
| No JS              | Prerendered HTML                                              | All Sub-services and CTAs present                            | N/A                               |

</frozen-after-approval>

## Code Map

- `content/hero.md`, `src/app/core/content/hero.content.ts` + `.spec.ts`, `src/app/core/schemas/hero.schema.json` -- pattern to mirror (md frontmatter ↔ typed const ↔ Ajv2020 schema spec with `it.each` mutations ↔ `readFileSync` md check). No multi-file precedent: add `content/services/<slug>.md` x4, `services.content.ts` (ordered array), `service.schema.json`, spec using `readdirSync('content/services')`.
- Brochure source: `_bmad-output/planning-artifacts/ux-designs/ux-agency-portfolio-2026-10-21/imports/brochure-text.md` (Page 5, hyphenated: re-join words); order/hook rules in `EXPERIENCE.md` L95-115; card spec in `DESIGN.md` L407-412.
- `src/app/core/content/content-facade.ts` -- add frozen `services` (sorted by `order`, image ids resolved), register `{ id: 'servicios', content: services }` in `visibleSections`; `sectionOrder` already lists `servicios`. `content-facade.spec.ts` L19-20 assumes `servicios` hidden: update.
- `src/app/core/content/ui-strings.content.ts` -- `servicesTitle`, `serviceQuote`, `serviceVisit` already exist; `servicesExpand/Collapse` belong to 2.2.
- `src/app/features/hero/*`, `contact/*` -- structure/heading/grid patterns (`kva-section-heading`, `kva-corner-rule`, `--kva-shell-*`, `--kva-component-service-card-*`). New `src/app/features/services/services.{ts,html,scss,spec.ts}`.
- `src/app/app.ts`, `app.html` -- add `<app-services />` between hero and contact. `app.spec.ts` L46/L91, `features/header/header.spec.ts` L73 assert `a[href="#servicios"]` absent: update.
- `scripts/verify-static-build.mjs` (L112, L135-138 forbid `#servicios`; add a services block like L145-173), `scripts/content-checks.mjs` (fixture L264-307), `src/app/core/content/template-content.spec.ts` (mutation table L234+) -- flip/extend.
- `EXPERIENCE.md` -- keep rows consistent if an existing test requires it (see Story 1.9 note).

## Tasks & Acceptance

**Execution:**

- [ ] `content/services/*.md`, `core/schemas/service.schema.json`, `core/content/services.content.ts` + spec -- tests first; schema, 4 docs, uniqueness, md ↔ typed parity, rejecting mutations (2.1-AC-01)
- [ ] `core/content/content-facade.ts` + spec -- expose `services`, register `servicios` (2.1-AC-02, 2.1-AC-06)
- [ ] `features/services/*`, `app.ts`, `app.html` -- tests first; cards, image band, CTA, grid, five-card fixture (2.1-AC-02..05)
- [ ] `app.spec.ts`, `header.spec.ts`, hero spec cases -- reflect visible `servicios`
- [ ] `scripts/verify-static-build.mjs`, `scripts/content-checks.mjs`, `template-content.spec.ts` -- static verifier and fixtures
- [ ] This spec, `specs/003-epic-2-services-catalogue/*` ticks for T201-T205 only -- full gates, browser matrix, review

**Acceptance Criteria:**

- Given the four docs, when validated against `service.schema.json`, then each has id = slug, name, description, order, Sub-services, optional image+alt and optional CTA; invalid content fails naming item and field; ids are unique (2.1-AC-01).
- Given the prerendered page, when `#servicios` renders, then one card per Service shows in order with name, description, every Sub-service as an en-dash list and the CTA; all Sub-services are in served HTML; the facade lists `servicios` so the header link appears (2.1-AC-02).
- Given a Service with an image, when its card renders, then a 3:1 darkened band shows; without one, no empty slot (2.1-AC-03).
- Given viewports 767/768/1024/1440, when the grid lays out, then 1/2/2×2/4 columns with the frame and bottom-pinned CTA (2.1-AC-04).
- Given the CTA before Epic 3, when activated, then it is `<a href="#contacto">` and works without JS (2.1-AC-05).
- Given a fifth valid Service doc, when rebuilt, then five cards render with no component change (2.1-AC-06).

## Implementation Notes

## Spec Change Log

## Review Triage Log

## Design Notes

Typed content mirrors the Markdown by hand (repo convention: `.md` is never parsed at runtime); a spec asserts parity. A Service `image` is `{ id, alt }` where `id` is a key of `images.content`; `alt` is mandatory when an image is set. The facade owns ordering by `order`, so component code never sorts.

## Verification

**Commands:**

- `npx prettier --check src scripts content specs` -- expected: clean
- `npx ng test --watch=false` -- expected: all tests pass
- `npm run tokens:check && npm run build:pages && npm run verify:static` -- expected: pass; record bundle delta from the epic-2 baseline

**Manual checks:**

- Pages preview at 360, 767, 768, 1024, 1440 and no-JS: card counts per row, frame, CTA pinned, one `h1`, no overflow, "Servicios" header link and Hero "Ver servicios" resolve to `#servicios`, no console/CSP/hydration errors. Use a free port (not 4300); stop servers afterward.
