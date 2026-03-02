# 7. Routing

## Route Configuration

```typescript
// src/router/index.tsx
import { createBrowserRouter, redirect } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { SubkitSelectionScreen } from '../components/subkit-selection/SubkitSelectionScreen';
import { ItemConfigScreen } from '../components/item-config/ItemConfigScreen';
import { CustomSubkitScreen } from '../components/item-config/CustomSubkitScreen';
import { SummaryScreen } from '../components/summary/SummaryScreen';
import { subkitConfigGuard, customConfigGuard, summaryGuard } from './guards';

export const router = createBrowserRouter([
  {
    element: <AppShell />,  // Persistent header + MobileInterstitial wrapper
    children: [
      {
        path: '/',
        element: <SubkitSelectionScreen />,
      },
      {
        // Guard: redirect to '/' if subkitId not in selectedSubkits
        path: '/configure/:subkitId',
        element: <ItemConfigScreen />,
        loader: subkitConfigGuard,
      },
      {
        // Guard: redirect to '/' if 'custom' not in selectedSubkits
        // React Router v6 Data Router automatically ranks static paths over dynamic
        // segments — no special ordering required.
        path: '/configure/custom',
        element: <CustomSubkitScreen />,
        loader: customConfigGuard,
      },
      {
        // Guard: redirect to '/' if fewer than 3 subkits selected
        path: '/summary',
        element: <SummaryScreen />,
        loader: summaryGuard,
      },
      {
        // Catch-all — unknown paths redirect to entry
        path: '*',
        loader: () => redirect('/'),
      },
    ],
  },
]);
```

```typescript
// src/router/guards.ts
// Guards use getState() — not hooks — because loaders run outside React render cycle.
import { redirect } from 'react-router-dom';
import { useKitStore } from '../store/kitStore';

export function subkitConfigGuard({ params }: { params: Record<string, string | undefined> }) {
  const { selectedSubkits } = useKitStore.getState();
  const isValid = selectedSubkits.some((s) => s.subkitId === params['subkitId']);
  return isValid ? null : redirect('/');
}

export function customConfigGuard() {
  const { selectedSubkits } = useKitStore.getState();
  const hasCustom = selectedSubkits.some((s) => s.categoryId === 'custom');
  return hasCustom ? null : redirect('/');
}

export function summaryGuard() {
  const { selectedSubkits } = useKitStore.getState();
  return selectedSubkits.length >= 3 ? null : redirect('/');
}
```

## Navigation Flow

```
/ (SubkitSelectionScreen)
└── [Configure Items — active only with >= 3 subkits]
    └── /configure/:firstSubkitId  (ItemConfigScreen)
        └── [Next Subkit] → /configure/:nextSubkitId  (repeat per subkit)
        └── [Next Subkit — if Custom selected] → /configure/custom  (CustomSubkitScreen)
        └── [Review My Kit — on final subkit] → /summary

/summary (SummaryScreen)
├── [Edit My Kit] → /  (full store state preserved)
└── [Start Over] → ConfirmationModal → resetKit() → /
```

## Screen Transition Directions

Forward transitions (`/` → `/configure/:id` → `/summary`): exit `translateX(-16px)` + fade; enter from `+16px`.
Back transitions: direction reverses. Duration: `var(--duration-screen)` (240ms). This must be implemented at the router level using a transition wrapper, not inside individual screen components.

---
