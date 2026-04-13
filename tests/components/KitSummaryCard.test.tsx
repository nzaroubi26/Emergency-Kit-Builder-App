import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { KitSummaryCard } from '../../src/components/review/KitSummaryCard';

describe('KitSummaryCard', () => {
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

  it('renders Sprint 2 placeholder for custom path', () => {
    render(<KitSummaryCard path="custom" />);
    expect(screen.getByText('Custom kit summary — Sprint 2')).toBeInTheDocument();
  });
});
