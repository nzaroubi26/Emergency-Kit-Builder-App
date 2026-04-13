# 3. Route Architecture

## Updated Router: `src/router/index.tsx`

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

## New Routes

| Route | Screen | Guard | Notes |
|-------|--------|-------|-------|
| `/build` | `MCQEmergencyTypeScreen` | None | Phase 3 entry point. New CTA destination from Cover Page |
| `/build/household` | `MCQHouseholdScreen` | `mcqHouseholdGuard` | Requires Q1 completion |
| `/choose` | `ForkScreen` | `forkGuard` | Requires MCQ completion |
| `/review` | `ReviewOrderScreen` | `reviewGuard` | Requires kit path selection |

## Route Name Confirmation

- No collision with existing paths (`/builder`, `/configure/*`, `/summary`, `/confirmation`)
- `/build/household` nests naturally under `/build` — consistent with `/configure/:subkitId` nesting
- `/choose` and `/review` are top-level like `/builder` and `/summary` — appropriate for flow decision points

## Phase 3 Routes Inside `AppShell`

The new routes go inside the `AppShell` children array. This means they get the `AppHeader`, the `CartSidebar`, and the `<main>` wrapper. The MobileInterstitial exemption (Section 5) ensures they bypass the existing mobile guard.

---
