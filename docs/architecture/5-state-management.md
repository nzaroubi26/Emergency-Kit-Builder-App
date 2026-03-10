# 5. State Management

## localStorage Persistence — Phase 2 Change

Zustand `persist` middleware wraps the existing `create<KitStore>()` call. This is a **one-import, one-wrapper change** to `kitStore.ts`. Zero changes to selectors, actions, or consuming components.

```typescript
// src/store/kitStore.ts — Phase 2 change: persist wrapper
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// ... all existing imports unchanged

export const useKitStore = create<KitStore>()(
  persist(
    (set, get) => ({
      ...initial,
      // ALL EXISTING ACTIONS UNCHANGED
      selectSubkit: (categoryId) => { /* unchanged */ },
      deselectSubkit: (subkitId) => { /* unchanged */ },
      setSubkitSize: (subkitId, size) => { /* unchanged */ },
      toggleItem: (subkitId, itemId) => { /* unchanged */ },
      setItemQuantity: (subkitId, itemId, qty) => { /* unchanged */ },
      toggleEmptyContainer: (subkitId) => { /* unchanged */ },
      setCurrentConfigIndex: (index) => set({ currentConfigIndex: index }),
      resetKit: () => set({ ...initial }), // persist writes empty state to localStorage automatically
    }),
    {
      name: 'emergency-kit-v1',  // localStorage key
      // No partialize — persist full store state
    }
  )
);
```

**`resetKit()` behavior with persist:** Calling `set({ ...initial })` triggers Zustand persist to write the empty initial state back to `localStorage['emergency-kit-v1']`. No `clearStorage()` call is needed at the call site. First-time visitors with no existing key initialize to empty state identically to Phase 1.

## Fill My Kit For Me — Derived State Pattern

"Fill my kit for me" is **not stored in Zustand**. The checkbox is a derived UI state computed at the component level.

```typescript
// In ItemConfigScreen and CustomSubkitScreen
const { itemSelections, toggleItem } = useKitStore();
const items = getItemsForSubkit(subkitId); // items for current subkit

// Derived — true when every item in this subkit is selected
const isAllFilled = items.every(
  (item) => !!itemSelections[`${subkitId}::${item.id}`]
);

const handleFillToggle = () => {
  if (isAllFilled) {
    // Uncheck: clear all items for this subkit
    items.filter((item) => itemSelections[`${subkitId}::${item.id}`])
         .forEach((item) => toggleItem(subkitId, item.id));
  } else {
    // Check: select all unselected items at qty 1
    items.filter((item) => !itemSelections[`${subkitId}::${item.id}`])
         .forEach((item) => toggleItem(subkitId, item.id));
  }
};
```

**Bidirectional state with EmptyContainerOption:** When `EmptyContainerOption` is checked, it clears all `itemSelections` for the subkit. Because `isAllFilled` is derived from `itemSelections`, the Fill checkbox automatically reads as unchecked. No extra logic required. The Fill checkbox is visually disabled (`opacity-45 cursor-not-allowed`) when the subkit is in empty container state.

## Selector Hooks, Slot Calculations, and Store Shape

All selector hooks (`useKitStore.ts`), slot calculation pure functions (`slotCalculations.ts`), and the Zustand store shape (including `KitStore` interface) are **unchanged from Phase 1**. The persist middleware is fully transparent to all consumers.

---
