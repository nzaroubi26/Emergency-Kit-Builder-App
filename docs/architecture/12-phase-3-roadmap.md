# 12. Phase 3+ Roadmap

All items below are **not implemented** in Phase 1 or Phase 2. Extension paths are documented for planning purposes.

| Feature | Extension Path | Phase |
|---------|---------------|-------|
| **Bazaarvoice reviews integration** | `StarRating` component and `ItemCard` integration are data-source agnostic. Phase 3 replaces hardcoded `rating`/`reviewCount` values in `kitItems.ts` with live Bazaarvoice data fetched at build time or runtime. Component is unchanged. | Phase 3 |
| **Branded product mapping + pricing** | `KitItem.productId` and `KitItem.pricePlaceholder` already defined and nullable. Phase 3+: populate fields, add price display to `ItemCard` and `SubkitSummarySection`. No type changes required. | Phase 3 |
| ~~**Weight tracking**~~ | ~~Add `weightGrams: number \| null` field to `KitItem`. Add `calculateTotalWeight()` pure function in `slotCalculations.ts`. Display in `SummaryScreen`. No state layer changes required.~~ | **Delivered in Phase 2.5.** `weightGrams` and `volumeIn3` fields added to `KitItem`; `calculateSubkitWeightLbs` and `calculateSubkitVolumePct` pure functions added to `slotCalculations.ts`; weight and volume readouts on `ItemConfigScreen`, `CustomSubkitScreen`, and `SummaryScreen`. |
| **User profiles + saved kits** | Requires backend introduction. Zustand `persist` already handles local persistence. Phase 3+: add auth layer and cloud sync endpoint. Store shape unchanged. | Phase 3+ |
| **E2E expanded coverage** | Playwright infrastructure in place. Add spec files to `tests/e2e/` for new flows. No config changes. | Ongoing |
| **Checkout API contract finalized** | `checkoutService.ts` is designed behind a typed interface. When the real API spec arrives, update `CheckoutPayload`, `CheckoutResult`, and the `fetch` implementation inside `initiateCheckout` only — `SummaryScreen` is unchanged. | Phase 3 |
| **Full mobile responsiveness** | Remove `MobileInterstitial.tsx` and `useResponsive.ts`. Add mobile layout variants (375px baseline) to all five screens. Enforce WCAG 2.1 AA touch targets (44×44px) on all interactive elements. Single-column subkit card grid on mobile. Ships alongside Bazaarvoice as Phase 3 "trust and reach expansion" package. | Phase 3 |

---

*Emergency Prep Kit Builder — Frontend Architecture Document | Version 2.2 | 2026-03-09 | Winston, Architect / Sarah, PO*