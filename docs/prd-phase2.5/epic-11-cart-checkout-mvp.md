# Epic 11: Cart & Checkout MVP

**Prepared by:** John, Product Manager + Sarah, Product Owner
**Date:** 2026-03-10
**Version:** 1.0 (PO-approved — ready for Replit handoff)
**Phase:** 2.6 Brownfield Enhancement
**Epic Branch Convention:** `story/11.1-cart-pricing-functions`, `story/11.2-cart-shell`, `story/11.3-cart-content`, `story/11.4-confirmation-screen`

---

## Epic Goal

Introduce a persistent collapsible cart sidebar, a live item-count badge on the app header, and a post-configuration order confirmation screen — giving users a real-time view of what is in their kit and what it will cost, and delivering a satisfying "you're done" moment after tapping Get My Kit.

---

## Existing System Context

- **Tech stack:** Vite 6 + React 18 + TypeScript 5 strict + Tailwind CSS v4 + Zustand 5 + React Router 6.4+ + Vitest + lucide-react. No new packages are introduced in this epic.
- **State:** `useKitStore` (Zustand with `persist` middleware, storage key `emergency-kit-v1`) exposes `selectedSubkits: SubkitSelection[]`, `itemSelections: Record<string, ItemSelection>`, `emptyContainers: string[]`, `toggleItem(subkitId, itemId)`, `setItemQuantity(subkitId, itemId, qty)`, and `resetKit()`. Store shape is frozen — zero new fields introduced in this epic.
- **Selection key convention:** Every item inclusion is keyed as `${subkitId}::${item.id}` in `itemSelections`. `ItemSelection` carries `subkitId`, `itemId`, `quantity`, and `included`.
- **KitItem type** (`src/types/kit.types.ts`): already has `pricePlaceholder: number | null` as a Phase 3+ stub field. Phase 2.6 populates this field for all 28 items — no type change required.
- **Routing:** `AppShell` is the root layout element; all screens render as its `<Outlet>`. `useLocation()` is available in AppShell via React Router v6.
- **AppHeader** (`src/components/layout/AppHeader.tsx`): renders inside AppShell above the outlet. Phase 2.6 adds a ShoppingCart icon button with a badge to its top-right area.
- **SummaryScreen CTA** currently calls `initiateCheckout()` from `src/services/checkoutService.ts`. Phase 2.6 replaces that call with `navigate('/confirmation')`. `checkoutService.ts` is not touched.
- **Existing test infrastructure:** Vitest + RTL in `tests/components/`, unit tests in `tests/unit/`. axe-core available via `tests/setup.ts`. Component test files mirror `src/` paths.

---

## Enhancement Details

- A new `src/utils/cartCalculations.ts` module provides three pure pricing functions and the `CONTAINER_PRICES` constant. All pricing logic lives exclusively here.
- `pricePlaceholder` is populated for all 28 kit items with market-realistic per-unit prices (hardcoded for MVP).
- `CartSidebar` is a new fixed-position panel mounted by `AppShell`, visible throughout the builder flow, suppressed only on `/confirmation`. Its open/closed boolean is AppShell local state — never Zustand.
- `AppHeader` gains a ShoppingCart icon button whose badge shows the live sum of all selected item quantities.
- `SummaryScreen` Get My Kit CTA navigates to `/confirmation` directly — no API call, no loading state.
- `OrderConfirmationScreen` renders a static order summary and a Start Over action. It is guarded by `confirmationGuard` which redirects to `/builder` if `selectedSubkits` is empty.

---

## Compatibility Requirements

- **CC1:** `checkoutService.ts` is not modified. Not imported by any new file.
- **CC2:** Zustand store shape is unchanged. No new fields on `KitStore`, `KitItem`, `SubkitSelection`, or `ItemSelection`.
- **CC3:** `CartSidebar` reads `itemSelections`, `selectedSubkits`, and `emptyContainers` and dispatches only `toggleItem` and `setItemQuantity`. No other store actions are dispatched.
- **CC4:** CartSidebar open/closed state is `AppShell` local component state. It is never hoisted into Zustand.
- **CC5:** All 15 existing critical rules in `docs/architecture.md` Section 11 apply to all Phase 2.6 code. Dynamic category colors continue to use `style={{ ... }}` — never Tailwind arbitrary values.
- **CC6:** All Phase 2.5 features (`SubkitStatsStrip`, `visualizer-outer-shell`, weight/volume stats on Summary) are unaffected.

---

## Risk Mitigation

| File / Area | Risk | Mitigation |
|---|---|---|
| `kitItems.ts` — `pricePlaceholder` population | Low | Additive value update; no type change; all consumers null-safe |
| `AppShell.tsx` — new local state + `useLocation()` | Low | Additive; `useLocation()` already available via React Router |
| `AppHeader.tsx` — new prop + store read | Low | Additive; store read is read-only |
| `SummaryScreen.tsx` — CTA change | Low | Replace one handler call; remove checkout loading/error state; no store or type changes |
| `router/index.tsx` + `guards.ts` — new route | Low | Additive route entry; guard pattern matches existing guards exactly |
| CartSidebar fixed positioning | Low | `z-50` panel + `z-40` backdrop; no ancestor `overflow-hidden` constraint exists |

---

## Definition of Done

- [ ] All 4 stories completed with all acceptance criteria verified
- [ ] `npm run typecheck` passes
- [ ] `npm run test:run` passes — all new and existing Vitest tests green
- [ ] `npm run lint` passes
- [ ] Cart sidebar is visible and functional on all routes except `/confirmation`
- [ ] Confirmation screen is reachable only via "Get My Kit" from SummaryScreen (guard redirects direct URL access)
- [ ] Start Over on confirmation screen resets kit and returns to `/builder`
- [ ] No regression in any Phase 2 or Phase 2.5 feature

---

## Story 11.1 — Item Pricing Data + Cart Calculation Pure Functions

**As a** developer,
**I want** all 28 kit items to have a hardcoded `pricePlaceholder` price and a tested set of cart calculation pure functions in `src/utils/cartCalculations.ts`,
**so that** CartSidebar and OrderConfirmationScreen have a single reliable source of truth for all pricing logic.

---

### Acceptance Criteria

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

### Integration Verification

- **IV1:** `npm run typecheck` passes — `KitItem.pricePlaceholder` was already typed as `number | null`; no type change required; all existing consumers unaffected.
- **IV2:** `npm run test:run` passes — all new `cartCalculations.test.ts` cases green; all existing tests untouched.
- **IV3:** Importing `{ calculateCartGrandTotal, CONTAINER_PRICES }` from `cartCalculations.ts` in a scratch test with real `ITEMS` from `kitItems.ts` and a mock selections map returns a non-zero dollar total for a stocked subkit.

---

### Dev Notes

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

#### Testing
- Test file location: `tests/unit/cartCalculations.test.ts`
- Framework: Vitest — `describe` / `it` / `expect`
- No RTL or DOM rendering needed — pure function unit tests only
- All 10 test cases in AC7 are required; no axe assertion needed for this story

---

## Story 11.2 — Cart Icon in AppHeader + CartSidebar Shell + AppShell Wiring

**As a** user,
**I want** to see a shopping cart icon in the app header that opens a collapsible sidebar panel,
**so that** I know my cart is available at any point during kit configuration and can open it to review what I have selected.

---

### Acceptance Criteria

**AC1 — AppShell owns `cartOpen` boolean local state.**
`cartOpen` is initialized to `false`. It is never stored in Zustand. AppShell provides `onCartToggle` (toggles open/close) to AppHeader and `isOpen` + `onClose` to CartSidebar. No other component owns or duplicates this state.

**AC2 — AppShell suppresses CartSidebar on `/confirmation`.**
AppShell uses `const location = useLocation()` from `react-router-dom`. When `location.pathname === '/confirmation'`, `CartSidebar` is not rendered at all (conditional render, not CSS hide). On all other routes, `CartSidebar` is rendered with `isOpen={cartOpen}` and `onClose={() => setCartOpen(false)}`.

**AC3 — AppHeader receives `onCartToggle: () => void` as a new prop.**
AppHeader renders a `<button>` in its top-right area containing the `ShoppingCart` icon from `lucide-react` (size 22, named import). Clicking the button calls `onCartToggle`. The button has `aria-label="Open cart"`.

**AC4 — AppHeader displays a live item-count badge on the cart icon.**
AppHeader reads `itemSelections` from `useKitStore`. The badge count is computed as:
```typescript
const cartItemCount = Object.values(itemSelections)
  .filter(sel => sel.included)
  .reduce((sum, sel) => sum + sel.quantity, 0);
```
The badge renders as a small circle overlaid on the top-right of the ShoppingCart icon. It is visible only when `cartItemCount > 0`. Badge styles: `absolute -top-1.5 -right-1.5`, min-width `w-4 h-4`, `radius-full`, `bg-[var(--color-brand-primary)]`, white text, `text-[10px] font-medium`, centered. When `cartItemCount` is 0 the badge element is not rendered (conditional render).

**AC5 — `CartSidebar` component created at `src/components/cart/CartSidebar.tsx`.**
Props interface:
```typescript
interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}
```
The component is a named export: `export const CartSidebar: FC<CartSidebarProps> = ...`

**AC6 — CartSidebar renders as a fixed right-side panel.**
When `isOpen` is `true`, the panel is visible at the right edge of the viewport. When `isOpen` is `false`, it is fully off-screen to the right. Structure:
- Outermost wrapper: `position: fixed`, `inset-y-0 right-0`, `w-80` (320px), `bg-white`, `shadow-3` (20px shadow per design tokens), `z-50`, `flex flex-col`
- Slide transform: `translate-x-0` (open) / `translate-x-full` (closed)
- Transition applied via inline `style={{ transition: 'transform 240ms cubic-bezier(0.4,0,0.2,1)' }}`
- The panel is always present in the DOM when CartSidebar is mounted (it does not unmount when closed) — the slide transition requires the element to exist

**AC7 — Backdrop renders behind the open panel.**
When `isOpen` is `true`, a backdrop `div` renders with:
- `position: fixed`, `inset-0`, `bg-black/40`, `z-40`
- Inline `style={{ transition: 'opacity 200ms cubic-bezier(0.4,0,0.2,1)' }}`
- `onClick={onClose}`, `aria-hidden="true"`
When `isOpen` is `false`, the backdrop is not rendered (conditional render or `opacity-0 pointer-events-none` — either is acceptable as long as it does not block interaction when the sidebar is closed).

**AC8 — CartSidebar shell structure.**
The panel interior has three vertical sections (`flex flex-col h-full`):

*Header row* (`flex-shrink-0`, `flex items-center justify-between`, `px-4 py-3`, `border-b border-[var(--color-neutral-200)]`):
- Left: heading `"Cart"` in `text-h3` (18px / 600), `neutral-900`
- Right: close button — `X` icon from lucide-react (size 20), `aria-label="Close cart"`, calls `onClose`

*Body* (`flex-1 overflow-y-auto px-4 py-3`):
- Story 11.2 renders a placeholder: a single centered `<p>` reading `"Your cart is empty."` in `text-body`, `neutral-400`, centered. This placeholder is replaced entirely in Story 11.3.

*Footer* (`flex-shrink-0`, `border-t border-[var(--color-neutral-200)]`, `px-4 py-3`):
- Story 11.2 renders a single row: `"Total"` label left, `"$0.00"` right, both in `text-label` (14px / 500), `neutral-700`. This footer is replaced in Story 11.3.

**AC9 — Accessibility.**
- CartSidebar root element: `role="dialog"`, `aria-modal="true"`, `aria-label="Cart"`, `tabIndex={-1}`
- When `isOpen` transitions from `false` to `true`, focus moves to the CartSidebar root element via `useEffect` + `ref.current?.focus()`
- When the sidebar closes, focus returns to the cart icon button in AppHeader — pass a `cartButtonRef` from AppShell to AppHeader, and call `cartButtonRef.current?.focus()` in the `onClose` handler after `setCartOpen(false)`
- Keyboard: pressing `Escape` while the sidebar is open calls `onClose`. Handle via `useEffect` keydown listener on the document inside CartSidebar, active only when `isOpen` is `true`.
- The `ShoppingCart` button in AppHeader has `aria-expanded={cartOpen}` to communicate sidebar state to screen readers.

**AC10 — Component tests.**
`tests/components/CartSidebar.test.tsx` covers:
- Sidebar panel not visible (off-screen) when `isOpen={false}`
- Sidebar panel visible when `isOpen={true}`
- Clicking backdrop calls `onClose`
- Clicking X button calls `onClose`
- `role="dialog"` and `aria-label="Cart"` present on panel root
- axe-core accessibility assertion passes with `isOpen={true}`

---

### Integration Verification

- **IV1:** On any route other than `/confirmation`, clicking the cart icon in AppHeader opens the CartSidebar; clicking backdrop or X closes it.
- **IV2:** Navigating to `/confirmation` (manually or via test) — CartSidebar is absent from the DOM.
- **IV3:** The item count badge in AppHeader updates live when items are added via the existing `ItemConfigScreen` toggle — verified by selecting an item in a separate test run.
- **IV4:** `npm run typecheck` and `npm run test:run` pass. All existing tests unaffected.

---

### Dev Notes

**Files modified:**
- `src/components/layout/AppShell.tsx`
- `src/components/layout/AppHeader.tsx`

**New files:**
- `src/components/cart/CartSidebar.tsx`
- `tests/components/CartSidebar.test.tsx`

**AppShell changes — precise insertion points:**
1. Add to imports: `import { useState } from 'react'; import { useLocation } from 'react-router-dom'; import { CartSidebar } from '../cart/CartSidebar';`
2. Inside the component body (before the return): `const [cartOpen, setCartOpen] = useState(false); const location = useLocation(); const isConfirmation = location.pathname === '/confirmation';`
3. In the JSX, pass `onCartToggle={() => setCartOpen(v => !v)}` to `<AppHeader>` as a new prop.
4. Directly before `<Outlet />` (or wherever the main content renders), insert:
```tsx
{!isConfirmation && (
  <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
)}
```
5. The existing `useEffect` for GA4 and the existing `MobileInterstitial` are unchanged.

**AppHeader changes:**
- The existing `AppHeader` component file lives at `src/components/layout/AppHeader.tsx`. Extend its existing props interface (do not replace it) by adding `onCartToggle: () => void`.
- Add `import { ShoppingCart } from 'lucide-react'` to the existing lucide-react import line (named import — never wildcard import).
- Add `const { itemSelections } = useKitStore()` inside the component.
- Compute `cartItemCount` from `itemSelections` as described in AC4.
- The cart button placement: top-right of the header bar. Inspect the existing header JSX structure and append the button to the right side within whatever flex row currently exists. Use `relative` positioning on the button wrapper to allow the absolute badge overlay.

**CartSidebar — component template to follow:**
```typescript
import { type FC, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartSidebar: FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Focus management on open
  useEffect(() => {
    if (isOpen) panelRef.current?.focus();
  }, [isOpen]);

  // Escape key listener
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          style={{ transition: 'opacity 200ms cubic-bezier(0.4,0,0.2,1)' }}
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Cart"
        tabIndex={-1}
        className={`fixed inset-y-0 right-0 w-80 bg-white z-50 flex flex-col focus:outline-none ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          boxShadow: '0 20px 25px rgba(0,0,0,0.12)',
          transition: 'transform 240ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Header */}
        {/* Body (placeholder in Story 11.2) */}
        {/* Footer (placeholder in Story 11.2) */}
      </div>
    </>
  );
};
```

**`shadow-3`** is defined in the design system as `0 20px 25px rgba(0,0,0,0.12)`. Apply via inline `style` since Tailwind arbitrary shadow values are not used per the project's patterns. See `src/tokens/design-tokens.ts` for the canonical value if you need to verify.

**Existing pattern for focus management on screen transitions:** `ItemConfigScreen` uses a `mainHeadingRef` + `useEffect` on mount. Follow the same `useRef<HTMLDivElement>(null)` + `useEffect(() => { if (isOpen) ref.current?.focus(); }, [isOpen])` pattern.

#### Testing
- Test file: `tests/components/CartSidebar.test.tsx`
- Import `{ render, screen, fireEvent }` from `@testing-library/react`
- Import `{ axe }` from `@axe-core/react` (or `vitest-axe` — follow what `StarRating.test.tsx` uses)
- Wrap renders in a `MemoryRouter` from `react-router-dom` if CartSidebar accesses any router context (it doesn't in Story 11.2, but add the wrapper for consistency)
- Test the `translate-x-full` class for the closed state — RTL can check `classList.contains('translate-x-full')`

---

## Story 11.3 — CartSidebar Live Content

**As a** user,
**I want** the cart sidebar to display my selected subkits and items with prices, quantities I can adjust, and items I can remove,
**so that** I always know exactly what is in my kit and how much it will cost.

---

### Acceptance Criteria

**AC1 — CartSidebar body is replaced with live subkit sections.**
The Story 11.2 placeholder `<p>Your cart is empty.</p>` is removed. The body renders the following:

*When `selectedSubkits` is empty or all subkits are empty-container:*
An empty-state message: `"Your kit is empty. Start by selecting subkits."` in `text-body` (14px / 400), `neutral-400`, centered vertically and horizontally within the body area.

*When at least one subkit exists:*
One section per subkit in `selectedSubkits`, ordered by `selectionOrder` ascending. Each section is described in AC2–AC6.

**AC2 — Data derivation inside CartSidebar.**
CartSidebar reads the following from `useKitStore()` — no other store fields accessed:
```typescript
const { selectedSubkits, itemSelections, emptyContainers } = useKitStore();
const { toggleItem, setItemQuantity } = useKitStore();
```
CartSidebar also imports `ITEMS` from `src/data/kitItems.ts` directly (not from the store) to look up `pricePlaceholder` and `name` by item ID. CartSidebar imports `calculateSubkitCartTotal` and `calculateCartGrandTotal` from `src/utils/cartCalculations.ts`.

**AC3 — Subkit section header row.**
Each section renders a header row containing:
- Left: category icon (lucide-react, size 16, named import matching `categoryId`) + subkit name in `text-label` (14px / 500), `neutral-900`
- Right: container price badge — `"$40"` (Regular) or `"$60"` (Large) in `text-caption` (12px / 400), `neutral-500`, preceded by size label `"Regular"` / `"Large"` in the same style
- The header row uses the subkit's category base color as a `4px` left border. Dynamic color via inline `style={{ borderLeftColor: categoryBaseColor }}` — never a Tailwind arbitrary value.
- Bottom border: `border-b border-[var(--color-neutral-100)]`, `mb-1`

**AC4 — Empty-container subkit body.**
If `emptyContainers.includes(subkit.subkitId)`, the section body renders a single row below the header:
`"◈ Empty container"` in `text-caption`, `neutral-400`, `italic`, `py-2 px-1`. No item rows. Section total = container price only.

**AC5 — Item rows for included items.**
For every entry in `itemSelections` where `sel.subkitId === subkit.subkitId` and `sel.included === true`, one item row is rendered. Rows are sorted by `sel.itemId` alphabetically. Each item row contains:

- *Item name:* `text-body` (14px / 400), `neutral-700`. Truncated to one line via `truncate` if too long.
- *Quantity controls* (`flex items-center gap-1`): `−` button | quantity display | `+` button. Min 1, max 10. `−` disabled when `quantity === 1`. `+` disabled when `quantity === 10`.
  - `−` calls `setItemQuantity(sel.subkitId, sel.itemId, sel.quantity - 1)`.
  - `+` calls `setItemQuantity(sel.subkitId, sel.itemId, sel.quantity + 1)`.
  - Button size: `w-6 h-6`, `rounded-sm`, `border border-[var(--color-neutral-200)]`, `text-caption`, `neutral-600`. Disabled state: `opacity-40 cursor-not-allowed`.
- *Line total:* `text-caption`, `neutral-500`, right-aligned. Formatted as `$XX.XX` using `(price * quantity).toFixed(2)`. If `pricePlaceholder` is null, shows `"—"`.
- *Remove button:* `X` icon from lucide-react (size 12), `aria-label="Remove {itemName} from cart"`. Calls `toggleItem(sel.subkitId, sel.itemId)` which sets `included: false`. Styled as a ghost icon button: `text-[var(--color-neutral-400)] hover:text-[var(--color-neutral-700)]`, no border, no background.

**AC6 — Subkit section subtotal row.**
Below the item rows (or below the empty-container row), a subtotal row renders:
- `flex justify-between items-center`, `pt-2 mt-1 border-t border-[var(--color-neutral-100)]`
- Left: `"Subtotal"` in `text-caption`, `neutral-500`
- Right: `"$XX.XX"` using `calculateSubkitCartTotal(subkit, itemSelections, ITEMS).toFixed(2)`, in `text-label` (14px / 500), `neutral-700`

**AC7 — Separator between subkit sections.**
Each section (except the last) is separated by a `<hr>` with `border-neutral-100` or a `my-3` spacer div.

**AC8 — CartSidebar footer replaced with live grand total.**
The Story 11.2 placeholder footer is replaced:
- Left: `"Total"` in `text-label`, `neutral-700`
- Right: grand total formatted as `$XX.XX` using `calculateCartGrandTotal(selectedSubkits, itemSelections, ITEMS).toFixed(2)`, in `text-h3` (18px / 600), `neutral-900`
- Below the total row: `text-caption`, `neutral-400`, `mt-1`: `"Container prices included"`

**AC9 — Cart item row category color applied via inline style.**
Each item row has a subtle `4px` left border accent in the subkit's category base color applied as `style={{ borderLeftColor: categoryBaseColor }}` on the row wrapper div. Never use Tailwind arbitrary values for this color (Rule 8).

**AC10 — Live updates without lag.**
Because CartSidebar reads directly from `useKitStore()`, any item toggle or quantity change on `ItemConfigScreen` causes CartSidebar to re-render immediately. No polling or event bus required — Zustand's subscription model provides this automatically.

**AC11 — Component tests in `tests/components/CartSidebar.test.tsx` extended.**
All Story 11.2 tests continue to pass. The following additional tests are added:

| Test | Assertion |
|---|---|
| Empty state: no subkits → renders empty message | `screen.getByText(/your kit is empty/i)` present |
| One subkit, one included item → item name rendered | item name text present in DOM |
| One subkit, one included item → line total formatted correctly | `$XX.XX` string rendered for known price × quantity |
| Subkit subtotal row reflects container price + item costs | subtotal element contains correct `$XX.XX` |
| Grand total equals sum of all subkit subtotals | footer total element correct |
| Clicking `−` button calls `setItemQuantity` with `quantity - 1` | mock store action called with correct args |
| Clicking remove `X` icon calls `toggleItem` | mock store action called with correct subkitId + itemId |
| Empty-container subkit shows "◈ Empty container" and no item rows | correct text present; no quantity controls in DOM |
| axe-core assertion passes with populated cart content | zero violations |

---

### Integration Verification

- **IV1:** On `ItemConfigScreen`, toggling an item to included causes it to appear in the open CartSidebar in the same render cycle.
- **IV2:** Incrementing quantity on an item row inside the sidebar updates the quantity display and line total immediately.
- **IV3:** Removing an item from the sidebar via the X button causes the item's card on `ItemConfigScreen` to show as excluded on next visit.
- **IV4:** Grand total in the footer is arithmetically consistent with the sum of per-subkit subtotals.
- **IV5:** `npm run typecheck` and `npm run test:run` pass. All existing tests unaffected.

---

### Dev Notes

**Files modified:**
- `src/components/cart/CartSidebar.tsx` — replace Story 11.2 placeholder body and footer with live content per this story

**No other files change in this story.** All pricing data, calculation functions, and store actions were established in Stories 11.1 and 11.2.

**Key imports inside CartSidebar:**
```typescript
import { useKitStore } from '../../store/kitStore';
import { ITEMS } from '../../data/kitItems';
import {
  CONTAINER_PRICES,
  calculateSubkitCartTotal,
  calculateCartGrandTotal,
} from '../../utils/cartCalculations';
import { X } from 'lucide-react';
```

**Category icon lookup pattern:** The category icon map is defined in `src/utils/categoryUtils.ts` (check this file first) or inline in `ItemConfigScreen.tsx`. Import the lookup object from whichever file currently exports it — use a named import only. Do not duplicate the mapping in CartSidebar.

**Selection key format (critical):**
All lookups of `itemSelections` use the key `${subkitId}::${item.id}`. When iterating to find items for a given subkit, filter `Object.values(itemSelections)` by `sel.subkitId === subkit.subkitId` and `sel.included === true` — do not try to reconstruct keys manually when filtering by subkit.

**Sorting item rows:**
```typescript
const includedItems = Object.values(itemSelections)
  .filter(sel => sel.subkitId === subkit.subkitId && sel.included)
  .sort((a, b) => a.itemId.localeCompare(b.itemId));
```

**Category color lookup:** Use `getCategoryColor(categoryId)` or `CATEGORIES.find(c => c.id === categoryId)?.baseColor` — follow whatever pattern exists in the project. Pass inline as `style={{ borderLeftColor: color }}`.

**Currency formatting:** Use `(value).toFixed(2)` for all displayed dollar amounts. Display as `` `$${value.toFixed(2)}` `` string interpolation.

**`CONTAINER_PRICES` import:** Already exported from `cartCalculations.ts` (Story 11.1 AC2). Import and use for the container price badge in AC3 — do not hardcode `40` or `60` as magic numbers anywhere in `CartSidebar`.

**Test mocking pattern for store:** Mock `useKitStore` following the same pattern used in `ItemCard.test.tsx` or `QuantitySelector.test.tsx`. Provide a minimal mock shape covering `selectedSubkits`, `itemSelections`, `emptyContainers`, `toggleItem`, and `setItemQuantity`. Use `vi.fn()` for action mocks and assert call arguments.

#### Testing
- Test file: `tests/components/CartSidebar.test.tsx` (extended from Story 11.2)
- All Story 11.2 cases must remain passing
- Add the 9 new cases from AC11

---

## Story 11.4 — SummaryScreen CTA → `/confirmation` + OrderConfirmationScreen + Route + Guard

**As a** user,
**I want** clicking "Get My Kit" on the Summary Page to take me to a confirmation screen that shows my order summary and lets me start over,
**so that** I have a clear sense of completion after finalizing my kit selection.

---

### Acceptance Criteria

**AC1 — `SummaryScreen` Get My Kit CTA is rewired.**
In `src/components/summary/SummaryScreen.tsx`:
- Remove the `isLoading` local state and any loading spinner/disabled handling on the CTA.
- Remove the `checkoutError` local state and the dismissible error `div` below the CTA.
- Remove the import of `initiateCheckout` from `checkoutService.ts`.
- Add or confirm `const navigate = useNavigate()`.
- The CTA `onClick` becomes:
```typescript
onClick={() => {
  Analytics.ctaClicked();
  navigate('/confirmation');
}}
```
- The button label remains `"Get My Kit"` and its visual style is unchanged.
- `checkoutService.ts` is not imported, not called, and not modified.

**AC2 — `OrderConfirmationScreen` component created at `src/components/confirmation/OrderConfirmationScreen.tsx`.**
Named export: `export const OrderConfirmationScreen: FC = () => { ... }`. No props.

**AC3 — Confirmation screen layout and content.**
The screen renders inside `AppShell` as a route outlet child.

*Hero section:*
- Heading: `"Your kit is on its way."` in `text-display` (36px / 700), `neutral-900`, centered.
- Sub-heading: `"Here's a summary of what you configured."` in `text-body-lg` (16px / 400), `neutral-500`, centered, `mt-2`.

*Order summary:*
A read-only summary list rendered below the hero section (`mt-8`), using the existing `SubkitSummarySection` component imported from `src/components/summary/SubkitSummarySection.tsx` — used unchanged, no new props.

*Grand total row:*
Below the subkit list:
- `flex justify-between items-center`, `mt-6 pt-4 border-t border-[var(--color-neutral-200)]`
- Left: `"Kit Total"` in `text-label`, `neutral-700`
- Right: `$XX.XX` using `calculateCartGrandTotal(selectedSubkits, itemSelections, ITEMS).toFixed(2)`, in `text-h2` (22px / 600), `neutral-900`
- Below the amount: `text-caption`, `neutral-400`: `"Containers included · Items priced individually"`

*Start Over action:*
A `SecondaryButton` (from `src/components/ui/SecondaryButton.tsx`) with label `"Start Over"`, centered, `mt-8`. Clicking calls `resetKit()` then `navigate('/builder')`. No confirmation modal.

**AC4 — `confirmationGuard` added to `src/router/guards.ts`.**
```typescript
export function confirmationGuard() {
  const { selectedSubkits } = useKitStore.getState();
  return selectedSubkits.length > 0 ? null : redirect('/builder');
}
```
Follows the exact same pattern as `summaryGuard` already in the file.

**AC5 — `/confirmation` route registered in `src/router/index.tsx`.**
```typescript
{
  path: '/confirmation',
  element: <OrderConfirmationScreen />,
  loader: confirmationGuard,
},
```
Inserted before the wildcard `path: '*'` redirect entry. Import `OrderConfirmationScreen` from `'../components/confirmation/OrderConfirmationScreen'`. Import `confirmationGuard` from `'./guards'`.

**AC6 — CartSidebar is not rendered on `/confirmation`.**
Already fulfilled by Story 11.2 AC2. This AC confirms the behavior is verified in integration testing.

**AC7 — `StepProgressIndicator` on confirmation screen.**
Default behavior (all steps showing as complete or not showing at all) is acceptable for MVP. Do not add new prop or component logic unless the existing behavior is visually broken.

**AC8 — Component tests for `OrderConfirmationScreen` in `tests/components/OrderConfirmationScreen.test.tsx`.**

| Test | Assertion |
|---|---|
| Confirmation heading renders | `screen.getByText(/your kit is on its way/i)` present |
| Grand total row renders with correct formatted amount | `$XX.XX` present for known mock items/subkits |
| `"Containers included"` note renders | informational text present |
| Start Over button present | button with text "Start Over" in DOM |
| Clicking Start Over calls `resetKit()` | `vi.fn()` mock asserted called |
| Clicking Start Over calls `navigate('/builder')` | navigate mock asserted called with `'/builder'` |
| axe-core assertion passes | zero violations |

**AC9 — SummaryScreen component tests updated.**
- Any test asserting that clicking "Get My Kit" calls `initiateCheckout` is updated to assert that `navigate` is called with `'/confirmation'` instead.
- Any test simulating the loading or error state introduced for checkout is removed.
- All other existing `SummaryScreen` tests continue to pass unchanged.

**AC10 — TypeScript strict compilation and all tests pass.**
`tsc --noEmit` and `npm run test:run` both pass with zero errors.

---

### Integration Verification

- **IV1:** Full flow — SubkitSelectionScreen → ItemConfigScreen × N → SummaryScreen → click "Get My Kit" → lands on `/confirmation` with correct subkit summary and grand total.
- **IV2:** On `/confirmation`, CartSidebar is absent from the DOM.
- **IV3:** Clicking "Start Over" resets the store, navigates to `/builder`, kit builder shows fresh empty state.
- **IV4:** Direct navigation to `/confirmation` with no kit configured redirects to `/builder`.
- **IV5:** `Analytics.ctaClicked()` fires when "Get My Kit" is clicked.
- **IV6:** `npm run typecheck` and `npm run test:run` pass. Existing Playwright E2E flows unaffected.

---

### Dev Notes

**Files modified:**
- `src/components/summary/SummaryScreen.tsx`
- `src/router/guards.ts`
- `src/router/index.tsx`
- `tests/components/SummaryScreen.test.tsx` (update checkout assertions per AC9)

**New files:**
- `src/components/confirmation/OrderConfirmationScreen.tsx`
- `tests/components/OrderConfirmationScreen.test.tsx`

**SummaryScreen surgery — precise changes:**
1. Remove: `import { initiateCheckout } from '../../services/checkoutService';`
2. Remove: `const [isLoading, setIsLoading] = useState(false);`
3. Remove: `const [checkoutError, setCheckoutError] = useState<string | null>(null);`
4. Remove: the entire async `handleCheckout` function
5. Remove: the error `div` block beneath the CTA (`role="alert"` dismissible error)
6. Add or confirm: `const navigate = useNavigate();`
7. Replace the CTA `onClick` with:
```typescript
onClick={() => {
  Analytics.ctaClicked();
  navigate('/confirmation');
}}
```
8. Remove the button `disabled` attribute and `opacity-70 cursor-not-allowed` class — button is always enabled.
9. Button label `"Get My Kit"` and all other visual styling stay exactly the same.

**`OrderConfirmationScreen` — key implementation:**
```typescript
import { type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKitStore } from '../../store/kitStore';
import { SubkitSummarySection } from '../summary/SubkitSummarySection';
import { SecondaryButton } from '../ui/SecondaryButton';
import { ITEMS } from '../../data/kitItems';
import { calculateCartGrandTotal } from '../../utils/cartCalculations';

export const OrderConfirmationScreen: FC = () => {
  const navigate = useNavigate();
  const { selectedSubkits, itemSelections, emptyContainers, resetKit } = useKitStore();
  const grandTotal = calculateCartGrandTotal(selectedSubkits, itemSelections, ITEMS);

  const handleStartOver = () => {
    resetKit();
    navigate('/builder');
  };

  return (
    <main /* max-w-[960px] mx-auto px-4 md:px-8 — match SummaryScreen layout */ >
      {/* Hero */}
      {/* SubkitSummarySection list */}
      {/* Grand total row */}
      {/* Start Over button */}
    </main>
  );
};
```

**`SubkitSummarySection` usage:** Pass `subkit`, `itemSelections`, and `emptyContainers` exactly as `SummaryScreen` does — no new props.

**`confirmationGuard` pattern:** `useKitStore.getState()` is the correct way to read Zustand state in a React Router loader (outside a React component). Already used by every other guard in the file.

**Layout consistency:** Use `max-w-[960px] mx-auto px-4 md:px-8` — same as `SummaryScreen`.

**`emptyContainers` on confirmation screen:** Pass to `SubkitSummarySection` — empty-container subkits should show the `"◈ Empty Container"` badge, consistent with `SummaryScreen`.

#### Testing
- Test file: `tests/components/OrderConfirmationScreen.test.tsx`
- Wrap in `MemoryRouter` (or `createMemoryRouter`) and mocked Zustand store
- Mock `useNavigate` to capture navigate calls
- 7 test cases required per AC8

---

## Handoff to Dev Agent

Epic 11 stories are sequenced as a strict dependency chain:

```
11.1 (pricing data + pure functions)
  └── 11.2 (cart shell + AppHeader badge + AppShell wiring)
        └── 11.3 (CartSidebar live content)
              └── 11.4 (SummaryScreen CTA + OrderConfirmationScreen + route)
```

Each story must be merged to `main` before the next story branch is cut. Story branches follow the convention `story/11.1-cart-pricing-functions`, `story/11.2-cart-shell`, `story/11.3-cart-content`, `story/11.4-confirmation-screen`.

The architecture document (`docs/architecture.md` v2.2, Section 1 Phase 2.6 table and Section 7 routing) is the authoritative reference for all file locations, component interfaces, and coding constraints. Stories 11.1–11.4 together deliver the complete Phase 2.6 Cart & Checkout MVP scope.

---

*Emergency Prep Kit Builder — Epic 11: Cart & Checkout MVP | Version 1.0 | 2026-03-10 | John, PM / Sarah, PO*
