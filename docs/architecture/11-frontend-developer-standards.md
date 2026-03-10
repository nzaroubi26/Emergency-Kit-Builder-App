# 11. Frontend Developer Standards

## All Phase 1 Critical Rules Apply

All 10 critical rules from Phase 1 apply to all Phase 2 code without exception. Phase 2 adds four additional rules:

| # | Rule | Why |
|---|------|-----|
| 11 | **Never call `window.gtag` or any analytics script API directly in components.** Always use `Analytics.*` from `src/utils/analytics.ts`. | Testability; silent failure guarantee; single call-site pattern |
| 12 | **`Analytics.ctaClicked()` must fire before `initiateCheckout()` is called.** The analytics event is not contingent on API success. | PRD FR story 8.2 AC7 |
| 13 | **`isAllFilled` is derived state — never store it in Zustand.** Compute from `itemSelections` in the component. | Prevents sync bugs between derived and stored state |
| 14 | **`StarRating` must not render in `SubkitSummarySection`.** Star ratings appear only during item selection screens — not on the Summary Page. | PRD FR11 |

## Key Import Patterns — Phase 2 Additions

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

## Focus Management and ARIA — Phase 2 Additions

- `CoverScreen` heading gets `ref` + `tabIndex={-1}` + `useEffect focus()` per the Phase 1 screen transition pattern
- `StarRating` wrapper `div` carries the full `aria-label`; all star SVGs are `aria-hidden="true"`
- Checkout error `div` uses `role="alert"` — screen readers announce it automatically on appearance
- "Fill my kit for me" checkbox uses a visible `<label>` associated via `htmlFor` — no `aria-label` override needed

## Phase 2.5 Coding Standards

All 14 critical rules (Rules 1–14, Section 11) apply to all Phase 2.5 code without exception. No new rules are introduced. The following reminders apply specifically to Phase 2.5 implementation:

- **Rule 8 (dynamic colors via inline style):** The `SubkitStatsStrip` volume bar fill color uses `style={{ backgroundColor: categoryColor }}`. Never use Tailwind arbitrary values for category colors.
- **Rule 13 (derived state not stored):** `weightLbs` and `volumePct` are always computed inline in the parent using `calculateSubkitWeightLbs` / `calculateSubkitVolumePct`. They are never stored in Zustand and never lifted into component state.
- **Rule 14 (no StarRating in SubkitSummarySection):** Unchanged — Phase 2.5 adds weight/volume stats to `SubkitSummarySection` heading rows but does not add `StarRating`.
- **FR13 (no warnings):** No color changes, no icons, no text changes at any weight or volume value — including values above 100% fill. The word "informational" is absolute. Do not add any conditional rendering based on weight or volume thresholds.

## Phase 2.5 Import Patterns

```typescript
// Weight and volume calculation functions
import { calculateSubkitWeightLbs, calculateSubkitVolumePct } from '../utils/slotCalculations';

// SubkitStatsStrip — item-config screens only
import { SubkitStatsStrip } from './SubkitStatsStrip';

// Container capacities — use these constants, never magic numbers
const REGULAR_CAPACITY_IN3 = 1728;
const LARGE_CAPACITY_IN3 = 3456;
```

## Quick Reference — All Commands

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
