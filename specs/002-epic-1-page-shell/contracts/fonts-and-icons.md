# US2 Fonts and Icons Contract

Source: approved Story 1.2 build spec. FR-013; UX-DR3/4; AD-10/13.

- public/media/fonts: licensed latin variable WOFF2 Quicksand/Outfit, axis 300-600.
  CSS font-display swap, measured size-adjust and ascent/descent/line-gap fallback.
  Only Quicksand preloaded, as font/woff2 with anonymous crossorigin.
- src/styles/_fonts.scss owns faces; styles.scss owns token-fed `.kva-type-<role>`
  roles and semantic heading defaults. Quicksand and label uppercase; project titles
  sentence case. Quicksand wraps/hyphenates; display below 768px uses the approved
  26px/8.5vw/32px clamp; all rendered type under 28px has weight >=400.
- src/app/core/icons/icons.ts registers the eleven fixed local paths listed in
  data-model.md through Angular's initializer. HttpClient retrieval, cache and
  unknown-name failure are tested; no runtime URL inputs or remote fallback.
- Icons: 24px, 1.5px stroke, square caps, fill none/currentColor. MatIcon remains
  decorative; accessible names belong to consuming controls, not this foundation.
- Tests must cover root/Pages URL reuse, real assets, typography boundaries,
  delayed/blocked fonts and readable fallback with CLS <=0.1. Preview checks preserve
  es-MX, title, single h1, hydration, CSP, SSG/state and no executable inline script.
- Keep notices and reproducible provenance with assets. Bundle <1MB; record delta
  from Story 1.1's 183.75kB. Temporary fixtures stay outside shipped application UI.
