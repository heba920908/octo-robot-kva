# US7 Hero Section Contract

The approved Story 1.7 spec controls this contract (FR-018; BMAD FR4, UX-DR5/6/12/30, AD-14).

## Content

`content/hero.md` is the editorial source; `src/app/core/content/hero.content.ts` is the typed
executable content; `src/app/core/schemas/hero.schema.json` (draft 2020-12,
`additionalProperties: false`) governs it. Required: `id: 'hero'`, `overline`, `headline`
(`maxLength` 60), `lead` (`maxLength` 120), `primaryCta`, `secondaryCta`, `proofPoint` and
`logo { src, src2x, width, height }`. A missing proof point fails validation.

Default copy: overline "Explorando soluciones"; headline "Instalaciones eléctricas para
empresas, conforme a norma"; lead "Ingeniería e instalación sin paros, multas de CFE ni
inspecciones fallidas."; CTAs "Cotiza tu proyecto" / "Ver servicios"; proof point
"3+ años · Cobertura en todo México".

Proof-point fact check (test-only): split on `·`; every segment MUST equal a value in
`siteContent.facts`. Schema validation stays test-only; nothing in `src/` imports Ajv.

`ContentFacade` exposes the frozen `hero` and registers `{ id: 'hero', content: hero.headline }`
in `visibleSections`. Hero strings stay Hero-owned: `ui-strings.content.ts` gains no `hero*` key.

## Hero (`features/hero`)

Standalone `OnPush`, `ContentFacade` only. Prerenders
`<section id="inicio" aria-labelledby="inicio-title" data-kva-surface="dark">` first in `<main>`:

- `ResponsiveImage` (`cover-blueprint-tools`, `priority`: eager, `fetchpriority="high"`) over the
  `hero` overlay on an `ink` ground.
- White logo (`alt=""`, `kva-logo-white-200.png` 381×200 with `kva-logo-white-241.png`), height
  `--kva-spacing-logo-hero`, shown only at >= 768 (mobile logo deferred to Story 1.8's header).
- Overline between two hairlines (>= 768), the only `<h1>` (display), lead, CTAs, proof point.
- Primary CTA `<a href="#contacto">` (`button-primary`). Secondary CTA `<a href="#servicios">`
  (`button-ghost-on-dark`) renders only while `visibleSections` includes `servicios`.
- Interlocking corner-bracket frame (top-right and bottom-left, offset
  `--kva-spacing-frame-offset`, arms `--kva-spacing-bracket-arm`) at >= 768.
- Min-height `min(100svh, var(--kva-spacing-hero-max))`; labels wrap; no `overflow: hidden` on text.

Layout switches use `--kva-hero-*` custom properties defined in `src/styles.scss` at the existing
768 px boundary, so component SCSS has no literal px, color or media query. < 768: left-aligned,
CTAs stacked full width.

## Static output and preload

`src/index.html` preloads the AVIF `cover-blueprint-tools` srcset
(`rel="preload" as="image" type="image/avif" imagesrcset imagesizes="100vw" fetchpriority="high"`);
a test asserts it matches the component's AVIF `srcset`. `verify-static-build.mjs` asserts a
prerendered `#inicio` with a single `<h1>`, `href="#contacto"`, no `href="#servicios"` and the
image preload link.

## Verification

AC1: hero doc schema + prerendered `#inicio`. AC2: 360×640/320 browser check. AC3: eager/high
priority/preload/ink ground. AC4: >= 768 centered layout, < 768 left with stacked CTAs.
AC5: secondary CTA absent while `servicios` is not visible.
