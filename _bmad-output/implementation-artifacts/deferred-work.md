- source_spec: `spec-1-2-self-hosted-fonts-and-icon-set.md`
  summary: Apply the documented 72ch reading-width constraint when building prose section layouts.
  evidence: Review B3 identified that the baseline body/description has no prose-width utility; the omission predates Story 1.2. Do not constrain the entire page body, which would interfere with future full-width sections.
- source_spec: `spec-1-7-hero-section.md`
  summary: Make section CTAs (`#contacto`, `#aviso`) navigate within the document regardless of query string or `<base href>`.
  evidence: Review R3: `href="#contacto"` resolves against `<base>`, so a URL with a query string triggers a full reload; Story 1.8 section navigation should own this.
- source_spec: `spec-1-7-hero-section.md`
  summary: Retire or tie `site.heading` to `hero.headline` and cover responsive Hero layout with a browser-level test.
  evidence: Reviews R8/R10: `site.heading` is no longer rendered and may drift; layout at 360/768/1440 is asserted only by SCSS source text plus manual checks. Story 6.1 metadata work may reuse `site.heading`.
- source_spec: `spec-1-7-hero-section.md`
  summary: Supply a wider Hero photo derivative if the source allows.
  evidence: Review R11: `cover-blueprint-tools` caps at 740 px and is stretched by `object-fit: cover` at 1440 px under the overlay.
- source_spec: `spec-1-8-sticky-header-and-section-navigation.md`
  summary: Add browser-level tests for header breakpoint visibility (767/768/1023/1024) and scroll-spy band geometry.
  evidence: Review R13: both are asserted only by SCSS/source text; verified manually in the Pages preview this story. Needs a Playwright story since the repo has no browser test runner.
