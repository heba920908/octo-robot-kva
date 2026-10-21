---
title: "PRD: kVA Instalaciones Landing Page"
status: final
created: 2026-10-19
updated: 2026-10-21
---

# PRD: kVA Instalaciones Landing Page

## 0. Document Purpose

This PRD is for the team building kvainstalaciones.mx and for the BMAD workflows that run next:
`bmad-ux`, `bmad-architecture`, and `bmad-create-epics-and-stories`. It builds on the final
product brief ([brief](../../briefs/brief-agency-portfolio-2026-10-19/brief.md), with its
[addendum](../../briefs/brief-agency-portfolio-2026-10-19/addendum.md)) and does not repeat its
market research. All work is governed by the project constitution
(`.specify/memory/constitution.md`, v1.0.0). Terms defined in §3 are used verbatim throughout.
Requirements are grouped by feature with globally numbered FRs. Inferences are tagged
`[ASSUMPTION]` and indexed in §11. Technology choices are kept in `addendum.md`. The
client-supplied kVA logo is `assets/media/icon.png`.

## 1. Vision

kVA Instalaciones (short name **kVA**) designs and builds enterprise-grade electrical
installations, structured cabling, power consumption analysis, and data services for Mexican
companies. kvainstalaciones.mx currently shows an unfinished template. This product replaces it
with a single Spanish-language (es-MX) promotional page, delivered as a single-page web
application (SPA), that makes a facilities manager, plant engineer, or general contractor think,
within seconds: *these people do serious electrical work, to standard*. It then puts contacting
kVA one step away.

The page is deliberately simple: static, promotional, and with no backend. Every contact is an
email the Visitor sends from their own email client to proyectos1@kvainstalaciones.mx.
Everything kVA says about itself (Services, Projects, Trust items, copy) lives in Markdown
**Content docs** in the repository. These are the single source of truth, so adding a Service or
a Project is a content edit rather than a redesign.

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
  month's bill carried a low-power-factor penalty. She searches on her phone and lands on the
  Hero. She scrolls to **Services**, opens *Análisis de consumo eléctrico*, and taps its CTA. The
  **Contact composer** opens with that **Service** already selected. She enters her email,
  accepts the Privacy notice, and taps send. Her email app opens with a ready-to-send message to
  proyectos1@kvainstalaciones.mx. She sends it. **Edge case:** her phone has no email app
  configured, so the page shows the address with a one-tap copy button instead.
- **UJ-2. Jorge, a facilities manager, vets kVA after a referral.**
  A colleague recommended kVA for re-cabling two office floors. Jorge opens kvainstalaciones.mx
  on his desktop and filters **Projects** by *Cableado estructurado*. He opens a **Project detail
  view** to see photos, scope, and outcome, and closes it without losing his place. He checks the
  **Trust section** for years in business and standards, then contacts kVA through the
  **Contact composer**.
- **UJ-3. Ana, a general contractor, shortlists an electrical subcontractor.**
  Ana is assembling bids for a new commercial building. She skims the Hero and Services to
  confirm kVA does enterprise electrical installations. She copies proyectos1@kvainstalaciones.mx
  and later emails kVA from her company's webmail with the bid documents attached.

### 2.4 Messaging, Tone, and Positioning

This section guides the copy in the Content docs. The final wording lives in those docs, not
here.

- **Positioning:** enterprise-grade electrical work done to standard — installations that pass
  inspection and help clients avoid CFE (the state power utility) penalties and downtime. This
  holds only if the page shows evidence, so claims are tied to Trust items and Projects.
- **Voice:** marketing tone (confident, benefit-led, and in es-MX), addressing the reader as
  *tú* [ASSUMPTION: *tú* rather than *usted*]. It stays credible for a risk-averse buyer:
  concrete, verifiable claims and no unsupported superlatives ("los mejores", "líderes").
- **Buyer risks to speak to:** downtime, failed inspections, CFE penalties, and safety incidents.
- **Per-Service hooks:**
  - *Power consumption analysis:* CFE GDMTH tariff, demand and time-of-use charges, penalties
    for power factor below 90%, harmonics, and Código de Red compliance ("evita penalizaciones
    de factor de potencia").
  - *Structured cabling:* installations certified to ANSI/TIA-568, with test reports.
  - *Electrical installations:* NOM-001-SEDE-2012 compliance, and work verifiable by a UVIE (an
    accredited electrical-installation inspection unit) where applicable.
  - *Data services:* outcome-led (better decisions, visible operations) rather than tool-led.
- **Coverage:** nationwide coverage ("Cobertura en todo México") is visible on the page, not only
  in metadata.
- **CTA vocabulary:** quote-led and visit-led labels common in the Mexican market, such as
  "Cotiza tu proyecto" and "Solicita una visita técnica".
- **Shortlist substance:** for procurement, the page shows the Legal identity, years in business,
  coverage, and standards, so a shortlist review can rely on it.

## 3. Glossary

- **Visitor** — anyone viewing kvainstalaciones.mx.
- **Lead** — an email received at proyectos1@kvainstalaciones.mx that was started from the page
  (it carries the **Lead subject tag**). Untagged emails whose sender says they found kVA through
  the site also count, because the **Copy-address fallback** path produces no tag. Once the
  **WhatsApp CTA** is enabled, chats started from the page count too. A *qualified* Lead comes
  from an enterprise prospect with a real installation, cabling, analysis, or data need.
- **Lead subject tag** — the fixed prefix that every email generated by the page carries in its
  subject line, so kVA can recognize and count Leads.
- **Service** — one kVA offering, initially four: structured cabling, electrical installations,
  power consumption analysis, and data services — data analytics, business intelligence (BI),
  and IT data management. Each Service is defined by one **Content doc**, and the set of Services
  can grow.
- **Project** — one reference job kVA has done, belonging to exactly one **Service**. It is
  defined by one **Content doc**.
- **Placeholder project** — a **Project** whose content is illustrative, not a real kVA job,
  and which is marked as such in its Content doc.
- **Project filter** — the control that limits the visible **Projects** to one **Service** or
  shows all of them.
- **Project detail view** — the in-page expanded view of one **Project** (photos, scope,
  outcome).
- **Trust item** — one credibility claim (for example, years in business, a standard followed,
  a registration or certification), defined in a **Content doc**.
- **Contact composer** — the in-page control that collects the Visitor's email and **Service**
  and hands a pre-written email to the Visitor's email client (`mailto:`). Its form factor
  (inline section or slide-in panel) is decided in `bmad-ux`.
- **Header contact CTA** — the contact call to action in the page header (FR-2).
- **Copy-address fallback** — a visible display of proyectos1@kvainstalaciones.mx with a
  one-action copy control, for Visitors whose email client does not open.
- **WhatsApp CTA** — a click-to-chat link to kVA's WhatsApp number. It is a placeholder in v1:
  it stays hidden until a real number is set in a **Content doc** (FR-17).
- **Content doc** — a Markdown file in the repository (front matter plus body) that is the single
  source of truth for one piece of site content.
- **Content schema** — the JSON Schema that every **Content doc** of a given type must validate
  against (constitution principle IV).
- **Legal identity** — kVA's registered company name (*razón social*) and address
  (*domicilio*), shown in the footer and the Privacy notice. kVA has not supplied it yet (§10,
  Q6).
- **UI strings** — every interface label and message that is not section content (navigation
  labels, buttons, validation errors, "Todos", "Copiado", "Ejemplo Ilustrativo", status messages,
  `aria-label`/`alt`/`title` text). They live in one Content doc. The strings quoted in §4 are
  the default copy.
- **Reference viewport** — 360×640 CSS px, the phone viewport used for "above the fold" checks.
- **Privacy notice** — kVA's *aviso de privacidad*, as required by the LFPDPPP (2025 reform).

## 4. Features

*FR IDs are stable. FR-17 was added after the first draft, so it sits in §4.6.*

### 4.1 Page Shell and Navigation

**Description:** One mobile-first page in Spanish (es-MX). A header holds the kVA Instalaciones
brand, anchor links to each section (Servicios, Proyectos, Confianza, Contacto), and the Header
contact CTA. A footer holds the Legal identity, proyectos1@kvainstalaciones.mx, and the Privacy
notice link. Realizes UJ-1, UJ-2, UJ-3.

#### FR-1: Single-page section navigation

A Visitor can jump to any section from the header and land with the section heading visible.
Realizes UJ-2.

**Consequences (testable):**
- Each header link moves focus and scroll to its section; the URL fragment updates
  (`#servicios`, `#proyectos`, `#confianza`, `#contacto`).
- On viewports narrower than the mobile breakpoint (a design token), the links collapse into a
  menu that opens and closes by keyboard and screen reader, and closes when a link is chosen or
  Esc is pressed.
- Smooth scrolling is disabled when `prefers-reduced-motion: reduce` is set.

#### FR-2: Contact always one step away

A Visitor can reach the Contact composer from any scroll position with one action.
Realizes UJ-1.

**Consequences (testable):**
- The Header contact CTA stays visible at every scroll position on mobile and desktop
  (`bmad-ux` chooses a sticky header or a floating button).
- Activating it opens or scrolls to the Contact composer and moves focus to its first field.

#### FR-3: Brand and Legal identity

The page shows the brand name **kVA Instalaciones** in the header, `<title>`, and footer, and
uses **kVA** in running copy, always written with a lowercase "k" and capital "VA".

**Consequences (testable):**
- The header shows the kVA logo (source asset `assets/media/icon.png`) with the accessible name
  "kVA Instalaciones", and the favicon is derived from the same logo.
- The footer shows the Legal identity, proyectos1@kvainstalaciones.mx, the current year, and
  the Privacy notice link.
- The document language is declared as `es-MX`.

### 4.2 Hero

**Description:** The first screen states who kVA is and for whom, in marketing tone, with a
primary contact CTA and a secondary CTA that goes to Services. All copy comes from a Content doc.
Realizes UJ-1, UJ-3.

#### FR-4: Hero value statement and CTAs

A Visitor sees, without scrolling on the Reference viewport, a headline, a supporting line, a
primary CTA (for example, "Cotiza tu proyecto") that opens the Contact composer, and a secondary
CTA that goes to Services.

**Consequences (testable):**
- Headline, supporting line, and CTA labels are read from the hero Content doc; changing the doc
  and rebuilding changes the page without code changes.
- The Hero headline is the page's only `<h1>`.
- The first screen on the Reference viewport also shows the kVA logo and at least one proof
  point (for example, years in business or nationwide coverage), so credibility registers within
  seconds.

### 4.3 Services

**Description:** A grid of Service cards built from the Service Content docs. Each card shows a
name, short description, and icon or image, plus a CTA that opens the Contact composer with
that Service pre-selected. The set is extensible: adding a Service Content doc adds a card and a
Contact composer option, and a Project filter option once the Service has Projects. Realizes
UJ-1.

#### FR-5: Content-driven Service cards

A Visitor sees one card per Service, in the order defined in the Content docs.

**Consequences (testable):**
- With four Service Content docs there are four cards; adding a fifth valid doc and rebuilding
  produces five cards and five Contact composer options, with no code change. The Project filter
  gains an option for the new Service once it has at least one Project (FR-7).
- A Service Content doc that fails its Content schema fails the build (see FR-15).

#### FR-6: Service CTA pre-fills the Contact composer

A Visitor can start a contact about a specific Service from its card. Realizes UJ-1.

**Consequences (testable):**
- Activating a Service CTA opens or scrolls to the Contact composer with that Service selected,
  and focus moves to the email field.
- The Visitor can still change the selected Service.

### 4.4 Projects

**Description:** A grid of Project cards (image, title, Service, one-line summary), filterable by
Service. Opening a card shows the Project detail view in the page (photos, scope, outcome).
Closing it returns the Visitor to the same card and filter. At launch, Projects may be
Placeholder projects. Realizes UJ-2.

#### FR-7: Filter Projects by Service

A Visitor can filter Projects to one Service, or show all of them. Realizes UJ-2.

**Consequences (testable):**
- Options are "Todos" plus one per Service that has at least one Project.
- Applying a filter shows only matching Projects and announces the result count to assistive
  technology.
- The active filter is visually and programmatically indicated (for example, `aria-pressed`).
- Filtering requires no page reload or network request.

#### FR-8: Project detail view

A Visitor can open a Project to see its photos, scope, and outcome without leaving the page.
Realizes UJ-2.

**Consequences (testable):**
- The Project detail view opens from a card by click, tap, or keyboard, traps focus while open,
  and closes with a close control, the Esc key, or the browser Back action [ASSUMPTION: Back
  closes the view].
- On close, focus returns to the card that opened it, and the active filter is kept.
- Images have meaningful `alt` text from the Content doc. Every photo can be reached by keyboard;
  `bmad-ux` chooses gallery or stacked layout.
- Optional proof fields render when present: client name (only if the Content doc records the
  client's permission), location (state), year, and standards applied.
- The view has a "Cotiza un proyecto similar" CTA that opens the Contact composer with the
  Project's Service pre-selected.
- A Placeholder project shows its "Ejemplo Ilustrativo" label in the detail view as well as on
  the card.

#### FR-9: Placeholder projects are honest

Placeholder projects are allowed at launch but must not pass as real kVA work.

**Consequences (testable):**
- A Project Content doc marked as placeholder renders with a visible "Ejemplo Ilustrativo" label.
- Replacing a Placeholder project with a real one is a Content-doc-only change.
- Placeholder images are kVA's own, supplied by kVA, or licensed for commercial use, and the
  Content doc records their source and license.

### 4.5 Trust

**Description:** A section of Trust items. At launch it holds years in business ("3+ años"),
nationwide coverage, and NOM-001-SEDE-2012 compliance [ASSUMPTION: kVA confirms these three].
Registrations and certifications (candidates are listed in `addendum.md`) are added once kVA
supplies evidence. Only evidence-backed Trust items are shown. Realizes UJ-2, UJ-3.

#### FR-10: Content-driven Trust items

A Visitor sees each Trust item that is marked as confirmed in its Content doc.

**Consequences (testable):**
- A Trust item whose Content doc is not marked as confirmed does not render.
- A Trust item can carry an evidence reference (for example, a registration number or
  certificate ID), which is shown next to it.
- If no Trust items are confirmed, the section and its header link are hidden rather than shown
  empty.

### 4.6 Contact

**Description:** The Contact composer collects the Visitor's email and the Service of interest
(optionally pre-filled by FR-6). There is no phone field, to keep friction low. The email field
captures the address kVA should reply to, which may differ from the address the Visitor sends
from. Its form factor is decided in `bmad-ux` (§3), and its behaviour model defines focus, Esc,
and Back handling. After the Visitor accepts the Privacy notice, the Contact composer opens the
Visitor's email client with a pre-written email to proyectos1@kvainstalaciones.mx. The site
transmits and stores nothing. The Copy-address fallback is always available. No response-time
promise is shown. Realizes UJ-1, UJ-3.

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
- The subject always starts with the fixed tag `[kvainstalaciones.mx]` [ASSUMPTION: tag text].

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

### 4.7 Privacy Notice

**Description:** kVA's *aviso de privacidad* is reachable from the footer and from the Contact
composer's consent control. v1 ships a generic notice written for the `mailto:` flow: the site
itself collects and stores nothing, and the data reaches kVA only in the email the Visitor sends.
The site renders the notice from a Content doc, so kVA can replace the text later.

#### FR-14: Privacy notice access

A Visitor can read the Privacy notice before consenting, without losing the Contact composer
state.

**Consequences (testable):**
- The Privacy notice opens from the consent control and the footer, and closing it keeps the
  values already entered in the Contact composer.
- Its text is rendered from a Content doc. If that doc is missing or invalid, the build fails.

### 4.8 Content Management

**Description:** All site copy and data come from Content docs in the repository, each validated
against its Content schema at build time. A developer updates the site by editing Content docs
and rebuilding. There is no CMS. Copy is not hard-coded in components, which keeps a future
language version possible.

#### FR-15: Content docs are the single source of truth

**Consequences (testable):**
- Every user-visible string or data item comes from a Content doc. This covers section content
  (Hero, Services, Projects, Trust, Contact, footer, Privacy notice, SEO metadata) and all UI
  strings.
- An automated check (test or lint) fails if a component template contains literal text nodes
  or literal `aria-label`, `alt`, `title`, or `placeholder` values; only bindings are allowed.
- Every Content doc validates against its Content schema. Any failure stops the build and names
  the file and field.
- Adding, editing, or removing a Service, Project, or Trust item needs no source-code change.

### 4.9 Search and Sharing

**Description:** The page can be found and previews well when shared on WhatsApp, LinkedIn,
or by email.

#### FR-16: Search and share metadata

**Consequences (testable):**
- The page has a title, meta description, and canonical URL `https://kvainstalaciones.mx/`,
  with Open Graph and Twitter card tags (title, description, image) from a Content doc.
- It has schema.org structured data describing kVA Instalaciones as a local business
  (`ElectricalContractor`) with name, URL, email, and area served (Mexico).
- The title, meta description, canonical URL, Open Graph tags, and structured data are present in
  the served HTML without running JavaScript, because link-preview crawlers (WhatsApp, LinkedIn)
  do not execute it.
- The Hero, Service names and descriptions, Trust items, and Project titles are present in the
  served HTML through build-time prerendering. The page is still a single-page application
  served as static files.
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
  stored or transmitted by the site. HTTPS only. A Content Security Policy is applied with
  this baseline: `default-src 'self'`, the inline JSON-LD allowed by hash, self-hosted fonts and
  images, no third-party origins, `base-uri 'self'`, and `frame-ancestors 'none'` [ASSUMPTION].
  A `<meta>` CSP is acceptable until hosting headers exist (`frame-ancestors` then needs a
  header).
- **NFR-5 Extensibility:** new Services, Projects, and Trust items are added through Content docs
  only (FR-5, FR-15). Copy is kept out of components so a future language can be added.

## 6. Constraints and Guardrails

- **Constitution:** every user action in §4 has a behaviour model in `src/app/behaviors/` before
  implementation (principle II). This applies at least to section navigation, the Header contact
  CTA, Service CTA pre-fill, the Project filter, the Project detail view, the mobile menu, the
  Contact composer (including the "Cotiza un proyecto similar" entry point), the Copy-address
  fallback, the WhatsApp CTA, and the Privacy notice. The Hero CTAs are covered by the
  `contact-cta` and `section-navigation` models. Every layout is governed by a Content schema or
  design tokens (principle IV), and work is test-first (principle III).
- **Platform:** a single-page web application (Angular SPA) built to static files that any
  static host can serve. Hosting and DNS are deferred and do not block development.
- **UI library:** not chosen yet. The choice is made in `bmad-ux` and `bmad-architecture` against
  NFR-1 and NFR-2 and recorded as an ADR.
- **Legal (LFPDPPP 2025):** the Privacy notice must name the Legal identity (responsible party
  and *domicilio*), state the purpose (responding to the Lead), the data involved, the retention
  period, and the ARCO-rights process, and reference SABG, not INAI. It must be specific, with no
  catch-all wording such as "entre otros". v1 uses a generic notice that meets these points; a
  legal review by kVA is recommended before launch (§10, Q3).

## 7. Non-Goals (Explicit)

- Not a CMS. Content changes go through a developer.
- No backend, database, form-to-email service, or analytics in v1.
- No blog or news, client portal or login, e-commerce or payments, or careers page.
- No English version in v1 (the architecture must not rule one out).
- No live chat. WhatsApp is limited to the FR-17 placeholder until kVA supplies a number.

## 8. MVP Scope

### 8.1 In Scope

- One es-MX page with Page shell, Hero, Services, Projects (filter and detail view), Trust,
  Contact (Contact composer and Copy-address fallback), Privacy notice, and footer.
- Content docs with Content schemas for every content type, validated at build time.
- SEO and share metadata, structured data, robots and sitemap.
- Placeholder projects, labeled "Ejemplo Ilustrativo".
- A WhatsApp CTA placeholder, hidden until a number is configured (FR-17).
- A generic Privacy notice.

### 8.2 Out of Scope for MVP

- An active WhatsApp channel (number and business account), switched on by a Content doc change
  once kVA supplies a number. Launch does not wait for it, although research suggests WhatsApp
  converts better than email.
- A phone field and a free-text message field in the Contact composer (removed to keep friction
  low).
- Choice of host and an automated deployment pipeline (deferred; see §8.3).
- A separate page per Service for SEO reach (v2 candidate).
- Analytics and conversion tracking (v2; Leads are counted from the inbox).

### 8.3 Launch Readiness

Development can proceed now. Going live at kvainstalaciones.mx additionally needs:

- **Legal identity and retention period** in the Privacy notice and footer (owner: kVA; §10, Q6).
- **Hosting with HTTPS and the NFR-4 CSP, plus the DNS cutover** (owner: dev team, Arturo). This
  is tracked as a launch story outside the build epics.
- **Share image and logo variants** (owner: kVA, or `bmad-ux` if kVA does not supply them;
  §10, Q5).
- **SM-2 check** passing on the built output.

**Accepted risk:** launch may go ahead with only Placeholder projects. Trust then holds years in
business, nationwide coverage, and NOM-001-SEDE-2012 compliance.

## 9. Success Metrics

**Primary**
- **SM-1:** qualified Leads per month in the proyectos1@kvainstalaciones.mx inbox, counted by
  the Lead subject tag plus a manual check of untagged emails that mention the site. The untagged
  path is expected to undercount. Target: at least 1 qualified Lead in each calendar month from
  month 3 after launch. Validates FR-2, FR-6, FR-11, FR-13.

**Secondary**
- **SM-2:** Lighthouse mobile scores on the production URL: Performance 90 or higher,
  Accessibility 100, SEO 100 [ASSUMPTION]. Validates NFR-1, NFR-2, FR-16.
- **SM-3:** a Service or Project can be added by a Content doc change alone, verified once
  before launch. Validates FR-5, FR-15.
- **SM-4:** kvainstalaciones.mx is the first Google result for "kVA Instalaciones" within 4 weeks
  of launch [ASSUMPTION]. Validates FR-16.

**Counter-metrics (do not optimize)**
- **SM-C1:** total Lead count, including unqualified ones. Adding fields, pop-ups, or aggressive
  prompts to raise volume must not lower Lead quality or trust. Counterbalances SM-1.
- **SM-C2:** visual richness (animation, hero video, heavy imagery). It must not breach NFR-1.
  Counterbalances any design push in `bmad-ux`.

## 10. Open Questions

1. **WhatsApp number:** which number and WhatsApp Business account? Owner: kVA. Until it exists,
   the WhatsApp CTA stays hidden (FR-17).
2. **Real proof content:** projects, photos, client names (with permission), and confirmed Trust
   items (for example, a REPSE number). Owner: kVA. Not launch-blocking (accepted risk, §8.3),
   but each item added raises credibility.
3. **Privacy notice review:** the generic notice ships in v1; kVA's legal review is recommended
   before launch. Owner: kVA. Does not block development.
4. **Hosting and DNS:** who controls kvainstalaciones.mx DNS and the current host
   (216.245.211.66)? Owner: kVA / dev team. Deferred; the build only has to produce static files.
5. **Brand assets:** the logo is supplied (`assets/media/icon.png`: white mark on a solid black
   background, 406×213 px, no transparency). Still open: color palette, font, and a vector or
   transparent version of the logo for light backgrounds. Owner: kVA. Needed for `bmad-ux`; if
   not supplied, `bmad-ux` proposes them. A 1200×630 px share image is also needed (FR-16).
6. **Legal identity and retention:** registered company name (*razón social*), *domicilio*, and
   the data-retention period for the Privacy notice. Owner: kVA. **Launch-blocking.**
7. **Content approval:** who at kVA approves claims (Trust items, Project facts, client names)
   before they are published? Owner: kVA.

## 11. Assumptions Index

- §2.4: the copy addresses the reader as *tú*.
- §4.4 FR-8: the browser Back action closes the Project detail view.
- §4.5: kVA confirms the three launch Trust items (3+ years, nationwide coverage,
  NOM-001-SEDE-2012).
- §4.6 FR-13: Lead subject tag text `[kvainstalaciones.mx]`.
- §4.6 FR-17: the WhatsApp CTA is hidden, not shown disabled, until a number is set.
- §5 NFR-1: Core Web Vitals "good" thresholds as targets.
- §5 NFR-3: browser support matrix.
- §5 NFR-4: the Content Security Policy baseline.
- §9 SM-2: Lighthouse targets.
- §9 SM-4: brand-search ranking target and timeframe.
