# Emergency Kit Builder — Phase 3 Sprint 2 PRD

**Prepared by:** John, Product Manager
**Date:** 2026-04-13
**Version:** 1.1
**Status:** Draft — Updated per Sally's review flags (2026-04-13)

---

## 1. Intro Project Analysis and Context

### Analysis Source

Sprint 1 PRD (`docs/prd-phase3.md` v1.1), Sprint 1 architecture (`docs/architecture-phase3.md`), Sprint 1 front-end spec (`docs/front-end-spec-phase3.md`), existing codebase (`src/data/kitItems.ts`, `src/store/kitStore.ts`, `src/components/visualizer/`, `src/components/summary/`, `src/components/confirmation/`), and locked MCQ surfacing rules from architecture Section 11.

### Current Project State

- **Sprint 1 Status:** Complete. MCQ two-screen flow, fork screen, Essentials → Review & Order shell, MCQ Zustand store with sessionStorage persistence — all delivered.
- **Sprint 1 Deliverables:** 4 new routes (`/build`, `/build/household`, `/choose`, `/review`), `mcqStore.ts`, `essentialsConfig.ts`, MCQEmergencyTypeScreen, MCQHouseholdScreen, ForkScreen, ReviewOrderScreen, KitSummaryCard (Essentials path only), route guards, MobileInterstitial bypass.
- **What Sprint 1 Designed For But Did Not Build:** MCQ → subkit surfacing, Build My Own → `/review` wiring, `KitSummaryCard` custom path, Pets subkit, visualizer refresh, Order Confirmation update.

### Sprint 2 Scope

Sprint 2 completes the Build My Own path end-to-end and connects both paths to a unified order flow:

1. **Pets Subkit** — new category + items added to `kitItems.ts`, selectable in the visualizer
2. **Visualizer UI Refresh** — layout change from top-to-bottom to left-to-right display, color updates (Build My Own path only)
3. **MCQ → Subkit Surfacing Logic** — MCQ answers visually prioritize relevant subkits at the top of the visualizer list (elevated, not pre-selected)
4. **MCQ Visual Distinction** — visual differentiation between MCQ-suggested subkits and user-actively-selected subkits in the visualizer
5. **Build My Own → `/review` Wiring** — custom path `KitSummaryCard` implementation, connecting Build My Own flow to the Review & Order page
6. **Order Confirmation + "Now Let's Fill Your Kit" CTA** — updated confirmation screen with entry point to Part 2

**Out of scope for Sprint 2:**
- Amazon product recommendations (Sprint 3)
- `extreme-heat` emergency type activation (still Coming Soon)
- Any fulfillment, payment, or logistics backend
- Mobile responsiveness for existing visualizer screens (existing `MobileInterstitial` still applies to `/builder`, `/configure/*`, `/summary`)

### Subkit Catalog After Sprint 2 (10 subkits)

| Subkit | Status | Sizes |
|---|---|---|
| Power | Existing | Regular, Large |
| Lighting | Existing | Regular, Large |
| Communications | Existing | Regular, Large |
| Hygiene | Existing | Regular, Large |
| Cooking | Existing | Regular, Large |
| Medical | Existing | Regular, Large |
| Comfort | Existing | Regular, Large |
| Clothing | Existing | Regular, Large |
| Custom | Existing | Regular, Large |
| **Pets** | **New — Sprint 2** | **Regular, Large** |

### Goals

- Complete the Build My Own path so both forks reach Review & Order — users who chose "Build My Own Kit" at the fork now flow through the visualizer, configure items, and arrive at `/review` with their custom kit summarized
- Make the visualizer smarter by surfacing MCQ-relevant subkits at the top of the list with clear visual distinction from user selections — the app now feels like it understands the user's situation
- Refresh the visualizer layout from vertical to horizontal, modernizing the Build My Own experience
- Add the Pets subkit to the catalog so households with pets see a relevant option surfaced by MCQ when they selected "Pets" in Q2
- Deliver a unified Order Confirmation that serves both Essentials and Custom paths and provides a "Now Let's Fill Your Kit" CTA as the entry point to Part 2 of the product experience

### Pre-Sprint 2 Dependencies

| Dependency | Owner | Status |
|---|---|---|
| MCQ store shape (`emergencyTypes`, `householdComposition`, `kitPath`) | Winston (Sprint 1) | Delivered ✅ |
| `KitSummaryCard` scaffold with `path` prop branching | Winston (Sprint 1) | Delivered ✅ |
| `reviewGuard` accepting `kitPath === 'custom'` | Winston (Sprint 1) | Designed ✅ (truthy check) |
| Surfacing rules (Q1 + Q2 elevation tables) | John + Winston (Sprint 1 arch Section 11) | Locked ✅ |
| Subkit taxonomy | Team | Locked ✅ |
| Pets item catalog content (names, weights, volumes) | John | Locked ✅ (see Story 15.1) |

### Change Log

| Change | Date | Version | Description | Author |
|---|---|---|---|---|
| Initial draft | 2026-04-13 | 1.0 | Phase 3 Sprint 2 PRD — Pets subkit, visualizer refresh, MCQ surfacing, Build My Own → /review, Order Confirmation | John, PM |
| Sally review flags | 2026-04-13 | 1.1 | (1) Renumbered Epics 13/14 → 15/16 to avoid story file collision with Sprint 1, (2) "Start Over" routes to `/` (cover) for both paths, (3) BackLink on `/review` is path-aware (explicit AC), (4) Sprint 1 deferred story 14.4 superseded by Story 15.1 | John, PM |

---

## 2. Requirements

### Functional Requirements

**Pets Subkit**

- **FR1:** A new `pets` category is added to `CATEGORIES` in `kitItems.ts` with all required fields: `id`, `name`, `colorBase`, `colorTint`, `icon`, `description`, `sizeOptions: ['regular', 'large']`. Color and icon must be visually distinct from existing 9 categories.
- **FR2:** A minimum of 3 items are added to `ITEMS` with `categoryId: 'pets'`. All fields populated including `weightGrams`, `volumeIn3`, and `pricePlaceholder`.
- **FR3:** The Pets subkit is selectable in the Build My Own visualizer. It renders with its category color in the housing unit slots and is configurable via the existing ItemConfigScreen flow.

**Visualizer UI Refresh**

- **FR4:** The SubkitSelectionScreen layout is updated from a vertical (top-to-bottom) card grid to a horizontal (left-to-right) layout. Housing unit visualizer and subkit list are side-by-side on desktop, stacked on mobile.
- **FR5:** Category colors in the visualizer are updated per Sally's Sprint 2 spec. Existing `colorBase` and `colorTint` values in `CATEGORIES` may be adjusted.
- **FR6:** The existing 6-slot capacity system, size toggle (Regular/Large), and "Configure Items" CTA flow are unchanged. The refresh is layout and visual only.
- **FR7:** The SubkitCard component is updated to reflect the new layout but retains all existing functionality: select/deselect, size toggle, slot count impact.

**MCQ → Subkit Surfacing Logic**

- **FR8:** When a user arrives at the SubkitSelectionScreen via the Build My Own path, the app reads `emergencyTypes` and `householdComposition` from the MCQ store and computes an elevation set — the subkits that are relevant to the user's answers.
- **FR9:** Elevated subkits are sorted to the top of the subkit list in the visualizer. Non-elevated subkits appear below in their default order. Elevation is visual ordering only — not pre-selection.
- **FR10:** Elevation rules follow the locked tables from the Sprint 1 architecture (Section 11):

  **Q2 (household) — additive elevation:**

  | Household Option | Elevated Subkits |
  |---|---|
  | Kids | Hygiene, Medical, Comfort |
  | Older Adults | Medical, Comfort |
  | Disability | Medical, Comfort |
  | Pets | Pets |
  | None | No effect |

  **Q1 (emergency type) — additive elevation:**

  | Emergency Type | Elevated Subkits |
  |---|---|
  | Flood / Hurricane | Power, Communications, Cooking |
  | Tropical Storm | Power, Communications |
  | Tornado | Medical, Lighting, Clothing |

  Elevation is additive when multiple MCQ answers are selected. If both Q1 and Q2 elevate the same subkit, it is still elevated once (deduplicated). Q2 takes visual priority over Q1 when both elevate — Q2-elevated subkits appear first within the elevated group.

- **FR11:** Subkits that reach the visualizer without MCQ context (e.g., direct navigation to `/builder` without completing MCQ) display in their default catalog order with no elevation applied.
- **FR12:** Elevation is informational only. Users can select any subkit regardless of elevation status. Elevated subkits are not auto-selected.

**MCQ Visual Distinction**

- **FR13:** Elevated (MCQ-suggested) subkits in the visualizer carry a visual indicator that distinguishes them from non-elevated subkits. Sally to specify the exact treatment (badge, border accent, background tint, or icon). The indicator is present in the unselected state and may change or disappear when the user actively selects the subkit.
- **FR14:** The visual distinction must be understandable without color alone (WCAG 2.1 AA). A text label or icon supplement is required.
- **FR15:** The distinction does not imply obligation — the copy and visual treatment must feel like a suggestion, not a requirement.

**Build My Own → `/review` Wiring**

- **FR16:** When a user completes the existing Build My Own flow (SubkitSelection → ItemConfig → Summary) and clicks "Get My Kit" on the Summary screen, the app navigates to `/review` with `kitPath === 'custom'`.
- **FR17:** The `KitSummaryCard` component's `path === 'custom'` branch is implemented. It reads `selectedSubkits` and `itemSelections` from the existing kit store and renders the user's custom kit with category colors, names, sizes, item counts, and pricing.
- **FR18:** The Review & Order page's delivery section and "Place Order" CTA function identically for both Essentials and Custom paths.
- **FR19:** Back navigation from `/review` when `kitPath === 'custom'` returns to `/summary` (not to `/choose`).

**Order Confirmation + "Now Let's Fill Your Kit" CTA**

- **FR20:** The Order Confirmation screen (`/confirmation`) is updated to serve both Essentials and Custom paths. It displays the ordered kit summary appropriate to the path taken.
- **FR21:** For the Essentials path: confirmation shows the 4 Essentials bundle subkits (sourced from `ESSENTIALS_BUNDLE`).
- **FR22:** For the Custom path: confirmation shows the user's selected subkits with configured items (sourced from kit store).
- **FR23:** A new "Now Let's Fill Your Kit" CTA is added below the order summary. This is the entry point to Part 2 of the product experience. For Sprint 2, this CTA routes to a placeholder/stub — Part 2 scope is not Sprint 2. Sally and Winston to align on stub treatment.

### Non-Functional Requirements

- **NFR1:** Elevation logic is implemented as a pure function (`computeElevatedSubkits(emergencyTypes, householdComposition)`) that returns a `Set<string>` of category IDs. This function is independently testable with no component or store dependencies.
- **NFR2:** The Pets subkit addition is fully additive — no existing category data, store logic, or component behavior is modified. All existing consumers are TypeScript-safe.
- **NFR3:** The visualizer layout refresh does not change the underlying state model. `selectedSubkits`, `slotAssignments`, capacity calculations, and size toggles are unaffected.
- **NFR4:** The `KitSummaryCard` custom path reads from the existing kit store. No new store fields are added for Sprint 2.
- **NFR5:** All new and modified components meet WCAG 2.1 AA: elevation indicators are understandable without color alone, keyboard navigation is maintained through the refreshed layout.

### Compatibility Requirements

- **CR1:** The Essentials path (MCQ → Fork → `/review` → `/confirmation`) continues to function exactly as delivered in Sprint 1. Sprint 2 does not modify any Essentials-path component.
- **CR2:** The existing ItemConfigScreen and its per-subkit configuration flow are unchanged. Sprint 2 modifies the SubkitSelectionScreen layout and ordering but not the downstream configuration flow.
- **CR3:** The existing SummaryScreen continues to function but its "Get My Kit" CTA is re-routed to `/review` instead of `/confirmation`.
- **CR4:** All existing unit and E2E tests pass without modification after Sprint 2 changes, with the exception of tests that assert on the SubkitSelectionScreen layout (which will need updating to match the new horizontal layout).

---

## 3. User Interface Enhancement Goals

### Modified Screens

| Screen | Route | Modification |
|---|---|---|
| SubkitSelectionScreen | `/builder` | Layout refresh (vertical → horizontal), MCQ elevation + visual distinction |
| SummaryScreen | `/summary` | "Get My Kit" CTA re-routed to `/review` |
| ReviewOrderScreen | `/review` | `KitSummaryCard` custom path implemented |
| OrderConfirmationScreen | `/confirmation` | Dual-path support, "Now Let's Fill Your Kit" CTA added |

### New Components

| Component | Screen | Purpose |
|---|---|---|
| `ElevationBadge` | SubkitSelectionScreen | Visual indicator on MCQ-elevated subkits |
| `CustomKitSummary` | ReviewOrderScreen | Kit summary card for the Build My Own path |

### UI Design Principles

**Visualizer Refresh:**
- Housing unit visualizer and subkit list displayed side-by-side on desktop (visualizer left, subkit cards right). Stacked on mobile (visualizer top, cards below).
- SubkitCards retain all existing functionality but adapt to the horizontal layout's narrower card width.
- Category colors may be refreshed — Sally to specify updated `colorBase`/`colorTint` values if needed.

**MCQ Elevation:**
- Elevated subkits appear in a visually distinct group at the top of the subkit list, separated from non-elevated subkits by a subtle divider or spacing change.
- The elevation indicator (badge, icon, or border accent) communicates "Suggested for your situation" without implying obligation.
- Once a user selects an elevated subkit, the elevation indicator may transition or reduce to avoid visual clutter — the user's active choice takes precedence over the system's suggestion.

**Build My Own → Review & Order:**
- The custom `KitSummaryCard` mirrors the structure of the Essentials variant but shows user-selected subkits, item counts, and pricing from the kit store.
- Path label changes from "Essentials Kit" to "Custom Kit". Slot count is computed from the user's selections.

**Order Confirmation:**
- Unified layout serves both paths. Kit summary content is path-appropriate.
- "Now Let's Fill Your Kit" CTA is visually prominent below the order summary — this is the bridge to Part 2 and should feel like a natural next step, not an afterthought.

---

## 4. Technical Constraints and Integration Requirements

### Existing Technology Stack

No new dependencies. Sprint 2 uses the same stack as Sprint 1: Vite 6.x, React 18.x, TypeScript 5.x strict, Tailwind CSS v4, Zustand 5.x, React Router 6.4+, Vitest, Playwright, Vercel.

### Integration Approach

- **Pets subkit:** New entry in `CATEGORIES` and minimum 3 items in `ITEMS` in `kitItems.ts`. All Phase 2.5 fields (`weightGrams`, `volumeIn3`) and pricing fields (`pricePlaceholder`) populated. Pure data addition.
- **Elevation logic:** New pure function in `src/utils/elevationRules.ts`. Reads `EmergencyType[]` and `HouseholdOption[]` from `mcqStore`, returns `Set<string>` of elevated category IDs. SubkitSelectionScreen calls this function and sorts the subkit list accordingly.
- **Visual distinction:** New `ElevationBadge` component. SubkitCard receives an `elevated?: boolean` prop and renders the badge conditionally.
- **KitSummaryCard custom path:** The existing `path === 'custom'` branch in `KitSummaryCard` is implemented. Reads `useKitStore().selectedSubkits` and `useKitStore().itemSelections`. Renders using the same card structure as the Essentials variant.
- **Summary → Review wiring:** SummaryScreen's "Get My Kit" CTA calls `useMCQStore.getState().setKitPath('custom')` and navigates to `/review`. `reviewGuard` already passes for `kitPath === 'custom'` (truthy check from Sprint 1).
- **Order Confirmation:** `OrderConfirmationScreen` reads `kitPath` from MCQ store. If `'essentials'`, renders from `ESSENTIALS_BUNDLE`. If `'custom'`, renders from kit store. "Now Let's Fill Your Kit" CTA routes to stub.

### New Files

| File | Purpose |
|---|---|
| `src/utils/elevationRules.ts` | Pure function: MCQ answers → elevated category ID set |

### Modified Files

| File | Change |
|---|---|
| `src/data/kitItems.ts` | New `pets` category + 3 items |
| `src/components/subkit-selection/SubkitSelectionScreen.tsx` | Layout refresh, elevation sorting, visual distinction |
| `src/components/subkit-selection/SubkitCard.tsx` | `elevated` prop, `ElevationBadge` rendering |
| `src/components/review/KitSummaryCard.tsx` | Custom path implementation |
| `src/components/summary/SummaryScreen.tsx` | "Get My Kit" CTA → `/review` with `kitPath: 'custom'` |
| `src/components/confirmation/OrderConfirmationScreen.tsx` | Dual-path support, "Fill Your Kit" CTA |

### Risk Assessment

| Area | Risk | Mitigation |
|---|---|---|
| Visualizer layout refresh | Medium | Layout-only change; state model untouched. Existing SubkitCard tests may need layout assertions updated |
| Elevation sorting logic | Low | Pure function, independently testable, no side effects |
| Build My Own → /review wiring | Low | `reviewGuard` already supports `kitPath === 'custom'`. Single CTA re-route + `KitSummaryCard` implementation |
| Order Confirmation dual-path | Low | Branching on `kitPath` — same pattern as `KitSummaryCard` |
| Pets subkit data addition | Low | Additive; TypeScript enforces field shape compliance |
| "Fill Your Kit" CTA destination | Low | Stub for Sprint 2; Part 2 scope TBD |

---

## 5. Epic and Story Structure

Two epics, ordered by dependency.

- **Epic 15 — Pets Subkit, Visualizer Refresh & MCQ Surfacing:** Adds the Pets subkit to the catalog, refreshes the visualizer layout, implements MCQ elevation logic, and adds visual distinction for suggested subkits. Stories 15.1 (Pets data) and 15.2 (layout refresh) can run in parallel. Story 15.3 (elevation logic) depends on 15.1. Story 15.4 (visual distinction) depends on 15.3.
- **Epic 16 — Build My Own Order Flow & Confirmation:** Wires the Build My Own path to Review & Order, implements the custom `KitSummaryCard`, and updates Order Confirmation for dual-path support with the "Fill Your Kit" CTA. Story 16.1 (KitSummaryCard) can start in parallel with Epic 15. Story 16.2 (wiring) depends on 16.1. Story 16.3 (confirmation) depends on 16.2.

---

## 6. Epic Details

### Epic 15: Pets Subkit, Visualizer Refresh & MCQ Surfacing

**Epic Goal:** Add the Pets subkit to the catalog, modernize the visualizer layout from vertical to horizontal, and implement MCQ-driven subkit elevation with clear visual distinction — making the Build My Own path feel personalized and contextually aware.

---

#### Story 15.1 — Pets Subkit: Catalog Addition

> **Supersedes:** Sprint 1 deferred Story 14.4 (`docs/stories/14.4.story.md`). That file should be marked as superseded by this story during sharding.

As a developer,
I want the Pets subkit added to the catalog with consistent data shape and minimum viable item content,
so that it is available as a selectable option in the visualizer and ready for MCQ-driven surfacing.

**Acceptance Criteria:**

1. New entry added to `CATEGORIES` in `kitItems.ts`:
```ts
pets: {
  id: 'pets',
  name: 'Pets',
  colorBase: '<hex>',     // James's decision — visually distinct from existing 9
  colorTint: '<hex>',     // Lighter variant for card/section backgrounds
  icon: 'PawPrint',       // Confirmed available in lucide-react (Sprint 1 arch Section 8.5)
  description: 'Essential supplies to keep your pets safe, fed, and comfortable during an emergency.',
  sizeOptions: ['regular', 'large'],
}
```

2. Minimum 3 items added to `ITEMS` with `categoryId: 'pets'`. All fields populated:

| Item Name | weightGrams | volumeIn3 | pricePlaceholder | Research Basis |
|---|---|---|---|---|
| Pet Food Supply (3-Day) | 1134 | 168 | 24.99 | 2.5lb dry kibble + 4 cans wet food; ~10"×7"×2.4" |
| Pet Water & Bowl Kit | 680 | 96 | 18.99 | Collapsible bowl + 1-gallon carrier; ~8"×4"×3" |
| Pet First Aid & Comfort Kit | 454 | 84 | 29.99 | Travel first aid + calming spray + comfort toy in zip bag; ~7"×4"×3" |

3. Pets subkit is selectable in the Build My Own visualizer with no code changes to SubkitCard or SubkitSelectionScreen (data-driven rendering).
4. `tsc --noEmit` passes. All existing tests pass without modification.
5. Pets subkit renders correctly in the visualizer with its category color and icon.

**Integration Verification:**
- IV1: Pets subkit appears in the visualizer alongside existing subkits.
- IV2: Pets subkit is selectable and occupies 1 slot (Regular) or 2 slots (Large) correctly.
- IV3: Pets subkit leads to a functional ItemConfigScreen with all 3 items available.
- IV4: All 3 Pets items have non-null `weightGrams`, `volumeIn3`, and `pricePlaceholder` values.
- IV5: All existing subkit tests pass without modification.

---

#### Story 15.2 — Visualizer Layout Refresh: Vertical to Horizontal

As a user,
I want the kit builder screen to display the housing unit and subkit options side-by-side,
so that I can see my selections and available options simultaneously without scrolling.

**Acceptance Criteria:**

1. SubkitSelectionScreen layout is updated: housing unit visualizer on the left, subkit card list on the right (desktop ≥1024px). Stacked on tablet/mobile (visualizer top, cards below).
2. The housing unit visualizer component (`HousingUnitVisualizer`) is unchanged internally. Its container may be resized or repositioned per the new layout.
3. SubkitCards are displayed in a single-column scrollable list within the right panel (desktop) or a 2-column grid (tablet/mobile), per Sally's Sprint 2 spec.
4. Slot usage indicator, SlotFullIndicator warning, and "Configure Items" CTA remain present and functional. Their positioning adapts to the new layout.
5. All existing functionality is preserved: select/deselect, size toggle, slot count impact, capacity enforcement, "Configure Items" navigation.
6. Category color updates (if any) are applied to `CATEGORIES` `colorBase`/`colorTint` values per Sally's Sprint 2 spec.
7. Component tests updated for new layout assertions. All existing behavioral tests still pass.

**Integration Verification:**
- IV1: Visualizer and subkit list display side-by-side on desktop.
- IV2: All existing subkit selection interactions work identically.
- IV3: Capacity system (6 slots, Large = 2 slots) is unchanged.
- IV4: "Configure Items" CTA still navigates to the correct first subkit config screen.
- IV5: Layout stacks correctly on tablet/mobile viewports.

---

#### Story 15.3 — MCQ → Subkit Surfacing Logic

As a user who completed the MCQ and chose Build My Own,
I want the subkits most relevant to my emergency type and household surfaced at the top of the list,
so that I see the most important options first without having to search.

**Acceptance Criteria:**

1. A new pure function `computeElevatedSubkits` is created in `src/utils/elevationRules.ts`:
```ts
import type { EmergencyType, HouseholdOption } from '../store/mcqStore';

export function computeElevatedSubkits(
  emergencyTypes: EmergencyType[],
  householdComposition: HouseholdOption[]
): Set<string> // Returns set of categoryId strings
```

2. The function implements the locked elevation rules:

   **Q2 (household) — additive elevation:**
   - `kids` → `['hygiene', 'medical', 'comfort']`
   - `older-adults` → `['medical', 'comfort']`
   - `disability` → `['medical', 'comfort']`
   - `pets` → `['pets']`
   - `none` → `[]`

   **Q1 (emergency type) — additive elevation:**
   - `flood` / `hurricane` → `['power', 'communications', 'cooking']`
   - `tropical-storm` → `['power', 'communications']`
   - `tornado` → `['medical', 'lighting', 'clothing']`

3. Results are deduplicated (a subkit elevated by both Q1 and Q2 appears once).
4. SubkitSelectionScreen reads MCQ store state and calls `computeElevatedSubkits`. The subkit list is sorted: Q2-elevated first, then Q1-only elevated, then non-elevated in default catalog order.
5. If MCQ store is empty (e.g., direct navigation to `/builder` without MCQ), no elevation is applied — default catalog order.
6. Elevation is informational only — elevated subkits are not pre-selected or auto-added to the kit.
7. Unit tests cover: all Q1 × Q2 combinations, additive deduplication, empty MCQ state fallback, Q2 priority over Q1 ordering.

**Integration Verification:**
- IV1: Completing MCQ with "Flood" + "Pets" → Power, Communications, Cooking, Pets appear at top of visualizer list.
- IV2: Completing MCQ with "Tornado" + "Kids" → Medical, Lighting, Clothing, Hygiene, Comfort appear elevated (Medical deduplicated).
- IV3: Direct navigation to `/builder` (no MCQ) → default catalog order.
- IV4: Elevated subkits are selectable but not pre-selected.
- IV5: All existing tests pass.

---

#### Story 15.4 — MCQ Visual Distinction: Suggested vs. Selected

As a user,
I want to clearly see which subkits the app is suggesting for my situation versus which ones I've actively chosen,
so that I understand the recommendation without feeling pressured.

**Acceptance Criteria:**

1. SubkitCard receives a new optional `elevated?: boolean` prop.
2. When `elevated === true` and the subkit is **not selected**, the card displays an `ElevationBadge` — a visual indicator communicating "Suggested for you" (exact treatment per Sally's Sprint 2 spec: badge, border accent, background tint, or combination).
3. When `elevated === true` and the subkit **is selected**, the elevation indicator transitions to a reduced or removed state — the user's active selection is the primary visual signal. Sally to specify the selected-elevated treatment.
4. When `elevated === false` or undefined, the card renders as it does today — no elevation indicator.
5. The `ElevationBadge` includes a text label (e.g., "Suggested") or icon supplement so the distinction is understandable without color alone (WCAG 2.1 AA).
6. Screen reader announcement: elevated subkits include an `aria-label` supplement (e.g., "Power — Suggested for your situation").
7. Component tests cover: badge renders when elevated + unselected, badge transitions when elevated + selected, badge absent when not elevated, accessibility label present.

**Integration Verification:**
- IV1: MCQ-elevated subkits show visual distinction in the visualizer.
- IV2: Selecting an elevated subkit changes the visual treatment appropriately.
- IV3: Non-elevated subkits are visually unchanged from current behavior.
- IV4: Distinction is perceivable by screen readers.

---

### Epic 16: Build My Own Order Flow & Confirmation

**Epic Goal:** Wire the Build My Own path through to Review & Order and Order Confirmation, implementing the custom `KitSummaryCard` variant and delivering a unified confirmation screen with a "Now Let's Fill Your Kit" CTA as the bridge to Part 2.

---

#### Story 16.1 — KitSummaryCard: Custom Path Implementation

As a developer,
I want the `KitSummaryCard` component's custom path fully implemented,
so that users who built their own kit see an accurate summary on the Review & Order page.

**Acceptance Criteria:**

1. The `KitSummaryCard` `path === 'custom'` branch is implemented (replacing the Sprint 1 scaffold placeholder).
2. The custom variant reads `selectedSubkits` and `itemSelections` from `useKitStore()`.
3. For each selected subkit, the card displays: category icon (from `CATEGORIES`), category name, size (Regular/Large), configured item count, and subkit pricing subtotal.
4. Slot count is computed from the user's selections (same logic as existing `calculateTotalSlots`).
5. Path label displays "Custom Kit" (vs. "Essentials Kit" for the other path).
6. Visual structure matches the Essentials variant: same card shell, same spacing, same typography. Only the content differs.
7. Component tests cover: renders all user-selected subkits, displays correct item counts and subtotals, computes correct slot count, handles edge case of no items configured (empty container), handles subkit with zero items gracefully.

**Integration Verification:**
- IV1: Navigating to `/review` with `kitPath === 'custom'` displays the user's selected subkits.
- IV2: Item counts and pricing match what was configured in the ItemConfigScreen.
- IV3: Slot count matches the SubkitSelectionScreen's slot usage.

---

#### Story 16.2 — Build My Own → `/review` Wiring + E2E

As a user who built my own kit,
I want to proceed from the summary page to Review & Order and then place my order,
so that I complete the same order flow as users who chose the Essentials path.

**Acceptance Criteria:**

1. SummaryScreen's "Get My Kit" CTA is updated: calls `useMCQStore.getState().setKitPath('custom')`, then navigates to `/review`.
2. `reviewGuard` passes for `kitPath === 'custom'` with no guard changes (Sprint 1 designed for this — truthy check).
3. Review & Order page displays the custom `KitSummaryCard` with the user's kit. Delivery section and "Place Order" CTA function identically to the Essentials path.
4. Back navigation from `/review` is path-aware. The `BackLink` `to` prop in `ReviewOrderScreen` reads `kitPath` from the MCQ store: `kitPath === 'essentials'` → `/choose`, `kitPath === 'custom'` → `/summary`. This is a code change to the existing hardcoded `<BackLink to="/choose" />` from Sprint 1.
5. "Place Order" navigates to `/confirmation`.
6. Smoke E2E test covers the full Build My Own happy path: cover → MCQ → fork → `/builder` → select subkits → configure items → `/summary` → `/review` → `/confirmation`.

**Integration Verification:**
- IV1: Full Build My Own path navigable end-to-end.
- IV2: Kit summary on `/review` matches the summary on `/summary`.
- IV3: "Place Order" navigates to `/confirmation` with kit data intact.
- IV4: Back navigation from `/review` returns to `/summary`.
- IV5: Essentials path E2E still passes (no regression).

---

#### Story 16.3 — Order Confirmation: Dual-Path Support + "Fill Your Kit" CTA

As a user who placed an order (via either path),
I want to see a confirmation of what I ordered and a clear next step to fill my kit,
so that I know my order is placed and I'm guided to the next phase of the experience.

**Acceptance Criteria:**

1. `OrderConfirmationScreen` reads `kitPath` from the MCQ store to determine which path was taken.
2. Essentials path (`kitPath === 'essentials'`): confirmation displays the 4 Essentials bundle subkits sourced from `ESSENTIALS_BUNDLE`. Kit total is computed from the bundle's pricing data.
3. Custom path (`kitPath === 'custom'`): confirmation displays the user's selected subkits with configured items, quantities, and pricing sourced from the kit store. This mirrors the existing confirmation behavior but is now explicitly path-branched.
4. Both paths share the same page structure: heading ("Your kit is on its way."), kit summary section, kit total line, and CTAs.
5. A new "Now Let's Fill Your Kit" primary CTA is added below the kit total. Positioned prominently. For Sprint 2, this routes to a stub/placeholder — Part 2 scope is not defined yet. Sally and Winston to align on stub treatment.
6. The existing "Start Over" CTA is retained as a secondary action. Its route target is updated to `/` (cover page) for both paths. The current implementation routes to `/builder`, which is incorrect for Essentials-path users who never visited the builder. `resetKit()` and `resetMCQ()` are both called on "Start Over".
7. Component tests cover: Essentials path renders bundle data, Custom path renders kit store data, "Fill Your Kit" CTA is present and routes to stub, "Start Over" still functions, both paths display kit totals.

**Integration Verification:**
- IV1: Essentials path → confirmation displays Essentials bundle correctly.
- IV2: Custom path → confirmation displays user's custom kit correctly.
- IV3: "Now Let's Fill Your Kit" CTA is present and functional (routes to stub).
- IV4: "Start Over" resets kit and navigates to cover page.
- IV5: Kit totals are accurate for both paths.

---

## 7. Next Steps

### Architect Prompt (Winston)

Winston — Phase 3 Sprint 2 PRD is complete at `docs/prd-phase3-sprint2.md`. Please review and produce the Sprint 2 architecture addendum. Key decisions to address:

- **Elevation logic placement:** Confirm `src/utils/elevationRules.ts` as the location for `computeElevatedSubkits`. Confirm the function signature and return type.
- **SubkitSelectionScreen layout:** Confirm the side-by-side layout approach and any responsive breakpoint decisions. Does the housing unit visualizer component need interface changes?
- **KitSummaryCard custom path:** Confirm the data flow — `useKitStore().selectedSubkits` + `itemSelections` → rendered list. Any new utility functions needed for aggregating item counts and pricing?
- **Back navigation from `/review` (custom path):** Sprint 1 back link routes to `/choose`. For the custom path, it should route to `/summary`. Confirm the approach — path-aware back link in `ReviewOrderScreen`, or a different mechanism?
- **Order Confirmation dual-path:** Confirm the branching approach — `kitPath` from MCQ store determines which summary to render. Any concerns about store state availability at this point in the flow?
- **"Fill Your Kit" stub:** Align with Sally on the stub treatment for the Part 2 CTA.
- **Pets subkit:** Pure data addition — confirm no architectural changes needed.

### UX Prompt (Sally)

Sally — Phase 3 Sprint 2 PRD is complete at `docs/prd-phase3-sprint2.md`. Please produce the Sprint 2 front-end spec addendum. Key decisions to address:

- **Visualizer refresh layout:** Side-by-side wireframe for desktop, stacked for mobile. SubkitCard dimensions in the narrower right panel.
- **Color updates:** Any changes to existing `colorBase`/`colorTint` values? Pets subkit color?
- **Elevation visual treatment:** What does the `ElevationBadge` look like? Badge, border accent, background tint, icon, or combination? Unselected vs. selected states. Text label for WCAG.
- **Elevation group separator:** How are elevated subkits visually grouped vs. non-elevated? Divider, spacing, section header?
- **KitSummaryCard custom variant:** Visual parity with Essentials variant — confirm item count and pricing display.
- **Order Confirmation layout:** Unified layout for both paths. "Fill Your Kit" CTA placement and styling.
- **"Fill Your Kit" stub treatment:** Placeholder page, toast, modal, or disabled state?
- **Copy:** Elevation badge label, "Fill Your Kit" CTA text, confirmation heading variants (if path-specific).
