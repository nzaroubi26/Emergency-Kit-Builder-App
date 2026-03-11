import { describe, it, expect } from 'vitest';
import type { SubkitSelection, ItemSelection, KitItem } from '../../src/types';
import {
  CONTAINER_PRICES,
  calculateItemLineTotal,
  calculateSubkitCartTotal,
  calculateCartGrandTotal,
} from '../../src/utils/cartCalculations';

describe('CONTAINER_PRICES', () => {
  it('CONTAINER_PRICES.regular equals 40', () => {
    expect(CONTAINER_PRICES.regular).toBe(40);
  });

  it('CONTAINER_PRICES.large equals 60', () => {
    expect(CONTAINER_PRICES.large).toBe(60);
  });
});

describe('calculateItemLineTotal', () => {
  it('returns price * quantity for valid price and qty 3', () => {
    expect(calculateItemLineTotal(19.99, 3)).toBeCloseTo(59.97);
  });

  it('returns 0 when pricePlaceholder is null', () => {
    expect(calculateItemLineTotal(null, 5)).toBe(0);
  });

  it('returns 0 when pricePlaceholder is 0', () => {
    expect(calculateItemLineTotal(0, 5)).toBe(0);
  });
});

describe('calculateSubkitCartTotal', () => {
  it('Regular container + 1 included item (pricePlaceholder: 14.99, qty: 2) = 40 + 29.98', () => {
    const subkit: SubkitSelection = { subkitId: 'test', categoryId: 'test', size: 'regular', selectionOrder: 1 };
    const itemSelections: Record<string, ItemSelection> = {
      'sel-1': { subkitId: 'test', itemId: 'item-1', quantity: 2, included: true },
    };
    const allItems: KitItem[] = [
      { id: 'item-1', categoryId: 'test', name: 'Test', description: '', rating: null, reviewCount: null, weightGrams: null, volumeIn3: null, productId: null, pricePlaceholder: 14.99, imageSrc: null },
    ];
    const result = calculateSubkitCartTotal(subkit, itemSelections, allItems);
    expect(result).toBeCloseTo(69.98);
  });

  it('Large container + no included items = 60', () => {
    const subkit: SubkitSelection = { subkitId: 'test', categoryId: 'test', size: 'large', selectionOrder: 1 };
    const result = calculateSubkitCartTotal(subkit, {}, []);
    expect(result).toBe(60);
  });

  it('Regular container + item with null pricePlaceholder = 40', () => {
    const subkit: SubkitSelection = { subkitId: 'test', categoryId: 'test', size: 'regular', selectionOrder: 1 };
    const itemSelections: Record<string, ItemSelection> = {
      'sel-1': { subkitId: 'test', itemId: 'item-1', quantity: 1, included: true },
    };
    const allItems: KitItem[] = [
      { id: 'item-1', categoryId: 'test', name: 'Test', description: '', rating: null, reviewCount: null, weightGrams: null, volumeIn3: null, productId: null, pricePlaceholder: null, imageSrc: null },
    ];
    const result = calculateSubkitCartTotal(subkit, itemSelections, allItems);
    expect(result).toBe(40);
  });
});

describe('calculateCartGrandTotal', () => {
  it('2 Regular subkits, no items = 80', () => {
    const subkits: SubkitSelection[] = [
      { subkitId: 'a', categoryId: 'test', size: 'regular', selectionOrder: 1 },
      { subkitId: 'b', categoryId: 'test', size: 'regular', selectionOrder: 2 },
    ];
    const result = calculateCartGrandTotal(subkits, {}, []);
    expect(result).toBe(80);
  });

  it('empty selectedSubkits array = 0', () => {
    const result = calculateCartGrandTotal([], {}, []);
    expect(result).toBe(0);
  });
});
