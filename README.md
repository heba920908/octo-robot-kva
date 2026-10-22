# octo-robot-kva
kVA landing page — Agency Portfolio (Angular), developed AI-first with BMAD + spec-kit.

## AI agent setup

Agents and humans start at [AGENTS.md](AGENTS.md). BMAD and spec-kit are installed
locally and their generated files are git-ignored. To regenerate or update them:

```bash
npm install              # Angular deps + bmad-method CLI
npm run agents:install   # generate BMAD (_bmad/, .agents/skills) + spec-kit (.venv/, .specify/)
npm run agents:update    # pull latest BMAD + spec-kit and regenerate
```

## Angular workspace (agency-portfolio)

Angular CLI 22.2.3 is installed locally. Use `npx ng` (or the npm scripts below); a global
`ng` installation is not required.

Prerequisites: Node.js 22 and npm.

```bash
npm ci
```

### Development server

```bash
npx ng serve        # or: npm start
```

Open `http://localhost:4200/`. The dev server prerenders and hydrates the page and reloads on
changes. Angular CLI analytics are disabled in `angular.json`.

### Unit tests

```bash
npx ng test --watch=false   # or: npm test -- --watch=false
```

### GitHub Pages build and local preview

```bash
npm run build:pages     # npx ng build --configuration production,pages
npm run verify:static   # checks HTML contract, CSP, hydration state, and no server bundle
npm run preview:pages   # serves http://localhost:4300/octo-robot-kva/
```

The preview matches the GitHub Pages subpath. Stop it with `Ctrl+C`.

### Code scaffolding

```bash
npx ng generate component features/<feature>/<name>
```

Follow [AGENTS.md](AGENTS.md) and `.agents/rules/` before generating code.
