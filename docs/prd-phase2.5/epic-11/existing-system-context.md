# Existing System Context

- **Tech stack:** Vite 6 + React 18 + TypeScript 5 strict + Tailwind CSS v4 + Zustand 5 + React Router 6.4+ + Vitest + lucide-react. No new packages are introduced in this epic.
- **State:** `useKitStore` (Zustand with `persist` middleware, storage key `emergency-kit-v1`) exposes `selectedSubkits: SubkitSelection[]`, `itemSelections: Record<string, ItemSelection>`, `emptyContainers: string[]`, `toggleItem(subkitId, itemId)`, `setItemQuantity(subkitId, itemId, qty)`, and `resetKit()`. Store shape is frozen — zero new fields introduced in this epic.
- **Selection key convention:** Every item inclusion is keyed as `${subkitId}::${item.id}` in `itemSelections`. `ItemSelection` carries `subkitId`, `itemId`, `quantity`, and `included`.
- **KitItem type** (`src/types/kit.types.ts`): already has `pricePlaceholder: number | null` as a Phase 3+ stub field. Phase 2.6 populates this field for all 28 items — no type change required.
- **Routing:** `AppShell` is the root layout element; all screens render as its `<Outlet>`. `useLocation()` is available in AppShell via React Router v6.
- **AppHeader** (`src/components/layout/AppHeader.tsx`): renders inside AppShell above the outlet. Phase 2.6 adds a ShoppingCart icon button with a badge to its top-right area.
- **SummaryScreen CTA** currently calls `initiateCheckout()` from `src/services/checkoutService.ts`. Phase 2.6 replaces that call with `navigate('/confirmation')`. `checkoutService.ts` is not touched.
- **Existing test infrastructure:** Vitest + RTL in `tests/components/`, unit tests in `tests/unit/`. axe-core available via `tests/setup.ts`. Component test files mirror `src/` paths.

---
