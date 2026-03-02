# 12. Phase 2 Extension Points

All Phase 2 features are **designed for** in this architecture without being implemented in MVP. No stubs or placeholder components are required — the extension paths are purely additive.

| Feature | Extension Path | What Changes |
|---------|---------------|-------------|
| **`onSlotClick` — clickable visualizer** | `HousingUnitVisualizer` already accepts `onSlotClick?: (slotIndex: number) => void`. Each `VisualizerSlot` has `data-slot-index` attribute. In Phase 2: pass a handler from `SubkitSelectionScreen` and add visual affordance (cursor pointer, hover state) to slots. No component rebuild required. | Handler wired, no visual affordance in MVP |
| **localStorage state persistence** | Add Zustand `persist` middleware to `kitStore.ts`. One import, one `create` wrapper change. All selectors and actions unchanged. | `import { persist } from 'zustand/middleware'` + wrap store definition |
| **Weight tracking** | Add `weightGrams` field to `KitItem` in `kitItems.ts`. Add `calculateTotalWeight()` pure function in `slotCalculations.ts`. Display in `SummaryScreen`. No state layer changes. | Data field + utility function + display component |
| **Product photography** | `KitItem.imageSrc` is already defined as `string \| null`. `ImageWithFallback` already handles `null` with the category tint fallback. In Phase 2: populate `imageSrc` in `kitItems.ts`. No component changes. | Data population only |
| **Branded product mapping + pricing** | `KitItem.productId` and `KitItem.pricePlaceholder` already defined. In Phase 2: populate fields, add price display to `ItemCard` and `SubkitSummarySection`. | Data population + display components |
| **E-commerce / checkout** | `ENV.purchaseUrl` is already consumed by the 'Get My Kit' CTA. Phase 2 replaces the static URL with a cart-building API call that receives the serialized kit state. The store's `selectedSubkits` and `itemSelections` are the payload. No routing changes. | API layer + cart serialization utility |
| **Full mobile responsive** | Tailwind breakpoint classes are already used throughout. The `MobileInterstitial` threshold is a single `useMediaQuery` hook value. In Phase 2: remove the 768px redirect, implement mobile-specific layouts per breakpoint. | Remove interstitial guard + add mobile layout variants |
| **Bazaarvoice reviews integration** | No architectural impact. Will be a new route or modal, consuming an external script. Add to `AppShell` script loading. | New route/component only |
| **Automated E2E (Playwright)** | Add `playwright` to `devDependencies`. Add `tests/e2e/` directory. No changes to application code. | Test tooling only |
| **Analytics** | User behavior tracking formally deferred. Priority metrics to instrument: kit completion rate, subkit selection frequency, item inclusion rates, Summary Page CTA conversion. Recommended tool: Plausible or Google Analytics 4. Add to `AppShell` script loading and `ENV` token file. No application logic changes required. | Script tag + env var only |

---

*Emergency Prep Kit Builder — Frontend Architecture Document | Version 1.0 | 2026-03-02 | Winston, Architect*