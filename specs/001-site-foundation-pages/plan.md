# Implementation Plan: Site Foundation and GitHub Pages Delivery

**Branch**: `001-site-foundation-pages` | **Date**: 2026-10-22 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-site-foundation-pages/spec.md`

## Summary

Publish a prerendered Spanish kVA Instalaciones page to GitHub Pages. Angular builds one static
route under `/octo-robot-kva/`. Schema-validated typed site content supplies visible copy and
metadata. One GitHub Actions workflow tests, builds, and verifies static output on pull requests
and `main` pushes; only `main` pushes deploy.

## Technical Context

**Language/Version**: TypeScript 6.0.3, Angular 22.2.3, Node.js 22 in CI

**Primary Dependencies**: `@angular/ssr` 22.2.4 and `@angular/platform-server` 22.2.3 for static
prerendering; test-only `ajv` 8.20.0 and `ajv-formats` 3.0.1

**Storage**: N/A

**Testing**: Vitest 5.0.5 through `ng test`; Node static-output verification after build

**Target Platform**: Static HTTPS hosting on GitHub Pages; NFR-3 browsers

**Project Type**: Single-page static web application

**Performance Goals**: Stay within `angular.json` budgets; no runtime third-party requests

**Constraints**: No server runtime, backend, cookies, analytics, or executable inline scripts;
`<meta>` CSP because GitHub Pages cannot set custom headers

**Scale/Scope**: One prerendered route and one deployment workflow

## Constitution Check

| Gate                                      | Status                                                 |
| ----------------------------------------- | ------------------------------------------------------ |
| I. BMAD-driven delivery                   | Pass: architecture spine and this spec govern the work |
| II. Behaviour models before code          | Pass: no user action is added                          |
| III. Test-first verification              | Pass: failing tests precede implementation tasks       |
| IV. Schema- or token-governed layout      | Pass: page shell uses `site.schema.json`               |
| V. Modern Angular discipline              | Pass: standalone, OnPush, signals, `inject()`          |
| VI. Accessible, mobile-first, budgeted UI | Pass: semantic shell, `lang="es-MX"`, budgets kept     |
| Technology constraints                    | Pass: static output; Material is not needed yet        |

Re-check after design: Pass.

## Project Structure

### Documentation (this feature)

```text
specs/001-site-foundation-pages/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/static-page.md
└── tasks.md
```

### Source Code (repository root)

```text
.github/workflows/pages.yml
content/site.md
public/media/kva-icon.png
scripts/verify-static-build.mjs
src/
├── index.html
├── main.server.ts
└── app/
    ├── app.config.ts
    ├── app.config.server.ts
    ├── app.routes.server.ts
    ├── app.{ts,html,scss,spec.ts}
    └── core/
        ├── content/site.content.{ts,spec.ts}
        └── schemas/site.schema.json
```

**Structure Decision**: Single Angular project following architecture AD-1, AD-3, AD-8, AD-10,
and AD-11.

## Complexity Tracking

No violations.
