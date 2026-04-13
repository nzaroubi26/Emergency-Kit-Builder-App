# 6. Epic Details

## Epic 13: MCQ Step & Data Model

**Epic Goal:** Introduce a two-question multi-select MCQ screen as the new entry point to the kit-building flow, capturing emergency type and household composition. Lock the MCQ data model and state persistence so Sprint 2 and Sprint 3 can consume it without rework.

---

### Story 13.1 — MCQ Data Model: Types and State Slice

As a developer,
I want a typed MCQ state slice in the Zustand store persisted to localStorage,
so that MCQ answers are available to all downstream screens and sprints without prop-drilling.

**Acceptance Criteria:**

1. A new Zustand store file `src/store/mcqStore.ts` is created with the following types and shape (per Winston's architecture):
```ts
type EmergencyType = 'flood' | 'tornado' | 'hurricane' | 'tropical-storm'
type HouseholdOption = 'kids' | 'older-adults' | 'disability' | 'pets' | 'none'
type KitPath = 'essentials' | 'custom' | null

interface MCQState {
  emergencyTypes: EmergencyType[]
  householdComposition: HouseholdOption[]
  kitPath: KitPath
}

interface MCQActions {
  setEmergencyTypes: (types: EmergencyType[]) => void
  setHouseholdComposition: (options: HouseholdOption[]) => void
  setKitPath: (path: KitPath) => void
  resetMCQ: () => void
}
```
Types are exported directly from the store file (not `kit.types.ts` — different domain).

2. Store uses `persist` middleware with custom `sessionStorage` adapter. Key: `emergency-mcq-v1`. Initial state: `emergencyTypes: []`, `householdComposition: []`, `kitPath: null`.
3. `kitPath` is excluded from persistence via `partialize` — resets on tab close/refresh.
4. `resetMCQ` sets all fields back to initial values.
5. `tsc --noEmit` passes. All existing tests pass without modification.
6. Unit tests cover: `setEmergencyTypes`, `setHouseholdComposition`, `setKitPath`, `resetMCQ`, and persisted state surviving simulated store rehydration (sessionStorage).

**Integration Verification:**
- IV1: `tsc --noEmit` passes.
- IV2: `npm run test:run` passes — all new and existing tests green.
- IV3: Store state is readable from a test component calling `useMCQStore()`.
- IV4: `kitPath` does not survive sessionStorage round-trip (excluded via `partialize`).

---

### Story 13.2 — MCQ Screens: Two Sequential Multi-Select Screens

As a user,
I want to answer two multi-select questions on separate screens about my emergency type and household before building my kit,
so that the app can personalize subkit recommendations for my specific situation.

**Acceptance Criteria:**

1. Two new screens are created: `MCQEmergencyTypeScreen` at `/build` and `MCQHouseholdScreen` at `/build/household`. The "Build My Kit" CTA on the cover page routes to `/build`.
2. Screen 1 (`/build`) displays Q1 "What type of emergency are you prepping for?" with five multi-select tiles: Flood, Tornado, Hurricane, Tropical Storm, Extreme Heat. "Extreme Heat" is disabled, grayed out, non-selectable, with a "Coming Soon" badge.
3. Screen 2 (`/build/household`) displays Q2 "Who will you be caring for?" with five multi-select tiles: Kids, Older Adults, Person with a Disability, Pets, None of the Above. "None of the Above" is visually separated below a divider, full-width, no icon (Sally Decision 18). Selecting it immediately deselects all other Q2 tiles and vice versa.
4. A reusable `MCQTile` component is used for standard tiles. Props: `label`, `icon`, `selected`, `disabled?`, `disabledLabel?`, `onClick`. A separate `MCQNotaTile` component handles "None of the Above" (different visual treatment per Sally's spec).
5. Each screen has its own "Next" CTA, disabled until ≥1 tile is selected on that screen. "None of the Above" satisfies Q2.
6. Screen 1 "Next" saves Q1 selections to the MCQ store and navigates to `/build/household`. Screen 2 "Next" saves Q2 selections and navigates to `/choose` (fork).
7. Persisted selections (from back-navigation or sessionStorage) are pre-populated on render.
8. Lightweight step indicator ("Step 1 of 2" / "Step 2 of 2") on each MCQ screen. Not the main `StepProgressIndicator` (Sally Decision 22).
9. Route guard on `/build/household` redirects to `/build` if `emergencyTypes` is empty.
10. Accessibility: each question in a `<fieldset>` with `<legend>`. Each tile has `role="checkbox"` and `aria-checked`. Disabled tiles have `aria-disabled="true"`. CTA has `aria-disabled="true"` when inactive. Focus moves to `<h1>` on screen transition.
11. Component tests cover: tile rendering, Q1 toggling, NOTA mutex logic, CTA enable/disable, CTA navigation, persisted state pre-population, route guard redirect, and `axe-core` accessibility assertion.

**Integration Verification:**
- IV1: "Build My Kit" CTA routes to `/build`.
- IV2: Completing Q1 + clicking "Next" saves `emergencyTypes` and navigates to `/build/household`.
- IV3: Completing Q2 + clicking "Next" saves `householdComposition` and navigates to `/choose`.
- IV4: Back-navigating from fork → Q2 → Q1 shows previously selected answers at each step.
- IV5: "Extreme Heat" is non-interactive in all conditions.
- IV6: Direct navigation to `/build/household` without Q1 answers redirects to `/build`.
- IV7: All existing tests pass without modification.

---

## Epic 14: Fork Screen & Essentials Path

**Epic Goal:** Present users with a genuine fork after MCQ — Essentials Kit or Build My Own — deliver the Review & Order shell as the Sprint 1 shippable endpoint for the Essentials path, and wire the full flow end-to-end.

---

### Story 14.1 — Fork Screen: Two Co-Equal Path Cards

As a user,
I want to see two clearly differentiated path options after completing the MCQ,
so that I can choose between a trusted recommended kit and building my own.

**Acceptance Criteria:**

1. A new fork screen is created at `/choose`. Renders after MCQ completion. Route guard redirects to `/build` if MCQ store is empty.
2. Two equal-weight cards displayed side-by-side on desktop (≥768px), stacked on mobile (<768px):

   **Card 1 — "Get The Essentials Kit":** `ShieldCheck` icon, heading, "Recommended for most households" trust badge, body copy ("We've done the research..."), inline `BundlePreview` component showing Power (Large), Cooking (Regular), Medical (Regular), Communications (Regular) with category colors. CTA writes Essentials bundle to kit store, sets `kitPath: 'essentials'`, and routes to `/review`.

   **Card 2 — "Build My Own Kit":** `SlidersHorizontal` icon, heading, body copy ("You know your household best..."), feature list (categories, sizes, items & quantities). CTA sets `kitPath: 'custom'` and routes to `/builder` (existing visualizer).

3. Both cards are visually co-equal: identical dimensions, padding, border radius, elevation, CTA size (Sally Decision 20).
4. Back navigation returns to `/build/household` (MCQ Screen 2).
5. MCQ answers do not change which cards are shown or how they are displayed.
6. Component tests cover: both cards render correctly, bundle preview shows all four subkits with category colors, Card 1 CTA sets `kitPath` and navigates to `/review`, Card 2 CTA sets `kitPath` and navigates to `/builder`, back navigation links to `/build/household`, route guard redirect when MCQ incomplete.

**Integration Verification:**
- IV1: Completing MCQ navigates to fork screen.
- IV2: Card 1 CTA navigates to `/review` with `kitPath === 'essentials'`.
- IV3: Card 2 CTA navigates to `/builder` with `kitPath === 'custom'`.
- IV4: Back navigation returns to MCQ-2 with selections intact.
- IV5: Direct navigation to `/choose` without MCQ answers redirects to `/build`.

---

### Story 14.2 — Review & Order Shell Screen

As a user who chose the Essentials path,
I want to see a review page with my kit summary and delivery options before placing my order,
so that I understand exactly what I'm getting and can choose how to receive it.

**Acceptance Criteria:**

1. A new Review & Order screen is created at `/review`. Route guard redirects to `/choose` if `kitPath` is not set.
2. Kit summary section displays via a `KitSummaryCard` component that branches on `kitPath` prop. In Sprint 1, only the `'essentials'` path is functional — `'custom'` path returns a scaffold placeholder for Sprint 2.
3. Essentials variant of `KitSummaryCard` reads from `ESSENTIALS_BUNDLE` constant in `essentialsConfig.ts`. Displays all four subkits with category colors, icons, names, sizes, and computed slot count (5 slots).
4. Delivery section with two radio options: "Deliver to my address" (reveals address form: street, city, state, ZIP) and "Pick up at a location" (reveals dropdown with mock locations). "Deliver to my address" is pre-selected by default.
5. "Place Order" CTA navigates to existing `/confirmation` (OrderConfirmationScreen) as a prototype endpoint. No real fulfillment or payment.
6. Back navigation returns to `/choose` (fork screen).
7. Component tests cover: kit summary renders all four subkits with correct data, delivery radio toggle reveals correct fields, "Place Order" CTA navigates to `/confirmation`, back navigation links to `/choose`, route guard redirect when `kitPath` is null.

**Integration Verification:**
- IV1: Selecting "Get The Essentials Kit" on fork screen routes here with kit summary displayed.
- IV2: All four subkits display with correct category colors and icons.
- IV3: Delivery options toggle correctly between address form and pickup dropdown.
- IV4: "Place Order" navigates to existing confirmation screen.
- IV5: Back navigation returns to fork screen.
- IV6: Direct navigation to `/review` without `kitPath` redirects to `/choose`.

---

### Story 14.3 — Essentials Bundle Config, Route Guards, MobileInterstitial Bypass + Full Flow Wiring

As a developer,
I want the Essentials bundle defined as a typed config constant, route guards enforcing sequential flow, MobileInterstitial bypassed for Phase 3 routes, and the full Sprint 1 flow wired end-to-end,
so that the bundle is easy to update, flow integrity is enforced, and mobile users can access Phase 3 screens.

**Acceptance Criteria:**

1. A new file `src/data/essentialsConfig.ts` exports (per Winston's architecture):
```ts
import type { SubkitSize } from '../types';

export interface EssentialsBundleItem {
  subkit: string;      // matches CATEGORIES key
  size: SubkitSize;    // reuses existing SubkitSize
}

export const ESSENTIALS_BUNDLE: EssentialsBundleItem[] = [
  { subkit: 'power',          size: 'large'   },
  { subkit: 'cooking',        size: 'regular' },
  { subkit: 'medical',        size: 'regular' },
  { subkit: 'communications', size: 'regular' },
];
```

2. Four new routes added to the React Router config inside `AppShell` children. No existing routes modified.
3. Three route guards appended to `src/router/guards.ts`: `mcqHouseholdGuard` (Q1 required), `forkGuard` (MCQ complete required), `reviewGuard` (`kitPath` required).
4. `MOBILE_EXEMPT_ROUTES` array added to `AppShell.tsx` — Phase 3 routes bypass `MobileInterstitial`.
5. "Build My Kit" CTA on the cover page updated to route to `/build`. Only modification to an existing screen.
6. `tsc --noEmit` passes. All existing tests pass.
7. Smoke E2E test covers the full Essentials happy path: cover → MCQ-1 → MCQ-2 → fork → Review & Order → Place Order → confirmation.
8. Smoke E2E test covers the Build My Own path: cover → MCQ-1 → MCQ-2 → fork → visualizer.

**Integration Verification:**
- IV1: Full Essentials path navigable end-to-end.
- IV2: Full Build My Own path navigable end-to-end.
- IV3: Back navigation works at every step in both paths.
- IV4: Route guards redirect correctly when MCQ state is incomplete.
- IV5: Phase 3 screens render on mobile viewports (MobileInterstitial bypassed).
- IV6: `ESSENTIALS_BUNDLE` constant consumed by `KitSummaryCard` — no bundle data hardcoded in screen components.

---

### Story 14.4 — Pets Subkit: Catalog Addition *(DEFERRED — moved to Sprint 2)*

> **Note:** This story was in PRD v1.0 but is deferred from Sprint 1 per Winston's architecture exclusions (Section 10): "No `pets` category in `CATEGORIES` yet. The store shape supports it (the `householdComposition` field captures `'pets'`), and the surfacing rules will handle it when the Pets subkit is introduced."
>
> The MCQ data model captures `'pets'` as a `HouseholdOption` value in Sprint 1. The actual `CATEGORIES`/`ITEMS` data addition and visualizer surfacing logic are Sprint 2 scope. Original acceptance criteria preserved below for Sprint 2 planning.

As a developer,
I want the Pets subkit added to the catalog with consistent data shape and minimum viable item content,
so that it is available as a selectable option and surfaced by MCQ-driven logic.

**Acceptance Criteria (Sprint 2):**

1. New entry added to `CATEGORIES` in `kitItems.ts` with key `'pets'`. All existing shape fields populated. Color/tint and icon are James's implementation decision — must be visually distinct from existing 9 categories.
2. Minimum 3 items added to `ITEMS` with `categoryId: 'pets'`. All fields populated including `weightGrams` and `volumeIn3`. Suggested starting point:

| Suggested Name | weightGrams | volumeIn3 | Research Basis |
|---|---|---|---|
| Pet Food Supply | 1134 | 168 | 2.5lb dry kibble + 4 cans wet food; ~10"×7"×2.4" |
| Pet Water & Bowl Kit | 680 | 96 | Collapsible bowl + 1-gallon carrier; ~8"×4"×3" |
| Pet First Aid & Comfort Kit | 454 | 84 | Travel first aid + calming items in zip bag; ~7"×4"×3" |

3. Pets subkit is selectable in the "Build My Own" visualizer and surfaced by MCQ household composition logic.
4. `tsc --noEmit` passes. All existing tests pass.
5. Pets subkit renders correctly in the visualizer with no visual regressions.

---
