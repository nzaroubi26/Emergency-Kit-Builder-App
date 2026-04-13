# Phase 3 Sprint 1 — Architecture Brief

> **Author:** Winston, Architect
> **Date:** 2026-04-13
> **Status:** Ready for alignment check
> **Scope:** Data model, store shape, route architecture, component interfaces for four new screens
> **Parallel track:** Sally (UX) — front-end spec complete and validated

---

## Table of Contents

1. [MCQ Store — Shape, Persistence, and Integration](#1-mcq-store--shape-persistence-and-integration)
2. [essentialsConfig.ts — New Config Constant](#2-essentialsconfigts--new-config-constant)
3. [Route Architecture](#3-route-architecture)
4. [Route Guards](#4-route-guards)
5. [MobileInterstitial Exemption](#5-mobileinterstitial-exemption)
6. [KitSummaryCard Component Interface](#6-kitsummarycard-component-interface)
7. [Cover Page CTA Update](#7-cover-page-cta-update)
8. [Sally Coordination Points — Confirmed](#8-sally-coordination-points--confirmed)
9. [New File Inventory](#9-new-file-inventory)
10. [Exclusions — What Is NOT Sprint 1](#10-exclusions--what-is-not-sprint-1)
11. [Sprint 2 Forward-Look Validation](#11-sprint-2-forward-look-validation)

---

## 1. MCQ Store — Shape, Persistence, and Integration

### New File: `src/store/mcqStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type EmergencyType = 'flood' | 'tornado' | 'hurricane' | 'tropical-storm';
export type HouseholdOption = 'kids' | 'older-adults' | 'disability' | 'pets' | 'none';
export type KitPath = 'essentials' | 'custom' | null;

interface MCQState {
  emergencyTypes: EmergencyType[];
  householdComposition: HouseholdOption[];
  kitPath: KitPath;
}

interface MCQActions {
  setEmergencyTypes: (types: EmergencyType[]) => void;
  setHouseholdComposition: (options: HouseholdOption[]) => void;
  setKitPath: (path: KitPath) => void;
  resetMCQ: () => void;
}

type MCQStore = MCQState & MCQActions;

const initial: MCQState = {
  emergencyTypes: [],
  householdComposition: [],
  kitPath: null,
};

export const useMCQStore = create<MCQStore>()(
  persist(
    (set) => ({
      ...initial,
      setEmergencyTypes: (types) => set({ emergencyTypes: types }),
      setHouseholdComposition: (options) => set({ householdComposition: options }),
      setKitPath: (path) => set({ kitPath: path }),
      resetMCQ: () => set({ ...initial }),
    }),
    {
      name: 'emergency-mcq-v1',       // sessionStorage key
      storage: {
        getItem: (name) => {
          const val = sessionStorage.getItem(name);
          return val ? JSON.parse(val) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name);
        },
      },
      partialize: (state) => ({
        emergencyTypes: state.emergencyTypes,
        householdComposition: state.householdComposition,
        // kitPath intentionally excluded — resets on refresh per brief
      }),
    }
  )
);
```

### Design Decisions

1. **Separate store from `kitStore.ts`.** The MCQ data has a completely different lifecycle (session-scoped, no item selections, no slot logic). Merging it into `kitStore` would bloat a store that already has migration logic and localStorage persistence. Separate store = separate `sessionStorage` key, separate persist config, zero risk of collision with the existing `emergency-kit-v1` localStorage entry.

2. **`sessionStorage` via custom `storage` adapter.** Zustand's `persist` defaults to `localStorage`. The brief calls for session-level persistence for Q1/Q2 answers. The custom `storage` object maps to `sessionStorage` — three one-liners. `kitPath` is excluded via `partialize` so it resets on tab close/refresh per the brief.

3. **Type exports are standalone.** `EmergencyType`, `HouseholdOption`, and `KitPath` are exported from `mcqStore.ts` directly. They don't belong in `kit.types.ts` — they're not part of the kit/subkit/item domain. Sally's components import these types from the store file. If we later need them in `types/`, we can re-export — but YAGNI for now.

4. **Sprint 2 readiness.** The `emergencyTypes` and `householdComposition` arrays are plain, typed arrays — trivially consumable by the visualizer elevation logic James will build. No intermediate transformation needed. The surfacing rules can do `useMCQStore.getState().emergencyTypes.includes('flood')` directly.

---

## 2. `essentialsConfig.ts` — New Config Constant

### New File: `src/data/essentialsConfig.ts`

```typescript
import type { SubkitSize } from '../types';

export interface EssentialsBundleItem {
  subkit: string;      // matches CATEGORIES key / categoryId in kitItems.ts
  size: SubkitSize;    // reuses existing SubkitSize = 'regular' | 'large'
}

export const ESSENTIALS_BUNDLE: EssentialsBundleItem[] = [
  { subkit: 'power',          size: 'large'   },
  { subkit: 'cooking',        size: 'regular' },
  { subkit: 'medical',        size: 'regular' },
  { subkit: 'communications', size: 'regular' },
];
```

### Verification Against Existing Data Model

- **Subkit identifiers confirmed.** `'power'`, `'cooking'`, `'medical'`, `'communications'` all exist as keys in `CATEGORIES` (`src/data/kitItems.ts`) and as `categoryId` values across `ITEMS`.
- **`SubkitSize` reused.** The `size` field uses the existing `SubkitSize = 'regular' | 'large'` type from `kit.types.ts`. No new type needed.
- **`subkit` field type.** Uses `string` rather than a narrower union — consistent with existing system which uses `string` for `categoryId` throughout (`KitCategory.id`, `KitItem.categoryId`, `SubkitSelection.categoryId`).

### Slot Count Derivation

Sally's spec shows "5 slots used" on the Review & Order page. The existing `calculateTotalSlots` function (`src/utils/slotCalculations.ts`) already encodes the rule: large = 2 slots, regular = 1 slot.

To derive slot count from `ESSENTIALS_BUNDLE`, `KitSummaryCard` uses the same logic inline:

```typescript
const slotCount = ESSENTIALS_BUNDLE.reduce(
  (sum, item) => sum + (item.size === 'large' ? 2 : 1), 0
);
// → 2 + 1 + 1 + 1 = 5
```

This mirrors the existing slot logic without adding a dependency or changing `slotCalculations.ts`.

---

## 3. Route Architecture

### Updated Router: `src/router/index.tsx`

```typescript
import { createBrowserRouter, redirect } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { CoverScreen } from '../components/cover/CoverScreen';
// Phase 3 screens
import { MCQEmergencyTypeScreen } from '../components/mcq/MCQEmergencyTypeScreen';
import { MCQHouseholdScreen } from '../components/mcq/MCQHouseholdScreen';
import { ForkScreen } from '../components/fork/ForkScreen';
import { ReviewOrderScreen } from '../components/review/ReviewOrderScreen';
// Existing screens
import { SubkitSelectionScreen } from '../components/subkit-selection/SubkitSelectionScreen';
import { ItemConfigScreen } from '../components/item-config/ItemConfigScreen';
import { CustomSubkitScreen } from '../components/item-config/CustomSubkitScreen';
import { SummaryScreen } from '../components/summary/SummaryScreen';
import { OrderConfirmationScreen } from '../components/confirmation/OrderConfirmationScreen';
// Guards
import {
  subkitConfigGuard, customConfigGuard, summaryGuard, confirmationGuard,
  mcqHouseholdGuard, forkGuard, reviewGuard,
} from './guards';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <CoverScreen />,
  },
  {
    element: <AppShell />,
    children: [
      // === Phase 3 routes ===
      { path: '/build',           element: <MCQEmergencyTypeScreen /> },
      { path: '/build/household', element: <MCQHouseholdScreen />, loader: mcqHouseholdGuard },
      { path: '/choose',          element: <ForkScreen />,         loader: forkGuard },
      { path: '/review',          element: <ReviewOrderScreen />,  loader: reviewGuard },
      // === Existing routes (unchanged) ===
      { path: '/builder',              element: <SubkitSelectionScreen /> },
      { path: '/configure/custom',     element: <CustomSubkitScreen />,     loader: customConfigGuard },
      { path: '/configure/:subkitId',  element: <ItemConfigScreen />,       loader: subkitConfigGuard },
      { path: '/summary',              element: <SummaryScreen />,          loader: summaryGuard },
      { path: '/confirmation',         element: <OrderConfirmationScreen />,loader: confirmationGuard },
      { path: '*',                     loader: () => redirect('/') },
    ],
  },
]);
```

### New Routes

| Route | Screen | Guard | Notes |
|-------|--------|-------|-------|
| `/build` | `MCQEmergencyTypeScreen` | None | Phase 3 entry point. New CTA destination from Cover Page |
| `/build/household` | `MCQHouseholdScreen` | `mcqHouseholdGuard` | Requires Q1 completion |
| `/choose` | `ForkScreen` | `forkGuard` | Requires MCQ completion |
| `/review` | `ReviewOrderScreen` | `reviewGuard` | Requires kit path selection |

### Route Name Confirmation

- No collision with existing paths (`/builder`, `/configure/*`, `/summary`, `/confirmation`)
- `/build/household` nests naturally under `/build` — consistent with `/configure/:subkitId` nesting
- `/choose` and `/review` are top-level like `/builder` and `/summary` — appropriate for flow decision points

### Phase 3 Routes Inside `AppShell`

The new routes go inside the `AppShell` children array. This means they get the `AppHeader`, the `CartSidebar`, and the `<main>` wrapper. The MobileInterstitial exemption (Section 5) ensures they bypass the existing mobile guard.

---

## 4. Route Guards

### New Guards: appended to `src/router/guards.ts`

```typescript
import { useMCQStore } from '../store/mcqStore';

export function mcqHouseholdGuard() {
  const { emergencyTypes } = useMCQStore.getState();
  if (emergencyTypes.length === 0) return redirect('/build');
  return null;
}

export function forkGuard() {
  const { emergencyTypes, householdComposition } = useMCQStore.getState();
  if (emergencyTypes.length === 0 || householdComposition.length === 0) {
    return redirect('/build');
  }
  return null;
}

export function reviewGuard() {
  const { kitPath } = useMCQStore.getState();
  if (!kitPath) return redirect('/choose');
  return null;
}
```

### Guard Design Notes

| Route | Guard Condition | Redirect To |
|-------|----------------|-------------|
| `/build/household` | `emergencyTypes` is empty | `/build` |
| `/choose` | MCQ not complete (either store field empty) | `/build` |
| `/review` | `kitPath` not set | `/choose` |

- **`reviewGuard` is extensible by design.** It checks `!kitPath` — which fails for `null` (no selection). In Sprint 1, only `kitPath === 'essentials'` is reachable from the UI. In Sprint 2, when the Build My Own path wires to `/review`, `kitPath === 'custom'` will also pass this guard with zero changes.
- **Back navigation from `/builder`:** The brief states back navigation from `/builder` should return to `/choose`, not to the MCQ screens. This is a component-level concern — the `SubkitSelectionScreen` back button should link to `/choose`. No guard change needed.

---

## 5. MobileInterstitial Exemption

### Current Implementation

In `AppShell.tsx` (line 42):

```typescript
{isMobile ? <MobileInterstitial /> : <Outlet />}
```

This blanket-gates **all** `AppShell` children. The Phase 3 routes are mobile-first and must bypass this.

### Recommended Approach: Route-Based Exemption List

```typescript
// In AppShell.tsx
import { useLocation } from 'react-router-dom';

const MOBILE_EXEMPT_ROUTES = ['/build', '/build/household', '/choose', '/review'];

export const AppShell: FC = () => {
  const isMobile = useIsMobile();
  const location = useLocation();

  const isMobileExempt = MOBILE_EXEMPT_ROUTES.some(
    (route) => location.pathname === route || location.pathname.startsWith(route + '/')
  );

  // ...existing code...

  return (
    // ...existing JSX...
    <main className="mx-auto max-w-5xl px-4 py-6">
      {isMobile && !isMobileExempt ? <MobileInterstitial /> : <Outlet />}
    </main>
    // ...
  );
};
```

### Why This Approach

1. **Minimal change.** One constant + one boolean check. No restructuring of the route tree.
2. **Explicit.** The exemption list is readable — new routes can be added/removed by editing one array.
3. **`startsWith` guard.** Handles potential nested paths under `/build/` if we ever add more.
4. **Alternative considered and rejected:** Splitting the route tree into two `AppShell` variants (one with MobileInterstitial, one without). This would duplicate the header, cart sidebar, live region refs, and GA4 injection. Not worth it for a prototype.

---

## 6. KitSummaryCard Component Interface

### New File: `src/components/review/KitSummaryCard.tsx`

```typescript
import type { FC } from 'react';

interface KitSummaryCardProps {
  path: 'essentials' | 'custom';
}

export const KitSummaryCard: FC<KitSummaryCardProps> = ({ path }) => {
  if (path === 'essentials') {
    // Sprint 1: reads from ESSENTIALS_BUNDLE constant
    // Renders bundle contents, slot count, category colors
    return <EssentialsKitSummary />;
  }

  // Sprint 2: path === 'custom'
  // Will read selectedSubkits from useKitStore()
  // Scaffolded — returns placeholder
  return <div>Custom kit summary — Sprint 2</div>;
};
```

### Design Notes

- **Branching on `path` prop, not on store state.** The parent (`ReviewOrderScreen`) already knows which path is active from `useMCQStore().kitPath`. It passes the discriminant down. `KitSummaryCard` doesn't read the MCQ store directly — clean separation.
- **Sprint 2 additive wiring:** James replaces the placeholder with a `<CustomKitSummary />` that reads `useKitStore().selectedSubkits`. No interface change. No prop additions. The branch already exists.
- **`EssentialsKitSummary` (internal component):** Reads `ESSENTIALS_BUNDLE`, resolves category names/colors from `CATEGORIES`, computes slot count inline. Self-contained.

---

## 7. Cover Page CTA Update

### Current (`src/components/cover/CoverScreen.tsx`):

```typescript
<Link to="/builder" ...>Build My Kit →</Link>
```

### Sprint 1 Change:

```typescript
<Link to="/build" ...>Build My Kit →</Link>
```

One-line change. `/builder` remains accessible as the Build My Own destination — it is no longer the CTA target from the Cover Page.

---

## 8. Sally Coordination Points — Confirmed

### 8.1 Route Names

`/build`, `/build/household`, `/choose`, `/review` — **confirmed**. No conflicts with existing routes. Pattern is consistent with existing routing conventions.

### 8.2 MCQ Store Shape

| Type | Values | Status |
|------|--------|--------|
| `EmergencyType` | `'flood' \| 'tornado' \| 'hurricane' \| 'tropical-storm'` | Confirmed |
| `HouseholdOption` | `'kids' \| 'older-adults' \| 'disability' \| 'pets' \| 'none'` | Confirmed |
| `KitPath` | `'essentials' \| 'custom' \| null` | Confirmed |

Action names: `setEmergencyTypes`, `setHouseholdComposition`, `setKitPath` — Sally's components call these directly from the store.

### 8.3 `kitPath` Field

- Field name: `kitPath` — **confirmed**
- Values: `'essentials' | 'custom' | null` — **confirmed**
- Sally's Fork screen CTAs call `useMCQStore.getState().setKitPath('essentials')` or `setKitPath('custom')` then navigate

### 8.4 MobileInterstitial Exemption

Mechanism: `MOBILE_EXEMPT_ROUTES` array in `AppShell.tsx` — **confirmed**. Lightweight, explicit, no route tree restructure.

### 8.5 Icon Availability

All seven icons Sally's spec references are **verified present** in `lucide-react@^0.576.0`:

| Icon | Status |
|------|--------|
| `Tornado` | FOUND |
| `CloudRainWind` | FOUND |
| `Accessibility` | FOUND |
| `HeartHandshake` | FOUND |
| `PawPrint` | FOUND |
| `ShieldCheck` | FOUND |
| `SlidersHorizontal` | FOUND |

These are not in the current `iconResolver.ts` map — they don't need to be. The MCQ and Fork screens import them directly as named imports per the project's coding standard (never wildcard imports).

---

## 9. New File Inventory

### New Files

| File | Purpose |
|------|---------|
| `src/store/mcqStore.ts` | MCQ Zustand store with sessionStorage persistence |
| `src/data/essentialsConfig.ts` | `ESSENTIALS_BUNDLE` constant |
| `src/components/mcq/MCQEmergencyTypeScreen.tsx` | Q1 screen at `/build` |
| `src/components/mcq/MCQHouseholdScreen.tsx` | Q2 screen at `/build/household` |
| `src/components/fork/ForkScreen.tsx` | Fork screen at `/choose` |
| `src/components/review/ReviewOrderScreen.tsx` | Review & Order screen at `/review` |
| `src/components/review/KitSummaryCard.tsx` | Dual-path kit summary component |

### Modified Files

| File | Change |
|------|--------|
| `src/router/index.tsx` | Add 4 new routes + imports |
| `src/router/guards.ts` | Add 3 new guard functions + `useMCQStore` import |
| `src/components/layout/AppShell.tsx` | Add `MOBILE_EXEMPT_ROUTES` + conditional bypass |
| `src/components/cover/CoverScreen.tsx` | CTA `to="/builder"` changed to `to="/build"` |

---

## 10. Exclusions — What Is NOT Sprint 1

- **MCQ answer to subkit surfacing logic** — Sprint 2. James implements the elevation rules in the visualizer.
- **Build My Own to `/review` wiring** — Sprint 2. The `kitPath === 'custom'` path to `/review` is wired then.
- **Visualizer UI refresh** — Sprint 2.
- **Amazon Cart API feasibility research** — Sprint 3 spike.
- **Any fulfillment, payment, or logistics backend** — Out of prototype scope entirely.
- **`extreme-heat` emergency type** — Coming soon, non-selectable in Sprint 1. Excluded from `EmergencyType` union.
- **`pets` subkit/category** — No `pets` category in `CATEGORIES` yet. The store shape supports it (the `householdComposition` field captures `'pets'`), and the surfacing rules will handle it when the Pets subkit is introduced.

---

## 11. Sprint 2 Forward-Look Validation

These Sprint 2 concerns are **designed for but not built** in Sprint 1:

| Sprint 2 Concern | Architecture Support |
|---|---|
| MCQ to subkit surfacing | `emergencyTypes` and `householdComposition` are typed arrays in `mcqStore`, readable via `useMCQStore.getState()` from the visualizer |
| Build My Own to `/review` | `reviewGuard` checks `!kitPath` (truthy check), so `kitPath === 'custom'` passes with zero guard changes |
| `KitSummaryCard` custom path | Branch exists (`path === 'custom'`), implementation is Sprint 2 additive |
| `extreme-heat` emergency type | Add to `EmergencyType` union, add to Q1 screen options — no store/guard changes |

### MCQ Surfacing Rules (Reference — Not Sprint 1 Implementation)

**Q2 — additive elevation:**

| Household Option | Elevated Subkits |
|---|---|
| Kids | Hygiene, Medical, Comfort |
| Older Adults | Medical, Comfort |
| Disability | Medical, Comfort |
| Pets | Pets subkit |
| None | No effect |

**Q1 — ordering/weighting:**

| Emergency Type | Elevated Subkits |
|---|---|
| Flood / Hurricane | Power, Communications, Cooking |
| Tropical Storm | Power, Communications |
| Tornado | Medical, Lighting, Clothing |
| Extreme Heat | No effect (coming soon) |

"Elevate" = surfaced at top of visualizer list, visually flagged. Not pre-selected. Additive when multiple answers selected. Q2 takes visual priority over Q1 when both elevate the same subkit.

---

*Emergency Prep Kit Builder — Phase 3 Sprint 1 Architecture Brief | Version 1.0 | 2026-04-13 | Winston, Architect*
