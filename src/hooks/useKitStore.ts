import { useMemo } from 'react';
import { useKitStore } from '../store/kitStore';
import { calculateSlotState, calculateTotalSlots, isSlotsAtCapacity } from '../utils/slotCalculations';

export const useSlotState = () => {
  const selectedSubkits = useKitStore((s) => s.selectedSubkits);
  return useMemo(() => calculateSlotState(selectedSubkits), [selectedSubkits]);
};

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
