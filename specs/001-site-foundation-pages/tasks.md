# Tasks: Site Foundation and GitHub Pages Delivery

**Input**: Design documents from `/specs/001-site-foundation-pages/`

## Phase 1: Setup

- [x] T001 Install `@angular/ssr@22.2.4`, `@angular/platform-server@22.2.3`, `ajv@8.20.0`, and `ajv-formats@3.0.1` in package.json
- [x] T002 Configure static prerendering, CSP-compatible optimization, and Pages scripts in angular.json and package.json

## Phase 2: Foundational

- [x] T003 [P] Write failing site-content schema test in src/app/core/content/site.content.spec.ts
- [x] T004 [P] Add editorial site content in content/site.md
- [x] T005 Add site JSON Schema in src/app/core/schemas/site.schema.json
- [x] T006 Add typed site content in src/app/core/content/site.content.ts

## Phase 3: User Story 1 - Visit a published kVA page (P1)

**Independent Test**: Build for Pages and verify static HTML without running scripts.

- [x] T007 [US1] Replace starter assertions with failing shell metadata tests in src/app/app.spec.ts
- [x] T008 [US1] Implement OnPush shell, title, and description metadata in src/app/app.ts and src/app/app.html
- [x] T009 [P] [US1] Replace starter styles in src/app/app.scss (left empty until design tokens exist)
- [x] T010 [US1] Update language, CSP, and icon in src/index.html and public/media/kva-icon.png
- [x] T011 [US1] Add server bootstrap and prerender route files in src/main.server.ts, src/app/app.config.server.ts, and src/app/app.routes.server.ts
- [x] T012 [US1] Add static output verification in scripts/verify-static-build.mjs

## Phase 4: User Story 2 - Publish approved changes automatically (P1)

**Independent Test**: Push to `main` and confirm the Pages deployment succeeds.

- [x] T013 [US2] Add build and deploy jobs in .github/workflows/pages.yml

## Phase 5: User Story 3 - Stop broken changes before merge (P2)

**Independent Test**: Open a pull request and confirm checks run without deployment.

- [x] T014 [US3] Restrict deployment to `main` pushes and run checks on pull requests in .github/workflows/pages.yml

## Phase 6: Polish

- [x] T015 Run tests, Pages build, and static verification from specs/001-site-foundation-pages/quickstart.md
