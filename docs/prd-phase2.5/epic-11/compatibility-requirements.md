# Compatibility Requirements

- **CC1:** `checkoutService.ts` is not modified. Not imported by any new file.
- **CC2:** Zustand store shape is unchanged. No new fields on `KitStore`, `KitItem`, `SubkitSelection`, or `ItemSelection`.
- **CC3:** `CartSidebar` reads `itemSelections`, `selectedSubkits`, and `emptyContainers` and dispatches only `toggleItem` and `setItemQuantity`. No other store actions are dispatched.
- **CC4:** CartSidebar open/closed state is `AppShell` local component state. It is never hoisted into Zustand.
- **CC5:** All 15 existing critical rules in `docs/architecture.md` Section 11 apply to all Phase 2.6 code. Dynamic category colors continue to use `style={{ ... }}` — never Tailwind arbitrary values.
- **CC6:** All Phase 2.5 features (`SubkitStatsStrip`, `visualizer-outer-shell`, weight/volume stats on Summary) are unaffected.

---
