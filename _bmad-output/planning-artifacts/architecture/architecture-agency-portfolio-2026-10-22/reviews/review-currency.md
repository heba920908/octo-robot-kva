# Review — Currency & Reality Check

- **Artifact:** `../ARCHITECTURE-SPINE.md` (draft, 2026-10-22)
- **Lens:** Was each committed decision checked against current reality (registry versions, docs, installed packages, starter defaults) instead of taken from training data?
- **Reviewed:** 2026-10-22
- **Method:** I ran `npm view` for versions, peer dependencies, and publish times. I read installed `node_modules/*/package.json`. I unpacked `@angular/material@22.2.4` and `@angular/ssr@22.2.4` into `/tmp` to inspect their schematics, and read the installed `@schematics/angular/ssr`. I ran a Node smoke test of the Ajv draft 2020-12 import. I also fetched angular.dev/guide/ssr, material.angular.dev/guide/theming, and ajv.js.org/json-schema.html. No package files were changed.

## Verdict

**PASS WITH FIXES.** All named technologies exist, are current, and fit together. The version table matches the registry and installed packages, apart from one patch release published today. The spine has three gaps:

1. It leaves out a required peer, `@angular/platform-server`.
2. It does not record the right Ajv draft 2020-12 entry point, or that Ajv must be a direct dev dependency.
3. It does not warn that the two starters it depends on (`ng add @angular/ssr` and `ng add @angular/material`) write defaults that break AD-8 and AD-10.

## Evidence table

| Claim in spine / author note | Rechecked result | Status |
| --- | --- | --- |
| Angular core 22.2.3 | Installed 22.2.3; npm `latest` 22.2.3 (published 2026-10-14) | Confirmed |
| Angular CLI and build 22.2.3 | Installed 22.2.3; npm `latest` now **22.2.4** for `@angular/cli` and `@angular/build` (build published 2026-10-22T13:40Z) | Stale by one patch, published after the author's check |
| Material / CDK / SSR 22.2.4 | npm `latest` 22.2.4 (Material published 2026-10-21); not installed | Confirmed (registry only) |
| Material 22.2.4 with core 22.2.3 | Material/CDK peers: `@angular/core ^22.0.0 \|\| ^23.0.0`, `@angular/cdk 22.2.4` (exact) | Compatible; CDK must match Material exactly |
| SSR 22.2.4 requirements | Peers: `@angular/core`, `common`, `router`, **`@angular/platform-server` ^22.0.0** | Spine omits `platform-server` |
| `@angular/platform-server` version | `latest` 22.2.3; peers pin `@angular/core`, `common`, `compiler`, `platform-browser` **exactly 22.2.3** | Must move in lockstep with core |
| `@angular/build` ↔ SSR | build 22.2.3 peers `@angular/ssr ^22.2.3`; build 22.2.4 peers `@angular/ssr ^22.2.4` | Compatible with SSR 22.2.4 |
| TypeScript 6.0.3 | Installed 6.0.3. npm `latest` is **7.0.2**, but `@angular/compiler-cli` and `@angular/build` 22.2.3/22.2.4 require `>=6.0 <6.1` | Pin is correct; the spine does not say why it is not `latest` |
| Vitest 5.0.5 | Installed 5.0.5 = npm `latest`; `@angular/build` peers `vitest ^4.0.8 \|\| ^5.0.0`; `angular.json` test target is `@angular/build:unit-test`; jsdom 30.1.3 installed | Confirmed; jsdom is not in the stack table |
| Ajv 8.20.0 | 8.20.0 = npm `latest` (2026-04-24). Installed **only transitively** via `@angular/cli` → `@angular-devkit/core` | Version correct; not a direct dependency |
| Ajv draft 2020-12 | Docs: draft 2020-12 needs `ajv/dist/2020` (`Ajv2020`); the default export is draft-07. Smoke test: `Ajv2020` validates; default `Ajv` throws `no schema with key or ref "https://json-schema.org/draft/2020-12/schema"` | The spine does not specify the import, so the default import will fail |
| `outputMode: "static"` gives prerendered static output | angular.dev/guide/ssr, "Generate a fully static application": static prerendered HTML per route, no server file, no Node server | Confirmed |
| Material: private DOM/CSS overrides unsupported; overrides APIs supported | material.angular.dev/guide/theming "Direct Style Overrides": DOM and classes are private; use `mat.theme`, `mat.theme-overrides`, `mat.<component>-overrides` | Confirmed |
| AD-8 `DOCUMENT` / after-render guidance | angular.dev confirms the `DOCUMENT` token, `afterNextRender`, and no `isPlatformBrowser` branching in templates | Confirmed |

## Findings

### F1 — Missing required peer: `@angular/platform-server` (High)

`@angular/ssr@22.2.4` has `@angular/platform-server` as a peer dependency. It is not in the Stack table, and it is pinned **exactly** to the core version (22.2.3). The Material patch was mixed into the table as 22.2.4, but `platform-server` cannot follow it. Its latest is 22.2.3, and it must equal `@angular/core`.

**Fix:** Add a row `Angular platform-server | 22.2.3 (must equal @angular/core)`. Add a note that the framework packages (`core`, `common`, `compiler`, `platform-browser`, `platform-server`, `router`, `forms`) move together, and that `@angular/cdk` must exactly equal `@angular/material`.

### F2 — Ajv: wrong default entry point for draft 2020-12, and only a transitive dependency (High)

The conventions table mandates JSON Schema draft 2020-12. Ajv's default export is draft-07 and rejects a 2020-12 `$schema` (reproduced locally). Ajv 8.20.0 is in `node_modules` only because `@angular-devkit/core` brings it in. A CLI upgrade could change or remove it without warning.

**Fix:** In AD-3 or the conventions table, state: "Validate with `Ajv2020` from `ajv/dist/2020`, in unit tests only." Also make `ajv` an explicit `devDependency` when the first schema story lands, and keep it out of the browser bundle. Ajv compiles validators with `new Function`, which a strict CSP (AD-10/NFR-4) would block.

### F3 — Starter defaults contradict AD-8 and AD-10 (High)

The spine depends on two starters but does not record their live defaults:

- `ng add @angular/ssr` runs `@schematics/angular/ssr`. Installed 22.2.3 writes **`outputMode: 'server'`**, a `server.ts` entry, `security.allowedHosts`, and adds **`express` + `@types/express`** dependencies. AD-8 requires `"static"` and no server runtime.
- `ng add @angular/material@22.2.4` runs `addFontsToIndex`, which injects `<link>` tags to **`fonts.googleapis.com`** for Roboto and **Material Symbols Outlined** (an icon font). AD-10 bans Google Fonts and icon fonts. Its theme prompt also defaults to the prebuilt `azure-blue` palette, not project tokens (AD-4).

**Fix:** Add a "Starter post-conditions" note to AD-8 and AD-10, or to the Structural Seed:

- After `ng add @angular/ssr`, set `outputMode: "static"`. Drop `server.ts` and the `express` dependencies unless they are needed. Keep only `main.server.ts`, `app.config.server.ts`, and the server routes with `RenderMode.Prerender`.
- After `ng add @angular/material`, remove the Google Fonts and Material Symbols links. Self-host the fonts. Register SVG icons through `MatIconRegistry` from same-origin assets. Replace the prebuilt palette with a `mat.theme` and overrides fed by project tokens.

### F4 — CLI/build version stale by one patch (Low)

`@angular/cli` and `@angular/build` 22.2.4 were published on 2026-10-22, the day of the review and after the author's check. Core is still 22.2.3. Nothing breaks, but the table is no longer "latest".

**Fix:** Change the row to `22.2.4`, or annotate the versions as "pinned as of 2026-10-22; patch updates allowed within 22.2.x". Note that `@angular/build` 22.2.4 needs `@angular/ssr ^22.2.4`, which the planned SSR version already satisfies.

### F5 — Unstated constraints and missing test-environment entry (Low)

- TypeScript 6.0.3 is correct, but npm `latest` is 7.0.2, which Angular 22 does not support (`>=6.0 <6.1`). Without a note, a future "update to latest" will break the build.
- The test runner relies on jsdom 30.1.3 through the `@angular/build:unit-test` builder, and jsdom is not listed in the stack.

**Fix:** Add a TypeScript note: "capped by Angular 22 peer range `>=6.0 <6.1`; do not adopt TS 7." Add a row `jsdom | 30.1.3 (Vitest DOM environment via @angular/build:unit-test)`.

## Unconfirmed / not checkable here

- I did not install Material, CDK, or SSR 22.2.4 or run a build with them. Compatibility rests on the declared peer ranges, not on a build run.
- I did not run a prerender build with `outputMode: "static"` in this repo. The docs confirm the behaviour.
- Hosting, CSP delivery, and GitHub workflow choices are deferred by design and were not assessed.
