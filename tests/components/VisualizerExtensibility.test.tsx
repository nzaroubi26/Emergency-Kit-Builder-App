import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { HousingUnitVisualizer } from '../../src/components/visualizer/HousingUnitVisualizer';
import { calculateSlotState } from '../../src/utils/slotCalculations';
import type { SubkitSelection } from '../../src/types';

expect.extend(matchers);

const emptySlots = calculateSlotState([]);
const filledSlots = calculateSlotState([
  { subkitId: 'power', categoryId: 'power', size: 'regular', selectionOrder: 1 },
]);

describe('Visualizer extensibility (Phase 2 readiness)', () => {
  it('calls onSlotClick with correct slotIndex when slot is clicked', () => {
    const handleClick = vi.fn();
    const { container } = render(
      <HousingUnitVisualizer slots={emptySlots} onSlotClick={handleClick} />
    );
    const slot2 = container.querySelector('[data-testid="slot-2"]') as HTMLElement;
    fireEvent.click(slot2);
    expect(handleClick).toHaveBeenCalledWith(2);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onSlotClick when prop is not provided', () => {
    const { container } = render(<HousingUnitVisualizer slots={emptySlots} />);
    const slot0 = container.querySelector('[data-testid="slot-0"]') as HTMLElement;
    fireEvent.click(slot0);
  });

  it('slots have role="button" when onSlotClick is provided', () => {
    const handleClick = vi.fn();
    const { container } = render(
      <HousingUnitVisualizer slots={emptySlots} onSlotClick={handleClick} />
    );
    const slot0 = container.querySelector('[data-testid="slot-0"]') as HTMLElement;
    expect(slot0.getAttribute('role')).toBe('button');
  });

  it('slots have role="group" when onSlotClick is not provided', () => {
    const { container } = render(<HousingUnitVisualizer slots={emptySlots} />);
    const slot0 = container.querySelector('[data-testid="slot-0"]') as HTMLElement;
    expect(slot0.getAttribute('role')).toBe('group');
  });

  it('slots have cursor-pointer when onSlotClick is provided', () => {
    const handleClick = vi.fn();
    const { container } = render(
      <HousingUnitVisualizer slots={emptySlots} onSlotClick={handleClick} />
    );
    const slot0 = container.querySelector('[data-testid="slot-0"]') as HTMLElement;
    expect(slot0.style.cursor).toBe('pointer');
  });

  it('each slot has unique data-testid from slot-0 to slot-5', () => {
    const { container } = render(<HousingUnitVisualizer slots={emptySlots} />);
    for (let i = 0; i < 6; i++) {
      const slot = container.querySelector(`[data-testid="slot-${i}"]`);
      expect(slot).toBeTruthy();
    }
  });

  it('onSlotClick works on filled slots too', () => {
    const handleClick = vi.fn();
    const { container } = render(
      <HousingUnitVisualizer slots={filledSlots} onSlotClick={handleClick} />
    );
    const slot0 = container.querySelector('[data-testid="slot-0"]') as HTMLElement;
    fireEvent.click(slot0);
    expect(handleClick).toHaveBeenCalledWith(0);
  });

  it('does not call onSlotClick in readOnly mode', () => {
    const handleClick = vi.fn();
    const { container } = render(
      <HousingUnitVisualizer slots={emptySlots} readOnly onSlotClick={handleClick} />
    );
    const slot0 = container.querySelector('[data-testid="slot-0"]') as HTMLElement;
    fireEvent.click(slot0);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('slots have role="group" in readOnly mode even with onSlotClick', () => {
    const handleClick = vi.fn();
    const { container } = render(
      <HousingUnitVisualizer slots={emptySlots} readOnly onSlotClick={handleClick} />
    );
    const slot0 = container.querySelector('[data-testid="slot-0"]') as HTMLElement;
    expect(slot0.getAttribute('role')).toBe('group');
  });

  it('has no accessibility violations with onSlotClick', async () => {
    const handleClick = vi.fn();
    const { container } = render(
      <HousingUnitVisualizer slots={filledSlots} onSlotClick={handleClick} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
