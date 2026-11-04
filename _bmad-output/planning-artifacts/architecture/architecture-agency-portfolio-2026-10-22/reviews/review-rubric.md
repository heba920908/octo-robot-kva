---
title: "Rubric review: ARCHITECTURE-SPINE.md (kVA Instalaciones)"
reviewed: ../ARCHITECTURE-SPINE.md
date: 2026-10-22
inputs:
  - ../../../../../README.md
  - ../../../prds/prd-agency-portfolio-2026-10-19/prd.md
  - ../../../prds/prd-agency-portfolio-2026-10-19/addendum.md
  - ../../../ux-designs/ux-agency-portfolio-2026-10-21/EXPERIENCE.md
  - ../../../ux-designs/ux-agency-portfolio-2026-10-21/DESIGN.md
  - ../../../../../.specify/memory/constitution.md
  - ../.memlog.md
  - brownfield code: package.json, angular.json, src/index.html, src/app/app.ts, src/app/app.config.ts, public/
verdict: REVISE
---

# Rubric review — ARCHITECTURE-SPINE.md

## Verdict

**REVISE (not ready to bind stories).** The spine has the right shape: a clear paradigm, eleven
mostly well-scoped rules, a credible stack table, and honest deferrals for the host. But it has
one internal contradiction that makes two rules unenforceable together (AD-1 and AD-5), it leaves
three cross-feature divergence points unowned (overlay history outside dialogs, progressive
enhancement/no-JS, and content-derived visibility and permission), and it skips the CSP
compatibility check the PRD assigned to architecture. It also doesn't ratify the brownfield
files it inherits. Each item has a contained fix. None of them reopens an adopted decision.

## Rubric scorecard

| # | Criterion | Result | Summary |
|---|---|---|---|
| 1 | Fixes real divergence points; misses none | **Partial** | Content ownership, UI library, dialogs, contact links, and rendering are covered. Missed: overlay history across menu and dialogs, no-JS enhancement, section visibility and permission filtering, schema-vs-type source, live-region mechanism, image pipeline, and Material-vs-EXPERIENCE semantics precedence. |
| 2 | Every AD Rule is enforceable and prevents its stated divergence | **Partial** | AD-1 and AD-5 conflict. AD-3 doesn't name its literal-text check. AD-4 has no precedence rule for when Material semantics differ from EXPERIENCE. AD-7 doesn't fix a shared model type. AD-8 conflicts with EXPERIENCE's post-hydration enhancements. |
| 3 | Nothing deferred could let two units diverge | **Partial** | Deferring the token-sync implementation without an interim rule lets features hand-edit or duplicate tokens. Deferring "CSP delivery" also quietly defers CSP *compatibility*, which shapes code now. Host-independent CI gates are deferred together with host-dependent ones. |
| 4 | Ratifies the brownfield Angular codebase | **Partial** | The stack versions match `package.json`/memlog. The current files aren't ratified or listed for change: `index.html` (`lang="en"`, title `AgencyPortfolio`, default `favicon.ico`), `App` (no OnPush, `title` signal), `app.config.ts` (no hydration provider), no server/prerender config, and `assets/media/` sitting outside the `public/` asset input. |
| 5 | Covers spec capabilities | **Mostly** | The capability map covers FR-1 to FR-20. Gaps: no footer feature in the seed (FR-3, FR-20, FR-14 entry), robots/sitemap (FR-16), skip link, scroll-spy and scroll-reveal ownership, and the share image and favicon pipeline. |
| 6 | Every dimension decided, deferred, or open question | **Partial** | Hosting, trigger, credentials, CSP delivery, and DNS are deferred with reasons, but there's no revisit trigger or owner. These have no entry at all: operations (monitoring, uptime, rollback, cache policy), other security headers (HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`), required CI checks, Node version pinning, locale registration, and the test strategy beyond unit (a11y and Lighthouse). The spine has no Open Questions section, although the memlog holds one. |

## Findings

Severity: **High** = two units will diverge or a rule can't be followed as written. **Medium** = a
likely divergence or a dropped requirement with a clear owner gap. **Low** = clarity or hygiene.

### F1 — High — AD-1 and AD-5 contradict each other, and overlay history has two owners

- **Evidence.** AD-1: "Core never imports features or shared UI." AD-5: "`core/dialogs` alone
  opens and closes the Contact composer, Project detail view, and Privacy notice". Those
  components live in `features/contact`, `features/projects`, and `features/privacy`. So the
  dialog service either imports feature components, which breaks AD-1, or can't open them,
  which breaks AD-5.
- AD-5 also "owns overlay history entries", but EXPERIENCE › Interaction Primitives › Overlay
  history covers **modal overlays and the Mobile menu**. It also requires a menu link choice to
  "consume the entry, then apply the anchor `replaceState`" from `section-navigation`. The
  Mobile menu lives in `features/header` and isn't a dialog, so header and core/dialogs would
  each call `pushState`/`history.back()`. That's the exact divergence AD-5 claims to prevent.
- **Fix.**
  1. Add an overlay-registry contract to AD-5. `core/dialogs` defines overlay keys and typed
     data/result contracts (`'contact-composer' | 'project-detail' | 'privacy-notice'`) and an
     `InjectionToken` registry. The **app shell** provides the key→component (or lazy loader)
     map. Core never references feature classes, so AD-1 holds.
  2. Split history into a `core/history` (or `core/overlays`) service. It's the only code that
     may call `history.pushState`, `replaceState`, or `back()`, or listen to `popstate`. Both
     the dialog service and the Mobile menu register with it, and `section-navigation` uses it
     for fragment `replaceState`. Add to AD-5: "No other code touches `window.history`."
  3. State the inert rule. While an overlay is open, app-shell siblings get `inert`. This
     matches EXPERIENCE; MatDialog's default is `aria-hidden` on siblings, which is weaker.

### F2 — High — No-JS fallbacks and progressive enhancement are undecided, and AD-8 contradicts them

- **Evidence.** EXPERIENCE › State Patterns requires these no-JS states:
  - the composer button becomes a plain `mailto:` link with the Contacto subject;
  - the Privacy notice footer link jumps to an in-flow `<section id="aviso">`;
  - chips, copy buttons, and the menu button are hidden;
  - nav shows as a wrapped row;
  - Project cards aren't interactive;
  - "Contact CTAs are `<a href="#contacto">` before hydration and gain `aria-haspopup="dialog"`
    after".

  FR-20 also requires Direct contact links that work without JavaScript. AD-8, by contrast,
  says "Rendered markup must match on server and browser … never branch rendered markup by
  platform". As written, every one of those enhancements is either forbidden or left to each
  feature's discretion. AD-5 is also silent on the fact that the Privacy notice must exist as
  in-flow prerendered content, not only inside a dialog that isn't in the served HTML.
- **Fix.** Add an AD, "Prerendered HTML is the no-JS baseline":
  1. Every feature prerenders its no-JS form.
  2. Enhancement uses only one core `enhanced` signal, set in `afterNextRender` after hydration,
     plus CSS `@media (scripting: none)` and `(scripting: enabled)` for show/hide. Hydration
     happens before the signal flips, so this doesn't violate AD-8.
  3. The Privacy notice renders in flow as `#aviso` from the same content object the dialog
     uses, so there's one source.
  4. Decide `provideClientHydration()` with or without `withEventReplay()`. Pre-hydration
     clicks on `<a href="#contacto">` must not both navigate and then replay into a composer
     open.
  5. Scroll-reveal and other enhancements never hide prerendered content.

  Bind it to FR-16, FR-20, NFR-2, and NFR-3.

### F3 — High — The CSP compatibility check the PRD assigned to architecture is missing

- **Evidence.** PRD NFR-4: "Architecture checks that Angular SSG critical-CSS inlining works
  under this policy" (`default-src 'self'`, no inline script allowance). The spine defers only
  the *delivery mechanism* and never records the compatibility decision. This shapes code now,
  in several places:
  - Critical-CSS inlining emits a `media="print" onload=…` handler.
  - Hydration with event replay injects an inline script.
  - Angular Material and CDK add runtime `<style>` elements.
  - JSON-LD is inline.

  Two features, or the theme story and the SSR story, will each choose differently between
  `'unsafe-inline'`, hashes, nonces, and disabling inlining.
- **Fix.** Decide it in a new AD, or extend AD-10:
  1. Enable `security.autoCsp` (hash-based; works on static hosts, where nonces don't).
  2. Pick one of two style options: allow `style-src 'self' 'unsafe-inline'`, as an accepted
     and documented deviation needed by Material and CDK, or set
     `optimization.styles.inlineCritical: false` and measure the LCP cost.
  3. JSON-LD as `type="application/ld+json"` needs no hash.
  4. Add a CI check that loads the prerendered output under the meta CSP and fails on
     violations.
  5. List the other headers in Deferred, owned by the host story: HSTS, `X-Content-Type-Options`,
     `Referrer-Policy: no-referrer` or `strict-origin`, `Permissions-Policy`, and
     `frame-ancestors`, which needs a header.

### F4 — Medium-High — Visibility, permission, and cross-reference invariants aren't owned by the content facade

- **Evidence.** Several cross-feature rules depend on content:
  - FR-1/7/10/18/19: a hidden section also drops its **header link**. Header must know what
    Projects, Nosotros, and Trust decided.
  - FR-19: a non-permitted client group renders **nowhere**: not in the Clientes list, a
    Project's client field, or metadata/JSON-LD.
  - FR-10: only confirmed Trust items render.
  - FR-4: the Hero proof point must reference a confirmed Trust item or a `site` fact.
  - FR-17: setting WhatsApp requires the Privacy notice paragraph.

  AD-3 creates "one content facade" but doesn't say that filtering and derivation happen
  there. Header, projects, trust, and the SEO/JSON-LD shell would each reimplement the
  permission and visibility logic. That's a privacy leak risk, given that FR-19 is a permission
  rule.
- AD-3 also requires both TypeScript content types and JSON Schemas, but doesn't say which
  one is the source. The constitution says "Schemas … are the source of truth". Types written
  by hand will drift.
- **Fix.** Extend AD-3:
  1. The facade is the only reader of raw content objects. It exposes only filtered views
     (permitted client groups, confirmed Trust items, publishable Projects) and a derived
     `visibleSections` signal.
  2. Section IDs (`inicio`, `servicios`, …) are constants in `core`.
  3. The header, `section-navigation`, and the head/JSON-LD builder consume only those.
  4. Generate TS types from the schemas (for example `json-schema-to-ts` or a codegen step), or
     derive the schemas from the types. Pick one direction.
  5. Put cross-document rules that JSON Schema can't express in one
     `content-integrity.spec.ts`: client references resolve, hero proof is backed, WhatsApp
     implies a privacy paragraph, no `proyectos2@` / `4029 4029` anywhere, and the tone checks
     in F7.

### F5 — Medium — The brownfield codebase and asset pipeline aren't ratified

- **Evidence.** The spine names versions but not the existing files or their required changes:
  - `src/index.html`: `lang="en"` (FR-3 requires `es-MX`) and title `AgencyPortfolio`.
  - `public/favicon.ico` is the Angular default (FR-3: favicon from the logo).
  - `src/app/app.ts` has no `ChangeDetectionStrategy.OnPush` (constitution V) and a
    `title = signal('agency-portfolio')`.
  - `app.config.ts` has no `provideClientHydration`, and there's no `app.config.server.ts`,
    server entry, or `outputMode: "static"` config yet.
  - `angular.json` serves only `public/`, while all media sits in repo-root
    `assets/media/`. The addendum explicitly asked architecture to decide this.
  - DESIGN.md requires `srcset` with AVIF/WebP plus a JPEG fallback, intrinsic sizes, image
    budgets (Hero ≤ 250 KB, card ≤ 120 KB @2×), a 1200×630 share image, and favicon/touch
    icons. No unit owns generation, so each feature would invent its own.
  - Dependencies `@angular/material`, `cdk`, `ssr`, and `ajv` aren't installed. The PRD §6 and
    memlog gate them on NFR-1/NFR-2 verification, and the spine dropped that gate.
- **Fix.**
  1. Add a "Brownfield baseline" subsection listing each existing file as *kept*, *changed*,
     or *replaced*, with the change (lang, title, OnPush, hydration and server providers,
     `LOCALE_ID` es-MX registration, favicon).
  2. Decide the asset location: either move or copy `assets/media` into `public/` or add it as
     an `angular.json` asset input.
  3. Decide one image pipeline: a committed pre-generated derivative set produced by a script
     in `scripts/`, plus one shared `<picture>`/`NgOptimizedImage` wrapper in `shared/`.
  4. Restore the dependency verification gate into AD-4: bundle delta recorded, budgets pass.
  5. Mark Ajv as an assumption or decision.

### F6 — Medium — Material-first has no precedence rule against EXPERIENCE semantics

- **Evidence.** EXPERIENCE specifies exact semantics that Material defaults don't match:
  - The Project filter uses `<button aria-pressed>` chips, while MatChipListbox uses
    `listbox`/`option`.
  - Live regions must "exist, empty, before their text changes", while CDK `LiveAnnouncer`
    creates its own region.
  - Overlays must set `inert` on the shell.
  - Esc is "ignored while a native `<select>` is open", which assumes a native select;
    MatSelect isn't one.
  - The carousel has no Material control, so CDK or a custom build is needed.

  AD-4 says "Material first" but not which wins when they disagree. Two features will resolve
  it differently.
- **Fix.** Add to AD-4: "PRD testable consequences and EXPERIENCE accessibility semantics win
  over Material defaults. Where a Material control can't meet them through supported APIs, use
  CDK or a native element styled with tokens." Then pre-decide the known cases in a short
  table: filter = `mat-button-toggle` or native buttons with `aria-pressed`; one shared
  `core/a11y` announcer that uses persistent `role="status"` regions; Service field = native
  `<select matNativeControl>`; carousel = custom on CDK `a11y`.

### F7 — Medium — Quiet requirements were dropped

- **Tone (PRD §2.4, EXPERIENCE › Voice and Tone).** Nothing in the spine checks the banned
  superlatives ("los mejores", "líderes", "los más altos estándares", "superar expectativas"),
  the `kVA` casing (not "KVA"), the *tú* form, or the Hero copy budget (headline ≤ 60, lead ≤
  120). **Fix:** banned-phrase, casing, and length assertions in the content-integrity spec
  (F4).
- **Accessibility (NFR-2, SM-2 Accessibility 100).** No automated a11y or Lighthouse gate. CI
  lists only "Tests, schema validation, production build". **Fix:** add axe (via Vitest/jsdom
  or Playwright) and a Lighthouse CI run against the static output as required checks. These
  are host-independent, so decide them now.
- **Budgets (NFR-1, constitution VI).** `angular.json` budgets are already enforced by
  `ng build`, but the LCP, CLS, and TBT targets and image budgets have no gate. **Fix:** the
  same Lighthouse CI run with assertions.
- **Privacy (NFR-4, FR-11).** AD-6 and AD-9 cover this well. Missing: WhatsApp link
  `rel="noopener noreferrer"` with `target="_blank"`; a rule that no `fetch` or `HttpClient`
  is provided at all (enforce: don't add `provideHttpClient`, lint `fetch`); and the PRD
  §3 Lead/SM-1 dependency on the tag being byte-identical across composer, direct links, and
  no-JS fallback. AD-9 owns the builder, but the prerendered no-JS `mailto:` must also come
  from it at prerender time, so state that.
- **Content parity (FR-15).** AD-2 relies on review. **Fix:** add a lightweight CI check that
  fails a PR touching `content/**` without touching `src/app/core/content/**`, unless the PR
  body has a "no executable change" line. Without this, parity is unenforced.
- **Literal-text check (FR-15).** AD-3 states the rule but not the mechanism. **Fix:** name it,
  for example an Angular template AST spec over `features/**` and `shared/**` `.html`.
  Otherwise each feature writes its own or none.

### F8 — Medium — The token-sync deferral leaves divergence open

- **Evidence.** DESIGN.md says `_tokens.scss` and `design-tokens.json` "are generated from it
  and never hand-edited". The memlog says parity "is tested". The spine only lists
  "Token-sync implementation" under Deferred with "Parity is required". There's no interim
  owner and no Material theme mapping location, and AD-4 says "fed by project tokens" without
  saying where the token→Material system-variable mapping lives.
- **Fix.** Promote this to a rule:
  1. A single theme file `src/styles/_material-theme.scss` maps `--kva-*` to Material
     overrides.
  2. Only the token story writes `_tokens.scss` and `design-tokens.json`.
  3. A parity spec compares the two files and DESIGN.md front matter from day one.
  4. Only the generator itself is deferred.

### F9 — Medium — Operations and delivery dimensions are absent or deferred without a revisit trigger

- **Evidence.** The Deferred table has reasons but no owner or trigger. The memlog's question
  ("revisit when host provider is known") wasn't carried into the spine. The spine has no
  Open Questions section, and these have no entry: uptime/monitoring (no analytics is allowed,
  so state "host-level uptime only"), cache policy (`outputHashing: all` implies immutable
  hashed assets and `no-cache` HTML), rollback, preview environments, Node version pin, and
  branch protection.
- GitHub is "intended" as CI/CD, but the **required PR checks don't depend on the host** and
  could be decided now.
- **Fix.**
  1. Split AD-11 into host-independent and host-dependent parts. Host-independent, decided
     now: a GitHub Actions PR workflow on a pinned Node version runs test, content integrity,
     literal-text, token parity, build with budgets, CSP smoke, axe, and Lighthouse; branch
     protection requires them. Host-dependent, deferred: the deploy job.
  2. Add an Open Questions section with owner and trigger: host (Arturo, PRD §8.3 launch
     story), DNS (kVA, PRD Q4), and the headers list (F3).
  3. State the cache policy and that there's no runtime telemetry.

### F10 — Low — Coverage and hygiene

- **Footer missing from the feature list.** The structural seed lists header, hero, services,
  projects, nosotros, trust, contact, and privacy. The footer (FR-3, FR-20, FR-14 entry) has
  no slot. Direct contact links are used in contact and footer, so they should be a
  `shared/` component built on AD-9.
- **Behaviour model contract.** AD-7 says "typed model" but doesn't fix one shared
  `BehaviorModel` type with the constitution II fields (`id`, `actor`, `trigger`,
  `preconditions`, `states`, `transitions`, `effects`, `acceptance`). Add
  `behaviors/behavior-model.ts`, and say behaviors import nothing but that type. The
  constitution path is `<feature>.behavior.ts` and the spine uses `<behavior-id>.behavior.ts`.
  Record this as an intentional refinement so `speckit-analyze` doesn't flag it.
- **Layer table.** "Behaviors" appears in the table but not the mermaid diagram, and its
  allowed imports aren't stated. AD-1 also doesn't say whether `core` may import `behaviors`.
  The dialog and history services likely need the `project-detail` and `contact-composer`
  models.
- **robots.txt, sitemap.xml, canonical (FR-16).** State that they're static files in
  `public/` and that the canonical URL comes from `site` content.
- **Scroll-spy, sticky condense, scroll reveal.** These are cross-section behaviors. Assign
  them to `shared/` directives (or the header feature for scroll-spy, observing section IDs
  from core) so features don't each add IntersectionObservers.
- **Tagging.** The memlog says unconfirmed calls were "tagged in the spine for review", but
  only AD-2, AD-4, AD-5, and AD-11 carry `[ADOPTED]`. AD-1, 3, 6, 7, 8, 9, and 10 have no tag.
  Mark them `[PROPOSED]` or get them confirmed before status moves off `draft`.
- **Constitution ADR clause.** The constitution requires the UI library choice to be "recorded
  as an ADR in `_bmad-output/planning-artifacts/`". State in AD-4 that this AD is that record,
  or add a constitution PATCH amendment, so `speckit-analyze` passes.

## What the spine gets right

- The paradigm and dependency direction suit a single static page. The layer table is
  concrete.
- AD-2 cleanly encodes the reconciled Markdown decision and blocks the CMS/pipeline drift
  the memlog worried about.
- AD-6 and AD-9 together give a strong, testable privacy story for the `mailto:`-only
  contact model.
- AD-10 closes the third-party-origin leak paths (fonts, icon fonts, analytics).
- The stack versions match the brownfield `package.json` and the memlog verification of
  2026-10-22.
- The Deferred items are genuinely host-dependent. The English version is kept possible via
  AD-3.

## Traceability spot-check

| Requirement | Spine coverage | Gap |
|---|---|---|
| FR-1 hidden section ⇒ header link hidden | AD-3 facade (implicit) | F4 |
| FR-8 Back closes detail | AD-5 | F1 (menu shares history) |
| FR-12/FR-20 no-JS contact | AD-9 | F2 |
| FR-14 notice reachable, keeps composer state | AD-5, AD-6 | F2 (in-flow `#aviso`), F1 (registry) |
| FR-15 literal-text check, parity | AD-2, AD-3 | F7 (mechanisms unnamed) |
| FR-16 metadata without JS | AD-8 | F10 (robots/sitemap) |
| FR-19 permission everywhere incl. metadata | AD-3 | F4 |
| NFR-1 budgets/CWV | AD-8, AD-10 | F5 (images), F7 (gate) |
| NFR-2 WCAG 2.2 AA | AD-4 | F6, F7 |
| NFR-4 CSP | AD-10, Deferred | F3 |
| Constitution IV tokens | Conventions, Deferred | F8 |
| Constitution V OnPush/zoneless | (implicit) | F5 (`App` not OnPush) |
