# Epic 12: Inline Pricing Display

**Prepared by:** Sarah, Product Owner
**Date:** 2026-03-11
**Version:** 1.0 (PO draft — awaiting user approval)
**Phase:** 2.7 Brownfield Enhancement
**Depends on:** Epic 11 (all stories complete — pricing data and cart calculations already exist)

---

## Epic Goal

Surface per-item and per-container pricing information throughout the kit-building flow — on the Item Configuration screen, next to the Empty Container checkbox, and on the Summary/Review Kit page — so users have continuous cost visibility as they build and review their kit, without needing to open the cart sidebar.

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

---

## Definition of Done

- [ ] All stories completed with all acceptance criteria verified
- [ ] `npm run typecheck` passes
- [ ] `npm run test:run` passes — all new and existing Vitest tests green
- [ ] `npm run lint` passes
- [ ] Item prices visible on Item Configuration screens below star ratings
- [ ] Empty container price visible at the checkbox, matching selected subkit size
- [ ] Summary page item rows show prices and line totals alongside quantities
- [ ] No regression in any Phase 2, Phase 2.5, or Phase 2.6 feature

---
