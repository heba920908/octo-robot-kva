# Contract: Published Static Page

The production build for GitHub Pages MUST produce `dist/agency-portfolio/browser/index.html`
with:

- `<html lang="es-MX">`
- `<base href="/octo-robot-kva/">`
- `<title>` equal to site content `pageTitle`
- One `<h1>` equal to site content `heading`
- `<app-root ng-server-context="ssg">` and an `ng-state` `application/json` hydration block
- A PNG icon link resolving to `media/kva-icon.png`
- A `Content-Security-Policy` `<meta>` tag containing `default-src 'self'`,
  `script-src 'self'`, `style-src 'self' 'unsafe-inline'`, `img-src 'self' data:`,
  `font-src 'self'`, `object-src 'none'`, and `base-uri 'self'`
- No inline executable `<script>`; non-executable `application/json` and
  `application/ld+json` data blocks are allowed
- No absolute `http:` or `https:` script, stylesheet, font, or image source

The build MUST NOT produce `dist/agency-portfolio/server/`.
