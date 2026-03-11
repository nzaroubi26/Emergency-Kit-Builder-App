import type { KitItem, SubkitSelection, ItemSelection } from '../types';

export const CONTAINER_PRICES: Record<'regular' | 'large', number> = {
  regular: 40,
  large: 60,
};

export function calculateItemLineTotal(
  pricePlaceholder: number | null,
  quantity: number
): number {
  if (!pricePlaceholder) {
    return 0;
  }
  return pricePlaceholder * quantity;
}

export function calculateSubkitCartTotal(
  subkit: SubkitSelection,
  itemSelections: Record<string, ItemSelection>,
  allItems: KitItem[]
): number {
  let total = CONTAINER_PRICES[subkit.size];

  for (const sel of Object.values(itemSelections)) {
    if (sel.subkitId === subkit.subkitId && sel.included) {
      const matchingItem = allItems.find((i) => i.id === sel.itemId);
      if (matchingItem) {
        total += calculateItemLineTotal(matchingItem.pricePlaceholder, sel.quantity);
      }
    }
  }

  return total;
}

export function calculateCartGrandTotal(
  selectedSubkits: SubkitSelection[],
  itemSelections: Record<string, ItemSelection>,
  allItems: KitItem[]
): number {
  return selectedSubkits.reduce(
    (sum, subkit) => sum + calculateSubkitCartTotal(subkit, itemSelections, allItems),
    0
  );
}
