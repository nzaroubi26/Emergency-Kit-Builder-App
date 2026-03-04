# Emergency Prep Kit Builder — Phase 2 Brownfield Enhancement PRD

**Prepared by:** John, Product Manager  
**Date:** 2026-03-04  
**Version:** 1.1  
**Status:** Draft — Ready for Architect and PO Review

---

## 1. Intro Project Analysis and Context

### Analysis Source

IDE-based analysis using existing project documentation: `docs/prd.md` (v1.1) and `docs/architecture.md` (v1.3).

### Current Project State

- **Primary Purpose:** A client-side React SPA guiding homeowners through building a personalized emergency preparedness kit mapped to a physical modular storage system.
- **Current Tech Stack:** Vite 6.x + React 18.x + TypeScript 5.x strict + Tailwind CSS v4 + Zustand 5.x + React Router 6.4+ + Vitest + Vercel.
- **Architecture Style:** Single-Page Application, fully client-side, no backend, session-based state.
- **Deployment:** Static SPA on Vercel with branch preview deployments.
- **MVP Status:** All 5 epics and 18 stories delivered and complete.

### Available Documentation

- ✅ Tech Stack Documentation (`docs/architecture.md` Section 2)
- ✅ Source Tree / Architecture (`docs/architecture.md` Section 3)
- ✅ Coding Standards (`docs/architecture.md` Sections 4 and 11)
- ✅ Phase 2 Extension Points (`docs/architecture.md` Section 12)
- ✅ PRD Phase 1 (`docs/prd.md`)

### Enhancement Scope Definition

**Enhancement Type:** New Feature Addition — multiple features across UX, data, and integration layers.

**Enhancement Description:** Phase 2 adds six production features to the completed MVP: a cover/landing page, a "Fill my kit for me" auto-select feature, localStorage state persistence, clickable visualizer slots, hardcoded item star ratings (proof of concept ahead of Bazaarvoice integration in Phase 3), and e-commerce checkout integration. Analytics instrumentation and an automated Playwright E2E test suite are added as technical enablers. Branded product catalog and pricing display are deferred to a future phase when real product data is available. Bazaarvoice reviews integration and full mobile responsiveness are explicitly deferred to Phase 3, where they ship together as a coherent "trust and reach expansion" package.

**Impact Assessment:** Significant Impact — multiple screens and components are affected and one new e-commerce API layer is introduced. All changes are additive or minimally invasive by design, as the Phase 1 architecture pre-wired all Phase 2 extension points.

### Goals and Background Context

#### Goals

- Convert kit configuration into purchase intent by connecting the configured kit to a real checkout experience
- Eliminate the frustration of losing kit progress on accidental page refresh via persistent localStorage state
- Build item-level social proof and trust by displaying star ratings during item selection
- Reduce time-to-complete for users who want a sensible default kit with the "Fill my kit for me" feature
- Create a polished brand entry point via a cover/landing page that frames the product before users enter the builder
- Enable data-driven product iteration by instrumenting core user behavior metrics
- Reduce manual regression burden by establishing an automated E2E test suite

#### Background Context

Phase 1 delivered a fully functional kit builder validated with real users and deployed on Vercel. Phase 2 is the commercial activation of that foundation — turning a configuration tool into a revenue-generating product. Every Phase 2 feature was pre-designed into the Phase 1 architecture: extension points, data fields, and component hooks are already in place. Phase 2 work is therefore additive by design, with minimal risk to the working MVP.

The single highest-impact Phase 2 deliverable is the e-commerce integration: for the first time, a configured kit becomes a purchasable order. Item star ratings are introduced in Phase 2 as hardcoded static values — a deliberate proof of concept that validates the UI pattern and user response before Bazaarvoice live review data replaces the static values in Phase 3.

### Change Log

| Change | Date | Version | Description | Author |
|--------|------|---------|-------------|--------|
| Initial draft | 2026-03-04 | 1.0 | Phase 2 PRD created from architecture.md Section 12 extension points | John, PM |
| Revised | 2026-03-04 | 1.1 | Removed branded catalog and pricing stories; added hardcoded star ratings story; Epic 8 retitled | John, PM |
| Revised | 2026-03-04 | 1.2 | Story 7.3 (Full Mobile Responsiveness) deferred to Phase 3; FR8 and NFR3 removed; Epic 7 scope reduced to 2 stories; Enhancement Description updated | Sarah, PO |

---

## 2. Requirements

### Functional Requirements

- **FR1:** The app shall display a cover/landing page as the new entry route (`/`) with brand messaging and a single CTA navigating to the Subkit Selection Screen (`/builder`).
- **FR2:** The Subkit Selection Screen shall move from route `/` to `/builder`. All existing navigation guards shall be updated accordingly.
- **FR3:** The Item Configuration Screen and Custom Subkit Screen shall each include a "Fill my kit for me" checkbox that, when checked, auto-selects all available items in the current subkit at quantity 1 using existing store actions.
- **FR4:** Unchecking "Fill my kit for me" shall clear all item selections for that subkit, returning it to the default empty state.
- **FR5:** The application shall persist kit configuration state to `localStorage` so that users refreshing the page or returning later recover their in-progress kit without data loss.
- **FR6:** The Housing Unit Visualizer shall support clickable slot interactivity on the Subkit Selection Screen — clicking a filled slot shall navigate the user to the Item Configuration screen for the corresponding subkit.
- **FR7:** Empty slots in the visualizer shall remain non-interactive (clicking an empty slot has no effect in Phase 2).
- **FR9:** Each selectable item in the Item Configuration Screen and Custom Subkit Screen shall display a star rating (out of 5) and a review count. In Phase 2 these values are hardcoded static data. Bazaarvoice live data replaces these values in Phase 3.
- **FR10:** Hardcoded item ratings shall be realistic values between 3.8 and 5.0 (one decimal place). All 28 items in the catalog shall have a rating and review count assigned.
- **FR11:** Item star ratings and review counts shall NOT appear on the Summary Page.
- **FR12:** The Summary Page CTA ("Get My Kit") shall trigger an e-commerce checkout flow, serializing the configured kit into a cart payload and calling the purchase API endpoint defined in `ENV.purchaseUrl`.
- **FR13:** The checkout flow shall display a user-facing error message if the API call fails, without crashing the application or losing kit state.
- **FR14:** The application shall instrument the following analytics events: kit completion (`kit_completed`), subkit selection (`subkit_selected`), item inclusion (`item_included`), and CTA click (`cta_clicked`).
- **FR15:** An automated E2E test suite (Playwright) shall cover the three critical user flows: full kit configuration to summary, back-navigation preserving state, and Start Over resetting state.

### Non-Functional Requirements

- **NFR1:** `localStorage` persistence shall be implemented as Zustand `persist` middleware — no changes to store selectors, actions, or consuming components are required.
- **NFR2:** The cover/landing page shall meet the existing NFR7 page load target (<=3 seconds on standard broadband).
- **NFR4:** The e-commerce API integration shall implement graceful error handling — checkout failures shall display a user-facing error without crashing the application or losing kit state.
- **NFR5:** Analytics instrumentation shall be non-blocking — analytics failures shall never impact application performance or user flows.
- **NFR6:** All Phase 2 components shall conform to the coding standards in `docs/architecture.md` Section 11 without exception.
- **NFR7:** The `StarRating` component shall be accessible — it shall use an `aria-label` conveying the numeric rating and review count to screen readers (e.g., "Rated 4.3 out of 5 based on 128 reviews").
- **NFR8:** Phase 2 shall not introduce breaking changes to the existing Zustand store API or the `HousingUnitVisualizer` props interface.

### Compatibility Requirements

- **CR1:** All existing routes (`/configure/:subkitId`, `/configure/custom`, `/summary`) shall continue to function identically. The builder entry point moves from `/` to `/builder`.
- **CR2:** The Zustand store shape and all selectors/actions shall remain backward-compatible. Persist middleware wraps the existing `create()` call only.
- **CR3:** The `HousingUnitVisualizer` `onSlotClick` prop is already typed and wired. Phase 2 passes a handler from `SubkitSelectionScreen` — no component interface changes required.
- **CR4:** The `KitItem` type in `kit.types.ts` shall be extended with two new nullable fields (`rating: number | null` and `reviewCount: number | null`). All existing consumers of `KitItem` are unaffected — the fields are additive.

---

## 3. User Interface Enhancement Goals

### Integration with Existing UI

All Phase 2 UI additions shall use the existing design token system, component library (PrimaryButton, SecondaryButton, ConfirmationModal), and Tailwind v4 utility class patterns. No new design system primitives are required. Dynamic category colors continue to use inline styles per the existing architectural rule.

### Modified / New Screens and Views

| Screen | Change Type | Description |
|--------|------------|-------------|
| Cover/Landing Page (`/`) | New | Brand messaging screen with single CTA to `/builder`. Static, no store dependency. |
| Subkit Selection Screen (`/builder`) | Modified | Route renamed from `/`; filled visualizer slots become clickable. |
| Item Configuration Screen | Modified | Add "Fill my kit for me" checkbox; display star rating and review count per item. |
| Custom Subkit Screen | Modified | Add "Fill my kit for me" checkbox; display star rating and review count per item. |
| Summary Page | Modified | CTA triggers checkout API call; checkout error state added. No star ratings displayed. |

### UI Consistency Requirements

- The cover/landing page shall use the existing brand color palette (`--color-brand-primary: #1F4D35`, `--color-brand-accent: #22C55E`) and Inter typeface.
- "Fill my kit for me" shall follow the existing `EmptyContainerOption` visual and behavioral pattern for consistency.
- The `StarRating` component shall use `--color-brand-accent` (#22C55E) for filled stars and `--color-neutral-200` for empty stars, consistent with the existing brand palette.
- Star ratings shall render below the item name and description on `ItemCard` — positioned so they do not displace or crowd the include/exclude toggle or quantity selector.
- Clickable visualizer slots shall add only `cursor-pointer` and a `hover:brightness-95` state — no structural changes to `VisualizerSlot`.
- Mobile layouts shall use existing Tailwind breakpoint classes — no new breakpoint values are introduced.

---

## 4. Technical Constraints and Integration Requirements

### Existing Technology Stack

| Category | Current Technology | Version | Phase 2 Usage |
|----------|-------------------|---------|---------------|
| Language | TypeScript | 5.x strict | All new code; strict: true mandatory |
| Framework | React | 18.x | All new components; FC<Props> named exports |
| Build Tool | Vite | 6.x | VITE_ prefix for new env vars |
| Styling | Tailwind CSS | v4.x | Dynamic colors via inline styles only |
| State Management | Zustand | 5.x | persist middleware added; no store API changes |
| Routing | React Router | 6.4+ | New `/` cover route; `/builder` rename |
| Testing (Unit) | Vitest + RTL | 2.x / 16.x | New component tests for Phase 2 components |
| Testing (E2E) | Playwright | new | Added to devDependencies; tests/e2e/ |
| Deployment | Vercel | -- | New VITE_ env vars added in dashboard |

### Integration Approach

- **localStorage:** Add `persist` middleware from `zustand/middleware` to `kitStore.ts`. Storage key: `emergency-kit-v1`. No consumer changes required.
- **Star Ratings:** Two new nullable fields (`rating: number | null`, `reviewCount: number | null`) added to `KitItem` in `kit.types.ts`. All 28 items in `kitItems.ts` populated with hardcoded values. New `StarRating` UI component at `src/components/ui/StarRating.tsx`. `ItemCard` renders `StarRating` when `rating` is non-null. `SubkitSummarySection` does not render `StarRating`.
- **E-commerce:** New `src/services/checkoutService.ts` serializes `selectedSubkits` and `itemSelections` into a cart payload and calls `ENV.purchaseUrl` via `fetch`. Checkout errors surface via local component state on `SummaryScreen` — kit state is never lost on failure.
- **Analytics:** Non-blocking script tag in `AppShell.tsx`. All event calls go through `src/utils/analytics.ts` — never called directly from components.
- **Cover Page Routing:** `router/index.tsx` updated — `/` renders `CoverScreen`; `/builder` renders `SubkitSelectionScreen`. All guards redirect to `/builder`.
- **Playwright:** Added to `devDependencies`. Tests in `tests/e2e/`. No application code changes.

### Code Organization and Standards

- New `CoverScreen` in `src/components/cover/CoverScreen.tsx`.
- New `StarRating` component in `src/components/ui/StarRating.tsx`.
- New `src/services/checkoutService.ts`.
- New `src/utils/analytics.ts`.
- All 10 critical rules from `docs/architecture.md` Section 11 apply to all Phase 2 code without exception.
- New `VITE_` env vars added to `.env.example` and `src/tokens/env.ts` only — never hardcoded.

### Risk Assessment and Mitigation

- **E-commerce API contract:** Not yet defined — checkout service shall be designed behind a typed interface and stubbed with `ENV.purchaseUrl` placeholder until the API spec is available.
- **Route rename (`/` to `/builder`):** Could break existing external links or bookmarks. Mitigation: communicate URL change to stakeholders before Epic 6 ships.
- **localStorage first load:** Store initializes correctly to empty state when no `localStorage` key exists. Zustand persist handles missing key gracefully with initial state fallback.
- **Star ratings in Phase 3:** Hardcoded `rating` and `reviewCount` values will be replaced by live Bazaarvoice data in Phase 3. The `StarRating` component and `ItemCard` integration are data-source agnostic — swapping to live data requires only changes to the data layer, not the component.
- **Rollback:** All Phase 2 work on story branches, merging to `main` only after QA approval per the existing rollback strategy in `docs/architecture.md` Section 1.

---

## 5. Epic and Story Structure

**Epic Approach:** Three epics, ordered by dependency and business impact.

- **Epic 6** — Phase 2 Foundation: persistence, analytics, E2E tooling, and cover page. Must complete before Epics 7 and 8 begin.
- **Epic 7** — UX Enhancements: "Fill my kit for me" and clickable visualizer slots. Parallel-capable with Epic 8 after Epic 6 is complete. *(Full mobile responsiveness deferred to Phase 3.)*
- **Epic 8** — Social Proof and Checkout: hardcoded item star ratings (Phase 3 Bazaarvoice proof of concept) and e-commerce checkout integration.

---

## 6. Epic Details

### Epic 6: Phase 2 Foundation

**Epic Goal:** Establish the Phase 2 technical foundation by adding localStorage state persistence, analytics instrumentation, an automated E2E test suite, and a cover/landing page — enabling all subsequent Phase 2 epics to build on a stable, instrumented, and properly entry-pointed application.

---

#### Story 6.1 — localStorage State Persistence

As a user,
I want my kit configuration saved automatically as I build it,
so that refreshing the page or returning later does not lose my progress.

**Acceptance Criteria:**

1. Zustand `persist` middleware from `zustand/middleware` is added to `kitStore.ts`, wrapping the existing `create<KitStore>()` call with storage key `emergency-kit-v1`.
2. All existing store state (`selectedSubkits`, `itemSelections`, `emptyContainers`, `currentConfigIndex`) is persisted to `localStorage`.
3. On page reload, the store rehydrates from `localStorage` — the user's full kit configuration is restored.
4. When `resetKit()` is called, `localStorage` is cleared and the store returns to initial state.
5. First-time visitors (no existing key) experience identical behavior to Phase 1 — store initializes to empty state.
6. No changes are required to any store selectors, actions, or consuming components.
7. All existing unit tests in `tests/unit/slotCalculations.test.ts` pass without modification.

**Integration Verification:**
- IV1: Full kit configuration flow (SubkitSelection to ItemConfig to Summary) completes correctly after persist middleware is added.
- IV2: `resetKit()` from the Summary Page Start Over clears localStorage and resets the visualizer to 6 empty slots.
- IV3: A hard refresh mid-configuration restores all subkit selections, sizes, and item choices correctly.

---

#### Story 6.2 — Analytics Instrumentation

As a product team,
I want key user behavior events tracked automatically,
so that we can measure kit completion rates, subkit adoption, item popularity, and CTA conversion.

**Acceptance Criteria:**

1. An analytics tool (Plausible or Google Analytics 4) script is added to `AppShell.tsx` as a non-blocking script tag.
2. The analytics tool ID is stored as `VITE_ANALYTICS_ID` in `.env.example` and `src/tokens/env.ts` — never hardcoded.
3. A `src/utils/analytics.ts` module is created exposing a typed `trackEvent(name: string, properties?: Record<string, unknown>): void` function. Components never call the analytics script directly.
4. The following four events are instrumented: `kit_completed` (on reaching Summary Page), `subkit_selected` (with `{ categoryId, size }`), `item_included` (with `{ itemId, categoryId }`), and `cta_clicked` (on "Get My Kit" click).
5. All `trackEvent` calls are wrapped in try/catch — analytics failures are silently swallowed and never surface as user-facing errors.
6. Page load performance is unaffected — analytics script does not block initial render.

**Integration Verification:**
- IV1: All existing kit builder flows complete correctly with the analytics script present.
- IV2: Network tab confirms all four events fire at the correct interaction points during a manual flow.
- IV3: Blocking the analytics script via network throttle produces no user-facing errors or console exceptions.

---

#### Story 6.3 — Automated E2E Test Suite (Playwright)

As a developer,
I want automated end-to-end tests covering the three critical user flows,
so that Phase 2 and future changes can be validated without full manual regression.

**Acceptance Criteria:**

1. Playwright is added to `devDependencies` with a `playwright.config.ts` at the project root targeting `http://localhost:5173`.
2. E2E tests live in `tests/e2e/` and do not conflict with existing Vitest unit and component tests.
3. A `npm run test:e2e` script is added to `package.json`.
4. The following three flows are covered with passing tests:
   - **Full configuration flow:** Select 3 subkits, configure items, reach Summary Page, verify kit summary displays all selected subkits and items correctly.
   - **Back-navigation state preservation:** Configure 2 subkits, navigate back to Subkit Selection, verify both selections and sizes are preserved in the visualizer and cards.
   - **Start Over reset:** Complete configuration, click Start Over, confirm via modal, verify store resets and visualizer shows 6 empty slots.
5. All three E2E tests pass in CI.

**Integration Verification:**
- IV1: `npm run test:run` (Vitest suite) continues to pass after Playwright is added.
- IV2: `npm run test:e2e` completes successfully on a clean checkout with no pre-existing localStorage.

---

#### Story 6.4 — Cover / Landing Page

As a prospective user,
I want to land on a branded introduction page before entering the kit builder,
so that I understand the product's value proposition before I start configuring my kit.

**Acceptance Criteria:**

1. A new `CoverScreen` component is created at `src/components/cover/CoverScreen.tsx` using brand colors (`--color-brand-primary`, `--color-brand-accent`) and the Inter typeface.
2. The cover page is mounted at route `/`. The Subkit Selection Screen moves to route `/builder`.
3. All existing router guards (`subkitConfigGuard`, `customConfigGuard`, `summaryGuard`) are updated to redirect to `/builder` instead of `/`.
4. The cover page includes a headline, a brief value proposition statement, and a single `PrimaryButton` CTA labeled "Build My Kit" that navigates to `/builder`.
5. The cover page has no dependency on the Zustand store — it is fully static.
6. The cover page meets the NFR7 page load target (<=3 seconds on standard broadband).
7. Navigating directly to `/builder`, `/configure/:subkitId`, `/configure/custom`, or `/summary` continues to work correctly under the updated routing.

**Integration Verification:**
- IV1: Visiting `/` renders CoverScreen. Clicking "Build My Kit" navigates to and renders SubkitSelectionScreen at `/builder`.
- IV2: All existing navigation guard redirects resolve to `/builder` correctly.
- IV3: The full kit configuration flow from `/builder` through to `/summary` completes without regression.

---

### Epic 7: UX Enhancements

**Epic Goal:** Deliver two targeted UX improvements — a "Fill my kit for me" auto-select shortcut and clickable visualizer slot navigation — reducing configuration friction for existing users. *(Full mobile responsiveness is deferred to Phase 3 alongside Bazaarvoice.)*

---

#### Story 7.1 — "Fill My Kit for Me" Auto-Select

As a user,
I want a single checkbox that auto-selects all items in my current subkit,
so that I can quickly populate a sensible default kit without toggling each item individually.

**Acceptance Criteria:**

1. A "Fill my kit for me" checkbox is added to both `ItemConfigScreen` and `CustomSubkitScreen`, positioned above the item list.
2. Checking the checkbox calls the existing `toggleItem` store action for every unselected item in the current subkit, setting each to quantity 1.
3. Unchecking the checkbox clears all item selections for the current subkit by calling `toggleItem` for each selected item, returning the subkit to the default empty state.
4. The checkbox is visually consistent with the existing `EmptyContainerOption` component pattern.
5. The checkbox is disabled and visually grayed out when the subkit is set to empty container — a subkit cannot be both empty and filled.
6. The Summary Page correctly reflects all auto-selected items and their quantities.

**Integration Verification:**
- IV1: Checking "Fill my kit for me" then manually deselecting a single item leaves all remaining items selected — partial deselection is non-destructive.
- IV2: The existing `EmptyContainerOption` behavior is unchanged — toggling empty container still clears all items regardless of "Fill my kit for me" state.
- IV3: All existing component tests for `ItemConfigScreen` and `CustomSubkitScreen` pass without modification.

---

#### Story 7.2 — Clickable Visualizer Slot Navigation

As a user,
I want to click on a filled slot in the housing unit visualizer,
so that I can jump directly to the item configuration screen for that subkit without stepping through the linear flow.

**Acceptance Criteria:**

1. `SubkitSelectionScreen` passes an `onSlotClick` handler to `HousingUnitVisualizer`. The handler navigates to `/configure/:subkitId` for the clicked subkit.
2. Filled slots display a `cursor-pointer` cursor and a `hover:brightness-95` visual affordance on hover.
3. Empty slots remain non-interactive — no cursor change, no click handler, no navigation.
4. Clicking a filled slot navigates to the correct `ItemConfigScreen`. The existing `subkitConfigGuard` validates the subkitId and allows navigation.
5. The `HousingUnitVisualizer` component interface is not changed — `onSlotClick?: (slotIndex: number) => void` was already defined in Phase 1.
6. `readOnly` mode on the Summary Page is unaffected — `onSlotClick` is not passed and slots remain non-interactive.

**Integration Verification:**
- IV1: Clicking a filled slot navigates to the correct Item Configuration screen for that subkit.
- IV2: Clicking an empty slot produces no navigation or console error.
- IV3: The Summary Page visualizer remains fully non-interactive.
- IV4: All existing `HousingUnitVisualizer.test.tsx` tests pass without modification.

---

### Epic 8: Social Proof and Checkout

**Epic Goal:** Build item-level social proof into the configuration experience via hardcoded star ratings — establishing the UI pattern ahead of live Bazaarvoice data in Phase 3 — and activate the commercial layer by connecting "Get My Kit" to a real e-commerce checkout API.

---

#### Story 8.1 — Hardcoded Item Star Ratings

As a user,
I want to see star ratings and review counts for each item I can select,
so that I can make more confident choices about what to include in my kit.

**Acceptance Criteria:**

1. The `KitItem` type in `src/types/kit.types.ts` is extended with two new nullable fields: `rating: number | null` and `reviewCount: number | null`. All existing consumers of `KitItem` are unaffected — the fields are additive.
2. All 28 items in `src/data/kitItems.ts` are populated with hardcoded `rating` values between 3.8 and 5.0 (one decimal place) and realistic `reviewCount` values. No item has a null rating or reviewCount in Phase 2.
3. A new `StarRating` component is created at `src/components/ui/StarRating.tsx`. It accepts `rating: number` and `reviewCount: number` props and renders filled/partial/empty stars out of 5, the numeric rating, and the review count (e.g., "4.3 (128 reviews)").
4. The `StarRating` component uses `--color-brand-accent` (#22C55E) for filled stars and `--color-neutral-200` for empty stars.
5. The `StarRating` component includes an `aria-label` conveying the full rating in text for screen readers (e.g., "Rated 4.3 out of 5 based on 128 reviews").
6. `ItemCard` renders `StarRating` below the item name and description when `rating` is non-null. The include/exclude toggle and quantity selector layout are unchanged.
7. Star ratings are rendered on both `ItemConfigScreen` (standard subkit items) and `CustomSubkitScreen` (all-category browser items).
8. Star ratings are NOT rendered in `SubkitSummarySection` on the Summary Page.
9. A `StarRating` component test is added to `tests/components/` covering: correct star fill for a sample rating, correct aria-label output, and null-safe rendering (component renders nothing when called with a null-guarded parent).

**Integration Verification:**
- IV1: All 28 items display star ratings on ItemConfigScreen and CustomSubkitScreen without layout disruption.
- IV2: Summary Page item lists contain no star rating elements.
- IV3: axe accessibility assertion on the `StarRating` component test returns no violations.

---

#### Story 8.2 — E-commerce Checkout Integration

As a user,
I want clicking "Get My Kit" to initiate a real checkout for my configured kit,
so that I can purchase my emergency preparedness kit directly from the builder.

**Acceptance Criteria:**

1. A `src/services/checkoutService.ts` module is created, exporting an async `initiateCheckout(selectedSubkits: SubkitSelection[], itemSelections: Record<string, ItemSelection>, emptyContainers: string[]): Promise<CheckoutResult>` function. The function builds a typed `CheckoutPayload` internally before dispatching the API call — `SummaryScreen` passes store state directly and is not coupled to the payload shape.
2. `CheckoutPayload` is a typed internal interface containing the serialized kit data including a `kitId` (UUID generated at call time for idempotency), subkit selections, sizes, item quantities, and empty container flags.
3. `initiateCheckout` calls `ENV.purchaseUrl` via a POST `fetch` request with the serialized payload.
4. On a successful API response, the user is redirected to the checkout URL returned in the response in the **same window** (`window.location.href = data.redirectUrl`). A new tab is not used — same-window is the correct e-commerce pattern, and localStorage persistence (Story 6.1) ensures the kit configuration is fully restored if the user navigates back.
5. On API failure (network error or non-2xx response), a user-facing error message is displayed on the Summary Page below the CTA. The error is dismissible. Kit state is fully preserved — no data is lost on failure.
6. During the API call, the "Get My Kit" CTA displays a loading state (disabled with "Processing..." label) to prevent duplicate submissions.
7. The `cta_clicked` analytics event fires before the API call is initiated — not contingent on API success.
8. `checkoutService.ts` is covered by unit tests mocking `fetch` for: successful response with redirect URL, network failure, and non-2xx response.

**Integration Verification:**
- IV1: Clicking "Get My Kit" with a stubbed success response redirects correctly without losing kit state.
- IV2: Clicking "Get My Kit" with a stubbed failure response displays the dismissible error message and leaves the kit summary intact.
- IV3: Rapidly clicking "Get My Kit" twice triggers only one API call — the loading state prevents duplicate submission.

---

## 7. Next Steps

### Architect Prompt

Winston — the Phase 2 Enhancement PRD is complete and saved as `docs/prd-phase2.md`. Please review and create a Phase 2 brownfield architecture document using the `brownfield-architecture-tmpl`. Key considerations:

- All Phase 2 extension points are pre-documented in `docs/architecture.md` Section 12 — use these as the technical baseline.
- The most significant new element is `src/services/checkoutService.ts` — the e-commerce API contract is TBD and should be designed behind a typed interface.
- `StarRating` is a new shared UI component at `src/components/ui/StarRating.tsx`. Two new fields (`rating`, `reviewCount`) are added to `KitItem` in `kit.types.ts` and populated in `kitItems.ts`.
- localStorage persistence via Zustand `persist` middleware is a one-file change to `kitStore.ts` — confirm middleware approach and storage key `emergency-kit-v1`.
- Route restructuring (`/` to cover page; `/builder` to SubkitSelectionScreen) should be reflected in the updated router configuration.
- Mobile responsiveness requires removal of `MobileInterstitial` and addition of mobile layout variants — confirm breakpoint strategy.
- Playwright E2E setup should define the `playwright.config.ts` baseline and CI integration approach.

### PO Prompt

Sarah — the Phase 2 Enhancement PRD is complete and saved as `docs/prd-phase2.md`. Please validate the PRD and the Phase 2 brownfield architecture (once complete) using the PO Master Checklist. Key areas to watch:

- Story sequencing across Epics 6, 7, and 8 — confirm Epic 6 completion is the correct gate before Epics 7 and 8 begin.
- E-commerce checkout (Story 8.2) is the highest business-impact story — confirm the API contract dependency is flagged clearly for the development team.
- The cover page route change (`/` to `/builder`) must be communicated to relevant stakeholders before Epic 6 ships to avoid breaking existing links.
- Star ratings (Story 8.1) are explicitly hardcoded in Phase 2 as a proof of concept — confirm the Phase 3 Bazaarvoice handoff path is clearly understood by the team.
