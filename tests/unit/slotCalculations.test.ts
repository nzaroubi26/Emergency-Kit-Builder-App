import { describe, it, expect } from 'vitest';
import { calculateTotalSlots, calculateSlotState, canFitSize, isSlotsAtCapacity } from '../../src/utils/slotCalculations';
import type { SubkitSelection } from '../../src/types';

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
