import { describe, it, expect } from 'vitest';
import { computeElevatedSubkits } from '../../src/utils/elevationRules';
import type { EmergencyType, HouseholdOption } from '../../src/store/mcqStore';

describe('computeElevatedSubkits', () => {
  it('returns empty sets for empty inputs', () => {
    const result = computeElevatedSubkits([], []);
    expect(result.elevated.size).toBe(0);
    expect(result.q2Elevated.size).toBe(0);
  });

  it('handles "none" Q2 option with no elevation', () => {
    const result = computeElevatedSubkits([], ['none']);
    expect(result.elevated.size).toBe(0);
    expect(result.q2Elevated.size).toBe(0);
  });

  it('elevates flood Q1 → power, communications, cooking', () => {
    const result = computeElevatedSubkits(['flood'], []);
    expect(result.elevated).toEqual(new Set(['power', 'communications', 'cooking']));
    expect(result.q2Elevated.size).toBe(0);
  });

  it('elevates hurricane Q1 → same as flood', () => {
    const result = computeElevatedSubkits(['hurricane'], []);
    expect(result.elevated).toEqual(new Set(['power', 'communications', 'cooking']));
  });

  it('elevates tropical-storm Q1 → power, communications', () => {
    const result = computeElevatedSubkits(['tropical-storm'], []);
    expect(result.elevated).toEqual(new Set(['power', 'communications']));
  });

  it('elevates tornado Q1 → medical, lighting, clothing', () => {
    const result = computeElevatedSubkits(['tornado'], []);
    expect(result.elevated).toEqual(new Set(['medical', 'lighting', 'clothing']));
  });

  it('elevates kids Q2 → hygiene, medical, comfort', () => {
    const result = computeElevatedSubkits([], ['kids']);
    expect(result.elevated).toEqual(new Set(['hygiene', 'medical', 'comfort']));
    expect(result.q2Elevated).toEqual(new Set(['hygiene', 'medical', 'comfort']));
  });

  it('elevates pets Q2 → pets', () => {
    const result = computeElevatedSubkits([], ['pets']);
    expect(result.elevated).toEqual(new Set(['pets']));
    expect(result.q2Elevated).toEqual(new Set(['pets']));
  });

  it('deduplicates multiple Q1 types (flood + tornado)', () => {
    const result = computeElevatedSubkits(['flood', 'tornado'], []);
    expect(result.elevated).toEqual(new Set(['power', 'communications', 'cooking', 'medical', 'lighting', 'clothing']));
    expect(result.q2Elevated.size).toBe(0);
  });

  it('combines multiple Q2 options (kids + pets)', () => {
    const result = computeElevatedSubkits([], ['kids', 'pets']);
    expect(result.elevated).toEqual(new Set(['hygiene', 'medical', 'comfort', 'pets']));
    expect(result.q2Elevated).toEqual(new Set(['hygiene', 'medical', 'comfort', 'pets']));
  });

  it('deduplicates Q1 + Q2 overlap (tornado + kids → medical in both)', () => {
    const result = computeElevatedSubkits(['tornado'], ['kids']);
    // medical elevated by both Q1 and Q2
    expect(result.elevated.has('medical')).toBe(true);
    expect(result.q2Elevated.has('medical')).toBe(true);
    // lighting/clothing from Q1 only
    expect(result.elevated.has('lighting')).toBe(true);
    expect(result.q2Elevated.has('lighting')).toBe(false);
    // hygiene/comfort from Q2 only
    expect(result.elevated.has('hygiene')).toBe(true);
    expect(result.q2Elevated.has('hygiene')).toBe(true);
  });

  it('q2Elevated is always a subset of elevated', () => {
    const types: EmergencyType[] = ['flood', 'tornado'];
    const household: HouseholdOption[] = ['kids', 'older-adults', 'pets'];
    const result = computeElevatedSubkits(types, household);
    for (const id of result.q2Elevated) {
      expect(result.elevated.has(id)).toBe(true);
    }
  });
});
