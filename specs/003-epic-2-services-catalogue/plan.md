# Implementation Plan: Epic 2 — Services Catalogue

**Branch**: `003-epic-2-services-catalogue` | **Date**: 2026-11-04 | **Spec**: [spec.md](spec.md)

## Summary

Add `content/services/*.md`, `service.schema.json`, `services.content.ts`, expose through
`ContentFacade` (registering `servicios`), render `features/services`, then add the
`service-card-disclosure` behavior model and mobile toggle.

## Technical Context

Angular 22 standalone, zoneless, SCSS, Vitest via `npx ng test --watch=false`; Ajv2020 test-only.
Pattern sources: `hero.*` (content), `contact.ts` (enhanced + adapter), `copy-address.behavior.ts` (model).

## Structure

- US10: `content/services/`, `core/schemas/service.schema.json`, `core/content/services.content.ts`,
  `core/content/content-facade.ts`, `features/services/`, `app.ts`/`app.html`, static scripts.
- US11: `behaviors/service-card-disclosure.behavior.ts`, `features/services/` wiring, static scripts.

## Execution order

US11 phase A (model + tests) is independent of US10 and may run in parallel. US11 phase B (UI) follows US10.

## Constitution check

Layout governed by schema + tokens (above); behavior model merged before Act; no per-story specs.
