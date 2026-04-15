import { describe, it, expect } from 'vitest';
import { getOrderedCategories } from '../../src/utils/subkitOrdering';

describe('getOrderedCategories', () => {
  it('Hurricane: Power, Medical, Communications, then remaining default', () => {
    const result = getOrderedCategories('hurricane', []);
    expect(result).toEqual([
      'power', 'medical', 'communications',
      'lighting', 'cooking', 'hygiene', 'comfort', 'clothing',
    ]);
  });

  it('Flood: Power, Clothing, Medical, then remaining default', () => {
    const result = getOrderedCategories('flood', []);
    expect(result).toEqual([
      'power', 'clothing', 'medical',
      'communications', 'lighting', 'cooking', 'hygiene', 'comfort',
    ]);
  });

  it('Tornado: Power, Cooking, Medical, then remaining default', () => {
    const result = getOrderedCategories('tornado', []);
    expect(result).toEqual([
      'power', 'cooking', 'medical',
      'communications', 'lighting', 'hygiene', 'comfort', 'clothing',
    ]);
  });

  it('Tropical Storm: Power, Medical, Communications, then remaining default', () => {
    const result = getOrderedCategories('tropical-storm', []);
    expect(result).toEqual([
      'power', 'medical', 'communications',
      'lighting', 'cooking', 'hygiene', 'comfort', 'clothing',
    ]);
  });

  it('undefined emergency type uses full default order', () => {
    const result = getOrderedCategories(undefined, []);
    expect(result).toEqual([
      'power', 'medical', 'communications', 'lighting',
      'cooking', 'hygiene', 'comfort', 'clothing',
    ]);
  });

  it('includes Pets last when householdComposition includes pets', () => {
    const result = getOrderedCategories('hurricane', ['pets']);
    expect(result[result.length - 1]).toBe('pets');
    expect(result).toHaveLength(9);
  });

  it('excludes Pets when householdComposition does not include pets', () => {
    const result = getOrderedCategories('hurricane', []);
    expect(result).not.toContain('pets');
    expect(result).toHaveLength(8);
  });

  it('excludes Pets when householdComposition has other options but not pets', () => {
    const result = getOrderedCategories('flood', ['kids', 'older-adults']);
    expect(result).not.toContain('pets');
  });

  it('no duplicate categories in any output', () => {
    const types = ['hurricane', 'flood', 'tornado', 'tropical-storm', undefined] as const;
    for (const emergencyType of types) {
      const result = getOrderedCategories(emergencyType, ['pets']);
      const unique = new Set(result);
      expect(unique.size, `duplicates found for ${emergencyType}`).toBe(result.length);
    }
  });

  it('never includes Custom category', () => {
    const types = ['hurricane', 'flood', 'tornado', 'tropical-storm', undefined] as const;
    for (const emergencyType of types) {
      const result = getOrderedCategories(emergencyType, ['pets']);
      expect(result, `Custom found for ${emergencyType}`).not.toContain('custom');
    }
  });
});
