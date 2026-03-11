# Enhancement Details

- A new `src/utils/cartCalculations.ts` module provides three pure pricing functions and the `CONTAINER_PRICES` constant. All pricing logic lives exclusively here.
- `pricePlaceholder` is populated for all 28 kit items with market-realistic per-unit prices (hardcoded for MVP).
- `CartSidebar` is a new fixed-position panel mounted by `AppShell`, visible throughout the builder flow, suppressed only on `/confirmation`. Its open/closed boolean is AppShell local state — never Zustand.
- `AppHeader` gains a ShoppingCart icon button whose badge shows the live sum of all selected item quantities.
- `SummaryScreen` Get My Kit CTA navigates to `/confirmation` directly — no API call, no loading state.
- `OrderConfirmationScreen` renders a static order summary and a Start Over action. It is guarded by `confirmationGuard` which redirects to `/builder` if `selectedSubkits` is empty.

---
