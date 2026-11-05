# US11 Service Card Disclosure Contract

The approved Story 2.2 spec controls this contract (FR-022; BMAD UX-DR13, AD-7; `2.2-AC-01`..`2.2-AC-04`).

## Behavior model (`src/app/behaviors/service-card-disclosure.behavior.ts`)

Id `service-card-disclosure`, actor Visitor, acceptance `['2.2-AC-01','2.2-AC-02','2.2-AC-03']`.
State `{ expanded: boolean }`; events `toggle`, `expand`, `collapse`, each carrying `toggleId`.

| State     | Event                | Result                                    |
| --------- | -------------------- | ----------------------------------------- |
| collapsed | `toggle`, `expand`   | `{ expanded: true }`, `[focus toggleId]`  |
| expanded  | `toggle`, `collapse` | `{ expanded: false }`, `[focus toggleId]` |

Any other pair, blank `toggleId`, unknown event or malformed state returns `null`.

## Adapter and UI

Per-card state in `features/services`. After hydration (`enhanced`) and while `matchMedia('(max-width: 767.98px)')`
matches, a card with more than 4 Sub-services renders only the first 4 plus a `button-text` toggle with chevron
(`aria-expanded`, `aria-controls`). Otherwise the full list and no toggle. Prerendered HTML is always full.
