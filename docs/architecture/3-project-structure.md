# 3. Project Structure

```
emergency-prep-kit/
├── .github/
│   └── workflows/
│       └── e2e.yml                          # GitHub Actions — Playwright CI runner
├── public/
│   └── favicon.ico
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── tokens/
│   │   ├── design-tokens.ts
│   │   └── env.ts                           # VITE_PURCHASE_URL + VITE_ANALYTICS_ID
│   ├── styles/
│   │   ├── globals.css
│   │   └── print.css
│   ├── types/
│   │   ├── kit.types.ts                     # KitItem extended: rating + reviewCount + weightGrams + volumeIn3 (Phase 2.5)
│   │   ├── visualizer.types.ts
│   │   └── index.ts
│   ├── data/
│   │   ├── kitItems.ts                      # All 28 items: rating + reviewCount + weightGrams + volumeIn3 populated
│   │   ├── itemImages.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── slotCalculations.ts              # Extended (Phase 2.5) — calculateSubkitWeightLbs + calculateSubkitVolumePct appended
│   │   ├── categoryUtils.ts
│   │   └── analytics.ts                     # NEW — GA4 wrapper
│   ├── services/
│   │   └── checkoutService.ts               # NEW — cart serialization + fetch POST
│   ├── store/
│   │   └── kitStore.ts                      # persist middleware added
│   ├── router/
│   │   ├── index.tsx                        # / → CoverScreen; /builder → SubkitSelectionScreen
│   │   └── guards.ts                        # All redirects updated to /builder
│   ├── components/
│   │   ├── cover/
│   │   │   └── CoverScreen.tsx              # NEW — landing page at /
│   │   ├── layout/
│   │   │   ├── AppShell.tsx                 # GA4 script injection; MobileInterstitial retained (Phase 3)
│   │   │   ├── AppHeader.tsx
│   │   │   └── StepProgressIndicator.tsx
│   │   │   ├── MobileInterstitial.tsx       # Unchanged — deferred to Phase 3
│   │   ├── ui/
│   │   │   ├── PrimaryButton.tsx
│   │   │   ├── SecondaryButton.tsx
│   │   │   ├── ConfirmationModal.tsx
│   │   │   ├── ImageWithFallback.tsx
│   │   │   └── StarRating.tsx               # NEW — CSS width-clip stars; aria-label
│   │   ├── visualizer/
│   │   │   ├── HousingUnitVisualizer.tsx    # Unchanged interface; onSlotClick now active; + exterior shell (Phase 2.5)
│   │   │   ├── VisualizerSlot.tsx           # cursor-pointer + hover:brightness-95 on filled
│   │   │   └── SlotFullIndicator.tsx
│   │   ├── subkit-selection/
│   │   │   ├── SubkitSelectionScreen.tsx    # Passes onSlotClick handler
│   │   │   ├── SubkitCard.tsx
│   │   │   └── SizeToggle.tsx
│   │   ├── item-config/
│   │   │   ├── ItemConfigScreen.tsx         # + Fill my kit for me checkbox; + SubkitStatsStrip (Phase 2.5)
│   │   │   ├── CustomSubkitScreen.tsx       # + Fill my kit for me checkbox; + SubkitStatsStrip (Phase 2.5)
│   │   │   ├── SubkitStatsStrip.tsx         # NEW (Phase 2.5) — weight + volume strip; no internal state
│   │   │   ├── ItemCard.tsx                 # + StarRating below name/description
│   │   │   ├── QuantitySelector.tsx
│   │   │   ├── EmptyContainerOption.tsx
│   │   │   ├── CategoryGroupHeader.tsx
│   │   │   └── SubkitProgressIndicator.tsx
│   │   └── summary/
│   │       ├── SummaryScreen.tsx            # CTA → initiateCheckout; loading + error states; + weight/volume stats (Phase 2.5)
│   │       └── SubkitSummarySection.tsx     # No StarRating rendered here
│   └── hooks/
│       ├── useKitStore.ts
│       └── useResponsive.ts             # Unchanged — deferred to Phase 3
├── tests/
│   ├── setup.ts
│   ├── unit/
│   │   ├── slotCalculations.test.ts         # Extended (Phase 2.5) — 8 new cases appended; existing cases untouched
│   │   └── checkoutService.test.ts          # NEW — mocked fetch: success, network fail, non-2xx
│   ├── components/
│   │   ├── HousingUnitVisualizer.test.tsx
│   │   ├── SubkitCard.test.tsx
│   │   ├── ItemCard.test.tsx
│   │   ├── QuantitySelector.test.tsx
│   │   ├── StarRating.test.tsx              # NEW — star fill, aria-label, null-safe
│   │   └── SubkitStatsStrip.test.tsx        # NEW (Phase 2.5) — 6 test cases per Story 9.3 AC10
│   └── e2e/
│       └── kit-builder.spec.ts              # NEW — three Playwright flows
├── playwright.config.ts                     # NEW
├── index.html
├── vite.config.ts
├── vitest.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── .eslintrc.cjs
├── .prettierrc
└── package.json
```

---
