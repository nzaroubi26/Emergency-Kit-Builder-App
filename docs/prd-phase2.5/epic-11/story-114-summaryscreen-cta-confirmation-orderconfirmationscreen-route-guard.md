# Story 11.4 — SummaryScreen CTA → `/confirmation` + OrderConfirmationScreen + Route + Guard

**As a** user,
**I want** clicking "Get My Kit" on the Summary Page to take me to a confirmation screen that shows my order summary and lets me start over,
**so that** I have a clear sense of completion after finalizing my kit selection.

---

## Acceptance Criteria

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

## Integration Verification

- **IV1:** Full flow — SubkitSelectionScreen → ItemConfigScreen × N → SummaryScreen → click "Get My Kit" → lands on `/confirmation` with correct subkit summary and grand total.
- **IV2:** On `/confirmation`, CartSidebar is absent from the DOM.
- **IV3:** Clicking "Start Over" resets the store, navigates to `/builder`, kit builder shows fresh empty state.
- **IV4:** Direct navigation to `/confirmation` with no kit configured redirects to `/builder`.
- **IV5:** `Analytics.ctaClicked()` fires when "Get My Kit" is clicked.
- **IV6:** `npm run typecheck` and `npm run test:run` pass. Existing Playwright E2E flows unaffected.

---

## Dev Notes

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

### Testing
- Test file: `tests/components/OrderConfirmationScreen.test.tsx`
- Wrap in `MemoryRouter` (or `createMemoryRouter`) and mocked Zustand store
- Mock `useNavigate` to capture navigate calls
- 7 test cases required per AC8

---
