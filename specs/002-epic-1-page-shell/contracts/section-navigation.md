# US8 Section Navigation Contract

The approved Story 1.8 spec controls this contract (FR-019; BMAD FR1-FR3, UX-DR8/9/11,
AD-5, AD-7; acceptance `1.8-AC-01`..`1.8-AC-05`).

## Behavior model (`src/app/behaviors/section-navigation.behavior.ts`)

`BehaviorModel<SectionNavigationState, SectionNavigationEvent>`, id `section-navigation`,
actor Visitor, acceptance `['1.8-AC-03', '1.8-AC-04', '1.8-AC-05']`.

State `{ current: string | null }`: the DOM id of the section under the header line, `null`
while in the Hero or when no section applies.

| Event                                              | Result                                                                                                                                              |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `activate-link { target, visible, reducedMotion }` | `current = target`; effects `scroll(target, instant = reducedMotion)`, `focus(target + '-title', preventScroll)`, `navigate('#' + target, replace)` |
| `scroll-spy { current }`                           | `current` updated, no effects; `null` when `current` equals the state                                                                               |
| `skip-to-main`                                     | state unchanged; effects `[focus('main')]`                                                                                                          |

Any other pair returns `null`: `visible !== true`, blank/non-string `target`, non-boolean
`reducedMotion`, duplicate `scroll-spy`, unknown event, missing state. `transition` is pure.

## Adapter (`src/app/core/navigation/section-navigation.ts`)

Root-provided `SectionNavigation` owns the state signal, applies a non-null result exactly once
(state, then effects in order through `EffectRunner`) and applies nothing for `null`. Header
links, the logo link, Hero CTAs and the skip link call it. A modified click (Ctrl/Cmd/Shift/Alt,
non-primary button) or a missing target heading skips the model and leaves the anchor native.
`sectionDomId('hero')` is `inicio`; other sections keep their id; headings are `<dom-id>-title`.

## Effects and layers

`EffectRunner` gains `focus` (optional `preventScroll`), `scroll` (`scrollIntoView`, `auto` when instant
else `smooth`) and `navigate` (delegates to `LayerController.replaceFragment`; `replace: false`
is rejected, so `pushState` never exists). `LayerEffect` stays un-executed.

`LayerController` (`src/app/core/layers/layers.ts`) is the only file under `src/app` that
mentions `replaceState`, `pushState` or `popstate` (guard test). It serializes history
operations in a FIFO queue, validates fragments (`#` + letter + `[\w-]*`), keeps one browser-only
`popstate` listener updating its `fragment` signal and removes it on destroy.

## Header (`features/header`)

`app-header` is a zero-height sticky host (`z-index` above content) with an absolutely
positioned bar: white logo link `href="#inicio"` (`aria-label` "kVA Instalaciones", `alt=""`,
40/80 px derivatives shown at 32 px, 40 px >= 1024), "Instalaciones" wordmark (>= 768), links
(>= 1024) in order Servicios, Proyectos, Nosotros, Confianza, Contacto only for entries in
`visibleSections`, and CTA `href="#contacto"` "Cotiza tu proyecto" (>= 768) / "Cotiza" (< 768).
Shell properties in `styles.scss` switch visibility at 768/1024. Without JavaScript the bar is
solid `ink`; after `afterNextRender` it is transparent until `scrollY > 24`, then solid `ink` with
a divider and `<html data-kva-header="condensed">` sets `--kva-shell-header-offset` to the
condensed height. An `IntersectionObserver` band under the header drives scroll-spy;
`aria-current="location"` marks one link with the copper underline. `app-skip-link` precedes
the header and focuses `<main id="main" tabindex="-1">`.

## Static output

`verify-static-build.mjs` asserts the skip link first, header logo link `#inicio` named "kVA
Instalaciones", the `#contacto` CTA, no `#servicios` link, `main#main[tabindex]` and one `h1`.

## Verification

AC01: header spec + prerender. AC02: condense/offset spec + browser. AC03: behavior and
adapter specs. AC04: effects/layers specs + browser. AC05: skip-link spec + keyboard check.
