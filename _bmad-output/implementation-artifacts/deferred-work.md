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
- source_spec: `spec-1-9-mobile-menu.md`
  summary: Make `MobileMenu` reconcile its state when `LayerController.open` refuses (another overlay active).
  evidence: Review R6: the adapter ignores `EffectRunner.layer`'s result, so the sheet could show open without inert, scroll lock or a history entry. Unreachable until Epic 3 adds more overlays.
- source_spec: `spec-1-9-mobile-menu.md`
  summary: Harden `LayerController` popstate handling (late popstate after the 500 ms fallback, non-layer popstate while open, stale `kvaLayer` entry on Forward/reload, timer cleanup on destroy).
  evidence: Reviews R7/R8: `onPopState` treats any popstate while a layer is active as Back without checking the entry; needs a real-browser repro to settle.
- source_spec: `spec-1-9-mobile-menu.md`
  summary: Bring `header.scss` back under the 4 kB component-style warning or record a budget decision.
  evidence: Review R10: it compiles to 5.71 kB (error limit 8 kB); a sheet-styles split to `styles.scss` or a budget change is needed.
- source_spec: `spec-1-9-mobile-menu.md`
  summary: Verify the scroll lock on iOS Safari and avoid scrollbar-gutter layout shift while the menu is open.
  evidence: Review R11: `html { overflow: hidden }` does not stop touch scrolling on iOS and removes the desktop scrollbar; only Chromium was checked.
