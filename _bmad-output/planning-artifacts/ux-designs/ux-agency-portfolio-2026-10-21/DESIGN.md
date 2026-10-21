---
title: "DESIGN: kVA Instalaciones Landing Page"
status: final
created: 2026-10-21
updated: 2026-10-21
sources:
  - ../../prds/prd-agency-portfolio-2026-10-19/prd.md
  - ../../prds/prd-agency-portfolio-2026-10-19/addendum.md
  - ../../briefs/brief-agency-portfolio-2026-10-19/brief.md
  - ../../../../.specify/memory/constitution.md
  - imports/brochure-text.md
version: alpha
name: kVA Instalaciones
description: >-
  Single-page es-MX promotional site for an enterprise electrical contractor. Visual language
  translated from the kVA printed brochure 2025: warm near-black, darkened technical photos,
  thin uppercase rounded titles, hairline rules that turn a corner, sharp edges.
colors:
  {ink: '#1C1714', ink-2: '#2A2522', paper: '#FFFFFF', paper-2: '#F4F2F0', muted: '#6B635D',
    muted-on-dark: '#A39B94', border: '#6B635D', line: '#D9D4CF', line-on-dark: '#4A433E',
    accent: '#C8875A', accent-hover: '#D9A07A', on-accent: '#1C1714',
    accent-strong: '#8A5430', accent-strong-hover: '#6F4326', on-accent-strong: '#FFFFFF',
    focus: '#D9A07A', focus-on-light: '#8A5430', danger: '#B42318', success: '#1E7A46',
    overlay: '#1C1714C7', scrim: '#1C171499', clear: '#1C171400'}
typography:
  display: {fontFamily: Quicksand, fontSize: 32px, fontWeight: '300', lineHeight: '1.1',
    letterSpacing: 0.04em}
  display-lg: {fontFamily: Quicksand, fontSize: 60px, fontWeight: '300', lineHeight: '1.05',
    letterSpacing: 0.04em}
  h1: {fontFamily: Quicksand, fontSize: 28px, fontWeight: '400', lineHeight: '1.15',
    letterSpacing: 0.06em}
  h1-lg: {fontFamily: Quicksand, fontSize: 44px, fontWeight: '300', lineHeight: '1.1',
    letterSpacing: 0.06em}
  h2: {fontFamily: Quicksand, fontSize: 20px, fontWeight: '400', lineHeight: '1.25',
    letterSpacing: 0.06em}
  h2-lg: {fontFamily: Quicksand, fontSize: 24px, fontWeight: '400', lineHeight: '1.25',
    letterSpacing: 0.06em}
  h3: {fontFamily: Quicksand, fontSize: 18px, fontWeight: '400', lineHeight: '1.3',
    letterSpacing: 0.04em}
  h3-lg: {fontFamily: Quicksand, fontSize: 20px, fontWeight: '400', lineHeight: '1.3',
    letterSpacing: 0.04em}
  stat: {fontFamily: Quicksand, fontSize: 36px, fontWeight: '300', lineHeight: '1.1',
    letterSpacing: 0.02em}
  stat-lg: {fontFamily: Quicksand, fontSize: 48px, fontWeight: '300', lineHeight: '1.1',
    letterSpacing: 0.02em}
  lead: {fontFamily: Outfit, fontSize: 20px, fontWeight: '400', lineHeight: '1.5'}
  lead-lg: {fontFamily: Outfit, fontSize: 22px, fontWeight: '400', lineHeight: '1.5'}
  body: {fontFamily: Outfit, fontSize: 16px, fontWeight: '400', lineHeight: '1.6'}
  body-lg: {fontFamily: Outfit, fontSize: 18px, fontWeight: '400', lineHeight: '1.6'}
  small: {fontFamily: Outfit, fontSize: 14px, fontWeight: '400', lineHeight: '1.5'}
  label: {fontFamily: Outfit, fontSize: 14px, fontWeight: '600', lineHeight: '1.2',
    letterSpacing: 0.08em}
  field-label: {fontFamily: Outfit, fontSize: 15px, fontWeight: '500', lineHeight: '1.4'}
  overline: {fontFamily: Quicksand, fontSize: 14px, fontWeight: '500', lineHeight: '1.3',
    letterSpacing: 0.18em}
rounded:
  none: 0px
  DEFAULT: 0px
spacing:
  {'0': 0px, '1': 4px, '2': 8px, '3': 12px, '4': 16px, '5': 20px, '6': 24px, '8': 32px,
    '10': 40px, '12': 48px, '16': 64px, '20': 80px, '24': 96px, '32': 128px,
    margin-mobile: 20px, margin-tablet: 32px, margin-desktop: 48px, gutter: 24px,
    content-max: 1200px, section-y: 64px, section-y-lg: 112px, header-h: 64px,
    header-h-lg: 80px, header-h-condensed: 56px, header-threshold: 24px, target-min: 44px,
    rule-hairline: 1px, rule-medium: 2px, rule-bar: 4px, bracket-arm: 48px,
    frame-offset: 24px, panel-w: 440px, dialog-w: 1080px, notice-w: 720px, hero-max: 880px,
    photo-band: 240px, thumb: 64px, menu-row: 56px, icon: 24px, logo-footer: 24px,
    logo-header: 32px, logo-header-lg: 40px, logo-hero: 200px}
# Token export (constitution IV). DESIGN.md is the design source; src/styles/_tokens.scss and
# design-tokens.json are generated from it and never hand-edited. Name map: <group>.<key> →
# --kva-<group>-<key> (scss) and <group>.<key> (json), e.g. colors.ink → --kva-color-ink /
# color.ink. A `-lg` typography token is the ≥ 1024 value of the same role (one CSS custom
# property, switched by media query). Component `height` exports as min-height. On stroke-only
# tokens (focus-ring*, *-outline, divider*, nav-link-current, carousel-thumb-current)
# `backgroundColor` is the stroke color. elevation, motion, and breakpoints are extension
# keys (not in the DESIGN.md schema), exported as --kva-elevation-*, --kva-motion-*, --kva-bp-*.
elevation: {flat: none, overlay: '0 24px 48px rgba(28, 23, 20, 0.32)'}
motion: {duration-fast: 150ms, duration-base: 250ms, duration-slow: 400ms,
  easing-standard: 'cubic-bezier(0.2, 0, 0, 1)', easing-exit: 'cubic-bezier(0.4, 0, 1, 1)',
  reveal-distance: 12px, hover-scale: '1.03', press-offset: 1px, copy-status-hold: 2500ms}
breakpoints: {tablet: 768px, desktop: 1024px, wide: 1440px}
components:
  header: {backgroundColor: '{colors.clear}', textColor: '{colors.paper}',
    height: '{spacing.header-h}'}
  header-lg: {height: '{spacing.header-h-lg}'}
  header-condensed: {backgroundColor: '{colors.ink}', height: '{spacing.header-h-condensed}'}
  nav-link: {textColor: '{colors.paper}', typography: '{typography.label}'}
  nav-link-current: {backgroundColor: '{colors.focus}', height: '{spacing.rule-medium}'}
  mobile-menu: {backgroundColor: '{colors.ink}', textColor: '{colors.paper}',
    typography: '{typography.h2}', height: '{spacing.menu-row}'}
  hero: {backgroundColor: '{colors.overlay}', textColor: '{colors.paper}'}
  title-band: {backgroundColor: '{colors.overlay}', textColor: '{colors.paper}',
    height: '{spacing.photo-band}'}
  button-primary: {backgroundColor: '{colors.accent}', textColor: '{colors.on-accent}',
    typography: '{typography.label}', rounded: '{rounded.none}', height: '{spacing.12}',
    padding: '{spacing.6}'}
  button-primary-hover: {backgroundColor: '{colors.accent-hover}'}
  button-primary-on-light: {backgroundColor: '{colors.accent-strong}',
    textColor: '{colors.on-accent-strong}', typography: '{typography.label}',
    height: '{spacing.12}'}
  button-primary-on-light-hover: {backgroundColor: '{colors.accent-strong-hover}'}
  button-secondary: {backgroundColor: '{colors.paper}', textColor: '{colors.ink}',
    typography: '{typography.label}', height: '{spacing.12}'}
  button-secondary-outline: {backgroundColor: '{colors.ink}', width: '{spacing.rule-hairline}'}
  button-secondary-hover: {backgroundColor: '{colors.paper-2}'}
  button-ghost-on-dark: {backgroundColor: '{colors.clear}', textColor: '{colors.paper}',
    typography: '{typography.label}', height: '{spacing.12}'}
  button-ghost-on-dark-outline: {backgroundColor: '{colors.paper}',
    width: '{spacing.rule-hairline}'}
  button-ghost-on-dark-hover: {backgroundColor: '{colors.paper}', textColor: '{colors.ink}'}
  button-text: {backgroundColor: '{colors.paper}', textColor: '{colors.accent-strong}',
    typography: '{typography.label}', height: '{spacing.target-min}'}
  button-icon: {backgroundColor: '{colors.paper}', textColor: '{colors.ink}',
    rounded: '{rounded.none}', size: '{spacing.target-min}'}
  button-icon-hover: {backgroundColor: '{colors.paper-2}'}
  button-icon-on-dark: {backgroundColor: '{colors.clear}', textColor: '{colors.paper}',
    size: '{spacing.target-min}'}
  button-icon-on-dark-hover: {backgroundColor: '{colors.ink-2}'}
  focus-ring: {backgroundColor: '{colors.focus}', width: '{spacing.rule-medium}'}
  focus-ring-on-light: {backgroundColor: '{colors.focus-on-light}', width: '{spacing.rule-medium}'}
  focus-ring-inset: {backgroundColor: '{colors.focus-on-light}', width: '{spacing.rule-medium}'}
  service-card: {backgroundColor: '{colors.paper}', textColor: '{colors.ink}',
    padding: '{spacing.8}'}
  service-card-image: {backgroundColor: '{colors.overlay}'}
  filter-chip: {backgroundColor: '{colors.paper-2}', textColor: '{colors.ink}',
    typography: '{typography.label}', height: '{spacing.target-min}', padding: '{spacing.4}'}
  filter-chip-hover: {backgroundColor: '{colors.paper}'}
  filter-chip-active: {backgroundColor: '{colors.accent-strong}',
    textColor: '{colors.on-accent-strong}'}
  filter-count: {textColor: '{colors.muted}', typography: '{typography.small}'}
  project-card: {backgroundColor: '{colors.paper}', textColor: '{colors.ink}'}
  project-card-overline: {textColor: '{colors.muted}', typography: '{typography.overline}'}
  badge-placeholder: {backgroundColor: '{colors.ink}', textColor: '{colors.paper}',
    typography: '{typography.label}', padding: '{spacing.2}'}
  project-detail-view: {backgroundColor: '{colors.paper}', textColor: '{colors.ink}',
    width: '{spacing.dialog-w}'}
  carousel-stage: {backgroundColor: '{colors.ink-2}', textColor: '{colors.paper}'}
  carousel-thumb: {size: '{spacing.thumb}'}
  carousel-thumb-current: {backgroundColor: '{colors.paper}', height: '{spacing.1}'}
  scrim: {backgroundColor: '{colors.scrim}'}
  nosotros-panel: {backgroundColor: '{colors.overlay}', textColor: '{colors.paper}'}
  trust-item: {backgroundColor: '{colors.paper}', textColor: '{colors.ink}',
    typography: '{typography.stat}'}
  client-group: {textColor: '{colors.ink}', typography: '{typography.h3}'}
  contact-section: {backgroundColor: '{colors.overlay}', textColor: '{colors.paper}'}
  contact-composer: {backgroundColor: '{colors.paper}', textColor: '{colors.ink}',
    width: '{spacing.panel-w}', padding: '{spacing.8}'}
  composer-success: {backgroundColor: '{colors.paper}', textColor: '{colors.success}'}
  privacy-notice: {backgroundColor: '{colors.paper}', textColor: '{colors.ink}',
    width: '{spacing.notice-w}'}
  text-field: {backgroundColor: '{colors.paper}', textColor: '{colors.ink}',
    typography: '{typography.body}', height: '{spacing.12}', padding: '{spacing.3}'}
  text-field-outline: {backgroundColor: '{colors.border}', width: '{spacing.rule-hairline}'}
  text-field-error: {backgroundColor: '{colors.paper}', textColor: '{colors.danger}'}
  select: {backgroundColor: '{colors.paper}', textColor: '{colors.ink}',
    typography: '{typography.body}', height: '{spacing.12}', padding: '{spacing.3}'}
  checkbox: {backgroundColor: '{colors.paper}', textColor: '{colors.ink}', size: '{spacing.6}'}
  checkbox-checked: {backgroundColor: '{colors.accent-strong}',
    textColor: '{colors.on-accent-strong}'}
  divider: {backgroundColor: '{colors.line}', height: '{spacing.rule-hairline}'}
  divider-on-dark: {backgroundColor: '{colors.line-on-dark}', height: '{spacing.rule-hairline}'}
  copy-status: {backgroundColor: '{colors.ink-2}', textColor: '{colors.paper}',
    typography: '{typography.small}'}
  copy-status-on-light: {backgroundColor: '{colors.paper}', textColor: '{colors.success}',
    typography: '{typography.small}'}
  footer: {backgroundColor: '{colors.ink}', textColor: '{colors.muted-on-dark}',
    typography: '{typography.small}'}
  footer-link: {textColor: '{colors.paper}', typography: '{typography.small}'}
  skip-link: {backgroundColor: '{colors.accent}', textColor: '{colors.on-accent}'}
---

## Brand & Style

kVA Instalaciones does enterprise electrical work to standard; the page must read as
*engineered*: quiet, exact, evidence-forward. The posture comes from kVA's printed brochure
(2025): a warm near-black world of darkened technical photos, thin uppercase titles in a
rounded geometric face, and hairlines that turn a corner like a line on a blueprint. Dark
photographic title areas alternate with light content pages. Only the logo is rounded; nothing
glows, floats, or uses gradients. Copper is the only color, and it marks only what the Visitor
can *do*: CTAs, focus, current nav, active filter.

References: brochure renders in `imports/brochure-pages/`, linked below where used, plus the
Clientes opener [p06](imports/brochure-pages/p06.png), featured clients
[p07](imports/brochure-pages/p07.png) and [p08](imports/brochure-pages/p08.png), and gallery
collages [p12](imports/brochure-pages/p12.png)–[p17](imports/brochure-pages/p17.png) (bar-heading
source only; a uniform, filterable grid replaces their collage layout). Copy:
[brochure-text.md](imports/brochure-text.md). Logo import [kva-logo.png](imports/kva-logo.png)
(no alpha; superseded below). Precedence on any conflict: EXPERIENCE.md › Foundation.

| Brochure motif | Pages | Web use |
|---|---|---|
| Darkened full-bleed photo, white title | p01, p06, p10, p18 | Hero, Proyectos band, Contacto |
| Split: darkened photo panel \| white content panel | p02–p04 | Nosotros |
| Corner rule: hairline under a title, turning 90° at its end | p02–p05 | Section titles |
| Corner-bracket frame: open two-sided hairline frame | p01–p05 | Hero, Service, Nosotros |
| Bar heading: thick black underline | p11–p17 | Project detail view |
| Typographic client list, grouped | p09 | Clientes (Confianza) |
| Right-aligned contact block, logo top-right | p18 | Contacto |

### Imagery & assets

Paths are under `assets/media/brochure/` unless noted. Photos carrying text sit under
`{colors.overlay}`; project photos are untinted.

| Asset | Use |
|---|---|
| `backgrounds/cover-blueprint-tools.jpg` | Hero (LCP image) |
| `backgrounds/wiring-technician.jpg` | Proyectos title band |
| `backgrounds/electrical-panel-technician.jpg` | Nosotros panel |
| `backgrounds/cable-tray-technician.jpg` | Contacto background |
| `backgrounds/helmet-technician.jpg` | Reserve |
| `projects/*.jpg` (20 photos, 9 Projects) | Project cards, carousel |
| `logo/kva-logo-white.png` | Header, Hero, Proyectos band, Contacto, footer |
| `logo/kva-logo-dark.png` | Reserve (overlays carry no logo) |
| `assets/media/icon.png` | Favicon and touch icon source (FR-3) |
| 1200×630 share image: cover + overlay + white logo | FR-16 [ASSUMPTION] |

Delivery (NFR-1): every image has `srcset` (AVIF/WebP, JPEG fallback) and intrinsic size;
below the fold `loading="lazy" decoding="async"`; the Hero is never lazy. Budgets
[ASSUMPTION]: Hero ≤ 250 KB, card photo ≤ 120 KB at 2×. The share image needs a ≥ 1200px-wide
original; it is never upscaled.

[NOTE FOR UX] Backgrounds are low-resolution (cover 740×556, Nosotros 387×668): fine as
texture under the overlay, soft ≥ 1440. Request originals from kVA. SVG logo still owed.

## Colors

| Token | Hex | Role | Never |
|---|---|---|---|
| `ink` | #1C1714 | Warm near-black: dark surfaces, text on light | Swapped for #000 |
| `ink-2` | #2A2522 | Solid dark panel (carousel stage, copy status on dark) | Text |
| `paper` | #FFFFFF | Light surfaces; all text on dark and on overlays | — |
| `paper-2` | #F4F2F0 | Alternate light surface (Proyectos grid) | Text |
| `muted` / `border` | #6B635D | Secondary text on light; field, chip, checkbox border | On photos |
| `muted-on-dark` | #A39B94 | Secondary text on solid `ink` / `ink-2` | On overlays |
| `accent` | #C8875A | Copper on dark: CTA fill, skip link | Text on light; focus |
| `accent-strong` | #8A5430 | Copper on light: underlined links, CTA, active chip | Dark surfaces |
| `focus` | #D9A07A | Focus ring and current-nav underline on dark and photo | Fills |
| `focus-on-light` | #8A5430 | Focus ring on light | Dark surfaces |
| `overlay` / `scrim` | ink 78% / 60% | Photos carrying text / behind overlays | Flat surfaces |
| `clear` | ink 0% | Transparent fills (top header, ghost, on-dark icon buttons) | Text |
| `danger` | #B42318 | Field error text, border, icon | Dark surfaces |
| `success` | #1E7A46 | Post-submit check, "Copiado" in the composer | Dark surfaces |
| `line` / `line-on-dark` | #D9D4CF / #4A433E | Decorative dividers only | Field borders |

`accent-hover` (#D9A07A) and `accent-strong-hover` (#6F4326) only change CTA fills. `focus`
shares the `accent-hover` hex but is its own token, so focus can be re-themed alone.

| Pair (computed, WCAG 2.2) | Ratio | Use |
|---|---|---|
| `paper` on `ink` / `ink-2` | 17.77 / 15.15 | Text on dark |
| `paper` on photo + `overlay` | ≥ 8.76 worst, ≈ 14 typical | Hero, bands, Nosotros, Contacto |
| `on-accent` on `accent` / `accent-hover` | 5.98 / 7.83 | Primary CTA |
| `focus` on `ink` / `ink-2` / overlay worst | 7.83 / 6.68 / 3.86 | Ring, nav underline (≥ 3) |
| `on-accent-strong` on `accent-strong` / hover | 6.19 / 8.38 | Light CTA, active chip |
| `accent-strong` on `paper` / `paper-2` | 6.19 / 5.55 | Links, focus on light |
| `muted` on `paper` / `paper-2` | 5.89 / 5.27 | Secondary text, field border |
| `muted-on-dark` on `ink` / `ink-2` | 6.49 / 5.54 | Footer, captions on dark |
| `ink` on `paper` / `paper-2` | 17.77 / 15.91 | Body on light |
| `danger` on `paper` / `paper-2` | 6.57 / 5.89 | Errors |
| `success` on `paper` / `paper-2` | 5.35 / 4.79 | Confirmation |

Overlay worst case = overlay over a white photo pixel (#4E4A48), present in all five
backgrounds. Banned (fail): `accent` text or fill on light (2.97 on `paper`); `accent` or
`muted-on-dark` text on overlays (2.95 / 3.20); `accent` as a focus ring (2.95 on overlays);
`accent-strong` on dark (2.87); `success` / `danger` on `ink-2` (2.83 / 2.30).

## Typography

**Quicksand** (titles, overline, stats) stands in for the brochure's All Round Gothic: rounded
strokes like the logo. **Outfit** (body, UI) stands in for Apparat. Both OFL, self-hosted
variable WOFF2, latin subset only (es-MX needs no latin-ext), weight axis 300–600,
`font-display: swap`, metric-matched fallbacks (`size-adjust`) for CLS, one file preloaded
(Quicksand, for the Hero `<h1>`); no font CDN (NFR-4). [ASSUMPTION] lookalikes.

- Quicksand roles and `label` render **uppercase via CSS**, except Project titles (sentence
  case, as the gallery titles in [p11](imports/brochure-pages/p11.png)). Content docs stay
  sentence case.
- Body ≥ 16px. **No weight below 400 under 28px** (300 per the table). The brochure's thin
  body type is not carried to the web.
- Quicksand roles set `overflow-wrap: break-word; hyphens: auto`; `display` < 768 is
  `clamp(26px, 8.5vw, 32px)`, so long uppercase words fit 320px.
- `-lg` tokens apply ≥ `{breakpoints.desktop}` (mobile-first). Body ≤ 72ch.
- Token names are visual levels. HTML: one `<h1>`; `<h2>` per section, dialog, or panel;
  `<h3>` for sub-blocks; nothing deeper.

| Token | < 1024 | ≥ 1024 | Wt | Element → use |
|---|---|---|---|---|
| `display` | 32px | 60px | 300 | `<h1>` Hero headline, the only h1 (FR-4) |
| `h1` | 28px | 44px | 400 / 300 | `<h2>` section titles, incl. the Proyectos band |
| `h2` | 20px | 24px | 400 | `<h3>` Service, Project card, Nosotros block, Clientes |
| `h2` | ″ | ″ | ″ | `<h2>` Project detail view, Contact composer, Privacy notice titles |
| `h3` | 18px | 20px | 400 | `<h3>` post-submit heading; `<p>` client group, contact name |
| `stat` | 36px | 48px | 300 | Trust item figure |
| `lead` | 20px | 22px | 400 | Hero supporting line, section intros |
| `body` | 16px | 18px | 400 | Running text, sub-service lists |
| `small` | 14px | 14px | 400 | Footer, helper text, counters, "Copiado" |
| `label` | 14px | 14px | 600 | Buttons, chips, nav, value names (`<dt>`) |
| `field-label` | 15px | 15px | 500 | Form labels |
| `overline` | 14px | 14px | 500 | Hero overline, card Service, "Esencia corporativa" |

## Layout & Spacing

Visual reference for the section rhythm and the Reference viewport:
[key-landing](mockups/key-landing.html). These tokens win over the mockup on any conflict.

4px base (`{spacing.1}`…`{spacing.32}`). Content column `{spacing.content-max}`, centered;
margins `{spacing.margin-mobile}` / `{spacing.margin-tablet}` / `{spacing.margin-desktop}`;
12 columns with `{spacing.gutter}` ≥ 1024, 4 below. Section padding `{spacing.section-y}` →
`{spacing.section-y-lg}`. Breakpoints [ASSUMPTION]: mobile < 768, tablet
`{breakpoints.tablet}`, desktop `{breakpoints.desktop}`, wide `{breakpoints.wide}`. Reference
viewport 360×640 governs every above-the-fold check.

| # | Section | Surface | Heading |
|---|---|---|---|
| 1 | Hero `#inicio` | Full-bleed photo + `overlay` | `display` paper, centered ≥ 768 |
| 2 | Servicios `#servicios` | `paper` | `h1` ink + corner rule |
| 3 | Proyectos `#proyectos` | `title-band`, then `paper-2` grid | `h1` paper + corner rule |
| 4 | Nosotros `#nosotros` | Split: photo + `overlay` \| `paper` | `h1` paper on photo |
| 5 | Confianza `#confianza` | `paper` | `h1` ink + corner rule |
| 6 | Contacto `#contacto` | Full-bleed photo + `overlay` | `h1` paper + mirrored rule |
| 7 | Footer | `ink` + `divider-on-dark` top rule | — |

The dark/light rhythm follows the brochure ([p10](imports/brochure-pages/p10.png),
[p18](imports/brochure-pages/p18.png)); solid `ink` and a top rule set the footer apart from
Contacto.

- **Split** (Nosotros): 5/12 photo | 7/12 content ≥ 1024. Below, the photo becomes a band of
  min-height `{spacing.photo-band}` above the content, title in normal flow at its bottom
  (grid `align-content: end`), never absolutely positioned. The Proyectos band works the same.
- **Content panels** (Nosotros, Contacto ≥ 1024): measure ≤ 45ch, top offset `{spacing.16}`.
- **Alignment:** left by default, always < 1024 and for running text over 3 lines. ≥ 1024 the
  Contacto block and the right column of Clientes groups right-align
  ([p09](imports/brochure-pages/p09.png), p18).
- **Edge bleed:** corner rules and bar headings start at the viewport (or dialog) edge on the
  title's side; band and split photos are full-bleed. Text stays in the content column.
- **Heights are minimums:** component `height` means `min-height`; labels wrap
  (`white-space: normal`, `text-wrap: balance`); no text container uses `overflow: hidden`;
  dialog and notice bodies scroll. Hero min-height `min(100svh, {spacing.hero-max})`.
- **Not obscured:** `html { scroll-padding-top }` = current header height + `{spacing.4}`,
  updated when the header condenses; anchored headings get the same `scroll-margin-top`.
  Scroll containers with a sticky bar get `scroll-padding-bottom` = bar + `{spacing.4}`.

## Elevation & Depth

Flat; depth is tonal (overlay versus paper), never card shadows. One shadow,
`{elevation.overlay}`, only on the Contact composer, Project detail view, and Privacy notice,
always over `{colors.scrim}`. The Privacy notice stacks above the composer with its own scrim.

**Motion.** `{motion.duration-fast}` hover, chips, copy status; `{motion.duration-base}` panel
slide, dialog fade + scale 0.98 → 1, menu, header condense; `{motion.duration-slow}` scroll
reveals (fade + `{motion.reveal-distance}` rise, once). `{motion.easing-standard}` in,
`{motion.easing-exit}` out. Card photo hover `{motion.hover-scale}`; pressed buttons move
`{motion.press-offset}`; "Copiado" holds `{motion.copy-status-hold}`.
`prefers-reduced-motion: reduce` makes every change instant.

## Shapes

`{rounded.none}` everywhere (buttons, chips, cards, fields, panels, dialogs, images, focus
rings); the logo's strokes are the only curves. Line motifs are monochrome (`ink` on light,
`paper` on dark), `{spacing.rule-hairline}` unless noted, and decorative (`aria-hidden`):

- **Corner rule** — hairline under a section title, from the viewport edge to title width +
  `{spacing.8}`, ending in a `{spacing.6}` arm turning up (┘); mirrored (└) in the
  right-aligned Contacto. Sub-head variant ([p03](imports/brochure-pages/p03.png)): runs right
  of the text; Misión's turns up (┘), Visión's turns down (┐), linking the two.
- **Corner-bracket frame** — two hairline sides meeting at one corner, offset
  `{spacing.frame-offset}` outside the framed block, arms ≥ `{spacing.bracket-arm}`. Fixed
  placement; nothing else is framed:

| Where | Corner (sides drawn) | Shown |
|---|---|---|
| Hero content block | Top-right (top + right) + bottom-left (bottom + left), interlocking | ≥ 768 |
| Service card title | Top-right (top + right) | Always |
| Nosotros photo panel | Bottom-left (bottom + left), around the title | Always |
| Nosotros content panel | Top-right (top + right); right side runs to the panel bottom | ≥ 1024 |

- **Bar heading** — `{spacing.rule-bar}` `ink` bar under the Project detail view title, from
  the dialog edge to 66% of the details column.
- **Icons** — one `{spacing.icon}` line set, 1.5px stroke, square caps: menu, close, arrows,
  copy, check, phone, mail, chat, chevron, error. No filled or multi-color icons.

## Components

Visual references: [key-projects](mockups/key-projects.html) (Project filter, Project card,
Project detail view, carousel) and [key-contact](mockups/key-contact.html) (Contact section,
Contact composer, Privacy notice, post-submit states).

Stroke tokens: `backgroundColor` is the stroke color (see the frontmatter export note).

- **Header** — `header` / `header-lg`; white logo `{spacing.logo-header}` →
  `{spacing.logo-header-lg}` plus "Instalaciones" in `label` paper beside it ≥ 768 (FR-3);
  `nav-link`, hover underline 1px paper, current section `nav-link-current`; Header contact
  CTA `button-primary`. `clear` over the Hero at scrollY ≤ `{spacing.header-threshold}`, then
  `header-condensed` (solid `ink` + `divider-on-dark`).
- **Menu button** — `button-icon-on-dark`, menu / close icon (< 1024).
- **Mobile menu** — full-height `ink` sheet under the header; links in `mobile-menu` rows with
  `divider-on-dark`; Header contact CTA repeated at the bottom.
- **Hero** — cover photo + `overlay`; centered ≥ 768 ([p01](imports/brochure-pages/p01.png)),
  left-aligned < 768. Order: white logo `{spacing.logo-hero}` (≥ 768; the header logo covers
  mobile), `overline` between two short hairlines (≥ 768), `display`, `lead`, CTAs
  (`button-primary` + `button-ghost-on-dark`, stacked full-width < 768), proof point `small`
  paper. Bracket frames per Shapes. All of it fits 360×640 under the header.
- **Section heading** — `h1` + corner rule, optional `lead`.
- **Proyectos title band** — `title-band`: photo + `overlay`, `h1` paper + corner rule at the
  bottom-left, white logo `{spacing.logo-header-lg}` top-right (the brochure's gallery mark).
- **Service card** — `paper`, no outline (frameless columns, [p05](imports/brochure-pages/p05.png));
  optional 3:1 `service-card-image` band at the top (darkened photo from the Service doc,
  FR-5); `h2` title in its frame; description `body`; sub-service list `body`, en-dash
  markers; Service list toggle `button-text` + chevron (< 768); `button-primary-on-light`
  pinned to the bottom. Grid 1 / 2 / 2×2 ≥ 1024 / 4 across ≥ `{breakpoints.wide}`; a short
  last row keeps column width, left-aligned.
- **Project filter** — `filter-chip` row, 1px `border`, hover `filter-chip-hover`; active
  `filter-chip-active` (fill + `aria-pressed` + check icon, so state is not color-only).
  Chips wrap and never scroll. Visible `filter-count` after the chips. Empty result:
  `body` message + "Ver todos" `button-secondary`.
- **Project card** — `<article>`: 4:3 photo, `project-card-overline` Service, `h2` title
  whose button stretches over the card, optional one-line `small` summary.
  Hover/focus: photo scales, title underlines 2px `ink`; the ring (`focus-ring-on-light`)
  outlines the whole card. Grid 1 / 2 / 3.
- **Badge (Ejemplo Ilustrativo)** — `badge-placeholder` on the card photo and by the detail title.
- **Project detail view** — `paper` dialog ≤ `{spacing.dialog-w}`, ≤ 90vh, body scrolls. Close
  `button-icon` in the dialog's top-right corner, on `paper`, never over a photo (< 1024: in a
  `paper` top bar of `{spacing.header-h-condensed}` above the carousel). ≥ 1024 carousel 7/12
  on `carousel-stage` (photos `contain`, never cropped) | details 5/12; < 1024 full-screen
  sheet. `overline` Service, `h2` title + bar heading, Alcance and Resultado `body` (when
  present), proof fields as a definition list (`small` `muted` term, ink value),
  `button-primary-on-light`.
- **Project carousel** — `button-icon` arrows on paper squares at the photo edges, focused with
  `focus-ring-inset` (offset −5px, drawn on the paper); `small` paper counter; `carousel-thumb`
  ≥ 768, non-current at 64% opacity, current at 100% over a `carousel-thumb-current` bar. The
  focus ring stays distinct from "current".
- **Nosotros** — split, framed per Shapes; photo panel with `h1` title bottom-left
  ([p02](imports/brochure-pages/p02.png)); `paper` panel in three bands split by `divider`:
  Nuestra filosofía; `overline` "Esencia corporativa" over Misión and Visión (sub-head rules);
  Nuestros valores as run-in "NAME: description" (`label` + `body`), 2 columns ≥ 768
  ([p04](imports/brochure-pages/p04.png)). Block titles `h2`.
- **Trust section** — `paper`. Trust items in a row (stacked < 768): `trust-item` figure,
  `small` `muted` caption, optional evidence link. Below, "Clientes que inspiran nuestro
  trabajo" `h2` over a grouped typographic list ([p09](imports/brochure-pages/p09.png)):
  `client-group` name over a `divider` to the column edge, items `small` in 2 sub-columns,
  groups in 2 columns ≥ 1024. No logos.
- **Contact section** — `contact-section`: full-bleed photo + `overlay`; ≥ 1024 the block sits
  in the right 6/12 with the white logo top-right (p18). `h1` + mirrored rule;
  contact name `h3` paper; two channel rows, each an email paired with its phone (proyectos1@
  + (56) 4000 3344; proyectos2@ + (56) 4029 4029): underlined `body` paper links, a copy
  `button-icon-on-dark` after each email (Copy-address fallback); `button-primary` opens the
  Contact composer.
- **WhatsApp CTA** — `button-ghost-on-dark` + chat icon in the Contact section; hidden until
  its number is set.
- **Copy status** — check icon + "Copiado" `small`: `copy-status` on dark,
  `copy-status-on-light` in the composer.
- **Contact composer** — slide-in panel from the right, `{spacing.panel-w}` ≥ 768,
  full-screen sheet < 768; `paper`, `{elevation.overlay}`, over `scrim`. Header `h2` title +
  close `button-icon`; intro `small` `muted`; fields; consent row; full-width
  `button-primary-on-light`. Post-submit: check icon + `h3` heading (`composer-success`),
  FR-12 sentence `body` ink, then full-width actions ranked: "Listo"
  (`button-primary-on-light`), "Editar datos" (`button-secondary`), "Copiar correo"
  (`button-text` + copy icon, with Copy status).
- **Privacy notice** — `paper` dialog ≤ `{spacing.notice-w}`, full-screen < 768; `h2` title;
  `body` text scrolls; sticky bottom bar with "Cerrar" `button-secondary`.
- **Form field** — `text-field` + `text-field-outline`, `field-label` above, `small`
  helper/error below. Focus: outline `ink` + ring. Error: `danger` outline, message, icon.
  `select` = same box + chevron. `checkbox` 24px, 1px `border` outline, `checkbox-checked` +
  check icon, ring on the box, error = `danger` outline + message under the row. The "Leer el
  Aviso de privacidad" link follows the consent label, outside it.
- **Buttons** — min-height `{spacing.12}`, square, `label`, block padding `{spacing.3}`; fills,
  outlines, and hovers per the `button-*` tokens. Primary on dark and photo; primary-on-light
  on light; text buttons underline on hover. Pressed: translateY. No disabled state;
  validation explains.
- **Links** — inline links always underlined (`text-underline-offset: 3px`), `accent-strong`
  on light, `paper` on dark. Nav and footer links underline on hover.
- **Focus ring** — 2px + 2px offset: `focus-ring` on dark and photo, `focus-ring-on-light` on
  light, `focus-ring-inset` on paper controls over photos; never off.
- **Scrim** — full-viewport `scrim` behind each overlay.
- **Skip link** — `skip-link`; hidden until focused, then fixed top-left at `{spacing.2}`.
- **Footer** — `footer`; white logo `{spacing.logo-footer}`, Legal identity, email + phone
  pairs, year, "Aviso de privacidad"; `footer-link` links ≥ 24px tall, rows `{spacing.2}` apart.

## Do's and Don'ts

| Do | Don't |
|---|---|
| Text on photos only over `{colors.overlay}`, in `paper` | Copper or `muted-on-dark` on photos |
| Square corners (`{rounded.none}`) | Rounded "SaaS" cards, pills |
| Copper only for actions, focus, current nav, active filter | Copper headings, rules, fills |
| Monochrome hairline motifs, decorative | Gradients, glows, glassmorphism |
| Uppercase via CSS, letter-spaced (not Project titles) | Uppercase typed into Content docs |
| Weight ≥ 400 below 28px | Brochure-thin body text |
| Heights as minimums; labels wrap; bodies scroll | Fixed heights, `nowrap`, clipped text |
| Inline links underlined | Links told apart by color alone |
| `success` / `danger` only on `paper` / `paper-2` | Status colors on dark surfaces |
| Real project photos, uncropped in the carousel | Stock icons or clip-art per Service |
| Logo in header, Hero, Proyectos band, Contacto, footer | Logos inside overlays |
| One shadow, only on overlays | Card shadows as hierarchy |
