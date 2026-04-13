# 6. KitSummaryCard Component Interface

## New File: `src/components/review/KitSummaryCard.tsx`

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

## Design Notes

- **Branching on `path` prop, not on store state.** The parent (`ReviewOrderScreen`) already knows which path is active from `useMCQStore().kitPath`. It passes the discriminant down. `KitSummaryCard` doesn't read the MCQ store directly — clean separation.
- **Sprint 2 additive wiring:** James replaces the placeholder with a `<CustomKitSummary />` that reads `useKitStore().selectedSubkits`. No interface change. No prop additions. The branch already exists.
- **`EssentialsKitSummary` (internal component):** Reads `ESSENTIALS_BUNDLE`, resolves category names/colors from `CATEGORIES`, computes slot count inline. Self-contained.

---
