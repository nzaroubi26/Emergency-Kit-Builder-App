import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { SubkitCard } from '../../src/components/subkit-selection/SubkitCard';
import type { KitCategory } from '../../src/types';

expect.extend(matchers);

const mockCategory: KitCategory = {
  id: 'power',
  name: 'Power',
  colorBase: '#C2410C',
  colorTint: '#FFF7ED',
  icon: 'Zap',
  description: 'Charge devices and power essentials without the grid',
  sizeOptions: ['regular', 'large'],
};

const customCategory: KitCategory = {
  id: 'custom',
  name: 'Custom',
  colorBase: '#3730A3',
  colorTint: '#EEF2FF',
  icon: 'Settings2',
  description: 'Choose any items from across all categories',
  sizeOptions: ['regular', 'large'],
};

describe('SubkitCard', () => {
  it('renders name, icon, and description', () => {
    render(<SubkitCard category={mockCategory} selected={false} disabled={false} onSelect={vi.fn()} />);
    expect(screen.getByText('Power')).toBeInTheDocument();
    expect(screen.getByText(/Charge devices/)).toBeInTheDocument();
  });

  it('renders an SVG icon from lucide-react', () => {
    const { container } = render(
      <SubkitCard category={mockCategory} selected={false} disabled={false} onSelect={vi.fn()} />
    );
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('has aria-pressed=true when selected', () => {
    render(<SubkitCard category={mockCategory} selected={true} disabled={false} onSelect={vi.fn()} />);
    const card = screen.getByRole('button');
    expect(card.getAttribute('aria-pressed')).toBe('true');
  });

  it('has aria-pressed=false when not selected', () => {
    render(<SubkitCard category={mockCategory} selected={false} disabled={false} onSelect={vi.fn()} />);
    const card = screen.getByRole('button');
    expect(card.getAttribute('aria-pressed')).toBe('false');
  });

  it('shows checkmark when selected', () => {
    const { container } = render(
      <SubkitCard category={mockCategory} selected={true} disabled={false} onSelect={vi.fn()} />
    );
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThanOrEqual(2);
  });

  it('calls onSelect with categoryId when clicked', () => {
    const handleSelect = vi.fn();
    render(<SubkitCard category={mockCategory} selected={false} disabled={false} onSelect={handleSelect} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleSelect).toHaveBeenCalledWith('power');
  });

  it('calls onSelect on Enter key', () => {
    const handleSelect = vi.fn();
    render(<SubkitCard category={mockCategory} selected={false} disabled={false} onSelect={handleSelect} />);
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
    expect(handleSelect).toHaveBeenCalledWith('power');
  });

  it('does not call onSelect when disabled and not selected', () => {
    const handleSelect = vi.fn();
    render(<SubkitCard category={mockCategory} selected={false} disabled={true} onSelect={handleSelect} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleSelect).not.toHaveBeenCalled();
  });

  it('allows deselect even when at capacity', () => {
    const handleSelect = vi.fn();
    render(<SubkitCard category={mockCategory} selected={true} disabled={true} onSelect={handleSelect} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleSelect).toHaveBeenCalledWith('power');
  });

  it('applies disabled aria attribute when disabled and not selected', () => {
    render(<SubkitCard category={mockCategory} selected={false} disabled={true} onSelect={vi.fn()} />);
    const card = screen.getByRole('button');
    expect(card.getAttribute('aria-disabled')).toBe('true');
  });

  it('Custom card shows "Mix & Match" badge', () => {
    render(<SubkitCard category={customCategory} selected={false} disabled={false} onSelect={vi.fn()} />);
    expect(screen.getByText('Mix & Match')).toBeInTheDocument();
  });

  it('Custom card has dashed border when not selected', () => {
    const { container } = render(
      <SubkitCard category={customCategory} selected={false} disabled={false} onSelect={vi.fn()} />
    );
    const card = container.querySelector('.subkit-card');
    expect(card?.className).toContain('border-dashed');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <SubkitCard category={mockCategory} selected={false} disabled={false} onSelect={vi.fn()} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations when selected', async () => {
    const { container } = render(
      <SubkitCard category={mockCategory} selected={true} disabled={false} onSelect={vi.fn()} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
