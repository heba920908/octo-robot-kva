# Tasks: Epic 2, US10-US11 / BMAD Stories 2.1-2.2

Each story is authorized by its own approved BMAD story spec. Test first.

## US10 - Services Section

- [x] T201 [US10] Test first then add content/services/*.md, service.schema.json, services.content.ts/.spec.ts (AC1).
- [x] T202 [US10] Test first then expose `services` and register `servicios` in content-facade.ts/.spec.ts (AC2, AC6).
- [x] T203 [US10] Test first then add features/services and wire app.ts/app.html (AC2-AC6).
- [x] T204 [US10] Update app/header/hero specs and extend verify-static-build.mjs, content-checks.mjs, template-content.spec.ts (AC2, AC5).
- [x] T205 [US10] Full gates, browser checks at 360/767/768/1024/1440 and no-JS, review; advance only Story 2.1.

| Acceptance | Tasks      |
| ---------- | ---------- |
| AC1        | T201, T205 |
| AC2        | T202-T205  |
| AC3-AC6    | T203-T205  |

## US11 - Collapsible Sub-service Lists

- [x] T206 [US11] Test first then add behaviors/service-card-disclosure.behavior.ts/.spec.ts (AC1).
- [x] T207 [US11] Test first then wire the per-card adapter and toggle in features/services (AC2-AC4).
- [x] T208 [US11] Extend static checks; full gates, browser checks, review; advance only Story 2.2.

| Acceptance | Tasks      |
| ---------- | ---------- |
| AC1        | T206, T208 |
| AC2-AC4    | T207, T208 |
