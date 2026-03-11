import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { SubkitSummarySection } from '../../src/components/summary/SubkitSummarySection';
import type { SubkitSelection, KitCategory, KitItem } from '../../src/types';

expect.extend(matchers);

const mockCategory: KitCategory = {
  id: 'power',
  name: 'Power',
  colorBase: '#C2410C',
  colorTint: '#FFF7ED',
  icon: 'Zap',
  description: 'Charge devices and power essentials',
  sizeOptions: ['regular', 'large'],
};

const mockSubkit: SubkitSelection = {
  subkitId: 'power',
  categoryId: 'power',
  size: 'regular',
  selectionOrder: 1,
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

const mockItemNoPrice: KitItem = {
  id: 'power-station',
  categoryId: 'power',
  name: 'Portable Power Station',
  description: 'Lithium battery',
  rating: null,
  reviewCount: null,
  weightGrams: 5000,
  volumeIn3: 400,
  productId: null,
  pricePlaceholder: null,
  imageSrc: null,
};

const defaultProps = {
  subkit: mockSubkit,
  category: mockCategory,
  isEmpty: false,
  weightLbs: 2.4,
  volumePct: 48,
};

describe('SubkitSummarySection price display', () => {
  it('renders price for item with qty 1', () => {
    render(
      <SubkitSummarySection
        {...defaultProps}
        items={[{ item: mockItemWithPrice, quantity: 1 }]}
      />
    );
    expect(screen.getByText('$29.99 each')).toBeInTheDocument();
  });

  it('renders line total for item with qty > 1', () => {
    render(
      <SubkitSummarySection
        {...defaultProps}
        items={[{ item: mockItemWithPrice, quantity: 2 }]}
      />
    );
    expect(screen.getByText('$29.99 × 2 = $59.98')).toBeInTheDocument();
  });

  it('does not render price for item with null pricePlaceholder', () => {
    render(
      <SubkitSummarySection
        {...defaultProps}
        items={[{ item: mockItemNoPrice, quantity: 1 }]}
      />
    );
    expect(screen.queryByText(/\$/)).not.toBeInTheDocument();
  });

  it('has no accessibility violations with prices displayed', async () => {
    const { container } = render(
      <SubkitSummarySection
        {...defaultProps}
        items={[
          { item: mockItemWithPrice, quantity: 2 },
          { item: mockItemNoPrice, quantity: 1 },
        ]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders item name and quantity badge alongside price', () => {
    render(
      <SubkitSummarySection
        {...defaultProps}
        items={[{ item: mockItemWithPrice, quantity: 2 }]}
      />
    );
    expect(screen.getByText('Solar Panel')).toBeInTheDocument();
    expect(screen.getByText('×2')).toBeInTheDocument();
    expect(screen.getByText('$29.99 × 2 = $59.98')).toBeInTheDocument();
  });
});
