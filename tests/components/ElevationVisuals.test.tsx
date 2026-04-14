import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ElevationBadge } from '../../src/components/subkit-selection/ElevationBadge';
import { ElevationGroupHeader } from '../../src/components/subkit-selection/ElevationGroupHeader';
import { SubkitCard } from '../../src/components/subkit-selection/SubkitCard';
import type { KitCategory } from '../../src/types';

const mockCategory: KitCategory = {
  id: 'power',
  name: 'Power',
  colorBase: '#C2410C',
  colorTint: '#FFF7ED',
  icon: 'Zap',
  description: 'Charge devices and power essentials without the grid',
  sizeOptions: ['regular', 'large'],
};

describe('ElevationBadge', () => {
  it('renders badge visibly when visible is true', () => {
    render(<ElevationBadge visible={true} />);
    const badge = screen.getByText('Suggested for you').parentElement!;
    expect(badge.style.opacity).toBe('1');
  });

  it('renders badge hidden (opacity 0) when visible is false', () => {
    render(<ElevationBadge visible={false} />);
    const badge = screen.getByText('Suggested for you').parentElement!;
    expect(badge.style.opacity).toBe('0');
    expect(badge.getAttribute('aria-hidden')).toBe('true');
  });
});

describe('ElevationGroupHeader', () => {
  it('renders header when visible is true', () => {
    render(<ElevationGroupHeader visible={true} />);
    expect(screen.getByText('Suggested for your situation')).toBeInTheDocument();
  });

  it('does not render when visible is false', () => {
    render(<ElevationGroupHeader visible={false} />);
    expect(screen.queryByText('Suggested for your situation')).not.toBeInTheDocument();
  });
});

describe('SubkitCard elevation', () => {
  const onSelect = vi.fn();

  beforeEach(() => {
    onSelect.mockClear();
  });

  it('shows badge when elevated and unselected', () => {
    render(
      <SubkitCard
        category={mockCategory}
        selected={false}
        disabled={false}
        elevated={true}
        onSelect={onSelect}
      />
    );
    const badge = screen.getByText('Suggested for you').parentElement!;
    expect(badge.style.opacity).toBe('1');
  });

  it('hides badge when elevated and selected', () => {
    render(
      <SubkitCard
        category={mockCategory}
        selected={true}
        disabled={false}
        elevated={true}
        onSelect={onSelect}
      />
    );
    const badge = screen.getByText('Suggested for you').parentElement!;
    expect(badge.style.opacity).toBe('0');
  });

  it('hides badge when not elevated', () => {
    render(
      <SubkitCard
        category={mockCategory}
        selected={false}
        disabled={false}
        elevated={false}
        onSelect={onSelect}
      />
    );
    const badge = screen.getByText('Suggested for you').parentElement!;
    expect(badge.style.opacity).toBe('0');
  });

  it('uses correct aria-label when elevated and unselected', () => {
    render(
      <SubkitCard
        category={mockCategory}
        selected={false}
        disabled={false}
        elevated={true}
        onSelect={onSelect}
      />
    );
    expect(screen.getByRole('button', { name: 'Power — Suggested for your situation' })).toBeInTheDocument();
  });

  it('uses correct aria-label when elevated and selected', () => {
    render(
      <SubkitCard
        category={mockCategory}
        selected={true}
        disabled={false}
        elevated={true}
        onSelect={onSelect}
      />
    );
    expect(screen.getByRole('button', { name: 'Power, selected' })).toBeInTheDocument();
  });

  it('applies green left border when elevated and unselected', () => {
    const { container } = render(
      <SubkitCard
        category={mockCategory}
        selected={false}
        disabled={false}
        elevated={true}
        onSelect={onSelect}
      />
    );
    const card = container.querySelector('.subkit-card') as HTMLElement;
    expect(card.style.borderLeftColor).toBe('rgb(34, 197, 94)');
    expect(card.style.borderLeftWidth).toBe('3px');
  });
});
