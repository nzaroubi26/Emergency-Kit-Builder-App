# 3. Project Structure

```
emergency-prep-kit/
├── public/
│   └── favicon.ico
├── src/
│   ├── main.tsx                         # Entry — React.StrictMode + RouterProvider
│   ├── App.tsx                           # RouterProvider root
│   ├── tokens/
│   │   └── design-tokens.ts             # Colors, motion — single source of truth from UX spec
│   ├── styles/
│   │   ├── globals.css                   # Tailwind v4 @import, @theme block, CSS custom properties
│   │   └── print.css                     # @media print — imported by SummaryScreen only
│   ├── types/
│   │   ├── kit.types.ts                  # KitCategory, KitItem, SubkitSelection, ItemSelection
│   │   ├── visualizer.types.ts           # SlotState, HousingUnitVisualizerProps
│   │   └── index.ts                      # Barrel export
│   ├── data/
│   │   ├── kitItems.ts                   # All subkit categories + items (corrected per spec)
│   │   └── index.ts                      # Barrel export
│   ├── utils/
│   │   ├── slotCalculations.ts           # Pure functions: calculateSlotState, calculateTotalSlots, canFitSize
│   │   └── categoryUtils.ts              # getCategoryById, getCategoryColor, getCategoryIcon
│   ├── store/
│   │   └── kitStore.ts                   # Zustand store — all kit configuration state + actions
│   ├── router/
│   │   ├── index.tsx                     # createBrowserRouter — routes + loader guards
│   │   └── guards.ts                     # Loader functions for navigation guard logic
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx              # Outlet wrapper — header + mobile interstitial
│   │   │   ├── AppHeader.tsx             # App name + StepProgressIndicator
│   │   │   ├── StepProgressIndicator.tsx # Step 1 / 2 / 3 — informational, not clickable
│   │   │   └── MobileInterstitial.tsx    # Rendered below 768px — not a route
│   │   ├── ui/
│   │   │   ├── PrimaryButton.tsx         # brand-primary CTA; aria-disabled when inactive
│   │   │   ├── SecondaryButton.tsx       # Neutral secondary actions
│   │   │   ├── ConfirmationModal.tsx     # Focus-trapped dialog; Escape = cancel only
│   │   │   └── ImageWithFallback.tsx     # Category tint bg + icon fallback (Phase 2: real images)
│   │   ├── visualizer/
│   │   │   ├── HousingUnitVisualizer.tsx  # Fully props-driven, stateless internally
│   │   │   ├── VisualizerSlot.tsx         # Single slot — all 5 visual states
│   │   │   └── SlotFullIndicator.tsx      # Amber inline indicator below visualizer
│   │   ├── subkit-selection/
│   │   │   ├── SubkitSelectionScreen.tsx  # Screen root — composes S1 components
│   │   │   ├── SubkitCard.tsx             # Category card — default/selected/disabled
│   │   │   └── SizeToggle.tsx             # [Regular][Large] inline toggle; slides in on selection
│   │   ├── item-config/
│   │   │   ├── ItemConfigScreen.tsx       # Standard subkit config screen root
│   │   │   ├── CustomSubkitScreen.tsx     # Custom subkit all-category browser
│   │   │   ├── ItemCard.tsx               # Image + toggle + quantity bar
│   │   │   ├── QuantitySelector.tsx       # [−] [n] [+] min 1, max 10
│   │   │   ├── EmptyContainerOption.tsx   # Checkbox — dims item grid on selection
│   │   │   ├── CategoryGroupHeader.tsx    # Group label in Custom browser
│   │   │   └── SubkitProgressIndicator.tsx  # Progress bar + 'Subkit N of M' label
│   │   └── summary/
│   │       ├── SummaryScreen.tsx          # Screen root — imports print.css
│   │       └── SubkitSummarySection.tsx   # Per-subkit card: color bar + items + empty badge
│   └── hooks/
│       ├── useKitStore.ts                 # Typed Zustand selector hooks
│       └── useResponsive.ts              # useMediaQuery for MobileInterstitial threshold
├── tests/
│   ├── setup.ts
│   ├── unit/
│   │   └── slotCalculations.test.ts
│   └── components/
│       ├── HousingUnitVisualizer.test.tsx
│       ├── SubkitCard.test.tsx
│       ├── ItemCard.test.tsx
│       └── QuantitySelector.test.tsx
├── index.html
├── vite.config.ts
├── vitest.config.ts
├── tailwind.config.ts
├── tsconfig.json                          # strict: true
├── .eslintrc.cjs
├── .prettierrc
└── package.json
```

---
