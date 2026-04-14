# Phase 3 Sprint 2 — Architecture Addendum

> **Author:** Winston, Architect
> **Date:** 2026-04-14
> **Status:** Complete
> **Scope:** Elevation logic, visualizer layout, SubkitCard prop, KitSummaryCard custom path, back navigation, Order Confirmation dual-path, Pets subkit
> **Extends:** `docs/architecture-phase3.md` (Sprint 1 Architecture Brief, v1.0)
> **Inputs:** Sprint 2 PRD (`docs/prd-phase3-sprint2.md` v1.1), Sprint 2 FE Spec (`docs/front-end-spec-phase3-sprint2.md` v1.0)

---

## Table of Contents

1. [Elevation Logic — `computeElevatedSubkits`](#1-elevation-logic--computeelevatedsubkits)
2. [SubkitSelectionScreen Layout Refresh](#2-subkitselectionscreen-layout-refresh)
3. [SubkitCard Prop Addition](#3-subkitcard-prop-addition)
4. [KitSummaryCard Custom Path](#4-kitsummarycard-custom-path)
5. [Back Navigation from `/review` — Path-Aware](#5-back-navigation-from-review--path-aware)
6. [Order Confirmation Dual-Path + Essentials Pricing](#6-order-confirmation-dual-path--essentials-pricing)
7. ["Start Over" Reset + "Fill Your Kit" Stub](#7-start-over-reset--fill-your-kit-stub)
8. [Pets Subkit](#8-pets-subkit)
9. [Icon Availability Verification](#9-icon-availability-verification)
10. [New & Modified File Inventory](#10-new--modified-file-inventory)
11. [Dependency Graph](#11-dependency-graph)

---

## 1. Elevation Logic — `computeElevatedSubkits`

### 1a. Location & Return Type — Confirmed with Revision

Location confirmed: `src/utils/elevationRules.ts` as a new file with a single pure function.

**Return type revised from `Set<string>` to `ElevationResult` struct.** The PRD specifies `Set<string>`, but the sorting requirement (Q2-elevated first, then Q1-only elevated, then non-elevated — PRD Story 15.3 AC4, Sally Decision #10) requires the caller to distinguish Q2-sourced from Q1-sourced elevation. A flat `Set<string>` loses this information.

```typescript
import type { EmergencyType, HouseholdOption } from '../store/mcqStore';

export interface ElevationResult {
  /** Union of all elevated category IDs — use for "is this card elevated?" checks */
  elevated: Set<string>;
  /** Subset elevated by Q2 (household) — use for sort priority within the elevated group */
  q2Elevated: Set<string>;
}

export function computeElevatedSubkits(
  emergencyTypes: EmergencyType[],
  householdComposition: HouseholdOption[]
): ElevationResult
```

**Usage in SubkitSelectionScreen:**

```typescript
const { elevated, q2Elevated } = computeElevatedSubkits(emergencyTypes, householdComposition);

// Sort: Q2-elevated (catalog order) → Q1-only elevated (catalog order) → non-elevated (catalog order)
// A category in both Q2 and Q1 sorts as Q2-elevated (higher priority)
const isQ2 = (id: string) => q2Elevated.has(id);
const isQ1Only = (id: string) => elevated.has(id) && !q2Elevated.has(id);
```

**Why struct, not two functions:** A second function (`computeQ2ElevatedSubkits`) would recompute the Q2 mapping rules independently — redundant work and a maintenance risk if the rules diverge. The struct keeps it as one call, one source of truth, and both fields are independently testable.

### 1b. Sort Responsibility — SubkitSelectionScreen

Sorting logic lives in `SubkitSelectionScreen`, not in the elevation function. `computeElevatedSubkits` answers **what** is elevated. The screen decides **how** to order and group the cards. This matches the existing pattern: the screen already owns `const ALL_CATEGORIES = Object.values(CATEGORIES)` and maps over it to produce cards (line 17 and lines 65–81).

### 1c. Type Imports — Confirmed

The function imports `EmergencyType` and `HouseholdOption` from `src/store/mcqStore.ts`, where they are already exported (lines 4–5 of the current file). No type relocation needed.

### 1d. Elevation Rules — Unchanged

The locked rules from Sprint 1 architecture Section 11 are unchanged. No additions, no removals, no reordering.

**Q2 (household) — additive:**

| Household Option | Elevated Category IDs |
|---|---|
| `kids` | `hygiene`, `medical`, `comfort` |
| `older-adults` | `medical`, `comfort` |
| `disability` | `medical`, `comfort` |
| `pets` | `pets` |
| `none` | _(no effect)_ |

**Q1 (emergency type) — additive:**

| Emergency Type | Elevated Category IDs |
|---|---|
| `flood` / `hurricane` | `power`, `communications`, `cooking` |
| `tropical-storm` | `power`, `communications` |
| `tornado` | `medical`, `lighting`, `clothing` |

Deduplication: a category elevated by both Q1 and Q2 appears once in `elevated`. It also appears in `q2Elevated`, giving it Q2-tier sort priority.

---

## 2. SubkitSelectionScreen Layout Refresh

### 2a. HousingUnitVisualizer — No Interface Changes

The `HousingUnitVisualizer` component (`src/components/visualizer/HousingUnitVisualizer.tsx`) uses `className="w-full max-w-sm mx-auto"` (line 12). At the 40% left column width (Sally Decision #1), the effective container at the 1024px breakpoint is ~400px. The `max-w-sm` constraint (384px) means the visualizer renders at its current maximum width with centering — **it already fits**.

Props are unchanged: `slots: SlotState[]`, `readOnly?: boolean`, `onSlotClick?: (index: number) => void`. No new props, no container constraints needed.

### 2b. Left Column Pinned Elements — No State Flow Impact

`SlotUsageBar`, `SlotFullIndicator`, and the "Configure Items" CTA relocate from below-the-grid (current: lines 116–141 of `SubkitSelectionScreen.tsx`) to the left column below the visualizer. This is a JSX restructuring within the same component. All three elements read from the same hooks they use today (`useSlotState`, `useTotalSlotsUsed`, `useIsAtCapacity`, `useCanProceedToConfig`). No state wiring changes.

Sally Decision #3 confirmed: left column = kit state + actions, right column = options to browse.

### 2c. Integration Approach — All in SubkitSelectionScreen

The elevation sorting, grouping, and prop-passing all live in `SubkitSelectionScreen`. No extraction to a separate hook or utility is needed. The logic is ~15 lines of presentation code within a component that already owns the category list.

**Implementation pattern:**

```typescript
// 1. Read MCQ state
const emergencyTypes = useMCQStore((s) => s.emergencyTypes);
const householdComposition = useMCQStore((s) => s.householdComposition);

// 2. Compute elevation
const { elevated, q2Elevated } = computeElevatedSubkits(emergencyTypes, householdComposition);

// 3. Partition and sort categories
const allCategories = Object.values(CATEGORIES);
const q2Categories = allCategories.filter((c) => q2Elevated.has(c.id));
const q1OnlyCategories = allCategories.filter((c) => elevated.has(c.id) && !q2Elevated.has(c.id));
const nonElevated = allCategories.filter((c) => !elevated.has(c.id));
const sortedCategories = [...q2Categories, ...q1OnlyCategories, ...nonElevated];

// 4. Inject ElevationGroupHeader between groups
// 5. Pass `elevated={elevated.has(category.id)}` to each SubkitCard
```

`Object.values(CATEGORIES)` preserves insertion order (the catalog order), so filtering maintains relative order within each tier. No explicit sort comparator needed.

---

## 3. SubkitCard Prop Addition

### Confirmed: Clean Optional Prop

```typescript
interface SubkitCardProps {
  category: KitCategory;
  selected: boolean;
  disabled: boolean;
  currentSize?: SubkitSize;
  onSelect: (categoryId: string) => void;
  onSizeChange?: (categoryId: string, size: SubkitSize) => boolean;
  elevated?: boolean;  // New — Sprint 2
}
```

**Side effect analysis:** The prop is optional, defaults to `undefined` (falsy). All existing rendering paths treat `!elevated` as "standard card" — no badge, no border accent. The single existing consumer (`SubkitSelectionScreen`) does not pass `elevated` today, so the prop addition is backwards-compatible with zero changes to calling code until Sprint 2 stories are implemented.

**Behavioral changes (per Sally's spec):**

| Condition | Left Border | ElevationBadge | Other Styling |
|---|---|---|---|
| `elevated && !selected` | 3px solid `#22C55E` | Visible | Standard unselected |
| `elevated && selected` | Standard selected (2px `colorBase`) | Hidden | Standard selected |
| `!elevated` (or undefined) | Unchanged | Hidden | Unchanged |

**Aria update:** When `elevated && !selected`, `aria-label` becomes `"{categoryName} — Suggested for your situation"`. Otherwise, existing behavior.

---

## 4. KitSummaryCard Custom Path

### 4a. Data Flow — Existing Utilities Sufficient

`CustomKitSummary` reads from `useKitStore()`:

- **`selectedSubkits: SubkitSelection[]`** — provides category IDs, sizes, selection order
- **`itemSelections: Record<string, ItemSelection>`** — provides per-item quantities and inclusion state

**Per-subkit item count** — derived inline:

```typescript
const itemCount = Object.values(itemSelections)
  .filter((sel) => sel.subkitId === subkit.subkitId && sel.included)
  .length;
```

**Per-subkit subtotal** — uses the existing `calculateSubkitCartTotal` from `src/utils/cartCalculations.ts` (lines 18–35). This function takes `(subkit: SubkitSelection, itemSelections: Record<string, ItemSelection>, allItems: KitItem[])` and returns the container price + sum of included item prices. Exactly what `CustomKitSummary` needs.

**No new utility function needed.** The existing `calculateSubkitCartTotal` handles subtotals. Item counts are a one-liner filter. Category metadata (name, icon, color) is resolved from `CATEGORIES[subkit.categoryId]`, matching the pattern already used by `EssentialsKitSummary` (line 30 of `KitSummaryCard.tsx`).

### 4b. Slot Count — `calculateTotalSlots` Confirmed

`calculateTotalSlots` is exported from `src/utils/slotCalculations.ts` (line 6):

```typescript
export function calculateTotalSlots(selections: SubkitSelection[]): number {
  return selections.reduce((total, s) => total + (s.size === 'large' ? 2 : 1), 0);
}
```

`CustomKitSummary` calls `calculateTotalSlots(selectedSubkits)` to render "Custom Kit · N slots used". Already importable, already used by `SubkitSelectionScreen` (line 47) and `kitStore.ts` (line 3). No changes needed.

### 4c. Component Structure

`KitSummaryCard` already branches on `path` (line 68 of `KitSummaryCard.tsx`). The Sprint 2 implementation replaces the placeholder `<div>Custom kit summary — Sprint 2</div>` (line 72) with `<CustomKitSummary />`. The new component is internal to `KitSummaryCard.tsx` (same pattern as `EssentialsKitSummary`) or extracted to `src/components/review/CustomKitSummary.tsx` — developer's choice, both are clean. No interface change to `KitSummaryCard` itself.

---

## 5. Back Navigation from `/review` — Path-Aware

### Confirmed: Inline Derivation in ReviewOrderScreen

The `BackLink` component (`src/components/ui/BackLink.tsx`) already accepts `to: string` and `label?: string` (default `'Back'`). The `ReviewOrderScreen` already reads `kitPath` from `useMCQStore` (line 12).

**Sprint 2 change** — replace line 24:

```typescript
// Before (Sprint 1):
<BackLink to="/choose" label="Back" />

// After (Sprint 2):
<BackLink
  to={kitPath === 'custom' ? '/summary' : '/choose'}
  label={kitPath === 'custom' ? 'Back to Kit Summary' : 'Back'}
/>
```

**Why not route-level configuration:** A route-level `backTo` config would require a custom route metadata pattern and a hook to read it. For a binary branch that's already two lines of inline logic, the abstraction adds complexity with no benefit. If we later have 5+ paths with different back targets, we can revisit. Not now.

Labels per Sally Decision #17: Essentials → `"Back"` (routes to `/choose`), Custom → `"Back to Kit Summary"` (routes to `/summary`).

---

## 6. Order Confirmation Dual-Path + Essentials Pricing

### 6a. The Key Question: Essentials Kit Total

**Problem:** `ESSENTIALS_BUNDLE` (`src/data/essentialsConfig.ts`) defines `{ subkit: string, size: SubkitSize }` per entry — no pricing. The Essentials path user never configures individual items (that's Part 2). The current `OrderConfirmationScreen` derives pricing from `itemSelections` in the kit store, which the Essentials path does not populate.

**Decision: Compute Essentials total from `ESSENTIALS_BUNDLE` + `CONTAINER_PRICES`.** The Essentials kit at order time is a set of containers. Individual item selection happens in Part 2 ("Fill Your Kit"). So the Sprint 2 Essentials total is the sum of container prices:

```typescript
import { CONTAINER_PRICES } from '../../utils/cartCalculations';
import { ESSENTIALS_BUNDLE } from '../../data/essentialsConfig';

const essentialsTotal = ESSENTIALS_BUNDLE.reduce(
  (sum, item) => sum + CONTAINER_PRICES[item.size],
  0
);
// → 60 (power/large) + 40 (cooking/regular) + 40 (medical/regular) + 40 (communications/regular) = $180.00
```

**Why not add `pricePlaceholder` to `EssentialsBundleItem`:** The bundle defines subkit-level entries, not item-level. Adding a price field to the bundle would duplicate the container pricing logic already encoded in `CONTAINER_PRICES` and create a second source of truth. If container prices change, `CONTAINER_PRICES` updates once — the bundle total follows automatically.

**Why not hardcode:** Fragile. If we add a 5th bundle subkit or change container pricing, the hardcoded value silently becomes wrong.

### 6b. Essentials Confirmation Rendering

The Essentials path confirmation renders a simplified summary: subkit names, sizes, and colors from `ESSENTIALS_BUNDLE` + `CATEGORIES` (same pattern as `EssentialsKitSummary` in `KitSummaryCard.tsx`). No per-item breakdown — the user hasn't selected items yet. The note below the total reads: "Containers included · Items sold separately" (adjusted from the current "Containers included · Items priced individually" to reflect the Essentials flow where items are not yet priced).

### 6c. Custom Path Confirmation — Existing Behavior

The Custom path confirmation mirrors the current `OrderConfirmationScreen` behavior: reads `selectedSubkits`, `itemSelections`, and `emptyContainers` from `useKitStore()`, computes `calculateCartGrandTotal`, renders `SubkitSummarySection` for each subkit. The only change is explicit path-branching via `kitPath` from `useMCQStore`.

### 6d. Store State Availability

**Concern:** Is MCQ store state available at `/confirmation`?

- `kitPath` is stored in `useMCQStore` but excluded from `partialize` (line 50 of `mcqStore.ts`) — it does NOT persist to `sessionStorage`. It survives in-memory across navigations within the same tab session. The `/review` → `/confirmation` navigation is an in-app `navigate()` call, not a page reload. `kitPath` is available.
- If the user refreshes on `/confirmation`, `kitPath` resets to `null`. The `confirmationGuard` does not currently check `kitPath`. **Recommendation:** The confirmation screen should handle `kitPath === null` gracefully — default to the Custom rendering (which reads from `kitStore`, persisted in `localStorage`). The Essentials path has no `kitStore` data, so a `null` kitPath with empty kit store could show an empty state or redirect. For Sprint 2, this edge case (manual refresh on `/confirmation`) is acceptable to leave as-is — the primary flow is navigating from `/review` where `kitPath` is always set.

### 6e. Branching Pattern

```typescript
const kitPath = useMCQStore((s) => s.kitPath);

// Subheading
const subheading = kitPath === 'essentials'
  ? "Here's your Essentials Kit summary."
  : "Here's your custom kit summary.";

// Kit summary content and total — branch on kitPath
// Essentials: ESSENTIALS_BUNDLE + CONTAINER_PRICES
// Custom: useKitStore() + calculateCartGrandTotal
```

---

## 7. "Start Over" Reset + "Fill Your Kit" Stub

### 7a. Reset Ordering — No Concerns

"Start Over" calls `resetKit()`, then `resetMCQ()`, then `navigate('/')`.

**Analysis:**

- `resetKit()` (`kitStore.ts`) resets `selectedSubkits`, `itemSelections`, `emptyContainers`, `currentConfigIndex` to initial values. Independent store, no cross-store subscriptions.
- `resetMCQ()` (`mcqStore.ts`) resets `emergencyTypes`, `householdComposition`, `kitPath` to initial values. Independent store, no cross-store subscriptions.
- `navigate('/')` routes to `CoverScreen`. The `/` route has no guard — no loader function checks store state.

**Could resetting MCQ (setting `kitPath` to `null`) trigger a guard during navigation?** No. Route guards are React Router loaders that fire on navigation TO a protected route. We are navigating to `/`, which has no loader. The guards on `/review`, `/choose`, etc. are not evaluated.

**Could a Zustand subscriber react to `kitPath` becoming `null`?** No. There are no cross-store subscriptions in the codebase. Components that read `kitPath` via `useMCQStore` would re-render, but they are unmounting as we navigate away from `/confirmation`.

**Order is safe. Either order works.** Convention: reset kit first (leaf state), then MCQ (flow state), then navigate. Matches dependency direction.

### 7b. Icon Availability — Verified

Both icons Sally specifies for Sprint 2 are **confirmed present** in `lucide-react@^0.576.0` (the project's installed version):

| Icon | Component | Usage | Status |
|---|---|---|---|
| `Package` | `FillKitStubModal` | 48px centered icon in stub modal | **FOUND** ✅ |
| `Sparkles` | `ElevationBadge` | 10px inline icon in badge pill | **FOUND** ✅ |
| `PawPrint` | Pets `SubkitCard` | Category icon (already verified Sprint 1) | **FOUND** ✅ |

Verified via `node -e "const l = require('lucide-react'); console.log(typeof l.Sparkles, typeof l.Package);"` → `object object`. These are valid React components, importable as named imports per the project's coding standard.

---

## 8. Pets Subkit

### Confirmed: Pure Data Addition, No Architectural Changes

The `KitCategory` interface (`src/types/kit.types.ts` lines 3–11) defines the shape. Adding a new entry to `CATEGORIES` and 3 items to `ITEMS` in `kitItems.ts` requires no interface changes, no component changes, and no store changes.

**Data-driven rendering verification:**

| Consumer | Mechanism | Pets Impact |
|---|---|---|
| `SubkitSelectionScreen` | `Object.values(CATEGORIES)` → maps to `SubkitCard` | Pets card appears automatically |
| `SubkitCard` | Receives `KitCategory` via `category` prop | Renders Pets icon/color/name generically |
| `HousingUnitVisualizer` | Reads `SlotState` from `calculateSlotState` | Pets slot renders with `#BE185D` color |
| `ItemConfigScreen` | Reads `ITEMS_BY_CATEGORY[categoryId]` | Pets items appear when configuring |
| `SummaryScreen` | Iterates `selectedSubkits` → resolves from `CATEGORIES` | Pets subkit appears in summary |
| `calculateSubkitCartTotal` | Generic over any `SubkitSelection` | Computes Pets pricing correctly |
| `calculateSlotState` | Resolves `CATEGORIES[selection.categoryId]` | Pets slot name/color applied |

### `STANDARD_CATEGORY_IDS` Update Required

`STANDARD_CATEGORY_IDS` (`src/data/kitItems.ts` line 51) currently lists 8 categories. `pets` is a standard category (not custom) and must be added:

```typescript
export const STANDARD_CATEGORY_IDS = [
  'power', 'lighting', 'communications', 'hygiene',
  'cooking', 'medical', 'comfort', 'clothing',
  'pets',  // Sprint 2 addition
] as const;
```

**Why this matters:** `CustomSubkitScreen` (`src/components/item-config/CustomSubkitScreen.tsx` lines 56, 160, 176) uses `STANDARD_CATEGORY_IDS` to enumerate which categories' items are browsable in the Custom subkit. Without `'pets'`, Pets items would be invisible in the Custom subkit browser. The Custom subkit's description is "Choose any items from across all categories" — Pets items should be available there.

### Pets Data Shape

```typescript
// Addition to CATEGORIES in src/data/kitItems.ts
pets: {
  id: 'pets',
  name: 'Pets',
  colorBase: '#BE185D',   // rose-700 — Sally Decision #6
  colorTint: '#FFF1F2',   // rose-50
  icon: 'PawPrint',
  description: 'Essential supplies to keep your pets safe, fed, and comfortable during an emergency.',
  sizeOptions: ['regular', 'large'],
},

// Addition to ITEMS in src/data/kitItems.ts (3 items per PRD Story 15.1 AC2)
{ id: 'pets-food',      categoryId: 'pets', name: 'Pet Food Supply (3-Day)',      description: '2.5lb dry kibble + 4 cans wet food',                    rating: null, reviewCount: null, weightGrams: 1134, volumeIn3: 168, productId: null, pricePlaceholder: 24.99, imageSrc: null },
{ id: 'pets-water',     categoryId: 'pets', name: 'Pet Water & Bowl Kit',         description: 'Collapsible bowl + 1-gallon carrier',                   rating: null, reviewCount: null, weightGrams: 680,  volumeIn3: 96,  productId: null, pricePlaceholder: 18.99, imageSrc: null },
{ id: 'pets-first-aid', categoryId: 'pets', name: 'Pet First Aid & Comfort Kit',  description: 'Travel first aid + calming spray + comfort toy in bag',  rating: null, reviewCount: null, weightGrams: 454,  volumeIn3: 84,  productId: null, pricePlaceholder: 29.99, imageSrc: null },
```

---

## 9. Icon Availability Verification

Sprint 1 verified 7 icons (Section 8.5). Sprint 2 adds 2 new icons. All verified against `lucide-react@^0.576.0`:

| Icon | Sprint | Used By | Status |
|---|---|---|---|
| `Tornado` | 1 | MCQ Emergency Type | FOUND ✅ |
| `CloudRainWind` | 1 | MCQ Emergency Type | FOUND ✅ |
| `Accessibility` | 1 | MCQ Household | FOUND ✅ |
| `HeartHandshake` | 1 | MCQ Household | FOUND ✅ |
| `PawPrint` | 1 | MCQ Household + Pets SubkitCard | FOUND ✅ |
| `ShieldCheck` | 1 | Fork Screen | FOUND ✅ |
| `SlidersHorizontal` | 1 | Fork Screen | FOUND ✅ |
| **`Sparkles`** | **2** | **ElevationBadge** | **FOUND ✅** |
| **`Package`** | **2** | **FillKitStubModal** | **FOUND ✅** |

All icons are imported as named imports per the project's coding standard (never wildcard). The `Sparkles` and `Package` icons do not need to be added to `iconResolver.ts` — they are used directly by their respective components, same as the Sprint 1 MCQ/Fork icons.

---

## 10. New & Modified File Inventory

### New Files

| File | Purpose | Story |
|---|---|---|
| `src/utils/elevationRules.ts` | `computeElevatedSubkits` pure function — MCQ answers → `ElevationResult` | 15.3 |
| `src/components/subkit-selection/ElevationBadge.tsx` | Badge pill component for elevated subkits | 15.4 |
| `src/components/subkit-selection/ElevationGroupHeader.tsx` | Section header for elevated group | 15.4 |
| `src/components/confirmation/FillKitStubModal.tsx` | Stub modal for Part 2 bridge CTA | 16.3 |

### Modified Files

| File | Change | Story |
|---|---|---|
| `src/data/kitItems.ts` | Add `pets` to `CATEGORIES`, 3 items to `ITEMS`, `'pets'` to `STANDARD_CATEGORY_IDS` | 15.1 |
| `src/components/subkit-selection/SubkitSelectionScreen.tsx` | Layout refresh (vertical → 40/60 horizontal), import MCQ store + `computeElevatedSubkits`, sort categories, inject `ElevationGroupHeader`, pass `elevated` prop, restructure JSX into left/right columns | 15.2, 15.3, 15.4 |
| `src/components/subkit-selection/SubkitCard.tsx` | Add `elevated?: boolean` prop, render `ElevationBadge` conditionally, apply 3px `#22C55E` left border when elevated+unselected, update `aria-label` | 15.4 |
| `src/components/review/KitSummaryCard.tsx` | Replace custom path placeholder with `CustomKitSummary` reading `useKitStore()`, compute item counts via `calculateSubkitCartTotal`, slot count via `calculateTotalSlots` | 16.1 |
| `src/components/review/ReviewOrderScreen.tsx` | Path-aware `BackLink`: `to` and `label` derived from `kitPath` | 16.2 |
| `src/components/summary/SummaryScreen.tsx` | "Get My Kit" CTA: call `useMCQStore.getState().setKitPath('custom')`, navigate to `/review` instead of `/confirmation` | 16.2 |
| `src/components/confirmation/OrderConfirmationScreen.tsx` | Import `useMCQStore`, branch on `kitPath` for Essentials vs Custom rendering, compute Essentials total from `ESSENTIALS_BUNDLE` + `CONTAINER_PRICES`, add "Fill Your Kit" CTA + `FillKitStubModal`, update "Start Over" to call both `resetKit()` and `resetMCQ()` and navigate to `/` | 16.3 |

### Unchanged Files (Confirmed)

| File | Why Unchanged |
|---|---|
| `src/store/mcqStore.ts` | No new fields, types, or actions. Sprint 2 reads existing state |
| `src/store/kitStore.ts` | No new fields. Custom path reads existing `selectedSubkits` + `itemSelections` |
| `src/data/essentialsConfig.ts` | No pricing added. Essentials total derived from `CONTAINER_PRICES` |
| `src/types/kit.types.ts` | `KitCategory` interface unchanged. Pets data conforms to existing shape |
| `src/utils/cartCalculations.ts` | `calculateSubkitCartTotal` and `CONTAINER_PRICES` used as-is |
| `src/utils/slotCalculations.ts` | `calculateTotalSlots` used as-is |
| `src/router/index.tsx` | No new routes in Sprint 2 |
| `src/router/guards.ts` | `reviewGuard` already passes for `kitPath === 'custom'` (truthy check) |
| `src/components/visualizer/HousingUnitVisualizer.tsx` | No interface changes; container handles narrower column |
| `src/components/ui/BackLink.tsx` | Already accepts `to` and `label` props |

---

## 11. Dependency Graph

Story-level dependencies within Sprint 2:

```
Epic 15:
  15.1 (Pets data)  ─────────────────┐
                                      ├──→ 15.3 (Elevation logic) ──→ 15.4 (Visual distinction)
  15.2 (Layout refresh) ─────────────┘

Epic 16:
  16.1 (KitSummaryCard custom) ──→ 16.2 (Build My Own wiring) ──→ 16.3 (Confirmation dual-path)
```

**Parallelizable:**
- 15.1 and 15.2 can run in parallel (no dependency)
- 16.1 can start in parallel with all of Epic 15 (no dependency)
- 15.3 depends on 15.1 (Pets category ID must exist for elevation rules to reference it)
- 15.4 depends on 15.3 (elevation data drives badge rendering)
- 16.2 depends on 16.1 (KitSummaryCard custom path must exist before wiring the route)
- 16.3 depends on 16.2 (confirmation needs the full flow to work end-to-end)

**Cross-epic:** No hard dependencies between Epic 15 and Epic 16. They can be developed in parallel.

---

*Emergency Prep Kit Builder — Phase 3 Sprint 2 Architecture Addendum | Version 1.0 | 2026-04-14 | Winston, Architect*
