import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { ItemCard } from '../../src/components/item-config/ItemCard';
import type { KitItem, KitCategory } from '../../src/types';

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

const mockItem: KitItem = {
  id: 'power-station',
  categoryId: 'power',
  name: 'Portable Power Station',
  description: 'Lithium battery for device charging',
  productId: null,
  pricePlaceholder: null,
  imageSrc: null,
};

const mockItemWithPrice: KitItem = {
  id: 'solar-panel',
  categoryId: 'power',
  name: 'Solar Panel',
  description: 'Portable solar charger',
  rating: 4.5,
  reviewCount: 128,
  weightGrams: 2500,
  volumeIn3: 200,
  productId: null,
  pricePlaceholder: 29.99,
  imageSrc: null,
};

const defaultCardProps = {
  item: mockItem,
  category: mockCategory,
  included: false,
  quantity: 1,
  onToggle: vi.fn(),
  onIncrement: vi.fn(),
  onDecrement: vi.fn(),
};

describe('ItemCard', () => {
  it('renders item name and description', () => {
    render(<ItemCard {...defaultCardProps} />);
    expect(screen.getByText('Portable Power Station')).toBeInTheDocument();
    expect(screen.getByText('Lithium battery for device charging')).toBeInTheDocument();
  });

  it('is excluded by default (aria-pressed=false)', () => {
    render(<ItemCard {...defaultCardProps} />);
    const btn = screen.getByRole('button', { name: /Portable Power Station, excluded/i });
    expect(btn).toHaveAttribute('aria-pressed', 'false');
  });

  it('shows included state (aria-pressed=true)', () => {
    render(<ItemCard {...defaultCardProps} included={true} />);
    const btn = screen.getByRole('button', { name: /Portable Power Station, included/i });
    expect(btn).toHaveAttribute('aria-pressed', 'true');
  });

  it('calls onToggle with itemId when clicked', () => {
    const handleToggle = vi.fn();
    render(<ItemCard {...defaultCardProps} onToggle={handleToggle} />);
    fireEvent.click(screen.getByRole('button', { name: /Portable Power Station/i }));
    expect(handleToggle).toHaveBeenCalledWith('power-station');
  });

  it('calls onToggle on Enter key', () => {
    const handleToggle = vi.fn();
    render(<ItemCard {...defaultCardProps} onToggle={handleToggle} />);
    fireEvent.keyDown(screen.getByRole('button', { name: /Portable Power Station/i }), { key: 'Enter' });
    expect(handleToggle).toHaveBeenCalledWith('power-station');
  });

  it('calls onToggle on Space key', () => {
    const handleToggle = vi.fn();
    render(<ItemCard {...defaultCardProps} onToggle={handleToggle} />);
    fireEvent.keyDown(screen.getByRole('button', { name: /Portable Power Station/i }), { key: ' ' });
    expect(handleToggle).toHaveBeenCalledWith('power-station');
  });

  it('renders fallback image with category icon when imageSrc is null', () => {
    const { container } = render(<ItemCard {...defaultCardProps} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('shows quantity selector when included', () => {
    render(<ItemCard {...defaultCardProps} included={true} quantity={3} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('hides quantity selector visually when excluded', () => {
    render(<ItemCard {...defaultCardProps} included={false} quantity={1} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('has no accessibility violations when excluded', async () => {
    const { container } = render(<ItemCard {...defaultCardProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations when included', async () => {
    const { container } = render(<ItemCard {...defaultCardProps} included={true} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders price for item with non-null pricePlaceholder', () => {
    render(<ItemCard {...defaultCardProps} item={mockItemWithPrice} />);
    expect(screen.getByText('$29.99')).toBeInTheDocument();
  });

  it('does not render price for item with null pricePlaceholder', () => {
    render(<ItemCard {...defaultCardProps} />);
    expect(screen.queryByText(/^\$/)).toBeNull();
  });

  it('renders price below star rating when rating exists', () => {
    render(<ItemCard {...defaultCardProps} item={mockItemWithPrice} />);
    expect(screen.getByText(/128 reviews/)).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
  });

  it('has no accessibility violations with price displayed', async () => {
    const { container } = render(<ItemCard {...defaultCardProps} item={mockItemWithPrice} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
