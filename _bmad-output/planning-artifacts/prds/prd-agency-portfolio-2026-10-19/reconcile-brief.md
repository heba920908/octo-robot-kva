# Input Reconciliation: Product Brief → PRD

- **Input:** `briefs/brief-agency-portfolio-2026-10-19/brief.md` + `addendum.md` (final, updated 2026-10-21)
- **Target:** `prds/prd-agency-portfolio-2026-10-19/prd.md` + `addendum.md` (draft, updated 2026-10-21)
- **Excluded (superseded by `.memlog.md`):** proyectos1@ as lead address; `mailto:`-only contact (no form-to-email); composer fields limited to email + phone + Service; Projects filtered by Service rather than "category"; WhatsApp as hidden placeholder; generic privacy notice with non-blocking legal review; hosting/DNS deferred; data-services definition.
- **Result:** 19 gaps: 3 high, 7 medium, 9 low.

## Gaps

1. **Brief addendum, Power-analysis messaging:** "Cover the CFE GDMTH tariff (≥100 kW)… penalties for power factor below 90%… Código de Red" → **weakened**. GDMTH and the power-factor penalty appear only in the UJ-1 narrative. No FR, Content-doc requirement, or copy guidance asks the *Análisis de consumo eléctrico* Service to address demand and time-of-use charges, PF < 90 % penalties, harmonics, or Código de Red, or to use the hook "evita penalizaciones de factor de potencia". The PRD also says it "does not repeat its market research", so `bmad-ux` and the copywriters get no messaging input. → Add to §4.3 Services, either in the description or as a consequence on the power-analysis Service doc, and add an addendum section "Copy and messaging guidance". → **high**

2. **Brief addendum, Trust signals:** "UVIE-verifiable work… REPSE registration number… Panduit, Siemon, CommScope… BICSI, TIA/EIA-568; ISO 9001; Fluke test reports" → **missing / weakened**. §4.5 names only NOM-001-SEDE-2012, and REPSE appears only as an example in §10 Q2. UVIE (required by CFE for high-voltage and public-venue connections), manufacturer certifications, BICSI, TIA/EIA-568, ISO 9001, and Fluke certification reports are absent. Nothing tells kVA which proofs to gather or tells the Trust schema which item types to support. REPSE verifiability (a number checkable on gob.mx/repse) is also lost. → In §4.5 Trust, list candidate Trust item types and add an optional `verificationUrl`/registration-number field. Expand §10 Q2 into a proof-gathering checklist. → **high**

3. **Brief, Risks:** "Placeholder projects weaken credibility for a risk-averse buyer. Before launch, kVA needs to supply real projects…" → **weakened**. The PRD has no Risks section. §10 Q2 reframes proof content as "needed before Placeholder projects are replaced" instead of a pre-launch task, and no launch-readiness criterion exists (for example, a minimum number of real Projects or confirmed Trust items beyond years in business). The brief calls gathering evidence "the main content task before launch". → Add a §Risks section or a launch-readiness checklist, and restate Q2 as pre-launch. → **high**

4. **Brief, What Makes This Different:** "enterprise-grade work done to standard: installations that pass inspection and avoid CFE penalties" → **weakened**. §1 Vision keeps "serious electrical work, to standard" but drops "pass inspection and avoid CFE penalties" as the stated positioning. It also drops the caveat that the angle "holds only if the page can show evidence" and the rule that the brief "should not invent a moat". FR-10 enforces evidence-only claims for Trust items, but Hero and Service copy have no equivalent rule against unsupported claims. → Add a positioning statement to §1 Vision and a no-unsupported-claims rule for all copy to §4.8 or §6 Guardrails. → **medium**

5. **Brief, Executive Summary:** "a page that a facilities manager or plant engineer trusts within seconds" / credibility for "a risk-averse buyer" → **weakened**. Voice is specified only for the Hero ("in marketing tone", §4.2), and memlog sets tone = marketing. No voice guide reconciles marketing tone with the sober, technical, compliance-led credibility that risk-averse enterprise buyers and procurement expect. Examples would be: specific over superlative; standards and numbers over adjectives; usted vs tú register for es-MX B2B. → Add a "Content voice and tone" subsection to the PRD (§4.8 or new §4.10) or the addendum, as input to `bmad-ux`. → **medium**

6. **Brief, The Problem:** "buying risk reduction: avoiding downtime, failed inspections, CFE… penalties, and safety incidents" → **weakened**. §2.1's risk-reduction JTBD covers checking the contractor, not the buyer's operational risks. No requirement makes the Hero or Services copy speak to downtime, inspections, penalties, or safety. The facilities persona's "doesn't cause downtime" need is also dropped. → Add to the §4.2 Hero description (value statement addresses risk reduction) and §2.1 JTBD. → **medium**

7. **Brief addendum, Comparables / Buyer journey:** "Typical CTAs: 'Cotiza tu proyecto', technical site visit… technical visit before a quote" → **missing**. The FR-4 CTA is "Contáctanos o equivalente". The technical site visit, which is the standard MX next step, is not offered as a CTA, Lead intent, or email-body field, and the buyer journey (Google/referral → visita técnica → quote → procurement) is not stated. → Add to §4.2 FR-4 (CTA wording guidance) and §4.6 FR-11 (optional request type such as "visita técnica" or "cotización"), or record it as a §10 open question. → **medium**

8. **Brief, Who This Serves:** "Coverage is nationwide across Mexico." → **weakened**. Coverage appears only as `areaServed: MX` in JSON-LD (FR-16). No visible copy requirement states nationwide coverage, and UJ-1 (Querétaro) implies the buyer needs to know it. → Add to §4.2 Hero or §4.5 Trust as a content item. → **medium**

9. **Brief, Who This Serves:** "procurement… the page must also give enough substance to pass a shortlist review" → **weakened**. §2.1 mentions procurement shortlists and UJ-3 shows a GC shortlisting, but no FR defines shortlist-grade substance. Examples: legal entity name, years in business, coverage, verifiable registration numbers, a service scope detailed enough to compare vendors. → Add a consequence to §4.5 Trust or §4.1 FR-3 (footer legal identity), or a procurement-focused UJ. → **medium**

10. **Brief addendum, Legal:** "The privacy notice must be specific (no 'entre otros' catch-alls), with stated retention periods" → **weakened**. §6 lists retention and ARCO. The "no catch-all wording" requirement is missing, and the PRD addendum's privacy-notice content list omits retention, which is inconsistent with §6. → Add "specific, no catch-alls" to §6 Legal and add retention to the addendum privacy-notice bullet. → **medium**

11. **Brief, Executive Summary:** "trusts within seconds" (bar for success) → **weakened**. It appears as aspiration in §1, but §9 has no proxy measure, such as a 5-second test with target buyers or above-the-fold credibility content (logo, value statement, one proof point in the first viewport). → Add to §9 as a secondary metric or a UX validation step. → **low**

12. **Brief, Success Criteria:** "Every section of the page has a visible path to contact" → **weakened**. FR-2 delivers this through a persistent header CTA. No per-section CTA is required in Projects, the detail view, or Trust (the detail view in particular, where a buyer has just seen evidence). → Add a consequence to §4.4 FR-8 and §4.5, or state in FR-2 that the header CTA satisfies the criterion. → **low**

13. **Brief, Vision:** "becomes kVA's credibility anchor. Referrals land on it, quotes link to it" → **weakened**. Page-per-Service, English, and WhatsApp are carried (§8.2, §7, FR-17). Missing are the "credibility anchor" role (quotes and email signatures link to the page) and the gating condition "only once real leads show what buyers respond to". → Add to §1 Vision or §8.2. → **low**

14. **Brief addendum, Content SSOT:** "Open: Who edits the docs (kVA staff or the dev team), how edits are approved…" → **missing**. §4.8 says "a developer", but approval and sign-off of kVA claims (important given evidence-only Trust items) is not raised. → Add to §10 Open Questions. → **low**

15. **Brief addendum, Repo naming:** "Repo and workspace names still say 'agency-portfolio'… decide whether to rename them." → **missing**. → Add to §10 Open Questions or the addendum's technical notes. → **low**

16. **Brief addendum, Email delivery:** "the choice affects privacy-notice wording and spam protection" → **weakened**. The privacy wording is handled. Spam exposure of the always-visible plain-text address (FR-12, footer, JSON-LD), such as address harvesting, is not addressed. → Add to the addendum (mailto technical notes) or NFR-4. → **low**

17. **Brief, Risks:** "real projects, photos, client names (with permission)" → **weakened**. The Project detail view (FR-8) covers photos, scope, and outcome. There are no optional fields for client name (with permission flag), location, year, or standards applied, so the Project schema may not hold the proof the brief asks for. → Add to §4.4 FR-8 and the addendum's Content schema notes. → **low**

18. **Brief, The Solution:** "Trust. Years in business (3+), standards followed…" (always one of five sections) → **contradicts (minor)**. FR-10 hides the Trust section and its nav link if no item is confirmed. This conflicts with the brief's five-section page unless years in business and NOM-001 are seeded as confirmed at launch. → Add a consequence or assumption in §4.5 FR-10. → **low**

19. **Brief, The Problem:** "a buyer searching for a contractor never finds kVA at all" → **weakened**. FR-16 covers metadata, but no discoverability outcome is measured. SM-2 is only a Lighthouse SEO score, with no target such as "indexed and ranks for the brand name" or service + "México" terms. → Add to §9 as a secondary metric. → **low**

## Confirmed as carried

1. Production domain kvainstalaciones.mx used for canonical, Open Graph, sitemap, and structured data (FR-16).
2. Single es-MX, mobile-first page with Hero, Services, Projects, Trust, and Contact (§4, §8.1).
3. Markdown Content docs as the single source of truth, schema-validated at build time, with no page-side copy (FR-15, addendum).
4. Extensible Services and Projects changed by doc edit only, with no code change (FR-5, SM-3, NFR-5).
5. Placeholder projects validate against the schema and are honestly labelled "Ejemplo Ilustrativo" (FR-9).
6. Trust shows 3+ years and NOM-001-SEDE-2012, with certifications only once confirmed (§4.5, FR-10).
7. Success criterion of ≥1 qualified lead per month within 3 months, counted from the inbox with no analytics (SM-1, §7).
8. Fast mobile load within `angular.json` budgets and WCAG 2.2 AA (NFR-1, NFR-2, SM-2).
9. v1 exclusions carried: no blog, portal, payments, CMS, or English version, and the architecture does not rule English out (§7).
10. Naming carried: "kVA Instalaciones" in the title, footer, and legal text; "kVA" in running copy with lowercase k (FR-3). LFPDPPP 2025 compliance carried: SABG and ARCO (§6).
