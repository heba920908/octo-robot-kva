---
title: 'Story 1.8: Sticky Header and Section Navigation'
type: 'feature'
created: '2026-11-03'
status: 'done'
route: 'dispatch'
baseline_commit: 'ac90361762bcb2e3705ec052a1cfc6bc23f6e3a1'
story_key: '1-8-sticky-header-and-section-navigation'
review_loop_iteration: 0
context:
  - '{project-root}/specs/002-epic-1-page-shell/spec.md'
  - '{project-root}/specs/002-epic-1-page-shell/plan.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The page has a placeholder `<header><p>` brand line, no skip link, no way to reach a section in one action, and no owner for fragment/history changes. The Hero's `#contacto` CTA is a plain anchor (Story 1.7 R3, deferred here), and the Hero logo was deferred to this header on mobile.

**Approach:** Add a sticky `Header` (white logo → `#inicio`, wordmark ≥ 768, links only for sections in `ContentFacade.visibleSections`, Header contact CTA → `#contacto`), a `SkipLink`, a `section-navigation` behavior model with its adapter, `core/layers` as sole owner of `history.replaceState` and `popstate`, and focus/scroll/navigate executors in `core/effects`. Header links, the skip link and the Hero CTAs dispatch the model; without JavaScript they stay native anchors.

## Boundaries & Constraints

**Always:** Follow Story 1.8 ACs (1.8-AC-01..05), FR1-3, UX-DR8/9/11, AD-5, AD-7. Plan US8 in `specs/002-epic-1-page-shell/` (T056+, contract `section-navigation.md`) and merge the behavior model and its table-driven tests before Act. Standalone `OnPush` components, `ContentFacade` only, token-fed SCSS (no literal px/colors/media-query literals beyond the `styles.scss` shell breakpoints), no literal template text. Header link order Servicios · Proyectos · Nosotros · Confianza · Contacto, links ≥ 1024, CTA label "Cotiza tu proyecto" (≥ 768) / "Cotiza" (< 768), logo link accessible name "kVA Instalaciones" (`aria-label`, `alt=""`), wordmark "Instalaciones" ≥ 768 from a new `ui-strings` key. Header sticky at every scroll position; transparent over the Hero until `scrollY > 24`, then solid `ink` + divider; `scroll-padding-top`/`scroll-margin-top` track the current header height; condensing must not shift layout. With JS: smooth scroll (instant under `prefers-reduced-motion`), focus to the section `<h2 tabindex="-1">`, fragment via `history.replaceState` requested through `core/layers`, scroll-spy sets `aria-current="location"` with the copper underline. `transition` is pure; effects come only from the closed union and run only in `core/effects`. Hero `<h1 id="inicio-title">` gains `tabindex="-1"` so the logo link can focus it. Preserve CSP, es-MX, SSG, hydration, Pages base path, single `<h1>`.

**Decisions (agent, recorded):** Without JS the header stays solid `ink` (transparent-at-top is a post-hydration enhancement), so it is never unreadable over light sections. Between 768 and 1023 no section links show until Story 1.9's menu. Hero primary/secondary CTAs use the same navigation behavior as header links.

**Never:** Menu button, mobile menu, `inert`, focus trap (Story 1.9); composer or overlay opening (Epic 3), so `LayerEffect` stays un-executed; `history.pushState`; `replaceState`/`popstate` outside `core/layers`; a header link or CTA to a section not in `visibleSections`; hand-edit generated `_tokens.scss`/`design-tokens.json`; commit, branch, push, or deploy without approval.

## I/O & Edge-Case Matrix

| Scenario                    | Input / State                                       | Expected Output / Behavior                                                                                                                                                                     | Error Handling                     |
| --------------------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| Prerender                   | Default content, no JS                              | Skip link first focusable; header logo `href="#inicio"` named "kVA Instalaciones"; only `Contacto` link and `Cotiza tu proyecto` CTA (`#contacto`); `<main id="main" tabindex="-1">`; one `h1` | N/A                                |
| Link activation             | JS, visible `contacto`, no modifier key             | `preventDefault`; scroll smooth, focus `contacto-title`, `replaceState('#contacto')` once                                                                                                      | Target heading missing: no effects |
| Reduced motion              | `prefers-reduced-motion: reduce`                    | Scroll is instant; rest unchanged                                                                                                                                                              | N/A                                |
| Ctrl/Cmd/Shift/middle click | Modified activation                                 | Native behavior, no model event                                                                                                                                                                | N/A                                |
| Unsupported event           | Section not visible, or duplicate current-state spy | `transition` returns `null`; adapter applies no effects                                                                                                                                        | N/A                                |
| Scroll-spy                  | Section crosses the header line                     | `aria-current="location"` on exactly one link, none while in Hero                                                                                                                              | N/A                                |
| Skip link                   | Tab on load, activate                               | Visible at top-left, focus moves to `main#main`                                                                                                                                                | N/A                                |
| Condense                    | `scrollY` 24 → 25 and back                          | Transparent ↔ solid `ink` + divider; `scroll-padding-top` follows                                                                                                                              | N/A                                |

</frozen-after-approval>

## Code Map

- `specs/002-epic-1-page-shell/{spec.md,plan.md,tasks.md,data-model.md,contracts/}` -- US8 is "Drafted"; tasks end at T055. Add US8 plan/tasks (T056+) and `contracts/section-navigation.md`; FR-019.
- `src/app/behaviors/{behavior-model.ts,copy-address.behavior.ts,copy-address.behavior.spec.ts}` -- pattern to mirror: `BehaviorModel<State,Event>`, pure `transition` returning `{state,effects}|null`, table-driven spec + adapter interaction tests. New `section-navigation.behavior.ts` + spec (acceptance `1.8-AC-03/04/05`); events: `activate-link`, `scroll-spy`, `skip-to-main`.
- `src/app/core/effects/effects.ts` -- union already has `FocusEffect`, `NavigateEffect`, `ScrollEffect`; add `focus`/`scroll`/`navigate` executors to `EffectRunner` (navigate delegates to `LayerController`). `copy`/`announce` untouched. Extend `effects.spec.ts`.
- `src/app/core/layers/{layers.ts,layers.spec.ts}` (new) -- `LayerController`: serialized `replaceFragment`, single `popstate` listener (browser only), sole `history` user. Add a source guard test that `replaceState|pushState|popstate` appear nowhere else under `src/app`.
- `src/app/features/header/{header.ts,header.html,header.scss,header.spec.ts}`, `skip-link.ts` (new) -- adapter: `IntersectionObserver` scroll-spy and a `scrollY` threshold listener installed in `afterNextRender`; links from `visibleSections` mapped to `navServices|navProjects|navAbout|navTrust|navContact`; section DOM id `inicio` for `hero`, else the section id; heading id `<dom-id>-title`. Mirror `features/contact/contact.ts` for `afterNextRender`/`DestroyRef` listener cleanup.
- `src/app/features/hero/{hero.html,hero.spec.ts}` -- `tabindex="-1"` on the h1; CTAs use the navigation behavior. Contact/Privacy `<h2 id="*-title" tabindex="-1">` already comply.
- `src/app/app.{ts,html,scss,spec.ts}` -- replace `.site-header` placeholder with `<app-skip-link />` then `<app-header />`; `<main id="main" tabindex="-1">`; update tests.
- `src/styles.scss`, `src/styles/styles.spec.ts` -- `--kva-shell-header-offset` already feeds `html { scroll-padding-top }` and `h2[tabindex='-1']`; add condensed offset and z-index/header shell properties. Header tokens exist (`--kva-component-header-*`, `--kva-component-nav-link-*`, `--kva-spacing-header-*`, `--kva-spacing-logo-header[-lg]`); logos `public/media/logo/kva-logo-white-{32,40,64,80}.png`.
- `content/ui-strings.md`, `src/app/core/content/ui-strings.content.ts` (+ spec) -- add the wordmark key ("Instalaciones"); nav, skip, logo-link and CTA strings already exist.
- `src/app/features/hero/hero.scss` -- top padding so Hero content clears the overlaying header.
- `scripts/verify-static-build.mjs`, `scripts/content-checks.mjs`, `src/app/core/content/template-content.spec.ts` -- assert prerendered skip link, header, logo link, `#contacto` CTA, no `#servicios` link, `main#main[tabindex]`, one `h1`; add rejecting fixtures.
- Do not change: `_tokens.scss`, `design-tokens.json`, CSP, `site.heading`, Footer `#aviso` link.

## Tasks & Acceptance

**Execution:**

- [x] `specs/002-epic-1-page-shell/*` -- clarify and plan US8, contract, tasks, AC traceability before Act
- [x] `behaviors/section-navigation.behavior.ts` + spec -- tests first; table-driven supported/unsupported results, closed effects
- [x] `core/layers/*`, `core/effects/effects.ts` + specs -- tests first; serialized `replaceState`, `popstate` owner, focus/scroll/navigate executors, history-ownership guard
- [x] `content/ui-strings.md`, `ui-strings.content.ts` + spec -- wordmark key
- [x] `features/header/*`, skip link, Hero tweaks, `app.*`, `styles.scss` -- tests first; header, condense, scroll-spy, skip link, offsets, no-JS state
- [x] `scripts/*`, `template-content.spec.ts` -- extend static verifier and fixtures
- [x] This spec, `specs/002-epic-1-page-shell/`, `sprint-status.yaml` -- full gates, browser checks at 360×640/320/768/1024/1440 with keyboard flow and no-JS, review

**Acceptance Criteria:**

- Given the page shell, when it renders, then 1.8-AC-01 holds: logo, wordmark ≥ 768, links ≥ 1024 only for visible sections, and the CTA to `#contacto`.
- Given any scroll position, when scrolling, then the header stays sticky, condenses past 24 px, and `scroll-padding-top` follows its height (1.8-AC-02).
- Given the behavior model, when its table-driven and interaction tests run, then `transition` results and single effect application match 1.8-AC-03.
- Given JS, when a link is activated, then scroll, focus on the section heading, and `replaceState` via `core/layers` occur and `aria-current="location"` marks the current link (1.8-AC-04).
- Given page load, when Tab is pressed, then the skip link is first, visible, and focuses `main#main` (1.8-AC-05).

## Implementation Notes

- Added `section-navigation` behavior + `SectionNavigation` adapter (`core/navigation`), `LayerController` (`core/layers`, sole `replaceState`/`popstate` owner), `focus`/`scroll`/`navigate` executors in `EffectRunner`, `Header`/`SkipLink`, `headerLogo` site content and a `headerWordmark` UI string; Hero CTAs and h1 `tabindex` wired.
- Click handling is delegated via `afterNextRender` listeners on `[data-section-target]`/`[data-skip-main]`: template `(click)` made Angular inline an event-replay `<script>`, which CSP forbids (`verify:static` caught it).
- Navigation pre-sets `<html data-kva-header="condensed">` for non-Hero targets so the scroll offset and scroll-spy line match the header's final height; without it the page landed 24 px low and the Contacto link was not marked current. This DOM hint sits outside the effect union.
- `hero.scss` stayed within its 4 kB budget by moving the top padding to `--kva-hero-pt` in `styles.scss`.

## Spec Change Log

## Review Triage Log

| ID  | Verdict | Evidence / Disposition                                                                                                                                                                                           |
| --- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1  | medium  | `skipToMain` ignored modifier/middle clicks, contradicting the matrix. Patched with a shared `isPlainClick`; test added.                                                                                         |
| R2  | medium  | Logo (`inicio`) activation and "no condensed offset for Hero" were untested (vacuous). Patched: adapter test with `h1#inicio-title`.                                                                             |
| R3  | low     | Condense transition untested for observer re-creation. Patched in `header.spec.ts`.                                                                                                                              |
| R4  | low     | Empty `<nav>` landmark below 1024. Patched: `display` moved to `.header-nav`.                                                                                                                                    |
| R5  | low     | `tasks.md` T061 globs mangled to `_`; `data-model.md` omitted new shell properties. Patched.                                                                                                                     |
| R6  | low     | Pre-set condensed attribute could remain if the scroll never passes 24 px. Reject: needs a target within 24 px of the top; offset error is under 16 px under a transparent header.                               |
| R7  | low     | `replaceState` may throw (throttling/sandbox). Reject: unreachable on this site; a guard would hide real faults.                                                                                                 |
| R8  | low     | Logo activation stores `current='inicio'` while spy uses `null`. Reject: no link matches either; the next spy event normalises it.                                                                               |
| R9  | low     | Resize rebuilds the observer unthrottled; short-viewport band; fragment pattern vs `nonBlank`; focus on tabindex-less heading. Reject: cosmetic, no reachable harm (all section headings carry `tabindex="-1"`). |
| R10 | false   | JSONL log written by the behavior spec is the established 1.5/1.6 pattern under the git-ignored `.agents/workspace/`.                                                                                            |
| R11 | false   | Hero `padding`/`:is()`/`box-sizing` edits: inline padding was already zero, `box-sizing` redundant without padding; needed to meet the budget.                                                                   |
| R12 | low     | Adapter writes `<html>` attribute outside the effect union. Accepted and recorded in Implementation Notes.                                                                                                       |
| R13 | medium  | Breakpoint visibility and scroll-spy band geometry asserted via source text only. Deferred; browser matrix run manually.                                                                                         |
| R14 | low     | Forced-colors indicator, h1 focus ring, duplicate fixture messages, `headerLogo` duplicating `contactLogo`. Reject/deferred as speculative.                                                                      |

## Design Notes

Model sketch: `activate-link {target, visible, reducedMotion}` → `[scroll(target,instant), focus(`${target}-title`), navigate('#'+target, replace)]`, state `current=target`; `scroll-spy {current}` → state only, `null` when unchanged; `skip-to-main` → `[focus('main')]`. The adapter applies a non-null result exactly once and nothing for `null`.

## Verification

**Commands:**

- `npx prettier --check <touched files>` -- expected: clean
- `npx ng test --watch=false` -- expected: all tests pass
- `npm run tokens:check && npm run build:pages && npm run verify:static` -- expected: pass; record bundle delta from 301.51 kB raw

**Execution evidence (2026-11-03):**

- 472 tests across 25 files pass; formatting, `tokens:check`, `build:pages` (no budget warning) and `verify:static` pass. Initial bundle 316.00 kB raw (79.44 kB transfer), +14.49 kB from Story 1.7.
- Pages preview at 1440×900, 768, 360×640, 320: zero overflow, no console errors or failed requests; header transparent at top (65/81 px) then solid `ink` (57 px) with `scroll-padding-top` 96→72; wordmark ≥ 768, links ≥ 1024, "Cotiza" < 768; Tab → skip link first and visible, Enter focuses `main`; Contacto link and CTA scroll, focus `contacto-title`, set `#contacto` without extra history entries and mark `aria-current`; logo returns to `#inicio` with the h1 focused; Hero CTA works at 360. No-JS covered by `verify:static` prerender checks; no separate no-JS session. Preview server stopped.

**Manual checks (planned):**

- Dev (`http://localhost:4200/`) and Pages preview (`http://localhost:4300/octo-robot-kva/`) at 360×640, 320, 768, 1024, 1440, plus no-JS: Tab order, skip link, header condense, scroll-spy, link focus on heading, URL fragment without history growth, no overflow, one `h1`, no CSP/hydration errors. Stop servers afterward.
