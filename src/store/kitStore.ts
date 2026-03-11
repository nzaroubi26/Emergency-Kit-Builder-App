import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { calculateTotalSlots, canFitSize } from '../utils/slotCalculations';
import type { SubkitSelection, ItemSelection, SubkitSize } from '../types';

const MAX_SLOTS = 6;

interface KitStore {
  selectedSubkits: SubkitSelection[];
  itemSelections: Record<string, ItemSelection>;
  emptyContainers: string[];
  currentConfigIndex: number;

  selectSubkit: (categoryId: string) => void;
  deselectSubkit: (subkitId: string) => void;
  setSubkitSize: (subkitId: string, size: SubkitSize) => boolean;
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

export const useKitStore = create<KitStore>()(persist((set, get) => ({
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
    if (emptyContainers.includes(subkitId)) return;
    const key = `${subkitId}::${itemId}`;
    if (itemSelections[key]) {
      const { [key]: _, ...rest } = itemSelections;
      set({ itemSelections: rest });
    } else {
      set({ itemSelections: { ...itemSelections, [key]: { itemId, subkitId, quantity: 1, included: true } } });
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
}), {
  name: 'emergency-kit-v1',
  version: 1,
  migrate: (persisted, version) => {
    const state = persisted as Record<string, unknown>;
    if (version === 0) {
      const selections = state.itemSelections as Record<string, ItemSelection> | undefined;
      if (selections) {
        const migrated: Record<string, ItemSelection> = {};
        for (const [key, sel] of Object.entries(selections)) {
          migrated[key] = { ...sel, included: sel.included ?? true };
        }
        state.itemSelections = migrated;
      }
    }
    return state as unknown as KitStore;
  },
}));
