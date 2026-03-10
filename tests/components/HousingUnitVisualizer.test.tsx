import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { HousingUnitVisualizer } from '../../src/components/visualizer/HousingUnitVisualizer';
import { calculateSlotState } from '../../src/utils/slotCalculations';
import type { SubkitSelection } from '../../src/types';

expect.extend(matchers);

const emptySlots = calculateSlotState([]);

const makeSelection = (id: string, size: 'regular' | 'large', order: number): SubkitSelection => ({
  subkitId: id,
  categoryId: id,
  size,
  selectionOrder: order,
});

describe('HousingUnitVisualizer', () => {
  it('renders 6 slot containers', () => {
    const { container } = render(<HousingUnitVisualizer slots={emptySlots} />);
    expect(container.querySelectorAll('[data-testid^="slot-"]').length).toBe(6);
  });

  it('shows subkit name when slot is filled', () => {
    const slots = calculateSlotState([makeSelection('power', 'regular', 1)]);
    render(<HousingUnitVisualizer slots={slots} />);
    expect(screen.getByText('Power')).toBeInTheDocument();
  });

  it('applies category color as background on filled slots', () => {
    const slots = calculateSlotState([makeSelection('power', 'regular', 1)]);
    const { container } = render(<HousingUnitVisualizer slots={slots} />);
    const filledSlot = container.querySelector('[data-testid="slot-0"]') as HTMLElement;
    expect(filledSlot.style.backgroundColor).toBeTruthy();
  });

  it('renders large blocks spanning 2 slots with same color', () => {
    const slots = calculateSlotState([makeSelection('lighting', 'large', 1)]);
    const { container } = render(<HousingUnitVisualizer slots={slots} />);
    const slot0 = container.querySelector('[data-testid="slot-0"]') as HTMLElement;
    const slot1 = container.querySelector('[data-testid="slot-1"]') as HTMLElement;
    expect(slot0.style.backgroundColor).toBeTruthy();
    expect(slot1.style.backgroundColor).toBeTruthy();
    expect(slot0.style.backgroundColor).toBe(slot1.style.backgroundColor);
  });

  it('shows name only on large start slot, not large end', () => {
    const slots = calculateSlotState([makeSelection('lighting', 'large', 1)]);
    render(<HousingUnitVisualizer slots={slots} />);
    const names = screen.getAllByText('Lighting');
    expect(names).toHaveLength(1);
  });

  it('handles mixed config: 2 Large + 2 Regular = 6 slots filled', () => {
    const selections = [
      makeSelection('power', 'large', 1),
      makeSelection('lighting', 'large', 2),
      makeSelection('medical', 'regular', 3),
      makeSelection('hygiene', 'regular', 4),
    ];
    const slots = calculateSlotState(selections);
    const { container } = render(<HousingUnitVisualizer slots={slots} />);
    const filledSlots = slots.filter((s) => s.status === 'filled');
    expect(filledSlots).toHaveLength(6);
    expect(container.querySelectorAll('[data-testid^="slot-"]')).toHaveLength(6);
  });

  it('handles 6 Regular = 6 slots all filled', () => {
    const selections = [
      makeSelection('power', 'regular', 1),
      makeSelection('lighting', 'regular', 2),
      makeSelection('communications', 'regular', 3),
      makeSelection('hygiene', 'regular', 4),
      makeSelection('cooking', 'regular', 5),
      makeSelection('medical', 'regular', 6),
    ];
    const slots = calculateSlotState(selections);
    const filledSlots = slots.filter((s) => s.status === 'filled');
    expect(filledSlots).toHaveLength(6);
  });

  it('handles 3 Large = 6 slots all filled', () => {
    const selections = [
      makeSelection('power', 'large', 1),
      makeSelection('lighting', 'large', 2),
      makeSelection('communications', 'large', 3),
    ];
    const slots = calculateSlotState(selections);
    const filledSlots = slots.filter((s) => s.status === 'filled');
    expect(filledSlots).toHaveLength(6);
  });

  it('hides + icons in readOnly mode', () => {
    const { container } = render(<HousingUnitVisualizer slots={emptySlots} readOnly />);
    const svgIcons = container.querySelectorAll('svg');
    expect(svgIcons.length).toBe(0);
  });

  it('uses 44px slot height in readOnly mode', () => {
    const { container } = render(<HousingUnitVisualizer slots={emptySlots} readOnly />);
    const firstSlot = container.querySelector('[data-testid="slot-0"]') as HTMLElement;
    expect(firstSlot.style.height).toBe('44px');
  });

  it('has no accessibility violations with empty slots', async () => {
    const { container } = render(<HousingUnitVisualizer slots={emptySlots} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations with filled slots', async () => {
    const slots = calculateSlotState([
      makeSelection('power', 'regular', 1),
      makeSelection('lighting', 'large', 2),
    ]);
    const { container } = render(<HousingUnitVisualizer slots={slots} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders outer frame wrapper element', () => {
    const { container } = render(<HousingUnitVisualizer slots={emptySlots} />);
    const outerFrame = container.querySelector('[data-testid="outer-frame"]');
    expect(outerFrame).toBeInTheDocument();
  });

  it('renders handle tab element', () => {
    const { container } = render(<HousingUnitVisualizer slots={emptySlots} />);
    const handleTab = container.querySelector('[data-testid="handle-tab"]');
    expect(handleTab).toBeInTheDocument();
  });

  it('renders two wheel guard elements', () => {
    const { container } = render(<HousingUnitVisualizer slots={emptySlots} />);
    const wheelLeft = container.querySelector('[data-testid="wheel-guard-left"]');
    const wheelRight = container.querySelector('[data-testid="wheel-guard-right"]');
    expect(wheelLeft).toBeInTheDocument();
    expect(wheelRight).toBeInTheDocument();
  });
});
