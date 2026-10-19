🤖 System Prompt: AI-Driven Architecture Setup for Agency Portfolio


🎯 Objective

Initialize a bare Angular project designed for an "Agency Portfolio" Landing Page. This project must be built from the ground up to be AI-driven and harness-agnostic. The core requirement is to establish an architecture governed by an autonomous execution layout using an AGENTS.md file, the .agents/ runtime directory, spec-kit, and the bmad (Behavior Model-Driven Agile Development) framework.

1. Initial Project Scaffolding

Execute the following commands in the current, completely bare root directory:
bash
# 1. Initialize Angular with a clean footprint (inline styles/templates optional, SCSS preferred)
ng new agency-portfolio --directory . --style scss --routing false --standalone true

# 2. Establish the AI Execution Directory
mkdir -p .agents/rules
mkdir -p .agents/workspace

# 3. Create placeholder architecture manifests
touch AGENTS.md
touch .agents/rules/coding-standards.md
touch .agents/rules/bmad-protocols.md
touch .agents/rules/spec-kit-rules.md
Use code with caution.
Note: Ensure .agents/workspace/ is appended to the project's .gitignore file immediately so your temporary scratchpads, local evaluation binaries, and test outputs are never tracked.

2. File Specifications: AGENTS.md

Write the following contents exactly into the root AGENTS.md file to act as the primary operational directive for any AI reading this repository:
markdown
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
Use code with caution.

3. Framework Integrations (bmad & spec-kit)

Populate the .agents/rules/ markdown documents with these specific engineering workflows:

A. bmad-protocols.md (Behavior Model-Driven Agile Development)

• Define the AI workflow using behavioral loop sequences: Plan ➡️ Act ➡️ Verify ➡️ Refine.
• All portfolio user actions (e.g., viewing a case study, sorting agency capabilities, or triggering a contact form slider) must have an explicit behavior model mapped in code or config before implementation.
• Log runtime behavioral test flows directly inside .agents/workspace/.

B. spec-kit-rules.md (Specification Verification & Archival)

• Specify that every core component layout must strictly align with a schema validation document or design token definition.
• Archived layout test-cases, data structures, and raw baseline JSON schemas for the portfolio contents must be preserved and referenced within .agents/workspace/.

4. Technical Blueprint for "Agency Portfolio Landing Page"

Once the structural agents' ecosystem is built, generate a modern single-page Angular application matching these visual and functional specs:
• Hero Section: Dynamic, bold layout with a clear conversion call-to-action (CTA).
• Services Module: Grid or carousel showing agency capabilities (e.g., UI/UX, Engineering, Strategy).
• Interactive Work/Portfolio Grid: Category-filterable portfolio showcase pulling structured items from a local service layout.
• Contact/Discovery Panel: Single-component capture form engineered with native Angular template-driven or reactive form validations.

🚀 Execution Plan

1. Step 1: Initialize the bare-metal Angular installation commands.
2. Step 2: Generate the complete .agents/ structure and append .agents/workspace/ to .gitignore.
3. Step 3: Commit the fully populated AGENTS.md and rule files to disk.
4. Step 4: Halt and report readiness to execute the first portfolio components using bmad.
Acknowledge this prompt by establishing Step 1 and Step 2 immediately.
Would you like to pre-configure this prompt to assume a specific UI library (such as Tailwind CSS or Angular Material) during the initial step, or should the AI dynamically select one during its bmad planning phase?
