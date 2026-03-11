# Epic 12: Inline Pricing Display

**Prepared by:** Sarah, Product Owner
**Date:** 2026-03-11
**Version:** 1.1 (Updated — Features 4–5 and Stories 12.4–12.5 added)
**Phase:** 2.7 Brownfield Enhancement
**Depends on:** Epic 11 (all stories complete — pricing data and cart calculations already exist)

---

## Epic Goal

Surface per-item, per-container, and per-subkit pricing information throughout the kit-building flow — on the Item Configuration screen, next to the Empty Container checkbox, on the Summary/Review Kit page, and as live subkit subtotals — so users have continuous cost visibility as they build and review their kit, without needing to open the cart sidebar.

---

## Existing System Context

- **Pricing data:** All 28 items in `src/data/kitItems.ts` have `pricePlaceholder: number | null` populated with hardcoded per-unit prices (Epic 11, Story 11.1).
- **Cart calculation functions:** `src/utils/cartCalculations.ts` exports `calculateItemLineTotal`, `calculateSubkitCartTotal`, `calculateCartGrandTotal`, and `CONTAINER_PRICES` (`{ regular: 40, large: 60 }`).
- **ItemCard component:** `src/components/item-config/ItemCard.tsx` currently shows: image, name, description, star rating (when available), and quantity selector (when included). No price is displayed.
- **EmptyContainerOption:** Renders a checkbox with label "I already own these — send me an empty container instead" on both `ItemConfigScreen` and `CustomSubkitScreen`. No price is displayed.
- **SubkitSummarySection:** `src/components/summary/SubkitSummarySection.tsx` shows item names with `×quantity` badges and per-subkit weight/volume stats. No item prices or line totals are displayed.
- **Store shape:** Unchanged. No new Zustand fields required.
- **Types:** No type changes required. `KitItem.pricePlaceholder` already typed as `number | null`.

---

## Enhancement Details

### Feature 1: Item Price on ItemCard

Each `ItemCard` on the Item Configuration screens (`ItemConfigScreen` and `CustomSubkitScreen`) displays the item's per-unit price below the star rating (or below the description if no rating exists). Format: `$XX.XX` in `text-caption` (12px/400), `neutral-500`. Items with `null` price show nothing — no placeholder text.

### Feature 2: Empty Container Price at Checkbox

The `EmptyContainerOption` component displays the container price inline with the checkbox label. The price matches the subkit's selected size: `$40.00` for Regular, `$60.00` for Large. The price is sourced from the existing `CONTAINER_PRICES` constant in `cartCalculations.ts`. Format: price displayed as a suffix or secondary line after the existing label text, in `text-caption`, `neutral-500`.

### Feature 3: Item Prices on Summary/Review Kit Page

Each item row in `SubkitSummarySection` displays the per-unit price and line total alongside the existing quantity badge. Format: `$XX.XX each` or `$XX.XX × N = $YY.YY` pattern in `text-caption`, `neutral-400`. Items with `null` price display no price information. The existing weight/volume stats in the heading row are unaffected.

### Feature 4: Subkit Subtotal on Item Configuration Screen

A live subtotal indicator is displayed at the bottom-right of the Item Configuration screens (`ItemConfigScreen` and `CustomSubkitScreen`) showing the total cost for the current subkit. The subtotal always includes the base container price for the subkit's size ($40.00 Regular / $60.00 Large) plus all included item line totals, computed using the existing `calculateSubkitCartTotal` function from `src/utils/cartCalculations.ts`. The subtotal updates live as items are added/removed or quantities change. The indicator is always visible once the subkit is active (minimum value equals the container price). Format: `Subkit Subtotal: $XX.XX` in `text-caption`, `neutral-500`.

### Feature 5: Subkit Subtotal on Summary/Review Kit Page

A subkit subtotal line is displayed at the bottom of each `SubkitSummarySection` on the Summary page, showing the total cost for that subkit (container + items). The subtotal is computed using the existing `calculateSubkitCartTotal` function from `src/utils/cartCalculations.ts`. Format: `Subtotal: $XX.XX` aligned right below the item list, in `text-caption`, `neutral-400`. This appears on both the Summary screen and the Order Confirmation screen since both render `SubkitSummarySection`.

---

## Story List

| Story | Title | Status |
|---|---|---|
| 12.1 | Item Price Display on ItemCard | Done |
| 12.2 | Empty Container Price at Checkbox | Done |
| 12.3 | Item Prices and Line Totals on SubkitSummarySection | Done |
| 12.4 | Subkit Subtotal on Item Configuration Screen | Draft |
| 12.5 | Subkit Subtotal on Summary/Review Kit Page | Draft |

---

## Compatibility Requirements

- **CC1:** Zustand store shape is unchanged. No new fields on `KitStore`, `KitItem`, `SubkitSelection`, or `ItemSelection`.
- **CC2:** `cartCalculations.ts` is not modified — its existing exports are consumed read-only.
- **CC3:** All existing component props interfaces are extended additively where needed — no breaking changes.
- **CC4:** All Phase 2.5 features (`SubkitStatsStrip`, visualizer exterior, weight/volume stats) are unaffected.
- **CC5:** All Phase 2.6 features (CartSidebar, cart badge, OrderConfirmationScreen) are unaffected.
- **CC6:** All 15 existing critical rules in `docs/architecture.md` Section 11 apply to all new code.

---

## Risk Mitigation

| File / Area | Risk | Mitigation |
|---|---|---|
| `ItemCard.tsx` — new price display | Low | Additive JSX; conditional render on non-null price; no prop interface change needed (item already available via `item.pricePlaceholder`) |
| `EmptyContainerOption` — new price prop | Low | Additive prop; parent already knows subkit size; `CONTAINER_PRICES` is a simple constant import |
| `SubkitSummarySection.tsx` — price display in item rows | Low | Additive JSX per item; `item.pricePlaceholder` already available from the `items` prop; `calculateItemLineTotal` is a pure function import |
| `ItemConfigScreen.tsx` / `CustomSubkitScreen.tsx` — subkit subtotal indicator | Low | Additive JSX at bottom of screen; `calculateSubkitCartTotal` is a pure function import; reads existing store state; no new props or store fields |
| `SubkitSummarySection.tsx` — subkit subtotal line | Low | Additive JSX below item list; `calculateSubkitCartTotal` is a pure function import; no prop interface change needed (subkit data already available) |

---

## Definition of Done

- [x] All stories 12.1–12.3 completed with all acceptance criteria verified
- [ ] All stories 12.4–12.5 completed with all acceptance criteria verified
- [ ] `npm run typecheck` passes
- [ ] `npm run test:run` passes — all new and existing Vitest tests green
- [ ] `npm run lint` passes
- [x] Item prices visible on Item Configuration screens below star ratings
- [x] Empty container price visible at the checkbox, matching selected subkit size
- [x] Summary page item rows show prices and line totals alongside quantities
- [ ] Subkit subtotal indicator visible on Item Configuration screens, updating live as items/containers change
- [ ] Subkit subtotal line visible at the bottom of each SubkitSummarySection on Summary and Order Confirmation screens
- [ ] No regression in any Phase 2, Phase 2.5, or Phase 2.6 feature

---
