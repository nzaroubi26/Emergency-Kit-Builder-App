# Emergency Kit Builder — Phase 3 Sprint 1 PRD

**Prepared by:** John, Product Manager
**Date:** 2026-04-11
**Version:** 1.1
**Status:** Draft — Reconciled with architecture (Winston, 2026-04-13) and front-end spec (Sally, 2026-04-13)

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

*Note: Lighting, Clothing, Comfort, and Custom are deferred candidates for consolidation or retirement. Not Sprint 1 scope. Pets subkit is planned but deferred from Sprint 1 per architecture exclusions — the MCQ data model captures `'pets'` in `householdComposition` to support Sprint 2 surfacing.*

### Sprint 1 Scope

Sprint 1 delivers the decision-making front-end of the new flow:

1. **MCQ Step** — two separate screens (`/build` for emergency type, `/build/household` for household composition) capturing context before kit-building begins
2. **Fork Screen** — two co-equal options: "Get The Essentials Kit" (with inline bundle preview on card) and "Build My Own Kit"
3. **Review & Order Shell** — Essentials CTA on fork card routes directly to `/review` shell screen, built in Sprint 1
4. **MCQ Data Model** — new Zustand store with sessionStorage persistence, including `kitPath` field for fork selection, ready for downstream Sprint 2 and Sprint 3 use

**Out of scope for Sprint 1:**
- Visualizer UI refresh (Sprint 2)
- Build My Own path wiring to `/review` (Sprint 2 — only Essentials path reaches `/review` in Sprint 1)
- Order Confirmation + "Fill Your Kit" CTA (Sprint 2)
- MCQ → subkit surfacing logic in visualizer (Sprint 2)
- Pets subkit catalog addition (deferred — store shape supports `'pets'` in `householdComposition`, but no `CATEGORIES`/`ITEMS` data added in Sprint 1)
- `extreme-heat` emergency type activation (Coming Soon tile only — excluded from type union per YAGNI)
- Amazon product recommendations (Sprint 3)

### Goals and Background Context

#### Goals

- Insert two focused questions before kit-building begins so the app understands the user's emergency context and household composition before making any recommendations
- Give users a genuine fork: a trusted expert-curated Essentials bundle for users who want a fast, confident path, or a custom-build path for users who want control
- Lock the MCQ data model in Sprint 1 so Sprint 2's visualizer surfacing logic and Sprint 3's Amazon recommendations can both consume it without rework
- Capture `'pets'` in the MCQ data model so Sprint 2 can introduce the Pets subkit catalog entry and surfacing logic without store rework

#### Background Context

The current flow drops users directly into subkit selection with no context about their situation. The Phase 3 redesign front-loads two light-touch questions and then forks based on user preference — not based on their answers. MCQ answers inform what the app suggests, but the fork itself is always a user-driven choice.

The Essentials path is positioned as the "trust us" path: expert-curated, speed-optimized, and reassuring. The Build My Own path is the "agency" path for users who want to understand and customize every element. Both are equally valid and must be designed as co-equal options.

This is a prototype — where there is a gap between prototype and production, we default to prototype scope. No real fulfillment backend, no payment processing, and no live Amazon integration are required for Sprint 1.

### Change Log

| Change | Date | Version | Description | Author |
|---|---|---|---|---|
| Initial draft | 2026-04-11 | 1.0 | Phase 3 Sprint 1 PRD — MCQ step, fork screen, Essentials path, MCQ data model | John, PM |
| Reconciliation | 2026-04-13 | 1.1 | Reconciled with locked arch + FE spec decisions: (1) Q2 field → `householdComposition`/`HouseholdOption`, (2) `extreme-heat` removed from type union (YAGNI), (3) Essentials display screen eliminated — bundle preview on fork card → `/review`, (4) Review & Order shell in Sprint 1, (5) MCQ split to two screens `/build` + `/build/household`, (6) Added `kitPath` field and route guards, (7) sessionStorage replaces localStorage for MCQ, (8) Pets subkit deferred per architecture exclusions | John, PM |

---

## 2. Requirements

### Functional Requirements

**MCQ Step**

- **FR1:** Two new MCQ screens shall be inserted into the user flow between the app entry point ("Build My Kit" CTA) and the fork screen. Screen 1 (emergency type) at `/build`, Screen 2 (household composition) at `/build/household`.
- **FR2:** Each MCQ screen presents one multi-select question. Both screens must be completed (or Q2 explicitly skipped via "None of the Above") before the user can proceed to the fork.
- **FR3 — Q1:** "What type of emergency are you prepping for?" — five visual tiles: Flood, Tornado, Hurricane, Tropical Storm, Extreme Heat. "Extreme Heat" renders as a disabled, grayed-out tile with a "Coming Soon" label — non-selectable. Only four values exist in the `EmergencyType` union (`extreme-heat` excluded per YAGNI — added when the tile becomes selectable).
- **FR4 — Q2:** "Who will you be caring for?" — five options: Kids, Older Adults, Person with a Disability, Pets, None of the Above. Selecting "None of the Above" immediately deselects all other Q2 options. Selecting any other Q2 option while "None of the Above" is active immediately deselects it.
- **FR5:** The primary CTA to proceed is disabled until at least one Q1 answer and one Q2 answer are selected. "None of the Above" satisfies the Q2 requirement.
- **FR6:** MCQ answers are stored in a new Zustand store (`mcqStore`) and persisted to sessionStorage under key `emergency-mcq-v1`. The MCQ store is separate from the existing kit store.
- **FR7:** MCQ answers do not determine which fork option is shown. Both options are always displayed.
- **FR8:** MCQ answers do not modify the Essentials Kit bundle contents.

**Fork Screen**

- **FR9:** After completing the MCQ, the user is taken to a fork screen presenting two co-equal options: "Get The Essentials Kit" and "Build My Own Kit."
- **FR10:** Both options are displayed as equal-weight cards. Neither appears visually superior. The "Get The Essentials Kit" option may carry a "Recommended for most households" badge.
- **FR11:** "Get The Essentials Kit" card displays the bundle contents directly on the card: Power (Large), Cooking (Regular), Medical (Regular), Communications (Regular).
- **FR12:** Selecting "Get The Essentials Kit" writes the Essentials bundle to the kit store, sets `kitPath: 'essentials'` in the MCQ store, and routes directly to the Review & Order shell (`/review`). There is no separate Essentials display screen (Sally Decision 19).
- **FR13:** Selecting "Build My Own Kit" sets `kitPath: 'custom'` in the MCQ store and routes to the existing subkit selection screen (`/builder` — current version, no UI refresh yet).
- **FR14:** Back navigation returns the user to the household MCQ screen (`/build/household`) from the fork screen.

**Review & Order Shell**

- **FR15:** A Review & Order shell screen is built at `/review` in Sprint 1. It displays the kit summary (Essentials bundle), a delivery section with address/pickup options, and a "Place Order" CTA.
- **FR16:** The kit summary section uses a `KitSummaryCard` component that branches on `kitPath`. In Sprint 1, only the `'essentials'` path is functional. The `'custom'` path is scaffolded for Sprint 2.
- **FR17:** The "Place Order" CTA navigates to the existing `/confirmation` (OrderConfirmationScreen) as a prototype endpoint. No real fulfillment or payment processing.
- **FR18:** Back navigation returns the user to the fork screen (`/choose`).
- **FR19:** The delivery section offers two radio options: "Deliver to my address" (with address fields) and "Pick up at a location" (with mock location dropdown). Prototype-only — no validation beyond basic field presence.

### Non-Functional Requirements

- **NFR1:** MCQ state (`emergencyTypes: EmergencyType[]`, `householdComposition: HouseholdOption[]`, `kitPath: KitPath`) is stored in a new separate Zustand store (`mcqStore.ts`). The existing kit store shape for `selectedSubkits`, `itemSelections`, and `slotAssignments` is unchanged.
- **NFR2:** MCQ state is persisted to sessionStorage under key `emergency-mcq-v1` via custom Zustand `persist` storage adapter. `kitPath` is excluded from persistence via `partialize` — resets on tab close/refresh.
- **NFR3:** Four new screens each have a dedicated route (`/build`, `/build/household`, `/choose`, `/review`). No existing routes are modified. Route guards enforce sequential progression.
- **NFR4:** All new screens and components conform to the coding standards in `docs/architecture.md` Section 11.
- **NFR5:** All new interactive elements meet WCAG 2.1 AA: keyboard navigable, appropriate ARIA attributes, sufficient color contrast.
- **NFR6:** MCQ tile selection states (selected/deselected/disabled) are visually unambiguous at all supported viewport sizes.
- **NFR7:** Phase 3 Sprint 1 routes bypass the existing `MobileInterstitial` guard via an exemption list in `AppShell.tsx`. These screens are mobile-first.

### Compatibility Requirements

- **CR1:** The existing subkit selection flow (SubkitSelectionScreen → ItemConfigScreen → SummaryScreen) is unchanged. Sprint 1 adds new screens before the fork without modifying any existing screen except the Cover Page CTA route target.
- **CR2:** The existing Zustand kit store shape is unchanged. MCQ state lives in a separate store.
- **CR3:** The existing `CATEGORIES` and `ITEMS` data structures in `kitItems.ts` are not modified in Sprint 1.
- **CR4:** The Essentials bundle is hardcoded via config constant (`ESSENTIALS_BUNDLE` in `essentialsConfig.ts`) in Sprint 1. No dynamic computation.

---

## 3. User Interface Enhancement Goals

### New Screens

| Screen | Route | Description |
|---|---|---|
| MCQ Screen 1 — Emergency Type | `/build` | Q1 multi-select tiles; "Next" CTA to Q2 |
| MCQ Screen 2 — Household | `/build/household` | Q2 multi-select tiles with NOTA mutex; "Next" CTA to fork |
| Fork Screen | `/choose` | Two co-equal path cards; Essentials → `/review`, Build My Own → `/builder` |
| Review & Order Shell | `/review` | Kit summary, delivery options, "Place Order" CTA (prototype) |

*Route names confirmed by Winston (architecture-phase3.md).*

### Modified Screens

The only modification to an existing screen is the "Build My Kit" CTA on the cover/landing page — its route target changes from the visualizer to the new MCQ screen.

### UI Design Principles

**MCQ Screens (two screens, one question each):**
- Each screen displays a single multi-select tile grid. Each tile shows icon + label. Selected state is visually clear with `brand-accent` checkmark. Disabled "Extreme Heat" tile is grayed with "Coming Soon" badge.
- "None of the Above" on Q2 is visually separated below a divider, full-width, no icon, outlined style. Behaves as a mutex with all other Q2 options.
- Per-screen "Next" CTA enabled only when ≥1 tile is selected on that screen.
- Lightweight "Step 1 of 2" / "Step 2 of 2" indicator on MCQ screens only (Sally Decision 22).

**Fork Screen:**
- Two equal-weight cards, side-by-side desktop (≥768px) / stacked mobile (<768px).
- Essentials card shows inline bundle preview (Power L, Cooking R, Medical R, Comms R with category colors) plus "Recommended for most households" trust badge. CTA routes directly to `/review`.
- Build My Own card shows feature description. CTA routes to `/builder`.
- Both cards feel like equally valid, complete choices — enforced by identical dimensions, elevation, and border treatment (Sally Decision 20).

**Review & Order Shell:**
- Kit summary card shows Essentials bundle subkits with category colors, names, sizes, and slot count.
- Delivery section with radio toggle: address form or pickup location dropdown.
- "Place Order" CTA routes to existing `/confirmation` as prototype endpoint.

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
| Framework | React | 18.x | 4 new screens; new MCQTile, ForkCard, KitSummaryCard components |
| Build Tool | Vite | 6.x | No new env vars |
| Styling | Tailwind CSS | v4.x | All new screens; dynamic colors via inline styles |
| State Management | Zustand | 5.x + persist | New MCQ store with sessionStorage; existing kit store unchanged |
| Routing | React Router | 6.4+ | 4 new routes with guards |
| Testing (Unit) | Vitest + RTL | 2.x / 16.x | New component tests for all 4 new screens |
| Testing (E2E) | Playwright | latest | New E2E: MCQ → Fork → Review & Order and MCQ → Fork → Visualizer |
| Deployment | Vercel | — | No new env vars; existing pipeline |

### Integration Approach

- **New routes:** 4 new routes added to the React Router config inside `AppShell` children. No existing routes modified. Route guards enforce sequential progression (see architecture Section 4).
- **MCQ store:** New separate Zustand store (`src/store/mcqStore.ts`). Shape: `{ emergencyTypes: EmergencyType[], householdComposition: HouseholdOption[], kitPath: KitPath }` plus setters and `resetMCQ`. Persisted to sessionStorage under `emergency-mcq-v1`. `kitPath` excluded from persistence via `partialize`.
- **Essentials bundle constant:** `src/data/essentialsConfig.ts` — typed constant using existing `SubkitSize` type. Not hardcoded inline in components.
- **MobileInterstitial bypass:** `MOBILE_EXEMPT_ROUTES` array in `AppShell.tsx` exempts Phase 3 routes from the existing mobile guard. These screens are mobile-first.
- **Entry point wiring:** "Build My Kit" CTA on the cover page routes to `/build` (MCQ Screen 1). This is the only change to an existing screen.

### New Files

- `src/store/mcqStore.ts` — MCQ Zustand store with sessionStorage persistence
- `src/data/essentialsConfig.ts` — `ESSENTIALS_BUNDLE` constant
- `src/components/mcq/MCQEmergencyTypeScreen.tsx` — Q1 screen at `/build`
- `src/components/mcq/MCQHouseholdScreen.tsx` — Q2 screen at `/build/household`
- `src/components/fork/ForkScreen.tsx` — Fork screen at `/choose`
- `src/components/review/ReviewOrderScreen.tsx` — Review & Order screen at `/review`
- `src/components/review/KitSummaryCard.tsx` — Dual-path kit summary component

### Modified Files

- `src/router/index.tsx` — 4 new routes + imports
- `src/router/guards.ts` — 3 new guard functions + `useMCQStore` import
- `src/components/layout/AppShell.tsx` — `MOBILE_EXEMPT_ROUTES` + conditional bypass
- `src/components/cover/CoverScreen.tsx` — CTA `to="/builder"` → `to="/build"`

### Risk Assessment

| Area | Risk | Mitigation |
|---|---|---|
| MCQ state persistence | Low | Separate store, sessionStorage, no kit store collision |
| Entry point route change | Low | Single CTA route update; existing flow untouched downstream |
| MobileInterstitial bypass | Low | Explicit exemption list; no route tree restructure |
| Essentials bundle config | Low | Config file pattern makes it easy to evolve in future sprints |
| Review & Order shell scope | Low | Prototype surface only; no real fulfillment or payment |
| "None of the Above" mutex logic | Medium | Clear spec in FR4 + Sally's spec; requires explicit test coverage |
| Route guards | Low | Three guards appended to existing guards file; extensible for Sprint 2 |

---

## 5. Epic and Story Structure

Two epics, ordered by dependency.

- **Epic 13 — MCQ Step & Data Model:** MCQ types, store, and two MCQ screen UIs. Stories 11.1 → 11.2 are sequentially dependent.
- **Epic 14 — Fork Screen, Review & Order Shell, & Flow Wiring:** Fork screen, Review & Order shell, Essentials bundle config, and full flow wiring.

---

## 6. Epic Details

### Epic 13: MCQ Step & Data Model

**Epic Goal:** Introduce a two-question multi-select MCQ screen as the new entry point to the kit-building flow, capturing emergency type and household composition. Lock the MCQ data model and state persistence so Sprint 2 and Sprint 3 can consume it without rework.

---

#### Story 13.1 — MCQ Data Model: Types and State Slice

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

#### Story 13.2 — MCQ Screens: Two Sequential Multi-Select Screens

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

### Epic 14: Fork Screen & Essentials Path

**Epic Goal:** Present users with a genuine fork after MCQ — Essentials Kit or Build My Own — deliver the Review & Order shell as the Sprint 1 shippable endpoint for the Essentials path, and wire the full flow end-to-end.

---

#### Story 14.1 — Fork Screen: Two Co-Equal Path Cards

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

#### Story 14.2 — Review & Order Shell Screen

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

#### Story 14.3 — Essentials Bundle Config, Route Guards, MobileInterstitial Bypass + Full Flow Wiring

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

#### Story 14.4 — Pets Subkit: Catalog Addition *(DEFERRED — moved to Sprint 2)*

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

## 7. Next Steps

### Status: Architecture and Front-End Spec Complete

Both downstream documents have been delivered and their decisions reconciled into this PRD (v1.1):

- **Architecture:** `docs/architecture-phase3.md` (Winston, 2026-04-13) — MCQ store shape, route architecture, route guards, MobileInterstitial bypass, KitSummaryCard interface, essentialsConfig typing, Sprint 2 forward-look validation.
- **Front-End Spec:** `docs/front-end-spec-phase3.md` (Sally, 2026-04-13) — All four screen wireframes, 8 new components, accessibility requirements, animation specs, responsiveness strategy, copy finalized.

### Next: Shard and Hand Off

1. **Shard this PRD** — Sarah to shard `docs/prd-phase3.md` into `docs/prd-phase3/` with section files and epic/story files matching the existing project pattern.
2. **Stories to James** — Once sharded, stories are validated and handed off for implementation. Story dependency: 11.1 → 11.2 → 12.1 → 12.2. Story 14.3 (wiring) depends on all prior stories. Story 14.4 (Pets) is deferred to Sprint 2.
3. **Sprint 1 summary:** 4 new routes, 1 new Zustand store, 4 new screens, 7+ new components, 1 config constant, 3 route guards, 1 AppShell modification. No existing routes, kit store shape, or screens modified except the cover page CTA.
