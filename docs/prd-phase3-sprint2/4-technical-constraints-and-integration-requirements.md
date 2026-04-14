# 4. Technical Constraints and Integration Requirements

## Existing Technology Stack

No new dependencies. Sprint 2 uses the same stack as Sprint 1: Vite 6.x, React 18.x, TypeScript 5.x strict, Tailwind CSS v4, Zustand 5.x, React Router 6.4+, Vitest, Playwright, Vercel.

## Integration Approach

- **Pets subkit:** New entry in `CATEGORIES` and minimum 3 items in `ITEMS` in `kitItems.ts`. All Phase 2.5 fields (`weightGrams`, `volumeIn3`) and pricing fields (`pricePlaceholder`) populated. Pure data addition. `'pets'` added to `STANDARD_CATEGORY_IDS` so Pets items appear in the Custom subkit browser.
- **Elevation logic:** New pure function in `src/utils/elevationRules.ts`. Returns `ElevationResult { elevated: Set<string>, q2Elevated: Set<string> }`. SubkitSelectionScreen calls this function and sorts the subkit list accordingly (Q2-elevated first, Q1-only elevated second, non-elevated in catalog order).
- **Visual distinction:** New `ElevationBadge` component. SubkitCard receives an `elevated?: boolean` prop and renders the badge conditionally.
- **KitSummaryCard custom path:** The existing `path === 'custom'` branch in `KitSummaryCard` is implemented. Reads `useKitStore().selectedSubkits` and `useKitStore().itemSelections`. Uses existing `calculateSubkitCartTotal` for subtotals and `calculateTotalSlots` for slot count.
- **Summary → Review wiring:** SummaryScreen's "Get My Kit" CTA calls `useMCQStore.getState().setKitPath('custom')` and navigates to `/review`. `reviewGuard` already passes for `kitPath === 'custom'` (truthy check from Sprint 1).
- **Order Confirmation:** `OrderConfirmationScreen` reads `kitPath` from MCQ store. If `'essentials'`, renders from `ESSENTIALS_BUNDLE` with total computed from `CONTAINER_PRICES`. If `'custom'`, renders from kit store. "Now Let's Fill Your Kit" CTA opens `FillKitStubModal`.
- **Back navigation:** `ReviewOrderScreen` back link is path-aware: `essentials` → `/choose`, `custom` → `/summary`. Derived inline from `kitPath`.

## New Files

| File | Purpose |
|---|---|
| `src/utils/elevationRules.ts` | Pure function: MCQ answers → `ElevationResult` (elevated category ID sets) |
| `src/components/subkit-selection/ElevationBadge.tsx` | Badge pill component for elevated subkits |
| `src/components/subkit-selection/ElevationGroupHeader.tsx` | Section header for elevated group |
| `src/components/confirmation/FillKitStubModal.tsx` | Stub modal for Part 2 bridge CTA |

## Modified Files

| File | Change |
|---|---|
| `src/data/kitItems.ts` | New `pets` category + 3 items + `'pets'` in `STANDARD_CATEGORY_IDS` |
| `src/components/subkit-selection/SubkitSelectionScreen.tsx` | Layout refresh, elevation sorting, visual distinction |
| `src/components/subkit-selection/SubkitCard.tsx` | `elevated` prop, `ElevationBadge` rendering |
| `src/components/review/KitSummaryCard.tsx` | Custom path implementation |
| `src/components/review/ReviewOrderScreen.tsx` | Path-aware `BackLink` |
| `src/components/summary/SummaryScreen.tsx` | "Get My Kit" CTA → `/review` with `kitPath: 'custom'` |
| `src/components/confirmation/OrderConfirmationScreen.tsx` | Dual-path support, "Fill Your Kit" CTA, "Start Over" reset |

## Risk Assessment

| Area | Risk | Mitigation |
|---|---|---|
| Visualizer layout refresh | Medium | Layout-only change; state model untouched. Existing SubkitCard tests may need layout assertions updated |
| Elevation sorting logic | Low | Pure function, independently testable, no side effects |
| Build My Own → /review wiring | Low | `reviewGuard` already supports `kitPath === 'custom'`. Single CTA re-route + `KitSummaryCard` implementation |
| Order Confirmation dual-path | Low | Branching on `kitPath` — same pattern as `KitSummaryCard` |
| Pets subkit data addition | Low | Additive; TypeScript enforces field shape compliance |
| "Fill Your Kit" CTA destination | Low | Stub modal for Sprint 2; Part 2 scope TBD |
