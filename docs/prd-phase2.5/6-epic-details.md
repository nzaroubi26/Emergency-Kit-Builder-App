# 6. Epic Details

## Epic 9: Kit Weight & Volume Tracking

**Epic Goal:** Add estimated weight and volume metadata to all 28 kit items and surface this data as live informational readouts — a per-subkit stats strip on the Item Configuration screens and a compact kit-level summary on the Summary Page — giving users a concrete physical sense of what they are building without introducing any warnings, thresholds, or new state.

---

### Story 9.1 — KitItem Data Extension: weightGrams and volumeIn3

As a developer,
I want `KitItem` extended with `weightGrams` and `volumeIn3` fields populated for all 28 items,
so that weight and volume calculations have accurate researched source data to work from.

**Acceptance Criteria:**

1. The `KitItem` interface in `src/types/kit.types.ts` is extended with two new fields added after the existing `reviewCount` field:
   - `weightGrams: number | null` — estimated item weight in grams
   - `volumeIn3: number | null` — estimated item displaced volume in cubic inches
   All existing `KitItem` consumers compile without modification. TypeScript strict mode (`tsc --noEmit`) passes.

2. All 28 items in `src/data/kitItems.ts` are populated with the following researched estimated values. Values are based on real-world product research (typical retail weights and packed dimensions for each item category):

| Item ID | Item Name | weightGrams | volumeIn3 | Research Basis |
|---------|-----------|-------------|-----------|----------------|
| `power-station` | Portable Power Station | 1587 | 120 | ~150Wh lithium station (Anker 521 class); 3.5 lbs; approx 6"×4"×5" packed |
| `power-solar` | Solar Panel | 680 | 108 | 20W foldable panel (Goal Zero Nomad 20 class); 1.5 lbs; folded ~9"×6"×2" |
| `power-cables` | Charging Cables | 227 | 42 | 4-cable USB-C/A set in carry bag; 0.5 lbs; bag ~7"×3"×2" |
| `power-banks` | Power Banks | 227 | 12 | 10,000mAh pocket power bank (Anker PowerCore); 0.5 lbs; ~4"×1"×1" |
| `power-batteries` | Batteries AA/AAA | 454 | 28 | Mixed 20-pack AA/AAA alkaline (Energizer); 1.0 lb; box ~7"×2"×1" |
| `light-matches` | Matches | 113 | 6 | Box of 250 waterproof strike-anywhere; 4 oz; box ~3"×1"×0.75" |
| `light-flashlight` | Flashlights | 227 | 14 | High-lumen LED flashlight (Streamlight ProTac class); 8 oz; ~7"×1.5"×1.5" |
| `light-lantern` | Electric Lanterns | 454 | 96 | Rechargeable 360° lantern (BioLite AlpenGlow 500 class); 1.0 lb; ~6"×4"×4" |
| `light-headlamp` | Headlamp | 113 | 18 | Adjustable LED headlamp with batteries (Petzl Actik class); 4 oz; ~4"×2"×2" |
| `light-candles` | Candles | 340 | 42 | Set of 6 long-burn emergency pillar candles in box; 12 oz; ~7"×3"×2" |
| `light-lighter` | Lighter | 85 | 3 | Windproof refillable lighter (Zippo class); 3 oz; ~2.5"×1"×0.5" |
| `light-string` | String Lights | 170 | 36 | LED battery-powered string lights in bag; 6 oz; ~6"×3"×2" |
| `comms-radio` | Hand Crank Radio | 454 | 42 | NOAA hand crank/solar radio (Midland ER310 class); 1.0 lb; ~7"×3"×2" |
| `comms-walkie` | Walkie Talkies | 340 | 48 | Pair of two-way radios with charger (Motorola T800 class); 12 oz; ~8"×3"×2" |
| `hygiene-dental` | Dental Hygiene Kit | 142 | 36 | Travel toothbrush + toothpaste + floss in pouch; 5 oz; ~6"×3"×2" |
| `hygiene-cups` | Paper Cups | 170 | 60 | Sleeve of 50 disposable 9oz cups; 6 oz; ~5"×4"×3" |
| `hygiene-tp` | Toilet Paper | 340 | 120 | 4-pack compact emergency rolls; 12 oz; ~10"×4"×3" |
| `hygiene-wipes` | Baby Wipes | 454 | 120 | 80-count resealable pack; 1.0 lb; ~8"×5"×3" |
| `hygiene-feminine` | Feminine Hygiene Products | 227 | 60 | Assorted pad/tampon mix in zip bag; 8 oz; ~6"×5"×2" |
| `cook-lifestraw` | Lifestraw | 57 | 10 | LifeStraw Personal filter straw in tube; 2 oz; ~9"×1"×1" |
| `cook-propane` | Propane Tank | 370 | 90 | 1 lb Lindal-valve propane canister (full); 13 oz; ~8"×4"×4" (cylindrical) |
| `cook-stove` | Camping Stove | 454 | 108 | Compact single-burner propane stove with windscreen; 1.0 lb; ~6"×6"×3" |
| `med-first-aid` | First Aid Kit | 1134 | 252 | 200-piece trauma kit in hard case (Surviveware Large class); 2.5 lbs; ~10"×7"×3.6" |
| `med-ice-packs` | Ice Packs | 454 | 56 | 4-pack instant cold compress packs; 1.0 lb; ~7"×4"×2" |
| `comfort-fan` | Portable Fan | 227 | 96 | Battery-powered USB desk fan (foldable); 8 oz; ~8"×4"×3" |
| `comfort-earplugs` | Ear Plugs | 85 | 18 | 50-pair bulk canister of high-NRR foam plugs; 3 oz; ~4"×2"×2" |
| `cloth-ponchos` | Ponchos | 227 | 28 | 2-pack hooded emergency ponchos folded; 8 oz; ~7"×2"×2" |
| `cloth-shoe-covers` | Shoe Covers | 170 | 36 | Pair of heavy-duty waterproof boot covers in bag; 6 oz; ~6"×3"×2" |

3. No item has a `null` value for `weightGrams` or `volumeIn3` in Phase 2.5 — all 28 items are fully populated.
4. TypeScript compilation passes with `tsc --noEmit` in strict mode.
5. All existing unit tests in `tests/unit/slotCalculations.test.ts` and all component tests pass without modification.
6. No changes are made to any other field on any `KitItem` object — `rating`, `reviewCount`, `productId`, `pricePlaceholder`, `imageSrc`, and all other existing fields remain exactly as set in Phase 2.

**Integration Verification:**
- IV1: `tsc --noEmit` passes — all existing consumers of `KitItem` compile without modification.
- IV2: `npm run test:run` passes — all existing Vitest tests pass without modification.
- IV3: Full kit configuration flow (SubkitSelection → ItemConfig → Summary) completes correctly with the extended data shape.

---

### Story 9.2 — Calculation Functions: calculateSubkitWeightLbs and calculateSubkitVolumePct

As a developer,
I want two new pure functions in `slotCalculations.ts` for weight and volume computation,
so that `SubkitStatsStrip` and the Summary Page can derive display values without duplicating logic.

**Acceptance Criteria:**

1. The following two pure functions are added to `src/utils/slotCalculations.ts` after the existing exported functions. No existing function in the file is modified:

   `calculateSubkitWeightLbs(items: KitItem[], selections: Record<string, ItemSelection>, subkitId: string): number`
   — Returns the total estimated weight in pounds of all selected items in a subkit. Sums `weightGrams × quantity` for each included item, divides by 453.592, returns `parseFloat(result.toFixed(1))`. Returns 0 if no items included. Items with `weightGrams === null` contribute 0 to the sum.

   `calculateSubkitVolumePct(items: KitItem[], selections: Record<string, ItemSelection>, subkitId: string, capacityIn3: number): number`
   — Returns the volume fill percentage as an unclamped integer. Sums `volumeIn3 × quantity` for each included item, divides by `capacityIn3`, multiplies by 100, returns `Math.round(result)`. Returns 0 if no items included or `capacityIn3` is 0. Items with `volumeIn3 === null` contribute 0 to the sum.

2. Both functions use the `${subkitId}::${item.id}` key format to look up item inclusion and quantity — consistent with the existing store key convention.
3. Items whose selection key is absent from `selections` contribute nothing to either sum.
4. Both functions are covered by new test cases appended to `tests/unit/slotCalculations.test.ts`:
   - `calculateSubkitWeightLbs` with all items selected at qty 1 returns correct lbs
   - `calculateSubkitWeightLbs` with mixed quantities returns correct weighted lbs
   - `calculateSubkitWeightLbs` with no items selected returns 0
   - `calculateSubkitWeightLbs` with a null `weightGrams` item skips null gracefully
   - `calculateSubkitVolumePct` with Regular capacity (1,728 in³) returns correct integer
   - `calculateSubkitVolumePct` with Large capacity (3,456 in³) returns correct integer
   - `calculateSubkitVolumePct` with no items returns 0
   - `calculateSubkitVolumePct` over-capacity returns unclamped integer (e.g., 112)
5. All pre-existing tests in `tests/unit/slotCalculations.test.ts` continue to pass.

**Integration Verification:**
- IV1: `npm run test:run` passes — all new and existing tests green.
- IV2: `tsc --noEmit` passes — function signatures are correctly typed.
- IV3: Calling both functions with the real `ITEMS` array from `kitItems.ts` and a sample selections map returns plausible non-zero values for a stocked subkit.

---

### Story 9.3 — SubkitStatsStrip Component

As a user,
I want to see estimated weight and volume fill for my current subkit as I select items,
so that I have a real-time sense of how much I am packing and how full my container is getting.

**Acceptance Criteria:**

1. A new `SubkitStatsStrip` component is created at `src/components/item-config/SubkitStatsStrip.tsx` with the following props interface:
   - `weightLbs: number` — pre-computed by parent via `calculateSubkitWeightLbs`
   - `volumePct: number` — pre-computed by parent via `calculateSubkitVolumePct` (unclamped integer)
   - `categoryColor: string` — category base hex; used for volume bar fill via inline style
   The component has no internal state and no store dependency.

2. The strip renders as a full-width row with:
   - Background: `neutral-100` (`#F3F4F6`)
   - Border radius: `radius-md` (10px)
   - Padding: `py-2 px-3`
   - Bottom margin: `mb-3` (gap before item grid)
   - Layout: `flex items-center justify-between gap-4`

3. Left side — weight label: `~{weightLbs.toFixed(1)} lbs` in `text-caption` (12px/400), `neutral-500` color.

4. Right side — volume group (`flex items-center gap-2`):
   - Bar track: `width: 120px`, `height: 6px`, `neutral-200` background, `radius-full`.
   - Bar fill: category base color via inline `style={{ backgroundColor: categoryColor, width: Math.min(volumePct, 100) + '%' }}`, `radius-full`, `transition: width 150ms cubic-bezier(0.4,0,0.2,1)`.
   - Label: `{volumePct}% filled` in `text-caption`, `neutral-500`. Label shows true unclamped value; bar width is clamped to 100%.

5. Accessibility attributes:
   - Wrapper `div`: `aria-label` = `"Subkit stats — {weightLbs.toFixed(1)} lbs, {volumePct}% of container capacity filled"`
   - Volume bar track: `role="progressbar"`, `aria-valuenow={volumePct}`, `aria-valuemin={0}`, `aria-valuemax={100}`, `aria-label="Container volume"`
   - Note: the plain-English phrase "of container capacity" is sufficient for screen reader context; no numeric capacity value is needed in the ARIA string.

6. `ItemConfigScreen` renders `<SubkitStatsStrip>` between the subkit heading/accent bar and the item grid. It derives `weightLbs` and `volumePct` inline from existing `itemSelections` store data and the current subkit's size. `containerCapacityIn3` is 1,728 for Regular and 3,456 for Large.

7. `CustomSubkitScreen` receives identical `SubkitStatsStrip` treatment. Container capacity is derived from the custom subkit's selected size.

8. In empty container state the parent passes `weightLbs={0}` and `volumePct={0}` — the strip displays `~0.0 lbs` and `0% filled` with an empty bar.

9. Both values update live: because `weightLbs` and `volumePct` are derived inline from `itemSelections` (already subscribed to by the parent), toggling any item or changing any quantity causes an immediate re-render with updated values.

10. A component test `tests/components/SubkitStatsStrip.test.tsx` covers:
    - Correct weight label rendered for `weightLbs={2.3}` → `~2.3 lbs`
    - Correct volume label rendered for `volumePct={48}` → `48% filled`
    - Bar fill width clamped at 100% for `volumePct={112}` while label still shows `112% filled`
    - Correct `aria-label` on wrapper for given weight + pct inputs
    - Correct `aria-valuenow` on bar track
    - `axe-core` accessibility assertion passes

**Integration Verification:**
- IV1: On `ItemConfigScreen`, toggling an item in/out updates weight label and volume bar in the same render frame — no visible lag.
- IV2: Changing item quantity updates both values immediately.
- IV3: Selecting empty container sets both stats to zero (`~0.0 lbs`, `0% filled`, empty bar).
- IV4: `CustomSubkitScreen` shows the strip correctly with items from multiple categories contributing to a single subkit total.
- IV5: All existing `ItemConfigScreen` and `CustomSubkitScreen` tests pass without modification.

---

### Story 9.4 — Summary Page Weight and Volume Readout

As a user,
I want to see total kit weight and per-subkit weight and volume on the Summary Page,
so that I have a complete physical overview of my configured kit before purchasing.

**Acceptance Criteria:**

1. A kit-level stats row is added at the top of the Kit Summary section on `SummaryScreen`, directly above the list of `SubkitSummarySection` components:
   - Background: `neutral-100` pill, `radius-md`, `py-2 px-4`, `mb-4` margin below
   - Layout: `flex items-center gap-3`, `text-caption`, `neutral-500`
   - Total weight: `~{totalKitWeightLbs} lbs total` — one decimal, tilde prefix, "total" suffix; leftmost item
   - Separator: `·` (middle dot) in `neutral-300`, `mx-1`
   - Subkit count: `{nonEmptySubkitCount} subkits configured` — integer count of subkits not in empty container state

2. Total kit weight is computed as the sum of `calculateSubkitWeightLbs()` across all selected subkits. This is inline derived state — no new store fields.

3. Each `SubkitSummarySection` heading row is updated to display per-subkit stats right-aligned via `ml-auto`, appended after the existing category name + size badge:
   - `~{subkitWeightLbs} lbs · {subkitVolumePct}%` in `text-caption`, `neutral-400`
   - A mini volume bar: 40px wide × 4px tall `neutral-200` track with category base color fill (inline style), `radius-full`, `ml-1`, bar width clamped at 100%

4. Subkits in empty container state display `~0.0 lbs · 0%` with an empty mini bar — consistent with non-empty subkits.

5. Weight and volume stats are included in the `@media print` output. No additional print CSS is needed — they are part of the normal DOM and inherit existing print rules.

6. Star ratings are not introduced or affected by this story. `SubkitSummarySection` continues to not render `StarRating` per Phase 2 architecture rule 14.

7. `SummaryScreen` component test is extended with:
   - Kit-level stats row present with correct total weight and subkit count
   - Per-subkit inline stats (`~X.X lbs · XX%`) present in each `SubkitSummarySection` heading
   - Stats row visible in a mocked print snapshot (or verified not hidden by print CSS)

**Integration Verification:**
- IV1: Summary Page renders correctly with kit-level stats row and per-subkit stats for a 3-subkit, 6-subkit, and mixed empty-container configuration.
- IV2: Total weight and per-subkit weights match values computed by `calculateSubkitWeightLbs` in an isolated unit test with the same items data.
- IV3: All existing `SummaryScreen` tests pass without modification.
- IV4: `Get My Kit` CTA, `Edit My Kit`, `Print`, and `Start Over` flows are unaffected.

---

## Epic 10: Visualizer Exterior Redesign

**Epic Goal:** Add a physical exterior visual shell to the Housing Unit Visualizer — gray outer frame, centered handle tab at top, rectangular wheel guards at bottom corners — transforming the bare slot grid into a recognizable representation of the actual storage product, with zero changes to component props, slot behavior, or SlotState data.

---

### Story 10.1 — Housing Unit Visualizer: Outer Frame, Handle Tab, and Wheel Guards

As a user,
I want the Housing Unit Visualizer to look like the actual physical storage unit,
so that I have a clear visual sense of the product I am configuring.

**Acceptance Criteria:**

1. A new wrapper element is added inside `HousingUnitVisualizer.tsx` surrounding the existing slot grid `div`. The `HousingUnitVisualizer` exported props interface (`slots`, `readOnly`, `onSlotClick`) is unchanged. The `SlotState` data model is unchanged. All existing tests for `HousingUnitVisualizer` pass without modification.

2. The outer frame is implemented as a wrapping `div` with:
   - Background: `neutral-500` (`#6B7280`)
   - Border radius: `radius-md` (10px)
   - Padding: `12px` left and right sides, `20px` bottom, `28px` top (extra top clearance for handle tab)
   - The existing slot grid sits inside this frame unchanged.

3. The handle tab is a child `div` positioned at the top-center of the outer frame:
   - Width: 48px; Height: 14px
   - Background: `neutral-500` (`#6B7280`)
   - Border radius: `radius-sm` (6px) on top corners only; 0px on bottom corners
   - Horizontally centered using `mx-auto` or absolute positioning within the outer frame
   - Visually appears to protrude upward from the top edge of the outer frame

4. Two wheel guard `div`s are positioned at the bottom-left and bottom-right of the outer frame:
   - Width: 18px; Height: 22px each
   - Background: `neutral-600` (`#4B5563`)
   - Border radius: `radius-sm` (6px) on outer corners; square (0px) on inner corners (the corner facing inward toward the slot grid)
   - Flush with the base of the outer frame — appear as feet/casters

5. The exterior redesign applies to both the interactive variant (on `SubkitSelectionScreen`) and the `readOnly` variant (on `SummaryScreen`). Both variants render the frame, handle tab, and wheel guards identically.

6. All existing slot behaviors are unaffected:
   - Filled slots on `SubkitSelectionScreen` continue to display `cursor-pointer` and `hover:brightness-95` with `onSlotClick` navigation (Phase 2 Story 7.2)
   - Empty slots remain non-interactive with no cursor change
   - `readOnly` mode on `SummaryScreen` remains fully non-interactive
   - Slot fill animations (Phase 1, animations #1–#3, #9) are unaffected

7. The redesign is compatible with the existing visualizer container card on `SubkitSelectionScreen` (white card, `shadow-2`, `radius-lg`, `neutral-200` border, 16px padding). The outer shell sits inside that container card as before.

8. `HousingUnitVisualizer.test.tsx` is updated with:
   - Test confirming outer frame wrapper element is present in the rendered output
   - Test confirming handle tab element is present
   - Test confirming two wheel guard elements are present
   - All existing tests continue to pass

**Integration Verification:**
- IV1: `SubkitSelectionScreen` renders the visualizer with the new exterior shell. Clicking a filled slot still navigates to the correct `ItemConfigScreen` — clickable slot behavior (Phase 2 Story 7.2) is unaffected.
- IV2: `SummaryScreen` renders the visualizer in `readOnly` mode with the new exterior shell. All slots remain non-interactive.
- IV3: Slot fill/clear animations operate as before inside the outer shell — the shell does not interfere with slot transition animations.
- IV4: `npm run test:run` passes — all new and existing Vitest tests green.

---
