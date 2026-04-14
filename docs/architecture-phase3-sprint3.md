# Phase 3 Sprint 3A — Architecture Brief

> **Author:** Winston, Architect
> **Date:** 2026-04-14
> **Status:** Ready for alignment check
> **Scope:** Product data layer, affiliate utilities, MCQ-driven ordering, route architecture, image storage, kitItems.ts impact, FillKitStubModal removal, Fill Your Kit screen integration
> **PRD:** `docs/prd-phase3-sprint3.md` v1.2 (PO-reviewed)
> **Parallel track:** Sally (UX) — front-end spec depends on this brief

---

## Table of Contents

1. [amazonProducts.ts — Type Definitions and Data Shape](#1-amazonproductsts--type-definitions-and-data-shape)
2. [affiliateLink.ts — Affiliate URL Utility](#2-affiliatelinktts--affiliate-url-utility)
3. [cartUrl.ts — Add to Cart URL Utility](#3-carturlts--add-to-cart-url-utility)
4. [subkitOrdering.ts — MCQ-Driven Display Order](#4-subkitorderingts--mcq-driven-display-order)
5. [Route Architecture — /fill Route, Guard, Mobile Exemption](#5-route-architecture--fill-route-guard-mobile-exemption)
6. [Image Storage Decision — PO Flag #8](#6-image-storage-decision--po-flag-8)
7. [Route Guard Decision — PO Flag #10](#7-route-guard-decision--po-flag-10)
8. [kitItems.ts Change Impact Assessment](#8-kititemsts-change-impact-assessment)
9. [FillKitStubModal Removal Impact](#9-fillkitstubmodal-removal-impact)
10. [Fill Your Kit Screen — Integration Notes](#10-fill-your-kit-screen--integration-notes)
11. [Icon Resolver Update](#11-icon-resolver-update)
12. [Sally Coordination Points](#12-sally-coordination-points)
13. [New File Inventory](#13-new-file-inventory)
14. [Exclusions — What Is NOT Sprint 3A](#14-exclusions--what-is-not-sprint-3a)

---

## 1. `amazonProducts.ts` — Type Definitions and Data Shape

### New File: `src/data/amazonProducts.ts`

```typescript
import type { HouseholdOption } from '../store/mcqStore';

export interface AmazonProduct {
  id: string;              // matches kitItems.ts item ID (e.g., 'power-station')
  categoryId: string;      // matches CATEGORIES key (e.g., 'power')
  kitItemId: string;       // matches ITEMS id in kitItems.ts — same as id for 1:1 mapping
  name: string;            // generic product name (e.g., 'Portable Power Station')
  asin: string;            // Amazon Standard Identification Number (10 chars)
  price: number;           // point-in-time snapshot from product catalog
  brand: string;           // brand/product line (e.g., 'Jackery Explorer')
  imageSrc: string;        // path to local image: '/products/{ASIN}.jpg'
  mcqCondition?: {         // optional MCQ gate for conditional display
    field: 'householdComposition';
    includes: HouseholdOption;
  };
}

export const AMAZON_PRODUCTS: AmazonProduct[] = [
  // Power (5)
  { id: 'power-station',   categoryId: 'power', kitItemId: 'power-station',   name: 'Portable Power Station', asin: 'B082TMBYR6', price: 199.00, brand: 'Jackery Explorer',                   imageSrc: '/products/B082TMBYR6.jpg' },
  { id: 'power-solar',     categoryId: 'power', kitItemId: 'power-solar',     name: 'Solar Panel',            asin: 'B0B9SP6BNH', price: 149.99, brand: 'GRECELL Portable Foldable',          imageSrc: '/products/B0B9SP6BNH.jpg' },
  // ... 29 more entries following same shape ...
  // Pets (2) — conditional
  { id: 'pets-first-aid',  categoryId: 'pets',  kitItemId: 'pets-first-aid',  name: 'Pet First Aid Kit',  asin: 'B07WRPCLYR', price: 35.90, brand: 'ARCA PET Travel Emergency',  imageSrc: '/products/B07WRPCLYR.jpg', mcqCondition: { field: 'householdComposition', includes: 'pets' } },
  { id: 'pets-water',      categoryId: 'pets',  kitItemId: 'pets-water',      name: 'Collapsible Bowl',   asin: 'B07VT1468W', price: 4.97,  brand: 'Collapsible Portable',       imageSrc: '/products/B07VT1468W.jpg', mcqCondition: { field: 'householdComposition', includes: 'pets' } },
];

// Pre-indexed by category for O(1) lookup
export const PRODUCTS_BY_CATEGORY: Record<string, AmazonProduct[]> = AMAZON_PRODUCTS.reduce(
  (acc, product) => ({ ...acc, [product.categoryId]: [...(acc[product.categoryId] ?? []), product] }),
  {} as Record<string, AmazonProduct[]>
);
```

### Design Decisions

1. **`id` matches `kitItemId` for Sprint 3A.** Every Amazon product maps 1:1 to a `kitItems.ts` item. The separate `kitItemId` field exists for future flexibility — Sprint 3B could introduce product variants where multiple Amazon products map to one kit item. For now, `id === kitItemId` for all 31 entries.

2. **`mcqCondition` is declarative, not imperative.** The condition object describes *what to check*, not *how to check it*. The rendering component reads `useMCQStore.getState().householdComposition` and filters: `product.mcqCondition ? householdComposition.includes(product.mcqCondition.includes) : true`. Two items have conditions: Kids Rain Poncho (`includes: 'kids'`) and both Pets items (`includes: 'pets'`).

3. **`PRODUCTS_BY_CATEGORY` mirrors `ITEMS_BY_CATEGORY`.** Same reduce pattern as `kitItems.ts` line 50. Consumers call `PRODUCTS_BY_CATEGORY[categoryId]` instead of filtering the full array per render.

4. **`imageSrc` is a root-relative path.** Points to `public/products/{ASIN}.jpg`. See Section 6 for the image storage decision.

5. **Price is a raw number, not formatted.** Formatting (`$XX.XX`) is a component concern. Consistent with `pricePlaceholder` in `kitItems.ts`.

---

## 2. `affiliateLink.ts` — Affiliate URL Utility

### New File: `src/utils/affiliateLink.ts`

```typescript
export const AFFILIATE_TAG = 'placeholder-20';

export function buildAffiliateUrl(asin: string, tag: string = AFFILIATE_TAG): string {
  return `https://www.amazon.com/dp/${asin}?tag=${encodeURIComponent(tag)}`;
}
```

### Design Decisions

1. **`AFFILIATE_TAG` is a named constant, not an env var.** Per PRD CR4: "No new environment variables. The affiliate tag is a code-level constant." When the Associates account is confirmed, update this one constant. If the tag ever needs to vary by environment, promote to `env.ts` then — but YAGNI for the prototype.

2. **`tag` parameter is `encodeURIComponent`-safe.** Associate tags are alphanumeric + hyphens, but defensive encoding costs nothing and prevents URL corruption if the tag format changes.

3. **Default parameter, not overload.** `buildAffiliateUrl(asin)` uses the default tag. `buildAffiliateUrl(asin, customTag)` overrides. One function, no branching.

4. **`cartUrl.ts` imports `AFFILIATE_TAG` from this file.** Single source of truth for the tag value. See Section 3.

---

## 3. `cartUrl.ts` — Add to Cart URL Utility

### New File: `src/utils/cartUrl.ts`

```typescript
import { AFFILIATE_TAG } from './affiliateLink';

const CART_BASE = 'https://www.amazon.com/gp/aws/cart/add.html';

export function buildCartUrl(asins: string[], tag: string = AFFILIATE_TAG): string {
  if (asins.length === 0) return '';

  const params = new URLSearchParams();
  params.set('AssociateTag', tag);
  params.set('tag', tag);

  asins.forEach((asin, i) => {
    const n = i + 1;
    params.set(`ASIN.${n}`, asin);
    params.set(`Quantity.${n}`, '1');
  });

  return `${CART_BASE}?${params.toString()}`;
}
```

### Design Decisions

1. **`URLSearchParams` instead of manual string concatenation.** Handles encoding correctly, produces a valid query string, and is readable. The `.` in parameter names (`ASIN.1`) is handled correctly — `URLSearchParams` does not encode dots.

2. **Both `AssociateTag` and `tag` included.** Per spike findings, both parameters are recommended for compatibility across Amazon's endpoint variants.

3. **Empty array returns empty string.** The component checks for empty string before calling `window.open()`. No URL, no action.

4. **Quantity is always 1.** Per PRD FR22. If quantity-per-product is needed later, the signature becomes `buildCartUrl(items: { asin: string; qty: number }[])` — but YAGNI.

5. **URL length verification.** 31 ASINs produce ~1,400 characters. Well under the 2,000-character practical browser limit. Verified against the product catalog ASINs.

---

## 4. `subkitOrdering.ts` — MCQ-Driven Display Order

### New File: `src/utils/subkitOrdering.ts`

```typescript
import type { EmergencyType, HouseholdOption } from '../store/mcqStore';

const PRIORITY_MAP: Record<EmergencyType, [string, string, string]> = {
  hurricane:        ['power', 'medical', 'communications'],
  flood:            ['power', 'clothing', 'medical'],
  tornado:          ['power', 'cooking', 'medical'],
  'tropical-storm': ['power', 'medical', 'communications'],
};

const DEFAULT_ORDER: string[] = [
  'power', 'medical', 'communications', 'lighting',
  'cooking', 'hygiene', 'comfort', 'clothing',
];

export function getOrderedCategories(
  emergencyType: EmergencyType | undefined,
  householdComposition: HouseholdOption[]
): string[] {
  const top3 = emergencyType ? PRIORITY_MAP[emergencyType] : [];
  const rest = DEFAULT_ORDER.filter((id) => !top3.includes(id));
  const ordered = [...top3, ...rest];

  if (householdComposition.includes('pets')) {
    ordered.push('pets');
  }

  return ordered;
}
```

### Design Decisions

1. **Separate from `elevationRules.ts`.** The existing elevation logic (Sprint 2) determines which subkits get *visual emphasis* in the SubkitSelectionScreen. This ordering logic determines *display sequence* on the Fill Your Kit screen. Different purpose, different consumers, different output shape (`Set<string>` vs `string[]`). Merging them would create coupling between Sprint 2 and Sprint 3A components.

2. **`emergencyType` is singular — `emergencyTypes[0]`.** Per MCQ mapping doc: "If the user selects multiple emergency types, the first selected type wins." The caller passes `emergencyTypes[0]` from the MCQ store. The utility doesn't access the store directly.

3. **Custom excluded.** Per PRD FR13 and MCQ mapping doc: "Custom is excluded — it has no Amazon products." `custom` does not appear in `DEFAULT_ORDER` or `PRIORITY_MAP`.

4. **Pets always last.** Appended after the ordered list, only if household includes pets. This matches the MCQ mapping doc exactly.

5. **Pure function, no store dependency.** Takes primitive inputs, returns a string array. Fully unit-testable without store mocking.

---

## 5. Route Architecture — `/fill` Route, Guard, Mobile Exemption

### Updated Router: `src/router/index.tsx`

One new route added inside the `AppShell` children array:

```typescript
import { FillYourKitScreen } from '../components/fill/FillYourKitScreen';
import { fillGuard } from './guards';

// Inside AppShell children, after /confirmation:
{
  path: '/fill',
  element: <FillYourKitScreen />,
  loader: fillGuard,
},
```

### Route Name Confirmation

- `/fill` — no collision with existing routes (`/build`, `/builder`, `/choose`, `/review`, `/configure/*`, `/summary`, `/confirmation`)
- Top-level like `/review` and `/summary` — appropriate for a destination screen
- Short, memorable, matches the CTA label ("Fill Your Kit")

### Mobile Exemption

`/fill` must be added to `MOBILE_EXEMPT_ROUTES` in `AppShell.tsx`:

```typescript
const MOBILE_EXEMPT_ROUTES = ['/build', '/build/household', '/choose', '/review', '/fill'];
```

The Fill Your Kit screen is responsive (NFR7) and must render on mobile. Same exemption pattern established in Sprint 1.

### Navigation Wiring

`OrderConfirmationScreen.tsx` currently opens `FillKitStubModal`. Sprint 3A replaces this:

```typescript
// BEFORE (current):
const handleOpenFillKit = () => {
  setShowFillKitModal(true);
};

// AFTER (Sprint 3A):
const handleOpenFillKit = () => {
  navigate('/fill');
};
```

The `FillKitStubModal` import and state (`showFillKitModal`, `setShowFillKitModal`) are removed. See Section 9.

---

## 6. Image Storage Decision — PO Flag #8

### Decision: `public/products/`

Product images go in `public/products/`, named by ASIN (e.g., `B082TMBYR6.jpg`). Referenced in `amazonProducts.ts` as `/products/B082TMBYR6.jpg`.

### Reasoning

| Factor | `src/assets/products/` | `public/products/` | Winner |
|--------|----------------------|-------------------|--------|
| Referencing pattern | Static imports — requires a 31-line mapping file (like `itemImages.ts`) | Path strings — `amazonProducts.ts` stores the path directly | `public/` — no boilerplate |
| Vite processing | Hashed filenames, optimized | Served as-is, no processing | Tie for prototype |
| Cache busting | Automatic via content hash | Manual (append `?v=2` or rename) | `src/` — but irrelevant for prototype |
| Tree shaking | Unused images excluded from bundle | All files served regardless | `src/` — but all 31 images are used |
| Conceptual fit | Component assets (icons, illustrations) | Data-adjacent assets (product photos from external source) | `public/` — these are content, not UI |
| Dynamic reference | Can't use variable paths in static imports without `import.meta.glob` | Simple string concatenation | `public/` — cleaner |

**The decisive factor:** These images are *data*, not *component assets*. They're referenced from a data file (`amazonProducts.ts`) by ASIN, not imported into component code. The existing `src/assets/` + `itemImages.ts` pattern works for the 28 kit-building images because those are tightly coupled to the UI components. Amazon product images are content managed by the stakeholder — they belong in `public/`.

**Naming convention:** `{ASIN}.{ext}` (e.g., `B082TMBYR6.jpg`). ASIN-based naming creates a predictable convention that doesn't require a lookup table. The extension matches the original download format.

**Separation from existing images:** The kit-building images in `src/assets/` (resolved via `itemImages.ts`) serve the SubkitSelection, ItemConfig, and Summary screens. The product images in `public/products/` serve the Fill Your Kit screen. Two different image sets for two different contexts — clean separation.

---

## 7. Route Guard Decision — PO Flag #10

### Decision: Same `guards.ts` pattern, dual-path aware

### The Subtlety

The PRD says (FR31): *"redirect to `/` if `kitStore.selectedSubkits` is empty."*

This is correct for the **Custom** path — Custom users have `selectedSubkits` populated in `kitStore`.

But **Essentials** users never populate `kitStore.selectedSubkits`. The Essentials path uses `ESSENTIALS_BUNDLE` (a static constant), bypassing the kit store entirely. `selectedSubkits` is empty for Essentials users, so the naive guard would incorrectly redirect them.

### Guard Implementation

```typescript
// Appended to src/router/guards.ts
export function fillGuard() {
  const { kitPath } = useMCQStore.getState();
  const { selectedSubkits } = useKitStore.getState();

  // Essentials path: ESSENTIALS_BUNDLE provides categories — selectedSubkits is empty and that's OK
  if (kitPath === 'essentials') return null;

  // Custom path: must have selected subkits
  if (selectedSubkits.length > 0) return null;

  // No valid kit context — redirect home
  return redirect('/');
}
```

### Guard Behavior Matrix

| Scenario | `kitPath` | `selectedSubkits` | Result |
|----------|-----------|-------------------|--------|
| Essentials user from confirmation | `'essentials'` | `[]` | **Pass** — `kitPath` check |
| Custom user from confirmation | `'custom'` | `[...items]` | **Pass** — `selectedSubkits` check |
| Custom user, new session, has localStorage | `null` (session cleared) | `[...items]` (localStorage persists) | **Pass** — `selectedSubkits` check |
| Fresh visitor, no data | `null` | `[]` | **Redirect to `/`** |
| Direct URL access, no context | `null` | `[]` | **Redirect to `/`** |

### Pattern Consistency

This follows the exact pattern of existing guards:
- Synchronous loader function (not async)
- Reads store state via `getState()` (not hooks — loaders run outside React)
- Returns `null` to pass, `redirect()` to block
- Both `useKitStore` and `useMCQStore` are already imported in `guards.ts`

The only difference from existing guards: this one reads from **both** stores. That's a necessary consequence of the dual-path architecture, not a pattern deviation.

### Downstream Impact: Fill Your Kit Screen

The dual-path awareness extends to the screen itself. The component needs to know *which* categories to display:

```typescript
// In FillYourKitScreen.tsx
const kitPath = useMCQStore((s) => s.kitPath);
const selectedSubkits = useKitStore((s) => s.selectedSubkits);

const activeCategoryIds: string[] = kitPath === 'essentials'
  ? ESSENTIALS_BUNDLE.map((b) => b.subkit)          // ['power', 'cooking', 'medical', 'communications']
  : selectedSubkits.map((s) => s.categoryId);         // whatever the user selected
```

This is the same branching pattern used in `OrderConfirmationScreen.tsx` (line 30: `const isEssentials = kitPath === 'essentials'`). Consistent.

---

## 8. `kitItems.ts` Change Impact Assessment

### Changes Summary (per PRD FR18-FR20a)

| Change Type | Count | Details |
|-------------|-------|---------|
| Renames (name field only) | 9 | See table below |
| Removal | 1 | `pets-food` removed from `ITEMS` array |
| Addition | 1 | `cloth-ponchos-kids` added to Clothing |
| Price sync | ~20 | `pricePlaceholder` values updated to match product catalog |

### Rename Details

| Item ID | Current Name | New Name |
|---------|-------------|----------|
| `hygiene-cups` | Paper Cups | Paper Plates & Utensils |
| `hygiene-feminine` | Feminine Hygiene Products | Feminine Hygiene Kit |
| `pets-water` | Pet Water & Bowl Kit | Collapsible Bowl |
| `pets-first-aid` | Pet First Aid & Comfort Kit | Pet First Aid Kit |
| `light-flashlight` | Flashlights | Flashlight |
| `light-lantern` | Electric Lanterns | Electric Lantern |
| `power-banks` | Power Banks | Power Bank |
| `med-ice-packs` | Ice Packs | Hot/Cold Pack |
| `cloth-ponchos` | Ponchos | Rain Poncho (Adult) |

### Impact Analysis

**Item IDs are unchanged.** All consumers reference items by `id`, not by `name`. This is the critical invariant that makes these renames safe.

| Consumer | References By | Impact |
|----------|--------------|--------|
| `kitStore.ts` — `itemSelections` keys | `subkitId::itemId` | **None** — IDs unchanged |
| `kitStore.ts` — `selectedSubkits` | `categoryId` | **None** — categories unchanged |
| `itemImages.ts` — `ITEM_IMAGES` | Item ID keys | **None** — IDs unchanged |
| `ITEM_ICON_OVERRIDES` | Item ID keys | **None** — IDs unchanged |
| `slotCalculations.ts` | Operates on typed arrays, not names | **None** |
| `cartCalculations.ts` | Operates on typed arrays, not names | **None** |
| `elevationRules.ts` | Category IDs only | **None** |
| Component rendering | Reads `item.name` at render time | **Auto-updated** — components display whatever `name` says |

**Test impact:** Grep across `tests/` for renamed display names ("Paper Cups", "Pet Food Supply", etc.) returned **zero matches**. Tests reference items by ID, not display name. No test updates required for renames.

### Removal Impact: `pets-food`

The `pets-food` item (ID: `pets-food`, name: "Pet Food Supply (3-Day)") is removed from `ITEMS`.

| Consumer | Impact |
|----------|--------|
| `ITEMS_BY_CATEGORY['pets']` | **Auto-updated** — derived from `ITEMS` via reduce. Will contain 2 items instead of 3. |
| `itemImages.ts` | **No entry exists** — `pets-food` has no image mapping. No change needed. |
| `ITEM_ICON_OVERRIDES` | **No entry exists** — no change needed. |
| `kitStore` localStorage | **Edge case** — users with `pets-food` in persisted `itemSelections` will have a dangling reference. The app handles this gracefully: the item simply won't render (no matching `ITEMS` entry). No crash. The entry is inert until `resetKit()` clears it. |
| Tests | **Zero references** to `pets-food` found in `tests/`. No updates needed. |

### Addition: `cloth-ponchos-kids`

New item added to `ITEMS` array:

```typescript
{
  id: 'cloth-ponchos-kids',
  categoryId: 'clothing',
  name: 'Rain Poncho (Kids)',
  description: 'Disposable rain poncho for children',
  rating: null,
  reviewCount: null,
  weightGrams: 113,
  volumeIn3: 14,
  productId: null,
  pricePlaceholder: 12.99,
  imageSrc: null,
}
```

Also added to `ITEM_ICON_OVERRIDES`:
```typescript
'cloth-ponchos-kids': 'CloudRain',  // same icon as adult ponchos
```

**No entry in `itemImages.ts`.** This is expected — the item has no kit-building image. `ImageWithFallback` handles missing images gracefully (renders fallback). Confirmed: pets items (`pets-water`, `pets-first-aid`) also have no `itemImages.ts` entries and render correctly.

### Price Sync

Approximately 20 items need `pricePlaceholder` updated to match `docs/sprint-3-product-catalog.md`. Examples:
- `power-station`: 149.99 → 199.00
- `power-solar`: 79.99 → 149.99
- `light-headlamp`: 39.99 → 9.97

These are data value changes only. No type changes, no ID changes, no consumer impact. The `pricePlaceholder` field is rendered in ItemConfigScreen and SummaryScreen as `$XX.XX`. Updated values will display automatically.

---

## 9. `FillKitStubModal` Removal Impact

### Current State

`FillKitStubModal.tsx` is a "Coming Soon" modal triggered by the "Now Let's Fill Your Kit" CTA on `OrderConfirmationScreen`. It has:
- One consumer: `OrderConfirmationScreen.tsx`
- No external imports (not re-exported, not used elsewhere)
- No store dependencies (pure presentational)
- One test file: `tests/components/OrderConfirmationScreen.test.tsx` may reference the modal

### Removal Steps

1. **Delete file:** `src/components/confirmation/FillKitStubModal.tsx`
2. **Update `OrderConfirmationScreen.tsx`:**
   - Remove `import { FillKitStubModal }` and `useState` for `showFillKitModal`
   - Replace `handleOpenFillKit` body: `setShowFillKitModal(true)` → `navigate('/fill')`
   - Remove `<FillKitStubModal open={showFillKitModal} onClose={handleCloseFillKit} />` from JSX
   - Remove `handleCloseFillKit` function
3. **Update tests:** Any test asserting "Coming Soon" modal text or modal open/close behavior needs updating to assert navigation to `/fill` instead.

### Risk

**Low.** The modal is fully self-contained with one consumer. The replacement is a single `navigate()` call — simpler than the current modal state management.

---

## 10. Fill Your Kit Screen — Integration Notes

### Store Dependencies

| Store | Fields Read | Purpose |
|-------|------------|---------|
| `useMCQStore` | `emergencyTypes`, `householdComposition`, `kitPath` | Ordering, conditional gates, path detection |
| `useKitStore` | `selectedSubkits` | Which categories to display (Custom path) |

No new store is created. No store fields are added. Read-only access.

### Data Dependencies

| Data Source | Import | Purpose |
|-------------|--------|---------|
| `amazonProducts.ts` | `AMAZON_PRODUCTS`, `PRODUCTS_BY_CATEGORY` | Product data for cards |
| `kitItems.ts` | `CATEGORIES` | Category metadata (name, icon, colorBase, colorTint) |
| `essentialsConfig.ts` | `ESSENTIALS_BUNDLE` | Essentials path category list |
| `subkitOrdering.ts` | `getOrderedCategories()` | Display order |
| `affiliateLink.ts` | `buildAffiliateUrl()` | Individual product links |
| `cartUrl.ts` | `buildCartUrl()` | Add All to Cart CTA |

### Rendering Pipeline

```
1. Determine active categories:
   kitPath === 'essentials'
     ? ESSENTIALS_BUNDLE.map(b => b.subkit)
     : selectedSubkits.map(s => s.categoryId)

2. Get ordered categories:
   getOrderedCategories(emergencyTypes[0], householdComposition)

3. Filter to active categories only:
   orderedCategories.filter(id => activeCategoryIds.includes(id))

4. For each category, get products:
   PRODUCTS_BY_CATEGORY[categoryId]
     .filter(p => !p.mcqCondition || householdComposition.includes(p.mcqCondition.includes))

5. Skip categories with zero products after filtering
   (e.g., Pets with no pets in household — but the category was already excluded
   by getOrderedCategories. This is a safety net.)

6. First 3 categories expanded, rest collapsed

7. Add All to Cart URL:
   buildCartUrl(allDisplayedProducts.map(p => p.asin))
```

### Component Tree

```
FillYourKitScreen
├── Page header (h1 + subtitle)
├── "Add All to Amazon Cart" CTA + disclaimer
├── CategorySection (repeated per active category)
│   ├── Section header (color bar, icon, name, count, expand/collapse)
│   └── Product grid (when expanded)
│       └── ProductCard (repeated per product in category)
│           ├── Product image
│           ├── Product name + brand + price
│           └── "View on Amazon" CTA (affiliate link)
└── "Add All to Amazon Cart" CTA (bottom repeat — Sally to decide placement)
```

### Expand/Collapse Pattern

Two implementation options for Sally to choose from:

**Option A: `<details>`/`<summary>` (native HTML).** Built-in expand/collapse. No JavaScript state. Keyboard accessible by default. Limitation: animation on expand/collapse requires workarounds.

**Option B: React state + ARIA.** `useState` per section. `aria-expanded` on toggle button, `aria-controls` pointing to content region. More control over animation. More code.

Recommendation: **Option B** — matches the existing app's approach to interactive UI (React-controlled state with explicit ARIA). Gives Sally full control over transition animations. The `CategorySection` component manages its own `isExpanded` state, initialized from a prop (`defaultExpanded: boolean`).

---

## 11. Icon Resolver Update

### Current Gap

`src/utils/iconResolver.ts` maps icon name strings to `LucideIcon` components. The Pets category (`CATEGORIES.pets.icon = 'PawPrint'`) uses `PawPrint`, which is **not currently in the resolver map**.

This didn't surface in Sprint 2 because the MCQ Household screen imports `PawPrint` directly (named import). But the `CategorySection` component for Fill Your Kit will resolve icons via the resolver (same pattern as `SubkitCard`).

### Fix

Add `PawPrint` to the icon resolver in Story 17.1 (data cleanup):

```typescript
// src/utils/iconResolver.ts — add to imports and ICON_MAP
import { ..., PawPrint } from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  // ... existing entries ...
  PawPrint,
};
```

One import, one map entry. No interface change.

---

## 12. Sally Coordination Points

### 12.1 Image Location

Product images served from `public/products/` at predictable paths: `/products/{ASIN}.jpg`. Sally's `ProductCard` spec should use these paths directly (e.g., `<img src={product.imageSrc} />`). No import resolution needed.

### 12.2 Route Name

`/fill` — confirmed. Entry point is the "Now Let's Fill Your Kit" CTA on Order Confirmation.

### 12.3 Category Metadata

`CategorySection` reads from `CATEGORIES` (imported from `kitItems.ts`):
- `colorBase` — section header accent color (e.g., `#C2410C` for Power)
- `colorTint` — section background tint (e.g., `#FFF7ED` for Power)
- `icon` — resolved via `iconResolver.ts` (e.g., `'Zap'` → `<Zap />`)
- `name` — category display name (e.g., `'Power'`)

These are the same values used by `SubkitCard` in the builder flow. Visual consistency is automatic.

### 12.4 Product Card Data Shape

Sally's `ProductCard` receives:

```typescript
interface ProductCardProps {
  product: AmazonProduct;   // from amazonProducts.ts
  affiliateUrl: string;     // pre-built by parent via buildAffiliateUrl()
}
```

Fields available for display: `product.name`, `product.brand`, `product.price`, `product.imageSrc`. The parent (`CategorySection`) calls `buildAffiliateUrl(product.asin)` and passes the result.

### 12.5 Expand/Collapse

React state approach (Option B from Section 10). `CategorySection` manages `isExpanded` via `useState`, initialized from `defaultExpanded` prop. First 3 categories get `defaultExpanded={true}`.

### 12.6 Add All to Cart CTA Placement

Sally decides placement. Architectural support exists for any position — the URL is computed once at the screen level and passed down. Top, bottom, sticky footer, or all three — no architectural difference.

### 12.7 Mobile Breakpoints

Per PRD NFR7:
- Desktop (>=1024px): 3-column product grid
- Tablet (>=640px): 2-column product grid
- Mobile (<640px): 1-column product grid

These align with Tailwind's default breakpoints (`sm:`, `lg:`). Sally's spec should confirm exact breakpoint values.

---

## 13. New File Inventory

### New Files

| File | Purpose | Story |
|------|---------|-------|
| `src/data/amazonProducts.ts` | Static product catalog — 31 items with ASINs, prices, image paths | 17.2 |
| `src/utils/affiliateLink.ts` | Affiliate URL construction + `AFFILIATE_TAG` constant | 17.2 |
| `src/utils/cartUrl.ts` | Add to Cart URL construction | 17.4 |
| `src/utils/subkitOrdering.ts` | MCQ-driven category display ordering | 17.3 |
| `src/components/fill/FillYourKitScreen.tsx` | Main screen at `/fill` | 18.1 |
| `src/components/fill/CategorySection.tsx` | Collapsible category with product grid | 18.1 |
| `src/components/fill/ProductCard.tsx` | Individual product card with affiliate CTA | 18.2 |
| `public/products/` | Directory with 31 downloaded product images | 17.2 |

### Modified Files

| File | Change | Story |
|------|--------|-------|
| `src/data/kitItems.ts` | 9 renames, 1 removal, 1 addition, ~20 price syncs | 17.1 |
| `src/data/kitItems.ts` | Add `cloth-ponchos-kids` to `ITEM_ICON_OVERRIDES` | 17.1 |
| `src/utils/iconResolver.ts` | Add `PawPrint` to imports and `ICON_MAP` | 17.1 |
| `src/router/index.tsx` | Add `/fill` route + `fillGuard` import | 18.1 |
| `src/router/guards.ts` | Add `fillGuard` function | 18.1 |
| `src/components/layout/AppShell.tsx` | Add `/fill` to `MOBILE_EXEMPT_ROUTES` | 18.1 |
| `src/components/confirmation/OrderConfirmationScreen.tsx` | Replace stub modal with `navigate('/fill')` | 18.1 |

### Deleted Files

| File | Reason | Story |
|------|--------|-------|
| `src/components/confirmation/FillKitStubModal.tsx` | Replaced by real `/fill` route | 18.1 |

---

## 14. Exclusions — What Is NOT Sprint 3A

- **Per-product MCQ mapping** — Sprint 3B/4. No personalized product variants based on household composition (beyond the two boolean gates: kids poncho, pets category).
- **Dynamic pricing / PA-API / Creators API** — NO-GO per spike. Static data continues.
- **Backend / serverless proxy** — Not needed. Architecture stays fully client-side.
- **Product image optimization** — Images served as-is from `public/`. No WebP conversion, no responsive `srcset`, no lazy loading beyond native browser `loading="lazy"`. Prototype-appropriate.
- **Cart persistence** — No Zustand state for "items added to Amazon cart." The cart URL is stateless — computed fresh on each click.
- **Analytics events** — No GA4 tracking for affiliate link clicks or Add to Cart. Can be added post-prototype.
- **Category consolidation** — The PM brief notes Communications, Medical, and Comfort are lean (2 items each). No merging in Sprint 3A.
- **New Zustand store** — No `fillStore` or `productStore`. All state is derived from existing stores + static data.
- **`extreme-heat` emergency type** — Still excluded from `EmergencyType` union. Not in `PRIORITY_MAP`.

---

*Emergency Prep Kit Builder — Phase 3 Sprint 3A Architecture Brief | Version 1.0 | 2026-04-14 | Winston, Architect*
