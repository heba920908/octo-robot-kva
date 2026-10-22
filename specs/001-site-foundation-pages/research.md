# Research: Site Foundation and GitHub Pages Delivery

## Static prerendering

- **Decision**: Use `@angular/ssr` with `outputMode: "static"` and one prerendered route.
- **Rationale**: Angular documents static output as prerendered HTML without a server file.
- **Alternatives considered**: Client-only rendering fails no-JavaScript and crawler
  requirements; server rendering needs a runtime GitHub Pages cannot provide.

## CSP on GitHub Pages

- **Decision**: Ship a `<meta>` CSP, disable critical CSS inlining, and keep subresource
  integrity disabled.
- **Rationale**: Pages cannot set custom headers. Angular's static-hosting guidance permits
  `script-src 'self'` when no inline scripts are emitted; component styles need
  `style-src 'unsafe-inline'`.
- **Alternatives considered**: `autoCsp` adds a hashed inline loader; nonces need per-response
  edge processing.

## Deployment

- **Decision**: One workflow using `actions/checkout@v7`, `actions/setup-node@v7`,
  `actions/configure-pages@v6`, `actions/upload-pages-artifact@v5`, and
  `actions/deploy-pages@v5`.
- **Rationale**: Latest official releases checked on 2026-10-22; Pages deploys with built-in
  `pages: write` and `id-token: write` permissions.
- **Alternatives considered**: Branch publishing commits build output; personal tokens add
  secret management.

## Content validation

- **Decision**: Validate typed site content with `Ajv2020` from `ajv/dist/2020` and
  `ajv-formats` in unit tests only.
- **Rationale**: Ajv's default export targets draft-07; validation must stay out of the browser.
