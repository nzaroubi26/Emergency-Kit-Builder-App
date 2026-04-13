# Emergency Kit Builder — Phase 3 Sprint 1 PRD

**Prepared by:** John, Product Manager
**Date:** 2026-04-11
**Version:** 1.0
**Status:** Draft

---

## 1. Intro Project Analysis and Context

### Analysis Source

IDE-based analysis using existing project documentation: `docs/prd-phase2.5.md` (v1.0), `docs/architecture-phase2.5.md`, `docs/front-end-spec-phase2.5.md`, and `src/data/kitItems.ts` for current subkit catalog.

### Current Project State

- **Primary Purpose:** A client-side React SPA guiding homeowners through building a personalized emergency preparedness kit mapped to a physical modular storage system.
- **Current Tech Stack:** Vite 6.x + React 18.x + TypeScript 5.x strict + Tailwind CSS v4 + Zustand 5.x + React Router 6.4+ + Vitest + Playwright + Vercel.
- **Architecture Style:** Single-Page Application, fully client-side, no backend, localStorage-persisted state.
- **Deployment:** Static SPA on Vercel with branch preview deployments.
- **Phase 2.5 Status:** Complete. Weight/volume tracking and visualizer exterior redesign all delivered.

### Current Subkit Catalog (10 subkits)

| Subkit | Status | Sizes |
|---|---|---|
| Power | Existing | Regular, Large |
| Lighting | Existing | Regular, Large |
| Communications | Existing | Regular, Large |
| Hygiene | Existing | Regular, Large |
| Cooking | Existing | Regular, Large |
| Medical | Existing | Regular, Large |
| Comfort | Existing | Regular, Large |
| Clothing | Existing | Regular, Large |
| Custom | Existing | Regular, Large |
| **Pets** | **New — added Sprint 1** | **Regular, Large** |

*Note: Lighting, Clothing, Comfort, and Custom are deferred candidates for consolidation or retirement. Not Sprint 1 scope.*

### Sprint 1 Scope

Sprint 1 delivers the decision-making front-end of the new flow:

1. **MCQ Step** — two multi-select questions capturing emergency type and household composition
2. **Fork Screen** — two co-equal options: "Get The Essentials Kit" and "Build My Own Kit"
3. **Essentials Kit Path** — static pre-configured bundle display with CTA placeholder to Review & Order (Sprint 2)
4. **MCQ Data Model** — new state slice and TypeScript types, persisted, ready for downstream Sprint 2 and Sprint 3 use

**Out of scope for Sprint 1:**
- Visualizer UI refresh (Sprint 2)
- Review & Order page (Sprint 2)
- Order Confirmation + "Fill Your Kit" CTA (Sprint 2)
- MCQ → subkit surfacing logic in visualizer (Sprint 2)
- Amazon product recommendations (Sprint 3)

### Goals and Background Context

#### Goals

- Insert two focused questions before kit-building begins so the app understands the user's emergency context and household composition before making any recommendations
- Give users a genuine fork: a trusted expert-curated Essentials bundle for users who want a fast, confident path, or a custom-build path for users who want control
- Lock the MCQ data model in Sprint 1 so Sprint 2's visualizer surfacing logic and Sprint 3's Amazon recommendations can both consume it without rework
- Introduce the Pets subkit to the catalog as a new selectable option (surfacing logic in Sprint 2)

#### Background Context

The current flow drops users directly into subkit selection with no context about their situation. The Phase 3 redesign front-loads two light-touch questions and then forks based on user preference — not based on their answers. MCQ answers inform what the app suggests, but the fork itself is always a user-driven choice.

The Essentials path is positioned as the "trust us" path: expert-curated, speed-optimized, and reassuring. The Build My Own path is the "agency" path for users who want to understand and customize every element. Both are equally valid and must be designed as co-equal options.

This is a prototype — where there is a gap between prototype and production, we default to prototype scope. No real fulfillment backend, no payment processing, and no live Amazon integration are required for Sprint 1.

### Change Log

| Change | Date | Version | Description | Author |
|---|---|---|---|---|
| Initial draft | 2026-04-11 | 1.0 | Phase 3 Sprint 1 PRD — MCQ step, fork screen, Essentials path, MCQ data model | John, PM |

---

## 2. Requirements

### Functional Requirements

**MCQ Step**

- **FR1:** A new MCQ screen shall be inserted into the user flow between the app entry point ("Build My Kit" CTA) and the existing subkit selection screen.
- **FR2:** The MCQ screen shall present two multi-select questions. Both must be answered (or explicitly skipped via "None of the Above") before the user can proceed.
- **FR3 — Q1:** "What type of emergency are you prepping for?" — five options: Flood, Tornado, Hurricane, Tropical Storm, Extreme Heat. "Extreme Heat" renders as a disabled, grayed-out tile with a "Coming Soon" label — non-selectable.
- **FR4 — Q2:** "Who will you be caring for?" — five options: Kids, Older Adults, Person with a Disability, Pets, None of the Above. Selecting "None of the Above" immediately deselects all other Q2 options. Selecting any other Q2 option while "None of the Above" is active immediately deselects it.
- **FR5:** The primary CTA to proceed is disabled until at least one Q1 answer and one Q2 answer are selected. "None of the Above" satisfies the Q2 requirement.
- **FR6:** MCQ answers are stored in the Zustand store and persisted to localStorage alongside existing kit state.
- **FR7:** MCQ answers do not determine which fork option is shown. Both options are always displayed.
- **FR8:** MCQ answers do not modify the Essentials Kit bundle contents.

**Fork Screen**

- **FR9:** After completing the MCQ, the user is taken to a fork screen presenting two co-equal options: "Get The Essentials Kit" and "Build My Own Kit."
- **FR10:** Both options are displayed as equal-weight cards. Neither appears visually superior. The "Get The Essentials Kit" option may carry a "Recommended for most households" badge.
- **FR11:** "Get The Essentials Kit" card displays the bundle contents directly on the card: Power (Large), Cooking (Regular), Medical (Regular), Communications (Regular).
- **FR12:** Selecting "Get The Essentials Kit" routes to the Essentials Kit display screen.
- **FR13:** Selecting "Build My Own Kit" routes to the existing subkit selection screen (visualizer — current version, no UI refresh yet).
- **FR14:** Back navigation returns the user to the MCQ screen from the fork screen.

**Essentials Kit Display Screen**

- **FR15:** Shows the four pre-configured subkits — Power (Large), Cooking (Regular), Medical (Regular), Communications (Regular) — using existing category colors and icons.
- **FR16:** Includes a primary "Review & Order" CTA. For Sprint 1 this routes to a stub/placeholder — Sally and Winston to align on the cleanest stub treatment before Story 12.2 is implemented.
- **FR17:** Back navigation returns the user to the fork screen.
- **FR18:** The Essentials bundle is static in Sprint 1. No MCQ answer influences the contents.

**Pets Subkit**

- **FR19:** A new Pets subkit is added to the catalog in `src/data/kitItems.ts` with Regular and Large size options, following the existing data shape.
- **FR20:** The Pets subkit includes a minimum of 3 items with all fields populated including `weightGrams` and `volumeIn3`.
- **FR21:** The Pets subkit is visually consistent with existing subkits (category color, icon, description). Color and icon are James's implementation decision.
- **FR22:** The Pets subkit is not surfaced or pre-selected by MCQ answers in Sprint 1. MCQ → subkit surfacing is Sprint 2 scope.

### Non-Functional Requirements

- **NFR1:** MCQ state (`emergencyTypes: string[]`, `carersFor: string[]`) is stored as a new named slice in the Zustand store. The existing store shape for `selectedSubkits`, `itemSelections`, and `slotAssignments` is unchanged.
- **NFR2:** MCQ state is persisted to localStorage under a key namespaced separately from existing kit state. Winston to decide on the approach.
- **NFR3:** The MCQ screen, fork screen, and Essentials display screen each have a dedicated route. No existing routes are modified.
- **NFR4:** All new screens and components conform to the coding standards in `docs/architecture.md` Section 11.
- **NFR5:** All new interactive elements meet WCAG 2.1 AA: keyboard navigable, appropriate ARIA attributes, sufficient color contrast.
- **NFR6:** MCQ tile selection states (selected/deselected/disabled) are visually unambiguous at all supported viewport sizes.
- **NFR7:** The Pets subkit addition is fully additive — no existing subkit data, store logic, or component behavior is modified.

### Compatibility Requirements

- **CR1:** The existing subkit selection flow (SubkitSelectionScreen → ItemConfigScreen → SummaryScreen) is unchanged. Sprint 1 adds new screens before the fork without modifying any existing screen.
- **CR2:** The existing Zustand store shape for kit state is unchanged. MCQ state is additive.
- **CR3:** The existing `CATEGORIES` and `ITEMS` data structures in `kitItems.ts` are extended (new Pets entry) but not modified. All existing consumers are unaffected.
- **CR4:** The Essentials bundle is hardcoded via config constant in Sprint 1. No dynamic computation.

---

## 3. User Interface Enhancement Goals

### New Screens

| Screen | Suggested Route | Description |
|---|---|---|
| MCQ Screen | `/build` | Two multi-select questions; "Next" CTA to fork |
| Fork Screen | `/choose` | Two co-equal path cards; routes to Essentials or visualizer |
| Essentials Kit Display | `/essentials` | Static bundle summary; "Review & Order" CTA (stub Sprint 1) |

*Final route names are Winston's architectural decision.*

### Modified Screens

The only modification to an existing screen is the "Build My Kit" CTA on the cover/landing page — its route target changes from the visualizer to the new MCQ screen.

### UI Design Principles

**MCQ Screen:**
- Q1 and Q2 display as multi-select tile grids. Each tile shows icon + label. Selected state is visually clear. Disabled "Extreme Heat" tile is clearly grayed with "Coming Soon" label.
- "None of the Above" behaves as a mutex with all other Q2 options — in both state logic and visually.
- Primary CTA enabled only when ≥1 Q1 and ≥1 Q2 option are selected.

**Fork Screen:**
- Two equal-weight cards, side-by-side desktop / stacked mobile.
- Essentials card shows bundle contents (Power L, Cooking R, Medical R, Comms R) directly on the card using category colors.
- Both cards feel like equally valid, complete choices — not a default vs. alternative.

**Essentials Display Screen:**
- Four subkits shown with names, sizes, category colors, and icons — consistent with existing design system.
- Clear "Review & Order" primary CTA. Back navigation to fork.

### UI Consistency Requirements

- All new screens use the existing Tailwind v4 token system, color palette, and typography scale without exception.
- Dynamic category colors continue to use inline `style` prop per the existing architectural rule.
- Multi-select tiles follow the same visual pattern conventions (border, fill, transition) used elsewhere in the app.

---

## 4. Technical Constraints and Integration Requirements

### Existing Technology Stack

| Category | Technology | Version | Sprint 1 Usage |
|---|---|---|---|
| Language | TypeScript | 5.x strict | All new code; strict: true mandatory |
| Framework | React | 18.x | 3 new screens; new MCQTile component |
| Build Tool | Vite | 6.x | No new env vars |
| Styling | Tailwind CSS | v4.x | All new screens; dynamic colors via inline styles |
| State Management | Zustand | 5.x + persist | New MCQ state slice; existing kit store unchanged |
| Routing | React Router | 6.4+ | 3 new routes |
| Testing (Unit) | Vitest + RTL | 2.x / 16.x | New component tests for all 3 new screens |
| Testing (E2E) | Playwright | latest | New E2E: MCQ → Fork → Essentials and MCQ → Fork → Visualizer |
| Deployment | Vercel | — | No new env vars; existing pipeline |

### Integration Approach

- **New routes:** 3 new routes added to the React Router config. No existing routes modified.
- **MCQ state slice:** New Zustand store (`src/store/mcqStore.ts`) or new slice in existing store — Winston to decide. Shape: `{ emergencyTypes: string[], carersFor: string[], setEmergencyTypes, setCarersFor, resetMCQ }`. Persisted to localStorage.
- **Essentials bundle constant:** Stored in `src/data/essentialsConfig.ts` as a typed constant — not hardcoded inline in the component. Allows the bundle to evolve without a component change.
- **Pets subkit:** New entry in `CATEGORIES` and minimum 3 items in `ITEMS` in `kitItems.ts`. All Phase 2.5 fields (`weightGrams`, `volumeIn3`) populated.
- **Entry point wiring:** "Build My Kit" CTA on the cover page routes to MCQ screen. This is the only change to an existing screen.

### New Files

- `src/store/mcqStore.ts`
- `src/data/essentialsConfig.ts`
- `src/screens/MCQScreen.tsx`
- `src/screens/ForkScreen.tsx`
- `src/screens/EssentialsScreen.tsx`
- `src/components/mcq/MCQTile.tsx`

### Modified Files

- `src/data/kitItems.ts` — Pets category + items
- Router config — 3 new routes
- Cover/landing page component — CTA route updated

### Risk Assessment

| Area | Risk | Mitigation |
|---|---|---|
| MCQ state persistence | Low | Additive new slice; existing kit store untouched |
| Entry point route change | Low | Single CTA route update; existing flow untouched downstream |
| Pets subkit addition | Low | Additive; all existing consumers TypeScript-safe |
| Essentials bundle config | Low | Config file pattern makes it easy to evolve in future sprints |
| Review & Order CTA stub | Low | Sally and Winston to align on stub treatment before Story 12.2 |
| "None of the Above" mutex logic | Medium | Clear spec in FR4; requires explicit test coverage |

---

## 5. Epic and Story Structure

Two epics, ordered by dependency.

- **Epic 11 — MCQ Step & Data Model:** MCQ types, state slice, and MCQ screen UI. Stories 11.1 → 11.2 are sequentially dependent.
- **Epic 12 — Fork Screen & Essentials Path:** Fork screen, Essentials display, flow wiring, and Pets subkit. Story 12.4 (Pets) has no Epic 12 dependency and can run in parallel.

---

## 6. Epic Details

### Epic 11: MCQ Step & Data Model

**Epic Goal:** Introduce a two-question multi-select MCQ screen as the new entry point to the kit-building flow, capturing emergency type and household composition. Lock the MCQ data model and state persistence so Sprint 2 and Sprint 3 can consume it without rework.

---

#### Story 11.1 — MCQ Data Model: Types and State Slice

As a developer,
I want a typed MCQ state slice in the Zustand store persisted to localStorage,
so that MCQ answers are available to all downstream screens and sprints without prop-drilling.

**Acceptance Criteria:**

1. A new TypeScript type `MCQState` is created:
```ts
type EmergencyType = 'flood' | 'tornado' | 'hurricane' | 'tropical-storm' | 'extreme-heat'
type CarerFor = 'kids' | 'older-adults' | 'disability' | 'pets' | 'none'

interface MCQState {
  emergencyTypes: EmergencyType[]
  carersFor: CarerFor[]
  setEmergencyTypes: (types: EmergencyType[]) => void
  setCarersFor: (carers: CarerFor[]) => void
  resetMCQ: () => void
}
```
Location: `src/types/mcq.types.ts` or co-located in the store file — Winston to decide per existing convention.

2. A new Zustand store with `persist` middleware is created for MCQ state. Does not modify the existing kit store. Initial state: `emergencyTypes: []`, `carersFor: []`.
3. MCQ state is persisted to localStorage under a namespaced key to avoid collision with existing kit state.
4. `resetMCQ` sets both arrays back to `[]`.
5. `tsc --noEmit` passes. All existing tests pass without modification.
6. Unit tests cover: `setEmergencyTypes`, `setCarersFor`, `resetMCQ`, and persisted state surviving simulated store rehydration.

**Integration Verification:**
- IV1: `tsc --noEmit` passes.
- IV2: `npm run test:run` passes — all new and existing tests green.
- IV3: Store state is readable from a test component calling `useMCQStore()`.

---

#### Story 11.2 — MCQ Screen: Two Multi-Select Questions

As a user,
I want to answer two multi-select questions about my emergency type and household before building my kit,
so that the app can personalize subkit recommendations for my specific situation.

**Acceptance Criteria:**

1. A new screen is created at the MCQ route. The "Build My Kit" CTA on the cover page routes here instead of directly to the visualizer.
2. The screen displays two clearly labeled questions: Q1 "What type of emergency are you prepping for?" and Q2 "Who will you be caring for?"
3. Q1 renders five multi-select tiles: Flood, Tornado, Hurricane, Tropical Storm, Extreme Heat. "Extreme Heat" is disabled, grayed out, non-selectable, with a "Coming Soon" label.
4. Q2 renders five multi-select tiles: Kids, Older Adults, Person with a Disability, Pets, None of the Above. Selecting "None of the Above" immediately deselects all other Q2 tiles. Selecting any other Q2 tile while "None of the Above" is active immediately deselects it.
5. A reusable `MCQTile` component is used for all tiles. Props: `label`, `icon`, `selected`, `disabled?`, `disabledLabel?`, `onClick`.
6. Primary CTA ("Next") is disabled until ≥1 Q1 and ≥1 Q2 tile are selected. "None of the Above" satisfies Q2.
7. Clicking the CTA saves Q1 + Q2 selections to the MCQ store and navigates to the fork screen.
8. Persisted selections (e.g., from back-navigation) are pre-populated on render.
9. Accessibility: each question group in a `<fieldset>` with `<legend>`. Each tile has `role="checkbox"` and `aria-checked`. Disabled tiles have `aria-disabled="true"`. CTA has `aria-disabled="true"` when inactive.
10. Component tests cover: tile rendering, Q1 toggling, "None of the Above" mutex logic, CTA enable/disable, CTA navigation, persisted state pre-population, and `axe-core` accessibility assertion.

**Integration Verification:**
- IV1: "Build My Kit" CTA routes to MCQ screen.
- IV2: Completing MCQ and clicking CTA saves correct arrays to store and navigates to fork.
- IV3: Back-navigating from fork to MCQ shows previously selected answers.
- IV4: "Extreme Heat" is non-interactive in all conditions.
- IV5: All existing tests pass without modification.

---

### Epic 12: Fork Screen & Essentials Path

**Epic Goal:** Present users with a genuine fork after MCQ — Essentials Kit or Build My Own — deliver the Essentials Kit display screen as the Sprint 1 shippable endpoint, wire the full flow, and add the Pets subkit to the catalog.

---

#### Story 12.1 — Fork Screen: Two Co-Equal Path Cards

As a user,
I want to see two clearly differentiated path options after completing the MCQ,
so that I can choose between a trusted recommended kit and building my own.

**Acceptance Criteria:**

1. A new fork screen is created at the fork route. Renders after MCQ, before Essentials display or visualizer.
2. Two equal-weight cards displayed side-by-side on desktop, stacked on mobile:

   **Card 1 — "Get The Essentials Kit":** Heading, positioning copy (Sally's decision), bundle preview (Power L, Cooking R, Medical R, Comms R with category colors), optional "Recommended for most households" trust badge, CTA routes to Essentials display screen.

   **Card 2 — "Build My Own Kit":** Heading, agency-positioning copy (Sally's decision), CTA routes to existing visualizer.

3. Both cards are visually co-equal: same dimensions, elevation, and border treatment.
4. Back navigation returns to MCQ screen.
5. MCQ answers do not change which cards are shown or how they are displayed.
6. Component tests cover: both cards render correctly, bundle preview shows all four subkits, Card 1 CTA navigates to Essentials route, Card 2 CTA navigates to visualizer route, back navigation links to MCQ route.

**Integration Verification:**
- IV1: Completing MCQ + CTA navigates to fork screen.
- IV2: Card 1 CTA navigates to Essentials display screen.
- IV3: Card 2 CTA navigates to existing visualizer.
- IV4: Back navigation returns to MCQ with selections intact.

---

#### Story 12.2 — Essentials Kit Display Screen

As a user who chose the Essentials path,
I want to see a clear summary of my pre-configured kit before proceeding to review and order,
so that I understand exactly what I'm getting and feel confident in the recommendation.

**Acceptance Criteria:**

1. A new Essentials display screen is created at the Essentials route.
2. Displays all four bundle subkits using existing category colors, icons, names, and sizes — consistent with how subkits are displayed elsewhere in the app.
3. Bundle sourced from `ESSENTIALS_BUNDLE` constant in `essentialsConfig.ts` — not hardcoded inline.
4. Primary "Review & Order" CTA is present and styled. Routes to a stub placeholder for Sprint 1. Sally and Winston to align on stub treatment (minimal placeholder page, toast/modal, or disabled state with tooltip) before this story is implemented.
5. Back navigation returns to fork screen.
6. Component tests cover: all four subkits render with correct names and sizes, CTA is present and routes to stub, back navigation links to fork route, bundle sourced from config constant.

**Integration Verification:**
- IV1: Selecting "Get The Essentials Kit" on fork screen routes here.
- IV2: All four subkits display with correct category colors and icons.
- IV3: Back navigation returns to fork screen.
- IV4: "Review & Order" CTA behaves per agreed stub approach.

---

#### Story 12.3 — Essentials Bundle Config + Full Flow Wiring

As a developer,
I want the Essentials bundle defined as a typed config constant and the full Sprint 1 flow wired end-to-end,
so that the bundle is easy to update in future sprints and the routing chain is complete.

**Acceptance Criteria:**

1. A new file `src/data/essentialsConfig.ts` exports:
```ts
export const ESSENTIALS_BUNDLE: EssentialsBundleItem[] = [
  { subkitId: 'power',         size: 'large'   },
  { subkitId: 'cooking',       size: 'regular' },
  { subkitId: 'medical',       size: 'regular' },
  { subkitId: 'communications', size: 'regular' },
]
```
`EssentialsBundleItem` type: `{ subkitId: string, size: 'regular' | 'large' }`. Winston to decide where the type lives.

2. Three new routes added to the React Router config. No existing routes modified.
3. "Build My Kit" CTA on the cover page updated to route to MCQ screen. Only modification to an existing screen.
4. `tsc --noEmit` passes. All existing tests pass.
5. Smoke E2E test covers the full Essentials happy path: cover → MCQ → fork → Essentials display → stub CTA.
6. Smoke E2E test covers the Build My Own path: cover → MCQ → fork → visualizer.

**Integration Verification:**
- IV1: Full Essentials path navigable end-to-end.
- IV2: Full Build My Own path navigable end-to-end.
- IV3: Back navigation works at every step in both paths.
- IV4: `ESSENTIALS_BUNDLE` constant consumed by `EssentialsScreen` — no bundle data hardcoded in the component.

---

#### Story 12.4 — Pets Subkit: Catalog Addition

As a developer,
I want the Pets subkit added to the catalog with consistent data shape and minimum viable item content,
so that it is available as a selectable option and ready for MCQ-driven surfacing in Sprint 2.

**Acceptance Criteria:**

1. New entry added to `CATEGORIES` in `kitItems.ts` with key `'pets'`. All existing shape fields populated. Color/tint and icon are James's implementation decision — must be visually distinct from existing 9 categories.
2. Minimum 3 items added to `ITEMS` with `categoryId: 'pets'`. All fields populated including `weightGrams` and `volumeIn3`. Suggested starting point:

| Suggested Name | weightGrams | volumeIn3 | Research Basis |
|---|---|---|---|
| Pet Food Supply | 1134 | 168 | 2.5lb dry kibble + 4 cans wet food; ~10"×7"×2.4" |
| Pet Water & Bowl Kit | 680 | 96 | Collapsible bowl + 1-gallon carrier; ~8"×4"×3" |
| Pet First Aid & Comfort Kit | 454 | 84 | Travel first aid + calming items in zip bag; ~7"×4"×3" |

3. Pets subkit is selectable in the existing "Build My Own" visualizer. No surfacing logic or pre-selection in Sprint 1.
4. `tsc --noEmit` passes. All existing tests pass.
5. Pets subkit renders correctly in the visualizer with no visual regressions.

**Integration Verification:**
- IV1: Pets subkit appears in the visualizer alongside existing subkits.
- IV2: Pets subkit is selectable and leads to a functional Item Config screen.
- IV3: All existing subkit tests pass without modification.
- IV4: All 3 Pets items have non-null `weightGrams` and `volumeIn3` values.

---

## 7. Next Steps

### Architect Prompt (Winston)

Winston — Phase 3 Sprint 1 PRD is complete at `docs/prd-phase3.md`. Please review and produce the Sprint 1 architecture document. Key decisions to address:

- **New routes:** Confirm naming and placement for the 3 new routes (MCQ, Fork, Essentials display). Only existing screen change is the cover page CTA route target.
- **MCQ state slice:** New `src/store/mcqStore.ts` or a slice in the existing store — your call. Required shape is in Story 11.1 AC1. Confirm the localStorage key namespacing approach.
- **Essentials bundle config:** Confirm location and typing of `ESSENTIALS_BUNDLE` (`src/data/essentialsConfig.ts` proposed). Confirm where `EssentialsBundleItem` type lives.
- **Review & Order stub:** Align with Sally on the cleanest stub treatment for the "Review & Order" CTA before Story 12.2 is implemented.
- **Pets subkit:** Pure data addition to `kitItems.ts`. No architectural changes required — confirm this assessment.
- **Sprint 1 summary:** 3 new routes, 1 new Zustand store/slice, 3 new screens, 1 new reusable component, 1 config constant, 1 new subkit. No existing routes, store shape, or screens modified except the cover page CTA.

### UX Prompt (Sally)

Sally — Phase 3 Sprint 1 PRD is complete at `docs/prd-phase3.md`. Please produce the Sprint 1 front-end spec. Key decisions to address:

- **MCQ layout:** Same screen (Q1 + Q2 stacked) or sequential screens (one question per screen)? PRD is agnostic — document your decision.
- **MCQTile design:** Selected, unselected, and disabled/coming-soon states. "Extreme Heat" needs a clear "Coming Soon" treatment.
- **"None of the Above" visual treatment:** Needs to feel like a mutex option, not just another multi-select tile.
- **Fork screen:** Two equal-weight cards, desktop side-by-side / mobile stacked. Essentials card shows bundle preview with category colors. Trust badge placement and treatment.
- **Essentials display screen:** How are the four subkits displayed? Cards, list, or other. Align with Winston on the "Review & Order" stub treatment.
- **Copy:** Fork card headings and body copy for both paths, MCQ question text and CTA label, Essentials screen heading.
- **Back navigation:** Consistent back nav pattern across all three new screens.
- **Success criteria reminder:** A new user completes the full Sprint 1 flow (MCQ → fork → either path) in under 5 minutes without guidance.
