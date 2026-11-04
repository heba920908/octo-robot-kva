# 🤖 Project Agent Manifest & Architecture Rules

Welcome, Agent. This repository is completely AI-driven and harness-agnostic. You are fully empowered to plan, execute, code, and test independently within the boundaries defined here.

## 📁 Agent Directory Layout
* `.agents/rules/` — Permanent system instructions, architecture boundaries, and frameworks.
* `.agents/workspace/` — Git-ignored sandbox for execution scripts, state trees, and live telemetry testing.

## 📜 Core AI Execution Rules
Before modifying any code, you must read and align with the rulesets:
1. **Coding Standards**: See [.agents/rules/coding-standards.md](.agents/rules/coding-standards.md)
2. **BMAD Framework Execution**: See [.agents/rules/bmad-protocols.md](.agents/rules/bmad-protocols.md)
3. **Spec-Kit Verification**: See [.agents/rules/spec-kit-rules.md](.agents/rules/spec-kit-rules.md)

## 🛠️ Sandbox Workspace
Use `.agents/workspace/` to run temporary test benches, stage `bmad` execution logs, or stash archived `spec-kit` snapshots. Do not pollute the main application directory `/src`.

## ✅ Local Verification Before GitHub Changes
Run and verify changes locally before committing, pushing, opening pull requests, or changing
GitHub settings. Use the local Angular CLI through `npx ng`; do not assume a global `ng`.

```bash
npm ci
npx ng test --watch=false
npm run build:pages
npm run verify:static
```

### Browser testing
After any UI, content, metadata, routing, or build change, test in a real browser:

1. Development: run `npx ng serve` and open `http://localhost:4200/`.
2. GitHub Pages output: run `npm run build:pages`, then `npm run preview:pages`, and open
   `http://localhost:4300/octo-robot-kva/`.
3. Check the page, title, `lang="es-MX"`, single `h1`, keyboard flow for changed controls,
   failed network requests, console errors, CSP violations, and the hydration log
   (`Angular hydrated ... component(s)` in development; no hydration warnings or `NG05xx` errors).
4. In production preview, confirm `app-root[ng-server-context="ssg"]` and `#ng-state` exist.

**GitHub Copilot:** use the integrated browser tools (`open_browser_page`, `read_page`,
`screenshot_page`, and `run_playwright_code` for console and network checks).

**Other harnesses or humans:** use Playwright against the same URLs, for example
`npx playwright open http://localhost:4300/octo-robot-kva/`, or a Playwright script that records
`console` and `requestfailed` events. Do not add Playwright as a dependency without a story.

Stop dev and preview servers when finished.

## 🧰 Agent Tooling (BMAD + spec-kit)

Both frameworks are installed **project-locally** and their generated files are
**git-ignored**. They are re-downloaded at the latest version on demand, so the
repository never carries vendored copies of framework code.

### Methodology selection
* **BMAD Method is the primary development methodology for this repository.**
  If other methodology skills are available in your harness (for example
  *superpowers* at user or global scope), **do not use them here**. Use the
  `bmad-*` skills and agents instead.
* **spec-kit** is the specification/verification layer. Use it as described in
  [.agents/rules/spec-kit-rules.md](.agents/rules/spec-kit-rules.md), not as a
  competing delivery workflow.

### Where things are installed

| Tool | CLI location | Generated (git-ignored) | Committed (project-owned) |
|------|--------------|-------------------------|---------------------------|
| BMAD Method (`bmad-method`, npm devDependency) | `node_modules/.bin/bmad` | `_bmad/*`, `.agents/skills/bmad-*/`, `.github/agents/bmad-*.agent.md` | `_bmad/custom/config.toml` (team overrides), `_bmad-output/` (PRDs, architecture, stories), `docs/` |
| spec-kit (`specify-cli`, Python) | `.venv/bin/specify` (uv-managed virtualenv) | `.venv/`, `.specify/*`, `.github/skills/speckit-*/` | `.specify/memory/constitution.md`, `specs/` |
| Agent sandbox | — | `.agents/workspace/` | — |

Personal BMAD overrides go in `_bmad/custom/config.user.toml`, which is git-ignored.
Do not edit installer-managed files such as `_bmad/config.toml`, `.specify/templates/*`,
or generated skills. They are overwritten on every refresh.

### Install / refresh commands

Prerequisites: Node.js ≥ 20 with npm, and [uv](https://docs.astral.sh/uv/).

```bash
npm install                # Angular deps + bmad-method CLI into node_modules/
npm run agents:install     # (re)generate BMAD + spec-kit files (idempotent)
npm run agents:update      # bump bmad-method to @latest, upgrade spec-kit, regenerate
```

Individual steps: `npm run agents:bmad`, `npm run agents:speckit`.
Re-running is safe: BMAD updates in place, and spec-kit keeps
`.specify/memory/constitution.md` and `specs/`.

### Skill entry points
* BMAD: `bmad-help` (start here), `bmad-product-brief`, `bmad-prd`, `bmad-ux`,
  `bmad-architecture`, `bmad-create-epics-and-stories`, `bmad-sprint-planning`,
  `bmad-build`, `bmad-code-review`, and agents `bmad-agent-{analyst,pm,ux-designer,architect,dev}`.
* spec-kit: `speckit-constitution`, `speckit-specify`, `speckit-clarify`,
  `speckit-plan`, `speckit-checklist`, `speckit-analyze`, `speckit-tasks`.
