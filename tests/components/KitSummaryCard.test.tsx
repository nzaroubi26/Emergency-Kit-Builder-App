import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { KitSummaryCard } from '../../src/components/review/KitSummaryCard';
import { useKitStore } from '../../src/store/kitStore';

describe('KitSummaryCard', () => {
  beforeEach(() => {
    useKitStore.setState({
      selectedSubkits: [],
      itemSelections: {},
      emptyContainers: [],
      currentConfigIndex: 0,
    });
  });

  it('renders all four Essentials subkits', () => {
    render(<KitSummaryCard path="essentials" />);
    expect(screen.getByText('Power')).toBeInTheDocument();
    expect(screen.getByText('Cooking')).toBeInTheDocument();
    expect(screen.getByText('Medical')).toBeInTheDocument();
    expect(screen.getByText('Communications')).toBeInTheDocument();
  });

  it('shows correct size labels', () => {
    render(<KitSummaryCard path="essentials" />);
    expect(screen.getByText('Large')).toBeInTheDocument();
    expect(screen.getAllByText('Regular')).toHaveLength(3);
  });

  it('displays slot count as 5 of 6', () => {
    render(<KitSummaryCard path="essentials" />);
    expect(screen.getByText('5 of 6 slots used')).toBeInTheDocument();
  });

  it('renders category color indicators', () => {
    const { container } = render(<KitSummaryCard path="essentials" />);
    const colorDots = container.querySelectorAll('[aria-hidden="true"]');
    expect(colorDots.length).toBe(4);
  });

  describe('custom path', () => {
    it('renders all user-selected subkits', () => {
      useKitStore.setState({
        selectedSubkits: [
          { subkitId: 'power', categoryId: 'power', size: 'regular', selectionOrder: 1 },
          { subkitId: 'medical', categoryId: 'medical', size: 'large', selectionOrder: 2 },
        ],
        itemSelections: {},
      });
      render(<KitSummaryCard path="custom" />);
      expect(screen.getByText('Power')).toBeInTheDocument();
      expect(screen.getByText('Medical')).toBeInTheDocument();
    });

    it('displays correct item counts and subtotals', () => {
      useKitStore.setState({
        selectedSubkits: [
          { subkitId: 'power', categoryId: 'power', size: 'regular', selectionOrder: 1 },
        ],
        itemSelections: {
          'power::power-station': { itemId: 'power-station', subkitId: 'power', quantity: 1, included: true },
          'power::power-solar': { itemId: 'power-solar', subkitId: 'power', quantity: 1, included: true },
        },
      });
      render(<KitSummaryCard path="custom" />);
      // 2 items, container $40 + $149.99 + $79.99 = $269.98
      expect(screen.getByText('2 items · $269.98')).toBeInTheDocument();
    });

    it('computes correct slot count', () => {
      useKitStore.setState({
        selectedSubkits: [
          { subkitId: 'power', categoryId: 'power', size: 'large', selectionOrder: 1 },
          { subkitId: 'medical', categoryId: 'medical', size: 'regular', selectionOrder: 2 },
        ],
        itemSelections: {},
      });
      render(<KitSummaryCard path="custom" />);
      // large = 2 slots + regular = 1 slot = 3
      expect(screen.getByText('Custom Kit · 3 slots used')).toBeInTheDocument();
    });

    it('shows "No items configured" for subkit with zero items', () => {
      useKitStore.setState({
        selectedSubkits: [
          { subkitId: 'power', categoryId: 'power', size: 'regular', selectionOrder: 1 },
        ],
        itemSelections: {},
      });
      render(<KitSummaryCard path="custom" />);
      expect(screen.getByText('No items configured')).toBeInTheDocument();
    });

    it('handles empty container edge case', () => {
      useKitStore.setState({
        selectedSubkits: [],
        itemSelections: {},
      });
      render(<KitSummaryCard path="custom" />);
      expect(screen.getByText('Custom Kit · 0 slots used')).toBeInTheDocument();
    });
  });
});
