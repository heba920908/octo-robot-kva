---
title: 'Story 2.2: Collapsible Sub-Service Lists on Mobile'
type: 'feature'
created: '2026-11-04'
status: 'in-progress'
route: 'dispatch'
baseline_commit: 'e294294caf4812a30bd843793c52685727e9a78e'
story_key: '2-2-collapsible-sub-service-lists-on-mobile'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
  - '{project-root}/specs/003-epic-2-services-catalogue/spec.md'
  - '{project-root}/specs/003-epic-2-services-catalogue/contracts/service-card-disclosure.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** On a phone, a Service card with 9 Sub-services is a long scroll before the next card, so a Visitor cannot scan all four Services quickly.

**Approach:** Add a pure `service-card-disclosure` behavior model with table-driven tests, then (once Story 2.1's card exists) a card-level adapter and toggle: below 768 px with JavaScript, a card with more than 4 Sub-services shows the first 4 plus a "Ver los {n} servicios" / "Ver menos" `button-text` toggle. Prerendered HTML, ≥ 768 px and no-JS keep the full list and render no toggle.

## Boundaries & Constraints

**Always:** Follow Story 2.2 ACs (2.2-AC-01..04), UX-DR13, AD-7; contract `specs/003-epic-2-services-catalogue/contracts/service-card-disclosure.md`. Model in `src/app/behaviors/service-card-disclosure.behavior.ts` conforming to `BehaviorModel`, id `service-card-disclosure`, acceptance `['2.2-AC-01','2.2-AC-02','2.2-AC-03']`; its table-driven tests merge before the adapter/UI (Act gate). State `{ expanded: boolean }` per card; events `toggle`, `expand`, `collapse`; expand and collapse each return `{ expanded }` and `[focus <toggleId>]` (focus stays on the toggle; no announce effect, because the label change and `aria-expanded` convey state), unsupported pairs and malformed input return `null`. Adapter applies a non-null result once (state, then effects via `EffectRunner`) and nothing for `null`. Toggle: `button-text` with chevron, constant-per-state label from `servicesExpand`/`servicesCollapse` via `ContentFacade.format`, `aria-expanded`, `aria-controls` the list id, `hidden` until `enhanced`. Collapsing/hiding is applied only after hydration (`enhanced` + `matchMedia('(max-width: 767.98px)')` read inside `afterNextRender`, listener cleaned up). Threshold 4 is a named constant; cards with ≤ 4 Sub-services never show a toggle. Delegated/`addEventListener` handlers, no `(click)` template bindings. Resizing to ≥ 768 shows the full list and hides the toggle; back below 768 restores the card's last state. Preserve Story 2.1 behavior, CSP, SSG, hydration, a11y (target ≥ 24 px, focus ring), component style budget.

**Never:** Hiding Sub-services in prerendered HTML or with `display:none` before hydration; composer/pre-fill logic (Epic 3); `pushState`/`history`; new dependencies; edits to Story 2.1 files beyond wiring the toggle into the Services component; commit/push by the implementer.

## I/O & Edge-Case Matrix

| Scenario          | Input / State                                 | Expected Output / Behavior                                    | Error Handling                     |
| ----------------- | --------------------------------------------- | ------------------------------------------------------------- | ---------------------------------- |
| Expand            | `{expanded:false}`, `toggle`/`expand`         | `{expanded:true}`, `[focus toggle]`                           | `expand` while expanded: `null`    |
| Collapse          | `{expanded:true}`, `toggle`/`collapse`        | `{expanded:false}`, `[focus toggle]`                          | `collapse` while collapsed: `null` |
| Mobile, long list | < 768, JS, 9 items                            | First 4 + toggle "Ver los 9 servicios", `aria-expanded=false` | N/A                                |
| Activate          | Collapsed, activate toggle                    | Full list, "Ver menos", `aria-expanded=true`, focus on toggle | N/A                                |
| Short list        | < 768, JS, ≤ 4 items                          | Full list, no toggle                                          | N/A                                |
| Wide / no JS      | ≥ 768 or no JS                                | Full list, no toggle rendered or visible                      | N/A                                |
| Malformed         | unknown event, missing state, blank toggle id | `null`                                                        | No effects                         |

</frozen-after-approval>

## Code Map

- `src/app/behaviors/behavior-model.ts`, `copy-address.behavior.ts` + `.spec.ts` -- pattern to mirror (discriminated State/Event, `null` for unsupported pairs, table-driven `it.each`, JSONL flow log to `.agents/workspace/bmad/<date>/2-2/` per bmad-protocols).
- `src/app/core/effects/effects.ts` -- closed union; use the existing `focus` effect.
- `src/app/features/contact/contact.ts` -- component-owned adapter pattern (`enhanced` signal via `afterNextRender`, `dispatch`, `EffectRunner`, `addEventListener`).
- `src/app/features/services/services.{ts,html,scss,spec.ts}` -- created by Story 2.1; wire per-card disclosure here (only in phase B).
- `src/app/core/content/ui-strings.content.ts` -- `servicesExpand` (`{n}`), `servicesCollapse` exist; `facade.format(key, {n})`. `core/icons/icons.ts` -- `chevron-down` icon.
- No existing `matchMedia` usage in repo: introduce it SSR-safely, inside `afterNextRender`.

## Tasks & Acceptance

**Execution:**

- [x] `behaviors/service-card-disclosure.behavior.ts` + spec -- tests first; table-driven expand/collapse/focus effect/`null` cases (2.2-AC-01)
- [ ] `features/services/*` (after Story 2.1 is merged) -- tests first; per-card adapter, viewport read, toggle, chevron, styles (2.2-AC-02..04)
- [ ] `scripts/verify-static-build.mjs`, `template-content.spec.ts` -- assert prerendered HTML has every Sub-service and no toggle (2.2-AC-04)
- [ ] This spec, `specs/003-epic-2-services-catalogue/*` ticks for T206-T208 only -- full gates, browser matrix, review

**Acceptance Criteria:**

- Given the model, when its table-driven tests run, then expand/collapse transitions and focus effects are covered and the adapter applies each non-null result once and `null` none (2.2-AC-01).
- Given < 768 px, JS, and a Service with > 4 Sub-services, when the card renders, then the first 4 show plus the "Ver los {n} servicios" toggle with chevron and `aria-expanded="false"` (2.2-AC-02).
- Given the collapsed list, when the toggle is activated, then the full list shows, the label is "Ver menos", `aria-expanded="true"` and focus stays on the toggle (2.2-AC-03).
- Given ≥ 768 px or no JS, when the card renders, then the full list shows and no toggle is rendered or visible (2.2-AC-04).

## Implementation Notes

- Phase A done (task 1): `src/app/behaviors/service-card-disclosure.behavior.ts` and its table-driven spec. The model returns `null` for a blank/non-string `toggleId`, a missing or non-boolean `expanded`, a missing event, unknown event types, `expand` while expanded and `collapse` while collapsed. Effects are `[focus toggleId]` only. The spec writes a JSONL flow log to `.agents/workspace/bmad/2026-11-04/2-2/`.
- Phase B is pending (tasks 2-4): the adapter, toggle UI, static checks and the `specs/003-epic-2-services-catalogue/tasks.md` ticks wait for Story 2.1 to merge. The "adapter applies each non-null result once" half of 2.2-AC-01 is covered there.

## Spec Change Log

## Review Triage Log

## Design Notes

Two phases so the story can run beside 2.1: phase A (model + tests) needs only `behaviors/`; phase B (UI wiring) rebases onto epic-2 after Story 2.1 merges. Collapsing is a render concern applied after hydration (`@for` over `visibleSubServices()`), never CSS-hiding prerendered items, so served HTML keeps every Sub-service.

## Verification

**Commands:**

- `npx prettier --check src scripts content specs` -- expected: clean
- `npx ng test --watch=false` -- expected: all tests pass
- `npm run tokens:check && npm run build:pages && npm run verify:static` -- expected: pass; record bundle delta

**Manual checks:**

- Pages preview at 360, 767, 768, 1440 and no-JS: toggle only on > 4-item cards below 768; keyboard Enter/Space; focus stays on toggle; resize across 768 both ways; no console/CSP/hydration errors. Use a free port (not 4300); stop servers afterward.
