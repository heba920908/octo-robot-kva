---
title: "EXPERIENCE: kVA Instalaciones Landing Page"
name: kVA Instalaciones
status: final
created: 2026-10-21
updated: 2026-10-22
sources:
  - ../../prds/prd-agency-portfolio-2026-10-19/prd.md
  - ../../prds/prd-agency-portfolio-2026-10-19/addendum.md
  - ../../briefs/brief-agency-portfolio-2026-10-19/brief.md
  - ../../../../.specify/memory/constitution.md
  - imports/brochure-text.md
---

# kVA Instalaciones — Experience Spine

## Foundation

One es-MX page, mobile-first: an Angular SPA prerendered at build time (single route, static
files; addendum). No backend: every contact leaves through the Visitor's own email client
(`mailto:`), phone dialer (`tel:`), or clipboard. Content docs are the editorial source for
Angular content, not a rendering or build input. The microcopy below is the **default copy for
the UI strings Content doc** (FR-15). Visual identity
and tokens live in `DESIGN.md`, cited here as `{colors.accent}` etc. Brochure renders
(`imports/brochure-pages/`) and key screens are references; **the spines win on any
conflict**. Glossary terms are the PRD's (§3), verbatim.

Key-screen mockups (drafted copy is illustrative; the Default UI strings win):
[key-landing](mockups/key-landing.html) (IA order, section rhythm, Reference viewport),
[key-projects](mockups/key-projects.html) (Flow 2, steps 1–4),
[key-contact](mockups/key-contact.html) (Flow 1, steps 4–7).

UI library (architecture decision, 2026-10-22): Angular Material first, prioritizing ready-made
controls and lower maintenance over brochure fidelity. Theme it through supported APIs and
DESIGN.md tokens; use Angular CDK only where Material has no suitable control.

**Overrides to the PRD** (from the UX decision log; see Open Question 1):
1. **Services:** 4 Service cards from the brochure (p05) + data services (see IA).
2. **Projects:** real brochure Projects at launch, even without Alcance/Resultado; the
   Placeholder project mechanism stays.
3. **Contact channels:** contact name, proyectos1@kvainstalaciones.mx, and (56) 4000 3344 as a
   `tel:` link in the Contact section and footer. proyectos2@ and (56) 4029 4029 are not
   published (user, 2026-10-21; PRD §7).
4. **Nosotros:** new section (philosophy, mission, vision, values) and header link.

**Spine terms** (now in the PRD Glossary, updated 2026-10-21):

- *Project carousel* — the one-photo-at-a-time viewer in the Project detail view.
- *Copy status* — the "Copiado" confirmation beside a copy control.
- *Nosotros* — the About section and its Content doc.
- *Clientes entry* — one client name in the Trust section's client list; shown only with
  recorded permission.
- *Proyectos title band* — the darkened photo band that opens Proyectos.

**Behaviour models** (constitution II): every interactive component has a model in
`src/app/behaviors/` before code; static components (Hero copy, Nosotros, Trust items, Badge,
footer text) need none. `*` = added by the spines (PRD update).

| Interactive component | Behaviour model ID |
|---|---|
| Skip link, Header and Mobile menu links, "Ver servicios", Section heading | `section-navigation` |
| Menu button, Mobile menu | `mobile-menu` |
| Header contact CTA, Hero primary CTA, Contact section composer button | `contact-cta` |
| Service card CTA, "Cotiza un proyecto similar" | `service-cta-prefill` |
| Service list toggle | `service-card-disclosure` * |
| Project filter (chips, "Ver todos", result count) | `project-filter` |
| Project card, Project detail view | `project-detail` |
| Project carousel | `project-carousel` * |
| Contact composer (fields, submit, post-submit actions) | `contact-composer` |
| Copy buttons and Copy status (Contact section, post-submit) | `copy-address` |
| Email and phone links (Contact section, footer) | `direct-contact-links` * |
| WhatsApp CTA | `whatsapp-cta` |
| Privacy notice (consent link, footer link) | `privacy-notice` |

## Information Architecture

| Surface | Reached from | Purpose | Realizes |
|---|---|---|---|
| Header | Always (sticky) | Logo, section links, Header contact CTA | FR-1, FR-2, FR-3 |
| Hero `#inicio` | Page load, logo | Who kVA is, proof point, CTAs | FR-4 |
| Servicios `#servicios` | Nav, Hero secondary CTA | 4 Service cards with CTAs | FR-5, FR-6 |
| Proyectos `#proyectos` | Nav | Title band, Project filter, Project cards | FR-7, FR-9 |
| Nosotros `#nosotros` | Nav | Philosophy, mission, vision, values | Override 4 |
| Confianza `#confianza` | Nav | Trust items + Clientes list | FR-10 |
| Contacto `#contacto` | Nav | Channels, Copy-address fallback, WhatsApp CTA | FR-12, FR-17 |
| Footer | End of page | Legal identity, channels, Privacy notice link | FR-3, FR-14 |
| Mobile menu (disclosure) | Menu button < 1024 | Section links | FR-1 |
| Contact composer (panel) | Any contact CTA | Email, Service, consent → `mailto:` | FR-11, FR-13 |
| Project detail view (dialog) | Project card | Carousel, scope, outcome, proof | FR-8 |
| Privacy notice (dialog) | Consent link, footer | Aviso de privacidad | FR-14 |

Header links, in order: Servicios · Proyectos · Nosotros · Confianza · Contacto. A section
hidden by its State Pattern also drops its header link. Modal overlays never stack, except the
Privacy notice above the Contact composer. Section surfaces and rhythm: DESIGN.md › Layout &
Spacing.

The tables below are the **launch seed for Content docs**; once the docs exist, they are the
editorial source for Angular content.

**Services** ([brochure-text.md](imports/brochure-text.md) page 5). Sub-services carrying the
PRD §2.4 hook come first, so they show while the list is collapsed:

| # | Service | Sub-services | §2.4 hook |
|---|---|---|---|
| 1 | Desarrollo e Ingeniería de Proyecto | 9; calidad de energía first | CFE GDMTH, power factor |
| 2 | Instalaciones | 6; cableado and Voz/Datos first | NOM-001, UVIE; ANSI/TIA-568 |
| 3 | Puesta en marcha y Validaciones | 5 (see note) | Failed inspections, downtime |
| 4 | Servicios de Datos | Decisiones con datos · Operación visible · Datos en orden | Outcomes |

Note: "Mantenimiento preventivo y correctivo a:" is one item; its three targets (plantas de
emergencia, UPS, reguladores; transformadores; sistemas de iluminación) stay together.
[ASSUMPTION] Service 4 wording (outcome-led, §2.4). Former PRD Services: structured cabling and
electrical installations → Instalaciones; power consumption analysis → Desarrollo e Ingeniería
("Análisis de calidad de energía") and Puesta en marcha ("Validación de calidad de energía").

**Projects** (photos in `assets/media/brochure/projects/`; Service mapping [ASSUMPTION]):

| Project (brochure title) | Photos | Service |
|---|---|---|
| Red Ambiental | 2 | Instalaciones |
| Larousse | 2 | Instalaciones |
| Canalización y Cableado (Industrial y Comercial) | 4 | Instalaciones |
| Site en Sistema Paralelo Redundante, Industria Farmacéutica | 2 | Instalaciones |
| Maniobras de Equipos Eléctricos | 1 | Instalaciones |
| Acometidas en Media y Baja Tensión | 2 | Instalaciones |
| Canalización y Cableado de Alimentadores | 5 | Instalaciones |
| Sistema de Tierras y Pararrayos | 1 | Puesta en marcha y Validaciones |
| Mantenimiento a Equipos | 1 | Puesta en marcha y Validaciones |

Resulting Project filter: Todos · Instalaciones · Puesta en marcha y Validaciones (FR-7 only
lists Services with Projects). Each photo records `alt`, `source`, and `license` (FR-9).

**Nosotros** (brochure p02–p04, reworded per §2.4; kVA approves, Open Question 7):

| Block | HTML | Content |
|---|---|---|
| Nuestra filosofía | `<h3>` | Quality and safety in every project; lasting client relationships |
| Esencia corporativa | overline `<p>` | Misión `<h3>` and Visión `<h3>` (p03) |
| Nuestros valores | `<h3>` + `<dl>` | 6 values, run-in "NAME: description" |

Values: Excelencia · Seguridad · Integridad · Compromiso (brochure typo "Compromismo") ·
Colaboración · Adaptabilidad.

**Clientes** (brochure p09; group ↔ item assignment read from the layout [ASSUMPTION]):

| Group | Scope line | Items |
|---|---|---|
| Oficinas Gubernamentales | Sucursales | Guadalajara, Morelia, Culiacán, Cd. Obregón, Toluca |
| Grupo Accionario Attie | Remodelación y mantenimiento | Corporativo, 3 predios, Radiatas, … (8) |
| Clientes Varios | — | Site farmacéutica, call center, tiendas, sucursales bancarias |
| Inmobiliaria Goytia | Remodelación y mantenimiento | Corporativo, Torre Axis, … (6) |
| CHR Construcciones | — | Red Ambiental, Keyence, The Pool, Sulzer, NSC Asesores, … (8) |

## Voice and Tone

Microcopy only; brand posture: DESIGN.md › Brand & Style. es-MX, *tú*, confident and concrete.
No unsupported superlatives, including brochure phrases ("líderes", "los más altos estándares",
"superar expectativas"); claims point to Trust items or Projects.

| Do | Don't |
|---|---|
| "Cotiza tu proyecto" · "Solicita una visita técnica" | "¡Contáctanos ya!" |
| "Instalaciones conforme a NOM-001-SEDE-2012" | "Somos líderes en la industria" (brochure claim) |
| "3+ años · Cobertura en todo México" | "Años de experiencia" (vague) |
| "kVA" | "KVA" (brochure casing) |
| "Abrir mi correo" (says what happens) | "Enviar" (the site sends nothing) |
| "Revisa tu correo: debe tener el formato nombre@empresa.com." | "Error: campo inválido" |
| Sentence case in Content docs; uppercase is CSS | Typing titles in capitals |

Hero copy budget: headline ≤ 60 characters, lead ≤ 120, so the Hero fits 360×640 and reflows
at 320px. The lead names the buyer risks (§2.4): downtime, failed inspections, CFE penalties.

**Default UI strings** (`{n}`, `{i}`, `{title}`, `{servicio}`, `{email}`, `{alt}`, `{address}`,
`{phone}`, `{lista}`, `{year}` are bindings; Hero strings live in the hero doc):

| Where | Default copy |
|---|---|
| Skip link | Saltar al contenido |
| Logo link name (header) | kVA Instalaciones |
| Nav links | Servicios · Proyectos · Nosotros · Confianza · Contacto |
| Menu button (name, constant) | Menú |
| Menu navigation landmark (name) | Secciones |
| Header contact CTA | Cotiza tu proyecto (< 768 visible text: "Cotiza") |
| Hero overline | Explorando soluciones |
| Hero headline | Instalaciones eléctricas para empresas, conforme a norma |
| Hero lead | Ingeniería e instalación sin paros, multas de CFE ni inspecciones fallidas. |
| Hero CTAs | Cotiza tu proyecto · Ver servicios |
| Hero proof point | 3+ años · Cobertura en todo México |
| Servicios title | Servicios integrales de instalaciones eléctricas |
| Other section titles | Proyectos · Nosotros · Confianza · Contacto |
| Clientes heading | Clientes que inspiran nuestro trabajo |
| Service card CTA | Cotiza este servicio · visit-led Services: Solicita una visita técnica |
| Service list toggle | Ver los {n} servicios / Ver menos |
| Project filter group name | Filtrar proyectos por servicio |
| Filter "all" option | Todos |
| Filter result count (visible + live) | {n} proyectos: {servicio} / {n} proyectos en total |
| Empty filter result | No hay proyectos de este servicio por ahora. · Ver todos |
| Placeholder label | Ejemplo Ilustrativo |
| Project detail CTA | Cotiza un proyecto similar |
| Project proof field labels | Alcance · Resultado · Cliente · Ubicación · Año · Normas aplicadas |
| Carousel | Fotos de {title} · Foto anterior · Foto siguiente · {i} de {n} · Ver foto {i} |
| Carousel announcement | Foto {i} de {n}: {alt} |
| Carousel role descriptions | carrusel (slides: "foto") |
| Overlay close | Cerrar |
| Composer title | Cotiza tu proyecto |
| Composer intro | Preparamos un correo para kVA; tú lo envías desde tu app de correo. |
| Required note | Todos los campos son obligatorios. |
| Email field label / hint | Tu correo electrónico / Ahí te responderemos. |
| Service field label / empty option | Servicio de interés / Elige un servicio |
| Consent label / link | He leído y acepto el Aviso de privacidad. / Leer el Aviso de privacidad |
| Submit | Abrir mi correo |
| Error: email empty | Escribe tu correo electrónico. |
| Error: email format | Revisa tu correo: debe tener el formato nombre@empresa.com. |
| Error: no Service | Elige un servicio. |
| Error: no consent | Para continuar, acepta el Aviso de privacidad. |
| Error summary (live) | Revisa 1 campo: {lista}. / Revisa {n} campos: {lista}. (n ≥ 2) |
| Post-submit heading | Abrimos tu app de correo |
| FR-12 (verbatim) | Si no se abrió tu correo, escríbenos a proyectos1@kvainstalaciones.mx |
| Post-submit actions (ranked) | Listo · Editar datos · Copiar correo |
| Copy button (name) | Copiar correo {address} |
| Copy success (live) | Copiado |
| Copy failure (live) | No se pudo copiar. Selecciona el correo y cópialo. |
| Phone link (name) | Llamar al {phone} |
| WhatsApp CTA | Escríbenos por WhatsApp |
| No-JS contact fallback | Escríbenos a proyectos1@kvainstalaciones.mx |
| Footer | Aviso de privacidad · © {year} kVA Instalaciones |
| `mailto:` subject, composer (FR-13) | [kvainstalaciones.mx] {servicio} |
| `mailto:` subject, direct links + no-JS | [kvainstalaciones.mx] Contacto |
| `mailto:` body [ASSUMPTION] | Hola, kVA: / Me interesa: {servicio} / Mi correo: {email} |
| WhatsApp prefill (FR-17) | [kvainstalaciones.mx] Hola, kVA. Me interesa cotizar un proyecto. |

## Component Patterns

Behavior only; visuals in DESIGN.md › Components. Names match across both spines; model IDs
in Foundation.

- **Header** — Sticky at every scroll position (FR-2). Current section link carries
  `aria-current="location"` (scroll-spy). The Header contact CTA opens the Contact composer; it
  pre-selects no Service and keeps any earlier choice.
- **Mobile menu** — < 1024. APG disclosure navigation, not a dialog: `<button aria-expanded
  aria-controls="menu-movil">` with the constant name "Menú" (state from `aria-expanded` only)
  and `<nav id="menu-movil" aria-label="Secciones">` inside the header. While open: `inert` on
  `<main>` and `<footer>` only; a focus trap wraps header + sheet, so the toggle stays in the
  Tab cycle; body scroll locked. Esc, Back, and the toggle close it and return focus to the
  toggle; a link choice closes it and `section-navigation` focuses the target heading.
- **Hero** — Static. Primary CTA opens the Contact composer; secondary CTA anchors to
  `#servicios`. All Hero copy comes from the hero doc (FR-4); the proof point is required
  there (build fails without it) and independent of Trust items.
- **Section heading** — Anchor target with `tabindex="-1"`, so nav moves focus to it; reveals
  once on scroll-in (Interaction Primitives).
- **Service card** — CTA opens the Contact composer with this Service selected (FR-6). < 768:
  the sub-service list shows its first 4 items plus the Service list toggle (`aria-expanded`).
  ≥ 768: full list, no toggle [ASSUMPTION].
- **Project filter** — Single-select chips (`<button aria-pressed>` in a labeled group).
  Activation filters instantly (no reload or request), keeps focus on the chip, and updates
  the visible count, also a polite live region ("7 proyectos: Instalaciones") (FR-7). The
  active chip is inert to presses. Default "Todos". Hidden when fewer than two Services have
  Projects [ASSUMPTION]. State in memory only (not the URL).
- **Project card** — `<article>` with `<h3><button aria-haspopup="dialog">{title}</button></h3>`;
  the button's hit area stretches over the card; `aria-describedby` points at the Service and
  summary. Name = title (+ ", Ejemplo Ilustrativo" for Placeholder projects). The summary
  shows only when the Project doc has one. Opens the Project detail view (FR-8).
- **Badge (Ejemplo Ilustrativo)** — Rendered on card and detail view whenever the Project
  Content doc is marked placeholder (FR-9). Text, not an image.
- **Project detail view** — Modal dialog labeled by the Project title. DOM order: Close,
  title block, Project carousel, details, CTA. Opens on click/tap/Enter/Space and pushes a
  history entry; focus goes to the title (`<h2 tabindex="-1">`). On close, focus returns to
  the card's button; filter unchanged.
  - **Launch rule:** real Projects may publish with title, Service, photos, and client (only
    with recorded permission); Alcance, Resultado, and other proof fields render only when
    present, never as empty labels.
  - "Cotiza un proyecto similar" (`<button>`) closes the view and opens the Contact composer
    with the Project's Service; the history entry is replaced; closing the composer returns
    focus to the originating card.
- **Project carousel** — APG carousel without rotation: a region
  (`aria-roledescription="carrusel"`, "Fotos de {title}") holds the controls, then a slides
  container; each slide is `role="group"`, `aria-roledescription="foto"`, "{i} de {n}", with
  its `<img alt>`. Arrows and thumbnails sit outside the slides. Slide change announces
  "Foto {i} de {n}: {alt}" (polite live announcement). Inputs: arrows, ←/→ (only while focus
  is in the region), swipe ≥ 40px (`touch-action: pan-y`), thumbnails ≥ 768 (`aria-current`).
  Wraps last → first [ASSUMPTION]; no autoplay. One-photo Projects show no controls.
- **Nosotros** — Static content from its Content doc [NOTE FOR UX: new Content schema].
- **Trust section** — Renders only confirmed Trust items, each with an optional evidence
  reference (FR-10). The Clientes list renders only entries whose Content doc records the
  client's permission [ASSUMPTION: same rule as FR-8].
- **Contact section** — The published email as a `mailto:` link paired with its phone as a `tel:`
  link (FR-20); a copy button beside the email (Copy-address fallback, FR-12); a Contact composer
  button; the WhatsApp CTA slot (FR-17). Every direct `mailto:` here and in the footer carries
  `?subject=` + the encoded "[kvainstalaciones.mx] Contacto" (FR-13, so SM-1 counts it); the copy
  control is the only untagged path.
- **Direct contact links** (`direct-contact-links`) — Plain `<a>` hand-off to the OS (mail app
  or dialer); no JS, no tracking, page state unchanged.
- **Copy status** — A persistent, empty `role="status"` (polite, atomic) beside each copy
  button. On copy: clear it, then set "Copiado" ~100ms later; visible for
  `{motion.copy-status-hold}`. On failure: select the address text; announce the failure.
- **Contact composer** — Modal slide-in panel labeled by its title, described by its intro.
  - Opens from every contact CTA; focus goes to the email field (FR-2, FR-6).
  - Values persist in memory for the page session (not storage), so reopening or returning
    from the Privacy notice keeps them (FR-14).
  - Submit validates. On errors: focus moves to the first invalid field; a polite summary is
    announced. On success: build the `mailto:` URL (FR-11, FR-13), navigate to it, swap in the
    post-submit state (always, FR-12), and move focus to its heading (`<h3 tabindex="-1">`,
    described by the FR-12 sentence).
  - Post-submit actions: "Listo" closes like the close button; "Editar datos" restores the
    filled form and focuses the email field; "Copiar correo" copies (Copy status).
- **Privacy notice** — Modal dialog over the composer or page, opened from the consent link
  and the footer link. Body is a scroll region (`tabindex="0"`, labeled by the title).
  "Cerrar", Esc, or Back close it and return focus to its trigger, composer state intact
  (FR-14).
- **WhatsApp CTA** — Not rendered while the site Content doc has no number (FR-17); when set,
  a plain link to `https://wa.me/<digits>?text=<encoded>`, opening in a new tab.
- **Form field** — Label always visible; all fields required (`required`, plus the Required
  note). Email: `type="email" autocomplete="email" inputmode="email"`. Errors appear on blur
  (after an edit) and on submit; `aria-invalid`; `aria-describedby` = hint, then error (only
  when present). The consent checkbox has its own `<label for>`; the notice link follows it.
- **Buttons** — Native `<button>` for actions; `<a>` for navigation, `mailto:`, `tel:`, and
  WhatsApp. Contact CTAs are `<a href="#contacto">` before hydration and gain
  `aria-haspopup="dialog"` after. Accessible names contain the visible text ("Cotiza" →
  "Cotiza tu proyecto"). Never disabled; invalid submits explain via errors.
- **Focus ring** — `:focus-visible` only; never suppressed. Colors: DESIGN.md › Components.
- **Scrim** — Click closes the overlay above it; inert to keyboard.
- **Skip link** — First focusable; visible on focus; targets `<main id="main" tabindex="-1">`.
- **Footer** — Static; its `mailto:` links follow the Contact section tagging rule.

## State Patterns

States fully specified in Component Patterns (menu open, filtered, submitted, copy result)
are not repeated.

| Surface | State | Treatment |
|---|---|---|
| Header | Top / scrolled | Transparent ≤ `{spacing.header-threshold}`; then solid `{colors.ink}`. |
| Service card | List collapsed | < 768: first 4 sub-services + toggle; prerendered HTML has all. |
| Page | Cold load | Prerendered HTML is complete and readable; hydration causes no layout shift. |
| Page | No JavaScript | All content visible, no reveals; < 1024 nav links show as a wrapped row. |
| Page | No JavaScript | Chips, copy buttons, menu button hidden; Project cards not interactive. |
| Contacto | No JavaScript | Composer button is a plain `mailto:` link with the Contacto subject. |
| Privacy notice | No JavaScript | Footer link jumps to an in-flow `<section id="aviso">`. |
| Hero | Image loading | `{colors.ink}` ground under the overlay; text legible before the photo. |
| Hero | LCP | Photo preloaded with `fetchpriority="high"`; never lazy. |
| Any image | Below the fold | Lazy; delivery rules in DESIGN.md › Imagery & assets. |
| Project card | Image loading | Fixed 4:3 `{colors.paper-2}` box; photo fades in on load. |
| Project card | Image fails | Box stays; Project title still names the card. |
| Project carousel | Next photo | Adjacent photos preloaded. |
| Project carousel | Photo loading / fails | Stage stays; alt text in `small` paper on the stage. |
| Project carousel | One photo | No arrows, counter, thumbnails, or swipe. |
| Project filter | Empty result | Defensive only (FR-7 prevents it): message + "Ver todos" button. |
| Proyectos | No Projects | Section and its header link hidden [ASSUMPTION]. |
| Project detail view | Missing fields | Launch rule: field omitted, no empty label. |
| Nosotros | No Content doc | Section and its header link hidden. |
| Confianza | No confirmed Trust item | Section + header link hidden (FR-10); Hero proof stays. |
| Confianza | No permitted clients | Clientes block hidden. |
| Contacto | Name or phone missing | That item omitted; proyectos1@ is required. |
| Contact composer | Pristine | Service pre-filled from a Service or Project CTA; no errors shown. |
| Contact composer | Field error | `{colors.danger}` message + icon; focus first invalid; summary. |
| Contact composer | Reopened | Values restored; Service replaced only if the CTA pre-fills one. |
| Contact composer | Reopened after submit | Filled form, not the post-submit state. |
| Contact composer | Notice open | Composer pane `inert` beneath; values intact on return (FR-14). |
| WhatsApp CTA | No number | Not rendered; no gap left in the layout (FR-17). |
| Footer | No Legal identity | Shows "kVA Instalaciones" + proyectos1@; not blocking (PRD Q6). |
| Any | Reduced motion | No smooth scroll, reveals, slides, or scale; instant state changes. |
| Any | Offline | Page already loaded; `mailto:`/`tel:` still hand off to the OS; nothing else. |

## Interaction Primitives

- **Anchor navigation** (`section-navigation`) — Real `#anchor` links. With JS: smooth scroll
  (instant under reduced motion), focus moves to the section heading, fragment updated via
  `history.replaceState` so section jumps do not fill the Back stack [ASSUMPTION].
  `scroll-margin-top` keeps headings clear of the sticky header (FR-1).
- **Sticky header** — Condenses past `{spacing.header-threshold}`; never hides on scroll
  (FR-2). Under 400px viewport height it stays condensed.
- **Modal overlays** (Contact composer, Project detail view, Privacy notice) — `role="dialog"`
  + `aria-modal="true"`, labeled by the title. While one is open, every app-shell element
  outside it (skip link, header, main, footer, any lower overlay) is `inert`; the framework focus
  trap wraps only the topmost; body scroll locked. On close, focus returns to the invoker.
- **Overlay history** (modal overlays and Mobile menu) — Open pushes one entry; Back pops it
  and closes the topmost. Non-Back closes (close button, Esc, scrim, "Listo", menu toggle)
  consume the entry with a guarded `history.back()`, so the stack stays truthful; a menu link
  choice consumes it, then applies the anchor `replaceState`. Esc closes only the topmost
  (`stopPropagation`) and is ignored while a native `<select>` is open.
- **Swipe** — Every swipe has a button path; nothing is drag-only (WCAG 2.5.7).
- **Copy to clipboard** — Async Clipboard API; fallback selects the address text.
- **`tel:` / `mailto:` links** — Native; phones as `tel:+52…` [ASSUMPTION: +52 56 4000 3344].
  `mailto:` built with `encodeURIComponent` and `%0D%0A` (addendum).
- **Scroll reveal** — Fade + `{motion.reveal-distance}` rise over `{motion.duration-slow}`,
  once. Applied by JS after hydration, only to elements below the fold at that moment; the
  Hero, anything already in view, and prerendered CSS never hide content. Observer threshold
  0, `rootMargin: 0 0 -10% 0`; `focusin` reveals at once. Skipped under reduced motion and
  `scripting: none`.
- **Hover** — Never the only path to anything; touch gets the same affordances.
- **Banned:** autoplay, pop-ups/interstitials, chat widgets, scroll-jacking, exit-intent,
  cookie banners (no cookies, NFR-4), disabled submit buttons.

## Accessibility Floor

Contrast: DESIGN.md › Colors. Behavioral floor, WCAG 2.2 AA (NFR-2):

- Landmarks: `header`, `nav` (labeled), `main`, `section`s labeled by their headings,
  `footer` (sibling of `main`). `lang="es-MX"`.
- Headings: one `<h1>` (Hero); `<h2>` per section and per dialog or panel; `<h3>` for
  sub-blocks; no `<h4>`, no skipped levels (Lighthouse `heading-order`, SM-2).
- Focus visible on everything (`{colors.focus}` on dark and photo, `{colors.focus-on-light}`
  on light) and never obscured (2.4.11; scroll padding per DESIGN.md › Layout & Spacing).
- Targets ≥ 24×24 px everywhere (2.5.8); primary touch targets (CTAs, chips, carousel arrows,
  copy, close, menu) 44×44 px.
- Live regions (polite) exist, empty, before their text changes: filter count, Copy status,
  carousel announcement, composer error summary.
- Images: `alt` from Content docs; every Project photo requires `alt` (Spanish, ≤ 125
  characters, not the title; the content build fails without it). Card photos and background
  photos `alt=""`. The logo is named only on the header link and in the footer.
- Uppercase via CSS so screen readers read words. Accessible names contain the visible label
  (2.5.3). Inline links are underlined (1.4.1).
- Forms: `autocomplete="email"` (1.3.5); required stated (3.3.2); errors in text with a fix
  (3.3.1, 3.3.3); values retained across reopen (3.3.7).
- Help in a consistent place (3.2.6): Header contact CTA and footer channels on every scroll.
- `prefers-reduced-motion` honored (FR-1, NFR-2).
- Reflow and text spacing (1.4.4, 1.4.10, 1.4.12): layout rules in DESIGN.md › Layout &
  Spacing. Acceptance check: at 320 CSS px, at 200% zoom, and with the text-spacing
  bookmarklet, no clipped or overlapping text and no horizontal scroll.

## Responsive & Platform

Web only: prerendered Angular SPA, static hosting, browsers per NFR-3. No PWA, no app.

| Area | < 768 (mobile) | 768–1023 (tablet) | ≥ 1024 (desktop) |
|---|---|---|---|
| Header | Logo, "Cotiza", menu button | + "Instalaciones" wordmark | Inline links + full CTA |
| Service card | Lists collapsed to 4 + toggle | Full lists, no toggle | Same as tablet |
| Project detail view | Full-screen sheet | Full-screen sheet + thumbnails | Dialog, carousel left |
| Contact composer | Full-screen sheet | Right panel `{spacing.panel-w}` | Same as tablet |
| Privacy notice | Full-screen sheet | Dialog | Dialog |

Columns, alignment, and type scale per breakpoint: DESIGN.md › Layout & Spacing and ›
Components. All above-the-fold checks use the Reference viewport (360×640). Touch and pointer
get the same features; keyboard gets all of them.

## Inspiration & Anti-patterns

- **Lifted from the kVA brochure 2025:** its visual motifs (DESIGN.md › Brand & Style). Not
  its "líderes"/"KVA", nor its collage galleries.
- **Rejected:** autoplay carousels and hero videos (SM-C2), client logos without permission,
  counters that animate numbers, plus the Banned list (Interaction Primitives). Visual
  rejections: DESIGN.md › Do's and Don'ts.

## Key Flows

### Flow 1 — UJ-1. Laura, a plant engineer, checks whether kVA can fix her power-factor penalty

Laura, plant engineer in Querétaro, on her phone. Service taxonomy change: her PRD Service
*Análisis de consumo eléctrico* is now "Análisis de calidad de energía" inside **Desarrollo e
Ingeniería de Proyecto** [ASSUMPTION].

1. She lands on the Hero (Reference viewport): header logo, "Explorando soluciones", headline, lead,
   "Cotiza tu proyecto", "Ver servicios", and "3+ años · Cobertura en todo México".
2. She taps "Ver servicios"; the page scrolls to Servicios and focus lands on its heading.
3. The first Service card names CFE penalties and power factor; its list opens with
   "Análisis de calidad de energía", visible without expanding.
4. She taps "Cotiza este servicio". The Contact composer opens as a full-screen sheet with
   Desarrollo e Ingeniería de Proyecto selected; focus is in the email field.
5. She types her email, taps "Leer el Aviso de privacidad", skims it, taps "Cerrar": her email
   is still there. She checks the consent box and taps "Abrir mi correo".
6. **Climax:** her mail app opens with a ready message to proyectos1@kvainstalaciones.mx,
   subject "[kvainstalaciones.mx] Desarrollo e Ingeniería de Proyecto". She sends it.
7. Back in the browser, focus is on "Abrimos tu app de correo" with the FR-12 message; she
   taps "Listo".

- **Variant (menu):** "Menú" → "Contacto"; the menu closes; focus lands on the Contacto heading.
- **Failure (email typo):** on blur, "Revisa tu correo: debe tener el formato
  nombre@empresa.com."; focus stays.
- **Edge case (no email app):** nothing opens; the FR-12 message is already showing. She taps
  "Copiar correo" and hears "Copiado", or closes and taps a phone link in Contacto.

### Flow 2 — UJ-2. Jorge, a facilities manager, vets kVA after a referral

Jorge, facilities manager, desktop. Taxonomy change: *Cableado estructurado* is now part of
**Instalaciones** (canalización y cableado, Voz/Datos).

1. He clicks "Proyectos" in the header; focus lands on the section heading in the title band.
2. He clicks the "Instalaciones" chip. Seven Project cards remain; "7 proyectos:
   Instalaciones" is shown and announced.
3. He opens "Canalización y Cableado (Industrial y Comercial)". Focus lands on its title; the
   Project detail view shows photo 1 of 4; he steps through with →, then reads the scope,
   outcome, and standards present (launch rule).
4. He presses Esc. The view closes, focus is back on that card, "Instalaciones" still active.
5. He clicks "Confianza": Trust items (3+ años, cobertura nacional, NOM-001-SEDE-2012) and the
   Clientes list.
6. He clicks the Header contact CTA. The Contact composer opens as a right panel; he picks
   Instalaciones, enters his email, accepts the Privacy notice, clicks "Abrir mi correo".
7. **Climax:** his desktop mail client opens the pre-written, tagged email; he sends it, and
   the panel confirms with the FR-12 message.

- **Alternate (step 3):** "Cotiza un proyecto similar" opens the composer with Instalaciones
  selected.
- **Variant (placeholder):** a card carrying "Ejemplo Ilustrativo" opens the same view, badge
  beside the title.
- **Failure (Back):** Back inside the Project detail view closes it; he stays on the page.
- **Edge case (webmail only):** nothing opens; he copies the address from the post-submit
  state.

### Flow 3 — UJ-3. Ana, a general contractor, shortlists an electrical subcontractor

Ana, general contractor, assembling bids.

1. She skims the Hero and the four Service cards to confirm enterprise electrical work.
2. She clicks "Contacto"; focus lands on the section heading.
3. She sees Ing. Alfredo Hernández, then proyectos1@kvainstalaciones.mx beside (56) 4000 3344.
4. She clicks the copy button beside proyectos1@kvainstalaciones.mx.
5. **Climax:** "Copiado" appears and is announced; the address is in her clipboard, ready for
   her company webmail with the bid documents attached (an untagged email still counts as a
   Lead per the Glossary).

- **Variant (email link):** proyectos1@ opens her mail app with subject
  "[kvainstalaciones.mx] Contacto".
- **Variant (phone):** "(56) 4000 3344" opens the dialer.
- **Variant (footer):** "Aviso de privacidad" in the footer; "Cerrar" returns focus to the link.
- **Failure (clipboard blocked):** the address text is selected and "No se pudo copiar.
  Selecciona el correo y cópialo." is announced; she copies it by hand.

## Requirement Trace

| ID | Realized by |
|---|---|
| FR-1 | Header links, Mobile menu, Anchor navigation |
| FR-2 | Sticky Header contact CTA → Contact composer, focus to email |
| FR-3 | Header logo + "Instalaciones" wordmark, footer, favicon (DESIGN.md), `lang="es-MX"` |
| FR-4 | Hero (fits Reference viewport; logo + required proof point) |
| FR-5, FR-6 | Service card (optional image band) + CTA pre-fill |
| FR-7 | Project filter |
| FR-8 | Project detail view (launch rule) + Project carousel |
| FR-9 | Badge (Ejemplo Ilustrativo); photo `source` and `license` in the Project doc |
| FR-10 | Trust section + hidden state |
| FR-11, FR-13 | Contact composer and tagged direct `mailto:` links |
| FR-12 | Copy-address fallback in Contact section and post-submit state |
| FR-14 | Privacy notice dialog over the composer |
| FR-15 | Default UI strings table → UI strings Content doc |
| FR-16 | Share image (DESIGN.md assets); prerendered content |
| FR-17 | WhatsApp CTA slot |
| NFR-1/2/4 | Image delivery and font loading (DESIGN.md), Accessibility Floor, no cookies |

## Open Questions

1. **PRD update** (done 2026-10-21). Locations it covered, in pre-update numbering: §1 Vision
   (Services list; email-only contact); §2.3 UJ-1 and UJ-2 (old Service names); §2.4
   Per-Service hooks; §3 Glossary › Service, Lead (calls, proyectos2@), Copy-address fallback,
   Contact composer (form factor now decided); §4.1 description (anchor list; footer
   contents); FR-1 (add `#nosotros`); FR-3 (footer contents); §4.4 description and FR-8
   (Alcance/Resultado optional at launch); FR-5 (optional image band = "image"); §4.5 Trust
   candidates (Clientes list + permission rule as an FR); FR-15 (section list; content types);
   FR-16 (telephone in structured data; prerendered content list); NFR-5; §6 UI library and
   behaviour-model list (+ `service-card-disclosure`, `project-carousel`,
   `direct-contact-links`); §8.1 In Scope (Nosotros; Placeholder projects); §8.3 Accepted
   risk; §9 SM-1 (phone and proyectos2@ leads uncounted); §10 Q2, Q5 (palette and font now
   proposed), Q7 (add Nosotros copy); addendum › Content schemas (add `nosotros`, `client`;
   `site` phones, contact name, proyectos2@; `project` photo `alt`/`source`/`license`,
   optional scope/outcome); addendum › Spam exposure and Structured data.
2. **Legal identity** (*razón social*, *domicilio*) and retention period: still TBD (PRD Q6),
   not launch-blocking (user, 2026-10-21). Until supplied, the footer and Privacy notice name
   "kVA Instalaciones" and proyectos1@ as the responsible party.
3. **Photo licenses:** are the brochure photos (backgrounds and Projects) licensed for web?
4. **Fonts:** keep the OFL lookalikes or license All Round Gothic / Apparat for web?
5. **Project → Service mapping** (IA table) to be confirmed by kVA. Instalaciones holds 7 of 9
   Projects, so the filter barely narrows (UJ-2); Desarrollo e Ingeniería and Servicios de
   Datos have no Projects yet, so no chip.
6. **Clientes:** written permission per entry and per Project client field (PRD Q2, Q7
   approver); confirm the p09 group ↔ item assignment.
7. **Copy approval:** Nosotros rewording (drops "líderes", "KVA", "los más altos
   estándares", "superar expectativas"; fixes "Compromismo") and the default Hero headline
   and lead.
8. **Project facts:** scope and outcome (plus optional location, year, standards) requested
   from kVA; until then Projects publish under the launch rule.
9. **Phones:** confirm `tel:` format (+52 56…). Resolved: proyectos2@ and (56) 4029 4029 are
   not published (user, 2026-10-21).
10. **Higher-resolution originals** of the background photos (also needed for the share image).
