# Feature Specification: Epic 2 — Services Catalogue

**Feature Branch**: `003-epic-2-services-catalogue`

**Created**: 2026-11-04

**Status**: US10-US11 clarified and planned; implementation pending story approval

**Input**: BMAD Epic 2 in [epics.md](../../_bmad-output/planning-artifacts/epics.md) (Stories 2.1–2.2).
Constitution v2.0.0 requires one spec-kit feature spec per epic.

## Epic Summary

A Visitor sees kVA's four Services from the brochure as cards, each listing every Sub-service
(hook items first), collapsible on mobile, each with a call to action toward contact. Services
are Content-only: a fifth Service is a new Content doc and needs no component change (NFR5).

### Story readiness

| Spec story | BMAD story | Title                                             | Readiness          |
| ---------- | ---------- | ------------------------------------------------- | ------------------ |
| US10       | 2.1        | Services section with four brochure Service cards | Clarified, planned |
| US11       | 2.2        | Collapsible Sub-service lists on mobile           | Clarified, planned |

The BMAD story Given/When/Then criteria in `epics.md` are authoritative. Behavior-bearing
scenarios cite stable IDs `2.1-AC-nn` / `2.2-AC-nn`; model `acceptance` metadata uses the same IDs.
Story 2.2 introduces the `service-card-disclosure` behavior model; its pure transition function
and table-driven tests merge before Act.

Governing definitions (constitution: layout must match a schema or token set): Services content
contract `src/app/core/schemas/service.schema.json` (draft 2020-12); tokens
`--kva-component-service-card-*`, `--kva-component-button-primary-on-light-*`,
`--kva-component-button-text-*` in `src/styles/_tokens.scss`. Archive path:
`.agents/workspace/spec-kit/baselines/service.schema@2026-11-04.json`.

## User Scenarios & Testing

### User Story 10 — Services section (Priority: P1) — BMAD 2.1

A plant engineer or facilities manager sees every Service kVA offers with its full Sub-service list.

**Independent Test**: Content validation, facade, component, static-build checks and the browser
matrix pass; `#servicios` is prerendered with every Sub-service.

**Acceptance Scenarios**:

1. **Given** four Service docs, **When** validated against `service.schema.json`, **Then** each has
   id = slug, name, description, order, Sub-services, optional image (with alt) and optional CTA label;
   invalid content fails naming item and field; ids are unique (2.1-AC-01; FR5, AD-12).
2. **Given** the prerendered page, **When** `#servicios` renders, **Then** one card per Service in
   order with name, description, en-dash Sub-service list and CTA; all Sub-services in served HTML;
   `servicios` is a visible section so the header link appears (2.1-AC-02; FR5, UX-DR13).
3. **Given** a Service with an image, **Then** a 3:1 darkened band shows; without, no empty slot (2.1-AC-03).
4. **Given** viewports, **Then** the grid is 1 / 2 / 2×2 / 4 columns at <768 / ≥768 / ≥1024 / ≥1440 (2.1-AC-04).
5. **Given** the CTA before Epic 3, **Then** it is `<a href="#contacto">` and works without JS (2.1-AC-05).
6. **Given** a fifth valid Service, **Then** five cards render with no component change (2.1-AC-06; NFR5).

### User Story 11 — Collapsible Sub-service lists (Priority: P2) — BMAD 2.2

A Visitor on a phone sees long Sub-service lists shortened with a control to expand them.

**Independent Test**: Model table tests, adapter tests, static checks and the browser matrix pass.

**Acceptance Scenarios**:

1. **Given** the `service-card-disclosure` model, **Then** expand/collapse transitions and their focus
   effects are covered by table-driven tests (2.2-AC-01; AD-7).
2. **Given** <768 px, JS and >4 Sub-services, **Then** first 4 plus "Ver los {n} servicios" toggle,
   `aria-expanded="false"` (2.2-AC-02; UX-DR13).
3. **Given** the collapsed list, **When** the toggle is activated, **Then** full list, "Ver menos",
   `aria-expanded="true"`, focus stays on the toggle (2.2-AC-03).
4. **Given** ≥768 px or no JS, **Then** the full list shows and no toggle is rendered (2.2-AC-04).

## Edge Cases

- Launch Service descriptions are agent-written from brochure Sub-services and flagged `[ASSUMPTION]`.
- Service 4 (Servicios de Datos) has three outcome-led items, so it never collapses.
- Resizing across 768 px restores state without losing focus.

## Requirements

- **FR-021**: Content-driven Service cards (PRD FR5; UX-DR13, UX-DR28; AD-12).
- **FR-022**: Collapsible Sub-service lists on mobile (UX-DR13; AD-7).
- Out of scope: composer pre-fill (Epic 3, FR6).

## Key Entities

- **Service**: `id` (= slug), `name`, `description`, `order`, `subServices[]`, optional `image {id, alt}`, optional `cta`.

## Success Criteria

- All Sub-services are in prerendered HTML; no new runtime origin; CSP unchanged; bundle and style budgets respected.

## Assumptions

- Service 4 wording and all descriptions are `[ASSUMPTION]` pending editorial review.
