# Story 11.2 — Cart Icon in AppHeader + CartSidebar Shell + AppShell Wiring

**As a** user,
**I want** to see a shopping cart icon in the app header that opens a collapsible sidebar panel,
**so that** I know my cart is available at any point during kit configuration and can open it to review what I have selected.

---

## Acceptance Criteria

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

## Integration Verification

- **IV1:** On any route other than `/confirmation`, clicking the cart icon in AppHeader opens the CartSidebar; clicking backdrop or X closes it.
- **IV2:** Navigating to `/confirmation` (manually or via test) — CartSidebar is absent from the DOM.
- **IV3:** The item count badge in AppHeader updates live when items are added via the existing `ItemConfigScreen` toggle — verified by selecting an item in a separate test run.
- **IV4:** `npm run typecheck` and `npm run test:run` pass. All existing tests unaffected.

---

## Dev Notes

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

### Testing
- Test file: `tests/components/CartSidebar.test.tsx`
- Import `{ render, screen, fireEvent }` from `@testing-library/react`
- Import `{ axe }` from `@axe-core/react` (or `vitest-axe` — follow what `StarRating.test.tsx` uses)
- Wrap renders in a `MemoryRouter` from `react-router-dom` if CartSidebar accesses any router context (it doesn't in Story 11.2, but add the wrapper for consistency)
- Test the `translate-x-full` class for the closed state — RTL can check `classList.contains('translate-x-full')`

---
