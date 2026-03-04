import type { SubkitSelection, ItemSelection } from '../types';
import { ENV } from '../tokens/env';

export interface CheckoutPayload {
  kitId: string;
  subkits: Array<{
    subkitId: string;
    categoryId: string;
    size: 'regular' | 'large';
    selectionOrder: number;
    items: Array<{
      itemId: string;
      quantity: number;
    }>;
    emptyContainer: boolean;
  }>;
}

export type CheckoutResult =
  | { success: true; redirectUrl: string }
  | { success: false; errorMessage: string };

function buildPayload(
  selectedSubkits: SubkitSelection[],
  itemSelections: Record<string, ItemSelection>,
  emptyContainers: string[]
): CheckoutPayload {
  return {
    kitId: crypto.randomUUID(),
    subkits: selectedSubkits.map((s) => ({
      subkitId: s.subkitId,
      categoryId: s.categoryId,
      size: s.size,
      selectionOrder: s.selectionOrder,
      emptyContainer: emptyContainers.includes(s.subkitId),
      items: Object.values(itemSelections)
        .filter((sel) => sel.subkitId === s.subkitId)
        .map((sel) => ({ itemId: sel.itemId, quantity: sel.quantity })),
    })),
  };
}

export async function initiateCheckout(
  selectedSubkits: SubkitSelection[],
  itemSelections: Record<string, ItemSelection>,
  emptyContainers: string[]
): Promise<CheckoutResult> {
  const payload = buildPayload(selectedSubkits, itemSelections, emptyContainers);
  try {
    const response = await fetch(ENV.purchaseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      return { success: false, errorMessage: 'Something went wrong. Please try again.' };
    }
    const data = await response.json() as { redirectUrl: string };
    return { success: true, redirectUrl: data.redirectUrl };
  } catch {
    return { success: false, errorMessage: 'Unable to connect. Please check your connection and try again.' };
  }
}
