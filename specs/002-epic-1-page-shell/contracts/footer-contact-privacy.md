# US5 Footer, Contact Links and Privacy Notice Contract

The approved Story 1.5 spec controls this contract.

## Content

`site.schema.json` is extended per data-model.md. `content/site.md` documents every added
field and `content/privacy-notice.md` holds the editorial notice; typed
`privacy-notice.content.ts` matches it and is read only through `ContentFacade`. Missing
email, invalid Mexican E.164, unknown fields, missing notice title/sections and blank text
fail validation. No content file or executable content contains `proyectos2@` or
`4029 4029`.

## Contact-link builder

Pure functions in `src/app/core/contact/contact-links.ts` are the only owner of the Lead
tag `[kvainstalaciones.mx]`, URL encoding and E.164 -> `tel:`. Direct email topic is
"Contacto"; the result must equal `mailSubjectDirect`. WhatsApp is out of scope.

## Behavior model

`src/app/behaviors/behavior-model.ts` exports `BehaviorModel<State, Event>`: `id`, `actor`,
`trigger`, `preconditions`, `acceptance`, and pure `transition(state, event)` returning
`{ state, effects } | null`. `direct-contact-links.behavior.ts` imports only core types.
Table-driven tests call the production function; footer interaction tests prove native links
are not default-prevented and change no state. Flow cases are logged as JSONL under
`.agents/workspace/bmad/2026-10-28/1-5/`.

## Footer and notice

`app-footer` is a sibling after `<main>`: ink surface with top divider, white logo (24px, 2x
source, content-bound alt from `logoLink`), legal identity or brand stand-in, tagged `mailto:`
link, `tel:` link named by `phoneName` (omitted when no phone), `footerCopyright` with content
year, and an `<a href="#aviso">` named by `footerPrivacy`. Links use native anchors, are at
least 24px tall and work without JavaScript. `app-privacy` renders the last element of `<main>`:
`<section id="aviso" aria-labelledby>` with `h2 tabindex="-1"` and `h3` sub-blocks. No overlay,
history, WhatsApp or Contact-section content exists.

## Verification

AC1: schema positives/negatives, digit parity, content scan. AC2: builder unit cases and
`mailSubjectDirect` parity. AC3: model table, prerender/no-JS footer content, hrefs, names,
target size, no `Date` use. AC4: notice schema, facade exposure, `#aviso` target and heading
semantics. Browser: development and Pages at 1440/390/320px and no-JS; CSP, hydration,
SSG/ng-state, console/network and unchanged foundations. Archive schemas, samples and layout
cases at the paths in data-model.md.
