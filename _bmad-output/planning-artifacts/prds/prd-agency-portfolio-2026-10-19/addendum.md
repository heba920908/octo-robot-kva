# Addendum: kVA Instalaciones Landing Page PRD

Detail that the PRD links to, plus technical notes for `bmad-ux` and `bmad-architecture`.

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

## Technical notes for architecture

### Platform, SEO, and hosting

- **Platform: SPA.** The user asked to focus on a single-page web application. Head metadata
  (title, description, canonical, Open Graph, JSON-LD) must be written into `index.html` at
  build time from the Content docs, because link-preview crawlers do not run JavaScript
  (FR-16). The user chose build-time prerendering (Angular SSG) of the single route.
  Prerendering still produces static files and keeps the app an SPA; it also puts Service copy
  in the HTML for search (FR-16) and helps LCP.
- **Structured data:** JSON-LD for schema.org `ElectricalContractor`, with `areaServed: MX` and
  `email`.
- **Hosting (deferred by decision):** kvainstalaciones.mx currently resolves to 216.245.211.66
  (placeholder template). Any static host with HTTPS and custom headers (for the CSP) works.

### Content and assets

- **Content pipeline:** Markdown Content docs (front matter plus body) live in the repo, for
  example `content/services/*.md`, `content/projects/*.md`, `content/trust/*.md`,
  `content/site/*.md`. At build time they are parsed, validated against JSON Schemas (draft
  2020-12) in `src/app/core/schemas/`, and emitted as typed data for the local content service.
  Validation errors fail the build. Exact paths and tooling are decided in architecture.
- **Logo asset:** `assets/media/icon.png` is a 406×213 RGB PNG with no alpha channel (white
  "kVA" mark on solid black), so it works on dark backgrounds only. Angular 22 serves static
  files from `public/`, so architecture decides whether to copy it there or reference it as a
  build asset. A favicon and a transparent or SVG version still need to be produced.

### Contact, `mailto:`, WhatsApp, and spam

- **Contact address:** Leads go to proyectos1@kvainstalaciones.mx. The current placeholder site
  shows info@kvainstalaciones.mx, which is not used.
- **`mailto:` construction:** build it with `encodeURIComponent` for subject and body, using
  `%0D%0A` line breaks. Keep the URL under about 2,000 characters for older clients. Neither the
  browser nor the site can detect whether a mail client opened, which is why the FR-12
  post-submit message is always shown.
- **WhatsApp CTA (FR-17):** the link format is `https://wa.me/52XXXXXXXXXX?text=<encoded>`, with
  digits only (no `+`). It is driven by an optional `whatsapp` field in the site Content doc;
  when the field is absent, the CTA is not rendered.
- **Spam exposure:** proyectos1@kvainstalaciones.mx appears in plain text (FR-12, footer) and in
  JSON-LD, which invites address harvesting. This is accepted for v1. Lightweight obfuscation is
  possible as long as the address stays copyable and accessible.

### Privacy

- **Privacy notice:** a generic *aviso de privacidad* for the `mailto:` flow. It covers the
  responsible party (kVA Instalaciones), purpose (responding to the request), the data involved
  (email and service of interest), that the site stores nothing, ARCO rights through
  proyectos1@kvainstalaciones.mx, and SABG as the authority.

### Constitution mapping

- **Behaviour models to create:** `section-navigation`, `contact-cta`, `service-cta-prefill`,
  `project-filter`, `project-detail`, `contact-composer`, `copy-address`, `whatsapp-cta`,
  `privacy-notice`, and `mobile-menu`.
- **Content schemas to create:** `service`, `project`, `trust-item`, `hero`, `site` (footer, SEO,
  contact, Legal identity, optional WhatsApp number), `ui-strings`, and `privacy-notice`, plus
  `design-tokens.json`.

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
- **Client logos or names,** with written permission.
