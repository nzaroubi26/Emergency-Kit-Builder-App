# Sprint 3 — PM Brief: The Amazon Layer

**Prepared by:** Sarah, Product Owner
**For:** John, Product Manager
**Date:** 2026-04-14
**Purpose:** Pre-planning brief to inform Sprint 3 PRD creation. Captures scope intent, decisions made, open questions, and recommended approach.

---

## 1. Context

Sprint 2 is complete. The full kit-building flow is now end-to-end functional:
- MCQ (2 screens) captures emergency type + household composition
- Fork screen offers Essentials (curated) and Build My Own (custom) paths
- Both paths reach Review & Order with accurate kit summaries
- Order Confirmation screen includes a "Now Let's Fill Your Kit" CTA — the entry point to Sprint 3

Sprint 3 picks up from that CTA. After a user has "ordered" their kit, they are guided to fill each subkit with actual products via Amazon. This is **Part 2** of the product vision.

---

## 2. Sprint 3 Intent

### What the user experiences

After completing their kit order, users see product recommendations for each subkit, informed by their MCQ answers. Each product links to Amazon via affiliate links. The user can browse recommended products per subkit and purchase on Amazon — no purchasing happens on our site.

### Primary deliverable

**Affiliate links** — every product recommendation links to Amazon with our affiliate tracking tag. This is the core monetization proof for the prototype.

### Secondary deliverable (spike)

**Amazon Cart API feasibility** — can we programmatically generate an Amazon cart pre-loaded with the user's recommended products? Winston assesses and reports go/no-go before any implementation begins.

---

## 3. Decisions Already Made

| # | Decision | Detail |
|---|----------|--------|
| D1 | Product sourcing is stakeholder-owned | The stakeholder will manually curate specific Amazon product links and images for each item across all 10 subkit categories. This is content work, not engineering. |
| D2 | MCQ-to-product mapping is a joint PO/PM exercise | John and the stakeholder will define the rules together. Some mappings are straightforward (e.g., "kids in household" → kid-sized headlamp in Lighting subkit). But the mapping only works after D1 is complete — general product mapping per subkit must come first. |
| D3 | Prototype-first scope | The prototype needs to demonstrate the business model, not prove conversion rates. A stakeholder should be able to look at the "Fill Your Kit" screen with product recommendations and immediately understand how monetization works. This is a narrative/demo metric. |
| D4 | Simplest viable link format first | Start with plain Amazon product URLs with an affiliate `tag=` parameter. The Amazon Product Advertising API (PA-API 5.0) is a separate feasibility question for Winston — it should be evaluated alongside the Cart API spike, not assumed as a requirement. |
| D5 | Cart API spike has defined exit criteria | Spike should answer: "Can we programmatically add N items to an Amazon cart without the user having pre-authenticated to Amazon?" Go/no-go reported before any Cart API implementation begins. |
| D6 | Fallback if Cart API is no-go | A manually constructed "Add all to Amazon" deep link (or individual product links) is the fallback. Both paths should be sketched at the story level before the sprint starts so we don't lose time pivoting mid-sprint. |
| D7 | Architecture decision deferred until feasibility is assessed | Sprint 3 is our first external API dependency. Whether this stays fully client-side or requires a lightweight backend/proxy depends on what the spike reveals. Don't pre-commit to an architecture — let Winston assess and recommend. |

---

## 4. Open Questions for John

These need answers before the Sprint 3 PRD can be written.

### Scope & Planning

| # | Question | Why It Matters |
|---|----------|---------------|
| Q1 | **Is this one sprint or two?** Sprint 3 as described packs four workstreams: (1) product data + MCQ mapping, (2) affiliate link infrastructure, (3) "Fill Your Kit" UI, (4) Cart API spike. Sprints 1 and 2 each had ~8-10 stories. | If this is overloaded, the spike risks crowding out the core deliverable (affiliate links). Consider: Sprint 3 = affiliate links + product UI with curated data; Sprint 4 = Cart API + dynamic recommendations. |
| Q2 | **Working prototype or demonstrable prototype?** If the goal is a stakeholder demo, we may not need real API integration at all — curated ASINs with hardcoded affiliate links would demonstrate the business model at dramatically lower scope and risk. | This is the single biggest scope lever. A demonstrable prototype could be 4-5 stories. A working prototype with API integration could be 12+. |
| Q3 | **How granular is the MCQ-to-product mapping?** Is it (a) same products for everyone, MCQ only affects subkit *surfacing order*, or (b) MCQ changes *which specific products* are recommended within a subkit, or (c) MCQ adds/removes *entire product slots*? | Option (a) is trivial. Option (b) requires a mapping matrix. Option (c) requires conditional product sets. The engineering lift is 10x different between these. |

### Amazon Integration

| # | Question | Why It Matters |
|---|----------|---------------|
| Q4 | **Is the Amazon Associates account set up?** Associates approval has lead time and requires minimum qualifying sales within 180 days to stay active. | For the prototype, affiliate links can be constructed without an approved account (the tag just won't earn commissions yet). But if the prototype is meant to demonstrate *actual* affiliate revenue flow, the account needs to exist. Confirm with the stakeholder whether prototype affiliate links need to be functional or just structurally correct. |
| Q5 | **Should Winston evaluate PA-API 5.0 alongside the Cart API spike?** The Product Advertising API provides programmatic access to product data (prices, images, availability). It requires an approved Associates account + API keys and has rate limits. | If we want *dynamic* product data (live prices, availability badges, reviews), PA-API is the path. If we're using curated/static product data (stakeholder-provided links + images), PA-API isn't needed for the prototype. This directly ties to Q2. |

---

## 5. Recommended Approach: Two-Phase Sprint 3

Based on the stakeholder's preference for low-risk, low-scope delivery, I recommend splitting the Amazon Layer into two phases:

### Sprint 3A — Demonstrable Prototype (low risk)

**Goal:** Stakeholder demo showing the complete Part 2 experience with curated data.

| Story Area | Description |
|------------|-------------|
| Product data file | Stakeholder-provided Amazon ASINs, product names, images, and prices mapped to each item in each subkit. Static TypeScript data file (same pattern as `kitItems.ts`). |
| "Fill Your Kit" screen | New screen showing product recommendations per subkit. Each product card displays image, name, price, and an "View on Amazon" affiliate link. |
| Affiliate link generation | Utility function that constructs Amazon URLs with affiliate `tag=` parameter. Links open Amazon in a new tab. |
| MCQ-informed ordering | MCQ answers determine the *order* subkits are presented (same surfacing logic as the visualizer). No per-product MCQ logic yet. |
| Cart API + PA-API spike | Winston assesses both APIs. Exit criteria defined. Go/no-go documented. |

**What this proves:** A stakeholder sees the full flow — build kit, order, fill kit with Amazon products. The business model (affiliate links) is immediately visible. The spike informs what comes next.

### Sprint 3B — Working Integration (if spike says go)

**Goal:** Dynamic product data and/or programmatic cart generation based on spike results.

| Story Area | Description |
|------------|-------------|
| PA-API integration (if viable) | Live product data replaces static file. Prices, availability, and images pulled from Amazon. May require backend proxy for API keys. |
| Cart API integration (if viable) | "Add All to Amazon Cart" CTA generates a pre-loaded cart. Fallback: deep link with individual ASINs. |
| MCQ-to-product mapping | Per-product recommendation logic based on MCQ answers (e.g., kids → kid-sized items). Requires mapping matrix from John + stakeholder. |

---

## 6. Pre-Sprint Actions

These should start **now**, before sprint planning.

| # | Action | Owner | Dependency | Target |
|---|--------|-------|------------|--------|
| A1 | Curate Amazon product links + images for all items across 10 subkit categories | Stakeholder | None | Before sprint planning |
| A2 | Confirm Amazon Associates account status — is one set up? If not, initiate signup. | Stakeholder + John | None | Before sprint planning |
| A3 | Define MCQ → product recommendation mapping rules (at least: is it ordering-only or per-product?) | John + Stakeholder | A1 (general mapping first) | Before sprint planning |
| A4 | Define Cart API + PA-API spike exit criteria with Winston | John + Winston | None | Before sprint planning |
| A5 | Answer Q1-Q5 above | John | A1-A4 inform answers | Before sprint planning |
| A6 | Create Sprint 3 PRD addendum | John | A5 | Sprint planning |
| A7 | Create Sprint 3 architecture brief | Winston | A4, A6 | After PRD |
| A8 | Create Sprint 3 front-end spec | Sally | A6, A7 | After architecture |

---

## 7. Data Dependencies Map

This visualization shows what blocks what:

```
Stakeholder curates products (A1)
    │
    ├──► John + Stakeholder define MCQ mapping rules (A3)
    │        │
    │        └──► PRD addendum (A6) ──► Architecture brief (A7) ──► UX spec (A8)
    │
    └──► Static product data file (Sprint 3A Story 1)
             │
             └──► "Fill Your Kit" UI (Sprint 3A Story 2)
                      │
                      └──► Affiliate link utility (Sprint 3A Story 3)

Winston spike (runs in parallel) ──► Go/No-Go ──► Sprint 3B scoping
```

**Critical path bottleneck:** A1 (product curation). Engineering cannot build the "Fill Your Kit" screen without knowing what products to show. This is the stakeholder's deliverable and it gates the sprint.

---

## 8. What the Prototype Does NOT Need to Prove

Per the original prototype success criteria — and restated here for John's framing:

- Conversion rates
- Fulfillment accuracy
- Real-time pricing correctness
- System performance under load
- Actual affiliate revenue generation
- Payment processing of any kind

These are all post-prototype concerns. Sprint 3 proves the *business model is visible and credible* to a stakeholder watching a demo.

---

*Emergency Prep Kit Builder — Sprint 3 PM Brief | Sarah, PO | 2026-04-14*
