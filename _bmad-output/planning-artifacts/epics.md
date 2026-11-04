---
status: final
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - _bmad-output/planning-artifacts/prds/prd-agency-portfolio-2026-10-19/prd.md
  - _bmad-output/planning-artifacts/prds/prd-agency-portfolio-2026-10-19/addendum.md
  - _bmad-output/planning-artifacts/architecture/architecture-agency-portfolio-2026-10-22/ARCHITECTURE-SPINE.md
  - _bmad-output/planning-artifacts/ux-designs/ux-agency-portfolio-2026-10-21/DESIGN.md
  - _bmad-output/planning-artifacts/ux-designs/ux-agency-portfolio-2026-10-21/EXPERIENCE.md
  - _bmad-output/planning-artifacts/ux-designs/ux-agency-portfolio-2026-10-21/imports/brochure-text.md
  - specs/001-site-foundation-pages/tasks.md
---

# agency-portfolio (kVA Instalaciones Landing Page) - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for agency-portfolio (kVA Instalaciones Landing Page), decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Single-page section navigation — header links (Servicios, Proyectos, Nosotros, Confianza, Contacto) move focus and scroll to their section and update the fragment (`#servicios`, `#proyectos`, `#nosotros`, `#confianza`, `#contacto`); logo links to `#inicio`; a hidden section drops its header link; below the 1024 px menu breakpoint links collapse into a keyboard/screen-reader operable menu that closes on link choice or Esc; smooth scroll disabled under `prefers-reduced-motion`.
FR2: Contact always one step away — the Header contact CTA stays visible at every scroll position (sticky header) and opens the Contact composer with focus on its first field.
FR3: Brand and Legal identity — "kVA Instalaciones" in header, `<title>`, and footer; "kVA" casing in copy; header logo (from `assets/media/icon.png`) named "kVA Instalaciones"; favicon derived from the logo; footer shows Legal identity (stand-in "kVA Instalaciones"), proyectos1@ and (56) 4000 3344 as Direct contact links, current year, and Privacy notice link; document language `es-MX`.
FR4: Hero value statement and CTAs — on the 360×640 Reference viewport, without scrolling: headline (the only `<h1>`), supporting line, primary CTA opening the Contact composer, secondary CTA to Services, kVA logo, and at least one Hero proof point that repeats a confirmed Trust item or site fact; all from the hero Content doc.
FR5: Content-driven Service cards — one card per Service in Content doc order (four at launch: Desarrollo e Ingeniería de Proyecto, Instalaciones, Puesta en marcha y Validaciones, Servicios de Datos); each lists its Sub-services in Content doc order (all present in served HTML even when collapsed); optional image band only when set; a fifth Service added as Content-only change yields five cards and five composer options; schema failure fails content validation.
FR6: Service CTA pre-fills the Contact composer — activating a Service CTA opens the composer with that Service selected and focus on the email field; the Visitor can still change it.
FR7: Filter Projects by Service — options "Todos" plus one per Service with ≥ 1 Project; filter hidden when fewer than two Services have Projects; Projects section and header link hidden when there are no Projects; result count announced to assistive tech; active option indicated (`aria-pressed`); no reload or network request.
FR8: Project detail view — opens from a card by click/tap/keyboard, traps focus, closes via close control, Esc, or browser Back; focus returns to the originating card, filter kept; Project carousel shows one photo at a time with keyboard/pointer/touch prev/next, announces "{i} de {n}", no autoplay, no controls for one-photo Projects; every photo has `alt` (missing `alt` fails validation); Alcance, Resultado, and proof fields (client, location, year, standards) render only when present; client-name field renders only with group permission (FR19); "Cotiza un proyecto similar" CTA opens composer with the Project's Service; placeholder label shown in the view.
FR9: Placeholder projects are honest — placeholder-flagged Projects show "Ejemplo Ilustrativo"; replacing one with a real Project is Content-only; every photo records `source` and `license` (missing either fails validation); brochure photos record the brochure as source and "supplied by kVA" as license.
FR10: Content-driven Trust items — only confirmed Trust items render; an optional evidence reference shows next to the item; registration/certification items without evidence fail validation; Trust section and its header link hidden when no confirmed item and no permitted client group, otherwise only the empty part is omitted.
FR11: Compose a Lead email — fields: email (required, valid format), Service (required, pre-filled default), Privacy notice acceptance (required); inline errors on blur or submit tied via `aria-describedby`, focus to first invalid field; valid submit opens `mailto:` to proyectos1@kvainstalaciones.mx with subject = Lead subject tag + Service name and Spanish body listing email and Service, URL-encoded; nothing sent or stored by the site.
FR12: Copy-address fallback — proyectos1@kvainstalaciones.mx always visible in the Contact section with a copy control confirming "Copiado" via live region; after composer submit the page shows "Si no se abrió tu correo, escríbenos a proyectos1@kvainstalaciones.mx" with the copy control.
FR13: Lead subject tag — every generated email subject starts with `[kvainstalaciones.mx]`, for composer and Direct contact links alike.
FR14: Privacy notice access — opens from the consent control and the footer; closing keeps composer values; text from a Content doc; missing/invalid content fails validation.
FR15: Content docs are the single source of truth — every user-visible string/data item comes from Executable content matching a Content doc (all sections, SEO, UI strings); an automated check fails on literal template text nodes or literal `aria-label`/`alt`/`title`/`placeholder`; every content type validates against its Content schema, failures name item and field; PRs changing a Content doc also change its Executable content; adding/editing/removing a Service, Sub-service, Project, Trust item, Client, or Nosotros value is Content-only.
FR16: Search and share metadata — title, meta description, canonical URL, Open Graph and Twitter tags from a Content doc; JSON-LD `ElectricalContractor` (name, URL, email, telephone, areaServed MX); all present in served HTML without JS; prerendering puts Hero, Services + Sub-services, Project titles, Nosotros, Trust items, Clientes list, and Contact channels in served HTML; dedicated 1200×630 share image; `robots.txt` and `sitemap.xml` published.
FR17: WhatsApp CTA placeholder — not rendered while the site Content doc has no number; when a valid E.164 `+52…` number is set, the CTA opens `https://wa.me/<digits>` with a Spanish prefill starting with the Lead subject tag; invalid number fails validation; the change also updates the Privacy notice Content doc.
FR18: Nosotros section — philosophy, mission, vision, and values (Excelencia, Seguridad, Integridad, Compromiso, Colaboración, Adaptabilidad) from the Nosotros Content doc, reached from the header; hidden with its header link when content is absent; no unsupported superlatives; brand written "kVA".
FR19: Clientes list with permission — one permission flag per client group covers its name, scope line, and items; unpermitted groups appear nowhere (list, Project client field, metadata), Project titles exempt; permitted groups render as text in Content doc order; list hidden when none permitted; changes are Content-only.
FR20: Direct contact links — Contact section shows the contact name (Ing. Alfredo Hernández); Contact section and footer show proyectos1@ as `mailto:` (subject `[kvainstalaciones.mx] Contacto`, encoded) and (56) 4000 3344 as `tel:+525640003344`; work without JS, change no state, record nothing; channels come from the site Content doc (missing name/phone omitted; address required; invalid phone fails validation); proyectos2@ and (56) 4029 4029 appear nowhere.

### NonFunctional Requirements

NFR1: Performance — stay within `angular.json` budgets (initial bundle error 1 MB, per-component styles error 8 kB); Lighthouse mobile (simulated throttling) on built output: LCP ≤ 2.5 s, CLS ≤ 0.1, TBT ≤ 200 ms; responsive images, lazy below the fold.
NFR2: Accessibility — WCAG 2.2 AA: semantic landmarks, labeled controls, visible focus, 4.5:1 text contrast, targets ≥ 24×24 px, full keyboard operation, `prefers-reduced-motion` respected.
NFR3: Browser support — last two versions of Chrome, Edge, Firefox, Safari, plus iOS Safari and Chrome for Android.
NFR4: Privacy and security — no cookies, trackers, or personal data stored/transmitted; HTTPS; CSP baseline via `<meta>` on GitHub Pages (`default-src 'self'`, self-hosted fonts and images, no third-party origins, `base-uri 'self'`); critical-CSS inlining disabled; no executable inline scripts; JSON-LD as a non-executable data block.
NFR5: Extensibility — new Services, Sub-services, Projects, Trust items, Clients, and Nosotros values added as Content-only changes; copy kept out of components so a future language can be added.

### Additional Requirements

- **Brownfield baseline (already delivered by specs/001, do not re-story):** `@angular/ssr` static prerender (`outputMode: "static"`), CSP `<meta>`, `lang="es-MX"`, kVA favicon, OnPush shell with title/description metadata, `site` Content doc + schema + typed content + Ajv test, `verify-static-build.mjs`, and GitHub Pages Actions workflow (build on PR, deploy on `main`). No starter template applies.
- AD-1: Feature-sliced layout `src/app/{behaviors,core/{content,schemas,contact,effects,layers},features/<feature>,shared}`, `src/styles/`; features never import other features; core/behaviors never import features or shared UI; app shell alone provides the `OVERLAY_COMPONENTS` token map.
- AD-2: `content/**/*.md` is editorial authority only; Angular never imports, fetches, parses, or builds from Markdown; content PRs update doc + Executable content together.
- AD-3: All visible content in readonly typed objects under `src/app/core/content/`; a single content facade owns ordering, UI-string placeholder formatting, published-visibility filters, client permissions, cross-reference resolution, and the visible-section list; JSON Schemas (draft 2020-12) in `src/app/core/schemas/` validated in unit tests with `Ajv2020` + `ajv-formats`; validation code test-only.
- AD-4: Angular Material 22.2.4 (and CDK only where Material lacks a control); theme via supported APIs fed by project tokens; no private DOM class styling; record production-bundle impact against NFR1 before adding.
- AD-5: `core/layers` alone opens/closes Mobile menu, Contact composer, Project detail view, Privacy notice; sole owner of `history.pushState/replaceState/back` and `popstate`; serialized history ops; features never call `MatDialog` directly; dialogs use `closeOnNavigation: false`; only stack is Privacy notice over Contact composer; Project detail → composer replaces the history entry and keeps the card as final focus target.
- AD-6: Feature-local signals; cross-feature state in named core services; `core/contact` owns the in-memory Contact draft; no cookies/storage/network.
- AD-7: Each behavior model in `src/app/behaviors/<id>.behavior.ts` exports finite discriminated `State` and `Event` types and conforms to the shared `BehaviorModel<State, Event>` type in `src/app/behaviors/behavior-model.ts`. It declares `id`, `actor`, `trigger`, descriptive `preconditions`, stable acceptance IDs, and a pure deterministic `transition(state, event)` returning `{ state, effects }` or `null` for an unsupported pair. The function is the single source of transition truth; feature handlers apply only its result. Effects use one closed discriminated union owned by `core/effects` with kinds `focus`, `layer`, `navigate`, `copy`, `announce`, and `scroll`; each kind has a typed payload and documented meaning defined there. The feature adapter submits non-null effects once in returned order and none for `null`; global/modal event ownership follows AD-5. Table-driven tests call the production function; interaction tests verify the adapter applies returned state/effects once. The model and tests merge before the story enters Act.
- AD-8: One prerendered route; prerendered HTML is the no-JS baseline; one `enhanced` signal set after first browser render drives JS-only affordances (start `hidden`); responsive collapse CSS-only; no `@defer` around search-visible content; no `new Date()` during render (footer year from content/build config); head metadata and JSON-LD from Executable content.
- AD-9: One pure contact-link builder in `core/contact` builds every `mailto:`, `tel:`, and WhatsApp URL (Lead tag, Spanish body, encoding, E.164 → `tel:`/`wa.me`).
- AD-10: Self-host fonts, icons, images; no Google Fonts, icon fonts, analytics; disable critical CSS inlining and SRI; no event replay; CSP meta `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; object-src 'none'; base-uri 'self'`; build test rejects executable inline scripts.
- AD-11: GitHub Actions only; PRs run unit tests, content validation, production build; `main` deploys with base href `/octo-robot-kva/` (already in place).
- AD-12: Every Service, Project, Trust item, and client group has immutable `id` = Content doc slug; references use typed IDs (`serviceId`, `clientGroupId`); tests prove references resolve and IDs are unique.
- AD-13: After adding Material, remove remote font/icon links, self-host fonts, use registered SVG icons, replace default themes with token theming.
- AD-14: Runtime images served from `public/media/`; originals may stay in `assets/media/`; all photos through one shared responsive-image component using content metadata; Hero eager/high priority, others lazy.
- Conventions: Angular 2025 file names (`hero.ts`, `hero.html`, `hero.scss`, `hero.spec.ts`); Content docs `content/<type>/<slug>.md` (singletons `content/<type>.md`); Executable content `src/app/core/content/<type>.content.ts`; schemas `<type>.schema.json`; browser APIs via `DOCUMENT` or after-render hooks, never platform-branched markup.
- Content schemas to create (addendum): `service`, `project`, `trust-item`, `client`, `nosotros`, `hero`, `ui-strings`, `privacy-notice`, extended `site` (footer, SEO, facts, contact name, proyectos1@, phone, optional Legal identity/retention, optional WhatsApp), plus `design-tokens.json`.
- Behavior models to create (constitution II): `section-navigation`, `mobile-menu`, `contact-cta`, `service-cta-prefill`, `service-card-disclosure`, `project-filter`, `project-detail`, `project-carousel`, `contact-composer`, `copy-address`, `direct-contact-links`, `whatsapp-cta`, `privacy-notice`.
- Launch readiness (PRD §8.3): share image 1200×630 and favicon from supplied logo/brochure photo; SM-2 Lighthouse check (Performance ≥ 90, Accessibility 100, SEO 100) on built output; SM-3 check — adding a Service and a Project each works as a Content-only change on built output.

### UX Design Requirements

UX-DR1: Design tokens — export DESIGN.md frontmatter (colors, typography incl. `-lg` media-switched roles, spacing, rounded, elevation, motion, breakpoints, component tokens) to `src/styles/_tokens.scss` (`--kva-<group>-<key>`) and `design-tokens.json`, generated not hand-edited; parity checked by a test.
UX-DR2: Material theme — Angular Material themed from tokens: square corners (`rounded.none`) everywhere, copper only for actions/focus/current nav/active filter, `danger`/`success` only on light surfaces.
UX-DR3: Self-hosted fonts — Quicksand (titles, overline, stats) and Outfit (body/UI) as variable WOFF2, latin subset, weights 300–600, `font-display: swap`, metric-matched fallbacks via `size-adjust`, Quicksand preloaded; Quicksand roles and `label` uppercase via CSS (not Project titles); no weight below 400 under 28 px; `display` < 768 is `clamp(26px, 8.5vw, 32px)`.
UX-DR4: Icon set — one 24 px line icon set (1.5 px stroke, square caps), registered as SVG: menu, close, arrows, copy, check, phone, mail, chat, chevron, error.
UX-DR5: Image pipeline — runtime images in `public/media/` with `srcset` (AVIF/WebP + JPEG fallback) and intrinsic sizes; Hero ≤ 250 KB, card photo ≤ 120 KB at 2×; shared responsive-image component (eager Hero with `fetchpriority="high"`, lazy + `decoding="async"` elsewhere); 4:3 `paper-2` placeholder box for cards, fade-in on load; failed images keep box.
UX-DR6: Line motifs — decorative (`aria-hidden`) corner rule under section titles (┘, mirrored └ in Contacto, sub-head variants ┘/┐ for Misión/Visión), corner-bracket frames at fixed placements (Hero ≥ 768 interlocking, Service card title, Nosotros photo and content panels), and bar heading under Project detail title.
UX-DR7: Section rhythm — Hero (photo + overlay) → Servicios (paper) → Proyectos (title band + paper-2 grid) → Nosotros (split photo | paper) → Confianza (paper) → Contacto (photo + overlay) → Footer (ink + top rule); content column 1200 px, margins 20/32/48, 12-col ≥ 1024 / 4-col below, section padding 64 → 112.
UX-DR8: Header — sticky; transparent over Hero until scrollY > 24 px, then condensed solid `ink` with divider; white logo 32 → 40 px; "Instalaciones" wordmark ≥ 768; current link `aria-current="location"` via scroll-spy with copper underline; Header contact CTA "Cotiza tu proyecto" (visible "Cotiza" < 768); `scroll-padding-top` tracks header height.
UX-DR9: Skip link "Saltar al contenido" — first focusable, visible on focus, targets `<main id="main" tabindex="-1">`.
UX-DR10: Mobile menu (< 1024) — APG disclosure nav: constant-name "Menú" button with `aria-expanded`/`aria-controls="menu-movil"`, `<nav id="menu-movil" aria-label="Secciones">`; while open `inert` on main/footer, focus trap over header + sheet, scroll lock; Esc/Back/toggle close and refocus toggle; link choice closes then focuses target heading; CTA repeated at sheet bottom.
UX-DR11: Section headings — anchor targets with `tabindex="-1"`, `scroll-margin-top`; one `<h1>`, `<h2>` per section/dialog, `<h3>` sub-blocks, nothing deeper.
UX-DR12: Hero layout — cover photo + overlay, centered ≥ 768, left < 768; white logo 200 px (≥ 768), overline "Explorando soluciones" between hairlines (≥ 768), headline ≤ 60 chars, lead ≤ 120 chars, CTAs (primary + ghost-on-dark, stacked full-width < 768), proof point "3+ años · Cobertura en todo México"; all fits 360×640 under header; min-height `min(100svh, 880px)`; photo preloaded, `ink` ground while loading.
UX-DR13: Service card — paper, frameless; optional 3:1 darkened image band; title in corner-bracket frame; description; en-dash Sub-service list; < 768 shows first 4 items + "Ver los {n} servicios / Ver menos" toggle (`aria-expanded`), ≥ 768 full list; `button-primary-on-light` CTA pinned bottom ("Cotiza este servicio" or "Solicita una visita técnica"); grid 1 / 2 / 2×2 ≥ 1024 / 4 across ≥ 1440.
UX-DR14: Proyectos title band — photo + overlay, `h1` + corner rule bottom-left, white logo top-right.
UX-DR15: Project filter chips — single-select `<button aria-pressed>` in a labeled group "Filtrar proyectos por servicio"; active chip with fill + check icon; chips wrap; visible + polite live count "{n} proyectos: {servicio}" / "{n} proyectos en total"; defensive empty state + "Ver todos"; state in memory only.
UX-DR16: Project card — `<article>` with 4:3 photo, Service overline, `<h3><button aria-haspopup="dialog">` stretched over card, `aria-describedby` to Service/summary, optional one-line summary; hover scales photo, focus ring outlines whole card; grid 1 / 2 / 3; placeholder badge "Ejemplo Ilustrativo" (text) on photo.
UX-DR17: Project detail view layout — paper dialog ≤ 1080 px, ≤ 90 vh, body scrolls; ≥ 1024 carousel 7/12 on `ink-2` stage (photos `contain`) | details 5/12; < 1024 full-screen sheet with paper top bar holding close; DOM order Close, title block, carousel, details, CTA; focus to `<h2 tabindex="-1">` title; proof fields as definition list.
UX-DR18: Project carousel — APG carousel region (`aria-roledescription="carrusel"`, "Fotos de {title}"), slides `role="group"` "foto" "{i} de {n}"; arrows on paper squares with inset focus; ←/→ only while focus inside; swipe ≥ 40 px with `touch-action: pan-y`; thumbnails ≥ 768 with `aria-current`; wraps last → first; announces "Foto {i} de {n}: {alt}"; adjacent photos preloaded; no controls for one photo.
UX-DR19: Nosotros layout — split 5/12 photo | 7/12 paper ≥ 1024 (photo band above content below); paper panel in three bands: Nuestra filosofía; overline "Esencia corporativa" over Misión and Visión; Nuestros valores as `<dl>` run-in "NAME: description", 2 columns ≥ 768.
UX-DR20: Trust section layout — Trust items in a row (stacked < 768) with `stat` figure, muted caption, optional evidence link; "Clientes que inspiran nuestro trabajo" over a grouped typographic list (group name over divider, items in 2 sub-columns, groups in 2 columns ≥ 1024, right column right-aligned); no logos.
UX-DR21: Contact section layout — full-bleed photo + overlay; ≥ 1024 block in right 6/12 with white logo top-right; contact name `h3`; channel row: email `mailto:` + copy icon button + phone `tel:` ("Llamar al {phone}"); `button-primary` opens composer; WhatsApp ghost button slot; no-JS: composer button is a plain tagged `mailto:` link.
UX-DR22: Copy status — persistent empty `role="status"` beside each copy button; clear then set "Copiado" ~100 ms later, held 2500 ms; failure selects address text and announces "No se pudo copiar. Selecciona el correo y cópialo."; Async Clipboard API with selection fallback.
UX-DR23: Contact composer panel — right slide-in panel 440 px ≥ 768, full-screen sheet < 768, over scrim with overlay shadow; title "Cotiza tu proyecto", intro, required note; email field (`type="email" autocomplete="email" inputmode="email"`, label + hint "Ahí te responderemos."), Service select ("Elige un servicio"), consent checkbox with separate "Leer el Aviso de privacidad" link; submit "Abrir mi correo" (never disabled); errors on blur-after-edit and submit with `aria-invalid`, danger outline + icon, polite error summary; post-submit state: check + "Abrimos tu app de correo" `h3 tabindex="-1"` + FR12 sentence + ranked actions Listo / Editar datos / Copiar correo; values persist in memory; reopen after submit shows filled form.
UX-DR24: Privacy notice dialog — paper dialog ≤ 720 px (full-screen < 768), `h2` title, scrollable body (`tabindex="0"`), sticky "Cerrar" bar; stacks above composer with its own scrim, composer `inert` beneath; no-JS: footer link jumps to in-flow `<section id="aviso">`.
UX-DR25: Modal overlay primitives — `role="dialog"` + `aria-modal`, everything outside topmost `inert`, focus trap on topmost only, scroll lock, focus returns to invoker; open pushes one history entry, Back closes topmost, non-Back closes consume the entry via guarded `history.back()`; Esc closes only topmost and is ignored while a native `<select>` is open; scrim click closes.
UX-DR26: Footer — `ink` with top divider; white logo 24 px, Legal identity, email + phone pair (tagged), "© {year} kVA Instalaciones", "Aviso de privacidad"; links ≥ 24 px tall.
UX-DR27: Default UI strings — every string in EXPERIENCE.md › Default UI strings table lives in the `ui-strings` Content doc and typed content with `{n}`, `{i}`, `{title}`, `{servicio}`, `{email}`, `{alt}`, `{address}`, `{phone}`, `{lista}`, `{year}` placeholders formatted by the facade.
UX-DR28: Launch content seed — Services (4, Sub-services from brochure p05 with hook items first; "Mantenimiento preventivo y correctivo a:" kept as one item), 9 brochure Projects with photo counts and Service mapping, Nosotros (p02–p04 reworded, "Compromiso" spelling), 5 client groups (p09), 3 Trust items (3+ años, Cobertura en todo México, NOM-001-SEDE-2012), per EXPERIENCE.md › Information Architecture.
UX-DR29: Scroll reveal and motion — after hydration only, fade + 12 px rise over 400 ms, once, only for elements below the fold; `focusin` reveals immediately; skipped under reduced motion and `scripting: none`; hover/press/panel/dialog motion per DESIGN.md › Motion; all instant under `prefers-reduced-motion`.
UX-DR30: No-JS states — all content visible with no reveals; < 1024 nav links wrap as a row; chips, copy buttons, menu button hidden; Project cards not interactive; contact CTAs are `<a href="#contacto">` before hydration and gain `aria-haspopup="dialog"` after.
UX-DR31: Accessibility floor checks — targets ≥ 24 px everywhere, 44 px for primary touch targets; focus ring 2 px + 2 px offset (`focus` on dark, `focus-on-light` on light, inset on paper over photo), `:focus-visible` only; inline links underlined; reflow at 320 px, 200 % zoom, and text-spacing with no clipping or horizontal scroll; heights as minimums, no `overflow: hidden` on text containers.
UX-DR32: Share image and favicon — 1200×630 share image composed from the cover photo + overlay + white logo (never upscaled); favicon/touch icon from `assets/media/icon.png`.

### FR Coverage Map

FR1: Epic 1 - Section navigation, header links, mobile menu
FR2: Epic 1 - Sticky header CTA (anchor to `#contacto`); Epic 3 - CTA opens the Contact composer
FR3: Epic 1 - Brand, logo, favicon, footer Legal identity
FR4: Epic 1 - Hero value statement, proof point, CTAs
FR5: Epic 2 - Content-driven Service cards
FR6: Epic 3 - Service CTA pre-fills the Contact composer
FR7: Epic 4 - Project filter by Service
FR8: Epic 4 - Project detail view and carousel
FR9: Epic 4 - Placeholder projects and photo source/license
FR10: Epic 5 - Confirmed Trust items
FR11: Epic 3 - Contact composer builds the Lead email
FR12: Epic 1 - Copy-address fallback in the Contact section; Epic 3 - post-submit fallback
FR13: Epic 3 - Lead subject tag
FR14: Epic 3 - Privacy notice access
FR15: Epic 1 - Content facade, UI strings, literal-text check (pattern); every later epic extends it
FR16: Epic 6 - Search and share metadata, structured data, robots, sitemap
FR17: Epic 3 - WhatsApp CTA placeholder
FR18: Epic 5 - Nosotros section
FR19: Epic 5 - Clientes list with permission
FR20: Epic 1 - Contact-link builder, footer and Contact section direct links

## Epic List

### Epic 1: Branded Page Shell, Hero and Navigation
A Visitor lands on a kVA-branded page, understands within seconds who kVA is and for whom (headline, lead, proof point, CTAs), moves to any section from a sticky header or mobile menu, and reaches kVA through the Contact section (contact name, email, phone, copy) and the footer. Establishes the design system, image pipeline, content facade, and UI-strings pattern every later epic uses.
**FRs covered:** FR1, FR2 (anchor), FR3, FR4, FR12 (Contact section), FR13 (direct links), FR15, FR20

### Epic 2: Services Catalogue
A Visitor sees kVA's four Services from the brochure as cards with every Sub-service (hook items first), collapsible on mobile, each with a CTA toward contact.
**FRs covered:** FR5

### Epic 3: Contact kVA (Lead Capture)
A Visitor reaches kVA in one step from any CTA: the Contact composer that opens a tagged email (pre-filled from any Service CTA), the Privacy notice dialog, and a WhatsApp slot hidden until a number exists.
**FRs covered:** FR2 (composer), FR6, FR11, FR12 (post-submit), FR13, FR14, FR17

### Epic 4: Project Portfolio
A Visitor browses kVA's nine brochure Projects, filters them by Service, opens a detail view with a photo carousel, and starts a quote for a similar project; placeholder Projects are clearly labeled.
**FRs covered:** FR7, FR8, FR9

### Epic 5: About kVA and Trust
A Visitor reads kVA's philosophy, mission, vision, and values, sees confirmed Trust items, and sees the client groups kVA has permission to name.
**FRs covered:** FR10, FR18, FR19

### Epic 6: Search, Sharing and Launch Readiness
The page is findable and previews well on WhatsApp, LinkedIn, and email, and passes the launch checks (no-JS states, accessibility floor, Lighthouse SM-2, Content-only change SM-3).
**FRs covered:** FR16 (closes NFR1-NFR5)

## Epic 1: Branded Page Shell, Hero and Navigation

A Visitor lands on a kVA-branded page, understands within seconds who kVA is and for whom, moves to any section from a sticky header or mobile menu, and reaches kVA through the Contact section and the footer. Establishes the design system, image pipeline, content facade, and UI-strings pattern every later epic uses.

For behavior-model traceability, each Given/When/Then block in a behavior-bearing story has
a stable ID `1.<story>-AC-<nn>` (for example `1.6-AC-01`); its `And` clauses share that ID.
Behavior-model `acceptance` metadata and the epic spec MUST cite these IDs. New criteria
append IDs; existing IDs MUST NOT be reordered or reused.

### Story 1.1: Brand Design Tokens and Material Theme

As a Visitor,
I want the page to use kVA's brochure colors and square, flat visual language,
So that it reads as the same serious, engineered company as the printed brochure.

**Acceptance Criteria:**

**Given** the DESIGN.md frontmatter tokens
**When** the token export runs
**Then** `src/styles/_tokens.scss` exposes every color, typography, spacing, rounded, elevation, motion, and breakpoint token as `--kva-<group>-<key>` custom properties, and `design-tokens.json` holds the same values (UX-DR1)
**And** a unit test fails if either generated file drifts from DESIGN.md
**And** `-lg` typography tokens switch the same custom property at ≥ 1024 px

**Given** Angular Material 22.2.4 and CDK 22.2.4 are added
**When** the production build runs
**Then** the bundle-size impact is recorded against NFR1 budgets before merge (AD-4) and the build stays within the 1 MB initial-bundle error budget
**And** Material is themed only through supported theme/override APIs fed by tokens, with `rounded.none` corners, copper reserved for actions/focus/current nav/active filter, and no styling of private Material classes (UX-DR2)
**And** generated remote font and icon links are removed and default themes replaced (AD-13)

**Given** the Pages build
**When** `npm run verify:static` runs
**Then** the CSP meta tag still matches AD-10 and no executable inline script is present

### Story 1.2: Self-Hosted Fonts and Icon Set

As a Visitor,
I want kVA's brochure-like typefaces and crisp icons to load fast from kVA's own site,
So that the page looks right without leaking my visit to third parties.

**Acceptance Criteria:**

**Given** the page loads
**When** fonts are requested
**Then** Quicksand and Outfit are served from the site origin as latin-subset variable WOFF2 (weights 300–600) with `font-display: swap` and `size-adjust` metric-matched fallbacks, only Quicksand is preloaded, and no request goes to a third-party origin (UX-DR3, AD-10)
**And** Quicksand roles and `label` render uppercase via CSS, no weight below 400 is used under 28 px, and `display` below 768 px is `clamp(26px, 8.5vw, 32px)`

**Given** the 24 px line icon set (menu, close, arrows, copy, check, phone, mail, chat, chevron, error)
**When** a component requests an icon by name
**Then** it renders a registered self-hosted SVG with 1.5 px stroke, and no icon font is loaded (UX-DR4)

**Given** the Pages build
**When** `npm run verify:static` runs
**Then** the CSP meta tag still matches AD-10 and no executable inline script is present

### Story 1.3: Content Facade and UI Strings Content Doc

As a technical editor at kVA,
I want every visible string to come from one typed UI-strings content object behind a single content facade,
So that I can change copy in one reviewed place and no component carries hard-coded text.

**Acceptance Criteria:**

**Given** `content/ui-strings.md` seeded from EXPERIENCE.md › Default UI strings
**When** its Executable content `src/app/core/content/ui-strings.content.ts` is validated against `src/app/core/schemas/ui-strings.schema.json` (draft 2020-12, `Ajv2020` + `ajv-formats`)
**Then** validation passes, and a missing or malformed string fails the test naming the item and field (FR15, UX-DR27)

**Given** a UI string containing placeholders such as `{n}`, `{servicio}`, `{year}`
**When** a component asks the facade for it with values
**Then** the facade returns the formatted string, and an unknown or missing placeholder value fails a unit test

**Given** the content facade in `src/app/core/content/`
**When** components need content
**Then** they read only from the facade; only the facade imports raw content objects (AD-3)
**And** the facade exposes a visible-section list that includes a section only when that section has content to show (used by navigation in later stories)

**Given** any component template under `src/app/`
**When** the automated template check runs in `npm test`
**Then** it fails on any literal text node or literal `aria-label`, `alt`, `title`, or `placeholder` value, and passes when only bindings are used (FR15)

**Given** validation code
**When** the production bundle is built
**Then** Ajv and schemas are absent from the browser bundle (test-only)

### Story 1.4: Image Derivative Pipeline and Shared Responsive Image

As a technical editor at kVA,
I want one command that turns brochure originals into web-ready images and one component that renders them,
So that every photo loads fast and is delivered the same way.

**Acceptance Criteria:**

**Given** `sharp` added as a devDependency (authorized by this story) and `scripts/build-images.mjs` exposed as `npm run images:build`
**When** it runs against a manifest of originals in `assets/media/brochure/` (backgrounds, logos, project photos)
**Then** it writes AVIF, WebP, and JPEG files at the manifest widths into `public/media/` with deterministic names, never upscales beyond the original width, and re-running produces no changes (UX-DR5, AD-14)
**And** it fails if a Hero output exceeds 250 KB or a card photo exceeds 120 KB at 2×
**And** generated files are committed, so `npm run build:pages` and CI never run `sharp`

**Given** the shared responsive-image component in `src/app/shared/`
**When** a feature passes image metadata from Executable content (base name, widths, intrinsic width and height, `alt`)
**Then** it renders a `<picture>` with AVIF and WebP sources, a JPEG fallback, `srcset`/`sizes`, and intrinsic `width`/`height`, lazy with `decoding="async"` by default, and eager with `fetchpriority="high"` when marked priority (AD-14)
**And** `alt` is always bound from content, never literal (FR15)

**Given** the white kVA logo PNG
**When** the pipeline runs
**Then** `public/media/` holds the header, footer, Hero, and band sizes of the logo

### Story 1.5: Footer with Direct Contact Links and In-Page Privacy Notice

As a Visitor,
I want the footer to show kVA's name, email, phone, and privacy notice,
So that I can contact kVA directly or read how my data is handled from anywhere on the page.

**Acceptance Criteria:**

**1.5-AC-01**
**Given** `content/site.md` and `site.schema.json` extended with company facts usable as the Hero proof point (years in business, coverage), contact name, `proyectos1@kvainstalaciones.mx`, phone `+525640003344` displayed as "(56) 4000 3344", optional Legal identity and retention period, optional WhatsApp number, and the footer year
**When** content validation runs
**Then** a missing email or an invalid Mexican E.164 phone fails validation, and no `proyectos2@` address or "(56) 4029 4029" exists anywhere in content (FR20)

**1.5-AC-02**
**Given** the pure contact-link builder in `src/app/core/contact/`
**When** its unit tests run
**Then** it builds `mailto:proyectos1@kvainstalaciones.mx?subject=%5Bkvainstalaciones.mx%5D%20Contacto` and `tel:+525640003344`, owns the Lead subject tag `[kvainstalaciones.mx]`, and URL-encodes all values (AD-9, FR13)

**1.5-AC-03**
**Given** the footer
**When** the page is prerendered
**Then** it shows the white logo (24 px), the Legal identity or "kVA Instalaciones" stand-in, the email as a tagged `mailto:` link, the phone as a `tel:` link named "Llamar al (56) 4000 3344", "© {year} kVA Instalaciones" with the year from content/build config (no `new Date()` during render), and an "Aviso de privacidad" link (FR3, FR20, UX-DR26, AD-8)
**And** links are ≥ 24 px tall and work without JavaScript, change no page state, and record nothing (`direct-contact-links` behavior model with tests that call its production `transition` function)

**1.5-AC-04**
**Given** `content/privacy-notice.md` and its typed content validated by `privacy-notice.schema.json`
**When** the Visitor activates "Aviso de privacidad"
**Then** the page jumps to an in-flow `<section id="aviso">` showing the generic notice with the stand-in responsible party (FR14 no-JS baseline, UX-DR24)
**And** missing or invalid privacy-notice content fails validation

### Story 1.6: Contact Section with Direct Links and Copy-Address Fallback

As a general contractor,
I want to see kVA's contact person, email, and phone and copy the email in one action,
So that I can contact kVA from whatever tool I use, even webmail.

**Acceptance Criteria:**

**1.6-AC-01**
**Given** the page shell
**When** sections render
**Then** the shell lays out sections in the order and surfaces of UX-DR7 (1200 px content column, 20/32/48 px margins, 4/12-column grid, 64 → 112 px section padding) so later sections slot in without layout changes
**And** each section title is an `<h2 tabindex="-1">` anchor target with the decorative `aria-hidden` corner rule and no skipped heading level (UX-DR6, UX-DR11)

**1.6-AC-02**
**Given** the Contact section `#contacto` over the `cable-tray-technician.jpg` photo + overlay (via the shared responsive-image component)
**When** the page is prerendered
**Then** it shows the title "Contacto" with the mirrored corner rule, the contact name "Ing. Alfredo Hernández" as `h3`, the email as a tagged `mailto:` link and the phone as a `tel:` link built by the contact-link builder, and a contact button that is a plain tagged `mailto:` link (FR20, UX-DR21, UX-DR30)
**And** ≥ 1024 px the block sits in the right 6/12 with the white logo top-right
**And** `#contacto` joins the visible-section list
**And** a missing contact name or phone is omitted without leaving a gap

**1.6-AC-03**
**Given** `core/effects` created with the closed effect union (focus, layer, navigate, copy, announce, scroll) and executors for copy and announce
**When** the `copy-address` behavior model's table-driven tests run
**Then** table-driven tests call the production `transition` function and assert copy success, failure, status reset, and unsupported results; interaction tests verify the adapter applies each non-null result once and applies no effects for `null`; only `core/effects` executes the effects (AD-7)

**1.6-AC-04**
**Given** JavaScript is enabled
**When** the Visitor activates "Copiar correo proyectos1@kvainstalaciones.mx"
**Then** the address is written via the Async Clipboard API and the persistent empty `role="status"` beside it is cleared, then set to "Copiado" ~100 ms later, held 2500 ms (FR12, UX-DR22)

**1.6-AC-05**
**Given** the clipboard write fails
**When** the Visitor activates the copy button
**Then** the address text is selected and "No se pudo copiar. Selecciona el correo y cópialo." is announced

**1.6-AC-06**
**Given** JavaScript is disabled
**When** the section renders
**Then** the copy button is hidden and the address stays visible as text and link

### Story 1.7: Hero Section

As a Visitor on a phone,
I want to see who kVA is, for whom, and how to get a quote on the first screen,
So that I can decide within seconds whether kVA fits my need.

**Acceptance Criteria:**

**Given** `content/hero.md` and its typed content validated by `hero.schema.json`
**When** the page is prerendered
**Then** the Hero at `#inicio` shows the overline "Explorando soluciones", the headline (≤ 60 chars) as the page's only `<h1>`, the lead (≤ 120 chars), the primary CTA "Cotiza tu proyecto", the secondary CTA "Ver servicios", and the proof point "3+ años · Cobertura en todo México" (FR4, UX-DR12)
**And** a hero proof point that is not a fact recorded in the site content fails content validation (FR4)
**And** the hero schema requires the proof point (build fails without it)

**Given** the 360×640 Reference viewport
**When** the page loads
**Then** headline, lead, both CTAs, the kVA logo (header logo on mobile), and the proof point are visible without scrolling, and text reflows without clipping at 320 px

**Given** the Hero photo `cover-blueprint-tools.jpg` generated by the image pipeline
**When** it renders through the shared responsive-image component marked priority
**Then** it is eager with `fetchpriority="high"`, preloaded, and sits under the `overlay` color on an `ink` ground while loading (UX-DR5, AD-14)

**Given** viewport ≥ 768 px
**When** the Hero renders
**Then** content is centered with the 200 px white logo, overline between hairlines, and the interlocking corner-bracket frame (UX-DR6); below 768 px it is left-aligned with CTAs stacked full-width
**And** the primary CTA is an `<a href="#contacto">` (UX-DR30 baseline)
**And** the secondary CTA `<a href="#servicios">` renders only while `servicios` is in the visible-section list, so no CTA ever points at a missing section

### Story 1.8: Sticky Header and Section Navigation

As a Visitor,
I want a header that stays visible and takes me to any section with one action,
So that I can find what I need and always reach the quote CTA.

**Acceptance Criteria:**

**1.8-AC-01**
**Given** the page shell
**When** it renders
**Then** the header shows the white kVA logo linking to `#inicio` with accessible name "kVA Instalaciones", the "Instalaciones" wordmark ≥ 768 px, section links in the order Servicios · Proyectos · Nosotros · Confianza · Contacto (≥ 1024 px), and the Header contact CTA "Cotiza tu proyecto" (visible "Cotiza" < 768 px) linking to `#contacto` (FR2, FR3, UX-DR8)
**And** only sections in the facade's visible-section list get a header link (FR1)

**1.8-AC-02**
**Given** any scroll position on mobile or desktop
**When** the Visitor scrolls
**Then** the header stays sticky, is transparent over the Hero until scrollY > 24 px, then condenses to solid `ink` with a divider, and `scroll-padding-top` tracks the current header height (UX-DR8)

**1.8-AC-03**
**Given** the `section-navigation` behavior model in `src/app/behaviors/section-navigation.behavior.ts`
**When** its table-driven unit tests run
**Then** table-driven tests call the production `transition` function and assert supported/unsupported results; interaction tests verify the adapter applies each non-null result once and applies no effects for `null`; effects come only from the closed union executed by `core/effects`, extended here with focus, scroll, and navigate executors (AD-7)

**1.8-AC-04**
**Given** `core/layers` created in this story as the sole owner of `history.replaceState` and the only `popstate` listener, with serialized history operations (AD-5)
**When** the Visitor activates a section link with JavaScript enabled
**Then** the page scrolls smoothly (instantly under `prefers-reduced-motion`), focus moves to the section `<h2 tabindex="-1">`, and the fragment updates via `history.replaceState` requested through `core/layers` (FR1, UX-DR11)
**And** the current section link carries `aria-current="location"` via scroll-spy with the copper underline

**1.8-AC-05**
**Given** the skip link "Saltar al contenido"
**When** the Visitor presses Tab on page load
**Then** it is the first focusable element, becomes visible, and moves focus to `<main id="main" tabindex="-1">` (UX-DR9)

### Story 1.9: Mobile Menu

As a Visitor on a phone or tablet,
I want a menu button that reveals the section links,
So that I can navigate the page on a small screen.

**Acceptance Criteria:**

**1.9-AC-01**
**Given** a viewport narrower than 1024 px with JavaScript enabled
**When** the page renders
**Then** a "Menú" button (`aria-expanded`, `aria-controls="menu-movil"`) shows instead of inline links, and `<nav id="menu-movil" aria-label="Secciones">` is inside the header (UX-DR10)

**1.9-AC-02**
**Given** the `mobile-menu` behavior model
**When** its table-driven tests run
**Then** table-driven tests call the production `transition` function and assert open, close, Esc, Back, toggle, link-choice, and unsupported results; interaction tests verify the adapter applies each non-null result once and applies no effects for `null` (AD-7)

**1.9-AC-03**
**Given** the menu is closed
**When** the Visitor activates "Menú"
**Then** the full-height `ink` sheet opens with section links and the Header contact CTA at the bottom, `<main>` and `<footer>` become `inert`, focus is trapped across header + sheet, body scroll locks, and `core/layers` (extended in this story with `pushState` and guarded `history.back()`) pushes one history entry (AD-5)

**1.9-AC-04**
**Given** the menu is open
**When** the Visitor presses Esc, uses browser Back, or activates the toggle
**Then** the menu closes, the history entry is consumed, and focus returns to the toggle

**1.9-AC-05**
**Given** the menu is open
**When** the Visitor chooses a section link
**Then** the menu closes, the history entry is consumed, the fragment is replaced, and focus lands on the target section heading (FR1)

**1.9-AC-06**
**Given** JavaScript is disabled
**When** the page renders below 1024 px
**Then** the menu button is hidden and section links show as a wrapped row (UX-DR30)

## Epic 2: Services Catalogue

A Visitor sees kVA's four Services from the brochure as cards with every Sub-service (hook items first), collapsible on mobile, each with a CTA toward contact.

### Story 2.1: Services Section with the Four Brochure Service Cards

As a plant engineer or facilities manager,
I want to see every Service kVA offers with its full Sub-service list,
So that I can confirm kVA covers my specific electrical need.

**Acceptance Criteria:**

**Given** `content/services/<slug>.md` for the four Services seeded from brochure p05 (Desarrollo e Ingeniería de Proyecto, Instalaciones, Puesta en marcha y Validaciones, Servicios de Datos) with hook Sub-services first and "Mantenimiento preventivo y correctivo a:" kept as one item (UX-DR28)
**When** `services.content.ts` is validated against `service.schema.json`
**Then** each Service has an immutable `id` equal to its slug, name, description, order, Sub-services list, optional image (with `alt`), and optional CTA label; invalid content fails validation naming item and field (FR5, AD-12)
**And** a test proves Service IDs are unique

**Given** the Services section `#servicios` with title "Servicios integrales de instalaciones eléctricas"
**When** the page is prerendered
**Then** one card per Service renders in Content doc order with name, description, every Sub-service as an en-dash list in Content doc order, and the CTA "Cotiza este servicio" (or the Service's visit-led label "Solicita una visita técnica") (FR5, UX-DR13)
**And** all Sub-services are present in the served HTML
**And** `#servicios` joins the facade's visible-section list, so the "Servicios" header link appears

**Given** a Service whose Content doc sets an image
**When** its card renders
**Then** a 3:1 darkened image band shows at the top via the shared responsive-image component; a Service without an image renders with no empty slot (FR5)

**Given** the card layout
**When** the viewport changes
**Then** the grid is 1 column < 768, 2 columns ≥ 768, 2×2 ≥ 1024, 4 across ≥ 1440; the title sits in its corner-bracket frame; the CTA (`button-primary-on-light`) is pinned to the card bottom

**Given** the Service CTA before Epic 3
**When** the Visitor activates it
**Then** it is an `<a href="#contacto">` to the Contact section (Story 1.6) and works without JavaScript

**Given** a fifth valid Service added as a Content-only change
**When** the page is rebuilt
**Then** five cards render with no component change (NFR5)

### Story 2.2: Collapsible Sub-Service Lists on Mobile

As a Visitor on a phone,
I want long Sub-service lists shortened with a control to expand them,
So that I can scan all four Services quickly and open the one I care about.

**Acceptance Criteria:**

**Given** the `service-card-disclosure` behavior model
**When** its table-driven tests run
**Then** expand and collapse transitions and their focus/announce effects are covered (AD-7)

**Given** a viewport < 768 px with JavaScript enabled and a Service with more than 4 Sub-services
**When** the card renders
**Then** the first 4 Sub-services show plus a `button-text` toggle "Ver los {n} servicios" with chevron and `aria-expanded="false"` (UX-DR13)

**Given** the collapsed list
**When** the Visitor activates the toggle
**Then** the full list shows, the label becomes "Ver menos", `aria-expanded="true"`, and focus stays on the toggle

**Given** a viewport ≥ 768 px, or JavaScript disabled
**When** the card renders
**Then** the full list shows and no toggle is rendered

## Epic 3: Contact kVA (Lead Capture)

A Visitor reaches kVA in one step from any CTA: the Contact composer that opens a tagged email (pre-filled from any Service CTA), the Privacy notice dialog, and a WhatsApp slot hidden until a number exists.

### Story 3.1: Open the Contact Composer from Any Contact CTA

As a Visitor,
I want any "Cotiza" button to open a contact panel right where I am,
So that contacting kVA is always one step away.

**Acceptance Criteria:**

**Given** `core/layers` (from Stories 1.8 and 1.9) extended in this story with modal overlays and the `OVERLAY_COMPONENTS` token provided only by the app shell
**When** a feature requests an overlay by ID
**Then** `core/layers` alone opens it through `MatDialog` with `closeOnNavigation: false`, marks everything outside it `inert`, traps focus in the topmost overlay, locks body scroll, pushes one history entry, and serializes history operations (AD-1, AD-5, UX-DR25)
**And** Back closes the topmost overlay; close button, Esc, and scrim close it and consume the entry with a guarded `history.back()`; Esc is ignored while a native `<select>` is open; focus returns to the invoker

**Given** the `contact-cta` behavior model
**When** its tests run
**Then** open-from-header, open-from-hero, open-from-contact-section, and close transitions are covered

**Given** JavaScript is enabled after hydration (`enhanced` signal)
**When** the Visitor activates the Header contact CTA, the Hero primary CTA, or the Contact section button
**Then** the Contact composer opens as a 440 px right slide-in panel ≥ 768 px or a full-screen sheet < 768 px over the scrim, labeled by "Cotiza tu proyecto", described by its intro, rendering the email, Service, and consent field markup (validation and submit arrive in Story 3.3) with focus on the email field (FR2, UX-DR23)
**And** those CTAs gain `aria-haspopup="dialog"` only after hydration, and the Contact section button switches from its tagged `mailto:` to opening the composer

**Given** the composer opened from the header
**When** it opens
**Then** no Service is pre-selected and any earlier choice is kept

### Story 3.2: Privacy Notice Dialog

As a Visitor,
I want to read the privacy notice in a dialog without losing my place or what I typed,
So that I can consent knowingly.

**Acceptance Criteria:**

**Given** the `privacy-notice` behavior model
**When** its tests run
**Then** open-from-footer, open-over-composer, and close transitions are covered

**Given** JavaScript is enabled
**When** the Visitor activates the footer "Aviso de privacidad"
**Then** `core/layers` opens the Privacy notice as a paper dialog ≤ 720 px (full-screen < 768 px) with an `h2` title, a scrollable body (`tabindex="0"`), and a sticky "Cerrar" bar; closing by Cerrar, Esc, or Back returns focus to the footer link (FR14, UX-DR24)
**And** without JavaScript the link still jumps to `#aviso`

**Given** the Contact composer is open and requests the Privacy notice
**When** the notice opens
**Then** it stacks above the composer with its own scrim, the composer is `inert` beneath, and this is the only permitted overlay stack (AD-5)
**And** closing the notice returns focus to the requesting control with composer values intact (FR14)

### Story 3.3: Compose and Hand Off a Tagged Lead Email

As a plant engineer,
I want to enter my email and Service and have my email app open with a ready message to kVA,
So that I can request a quote in seconds without the site storing my data.

**Acceptance Criteria:**

**Given** the `contact-composer` behavior model
**When** its tests run
**Then** pristine, editing, field-error, submitted, edit-again, and reopen transitions are covered

**Given** the open composer
**When** it renders
**Then** it shows the required note, the email field (`type="email" autocomplete="email" inputmode="email"`, label "Tu correo electrónico", hint "Ahí te responderemos."), the Service select ("Servicio de interés", empty option "Elige un servicio", one option per Service), the consent checkbox "He leído y acepto el Aviso de privacidad." with a separate "Leer el Aviso de privacidad" link that opens the Privacy notice dialog over the composer (Story 3.2), and the never-disabled submit "Abrir mi correo" (FR11, FR14, UX-DR23)

**Given** invalid input
**When** a field blurs after an edit or the Visitor submits
**Then** inline errors ("Escribe tu correo electrónico.", "Revisa tu correo: debe tener el formato nombre@empresa.com.", "Elige un servicio.", "Para continuar, acepta el Aviso de privacidad.") appear with `aria-invalid`, `aria-describedby` = hint then error, danger outline and icon; on submit focus moves to the first invalid field and a polite summary "Revisa {n} campos: {lista}." is announced

**Given** valid input
**When** the Visitor submits
**Then** the contact-link builder produces `mailto:proyectos1@kvainstalaciones.mx` with subject "[kvainstalaciones.mx] {servicio}" and body "Hola, kVA: / Me interesa: {servicio} / Mi correo: {email}" using `encodeURIComponent` and `%0D%0A`, and the browser navigates to it (FR11, FR13)
**And** nothing is sent over the network or stored in cookies, local storage, or session storage (NFR4, AD-6)

**Given** a submitted composer
**When** the post-submit state shows
**Then** focus moves to "Abrimos tu app de correo" (`h3 tabindex="-1"`), described by "Si no se abrió tu correo, escríbenos a proyectos1@kvainstalaciones.mx", with actions Listo, Editar datos, and Copiar correo (with Copy status) (FR12)
**And** "Listo" closes like the close button; "Editar datos" restores the filled form and focuses the email field

**Given** the in-memory Contact draft in `core/contact`
**When** the composer is closed and reopened
**Then** values are restored, the filled form (not post-submit state) shows, and nothing is persisted beyond the page session

### Story 3.4: Service CTA Pre-Fills the Contact Composer

As a plant engineer reading a Service card,
I want its CTA to open the composer with that Service already selected,
So that I can ask about exactly what I need with less typing.

**Acceptance Criteria:**

**Given** the `service-cta-prefill` behavior model
**When** its tests run
**Then** prefill-from-service transitions are covered and the overlay input carries the typed `serviceId` (AD-12)

**Given** JavaScript is enabled
**When** the Visitor activates a Service card CTA
**Then** the Contact composer opens with that Service selected and focus on the email field (FR6)
**And** the Visitor can still change the Service
**And** reopening from the Header CTA afterwards keeps the last choice

**Given** JavaScript is disabled
**When** the Visitor activates a Service CTA
**Then** it still navigates to `#contacto`

### Story 3.5: WhatsApp CTA Slot

As kVA,
I want a WhatsApp CTA that switches on when we add our number,
So that Visitors can chat with us without a code change.

**Acceptance Criteria:**

**Given** the site content has no WhatsApp number
**When** the page is prerendered
**Then** no WhatsApp CTA is rendered and the Contact section leaves no gap (FR17)

**Given** a valid E.164 `+52…` number set as a Content-only change (verified in a test fixture)
**When** the page renders
**Then** "Escríbenos por WhatsApp" (`button-ghost-on-dark` + chat icon) links to `https://wa.me/<digits>?text=` with the encoded prefill "[kvainstalaciones.mx] Hola, kVA. Me interesa cotizar un proyecto.", opening in a new tab (`whatsapp-cta` behavior model with tests)

**Given** an invalid WhatsApp number in site content
**When** content validation runs
**Then** it fails naming the field

**Given** a site content fixture with a WhatsApp number
**When** content validation runs without a WhatsApp paragraph in the privacy-notice content
**Then** validation fails, so the notice always covers the WhatsApp channel (FR17)

## Epic 4: Project Portfolio

A Visitor browses kVA's nine brochure Projects, filters them by Service, opens a detail view with a photo carousel, and starts a quote for a similar project; placeholder Projects are clearly labeled.

### Story 4.1: Project Grid with the Nine Brochure Projects

As a facilities manager vetting kVA,
I want to see kVA's real projects with photos,
So that I can judge the kind of work kVA has done.

**Acceptance Criteria:**

**Given** `content/projects/<slug>.md` for the nine brochure Projects with the EXPERIENCE.md Service mapping, and the 20 photos generated by the image pipeline (Story 1.4)
**When** `projects.content.ts` is validated against `project.schema.json`
**Then** each Project has an `id` equal to its slug, title, `serviceId`, placeholder flag, and photos each with required `alt` (Spanish, ≤ 125 chars, not the title), `source` ("Brochure kVA 2025"), and `license` ("supplied by kVA"); optional summary, scope, outcome, location, year, standards (FR8, FR9, UX-DR28)
**And** a photo missing `alt`, `source`, or `license` fails validation naming the Project and field
**And** a test proves every `serviceId` resolves and Project IDs are unique (AD-12)

**Given** the Proyectos section `#proyectos`
**When** the page is prerendered
**Then** it opens with the title band (`wiring-technician.jpg` + overlay, `h2` "Proyectos" + corner rule bottom-left, white logo top-right) followed by a `paper-2` grid (1 / 2 / 3 columns) of Project cards (UX-DR14, UX-DR16)
**And** each card is an `<article>` with a 4:3 lazy photo (`alt=""`), Service overline, `<h3>` title in sentence case, and the one-line summary only when present
**And** all Project titles are in the served HTML and `#proyectos` joins the visible-section list

**Given** a Project marked placeholder (verified with a fixture)
**When** its card renders
**Then** a text badge "Ejemplo Ilustrativo" shows on the photo (FR9)

**Given** no Projects in content (fixture)
**When** the page renders
**Then** the Proyectos section and its header link are not rendered (FR7)

**Given** a card photo that is loading or fails
**When** the card renders
**Then** a fixed 4:3 `paper-2` box holds the space and the title still names the card (UX-DR5)

### Story 4.2: Filter Projects by Service

As a facilities manager,
I want to filter projects by Service,
So that I only see work relevant to my need.

**Acceptance Criteria:**

**Given** the `project-filter` behavior model
**When** its tests run
**Then** select-service, select-all, and active-chip-press (no-op) transitions are covered

**Given** at least two Services have Projects and JavaScript is enabled
**When** the section renders
**Then** a labeled group "Filtrar proyectos por servicio" shows chips "Todos" plus one per Service with ≥ 1 Project, as `<button aria-pressed>`, "Todos" active by default (FR7, UX-DR15)

**Given** the Visitor activates a Service chip
**When** the filter applies
**Then** only matching Projects show instantly with no reload or network request, focus stays on the chip, the active chip shows fill + check icon + `aria-pressed="true"`, and the visible polite live count reads "{n} proyectos: {servicio}" (or "{n} proyectos en total" for Todos)

**Given** fewer than two Services have Projects (fixture)
**When** the section renders
**Then** no filter is rendered and all Projects show

**Given** JavaScript is disabled
**When** the section renders
**Then** chips are hidden and all Projects show (UX-DR30)

### Story 4.3: Project Detail View

As a facilities manager,
I want to open a project to see its details without leaving the page,
So that I can evaluate the work and return to where I was.

**Acceptance Criteria:**

**Given** the `project-detail` behavior model
**When** its tests run
**Then** open, close (button, Esc, Back, scrim), and focus-return transitions are covered

**Given** JavaScript is enabled
**When** the Visitor activates a Project card's title button (`aria-haspopup="dialog"`, hit area stretched over the card) by click, tap, Enter, or Space
**Then** `core/layers` opens the Project detail view as a paper dialog ≤ 1080 px (full-screen sheet < 1024 px) labeled by the title, with DOM order Close, title block (Service overline, `h2 tabindex="-1"` title + bar heading), photo area, details; focus goes to the title (FR8, UX-DR17)

**Given** a Project with or without Alcance, Resultado, location, year, or standards
**When** the view renders
**Then** each field renders only when present, proof fields as a definition list, never as an empty label (launch rule)
**And** a placeholder Project shows the "Ejemplo Ilustrativo" badge beside the title

**Given** the open view
**When** the Visitor closes it by Cerrar, Esc, or Back
**Then** focus returns to the originating card button and the active filter is unchanged

**Given** JavaScript is disabled
**When** the section renders
**Then** cards are not interactive and remain readable

### Story 4.4: Project Photo Carousel

As a Visitor in the project detail view,
I want to step through the project's photos one at a time,
So that I can see the work clearly on any device.

**Acceptance Criteria:**

**Given** the `project-carousel` behavior model
**When** its tests run
**Then** next, previous, wrap (last → first), thumbnail-select, and swipe transitions are covered

**Given** a Project with two or more photos
**When** the detail view opens
**Then** a region (`aria-roledescription="carrusel"`, "Fotos de {title}") holds arrow controls "Foto anterior"/"Foto siguiente" then slides (`role="group"`, `aria-roledescription="foto"`, "{i} de {n}"), photos `contain`-fit on the `ink-2` stage, a counter, and thumbnails ≥ 768 px with `aria-current` (FR8, UX-DR18)
**And** ≥ 1024 px the carousel takes 7/12 and details 5/12

**Given** focus is inside the carousel
**When** the Visitor presses ←/→, clicks arrows, taps a thumbnail, or swipes ≥ 40 px
**Then** the photo changes, "Foto {i} de {n}: {alt}" is announced politely, adjacent photos are preloaded, and nothing rotates automatically
**And** every swipe has a button path (WCAG 2.5.7)

**Given** a Project with one photo
**When** the view opens
**Then** no arrows, counter, thumbnails, or swipe are present

**Given** a photo that is loading or fails
**When** the stage renders
**Then** the stage keeps its size and shows the alt text in `small` paper

### Story 4.5: Quote a Similar Project

As a facilities manager impressed by a project,
I want to request a quote for similar work straight from the detail view,
So that kVA knows which kind of work I am asking about.

**Acceptance Criteria:**

**Given** the `service-cta-prefill` model extended with the project entry point
**When** its tests run
**Then** the project-to-composer transition is covered

**Given** the open Project detail view
**When** the Visitor activates "Cotiza un proyecto similar"
**Then** the detail view closes and the Contact composer opens with the Project's Service selected, focus on the email field, and the history entry is replaced, not stacked (FR8, AD-5)

**Given** the composer opened from a Project
**When** the Visitor closes it
**Then** focus returns to the originating Project card

## Epic 5: About kVA and Trust

A Visitor reads kVA's philosophy, mission, vision, and values, sees confirmed Trust items, and sees the client groups kVA has permission to name.

### Story 5.1: Nosotros Section

As a Visitor shortlisting contractors,
I want to read kVA's philosophy, mission, vision, and values,
So that I understand how kVA works before contacting them.

**Acceptance Criteria:**

**Given** `content/nosotros.md` reworded from brochure p02–p04 (no "líderes", "los más altos estándares", "superar expectativas"; "kVA" casing; "Compromiso" spelling) and `nosotros.schema.json`
**When** content validation runs
**Then** philosophy, mission, vision, and the six values (Excelencia, Seguridad, Integridad, Compromiso, Colaboración, Adaptabilidad) with name and description validate (FR18, UX-DR28)
**And** a test fails if published copy contains any §2.4 unsupported superlative or "KVA"

**Given** the Nosotros section `#nosotros`
**When** the page is prerendered
**Then** it renders the split layout (5/12 `electrical-panel-technician.jpg` + overlay with `h2` title bottom-left | 7/12 paper ≥ 1024; photo band above content below) with three bands: Nuestra filosofía (`h3`), overline "Esencia corporativa" over Misión and Visión (`h3` with sub-head rules), and Nuestros valores as a `<dl>` run-in "NAME: description", 2 columns ≥ 768 (UX-DR19)
**And** the corner-bracket frames sit per DESIGN.md › Shapes, and `#nosotros` joins the visible-section list

**Given** a value added or removed as a Content-only change
**When** the page is rebuilt
**Then** the values list reflects it with no component change

**Given** Nosotros content is absent (fixture)
**When** the page renders
**Then** the section and its header link are not rendered

### Story 5.2: Confirmed Trust Items

As a risk-averse buyer,
I want to see verifiable credibility claims,
So that I can defend recommending kVA internally.

**Acceptance Criteria:**

**Given** `content/trust/<slug>.md` for 3+ años, Cobertura en todo México, and NOM-001-SEDE-2012, and `trust-item.schema.json`
**When** content validation runs
**Then** each item has an `id`, claim, kind (general or registration/certification), confirmed flag, and optional evidence reference; a registration/certification without evidence fails validation (FR10)

**Given** the Confianza section `#confianza`
**When** the page is prerendered
**Then** only confirmed Trust items render in a row (stacked < 768) with a `stat` figure, muted caption, and the evidence reference beside it when present (UX-DR20)
**And** `#confianza` joins the visible-section list

**Given** the Hero proof point
**When** content validation runs
**Then** it must reference a confirmed Trust item or a site fact, otherwise validation fails (FR4)

**Given** no confirmed Trust items and no permitted client group (fixture)
**When** the page renders
**Then** the Confianza section and its header link are hidden, while the Hero proof point stays

### Story 5.3: Clientes List with Permission

As a facilities manager,
I want to see which organizations kVA has worked for,
So that I can trust kVA has done comparable enterprise work.

**Acceptance Criteria:**

**Given** `content/clients/<slug>.md` for the five brochure p09 groups and `client.schema.json`
**When** content validation runs
**Then** each group has an `id`, name, optional scope line, items list, order, and one `permission` flag covering name, scope line, and items (FR19)

**Given** client groups with and without recorded permission
**When** the page is prerendered
**Then** only permitted groups render under "Clientes que inspiran nuestro trabajo" as text in Content doc order, each with name over a divider, scope line when present, and items in 2 sub-columns; groups in 2 columns ≥ 1024 with the right column right-aligned; no logos (UX-DR20)
**And** an unpermitted group's name and items appear nowhere in the served HTML or metadata

**Given** no permitted client group (fixture)
**When** the page renders
**Then** the Clientes list is not rendered and Trust items are unaffected

**Given** a Project with an optional `clientGroupId`
**When** the Project detail view renders
**Then** the "Cliente" proof field renders only when that group is permitted; Project titles naming an organization are exempt (FR8, FR19)
**And** a test proves every `clientGroupId` resolves (AD-12)

## Epic 6: Search, Sharing and Launch Readiness

The page is findable and previews well on WhatsApp, LinkedIn, and email, and passes the launch checks.

### Story 6.1: Search and Share Metadata with Structured Data

As a Visitor who finds or shares kVA's page,
I want accurate search results and rich link previews,
So that I recognize kVA and can share it with colleagues.

**Acceptance Criteria:**

**Given** SEO fields in the site content (title, meta description, canonical URL, Open Graph and Twitter title/description/image)
**When** the page is prerendered
**Then** the served HTML, without running JavaScript, contains the title, meta description, canonical link, Open Graph tags, and Twitter card tags from Executable content (FR16, AD-8)

**Given** the published contact channels
**When** the page is prerendered
**Then** a non-executable `<script type="application/ld+json">` describes an `ElectricalContractor` with name, URL, email `proyectos1@kvainstalaciones.mx`, telephone `+52 56 4000 3344`, and `areaServed` MX, and contains no unpermitted client or unpublished channel (FR16, FR19, FR20)
**And** the CSP and static verification still pass (AD-10)

### Story 6.2: Share Image, robots.txt and sitemap.xml

As kVA,
I want a dedicated share image and crawler files,
So that the page is indexed and previews look professional.

**Acceptance Criteria:**

**Given** the cover photo, overlay, and white logo
**When** the share image is produced
**Then** a 1200×630 px image is served from `public/media/`, referenced by the Open Graph and Twitter image tags, and never upscaled from a smaller original (FR16, UX-DR32)

**Given** the build output
**When** it is deployed
**Then** `robots.txt` allows crawling and points to `sitemap.xml`, and `sitemap.xml` lists the canonical URL, both under the Pages base href

**Given** the static verification script
**When** it runs on the build output
**Then** it fails if the share image, `robots.txt`, or `sitemap.xml` is missing

### Story 6.3: Scroll Reveal and Motion

As a Visitor,
I want subtle, purposeful motion,
So that the page feels polished without distracting or slowing me down.

**Acceptance Criteria:**

**Given** hydration has completed
**When** an element below the fold at that moment scrolls into view
**Then** it fades in with a 12 px rise over 400 ms, once (IntersectionObserver threshold 0, `rootMargin: 0 0 -10% 0`), and `focusin` reveals it immediately (UX-DR29)
**And** the Hero and anything already in view are never hidden, and prerendered CSS never hides content

**Given** `prefers-reduced-motion: reduce` or `scripting: none`
**When** the page renders
**Then** no reveals, smooth scroll, slides, or scale run, and every state change is instant

**Given** hover, press, panel, dialog, and header-condense motion
**When** they run
**Then** they use the DESIGN.md motion tokens and introduce no layout shift (CLS ≤ 0.1)

### Story 6.4: No-JavaScript and Accessibility Verification

As a Visitor using assistive technology, an older browser, or no JavaScript,
I want the page to stay fully usable,
So that nobody is excluded from contacting kVA.

**Acceptance Criteria:**

**Given** JavaScript is disabled
**When** the built page is viewed
**Then** all content is visible with no reveals, nav links wrap below 1024 px, chips, copy buttons, and menu button are hidden, Project cards are not interactive, contact CTAs are tagged `mailto:` or `#contacto` links, and the footer privacy link jumps to `#aviso` (UX-DR30)

**Given** the built page
**When** automated accessibility checks run (axe via Playwright, run locally, not added as a dependency without approval)
**Then** there are no WCAG 2.2 AA violations: one `<h1>`, no skipped headings, labeled landmarks, targets ≥ 24 px (44 px for primary touch targets), visible `:focus-visible` rings per surface, underlined inline links (NFR2, UX-DR31)

**Given** viewports of 320 px, 200% zoom, and the text-spacing bookmarklet
**When** each section is checked
**Then** there is no clipped or overlapping text and no horizontal scroll

**Given** the NFR3 browser matrix
**When** the key flows (navigate, compose, copy, filter, open project) are run
**Then** they work in current Chrome, Edge, Firefox, Safari, iOS Safari, and Chrome for Android

### Story 6.5: Launch Readiness Checks

As kVA,
I want proof that the page meets its performance, SEO, and extensibility targets,
So that we can launch with confidence.

**Acceptance Criteria:**

**Given** the production build
**When** Lighthouse mobile (simulated throttling) runs against the built static output
**Then** Performance ≥ 90, Accessibility 100, SEO 100, LCP ≤ 2.5 s, CLS ≤ 0.1, TBT ≤ 200 ms, and the build stays within `angular.json` budgets (SM-2, NFR1)

**Given** the built output
**When** static verification runs
**Then** no cookies, storage writes, third-party requests, or executable inline scripts exist (NFR4)

**Given** a temporary branch
**When** a fifth Service and a tenth Project are added as Content-only changes and the page is rebuilt
**Then** a fifth card, a fifth composer option, and the new Project appear with no component, template, style, or behavior-model change, and the branch is discarded (SM-3, NFR5)
