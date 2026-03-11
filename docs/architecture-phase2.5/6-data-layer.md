# 6. Data Layer

## Updated KitItem Type

Two new nullable fields added to `KitItem`. All existing consumers are unaffected — the fields are additive.

```typescript
// src/types/kit.types.ts — Phase 2 addition
export interface KitItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  // Phase 2 fields — populated with hardcoded values for all 28 items
  rating: number | null;       // 3.8–5.0, one decimal place
  reviewCount: number | null;  // Realistic count
  // Phase 3+ fields — remain nullable
  productId: string | null;
  pricePlaceholder: number | null;
  imageSrc: string | null;
}
```

## Updated kitItems.ts — Rating and ReviewCount

All 28 items are populated with hardcoded `rating` (3.8–5.0, one decimal) and `reviewCount` values. Phase 3 Bazaarvoice live data replaces these values at the data layer only — `StarRating` component and `ItemCard` integration are data-source agnostic.

```typescript
// src/data/kitItems.ts — sample showing updated shape for all items
export const ITEMS: KitItem[] = [
  // Power
  { id: 'power-station',    categoryId: 'power',    name: 'Portable Power Station', description: 'Lithium battery for device charging',   rating: 4.8, reviewCount: 342, productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'power-solar',      categoryId: 'power',    name: 'Solar Panel',            description: 'Foldable panel for off-grid charging',  rating: 4.6, reviewCount: 218, productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'power-cables',     categoryId: 'power',    name: 'Charging Cables',        description: 'USB-C and USB-A multi-cable set',       rating: 4.5, reviewCount: 512, productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'power-banks',      categoryId: 'power',    name: 'Power Banks',            description: 'Pocket-sized backup battery',           rating: 4.7, reviewCount: 289, productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'power-batteries',  categoryId: 'power',    name: 'Batteries AA/AAA',       description: 'Standard alkaline multi-pack',          rating: 4.4, reviewCount: 731, productId: null, pricePlaceholder: null, imageSrc: null },
  // Lighting
  { id: 'light-matches',    categoryId: 'lighting', name: 'Matches',                description: 'Waterproof strike-anywhere matches',    rating: 4.3, reviewCount: 198, productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'light-flashlight', categoryId: 'lighting', name: 'Flashlights',            description: 'High-lumen LED flashlight',             rating: 4.8, reviewCount: 456, productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'light-lantern',    categoryId: 'lighting', name: 'Electric Lanterns',      description: 'Rechargeable 360 degree area lantern', rating: 4.7, reviewCount: 324, productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'light-headlamp',   categoryId: 'lighting', name: 'Headlamp',               description: 'Hands-free adjustable headlamp',       rating: 4.9, reviewCount: 612, productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'light-candles',    categoryId: 'lighting', name: 'Candles',                description: 'Long-burn emergency candles',          rating: 4.2, reviewCount: 143, productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'light-lighter',    categoryId: 'lighting', name: 'Lighter',                description: 'Windproof refillable lighter',         rating: 4.5, reviewCount: 387, productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'light-string',     categoryId: 'lighting', name: 'String Lights',          description: 'Battery-powered ambient lighting',     rating: 3.9, reviewCount: 97,  productId: null, pricePlaceholder: null, imageSrc: null },
  // Communications
  { id: 'comms-radio',      categoryId: 'communications', name: 'Hand Crank Radio',  description: 'NOAA weather + AM/FM, no power needed', rating: 4.8, reviewCount: 521, productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'comms-walkie',     categoryId: 'communications', name: 'Walkie Talkies',    description: 'Two-way communication up to 35 miles',  rating: 4.4, reviewCount: 276, productId: null, pricePlaceholder: null, imageSrc: null },
  // Hygiene
  { id: 'hygiene-dental',   categoryId: 'hygiene',  name: 'Dental Hygiene Kit',        description: 'Travel toothbrush, toothpaste, floss', rating: 4.3, reviewCount: 189, productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'hygiene-cups',     categoryId: 'hygiene',  name: 'Paper Cups',                description: 'Disposable cups for clean water use',  rating: 4.1, reviewCount: 234, productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'hygiene-tp',       categoryId: 'hygiene',  name: 'Toilet Paper',              description: 'Compact emergency-use rolls',          rating: 4.6, reviewCount: 445, productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'hygiene-wipes',    categoryId: 'hygiene',  name: 'Baby Wipes',                description: 'No-rinse full-body cleansing wipes',   rating: 4.7, reviewCount: 398, productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'hygiene-feminine', categoryId: 'hygiene',  name: 'Feminine Hygiene Products', description: 'Assorted period care essentials',      rating: 4.5, reviewCount: 312, productId: null, pricePlaceholder: null, imageSrc: null },
  // Cooking
  { id: 'cook-lifestraw',   categoryId: 'cooking',  name: 'Lifestraw',      description: 'Personal water filtration straw',       rating: 4.9, reviewCount: 687, productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'cook-propane',     categoryId: 'cooking',  name: 'Propane Tank',   description: '1lb canister for camp stove',           rating: 4.5, reviewCount: 203, productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'cook-stove',       categoryId: 'cooking',  name: 'Camping Stove',  description: 'Compact single-burner propane stove',   rating: 4.7, reviewCount: 318, productId: null, pricePlaceholder: null, imageSrc: null },
  // Medical
  { id: 'med-first-aid',    categoryId: 'medical',  name: 'First Aid Kit',  description: 'Comprehensive 200-piece trauma kit',    rating: 4.8, reviewCount: 524, productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'med-ice-packs',    categoryId: 'medical',  name: 'Ice Packs',      description: 'Instant cold compress packs',           rating: 4.4, reviewCount: 167, productId: null, pricePlaceholder: null, imageSrc: null },
  // Comfort
  { id: 'comfort-fan',      categoryId: 'comfort',  name: 'Portable Fan',   description: 'Battery-powered USB desk fan',          rating: 4.3, reviewCount: 241, productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'comfort-earplugs', categoryId: 'comfort',  name: 'Ear Plugs',      description: 'High-NRR foam ear plugs',               rating: 4.6, reviewCount: 378, productId: null, pricePlaceholder: null, imageSrc: null },
  // Clothing
  { id: 'cloth-ponchos',    categoryId: 'clothing', name: 'Ponchos',        description: 'Waterproof hooded emergency ponchos',   rating: 4.2, reviewCount: 134, productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'cloth-shoe-covers',categoryId: 'clothing', name: 'Shoe Covers',    description: 'Heavy-duty waterproof boot covers',     rating: 3.8, reviewCount: 89,  productId: null, pricePlaceholder: null, imageSrc: null },
];
// CATEGORIES, ITEMS_BY_CATEGORY, STANDARD_CATEGORY_IDS, ITEM_ICON_OVERRIDES — unchanged from Phase 1
```

## New: checkoutService.ts

The e-commerce API contract is TBD. `checkoutService.ts` is designed behind a typed interface so the implementation can be swapped when the real API spec arrives without touching `SummaryScreen`.

```typescript
// src/services/checkoutService.ts
import type { SubkitSelection, ItemSelection } from '../types';
import { ENV } from '../tokens/env';

export interface CheckoutPayload {
  kitId: string;           // uuid generated at checkout time — idempotency key
  subkits: Array<{
    subkitId: string;
    categoryId: string;
    size: 'regular' | 'large';
    selectionOrder: number;
    items: Array<{
      itemId: string;
      quantity: number;
    }>;
    emptyContainer: boolean;
  }>;
}

export type CheckoutResult =
  | { success: true; redirectUrl: string }
  | { success: false; errorMessage: string };

function buildPayload(
  selectedSubkits: SubkitSelection[],
  itemSelections: Record<string, ItemSelection>,
  emptyContainers: string[]
): CheckoutPayload {
  return {
    kitId: crypto.randomUUID(),
    subkits: selectedSubkits.map((s) => ({
      subkitId: s.subkitId,
      categoryId: s.categoryId,
      size: s.size,
      selectionOrder: s.selectionOrder,
      emptyContainer: emptyContainers.includes(s.subkitId),
      items: Object.values(itemSelections)
        .filter((sel) => sel.subkitId === s.subkitId)
        .map((sel) => ({ itemId: sel.itemId, quantity: sel.quantity })),
    })),
  };
}

export async function initiateCheckout(
  selectedSubkits: SubkitSelection[],
  itemSelections: Record<string, ItemSelection>,
  emptyContainers: string[]
): Promise<CheckoutResult> {
  const payload = buildPayload(selectedSubkits, itemSelections, emptyContainers);
  try {
    const response = await fetch(ENV.purchaseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      return { success: false, errorMessage: 'Something went wrong. Please try again.' };
    }
    const data = await response.json() as { redirectUrl: string };
    return { success: true, redirectUrl: data.redirectUrl };
  } catch {
    return { success: false, errorMessage: 'Unable to connect. Please check your connection and try again.' };
  }
}
```

## New: analytics.ts

```typescript
// src/utils/analytics.ts
import { ENV } from '../tokens/env';

// gtag is injected by Google Analytics script. Declare to satisfy TypeScript.
declare function gtag(command: string, action: string, params?: Record<string, unknown>): void;

function track(eventName: string, params?: Record<string, unknown>): void {
  try {
    if (typeof gtag === 'undefined' || !ENV.analyticsId) return;
    gtag('event', eventName, params);
  } catch {
    // Analytics failures are always silently swallowed — never user-facing
  }
}

export const Analytics = {
  kitCompleted: () =>
    track('kit_completed'),
  subkitSelected: (categoryId: string, size: string) =>
    track('subkit_selected', { categoryId, size }),
  itemIncluded: (itemId: string, categoryId: string) =>
    track('item_included', { itemId, categoryId }),
  ctaClicked: () =>
    track('cta_clicked'),
} as const;
```

**GA4 script injection in AppShell.tsx:**

```typescript
// In AppShell.tsx — useEffect runs once on mount
useEffect(() => {
  if (!ENV.analyticsId) return;
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${ENV.analyticsId}`;
  script.async = true;
  document.head.appendChild(script);
  script.onload = () => {
    (window as Record<string, unknown>)['dataLayer'] = (window as Record<string, unknown>)['dataLayer'] || [];
    gtag('js', new Date().toISOString());
    gtag('config', ENV.analyticsId);
  };
}, []);
```

## New: StarRating Component

```typescript
// src/components/ui/StarRating.tsx
import { type FC } from 'react';

interface StarRatingProps {
  rating: number;       // e.g. 4.3
  reviewCount: number;  // e.g. 128
}

export const StarRating: FC<StarRatingProps> = ({ rating, reviewCount }) => {
  const percentage = (rating / 5) * 100;
  return (
    <div
      className="flex items-center gap-1.5"
      aria-label={`Rated ${rating} out of 5 based on ${reviewCount} reviews`}
    >
      {/* CSS width-clip stars: empty layer below, filled layer clipped on top */}
      <div className="relative inline-flex" aria-hidden="true">
        {/* Empty stars */}
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} className="w-3.5 h-3.5" viewBox="0 0 20 20">
              <path
                d="M10 1l2.39 4.84L18 6.77l-4 3.9.94 5.52L10 13.77l-4.94 2.42L6 10.67 2 6.77l5.61-.93L10 1z"
                fill="var(--color-neutral-200)"
              />
            </svg>
          ))}
        </div>
        {/* Filled stars — clipped to rating percentage */}
        <div
          className="absolute inset-0 flex overflow-hidden"
          style={{ width: `${percentage}%` }}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} className="w-3.5 h-3.5 shrink-0" viewBox="0 0 20 20">
              <path
                d="M10 1l2.39 4.84L18 6.77l-4 3.9.94 5.52L10 13.77l-4.94 2.42L6 10.67 2 6.77l5.61-.93L10 1z"
                fill="var(--color-brand-accent)"
              />
            </svg>
          ))}
        </div>
      </div>
      <span className="text-xs text-[var(--color-neutral-500)]">
        {rating.toFixed(1)} ({reviewCount.toLocaleString()} reviews)
      </span>
    </div>
  );
};
```

**ItemCard integration:** `StarRating` renders below item name and description, above the include/exclude toggle row. It is conditionally rendered only when `item.rating !== null`. The include/exclude toggle and `QuantitySelector` layout are unchanged.

**SubkitSummarySection:** Does not import or render `StarRating`. Per PRD FR11 — star ratings do not appear on the Summary Page.

## Phase 2.5 Changes — Data Layer

### Updated KitItem Type

Two additional nullable fields added to `KitItem` after `reviewCount`. All existing consumers are unaffected — the fields are additive. TypeScript strict mode requires no changes at any call site.

```typescript
// src/types/kit.types.ts — Phase 2.5 addition (after reviewCount)
export interface KitItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  // Phase 2 fields
  rating: number | null;
  reviewCount: number | null;
  // Phase 2.5 fields — weight and volume metadata
  weightGrams: number | null;  // estimated item weight in grams; null-safe in calculations
  volumeIn3: number | null;    // estimated item displaced volume in cubic inches; null-safe
  // Phase 3+ fields — remain nullable
  productId: string | null;
  pricePlaceholder: number | null;
  imageSrc: string | null;
}
```

All 28 items in `src/data/kitItems.ts` are populated with researched `weightGrams` and `volumeIn3` values per the Story 9.1 AC2 lookup table. No item has a `null` value for either field in Phase 2.5. The full lookup table is the authoritative source in the PRD — values are not repeated here.

### New Pure Functions — slotCalculations.ts

Two new exported functions are appended to `src/utils/slotCalculations.ts` after all existing exports. No existing function is modified.

**Key format:** Both functions look up item selections using the `${subkitId}::${item.id}` key — consistent with the existing store key convention used throughout the application.

**Null safety:** Items with `weightGrams === null` or `volumeIn3 === null` contribute 0 to their respective sums. Items whose selection key is absent from `selections` contribute nothing.

```typescript
// Appended to src/utils/slotCalculations.ts — Phase 2.5

/**
 * Returns the total estimated weight in pounds of all selected items in a subkit.
 * Sums (weightGrams × quantity) for each included item; divides by 453.592.
 * Returns parseFloat(result.toFixed(1)) — number with one decimal.
 * Returns 0 if no items are included.
 */
export function calculateSubkitWeightLbs(
  items: KitItem[],
  selections: Record<string, ItemSelection>,
  subkitId: string
): number {
  const totalGrams = items.reduce((sum, item) => {
    const key = `${subkitId}::${item.id}`;
    const sel = selections[key];
    if (!sel?.included || item.weightGrams === null) return sum;
    return sum + item.weightGrams * sel.quantity;
  }, 0);
  return parseFloat((totalGrams / 453.592).toFixed(1));
}

/**
 * Returns the volume fill percentage as an unclamped integer.
 * Sums (volumeIn3 × quantity) for each included item; divides by capacityIn3; multiplies by 100.
 * Returns Math.round(result) — unclamped (callers clamp bar width to min(pct, 100)% for display).
 * Returns 0 if no items are included or capacityIn3 is 0.
 */
export function calculateSubkitVolumePct(
  items: KitItem[],
  selections: Record<string, ItemSelection>,
  subkitId: string,
  capacityIn3: number
): number {
  if (capacityIn3 === 0) return 0;
  const totalVolume = items.reduce((sum, item) => {
    const key = `${subkitId}::${item.id}`;
    const sel = selections[key];
    if (!sel?.included || item.volumeIn3 === null) return sum;
    return sum + item.volumeIn3 * sel.quantity;
  }, 0);
  return Math.round((totalVolume / capacityIn3) * 100);
}
```

**Container capacities (from Phase 1 PRD Story 1.2):**
- Regular container: 1,728 in³
- Large container: 3,456 in³

**Clamping boundary:** Both functions return unclamped values. The caller is responsible for clamping the volume bar fill width to `Math.min(pct, 100)%` for display. The label always shows the true computed integer (e.g., `112% filled`). No warnings are triggered at any value — FR13 is absolute.

### SubkitStatsStrip Component Spec

```typescript
// src/components/item-config/SubkitStatsStrip.tsx

interface SubkitStatsStripProps {
  weightLbs: number;              // pre-computed by parent via calculateSubkitWeightLbs
  volumePct: number;              // pre-computed by parent via calculateSubkitVolumePct (unclamped integer)
  categoryColor: string;          // category base hex; used for volume bar fill via inline style
}
```

**Note on props interface:** The `front-end-spec.md` v1.2 Component Library section documents `weightGrams`, `volumeIn3`, and `containerCapacityIn3` as raw props with internal unit conversion. **This is superseded by PRD Story 9.3 AC1 and the Technical Decisions table.** The correct interface passes pre-computed `weightLbs` and `volumePct` — unit conversion happens in the parent via `calculateSubkitWeightLbs` and `calculateSubkitVolumePct`. `containerCapacityIn3` is not part of the interface — the percentage is fully encoded in `volumePct` and the ARIA label uses plain-English phrasing rather than the raw divisor.

**Rendering rules:**
- Weight label (left): `` `~${weightLbs.toFixed(1)} lbs` `` — `text-caption` (12px/400), `neutral-500`
- Volume bar fill: `style={{ backgroundColor: categoryColor, width: Math.min(volumePct, 100) + '%' }}` — `radius-full`, `transition: width 150ms cubic-bezier(0.4,0,0.2,1)`
- Volume label (right): `` `${volumePct}% filled` `` — true unclamped integer; `text-caption`, `neutral-500`
- Bar width is clamped; label is not — the two values may diverge above 100%
- Dynamic `backgroundColor` always via inline `style` prop — never Tailwind arbitrary values (Rule 8)

**Accessibility:**
- Container `div`: `aria-label="Subkit stats — {weightLbs.toFixed(1)} lbs, {volumePct}% of container capacity filled"`
- Volume bar track: `role="progressbar"`, `aria-valuenow={volumePct}`, `aria-valuemin={0}`, `aria-valuemax={100}`, `aria-label="Container volume"`

**Empty container state:** Parent passes `weightLbs={0}` and `volumePct={0}`; strip renders `~0.0 lbs` and `0% filled` with an empty bar. No special branch in the component — zero values flow through identically to non-zero values.

---
