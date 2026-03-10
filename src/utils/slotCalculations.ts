import type { SubkitSelection, SubkitSize, SlotState, KitItem, ItemSelection } from '../types';
import { CATEGORIES } from '../data';

export const MAX_SLOTS = 6;

export function calculateTotalSlots(selections: SubkitSelection[]): number {
  return selections.reduce((total, s) => total + (s.size === 'large' ? 2 : 1), 0);
}

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

export function calculateSubkitWeightLbs(
  items: KitItem[],
  selections: Record<string, ItemSelection>,
  subkitId: string
): number {
  const totalGrams = items.reduce((sum, item) => {
    const key = `${subkitId}::${item.id}`;
    const sel = selections[key];
    if (!sel || item.weightGrams === null) return sum;
    return sum + item.weightGrams * sel.quantity;
  }, 0);
  return parseFloat((totalGrams / 453.592).toFixed(1));
}

export function calculateSubkitVolumePct(
  items: KitItem[],
  selections: Record<string, ItemSelection>,
  subkitId: string,
  capacityIn3: number
): number {
  if (capacityIn3 === 0) return 0;
  const totalVolume = items.reduce((sum, item) => {
    const key = `${subkitId}::${item.id}`;
    const sel = selections[key];
    if (!sel || item.volumeIn3 === null) return sum;
    return sum + item.volumeIn3 * sel.quantity;
  }, 0);
  return Math.round((totalVolume / capacityIn3) * 100);
}
