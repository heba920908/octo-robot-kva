# Addendum: kVA Instalaciones Landing Page Brief

This addendum holds detail for later documents (the PRD and architecture) rather than the brief.

## Content as a single source of truth (for `bmad-architecture`)

- **Source of truth:** Agency content (services, project references, company facts, contact
  details) is written as Markdown docs in the repo. They are the centralized editorial source
  of truth for technical staff and AI coding assistants.
- **Implication:** Markdown is not rendered or built into the page. Technical staff update the
  docs and matching typed Angular content in one reviewed GitHub pull request. Angular content
  validates against the JSON Schemas required by constitution principle IV, and review checks
  parity with the Markdown docs.
- **Resolved 2026-10-22:** Technical staff edit and approve changes through GitHub. "Sync to the
  official page" means updating Angular content from the Markdown reference, not importing it.

## Technical notes (for `bmad-architecture`)

- **Production domain:** kvainstalaciones.mx. Canonical URL, meta tags, Open Graph, sitemap,
  and the privacy notice's responsible-party details must use it.
- **Current site (checked 2026-10-19):** kvainstalaciones.mx resolves to 216.245.211.66 and
  serves an unedited HTML template ("SITIO WEB EN CONSTRUCCION", "ESCRIBE AQUI TU TEXTO",
  Intro/Work/About/Contact sections, template social links). The only real content is the
  email address info@kvainstalaciones.mx. Nothing needs migrating; cutover only needs DNS or
  host access. Hosting choice and deploy target are open.
- **Email delivery:** A static page needs a `mailto:` link, a form-to-email service, or a
  serverless endpoint. To be decided; the choice affects privacy-notice wording and spam
  protection.
- **Placeholder projects:** Projects use placeholder fixtures that must still validate against
  the portfolio-item JSON Schema (constitution principle IV), so swapping in real content is a
  Content-only change.
- **Repo naming:** Repo and workspace names still say "agency-portfolio" (from the original
  blueprint). The product is a contractor credibility page for **kVA Instalaciones** (short
  name **kVA**), so decide whether to rename them.
- **Naming in content:** Use "kVA Instalaciones" in the title, footer, legal text, and privacy
  notice, and "kVA" in running copy. Keep the lowercase "k" and capital "VA" (kilovolt-ampere).

## Market research digest (2026-10-19, for the PRD and copywriting)

- **Comparables (MX):** SERI (seri.mx), TS Contratistas (tscindustrial.com), SCtelecom,
  Tecnoha México, Integra GIC (CTA: "solicita visita técnica"), and power-quality firms such as
  SEICE (seiceenergy.com.mx) and GIIT México. Typical CTAs: "Cotiza tu proyecto", technical
  site visit, pop-up lead form.
- **Trust signals:** NOM-001-SEDE-2012 (still current in 2026); UVIE-verifiable work (required
  by CFE before high-voltage and public-venue connections); REPSE registration number
  (mandatory for specialized contractors since 2021; verify on gob.mx/repse); manufacturer
  certifications (Panduit, Siemon, CommScope), BICSI, TIA/EIA-568; ISO 9001; Fluke test
  reports.
- **Buyer journey:** Discovery through Google and referrals; technical visit before a quote;
  procurement often formalizes the purchase.
- **Conversion:** Click-to-WhatsApp reportedly converts at about 10–30%, compared with about
  1–5% for forms, in MX B2B. Not chosen for v1 (email only); kept as a candidate.
- **Power-analysis messaging:** Cover the CFE GDMTH tariff (≥100 kW), demand and time-of-use
  charges, penalties for power factor below 90%, harmonics, and Código de Red compliance.
  Hook: "evita penalizaciones de factor de potencia".
- **Legal:** The 2025 LFPDPPP reform moved oversight from INAI to SABG. The privacy notice must
  be specific (no "entre otros" catch-alls), with stated retention periods and an ARCO-rights
  process.
