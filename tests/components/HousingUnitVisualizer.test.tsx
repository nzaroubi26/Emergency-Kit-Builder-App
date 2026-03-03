import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { HousingUnitVisualizer } from '../../src/components/visualizer/HousingUnitVisualizer';
import { calculateSlotState } from '../../src/utils/slotCalculations';

expect.extend(matchers);

const emptySlots = calculateSlotState([]);

describe('HousingUnitVisualizer', () => {
  it('renders 6 slot containers', () => {
    const { container } = render(<HousingUnitVisualizer slots={emptySlots} />);
    expect(container.querySelectorAll('[data-testid^="slot-"]').length).toBe(6);
  });

  it('shows subkit name when slot is filled', () => {
    const slots = calculateSlotState([{ subkitId: 'power', categoryId: 'power', size: 'regular', selectionOrder: 1 }]);
    render(<HousingUnitVisualizer slots={slots} />);
    expect(screen.getByText('Power')).toBeInTheDocument();
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

  it('has no accessibility violations', async () => {
    const { container } = render(<HousingUnitVisualizer slots={emptySlots} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
