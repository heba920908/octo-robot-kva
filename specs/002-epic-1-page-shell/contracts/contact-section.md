# US6 Contact Section, Copy-Address Behavior and Effect Executors Contract

The approved Story 1.6 spec controls this contract.

## Content and Visible Sections

`site.schema.json` requires `contactLogo: { src, src2x, width, height }` pointing to
`media/logo/kva-logo-white-40.png` (76×40) and `media/logo/kva-logo-white-80.png` (152×80).
`content/site.md` and `src/app/core/content/site.content.ts` include `contactLogo`.
`ContentFacade.visibleSections` registers `{ id: 'contacto', content: this.site.contact.email }`.
No content file or executable content contains `proyectos2@` or `4029 4029`.

## Shared Page-Shell Rhythm and Corner Rules

`src/styles.scss` defines responsive shell custom properties (`--kva-shell-margin`,
`--kva-shell-section-y`, `--kva-shell-columns`, `--kva-contact-column`,
`--kva-contact-align`, `--kva-contact-text-align`) at `@media (width >= 768px)` and
`@media (width >= 1024px)`. Section headings use `<h2 class="kva-type-h1" tabindex="-1">`
inside `.kva-section-heading` with decorative `<span class="kva-corner-rule" aria-hidden="true">`
(`┘` default, `.kva-corner-rule--mirrored` `└` in `#contacto`). Component SCSS files remain
100% free of literal `px` values, colors, and media queries.

## Copy-Address Behavior Model

`src/app/behaviors/copy-address.behavior.ts` exports `copyAddress` conforming to
`BehaviorModel<CopyAddressState, CopyAddressEvent>` with `id: 'copy-address'` and
`acceptance: ['1.6-AC-03', '1.6-AC-04', '1.6-AC-05']`:

- `request-copy` from `idle | copied | failed` -> `copying` with `[{ kind: 'copy', text }]`
- `copy-succeeded` from `copying` -> `copied` with `[{ kind: 'announce', message }]`
- `copy-failed` from `copying` -> `failed` with `[{ kind: 'announce', message }]`
- `status-timeout` from `copied` -> `idle` with `[]`
- Any unsupported state/event pair or blank payload returns `null`.
  Table-driven tests in `copy-address.behavior.spec.ts` call the production `transition`
  function and log transitions to `.agents/workspace/bmad/2026-10-29/1-6/copy-address.jsonl`.

## Effect Executors (`core/effects`)

`src/app/core/effects/effects.ts` exports injectable `EffectRunner` while preserving the
closed `Effect` union:

- `copy`: writes text via `navigator.clipboard.writeText(text)` and resolves to `boolean`;
  provides DOM text selection helper `selectElementText(element)` via `Selection` API.
- `announce`: clears persistent live-region state immediately, sets `message` after ~100 ms,
  and invokes optional hold callback after 2500 ms with timer cleanup on re-entry or destroy.

## Contact Section (`features/contact`)

`app-contact` renders `<section id="contacto" aria-labelledby="contacto-title" data-kva-surface="dark">`
wired in `<main>` before `<app-privacy />`:

- Background photo `cable-tray-technician` via `ResponsiveImage` + `overlay`.
- Decorative 40 px white logo (`alt=""`, 1x/2x srcset, intrinsic 76×40).
- `<h2 id="contacto-title" class="kva-type-h1" tabindex="-1">Contacto</h2>` with mirrored corner rule.
- Optional `<h3>` (`class="kva-type-h3"`) contact name (`Ing. Alfredo Hernández`), omitted without gap when absent.
- Tagged `mailto:` link and optional `tel:` link (`Llamar al (56) 4000 3344`), omitted without gap when absent.
- Copy button (`[hidden]="!enhanced()"` via `afterNextRender`, `aria-label="Copiar correo proyectos1@kvainstalaciones.mx"`, `mat-icon svgIcon="copy"`).
- Persistent `<span role="status" aria-live="polite" aria-atomic="true">` beside the copy button showing `mat-icon svgIcon="check"` when copied and the announced status text.
- Plain tagged `mailto:` CTA button (`Cotiza tu proyecto`).

## Verification

AC1: shell rhythm custom properties, 320/768/1024/1440 layout, `<h2 tabindex="-1">` and corner rules.
AC2: prerendered `#contacto`, logo, heading, `h3` name, `mailto:`/`tel:` links, CTA, `'contacto'` in `visibleSections`, omitted name/phone.
AC3: `copy-address` table-driven tests, single-effect adapter guarantee, `EffectRunner` unit tests, JSONL flow log.
AC4: copy success writes clipboard, clears status, announces `"Copiado"` ~100 ms later with `check` icon, holds 2500 ms, then resets.
AC5: copy failure selects email text and announces `"No se pudo copiar. Selecciona el correo y cópialo."`.
AC6: with scripts disabled / before hydration, copy button is `[hidden]` and email remains visible.
