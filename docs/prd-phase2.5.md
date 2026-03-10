# Emergency Prep Kit Builder — Phase 2.5 Brownfield Enhancement PRD

**Prepared by:** John, Product Manager  
**Date:** 2026-03-09  
**Version:** 1.0  
**Status:** Draft — Ready for Architect and PO Review

---

## 1. Intro Project Analysis and Context

### Analysis Source

IDE-based analysis using existing project documentation: `docs/prd-phase2.md` (v1.2), `docs/architecture.md` (v2.1), and `docs/front-end-spec.md` (v1.2).

### Current Project State

- **Primary Purpose:** A client-side React SPA guiding homeowners through building a personalized emergency preparedness kit mapped to a physical modular storage system.
- **Current Tech Stack:** Vite 6.x + React 18.x + TypeScript 5.x strict + Tailwind CSS v4 + Zustand 5.x + React Router 6.4+ + Vitest + Playwright + Vercel.
- **Architecture Style:** Single-Page Application, fully client-side, no backend, localStorage-persisted state (Phase 2).
- **Deployment:** Static SPA on Vercel with branch preview deployments.
- **Phase 2 Status:** All Phase 2 epics (6, 7, 8) delivered and complete. localStorage persistence, analytics, E2E suite, cover page, Fill my kit for me, clickable visualizer slots, hardcoded star ratings, and e-commerce checkout are all live.

### Available Documentation

- ✅ Tech Stack Documentation (`docs/architecture.md` Section 2)
- ✅ Source Tree / Architecture (`docs/architecture.md` Section 3)
- ✅ Coding Standards (`docs/architecture.md` Sections 4 and 11)
- ✅ Phase 3+ Roadmap (`docs/architecture.md` Section 12) — weight tracking listed as Phase 3 extension point; pulled forward to Phase 2.5
- ✅ Phase 2 PRD (`docs/prd-phase2.md`)
- ✅ UX Specification v1.2 (`docs/front-end-spec.md`) — Decisions Log entries 12–14 and Phase 2.5 screen specs are the primary UX authority for this PRD

### Enhancement Scope Definition

**Enhancement Type:** New Feature Addition — two new data fields, two new pure calculation functions, one new component, one visual redesign.

**Enhancement Description:** Phase 2.5 adds three tightly scoped features to the completed Phase 2 application: (1) weight tracking, surfacing estimated item weights as a live per-subkit lbs readout on the Item Configuration screen and a total kit weight readout on the Summary Page; (2) volume tracking, surfacing estimated item volumes as a live percentage-filled progress bar per subkit on the Item Configuration screen and a compact per-subkit readout on the Summary Page; and (3) a visual exterior redesign of the Housing Unit Visualizer — a cosmetic-only update adding a gray outer frame, centered handle tab, and rectangular wheel guards with zero changes to the component's props interface or the SlotState data model. All three features are purely informational and additive. No warnings, no thresholds, no new routes, no store shape changes, no new env vars.

**Impact Assessment:** Minimal Impact. Two new nullable fields on `KitItem`, two new pure functions in `slotCalculations.ts`, one new `SubkitStatsStrip` component, targeted additions to `ItemConfigScreen`, `CustomSubkitScreen`, and `SummaryScreen`, and a cosmetic wrapper change inside `HousingUnitVisualizer`. Phase 2 is the stable foundation — Phase 2.5 builds cleanly on top.

### Goals and Background Context

#### Goals

- Give users a concrete sense of their kit's physical footprint before purchase by surfacing estimated weight per subkit and for the total kit
- Help users understand how efficiently they are using each storage container via a live volume-fill progress bar, supporting more intentional item selection
- Elevate the realism and product identity of the Housing Unit Visualizer by adding a physical exterior shell — frame, handle, and wheels — that mirrors the actual product's appearance
- Deliver all three features as zero-risk additive changes: no existing functionality altered, no store shape changes, no new routes

#### Background Context

Phase 2 activated the commercial layer of the kit builder. Phase 2.5 enriches the configuration experience with two categories of informational metadata — weight and volume — that give users a more grounded, physical understanding of what they are building. Both features were noted as Phase 3 extension points in `docs/architecture.md` Section 12 and are now pulled forward as a focused Phase 2.5 release ahead of the larger Phase 3 Bazaarvoice and mobile work package.

The visualizer exterior redesign addresses outstanding product design feedback: the current visualizer renders as a bare grid with no outer context. Adding the frame, handle tab, and wheel guards transforms it into a recognizable representation of the actual physical storage unit, strengthening the product's visual identity without touching any functional code.

All Phase 2.5 work respects the hard constraints established in the Phase 2 architecture: additive only, no store shape changes, no new routes, no new env vars.

### Change Log

| Change | Date | Version | Description | Author |
|--------|------|---------|-------------|--------|
| Initial draft | 2026-03-09 | 1.0 | Phase 2.5 PRD created from front-end-spec.md v1.2 Decisions Log entries 12–14 and architecture.md Phase 3 extension points | John, PM |

---

## 2. Requirements

### Functional Requirements

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

### Non-Functional Requirements

- **NFR1:** Weight and volume calculations are pure functions in `slotCalculations.ts` only. No new Zustand store fields are added. No new state is introduced anywhere in the state layer.
- **NFR2:** `SubkitStatsStrip` has no internal state. All values are derived from props passed by the parent. The volume bar fill width transition is 150ms with standard cubic-bezier easing per the existing animation token system.
- **NFR3:** The two new pure functions in `slotCalculations.ts` shall be covered by unit tests in `tests/unit/slotCalculations.test.ts` alongside the existing tests, which must continue to pass without modification.
- **NFR4:** No new routes, no Zustand store shape changes, and no new environment variables are introduced in Phase 2.5.
- **NFR5:** All Phase 2.5 components and functions shall conform to the coding standards in `docs/architecture.md` Section 11 without exception.
- **NFR6:** `SubkitStatsStrip` shall carry `aria-label` on its container and the volume bar track shall carry `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, and `aria-label` attributes per the UX spec Section 5 SubkitStatsStrip accessibility spec.
- **NFR7:** The outer frame, handle tab, and wheel guards added to `HousingUnitVisualizer` shall use only `div` elements and CSS/Tailwind consistent with the existing Tailwind v4 + CSS custom properties pattern. No SVG, no canvas, no new dependencies.

### Compatibility Requirements

- **CR1:** The `HousingUnitVisualizer` props interface is unchanged. The exterior redesign is implemented entirely within the component's interior markup — invisible to any consumer.
- **CR2:** The `SlotState` data model is unchanged. No new fields added.
- **CR3:** The `KitItem` type extension (`weightGrams`, `volumeIn3`) is additive. All existing consumers — `ItemCard`, `StarRating`, `SubkitSummarySection`, `checkoutService.ts`, and all existing tests — are unaffected.
- **CR4:** The Zustand store shape, all selectors, and all store actions are unchanged. `SubkitStatsStrip` consumes only `itemSelections` from the store via `useKitStore` — the same data already consumed by `ItemConfigScreen`.

---

## 3. User Interface Enhancement Goals

### Integration with Existing UI

All Phase 2.5 additions use the existing design token system, Tailwind v4 utility class patterns, and the category color system. `SubkitStatsStrip` uses `neutral-100` background, `neutral-500` text, and the subkit's category base color for the volume bar — all already defined tokens. The visualizer exterior uses `neutral-500` and `neutral-600` — both already in the token set. No new design system primitives are required. Dynamic category colors continue to use inline `style` prop per the existing architectural rule.

### Modified / New Screens and Views

| Screen | Change Type | Description |
|--------|------------|-------------|
| Item Configuration (`/configure/:subkitId`) | Modified | Add `SubkitStatsStrip` between subkit heading and item grid |
| Custom Subkit Screen (`/configure/custom`) | Modified | Add `SubkitStatsStrip` between subkit heading and item grid |
| Summary Page (`/summary`) | Modified | Add kit-level stats row above subkit list; add per-subkit inline weight/volume to each `SubkitSummarySection` heading |
| Housing Unit Visualizer (component, all screens) | Modified | Add outer frame, handle tab, and wheel guards — cosmetic shell only |

### UI Consistency Requirements

- `SubkitStatsStrip` strip container uses `neutral-100` background and `radius-md` (10px) — consistent with secondary background patterns throughout the app.
- Weight label and volume label use `text-caption` (12px / 400) in `neutral-500` — matching existing `text-caption` usage for slot counters and sub-labels.
- Volume bar fill uses the subkit's category base color — consistent with how category colors are applied to progress bars, card borders, and slot fills throughout the app.
- The kit-level stats row on the Summary Page uses the same `neutral-100` background pill pattern as `SubkitStatsStrip`.
- Per-subkit inline stats sit in the heading row using `ml-auto` — consistent with existing right-side badge treatment in `SubkitSummarySection`.
- The visualizer outer frame (`neutral-500`) and wheel guards (`neutral-600`) use grays already in the design token system. No new color values introduced.

---

## 4. Technical Constraints and Integration Requirements

### Existing Technology Stack

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

### Integration Approach

- **KitItem data extension:** `weightGrams: number | null` and `volumeIn3: number | null` added to `KitItem` in `src/types/kit.types.ts`. All 28 items in `src/data/kitItems.ts` populated per Story 9.1 lookup table. All existing fields and consumers untouched.
- **Calculation functions:** Two new pure functions added to the bottom of `src/utils/slotCalculations.ts`. They accept `items`, `selections`, `subkitId`, and (for volume) `capacityIn3` as arguments. No store imports — purely functional. Existing functions unchanged.
- **SubkitStatsStrip:** New component at `src/components/item-config/SubkitStatsStrip.tsx`. Props are fully computed by the parent (`ItemConfigScreen` or `CustomSubkitScreen`) using the two new calculation functions and the subkit's current size. No internal state, no store dependency.
- **ItemConfigScreen and CustomSubkitScreen:** Both screens import `SubkitStatsStrip` and the two calculation functions. Weight and volume values are derived inline from existing `itemSelections` store data — no new store reads, no new hooks.
- **SummaryScreen:** Total kit weight is the sum of per-subkit weights. Per-subkit weights and volume percentages are computed inline using the same calculation functions. No new store fields.
- **HousingUnitVisualizer:** A wrapper `div.visualizer-outer-shell` is added inside the component's root element, surrounding the existing slot grid. It provides the gray frame (via padding), handle tab (child `div` at top center), and wheel guards (two child `div`s at bottom corners). Exported props interface is unchanged.

### Code Organization and Standards

- **New file:** `src/components/item-config/SubkitStatsStrip.tsx`
- **Modified files:** `src/types/kit.types.ts`, `src/data/kitItems.ts`, `src/utils/slotCalculations.ts`, `src/components/item-config/ItemConfigScreen.tsx`, `src/components/item-config/CustomSubkitScreen.tsx`, `src/components/summary/SummaryScreen.tsx`, `src/components/visualizer/HousingUnitVisualizer.tsx`
- **New test file:** `tests/components/SubkitStatsStrip.test.tsx`
- **Extended test file:** `tests/unit/slotCalculations.test.ts` (new cases appended; existing cases unchanged)
- All 14 critical rules from `docs/architecture.md` Section 11 (10 Phase 1 + 4 Phase 2) apply to all Phase 2.5 code without exception.

### Deployment and Operations

No infrastructure changes. No new environment variables. No new Vercel dashboard configuration. Phase 2.5 deploys via the existing story branch → PR → QA → merge to `main` → Vercel auto-deploy pipeline.

### Risk Assessment and Mitigation

| File / Area | Risk | Mitigation |
|-------------|------|------------|
| `kitItems.ts` — new data fields | Low | Additive fields; all existing consumers TypeScript-safe via nullable fallback |
| `slotCalculations.ts` — new functions | Low | Pure functions; fully unit-tested; no side effects |
| `HousingUnitVisualizer.tsx` — outer shell | Low | CSS/markup only; props interface unchanged; both slot modes tested |
| `SummaryScreen.tsx` — stats row | Low | Derived computation only; no async; no new state |
| Volume bar > 100% | Low | Bar width clamped to `min(pct, 100)%` in render; label shows true value; no warnings path |
| Rollback | None additional | Standard story branch rollback per `docs/architecture.md` Section 1 |

---

## 5. Epic and Story Structure

**Epic Approach:** Two epics, ordered by dependency.

- **Epic 9** — Kit Weight & Volume Tracking: data extension, calculation functions, `SubkitStatsStrip` component, and Summary Page stats readout. Stories are sequentially dependent (9.1 → 9.2 → 9.3 → 9.4).
- **Epic 10** — Visualizer Exterior Redesign: single self-contained visual shell story. No Epic 9 dependency — can be worked in parallel after Story 9.1 merges.

---

## 6. Epic Details

### Epic 9: Kit Weight & Volume Tracking

**Epic Goal:** Add estimated weight and volume metadata to all 28 kit items and surface this data as live informational readouts — a per-subkit stats strip on the Item Configuration screens and a compact kit-level summary on the Summary Page — giving users a concrete physical sense of what they are building without introducing any warnings, thresholds, or new state.

---

#### Story 9.1 — KitItem Data Extension: weightGrams and volumeIn3

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

#### Story 9.2 — Calculation Functions: calculateSubkitWeightLbs and calculateSubkitVolumePct

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

#### Story 9.3 — SubkitStatsStrip Component

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

#### Story 9.4 — Summary Page Weight and Volume Readout

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

### Epic 10: Visualizer Exterior Redesign

**Epic Goal:** Add a physical exterior visual shell to the Housing Unit Visualizer — gray outer frame, centered handle tab at top, rectangular wheel guards at bottom corners — transforming the bare slot grid into a recognizable representation of the actual storage product, with zero changes to component props, slot behavior, or SlotState data.

---

#### Story 10.1 — Housing Unit Visualizer: Outer Frame, Handle Tab, and Wheel Guards

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

## 7. Next Steps

### Architect Prompt

Winston — the Phase 2.5 Enhancement PRD is complete and saved as `docs/prd-phase2.5.md`. Please review and update the architecture document as needed. Key Phase 2.5 architecture notes:

- **KitItem data extension:** Two new nullable fields (`weightGrams`, `volumeIn3`) added to `KitItem` in `src/types/kit.types.ts`. Only `src/data/kitItems.ts` requires data population — all existing consumers are unaffected.
- **slotCalculations.ts additions:** Two new pure functions (`calculateSubkitWeightLbs`, `calculateSubkitVolumePct`) appended to the existing file. No existing functions touched. Both accept `(items, selections, subkitId)` plus capacity for volume. Both return numbers, not strings.
- **SubkitStatsStrip:** New component at `src/components/item-config/SubkitStatsStrip.tsx`. Purely presentational with no internal state. All computation done by parent. Props: `weightLbs`, `volumePct`, `containerCapacityIn3`, `categoryColor`. Volume bar fill uses inline style for `backgroundColor` per the dynamic category color architectural rule.
- **HousingUnitVisualizer exterior:** Wrapper `div.visualizer-outer-shell` inside the component's root element, surrounding the existing slot grid. Uses only `div` children (handle tab, wheel guards). Handle tab uses `rounded-t-sm` (or manual border-radius for top corners only). Wheel guards use `rounded-br-sm rounded-bl-sm` variant (outer corners rounded, inner corners square) — this may require explicit `border-radius` inline styles rather than Tailwind classes for asymmetric corner radius. Props interface unchanged.
- **SummaryScreen:** Derive per-subkit stats inline. No new store fields or hooks. All stats are derived from existing `selectedSubkits` and `itemSelections` via the two new calculation functions.
- **Phase 2.5 adds zero new env vars and zero new routes.** Architecture Section 10 (Environment Configuration) and Section 7 (Routing) require no updates.

### PO Prompt

Sarah — the Phase 2.5 Enhancement PRD is complete and saved as `docs/prd-phase2.5.md`. Please validate using the PO Master Checklist. Key areas to watch:

- **Story sequencing (Epic 9):** Story 9.1 (data extension) must merge before 9.2 (calculation functions), which must merge before 9.3 (SubkitStatsStrip), which must merge before 9.4 (Summary readout). This dependency chain is intentional — confirm the sequence is clearly understood.
- **Epic 10 independence:** Story 10.1 (visualizer redesign) has no Epic 9 dependency and can be worked in parallel by a second developer after Story 9.1 merges. Confirm the PO backlog reflects this parallelism.
- **The 28-item lookup table (Story 9.1 AC2):** This is the single most important content deliverable in Phase 2.5. Confirm the dev agent has clear, unambiguous instruction to use the exact `weightGrams` and `volumeIn3` values from the PRD table — no estimates or approximations beyond what is already documented.
- **No warnings, ever:** FR13 is an absolute constraint — confirm there is no AC in any story that could be misread as triggering a warning or color change at any volume or weight level. The word "purely informational" should be unambiguous.
- **Compatibility requirements:** CR1–CR4 confirm that `HousingUnitVisualizer` interface, `SlotState` model, Zustand store shape, and all existing `KitItem` consumers remain unchanged. Confirm the dev agent understands these are hard constraints, not preferences.
