# 5. Epic and Story Structure

**Epic Approach:** Four epics, ordered by dependency.

- **Epic 9** — Kit Weight & Volume Tracking: data extension, calculation functions, `SubkitStatsStrip` component, and Summary Page stats readout. Stories are sequentially dependent (9.1 → 9.2 → 9.3 → 9.4).
- **Epic 10** — Visualizer Exterior Redesign: single self-contained visual shell story. No Epic 9 dependency — can be worked in parallel after Story 9.1 merges.
- **Epic 11** — Cart & Checkout MVP: pricing data, cart calculation functions, cart sidebar, order confirmation. Stories: 11.1 → 11.2 → 11.3 → 11.4.
- **Epic 12** — Inline Pricing Display: surface existing pricing data throughout the kit-building flow — item prices on ItemCard, container price at EmptyContainerOption, item prices with line totals on Summary Page. Depends on Epic 11 (pricing data + calculation functions). See `epic-12-pricing-display.md` for full details.

---
