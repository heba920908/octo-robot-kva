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

### Image derivatives

```bash
npm run images:build
```

This explicit development command uses pinned Sharp 0.35.5 and
[scripts/images.manifest.json](scripts/images.manifest.json) to generate all 25
brochure photos (AVIF, WebP, JPEG) and transparent white-logo PNG sizes. Builds and
CI only copy reviewed assets; they never run generation. Sharp is not shipped in
the application. Originals under assets/media/brochure are never modified.

Targets 320/640/960/1280 are capped to source width and deduplicated. Every Hero
candidate must be <=250,000 bytes; every project candidate <=120,000 bytes,
including the largest available fallback. No upscale or automatic budget bypass.
The 740x556 Hero photo and 459x241 logo cannot provide full large 2x resolution.
The Hero logo's nominal 400px-high candidate caps to 241px.

Review generated files under public/media/backgrounds, projects and logo plus
[public/media/PROVENANCE.md](public/media/PROVENANCE.md), including exact encoder
settings, hashes and resolution limits. Repeat the command and compare inventories
and hashes before approving assets. Review image quality at actual display sizes;
budget compliance alone is not visual approval. Supplied brochure provenance does
not assert additional publication rights; confirm these with the content owner.

Keep [content/images.md](content/images.md) and
[src/app/core/content/images.content.ts](src/app/core/content/images.content.ts)
synchronized when changing alt text or metadata. Consume photos through
ContentFacade and the shared ResponsiveImage component; no raw-content imports,
remote image service, runtime schema validation or Hero preload is added here.
Focused tests include scripts/build-images.spec.ts in the normal Angular test run.

### Code scaffolding

```bash
npx ng generate component features/<feature>/<name>
```

Follow [AGENTS.md](AGENTS.md) and `.agents/rules/` before generating code.
