# 4. Route Guards

## New Guards: appended to `src/router/guards.ts`

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

## Guard Design Notes

| Route | Guard Condition | Redirect To |
|-------|----------------|-------------|
| `/build/household` | `emergencyTypes` is empty | `/build` |
| `/choose` | MCQ not complete (either store field empty) | `/build` |
| `/review` | `kitPath` not set | `/choose` |

- **`reviewGuard` is extensible by design.** It checks `!kitPath` — which fails for `null` (no selection). In Sprint 1, only `kitPath === 'essentials'` is reachable from the UI. In Sprint 2, when the Build My Own path wires to `/review`, `kitPath === 'custom'` will also pass this guard with zero changes.
- **Back navigation from `/builder`:** The brief states back navigation from `/builder` should return to `/choose`, not to the MCQ screens. This is a component-level concern — the `SubkitSelectionScreen` back button should link to `/choose`. No guard change needed.

---
