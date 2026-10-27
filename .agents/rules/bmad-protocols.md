# BMAD Protocols (Behavior Model-Driven Agile Development)

BMAD is the **primary methodology** for this repository. It takes precedence over any
other methodology skill pack that may be installed (for example *superpowers*). The
BMAD Method tooling (`bmad-*` skills/agents) is installed locally; see AGENTS.md → "Agent Tooling".

## Behavioural loop

Every unit of work (epic, story, task) runs this loop. Do not skip a stage.

```
Plan ➡️ Act ➡️ Verify ➡️ Refine
 ▲                         │
 └─────────────────────────┘
```

| Stage | What happens | BMAD skills |
|-------|--------------|-------------|
| **Plan** | Define or update the behaviour model and acceptance criteria. | `bmad-product-brief`, `bmad-prd`, `bmad-ux`, `bmad-architecture`, `bmad-create-epics-and-stories`, `bmad-sprint-planning` |
| **Act** | Implement against the behaviour model, test first. | `bmad-build`, `bmad-agent-dev` |
| **Verify** | Run unit tests and behaviour flows, check against specs (see `spec-kit-rules.md`). | `bmad-code-review`, `bmad-qa-generate-e2e-tests`, `bmad-review` |
| **Refine** | Fix gaps, update models and specs, and record learnings. | `bmad-correct-course`, `bmad-retrospective` |

### Open decisions resolved during Plan
* **UI library / styling approach**: decided in `bmad-ux` + `bmad-architecture` based on
  the PRD requirements, and recorded as an ADR (see `coding-standards.md` → Styling).

## Behaviour models are mandatory

Every portfolio user action must have an explicit behaviour model, **mapped in code or
config before implementation**. Examples: viewing a case study, filtering portfolio
categories, sorting agency capabilities, opening the contact form slider, submitting
the contact form.

* Each model module exports finite discriminated `State` and `Event` types and conforms to
  the shared `BehaviorModel<State, Event>` type in
  `src/app/behaviors/behavior-model.ts`. It declares `id`, `actor`, `trigger`, descriptive
  `preconditions`, stable acceptance IDs, and a pure deterministic `transition(state,event)`
  returning `{ state, effects }` or `null` for an unsupported pair. The function is the
  single source of transition truth; feature handlers apply only its result.
* Runtime guards are represented in `State`/`Event` and enforced by the transition function.
  Effects use the closed discriminated union owned by `core/effects` (`focus`, `layer`,
  `navigate`, `copy`, `announce`, `scroll`), with one typed payload and documented meaning
  per effect kind. The feature adapter submits non-null effects once, in returned order, and
  none for `null`. Global/modal event ownership follows AD-5.
* Colocated table-driven tests call the production function; interaction tests verify the
  feature adapter applies each non-null result once and applies no effects for `null`.
* A story cannot move to **Act** until its behaviour model and colocated transition tests are
  merged.

## Behaviour-flow logging

* Write runtime behaviour test flows and execution logs to
  `.agents/workspace/bmad/<YYYY-MM-DD>/<story-id>/` (git-ignored).
* Use one JSONL file per run: `{ ts, behaviorId, from, event, to, result, notes }`.
* Summarize the outcome (pass/fail and gaps) in the story's implementation artifact
  under `_bmad-output/implementation-artifacts/`, which is committed.

## Artifacts

* Planning artifacts go in `_bmad-output/planning-artifacts/` (committed).
* Implementation artifacts go in `_bmad-output/implementation-artifacts/` (committed).
* Do not edit installer-managed files in `_bmad/`. Put team overrides in
  `_bmad/custom/config.toml`.
