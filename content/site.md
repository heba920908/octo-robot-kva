---
id: site
language: es-MX
brandName: kVA Instalaciones
pageTitle: kVA Instalaciones | Instalaciones eléctricas para empresas
heading: Instalaciones eléctricas para empresas, conforme a norma
description: Ingeniería e instalaciones eléctricas para empresas en México, conforme a norma y con cobertura nacional.
canonicalUrl: https://heba920908.github.io/octo-robot-kva/
iconPath: media/kva-icon.png
contact:
  name: Ing. Alfredo Hernández
  email: proyectos1@kvainstalaciones.mx
  phone:
    e164: '+525640003344'
    display: (56) 4000 3344
facts:
  yearsInBusiness: 3+ años
  coverage: Cobertura en todo México
footerYear: 2026
footerLogo:
  src: media/logo/kva-logo-white-24.png
  src2x: media/logo/kva-logo-white-48.png
  width: 46
  height: 24
headerLogo:
  src: media/logo/kva-logo-white-40.png
  src2x: media/logo/kva-logo-white-80.png
  width: 76
  height: 40
contactLogo:
  src: media/logo/kva-logo-white-40.png
  src2x: media/logo/kva-logo-white-80.png
  width: 76
  height: 40
---

Site-wide identity, metadata and published contact channels. Typed Executable content:
`src/app/core/content/site.content.ts`.

- `contact.email` is required; `name`, `phone` and `whatsapp` are optional and omitted
  when absent. `phone.e164` is a Mexican E.164 number; `display` is the brochure form and
  its digits must match. Only proyectos1@ and (56) 4000 3344 are published.
- `facts` are the recorded company facts a Hero proof point may repeat.
- `legalIdentity` (registered company name and address) and `retentionPeriod` are optional
  and not yet supplied; the footer and privacy notice use "kVA Instalaciones" as the stand-in
  responsible party until kVA provides them.
- `footerYear` is the footer copyright year; update it with the content, not at render time.
- `footerLogo` names the 24 px white-logo derivative and its 2x file with intrinsic size.
- `headerLogo` names the 40 px white-logo derivative and its 2x file with intrinsic size for the sticky header; CSS renders it at 32 px (< 1024 px) or 40 px.
- `contactLogo` names the 40 px white-logo derivative and its 2x file with intrinsic size for the Contact section (`#contacto`).
