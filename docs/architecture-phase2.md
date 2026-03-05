# Emergency Prep Kit Builder — Frontend Architecture Document

**Prepared by:** Winston, Architect
**Date:** 2026-03-04
**Version:** 2.0
**Status:** Complete — Phase 2 Edition

---

## Table of Contents

1. Template and Framework Selection
2. Frontend Tech Stack
3. Project Structure
4. Component Standards
5. State Management
6. Data Layer
7. Routing
8. Styling Guidelines
9. Testing Requirements
10. Environment Configuration
11. Frontend Developer Standards
12. Phase 3+ Roadmap

---

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-03-02 | 1.0 | Initial architecture document | Winston, Architect |
| 2026-03-02 | 1.1 | Vercel selected; rollback strategy added; analytics Phase 2 deferral noted | Sarah, PO |
| 2026-03-04 | 1.2 | itemImages.ts added to project structure; product photography confirmed no Phase 2 work needed | Sarah, PO |
| 2026-03-04 | 1.3 | Cover page and Fill my kit based on expert advice added as Phase 2; Bazaarvoice moved to Phase 3 | Sarah, PO |
| 2026-03-04 | 2.0 | Phase 2 brownfield enhancement: localStorage persist, GA4 analytics, Playwright E2E + GitHub Actions CI, Fill my kit based on expert advice (derived state), clickable visualizer slots, hardcoded star ratings (KitItem.rating + KitItem.reviewCount), e-commerce checkoutService.ts, cover page + route restructure (/ to CoverScreen, /builder to SubkitSelectionScreen). Section 12 converted to Phase 3+ Roadmap. MobileInterstitial retained — mobile responsiveness deferred to Phase 3. | Winston, Architect |
| 2026-03-04 | 2.1 | Mobile responsiveness (Story 7.3) formally deferred to Phase 3; Section 8 breakpoint strategy reverted to Phase 1 desktop-first; MobileInterstitial and useResponsive.ts marked Unchanged; Phase 3+ Roadmap updated. | Sarah, PO |

---

## 1. Template and Framework Selection

### Project Context

This is a **Phase 2 brownfield enhancement** of the fully-delivered Phase 1 MVP. All Phase 2 extension points were pre-wired in the Phase 1 architecture: the `onSlotClick` prop, `KitItem` nullable product fields, `ENV.purchaseUrl`, and the Zustand `persist` middleware path. Phase 2 work is additive by design — no existing component interfaces change.

The five Phase 1 files that required targeted corrections (`SubkitTypeSelectionNew.tsx` → `SubkitSelectionScreen.tsx`, `SummaryPage.tsx` → `SummaryScreen.tsx`, `ItemQuestionnaireFlow.tsx` → `ItemConfigScreen.tsx`, `kitItems.ts`, `ImageWithFallback`) are confirmed complete. Phase 2 builds on the corrected, renamed files.

### Scaffold

No external starter template. Standard **Vite + React + TypeScript** scaffold. All Phase 2 code conforms to the existing project patterns without exception.

### Key Phase 2 Framework Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| localStorage persistence | Zustand `persist` middleware | One wrapper change to `kitStore.ts`; zero consumer changes; Phase 3 clear path |
| Analytics | Google Analytics 4 | Non-blocking; native e-commerce event support; free; `VITE_ANALYTICS_ID` env var |
| E2E testing | Playwright + GitHub Actions | Standard Playwright CI; native GitHub + Vercel integration |
| Partial star rendering | CSS width-clip technique | Two stacked star layers; top layer clipped to `(rating/5 * 100)%` width; no SVG path math |
| Fill my kit based on expert advice | Derived state (not stored) | Checkbox reads as checked when all items selected; calls existing `toggleItem` in loop; no new store fields; displayed side by side with "Send an empty container" in 2-column grid |
| MobileInterstitial | Retained (deferred to Phase 3) | `MobileInterstitial.tsx` and `useResponsive.ts` remain in place; full mobile responsiveness ships in Phase 3 alongside Bazaarvoice |
| `resetKit()` + persist | `set({ ...initial })` | Zustand persist writes empty state back to localStorage automatically; no `clearStorage()` needed at call site |

### Phase 2 Modified and New Files

| File | Action | Key Changes |
|------|--------|-------------|
| `src/components/cover/CoverScreen.tsx` | **New** | Cover page at `/`; static; no store dependency; mobile-ready from day one |
| `src/components/ui/StarRating.tsx` | **New** | CSS width-clip star rendering; aria-label; brand-accent filled stars |
| `src/services/checkoutService.ts` | **New** | `initiateCheckout()` — typed `CheckoutPayload` + `CheckoutResult`; POST to `ENV.purchaseUrl` |
| `src/utils/analytics.ts` | **New** | GA4 wrapper; `Analytics.*` typed helpers; all calls silently try/catch |
| `src/store/kitStore.ts` | Modified | Wrap `create<KitStore>()` with `persist` middleware; storage key `emergency-kit-v1` |
| `src/types/kit.types.ts` | Modified | Add `rating: number \| null` and `reviewCount: number \| null` to `KitItem` |
| `src/data/kitItems.ts` | Modified | Populate `rating` and `reviewCount` on all 28 items |
| `src/router/index.tsx` | Modified | `/` → CoverScreen; `/builder` → SubkitSelectionScreen; all guards redirect to `/builder` |
| `src/router/guards.ts` | Modified | All `redirect('/')` calls updated to `redirect('/builder')` |
| `src/tokens/env.ts` | Modified | Add `analyticsId: import.meta.env['VITE_ANALYTICS_ID']` |
| `src/components/layout/AppShell.tsx` | Modified | GA4 script injection via `useEffect`; `MobileInterstitial` retained unchanged |
| `src/components/layout/MobileInterstitial.tsx` | **Unchanged** | Mobile barrier retained; full mobile responsiveness deferred to Phase 3 |
| `src/hooks/useResponsive.ts` | **Unchanged** | Retained alongside `MobileInterstitial`; deferred to Phase 3 |
| `src/components/subkit-selection/SubkitSelectionScreen.tsx` | Modified | Passes `onSlotClick` handler to `HousingUnitVisualizer` |
| `src/components/item-config/ItemConfigScreen.tsx` | Modified | Add "Fill my kit based on expert advice" checkbox (side by side with "Send an empty container"); render `StarRating` per item |
| `src/components/item-config/CustomSubkitScreen.tsx` | Modified | Add "Fill my kit based on expert advice" checkbox (side by side with "Send an empty container"); render `StarRating` per item |
| `src/components/summary/SummaryScreen.tsx` | Modified | CTA triggers `initiateCheckout`; loading state; dismissible error; no `StarRating` |

### Brownfield Rollback Strategy

The Phase 1 rollback strategy (git branch per story; `v0-pre-refactor` tag; merge to `main` only after QA approval) applies identically to Phase 2. Story branches follow `story/6.1-localstorage`, `story/6.2-analytics`, etc.

Phase 2 risk levels:

| File / Area | Risk | Reason |
|-------------|------|--------|
| `kitStore.ts` — persist middleware | Medium | Rehydration edge cases must be verified (missing key, corrupted data) |
| `router/index.tsx` — route restructure | Medium | `/` to `/builder` rename; existing bookmarks break; communicate before Epic 6 ships |
| `SummaryScreen.tsx` — checkout | Medium | New async API call; error states must not corrupt kit state |
| `KitItem` type extension | Low | Two additive nullable fields; all existing consumers unaffected |
| `AppShell.tsx` — MobileInterstitial | None | MobileInterstitial retained unchanged in Phase 2; no regression risk |
| `CoverScreen.tsx` | Low | New static screen; no store dependency |
| `StarRating.tsx` | Low | New presentational component |
| `checkoutService.ts` | Low | New isolated service module |
| `analytics.ts` | Low | New isolated utility; silently try/catch on all calls |

---

## 2. Frontend Tech Stack

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|----------|
| Language | TypeScript | 5.x strict | Primary language | Unchanged from Phase 1 |
| Framework | React | 18.x | UI component tree | Unchanged from Phase 1 |
| Build Tool | Vite | 6.x | Dev server, bundling, HMR | Unchanged from Phase 1 |
| Styling | Tailwind CSS | v4.x | Utility-first + CSS variable theme | Unchanged from Phase 1 |
| State Management | Zustand | 5.x + persist | Global kit state + localStorage | `persist` middleware wraps existing `create()` — one file, zero consumer changes |
| Routing | React Router | 6.4+ | Client-side routing + navigation guards | `/` cover page; `/builder` kit entry |
| Icons | lucide-react | latest | Category + UI icons | Named imports only — mandatory for tree-shaking |
| Testing (unit) | Vitest + RTL + axe-core/react | 2.x / 16.x / 4.x | Unit and component tests | Unchanged from Phase 1 |
| Testing (E2E) | Playwright | latest | Automated end-to-end suite | Three critical flows; GitHub Actions CI |
| Analytics | Google Analytics 4 | — | User behavior event tracking | Non-blocking; e-commerce event support; `VITE_ANALYTICS_ID` env var |
| Linting | ESLint + @typescript-eslint + eslint-plugin-jsx-a11y | 8.x / 6.x | Code quality + a11y | Unchanged from Phase 1 |
| Formatting | Prettier | 3.x | Code formatting | Unchanged from Phase 1 |
| Deployment | Vercel | — | Static SPA hosting | Unchanged from Phase 1 |
| CI | GitHub Actions | — | Playwright E2E runner | New in Phase 2 |

---

## 3. Project Structure

```
emergency-prep-kit/
├── .github/
│   └── workflows/
│       └── e2e.yml                          # GitHub Actions — Playwright CI runner
├── public/
│   └── favicon.ico
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── tokens/
│   │   ├── design-tokens.ts
│   │   └── env.ts                           # VITE_PURCHASE_URL + VITE_ANALYTICS_ID
│   ├── styles/
│   │   ├── globals.css
│   │   └── print.css
│   ├── types/
│   │   ├── kit.types.ts                     # KitItem extended: rating + reviewCount
│   │   ├── visualizer.types.ts
│   │   └── index.ts
│   ├── data/
│   │   ├── kitItems.ts                      # All 28 items: rating + reviewCount populated
│   │   ├── itemImages.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── slotCalculations.ts
│   │   ├── categoryUtils.ts
│   │   └── analytics.ts                     # NEW — GA4 wrapper
│   ├── services/
│   │   └── checkoutService.ts               # NEW — cart serialization + fetch POST
│   ├── store/
│   │   └── kitStore.ts                      # persist middleware added
│   ├── router/
│   │   ├── index.tsx                        # / → CoverScreen; /builder → SubkitSelectionScreen
│   │   └── guards.ts                        # All redirects updated to /builder
│   ├── components/
│   │   ├── cover/
│   │   │   └── CoverScreen.tsx              # NEW — landing page at /
│   │   ├── layout/
│   │   │   ├── AppShell.tsx                 # GA4 script injection; MobileInterstitial retained (Phase 3)
│   │   │   ├── AppHeader.tsx
│   │   │   └── StepProgressIndicator.tsx
│   │   │   ├── MobileInterstitial.tsx       # Unchanged — deferred to Phase 3
│   │   ├── ui/
│   │   │   ├── PrimaryButton.tsx
│   │   │   ├── SecondaryButton.tsx
│   │   │   ├── ConfirmationModal.tsx
│   │   │   ├── ImageWithFallback.tsx
│   │   │   └── StarRating.tsx               # NEW — CSS width-clip stars; aria-label
│   │   ├── visualizer/
│   │   │   ├── HousingUnitVisualizer.tsx    # Unchanged interface; onSlotClick now active
│   │   │   ├── VisualizerSlot.tsx           # cursor-pointer + hover:brightness-95 on filled
│   │   │   └── SlotFullIndicator.tsx
│   │   ├── subkit-selection/
│   │   │   ├── SubkitSelectionScreen.tsx    # Passes onSlotClick handler
│   │   │   ├── SubkitCard.tsx
│   │   │   └── SizeToggle.tsx
│   │   ├── item-config/
│   │   │   ├── ItemConfigScreen.tsx         # + Fill my kit based on expert advice checkbox
│   │   │   ├── CustomSubkitScreen.tsx       # + Fill my kit based on expert advice checkbox
│   │   │   ├── ItemCard.tsx                 # + StarRating below name/description
│   │   │   ├── QuantitySelector.tsx
│   │   │   ├── EmptyContainerOption.tsx
│   │   │   ├── CategoryGroupHeader.tsx
│   │   │   └── SubkitProgressIndicator.tsx
│   │   └── summary/
│   │       ├── SummaryScreen.tsx            # CTA → initiateCheckout; loading + error states
│   │       └── SubkitSummarySection.tsx     # No StarRating rendered here
│   └── hooks/
│       ├── useKitStore.ts
│       └── useResponsive.ts             # Unchanged — deferred to Phase 3
├── tests/
│   ├── setup.ts
│   ├── unit/
│   │   ├── slotCalculations.test.ts
│   │   └── checkoutService.test.ts          # NEW — mocked fetch: success, network fail, non-2xx
│   ├── components/
│   │   ├── HousingUnitVisualizer.test.tsx
│   │   ├── SubkitCard.test.tsx
│   │   ├── ItemCard.test.tsx
│   │   ├── QuantitySelector.test.tsx
│   │   └── StarRating.test.tsx              # NEW — star fill, aria-label, null-safe
│   └── e2e/
│       └── kit-builder.spec.ts              # NEW — three Playwright flows
├── playwright.config.ts                     # NEW
├── index.html
├── vite.config.ts
├── vitest.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── .eslintrc.cjs
├── .prettierrc
└── package.json
```

---

## 4. Component Standards

Unchanged from Phase 1. All Phase 2 components follow the identical naming conventions, FC<Props> pattern, named exports only, no logic in JSX, and accessibility-first rules defined in the Phase 1 architecture.

**Naming Conventions (unchanged):**

| Element | Convention | Example |
|---------|------------|---------|
| Component files | PascalCase `.tsx` | `StarRating.tsx`, `CoverScreen.tsx` |
| Component functions | PascalCase | `export const StarRating: FC<...>` |
| Props interfaces | `{ComponentName}Props` | `StarRatingProps` |
| Hook files | camelCase `use` prefix | `useKitStore.ts` |
| Utility files | camelCase `.ts` | `analytics.ts`, `checkoutService.ts` |
| Service files | camelCase `.ts` in `src/services/` | `checkoutService.ts` |
| Test files | Mirror source path + `.test.tsx` | `StarRating.test.tsx` |

---

## 5. State Management

### localStorage Persistence — Phase 2 Change

Zustand `persist` middleware wraps the existing `create<KitStore>()` call. This is a **one-import, one-wrapper change** to `kitStore.ts`. Zero changes to selectors, actions, or consuming components.

```typescript
// src/store/kitStore.ts — Phase 2 change: persist wrapper
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// ... all existing imports unchanged

export const useKitStore = create<KitStore>()(
  persist(
    (set, get) => ({
      ...initial,
      // ALL EXISTING ACTIONS UNCHANGED
      selectSubkit: (categoryId) => { /* unchanged */ },
      deselectSubkit: (subkitId) => { /* unchanged */ },
      setSubkitSize: (subkitId, size) => { /* unchanged */ },
      toggleItem: (subkitId, itemId) => { /* unchanged */ },
      setItemQuantity: (subkitId, itemId, qty) => { /* unchanged */ },
      toggleEmptyContainer: (subkitId) => { /* unchanged */ },
      setCurrentConfigIndex: (index) => set({ currentConfigIndex: index }),
      resetKit: () => set({ ...initial }), // persist writes empty state to localStorage automatically
    }),
    {
      name: 'emergency-kit-v1',  // localStorage key
      // No partialize — persist full store state
    }
  )
);
```

**`resetKit()` behavior with persist:** Calling `set({ ...initial })` triggers Zustand persist to write the empty initial state back to `localStorage['emergency-kit-v1']`. No `clearStorage()` call is needed at the call site. First-time visitors with no existing key initialize to empty state identically to Phase 1.

### Fill My Kit For Me — Derived State Pattern

"Fill my kit based on expert advice" is **not stored in Zustand**. The checkbox is a derived UI state computed at the component level. It is displayed side by side with the "Send an empty container" checkbox in a 2-column grid layout (`grid-cols-2 gap-3`).

```typescript
// In ItemConfigScreen and CustomSubkitScreen
const { itemSelections, toggleItem } = useKitStore();
const items = getItemsForSubkit(subkitId); // items for current subkit

// Derived — true when every item in this subkit is selected
const isAllFilled = items.every(
  (item) => !!itemSelections[`${subkitId}::${item.id}`]
);

const handleFillToggle = () => {
  if (isAllFilled) {
    // Uncheck: clear all items for this subkit
    items.filter((item) => itemSelections[`${subkitId}::${item.id}`])
         .forEach((item) => toggleItem(subkitId, item.id));
  } else {
    // Check: select all unselected items at qty 1
    items.filter((item) => !itemSelections[`${subkitId}::${item.id}`])
         .forEach((item) => toggleItem(subkitId, item.id));
  }
};
```

**Bidirectional state with EmptyContainerOption:** When `EmptyContainerOption` is checked, it clears all `itemSelections` for the subkit. Because `isAllFilled` is derived from `itemSelections`, the Fill checkbox automatically reads as unchecked. No extra logic required. The Fill checkbox is visually disabled (`opacity-45 cursor-not-allowed`) when the subkit is in empty container state.

### Selector Hooks, Slot Calculations, and Store Shape

All selector hooks (`useKitStore.ts`), slot calculation pure functions (`slotCalculations.ts`), and the Zustand store shape (including `KitStore` interface) are **unchanged from Phase 1**. The persist middleware is fully transparent to all consumers.

---

## 6. Data Layer

### Updated KitItem Type

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

### Updated kitItems.ts — Rating and ReviewCount

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

### New: checkoutService.ts

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

### New: analytics.ts

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

### New: StarRating Component

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

---

## 7. Routing

### Phase 2 Route Structure

`/` is now the cover/landing page. The Subkit Selection Screen moves to `/builder`. All guards redirect to `/builder`.

```typescript
// src/router/index.tsx — Phase 2 updated
import { createBrowserRouter, redirect } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { CoverScreen } from '../components/cover/CoverScreen';
import { SubkitSelectionScreen } from '../components/subkit-selection/SubkitSelectionScreen';
import { ItemConfigScreen } from '../components/item-config/ItemConfigScreen';
import { CustomSubkitScreen } from '../components/item-config/CustomSubkitScreen';
import { SummaryScreen } from '../components/summary/SummaryScreen';
import { subkitConfigGuard, customConfigGuard, summaryGuard } from './guards';

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      {
        path: '/',
        element: <CoverScreen />,  // NEW — static landing page
      },
      {
        path: '/builder',          // RENAMED from /
        element: <SubkitSelectionScreen />,
      },
      {
        path: '/configure/:subkitId',
        element: <ItemConfigScreen />,
        loader: subkitConfigGuard,
      },
      {
        path: '/configure/custom',
        element: <CustomSubkitScreen />,
        loader: customConfigGuard,
      },
      {
        path: '/summary',
        element: <SummaryScreen />,
        loader: summaryGuard,
      },
      {
        path: '*',
        loader: () => redirect('/'),
      },
    ],
  },
]);
```

```typescript
// src/router/guards.ts — Phase 2: all redirects updated to /builder
import { redirect } from 'react-router-dom';
import { useKitStore } from '../store/kitStore';

export function subkitConfigGuard({ params }: { params: Record<string, string | undefined> }) {
  const { selectedSubkits } = useKitStore.getState();
  const isValid = selectedSubkits.some((s) => s.subkitId === params['subkitId']);
  return isValid ? null : redirect('/builder');  // was redirect('/')
}

export function customConfigGuard() {
  const { selectedSubkits } = useKitStore.getState();
  const hasCustom = selectedSubkits.some((s) => s.categoryId === 'custom');
  return hasCustom ? null : redirect('/builder');  // was redirect('/')
}

export function summaryGuard() {
  const { selectedSubkits } = useKitStore.getState();
  return selectedSubkits.length >= 3 ? null : redirect('/builder');  // was redirect('/')
}
```

### Navigation Flow — Phase 2

```
/ (CoverScreen)  [NEW]
└── [Build My Kit CTA]
    └── /builder (SubkitSelectionScreen)  [RENAMED from /]
        └── [Configure Items — active only with >= 3 subkits]
            └── /configure/:firstSubkitId (ItemConfigScreen)
                └── [Next Subkit] → /configure/:nextSubkitId
                └── [Next Subkit — Custom] → /configure/custom
                └── [Review My Kit — final subkit] → /summary

/builder — Filled visualizer slots now clickable [Phase 2]
    └── [Click filled slot] → /configure/:subkitId  (direct navigation)

/summary (SummaryScreen)
├── [Get My Kit] → initiateCheckout() → redirect to checkout URL on success
├── [API failure] → dismissible error message; kit state preserved
├── [Edit My Kit] → /builder
└── [Start Over] → ConfirmationModal → resetKit() → /builder
```

### Clickable Slot Implementation

`HousingUnitVisualizer` interface is **unchanged** — `onSlotClick?: (slotIndex: number) => void` was already typed and wired in Phase 1. Phase 2 passes a handler from `SubkitSelectionScreen`:

```typescript
// In SubkitSelectionScreen.tsx — Phase 2 addition
const navigate = useNavigate();
const slots = useSlotState();

const handleSlotClick = (slotIndex: number) => {
  const slot = slots[slotIndex];
  if (slot.status !== 'filled' || !slot.subkitId) return; // empty slots: no-op
  navigate(`/configure/${slot.subkitId}`);
};

// Passed to visualizer:
<HousingUnitVisualizer
  slots={slots}
  onSlotClick={handleSlotClick}
/>
```

`VisualizerSlot` adds `cursor-pointer` and `hover:brightness-95` only when `status === 'filled'` and `onSlotClick` is defined. Empty slots receive no cursor change. `readOnly` mode on `SummaryScreen` does not pass `onSlotClick` — slots remain non-interactive.


---

## 8. Styling Guidelines

Unchanged from Phase 1. All Phase 2 components follow the identical Tailwind v4 + CSS custom properties pipeline, dynamic category colors via inline styles, and GPU-composited animation rules.

### StarRating Styling Notes

- Filled stars use `var(--color-brand-accent)` (#22C55E) — consistent with existing brand palette
- Empty stars use `var(--color-neutral-200)`
- Star SVG size: `w-3.5 h-3.5` — sized to sit comfortably below item name/description without crowding the toggle row
- The `aria-label` on the wrapper `div` conveys the full rating to screen readers; the star SVGs are `aria-hidden`

### Cover Page Styling

`CoverScreen` uses brand tokens only. It is a simple static full-viewport screen built mobile-ready from day one — no breakpoint changes are required in Phase 2 for any other screen.

- Background: `var(--color-brand-primary)` `#1F4D35` — full viewport (not neutral-50; the cover page is a branded full-bleed screen)
- Headline: white (`#FFFFFF`), `font-bold`, large type scale (`text-display` 36px)
- Value proposition: white at `opacity-90`, `text-body-lg` (16px)
- CTA button: **inverted variant** — white background with `--color-brand-primary` text. The standard `PrimaryButton` (dark green fill, white text) would be near-invisible against the dark green background. Use `className="bg-white text-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary-light)]"` on the `PrimaryButton` or pass an `inverted` prop if one is added. Min height 44px per NFR3.
- Accent elements: `var(--color-brand-accent)` sparingly (e.g. thin horizontal rule or headline underline)

### Mobile Responsiveness — Breakpoint Strategy

**Phase 2 retains the Phase 1 desktop-first strategy.** Full mobile responsiveness is deferred to Phase 3 alongside Bazaarvoice. `MobileInterstitial.tsx` and `useResponsive.ts` remain in place and are unchanged.

| Breakpoint | Min Width | Max Width | Usage |
|-----------|-----------|-----------|-------|
| desktop-lg | 1280px | — | `2xl:` |
| desktop | 1024px | 1279px | `lg:` |
| tablet | 768px | 1023px | `md:` |
| tablet-sm | 640px | 767px | `sm:` |
| mobile | 0px | 639px | MobileInterstitial — graceful degradation only |

**Phase 2 breakpoint behaviour:** No new breakpoint values or mobile layout classes are introduced in Phase 2. Users below 768px continue to see the `MobileInterstitial` screen. All Phase 2 layout work targets the 768px–1920px working range. The `CoverScreen` is an exception — it is built mobile-ready from day one as it is a simple static full-viewport screen with no complex layout, but no other screens receive mobile layout changes in Phase 2.

**Phase 3 mobile work (deferred):** `MobileInterstitial` removal, mobile layout variants for all five screens, WCAG 2.1 AA touch target enforcement (44×44px), and single-column grid on mobile. See Phase 3+ Roadmap.

### SummaryScreen Checkout States

Two new visual states added to `SummaryScreen` — both use existing design tokens:

```tsx
{/* Loading state — CTA disabled during API call */}
<PrimaryButton
  disabled
  aria-disabled="true"
  className="opacity-70 cursor-not-allowed"
>
  Processing...
</PrimaryButton>

{/* Error state — dismissible, below CTA */}
{checkoutError && (
  <div
    role="alert"
    className="mt-3 flex items-start gap-2 rounded-[var(--radius-md)] bg-red-50 border border-red-200 p-3 text-sm text-[var(--color-status-error)]"
  >
    <span className="flex-1">{checkoutError}</span>
    <button
      onClick={() => setCheckoutError(null)}
      aria-label="Dismiss error"
      className="shrink-0 text-[var(--color-neutral-400)] hover:text-[var(--color-neutral-700)]"
    >
      <X size={16} />
    </button>
  </div>
)}
```

Kit state is never cleared on checkout failure — `checkoutError` lives in local component state only.

---

## 9. Testing Requirements

### Strategy

Phase 1 unit and component testing strategy unchanged. Phase 2 adds:

- New component tests: `StarRating.test.tsx`
- New unit tests: `checkoutService.test.ts`
- New E2E suite: Playwright (3 flows, 2 projects)
- New CI: GitHub Actions

### Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  reporter: process.env['CI'] ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // iPhone SE mobile project deferred to Phase 3 — MobileInterstitial is retained in Phase 2
    // and would block all E2E flows on mobile viewport. Add mobile project in Phase 3
    // alongside the MobileInterstitial removal and full mobile responsiveness work.
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env['CI'],
  },
});
```

### GitHub Actions CI

```yaml
# .github/workflows/e2e.yml
name: Playwright E2E
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

Playwright runs on `push` and `pull_request` to `main`. Vitest unit tests run separately — `npm run test:run` is not part of `e2e.yml`. Add a separate `ci.yml` for Vitest if desired.

### E2E Test Flows

All three flows in a single `tests/e2e/kit-builder.spec.ts` file, tagged by describe block. Phase 2 runs `chromium` (Desktop Chrome) only — the iPhone SE project is deferred to Phase 3 when `MobileInterstitial` is removed. Adding it in Phase 2 would cause all three flows to fail against the interstitial screen:

| Flow | Key Assertions |
|------|----------------|
| Full kit configuration | Select 3 subkits → configure items → reach Summary → all subkits + items visible |
| Back-navigation state preservation | Configure 2 subkits → navigate back → both selections + sizes preserved |
| Start Over reset | Complete config → Start Over → confirm modal → store resets → 6 empty slots |

Each test clears localStorage before running (`page.evaluate(() => localStorage.clear())`) to ensure clean state.

### New Component + Unit Tests

```typescript
// tests/components/StarRating.test.tsx
describe('StarRating', () => {
  it('renders filled layer clipped to correct percentage for a given rating');
  it('outputs correct aria-label: "Rated 4.3 out of 5 based on 128 reviews"');
  it('renders review count with toLocaleString formatting');
  it('passes axe accessibility assertion');
});

// tests/unit/checkoutService.test.ts (mocking fetch)
describe('initiateCheckout', () => {
  it('returns { success: true, redirectUrl } on 200 response with redirect URL');
  it('returns { success: false, errorMessage } on non-2xx response');
  it('returns { success: false, errorMessage } on network error (fetch throws)');
});
```

### Updated package.json Scripts

```json
{
  "scripts": {
    "dev":           "vite",
    "build":         "tsc && vite build",
    "preview":       "vite preview",
    "lint":          "eslint src --ext ts,tsx",
    "typecheck":     "tsc --noEmit",
    "test":          "vitest",
    "test:run":      "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:e2e":      "playwright test"
  }
}
```

---

## 10. Environment Configuration

```bash
# .env.example — Phase 2

# E-commerce checkout endpoint — POST receives CheckoutPayload; expects { redirectUrl } response
VITE_PURCHASE_URL=https://example.com/purchase

# Google Analytics 4 Measurement ID
# Leave empty in local development to disable analytics
VITE_ANALYTICS_ID=G-XXXXXXXXXX
```

```typescript
// src/tokens/env.ts — Phase 2
export const ENV = {
  purchaseUrl:  import.meta.env['VITE_PURCHASE_URL']  as string ?? '#',
  analyticsId:  import.meta.env['VITE_ANALYTICS_ID'] as string ?? '',
} as const;
```

**Rules (unchanged + additions):**

- Never use `import.meta.env.VITE_*` directly in components — always import from `src/tokens/env.ts`
- All `VITE_` values are public and bundled into the client — never put API secrets here
- `VITE_ANALYTICS_ID` and `VITE_PURCHASE_URL` set in Vercel dashboard for production and preview environments
- When `VITE_ANALYTICS_ID` is empty (local dev), `AppShell` skips GA4 script injection cleanly
- When `VITE_PURCHASE_URL` is the placeholder `#`, the CTA fires but the fetch immediately returns a non-2xx — the error state is displayed; kit state is preserved

---

## 11. Frontend Developer Standards

### All Phase 1 Critical Rules Apply

All 10 critical rules from Phase 1 apply to all Phase 2 code without exception. Phase 2 adds four additional rules:

| # | Rule | Why |
|---|------|-----|
| 11 | **Never call `window.gtag` or any analytics script API directly in components.** Always use `Analytics.*` from `src/utils/analytics.ts`. | Testability; silent failure guarantee; single call-site pattern |
| 12 | **`Analytics.ctaClicked()` must fire before `initiateCheckout()` is called.** The analytics event is not contingent on API success. | PRD FR story 8.2 AC7 |
| 13 | **`isAllFilled` is derived state — never store it in Zustand.** Compute from `itemSelections` in the component. | Prevents sync bugs between derived and stored state |
| 14 | **`StarRating` must not render in `SubkitSummarySection`.** Star ratings appear only during item selection screens — not on the Summary Page. | PRD FR11 |

### Key Import Patterns — Phase 2 Additions

```typescript
// Analytics — always via this module, never window.gtag directly
import { Analytics } from '../utils/analytics';

// Checkout
import { initiateCheckout } from '../services/checkoutService';
import type { CheckoutPayload, CheckoutResult } from '../services/checkoutService';

// Star rating
import { StarRating } from '../components/ui/StarRating';

// Env tokens
import { ENV } from '../tokens/env';
// ENV.purchaseUrl  — checkout POST endpoint
// ENV.analyticsId  — GA4 Measurement ID
```

### Focus Management and ARIA — Phase 2 Additions

- `CoverScreen` heading gets `ref` + `tabIndex={-1}` + `useEffect focus()` per the Phase 1 screen transition pattern
- `StarRating` wrapper `div` carries the full `aria-label`; all star SVGs are `aria-hidden="true"`
- Checkout error `div` uses `role="alert"` — screen readers announce it automatically on appearance
- "Fill my kit based on expert advice" checkbox uses a visible `<label>` associated via `htmlFor` — no `aria-label` override needed

### Quick Reference — All Commands

```bash
npm run dev            # Vite dev server — http://localhost:5173
npm run build          # Production build to dist/
npm run preview        # Preview production build locally
npm run lint           # ESLint + jsx-a11y
npm run typecheck      # tsc --noEmit
npm run test           # Vitest — watch mode
npm run test:run       # Vitest — single run (CI)
npm run test:coverage  # Coverage report
npm run test:e2e       # Playwright E2E (starts dev server automatically)
```

---

## 12. Phase 3+ Roadmap

All items below are **not implemented** in Phase 1 or Phase 2. Extension paths are documented for planning purposes.

| Feature | Extension Path | Phase |
|---------|---------------|-------|
| **Bazaarvoice reviews integration** | `StarRating` component and `ItemCard` integration are data-source agnostic. Phase 3 replaces hardcoded `rating`/`reviewCount` values in `kitItems.ts` with live Bazaarvoice data fetched at build time or runtime. Component is unchanged. | Phase 3 |
| **Branded product mapping + pricing** | `KitItem.productId` and `KitItem.pricePlaceholder` already defined and nullable. Phase 3+: populate fields, add price display to `ItemCard` and `SubkitSummarySection`. No type changes required. | Phase 3 |
| **Weight tracking** | Add `weightGrams: number | null` field to `KitItem`. Add `calculateTotalWeight()` pure function in `slotCalculations.ts`. Display in `SummaryScreen`. No state layer changes required. | Phase 3 |
| **User profiles + saved kits** | Requires backend introduction. Zustand `persist` already handles local persistence. Phase 3+: add auth layer and cloud sync endpoint. Store shape unchanged. | Phase 3+ |
| **E2E expanded coverage** | Playwright infrastructure in place. Add spec files to `tests/e2e/` for new flows. No config changes. | Ongoing |
| **Checkout API contract finalized** | `checkoutService.ts` is designed behind a typed interface. When the real API spec arrives, update `CheckoutPayload`, `CheckoutResult`, and the `fetch` implementation inside `initiateCheckout` only — `SummaryScreen` is unchanged. | Phase 3 |
| **Full mobile responsiveness** | Remove `MobileInterstitial.tsx` and `useResponsive.ts`. Add mobile layout variants (375px baseline) to all five screens. Enforce WCAG 2.1 AA touch targets (44×44px) on all interactive elements. Single-column subkit card grid on mobile. Ships alongside Bazaarvoice as Phase 3 "trust and reach expansion" package. | Phase 3 |

---

*Emergency Prep Kit Builder — Frontend Architecture Document | Version 2.1 | 2026-03-04 | Winston, Architect / Sarah, PO*