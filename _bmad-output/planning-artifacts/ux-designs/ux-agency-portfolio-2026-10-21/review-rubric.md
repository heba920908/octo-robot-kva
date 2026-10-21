# Spine Pair Review — kVA Instalaciones Landing Page

Reviewer: rubric walker (`references/validate.md`), run 2026-10-21.
Scope: `DESIGN.md` + `EXPERIENCE.md`, read against `.memlog.md` (authoritative, so its four
overrides supersede the PRD), the PRD + addendum, the brief, the constitution v1.0.0, `imports/`,
and the pending key screens `.working/key-{landing,projects,contact}.html`. Gaps already listed in
`reconcile-prd.md` and `reconcile-brochure.md` are **not** repeated here. The one severity change
to those files is under Mechanical notes.

## Overall verdict

A downstream consumer can source-extract this pair cleanly. Both YAML frontmatters parse, all 69
`{token}` references resolve, every source and asset path resolves, and all 21 published contrast
ratios recompute exactly. All three UJs have complete Key Flows, and component names match across
both spines. Two contract breaks block handoff:
- The Contact section and footer `mailto:` links carry no Lead subject tag, which breaks FR-13 and
  SM-1 counting.
- The spine's claim that every user action has a behaviour model is false for the new phone and
  direct-email actions (constitution II).

Beyond those two, the token export contract and the interactive-state visuals need tightening
before the architecture and story work starts. The reconcile highs also still stand.

## 1. Flow coverage — strong

Checked: UJ-1, UJ-2, and UJ-3 (PRD §2.3) against EXPERIENCE › Key Flows. Each flow has a verbatim
title, a named protagonist, numbered steps, a bold climax, and a failure path (plus an edge case or
variant). FR-1…FR-17 are traced in EXPERIENCE › Requirement Trace.

### Findings
- **low** Some requirement paths are traced but never walked in a flow: the < 768 Mobile menu
  (FR-1; Laura on a phone uses the Hero CTA instead), opening the Privacy notice from the footer
  (FR-14), and meeting a Placeholder project (FR-9). Story writers have no narrative for these
  paths (EXPERIENCE › Key Flows). *Fix:* add a one-line variant to Flow 1 ("she opens the menu and
  taps Contacto") and to Flow 2 (opens a card carrying "Ejemplo Ilustrativo").

## 2. Token completeness — adequate

Checked: every frontmatter token (21 colors, 22 typography, 2 rounded, 36 spacing, plus the
elevation, motion, and breakpoints extension keys, and 39 component entries) and every prose
`{path}` reference (57 in DESIGN, 12 in EXPERIENCE; all resolve). All solid colors have hex. No
light/dark mode applies (single theme with dark and light *sections*). The contrast table covers
every load-bearing text pair, and the ratios were recomputed (WCAG 2.2): all match.

### Findings
- **medium** `colors.overlay` and `colors.scrim` are `rgba()` strings. The spec types colors as
  hex, so DESIGN.md linters and JSON-schema validation of `design-tokens.json` may reject them
  (DESIGN frontmatter `colors`). *Fix:* use 8-digit hex (`'#1C1714C7'`, `'#1C171499'`), or a base
  color plus an `opacity` token.
- **medium** Component tokens hard-code literals that duplicate named spacing tokens:
  - `header.height: 64px` (= `spacing.header-h`) and `header-condensed.height: 56px`
  - `contact-composer.width: 440px` (= `panel-w`)
  - `project-detail-view.width: 1080px` (= `dialog-w`)
  - `privacy-notice.width: 720px` (= `notice-w`)
  - `button-icon.size: 44px` (= `target-min`)
  - `button-*.height: 48px` (= `spacing.12`)
  - `service-card.padding: 32px` (= `spacing.8`)
  - `divider.height: 1px` (= `rule-hairline`)

  The export to `_tokens.scss` then carries two sources for each value, which breaks constitution
  IV ("MUST NOT hard-code … spacing") (DESIGN frontmatter `components`). *Fix:* replace each
  literal with its `{spacing.*}` reference.
- **medium** The `header` token is `backgroundColor: '{colors.ink}'`, but the prose says the
  Header is transparent over the Hero at the top (only the condensed header is solid). A consumer
  extracting the token renders the wrong state. Two related gaps:
  - `spacing.header-h-lg` (80px) is wired to no component.
  - The Header contact CTA's "40px visual" height has no token, against the 48px button tokens.

  (DESIGN frontmatter `header`; Components › Header.) *Fix:* set `header.backgroundColor:
  transparent`, add `header-lg` with `{spacing.header-h-lg}`, and add a `button-header-cta` token
  (or drop the 40px exception).
- **medium** The export contract to the constitution's two token files is undefined. The
  frontmatter comment says the extension keys are "exported by hand" under `--kva-*`, but it gives
  no prefix or name map for colors, typography, spacing, rounded, and components. It also doesn't
  say whether DESIGN.md or `design-tokens.json` wins (the constitution makes `src/app/core/schemas/`
  the source of truth) (DESIGN frontmatter comment). *Fix:* add a short "Token export" note: the
  name map (`colors.ink` → `--kva-color-ink` / `color.ink`), how `-lg` responsive pairs map, and
  the precedence rule (DESIGN.md is the design source; the JSON is generated from it, never
  hand-edited).
- **low** Several visual values in Components prose have no token:
  - Hero min-height `100svh`, max 880px
  - Logo sizes 24/32/40/200px
  - Carousel thumbnails 64px, Mobile menu rows 56px, photo band 240px
  - Icon 24px with a 1.5px stroke
  - Nav underline 2px
  - Card hover scale 1.03, pressed `translateY(1px)`
  - Copy status duration 2.5s (EXPERIENCE)

  (DESIGN › Components, Shapes.) *Fix:* add `size.*` / `motion.*` entries, or component-token
  properties, for each.
- **low** Several component tokens use `backgroundColor` for a stroke color (`focus-ring`,
  `text-field-outline`, `divider`, `divider-on-dark`). A mechanical consumer will emit a
  background (DESIGN frontmatter `components`). *Fix:* use `borderColor` / `outlineColor`, or
  state the convention once in Components.

## 3. Component coverage — adequate

Checked: 23 named components (Header, Mobile menu, Hero, Section heading, Service card, Project
filter, Project card, Badge (Ejemplo Ilustrativo), Project detail view, Project carousel, Nosotros,
Trust section, Contact section, WhatsApp CTA, Copy status, Contact composer, Privacy notice, Form
field, Buttons, Focus ring, Scrim, Skip link, Footer). Each appears in both DESIGN › Components and
EXPERIENCE › Component Patterns, with real rules on both sides and identical names.

### Findings
- **medium** Interactive state visuals are missing for most controls. Only `button-primary` and
  `button-primary-on-light` have hover tokens. The rest have no hover or pressed spec:
  `button-secondary`, `button-ghost-on-dark` (also the WhatsApp CTA), `filter-chip` (inactive
  hover), header nav links, and footer links. `button-icon` has no colors at all, yet it sits on
  `paper` (carousel arrows, close buttons) and on `ink-2` (copy button) (DESIGN › Components ›
  Buttons; frontmatter `button-icon`, `filter-chip`). *Fix:* add `-hover` tokens per variant, plus
  `button-icon` and `button-icon-on-dark` color pairs, and one line on nav and footer link hover.
- **medium** Sub-controls that EXPERIENCE uses have no visual spec in DESIGN:
  - The Service list toggle ("Ver los {n} servicios" / "Ver menos")
  - The empty-filter "Ver todos" button
  - The filter result count: is it visible or live-only? The key-projects mock-up shows a visible
    "9 proyectos", while EXPERIENCE only calls it a live region.
  - The Menu button
  - The post-submit actions "Copiar correo · Editar datos · Cerrar" (which button variants?)
  - Checkbox and Select (prose only, no tokens)

  (DESIGN › Components; EXPERIENCE › Voice and Tone UI strings, Component Patterns.) *Fix:* name
  a button variant or token for each, and decide whether the count is visible (if so, `small`
  `muted`).
- **low** Copy status has a token only for the dark surface (`copy-status`: `ink-2`/`paper`), but
  the prose says it uses "`success` on light" inside the composer. Note that `success` on `ink-2`
  is 2.83:1, so a single shared token invites a failing combination (DESIGN › Components › Copy
  status). *Fix:* add a `copy-status-on-light` token (`paper` / `success`), and state that
  `success` is never used on dark surfaces.

## 4. State coverage — adequate

Checked every IA surface for cold load, image loading and failure, empty, filtered, hidden, focus,
error, offline, no-JS, reduced motion, and the placeholder state. The table is strong: Hero LCP,
the Composer lifecycle, Copy success and failure, conditional hiding of Trust, Clientes, Projects,
and WhatsApp, and offline handling. Permission-denied doesn't apply.

### Findings
- **medium** Overlays push a history entry on open, but the spine never says what happens to that
  entry when the overlay closes by Esc, the close button, scrim click, or a menu link choice. If
  the entry is left in place, the next Back press does nothing visible, or fights the anchor
  `replaceState`. The behaviour models will differ by implementer (EXPERIENCE › Interaction
  Primitives › Overlays; Component Patterns › Mobile menu). *Fix:* "Non-Back closes consume their
  entry (`history.back()`, guarded); a menu link choice consumes it, then applies the anchor
  `replaceState`."
- **medium** Scroll reveal is "applied only after hydration". The prerendered content is visible
  first, so applying hidden reveal styles at hydration makes in-viewport content flash, and it
  risks CLS and LCP if the Hero is included (EXPERIENCE › Interaction Primitives › Scroll reveal;
  State Patterns › Page cold load). *Fix:* exclude the Hero and any element already in the viewport
  at hydration. Reveal applies only to elements below the fold at hydration, and is never a hidden
  initial state in the prerendered CSS.
- **low** In the no-JS state on mobile, links collapse behind a JS menu button below 768px, and the
  "Page | No JavaScript" row doesn't say how a Visitor reaches the section links (EXPERIENCE ›
  State Patterns). *Fix:* the no-JS menu button is a `#menu` `:target` link (like the Privacy
  notice), or the links render inline without JS.
- **low** Two composer states are ambiguous:
  - Reopening the composer after the Submitted state: does it show the post-submit view or the
    filled form?
  - The Header CTA "opens … with no Service pre-selected", but the Reopened state restores the
    previous values.

  (EXPERIENCE › Component Patterns › Header, Contact composer; State Patterns › Composer.) *Fix:*
  add one row for "Reopened after submit" and reconcile the Header CTA wording ("does not
  pre-select; keeps any previous choice").
- **low** Three content states have no row:
  - The Nosotros doc is absent or empty (hide the section and its header link, like Confianza?).
  - The site doc lacks the contact name, phones, or proyectos2@ (override 3).
  - A carousel photo is loading or fails (only Project card image states exist).

  (EXPERIENCE › State Patterns.) *Fix:* add the three rows.

## 5. Visual reference coverage — adequate

Checked: `imports/` holds `brochure-text.md`, `kva-logo.png`, and `brochure-pages/p01…p18.png`,
and all 20 are linked from DESIGN › Brand & Style with what they illustrate. `brochure-text.md`
is also linked from EXPERIENCE › IA. `mockups/` and `wireframes/` don't exist yet. The pending key
screens are `.working/key-landing.html`, `key-projects.html`, and `key-contact.html`. There are no
orphans in `imports/`.

### Findings
- **medium** The three pending key screens are unreferenced. Once they're promoted to `mockups/`,
  nothing in the spines points to them. They also carry spine-absent content that would become de
  facto spec:
  - Hero headline "Servicios integrales de instalaciones eléctricas" and its lead line
  - A drafted description for each Service card
  - Project card summaries
  - A visible "9 proyectos" count

  (EXPERIENCE › IA, Key Flows; DESIGN › Components.) *Fix:* on promotion, add "→ Composition
  reference: `mockups/key-landing.html` (IA order, Reference viewport), `key-projects.html` (Flow 2
  steps 1–3), `key-contact.html` (Flow 1 steps 5–7)" under EXPERIENCE › IA and the relevant Flows.
  Then either lift the drafted copy into Voice and Tone as default copy, or caption it
  "illustrative copy" in the mocks.
- **low** The DESIGN reference list labels p13–p17 "Carousel", but those pages are photo collages.
  The label misnames what they illustrate (the dropped collage itself is reconcile-brochure #3)
  (DESIGN › Brand & Style reference list). *Fix:* relabel them "Gallery collage" and cite them as
  the bar-heading source only.
- **low** References are collected in one list. Components cite pages as bare text ("(p05)",
  "(p02)", "(p09)") rather than links, and EXPERIENCE links no page at the relevant section (for
  example Contact section → p18, Trust → p09) (DESIGN › Components; EXPERIENCE › Component
  Patterns). *Fix:* turn the inline page mentions into links.
- **low** "The spines win on any conflict" is stated twice (DESIGN › Brand & Style, EXPERIENCE ›
  Foundation). *Fix:* keep it once, in EXPERIENCE › Foundation, and have DESIGN point to it.

## 6. Bloat & overspecification — adequate

Both spines are dense but mostly decision-bearing: tables are used where they work, there's little
narrative, and the DESIGN prose carries the editorial voice appropriately. The Requirement Trace,
the Default UI strings table (FR-15), and the Imagery & assets table all earn their place.

### Findings
- **low** EXPERIENCE › Assumptions restates 12 inline `[ASSUMPTION]` tags in different words, which
  creates two places to update. *Fix:* turn it into a pointer index ("§ Component Patterns ›
  Service card"), or drop it and keep the inline tags.
- **low** DESIGN › Do's and Don'ts row "The brand written 'kVA'" is a copy rule, already in
  EXPERIENCE › Voice and Tone. *Fix:* drop it from DESIGN, which should keep visual rules only.
- **low** EXPERIENCE › IA's "Services at launch" and "Projects at launch" tables are content data.
  They create a second source beside the Content docs (FR-15: Content docs are the single source of
  truth). *Fix:* caption them "launch seed for Content docs; Content docs win after creation".

## 7. Inheritance discipline — adequate

Checked:
- `sources` resolve: 5 of 5.
- UJ titles are verbatim.
- PRD Glossary terms are used verbatim (Header contact CTA, Copy-address fallback, Reference
  viewport, and others).
- Component names are identical across both spines.
- All EXPERIENCE token references resolve to DESIGN tokens by name.
- Memlog overrides are carried and flagged in EXPERIENCE › Foundation.

### Findings
- **high** The Contact section shows proyectos1@ and proyectos2@ as plain `mailto:` links, and the
  footer links both emails. Neither carries the Lead subject tag; only the no-JS fallback is stated
  to carry it. FR-13 requires that "the subject always starts with" `[kvainstalaciones.mx]` for
  every email generated by the page. SM-1, the primary metric, counts Leads by that tag. These are
  the most visible email paths on the page (EXPERIENCE › Component Patterns › Contact section,
  Footer; Voice and Tone UI strings). *Fix:* every page-generated `mailto:` (Contact section,
  footer, no-JS) uses `?subject=[kvainstalaciones.mx]%20Contacto` (add a UI string for the
  untagged-Service subject). Keep the copy control as the only untagged path. The proyectos2@
  question stays in Open Question 9.
- **high** EXPERIENCE › Foundation claims that "Every user action below has a behaviour model … the
  ten addendum models plus `service-card-disclosure` and `project-carousel`". That claim is false
  for two override-3 actions: tapping a phone `tel:` link (Contact section, footer) and opening a
  direct email `mailto:` link. Neither has a model. Constitution II is NON-NEGOTIABLE, so their
  stories can't enter Act. No component → model-id map exists either, so story writers must infer
  one (EXPERIENCE › Foundation; Component Patterns). *Fix:* add a `contact-channels` model (`tel:`
  and direct `mailto:` hand-off) or extend `copy-address`. Also add a column or line per Component
  Pattern naming its model id.
- **low** State Patterns and Interaction Primitives shorten component names ("Composer",
  "Carousel", "Copy", "Filter chips", "Disclosure", "Overlays") where the canonical names are
  Contact composer, Project carousel, Copy status, Project filter, and Service list toggle
  (EXPERIENCE › State Patterns, Interaction Primitives). *Fix:* use the canonical names.
- **low** New terms are used as if defined but appear in no glossary: Project carousel, Copy
  status, Nosotros, and Clientes entry. A Clientes entry is a new content entity with its own
  permission rule (EXPERIENCE › Component Patterns › Trust section). *Fix:* add a four-line "Spine
  terms" block to EXPERIENCE › Foundation, pending the PRD glossary update (Open Question 1).
- **low** The Header transparency threshold differs between the spines: DESIGN says "at scroll 0",
  EXPERIENCE says "≤ 24px" (DESIGN › Components › Header; EXPERIENCE › Component Patterns ›
  Header). *Fix:* use "≤ 24px" in both, or add a `motion`/`spacing` token.

## 8. Shape fit — strong

DESIGN.md sections appear in canonical order (Brand & Style → Colors → Typography → Layout &
Spacing → Elevation & Depth → Shapes → Components → Do's and Don'ts), with an "Imagery & assets"
sub-section that earns its place. EXPERIENCE.md has every required default:
- Foundation, IA, Voice and Tone, Component Patterns, State Patterns, Interaction Primitives,
  Accessibility Floor, and Key Flows.
- Responsive & Platform, triggered by 3 breakpoints.
- Inspiration & Anti-patterns, triggered by the brochure reference product.

The invented sections are Requirement Trace and Open Questions (both earn their place) and
Assumptions (see 6).

### Findings
- **low** Motion tokens and rules are buried in Elevation & Depth, which has no canonical Motion
  section, so a consumer looking for motion won't find it by heading (DESIGN › Elevation & Depth).
  *Fix:* give motion a bolded run-in label or sub-heading ("Motion") inside that section.
- **low** EXPERIENCE frontmatter has no `name` key (the examples carry `name`). DESIGN has
  `name: kVA Instalaciones` (EXPERIENCE frontmatter). *Fix:* add `name: kVA Instalaciones`.

## Mechanical notes

- **Frontmatter:** both spines parse as YAML. DESIGN has `name`, `description`, `version: alpha`,
  `status: draft`, and `sources`. EXPERIENCE lacks `name` (see 8). The non-schema DESIGN keys
  `elevation`, `motion`, and `breakpoints` are documented as constitution IV extensions.
- **Cross-refs:** 57 DESIGN and 12 EXPERIENCE `{group.token}` references all resolve. All 5
  `sources` resolve, as do all 28 cited repo assets: 5 backgrounds, 20 project photos, 2 logos, and
  `assets/media/icon.png`. `src/app/behaviors/` and `src/styles/` don't exist yet (expected before
  implementation).
- **Contrast:** all 21 ratios in DESIGN › Colors were recomputed; each matches to 2 decimals.
  Extra pairs checked: `success` on `ink-2` 2.83 (see 3), `accent` on `paper-2` 2.66 (already
  banned), and `line` on `paper` 1.47 (decorative only, so it's fine).
- **Name consistency:** component names match across both spines. Frontmatter keys are kebab-case
  forms of the prose names (`nosotros-panel` ↔ Nosotros, `badge-placeholder` ↔ Badge (Ejemplo
  Ilustrativo)). Short-name drift is noted in 7.
- **Mock-ups:** `.working/*.html` mirror the DESIGN hexes exactly. The non-token hexes in them are
  presentation-board chrome only, and each mock-up names its governing spine sections, but none is
  yet linked from the spines (see 5).
- **Mermaid:** none present.
- **Severity raise (reconcile-prd #5, heading levels skip `<h3>`): medium → high.** Lighthouse's
  `heading-order` audit fails on the skip, so SM-2 (Accessibility 100) can't pass as specified.
