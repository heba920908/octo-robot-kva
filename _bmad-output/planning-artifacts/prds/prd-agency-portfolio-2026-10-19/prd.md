---
title: "PRD: kVA Instalaciones Landing Page"
status: final
created: 2026-10-19
updated: 2026-10-22
---

# PRD: kVA Instalaciones Landing Page

## 0. Document Purpose

This PRD is for the team building kvainstalaciones.mx and for the BMAD workflows that run next:
`bmad-ux`, `bmad-architecture`, and `bmad-create-epics-and-stories`. It builds on the final
product brief ([brief](../../briefs/brief-agency-portfolio-2026-10-19/brief.md), with its
[addendum](../../briefs/brief-agency-portfolio-2026-10-19/addendum.md)) and does not repeat its
market research. It was updated on 2026-10-21 to reflect the final UX spines
([DESIGN.md](../../ux-designs/ux-agency-portfolio-2026-10-21/DESIGN.md) and
[EXPERIENCE.md](../../ux-designs/ux-agency-portfolio-2026-10-21/EXPERIENCE.md)), which drew the
Services, Projects, Clientes list, Nosotros copy, and contact details from kVA's 2025 brochure.
The spines govern visual and interaction detail; on scope, content, or published channels, this
PRD wins. All work is governed by the project constitution (`.specify/memory/constitution.md`,
v1.0.0). Terms defined in §3 are used verbatim. FRs are grouped by feature and numbered
globally; assumptions are tagged inline and indexed in §11; technology choices are in
`addendum.md`.

## 1. Vision

kVA Instalaciones (short name **kVA**) delivers enterprise-grade electrical installations and
data work for Mexican companies through four Services: *Desarrollo e Ingeniería de Proyecto*,
*Instalaciones*, *Puesta en marcha y Validaciones*, and *Servicios de Datos* (§3).
kvainstalaciones.mx currently shows an unfinished template. This product replaces it with a
single Spanish-language (es-MX) promotional page, delivered as a single-page web application
(SPA), that makes a facilities manager, plant engineer, or general contractor think, within
seconds: *these people do serious electrical work, to standard*, and then puts contacting kVA
one step away.

The page is static, promotional, and has no backend. Every contact leaves through the Visitor's
own device: an email from their email client to proyectos1@kvainstalaciones.mx, or a call to
kVA's published phone number. Everything kVA says about itself (Services, Projects, Trust items,
the Clientes list, the Nosotros section, copy) lives in Markdown **Content docs** in the
repository, so adding a Service or a Project is a content edit rather than a redesign.

## 2. Target User

### 2.1 Jobs To Be Done

- **Functional:** find an electrical/cabling contractor capable of enterprise work, check what
  they do, and start a conversation about a specific need.
- **Risk-reduction:** confirm, before reaching out, that the contractor looks competent and
  compliant (standards, experience, real work), so a recommendation can be defended internally.
- **Contextual:** often on a phone between site tasks, or on a desktop when building a vendor
  shortlist for procurement.

### 2.2 Non-Users (v1)

- Residential customers looking for small household repairs. The tone and Services target
  enterprises, but no gate turns them away.
- Job seekers (there is no careers section) and existing clients needing support or invoices
  (there is no portal).

### 2.3 Key User Journeys

- **UJ-1. Laura, a plant engineer, checks whether kVA can fix her power-factor penalty.**
  Laura runs maintenance at a manufacturing plant in Querétaro on CFE's GDMTH tariff. Last
  month's bill carried a low-power-factor penalty. She searches on her phone, lands on the Hero,
  and taps through to **Services**. The first **Service**, *Desarrollo e Ingeniería de
  Proyecto*, names CFE penalties and power factor, and its **Sub-service** list opens with
  *Análisis de calidad de energía*. She taps the card's CTA, and the **Contact composer** opens
  with that Service selected. She enters her email, accepts the Privacy notice, and taps send.
  Her email app opens a ready-to-send message to proyectos1@kvainstalaciones.mx, and she sends
  it. **Edge case:** her phone has no email app configured; after every send the page also
  shows the address with a one-tap copy button, and she can call kVA through a **Direct contact
  link**.
- **UJ-2. Jorge, a facilities manager, vets kVA after a referral.**
  A colleague recommended kVA for re-cabling two office floors. Jorge opens kvainstalaciones.mx
  on his desktop and filters **Projects** by *Instalaciones*, the Service that covers structured
  cabling. He opens a **Project detail view**, steps through its photos one at a time, reads the
  scope, outcome, and standards kVA has recorded, and closes it without losing his place. He
  checks the **Trust section** for years in business, standards, and the **Clientes list**, then
  contacts kVA through the **Contact composer**.
- **UJ-3. Ana, a general contractor, shortlists an electrical subcontractor.**
  Ana is assembling bids for a new commercial building. She skims the Hero and Services to
  confirm kVA does enterprise electrical installations. In the Contact section she sees the
  contact person, Ing. Alfredo Hernández, copies proyectos1@kvainstalaciones.mx, and later emails
  kVA from her company's webmail with the bid documents attached.

### 2.4 Messaging, Tone, and Positioning

This section guides the copy in the Content docs; the final wording lives in those docs.

- **Positioning:** enterprise-grade electrical work done to standard — installations that pass
  inspection and help clients avoid CFE (the state power utility) penalties and downtime. This
  holds only with evidence, so claims are tied to Trust items and Projects.
- **Voice:** marketing tone (confident, benefit-led, es-MX), addressing the reader as *tú*
  [ASSUMPTION: *tú* rather than *usted*]. It stays credible for a risk-averse buyer: concrete,
  verifiable claims and no unsupported superlatives ("los mejores", "líderes", "los más altos
  estándares", "superar expectativas"), including in reused brochure copy.
- **Buyer risks to speak to:** downtime, failed inspections, CFE penalties, and safety incidents.
- **Per-Service hooks** (each hook leads its Service card through the hook Sub-services named,
  listed first in the Service Content doc in this order; the page renders Content doc order,
  FR-5):
  - *Desarrollo e Ingeniería de Proyecto:* through *Análisis de calidad de energía*, the CFE
    GDMTH tariff, demand and time-of-use charges, penalties for power factor below 90%,
    harmonics, and Código de Red compliance ("evita penalizaciones de factor de potencia").
  - *Instalaciones:* through *Canalización y cableado* and *Voz/Datos*, structured cabling
    certified to ANSI/TIA-568, with test reports; and NOM-001-SEDE-2012 compliance, with work
    verifiable by a UVIE (an accredited electrical-installation inspection unit) where
    applicable.
  - *Puesta en marcha y Validaciones:* through *Pruebas de carga, continuidad, puesta a tierra*
    and *Validación de calidad de energía*, framed against failed inspections and downtime.
  - *Servicios de Datos:* outcome-led (better decisions, visible operations) rather than
    tool-led; it has no hook Sub-service.
- **Coverage:** nationwide coverage ("Cobertura en todo México") is visible on the page, not only
  in metadata.
- **CTA vocabulary:** quote-led and visit-led labels common in the Mexican market, such as
  "Cotiza tu proyecto" and "Solicita una visita técnica".
- **Shortlist substance:** for procurement, the page shows the company name, contact person,
  years in business, coverage, standards, and the Clientes list, plus the Legal identity once
  kVA supplies it. The Nosotros section adds kVA's stated mission and values (for example,
  *Seguridad*) as background.

## 3. Glossary

- **Visitor** — anyone viewing kvainstalaciones.mx.
- **Lead** — a contact that reaches kVA because of the page: an email received at
  proyectos1@kvainstalaciones.mx that carries the **Lead subject tag** (from the **Contact
  composer** or a **Direct contact link**), or a call or untagged email (for example, via the
  **Copy-address fallback**) in which the contact says they found kVA on the website. Once the
  **WhatsApp CTA** is enabled, chats started from the page count too. A *qualified* Lead comes
  from an enterprise prospect with a real engineering, installation, commissioning, or data
  need.
- **Lead subject tag** — the fixed prefix that every email generated by the page carries in its
  subject line, and that the WhatsApp CTA's pre-written message starts with, so kVA can
  recognize and count Leads (FR-13).
- **Service** — one kVA offering, initially four: *Desarrollo e Ingeniería de Proyecto*;
  *Instalaciones*; *Puesta en marcha y Validaciones*; and *Servicios de Datos* (data analytics,
  business intelligence (BI), and IT data management). Each Service is defined by one **Content
  doc**, and the set of Services can grow.
- **Sub-service** — one line item within a **Service**, listed in that Service's Content doc
  (for example, *Análisis de calidad de energía* under Desarrollo e Ingeniería de Proyecto, or
  *Canalización y cableado* and *Voz/Datos* under Instalaciones). Sub-services are not **Project
  filter** or Contact composer options.
- **Project** — one reference job kVA has done, belonging to exactly one **Service** and defined
  by one **Content doc**; scope, outcome, and proof fields are optional.
- **Placeholder project** — a **Project** whose content is illustrative, not a real kVA job,
  marked as such in its Content doc.
- **Project filter** — the control that limits the visible **Projects** to one **Service** or
  shows all of them.
- **Project detail view** — the in-page expanded view of one **Project**: its photos in a
  **Project carousel**, plus scope, outcome, and proof fields when present.
- **Project carousel** — the viewer in the Project detail view that shows a Project's photos one
  at a time.
- **Nosotros section** — the About section: kVA's philosophy, mission, vision, and values,
  rendered from its Content doc (FR-18).
- **Trust section** — the section reached by the "Confianza" header link (`#confianza`; §4.6).
- **Trust item** — one credibility claim (for example, years in business, a standard followed,
  a registration or certification), defined in a **Content doc**. It is *confirmed* when kVA has
  confirmed the claim in writing and the Content doc is marked so (FR-10).
- **Hero proof point** — the short credibility line on the Hero (FR-4). Not to be confused with
  a Project's proof fields (FR-8).
- **Client** — an organization kVA has worked for, shown in the Clientes list as part of one
  *client group*. Each client group is one Content doc with a group name (an organization, such
  as Inmobiliaria Goytia, or a category, such as Clientes Varios), an optional scope line (for
  example, "Sucursales"), and a list of items (the organization's sites or branches, or the
  organizations in the group). The group is the unit of permission (FR-19).
- **Clientes list** — the grouped list of **Clients** in the Trust section; it shows only client
  groups whose permission is recorded (FR-19).
- **Contact channels** — the ways to reach kVA that the page publishes: the contact name *Ing.
  Alfredo Hernández*, proyectos1@kvainstalaciones.mx, and (56) 4000 3344.
- **Contact section** — the section reached by the "Contacto" header link (`#contacto`; §4.7).
- **Direct contact link** — a `tel:` or `mailto:` link to a Contact channel outside the Contact
  composer (Contact section and footer; FR-20).
- **Contact composer** — the in-page control that collects the Visitor's email and **Service**
  and hands a pre-written email to the Visitor's email client (`mailto:`). It opens as a
  slide-in panel at or above the composer breakpoint (a design token, 768 CSS px in the UX
  spines) and as a full-screen sheet below it; its visual design is in the UX spines.
- **Header contact CTA** — the contact call to action in the page header (FR-2).
- **Copy-address fallback** — a visible display of proyectos1@kvainstalaciones.mx with a
  one-action copy control, for Visitors whose email client does not open; the only untagged
  email path the page offers.
- **WhatsApp CTA** — a click-to-chat link to kVA's WhatsApp number; a placeholder in v1, hidden
  until a real number is set in a **Content doc** (FR-17).
- **Content doc** — a Markdown file in the repository (front matter plus body) that is the single
  source of truth for one piece of site content.
- **Content schema** — the JSON Schema that every **Content doc** of a given type must validate
  against (constitution principle IV).
- **Legal identity** — kVA's registered company name (*razón social*) and address
  (*domicilio*), shown in the footer and the Privacy notice. kVA has not supplied it yet; until
  it does, both name "kVA Instalaciones" and proyectos1@kvainstalaciones.mx as a stand-in
  responsible party. This is not launch-blocking (§8.3, §10 Q6).
- **UI strings** — every interface label and message that is not section content (navigation
  labels, buttons, validation errors, "Todos", "Copiado", "Ejemplo Ilustrativo", status messages,
  `aria-label`/`alt`/`title` text). They live in one Content doc. The default copy is the
  Default UI strings table in EXPERIENCE.md; the strings quoted in §4 match it.
- **Reference viewport** — 360×640 CSS px, the phone viewport used for "above the fold" checks.
- **Privacy notice** — kVA's *aviso de privacidad*, as required by the LFPDPPP (2025 reform).

## 4. Features

*FR IDs are stable and never renumbered, so some sit out of numeric order. FR-17 was added
after the first draft and sits in §4.7. FR-18 to FR-20 were added on 2026-10-21: FR-18 in §4.5,
FR-19 in §4.6, and FR-20 in §4.7. Adding §4.5 Nosotros moved the later subsections down by one.*

### 4.1 Page Shell and Navigation

**Description:** One mobile-first page in Spanish (es-MX). A header holds the kVA Instalaciones
brand, section links (Servicios, Proyectos, Nosotros, Confianza, Contacto), and the Header
contact CTA (FR-1, FR-2); a footer holds the Legal identity, published email and phone, and
Privacy notice link (FR-3). Realizes UJ-1, UJ-2, UJ-3.

#### FR-1: Single-page section navigation

A Visitor can jump to any section from the header and land with the section heading visible.
Realizes UJ-2.

**Consequences (testable):**
- Each header link moves focus and scroll to its section; the URL fragment updates
  (`#servicios`, `#proyectos`, `#nosotros`, `#confianza`, `#contacto`).
- The header logo links to the Hero (`#inicio`), the top of the page.
- A section hidden because it has no content to show (Proyectos, FR-7; Nosotros, FR-18; Trust
  section, FR-10 and FR-19) also drops its header link.
- On viewports narrower than the menu breakpoint (a design token, 1024 CSS px in the UX
  spines), the links collapse into a menu that opens and closes by keyboard and screen reader,
  and closes when a link is chosen or Esc is pressed.
- Smooth scrolling is disabled when `prefers-reduced-motion: reduce` is set.

#### FR-2: Contact always one step away

A Visitor can reach the Contact composer from any scroll position with one action.
Realizes UJ-1.

**Consequences (testable):**
- The Header contact CTA stays visible at every scroll position on mobile and desktop (the UX
  spines use a sticky header).
- Activating it opens the Contact composer and moves focus to its first field.

#### FR-3: Brand and Legal identity

The page shows the brand name **kVA Instalaciones** in the header, `<title>`, and footer, and
uses **kVA** in running copy, always written with a lowercase "k" and capital "VA".

**Consequences (testable):**
- The header shows the kVA logo (source asset `assets/media/icon.png`) with the accessible name
  "kVA Instalaciones", and the favicon is derived from the same logo.
- The footer shows the Legal identity (or, until supplied, "kVA Instalaciones"; §3),
  proyectos1@kvainstalaciones.mx and (56) 4000 3344 as Direct contact links (FR-20), the current
  year, and the Privacy notice link. The contact name appears in the Contact section only.
- The document language is declared as `es-MX`.

### 4.2 Hero

**Description:** The first screen states who kVA is and for whom, in marketing tone (§2.4), from
a Content doc. Realizes UJ-1, UJ-3.

#### FR-4: Hero value statement and CTAs

A Visitor sees, without scrolling on the Reference viewport, a headline, a supporting line, a
primary CTA (for example, "Cotiza tu proyecto") that opens the Contact composer, and a secondary
CTA that goes to Services.

**Consequences (testable):**
- Headline, supporting line, and CTA labels are read from the hero Content doc; changing the doc
  and rebuilding changes the page without code changes.
- The Hero headline is the page's only `<h1>`.
- The first screen on the Reference viewport also shows the kVA logo and at least one Hero
  proof point (for example, years in business or nationwide coverage).
- The Hero proof point repeats a confirmed Trust item (FR-10) or a fact recorded in the site
  Content doc; a claim that exists only in the hero Content doc is not shown.

### 4.3 Services

**Description:** A grid of Service cards built from the Service Content docs, initially the four
Services in §3. Each card shows a name, a short description, its Sub-service list, an optional
image band, and a CTA that opens the Contact composer with that Service pre-selected. Hook
Sub-services are ordered as §2.4 describes. The set is extensible (FR-5). Realizes UJ-1, UJ-3.

#### FR-5: Content-driven Service cards

A Visitor sees one card per Service, in the order defined in the Content docs.

**Consequences (testable):**
- With four Service Content docs there are four cards; adding a fifth valid doc and rebuilding
  produces five cards and five Contact composer options, with no code change. The Project filter
  gains the new Service once it has a Project (FR-7).
- Each card lists its Sub-services in Content doc order. Every Sub-service is present in the
  served HTML, even where a narrow viewport shows a shortened list with a control to expand it.
- A card shows its image band only when its Service Content doc sets an image; otherwise the
  card renders without an empty slot.
- A Service Content doc that fails its Content schema fails the build (FR-15).

#### FR-6: Service CTA pre-fills the Contact composer

A Visitor can start a contact about a specific Service from its card. Realizes UJ-1.

**Consequences (testable):**
- Activating a Service CTA opens the Contact composer with that Service selected, and focus
  moves to the email field.
- The Visitor can still change the selected Service.

### 4.4 Projects

**Description:** A grid of Project cards (image, title, Service, and a one-line summary when the
Content doc has one), filterable by Service, each opening a Project detail view in the page. At
launch, the real Projects from kVA's 2025 brochure publish with their title, Service, and
photos; scope, outcome, and proof fields follow as kVA supplies them (§10, Q2). Realizes UJ-2.

#### FR-7: Filter Projects by Service

A Visitor can filter Projects to one Service, or show all of them. Realizes UJ-2.

**Consequences (testable):**
- Options are "Todos" plus one per Service that has at least one Project.
- If fewer than two Services have Projects, the Project filter is not rendered and all Projects
  are shown.
- If there are no Projects, the Projects section and its header link are not rendered (FR-1).
- Applying a filter shows only matching Projects and announces the result count to assistive
  technology.
- The active filter is visually and programmatically indicated (for example, `aria-pressed`).
- Filtering requires no page reload or network request.

#### FR-8: Project detail view

A Visitor can open a Project to see its photos, and its scope and outcome when kVA has supplied
them, without leaving the page. Realizes UJ-2.

**Consequences (testable):**
- The Project detail view opens from a card by click, tap, or keyboard, traps focus while open,
  and closes with a close control, the Esc key, or the browser Back action [ASSUMPTION: Back
  closes the view].
- On close, focus returns to the card that opened it, and the active filter is kept.
- The Project carousel shows one photo at a time. Previous and next controls work by keyboard,
  pointer, and touch; swiping is never the only way to change photo; each change announces the
  position ("{i} de {n}") to assistive technology; nothing rotates automatically. A Project with
  one photo shows no carousel controls.
- Every photo has meaningful `alt` text from the Content doc; a Project photo without `alt`
  fails the build.
- Scope (Alcance), outcome (Resultado), and the proof fields are optional and each renders only
  when present, never as an empty label. Proof fields are client name, location (state), year,
  and standards applied.
- The client-name proof field references a client group Content doc and renders only when that
  group's permission is recorded (FR-19).
- A Project title may name an organization (for example, the brochure's "Red Ambiental" and
  "Larousse"); the Clientes permission rule (FR-19) does not apply to Project titles, which
  kVA's brochure already publishes.
- The view has a "Cotiza un proyecto similar" CTA that opens the Contact composer with the
  Project's Service pre-selected.
- A Placeholder project's "Ejemplo Ilustrativo" label also shows in the detail view.

#### FR-9: Placeholder projects are honest

Placeholder projects are allowed but must not pass as real kVA work.

**Consequences (testable):**
- A Project Content doc marked as placeholder renders with a visible "Ejemplo Ilustrativo" label.
- Replacing a Placeholder project with a real one is a Content-doc-only change.
- Every Project photo, real or placeholder, records its `source` and `license` in the Content
  doc; a Project photo without either fails the build. A photo from kVA's 2025 brochure records
  the brochure as its source and "supplied by kVA" as its license until kVA answers Q8 (§10).
  Placeholder images are kVA's own, supplied by kVA, or licensed for commercial use.

### 4.5 Nosotros

**Description:** A static section in which kVA presents itself: its philosophy, mission,
vision, and values (at launch Excelencia, Seguridad, Integridad, Compromiso, Colaboración, and
Adaptabilidad). The copy is adapted from kVA's 2025 brochure and follows §2.4: brochure claims
without evidence are reworded or dropped. kVA is asked to approve the wording before
publication (§10, Q7; fallback in §8.3). The section keeps parity with kVA's brochure.

#### FR-18: Nosotros section

A Visitor can read kVA's philosophy, mission, vision, and values in one section reached from
the header. Supports the §2.4 shortlist substance; no user journey depends on it.

**Consequences (testable):**
- The philosophy, mission, vision, and values are read from the Nosotros Content doc; changing
  the doc (including adding or removing a value) and rebuilding changes the page without code
  changes.
- If the Nosotros Content doc is absent, the section and its header link are not rendered.
- The published copy contains none of the unsupported superlatives listed in §2.4 and writes
  the brand as "kVA" (not the brochure's "KVA").

### 4.6 Trust

**Description:** A section of Trust items and the Clientes list. At launch the Trust items are
years in business ("3+ años"), nationwide coverage, and NOM-001-SEDE-2012 compliance
[ASSUMPTION: kVA confirms these three]. Registrations and certifications (candidates in
`addendum.md`) are added once kVA supplies evidence. Below them, the Clientes list names the
organizations kVA has worked for, in client groups as in kVA's brochure (for example, Oficinas
Gubernamentales, Inmobiliaria Goytia, CHR Construcciones). Realizes UJ-2, UJ-3.

#### FR-10: Content-driven Trust items

A Visitor sees each Trust item that is marked as confirmed in its Content doc.

**Consequences (testable):**
- A Trust item whose Content doc is not marked as confirmed does not render.
- A Trust item can carry an evidence reference (for example, a registration number or
  certificate ID), which is shown next to it. A registration or certification Trust item without
  an evidence reference fails the build.
- If no Trust items are confirmed and no client group is permitted (FR-19), the Trust section
  and its header link are hidden rather than shown empty. Otherwise only the empty part (Trust
  items or Clientes list) is omitted.

#### FR-19: Clientes list with permission

A Visitor sees the Clients kVA has worked for, by client group, for each group with recorded
permission. Realizes UJ-2.

**Consequences (testable):**
- Each client group Content doc carries one permission flag, which covers the group name, its
  scope line, and every item listed under it. A group without recorded permission renders
  nowhere as a Client: not in the Clientes list, a Project's client-name field (FR-8), or the
  page metadata. Project titles are exempt (FR-8).
- Permitted groups render as text in Content doc order, each with its name, its scope line when
  present, and its items in Content doc order.
- If no client group is permitted, the Clientes list is not rendered; Trust items are
  unaffected (Trust section hiding follows FR-10).
- Adding, removing, or granting permission for a client group is a Content-doc-only change.

### 4.7 Contact

**Description:** The Contact section shows the Contact channels (the contact name, plus the
email and phone as Direct contact links), the Copy-address fallback, a control that opens the
Contact composer, and the WhatsApp CTA slot. The Contact composer (§3) has no phone field, to
keep friction low; its email field captures the address kVA should reply to, which may differ
from the address the Visitor sends from. Its behaviour model defines focus, Esc, and Back
handling. No response-time promise is shown. kVA's second address and phone are not published
(§7). Realizes UJ-1, UJ-3.

#### FR-11: Compose a Lead email

A Visitor can turn their contact details into a ready-to-send email. Realizes UJ-1.

**Consequences (testable):**
- Fields: email (required, valid format), Service (required, defaulting to the pre-filled
  value), and Privacy notice acceptance (required).
- Errors appear inline on blur or submit, are tied to their fields (`aria-describedby`), and
  focus moves to the first invalid field.
- On valid submit, a `mailto:` link opens to proyectos1@kvainstalaciones.mx. The subject is the
  Lead subject tag plus the Service name. The body lists the email and Service in Spanish. All
  values are URL-encoded.
- No data is sent over the network or stored by the site (no backend, no cookies, no storage).

#### FR-12: Copy-address fallback

A Visitor whose email client does not open can still contact kVA. Realizes UJ-1 (edge case) and
UJ-3.

**Consequences (testable):**
- proyectos1@kvainstalaciones.mx is always visible in the Contact section, with a copy control
  that confirms "Copiado" accessibly (live region).
- After the Contact composer submits, the page shows a message: "Si no se abrió tu correo,
  escríbenos a proyectos1@kvainstalaciones.mx" with the copy control.

#### FR-13: Lead subject tag

Every email generated by the page can be identified as a Lead.

**Consequences (testable):**
- The subject always starts with the fixed tag `[kvainstalaciones.mx]` [ASSUMPTION: tag text],
  for emails from the Contact composer and from Direct contact links alike.

#### FR-17: WhatsApp CTA placeholder

The page has a slot for a WhatsApp CTA in the Contact section, ready to switch on without code
changes.

**Consequences (testable):**
- While the site Content doc has no WhatsApp number, the WhatsApp CTA is not rendered, so no
  fake number is ever published [ASSUMPTION: hidden rather than shown disabled].
- When a valid Mexican number (E.164, `+52…`) is set in the site Content doc and the site is
  rebuilt, the CTA appears and opens `https://wa.me/<number>` with a pre-written Spanish
  message that starts with the Lead subject tag.
- The number is validated by the Content schema; an invalid number fails the build.
- WhatsApp routes the Visitor's data through Meta's service, so the change that sets the number
  also updates the Privacy notice Content doc to cover the WhatsApp channel (FR-14).

#### FR-20: Direct contact links

A Visitor can call or email kVA directly from the Contact section or the footer, without the
Contact composer. Realizes UJ-1 (edge case) and UJ-3.

**Consequences (testable):**
- The Contact section shows the contact name. The Contact section and the footer show
  proyectos1@kvainstalaciones.mx as a `mailto:` link and (56) 4000 3344 as a `tel:` link. The
  visible number is written as in kVA's brochure; the link uses international format
  [ASSUMPTION: the number dials as +52 56 4000 3344].
- Every Direct contact `mailto:` link sets its subject to the Lead subject tag followed by
  "Contacto", URL-encoded.
- Direct contact links work without JavaScript, change no page state, and the site records
  nothing about their use.
- The Contact channels come from the site Content doc. A missing contact name or phone is
  omitted; proyectos1@kvainstalaciones.mx is required, and a missing address or an invalid
  Mexican phone number fails the build.
- Only the Contact channels in the site Content doc are rendered; proyectos2@kvainstalaciones.mx
  and (56) 4029 4029 appear nowhere on the page or in its metadata.

### 4.8 Privacy Notice

**Description:** v1 ships kVA's *aviso de privacidad* as a generic notice written for the
`mailto:` flow: the site itself collects and stores nothing, and the data reaches kVA only in
the email the Visitor sends or the call the Visitor makes (or, once FR-17 is enabled, the
WhatsApp chat). Until kVA supplies its Legal identity, the notice uses the stand-in responsible
party defined in §3 (§6 Legal). Its Content doc lets kVA replace the text later.

#### FR-14: Privacy notice access

A Visitor can read the Privacy notice before consenting, without losing the Contact composer
state.

**Consequences (testable):**
- The Privacy notice opens from the consent control and the footer, and closing it keeps the
  values already entered in the Contact composer.
- Its text is rendered from a Content doc; a missing or invalid doc fails the build.

### 4.9 Content Management

**Description:** All site copy and data come from Content docs, validated at build time. A
developer updates the site by editing them and rebuilding; there is no CMS (§7).

#### FR-15: Content docs are the single source of truth

**Consequences (testable):**
- Every user-visible string or data item comes from a Content doc. This covers section content
  (Hero, Services and their Sub-services, Projects, the Nosotros section, Trust items, the
  Clientes list, Contact channels, footer, Privacy notice, SEO metadata) and all UI strings.
- An automated check (test or lint) fails if a component template contains literal text nodes
  or literal `aria-label`, `alt`, `title`, or `placeholder` values; only bindings are allowed.
- Every Content doc validates against its Content schema. Any failure stops the build and names
  the file and field.
- Adding, editing, or removing a Service, Sub-service, Project, Trust item, Client, or Nosotros
  value needs no source-code change.

### 4.10 Search and Sharing

**Description:** The page can be found and previews well when shared on WhatsApp, LinkedIn,
or by email.

#### FR-16: Search and share metadata

**Consequences (testable):**
- The page has a title, meta description, and canonical URL `https://kvainstalaciones.mx/`,
  with Open Graph and Twitter card tags (title, description, image) from a Content doc.
- It has schema.org structured data describing kVA Instalaciones as a local business
  (`ElectricalContractor`) with name, URL, email, telephone, and area served (Mexico).
- The title, meta description, canonical URL, Open Graph tags, and structured data are present in
  the served HTML without running JavaScript, because link-preview crawlers (WhatsApp, LinkedIn)
  do not execute it.
- Build-time prerendering puts the Hero, Service names, descriptions, and Sub-services, Project
  titles, the Nosotros section, Trust items, the Clientes list, and the Contact channels in the
  served HTML; the page is still a single-page application served as static files.
- The share image is a dedicated 1200×630 px image from a Content doc, not the raw logo.
- `robots.txt` and `sitemap.xml` are published.

## 5. Cross-Cutting NFRs

- **NFR-1 Performance:** the production build stays within the `angular.json` budgets (initial
  bundle error at 1 MB, per-component styles error at 8 kB). Measured with Lighthouse mobile
  defaults (simulated throttling) against the built static output: LCP is 2.5 s or less, CLS is
  0.1 or less, and TBT is 200 ms or less (the lab proxy for INP) [ASSUMPTION: Core Web Vitals
  "good" thresholds]. Images are responsive and lazy-loaded below the fold.
- **NFR-2 Accessibility:** WCAG 2.2 AA throughout: semantic landmarks, labeled controls, visible
  focus, 4.5:1 text contrast, target size of at least 24×24 px, and full keyboard operation.
  `prefers-reduced-motion` is respected.
- **NFR-3 Browser support:** the last two versions of Chrome, Edge, Firefox, and Safari, plus iOS
  Safari and Chrome for Android [ASSUMPTION].
- **NFR-4 Privacy and security:** no cookies, no third-party trackers, and no personal data
  stored or transmitted by the site. HTTPS only. A Content Security Policy applies this
  baseline: `default-src 'self'`, inline JSON-LD (a data block that is not executed, so it
  needs no script hash), self-hosted fonts and images, no third-party origins, `base-uri 'self'`,
  and `frame-ancestors 'none'` [ASSUMPTION]. Architecture checks that Angular SSG critical-CSS
  inlining works under this policy. A `<meta>` CSP is acceptable until hosting headers exist
  (`frame-ancestors` then needs a header).
- **NFR-5 Extensibility:** new Services, Sub-services, Projects, Trust items, Clients, and
  Nosotros values are added through Content docs only (FR-5, FR-15, FR-18, FR-19). Copy is kept
  out of components so a future language can be added.

## 6. Constraints and Guardrails

- **Constitution:** every user action in §4 has a behaviour model in `src/app/behaviors/` before
  implementation (principle II). This covers at least section navigation, the Header contact
  CTA, Service CTA pre-fill (`service-cta-prefill`, including the "Cotiza un proyecto similar"
  entry point), the Sub-service list toggle on Service cards (`service-card-disclosure`), the
  Project filter, the Project detail view, the Project carousel (`project-carousel`), the mobile
  menu, the Contact composer, the Copy-address fallback, the Direct contact links
  (`direct-contact-links`), the WhatsApp CTA, and the Privacy notice. The Hero CTAs are covered
  by the `contact-cta` and `section-navigation` models. The Nosotros section, Trust items, and
  Clientes list are static and need no behaviour model. Every layout is governed by a Content
  schema or design tokens (principle IV), and work is test-first (principle III).
- **Platform:** a single-page web application (Angular SPA) built to static files that any
  static host can serve. Hosting and DNS are deferred and do not block development.
- **UI library:** the UX spines recommend no styled component library: custom components on the
  design tokens, using Angular CDK accessibility primitives (focus trap, live announcer). The
  final decision is made in `bmad-architecture` against NFR-1 and NFR-2 and recorded as an ADR.
- **Legal (LFPDPPP 2025):** the Privacy notice must name the Legal identity (responsible party
  and *domicilio*), state the purpose (responding to the Lead), the data involved, the retention
  period, and the ARCO-rights process, and reference SABG, not INAI. It must be specific, with no
  catch-all wording such as "entre otros". v1 uses a generic notice with the stand-in
  responsible party from §3, so it does not yet meet every point above (accepted risk, §8.3);
  the missing items are added when supplied (§10, Q6). A legal review by kVA is recommended
  before launch (§10, Q3).

## 7. Non-Goals (Explicit)

- Not a CMS. Content changes go through a developer.
- No backend, database, form-to-email service, or analytics in v1.
- No blog or news, client portal or login, e-commerce or payments, or careers page.
- No English version in v1 (the architecture must not rule one out).
- No live chat. WhatsApp is limited to the FR-17 placeholder until kVA supplies a number.
- No second contact channel: kVA's proyectos2@kvainstalaciones.mx address and (56) 4029 4029
  phone, both listed in its brochure, are not published (FR-20). Reason: user decision
  (2026-10-21).

## 8. MVP Scope

### 8.1 In Scope

- One es-MX page with every §4 feature: Page shell, Hero, Services, Projects, Nosotros section,
  Trust, Contact, Privacy notice, and footer.
- Content docs with Content schemas for every content type, validated at build time.
- SEO and share metadata, structured data, robots and sitemap.
- The real Projects from kVA's 2025 brochure, with scope, outcome, and proof fields shown only
  when present; the Placeholder project mechanism, labeled "Ejemplo Ilustrativo".
- A WhatsApp CTA placeholder, hidden until a number is configured (FR-17).
- A generic Privacy notice with the stand-in responsible party (§3).

### 8.2 Out of Scope for MVP

- An active WhatsApp channel (number and business account; FR-17). Launch does not wait for it,
  although research suggests WhatsApp converts better than email.
- A phone field and a free-text message field in the Contact composer (removed to keep friction
  low).
- Choice of host and an automated deployment pipeline (deferred; see §8.3).
- A separate page per Service for SEO reach (v2 candidate).
- Analytics and conversion tracking (v2; Leads are counted manually, SM-1).

### 8.3 Launch Readiness

Development can proceed now. Going live at kvainstalaciones.mx additionally needs:

- **Hosting with HTTPS and the NFR-4 CSP, plus the DNS cutover** (owner: dev team, Arturo),
  tracked as a launch story outside the build epics.
- **Share image (1200×630 px, FR-16) and favicon** (owner: dev team), produced from the
  supplied PNG logo and the best available brochure photo, using the composition DESIGN.md
  proposes. kVA's vector logo and high-resolution photo originals replace them when supplied
  (§10, Q5).
- **SM-2 check** passing on the built output.
- **SM-3 check** (moved from §9): adding a Service and adding a Project each works by a Content
  doc change alone, verified once on the built output (FR-5, FR-15).

Accepted risks (fallbacks for §10 questions; none blocks launch):

**Accepted risk (content, §10 Q2):** the real brochure Projects may launch with only title,
Service, and photos (§4.4), and Trust with only the three launch Trust items (§4.6). If no
client group's permission is recorded by launch, the Clientes list is not rendered (FR-19).

**Accepted risk (copy approval, §10 Q7):** copy kVA has not approved by launch (Hero, Nosotros,
Service descriptions) ships as the default copy from the UX spines (EXPERIENCE.md launch seed
and Default UI strings). kVA's later corrections are Content-doc-only changes.

**Accepted risk (photo licenses, §10 Q8):** brochure photos publish as "supplied by kVA"
(FR-9) before kVA confirms their rights. A photo later found to be unlicensed is replaced or
removed when discovered; a Project left with no photo is unpublished until it has one.

**Accepted risk (phone format, §10 Q11):** (56) 4000 3344 is shown as given in the brochure,
and its `tel:` link and JSON-LD `telephone` use +52 56 4000 3344 (FR-20). If kVA reports a
different format, the call link fails until the site Content doc is corrected.

**Accepted risk (legal, §10 Q6):** the site may go live before kVA supplies its Legal identity
and retention period, with the Privacy notice incomplete under the LFPDPPP (§6 Legal). Owner:
kVA.

## 9. Success Metrics

**Primary**
- **SM-1:** qualified Leads per month (§3 Lead), tallied manually by kVA. The untagged and
  phone paths depend on the contact mentioning the site and are expected to undercount. Target:
  at least 1 qualified Lead in each calendar month from month 3 after launch. Validates FR-2,
  FR-6, FR-11, FR-13, FR-17, FR-20.

**Secondary**
- **SM-2:** Lighthouse mobile scores on the production URL: Performance 90 or higher,
  Accessibility 100, SEO 100 [ASSUMPTION]. Validates NFR-1, NFR-2, FR-16.
- **SM-3:** moved to §8.3 Launch Readiness (2026-10-22), because it is verified once before
  launch rather than measured after it. The ID is kept and not reused.
- **SM-4:** kvainstalaciones.mx is the first Google result for "kVA Instalaciones" within 4 weeks
  of launch [ASSUMPTION]. Validates FR-16.

**Counter-metrics (do not optimize)**
- **SM-C1:** total Lead count, including unqualified ones. Adding fields, pop-ups, or aggressive
  prompts to raise volume must not lower Lead quality or trust. Counterbalances SM-1.
- **SM-C2:** visual richness (animation, hero video, heavy imagery). It must not breach NFR-1.
  Counterbalances any design push in `bmad-ux`.

## 10. Open Questions

None blocks development or launch; §8.3 records launch-content fallbacks as accepted risks.

1. **WhatsApp number:** which number and WhatsApp Business account? Owner: kVA. Until it exists,
   the WhatsApp CTA stays hidden (FR-17). Status: non-blocking.
2. **Real proof content:** the brochure supplies Project titles and photos and the Clientes
   list. Still needed: scope and outcome per Project, plus optional location, year, and
   standards; written permission per client group (FR-19, also covering Project client-name
   fields, FR-8), with the brochure's group-to-item assignment confirmed; and confirmed Trust
   items (for example, a REPSE number). Owner: kVA. Status: non-blocking (accepted risk, §8.3).
3. **Privacy notice review:** kVA's legal review of the generic v1 notice is recommended before
   launch. Owner: kVA. Status: non-blocking (recommended, not required).
4. **Hosting and DNS:** who controls kvainstalaciones.mx DNS and the current host
   (216.245.211.66)? Owner: kVA / dev team. Status: non-blocking; the build only produces static
   files, and the answer feeds the hosting and DNS launch story (§8.3).
5. **Brand assets:** the logo is supplied (`assets/media/icon.png`: white mark on a solid black
   background, 406×213 px, no transparency). DESIGN.md proposes the palette (a dark and light
   scheme with a single copper accent) and fonts (Quicksand and Outfit, open-license lookalikes
   of the brochure's fonts). Still open: a vector (SVG) logo, high-resolution originals of the
   brochure photos (also needed for the 1200×630 px share image, FR-16), and the photo and font
   licenses (Q8, Q9). Owner: kVA. Status: non-blocking; launch uses the supplied PNG logo and
   available photos (§8.3).
6. **Legal identity and retention:** registered company name (*razón social*), *domicilio*, and
   the data-retention period for the Privacy notice. Owner: kVA. Status: non-blocking (user
   decision, 2026-10-21; accepted risk, §8.3).
7. **Content approval:** who at kVA approves claims (Trust items, Project facts, Client names)
   and copy (the Nosotros rewording of the brochure text and the default Hero headline and
   supporting line) before they are published? Owner: kVA. Status: non-blocking (user decision,
   2026-10-22; accepted risk, §8.3). Trust items and Clients still need their own confirmation
   and permission (FR-10, FR-19).
8. **Photo licenses:** are the brochure photos (section backgrounds and Projects) kVA's own or
   licensed for web use? Owner: kVA. Status: non-blocking (user decision, 2026-10-22; accepted
   risk, §8.3).
9. **Font licensing:** keep the open-license lookalikes proposed in DESIGN.md, or license the
   brochure fonts (All Round Gothic, Apparat) for the web? Owner: kVA. Status: non-blocking;
   the open-license lookalikes ship until kVA decides.
10. **Project-to-Service mapping:** kVA confirms the Service of each brochure Project. The UX
    seed puts 7 of 9 under Instalaciones, so that filter option barely narrows; Desarrollo e
    Ingeniería de Proyecto and Servicios de Datos have no Projects yet, so no filter option.
    Owner: kVA. Status: non-blocking; the UX seed mapping ships, and a correction is a
    Content-doc-only change.
11. **Phone format:** confirm that (56) 4000 3344 dials as +52 56 4000 3344 (FR-20). Owner: kVA.
    Status: non-blocking (user decision, 2026-10-22; accepted risk, §8.3).

## 11. Assumptions Index

- §2.4: the copy addresses the reader as *tú*.
- §4.4 FR-8: the browser Back action closes the Project detail view.
- §4.6: kVA confirms the three launch Trust items (3+ years, nationwide coverage,
  NOM-001-SEDE-2012).
- §4.7 FR-13: Lead subject tag text `[kvainstalaciones.mx]`.
- §4.7 FR-17: the WhatsApp CTA is hidden, not shown disabled, until a number is set.
- §4.7 FR-20: the published phone dials as +52 56 4000 3344.
- §5 NFR-1: Core Web Vitals "good" thresholds as targets.
- §5 NFR-3: browser support matrix.
- §5 NFR-4: the Content Security Policy baseline.
- §9 SM-2: Lighthouse targets.
- §9 SM-4: brand-search ranking target and timeframe.
