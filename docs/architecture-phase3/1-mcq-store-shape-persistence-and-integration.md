# 1. MCQ Store — Shape, Persistence, and Integration

## New File: `src/store/mcqStore.ts`

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

## Design Decisions

1. **Separate store from `kitStore.ts`.** The MCQ data has a completely different lifecycle (session-scoped, no item selections, no slot logic). Merging it into `kitStore` would bloat a store that already has migration logic and localStorage persistence. Separate store = separate `sessionStorage` key, separate persist config, zero risk of collision with the existing `emergency-kit-v1` localStorage entry.

2. **`sessionStorage` via custom `storage` adapter.** Zustand's `persist` defaults to `localStorage`. The brief calls for session-level persistence for Q1/Q2 answers. The custom `storage` object maps to `sessionStorage` — three one-liners. `kitPath` is excluded via `partialize` so it resets on tab close/refresh per the brief.

3. **Type exports are standalone.** `EmergencyType`, `HouseholdOption`, and `KitPath` are exported from `mcqStore.ts` directly. They don't belong in `kit.types.ts` — they're not part of the kit/subkit/item domain. Sally's components import these types from the store file. If we later need them in `types/`, we can re-export — but YAGNI for now.

4. **Sprint 2 readiness.** The `emergencyTypes` and `householdComposition` arrays are plain, typed arrays — trivially consumable by the visualizer elevation logic James will build. No intermediate transformation needed. The surfacing rules can do `useMCQStore.getState().emergencyTypes.includes('flood')` directly.

---
