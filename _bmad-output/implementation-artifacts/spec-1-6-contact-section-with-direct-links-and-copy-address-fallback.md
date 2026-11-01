---
title: 'Story 1.6: Contact Section with Direct Links and Copy-Address Fallback'
type: 'feature'
created: '2026-10-29'
status: 'done'
route: 'dispatch'
baseline_commit: '32020ffa786d8aa5ee532e8be375acd222c88845'
story_key: '1-6-contact-section-with-direct-links-and-copy-address-fallback'
review_loop_iteration: 0
context:
  - '{project-root}/specs/002-epic-1-page-shell/spec.md'
  - '{project-root}/specs/002-epic-1-page-shell/plan.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Visitors have no dedicated Contact section showing kVA's named contact person, channels, and primary contact CTA, nor a one-action way to copy the email address with accessible status and fallback when webmail or no default mail client is configured.

**Approach:** Establish the shared page-shell section rhythm and heading corner-rule styling (UX-DR6/7/11), add the `copy-address` behavior model and `core/effects` executors for `copy` and `announce` (AD-7), and build the prerendered `#contacto` section over `cable-tray-technician` with direct `mailto:`/`tel:` links, the top-right 40 px white logo (`alt=""`), a plain tagged `mailto:` CTA button, and an `afterNextRender`-gated copy button with polite live-region confirmation and text-selection fallback.

## Boundaries & Constraints

**Always:** Follow Story 1.6 (`1.6-AC-01..06`), FR12/17/20, UX-DR6/7/11/21/22/30, AD-7/8/9. Clarify and plan US6 in `specs/002-epic-1-page-shell/` and merge the `copy-address` behavior model + unit tests before Act. Standalone `OnPush` components, signals, `ContentFacade` only, tokens only, no literal template text or aria/alt strings. Single `<h1>` on page; section headings use `<h2 class="kva-type-h1" tabindex="-1">` with decorative `aria-hidden="true"` corner rule (`┘` default, mirrored `└` in `#contacto`). Contact name is `<h3>`; contact logo in `#contacto` is decorative (`alt=""`, 40 px / 2x 80 px). Copy button uses `[hidden]="!enhanced()"` via `afterNextRender`, `mat-icon` `svgIcon="copy"`, and persistent `role="status"` (clear, set `"Copiado"` ~100 ms later, hold 2500 ms; on failure select email text and announce fallback). Preserve CSP, es-MX, SSG, hydration, and Pages base path.

**Never:** Publish `proyectos2@` or `4029 4029`; add Contact composer or Privacy dialog overlays (Epic 3); render WhatsApp CTA UI (Story 3.5); add Hero, sticky header, or mobile menu (Stories 1.7–1.9); hand-edit generated `_tokens.scss` or `design-tokens.json`; use private `.mat-*`/`.mdc-*` selectors or literal colors/lengths in component SCSS; commit, branch, push, or deploy without approval.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| Prerendered `#contacto` | Default site content, no JS | `<section id="contacto">` over `cable-tray-technician` + overlay, `<h2 tabindex="-1">Contacto</h2>` with mirrored rule, `<h3>Ing. Alfredo Hernández</h3>`, tagged `mailto:` link, `tel:` link (`Llamar al (56) 4000 3344`), `"Cotiza tu proyecto"` tagged `mailto:` CTA, copy button `[hidden]`, `'contacto'` in `visibleSections` | Missing optional `name` or `phone` omitted without empty wrapper/gap |
| Copy success (JS enabled) | Click `"Copiar correo proyectos1@kvainstalaciones.mx"` when `navigator.clipboard.writeText` resolves | Writes `proyectos1@kvainstalaciones.mx`; clears persistent `role="status"`, sets `"Copiado"` ~100 ms later with `check` icon, holds 2500 ms, then resets to `idle` / empty | Rapid re-click resets timer cleanly without leaked timeouts |
| Copy failure / denied | Click copy button when `navigator.clipboard` is missing or `writeText` rejects | Selects the visible email address node in DOM via Selection API and announces `"No se pudo copiar. Selecciona el correo y cópialo."` in `role="status"` | Selection failure degrades gracefully while still announcing fallback |
| Unsupported transition | `copyAddress.transition` called with unknown state/event pair | Returns `null`; feature adapter submits zero effects | Pure, deterministic; inputs remain unmutated |

</frozen-after-approval>

## Code Map

- `specs/002-epic-1-page-shell/{spec.md,plan.md,tasks.md,data-model.md,contracts/contact-section.md}` -- clarify and plan US6, document `copy-address` model, `EffectRunner` (`copy`/`announce`), `contactLogo`, shell rhythm, and AC traceability before Act.
- `src/app/core/effects/{effects.ts,effects.spec.ts}` -- keep closed `Effect` union; add injectable `EffectRunner` executing `copy` (Async Clipboard API + DOM text-selection fallback helper) and `announce` (clear live state, ~100 ms delay, 2500 ms hold timer with cleanup).
- `src/app/behaviors/{copy-address.behavior.ts,copy-address.behavior.spec.ts}` -- `BehaviorModel<CopyAddressState, CopyAddressEvent>` (`id: 'copy-address'`, `acceptance: ['1.6-AC-03', '1.6-AC-04', '1.6-AC-05']`); table-driven tests and JSONL flow log under `.agents/workspace/bmad/2026-10-29/1-6/copy-address.jsonl`.
- `src/app/core/schemas/site.schema.json`, `src/app/core/content/{site.content.ts,site.content.spec.ts,content-facade.ts,content-facade.spec.ts}`, `content/site.md` -- add `contactLogo` (`media/logo/kva-logo-white-40.png` 76×40, 2x `kva-logo-white-80.png` 152×80) with PNG IHDR check; register `{ id: 'contacto', content: this.site.contact.email }` in `ContentFacade.visibleSections`.
- `src/styles.scss`, `src/styles/styles.spec.ts`, `src/app/app.{ts,html,scss,spec.ts}`, `src/app/features/{footer/footer.scss,privacy/privacy.html,privacy/privacy.scss,privacy/privacy.spec.ts}` -- define token-fed shell rhythm variables (`--kva-shell-margin`, `--kva-shell-section-y`, `--kva-shell-columns`) at `@media (width >= 768px)` and `@media (width >= 1024px)` in `src/styles.scss`, plus `.kva-section-heading` and `.kva-corner-rule` / `.kva-corner-rule--mirrored` (UX-DR6/7/11).
- `src/app/features/contact/{contact.ts,contact.html,contact.scss,contact.spec.ts}` (new) -- standalone `OnPush` `#contacto` component using `ResponsiveImage` (`cable-tray-technician`), `MatIcon` (`copy`, `check`), `buildDirectMailtoLink`, `buildTelLink`, `afterNextRender` `enhanced` signal, `copyAddress` model, and `EffectRunner`.
- `scripts/verify-static-build.mjs`, `scripts/content-checks.mjs` -- assert prerendered `<section id="contacto">`, `<h3>Ing. Alfredo Hernández</h3>`, hidden copy button in static HTML, and update clean test fixture.
- Do not change: `src/styles/_tokens.scss`, `src/app/core/schemas/design-tokens.json`, `ui-strings.content.ts` keys (all required strings already exist), `images.content.ts`, `contact-links.ts`, CSP directives.

## Tasks & Acceptance

**Execution:**

- [x] `specs/002-epic-1-page-shell/{spec.md,plan.md,tasks.md,data-model.md,contracts/contact-section.md}` -- clarify and plan US6, contracts, behavior model, and task traceability (`T041`–`T048`) before Act
- [x] `src/app/behaviors/{copy-address.behavior.ts,copy-address.behavior.spec.ts}` -- write table-driven transition tests first, implement `copy-address` model (`idle` / `copied` / `failed`), and write JSONL flow log (`1.6-AC-03`)
- [x] `src/app/core/effects/{effects.ts,effects.spec.ts}` -- write unit tests first, then implement `EffectRunner` for `copy` (Clipboard API write + DOM selection fallback) and `announce` (~100 ms clear-then-set, 2500 ms hold) (`1.6-AC-03..05`)
- [x] `src/app/core/schemas/site.schema.json`, `src/app/core/content/{site.content.ts,site.content.spec.ts,content-facade.ts,content-facade.spec.ts}`, `content/site.md` -- test first; add `contactLogo` (40 px / 80 px 2x white logo) and include `'contacto'` in `ContentFacade.visibleSections` (`1.6-AC-02`)
- [x] `src/styles/styles.spec.ts`, `src/styles.scss`, `src/app/app.scss`, `src/app/features/{footer/footer.scss,privacy/privacy.html,privacy/privacy.scss,privacy/privacy.spec.ts}` -- test then implement shared section shell rhythm (1200 px max column, 20/32/48 px margins, 4/12 columns, 64/112 px section padding) and `<h2 tabindex="-1">` corner-rule styling (`1.6-AC-01`)
- [x] `src/app/features/contact/{contact.ts,contact.html,contact.scss,contact.spec.ts}`, `src/app/app.{ts,html,spec.ts}` -- test first; implement `Contact` component (`#contacto`) and wire into `<main>` before `<app-privacy />`, covering prerender, omitted name/phone, adapter single-application of effects, copy success/hold/reset, clipboard failure selection + announcement, and no-JS hidden button (`1.6-AC-02..06`)
- [x] `scripts/verify-static-build.mjs`, `scripts/content-checks.mjs` -- extend static build verifier and clean fixture to assert prerendered `#contacto` and hidden copy button
- [x] This spec, `.agents/workspace/spec-kit/`, `specs/002-epic-1-page-shell/`, `_bmad-output/implementation-artifacts/sprint-status.yaml` -- archive spec-kit artifacts, run browser/no-JS checks, US6 `speckit-analyze`, and BMAD review

**Acceptance Criteria:**

- Given the page shell, when sections render across 320 px, 768 px, 1024 px, and 1440 px, then content column (1200 px), margins (20/32/48 px), grid (4/12 cols), section padding (64/112 px), and `<h2 tabindex="-1">` headings with `aria-hidden="true"` corner rules match UX-DR6/7/11 (`1.6-AC-01`)
- Given prerendered `#contacto`, when viewed with or without JS, then `cable-tray-technician` + overlay, mirrored corner rule, `<h3>` contact name, tagged `mailto:` and `tel:` links, plain tagged `mailto:` CTA, desktop right 6/12 layout with top-right 40 px white logo, `'contacto'` in `visibleSections`, and gap-free omission of missing name/phone all hold (`1.6-AC-02`, `1.6-AC-06`)
- Given `copy-address` and `core/effects`, when unit and component interaction tests run, then `transition` and `EffectRunner` handle copy success (~100 ms announce `"Copiado"`, 2500 ms hold, reset), failure (select email text, announce fallback), and `null` transitions with single-effect-submission guarantees (`1.6-AC-03`, `1.6-AC-04`, `1.6-AC-05`)

## Implementation Notes

- Clarified and planned US6 in `specs/002-epic-1-page-shell/{spec.md,plan.md,tasks.md,data-model.md,contracts/contact-section.md}` (`T041`–`T048`) before Act.
- Implemented `copy-address` behavior model (`src/app/behaviors/copy-address.behavior.ts`) and table-driven tests (`src/app/behaviors/copy-address.behavior.spec.ts`) covering `request-copy`, `copy-succeeded`, `copy-failed`, `status-timeout`, and unsupported state/event pairs, writing the runtime flow log to `.agents/workspace/bmad/2026-10-29/1-6/copy-address.jsonl`.
- Implemented `EffectRunner` in `src/app/core/effects/effects.ts` (`copy` via Async Clipboard API with DOM `Selection` API `selectElementText` fallback, and `announce` with immediate clear, 100 ms delay, and 2500 ms hold timer with cleanup) with unit tests in `src/app/core/effects/effects.spec.ts`.
- Extended `site.schema.json`, `site.content.ts`, `content/site.md`, and `site.content.spec.ts` with `contactLogo` (`media/logo/kva-logo-white-40.png` 76×40, 2x `kva-logo-white-80.png` 152×80, IHDR verified) and registered `'contacto'` in `ContentFacade.visibleSections`.
- Implemented shared page-shell rhythm custom properties (`--kva-shell-margin`, `--kva-shell-section-y`, `--kva-shell-columns`, `--kva-contact-*`) and `.kva-section-heading` / `.kva-corner-rule` / `.kva-corner-rule--mirrored` in `src/styles.scss`, wired across `app.scss`, `footer.scss`, and `privacy`.
- Implemented standalone `OnPush` `Contact` component (`src/app/features/contact/`) over `cable-tray-technician` (`ResponsiveImage`) + `overlay`, binding the copy button click handler in `afterNextRender` alongside `enhanced.set(true)` so Angular SSR never emits an inline `ng-event-dispatch-contract` script under strict `script-src 'self'` CSP.

## Spec Change Log

## Review Triage Log

| ID | Verdict | Evidence / Disposition |
| --- | --- | --- |
| B1 | low | `.contact-cta` omitted `--kva-component-button-primary-font-family`, `--kva-component-button-primary-rounded`, and label wrapping/centering. Patch: added in `contact.scss`. |
| B2 | low | `.copy-status` omitted `--kva-component-copy-status-font-family` and `--kva-component-copy-status-font-weight`. Patch: added in `contact.scss`. |
| B3 | low | `COPY_STATUS_HOLD_MS = 2500` had no parity check against `design-tokens.json`. Patch: asserted `${COPY_STATUS_HOLD_MS}ms` equals `designTokens.motion['copy-status-hold']` in `effects.spec.ts`. |
| B4/E3 | medium | `Contact` did not remove its `afterNextRender` click listener or clear root `EffectRunner` announce timers on destroy. Patch: registered `DestroyRef.onDestroy` cleanup in `contact.ts`. |
| B5 | low | Root `EffectRunner` holds one active announce timer pair. Reject under complexity rule: only one copy/live-region action is active at a time (`UX-DR22`); multi-caller timer keying is speculative for future Epic 3 overlays. |
| B6/E1 | medium | `.kva-corner-rule` `max-width` clamped out the 32 px (`--kva-spacing-8`) overhang and bleed stopped at `--kva-shell-margin` above 1200 px. Patch: defined `--kva-shell-edge` and removed `max-width` in `src/styles.scss`. |
| B7 | medium | `.privacy` lacked `margin-inline: auto` and aligned to the left edge instead of the 1200 px shell column. Patch: aligned `.privacy` to the 1200 px shell column and constrained `h3, p` to `--kva-component-privacy-notice-width` in `privacy.scss`. |
| B8 | low | `.contact-channels` omitted the `45ch` measure constraint (`DESIGN.md` Layout & Spacing). Patch: added `max-width: 45ch` in `contact.scss`. |
| B9 | low | Active button press transform lacked `prefers-reduced-motion: reduce` handling. Patch: zeroed `--kva-motion-press-offset` under `@media (prefers-reduced-motion: reduce)` in `src/styles.scss`. |
| B10 | low | `contact.spec.ts` did not assert native email/phone link click hand-off against `directContactLinks.transition`. Patch: added test in `contact.spec.ts`. |
| B11 | false | `specs/002-epic-1-page-shell/spec.md` is the single spec-kit feature spec; this file is the BMAD implementation artifact, and findings targeting this build's spec are rejected per workflow rules. |
| B12 | low | `#contacto` regexes in `verify-static-build.mjs` searched the full HTML string. Patch: scoped assertions to the `<section id="contacto">` block and updated the fixture in `scripts/content-checks.mjs`. |
| E2 | medium | Re-clicking copy while `"Copiado"` was visible left prior announce timers/text active during async `copy`. Patch: cleared announce timers and `liveStatus` at the start of the `copy` effect branch in `contact.ts`. |
| V1 | medium | Pre-verified: `clearAnnounceTimers` was not exercised while the 100 ms `announceDelayId` timer was pending. Patch: added 50 ms re-announcement test in `effects.spec.ts`. |
| V2 | medium | Pre-verified: `contact.spec.ts` did not advance past `COPY_STATUS_HOLD_MS` on copy failure to verify the fallback message persists. Patch: extended failure test in `contact.spec.ts`. |

## Design Notes

- `copy-address` transitions: `request-copy` from `idle`/`copied`/`failed` emits `[{ kind: 'copy', text: event.address }]` (`copying`); `copy-succeeded` emits `[{ kind: 'announce', message: event.message }]` (`copied`); `copy-failed` emits `[{ kind: 'announce', message: event.message }]` (`failed`); `status-timeout` from `copied` returns `{ state: { kind: 'idle' }, effects: [] }`; unsupported pairs return `null`.
- `src/styles.scss` defines responsive custom properties (`--kva-shell-margin`, `--kva-shell-section-y`, `--kva-shell-columns`, and `--kva-contact-column` / alignment variables) at `@media (width >= 768px)` and `@media (width >= 1024px)` so component SCSS files remain 100% free of literal `px` values and media queries while `styles.spec.ts` explicitly guards those two breakpoint queries.

## Verification

**Commands:**

- `npx prettier --check <touched files>` -- expected: all formatted cleanly
- `npx ng test --watch=false` -- expected: all unit and interaction tests pass
- `npm run tokens:check && npm run build:pages && npm run verify:static` -- expected: pass; record bundle delta from 251.50 kB

**Execution evidence (2026-11-01):**

- Final test suite: 360 tests across 19 files pass (`npx ng test --watch=false`).
- Token parity, Pages build, and static build verification pass (`npm run tokens:check && npm run build:pages && npm run verify:static`).
- Initial bundle size: 245.06 kB JS + 49.05 kB CSS = 294.12 kB raw (75.86 kB estimated transfer), +42.62 kB from Story 1.5's 251.50 kB (reflecting `@angular/material/icon` and `Contact` component now wired in the root shell), well within the 500 kB warning / 1 MB error budget and 4 kB component style budget.
- Browser verification on Pages preview (`http://localhost:4300/octo-robot-kva/`) and development server (`http://localhost:4200/`) across 1440 px, 1024 px, 768 px, 390 px, and 320 px, plus a JavaScript-disabled browser context at 320 px: verified zero horizontal overflow (`scrollWidth === clientWidth` at all widths), 12-col right-aligned 6/12 block at >= 1024 px and 4-col left-aligned block below 1024 px, 40 px white logo (`alt=""`), `<h2 tabindex="-1">Contacto</h2>` with mirrored corner rule, `<h3>Ing. Alfredo Hernández</h3>`, tagged `mailto:` and `tel:` links, plain tagged `mailto:` CTA, 44×44 px copy button (`hidden` when JS disabled), copy success (`"Copiado"` + `check` icon after ~100 ms, reset after 2500 ms), copy failure DOM text selection + fallback announcement, single `<h1>`, `lang="es-MX"`, CSP, hydration (`Angular hydrated 6 component(s)`), and SSG `#ng-state`. All dev and preview servers stopped.
- Behavior-flow log written to `.agents/workspace/bmad/2026-10-29/1-6/copy-address.jsonl` (5 cases: 4 supported transitions, 1 unsupported transition returning `null`, 0 failures, 0 gaps) and spec-kit baselines/data/layout-cases archived under `.agents/workspace/spec-kit/`.

**Manual checks (if no CLI):**

- Browser verification on dev (`http://localhost:4200/`) and Pages preview (`http://localhost:4300/octo-robot-kva/`) at 1440 px, 1024 px, 768 px, 390 px, and 320 px, plus JS-disabled context: verify `#contacto` layout, corner rule, copy success (`"Copiado"` + reset), copy failure fallback selection, keyboard focus rings, single `h1`, `es-MX`, CSP, hydration, and SSG `#ng-state`. Stop servers afterward.
