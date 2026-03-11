# Story 11.3 — CartSidebar Live Content

**As a** user,
**I want** the cart sidebar to display my selected subkits and items with prices, quantities I can adjust, and items I can remove,
**so that** I always know exactly what is in my kit and how much it will cost.

---

## Acceptance Criteria

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

## Integration Verification

- **IV1:** On `ItemConfigScreen`, toggling an item to included causes it to appear in the open CartSidebar in the same render cycle.
- **IV2:** Incrementing quantity on an item row inside the sidebar updates the quantity display and line total immediately.
- **IV3:** Removing an item from the sidebar via the X button causes the item's card on `ItemConfigScreen` to show as excluded on next visit.
- **IV4:** Grand total in the footer is arithmetically consistent with the sum of per-subkit subtotals.
- **IV5:** `npm run typecheck` and `npm run test:run` pass. All existing tests unaffected.

---

## Dev Notes

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

### Testing
- Test file: `tests/components/CartSidebar.test.tsx` (extended from Story 11.2)
- All Story 11.2 cases must remain passing
- Add the 9 new cases from AC11

---
