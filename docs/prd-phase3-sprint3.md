# Emergency Kit Builder — Phase 3 Sprint 3A PRD: The Amazon Layer

**Prepared by:** John, Product Manager
**Date:** 2026-04-14
**Version:** 1.3
**Status:** Draft — Ready for Sharding and Story Writing

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
| Spike integration | 2026-04-14 | 1.1 | Updated with spike results: Add to Cart URL (GO) absorbed into Epic 17/18, PA-API (NO-GO) confirmed, Sprint 3B section updated | John, PM |
| PO review pass | 2026-04-14 | 1.2 | 14 flags from Sarah (PO): expanded FR18 renames to 9, added FR9 clarification, FR30 (selected subkits filter), FR31 (route guard), stub modal rewiring AC, Custom removed from display order, pricePlaceholder sync, image location deferred to Winston, Story 18.1 split into 18.1+18.2, icon override + missing image notes | John, PM |
| Cross-doc review | 2026-04-14 | 1.3 | Sally (UX) cross-doc review: fixed FR31 dual-path route guard (Essentials path was broken), fixed FR30 dual-path category source, resolved image storage to `public/products/` (per Winston Section 6), added PawPrint icon resolver to Story 17.1 AC, added MOBILE_EXEMPT_ROUTES to Story 18.1 AC, added CTA top+bottom placement/image fallback/hover states to Story 18.2 AC, added `guards.ts`/`AppShell.tsx`/`iconResolver.ts` to modified files, clarified image download as dev task in Story 17.2 | Sally, UX Expert |

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
- **FR9:** Each product recommendation shall display as a card showing: product image, generic product name (e.g., "Portable Power Station" — NOT the full Amazon listing title), brand as a separate muted text field (e.g., "Jackery Explorer"), price, and a "View on Amazon" CTA that opens the affiliate link in a new tab.
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

- **FR13:** The default subkit order (for positions after the top 3) is: Power, Medical, Communications, Lighting, Cooking, Hygiene, Comfort, Clothing. Pets is always last when shown. Custom is excluded — it has no Amazon products.
- **FR14:** If no emergency type is selected (edge case), the default order applies in full.

**Selected Subkit Filtering**

- **FR30:** The Fill Your Kit screen shall only display product sections for the user's active subkit categories. For the **Custom path**, these are the categories in `kitStore.selectedSubkits`. For the **Essentials path**, these are the categories in the static `ESSENTIALS_BUNDLE` (Power, Cooking, Medical, Communications). If a Custom user selected Power, Medical, and Cooking, only those 3 categories' products are shown — not all 9.

**Route Guard**

- **FR31:** The `/fill` route shall have a dual-path route guard. The guard passes if `kitPath === 'essentials'` (Essentials users have an empty `selectedSubkits` by design — they use the static `ESSENTIALS_BUNDLE`) OR if `kitStore.selectedSubkits` is non-empty (Custom path). If neither condition is met, redirect to `/`. See Winston's architecture brief Section 7 for the full guard behavior matrix.

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
| Flashlights | Flashlight | light-flashlight |
| Electric Lanterns | Electric Lantern | light-lantern |
| Power Banks | Power Bank | power-banks |
| Ice Packs | Hot/Cold Pack | med-ice-packs |
| Ponchos | Rain Poncho (Adult) | cloth-ponchos |

- **FR19:** The "Pet Food Supply (3-Day)" item (`pets-food`) shall be removed from `kitItems.ts`.
- **FR20:** A new item "Rain Poncho (Kids)" shall be added to the Clothing category in `kitItems.ts` (ASIN: B07QCVMCF8, price: $12.99).
- **FR20a:** All `pricePlaceholder` values in `kitItems.ts` shall be updated to match the corresponding prices in `docs/sprint-3-product-catalog.md`. The Amazon catalog is the source of truth for pricing.

**"Add All to Amazon Cart" CTA**

- **FR21:** The Fill Your Kit screen shall include an "Add All to Amazon Cart" CTA button that opens a pre-loaded Amazon cart in a new tab containing all displayed products.
- **FR22:** The cart URL shall be constructed using Amazon's Add to Cart URL mechanism: `https://www.amazon.com/gp/aws/cart/add.html?AssociateTag={TAG}&ASIN.1={ASIN}&Quantity.1=1&...` with sequential ASIN/Quantity parameters for each product.
- **FR23:** A utility function (`src/utils/cartUrl.ts`) shall construct the cart URL from an array of ASINs. The affiliate tag shall use the same constant as the individual affiliate links.
- **FR24:** The cart URL shall only include products currently displayed on screen (respecting MCQ conditional filters — e.g., exclude Pets items if no pets, exclude Kids poncho if no kids).
- **FR25:** The CTA shall open the URL in a new tab via `window.open()` with `noopener,noreferrer`.
- **FR26:** A "prices may vary" disclaimer shall be displayed near the CTA, since Amazon cart prices are live and may differ from our static snapshots.

**API Spike Results (Completed)**

- **FR27:** The API feasibility spike is complete. Results documented in `docs/sprint-3-api-spike-results.md`.
- **FR28:** Add to Cart URL: **GO** — implemented in Sprint 3A via FR21-FR26 above. No backend required.
- **FR29:** PA-API 5.0 / Creators API: **NO-GO** — static data approach continues. No live pricing, dynamic images, or availability badges in the prototype. See spike results for full reasoning.

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
- **Cart URL utility:** New `src/utils/cartUrl.ts` — pure function. Accepts array of ASINs and tag, returns Amazon Add to Cart URL. Uses the `gp/aws/cart/add.html` mechanism documented in spike results. Same affiliate tag constant.
- **Subkit ordering utility:** New `src/utils/subkitOrdering.ts` — pure function. Accepts `emergencyTypes[0]` from MCQ store, returns ordered array of category IDs. Encapsulates the priority mapping tables and default order.
- **Conditional item filtering:** Logic in the Fill Your Kit screen component. Reads `householdComposition` from MCQ store. Filters products before render: hide Kids poncho if no kids, hide Pets category if no pets.
- **Route addition:** One new route `/fill` added to React Router config. Order Confirmation CTA wired to navigate here.
- **kitItems.ts changes:** Renames, one removal, one addition. Type shape unchanged. All changes are to data values only.

### New Files

| File | Purpose |
|------|---------|
| `src/data/amazonProducts.ts` | Static product catalog — 31 items with ASINs, prices, image paths |
| `src/utils/affiliateLink.ts` | Affiliate URL construction utility |
| `src/utils/cartUrl.ts` | Add to Cart URL construction utility |
| `src/utils/subkitOrdering.ts` | MCQ-driven subkit ordering logic |
| `src/components/fill/FillYourKitScreen.tsx` | Main screen at `/fill` |
| `src/components/fill/CategorySection.tsx` | Collapsible category section with product grid |
| `src/components/fill/ProductCard.tsx` | Individual product card with affiliate CTA |
| `public/products/` | Directory for downloaded product images (31 images, ASIN-named — per Winston's Architecture Brief Section 6) |

### Modified Files

| File | Change |
|------|--------|
| `src/data/kitItems.ts` | Renames (9), removal (1), addition (1), pricePlaceholder sync per FR18-FR20a |
| `src/router/index.tsx` | Add `/fill` route + route guard |
| `src/router/guards.ts` | Add `fillGuard` function (dual-path: checks `kitPath` and `selectedSubkits`) |
| `src/components/layout/AppShell.tsx` | Add `/fill` to `MOBILE_EXEMPT_ROUTES` |
| `src/utils/iconResolver.ts` | Add `PawPrint` to imports and `ICON_MAP` |
| `src/components/confirmation/OrderConfirmationScreen.tsx` | Replace `FillKitStubModal` with `navigate('/fill')` |
| `src/components/confirmation/FillKitStubModal.tsx` | Remove file |

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

- **Epic 17 — Product Data & Affiliate Infrastructure:** Static product data file, affiliate link utility, Add to Cart URL utility, subkit ordering utility, and kitItems.ts data cleanup. Foundation for the Fill Your Kit screen. Stories 17.1 and 17.2 can run in parallel; 17.3 depends on both; 17.4 depends on 17.2.
- **Epic 18 — Fill Your Kit Screen:** The main new screen, split into two stories: 18.1 (shell, routing, stub modal rewiring, category sections, ordering, selected-subkit filtering) and 18.2 (product cards, affiliate CTAs, Add All to Cart button). 18.2 depends on 18.1. Epic depends on Epic 17.
- **Epic 19 — Amazon API Feasibility Spike:** Research-only assessment of Cart API and PA-API 5.0. **Complete.** Results: Add to Cart URL = GO (absorbed into Epics 17-18), PA-API = NO-GO (static data continues).

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

1. The following 9 items are renamed in `kitItems.ts` (name field only — IDs unchanged):
   - `hygiene-cups`: "Paper Cups" → "Paper Plates & Utensils"
   - `hygiene-feminine`: "Feminine Hygiene Products" → "Feminine Hygiene Kit"
   - `pets-water`: "Pet Water & Bowl Kit" → "Collapsible Bowl"
   - `pets-first-aid`: "Pet First Aid & Comfort Kit" → "Pet First Aid Kit"
   - `light-flashlight`: "Flashlights" → "Flashlight"
   - `light-lantern`: "Electric Lanterns" → "Electric Lantern"
   - `power-banks`: "Power Banks" → "Power Bank"
   - `med-ice-packs`: "Ice Packs" → "Hot/Cold Pack"
   - `cloth-ponchos`: "Ponchos" → "Rain Poncho (Adult)"
2. Item `pets-food` ("Pet Food Supply (3-Day)") is removed from the `ITEMS` array.
3. A new item is added to the Clothing category:
   - ID: `cloth-ponchos-kids`
   - Name: "Rain Poncho (Kids)"
   - categoryId: `clothing`
   - All standard fields populated (weightGrams, volumeIn3, pricePlaceholder: 12.99)
   - `productId: null`, `imageSrc: null` (populated in Story 17.2)
   - Entry added to `ITEM_ICON_OVERRIDES` with icon `CloudRain` (same as adult ponchos)
4. All `pricePlaceholder` values in `kitItems.ts` updated to match the corresponding prices in `docs/sprint-3-product-catalog.md`. The Amazon catalog is now the source of truth for pricing.
5. Add `PawPrint` to imports and `ICON_MAP` in `src/utils/iconResolver.ts`. Without this, `CategorySection` for the Pets category will fail to resolve its icon at render time. (Per Winston's Architecture Brief Section 11.)
6. `tsc --noEmit` passes. All existing tests pass. Any test referencing "Paper Cups", "Pet Food Supply", or renamed items by display name is updated.
7. No item IDs are changed. No type shape changes.

**Dev Note:** The new `cloth-ponchos-kids` item will not have an entry in `itemImages.ts`. Verify that components handle missing images gracefully (expected — no image assets exist for pets items either).

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
5. Product images are downloaded and placed in `public/products/`, named by ASIN (e.g., `B082TMBYR6.jpg`). Referenced in `amazonProducts.ts` as `/products/B082TMBYR6.jpg` (root-relative path). Per Winston's Architecture Brief Section 6: these are data-adjacent content assets, not component assets — `public/` is the correct location. **Image download is a dev task in this story** — download each product's primary image from its Amazon listing page and save as `{ASIN}.jpg`.
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

3. After the top 3, remaining categories follow default order: Power, Medical, Communications, Lighting, Cooking, Hygiene, Comfort, Clothing. Categories already placed in top 3 are skipped. Custom is excluded (no Amazon products).
4. Pets is appended last, only if `householdComposition` includes `'pets'`.
5. If `emergencyType` is undefined, the full default order is used.
6. Unit tests cover: each of the 4 emergency types produces correct ordering, undefined type uses default, Pets inclusion/exclusion based on household composition, no duplicate categories in output.

---

#### Story 17.4 — Add to Cart URL Utility

As a developer,
I want a utility that constructs an Amazon Add to Cart URL from an array of ASINs,
so that the Fill Your Kit screen can offer a one-click "Add All to Amazon Cart" CTA.

**Acceptance Criteria:**

1. A new file `src/utils/cartUrl.ts` exports:
   ```ts
   export function buildCartUrl(asins: string[], tag?: string): string
   ```
2. The function constructs a URL in the format:
   ```
   https://www.amazon.com/gp/aws/cart/add.html
     ?AssociateTag={TAG}&tag={TAG}
     &ASIN.1={ASIN_1}&Quantity.1=1
     &ASIN.2={ASIN_2}&Quantity.2=1
     ...
   ```
   Both `AssociateTag` and `tag` parameters are included for compatibility (per Winston's spike findings).
3. ASINs are numbered sequentially starting at 1. Quantity is always 1.
4. The affiliate tag defaults to the same `AFFILIATE_TAG` constant from `affiliateLink.ts`.
5. The function handles edge cases: empty array returns empty string, single ASIN works correctly.
6. Unit tests cover: correct URL format with 1 ASIN, correct URL with multiple ASINs, sequential numbering, custom tag override, empty array returns empty string, URL length is reasonable for 31 ASINs (under 2,000 characters).

---

### Epic 18: Fill Your Kit Screen

**Epic Goal:** Deliver the "Fill Your Kit" screen — the primary Sprint 3A user-facing deliverable. Users see their subkits ordered by MCQ relevance, with product cards linking to Amazon via affiliate links. The business model is immediately visible.

---

#### Story 18.1 — Fill Your Kit Screen: Shell and Category Sections

As a user who completed my kit order,
I want to see my subkits organized by relevance to my emergency type on a dedicated screen,
so that I can browse product recommendations for the subkits I selected.

**Acceptance Criteria:**

1. A new screen `FillYourKitScreen` is created at route `/fill`.
2. Route guard on `/fill` implements dual-path logic: passes if `kitPath === 'essentials'` OR `selectedSubkits.length > 0`. Otherwise redirects to `/`. (Essentials users have empty `selectedSubkits` by design — the guard must check `kitPath` first. See Architecture Brief Section 7.)
3. Replace `FillKitStubModal` behavior in `OrderConfirmationScreen.tsx` with `navigate('/fill')`. Remove `FillKitStubModal.tsx`.
4. The screen reads `emergencyTypes` and `householdComposition` from the MCQ store, and `selectedSubkits` from the kit store.
5. Only subkit categories present in `kitStore.selectedSubkits` are displayed. If a user selected Power, Medical, and Cooking, only those 3 categories appear.
6. Displayed categories are ordered by `getOrderedCategories(emergencyTypes[0], householdComposition)`, filtered to the user's selected subkits.
7. Each category is rendered as a `CategorySection` component displaying: category color bar (using `colorBase` from `CATEGORIES`), category icon, category name, product count badge, and an expand/collapse toggle.
8. The first 3 categories (or all if fewer than 3) are expanded by default. Remaining categories are collapsed.
9. Conditional category filtering: Pets category hidden entirely if `householdComposition` does not include `'pets'` (even if in selectedSubkits). Custom category excluded (no Amazon products).
10. `/fill` added to `MOBILE_EXEMPT_ROUTES` in `AppShell.tsx`. The Fill Your Kit screen is responsive and must render on mobile — same exemption pattern as Sprint 1 Phase 3 routes (`/build`, `/build/household`, `/choose`, `/review`).
11. Responsive layout: category sections stack vertically, product card grid within each section (3-col desktop >=1024px, 2-col tablet >=640px, 1-col mobile).
12. Component tests cover: correct category ordering for each emergency type, expand/collapse behavior, selected-subkits-only filtering, conditional Pets/Custom exclusion, route guard redirect.

---

#### Story 18.2 — Fill Your Kit Screen: Product Cards and Affiliate CTAs

As a user browsing the Fill Your Kit screen,
I want to see product cards with images, names, prices, and links to Amazon for each subkit,
so that I can purchase the recommended items via affiliate links.

**Depends on:** Story 18.1

**Acceptance Criteria:**

1. Within each expanded `CategorySection`, `ProductCard` components are displayed in the responsive grid established in 18.1.
2. Each `ProductCard` displays: product image, generic product name (e.g., "Portable Power Station"), brand as separate muted text (e.g., "Jackery Explorer"), price (formatted as `$XX.XX`), and a "View on Amazon" CTA button.
3. The CTA calls `buildAffiliateUrl(product.asin)` and opens the result in a new tab with `rel="noopener noreferrer"`.
4. Products with `mcqCondition` are filtered: Kids Rain Poncho hidden if `householdComposition` does not include `'kids'`.
5. An "Add All to Amazon Cart" CTA button is displayed at the **top of page** (below subtitle, above first category section) **and repeated at the bottom** (below the last category section). Per Sally's front-end spec Decision #25: the top CTA establishes the action before scrolling; the bottom repeat catches users who browse all categories first. Clicking either calls `buildCartUrl()` with the ASINs of all currently displayed products (respecting all filters — selected subkits, conditional MCQ gates) and opens the result in a new tab. If zero products are displayed after filtering (edge case), both CTAs are hidden.
6. A "Prices may vary on Amazon" disclaimer is displayed near each Add All to Cart CTA instance.
7. Product images use `loading="lazy"`. If an image fails to load, display a fallback: `neutral-100` background container with centered `Package` icon (lucide-react, size 48, `neutral-300`). Per Sally's front-end spec Section 5.2 and Section 7.
8. Product cards have hover state: subtle lift (`translateY(-2px)`) + shadow elevation. "View on Amazon" CTA uses outlined style (`brand-accent` border and text on white) with fill on hover (`brand-accent` background, white text). Per Sally's front-end spec Decision #33 and Animations #37–#39.
9. Accessibility: category sections use React state + ARIA pattern for expand/collapse (`aria-expanded`, `aria-controls`, `role="region"`). Product links have descriptive `aria-label` (e.g., "View Portable Power Station by Jackery Explorer on Amazon"). Images have `alt` text with product name. Keyboard navigable. Per Sally's front-end spec Section 8.
10. Component tests cover: product card rendering with all fields, affiliate link construction, Add All to Cart URL construction with correct ASINs, conditional item filtering (kids poncho), empty state (category not rendered when all items filtered out), image fallback rendering.
11. E2E test: complete flow from Order Confirmation → Fill Your Kit → verify at least one product card is visible with a working "View on Amazon" link and "Add All to Amazon Cart" button is present at top and bottom of page.

---

### Epic 19: Amazon API Feasibility Spike — COMPLETE

**Epic Goal:** Assess the feasibility of Amazon Cart API and PA-API 5.0 for potential Sprint 3B integration. Research only — no code deliverable.

**Status:** Complete. Results in `docs/sprint-3-api-spike-results.md`.

---

#### Story 19.1 — Amazon Cart API and PA-API 5.0 Feasibility Assessment — COMPLETE

**Results Summary:**

| API | Verdict | Action |
|-----|---------|--------|
| Add to Cart URL | **GO** | Absorbed into Sprint 3A as Story 17.4 + FR21-FR26. Client-side only. |
| PA-API 5.0 / Creators API | **NO-GO** | Static data continues. PA-API 5.0 deprecated April 30, 2026. Creators API requires 10 sales/month — chicken-and-egg for a prototype. Requires backend. |

**Key finding:** The 90-day affiliate cookie on Add to Cart URLs (vs. 24 hours for standard links) makes the cart URL the superior primary affiliate mechanism. This is a win we didn't anticipate.

Full details: `docs/sprint-3-api-spike-results.md`

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

## 8. Sprint 3B Forward Look (Updated Post-Spike)

The spike results significantly reduce Sprint 3B scope:

- **Add to Cart URL: GO** — absorbed into Sprint 3A (Story 17.4 + Story 18.1). No Sprint 3B work needed.
- **PA-API / Creators API: NO-GO** — no live pricing, no dynamic images, no availability badges. Static data approach continues indefinitely for the prototype.

**Remaining Sprint 3B candidates (all client-side, no API dependency):**

| Story Area | Description | Priority |
|------------|-------------|----------|
| Per-product MCQ mapping | Kid-sized items, elderly-appropriate products based on household composition | Medium — deferred until user data justifies the complexity |
| Category consolidation | Merge lean categories (Communications, Medical, Comfort have 2 items each) | Low — cosmetic, not functional |

**When to revisit Creators API (per Winston):** Only when all four conditions are met: (1) Associates account approved and generating 10+ sales/month, (2) Creators API stabilized post-PA-API deprecation (2-3 months), (3) demonstrated user need for live pricing, (4) backend justified by other requirements.

**Sprint 3B may be skipped entirely** — the static data + affiliate links + Add to Cart URL approach is sufficient for the prototype. The next meaningful sprint may instead focus on polish, user testing, or stakeholder feedback incorporation.

---

## 9. Reference Documents

| Document | Path |
|----------|------|
| Sprint 3 PM Brief | `docs/sprint-3-pm-brief.md` |
| Product Catalog | `docs/sprint-3-product-catalog.md` |
| MCQ Mapping Rules | `docs/sprint-3-mcq-mapping.md` |
| API Spike Criteria | `docs/sprint-3-spike-criteria.md` |
| API Spike Results | `docs/sprint-3-api-spike-results.md` |
| Phase 3 Sprint 1 PRD | `docs/prd-phase3.md` |
| Architecture | `docs/architecture.md` |
| Kit Items Data | `src/data/kitItems.ts` |
| MCQ Store | `src/store/mcqStore.ts` |

---

*Emergency Prep Kit Builder — Phase 3 Sprint 3A PRD | John, PM | 2026-04-14*
