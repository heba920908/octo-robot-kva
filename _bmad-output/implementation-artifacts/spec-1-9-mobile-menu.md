---
title: 'Story 1.9: Mobile Menu'
type: 'feature'
created: '2026-11-04'
status: 'done'
route: 'dispatch'
baseline_commit: 'aae2257aaa061a0e12f9c3705272a8e2ed813004'
story_key: '1-9-mobile-menu'
review_loop_iteration: 0
context:
  - '{project-root}/specs/002-epic-1-page-shell/spec.md'
  - '{project-root}/specs/002-epic-1-page-shell/plan.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Below 1024 px the header shows no section links (Story 1.8 deferred them), so a phone or tablet Visitor cannot reach a section in one action. `core/layers` can replace the fragment but cannot open an overlay, push a history entry or consume it.

**Approach:** Add a `mobile-menu` behavior model with a root adapter, extend `core/layers` (`open`/`close` with `pushState`, guarded `history.back()`, `inert`, scroll lock, Back notification) and give `EffectRunner` a `layer` executor. The header gains a "Menú" disclosure button and turns its one `<nav id="menu-movil" aria-label="Secciones">` into the sheet below 1024 px.

## Boundaries & Constraints

**Always:** Follow Story 1.9 ACs (1.9-AC-01..06), UX-DR10/30, FR1, AD-5, AD-7. Plan US9 in `specs/002-epic-1-page-shell/` (T064+, contract `mobile-menu.md`) and merge the model and its table-driven tests before Act. Standalone `OnPush`, `ContentFacade` only (new `ui-strings` key for the nav label), token-fed SCSS, no literal template text, no `(click)` template bindings (CSP event replay; use delegated listeners). Button: constant `aria-label` "Menú", `aria-expanded` from state, `aria-controls="menu-movil"`, menu/close `mat-icon`, `hidden` until `enhanced`. Open: full-height `ink` sheet under the header with `mobile-menu` rows and the header CTA repeated at the bottom; `inert` on `main` and `footer` only; CDK focus trap over header + sheet; `<html>` scroll lock; one `pushState` entry. Esc, Back, toggle and viewport ≥ 1024 close it and consume the entry (Back is already consumed); Esc/Back/toggle focus the toggle. A plain click on any header `[data-section-target]` while open closes first, then `section-navigation` scrolls, focuses the heading and `replaceState`s after the entry is consumed (serialized). Without JS: no button, nav stays a wrapped row below 1024. Other Story 1.8 behavior unchanged. Preserve CSP, SSG, hydration, es-MX, single `<h1>`, component style budget.

**Decisions (agent, recorded):** Focus stays on the toggle on open. The bar CTA remains visible while open. The sheet CTA is hidden outside the sheet. Only one overlay is active at a time (stacking is Epic 3).

**Never:** Composer, privacy or project overlays (Epic 3+); `pushState`/`history.back`/`popstate` outside `core/layers`; new dependencies (`@angular/cdk` is installed); hand-editing generated `_tokens.scss`/`design-tokens.json`; commit, branch, push or deploy without approval.

## I/O & Edge-Case Matrix

| Scenario      | Input / State                     | Expected Output / Behavior                                           | Error Handling                |
| ------------- | --------------------------------- | -------------------------------------------------------------------- | ----------------------------- |
| Open          | Closed, toggle or `open`          | `{open:true}`, `[layer open mobile-menu]`                            | Open event while open: `null` |
| Close         | Open, toggle or Esc               | `{open:false}`, `[layer close, focus menu-toggle]`                   | Esc while closed: `null`      |
| Back          | Open, `popstate`                  | `{open:false}`, `[focus menu-toggle]` (no layer effect)              | Back while closed: `null`     |
| Link choice   | Open, plain click, visible target | `{open:false}`, `[layer close]`; navigation then focuses the heading | Hidden/blank target: `null`   |
| Wide viewport | Open, resize ≥ 1024               | `close`: `{open:false}`, `[layer close]`                             | N/A                           |
| Prerender     | No JS, < 1024                     | Button `hidden`; `nav#menu-movil` shows wrapped links                | N/A                           |

</frozen-after-approval>

## Code Map

- `src/app/behaviors/behavior-model.ts`, `section-navigation.behavior.ts` + spec -- pattern to mirror. New `mobile-menu.behavior.ts` + spec (`1.9-AC-02..05`): events `open|close|toggle|escape|back|choose-link`.
- `src/app/core/layers/layers.ts` + spec -- sync FIFO queue; make operations completion-aware. Add `active` signal, `open`, `close`, `onBack`, `inert`/`data-kva-layer` guards, fallback timeout. Update the ownership guard to include `history.back`.
- `src/app/core/effects/effects.ts` + spec -- add `layer(effect)` executor to `EffectRunner`; `LayerEffect` already in the union.
- `src/app/core/navigation/section-navigation.ts` -- export `isPlainClick`. New `mobile-menu.ts` + spec adapter: state signal, `dispatch`, delegated `listen(host)` (toggle click, link click, Esc), `layers.onBack`.
- `src/app/features/header/header.{ts,html,scss,spec.ts}` -- toggle, `nav#menu-movil`, sheet CTA, `is-menu-open`, `FocusTrapFactory` in an `effect`, register menu listener before `navigation.listen`, close on wide resize (read `--kva-header-menu-button-display`). Keep scss within budget.
- `src/styles.scss` -- `--kva-header-links-display` (block/flex), `--kva-header-menu-button-display`, `--kva-header-nav-enhanced-display` (none/flex), `html[data-kva-layer]` scroll lock.
- `content/ui-strings.md`, `ui-strings.content.ts`, `ui-strings.schema.json` + spec -- add `menuNavLabel` "Secciones". `menu` already exists.
- `scripts/verify-static-build.mjs`, `scripts/content-checks.mjs`, `template-content.spec.ts` -- assert prerendered `nav#menu-movil`, hidden toggle, rejecting fixtures.
- `specs/002-epic-1-page-shell/*`, `sprint-status.yaml` -- US9 plan/tasks, contract, status. Do not change `_tokens.scss`, CSP, `site.heading`.

## Tasks & Acceptance

**Execution:**

- [x] `specs/002-epic-1-page-shell/*` -- clarify and plan US9, contract, tasks, AC traceability before Act
- [x] `behaviors/mobile-menu.behavior.ts` + spec -- tests first; table-driven supported/unsupported results
- [x] `core/layers/*`, `core/effects/effects.ts` + specs -- tests first; open/close/Back/serialized history, inert, scroll lock, `layer` executor
- [x] `core/navigation/mobile-menu.ts` + spec -- adapter applies each result once, nothing for `null`
- [x] `ui-strings` doc/content/schema + spec -- `menuNavLabel`
- [x] `features/header/*`, `styles.scss` -- tests first; button, sheet, trap, wide-resize close, no-JS row
- [x] `scripts/*`, `template-content.spec.ts` -- static verifier and fixtures
- [ ] This spec, `specs/`, `sprint-status.yaml` -- full gates, browser matrix, review

**Acceptance Criteria:**

- Given < 1024 px with JS, when the page renders, then the "Menú" button and `nav#menu-movil` in the header exist and inline links are gone (1.9-AC-01).
- Given the model, when its tests run, then each `transition` result matches and the adapter applies each once and `null` none (1.9-AC-02).
- Given the menu is closed, when the Visitor activates "Menú", then the sheet opens, `main`/`footer` are `inert`, focus is trapped, scroll is locked and one history entry is pushed (1.9-AC-03).
- Given it is open, when Esc, Back or the toggle is used, then it closes, the entry is consumed and focus is on the toggle (1.9-AC-04).
- Given it is open, when a section link is chosen, then it closes, the entry is consumed, the fragment is replaced and the heading is focused (1.9-AC-05).
- Given no JS below 1024 px, when the page renders, then the button is hidden and links wrap (1.9-AC-06).

## Implementation Notes

- US9 planned first (`specs/002-epic-1-page-shell/` T064–T071, `contracts/mobile-menu.md`); `mobile-menu` model and its table-driven tests (JSONL to `.agents/workspace/bmad/2026-11-04/1-9/mobile-menu.jsonl`) merged before the adapter, header and SCSS.
- `LayerController` gained `open`, `close`, `onBack`, `active`, inert on `main`/`footer`, the `data-kva-layer` scroll lock and a completion-aware FIFO queue: `close()` releases the page at once, then a guarded `history.back()` (skipped unless `history.state.kvaLayer` is the overlay) finishes on `popstate` (500 ms fallback). `replaceFragment` waits in the same queue, so a link's fragment cannot be undone by the traversal. Browser Back releases the page and notifies `onBack`.
- `MobileMenu` adapter (`core/navigation`) registers delegated toggle click, plain-click `[data-section-target]` and document Esc; `Header` registers it before `SectionNavigation.listen`. No `(click)` bindings; no event-replay script is emitted.
- `Header`: `nav#menu-movil` (name from new `menuNavLabel` "Secciones"), `button#menu-toggle` (constant `aria-label` "Menú", `aria-expanded`, `aria-controls`, `hidden` until `enhanced`), sheet CTA, CDK `FocusTrapFactory` on the header while open, close when `--kva-header-menu-button-display` computes to `none`.
- No-JS below 1024 px: the nav wraps below the bar via `--kva-header-nav-flex`/`--kva-header-nav-order`; `@media (scripting: none) and (width < 1024px)` adds hero top padding (`styles.spec.ts` allows it).
- `menuNavLabel` added to `content/ui-strings.md`, `ui-strings.content.ts`, schema and spec. Outside the code map: a matching row in `EXPERIENCE.md` (the "retains the complete non-Hero EXPERIENCE defaults" test requires it). `scripts/verify-static-build.mjs`, `scripts/content-checks.mjs` and `template-content.spec.ts` now check the prerendered nav and hidden button.
- Header spec: a native hash navigation from the "modified click" test used to leak a late `popstate` into the next test; that test now cancels the navigation after recording the header's verdict. The header spec now uses `appConfig.providers` + `provideHttpClientTesting` so `mat-icon` has its icon set.
- Known deviation: `header.scss` compiles to 5.71 kB, over the 4 kB `anyComponentStyle` warning (error limit 8 kB; build still passes with a warning). Not trimmed without dropping sheet styling; candidate for review.

## Spec Change Log

## Review Triage Log

| ID  | Verdict | Evidence / Disposition                                                                                                                                                  |
| --- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1  | medium  | `LayerController.pump` stalled forever if a history operation threw (old `try/finally` lost). Patched: `done()` on throw, rethrow; test added.                          |
| R2  | medium  | DOM order put the bar CTA before the links, so Tab order differed from visual order at >= 1024 px. Patched: DOM is logo, nav, CTA, toggle; spec asserts it.             |
| R3  | medium  | JS users below 1024 px saw the prerendered wrapped nav until hydration (layout shift). Patched: `@media (scripting: enabled)` hides it pre-hydration.                   |
| R4  | medium  | Icon assertion could not fail; sheet/bar CTA clicks untested. Patched: icon identity asserted (mutation-checked); link-choice test covers links, sheet CTA and bar CTA. |
| R5  | low     | Contract/tasks markdown unformatted. Patched with Prettier.                                                                                                             |
| R6  | low     | Adapter ignores the `layer` open result (state could diverge if another overlay is open). Deferred: unreachable until Epic 3 adds overlays.                             |
| R7  | low     | Any `popstate` while open is treated as Back; a late popstate after the 500 ms fallback can mis-close. Deferred: needs a real-browser repro.                            |
| R8  | low     | `ngOnDestroy` leaves the fallback timer and queue; stale `kvaLayer` entry after Forward/reload. Deferred: root singleton, harmless.                                     |
| R9  | low     | Link click whose `-title` heading is absent closes the menu while the native anchor jumps. Reject: every visible section has a heading (Story 1.8 R9).                  |
| R10 | low     | `header.scss` 5.71 kB exceeds the 4 kB warning (error 8 kB). Deferred: needs a budget decision or a styles split.                                                       |
| R11 | low     | iOS scroll lock (`overflow: hidden`) and scrollbar gutter shift. Deferred: needs device testing.                                                                        |
| R12 | low     | `closeWhenWide` reads a CSS custom property as breakpoint proxy. Reject: tied to the same media query that hides the button; tested.                                    |
| R13 | low     | Behavior spec writes a JSONL flow log. Reject: required by bmad-protocols.md, git-ignored workspace (as in 1.5/1.6/1.8).                                                |
| R14 | low     | Esc ignores `defaultPrevented`/IME; skip link and body siblings not inert; `INERT_SELECTOR` broad. Reject: spec fixes inert to `main`/`footer`.                         |
| R15 | low     | Scroll/focus not serialized with traversal; Chromium only. Reject: verified in browser; fragment waits behind the traversal.                                            |
| R16 | false   | Stale "US9 unplanned" lines and table alignment claims were already updated by the implementation pass.                                                                 |

## Design Notes

`history.back()` completes on `popstate`, so `close` queues an operation that finishes on that event (500 ms fallback); the later `replaceState` waits behind it and cannot be undone by the traversal. `inert` and scroll lock are released synchronously on close so the heading can take focus.

## Verification

**Commands:**

- `npx prettier --check <touched files>` -- expected: clean
- `npx ng test --watch=false` -- expected: all tests pass
- `npm run tokens:check && npm run build:pages && npm run verify:static` -- expected: pass; record bundle delta from 316.00 kB raw

**Manual checks:**

- Pages preview at 360×640, 320, 768, 1023, 1024, 1440 and no-JS: open/close by button, Esc, Back and link; keyboard trap; URL fragment and history length; no overflow, one `h1`, no console/CSP/hydration errors. Stop servers afterward.

**Evidence (2026-11-04):**

- `npx prettier --check src scripts content`: clean.
- `npx ng test --watch=false`: 27 files, 535 tests passed (baseline 472).
- `npm run tokens:check && npm run build:pages && npm run verify:static`: pass. Initial total 316.00 kB → 333.73 kB raw (+17.73 kB; main 265.40 → 282.62 kB, styles +~0.5 kB; transfer 79.44 → 83.08 kB). One warning: `header.scss` 5.71 kB vs 4 kB budget.
- Pages preview (Chromium via Playwright), closed: 360, 320, 768, 1023 show the toggle and hide the nav; 1024 and 1440 hide the toggle and show the inline nav; no horizontal overflow beyond the scrollbar; one `h1`, one `nav#menu-movil` at every width.
- 360×640 open: `aria-expanded=true`, icon `close`, `ink` sheet (0,65, 360×575) with the CTA at the bottom, `main`/`footer` `inert`, `html` overflow hidden, `history.state={kvaLayer:'mobile-menu'}`, one extra history entry, focus on the toggle; Tab cycles inside the header only. Esc, toggle and Back each close it, release inert/scroll lock and focus the toggle. Link click: closes, scrolls, focuses `#contacto-title`, URL `#contacto`, no extra entry. Sheet CTA likewise. Widening 360→1100 while open closes it. Open sheet at 320, 768, 1023: no overflow.
- No-JS (JS disabled) at 360 and 1024: no button; at 360 the "Contacto" link wraps on its own row below the bar; at 1024 inline nav.
- Console: no errors or CSP violations; one pre-existing preload warning for `cover-blueprint-tools-640.avif`. Preview server stopped.
- After review patches: 27 files, 542 tests pass; prettier (`src scripts content specs`), `tokens:check`, `build:pages` (333.82 kB raw, same `header.scss` warning) and `verify:static` pass. Browser re-check: 360 closed/open/Esc (icon, inert, one history entry, focus on the toggle) and 1440 (toggle and sheet CTA hidden, inline nav and CTA, no overflow). Preview stopped.
