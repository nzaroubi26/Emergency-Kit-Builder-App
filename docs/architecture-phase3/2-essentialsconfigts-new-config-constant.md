# 2. `essentialsConfig.ts` — New Config Constant

## New File: `src/data/essentialsConfig.ts`

```typescript
import type { SubkitSize } from '../types';

export interface EssentialsBundleItem {
  subkit: string;      // matches CATEGORIES key / categoryId in kitItems.ts
  size: SubkitSize;    // reuses existing SubkitSize = 'regular' | 'large'
}

export const ESSENTIALS_BUNDLE: EssentialsBundleItem[] = [
  { subkit: 'power',          size: 'large'   },
  { subkit: 'cooking',        size: 'regular' },
  { subkit: 'medical',        size: 'regular' },
  { subkit: 'communications', size: 'regular' },
];
```

## Verification Against Existing Data Model

- **Subkit identifiers confirmed.** `'power'`, `'cooking'`, `'medical'`, `'communications'` all exist as keys in `CATEGORIES` (`src/data/kitItems.ts`) and as `categoryId` values across `ITEMS`.
- **`SubkitSize` reused.** The `size` field uses the existing `SubkitSize = 'regular' | 'large'` type from `kit.types.ts`. No new type needed.
- **`subkit` field type.** Uses `string` rather than a narrower union — consistent with existing system which uses `string` for `categoryId` throughout (`KitCategory.id`, `KitItem.categoryId`, `SubkitSelection.categoryId`).

## Slot Count Derivation

Sally's spec shows "5 slots used" on the Review & Order page. The existing `calculateTotalSlots` function (`src/utils/slotCalculations.ts`) already encodes the rule: large = 2 slots, regular = 1 slot.

To derive slot count from `ESSENTIALS_BUNDLE`, `KitSummaryCard` uses the same logic inline:

```typescript
const slotCount = ESSENTIALS_BUNDLE.reduce(
  (sum, item) => sum + (item.size === 'large' ? 2 : 1), 0
);
// → 2 + 1 + 1 + 1 = 5
```

This mirrors the existing slot logic without adding a dependency or changing `slotCalculations.ts`.

---
