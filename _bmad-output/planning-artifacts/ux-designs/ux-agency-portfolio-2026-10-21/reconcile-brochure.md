---
title: "Reconcile: kVA brochure 2025 → UX spines"
created: 2026-10-21
input: imports/brochure-text.md, imports/brochure-pages/p01–p18.png (viewed p01–p13, p17, p18)
spines: DESIGN.md, EXPERIENCE.md
authority: .memlog.md (overrides and recorded departures excluded)
---

# Reconcile: brochure → spines

What the brochure expresses that the spines **drop**, **weaken**, or **contradict**.
Excluded as intentional (memlog): no "líderes"/superlatives, "kVA" casing, Quicksand/Outfit
lookalikes, body-weight legibility floor, one-photo-at-a-time carousel in the Project detail
view, real brochure Projects as Projects, the 4-Service set, phones shown, Nosotros section.

**Totals: 28 gaps. High 3 · Medium 14 · Low 11.**

## Gaps

### Layout rhythm and composition

1. **p06, p10 chapter openers.** Full-page darkened photo carrying only "CLIENTES QUE INSPIRAN NUESTRO TRABAJO" / "GALERÍA" before each light run.
   → **dropped / contradicts** (memlog: "alternating contrast"; spine runs Servicios `paper` → Proyectos `paper-2`, two light sections back to back, with no dark opener)
   → DESIGN › Layout & Spacing (section table: add a dark full-bleed title band before Proyectos, or make Proyectos' heading area photo-backed) · DESIGN › Brand & Style motif table
   → **high**

2. **p18 Contacto.** Single full-bleed darkened photo; logo top-right; "CONTACTO" with its hairline, name, and email/phone pairs all right-aligned.
   → **contradicts** (spine: split photo | flat `ink-2` panel, title on the photo panel; the motif table also cites p18 as a split, which it is not)
   → DESIGN › Layout & Spacing row 6 · DESIGN › Components › Contact section · Brand & Style motif table
   → **high**

3. **p11–p17 gallery collages.** Mixed-size photo mosaics (wide + small + tall), thin white gutters, flush to page edges; p07–p08 inset + full-bleed pair.
   → **dropped** (spine uses a uniform 4:3 card grid plus the one-photo carousel; no collage rhythm anywhere)
   → DESIGN › Components › Project card / Proyectos grid (mosaic grid ≥ 1024 with spanning tiles), or Project detail view (collage overview ≥ 1024 before the carousel)
   → **high**

4. **p02–p04, p09, p18 alignment.** Body blocks right-aligned (ragged-left) on white panels; p09's right column and p18's whole block mirrored to the right edge.
   → **dropped** (spines never specify alignment)
   → DESIGN › Layout & Spacing (alignment rule: right-align titles and short blocks ≥ 1024, left-align long body and everything < 1024 for readability) · Components › Nosotros, Trust, Contact
   → **medium**

5. **Edge bleed (p06, p10, p11–p17, p07).** Hairlines, the gallery bar, and photos run off the page edge; content is anchored to edges, not centred.
   → **dropped** (spine confines everything to the 1200px centred column; bar is "66% of the column")
   → DESIGN › Layout & Spacing (allow full-bleed rules/bars and edge-anchored media) · Shapes › Bar heading
   → **medium**

6. **Generous whitespace (p02–p05).** Text occupies roughly half the white panel, with a large top offset; one topic per spread.
   → **weakened** (only section padding and a 72ch cap; no narrow measure or offset rule for split content panels)
   → DESIGN › Layout & Spacing (content-panel measure ~45ch ≥ 1024, top offset ≥ `{spacing.16}`)
   → **medium**

7. **p01 cover composition.** Centred; the large logo is the hero element, with "EXPLORANDO SOLUCIONES" and hairline separators below; two interlocking offset frames (┘ top-right, ┌ lower-left).
   → **weakened** (spine: logo hidden < 768, headline dominant, one bracket frame ≥ 768, no alignment or separator hairlines)
   → DESIGN › Components › Hero · Shapes › Corner-bracket frame
   → **medium**

### Line motifs and colour

8. **Title underlines (p06, p09, p10, p18).** The dominant motif is a straight hairline under the title that bleeds to the page edge; turned corners appear only in the p02–p05 frames.
   → **contradicts** (spine puts a ┘ turned arm on every section title and cites p18, which has no turn)
   → DESIGN › Shapes › Corner rule (straight edge-bleeding underline as default; turned ends only where frames meet) · motif table
   → **medium**

9. **Monochrome linework.** "Text colours: #000000, #ffffff only"; all rules and frames are black or white.
   → **contradicts** (spine colours the corner turn copper; memlog limits copper to CTAs and focus)
   → DESIGN › Shapes · Colors (`accent` role) · Do's and Don'ts
   → **medium**

10. **p05 frame.** A single ┘ corner sits beside the umbrella title; Service names carry no individual frames.
    → **contradicts** (spine wraps every Service title in a ┐ bracket frame, citing p01–p05)
    → DESIGN › Components › Service card · Shapes › Corner-bracket frame
    → **medium**

11. **p02–p04 content-panel frame.** Open ┐ frame (top + right edge, running to the page bottom) around each white panel.
    → **weakened** (Nosotros component specifies only the └ frame on the photo panel)
    → DESIGN › Components › Nosotros
    → **low**

12. **p03 sub-head rules.** "misión ──┘" turns up and "visión ──┐" turns down, linking the two blocks; the sub-heads look lowercase, not capitals.
    → **contradicts** (spine: both turn down; `h3` uppercased by CSS)
    → DESIGN › Shapes › Corner rule (sub-head variant) · Typography (case exception)
    → **low**

### Typography

13. **Thin sub-titles.** Service names (p05), client groups (p09), "misión/visión" (p03), and the contact name (p18) are as thin as the main titles.
    → **weakened** (spine `h2`/`h3` at 500 and `label` at 600, heavier than the floor needs at 18–24px)
    → DESIGN › Typography (`h2`/`h3` at 300–400)
    → **medium**

14. **Gallery titles (p11–p17).** "Canalización y Cableado (Industrial y Comercial)" is set mixed case, thin, beside the bar.
    → **contradicts** (spine uppercases every Quicksand role, including Project titles)
    → DESIGN › Typography (case rule: Project titles in sentence case) · Do's and Don'ts
    → **low**

15. **Gallery signature (p11–p17).** Black kVA mark top-right on every gallery page.
    → **dropped** (the dark logo is used only on the composer and notice)
    → DESIGN › Components › Project detail view or Proyectos heading
    → **low**

### Services (p05)

16. **Umbrella title.** "SERVICIOS INTEGRALES DE INSTALACIONES ELÉCTRICAS"
    → **dropped** (no section title or intro copy specified for Servicios)
    → EXPERIENCE › Information Architecture (Services) · UI strings / services section doc
    → **medium**

17. **p05 column layout.** Three frameless columns on white, centred titles with staggered baselines, no outlines.
    → **contradicts** (spine: outlined `paper` cards with a `divider`, 2×2 grid)
    → DESIGN › Components › Service card (drop the outline; consider 3 + 1 or 4 columns ≥ 1024)
    → **medium** (overlaps 10; fix together)

18. **Sub-service lists as primary content.** Bullets are set at body size with "- " markers, every item visible.
    → **weakened** (spine: `small` 14px, collapsed to 4 items < 768)
    → DESIGN › Components › Service card · EXPERIENCE › Component Patterns › Service card
    → **low**

19. **Bullet parsing.** "Mantenimiento preventivo y correctivo a: Plantas de emergencia, UPS, reguladores / Transformadores / Sistemas de iluminación"
    → **weakened** (spine counts "Transformadores" and "Sistemas de iluminación" as separate services, giving 7)
    → EXPERIENCE › Information Architecture (Services table)
    → **low**

### Nosotros (p02–p04)

20. **Three spreads, three titles.** "NUESTRA FILOSOFÍA" · "ESENCIA CORPORATIVA" (Misión + Visión) · "NUESTROS VALORES"
    → **weakened** (spine: one split titled Nosotros holding all four blocks plus two-column values)
    → DESIGN › Components › Nosotros (stack three split panels, or sub-titled bands) · EXPERIENCE › IA
    → **medium**

21. **Values list (p04).** "EXCELENCIA … SEGURIDAD … INTEGRIDAD … COMPROMISMO … COLABORACIÓN … ADAPTABILIDAD", each a run-in "NAME: description".
    → **dropped** (values not enumerated; spine uses separate `h3` names; the "COMPROMISMO" typo is not flagged)
    → EXPERIENCE › IA (add a Nosotros content table) · DESIGN › Components › Nosotros (run-in style)
    → **medium**

### Clients (p06–p09)

22. **Client list content (p09).** Five groups with scope lines, e.g. "Remodelación de sucursales: -Guadalajara -Morelia -Culiacán…"
    → **dropped** (groups, scope lines, and items not enumerated; spine is "h3 group + small items" only)
    → EXPERIENCE › IA (add Clientes table: Oficinas Gubernamentales, Grupo Accionario Attie, Clientes Varios, Inmobiliaria Goytia, CHR Construcciones) · DESIGN › Trust section
    → **medium**

23. **p09 hierarchy.** Group names in large thin uppercase, each underlined by a hairline to the page edge; left column left-aligned, right column right-aligned; items in sub-columns.
    → **weakened** (spine: 18–20px/500 group heads, 14px items, no per-group rule, uniform columns)
    → DESIGN › Components › Trust section
    → **medium**

24. **p06 title.** "CLIENTES QUE INSPIRAN NUESTRO TRABAJO"
    → **weakened** (spine: "Clientes")
    → EXPERIENCE › Default UI strings / trust doc
    → **low**

25. **p07–p08 featured clients.** Red Ambiental and Larousse get a solid black panel with the title top-left in a └ frame, an inset portrait, and a full-bleed photo.
    → **weakened** (flattened into standard Project cards)
    → DESIGN › Components › Project detail view (featured variant) or Project card
    → **low**

### Surfaces, imagery, order

26. **"Light black."** Photo detail stays visible under the darkening (p06 hands and wires); darkness is always photographic.
    → **weakened** (one fixed 78% overlay for every photo; flat `ink`/`ink-2` panels where the brochure uses photos)
    → DESIGN › Colors (`overlay` tunable 70–80% per image, verified ≥ 4.5:1) · Elevation & Depth
    → **low**

27. **Pure white gallery pages (p11–p17).**
    → **weakened** (Proyectos on `paper-2` #F4F2F0)
    → DESIGN › Layout & Spacing row 3
    → **low**

28. **Brochure order and p18 pairing.** Order: Nosotros → Servicios → Clientes → Galería → Contacto. p18 pairs each email with its phone, and the name is uppercase.
    → **weakened** (Nosotros comes 4th, after Proyectos; Contact channel-row grouping is ambiguous)
    → EXPERIENCE › IA (section order rationale) · DESIGN › Components › Contact section
    → **low**

## Confirmed carried (≤ 8)

1. Warm near-black photographic darkness with white text (`overlay` ≈ 78% `ink`, memlog-sampled #1b1310…#2a2522).
2. Thin uppercase, letter-spaced rounded titles at 300 for `display`/`h1` on both dark and light surfaces.
3. Split photo | white content at ≈ 5/12, with the title bottom-left in a └ frame (p02–p04 → Nosotros).
4. Thick black bar heading under gallery/Project titles (`{spacing.rule-bar}` 4px).
5. Sharp 0-radius geometry, no gradients or shadows on content, decorative hairlines only.
6. "Explorando soluciones" as the Hero overline; cover blueprint photo as the Hero/LCP image.
7. All 22 p05 sub-service bullets carried into Service Content docs under the three brochure groups.
8. Typographic (no-logo) client list and the full p18 contact data (name, both emails, both phones).
