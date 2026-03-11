# Story 11.1 — Item Pricing Data + Cart Calculation Pure Functions

**As a** developer,
**I want** all 28 kit items to have a hardcoded `pricePlaceholder` price and a tested set of cart calculation pure functions in `src/utils/cartCalculations.ts`,
**so that** CartSidebar and OrderConfirmationScreen have a single reliable source of truth for all pricing logic.

---

## Acceptance Criteria

**AC1 — `pricePlaceholder` values assigned for all 28 items.**
In `src/data/kitItems.ts`, the `pricePlaceholder` field is set to the following values on every item (currently `null`). No other field on any item is modified.

| Item ID | `pricePlaceholder` |
|---|---|
| `power-station` | `149.99` |
| `power-solar` | `79.99` |
| `power-cables` | `19.99` |
| `power-banks` | `29.99` |
| `power-batteries` | `14.99` |
| `light-matches` | `6.99` |
| `light-flashlight` | `34.99` |
| `light-lantern` | `49.99` |
| `light-headlamp` | `39.99` |
| `light-candles` | `12.99` |
| `light-lighter` | `14.99` |
| `light-string` | `16.99` |
| `comms-radio` | `59.99` |
| `comms-walkie` | `49.99` |
| `hygiene-dental` | `9.99` |
| `hygiene-cups` | `7.99` |
| `hygiene-tp` | `12.99` |
| `hygiene-wipes` | `11.99` |
| `hygiene-feminine` | `14.99` |
| `cook-lifestraw` | `19.99` |
| `cook-propane` | `9.99` |
| `cook-stove` | `49.99` |
| `med-first-aid` | `74.99` |
| `med-ice-packs` | `14.99` |
| `comfort-fan` | `24.99` |
| `comfort-earplugs` | `12.99` |
| `cloth-ponchos` | `14.99` |
| `cloth-shoe-covers` | `11.99` |

**AC2 — `src/utils/cartCalculations.ts` created with `CONTAINER_PRICES` constant.**
The file exports:
```typescript
export const CONTAINER_PRICES: Record<'regular' | 'large', number> = {
  regular: 40,
  large: 60,
};
```

**AC3 — `calculateItemLineTotal` pure function.**
Exported from `cartCalculations.ts` with signature:
```typescript
export function calculateItemLineTotal(
  pricePlaceholder: number | null,
  quantity: number
): number
```
Returns `pricePlaceholder * quantity` when `pricePlaceholder` is a non-null number. Returns `0` when `pricePlaceholder` is `null` or `0`. No side effects.

**AC4 — `calculateSubkitCartTotal` pure function.**
Exported with signature:
```typescript
export function calculateSubkitCartTotal(
  subkit: SubkitSelection,
  itemSelections: Record<string, ItemSelection>,
  allItems: KitItem[]
): number
```
Returns the sum of:
1. `CONTAINER_PRICES[subkit.size]` (always included — even empty-container subkits carry a container price)
2. For every entry in `itemSelections` where `sel.subkitId === subkit.subkitId` and `sel.included === true`: `calculateItemLineTotal(matchingItem.pricePlaceholder, sel.quantity)`, where `matchingItem` is found via `allItems.find(i => i.id === sel.itemId)`. If no matching item is found, that selection contributes `0`.

**AC5 — `calculateCartGrandTotal` pure function.**
Exported with signature:
```typescript
export function calculateCartGrandTotal(
  selectedSubkits: SubkitSelection[],
  itemSelections: Record<string, ItemSelection>,
  allItems: KitItem[]
): number
```
Returns the sum of `calculateSubkitCartTotal(subkit, itemSelections, allItems)` for every subkit in `selectedSubkits`.

**AC6 — No external imports in `cartCalculations.ts`.**
The file imports only from `../types/kit.types` (or `../types/index`). It does not import from the store, from `kitItems.ts`, or from any other utility.

**AC7 — Unit tests in `tests/unit/cartCalculations.test.ts`.**
The following test cases are required (test descriptions are normative):

| Test case | Assertion |
|---|---|
| `CONTAINER_PRICES.regular` equals 40 | `expect(CONTAINER_PRICES.regular).toBe(40)` |
| `CONTAINER_PRICES.large` equals 60 | `expect(CONTAINER_PRICES.large).toBe(60)` |
| `calculateItemLineTotal` with valid price and qty 3 | `calculateItemLineTotal(19.99, 3)` ≈ `59.97` |
| `calculateItemLineTotal` with `null` price returns 0 | `calculateItemLineTotal(null, 5)` === `0` |
| `calculateItemLineTotal` with `0` price returns 0 | `calculateItemLineTotal(0, 5)` === `0` |
| `calculateSubkitCartTotal` — Regular container + 1 included item (`pricePlaceholder: 14.99`, `qty: 2`) = `40 + 29.98` | `expect(result).toBeCloseTo(69.98)` |
| `calculateSubkitCartTotal` — Large container + no included items = `60` | `expect(result).toBe(60)` |
| `calculateSubkitCartTotal` — Regular container + item with `null` pricePlaceholder = `40` | `expect(result).toBe(40)` |
| `calculateCartGrandTotal` — 2 Regular subkits, no items = `80` | `expect(result).toBe(80)` |
| `calculateCartGrandTotal` — empty `selectedSubkits` array = `0` | `expect(result).toBe(0)` |

**AC8 — TypeScript strict compilation passes.**
`tsc --noEmit` reports zero errors. All existing tests continue to pass.

---

## Integration Verification

- **IV1:** `npm run typecheck` passes — `KitItem.pricePlaceholder` was already typed as `number | null`; no type change required; all existing consumers unaffected.
- **IV2:** `npm run test:run` passes — all new `cartCalculations.test.ts` cases green; all existing tests untouched.
- **IV3:** Importing `{ calculateCartGrandTotal, CONTAINER_PRICES }` from `cartCalculations.ts` in a scratch test with real `ITEMS` from `kitItems.ts` and a mock selections map returns a non-zero dollar total for a stocked subkit.

---

## Dev Notes

**Files modified:**
- `src/data/kitItems.ts` — set `pricePlaceholder` on all 28 items per AC1 table. Find each item by its `id` field and update that single field only. All other fields (`rating`, `reviewCount`, `weightGrams`, `volumeIn3`, `productId`, `imageSrc`) remain exactly as set in prior phases.

**New file:**
- `src/utils/cartCalculations.ts`

**New test file:**
- `tests/unit/cartCalculations.test.ts`

**Type references** (from `src/types/kit.types.ts`):
```typescript
// Existing type — DO NOT MODIFY
export interface KitItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  rating: number | null;
  reviewCount: number | null;
  weightGrams: number | null;      // Phase 2.5
  volumeIn3: number | null;        // Phase 2.5
  productId: string | null;
  pricePlaceholder: number | null; // THIS is what gets populated; no type change needed
  imageSrc: string | null;
}

// Existing type — reference only; DO NOT MODIFY
export interface SubkitSelection {
  subkitId: string;
  categoryId: string;
  size: 'regular' | 'large';
  selectionOrder: number;
}

// Existing type — reference only; DO NOT MODIFY
export interface ItemSelection {
  subkitId: string;
  itemId: string;
  quantity: number;
  included: boolean;
}
```

**`cartCalculations.ts` header — import pattern:**
```typescript
import type { KitItem, SubkitSelection, ItemSelection } from '../types/kit.types';
```
(Or `'../types'` if the barrel export in `src/types/index.ts` re-exports these types — follow whatever import path the existing utilities like `slotCalculations.ts` use for these types.)

**Floating-point note:** `calculateItemLineTotal`, `calculateSubkitCartTotal`, and `calculateCartGrandTotal` return raw `number` values. Display formatting (e.g., `(value).toFixed(2)`) is the responsibility of the rendering component, not these functions. Do not call `.toFixed()` inside the pure functions.

**Testing pattern** — follow the existing pattern in `tests/unit/slotCalculations.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import {
  CONTAINER_PRICES,
  calculateItemLineTotal,
  calculateSubkitCartTotal,
  calculateCartGrandTotal,
} from '../../src/utils/cartCalculations';
```
Use `toBeCloseTo` (default precision 2) for any assertion involving floating-point arithmetic with multiple multiplications. Use `toBe` for integer results and constant assertions.

### Testing
- Test file location: `tests/unit/cartCalculations.test.ts`
- Framework: Vitest — `describe` / `it` / `expect`
- No RTL or DOM rendering needed — pure function unit tests only
- All 10 test cases in AC7 are required; no axe assertion needed for this story

---
