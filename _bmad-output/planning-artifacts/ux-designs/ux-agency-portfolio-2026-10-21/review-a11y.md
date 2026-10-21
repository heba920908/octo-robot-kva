---
title: "Accessibility review: kVA UX spines (WCAG 2.2 AA, WAI-ARIA APG)"
created: 2026-10-21
reviewed: DESIGN.md, EXPERIENCE.md, .memlog.md, reconcile-prd.md, .working/key-landing.html, .working/key-projects.html, .working/key-contact.html
target: Angular SPA (prerendered), Angular CDK a11y (FocusTrap, LiveAnnouncer, Dialog/Overlay)
---

# Accessibility review: kVA spines

**Verdict: changes required before build.** There are no critical findings. Four high
findings need spine edits: dark focus-ring contrast over photos, focus loss when the
composer is submitted, fixed heights and `nowrap` breaking reflow and text spacing, and
contradictory mobile-menu modal semantics. The rest of the floor is solid: landmarks, one
`<h1>`, `aria-pressed` chips with a live count, no autoplay, a swipe alternative,
`aria-invalid` + `aria-describedby`, Spanish names, `tel:`/`mailto:` names, reduced motion,
and reveals that run only after hydration.

**Counts: critical 0 · high 4 · medium 14 · low 15** (33 findings).

Method: the WCAG 2.x relative-luminance formula, run on the DESIGN hexes. The overlay is
`ink` #1C1714 at α 0.78. Its worst case is a #FFFFFF photo pixel, which gives **#4E4A48**;
its best case is #000000, which gives #161210. I also sampled the five background JPEGs in
`assets/media/brochure/backgrounds/`. **All five contain near-pure white pixels** (Lmax
0.985–1.000; cover 99.9th-percentile L = 0.924), so the worst case is real, not theoretical.

## Computed contrast table

| Foreground | Background | Ratio | Need | Result | Where used |
|---|---|---|---|---|---|
| `paper` #FFFFFF | `ink` #1C1714 | 17.77 | 4.5 | pass | Text on dark |
| `paper` | `ink-2` #2A2522 | 15.15 | 4.5 | pass | Contacto content, copy status |
| `paper` | overlay worst #4E4A48 | 8.76 | 4.5 | pass | Hero, Nosotros, Confianza, Contacto titles, transparent header nav |
| `paper` | overlay best #161210 | 18.62 | 4.5 | pass | ″ |
| `accent` #C8875A (focus ring, nav underline) | overlay worst #4E4A48 | **2.95** | 3.0 | **FAIL** | Focus on Hero CTAs, transparent header, skip link, headings on photo panels (H1) |
| `accent` | overlay best #161210 | 6.27 | 3.0 | pass | ″ |
| `accent-hover` #D9A07A (proposed `focus`) | overlay worst #4E4A48 | **3.86** | 3.0 | pass | Fix for H1 |
| `accent-hover` | `ink` / `ink-2` | 7.83 / 6.68 | 3.0 | pass | Fix for H1 |
| `muted-on-dark` #A39B94 | overlay worst | 3.20 | 4.5 | fail (banned in spine, correctly) | — |
| `accent` | `ink` / `ink-2` | 5.98 / 5.10 | 3.0 / 4.5 | pass | Focus, thumbnails, corner arm |
| `on-accent` #1C1714 | `accent` / `accent-hover` | 5.98 / 7.83 | 4.5 | pass | Primary CTA, skip link |
| `on-accent-strong` #FFFFFF | `accent-strong` #8A5430 / hover #6F4326 | 6.19 / 8.38 | 4.5 | pass | Light CTA, active chip, checked box |
| `accent-strong` | `paper` / `paper-2` | 6.19 / 5.55 | 4.5 / 3.0 | pass | Links, focus on light, active chip vs ground |
| `accent-strong` | `ink` / `ink-2` | 2.87 / 2.45 | 3.0 | fail (not used there; keep it that way) | — |
| `accent-strong` | overlay worst / best | 1.41 / 3.01 | 3.0 | fail | Focus ring over untinted photos (M3) |
| `accent` | `paper` / `paper-2` | 2.97 / 2.66 | 3.0 | fail (banned in spine, correctly) | — |
| `muted` #6B635D | `paper` / `paper-2` | 5.89 / 5.27 | 4.5 / 3.0 | pass | Secondary text, field, chip, and checkbox borders |
| `muted-on-dark` | `ink` / `ink-2` | 6.49 / 5.54 | 4.5 | pass | Footer text |
| `ink` | `paper` / `paper-2` | 17.77 / 15.91 | 4.5 | pass | Body |
| `danger` #B42318 | `paper` / `paper-2` | 6.57 / 5.89 | 4.5 / 3.0 | pass | Error text, border, icon |
| `success` #1E7A46 | `paper` / `paper-2` | 5.35 / 4.79 | 4.5 | pass | Post-submit, "Copiado" on light |
| `success` / `danger` | `ink-2` | 2.83 / 2.30 | 4.5 | fail | Must never be used on dark (L14) |
| `paper` (ghost border) | `ink` fill / overlay worst | 17.77 / 8.76 | 3.0 | pass | `button-ghost-on-dark` |
| `line` #D9D4CF / `line-on-dark` #4A433E | `paper` / `ink` | 1.47 / 1.83 | — | n/a (decorative only; spine forbids them as field borders) | Dividers |
| `paper` | `paper-2` | 1.12 | — | n/a (chip boundary comes from the 1px `border`) | Inactive chip fill |

The ratios in DESIGN › Colors are reproduced exactly. Only the focus-ring row and the
untinted-photo ring row fail where they are used.

Overlay α that `accent` would need to reach 3:1 against a white pixel: 0.80 → 3.19 (marginal)
and 0.86 → 3.95. Fix H1 is preferred because it changes no imagery.

---

## High

### H1. Copper focus ring fails 3:1 over darkened photos (verifies reconcile-prd A2)
- **SC:** 1.4.11 Non-text Contrast; 2.4.7 Focus Visible (support).
- **Location:** DESIGN.md L23 (`focus: '#C8875A'`), L295–297 (Header: current-section
  underline in `accent`, transparent over the Hero), L343 (Focus ring), L344 (Skip link).
  EXPERIENCE.md L160–163, L285. Mock `key-landing.html` L125 (`.is-focus`) and L136 (nav
  underline), on the Hero CTAs (L284–285), header links and CTA (L257–260), and the
  photo-panel `<h2 tabindex="-1">` (L395, L445).
- **Problem:** The dark-surface ring is `accent` #C8875A. On photo + overlay it measures
  **2.95:1** against #4E4A48, which is the overlay over a white pixel. That pixel is present
  in all five shipped backgrounds. The affected targets are the skip link, the transparent
  header's logo, nav links and CTA, both Hero CTAs, and the programmatically focused
  Nosotros, Confianza, and Contacto headings. All of these sit on photo + overlay.
- **Fix:** Change `colors.focus` from `#C8875A` to **`#D9A07A`**, the existing
  `accent-hover` value, so no new hue is introduced. The ratios are **3.86** on the overlay
  worst case, 8.21 on its best case, 7.83 on `ink`, and 6.68 on `ink-2`. That is ≥ 3:1 on
  every dark surface, and the copper identity stays. Also:
  - Point the current-nav underline (`aria-current="location"`) at the same token.
  - Update the DESIGN contrast table: replace the row "`accent` on `ink`/`ink-2` … Focus
    ring" with "`focus` #D9A07A on `ink`/`ink-2`/overlay-worst 7.83/6.68/3.86".
  - Add the rule: *"Rings on dark or photo surfaces always use `focus`; never use
    `accent` for focus."*
  - Alternative: use `paper` for the ring on photo surfaces only (8.76), keeping the copper
    `accent` ring on solid ink.
- **Severity:** high.

### H2. Composer submit replaces the form, so focus is lost inside a modal
- **SC:** 2.4.3 Focus Order; 4.1.3 Status Messages; 3.2.2 On Input (context).
- **Location:** EXPERIENCE.md L199–204 (Contact composer), L245 (Composer | Submitted).
  DESIGN.md L331–334. Mock `key-contact.html` L340–352: the post-submit heading is a `<p>`.
- **Problem:** Focus sits on "Abrir mi correo" when the user submits. The `mailto:` handoff
  then removes the `<form>`, so the focused node is destroyed and focus falls to `<body>`.
  That puts focus outside the CDK focus trap, behind an `inert` page. Screen-reader users
  never hear "Abrimos tu app de correo" or the FR-12 fallback, which is the critical
  recovery path when no mail app is set up. The spine also gives no focus target for
  "Editar datos" or for the post-submit "Cerrar".
- **Fix:** Add a rule to EXPERIENCE › Contact composer:
  1. On submit success, render the post-submit state, then move focus to its heading:
     `<h3 id="cmp-done" tabindex="-1">Abrimos tu app de correo</h3>`. Set
     `aria-describedby` on the heading to the FR-12 sentence so both are read.
  2. "Editar datos" restores the form and focuses the email field.
  3. The post-submit "Cerrar" behaves like the ✕ button and returns focus to the invoker.
  4. Make the success heading a real heading, not a `<p>`, and do not rely on a live region
     for it, because focus already carries the announcement.
- **Severity:** high.

### H3. Fixed heights and `nowrap` break reflow at 320 px and text spacing
- **SC:** 1.4.10 Reflow; 1.4.12 Text Spacing; 1.4.4 Resize Text.
- **Location:** DESIGN.md front matter L79–112 (`button-*: height: 48px`,
  `filter-chip: height: 44px`, `text-field: height: 48px`), L300 (Hero "min-height 100svh
  (max 880px)"), L265 (240px photo band). Mocks: `.btn{height:48px;white-space:nowrap}`
  (all three files, L117), `.chip{height:44px}`, `.vp-m .split-photo{height:240px}` with
  absolutely positioned titles (`.nos-title`, `.ct-title`), `.dlg{height:810px}` +
  `.det{overflow:hidden}` (projects L193, L205), and `.notice-body{overflow:hidden}`
  (contact L219).
- **Problem:**
  - At 320 CSS px the content box is 280 px. "COTIZA UN PROYECTO SIMILAR" is 26 chars of
    14px/600 uppercase at +0.08em plus 48px padding, about 320 px, so it overflows
    horizontally. The chip "PUESTA EN MARCHA Y VALIDACIONES" (about 330 px plus padding)
    must wrap, but a fixed `height:44px` clips the second line.
  - With the 1.4.12 overrides (letter 0.12em, word 0.16em, line-height 1.5), every
    `nowrap` label grows by 10–20 %.
  - The Hero `max 880px` with `overflow:hidden`, and the 240px bands with absolutely placed
    titles, clip text at 200 % text-only zoom.
  - The dialog and notice bodies use `overflow:hidden`, so content is cut off rather than
    scrolled.
- **Fix:**
  - Component tokens use **`min-height`**, not `height`. In DESIGN, rename the keys to
    `minHeight: 48px` / `44px`, or add a note that `height` exports as `min-height`.
  - Buttons and chips: `white-space: normal; text-wrap: balance; padding-block: 12px`.
  - Hero: `min-height: min(100svh, 880px); height: auto` (no `max-height`, no
    `overflow:hidden` on the text container).
  - Photo bands: `min-height: 240px`, with the title in normal flow (grid
    `align-content: end`), not absolutely positioned.
  - Dialog and notice bodies: `overflow-y: auto`. Give the scroll container `tabindex="0"`,
    `role="region"`, and `aria-labelledby` set to the title, so keyboard users can scroll it
    (2.1.1).
  - Add an acceptance check to EXPERIENCE › Accessibility Floor: *"320 px and the
    text-spacing bookmarklet: no clipped or overlapping text, no horizontal scroll."*
- **Severity:** high.

### H4. Mobile menu is called both a focus-trapping overlay (`role="dialog"`) and a toggle outside it
- **SC:** 4.1.2 Name, Role, Value; 2.4.3 Focus Order; 2.1.2 No Keyboard Trap.
- **Location:** EXPERIENCE.md L164–167 (Mobile menu: traps focus, toggle `aria-expanded`),
  L224 (page `inert`), L261–265 (Overlays get dialog semantics) and L291 (Accessibility
  Floor: overlays are `role="dialog"` + `aria-modal`). DESIGN.md L298.
- **Problem:** The menu button that closes the menu lives in the header, outside the sheet.
  - If the sheet is `role="dialog" aria-modal="true"` with a CDK focus trap, the toggle
    ("Cerrar menú") is outside the trap and hidden by `aria-modal`. Keyboard and
    screen-reader users can then close it only with Esc.
  - If "page `inert`" includes the header, the toggle itself becomes inert.
  - The toggle also changes both its name ("Abrir/Cerrar menú") and `aria-expanded`, which
    double-announces its state.
- **Fix:** Use the **APG disclosure-navigation pattern** rather than a dialog:
  - `<button aria-expanded aria-controls="menu-movil">Menú</button>` with a constant name,
    so the state comes from `aria-expanded` only.
  - `<nav id="menu-movil" aria-label="Secciones">` in the header.
  - While open, set `inert` on `<main>` and `<footer>` **only**, not on the header. Wrap
    the CDK `cdkTrapFocus` around **header + sheet**, so the toggle stays in the Tab cycle.
    Esc and Back close the menu and return focus to the toggle.
  - Remove the mobile menu from the "Overlays: `role=dialog`" rule in the Accessibility
    Floor.
  - If the team prefers a dialog, the sheet must contain its own first-focusable "Cerrar
    menú" button, and the header toggle is hidden while the dialog is open.
- **Severity:** high.

---

## Medium

### M1. Focus not obscured: no root `scroll-padding` value
- **SC:** 2.4.11 Focus Not Obscured (Minimum).
- **Location:** DESIGN.md L251 (only `scroll-margin-top` on anchored headings). EXPERIENCE.md
  L285–287 (mentions `scroll-padding` with no value). Contact mock L220 (sticky
  `.notice-bar`).
- **Problem:** Shift+Tab scrolls the focused element to the top edge of the viewport. The
  56–80px sticky header can then fully cover a 48px CTA or a 44px chip. `scroll-margin-top`
  on headings does not help Tab navigation. The Privacy notice's sticky "Cerrar" bar
  (about 80px) can cover links at the bottom of the notice.
- **Fix:** Add tokens and rules:
  - `html { scroll-padding-top: calc(var(--kva-header-h-current) + 16px) }`, updated when
    the header condenses (80 → 56) or set to the max (96px).
  - Notice scroll container:
    `scroll-padding-bottom: calc(<bar height> + 16px)` (about 96px).
  - Under 400px viewport height (landscape phones, 400 % zoom), keep the header at 56px or
    less. This satisfies FR-2 without covering more than 25 % of the viewport.
- **Severity:** medium.

### M2. Thumbnail "current" and "focused" look identical
- **SC:** 2.4.7 Focus Visible; 1.4.1 Use of Color.
- **Location:** DESIGN.md L318–320 (current thumbnail outlined 2px `accent`), L343 (ring
  2px + 2px offset). `key-projects.html` L203 (`.thumb[aria-current]` outline =
  focus-ring style).
- **Problem:** When focus moves to a non-current thumbnail, two thumbnails show the same
  2px copper outline. The user cannot tell which one has focus.
- **Fix:** Show current with a **4px `paper` bar under the thumbnail plus 100 % opacity**,
  and show non-current thumbnails at 64 % opacity. Keep the ring (`focus`, 2px + 2px offset)
  for focus only. Keep `aria-current="true"`.
- **Severity:** medium.

### M3. Focus ring over untinted project photos (carousel arrows, mobile close)
- **SC:** 1.4.11 Non-text Contrast.
- **Location:** DESIGN.md L318 (arrows on paper squares at photo edges).
  `key-projects.html` L289 (`.car-arrow.is-focus`), L321 (mobile `.det-close` over photo).
- **Problem:** A 2px offset ring sits on arbitrary photo pixels. Both copper tokens can fall
  to about 1:1 against a mid-brown photo, and `accent-strong` is 1.41 on dark areas.
- **Fix:** Controls on paper squares over photos use an **inset ring that is always drawn on
  paper**: `outline: 2px solid var(--focus-on-light); outline-offset: -5px` (6.19:1 against
  `paper`). Alternatively, use the two-tone technique C40:
  `outline: 2px solid #1C1714; box-shadow: 0 0 0 4px #FFFFFF`. Add this as
  `focus-ring-on-photo` in DESIGN › Components.
- **Severity:** medium.

### M4. Carousel slide change announces the position only, not the photo
- **SC:** 4.1.3 Status Messages; 1.1.1 Non-text Content (in practice).
- **Location:** EXPERIENCE.md L188–191, L292. `key-projects.html` L285–290 (slide group
  `aria-label="Foto 2 de 4"`, plus a separate `aria-live` counter, with the arrows *inside*
  the slide group).
- **Problem:**
  - Pressing "Foto siguiente" announces "Foto 3 de 4" while focus stays on the arrow. The
    new photo's `alt` is never read, so screen-reader users step through blank slides.
  - The arrows are nested inside the `aria-roledescription="foto"` group. APG keeps the
    controls outside the slides.
  - ←/→ are bound to the whole dialog, so a press while focus is on the CTA changes the
    photo silently.
- **Fix:**
  - Use the APG carousel pattern without rotation. The `region`
    (`aria-roledescription="carrusel"`, `aria-label="Fotos de {title}"`) contains the
    controls and a slides container with `aria-live="polite"` and `aria-atomic="false"`.
    Each slide is `role="group"` with `aria-roledescription="foto"` and
    `aria-label="{i} de {n}"`, and holds the `<img alt>`.
  - Move the arrows and thumbnails out of the slide group.
  - Alternatively, keep the counter as the only live region with the text
    "Foto {i} de {n}: {alt}", announced through CDK `LiveAnnouncer` (polite).
  - Scope the ←/→ handler to focus within the carousel region, not the whole dialog.
  - Set `touch-action: pan-y` on the stage so a swipe does not block vertical scrolling.
  - Add the string "Foto {i} de {n}: {alt}" to the default UI strings.
- **Severity:** medium.

### M5. Project detail view: initial focus not specified, and Close sits last in DOM order
- **SC:** 2.4.3 Focus Order.
- **Location:** EXPERIENCE.md L182–187 (only the composer defines initial focus).
  `key-projects.html` L283–312 (close button after the carousel controls and four
  thumbnails). L320 (mobile close inside the slide group).
- **Problem:** Without a rule, the CDK default focuses the first tabbable element, "Foto
  anterior". Screen-reader users land mid-carousel without hearing the title or the scope.
  Keyboard users must tab through 2 arrows and 4 thumbnails to reach Close.
- **Fix:** In DOM order, put Close first (top-right), then the title block, then the
  carousel, then the details. On open, focus the **dialog title**
  (`<h2 tabindex="-1">`, matching CDK `autoFocus: 'first-heading'`, or set it manually).
  Add the rule to EXPERIENCE › Project detail view.
- **Severity:** medium.

### M6. Project card is a `<button>` wrapping a heading, image, and summary
- **SC:** 1.3.1 Info and Relationships; 4.1.2 Name, Role, Value; 2.5.3 Label in Name.
- **Location:** EXPERIENCE.md L178–180 ("whole card is one button named by its title").
  DESIGN.md L233 (Project titles `<h3>`). Mocks: `key-landing.html` L360–370 and
  `key-projects.html` L271–277 (`<button class="pcard">` containing the `img alt`, the
  overline, the title, and the summary).
- **Problem:**
  - `<button>` children are presentational, so the `<h3>` the spine promises cannot exist
    and Proyectos has no navigable headings.
  - The computed name is about 25 words: the img alt, then Service, then title, then
    summary. Example: "Instalación eléctrica del proyecto Red Ambiental Instalaciones
    Red Ambiental Adecuación…".
  - Only the Placeholder inset sets an `aria-label`, which is inconsistent.
- **Fix:** Use the card pattern:
  `<article><h3><button type="button" aria-haspopup="dialog" aria-describedby="p-{id}-svc p-{id}-sum">{title}</button></h3>…</article>`.
  - Stretch the click area with `button::after{content:"";position:absolute;inset:0}`.
  - Card photos get `alt=""`, because the detail view carries the descriptive alt.
  - For Placeholders, put the badge in the button name: `{title}, Ejemplo Ilustrativo`.
  - The focus ring goes on the card (`:has(:focus-visible)`) with `focus-on-light`.
- **Severity:** medium.

### M7. Consent: link nested in the checkbox label; focus and error visuals unspecified
- **SC:** 2.5.3 / 4.1.2; 3.3.1 Error Identification; 2.4.7; 1.4.11.
- **Location:** EXPERIENCE.md L136, L210–211. DESIGN.md L337–339 (only "24px,
  `accent-strong` when checked"). `key-contact.html` L321 (`<label>` wraps a
  visually-hidden checkbox and `<a href="#aviso">`).
- **Problem:**
  - iOS VoiceOver and Android TalkBack activate at the centre of the label, which can land
    on the "Aviso de privacidad" link. The notice then opens instead of the box toggling.
  - With a native checkbox that is visually hidden, the 24px box needs an explicit
    `:focus-visible` style, and the spine defines none.
  - The consent error "Para continuar, acepta el Aviso de privacidad." has no defined
    association or visual.
- **Fix:** Use this markup:
  `<input type="checkbox" id="consent" required aria-invalid="…" aria-describedby="consent-err">`
  `<label for="consent">He leído y acepto el Aviso de privacidad.</label>`, followed by a
  sibling `<a href="#aviso" aria-haspopup="dialog">Leer el Aviso de privacidad</a>` outside
  the label. Alternatively, keep the inline link but make the label's text-only part the
  click target with `for`.
  - Visuals: unchecked box border `muted` (5.89); focus is
    `input:focus-visible + .cb { outline: 2px solid var(--focus-on-light); outline-offset: 2px }`;
    error is a `danger` border plus a message with icon under the row.
  - Add the error state to DESIGN › Form field.
- **Severity:** medium.

### M8. Email field lacks `autocomplete`, and required fields are not indicated
- **SC:** 1.3.5 Identify Input Purpose; 3.3.2 Labels or Instructions.
- **Location:** EXPERIENCE.md L199–211; `key-contact.html` L301–321.
- **Problem:**
  - The email input has no `autocomplete="email"`, which fails 1.3.5.
  - All three controls are required, but nothing says so visually or programmatically.
    `novalidate` is set without `required`/`aria-required`.
- **Fix:**
  - Email: `type="email" autocomplete="email" inputmode="email" required`.
  - Select and checkbox: `required`. Keep `novalidate` for the custom messages.
  - Add the composer intro line "Todos los campos son obligatorios." to the UI strings, or
    put "(obligatorio)" in each label.
- **Severity:** medium.

### M9. Stacked Privacy notice: lower composer not made inert; Esc and Back scope
- **SC:** 2.4.3; 4.1.2; 2.1.2.
- **Location:** EXPERIENCE.md L205–208, L261–265. DESIGN.md L286–287. `key-contact.html`
  L361 (`aria-hidden` ghost composer), and L274 / projects L262 (only `<main>` made inert;
  the header stays focusable).
- **Problem:**
  - CDK `aria-hidden`s the siblings of the *overlay container*, but the composer and the
    notice live in the same container.
  - In the mocks, `inert` is applied to `<main>` only, so the sticky header (logo, nav, CTA)
    stays tabbable and readable behind every modal.
  - Esc on a native `<select>` in the composer could bubble and close the panel.
- **Fix:**
  - When any overlay opens, set `inert` on **every app-shell sibling**: skip link, header,
    main, footer. The cleanest way is to set `inert` on the app root while overlays render
    in the CDK overlay container.
  - When the notice opens over the composer, also set `inert` on the composer pane. Remove
    it on close, then return focus to the consent link.
  - Esc closes only the topmost overlay: `stopPropagation()` in the notice's handler, and
    ignore Esc when `event.target` is an open `<select>`.
  - Back pops one entry, and so closes one overlay. Closing by ✕, Esc, or scrim calls
    `history.back()` so the Back stack stays truthful.
- **Severity:** medium.

### M10. "Copiado" live region: must already exist before its text changes
- **SC:** 4.1.3 Status Messages.
- **Location:** EXPERIENCE.md L198, L292. `key-contact.html` L345 (`<span aria-live>`
  rendered with its text).
- **Problem:** If Angular inserts the status element and its text together (for example via
  `@if`), NVDA, JAWS, and VoiceOver often stay silent. A second copy writes the same
  "Copiado" string again, which is not re-announced.
- **Fix:**
  - Keep a persistent, empty `<span role="status" aria-live="polite" aria-atomic="true">`
    beside each copy button. Clear it first, then set the text after a frame or about
    100ms.
  - Or call CDK `LiveAnnouncer.announce('Copiado', 'polite')` and keep the visible chip
    `aria-hidden`.
  - On failure, announce the failure text and select the address in a visible element.
- **Severity:** medium.

### M11. Heading levels skip (`h3` token mapped to `<h4>`); dialog title levels differ
- **SC:** 1.3.1 Info and Relationships (the spine's own floor: "levels never skip").
- **Location:** DESIGN.md L233–234. This confirms reconcile-prd A5. The mocks use
  `<h3>` Filosofía/Misión/Visión/Valores with `<h4>` values, which is correct, while the
  spine maps them to `<h4>`. Dialog titles: the spine says `<h3>`, the mocks use `<h2>`.
- **Fix:** Change the Element column:
  - Nosotros: Filosofía, Misión, Visión, Valores → `<h3>`; value names → `<h4>`.
  - Confianza: "Clientes" → `<h3>`; client groups → `<h4>`.
  - Dialog and panel titles → `<h2>`, since each modal is its own context.
  - Contact name: `<h3>` is acceptable.
- **Severity:** medium.

### M12. Display uppercase long words overflow at 320 px
- **SC:** 1.4.10 Reflow.
- **Location:** DESIGN.md front matter `display` 32px/300 at +0.04em (L27–28). Hero h1 in
  `key-landing.html` L282 ("…INSTALACIONES ELÉCTRICAS").
- **Problem:** Quicksand caps average about 0.68em. "INSTALACIONES" (13 letters) at 32px
  needs about 299 px, which exceeds the 280 px content box at 320 CSS px. Long Content-doc
  words have the same risk in `h1` 28px (for example "CONFIABILIDAD").
- **Fix:**
  - `display: font-size: clamp(26px, 8.5vw, 32px)` below 768.
  - `overflow-wrap: break-word; hyphens: auto` on Quicksand roles (`lang="es-MX"` enables
    Spanish hyphenation).
  - Add a 320 px check to the Hero acceptance criteria.
- **Severity:** medium.

### M13. Background `inert` and focus trap are not stated as one contract for all overlays
- **SC:** 2.4.3; 1.3.2 Meaningful Sequence.
- **Location:** EXPERIENCE.md L261–265 vs L224. The Mobile menu row says page `inert`, but
  the Overlays primitive doesn't name *what* is inert.
- **Problem:** Implementers will vary. In both mocks the header stays reachable behind
  dialogs.
- **Fix:** Add one sentence to the Overlays primitive: *"While a modal overlay is open,
  every app-shell element outside it (skip link, header, main, footer, and any lower
  overlay) has `inert`; `aria-modal="true"` is set on the dialog; the CDK `FocusTrap`
  wraps only the topmost overlay."* (The mobile menu is the exception; see H4.)
- **Severity:** medium.

### M14. Required alt text for project photos is not enforced
- **SC:** 1.1.1 Non-text Content.
- **Location:** EXPERIENCE.md L293 (alt from Content docs). Open Question 7: the brochure
  has titles and photos only. There are 20 photos.
- **Problem:** The carousel shows each photo alone, so every one is informative. No rule
  says what happens when a photo lacks `alt` in the Project Content doc.
- **Fix:** Make the Project schema require `photos[].alt` (Spanish, ≤ 125 chars, not equal
  to the title). The content build fails when `alt` is missing. Card images use `alt=""`
  (see M6).
- **Severity:** medium.

---

## Low

| # | SC | Location | Problem | Fix |
|---|---|---|---|---|
| L1 | 2.4.7, 2.4.1 | DESIGN L344; landing mock L253 (`.sr` skip link never unhides) | The skip link must become visible on focus. `<main>` is not a focus target. | `.skip:focus-visible{position:fixed;top:8px;left:8px;z-index:100}` styled with the `skip-link` token. Add `<main id="main" tabindex="-1">`. |
| L2 | 2.5.3 | EXP L116; landing mock L497 (`Cotiza`, no name override) | Visible "Cotiza" below 768; the spine example implies the name "Cotiza tu proyecto", but the mock doesn't set it. | `aria-label="Cotiza tu proyecto"` (contains "Cotiza"). Add `aria-haspopup="dialog"` after hydration. |
| L3 | 4.1.2 | EXP L212 vs mocks (Hero/Contact CTAs and "Cotiza un proyecto similar" are `<a href="#contacto">`) | Elements announced as links open a dialog. | Keep `<a href="#contacto">` for no-JS and add `aria-haspopup="dialog"` on hydration. "Cotiza un proyecto similar" only exists with JS → `<button>`. |
| L4 | 4.1.3 | EXP L174–177, L120 | The live count "7 proyectos" carries no filter context, and identical counts are not re-announced. Pressing the already-active chip toggles nothing. | Live text "{n} proyectos: {servicio}" / "{n} proyectos en total" for Todos. An already-pressed chip stays pressed (no-op), so `aria-pressed` is never false for all. A radio group is unnecessary; keep `aria-pressed`. |
| L5 | 3.3.1, 3.3.3 | EXP L210–211; contact mock L303 | Errors are reached only by focus moving to the first invalid field, so the user meets later errors (Service, consent) one at a time. The hint "Ahí te responderemos." drops out of `aria-describedby` in the error state. | On submit, also announce a polite summary via `LiveAnnouncer`: "Revisa 2 campos: correo, aviso de privacidad." Set `aria-describedby="em-hint em-err"`; the error id goes last only when present. |
| L6 | 4.1.2 | EXP L199; contact mock L299 | Focus lands in the email field, so the composer intro (how `mailto:` works) is never read. | The dialog gets `aria-describedby` set to the intro paragraph id. |
| L7 | 1.1.1 | All mocks: logo `alt="kVA Instalaciones"` repeated in header link, Hero, Contacto, composer, notice, footer | Screen readers hear the name six times. The header link has both `aria-label` and `alt`. | Keep the name on the header logo link (via `alt` only) and the footer. Hero, Contacto panel, composer, and notice logos get `alt=""`. |
| L8 | 2.5.8 | landing mock L134 (`.ftr-ch` 4px row gap, 21px-tall links) | Passes only through the spacing exception (centres about 25px apart). | `row-gap: 8px` or `min-height: 24px; display:inline-flex; align-items:center` on footer links. |
| L9 | 1.4.1 | DESIGN L201 (`accent-strong` = links on light) | Inline links in body text distinguished by colour alone: `accent-strong` vs `ink` is below 3:1. | Underline every inline link (`text-underline-offset: 3px`). Make it a DESIGN Do. |
| L10 | 2.3.3 (AAA, advisory), 2.4.7 | EXP L273–275 | A reveal could leave a focused or find-in-page target at opacity 0 if the observer threshold is not met. | Threshold `0`, `rootMargin: 0 0 -10% 0`. Also reveal on `focusin` inside the section. Add the `hidden` class only from JS after hydration (never in prerendered CSS). Skip entirely under `prefers-reduced-motion` or `@media (scripting: none)`. |
| L11 | — (no-JS) | EXP L227–229 | Chips, copy buttons, and project-card buttons are dead without JS. The notice via `:target` styled as an overlay would have no focus management. | Render chips and copy buttons with `hidden` and reveal them on hydration. Project cards are `<a href="#proyecto-{slug}">` pre-hydration, or are non-interactive. The no-JS notice is an in-flow `<section id="aviso">` at page end, not an overlay. |
| L12 | — (legibility, advisory) | DESIGN L227–237 (`h1` 28px/300, `lead` 20px/300 uppercase or thin) | Quicksand Light at 28px uppercase on `paper-2`, and Outfit 300 `lead` on photos, have thin strokes. They pass numerically but are weak for low-vision readers. Long uppercase titles (project names over 40 chars) slow reading. | `h1` weight 400 below 1024. `lead` weight 400 on photo surfaces. Keep CSS uppercase for `display`, `h1`, overline, and labels; use sentence case for `h2` project and service titles over 40 chars. Verify NVDA and VoiceOver read the uppercase words as words. |
| L13 | 2.5.7, 2.4.3 | EXP L188–191, L182–187 | Swipe is fine (arrows exist). Closing by ✕, Esc, or scrim without popping history leaves a stale Back entry. | Close always pops the pushed state (`history.back()`), and `popstate` closes and restores focus. "Cotiza un proyecto similar" uses `replaceState`, as the spine says. |
| L14 | 1.4.3 | DESIGN L330 (Copy status: `success` on light), L215 | `success` and `danger` on `ink-2` measure 2.83 / 2.30. The dark Contact section's "Copiado" must not reuse the light style. | Add to Do's/Don'ts: "`success`/`danger` only on `paper`/`paper-2`; on dark use `paper` text + icon." |
| L15 | 1.3.1 | contact mock L298 (footer inside `<main inert>`), projects mock (header not inert) | Mock-only landmark slips: the footer nested in `main` loses `contentinfo`. | The implementation keeps `<footer>` as a sibling of `<main>`. The mocks are illustrative, so no spine change is needed. |

---

## Verified as passing (no action)

- **`lang="es-MX"`** is on `<html>`, and all UI strings are Spanish. Loanwords (site, call
  center, CCTV, BI) are es-MX technical vernacular, so 3.1.2 needs no `lang` parts.
- **Landmarks:** the mocks use `header`, `nav aria-label="Secciones"`, `main`, sections
  labelled by their headings, and `footer`. There is one `<h1>` (Hero).
- **`tel:`/`mailto:` names:** "Llamar al (56) 4000 3344" contains the visible number
  (2.5.3), and `tel:+525640003344` is a valid E.164 number. Email links are named by the
  address. The copy button name "Copiar correo {address}" starts with its visible label.
- **Filter:** `role="group"` + `aria-label` + `aria-pressed` + check icon, so state is not
  colour-only. The active chip `accent-strong` vs `paper-2` is 5.55, and the inactive chip
  border is 5.27.
- **No autoplay,** a swipe alternative (arrows plus thumbnails), and `aria-roledescription`
  in Spanish ("carrusel", "foto"). One-photo projects hide the controls.
- **Targets:** CTAs 48, chips 44, icon buttons and arrows 44, thumbnails 64, checkbox 24
  plus a label hit area. The header CTA below 768 has a 44px hit area.
- **Form errors:** text plus icon plus `danger` border (not colour-only). The messages give
  a fix (3.3.3), `aria-invalid` + `aria-describedby` are set, submit is never disabled, and
  values are retained (3.3.7).
- **Reduced motion:** covers smooth scroll, reveals, slides, and scale (State Patterns L251).
- **Text over images:** `paper` only, always on the overlay, at ≥ 8.76:1 worst case. Copper
  and `muted-on-dark` are correctly banned on photos.
- **Consistent help (3.2.6):** the header CTA and footer channels appear on every scroll.
