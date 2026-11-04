# US9 Mobile Menu Contract

The approved Story 1.9 spec controls this contract (FR-020; BMAD FR1, UX-DR10/30, AD-5, AD-7;
acceptance `1.9-AC-01`..`1.9-AC-06`).

## Behavior model (`src/app/behaviors/mobile-menu.behavior.ts`)

`BehaviorModel<MobileMenuState, MobileMenuEvent>`, id `mobile-menu`, actor Visitor, acceptance
`['1.9-AC-02', '1.9-AC-03', '1.9-AC-04', '1.9-AC-05']`.

State `{ open: boolean }`.

| State  | Event                             | Result                                                                              |
| ------ | --------------------------------- | ----------------------------------------------------------------------------------- |
| closed | `open`, `toggle`                  | `{ open: true }`, `[layer open mobile-menu]`                                        |
| open   | `toggle`, `escape`                | `{ open: false }`, `[layer close mobile-menu, focus menu-toggle]`                   |
| open   | `close` (wide viewport)           | `{ open: false }`, `[layer close mobile-menu]`                                      |
| open   | `back`                            | `{ open: false }`, `[focus menu-toggle]` (Back already consumed the entry)          |
| open   | `choose-link { target, visible }` | `{ open: false }`, `[layer close mobile-menu]`; navigation then focuses the heading |

Any other pair returns `null`: `open` while open, `close`/`escape`/`back`/`choose-link` while
closed, `choose-link` with `visible !== true` or a blank/non-string `target`, unknown event,
missing/malformed state. `transition` is pure.

## Adapter (`src/app/core/navigation/mobile-menu.ts`)

Root-provided `MobileMenu` owns the state signal, applies a non-null result exactly once (state,
then effects in order through `EffectRunner`) and nothing for `null`. `listen(host)` registers
delegated listeners (never template `(click)`): toggle click (`[data-menu-toggle]`), plain click on
a `[data-section-target]` link (never prevents default; section navigation continues) and Esc on
the document. It subscribes to `LayerController.onBack` for the `back` event.

## Layers (`src/app/core/layers/layers.ts`)

`open(overlay)`: one overlay at a time; sets `active`, `inert` on `main`/`footer` and
`<html data-kva-layer>`, then queues one `pushState` (`{ kvaLayer }`). `close(overlay)`: releases
`inert`, scroll lock and `active` synchronously, then queues a guarded `history.back()` that only
runs when the layer's entry is still current and completes on `popstate` (500 ms fallback). A
browser Back releases the layer and notifies `onBack` handlers. `replaceFragment` queues behind
any pending close, so a link choice cannot be undone by the traversal. `pushState`,
`history.back` and `popstate` appear only in this file (guard test).

## Header

One `<nav id="menu-movil" aria-label="Secciones">` holds the links and a repeated CTA
(`.header-cta-sheet`). Below 1024 px with JavaScript it is the full-height `ink` sheet
(`mobile-menu` tokens) shown only while open; without JavaScript it is a wrapped row and the
"Menú" button (`id="menu-toggle"`, constant `aria-label`, `aria-controls="menu-movil"`,
`aria-expanded` from state, `hidden` until `enhanced`) is hidden. The CDK focus trap covers the
whole `<header>` while open; a resize to >= 1024 px (`--kva-header-menu-button-display: none`)
closes the menu.

## Verification

AC01/AC06: header spec + prerender. AC02: model and adapter specs. AC03/AC04: layers, effects and
header specs + browser. AC05: adapter spec + browser (heading focus, fragment, history length).
