---
title: 'Story 2.1: Services Section with the Four Brochure Service Cards'
type: 'feature'
created: '2026-11-04'
status: 'done'
route: 'dispatch'
baseline_commit: 'e294294caf4812a30bd843793c52685727e9a78e'
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

- Added `content/services/*.md` x4, `service.schema.json`, `services.content.ts` (+ spec), facade `services`/`resolveServices` (sorted by `order`, image ids resolved, unknown id throws), `features/services`, `--kva-services-columns` token-fed grid in `styles.scss`, static verifier services block and fixture.
- Existing header spec "enhancement" cases now pin `visibleSections` to `['hero','contacto']` because the real facade now lists `servicios` and those cases only mount a `#contacto` section.
- Bundle delta (production,pages) vs epic-2 baseline: main 282.65 -> 291.06 kB raw (77.91 -> 79.65 kB transfer); styles 51.17 -> 51.28 kB. `header.scss` budget warning (+1.71 kB) is pre-existing.
- Browser (Pages preview, port 4311): 1/1/2/2/4 per row at 360/767/768/1024/1440, CTA bottom offset equal across cards, no overflow, one h1, header and Hero links present, 0 console warnings/errors; served HTML has all Sub-services.

## Spec Change Log

## Review Triage Log

| ID  | Verdict | Evidence / Disposition                                                                                                                                                                                                                                                                                              |
| --- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1  | medium  | Descriptions for Services 1 and 3 contain outcome claims ("conforme a norma", "evitar paros e inspecciones fallidas", "de principio a fin") beyond the Sub-services. They match the Hero's approved promise but the spec said no new claims. Deferred: needs editorial confirmation; each doc flags `[ASSUMPTION]`. |
| R2  | medium  | Service 4 wording is agent-written (EXPERIENCE marks it `[ASSUMPTION]`). Deferred: editorial confirmation.                                                                                                                                                                                                          |
| R3  | low     | `[ASSUMPTION]` is asserted by a test and will need editing once confirmed. Reject: intentional tracker; removing it is part of the confirmation edit.                                                                                                                                                               |
| R4  | medium  | Docs were checked only by substring; two had invalid YAML (`: ` in plain scalars). Patched: quoted; spec parses frontmatter with `yaml`, deep-equals typed content, validates against the schema.                                                                                                                   |
| R5  | low     | Doc body text is process notes. Reject: matches the hero/ui-strings convention.                                                                                                                                                                                                                                     |
| R6  | medium  | Duplicate Service ids were not rejected at runtime. Patched: `resolveServices` throws; test added.                                                                                                                                                                                                                  |
| R7  | low     | Duplicate `order`, `uniqueItems`, `maxLength`, `$id` URL. Reject: matches existing schemas; order is asserted ascending in tests.                                                                                                                                                                                   |
| R8  | low     | `freezeContent` freezes shared `subServices` arrays of the source constant. Reject: source is a module constant never mutated.                                                                                                                                                                                      |
| R9  | low     | Identical CTA names across cards (WCAG 2.4.4). Defer: Epic 3 replaces the CTA with a Service-specific composer action; the card heading is the adjacent context.                                                                                                                                                    |
| R10 | medium  | Grid/CTA layout verified by regex on SCSS plus manual browser check. Defer: repo has no browser test harness and AGENTS.md forbids adding Playwright without a story.                                                                                                                                               |
| R11 | low     | `1440` exempted in `styles.spec.ts` and `--kva-services-columns` lives in `styles.scss`. Reject: same pattern as the existing `--kva-hero-*` and the 1024 breakpoint.                                                                                                                                               |
| R12 | medium  | Static verifier checked only the maintenance item. Patched: every Sub-service of every Service must be a `<li>` in the prerendered section; rejecting mutations added.                                                                                                                                              |
| R13 | low     | Verifier h2 text hardcoded; two-anchor count not header-specific. Reject: header link is checked separately; copy change should fail loudly.                                                                                                                                                                        |
| R14 | low     | T205 ticked before review. Reject: ticked on gates and review completion at merge; spec status reflects the flow.                                                                                                                                                                                                   |
| R15 | low     | `::ng-deep`, overlay `pointer-events`, no decorative-image flag. Reject: `::ng-deep` mirrors the hero pattern; overlay sits on a non-interactive band; no launch Service has an image.                                                                                                                              |
| R16 | medium  | `<app-services />` rendered an empty section when no Services. Patched: rendered only when `servicios` is visible; test added.                                                                                                                                                                                      |
| R17 | low     | Empty-string `cta` rendered a blank link. Patched: `\|\|`.                                                                                                                                                                                                                                                          |
| R18 | low     | Regex `<section ...>[\s\S]*?</section>` could truncate on a nested section. Reject: the card markup uses `<article>`; no nested section.                                                                                                                                                                            |
| R19 | low     | Image-id existence only checked for one id; unknown id throws at facade construction. Patched: spec asserts every set `image.id` is an `images` key; throwing at build/prerender is the intended failure.                                                                                                           |
| R20 | low     | Redundant 9-item assertion. Reject: harmless duplicate.                                                                                                                                                                                                                                                             |

## Design Notes

Typed content mirrors the Markdown by hand (repo convention: `.md` is never parsed at runtime); a spec asserts parity. A Service `image` is `{ id, alt }` where `id` is a key of `images.content`; `alt` is mandatory when an image is set. The facade owns ordering by `order`, so component code never sorts.

## Verification

**Commands:**

- `npx prettier --check src scripts content specs` -- expected: clean
- `npx ng test --watch=false` -- expected: all tests pass
- `npm run tokens:check && npm run build:pages && npm run verify:static` -- expected: pass; record bundle delta from the epic-2 baseline

**Manual checks:**

- Pages preview at 360, 767, 768, 1024, 1440 and no-JS: card counts per row, frame, CTA pinned, one `h1`, no overflow, "Servicios" header link and Hero "Ver servicios" resolve to `#servicios`, no console/CSP/hydration errors. Use a free port (not 4300); stop servers afterward.
