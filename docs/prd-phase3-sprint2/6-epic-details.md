# 6. Epic Details

## Epic 15: Pets Subkit, Visualizer Refresh & MCQ Surfacing

**Epic Goal:** Add the Pets subkit to the catalog, modernize the visualizer layout from vertical to horizontal, and implement MCQ-driven subkit elevation with clear visual distinction — making the Build My Own path feel personalized and contextually aware.

---

### Story 15.1 — Pets Subkit: Catalog Addition

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
  colorBase: '#BE185D',
  colorTint: '#FFF1F2',
  icon: 'PawPrint',
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

3. `'pets'` is added to `STANDARD_CATEGORY_IDS` so Pets items appear in the Custom subkit browser.
4. Pets subkit is selectable in the Build My Own visualizer with no code changes to SubkitCard or SubkitSelectionScreen (data-driven rendering).
5. `tsc --noEmit` passes. All existing tests pass without modification.
6. Pets subkit renders correctly in the visualizer with its category color and icon.

**Integration Verification:**
- IV1: Pets subkit appears in the visualizer alongside existing subkits.
- IV2: Pets subkit is selectable and occupies 1 slot (Regular) or 2 slots (Large) correctly.
- IV3: Pets subkit leads to a functional ItemConfigScreen with all 3 items available.
- IV4: All 3 Pets items have non-null `weightGrams`, `volumeIn3`, and `pricePlaceholder` values.
- IV5: All existing subkit tests pass without modification.

---

### Story 15.2 — Visualizer Layout Refresh: Vertical to Horizontal

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

### Story 15.3 — MCQ → Subkit Surfacing Logic

As a user who completed the MCQ and chose Build My Own,
I want the subkits most relevant to my emergency type and household surfaced at the top of the list,
so that I see the most important options first without having to search.

**Acceptance Criteria:**

1. A new pure function `computeElevatedSubkits` is created in `src/utils/elevationRules.ts`:
```ts
import type { EmergencyType, HouseholdOption } from '../store/mcqStore';

export interface ElevationResult {
  elevated: Set<string>;     // All elevated category IDs
  q2Elevated: Set<string>;   // Q2-sourced subset for sort priority
}

export function computeElevatedSubkits(
  emergencyTypes: EmergencyType[],
  householdComposition: HouseholdOption[]
): ElevationResult
```
*(Return type revised per Winston's architecture addendum — `ElevationResult` struct instead of flat `Set<string>` to support Q2-priority sorting.)*

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

3. Results are deduplicated (a subkit elevated by both Q1 and Q2 appears once in `elevated` and also in `q2Elevated`, giving it Q2-tier sort priority).
4. SubkitSelectionScreen reads MCQ store state and calls `computeElevatedSubkits`. The subkit list is sorted: Q2-elevated first, then Q1-only elevated, then non-elevated in default catalog order.
5. If MCQ store is empty (e.g., direct navigation to `/builder` without MCQ), no elevation is applied — default catalog order.
6. Elevation is informational only — elevated subkits are not pre-selected or auto-added to the kit.
7. Unit tests cover: all Q1 × Q2 combinations, additive deduplication, empty MCQ state fallback, Q2 priority over Q1 ordering, `q2Elevated` subset correctness.

**Integration Verification:**
- IV1: Completing MCQ with "Flood" + "Pets" → Power, Communications, Cooking, Pets appear at top of visualizer list.
- IV2: Completing MCQ with "Tornado" + "Kids" → Medical, Lighting, Clothing, Hygiene, Comfort appear elevated (Medical deduplicated).
- IV3: Direct navigation to `/builder` (no MCQ) → default catalog order.
- IV4: Elevated subkits are selectable but not pre-selected.
- IV5: All existing tests pass.

---

### Story 15.4 — MCQ Visual Distinction: Suggested vs. Selected

As a user,
I want to clearly see which subkits the app is suggesting for my situation versus which ones I've actively chosen,
so that I understand the recommendation without feeling pressured.

**Acceptance Criteria:**

1. SubkitCard receives a new optional `elevated?: boolean` prop.
2. When `elevated === true` and the subkit is **not selected**, the card displays an `ElevationBadge` — a pill badge reading "Suggested for you" with a `Sparkles` icon, plus a 3px `#22C55E` left border accent (per Sally's Sprint 2 spec).
3. When `elevated === true` and the subkit **is selected**, the elevation badge and left border accent disappear entirely — the user's active selection styling is the only visual signal.
4. When `elevated === false` or undefined, the card renders as it does today — no elevation indicator.
5. The `ElevationBadge` includes the text label "Suggested for you" so the distinction is understandable without color alone (WCAG 2.1 AA).
6. Screen reader announcement: elevated subkits include `aria-label="{categoryName} — Suggested for your situation"` when unselected. Standard label when selected.
7. An `ElevationGroupHeader` component renders "Suggested for your situation" above the elevated group with a 16px gap separating it from non-elevated subkits. Only rendered when elevated subkits exist.
8. Component tests cover: badge renders when elevated + unselected, badge disappears when elevated + selected, badge absent when not elevated, accessibility label present, group header renders conditionally.

**Integration Verification:**
- IV1: MCQ-elevated subkits show visual distinction in the visualizer.
- IV2: Selecting an elevated subkit changes the visual treatment appropriately.
- IV3: Non-elevated subkits are visually unchanged from current behavior.
- IV4: Distinction is perceivable by screen readers.

---

## Epic 16: Build My Own Order Flow & Confirmation

**Epic Goal:** Wire the Build My Own path through to Review & Order and Order Confirmation, implementing the custom `KitSummaryCard` variant and delivering a unified confirmation screen with a "Now Let's Fill Your Kit" CTA as the bridge to Part 2.

---

### Story 16.1 — KitSummaryCard: Custom Path Implementation

As a developer,
I want the `KitSummaryCard` component's custom path fully implemented,
so that users who built their own kit see an accurate summary on the Review & Order page.

**Acceptance Criteria:**

1. The `KitSummaryCard` `path === 'custom'` branch is implemented (replacing the Sprint 1 scaffold placeholder).
2. The custom variant reads `selectedSubkits` and `itemSelections` from `useKitStore()`.
3. For each selected subkit, the card displays: category icon (from `CATEGORIES`), category name, size (Regular/Large), configured item count, and subkit pricing subtotal (via existing `calculateSubkitCartTotal`).
4. Slot count is computed from the user's selections via existing `calculateTotalSlots`.
5. Path label displays "Custom Kit · N slots used" (vs. "Essentials Kit · 5 slots used" for the other path). Same `text-caption` typography.
6. Visual structure matches the Essentials variant: same card shell, same spacing, same typography. Two-line row: line 1 = color dot + name + size, line 2 = item count + subtotal.
7. Component tests cover: renders all user-selected subkits, displays correct item counts and subtotals, computes correct slot count, handles edge case of no items configured (empty container), handles subkit with zero items gracefully.

**Integration Verification:**
- IV1: Navigating to `/review` with `kitPath === 'custom'` displays the user's selected subkits.
- IV2: Item counts and pricing match what was configured in the ItemConfigScreen.
- IV3: Slot count matches the SubkitSelectionScreen's slot usage.

---

### Story 16.2 — Build My Own → `/review` Wiring + E2E

As a user who built my own kit,
I want to proceed from the summary page to Review & Order and then place my order,
so that I complete the same order flow as users who chose the Essentials path.

**Acceptance Criteria:**

1. SummaryScreen's "Get My Kit" CTA is updated: calls `useMCQStore.getState().setKitPath('custom')`, then navigates to `/review`.
2. `reviewGuard` passes for `kitPath === 'custom'` with no guard changes (Sprint 1 designed for this — truthy check).
3. Review & Order page displays the custom `KitSummaryCard` with the user's kit. Delivery section and "Place Order" CTA function identically to the Essentials path.
4. Back navigation from `/review` is path-aware. The `BackLink` in `ReviewOrderScreen` reads `kitPath` from the MCQ store: `kitPath === 'essentials'` → `to="/choose"` label `"Back"`, `kitPath === 'custom'` → `to="/summary"` label `"Back to Kit Summary"`.
5. "Place Order" navigates to `/confirmation`.
6. Smoke E2E test covers the full Build My Own happy path: cover → MCQ → fork → `/builder` → select subkits → configure items → `/summary` → `/review` → `/confirmation`.

**Integration Verification:**
- IV1: Full Build My Own path navigable end-to-end.
- IV2: Kit summary on `/review` matches the summary on `/summary`.
- IV3: "Place Order" navigates to `/confirmation` with kit data intact.
- IV4: Back navigation from `/review` returns to `/summary`.
- IV5: Essentials path E2E still passes (no regression).

---

### Story 16.3 — Order Confirmation: Dual-Path Support + "Fill Your Kit" CTA

As a user who placed an order (via either path),
I want to see a confirmation of what I ordered and a clear next step to fill my kit,
so that I know my order is placed and I'm guided to the next phase of the experience.

**Acceptance Criteria:**

1. `OrderConfirmationScreen` reads `kitPath` from the MCQ store to determine which path was taken.
2. Essentials path (`kitPath === 'essentials'`): confirmation displays the 4 Essentials bundle subkits sourced from `ESSENTIALS_BUNDLE`. Kit total is computed from `ESSENTIALS_BUNDLE` + `CONTAINER_PRICES` ($180 = 60+40+40+40). No item-level breakdown — user hasn't selected items yet.
3. Custom path (`kitPath === 'custom'`): confirmation displays the user's selected subkits with configured items, quantities, and pricing sourced from the kit store. This mirrors the existing confirmation behavior but is now explicitly path-branched.
4. Both paths share the same page structure: heading ("Your kit is on its way."), path-specific subheading ("Here's your Essentials Kit summary." / "Here's your custom kit summary."), kit summary section, kit total line, and CTAs.
5. A new "Now Let's Fill Your Kit →" primary CTA is added below the kit total. On click, it opens a `FillKitStubModal` with heading "Coming Soon", encouraging body copy, and a "Got It" dismiss button. Modal follows standard accessibility: `role="dialog"`, `aria-modal="true"`, focus trap, `Escape` to close.
6. The existing "Start Over" CTA is retained as a secondary action. Its route target is updated to `/` (cover page) for both paths. Calls both `resetKit()` and `resetMCQ()`.
7. Component tests cover: Essentials path renders bundle data, Custom path renders kit store data, "Fill Your Kit" CTA opens modal, modal dismisses correctly, "Start Over" resets and navigates, both paths display kit totals.

**Integration Verification:**
- IV1: Essentials path → confirmation displays Essentials bundle correctly.
- IV2: Custom path → confirmation displays user's custom kit correctly.
- IV3: "Now Let's Fill Your Kit" CTA opens stub modal.
- IV4: "Start Over" resets kit and MCQ, navigates to cover page.
- IV5: Kit totals are accurate for both paths.
