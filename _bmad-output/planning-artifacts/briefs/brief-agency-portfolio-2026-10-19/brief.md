---
title: "Product Brief: kVA Instalaciones Landing Page"
status: final
created: 2026-10-19
updated: 2026-10-21
---

# Product Brief: kVA Instalaciones Landing Page

## Executive Summary

**kVA Instalaciones** (short name **kVA**) is a Mexican electrical engineering contractor. It builds
enterprise-grade electrical installations and structured cabling, and offers power consumption
analysis and data services. It needs a public, Spanish-language (es-MX) landing page at
**kvainstalaciones.mx** that gets the right buyer to email kVA about a project.

The page is purely promotional: one static page that explains what kVA does and shows it can be
trusted with critical installations. Every section leads to a single action: contact kVA. There
is no portal, no shop, and no blog. The page is built from Markdown docs in the repository, which
are the single source of truth for what kVA says about itself.

The bar is modest and concrete: at least one qualified lead per month, from a page that a
facilities manager or plant engineer trusts within seconds.

## The Problem

Enterprise buyers of electrical work are buying risk reduction: avoiding downtime, failed
inspections, CFE (Mexico's state power utility) penalties, and safety incidents. They find
contractors through search and referrals, and they shortlist the ones that *look* competent and
compliant.

Today kvainstalaciones.mx shows an unfinished "sitio web en construcción" template full of
placeholder text. A referred buyer who looks kVA up finds nothing to confirm the recommendation,
and a buyer searching for a contractor never finds kVA at all. Competitors already show their
standards (NOM-001-SEDE-2012, the national standard for electrical installations), registrations,
and certifications on landing pages built for quote requests.

## The Solution

A single-page, mobile-first site in Spanish, published at kvainstalaciones.mx. It uses the full
name "kVA Instalaciones" for the brand and in legal text, and "kVA" in running copy. The page has
five sections, and contact is always one step away from any of them:

- **Hero.** A clear statement of what kVA does and for whom, with a prominent contact call to
  action.
- **Services.** Structured cabling, electrical installations, power consumption analysis, and
  data services. The list is built from content docs and is easy to extend as the offer grows.
- **Projects.** A grid of project references, filterable by category, that shows the kind of work
  kVA does. It launches with placeholders. `[ASSUMPTION]` Real projects are added as kVA supplies
  them.
- **Trust.** Years in business (3+), standards followed, and certifications or registrations
  once kVA confirms them.
- **Contact.** A short form that reaches kVA by email, plus the visible address
  proyectos1@kvainstalaciones.mx. The form
  collects only what is needed to qualify a lead, under an up-to-date privacy notice (*aviso de
  privacidad*).

## What Makes This Different

Honestly, not much yet, and the brief should not invent a moat. The only differentiator kVA has
stated is **3+ years in business**. The credible angle is **enterprise-grade work done to
standard**: installations that pass inspection and avoid CFE penalties. That angle holds only if
the page can show evidence (standards, registrations, real projects). Gathering that evidence is
the main content task before launch (see Risks).

## Who This Serves

- **Facilities and maintenance managers** keep buildings running. They need a contractor who
  installs to code and doesn't cause downtime.
- **Plant and industrial engineers** care about power quality, consumption, and penalties. They
  are the natural buyers of power consumption analysis.
- **Construction general contractors and developers** need a reliable electrical and cabling
  subcontractor for new builds.

Coverage is nationwide across Mexico. Formal purchase often goes through procurement, so the page
must also give enough substance to pass a shortlist review.

## Success Criteria

- **At least 1 qualified lead per month** reaches kVA by email, within 3 months of launch.
  `[ASSUMPTION]` Counted from kVA's inbox; no analytics stack is required in v1.
- Every section of the page has a visible path to contact (design intent: every visitor is one
  step from contacting kVA).
- The page loads fast on mobile within the project's build budgets and meets WCAG 2.2 AA.
- A developer can add or change a service or project by editing a Markdown doc and rebuilding,
  with no code changes.

## Scope

**In (v1):** one static, Spanish-only promotional page at kvainstalaciones.mx (Hero, Services,
Projects, Trust, Contact); content kept as Markdown docs in the repo; contact form delivered by
email; privacy notice; placeholder project content.

**Out (v1):** blog or news; client portal or login; online payments or e-commerce; English
version `[ASSUMPTION]`; CMS or self-service editing (content changes go through a developer).

## Risks and Open Questions

- **Proof content is missing.** Placeholder projects weaken credibility for a risk-averse buyer.
  Before launch, kVA needs to supply real projects, photos, client names (with permission), and
  standards or registrations it can prove (for example, REPSE, the government register of
  specialized service contractors).
- **Email first, WhatsApp later.** Research shows click-to-WhatsApp converts much better than
  forms in Mexican B2B. v1 is email-led, with a WhatsApp placeholder that switches on once kVA
  supplies a number.
- **"Data services"** means data analytics, business intelligence (BI), and IT data management.
- **Domain and hosting.** kvainstalaciones.mx is live with a placeholder page that this site
  replaces. Who controls DNS and the current host, and whether to keep that host, is unknown.
- **Legal.** The privacy notice must follow the 2025 reform of the LFPDPPP (Mexico's federal
  personal-data protection law).

## Vision

If the page works, it becomes kVA's credibility anchor. Referrals land on it, quotes link to it,
and new services and projects are added by editing docs. Possible next steps are a page per
service for search reach, an English version for multinational clients, and WhatsApp contact,
but only once real leads show what buyers respond to.
