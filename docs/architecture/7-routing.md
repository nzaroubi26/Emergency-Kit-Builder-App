# 7. Routing

## Phase 2 Route Structure

`/` is now the cover/landing page. The Subkit Selection Screen moves to `/builder`. All guards redirect to `/builder`.

```typescript
// src/router/index.tsx — Phase 2 updated
import { createBrowserRouter, redirect } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { CoverScreen } from '../components/cover/CoverScreen';
import { SubkitSelectionScreen } from '../components/subkit-selection/SubkitSelectionScreen';
import { ItemConfigScreen } from '../components/item-config/ItemConfigScreen';
import { CustomSubkitScreen } from '../components/item-config/CustomSubkitScreen';
import { SummaryScreen } from '../components/summary/SummaryScreen';
import { subkitConfigGuard, customConfigGuard, summaryGuard } from './guards';

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      {
        path: '/',
        element: <CoverScreen />,  // NEW — static landing page
      },
      {
        path: '/builder',          // RENAMED from /
        element: <SubkitSelectionScreen />,
      },
      {
        path: '/configure/:subkitId',
        element: <ItemConfigScreen />,
        loader: subkitConfigGuard,
      },
      {
        path: '/configure/custom',
        element: <CustomSubkitScreen />,
        loader: customConfigGuard,
      },
      {
        path: '/summary',
        element: <SummaryScreen />,
        loader: summaryGuard,
      },
      {
        path: '*',
        loader: () => redirect('/'),
      },
    ],
  },
]);
```

```typescript
// src/router/guards.ts — Phase 2: all redirects updated to /builder
import { redirect } from 'react-router-dom';
import { useKitStore } from '../store/kitStore';

export function subkitConfigGuard({ params }: { params: Record<string, string | undefined> }) {
  const { selectedSubkits } = useKitStore.getState();
  const isValid = selectedSubkits.some((s) => s.subkitId === params['subkitId']);
  return isValid ? null : redirect('/builder');  // was redirect('/')
}

export function customConfigGuard() {
  const { selectedSubkits } = useKitStore.getState();
  const hasCustom = selectedSubkits.some((s) => s.categoryId === 'custom');
  return hasCustom ? null : redirect('/builder');  // was redirect('/')
}

export function summaryGuard() {
  const { selectedSubkits } = useKitStore.getState();
  return selectedSubkits.length >= 3 ? null : redirect('/builder');  // was redirect('/')
}
```

## Navigation Flow — Phase 2

```
/ (CoverScreen)  [NEW]
└── [Build My Kit CTA]
    └── /builder (SubkitSelectionScreen)  [RENAMED from /]
        └── [Configure Items — active only with >= 3 subkits]
            └── /configure/:firstSubkitId (ItemConfigScreen)
                └── [Next Subkit] → /configure/:nextSubkitId
                └── [Next Subkit — Custom] → /configure/custom
                └── [Review My Kit — final subkit] → /summary

/builder — Filled visualizer slots now clickable [Phase 2]
    └── [Click filled slot] → /configure/:subkitId  (direct navigation)

/summary (SummaryScreen)
├── [Get My Kit] → initiateCheckout() → redirect to checkout URL on success
├── [API failure] → dismissible error message; kit state preserved
├── [Edit My Kit] → /builder
└── [Start Over] → ConfirmationModal → resetKit() → /builder
```

## Clickable Slot Implementation

`HousingUnitVisualizer` interface is **unchanged** — `onSlotClick?: (slotIndex: number) => void` was already typed and wired in Phase 1. Phase 2 passes a handler from `SubkitSelectionScreen`:

```typescript
// In SubkitSelectionScreen.tsx — Phase 2 addition
const navigate = useNavigate();
const slots = useSlotState();

const handleSlotClick = (slotIndex: number) => {
  const slot = slots[slotIndex];
  if (slot.status !== 'filled' || !slot.subkitId) return; // empty slots: no-op
  navigate(`/configure/${slot.subkitId}`);
};

// Passed to visualizer:
<HousingUnitVisualizer
  slots={slots}
  onSlotClick={handleSlotClick}
/>
```

`VisualizerSlot` adds `cursor-pointer` and `hover:brightness-95` only when `status === 'filled'` and `onSlotClick` is defined. Empty slots receive no cursor change. `readOnly` mode on `SummaryScreen` does not pass `onSlotClick` — slots remain non-interactive.


---
