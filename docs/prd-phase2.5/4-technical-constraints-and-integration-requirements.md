# 4. Technical Constraints and Integration Requirements

## Existing Technology Stack

| Category | Current Technology | Version | Phase 2.5 Usage |
|----------|-------------------|---------|------------------|
| Language | TypeScript | 5.x strict | All new code; strict: true mandatory |
| Framework | React | 18.x | `SubkitStatsStrip` as FC<Props> named export |
| Build Tool | Vite | 6.x | No new env vars — no changes needed |
| Styling | Tailwind CSS | v4.x | Dynamic colors via inline styles only |
| State Management | Zustand | 5.x + persist | Unchanged — no new store fields |
| Routing | React Router | 6.4+ | Unchanged — no new routes |
| Testing (Unit) | Vitest + RTL | 2.x / 16.x | New tests in `slotCalculations.test.ts`; new `SubkitStatsStrip.test.tsx` |
| Testing (E2E) | Playwright | latest | Unchanged — no new E2E flows required |
| Deployment | Vercel | — | Unchanged — no new env vars |

## Integration Approach

- **KitItem data extension:** `weightGrams: number | null` and `volumeIn3: number | null` added to `KitItem` in `src/types/kit.types.ts`. All 28 items in `src/data/kitItems.ts` populated per Story 9.1 lookup table. All existing fields and consumers untouched.
- **Calculation functions:** Two new pure functions added to the bottom of `src/utils/slotCalculations.ts`. They accept `items`, `selections`, `subkitId`, and (for volume) `capacityIn3` as arguments. No store imports — purely functional. Existing functions unchanged.
- **SubkitStatsStrip:** New component at `src/components/item-config/SubkitStatsStrip.tsx`. Props are fully computed by the parent (`ItemConfigScreen` or `CustomSubkitScreen`) using the two new calculation functions and the subkit's current size. No internal state, no store dependency.
- **ItemConfigScreen and CustomSubkitScreen:** Both screens import `SubkitStatsStrip` and the two calculation functions. Weight and volume values are derived inline from existing `itemSelections` store data — no new store reads, no new hooks.
- **SummaryScreen:** Total kit weight is the sum of per-subkit weights. Per-subkit weights and volume percentages are computed inline using the same calculation functions. No new store fields.
- **HousingUnitVisualizer:** A wrapper `div.visualizer-outer-shell` is added inside the component's root element, surrounding the existing slot grid. It provides the gray frame (via padding), handle tab (child `div` at top center), and wheel guards (two child `div`s at bottom corners). Exported props interface is unchanged.

## Code Organization and Standards

- **New file:** `src/components/item-config/SubkitStatsStrip.tsx`
- **Modified files:** `src/types/kit.types.ts`, `src/data/kitItems.ts`, `src/utils/slotCalculations.ts`, `src/components/item-config/ItemConfigScreen.tsx`, `src/components/item-config/CustomSubkitScreen.tsx`, `src/components/summary/SummaryScreen.tsx`, `src/components/visualizer/HousingUnitVisualizer.tsx`
- **New test file:** `tests/components/SubkitStatsStrip.test.tsx`
- **Extended test file:** `tests/unit/slotCalculations.test.ts` (new cases appended; existing cases unchanged)
- All 14 critical rules from `docs/architecture.md` Section 11 (10 Phase 1 + 4 Phase 2) apply to all Phase 2.5 code without exception.

## Deployment and Operations

No infrastructure changes. No new environment variables. No new Vercel dashboard configuration. Phase 2.5 deploys via the existing story branch → PR → QA → merge to `main` → Vercel auto-deploy pipeline.

## Risk Assessment and Mitigation

| File / Area | Risk | Mitigation |
|-------------|------|------------|
| `kitItems.ts` — new data fields | Low | Additive fields; all existing consumers TypeScript-safe via nullable fallback |
| `slotCalculations.ts` — new functions | Low | Pure functions; fully unit-tested; no side effects |
| `HousingUnitVisualizer.tsx` — outer shell | Low | CSS/markup only; props interface unchanged; both slot modes tested |
| `SummaryScreen.tsx` — stats row | Low | Derived computation only; no async; no new state |
| Volume bar > 100% | Low | Bar width clamped to `min(pct, 100)%` in render; label shows true value; no warnings path |
| Rollback | None additional | Standard story branch rollback per `docs/architecture.md` Section 1 |

---
