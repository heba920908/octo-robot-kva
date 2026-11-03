---
title: 'Story 1.7: Hero Section'
type: 'feature'
created: '2026-11-03'
status: 'done'
route: 'dispatch'
baseline_commit: '2879e11e112145c8e27ec9f000d0cc1ac09e25fa'
story_key: '1-7-hero-section'
review_loop_iteration: 0
context:
  - '{project-root}/specs/002-epic-1-page-shell/spec.md'
  - '{project-root}/specs/002-epic-1-page-shell/plan.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The page opens on a placeholder `<h1>` and paragraph. A phone visitor cannot see who kVA is, for whom, or how to ask for a quote on the first screen, and no content doc governs Hero copy or its proof point.

**Approach:** Add a validated `hero` content doc (`content/hero.md`, `hero.schema.json`, typed `hero.content.ts`) and a prerendered `#inicio` Hero over `cover-blueprint-tools` + `overlay` on an `ink` ground. It owns the page's only `<h1>`, the lead, a `<a href="#contacto">` primary CTA, a `#servicios` secondary CTA rendered only while `servicios` is visible, and the proof point. The Hero registers `'hero'` in `ContentFacade.visibleSections`, and the placeholder `<h1>`/`<p>` leave `app.html`.

## Boundaries & Constraints

**Always:** Follow Story 1.7 ACs, FR4, UX-DR5/6/12/30, AD-14. Plan US7 in `specs/002-epic-1-page-shell/` (T049+) before Act. Standalone `OnPush` component, `ContentFacade` only, token-fed SCSS (no literal px/colors/media-query literals beyond the `styles.scss` shell breakpoints), no literal template text, `alt=""` on logo. Headline ≤ 60 and lead ≤ 120 characters; overline "Explorando soluciones"; CTAs "Cotiza tu proyecto" / "Ver servicios"; proof point "3+ años · Cobertura en todo México" required by the schema and every segment must equal a `site.facts` value. Hero uses `ResponsiveImage` with `priority` (eager, `fetchpriority="high"`), a static `<link rel="preload" as="image">` in `src/index.html`, and an `ink` ground under the overlay. Min-height `min(100svh, hero-max)`; reflow at 320 px; `>= 768` centered with 200 px white logo, overline between hairlines and interlocking corner-bracket frame; `< 768` left-aligned, CTAs stacked full-width. **Decision (human):** the Hero logo renders only at `>= 768`; the mobile first-screen logo check is deferred to Story 1.8's header, so Story 1.7 ships no mobile logo. Preserve CSP, es-MX, SSG, hydration, Pages base path.

**Never:** Add header, nav, skip link, or menu (Stories 1.8/1.9); composer or privacy overlays (Epic 3); an empty `#servicios` section or a CTA pointing at a missing section; hand-edit generated `_tokens.scss`/`design-tokens.json`; private `.mat-*` selectors; commit, branch, push, or deploy without approval.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| Prerender | Default content, no JS | `<section id="inicio">` with one `<h1>`, lead, overline, `<a href="#contacto">Cotiza tu proyecto</a>`, proof point; no `Ver servicios` link while `servicios` is not visible | N/A |
| Servicios visible | `visibleSections` includes `servicios` | `<a href="#servicios">Ver servicios</a>` rendered after primary CTA | N/A |
| Unrecorded proof point | Proof segment not in `site.facts` | Content validation test fails | Schema/fact check rejects |
| Missing proof point | `hero.md` without `proofPoint` | Schema validation fails (build gate) | Required property |
| 360×640 / 320 px | Reference viewport | Overline, headline, lead, primary CTA, proof point visible (no mobile logo until 1.8); no horizontal overflow | Heights are minimums, labels wrap |

</frozen-after-approval>

## Code Map

- `specs/002-epic-1-page-shell/{spec.md,plan.md,tasks.md,data-model.md,contracts/hero-section.md}` -- plan US7 (`T049`+); FR-018.
- `content/hero.md`, `src/app/core/schemas/hero.schema.json`, `src/app/core/content/{hero.content.ts,hero.content.spec.ts}` (new) -- mirror `site.*`/`images.*` pattern: Ajv2020 test-only validation, required `overline,headline,lead,primaryCta,secondaryCta,proofPoint`; proof-point-vs-`site.facts` check.
- `src/app/core/content/{content-facade.ts,content-facade.spec.ts}` -- expose `hero`; register `{ id: 'hero', content: hero.headline }` in `visibleSections` (`'hero'` already in `sectionOrder`).
- `src/app/features/hero/{hero.ts,hero.html,hero.scss,hero.spec.ts}` (new) -- template on `features/contact/*`; reuse `ResponsiveImage` (`priority`), `images['cover-blueprint-tools']` (740 px wide max), `kva-logo-white-200.png`/`-241.png`, `.kva-type-display/lead/overline`, `button-primary` and `button-ghost-on-dark` tokens, `--kva-spacing-{hero-max,logo-hero,frame-offset,bracket-arm}`.
- `src/app/app.{ts,html,scss,spec.ts}` -- import `Hero`, render `<app-hero />` first in `<main>`, drop placeholder `<h1>`/`<p>` and their `.site-main > h1/p` rules; update the h1 tests to the Hero headline.
- `src/styles.scss`, `src/styles/styles.spec.ts` -- only if shared Hero custom properties are needed at the existing 768/1024 breakpoints.
- `src/index.html` -- add `<link rel="preload" as="image" type="image/avif" imagesrcset imagesizes fetchpriority="high">` for the Hero photo.
- `scripts/verify-static-build.mjs`, `scripts/content-checks.mjs` -- assert prerendered `#inicio`, single `h1` inside it, `href="#contacto"` CTA, no `href="#servicios"`, image preload link; update the clean fixture.
- Do not change: `_tokens.scss`, `design-tokens.json`, `ui-strings.content.ts` (Hero strings stay Hero-owned; the existing test forbids `hero*` keys), `site.heading` content, CSP.

## Tasks & Acceptance

**Execution:**

- [x] `specs/002-epic-1-page-shell/*` -- clarify and plan US7, contract, tasks, AC traceability before Act
- [x] `content/hero.md`, `hero.schema.json`, `hero.content.ts`/`.spec.ts` -- tests first; schema, copy limits, required proof point, proof-point fact check
- [x] `content-facade.ts`/`.spec.ts` -- tests first; expose `hero`, register `'hero'` visible section
- [x] `src/app/features/hero/*` -- tests first; component, responsive layout, frames, priority image, conditional secondary CTA
- [x] `src/app/app.*`, `src/index.html` -- wire Hero, remove placeholder, add preload
- [x] `scripts/verify-static-build.mjs`, `scripts/content-checks.mjs` -- extend static verifier and fixture
- [x] This spec, `specs/002-epic-1-page-shell/`, `sprint-status.yaml` -- browser checks at 360×640/320/768/1440, review (spec-kit analysis not run)

**Acceptance Criteria:**

- Given the Hero content validated by `hero.schema.json`, when prerendered, then `#inicio` shows overline, sole `<h1>` (≤ 60), lead (≤ 120), primary CTA `<a href="#contacto">`, and the proof point; a proof point not in the site facts, or a missing one, fails validation.
- Given 360×640 and 320 px, when the page loads, then overline, headline, lead, primary CTA and proof point are visible without scrolling and text reflows without clipping (logo deferred to 1.8).
- Given the Hero photo, when it renders, then it is eager, `fetchpriority="high"`, preloaded, over `overlay` on an `ink` ground.
- Given `>= 768`, when it renders, then content is centered with the 200 px logo, hairlined overline and interlocking brackets; below, left-aligned with stacked full-width CTAs.
- Given `servicios` is absent from `visibleSections`, when the Hero renders, then no `#servicios` CTA is output.

## Implementation Notes

- Added `hero` content doc (`content/hero.md`, `hero.schema.json`, `hero.content.ts`) with a test-only proof-point-vs-`site.facts` check; exposed through `ContentFacade.hero` and registered `'hero'` in `visibleSections`.
- Added `features/hero` (`#inicio`, priority `ResponsiveImage` over `overlay` on `ink`, logo/brackets/hairlines at `>= 768`, conditional `#servicios` CTA), `--kva-hero-*` shell properties in `src/styles.scss`, and the AVIF preload in `src/index.html`. The placeholder `<h1>`/`<p>` left `app.html`.
- Static verifier asserts `#inicio`, hero h1, `#contacto` CTA, no `#servicios` link and the preload; negative fixtures cover each check.

## Spec Change Log

## Review Triage Log

| ID | Verdict | Evidence / Disposition |
| --- | --- | --- |
| R1 | low | Logo `srcset` pairs the 459×241 file as `2x`: the pipeline caps derivatives at the source size (Story 1.4 contract: Hero 200/241), so the browser still picks the best available. Reject. |
| R2 | low | Hero logo is `loading="lazy"`: it is `display:none` below 768 so mobile skips the fetch; in view at 768+ it loads right after layout. Reject (eager would fetch it on phones). |
| R3 | low | Plain `href="#contacto"` resolves against `<base>`; with a query string it would reload. Mandated by the AC and the same as the footer's `#aviso`; Story 1.8 replaces it with section navigation. Deferred. |
| R4 | false | Hero renders without a `visibleSections` guard: `'hero'` is registered from required `headline`, so it cannot be empty. |
| R5 | low | `hero.md` is checked by `toContain` only, the same convention as `site.md`/`images.md`. Reject. |
| R6 | low | Contract said split on `·` while the test split on `' · '`. Patched: test splits on `·` and trims. |
| R7 | false | `overflow: hidden` on `.hero` only clips the absolute photo; height is a minimum, text reflows, brackets are `display:none` below 768 and offsets (24 px) fit the 32 px margin at 768+. Browser check showed zero overflow. |
| R8 | low | `site.heading` is no longer rendered and can drift from `hero.headline`. Deferred. |
| R9 | medium | Pre-verified: static-verifier Hero checks had no failing fixtures. Patched: `runStaticVerificationFixture` accepts an HTML mutation; four rejecting cases added in `template-content.spec.ts`. |
| R10 | medium | Pre-verified: responsive layout asserted by source text only. Deferred; browser matrix run manually at 360×640, 320, 768, 1440 (no overflow, first-screen items visible, correct logo/CTA layout). |
| R11 | low | Photo derivative is 740 px wide and stretched at 1440 under the overlay: Story 1.4 pipeline cap. Deferred. |
| R12 | low | Duplicate button styles with `.contact-cta`, missing `:active`, contrast not asserted, `::ng-deep` on `ResponsiveImage`: same patterns Story 1.6 accepted; reject as speculative. |
| R13 | low | Preload `imagesizes` is not compared to the component `sizes` input; both are `100vw`. Reject. |
| R14 | low | Checklist/status bookkeeping unchecked in the reviewed snapshot. Resolved when marking tasks. |

## Verification

**Commands:**

- `npx prettier --check <touched files>` -- expected: clean
- `npx ng test --watch=false` -- expected: all tests pass
- `npm run tokens:check && npm run build:pages && npm run verify:static` -- expected: pass; record bundle delta from 294.12 kB raw

**Manual checks:**

**Execution evidence (2026-11-03):**

- 386 tests across 21 files pass; formatting, `tokens:check`, `build:pages` and `verify:static` pass. Initial bundle 251.93 kB JS + 49.58 kB CSS = 301.51 kB raw (76.78 kB transfer), +7.39 kB from Story 1.6.
- Pages preview at 360×640, 320×640, 768×1024, 1440×900: zero horizontal overflow, one `h1`, overline/headline/lead/CTA/proof point inside the 640 px viewport at 360 and 320, CTA full width on mobile, logo hidden below 768 and 200 px at 768+, photo `eager` + `fetchpriority="high"` + preload link, SSG `#ng-state`, `es-MX`, no console errors or failed requests. Preview server stopped.
- No-JS rendering is covered by the prerender assertions in `verify:static`; no separate no-JS browser session.

**Manual checks (planned):**

- Dev (`http://localhost:4200/`) and Pages preview (`http://localhost:4300/octo-robot-kva/`) at 360×640, 320, 768, 1440, plus no-JS: first-screen items, no overflow, single `h1`, preload link, no CSP/hydration errors. Stop servers afterward.
