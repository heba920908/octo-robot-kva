---
review: adversarial
target: ../ARCHITECTURE-SPINE.md
date: '2026-10-22'
inputs:
  - ../../../prds/prd-agency-portfolio-2026-10-19/prd.md
  - ../../../prds/prd-agency-portfolio-2026-10-19/addendum.md
  - ../../../ux-designs/ux-agency-portfolio-2026-10-21/EXPERIENCE.md
  - ../../../ux-designs/ux-agency-portfolio-2026-10-21/DESIGN.md
verdict: 'REVISE: not safe to split into stories yet'
---

# Adversarial Review: Architecture Spine, kVA Instalaciones Landing Page

## Verdict

**REVISE before story breakdown.** The spine picks the right shape: static prerender, typed
content, a central dialog service, and one contact-link builder. However, most ADs name an
owner without defining the contract that the owner exposes. Two teams can obey every AD word
for word and still ship units that do not fit together. The holes cluster in five places:

1. **Identity:** how a Project points to its Service.
2. **Overlay and history control:** who calls `pushState`, `replaceState`, and `back()`, and
   who listens for `popstate`.
3. **AD-1 vs AD-5:** core cannot import features, so the core dialog service cannot open
   components that features own.
4. **AD-7:** the behavior-model runtime contract is undefined.
5. **AD-8 vs EXPERIENCE.md:** EXPERIENCE.md asks for markup that changes after hydration, but
   AD-8 requires server and browser markup to match.

There are 14 findings: 4 Critical, 6 High, and 4 Medium. Each finding gives a conflict pair,
explains why both units comply with the current ADs, and proposes AD text.

Method: for each concern, build two units that are written independently from the spine.
Each unit obeys every AD literally. Then show where they meet: at runtime, in the prerendered
HTML, or when a content change lands.

---

## Critical

### C1. Service/Project identifiers are not defined (clashing shared-data shapes)

**Gap.** The conventions say only that "stable slugs match Content doc slugs". Nothing says
that cross-references use slugs, what type an ID has, or which field holds it. The addendum's
`project` schema has a field named just "Service".

**Conflict pair.**
- **Unit A, `features/projects` (FR-7 filter, FR-8 detail):** stores
  `project.service: 'Instalaciones'`, the display name. It builds filter chips by grouping on
  that string. The detail view's "Cotiza un proyecto similar" sends `'Instalaciones'` to the
  composer.
- **Unit B, `features/contact` (FR-11 composer):** the Service `<mat-select>` uses
  `service.slug` (`'instalaciones'`) as the option value. The composer receives
  `'Instalaciones'`, finds no matching option, and leaves the field empty, which breaks FR-6
  and FR-8. Later a content PR renames the Service to "Instalaciones eléctricas" (an FR-5
  "Content-only change"). Every Project then drops out of the filter, and no schema catches
  it, because each schema validates only its own type.

**Why both comply.** AD-3 requires a schema for each content type. Neither AD-3 nor any
convention requires referential integrity or ID-only references.

**Proposed AD-12, Content identity and references.**
> Every collection entity (Service, Project, Trust item, client group, Nosotros value) has an
> `id`: lowercase ASCII kebab-case, equal to its Content doc slug, and immutable once
> published. Cross-references are `<type>Id` fields (`serviceId`, `clientGroupId`) whose types
> are branded or literal-union types exported from `core/content/ids.ts`. Display names are
> never used as keys. Cross-feature payloads, behavior-model state, form values, and dialog
> inputs carry IDs only; names are resolved through the content facade at render time. A
> unit test checks referential integrity: every `serviceId` and `clientGroupId` resolves, and
> IDs are unique within each type. Renaming an entity changes its name, not its `id`.

### C2. AD-1 forbids the dependency that AD-5 needs

**Gap.** AD-5 says `core/dialogs` alone opens the Contact composer, the Project detail view,
and the Privacy notice. AD-1 says core never imports features. The structural seed puts those
components in `features/contact`, `features/projects`, and `features/privacy`. The dialog
service therefore cannot reference the component classes it must open.

**Conflict pair.**
- **Unit A, Projects story:** moves `ProjectDetail` into `core/dialogs/project-detail/` so the
  service can import it. That component needs the carousel, the badge, and the Project
  content view. The carousel then moves into core as well, against the layer table, where
  core owns no UI.
- **Unit B, Contact story:** keeps `ContactComposer` in `features/contact`. It registers the
  component at runtime by calling `dialogService.register('composer', ContactComposer)` from
  the feature constructor. If the Contact section has not been instantiated yet (it sits
  below the fold or inside an `@defer` block), the Header contact CTA opens nothing.

**Why both comply.** Unit A obeys AD-1 and AD-5. Unit B obeys AD-1, AD-5, and AD-6. They
choose opposite placements, and registration order is undefined.

**Proposed AD-5a, Overlay registry.**
> `core/dialogs` defines `OverlayId = 'contact-composer' | 'project-detail' | 'privacy-notice'`,
> a typed input map (`OverlayInputs[id]`), and an `OVERLAY_COMPONENTS` injection token. The
> **app shell** (`app.config.ts`), which may import features, provides the
> `id → lazy component loader` map. Features never register overlays at runtime. Overlay
> components stay in their owning feature and receive only their typed input (IDs, not
> entities).

### C3. Two history owners: overlays, the Mobile menu, and anchor navigation

**Gap.** AD-5 owns "overlay history entries" for three modal dialogs. EXPERIENCE.md ›
Interaction Primitives gives the **Mobile menu** a history entry too. It also has
`section-navigation` call `history.replaceState` after a menu link "consumes" the menu entry
with a guarded `history.back()`. Neither the Mobile menu nor anchor navigation belongs to
`core/dialogs`. `history.back()` is asynchronous, but the spine sets no rule for ordering
history operations.

**Conflict pairs.**
- **Unit A, `features/header` (`mobile-menu`):** adds its own `pushState` and its own
  `popstate` listener, which is feature-local state under AD-6.
- **Unit B, `core/dialogs`:** adds a second `popstate` listener. A user who opens the menu and
  taps "Cotiza" opens the composer above the open menu. One Back press fires both listeners,
  so the composer and the menu both close, but only one history entry was popped. The stack
  is no longer truthful.
- **Unit C, `section-navigation` (header and hero):** after a menu link, the unit calls
  `history.back()` and then immediately calls `replaceState('#proyectos')`. The
  `replaceState` lands on the menu entry before the pop finishes. The fragment ends up on a
  dead entry, and the next Back shows a stale URL.
- **Angular Material default:** `MatDialogConfig.closeOnNavigation` defaults to `true`, so
  every open `MatDialog` closes on `popstate`. With the Privacy notice open over the composer,
  one Back closes both dialogs. That breaks FR-14 and the overlay-history rule, even though
  the dialog service handles `popstate` correctly.
- **Overlay swap:** "Cotiza un proyecto similar" must replace the history entry and later
  return focus to the originating **card**. A dialog service that records the invoker as
  `document.activeElement` at open time records the detail view's CTA, which is destroyed on
  close.

**Why all comply.** AD-5 covers only "modal overlays". The Mobile menu is a disclosure, not a
dialog. AD-6 allows feature-local state. The spine never names a history owner.

**Proposed AD-5 replacement, Single history and layer controller.**
> `core/dialogs` exposes `LayerController`. It is the only code allowed to call
> `history.pushState`, `history.replaceState`, or `history.back`, and the only `popstate`
> listener (lint: `no-restricted-properties` everywhere else). Layers are the three modal
> overlays plus the Mobile menu. The rules are:
> 1. Each entry carries `history.state = { kvaLayer: LayerId, depth }`.
> 2. Operations run in a serialized queue. A guarded `back()` resolves only after its
>    `popstate` arrives, and anchor `replaceState` requests from `section-navigation` are
>    queued behind it.
> 3. The allowed stacks are none, menu, one modal, and Privacy over Composer. Opening a
>    modal while the menu is open first closes the menu and consumes its entry.
> 4. Swap (Project detail → Composer) is one `replaceState`. It carries the original
>    `returnFocusTo` reference forward.
> 5. Every `MatDialog` opens with `closeOnNavigation: false`, `restoreFocus: false`, and
>    `autoFocus: false`. Focus is set by the controller from the behavior model.
> 6. On cold load, a `history.state.kvaLayer` left over from before a reload is cleared with
>    `replaceState`; no overlay opens on load.

### C4. Prerender rules contradict the progressive-enhancement UX

**Gap.** AD-8 says "Rendered markup must match on server and browser" and the conventions say
"never branch rendered markup by platform". EXPERIENCE.md requires several platform-dependent
differences:
- Contact CTAs are `<a href="#contacto">` before hydration and gain `aria-haspopup` after.
- Chips, copy buttons, and the menu button are hidden without JavaScript.
- The Service list is collapsed below 768 px, but all Sub-services appear in the
  prerendered HTML.
- The Privacy notice is an in-flow `<section id="aviso">` without JavaScript.

**Conflict pair.**
- **Unit A, Services:** collapses the Sub-service list with `@if (isMobile())`, where
  `isMobile` reads `matchMedia` in the browser. The server has no `matchMedia` and renders
  the full list. That causes a hydration mismatch (NG0500) and layout shift, which breaks
  NFR-1 CLS.
- **Unit B, Contact:** follows AD-8 literally and never adds `aria-haspopup`. It renders a
  `<button>` on the server. With no JavaScript, the "button" does nothing. That breaks the
  no-JS fallback and the "Contacto | No JavaScript" state.
- **Unit C, Projects:** wraps the Project grid in `@defer (on viewport)` to meet NFR-1. In
  static prerender, a defer block renders only its placeholder, so the Project titles are
  missing from the served HTML. That breaks FR-16.
- **Footer `{year}`:** read from `new Date()` at render time. A build made on December 31
  that is served in January shows one year on the server and another after hydration.

**Proposed AD-8a, Progressive enhancement contract.**
> The server and the first client render produce identical markup. Every no-JS vs JS
> difference is applied only **after** hydration, by a single `Enhanced` signal in core that
> is set from `afterNextRender`. Each enhanced-only control renders with the `hidden`
> attribute on the server and has it removed when `Enhanced` turns on. Enhanced-only
> attributes (`aria-haspopup`, `role` swaps) are bound to that signal. Each feature lists its
> enhancements in its behavior model's `enhance` transition. The no-JS versions are:
> - Contact CTAs are real `<a href="#contacto">` links.
> - The composer button is a `mailto:` link built by AD-9 at prerender.
> - The Privacy notice is the in-flow `#aviso` section.
>
> Responsive collapse (Service lists) and viewport-dependent presentation use CSS only; no
> `matchMedia` branch may decide whether something renders. `@defer` is forbidden around any
> FR-16 content. Build-time values (`{year}`, canonical URL) come from Executable content or
> a build constant, never from `Date` at render. A prerender test asserts zero hydration
> mismatches (`ngSkipHydration` forbidden).

---

## High

### H1. The behavior-model runtime contract is undefined (AD-7)

**Gap.** AD-7 says "implements its typed model" and "every transition has a unit test". The
layer table says behaviors are "side-effect-free". The spine does not define:
- the model's type: state, event, and transition shapes;
- where side effects run, such as focus, history, `mailto` navigation, clipboard, and live
  announcements;
- what the behaviors layer may import, since AD-1 is silent on it;
- who implements multi-owner models: `section-navigation` spans the shell, header, hero, and
  every section heading, and `contact-cta` spans the header, hero, and contact.

**Conflict pair.**
- **Unit A, `project-filter`:** exports a reducer, `transition(state, event): state`.
- **Unit B, `contact-composer`:** exports a class whose methods call `focus()` and
  `window.location.href = mailto`. "Every transition has a unit test" is satisfied with jsdom
  spies.
- **Unit C, `project-detail` model:** imports `core/dialogs` to push history. Now behaviors
  depend on core, core's `LayerController` wants to follow the `project-detail` model, and
  the result is an import cycle. Nothing forbids it.

The composer cannot be assembled from units A and B. Nothing standard drives the models, the
tests are not comparable, and "side-effect-free" is violated without any check catching it.

**Proposed AD-7 tightened.**
> Each `src/app/behaviors/<id>.behavior.ts` exports:
> - `type <Id>State` (a discriminated union);
> - `type <Id>Event` (a discriminated union);
> - `const initial<Id>: <Id>State`;
> - `function <id>Transition(s, e): { state: <Id>State; effects: readonly Effect[] }`, a pure
>   function with no DOM, no DI, and no `Date`/`Math.random`.
>
> `Effect` is a closed union in `behaviors/effects.ts`:
> `focus(target: FocusTargetId) | layer(op) | navigate(href) | copy(text) | announce(regionId, stringKey, params) | scrollTo(sectionId)`.
> Effects are interpreted by one `EffectRunner` in `core`, the only code that touches the
> DOM, history, or clipboard on behalf of a model. Behaviors import only types from
> `core/content/ids.ts` and `behaviors/effects.ts`. Core may import behaviors, but behaviors
> never import core runtime code. Each model has a table-driven spec in which every
> `(state, event)` pair from its EXPERIENCE.md row is one test case. Multi-component models
> have one owning directory, named in the capability map, and consumers dispatch events to
> it.

### H2. Composer draft state has an unnamed owner and many write paths (AD-6)

**Gap.** AD-6 says cross-feature state belongs to "a named core service" but does not name
it. Composer values must survive across openings from the header, hero, Service cards,
Project detail, and Contact section, and across a Privacy notice round-trip. EXPERIENCE.md
adds rules for when the Service is overwritten: Header keeps the earlier choice, a Service CTA
replaces it, and a reopen after submit shows the filled form.

**Conflict pair.**
- **Unit A, `features/contact`:** holds the values in component-local signals ("feature-local
  state uses signals"). Closing the dialog destroys the component and the values with it,
  which breaks FR-14 and the "Reopened" state.
- **Unit B, `features/services`:** passes the preselected Service as `MatDialog` data. The
  composer applies it on init and overwrites the draft. Unit C, `features/header`, passes
  `undefined`. The composer treats that as "clear Service", which breaks the rule that the
  Header keeps the earlier choice.
- **Post-submit state:** if it lives in the draft, a reopen shows the post-submit panel
  instead of the filled form. That breaks the "Reopened after submit" state.

**Proposed AD-6a.**
> `core/contact/ContactDraft` is the only owner of composer data: `email`, `serviceId`,
> `consent`, and `lastSubmittedAt?`. It is a root-provided signal store that lives in memory
> only. All writes go through two paths:
> 1. `LayerController.open('contact-composer', { prefillServiceId?: ServiceId, returnFocusTo })`,
>    which calls `ContactDraft.prefill(id)` only when `prefillServiceId` is defined.
> 2. The composer component's form bindings.
>
> No other feature reads or writes the draft. The post-submit view is component-local and
> always resets to the form on open. Nothing in the draft is ever serialized.

### H3. Section visibility and header links have two derivations (two owners of one fact)

**Gap.** FR-1, FR-7, FR-10, FR-18, and FR-19 hide a section **and its header link** in
specific conditions. The section feature and `features/header` each have to decide this.
AD-1 stops either one importing the other.

**Conflict pair.**
- **Unit A, `features/trust`:** hides the section when there are no confirmed Trust items
  **and** no permitted client groups (FR-10).
- **Unit B, `features/header`:** hides "Confianza" when `trustItems.filter(confirmed).length === 0`.

With permitted clients and no confirmed items, the section renders but has no header link.
The reverse case gives a dead anchor. The same split happens for Projects ("no Projects")
and Nosotros ("no Content doc").

**Proposed AD-3b, Derived content facts live in the facade.**
> The content facade exposes derived, read-only facts, computed once in core:
> - `sections: readonly { id: SectionId; anchor: string; labelKey: UiStringKey; visible: boolean }[]`,
>   in header order;
> - `projectFilterOptions` (FR-7);
> - `permittedClientGroups` (FR-19);
> - `confirmedTrustItems` (FR-10);
> - `heroProofPoint`, resolved from its reference.
>
> Features render these facts and never re-derive visibility, permission, or confirmation
> from raw content. Raw unpermitted client data and unconfirmed trust items are not exposed
> outside core. A Project's client field arrives already resolved as
> `PermittedClient | undefined`.

### H4. The content facade's shape and UI-string formatting are undefined (AD-3)

**Gap.** "One content facade" does not say whether data comes back as plain readonly values,
signals, observables, or DI tokens, or how tests override content. The FR-7 states (fewer
than two Services with Projects, no Projects) need fixture content. Interpolated UI strings
(`{n}`, `{servicio}`, plural "Revisa 1 campo / Revisa {n} campos") have no formatter owner.
The literal-text ban in AD-3 covers **templates only**.

**Conflict pair.**
- **Unit A, Projects:** builds the live count in TypeScript:
  `` `${n} proyectos: ${name}` ``. The template contains only `{{ count() }}`, so it passes
  the AD-3 lint. The visible Spanish copy now lives in a `.ts` file and cannot be found by a
  future language pass, which breaks NFR-5.
- **Unit B, Contact:** formats the same pattern with a `uiString | fill:{n}` pipe from
  `shared/`. It pluralizes with `n === 1`.
- **Unit C:** imports `services.content.ts` directly instead of the facade, so a test fixture
  override cannot reach it.
- **Material:** components render built-in English accessible text. An example is
  `MatChipRemove`/`MatSelect` text, or a `MatDatepicker`-style intl class if one is added
  later. That text bypasses es-MX UI strings.

**Proposed AD-3 tightened.**
> - `ContentFacade` is `providedIn: 'root'` and returns synchronous `readonly` values; content
>   is static, so it uses no signals or observables. Tests replace it through
>   `provideContent(fixture)`.
> - `no-restricted-imports` blocks every `*.content.ts` import outside `core/content`.
> - UI strings are a typed map `UiStrings` keyed by `UiStringKey`, with templates using named
>   placeholders and explicit plural variants (`{ one, other }`).
> - One pure `format(key, params)` in `core/content` is the only formatter. It is exposed to
>   templates by one `ui` pipe.
> - Visible or accessible text in `features/**` and `shared/**` `.ts` files is forbidden.
>   Template literals or concatenation that produce user-facing text fail lint, and string
>   literals are allowed only as keys.
> - Every Material component used must have its intl/aria provider (if any) configured from
>   `UiStrings` in the app shell. A test renders each used Material component and asserts
>   there is no English text.

### H5. Contact URL formatting: input shapes and the subject tag have two homes (AD-9)

**Gap.** AD-9 makes one function own the URLs and the Lead subject tag. It does not define
the input data shapes, the encoding rules, or what happens to the tag text that EXPERIENCE.md
also lists as UI strings (the "`mailto:` subject" rows and the WhatsApp prefill
"[kvainstalaciones.mx] Hola…"). The phone appears in four forms:
- display: "(56) 4000 3344";
- `tel:`: `+525640003344`;
- `wa.me`: digits without the `+`;
- JSON-LD: "+52 56 4000 3344".

**Conflict pair.**
- **Unit A, site content:** stores `phone: '(56) 4000 3344'`. The builder strips non-digits
  and produces `tel:5640003344` with no country code, which can dial wrongly on mobile.
- **Unit B, SEO:** writes JSON-LD `telephone` straight from `site.phone`. AD-9 covers only
  `mailto:`, `tel:`, and WhatsApp URLs, so the display format leaks into structured data.
- **Unit C, Contact:** the builder adds `[kvainstalaciones.mx]`, and the `ui-strings`
  WhatsApp prefill already starts with it. The result is a doubled tag, "[kvainstalaciones.mx] [kvainstalaciones.mx] Hola".
  A teammate uses `URLSearchParams`, which encodes spaces as `+`. Some mail clients show the
  `+` literally, and the FR-13 counting rule breaks.

**Proposed AD-9 tightened.**
> - Site content stores `phone: { display: string; e164: string /* ^\+52\d{10}$ */ }` and
>   `whatsapp?: { e164 }`.
> - `core/contact/links.ts` exports exactly `mailtoLead(serviceId)`,
>   `mailtoDirect()`, `tel(phone)`, `whatsapp(prefillKey)`, and `jsonLdTelephone(phone)`.
> - The Lead tag constant `LEAD_TAG` exists only in that module. A schema/unit test fails if
>   any UI string contains `[kvainstalaciones.mx]`. UI strings carry only the tag-less tail
>   ("Contacto", "Hola, kVA…").
> - Encoding is `encodeURIComponent` only (`URLSearchParams` is banned), with `%0D%0A` line
>   breaks and a URL length ≤ 2000. `wa.me` uses `e164` without the `+`.
> - Golden-string unit tests pin each output.
> - The builder is pure and runs at prerender, so the no-JS `mailto:` links are in the served
>   HTML.

### H6. Ownership of head metadata and JSON-LD (AD-8)

**Gap.** AD-8 says metadata "comes from Executable content during prerender". The capability
map lists the app shell **and** core. Neither says who calls `Title` and `Meta`, how JSON-LD
gets into the HTML (Angular sanitizes `<script>` in templates), or how duplicates are
avoided after hydration.

**Conflict pair.**
- **Unit A, app shell:** appends `<script type="application/ld+json">` through
  `Renderer2` in `ngOnInit`. That runs on the server and again in the browser, which leaves
  two JSON-LD blocks.
- **Unit B, Projects:** adds `og:image` from the first Project photo for "better sharing".
  That breaks FR-16, which requires a dedicated 1200×630 share image.
- **Unit C:** puts static meta tags in `src/index.html`. They now duplicate Unit A's tags,
  and they come from neither Content doc nor Executable content.
- **FR-19:** a well-meant `knowsAbout`/`client` entry in JSON-LD, built from all client
  groups, leaks unpermitted names into metadata.

**Proposed AD-8b.**
> `core/seo/head.ts` exports a pure `buildHead(site, facade): HeadModel`. Its inputs are only
> site SEO content and the facade's permitted facts. One `HeadWriter` applies it once from
> the app shell during prerender. The writer is idempotent: it upserts elements by
> `data-kva-head` id and skips writing in the browser when they already exist. `index.html`
> carries no title, meta, canonical, or JSON-LD. Features never inject `Title`, `Meta`, or
> `DOCUMENT` to touch `<head>`. A prerender test asserts the served HTML has exactly one
> `title`, one canonical, one `og:image` that equals the site share image, and one
> `ld+json`, and contains no non-permitted client name and no `proyectos2@` or
> `4029 4029`.

---

## Medium

### M1. Theme and token ownership (AD-4, styling convention)

**Gap.** DESIGN.md says `src/styles/_tokens.scss` and `design-tokens.json` are **generated**
and never hand-edited. The spine defers the token sync, does not say who maps tokens into
Material, and puts a design-token schema in `core/schemas` without saying what it validates.

**Conflict pair.**
- **Unit A, Header:** hand-adds `--kva-color-ink` to `_tokens.scss`, because the generator is
  deferred.
- **Unit B, Material theme:** calls `mat.theme((color: (primary: mat.$orange-palette)))`.
  Material now emits `--mat-sys-primary`, which is close to copper but not `#8A5430`. Chips
  and focus rings use Material's color, and the Header uses `--kva-*`.

The active chip fails DESIGN.md's `accent-strong` and its checked contrast table. Feature SCSS
reads both `--mat-sys-*` and `--kva-*`.

**Proposed AD-13, Token ownership.**
> DESIGN.md front matter is the token source. `src/styles/_tokens.scss` (`--kva-*`) and
> `src/app/core/schemas/design-tokens.json` are its only exports. Until the generator exists,
> a parity unit test parses DESIGN.md and fails on drift; hand edits must keep it green.
> Material is themed in exactly one file, `src/styles/_material.scss`, using
> `mat.theme-overrides` and `mat.<component>-overrides` with `var(--kva-*)` values only.
> Component and feature SCSS may read only `--kva-*` (no hex values, no `--mat-sys-*`); this
> is enforced by stylelint. Per-component styles stay within the 8 kB budget.

### M2. Schemas and TypeScript types are two sources of one shape (AD-3)

**Gap.** AD-3 requires readonly typed objects **and** a JSON Schema for each type. It does not
say which one is authoritative.

**Conflict pair.**
- **Unit A:** marks `summary` optional in the TypeScript `Project` interface and forgets the
  schema.
- **Unit B:** adds `minItems: 1` to `photos` in the schema, while its TypeScript type allows
  `[]`.

Both compile and both pass their own tests, but the types and the validated data disagree.

Also, Ajv 8 does not implement `format: "email"` without `ajv-formats`. In strict mode it
throws; otherwise it silently ignores the format. FR-20 requires an invalid address to fail
validation, and `ajv-formats` is not in the Stack.

**Proposed AD-3c.**
> Schemas are authoritative. TypeScript content types are derived from them, either through
> `FromSchema` on `as const` schema modules or through a checked-in generated `*.types.ts`
> that CI regenerates and diffs. Schemas use `pattern` rather than `format`, or `ajv-formats`
> is added to the Stack, pinned. Ajv runs only in tests and build scripts, never in the
> application bundle (NFR-1).

### M3. Entity ordering has two mechanisms

**Gap.** The `service` and `client` schemas carry an `order` field. FR-5 and FR-19 also say
"in Content doc order".

**Conflict pair.** The Services feature sorts by `order`. The composer's `<mat-select>`
iterates the array as written. After a content PR that edits only `order`, the cards and the
select options appear in different orders.

**Proposed rule, added to AD-3.**
> Executable content arrays are stored in display order. `order` fields are dropped from
> schemas, or a unit test asserts the arrays are sorted by `order`. No consumer sorts content.

### M4. The Contact feature is split across shell-level CTAs (AD-1 granularity)

**Gap.** The Contact CTA lives in the header, hero, Services, Project detail, and Contact
section. AD-1 lets each feature build its own CTA.

**Conflict pair.** Header and Hero each build a CTA. One is a Material `mat-flat-button`
`<button>`. The other is an `<a>` that is enhanced later (C4). The `contact-cta` behavior then
has two DOM shapes and two accessible-name rules. The "Cotiza" → "Cotiza tu proyecto"
label-in-name rule is applied in one place and not the other.

**Proposed rule, added to the capability map and AD-1.**
> Cross-cutting interactive primitives that several features render (`ContactCta`,
> `SectionLink`, `CopyAddress`) live in `shared/`, each with one behavior model. Features
> place them; they do not rebuild them.

---

## Summary of proposed AD changes

| ID | Kind | Closes |
|---|---|---|
| AD-12 Content identity & references | New | C1, part of H3 |
| AD-5 → LayerController, with AD-5a registry | Replace + new | C2, C3 |
| AD-8a Progressive enhancement | New | C4 |
| AD-7 Behavior runtime contract | Tighten | H1 |
| AD-6a ContactDraft | Tighten | H2 |
| AD-3b Derived facts in facade | New | H3 |
| AD-3 Facade shape and UI-string formatter | Tighten | H4 |
| AD-9 Inputs, tag ownership, encoding | Tighten | H5 |
| AD-8b Head ownership | New | H6 |
| AD-13 Token ownership | New | M1 |
| AD-3c Schema authority | New | M2 |
| AD-3 ordering clause | Tighten | M3 |
| AD-1 shared interactive primitives | Tighten | M4 |

Also add to **Stack**: `ajv-formats`, or note that it is not used. Also add to the
**capability map**: one owning directory for each multi-component behavior model
(`section-navigation`, `contact-cta`).
