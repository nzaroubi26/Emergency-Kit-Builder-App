# 11. Frontend Developer Standards

## Critical Rules — Dev Agent Must Follow

These rules exist because violations here produce bugs that are invisible at compile time but break the physical kit constraint logic at runtime.

| # | Rule | Why |
|---|------|-----|
| 1 | **Never store slot state in Zustand.** Slot state is always computed via `calculateSlotState()`. Storing it creates sync bugs. | NFR2 + slot constraint correctness |
| 2 | **Never call `calculateSlotState()` directly in components.** Always use `useSlotState()` from `src/hooks/useKitStore.ts`. | Prevents duplicated computation and ensures consistency |
| 3 | **Dynamic category colors must use inline styles.** `style={{ backgroundColor: category.colorBase }}` — never template literal Tailwind classes. | Tailwind purges unused dynamic classes at build time |
| 4 | **All animations use `transform` and `opacity` only.** Animating `width`, `height`, or positional properties breaks the 100ms slot update NFR. | NFR2 |
| 5 | **All interactive elements must have an accessible label.** Use `aria-label`, `aria-labelledby`, or visible associated `<label>`. The axe test will catch violations. | WCAG 2.1 AA |
| 6 | **The Configure Items CTA uses `aria-disabled` + `aria-describedby`, not the `disabled` attribute.** Keyboard users must be able to reach it and read the minimum message. | UX spec Section 7 |
| 7 | **Named imports only from `lucide-react`.** Never `import * as Icons from 'lucide-react'`. | Bundle size — prevents importing 1000+ icons |
| 8 | **`QuantitySelector` container always reserves its layout space.** Only `opacity` and `pointer-events` change. Never conditionally render or hide with `display:none`. | CLS prevention — UX spec Section 10 |
| 9 | **`EmptyContainerOption` is rendered on both `ItemConfigScreen` and `CustomSubkitScreen`.** The Custom subkit supports the empty container option identically to standard subkits per PRD FR9. Behavior: deselects all Custom items, dims item grid, displays inline confirmation in Custom category color (`#3730A3`), reflected on Summary Page. | PRD FR9 scope |
| 10 | **The `HousingUnitVisualizer` receives no store references.** It takes only `slots: SlotState[]`, `readOnly?`, and `onSlotClick?`. All derivation happens in the parent. | NFR6 — self-contained extensible module |

## Quick Reference

```bash
# Development
npm run dev          # Vite dev server — http://localhost:5173
npm run build        # Production build to dist/
npm run preview      # Preview production build locally

# Quality
npm run lint         # ESLint + jsx-a11y
npm run typecheck    # tsc --noEmit

# Testing
npm run test         # Vitest — watch mode
npm run test:run     # Vitest — single run (CI)
npm run test:coverage  # Coverage report
```

## Key Import Patterns

```typescript
// Types
import type { KitCategory, KitItem, SubkitSelection } from '../types';
import type { SlotState, HousingUnitVisualizerProps } from '../types';

// Data
import { CATEGORIES, ITEMS, ITEMS_BY_CATEGORY, STANDARD_CATEGORY_IDS } from '../data';

// Store
import { useKitStore } from '../store/kitStore';
import { useSlotState, useIsAtCapacity, useCanProceedToConfig } from '../hooks/useKitStore';

// Slot utils — only in tests and the store; never import directly into components
import { calculateSlotState, canFitSize } from '../utils/slotCalculations';

// Icons — named imports only
import { Zap, Radio, HeartPulse, Settings2 } from 'lucide-react';

// Env
import { ENV } from '../tokens/env';
```

## Focus Management on Screen Transitions

Per UX spec Section 7, focus must move to the main heading on every screen change:

```typescript
// Pattern to use in every screen component
import { useEffect, useRef } from 'react';

export const ItemConfigScreen: FC = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);  // Runs on mount — each screen mounts fresh on navigation

  return (
    <main>
      <h1 ref={headingRef} tabIndex={-1} className="text-[var(--text-h1)] font-bold text-[var(--color-neutral-900)] outline-none">
        Configure Your Power Subkit
      </h1>
      {/* ... */}
    </main>
  );
};
```

## ARIA Live Region Setup

A single `aria-live` region for polite announcements and one for assertive announcements should be mounted in `AppShell` and populated via a shared announcement utility — not duplicated per component:

```typescript
// src/utils/announce.ts
let politeEl: HTMLElement | null = null;
let assertiveEl: HTMLElement | null = null;

export function initAnnouncer(polite: HTMLElement, assertive: HTMLElement) {
  politeEl = polite;
  assertiveEl = assertive;
}

export function announcePolite(message: string) {
  if (!politeEl) return;
  politeEl.textContent = '';
  requestAnimationFrame(() => { if (politeEl) politeEl.textContent = message; });
}

export function announceAssertive(message: string) {
  if (!assertiveEl) return;
  assertiveEl.textContent = '';
  requestAnimationFrame(() => { if (assertiveEl) assertiveEl.textContent = message; });
}
```

Call `announcePolite` / `announceAssertive` from store action side-effects or component event handlers per the ARIA announcements table in UX spec Section 7.

---
