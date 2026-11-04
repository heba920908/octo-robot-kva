# Epic 1 Context: Branded Page Shell, Hero and Navigation

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Give Mexican enterprise buyers a credible mobile-first introduction to kVA Instalaciones, section navigation, and immediate contact. Establish the shared design system, image pipeline, content facade, and UI-string conventions needed by later sections without rebuilding the delivered static-site baseline.

## Stories

- Story 1.1: Brand Design Tokens and Material Theme
- Story 1.2: Self-Hosted Fonts and Icon Set
- Story 1.3: Content Facade and UI Strings Content Doc
- Story 1.4: Image Derivative Pipeline and Shared Responsive Image
- Story 1.5: Footer with Direct Contact Links and In-Page Privacy Notice
- Story 1.6: Contact Section with Direct Links and Copy-Address Fallback
- Story 1.7: Hero Section
- Story 1.8: Sticky Header and Section Navigation
- Story 1.9: Mobile Menu

## Requirements & Constraints

- Preserve es-MX, kVA casing, and existing prerender/CSP/favicon/Pages foundations. All visible/accessibility strings use validated executable content, updated with editorial docs; reject literal template text and literal `aria-label`/`alt`/`title`/`placeholder` values.
- At 360x640, the Hero's sole `h1`, lead, both CTAs, logo, and proof point fit without scrolling. Claims resolve to recorded facts/confirmed evidence; links never target absent sections.
- Publish only Ing. Alfredo Hernandez, `proyectos1@kvainstalaciones.mx`, and `(56) 4000 3344` / `+525640003344`. Exclude the second brochure pair. Direct email subjects start with `[kvainstalaciones.mx] Contacto`; native links work without JS and record nothing. Omit absent name/phone. Interim legal identity and in-flow privacy notice are permitted; the notice remains legally incomplete until the registered identity, address, and retention period are supplied.
- No backend, storage, trackers, cookies, or third-party runtime origins. Error budgets: initial bundle 1 MB, component styles 8 kB. Mobile targets: LCP <= 2.5 s, CLS <= 0.1, TBT <= 200 ms. Meet WCAG 2.2 AA, keyboard/reduced-motion access, 320 px reflow, and 200% zoom.

## Technical Decisions

- Generate the SCSS custom properties and JSON token contract from design frontmatter, never hand-edit. Export every token group using its documented `--kva-*` mapping; parity tests detect drift. Typography `-lg` switches the same property at 1024 px; heights become minimums; stroke-only tokens supply stroke colors.
- Material/CDK 22.2.4; record production-bundle impact before merge. Material first, CDK for gaps; supported token-fed theme/override APIs only. Square corners; no private-class styling or competing library. Remove schematic remote font/icon links and default themes.
- Self-host OFL Quicksand and Outfit as latin-subset variable WOFF2, weight axis 300-600, with `font-display: swap` and metric-matched `size-adjust` fallbacks to limit layout shift. Preload only Quicksand for the Hero headline; no font CDN or icon font. These open-license substitutes ship unless kVA elects to license the brochure faces.
- Provide one registered self-hosted SVG line-icon set: menu, close, arrows, copy, check, phone, mail, chat, chevron, error. Use 24 px icons, 1.5 px strokes, square caps; no filled or multicolor variants.
- Keep CSP unchanged: `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; object-src 'none'; base-uri 'self'`. Disable critical-CSS inlining, SRI, and event replay; reject executable inline scripts through `npm run verify:static` after the Pages build.
- Features never import features; core/behaviors never import UI. Standalone OnPush, signals, strict types, colocated tests. The content facade alone imports raw content and owns formatting/order/visibility/permissions/references. Markdown is editorial, not Angular input; draft-2020-12 Ajv2020/ajv-formats validation stays test-only.
- One contact-link builder owns encoding. `core/layers` alone serializes history/layer operations. Pure transitions return state/effects or `null`; adapters apply results once, effects in order, never for `null`. Use the closed core effect union. Models and production-transition tests merge before Act; preserve acceptance IDs.
- Prerender no-JS content; one after-render `enhanced` signal reveals JS-only controls. No platform-dependent markup, deferred search content, or render-time dates. Shared responsive images use `public/media/`, intrinsic sizes, AVIF/WebP/JPEG, committed non-upscaled derivatives; Hero eager/preloaded/high-priority <= 250 KB, others lazy, cards <= 120 KB at 2x. CI never generates images.

## UX & Interaction Patterns

- Dark photographic bands alternate with light surfaces; flat square forms, decorative corner rules hidden from assistive technology, copper only for actions/focus/current nav/active filters. Danger/success colors belong only on light surfaces.
- Quicksand serves titles, overlines, and stats; Outfit serves body/UI. Quicksand roles and `label` are uppercase through CSS, except sentence-case Project titles; editorial text stays sentence case. Body is at least 16 px and at most 72ch; no weight below 400 under 28 px. Quicksand roles wrap long words and hyphenate; below 768 px, `display` uses `clamp(26px, 8.5vw, 32px)`.
- Keep the Hero, Servicios, Proyectos, Nosotros, Confianza, Contacto, Footer rhythm. Content width is 1200 px, margins 20/32/48 px, grids 4 columns below 1024 px and 12 above, section padding 64 to 112 px. Labels wrap, heights are minimums, and text containers never clip overflow. One `h1`, section/dialog `h2`, sub-block `h3`; visual type roles do not determine heading semantics.
- Sticky header condenses after 24 px; synchronize anchor offsets/current-section indication. First-focusable skip link reaches main; section links scroll/focus headings and replace fragments.
- Below 1024 px, disclosure navigation traps focus across header/sheet, inerts main/footer, locks scroll. Closing consumes its history entry; Esc/Back/toggle restore toggle focus, link choice focuses the section. No JS: wrapped links, hidden toggle.
- Email remains visible; copy success clears persistent live status, announces confirmation about 100 ms later, and holds it for 2500 ms; failure selects the address and announces fallback. Use surface-appropriate 2 px focus rings with 2 px offset; targets are at least 24 px, primary touch targets 44 px.

## Cross-Story Dependencies

- Foundations precede visible sections; Footer establishes contact/privacy, Contact adds copy/announce effects, navigation establishes history, and menu extends it.
- Epics 2/4/5 supply remaining sections; never add empty sections for links. Epic 3 upgrades anchors/direct links to composer/privacy overlays, out of scope here. Epic 6 completes search/share and launch checks.