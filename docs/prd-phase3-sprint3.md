# Emergency Kit Builder — Phase 3 Sprint 3A PRD: The Amazon Layer

**Prepared by:** John, Product Manager
**Date:** 2026-04-14
**Version:** 1.0
**Status:** Draft — Ready for Architect and PO Review

---

## 1. Intro Project Analysis and Context

### Analysis Source

IDE-based analysis using existing project documentation: `docs/prd-phase3.md` (v1.1), `docs/architecture.md`, `src/data/kitItems.ts`, and Sprint 3 planning documents: `docs/sprint-3-pm-brief.md`, `docs/sprint-3-product-catalog.md`, `docs/sprint-3-mcq-mapping.md`, `docs/sprint-3-spike-criteria.md`.

### Current Project State

- **Primary Purpose:** A client-side React SPA guiding homeowners through building a personalized emergency preparedness kit mapped to a physical modular storage system.
- **Current Tech Stack:** Vite 6.x + React 18.x + TypeScript 5.x strict + Tailwind CSS v4 + Zustand 5.x + React Router 6.4+ + Vitest + Playwright + Vercel.
- **Architecture Style:** Single-Page Application, fully client-side, no backend, localStorage-persisted state.
- **Deployment:** Static SPA on Vercel with branch preview deployments.
- **Sprint 2 Status:** Complete. Full kit-building flow is end-to-end functional: MCQ (2 screens) captures emergency type + household composition, fork screen offers Essentials and Build My Own paths, both paths reach Review & Order, Order Confirmation includes "Now Let's Fill Your Kit" CTA — the entry point to Sprint 3.

### Enhancement Scope Definition

**Enhancement Type:** New Feature Addition — new screen, new data layer, first external integration point (Amazon affiliate links).

**Enhancement Description:** Sprint 3A adds the "Fill Your Kit" experience — Part 2 of the product vision. After completing their kit order, users are guided to fill each subkit with real Amazon products via affiliate links. This sprint delivers a demonstrable prototype with stakeholder-curated static product data (31 items, 9 categories), MCQ-informed subkit display ordering, conditional item/category gates, and structurally correct affiliate links. A parallel research-only API spike assesses Amazon Cart API and PA-API 5.0 for potential Sprint 3B integration. No backend is introduced. No dynamic API data. No purchasing on-site.

**Impact Assessment:** Moderate Impact — one new screen, one new data file, one new utility, MCQ store integration for ordering logic, and data cleanup in `kitItems.ts`. All changes are additive. The existing kit-building flow is unaffected.

### Goals

- Demonstrate the complete Part 2 user experience: build kit, order, fill kit with Amazon products
- Prove the affiliate link monetization model is visible and credible to a stakeholder watching a demo
- Surface MCQ-informed product recommendations ordered by emergency type relevance
- Gate MCQ-conditional items (kids poncho, pets category) behind household composition answers
- Assess feasibility of Amazon Cart API and PA-API 5.0 via research-only spike
- Clean up data inconsistencies in `kitItems.ts` identified during product curation

### Background Context

Sprints 1 and 2 delivered the complete kit-building flow from MCQ intake through order confirmation. Sprint 3A picks up from the "Now Let's Fill Your Kit" CTA on the Order Confirmation screen. For the first time, users see real Amazon products mapped to their configured subkits — each with an affiliate link that opens Amazon in a new tab.

This is scoped as a **demonstrable prototype**. Stakeholder-curated product data is served from a static TypeScript data file. Prices are point-in-time snapshots. Affiliate links are structurally correct but may not earn commissions until an Amazon Associates account is approved. The prototype proves the business model is visible — conversion rates, real-time pricing, and actual revenue generation are post-prototype concerns.

A parallel API spike assesses whether Amazon's Cart API and PA-API 5.0 are viable for Sprint 3B. The spike is research-only with defined exit criteria. Sprint 3B scope is contingent on these results.

### Change Log

| Change | Date | Version | Description | Author |
|--------|------|---------|-------------|--------|
| Initial draft | 2026-04-14 | 1.0 | Sprint 3A PRD — Amazon affiliate layer | John, PM |

---

## 2. Requirements

### Functional Requirements

**Product Data Layer**

- **FR1:** A new static TypeScript data file (`src/data/amazonProducts.ts`) shall define all 31 stakeholder-curated Amazon products with the following fields per item: `id`, `categoryId` (maps to existing subkit category), `kitItemId` (maps to existing `kitItems.ts` item), `name`, `asin`, `price`, `brand`, `amazonUrl`, `imageSrc` (local path to downloaded product image).
- **FR2:** Product data shall be importable as a typed module by any component. The data structure shall support filtering by `categoryId`.
- **FR3:** Product prices are static point-in-time values. No dynamic pricing, no strikethrough/list pricing, no availability indicators.

**Affiliate Link Infrastructure**

- **FR4:** A utility function (`src/utils/affiliateLink.ts`) shall construct Amazon affiliate URLs in the format: `https://www.amazon.com/dp/{ASIN}?tag={AFFILIATE_TAG}`.
- **FR5:** The affiliate tag shall be read from a configuration constant (not hardcoded in the utility). A placeholder tag value shall be used until the Amazon Associates account is confirmed.
- **FR6:** All affiliate links shall open in a new browser tab (`target="_blank"` with `rel="noopener noreferrer"`).

**"Fill Your Kit" Screen**

- **FR7:** A new "Fill Your Kit" screen shall be created, accessible from the "Now Let's Fill Your Kit" CTA on the Order Confirmation screen.
- **FR8:** The screen shall display product recommendations organized by subkit category. Each category is presented as a collapsible section with the category name, icon, and color.
- **FR9:** Each product recommendation shall display as a card showing: product image, product name, brand, price, and a "View on Amazon" CTA that opens the affiliate link in a new tab.
- **FR10:** Subkit categories shall be displayed in an order determined by the user's MCQ emergency type selection, per the mapping rules defined in `docs/sprint-3-mcq-mapping.md`.

**MCQ-Informed Ordering**

- **FR11:** The subkit display order shall be determined by the user's first selected emergency type (`emergencyTypes[0]` from MCQ store). Each emergency type defines a top-3 priority ordering. Remaining subkits follow the default order.
- **FR12:** The priority orderings are:

| Emergency Type | #1 | #2 | #3 |
|----------------|----|----|-----|
| Hurricane | Power | Medical | Communications |
| Flood | Power | Clothing | Medical |
| Tornado | Power | Cooking | Medical |
| Tropical Storm | Power | Medical | Communications |

- **FR13:** The default subkit order (for positions after the top 3) is: Power, Medical, Communications, Lighting, Cooking, Hygiene, Comfort, Clothing, Custom. Pets is always last when shown.
- **FR14:** If no emergency type is selected (edge case), the default order applies in full.

**MCQ-Conditional Items and Categories**

- **FR15:** The Pets category (2 items: Pet First Aid Kit, Collapsible Bowl) shall only be displayed if `householdComposition` includes `'pets'`.
- **FR16:** The "Rain Poncho (Kids)" item in the Clothing category shall only be displayed if `householdComposition` includes `'kids'`.
- **FR17:** Older Adults and Disability household options have no product-level effect in Sprint 3A.

**Data Cleanup in kitItems.ts**

- **FR18:** The following renames shall be applied in `kitItems.ts`:

| Current Name | New Name | Item ID |
|--------------|----------|---------|
| Paper Cups | Paper Plates & Utensils | hygiene-cups |
| Feminine Hygiene Products | Feminine Hygiene Kit | hygiene-feminine |
| Pet Water & Bowl Kit | Collapsible Bowl | pets-water |
| Pet First Aid & Comfort Kit | Pet First Aid Kit | pets-first-aid |

- **FR19:** The "Pet Food Supply (3-Day)" item (`pets-food`) shall be removed from `kitItems.ts`.
- **FR20:** A new item "Rain Poncho (Kids)" shall be added to the Clothing category in `kitItems.ts` (ASIN: B07QCVMCF8, price: $12.99).

**API Feasibility Spike**

- **FR21:** A research-only spike shall assess Amazon Cart API and PA-API 5.0 feasibility per the exit criteria defined in `docs/sprint-3-spike-criteria.md`.
- **FR22:** The spike deliverable is a single document (`docs/sprint-3-api-spike-results.md`) with go/no-go on each API and architecture recommendations.
- **FR23:** No implementation code is produced by the spike. Sprint 3B scope is contingent on the results.

### Non-Functional Requirements

- **NFR1:** The product data file is a static TypeScript module. No API calls, no fetch requests, no async data loading. Same pattern as existing `kitItems.ts`.
- **NFR2:** Product images are downloaded locally and served as static assets. No hotlinking from Amazon CDN.
- **NFR3:** The affiliate link utility is a pure function with no side effects. Covered by unit tests.
- **NFR4:** The "Fill Your Kit" screen reads MCQ state from the existing `mcqStore`. No new Zustand store is created.
- **NFR5:** All new components conform to coding standards in `docs/architecture.md` Section 11.
- **NFR6:** All interactive elements meet WCAG 2.1 AA: keyboard navigable product cards, appropriate ARIA attributes on links, sufficient color contrast.
- **NFR7:** The "Fill Your Kit" screen is responsive: category sections stack vertically, product cards reflow in a grid (3-column desktop, 2-column tablet, 1-column mobile).

### Compatibility Requirements

- **CR1:** The existing kit-building flow (MCQ → Fork → Build/Order → Confirmation) is unaffected. Sprint 3A adds a new screen accessible from the Order Confirmation CTA.
- **CR2:** The existing MCQ store shape is unchanged. Sprint 3A reads from `emergencyTypes` and `householdComposition` — no new fields added.
- **CR3:** Changes to `kitItems.ts` (renames, removal, addition) are data-only. The `KitItem` type shape is unchanged. Existing consumers are unaffected because they reference item IDs, not display names.
- **CR4:** No new environment variables. The affiliate tag is a code-level constant, not a runtime config.

---

## 3. User Interface Enhancement Goals

### New Screens

| Screen | Route | Description |
|--------|-------|-------------|
| Fill Your Kit | `/fill` | MCQ-ordered product recommendations per subkit with affiliate links |

### Modified Screens

| Screen | Change |
|--------|--------|
| Order Confirmation | "Now Let's Fill Your Kit" CTA routes to `/fill` (may already be wired — verify) |

### "Fill Your Kit" Screen Design

**Layout:**
- Page header: "Fill Your Kit" with subtitle explaining the user is now shopping for items to put in their subkits
- Category sections displayed vertically, each collapsible
- Each section header shows: category color bar, category icon, category name, item count, expand/collapse toggle
- First 3 categories expanded by default (these are the MCQ priority categories), remainder collapsed

**Product Cards:**
- Grid layout within each category section (3-col desktop, 2-col tablet, 1-col mobile)
- Each card: product image (square, consistent size), product name, brand name (muted), price (prominent), "View on Amazon" CTA button
- CTA opens affiliate link in new tab
- Cards use existing design token system — `neutral-100` background, `radius-md`, subtle border, hover elevation

**Empty States:**
- If a conditional category has no items to show (e.g., Pets with no pets selected), the category section is not rendered at all — not shown as empty

### UI Consistency Requirements

- Category color bars match the existing `colorBase` values from `kitItems.ts` `CATEGORIES`
- Product cards follow the same card pattern (padding, border radius, shadow) used elsewhere in the app
- Typography uses existing scale: product name in `text-body`, brand in `text-caption`, price in `text-body font-semibold`
- CTA button uses existing button component patterns with `brand-accent` color

---

## 4. Technical Constraints and Integration Requirements

### Existing Technology Stack

| Category | Technology | Version | Sprint 3A Usage |
|----------|-----------|---------|-----------------|
| Language | TypeScript | 5.x strict | All new code; strict: true mandatory |
| Framework | React | 18.x | 1 new screen; new ProductCard, CategorySection components |
| Build Tool | Vite | 6.x | No new env vars |
| Styling | Tailwind CSS | v4.x | New screen; dynamic category colors via inline styles |
| State Management | Zustand | 5.x + persist | Reads from existing mcqStore; no new store |
| Routing | React Router | 6.4+ | 1 new route (`/fill`) |
| Testing (Unit) | Vitest + RTL | 2.x / 16.x | New tests for affiliate utility, ordering logic, conditional gates |
| Testing (E2E) | Playwright | latest | New E2E: Order Confirmation → Fill Your Kit → verify product cards and links |
| Deployment | Vercel | — | No new env vars; existing pipeline |

### Integration Approach

- **Product data file:** New `src/data/amazonProducts.ts` — static typed array of product objects. Imports category IDs from `kitItems.ts` for type safety. Same module pattern as existing data files.
- **Affiliate utility:** New `src/utils/affiliateLink.ts` — pure function. Accepts ASIN and tag, returns full URL. Tag constant defined in same file or a config file.
- **Subkit ordering utility:** New `src/utils/subkitOrdering.ts` — pure function. Accepts `emergencyTypes[0]` from MCQ store, returns ordered array of category IDs. Encapsulates the priority mapping tables and default order.
- **Conditional item filtering:** Logic in the Fill Your Kit screen component. Reads `householdComposition` from MCQ store. Filters products before render: hide Kids poncho if no kids, hide Pets category if no pets.
- **Route addition:** One new route `/fill` added to React Router config. Order Confirmation CTA wired to navigate here.
- **kitItems.ts changes:** Renames, one removal, one addition. Type shape unchanged. All changes are to data values only.

### New Files

| File | Purpose |
|------|---------|
| `src/data/amazonProducts.ts` | Static product catalog — 31 items with ASINs, prices, image paths |
| `src/utils/affiliateLink.ts` | Affiliate URL construction utility |
| `src/utils/subkitOrdering.ts` | MCQ-driven subkit ordering logic |
| `src/components/fill/FillYourKitScreen.tsx` | Main screen at `/fill` |
| `src/components/fill/CategorySection.tsx` | Collapsible category section with product grid |
| `src/components/fill/ProductCard.tsx` | Individual product card with affiliate CTA |
| `src/assets/products/` | Directory for downloaded product images (31 images) |

### Modified Files

| File | Change |
|------|--------|
| `src/data/kitItems.ts` | Renames (4), removal (1), addition (1) per FR18-FR20 |
| `src/router/index.tsx` | Add `/fill` route |
| Order Confirmation screen | Wire "Fill Your Kit" CTA to `/fill` (verify if already stubbed) |

### Risk Assessment

| Area | Risk | Mitigation |
|------|------|------------|
| kitItems.ts renames | Low | Name changes only; item IDs unchanged; existing consumers unaffected |
| kitItems.ts removal (pets-food) | Low | Verify no existing test or component references this item by ID |
| Static product images | Low | Downloaded once; served as static assets; no external dependency |
| Affiliate tag placeholder | Low | Structurally correct links work without approved account |
| MCQ ordering logic | Low | Pure function; fully unit-testable; mapping table is small and static |
| Conditional item gates | Low | Simple boolean checks against MCQ store values |

---

## 5. Epic and Story Structure

Three epics, partially parallelizable.

- **Epic 17 — Product Data & Affiliate Infrastructure:** Static product data file, affiliate link utility, subkit ordering utility, and kitItems.ts data cleanup. Foundation for the Fill Your Kit screen. Stories 17.1 and 17.2 can run in parallel; 17.3 depends on both.
- **Epic 18 — Fill Your Kit Screen:** The main new screen with MCQ-ordered category sections, product cards, conditional gates, and affiliate CTAs. Depends on Epic 17.
- **Epic 19 — Amazon API Feasibility Spike:** Research-only assessment of Cart API and PA-API 5.0. Runs in parallel with Epics 17-18. No code deliverable.

---

## 6. Epic Details

### Epic 17: Product Data & Affiliate Infrastructure

**Epic Goal:** Establish the static product data layer and affiliate link infrastructure that the Fill Your Kit screen consumes. Clean up data inconsistencies in kitItems.ts identified during product curation.

---

#### Story 17.1 — kitItems.ts Data Cleanup: Renames, Removal, and Addition

As a developer,
I want the kit items data updated to reflect the curated product catalog,
so that item names match their real Amazon products and the data is accurate for Sprint 3A.

**Acceptance Criteria:**

1. The following items are renamed in `kitItems.ts` (name field only — IDs unchanged):
   - `hygiene-cups`: "Paper Cups" → "Paper Plates & Utensils"
   - `hygiene-feminine`: "Feminine Hygiene Products" → "Feminine Hygiene Kit"
   - `pets-water`: "Pet Water & Bowl Kit" → "Collapsible Bowl"
   - `pets-first-aid`: "Pet First Aid & Comfort Kit" → "Pet First Aid Kit"
2. Item `pets-food` ("Pet Food Supply (3-Day)") is removed from the `ITEMS` array.
3. A new item is added to the Clothing category:
   - ID: `cloth-ponchos-kids`
   - Name: "Rain Poncho (Kids)"
   - categoryId: `clothing`
   - All standard fields populated (weightGrams, volumeIn3, pricePlaceholder: 12.99)
   - `productId: null`, `imageSrc: null` (populated in Story 17.2)
4. `tsc --noEmit` passes. All existing tests pass. Any test referencing "Paper Cups", "Pet Food Supply", or renamed items by display name is updated.
5. No item IDs are changed. No type shape changes.

---

#### Story 17.2 — Static Product Data File and Affiliate Link Utility

As a developer,
I want a typed static data file mapping all 31 Amazon products to their subkit categories with ASINs, prices, and images, and a utility to construct affiliate links,
so that the Fill Your Kit screen has a complete data source and can generate working Amazon links.

**Acceptance Criteria:**

1. A new file `src/data/amazonProducts.ts` exports a typed array of product objects:
   ```ts
   export interface AmazonProduct {
     id: string;
     categoryId: string;        // matches CATEGORIES key
     kitItemId: string;         // matches ITEMS id in kitItems.ts
     name: string;
     asin: string;
     price: number;
     brand: string;
     imageSrc: string;          // local path to product image
     mcqCondition?: {           // optional MCQ gate
       field: 'householdComposition';
       includes: string;        // e.g., 'kids' or 'pets'
     };
   }
   ```
2. All 31 products from `docs/sprint-3-product-catalog.md` are defined with correct ASINs and prices.
3. Kids Rain Poncho has `mcqCondition: { field: 'householdComposition', includes: 'kids' }`.
4. All Pets category items have `mcqCondition: { field: 'householdComposition', includes: 'pets' }`.
5. Product images are downloaded and placed in `src/assets/products/` (or `public/products/`). One image per product, named by ASIN (e.g., `B082TMBYR6.jpg`).
6. A new file `src/utils/affiliateLink.ts` exports:
   ```ts
   export const AFFILIATE_TAG = 'placeholder-20'; // updated when Associates account confirmed
   export function buildAffiliateUrl(asin: string, tag?: string): string
   ```
   Returns `https://www.amazon.com/dp/${asin}?tag=${tag || AFFILIATE_TAG}`.
7. Unit tests cover: `buildAffiliateUrl` returns correct URL format, handles custom tag override, all 31 products have valid ASINs (non-empty, 10 chars), all products have `price > 0`, all products reference a valid `categoryId`.

---

#### Story 17.3 — Subkit Ordering Utility: MCQ-Driven Display Order

As a developer,
I want a utility that returns subkit categories in the correct display order based on the user's MCQ emergency type,
so that the Fill Your Kit screen can render categories in priority order.

**Acceptance Criteria:**

1. A new file `src/utils/subkitOrdering.ts` exports:
   ```ts
   export function getOrderedCategories(
     emergencyType: EmergencyType | undefined,
     householdComposition: HouseholdOption[]
   ): string[]
   ```
2. The function implements the priority mapping:

   | Emergency Type | #1 | #2 | #3 |
   |----------------|----|----|-----|
   | Hurricane | Power | Medical | Communications |
   | Flood | Power | Clothing | Medical |
   | Tornado | Power | Cooking | Medical |
   | Tropical Storm | Power | Medical | Communications |

3. After the top 3, remaining categories follow default order: Power, Medical, Communications, Lighting, Cooking, Hygiene, Comfort, Clothing, Custom. Categories already placed in top 3 are skipped.
4. Pets is appended last, only if `householdComposition` includes `'pets'`.
5. If `emergencyType` is undefined, the full default order is used.
6. Unit tests cover: each of the 4 emergency types produces correct ordering, undefined type uses default, Pets inclusion/exclusion based on household composition, no duplicate categories in output.

---

### Epic 18: Fill Your Kit Screen

**Epic Goal:** Deliver the "Fill Your Kit" screen — the primary Sprint 3A user-facing deliverable. Users see their subkits ordered by MCQ relevance, with product cards linking to Amazon via affiliate links. The business model is immediately visible.

---

#### Story 18.1 — Fill Your Kit Screen: Category Sections and Product Cards

As a user who completed my kit order,
I want to see product recommendations for each subkit organized by relevance to my emergency type,
so that I can browse and purchase the items I need on Amazon.

**Acceptance Criteria:**

1. A new screen `FillYourKitScreen` is created at route `/fill`.
2. The "Now Let's Fill Your Kit" CTA on Order Confirmation navigates to `/fill`.
3. The screen reads `emergencyTypes` and `householdComposition` from the MCQ store.
4. Subkit categories are displayed as vertical `CategorySection` components in the order returned by `getOrderedCategories(emergencyTypes[0], householdComposition)`.
5. Each `CategorySection` displays: category color bar (using `colorBase` from `CATEGORIES`), category icon, category name, product count badge, and an expand/collapse toggle.
6. The first 3 categories (MCQ priority) are expanded by default. Remaining categories are collapsed.
7. Within each expanded section, `ProductCard` components are displayed in a responsive grid (3-col desktop >=1024px, 2-col tablet >=640px, 1-col mobile).
8. Each `ProductCard` displays: product image, product name, brand (muted text), price (formatted as `$XX.XX`), and a "View on Amazon" CTA button.
9. The CTA calls `buildAffiliateUrl(product.asin)` and opens the result in a new tab with `rel="noopener noreferrer"`.
10. Products with `mcqCondition` are filtered: Kids Rain Poncho hidden if `householdComposition` does not include `'kids'`. Pets category hidden entirely if `householdComposition` does not include `'pets'`.
11. Accessibility: category sections use `<details>`/`<summary>` or equivalent ARIA pattern for expand/collapse. Product links have descriptive `aria-label` (e.g., "View Jackery Explorer on Amazon"). Images have `alt` text with product name.
12. Component tests cover: correct category ordering for each emergency type, expand/collapse behavior, product card rendering with all fields, affiliate link construction, conditional filtering for kids/pets, empty state (category not rendered when all items filtered out).
13. E2E test: complete flow from Order Confirmation → Fill Your Kit → verify at least one product card is visible with a working "View on Amazon" link.

---

### Epic 19: Amazon API Feasibility Spike

**Epic Goal:** Assess the feasibility of Amazon Cart API and PA-API 5.0 for potential Sprint 3B integration. Research only — no code deliverable.

---

#### Story 19.1 — Amazon Cart API and PA-API 5.0 Feasibility Assessment

As a product team,
we want a documented feasibility assessment of Amazon's Cart API and PA-API 5.0,
so that we can make an informed go/no-go decision on Sprint 3B scope.

**Acceptance Criteria:**

1. Winston (Architect) conducts research per the exit criteria in `docs/sprint-3-spike-criteria.md`.
2. A document is created at `docs/sprint-3-api-spike-results.md` containing:
   - Cart API: answers to all 5 exit criteria questions + go/no-go recommendation
   - PA-API 5.0: answers to all 6 exit criteria questions + go/no-go recommendation
   - Architecture recommendations for Sprint 3B if either API is viable
   - Fallback confirmation if either API is not viable
3. No implementation code is produced.
4. Document is committed and available for Sprint 3B planning.

---

## 7. What the Prototype Does NOT Need to Prove

Per the original prototype success criteria — restated here for scope clarity:

- Conversion rates
- Fulfillment accuracy
- Real-time pricing correctness
- System performance under load
- Actual affiliate revenue generation
- Payment processing of any kind

These are all post-prototype concerns. Sprint 3A proves the business model is **visible and credible** to a stakeholder watching a demo.

---

## 8. Sprint 3B Forward Look (Contingent on Spike Results)

Sprint 3B is not scoped in this PRD. Its existence depends on Epic 19 results. Potential Sprint 3B stories if APIs are viable:

| Story Area | Condition |
|------------|-----------|
| PA-API integration — live product data | PA-API go |
| Cart API integration — "Add All to Cart" CTA | Cart API go |
| Backend proxy for API keys | Either API requires server-side auth |
| Per-product MCQ mapping (e.g., kid-sized items) | Deferred from 3A |
| Category consolidation review | Lean categories identified during curation |

If both APIs are no-go, Sprint 3B may be skipped entirely — the static affiliate link approach is sufficient for the prototype.

---

## 9. Reference Documents

| Document | Path |
|----------|------|
| Sprint 3 PM Brief | `docs/sprint-3-pm-brief.md` |
| Product Catalog | `docs/sprint-3-product-catalog.md` |
| MCQ Mapping Rules | `docs/sprint-3-mcq-mapping.md` |
| API Spike Criteria | `docs/sprint-3-spike-criteria.md` |
| Phase 3 Sprint 1 PRD | `docs/prd-phase3.md` |
| Architecture | `docs/architecture.md` |
| Kit Items Data | `src/data/kitItems.ts` |
| MCQ Store | `src/store/mcqStore.ts` |

---

*Emergency Prep Kit Builder — Phase 3 Sprint 3A PRD | John, PM | 2026-04-14*
