import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProductCard } from '../../src/components/fill/ProductCard';
import type { AmazonProduct } from '../../src/data/amazonProducts';

const mockProduct: AmazonProduct = {
  id: 'power-station',
  categoryId: 'power',
  kitItemId: 'power-station',
  name: 'Portable Power Station',
  asin: 'B082TMBYR6',
  price: 199.00,
  brand: 'Jackery Explorer',
  imageSrc: '/products/B082TMBYR6.jpg',
};

const affiliateUrl = 'https://www.amazon.com/dp/B082TMBYR6?tag=placeholder-20';

describe('ProductCard', () => {
  it('renders product name', () => {
    render(<ProductCard product={mockProduct} affiliateUrl={affiliateUrl} />);
    expect(screen.getByText('Portable Power Station')).toBeInTheDocument();
  });

  it('renders brand', () => {
    render(<ProductCard product={mockProduct} affiliateUrl={affiliateUrl} />);
    expect(screen.getByText('Jackery Explorer')).toBeInTheDocument();
  });

  it('renders price formatted with two decimal places', () => {
    render(<ProductCard product={mockProduct} affiliateUrl={affiliateUrl} />);
    expect(screen.getByText('$199.00')).toBeInTheDocument();
  });

  it('renders image with alt text', () => {
    render(<ProductCard product={mockProduct} affiliateUrl={affiliateUrl} />);
    const img = screen.getByAltText('Portable Power Station');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('loading', 'lazy');
  });

  it('renders "View on Amazon" CTA as link with correct attributes', () => {
    render(<ProductCard product={mockProduct} affiliateUrl={affiliateUrl} />);
    const link = screen.getByRole('link', { name: /View Portable Power Station by Jackery Explorer on Amazon/ });
    expect(link).toHaveAttribute('href', affiliateUrl);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('shows fallback icon when image fails to load', () => {
    render(<ProductCard product={mockProduct} affiliateUrl={affiliateUrl} />);
    const img = screen.getByAltText('Portable Power Station');
    fireEvent.error(img);
    expect(screen.queryByAltText('Portable Power Station')).not.toBeInTheDocument();
  });

  it('renders CTA text "View on Amazon"', () => {
    render(<ProductCard product={mockProduct} affiliateUrl={affiliateUrl} />);
    expect(screen.getByText('View on Amazon')).toBeInTheDocument();
  });
});
