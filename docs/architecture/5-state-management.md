# 5. State Management

## Architecture Decision

**Zustand 5.x** manages all kit configuration state. It is the single source of truth for selected subkits, item selections and quantities, empty container flags, and item config navigation index.

**Critical constraint: Slot state is never stored.** It is always computed from `selectedSubkits` via pure functions in `utils/slotCalculations.ts`. Components that need slot state call `useSlotState()` which runs `calculateSlotState()` live.

## Type Definitions

```typescript
// src/types/kit.types.ts
export type SubkitSize = 'regular' | 'large';

export interface KitCategory {
  id: string;            // e.g. 'power'
  name: string;          // e.g. 'Power'
  colorBase: string;     // Hex — visualizer fills, borders
  colorTint: string;     // Hex — card selected backgrounds
  icon: string;          // lucide-react icon name
  description: string;
  sizeOptions: SubkitSize[];
}

export interface KitItem {
  id: string;            // e.g. 'power-solar-panel'
  categoryId: string;
  name: string;
  description: string;
  // Phase 2 fields — present but nullable in MVP
  productId: string | null;
  pricePlaceholder: number | null;
  imageSrc: string | null;
}

export interface SubkitSelection {
  subkitId: string;         // categoryId — unique per instance in MVP
  categoryId: string;
  size: SubkitSize;
  selectionOrder: number;   // 1-indexed; drives config sequence and slot fill order
}

export interface ItemSelection {
  itemId: string;
  subkitId: string;
  quantity: number;         // 1–10
}
```

```typescript
// src/types/visualizer.types.ts
export interface SlotState {
  status: 'empty' | 'filled';
  subkitId?: string;
  subkitName?: string;
  subkitColor?: string;    // Hex from category colorBase
  size: SubkitSize;
  isLargeStart?: boolean;  // First row of a Large block
  isLargeEnd?: boolean;    // Second row of a Large block
}

export interface HousingUnitVisualizerProps {
  slots: SlotState[];              // Always length 6; index 0 = top slot
  readOnly?: boolean;              // true on Summary Page
  onSlotClick?: (slotIndex: number) => void;  // Phase 2 — wired, dormant in MVP
}
```

## Store

```typescript
// src/store/kitStore.ts
import { create } from 'zustand';
import { calculateTotalSlots, canFitSize } from '../utils/slotCalculations';
import type { SubkitSelection, ItemSelection, SubkitSize } from '../types';

const MAX_SLOTS = 6;

interface KitStore {
  selectedSubkits: SubkitSelection[];
  itemSelections: Record<string, ItemSelection>;  // key: `${subkitId}::${itemId}`
  emptyContainers: string[];                       // subkitIds
  currentConfigIndex: number;

  selectSubkit: (categoryId: string) => void;
  deselectSubkit: (subkitId: string) => void;
  setSubkitSize: (subkitId: string, size: SubkitSize) => boolean; // false = not enough slots
  toggleItem: (subkitId: string, itemId: string) => void;
  setItemQuantity: (subkitId: string, itemId: string, qty: number) => void;
  toggleEmptyContainer: (subkitId: string) => void;
  setCurrentConfigIndex: (index: number) => void;
  resetKit: () => void;
}

const initial = {
  selectedSubkits: [] as SubkitSelection[],
  itemSelections: {} as Record<string, ItemSelection>,
  emptyContainers: [] as string[],
  currentConfigIndex: 0,
};

export const useKitStore = create<KitStore>((set, get) => ({
  ...initial,

  selectSubkit: (categoryId) => {
    const { selectedSubkits } = get();
    if (selectedSubkits.some((s) => s.categoryId === categoryId)) return;
    if (calculateTotalSlots(selectedSubkits) + 1 > MAX_SLOTS) return;
    set({
      selectedSubkits: [
        ...selectedSubkits,
        { subkitId: categoryId, categoryId, size: 'regular', selectionOrder: selectedSubkits.length + 1 },
      ],
    });
  },

  deselectSubkit: (subkitId) => {
    const { selectedSubkits, itemSelections, emptyContainers } = get();
    const filtered = selectedSubkits
      .filter((s) => s.subkitId !== subkitId)
      .map((s, i) => ({ ...s, selectionOrder: i + 1 }));
    const cleanedItems = Object.fromEntries(
      Object.entries(itemSelections).filter(([k]) => !k.startsWith(`${subkitId}::`))
    );
    set({
      selectedSubkits: filtered,
      itemSelections: cleanedItems,
      emptyContainers: emptyContainers.filter((id) => id !== subkitId),
    });
  },

  setSubkitSize: (subkitId, size) => {
    const { selectedSubkits } = get();
    if (!canFitSize(selectedSubkits, subkitId, size, MAX_SLOTS)) return false;
    set({
      selectedSubkits: selectedSubkits.map((s) =>
        s.subkitId === subkitId ? { ...s, size } : s
      ),
    });
    return true;
  },

  toggleItem: (subkitId, itemId) => {
    const { itemSelections, emptyContainers } = get();
    if (emptyContainers.includes(subkitId)) return; // blocked on empty-container subkits
    const key = `${subkitId}::${itemId}`;
    if (itemSelections[key]) {
      const { [key]: _, ...rest } = itemSelections;
      set({ itemSelections: rest });
    } else {
      set({ itemSelections: { ...itemSelections, [key]: { itemId, subkitId, quantity: 1 } } });
    }
  },

  setItemQuantity: (subkitId, itemId, qty) => {
    const { itemSelections } = get();
    const key = `${subkitId}::${itemId}`;
    if (!itemSelections[key]) return;
    set({ itemSelections: { ...itemSelections, [key]: { ...itemSelections[key], quantity: Math.max(1, Math.min(10, qty)) } } });
  },

  toggleEmptyContainer: (subkitId) => {
    const { emptyContainers, itemSelections } = get();
    if (emptyContainers.includes(subkitId)) {
      set({ emptyContainers: emptyContainers.filter((id) => id !== subkitId) });
    } else {
      const cleanedItems = Object.fromEntries(
        Object.entries(itemSelections).filter(([k]) => !k.startsWith(`${subkitId}::`))
      );
      set({ emptyContainers: [...emptyContainers, subkitId], itemSelections: cleanedItems });
    }
  },

  setCurrentConfigIndex: (index) => set({ currentConfigIndex: index }),
  resetKit: () => set({ ...initial }),
}));
```

## Selector Hooks

```typescript
// src/hooks/useKitStore.ts
import { useKitStore } from '../store/kitStore';
import { calculateSlotState, calculateTotalSlots, isSlotsAtCapacity } from '../utils/slotCalculations';

// Never call calculateSlotState directly in components — always use this hook
export const useSlotState = () =>
  useKitStore((s) => calculateSlotState(s.selectedSubkits));

export const useTotalSlotsUsed = () =>
  useKitStore((s) => calculateTotalSlots(s.selectedSubkits));

export const useIsAtCapacity = () =>
  useKitStore((s) => isSlotsAtCapacity(s.selectedSubkits));

export const useCanProceedToConfig = () =>
  useKitStore((s) => s.selectedSubkits.length >= 3);

export const useItemSelection = (subkitId: string, itemId: string) =>
  useKitStore((s) => s.itemSelections[`${subkitId}::${itemId}`]);

export const useIsEmptyContainer = (subkitId: string) =>
  useKitStore((s) => s.emptyContainers.includes(subkitId));
```

## Slot Calculation Pure Functions

These are the most safety-critical functions in the application. They live outside the store, are pure, and must achieve 100% branch coverage in tests.

```typescript
// src/utils/slotCalculations.ts
import type { SubkitSelection, SubkitSize, SlotState } from '../types';
import { CATEGORIES } from '../data';

export const MAX_SLOTS = 6;

export function calculateTotalSlots(selections: SubkitSelection[]): number {
  return selections.reduce((total, s) => total + (s.size === 'large' ? 2 : 1), 0);
}

/**
 * Returns true if switching subkitId to targetSize fits within maxSlots.
 * Calculates as if the current size were replaced by targetSize.
 */
export function canFitSize(
  selections: SubkitSelection[],
  subkitId: string,
  targetSize: SubkitSize,
  maxSlots = MAX_SLOTS
): boolean {
  const hypothetical = selections.map((s) =>
    s.subkitId === subkitId ? { ...s, size: targetSize } : s
  );
  return calculateTotalSlots(hypothetical) <= maxSlots;
}

/**
 * Derives the full 6-element SlotState array for HousingUnitVisualizer.
 * ALWAYS returns exactly 6 SlotState objects.
 * Index 0 = top slot. Fills top-to-bottom in selection order.
 * Large subkits occupy two consecutive indices with isLargeStart/isLargeEnd flags.
 */
export function calculateSlotState(selections: SubkitSelection[]): SlotState[] {
  const slots: SlotState[] = Array.from({ length: 6 }, () => ({
    status: 'empty' as const,
    size: 'regular' as const,
  }));
  let i = 0;
  for (const selection of selections) {
    if (i >= 6) break;
    const category = CATEGORIES[selection.categoryId];
    if (!category) continue;
    if (selection.size === 'regular') {
      slots[i] = { status: 'filled', subkitId: selection.subkitId, subkitName: category.name, subkitColor: category.colorBase, size: 'regular' };
      i += 1;
    } else {
      slots[i]     = { status: 'filled', subkitId: selection.subkitId, subkitName: category.name, subkitColor: category.colorBase, size: 'large', isLargeStart: true };
      slots[i + 1] = { status: 'filled', subkitId: selection.subkitId, subkitName: category.name, subkitColor: category.colorBase, size: 'large', isLargeEnd: true };
      i += 2;
    }
  }
  return slots;
}

export function isSlotsAtCapacity(selections: SubkitSelection[]): boolean {
  return calculateTotalSlots(selections) >= MAX_SLOTS;
}
```

---
