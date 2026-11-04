---
title: "Reconcile: UX spines → updated PRD"
created: 2026-10-22
input: ../../ux-designs/ux-agency-portfolio-2026-10-21/EXPERIENCE.md, DESIGN.md, .memlog.md (O1–O4 + later entries), reconcile-prd.md Part B (27 rows + 4 spine-decision items)
target: prd.md (updated 2026-10-21), addendum.md
authority: PRD .memlog.md from "Update intent (2026-10-21)" onward (user decisions narrow the UX: proyectos2@ and (56) 4029 4029 not published; Legal identity non-blocking)
---

# Reconcile: UX spines → updated PRD

**Gaps: 14. High 1 · Medium 2 · Low 11.**
All 27 Part B rows and all 4 spine-decision items are reflected in the PRD/addendum (see
Confirmed carried). The remaining gaps are mostly **UX-side staleness** after the user narrowed
the overrides, plus two content-model holes that sit in neither document.

Format: UX/PRD location → status → fix location → severity.

## Gaps

1. **EXPERIENCE › Foundation › Overrides item 3** ("contact name, both emails, and both phones as
   `tel:` links"), **› Component Patterns › Contact section** ("Emails as `mailto:` links, each
   paired with its phone … a copy button per email"), **› Flow 3 step 3** ("each email beside
   its phone"); also DESIGN › Components › Footer ("email + phone pairs").
   → **contradicts** PRD §7, FR-20 ("proyectos2@ and (56) 4029 4029 appear nowhere"), addendum
   › Second contact channel, and EXPERIENCE's own Open Q9 / DESIGN › Contact section. A story
   author reading the Foundation would publish the second channel.
   → EXPERIENCE › Foundation (Override 3 → "contact name, proyectos1@, (56) 4000 3344; second
   pair not published, user 2026-10-21"), › Contact section (one email + phone, one copy
   button), › Flow 3 step 3; DESIGN › Footer (singular)
   → **high**

2. **EXPERIENCE › IA › Clientes** (group + scope line + items such as "Guadalajara, Morelia…",
   "Torre Axis") vs **addendum › `client` schema** (name, group, permission flag) and PRD FR-19
   ("Each Client Content doc entry carries a permission flag").
   → **contradicts / missing**. The permission-bearing unit is unclear: in the seed, items are
   often sites or branches of the group's organization, while PRD treats each entry as a
   Client organization; the "scope line" (Sucursales / Remodelación y mantenimiento) has no
   schema field.
   → PRD §3 Client + FR-19 (state whether permission is per group/organization or per item);
   addendum › `client` schema (add group scope line; group vs item model); EXPERIENCE › IA ›
   Clientes
   → **medium**

3. **EXPERIENCE › IA › Projects seed** ("Red Ambiental", "Larousse" as Project titles; Red
   Ambiental also listed under CHR Construcciones in Clientes) vs **PRD FR-8 / FR-19** (client
   name only with recorded permission).
   → **missing**. Project titles that are client names bypass the permission rule; FR-19's
   "does not render anywhere on the page or in its metadata" is violated by the title.
   → PRD FR-8 (a Project title or summary that names a Client requires that Client's
   permission, otherwise reworded) + addendum › `project` schema; EXPERIENCE › IA › Projects
   (neutral fallback titles)
   → **medium**

4. **EXPERIENCE › IA** (Hero `#inicio`, reached from logo) vs **PRD FR-1** anchor list and FR-3.
   → **missing**. PRD lists five anchors; `#inicio` and the logo-to-top link are absent.
   → PRD FR-1 consequence (add `#inicio` for the Hero/logo link) or FR-3
   → **low**

5. **EXPERIENCE › Foundation › behaviour-model table** ("Cotiza un proyecto similar" →
   `service-cta-prefill`) vs **PRD §6** ("the Contact composer (including the 'Cotiza un
   proyecto similar' entry point)").
   → **contradicts** (ownership only; ID set matches exactly).
   → PRD §6 (move the entry point under Service CTA pre-fill / `service-cta-prefill`)
   → **low**

6. **EXPERIENCE › IA "Realizes" column** (Nosotros "Override 4"; Confianza only FR-10; Contacto
   only FR-12, FR-17) and **› Requirement Trace** (no FR-18, FR-19, FR-20).
   → **missing** traceability to the new PRD FRs.
   → EXPERIENCE › IA (FR-18; FR-10 + FR-19; FR-12, FR-17, FR-20) and › Requirement Trace
   → **low**

7. **EXPERIENCE stale annotations**: "Spine terms (pending the PRD Glossary update)";
   "*Clientes entry*" vs PRD §3 **Client** / **Clientes list** (EXPERIENCE claims PRD terms
   verbatim); Trust section "[ASSUMPTION: same rule as FR-8]" (now FR-19); Nosotros
   "[NOTE FOR UX: new Content schema]" (addendum now defines `nosotros`).
   → **contradicts** (terminology) / stale.
   → EXPERIENCE › Foundation › Spine terms, › Component Patterns › Trust section, Nosotros
   → **low**

8. **EXPERIENCE › Flow 3 step 5** ("an untagged email still counts as a Lead per the
   Glossary") vs **PRD §3 Lead / SM-1** (untagged emails count only when the contact says they
   found kVA on the website).
   → **weakened**.
   → EXPERIENCE › Flow 3 step 5
   → **low**

9. **EXPERIENCE › State Patterns** "Proyectos | No Projects → section and header link hidden
   [ASSUMPTION]" and **› Project filter** "Hidden when fewer than two Services have Projects
   [ASSUMPTION]" vs **PRD FR-1** (hidden sections cite only FR-10, FR-18) and **FR-7** ("Todos"
   plus one per Service with a Project).
   → **missing / contradicts** (edge case; not triggered at launch with 2 Services).
   → PRD FR-1 (add Projects to hidden-section rule) and FR-7 (filter hidden below two
   Services), or drop the UX assumptions
   → **low**

10. **EXPERIENCE › Default UI strings** ("Service card CTA: Cotiza este servicio · visit-led
    Services: Solicita una visita técnica") vs **PRD §2.4 CTA vocabulary** and **addendum ›
    `service` schema**.
    → **weakened**. No rule names the visit-led Services and the schema has no CTA-label field,
    so "Solicita una visita técnica" may never render.
    → addendum › `service` schema (optional CTA label/variant) or EXPERIENCE › IA › Services
    (mark visit-led rows)
    → **low**

11. **EXPERIENCE › IA › Services row 3** ("5 (see note)") vs **PRD §2.4 / §4.3** (hook leads
    through the named Sub-service; Puesta en marcha via load/continuity/grounding tests and
    *Validación de calidad de energía*).
    → **weakened**. Rows 1–2 state which Sub-service comes first; row 3 does not.
    → EXPERIENCE › IA › Services row 3 (state first Sub-service)
    → **low**

12. **PRD §2.4 Buyer risks** ("downtime, failed inspections, CFE penalties, and safety
    incidents") vs **EXPERIENCE › Voice and Tone** (Hero lead names three; safety dropped).
    → **weakened** (qualitative intent dropped by UX).
    → EXPERIENCE › Voice and Tone (place safety, e.g. Instalaciones/Puesta en marcha copy or
    Nosotros "Seguridad")
    → **low**

13. **PRD FR-20 / FR-3** ("The Contact section and the footer show the contact name") vs
    **DESIGN › Components › Footer** (Legal identity, email + phone, year, notice link; no
    contact name) and EXPERIENCE › IA › Footer ("channels").
    → **contradicts** (minor).
    → DESIGN › Components › Footer (add contact name) or PRD FR-20 (Contact section only)
    → **low**

14. **Service names verbatim**: PRD §1 Vision paraphrases the four Services ("engineers,
    installs, commissions, and validates … and offers data services") rather than naming
    them; EXPERIENCE › Open Q5 abbreviates "Desarrollo e Ingeniería". §2.3, §2.4, §3, FR-5,
    addendum use the exact names; FR-7, §8, §9 name none.
    → **weakened** (cosmetic; no contradiction).
    → PRD §1 (optional: cite §3 Service names); EXPERIENCE › Open Q5 (full name)
    → **low**

## Confirmed carried (≤ 8)

1. **Part B rows 1–25** (PRD body) all resolved: §1 (Services + phone path), UJ-1/UJ-2 (new
   Service names, Instalaciones filter), §2.4 hooks, §3 Service/Lead/Copy-address fallback,
   §4.1 + FR-1 + FR-3 (anchors incl. `#nosotros`, footer channels), §4.4/FR-8 launch rule,
   FR-19 Clientes, FR-15/FR-16/NFR-5 lists, §8.1, §8.3, SM-1, Q2, Q7.
2. **Part B rows 26–27** (addendum): schemas add `nosotros`, `client`, `site` (contact name,
   published phone, optional Legal identity), `project` photo `alt`/`source`/`license` + optional
   scope/outcome; JSON-LD `telephone` and spam note limited to published channels.
3. **4 Services verbatim** in §2.3, §2.4, §3, addendum; former-Service → Sub-service mapping
   matches EXPERIENCE › IA note; FR-5 optional image band = DESIGN Service card band.
4. **Project → Service mapping**: PRD Q10 (7 Instalaciones / 2 Puesta en marcha / 0 / 0, no
   chip for empty Services) = EXPERIENCE › IA › Projects and Flow 2 ("7 proyectos").
5. **Behaviour models**: addendum's 13 IDs = EXPERIENCE Foundation table's 13 IDs exactly
   (incl. `service-card-disclosure`, `project-carousel`, `direct-contact-links`); static set
   agrees (Nosotros, Trust items, Clientes list).
6. **Sections/nav**: `#servicios`, `#proyectos`, `#nosotros`, `#confianza`, `#contacto`, same
   order as EXPERIENCE header links; hidden section drops its link (FR-10, FR-18).
7. **Interaction decisions**: Contact composer slide-in ≥ 768 / full-screen sheet < 768 (§3,
   §4.7); Project carousel one photo at a time, non-swipe path, "{i} de {n}" announced, no
   autoplay, no controls for one photo (FR-8); direct `mailto:` tagged "[kvainstalaciones.mx]
   Contacto" (FR-13, FR-20, addendum), copy control the only untagged path.
8. **Legal identity interim** consistent across PRD §3, FR-3, §4.8, §6, §8.3, Q6, addendum and
   EXPERIENCE › State Patterns (Footer) + Open Q2: "kVA Instalaciones" + proyectos1@,
   non-blocking; Clientes permission flag (FR-19) matches EXPERIENCE Trust/State rules.
