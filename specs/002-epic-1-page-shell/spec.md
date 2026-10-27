# Feature Specification: Epic 1 — Branded Page Shell, Hero and Navigation

**Feature Branch**: `002-epic-1-page-shell`

**Created**: 2026-10-27

**Status**: Draft — US1 (Story 1.1) clarified and ready for Act; US2–US9 drafted

**Input**: BMAD Epic 1 in
[epics.md](../../_bmad-output/planning-artifacts/epics.md) (Stories 1.1–1.9). Constitution
v1.2.0 requires one spec-kit feature spec per epic, so this spec covers every Epic 1 story.

## Epic Summary

A Visitor lands on a kVA-branded page and understands within seconds who kVA is and whom it
serves. They can move to any section from a sticky header or a mobile menu, and reach kVA
through the Contact section and the footer. The epic also sets up the shared building blocks
every later epic uses: the design system, image pipeline, content facade and UI-strings
pattern.

### Story readiness

| Spec story | BMAD story | Title | Readiness |
|------------|------------|-------|-----------|
| US1 | 1.1 | Brand design tokens and component theme | Clarified, planned: ready for Act |
| US2 | 1.2 | Self-hosted fonts and icon set | Drafted |
| US3 | 1.3 | Content facade and UI strings | Drafted |
| US4 | 1.4 | Image derivative pipeline and shared responsive image | Drafted |
| US5 | 1.5 | Footer with direct contact links and in-page privacy notice | Drafted; blocked by behaviour-model shape conflict |
| US6 | 1.6 | Contact section with direct links and copy-address fallback | Drafted; blocked by behaviour-model shape conflict |
| US7 | 1.7 | Hero section | Drafted |
| US8 | 1.8 | Sticky header and section navigation | Drafted; blocked by behaviour-model shape conflict |
| US9 | 1.9 | Mobile menu | Drafted; blocked by behaviour-model shape conflict |

A drafted story MUST be clarified (`speckit-clarify`) and added to [plan.md](./plan.md)
(`speckit-plan`) before it enters Act. The BMAD story's Given/When/Then criteria in
`epics.md` are authoritative. The scenarios below restate them so they can be traced.

## Clarifications

### Session 2026-10-27

- Q: How should the token export read the DESIGN.md frontmatter (YAML)? → A: Add `yaml`
  (pinned) as an explicit devDependency, approved by Story 1.1. It is used at build and test
  time only.
- Q: Should Story 1.1's token export include the DESIGN.md `components` group? → A: Yes.
  Export all groups, including components, with token references resolved to custom
  properties.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Brand design tokens and component theme (Priority: P1) — BMAD 1.1

A Visitor sees a page that uses kVA's brochure colors and its square, flat visual language,
so the site reads as the same serious, engineered company as the printed brochure. A
technical editor can change a brand value in one design source and have every generated
style artifact follow, with an automated check that catches drift.

**Why this priority**: Every later story styles itself from these tokens and this theme.
Without them, components would hard-code values, which the constitution (§IV) forbids.

**Independent Test**: Run the token export and the unit tests. Check that both generated
token files match the design source, that the ready-made interface components use square
corners and copper only for actions and focus, and that the published build still passes the
static security check.

**Acceptance Scenarios**:

1. **Given** the design-source tokens (DESIGN.md frontmatter), **When** the token export
   runs, **Then** the stylesheet token file exposes every color, typography, spacing, rounded,
   elevation, motion, breakpoint and component token as a `--kva-<group>-<key>` custom
   property, and the machine-readable token file holds the same values (UX-DR1).
2. **Given** a generated token file edited by hand, or a design-source value changed without
   re-running the export, **When** the unit tests run, **Then** a test fails and names the
   drifting token.
3. **Given** a typography role with a `-lg` variant (for example `display` / `display-lg`),
   **When** the viewport is at least 1024 px wide, **Then** the same custom property switches
   to the `-lg` value, and below 1024 px it holds the base value.
4. **Given** the component library is added, **When** the production build runs, **Then** the
   bundle-size change is recorded against the NFR1 budgets in the story's implementation
   artifact before merge, and the initial bundle stays under the 1 MB error budget (AD-4).
5. **Given** the themed component library, **When** any themed control renders, **Then**
   corners are square (`rounded.none`), copper is used only for actions, focus, current
   navigation and the active filter, and no private library class is styled (UX-DR2).
6. **Given** the component library was added, **When** the served page is inspected,
   **Then** no remote font or icon link and no default prebuilt theme remains (AD-13).
7. **Given** the Pages build, **When** the static check runs, **Then** the Content Security
   Policy still matches AD-10 and no executable inline script is present.

---

### User Story 2 - Self-hosted fonts and icon set (Priority: P1) — BMAD 1.2

A Visitor sees kVA's brochure-like typefaces (Quicksand for titles, Outfit for body text) and
crisp icons, all loaded from kVA's own site, so the page looks right without telling third
parties about the visit.

**Independent Test**: Load the built page with network logging. Every font and icon request
goes to the site origin, and the components show icons by name.

**Acceptance Scenarios**:

1. **Given** the page loads, **When** fonts are requested, **Then** both families come from
   the site origin as latin-subset variable fonts (weights 300–600) that swap in, with
   metric-matched fallbacks; only Quicksand is preloaded; no third-party request is made
   (UX-DR3, AD-10).
2. **Given** a component requests an icon by name from the 24 px line set, **When** it
   renders, **Then** a self-hosted vector icon with a 1.5 px stroke appears and no icon font
   is loaded (UX-DR4).
3. **Given** the Pages build, **When** the static check runs, **Then** the CSP still matches
   AD-10 and no executable inline script is present.

---

### User Story 3 - Content facade and UI strings (Priority: P1) — BMAD 1.3

A technical editor at kVA changes any visible copy in one reviewed place, and no component
carries hard-coded text.

**Independent Test**: Validate the UI-strings content, ask the facade for formatted strings,
and run the template literal-text check.

**Acceptance Scenarios**:

1. **Given** the UI-strings content doc and its typed content, **When** they are validated,
   **Then** validation passes, and a missing or malformed string fails, naming the item and
   field (FR15, UX-DR27).
2. **Given** a UI string with placeholders, **When** a component asks for it with values,
   **Then** it gets the formatted string, and an unknown or missing value fails a test.
3. **Given** components need content, **When** they read it, **Then** they read only from the
   single content facade, which also exposes the list of visible sections (AD-3).
4. **Given** any component template, **When** the template check runs, **Then** it fails on a
   literal text node or a literal `aria-label`, `alt`, `title` or `placeholder` (FR15).
5. **Given** a production build, **When** it is inspected, **Then** validation code is absent.

---

### User Story 4 - Image derivative pipeline and shared responsive image (Priority: P2) — BMAD 1.4

A technical editor turns brochure originals into web-ready images with one command, and every
photo is shown through one shared component, so photos load fast and consistently.

**Independent Test**: Run the image command twice (second run changes nothing), check size
limits, and render the shared image component from content metadata.

**Acceptance Scenarios**:

1. **Given** the original images and a manifest, **When** the image command runs, **Then**
   modern-format and fallback files are written at the manifest widths with deterministic
   names, never upscaled, and re-running changes nothing (UX-DR5, AD-14).
2. **Given** a Hero output over 250 KB or a card photo over 120 KB at 2×, **When** the
   command runs, **Then** it fails.
3. **Given** content image metadata, **When** the shared image renders, **Then** it serves
   the modern formats with a fallback and intrinsic size. It loads lazily by default, or
   eagerly with high priority when marked priority, and always takes `alt` from content.
4. **Given** the white kVA logo, **When** the pipeline runs, **Then** header, footer, Hero
   and band logo sizes exist. Generated files are committed; the published build never
   regenerates them.

---

### User Story 5 - Footer with direct contact links and in-page privacy notice (Priority: P1) — BMAD 1.5

A Visitor reaches kVA directly from the footer (email, phone) and reads the privacy notice
from anywhere on the page, even without JavaScript.

**Independent Test**: With scripts disabled, check the footer links' targets and the jump to
the in-page privacy notice.

**Acceptance Scenarios**:

1. **Given** the extended site content, **When** it is validated, **Then** a missing email or
   an invalid Mexican phone fails, and no secondary address or number exists in content
   (FR20).
2. **Given** the contact-link builder, **When** it is tested, **Then** it produces the tagged
   email link and `tel:+525640003344` with every value encoded (AD-9, FR13).
3. **Given** the prerendered footer, **When** it is viewed, **Then** it shows the logo, the
   legal identity (or the "kVA Instalaciones" stand-in), the tagged email link, the phone
   link named "Llamar al (56) 4000 3344", "© {year} kVA Instalaciones" with the year from
   content, and "Aviso de privacidad". All links are at least 24 px tall and work without
   JavaScript (FR3, FR20, UX-DR26).
4. **Given** the Visitor activates "Aviso de privacidad", **When** the page responds,
   **Then** it jumps to the in-page notice section; invalid notice content fails validation
   (FR14, UX-DR24).

---

### User Story 6 - Contact section with direct links and copy-address fallback (Priority: P1) — BMAD 1.6

A general contractor sees kVA's contact person, email and phone and copies the email in one
action, so they can reach kVA from any tool, including webmail.

**Independent Test**: Copy the address with the clipboard allowed and with it denied, and
view the section with scripts disabled.

**Acceptance Scenarios**:

1. **Given** the page shell, **When** sections render, **Then** they follow the shared
   section rhythm and heading anchors with decorative corner rules (UX-DR6, UX-DR7, UX-DR11).
2. **Given** the prerendered Contact section, **When** it is viewed, **Then** it shows the
   title, the contact name, the tagged email and phone links, and a contact button that is a
   plain tagged email link. A missing name or phone is left out without leaving a gap
   (FR20, UX-DR21, UX-DR30).
3. **Given** scripts are enabled, **When** the Visitor copies the address, **Then** it is
   copied and "Copiado" is announced about 100 ms later and held for 2.5 s (FR12, UX-DR22).
4. **Given** the copy fails, **When** the Visitor activates copy, **Then** the address text
   is selected and the failure message is announced.
5. **Given** scripts are disabled, **When** the section renders, **Then** the copy button is
   hidden and the address stays visible.

---

### User Story 7 - Hero section (Priority: P1) — BMAD 1.7

A Visitor on a phone sees who kVA is, for whom, and how to get a quote on the first screen,
and can decide within seconds whether kVA fits.

**Independent Test**: Load the page at 360×640 and check that the required elements are
visible without scrolling.

**Acceptance Scenarios**:

1. **Given** the hero content, **When** the page is prerendered, **Then** it shows the
   overline, the headline (≤ 60 characters, the only top-level heading), the lead
   (≤ 120 characters), both CTAs and the proof point (FR4, UX-DR12).
2. **Given** a proof point that is not a recorded site fact, **When** content is validated,
   **Then** validation fails.
3. **Given** the 360×640 viewport, **When** the page loads, **Then** headline, lead, both
   CTAs, logo and proof point are visible without scrolling, and text reflows at 320 px.
4. **Given** the hero photo, **When** it loads, **Then** it is high priority and preloaded,
   with the dark ground showing while loading.
5. **Given** the Services section is not visible, **When** the Hero renders, **Then** the
   secondary CTA is not rendered.

---

### User Story 8 - Sticky header and section navigation (Priority: P1) — BMAD 1.8

A Visitor uses a header that stays visible to reach any section in one action, and can always
reach the quote CTA.

**Independent Test**: Scroll, activate each section link, and check focus, fragment and
current-link indication; with reduced motion, check that scrolling is instant.

**Acceptance Scenarios**:

1. **Given** the page shell, **When** it renders, **Then** the header shows the logo linking
   to the top, section links in order for visible sections only, and the contact CTA
   (FR1–FR3, UX-DR8).
2. **Given** any scroll position, **When** the Visitor scrolls, **Then** the header stays
   visible, turning solid after 24 px of scroll.
3. **Given** scripts are enabled, **When** a section link is activated, **Then** the page
   scrolls (instantly under reduced motion), focus moves to the section heading, the
   fragment updates without a new history entry, and the current link is marked (FR1).
4. **Given** the `section-navigation` behaviour model, **When** its tests run, **Then** every
   transition is covered (AD-7).
5. **Given** the Visitor presses Tab on page load, **When** focus lands, **Then** the skip link
   is first, visible, and moves focus to the main content (UX-DR9).

---

### User Story 9 - Mobile menu (Priority: P2) — BMAD 1.9

A Visitor on a phone or tablet opens a menu to reach any section.

**Independent Test**: Below 1024 px, open and close the menu with the button, Esc and Back,
choose a link, and check focus and history each time.

**Acceptance Scenarios**:

1. **Given** a viewport under 1024 px with scripts enabled, **When** the page renders,
   **Then** a "Menú" disclosure button replaces the inline links (UX-DR10).
2. **Given** the menu is closed, **When** it is opened, **Then** a full-height sheet shows
   the links and the contact CTA, the rest of the page is inert, focus is trapped, scrolling
   is locked, and one history entry is added (AD-5).
3. **Given** the menu is open, **When** the Visitor presses Esc, uses Back or activates the
   toggle, **Then** it closes, the history entry is consumed, and focus returns to the toggle.
4. **Given** the menu is open, **When** a section link is chosen, **Then** the menu closes
   and focus lands on the target section heading (FR1).
5. **Given** scripts are disabled, **When** the page renders under 1024 px, **Then** the
   section links show as a wrapped row (UX-DR30).
6. **Given** the `mobile-menu` behaviour model, **When** its tests run, **Then** every
   transition is covered (AD-7).

### Edge Cases

- **US1** — A design-source token that cannot be mapped (unknown group or a malformed value):
  the export fails and names the token rather than skipping it silently.
- **US1** — A component token that references another token (for example
  `'{colors.accent}'`): the export resolves it to the referenced token's custom property, and
  an unresolvable reference fails the export.
- **US1** — A `-lg` typography role with no base role: the export fails.
- **US1** — The component library adds remote font or icon links, or a prebuilt theme, during
  installation: they are removed, and the static check fails if a third-party origin
  reappears.
- **US1** — The bundle grows past the 500 kB warning budget: the cause is justified in the
  implementation artifact (constitution §VI). Past 1 MB, the build fails.
- **US3** — A UI string references a placeholder that no caller supplies: the test fails.
- **US5/US6** — A contact name or phone is missing: it is left out with no empty gap; a
  missing email fails validation.
- **US6** — The clipboard is unavailable or permission is denied: fall back to selecting the
  text and announcing the failure.
- **US8/US9** — A section has no content: its header link and menu link are not rendered,
  and no CTA points at it.
- **US9** — Back is pressed while the menu is open: the menu closes and the page does not
  navigate away.

## Requirements _(mandatory)_

### Functional Requirements

**US1 — Brand design tokens and component theme (BMAD 1.1)**

- **FR-001**: The design-source frontmatter in DESIGN.md MUST be the only hand-edited source
  of design tokens. The stylesheet token file (`src/styles/_tokens.scss`) and the
  machine-readable token file (`src/app/core/schemas/design-tokens.json`) MUST be generated
  from it by one repeatable command and MUST NOT be hand-edited (constitution §IV, UX-DR1).
- **FR-002**: The export MUST cover the color, typography, spacing, rounded, elevation,
  motion, breakpoint and component groups, following the name map recorded in DESIGN.md
  (for example `colors.ink` → `--kva-color-ink` / `color.ink`; breakpoints →
  `--kva-bp-*`).
- **FR-003**: Each `-lg` typography role MUST switch the same custom property to its `-lg`
  value at a viewport of 1024 px or wider.
- **FR-004**: Component tokens that reference other tokens MUST resolve to the referenced
  custom property. A component `height` MUST be exported as a minimum height. On stroke-only
  tokens, `backgroundColor` MUST be exported as the stroke color.
- **FR-005**: An automated unit test MUST fail when either generated file differs from what
  the export would produce from the current design source, and MUST name the first drifting
  token.
- **FR-006**: The export MUST be deterministic: running it twice on an unchanged source
  produces byte-identical files.
- **FR-007**: The ready-made component library (Angular Material and CDK 22.2.4, per AD-4)
  MUST be themed only through its supported theme and override mechanisms, fed by the token
  custom properties. Styling private library classes is forbidden.
- **FR-008**: Themed controls MUST have square corners. Copper (`accent`, `accent-strong` and
  their hover states) MUST be used only for actions, focus, current navigation and the
  active filter. `danger` and `success` MUST appear only on light surfaces.
- **FR-009**: Adding the library MUST leave no remote font link, remote icon link, or default
  prebuilt theme in the served page or global styles (AD-13).
- **FR-010**: The change in production bundle size from adding the library MUST be measured
  and recorded against the NFR1 budgets in the story's implementation artifact before merge.
  The initial bundle MUST stay under 1 MB, and any growth past the 500 kB warning MUST be
  justified.
- **FR-011**: The Pages build MUST keep the AD-10 Content Security Policy unchanged and MUST
  contain no executable inline script, as checked by the existing static check.
- **FR-012**: Global styles MUST consume the token custom properties for page color,
  background and type. No hard-coded color or spacing may be added in this story.

**US2–US9 (drafted; refine in their clarify pass)**

- **FR-013** (US2): Fonts and icons MUST be served from the site origin only, with no
  third-party request (UX-DR3, UX-DR4, AD-10).
- **FR-014** (US3): Every visible string MUST come from typed content through a single
  content facade. A test MUST reject literal template text and literal accessible-name
  attributes (FR15, AD-3).
- **FR-015** (US4): Every photo MUST be generated by one deterministic image command and
  rendered by one shared image component, within the per-image size limits (UX-DR5, AD-14).
- **FR-016** (US5): The footer MUST show the legal identity, tagged email, phone, year from
  content and privacy-notice link, all working without scripts (FR3, FR14, FR20).
- **FR-017** (US6): The Contact section MUST show the contact channels and a copy-address
  control with announced success or failure (FR12, FR20).
- **FR-018** (US7): The Hero MUST show the headline, lead, CTAs and a validated proof point
  within the 360×640 first screen (FR4).
- **FR-019** (US8): The header MUST stay visible, link only to visible sections, and move
  focus and update the fragment on navigation (FR1, FR2).
- **FR-020** (US9): Below 1024 px, a disclosure menu MUST provide the section links with the
  focus, inert and history rules of AD-5 (FR1).

### Key Entities

- **Design token**: a named design value (group, key, value) from the design source. Group is
  one of color, typography, spacing, rounded, elevation, motion, breakpoint or component. A
  typography token is a role with font family, size, weight, line height and optional letter
  spacing, plus an optional `-lg` variant. A component token is a set of properties whose
  values may reference other tokens.
- **Token export**: the two generated files (stylesheet custom properties and
  machine-readable JSON) derived from the design source. Their equality with a fresh export
  is the drift invariant.
- **Theme**: the mapping from token custom properties to the component library's supported
  theme and override settings.
- **Content doc / Executable content / Content facade** (US3+): defined in ARCHITECTURE-SPINE
  AD-2 and AD-3.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 100% of the design-source tokens in the in-scope groups appear in both
  generated files with identical values. A test proves this on every run.
- **SC-002**: Changing one brand color in the design source and re-running the export changes
  that color everywhere it appears on the page, with zero manual edits to style files.
- **SC-003**: Hand-editing either generated file makes the test suite fail within one run.
- **SC-004**: The initial production bundle stays under 1 MB after the component library is
  added, and the measured size change is recorded before merge.
- **SC-005**: The served page makes zero requests to third-party origins, and the static
  security check passes.
- **SC-006** (epic): On a 360×640 screen, a Visitor sees who kVA is, the proof point and a
  quote CTA without scrolling, and reaches any visible section in one action (US7–US9).
- **SC-007** (epic): Every Epic 1 page element works with scripts disabled, using links and
  in-page jumps (US5–US9).

## Assumptions

- DESIGN.md's frontmatter is the token source of truth, and its comment block defines the
  name map, `-lg` switching, `height` → minimum height, and stroke-color conventions.
- Component tokens are in scope for the US1 export (clarified 2026-10-27). DESIGN.md defines
  how to export them, the theme overrides need them, and exporting them now prevents later
  hard-coded values.
- The machine-readable token file lives at `src/app/core/schemas/design-tokens.json`
  (constitution §IV), which resolves readiness finding 4.
- The export reads DESIGN.md with the `yaml` package, a pinned devDependency approved by this
  story (clarified 2026-10-27), at build/test time only. Nothing in the browser bundle parses
  DESIGN.md (Markdown is never loaded by the app, AD-2).
- The existing static check (`npm run verify:static`) and Pages build from `specs/001` are
  the baseline and stay green.
- Fonts (US2) are out of scope for US1. The theme refers to the token font families. Until
  US2 lands, the browser shows the metric fallbacks.
- Behaviour models: US1–US4 and US7 introduce none. US5 (`direct-contact-links`), US6
  (`copy-address`), US8 (`section-navigation`) and US9 (`mobile-menu`) each introduce one,
  and stay blocked until the behaviour-model shape conflict (constitution §II vs AD-7) is
  resolved.
