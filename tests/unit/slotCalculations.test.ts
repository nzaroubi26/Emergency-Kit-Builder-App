import { describe, it, expect } from 'vitest';
import { calculateTotalSlots, calculateSlotState, canFitSize, isSlotsAtCapacity, calculateSubkitWeightLbs, calculateSubkitVolumePct } from '../../src/utils/slotCalculations';
import type { SubkitSelection, KitItem, ItemSelection } from '../../src/types';

const sel = (id: string, size: 'regular' | 'large', order: number): SubkitSelection =>
  ({ subkitId: id, categoryId: id, size, selectionOrder: order });

describe('calculateTotalSlots', () => {
  it('counts regular as 1 slot', () => expect(calculateTotalSlots([sel('power', 'regular', 1)])).toBe(1));
  it('counts large as 2 slots', () => expect(calculateTotalSlots([sel('power', 'large', 1)])).toBe(2));
  it('handles mixed sizes', () => expect(calculateTotalSlots([sel('power', 'large', 1), sel('lighting', 'regular', 2), sel('hygiene', 'regular', 3)])).toBe(4));
  it('returns 0 for empty', () => expect(calculateTotalSlots([])).toBe(0));
});

describe('canFitSize', () => {
  it('blocks large when switching would exceed 6', () => {
    const s = [sel('power', 'large', 1), sel('lighting', 'large', 2), sel('hygiene', 'regular', 3), sel('cooking', 'regular', 4)];
    expect(canFitSize(s, 'hygiene', 'large', 6)).toBe(false);
  });
  it('allows large when slots are available', () => {
    expect(canFitSize([sel('power', 'regular', 1)], 'power', 'large', 6)).toBe(true);
  });
  it('allows shrinking large to regular always', () => {
    const s = [sel('power', 'large', 1), sel('lighting', 'large', 2), sel('hygiene', 'regular', 3)];
    expect(canFitSize(s, 'power', 'regular', 6)).toBe(true);
  });
});

describe('calculateSlotState', () => {
  it('always returns exactly 6 slots', () => {
    expect(calculateSlotState([]).length).toBe(6);
    expect(calculateSlotState([sel('power', 'large', 1), sel('medical', 'large', 2), sel('hygiene', 'regular', 3)]).length).toBe(6);
  });
  it('fills top-to-bottom in selection order', () => {
    const slots = calculateSlotState([sel('power', 'regular', 1)]);
    expect(slots[0].status).toBe('filled');
    expect(slots[1].status).toBe('empty');
  });
  it('sets isLargeStart and isLargeEnd on large blocks', () => {
    const slots = calculateSlotState([sel('power', 'large', 1)]);
    expect(slots[0].isLargeStart).toBe(true);
    expect(slots[1].isLargeEnd).toBe(true);
    expect(slots[2].status).toBe('empty');
  });
  it('all slots empty when no selections', () => {
    calculateSlotState([]).forEach((s) => expect(s.status).toBe('empty'));
  });
  it('does not exceed 6 slots even with overflow input', () => {
    const over = [
      sel('power', 'regular', 1),
      sel('lighting', 'regular', 2),
      sel('communications', 'regular', 3),
      sel('hygiene', 'regular', 4),
      sel('cooking', 'regular', 5),
      sel('medical', 'regular', 6),
      sel('comfort', 'regular', 7),
    ];
    const slots = calculateSlotState(over);
    expect(slots.length).toBe(6);
    expect(slots.filter((s) => s.status === 'filled').length).toBe(6);
  });
  it('skips selections with unknown category IDs', () => {
    const slots = calculateSlotState([sel('nonexistent', 'regular', 1)]);
    expect(slots.every((s) => s.status === 'empty')).toBe(true);
  });
});

describe('isSlotsAtCapacity', () => {
  it('returns true at exactly 6 slots', () => {
    const s = [
      sel('power', 'regular', 1),
      sel('lighting', 'regular', 2),
      sel('communications', 'regular', 3),
      sel('hygiene', 'regular', 4),
      sel('cooking', 'regular', 5),
      sel('medical', 'regular', 6),
    ];
    expect(isSlotsAtCapacity(s)).toBe(true);
  });
  it('returns false below 6 slots', () => {
    expect(isSlotsAtCapacity([sel('power', 'regular', 1)])).toBe(false);
  });
});

const mockItem = (id: string, weightGrams: number | null, volumeIn3: number | null): KitItem => ({
  id,
  categoryId: 'power',
  name: id,
  description: '',
  rating: null,
  reviewCount: null,
  weightGrams,
  volumeIn3,
  productId: null,
  pricePlaceholder: null,
  imageSrc: null,
});

const mockSel = (subkitId: string, itemId: string, quantity: number): ItemSelection => ({
  itemId,
  subkitId,
  quantity,
});

describe('calculateSubkitWeightLbs', () => {
  const items = [
    mockItem('item-a', 454, 100),
    mockItem('item-b', 227, 50),
  ];

  it('returns correct lbs with all items at qty 1', () => {
    const selections: Record<string, ItemSelection> = {
      'sub1::item-a': mockSel('sub1', 'item-a', 1),
      'sub1::item-b': mockSel('sub1', 'item-b', 1),
    };
    const result = calculateSubkitWeightLbs(items, selections, 'sub1');
    expect(result).toBe(parseFloat(((454 + 227) / 453.592).toFixed(1)));
  });

  it('returns correct weighted lbs with mixed quantities', () => {
    const selections: Record<string, ItemSelection> = {
      'sub1::item-a': mockSel('sub1', 'item-a', 3),
      'sub1::item-b': mockSel('sub1', 'item-b', 2),
    };
    const result = calculateSubkitWeightLbs(items, selections, 'sub1');
    expect(result).toBe(parseFloat(((454 * 3 + 227 * 2) / 453.592).toFixed(1)));
  });

  it('returns 0 with no items selected', () => {
    expect(calculateSubkitWeightLbs(items, {}, 'sub1')).toBe(0);
  });

  it('skips items with null weightGrams gracefully', () => {
    const itemsWithNull = [mockItem('item-a', 454, 100), mockItem('item-c', null, 50)];
    const selections: Record<string, ItemSelection> = {
      'sub1::item-a': mockSel('sub1', 'item-a', 1),
      'sub1::item-c': mockSel('sub1', 'item-c', 1),
    };
    const result = calculateSubkitWeightLbs(itemsWithNull, selections, 'sub1');
    expect(result).toBe(parseFloat((454 / 453.592).toFixed(1)));
  });
});

describe('calculateSubkitVolumePct', () => {
  const items = [
    mockItem('item-a', 454, 100),
    mockItem('item-b', 227, 50),
  ];

  it('returns correct integer percentage with Regular capacity (1728 in³)', () => {
    const selections: Record<string, ItemSelection> = {
      'sub1::item-a': mockSel('sub1', 'item-a', 1),
      'sub1::item-b': mockSel('sub1', 'item-b', 1),
    };
    const result = calculateSubkitVolumePct(items, selections, 'sub1', 1728);
    expect(result).toBe(Math.round(((100 + 50) / 1728) * 100));
  });

  it('returns correct integer percentage with Large capacity (3456 in³)', () => {
    const selections: Record<string, ItemSelection> = {
      'sub1::item-a': mockSel('sub1', 'item-a', 1),
      'sub1::item-b': mockSel('sub1', 'item-b', 1),
    };
    const result = calculateSubkitVolumePct(items, selections, 'sub1', 3456);
    expect(result).toBe(Math.round(((100 + 50) / 3456) * 100));
  });

  it('returns 0 with no items selected', () => {
    expect(calculateSubkitVolumePct(items, {}, 'sub1', 1728)).toBe(0);
  });

  it('returns unclamped integer for over-capacity', () => {
    const bigItems = [mockItem('item-x', 454, 1000), mockItem('item-y', 227, 1000)];
    const selections: Record<string, ItemSelection> = {
      'sub1::item-x': mockSel('sub1', 'item-x', 1),
      'sub1::item-y': mockSel('sub1', 'item-y', 1),
    };
    const result = calculateSubkitVolumePct(bigItems, selections, 'sub1', 1728);
    expect(result).toBe(Math.round((2000 / 1728) * 100));
    expect(result).toBeGreaterThan(100);
  });
});
