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

- source_spec: `_bmad-output/implementation-artifacts/spec-2-1-services-section-with-the-four-brochure-service-cards.md`
  summary: Confirm editorial copy for the four Service descriptions and all of Servicios de Datos, then drop the `[ASSUMPTION]` flags.
  evidence: Descriptions are agent-written from the brochure; Services 1 and 3 contain outcome phrases ("conforme a norma", "evitar paros e inspecciones fallidas") not stated in the Sub-services.
- source_spec: `_bmad-output/implementation-artifacts/spec-2-1-services-section-with-the-four-brochure-service-cards.md`
  summary: Give each Service CTA a distinct accessible name once Epic 3 wires the composer pre-fill.
  evidence: All four links read the same text and go to `#contacto` (WCAG 2.4.4 link purpose); real until Epic 3 replaces them.
- source_spec: `_bmad-output/implementation-artifacts/spec-2-1-services-section-with-the-four-brochure-service-cards.md`
  summary: Automated layout check for the Services grid column counts and CTA alignment.
  evidence: Verified today by regex on SCSS plus a manual browser pass; the repo has no browser test harness and AGENTS.md forbids adding Playwright without a story.

- source_spec: `_bmad-output/implementation-artifacts/spec-2-2-collapsible-sub-service-lists-on-mobile.md`
  summary: Decide where focus lands when the viewport widens past 768 px while the Sub-service toggle is focused.
  evidence: The toggle is removed from the DOM, so focus falls back to body; not covered by the spec's matrix.
- source_spec: `_bmad-output/implementation-artifacts/spec-2-2-collapsible-sub-service-lists-on-mobile.md`
  summary: Measure CLS from hydration collapsing the Service lists on narrow viewports (launch checks, Story 6.5).
  evidence: Prerendered HTML is full by spec, and the JS collapse after hydration shrinks the cards; unmeasured.
- source_spec: `_bmad-output/implementation-artifacts/spec-2-2-collapsible-sub-service-lists-on-mobile.md`
  summary: Check scroll position after collapsing a long list on real devices, and show all Sub-services when printing.
  evidence: Collapsing a 9-item list can move the toggle off-screen; collapsed cards print only four items.

- source_spec: `_bmad-output/implementation-artifacts/spec-2-2-collapsible-sub-service-lists-on-mobile.md`
  summary: Raise or remove the 5 s timeout of "matches every real original, candidate, budget and editorial alt without fabrication" in `images.content.spec.ts`.
  evidence: Intermittent timeout under the full parallel suite (1 of 3 runs on merged epic-2); passes alone and on the Epic 1 baseline. Pre-existing test; the suite grew by about 80 tests.
