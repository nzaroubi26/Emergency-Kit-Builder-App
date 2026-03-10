# 2. Requirements

## Functional Requirements

- **FR1:** The `KitItem` type in `src/types/kit.types.ts` shall be extended with two new nullable fields: `weightGrams: number | null` and `volumeIn3: number | null`. All existing consumers of `KitItem` are unaffected — the fields are additive.
- **FR2:** All 28 items in `src/data/kitItems.ts` shall be populated with researched estimated `weightGrams` and `volumeIn3` values per the lookup table in Story 9.1 AC2. No item shall have a null value for either field in Phase 2.5.
- **FR3:** Two new pure functions shall be added to `src/utils/slotCalculations.ts`: `calculateSubkitWeightLbs` and `calculateSubkitVolumePct`. Both functions shall be side-effect free and covered by unit tests.
- **FR4:** A new `SubkitStatsStrip` component shall be created at `src/components/item-config/SubkitStatsStrip.tsx`. It shall render between the subkit heading/accent bar and the item grid on both `ItemConfigScreen` and `CustomSubkitScreen`.
- **FR5:** `SubkitStatsStrip` shall display estimated subkit weight as `~X.X lbs` (one decimal place, tilde prefix) on the left side of the strip.
- **FR6:** `SubkitStatsStrip` shall display a live volume fill progress bar in the center-right of the strip. The bar fill color uses the current subkit's category base color. The bar fill width is computed as `Math.min(fillPct, 100)` percent. The adjacent label displays the true computed integer value (e.g., `112% filled`) without capping.
- **FR7:** Volume fill percentage shall be computed using the selected subkit's container capacity: Regular = 1,728 in³; Large = 3,456 in³.
- **FR8:** Both values in `SubkitStatsStrip` shall update live within the same render cycle as any item toggle or quantity change — no perceptible lag.
- **FR9:** When a subkit is in empty container state, `SubkitStatsStrip` shall display `~0.0 lbs` and `0% filled` with an empty bar.
- **FR10:** The Summary Page shall display a kit-level stats row at the top of the Kit Summary section showing total kit weight (`~X.X lbs total`) and subkit count (`N subkits configured`).
- **FR11:** Each `SubkitSummarySection` heading row on the Summary Page shall display per-subkit weight and volume inline, right-aligned via `ml-auto`: `~X.X lbs · XX%` followed by a 40px wide × 4px tall mini progress bar in the subkit's category base color.
- **FR12:** Weight and volume stats shall be included in the `@media print` output on the Summary Page — informational metadata useful on a printed kit summary.
- **FR13:** All weight and volume displays are purely informational. There shall be no warnings, no threshold indicators, no color changes, and no error states at any weight or volume value — including values above 100% fill.
- **FR14:** The `HousingUnitVisualizer` component shall receive a new outer visual shell comprising: a `neutral-500` (`#6B7280`) outer frame wrapping the slot grid; a centered handle tab at the top of the outer frame (48px wide × 14px tall, `neutral-500` fill, `radius-sm` top corners); and two rectangular wheel guards at the bottom corners (each 18px wide × 22px tall, `neutral-600` (`#4B5563`) fill, `radius-sm` outer corners, square inner corners, flush with the frame base).
- **FR15:** The `HousingUnitVisualizer` props interface (`slots`, `readOnly`, `onSlotClick`) and the `SlotState` data model shall remain entirely unchanged.
- **FR16:** The exterior redesign shall apply to both the interactive variant (on `SubkitSelectionScreen`) and the read-only variant (on `SummaryScreen`). All existing slot behaviors and `readOnly` mode are unaffected.

## Non-Functional Requirements

- **NFR1:** Weight and volume calculations are pure functions in `slotCalculations.ts` only. No new Zustand store fields are added. No new state is introduced anywhere in the state layer.
- **NFR2:** `SubkitStatsStrip` has no internal state. All values are derived from props passed by the parent. The volume bar fill width transition is 150ms with standard cubic-bezier easing per the existing animation token system.
- **NFR3:** The two new pure functions in `slotCalculations.ts` shall be covered by unit tests in `tests/unit/slotCalculations.test.ts` alongside the existing tests, which must continue to pass without modification.
- **NFR4:** No new routes, no Zustand store shape changes, and no new environment variables are introduced in Phase 2.5.
- **NFR5:** All Phase 2.5 components and functions shall conform to the coding standards in `docs/architecture.md` Section 11 without exception.
- **NFR6:** `SubkitStatsStrip` shall carry `aria-label` on its container and the volume bar track shall carry `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, and `aria-label` attributes per the UX spec Section 5 SubkitStatsStrip accessibility spec.
- **NFR7:** The outer frame, handle tab, and wheel guards added to `HousingUnitVisualizer` shall use only `div` elements and CSS/Tailwind consistent with the existing Tailwind v4 + CSS custom properties pattern. No SVG, no canvas, no new dependencies.

## Compatibility Requirements

- **CR1:** The `HousingUnitVisualizer` props interface is unchanged. The exterior redesign is implemented entirely within the component's interior markup — invisible to any consumer.
- **CR2:** The `SlotState` data model is unchanged. No new fields added.
- **CR3:** The `KitItem` type extension (`weightGrams`, `volumeIn3`) is additive. All existing consumers — `ItemCard`, `StarRating`, `SubkitSummarySection`, `checkoutService.ts`, and all existing tests — are unaffected.
- **CR4:** The Zustand store shape, all selectors, and all store actions are unchanged. `SubkitStatsStrip` consumes only `itemSelections` from the store via `useKitStore` — the same data already consumed by `ItemConfigScreen`.

---
