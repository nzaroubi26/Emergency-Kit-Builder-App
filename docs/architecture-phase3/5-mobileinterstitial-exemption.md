# 5. MobileInterstitial Exemption

## Current Implementation

In `AppShell.tsx` (line 42):

```typescript
{isMobile ? <MobileInterstitial /> : <Outlet />}
```

This blanket-gates **all** `AppShell` children. The Phase 3 routes are mobile-first and must bypass this.

## Recommended Approach: Route-Based Exemption List

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

## Why This Approach

1. **Minimal change.** One constant + one boolean check. No restructuring of the route tree.
2. **Explicit.** The exemption list is readable — new routes can be added/removed by editing one array.
3. **`startsWith` guard.** Handles potential nested paths under `/build/` if we ever add more.
4. **Alternative considered and rejected:** Splitting the route tree into two `AppShell` variants (one with MobileInterstitial, one without). This would duplicate the header, cart sidebar, live region refs, and GA4 injection. Not worth it for a prototype.

---
