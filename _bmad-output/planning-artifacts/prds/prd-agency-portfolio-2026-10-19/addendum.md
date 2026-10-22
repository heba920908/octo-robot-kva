# Addendum: kVA Instalaciones Landing Page PRD

Detail that the PRD links to, plus technical notes for `bmad-ux` and `bmad-architecture`.
Updated 2026-10-21 (review fixes 2026-10-22) to match the final UX spines
([DESIGN.md](../../ux-designs/ux-agency-portfolio-2026-10-21/DESIGN.md),
[EXPERIENCE.md](../../ux-designs/ux-agency-portfolio-2026-10-21/EXPERIENCE.md)).

## Contact mechanism: options considered

- **A. All contact through `mailto:` (chosen).** No backend, and the site stores no personal
  data, which keeps the Privacy notice simple. Weakness: if the device has no email client,
  there is no Lead, so the Copy-address fallback (FR-12) is mandatory.
- **B. `mailto:` on Service CTAs plus a form-to-email endpoint (rejected).** Every submission is
  delivered, but it needs a third-party service or a serverless function, spam protection, and a
  privacy notice that covers data transmission.
- **C. Links only, no Contact composer (rejected).** Simplest, but there are no structured fields
  and no Service context.

**Fields:** the user cut the Contact composer to email and Service, with no phone and no
free-text message, to keep friction low. The email field gives kVA a reply-to address that may
differ from the sender's.

**Direct contact links (added 2026-10-21):** alongside option A, the Contact section and footer
show the Contact channels as plain `mailto:` and `tel:` links (FR-20). They also need no
backend, so the "site stores nothing" property holds.

## Second contact channel: options considered

kVA's brochure lists two addresses and two phones: proyectos1@kvainstalaciones.mx with
(56) 4000 3344, and proyectos2@kvainstalaciones.mx with (56) 4029 4029.

- **Show both pairs (rejected).** Proposed by the UX run, mirroring the brochure's contact page.
- **Show only proyectos1@ and (56) 4000 3344 (chosen, user decision 2026-10-21).**
  proyectos2@ and (56) 4029 4029 are kept out of the site Content doc, the page, and the
  structured data (PRD §7). Leads stay in the one inbox SM-1 already tallies.

## Legal identity: options considered

- **Block launch until kVA supplies the *razón social*, *domicilio*, and retention period
  (rejected).** A complete LFPDPPP notice from day one, but launch would wait on kVA for an item
  the user ranks lowest priority.
- **Launch with an interim notice (chosen, user decision 2026-10-21).** The Privacy notice and
  footer name "kVA Instalaciones" and proyectos1@kvainstalaciones.mx as the responsible party;
  the Legal identity and retention period are added when kVA supplies them. Accepted risk: the
  notice is LFPDPPP-incomplete until then (PRD §8.3, §10 Q6).

## Technical notes for architecture

### Platform, SEO, and hosting

- **Platform: SPA.** The user asked to focus on a single-page web application. Head metadata
  (title, description, canonical, Open Graph, JSON-LD) must be written into `index.html` at
  build time from the Content docs, because link-preview crawlers do not run JavaScript
  (FR-16). The user chose build-time prerendering (Angular SSG) of the single route.
  Prerendering still produces static files and keeps the app an SPA; it also puts Service,
  Nosotros, Clientes, and contact copy in the HTML for search (FR-16) and helps LCP.
- **Structured data:** JSON-LD for schema.org `ElectricalContractor`, with `areaServed: MX`,
  `email`, and `telephone` (`+52 56 4000 3344`, the published phone only).
- **UI library (UX recommendation):** no styled component library; custom components on the
  DESIGN.md tokens, with Angular CDK accessibility primitives (focus trap, live announcer). The
  final call is an architecture ADR, checked against NFR-1 and NFR-2.
- **Hosting (deferred by decision):** kvainstalaciones.mx currently resolves to 216.245.211.66
  (placeholder template). Any static host with HTTPS and custom headers (for the CSP) works.

### Content and assets

- **Content pipeline:** Markdown Content docs (front matter plus body) live in the repo, for
  example `content/services/*.md`, `content/projects/*.md`, `content/trust/*.md`,
  `content/clients/*.md` (one doc per client group), `content/nosotros.md`,
  `content/site/*.md`. At build time they are parsed, validated against JSON Schemas
  (draft 2020-12) in `src/app/core/schemas/`, and emitted as typed data for the local content
  service. Validation errors fail the build. Exact paths and tooling are decided in architecture.
- **Launch seed:** EXPERIENCE.md › Information Architecture holds the launch seed for the
  Services, Sub-services, Projects, Nosotros, and Clientes Content docs, taken from the brochure
  (`imports/brochure-text.md` in the UX folder). Once the docs exist, the docs win.
- **Logo asset:** `assets/media/icon.png` is a 406×213 RGB PNG with no alpha channel (white
  "kVA" mark on solid black), so it works on dark backgrounds only. Angular 22 serves static
  files from `public/`, so architecture decides whether to copy it there or reference it as a
  build asset. A favicon and an SVG version still need to be produced.

### Contact, `mailto:`, `tel:`, WhatsApp, and spam

- **Contact address:** Leads go to proyectos1@kvainstalaciones.mx. The current placeholder site
  shows info@kvainstalaciones.mx, which is not used. proyectos2@kvainstalaciones.mx is not
  published (see "Second contact channel").
- **`mailto:` construction:** build it with `encodeURIComponent` for subject and body, using
  `%0D%0A` line breaks. Keep the URL under about 2,000 characters for older clients. Neither the
  browser nor the site can detect whether a mail client opened, which is why the FR-12
  post-submit message is always shown. Direct contact `mailto:` links (FR-20) use the subject
  `[kvainstalaciones.mx] Contacto`, encoded at build time so they work without JavaScript.
- **`tel:` construction:** `tel:+525640003344` for (56) 4000 3344, pending kVA's confirmation of
  the format (PRD §10 Q11).
- **WhatsApp CTA (FR-17):** the link format is `https://wa.me/52XXXXXXXXXX?text=<encoded>`, with
  digits only (no `+`). It is driven by an optional `whatsapp` field in the site Content doc;
  when the field is absent, the CTA is not rendered. Chats pass through Meta's WhatsApp service,
  so the change that sets the field also adds a WhatsApp paragraph to the Privacy notice
  Content doc.
- **Spam exposure:** proyectos1@kvainstalaciones.mx and (56) 4000 3344 appear in plain text
  (Contact section, footer, FR-12) and in JSON-LD, which invites address harvesting and
  unsolicited calls. This is accepted for v1. Lightweight obfuscation is possible as long as the
  address and phone stay copyable, dialable, and accessible.

### Privacy

- **Privacy notice:** a generic *aviso de privacidad* for the `mailto:` flow. It covers the
  responsible party, purpose (responding to the request), the data involved (email and service
  of interest), that the site stores nothing, ARCO rights through
  proyectos1@kvainstalaciones.mx, and SABG as the authority. It gains a WhatsApp paragraph with
  the WhatsApp CTA (FR-17).
- **Interim responsible party:** see "Legal identity: options considered". The *razón social*,
  *domicilio*, and retention period are Content doc fields added later, with no code change.

### Constitution mapping

- **Behaviour models to create:** `section-navigation`, `contact-cta`, `service-cta-prefill`,
  `service-card-disclosure`, `project-filter`, `project-detail`, `project-carousel`,
  `contact-composer`, `copy-address`, `direct-contact-links`, `whatsapp-cta`, `privacy-notice`,
  and `mobile-menu`. The Nosotros section, Trust items, and Clientes list are static and need
  none. EXPERIENCE.md › Foundation maps each interactive component to its model.
- **Content schemas to create:**
  - `service`: name, description, order, Sub-services list (hook Sub-services first, PRD
    §2.4), optional image (with `alt`), and optional CTA label (default "Cotiza este servicio";
    visit-led Services can set "Solicita una visita técnica").
  - `project`: title, Service, placeholder flag, photos (each with required `alt`, `source`, and
    `license`; brochure photos use the brochure as `source` and "supplied by kVA" as `license`
    until PRD §10 Q8 is answered), and optional summary, scope, outcome, client (a client name
    plus a reference to the `client` group doc whose permission flag governs it), location,
    year, and standards. The title may name an organization without permission (PRD FR-8).
  - `trust-item`: claim, kind (general claim, or registration/certification), confirmed flag
    (kVA confirmed the claim in writing), and evidence reference (required for registrations
    and certifications, optional otherwise).
  - `client` (one doc per client group): group name, optional scope line (for example,
    "Sucursales"), items list (sites, branches, or organizations), order, and one `permission`
    flag for the whole group, covering its name and every item.
  - `nosotros`: philosophy, mission, vision, and values list (name and description).
  - `hero` (its proof point references a confirmed `trust-item` or a `site` fact, PRD FR-4),
    `ui-strings`, and `privacy-notice`.
  - `site`: footer, SEO, company facts usable as the Hero proof point (for example, coverage),
    contact name, proyectos1@ address, phone, optional Legal identity
    (*razón social*, *domicilio*) and retention period, and optional WhatsApp number. Only
    published channels are stored (no proyectos2@ or (56) 4029 4029).
  - Plus `design-tokens.json`.

### Repo naming

- The repo and workspace are still named "agency-portfolio". Decide in architecture whether to
  rename them to reflect kVA Instalaciones.

## Trust item candidates (shown only with evidence from kVA)

- **REPSE registration number:** mandatory for specialized-service contractors since 2021; check
  it on gob.mx/repse.
- **UVIE-verifiable work:** CFE requires a UVIE verification for high-voltage and
  public-gathering installations.
- **Manufacturer certifications:** Panduit, Siemon, CommScope (authorized installer, extended
  warranty).
- **BICSI credentials; ANSI/TIA-568 certification test reports (for example, Fluke).**
- **ISO 9001.**
- **Client names** are no longer a Trust item candidate: they form the Clientes list (FR-19),
  seeded from the brochure, each client group shown only with its written permission. No logos.
