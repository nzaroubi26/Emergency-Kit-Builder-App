# 7. Next Steps

## Architect Prompt

Winston — the Phase 2.5 Enhancement PRD is complete and saved as `docs/prd-phase2.5.md`. Please review and update the architecture document as needed. Key Phase 2.5 architecture notes:

- **KitItem data extension:** Two new nullable fields (`weightGrams`, `volumeIn3`) added to `KitItem` in `src/types/kit.types.ts`. Only `src/data/kitItems.ts` requires data population — all existing consumers are unaffected.
- **slotCalculations.ts additions:** Two new pure functions (`calculateSubkitWeightLbs`, `calculateSubkitVolumePct`) appended to the existing file. No existing functions touched. Both accept `(items, selections, subkitId)` plus capacity for volume. Both return numbers, not strings.
- **SubkitStatsStrip:** New component at `src/components/item-config/SubkitStatsStrip.tsx`. Purely presentational with no internal state. All computation done by parent. Props: `weightLbs`, `volumePct`, `containerCapacityIn3`, `categoryColor`. Volume bar fill uses inline style for `backgroundColor` per the dynamic category color architectural rule.
- **HousingUnitVisualizer exterior:** Wrapper `div.visualizer-outer-shell` inside the component's root element, surrounding the existing slot grid. Uses only `div` children (handle tab, wheel guards). Handle tab uses `rounded-t-sm` (or manual border-radius for top corners only). Wheel guards use `rounded-br-sm rounded-bl-sm` variant (outer corners rounded, inner corners square) — this may require explicit `border-radius` inline styles rather than Tailwind classes for asymmetric corner radius. Props interface unchanged.
- **SummaryScreen:** Derive per-subkit stats inline. No new store fields or hooks. All stats are derived from existing `selectedSubkits` and `itemSelections` via the two new calculation functions.
- **Phase 2.5 adds zero new env vars and zero new routes.** Architecture Section 10 (Environment Configuration) and Section 7 (Routing) require no updates.

## PO Prompt

Sarah — the Phase 2.5 Enhancement PRD is complete and saved as `docs/prd-phase2.5.md`. Please validate using the PO Master Checklist. Key areas to watch:

- **Story sequencing (Epic 9):** Story 9.1 (data extension) must merge before 9.2 (calculation functions), which must merge before 9.3 (SubkitStatsStrip), which must merge before 9.4 (Summary readout). This dependency chain is intentional — confirm the sequence is clearly understood.
- **Epic 10 independence:** Story 10.1 (visualizer redesign) has no Epic 9 dependency and can be worked in parallel by a second developer after Story 9.1 merges. Confirm the PO backlog reflects this parallelism.
- **The 28-item lookup table (Story 9.1 AC2):** This is the single most important content deliverable in Phase 2.5. Confirm the dev agent has clear, unambiguous instruction to use the exact `weightGrams` and `volumeIn3` values from the PRD table — no estimates or approximations beyond what is already documented.
- **No warnings, ever:** FR13 is an absolute constraint — confirm there is no AC in any story that could be misread as triggering a warning or color change at any volume or weight level. The word "purely informational" should be unambiguous.
- **Compatibility requirements:** CR1–CR4 confirm that `HousingUnitVisualizer` interface, `SlotState` model, Zustand store shape, and all existing `KitItem` consumers remain unchanged. Confirm the dev agent understands these are hard constraints, not preferences.
