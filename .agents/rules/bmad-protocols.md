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

* Location: `src/app/behaviors/<feature>.behavior.ts`. These are typed, side-effect-free
  descriptors that are imported by the feature and its tests.
* Each model declares: `id`, `actor`, `trigger`, `preconditions`, `states`
  (finite set), `transitions` (`from` → `event` → `to`), `effects`, and
  `acceptance` (Given/When/Then IDs that match the BMAD story ACs).
* Every transition must be covered by at least one unit test.
* A story cannot move to **Act** until its behaviour model is merged.

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
