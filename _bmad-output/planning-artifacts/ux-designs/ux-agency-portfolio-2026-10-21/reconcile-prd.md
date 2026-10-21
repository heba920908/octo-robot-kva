---
title: "Reconcile: PRD → UX spines"
created: 2026-10-21
input: ../../prds/prd-agency-portfolio-2026-10-19/prd.md (+ addendum.md)
spines: DESIGN.md, EXPERIENCE.md
authority: .memlog.md (4 overrides excluded as gaps; their stale PRD locations listed in Part B)
scope: FR-1..FR-17, NFR-1 (images, fonts), NFR-2, §2.4, UJ-1..UJ-3
---

# Reconcile: PRD → spines

**Part A, realization gaps: 18. High 2 · Medium 7 · Low 9.**
**Part B, stale PRD locations caused by the memlog overrides: 27. High 2 · Medium 13 · Low 12.**
Part B also notes 4 spine-decision staleness items (low), which are not counted above.

Overrides: **O1** 4 Services from the brochure · **O2** real Projects at launch · **O3** phones,
contact name, and proyectos2@ shown · **O4** Nosotros section.

## Part A: realization gaps

1. **FR-8.** "A Visitor can open a Project to see its photos, scope, and outcome"
   → **weakened**. The real brochure Projects have titles and photos only (EXP Open Q7). Scope and outcome are mandatory, but the spines define no launch rule. The State Patterns only cover omitting optional proof fields, and the card's one-line summary has no source.
   → EXPERIENCE › State Patterns (Project detail: missing scope/outcome → block publish or keep as Placeholder) · Open Questions
   → **high**

2. **NFR-2.** "visible focus, 4.5:1 text contrast"
   → **contradicts** (WCAG 1.4.11 non-text contrast). `focus-ring` and the current-nav underline use `accent` on every dark surface, including photo + `overlay` (Hero CTAs, transparent header). DESIGN's own table puts `accent` over overlays at 2.95 worst, which is below 3:1.
   → DESIGN › Colors (focus on overlays = `paper` ring or `paper` + `accent` double ring) · Components › Focus ring, Header
   → **high**

3. **FR-5.** "Each card shows a name, short description, and icon or image"
   → **contradicts**. The Service card has no icon or image, and the Do's and Don'ts ban icons per Service.
   → DESIGN › Components › Service card (add an image slot, e.g. a project photo, or record the deviation for a PRD edit)
   → **medium**

4. **NFR-1.** "Images are responsive and lazy-loaded below the fold."
   → **weakened**. Only the Hero states responsive AVIF/WebP. The Nosotros, Confianza, and Contacto backgrounds and the 20 project photos have no `loading="lazy"`, `srcset`, or size budget, despite SM-C2 heavy imagery.
   → EXPERIENCE › State Patterns (image loading rows) · DESIGN › Imagery & assets
   → **medium**

5. **NFR-2 / Accessibility Floor.** "One `<h1>` (Hero); heading levels never skip."
   → **contradicts** (internal). The `h3` token maps to `<h4>` for Misión, Visión, values, and client groups, directly under section `<h2>`s (Nosotros, Confianza), which skips `<h3>`.
   → DESIGN › Typography (element mapping for Nosotros and Clientes; add `<h3>` sub-titles)
   → **medium**

6. **§2.4 Positioning.** "enterprise-grade electrical work done to standard … avoid CFE … penalties and downtime"
   → **weakened**. No default Hero headline or lead is drafted. The overline "Explorando soluciones" is a generic brochure tagline, and the buyer risks (downtime, failed inspections, CFE penalties, safety) are mapped to no section.
   → EXPERIENCE › Voice and Tone (Hero headline/lead guidance) · IA
   → **medium**

7. **§2.4 Per-Service hooks.** "Power consumption analysis: CFE GDMTH tariff … penalties for power factor below 90%"
   → **weakened**. After the O1 regrouping, the hooks only "follow their card". The Desarrollo card would carry both the engineering and power-analysis hooks, and the cabling hook (ANSI/TIA-568 test reports) has no stated home in Instalaciones.
   → EXPERIENCE › IA (Services table: hook per card)
   → **medium**

8. **§2.4 Voice.** "no unsupported superlatives ("los mejores", "líderes")"
   → **weakened**. The Nosotros copy taken from the brochure keeps unevidenced claims ("los más altos estándares", "superar expectativas"). Open Q8 flags only "líderes" and "KVA".
   → EXPERIENCE › Open Questions 8 · Voice and Tone
   → **medium**

9. **UJ-1.** "She scrolls to Services, opens Análisis de consumo eléctrico, and taps its CTA."
   → **weakened**. Her item is bullet 6 of 9, hidden behind "Ver los 9 servicios" on mobile, and the Lead subject carries the generic "Desarrollo e Ingeniería de Proyecto".
   → EXPERIENCE › Component Patterns › Service card (order hook items first, or show the full list) · Flow 1
   → **medium**

10. **NFR-1 fonts.** "self-hosted fonts" (NFR-4) / LCP ≤ 2.5 s
    → **weakened**. No preload policy for the Hero heading font, and no weight-axis or subset budget. Two variable families include latin-ext, which es-MX does not need.
    → DESIGN › Typography (preload 1 file, latin subset, axis 300–600)
    → **low**

11. **FR-3.** "The page shows the brand name kVA Instalaciones in the header"
    → **weakened**. The header shows only the logo mark ("kVA"), and the logo link name "kVA Instalaciones, ir al inicio" differs from FR-3's "kVA Instalaciones".
    → DESIGN › Components › Header · EXPERIENCE › UI strings
    → **low**

12. **FR-4.** "at least one proof point (for example, years in business or nationwide coverage)"
    → **contradicts** (edge case). The State Patterns say "no confirmed Trust item → no proof point", which leaves FR-4 unmet. There is also no headline or lead length budget to guarantee the 360×640 fit.
    → EXPERIENCE › State Patterns (Confianza) · Voice and Tone (copy-length limits)
    → **low**

13. **§2.4 CTA vocabulary.** "such as "Cotiza tu proyecto" and "Solicita una visita técnica""
    → **dropped**. The visit-led CTA appears nowhere.
    → EXPERIENCE › Default UI strings (e.g. the Instalaciones card CTA)
    → **low**

14. **§2.4 Data services.** "outcome-led (better decisions, visible operations) rather than tool-led"
    → **contradicts**. The Service 4 sub-services are tool names (Analítica, BI, Gestión de datos).
    → EXPERIENCE › IA (Services table, row 4)
    → **low**

15. **UJ-2.** "filters Projects by Cableado estructurado"
    → **weakened**. The "Instalaciones" chip leaves 7 of 9 Projects, so the filter barely narrows and Jorge's cabling intent is not isolated.
    → EXPERIENCE › IA (Projects mapping) · Flow 2
    → **low**

16. **FR-9.** "the Content doc records their source and license"
    → **weakened**. Brochure photos are an [ASSUMPTION] licence (Open Q3). No source/licence field is specified for the Project doc.
    → EXPERIENCE › Component Patterns › Project card / Open Questions
    → **low**

17. **FR-5.** "adding a fifth valid doc and rebuilding produces five cards"
    → **weakened**. The 2×2 grid has no rule for odd counts (5, 7).
    → DESIGN › Components › Service card grid
    → **low**

18. **FR-16.** "The share image is a dedicated 1200×630 px image"
    → **weakened**. It is composed from a 740×556 cover, so upscaled, and no quality floor is set.
    → DESIGN › Imagery & assets
    → **low**

## Part B: stale PRD locations (for the PRD update)

Status for all rows: **stale**. Fix in the PRD, citing EXPERIENCE › Foundation › Overrides.

| # | PRD location | Quote (≤ 20 words) | Override | Severity |
|---|---|---|---|---|
| 1 | §1 Vision | "installations, structured cabling, power consumption analysis, and data services" | O1 | medium |
| 2 | §1 Vision | "Every contact is an email the Visitor sends from their own email client" | O3 | medium |
| 3 | §2.3 UJ-1 | "opens *Análisis de consumo eléctrico*, and taps its CTA" | O1 | medium |
| 4 | §2.3 UJ-2 | "filters **Projects** by *Cableado estructurado*" | O1, O2 | medium |
| 5 | §2.4 Per-Service hooks | "*Power consumption analysis:* … *Structured cabling:* … *Electrical installations:*" | O1 | medium |
| 6 | §3 Glossary › Service | "initially four: structured cabling, electrical installations, power consumption analysis, and data services" | O1 | **high** |
| 7 | §3 Glossary › Lead | "an email received at proyectos1@kvainstalaciones.mx that was started from the page" (calls, proyectos2@) | O3 | medium |
| 8 | §3 Glossary › Copy-address fallback | "a visible display of proyectos1@kvainstalaciones.mx with a one-action copy control" | O3 | low |
| 9 | §4.1 description | "anchor links to each section (Servicios, Proyectos, Confianza, Contacto)" | O4 | medium |
| 10 | §4.1 description | "A footer holds the Legal identity, proyectos1@kvainstalaciones.mx, and the Privacy notice link" | O3 | low |
| 11 | FR-1 consequence | "(`#servicios`, `#proyectos`, `#confianza`, `#contacto`)" (add `#nosotros`) | O4 | medium |
| 12 | FR-3 consequence | "The footer shows the Legal identity, proyectos1@kvainstalaciones.mx, the current year" | O3 | low |
| 13 | §4.4 description | "At launch, Projects may be Placeholder projects." | O2 | low |
| 14 | §4.5 Trust / addendum candidates | "Client logos or names, with written permission." (Clientes list now in Trust; needs FR + permission rule) | O2, O4 | medium |
| 15 | FR-15 consequence | "(Hero, Services, Projects, Trust, Contact, footer, Privacy notice, SEO metadata)" | O4 | medium |
| 16 | FR-15 consequence | "Adding, editing, or removing a Service, Project, or Trust item needs no source-code change." | O4 | low |
| 17 | FR-16 consequence | "with name, URL, email, and area served (Mexico)" (add telephone) | O3 | low |
| 18 | FR-16 consequence | "The Hero, Service names and descriptions, Trust items, and Project titles are present in the served HTML" | O4 | low |
| 19 | NFR-5 | "new Services, Projects, and Trust items are added through Content docs only" | O4 | low |
| 20 | §8.1 In Scope | "Hero, Services, Projects (filter and detail view), Trust, Contact" | O4 | medium |
| 21 | §8.1 In Scope | "Placeholder projects, labeled "Ejemplo Ilustrativo"." | O2 | low |
| 22 | §8.3 Accepted risk | "launch may go ahead with only Placeholder projects" | O2 | medium |
| 23 | §9 SM-1 | "qualified Leads per month in the proyectos1@kvainstalaciones.mx inbox" (phone/proyectos2@ leads uncounted) | O3 | medium |
| 24 | §10 Q2 | "Real proof content: projects, photos, client names (with permission)" (partly answered by brochure) | O2 | low |
| 25 | §10 Q7 | "who at kVA approves claims (Trust items, Project facts, client names)" (add Nosotros copy) | O4 | low |
| 26 | Addendum › Content schemas | "`service`, `project`, `trust-item`, `hero`, `site` (footer, SEO, contact, Legal identity, optional WhatsApp number)" (add `nosotros`, `client`; site: phones, contact name, proyectos2@) | O2, O3, O4 | **high** |
| 27 | Addendum › Spam exposure / Structured data | "proyectos1@kvainstalaciones.mx appears in plain text" · "`areaServed: MX` and `email`" | O3 | low |

**Also stale from spine decisions (not overrides, low):**
- §6 and addendum behaviour models: the lists lack `service-card-disclosure` and `project-carousel`.
- §3 Glossary › Contact composer: "Its form factor … is decided in `bmad-ux`" is now decided (slide-in panel).
- §10 Q5: "Still open: color palette, font" is now proposed by the spines.
- §6 UI library: "not chosen yet" now has a spine recommendation (no styled library; CDK a11y).

## Confirmed carried (≤ 8)

1. FR-1/FR-2: real anchor links, focus to the heading, `scroll-margin-top`, sticky Header contact CTA → composer with focus on email, reduced-motion respected.
2. FR-6/FR-7: Service and Project CTAs pre-select the Service; filter "Todos" + Services with Projects, `aria-pressed`, live count, no reload.
3. FR-8 behaviour: dialog with focus trap, Esc/Back/close, focus back to the card, filter kept, proof fields only when present, client name only with permission.
4. FR-9: the "Ejemplo Ilustrativo" badge on card and detail view; the placeholder mechanism is kept.
5. FR-11/FR-13: email + Service + consent, inline errors with `aria-describedby`, `mailto:` with the `[kvainstalaciones.mx]` subject tag, URL-encoded, no storage.
6. FR-12/FR-14: proyectos1@ always visible with copy + "Copiado" live region, verbatim post-submit message; Privacy notice from the consent label and footer keeps composer values.
7. FR-15/FR-17: the full default UI-strings table for the UI strings Content doc; the WhatsApp CTA is not rendered until a number exists, and its prefill starts with the Lead tag.
8. NFR-2 floor: landmarks, `lang="es-MX"`, a single `<h1>`, 24px/44px targets, 2.4.11 not obscured, reflow at 320px, computed contrast table ≥ 4.5:1 for all text pairs.
