import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CategorySection } from '../../src/components/fill/CategorySection';
import { AMAZON_PRODUCTS } from '../../src/data/amazonProducts';

const powerProducts = AMAZON_PRODUCTS.filter((p) => p.categoryId === 'power');

describe('CategorySection', () => {
  it('renders category name and item count', () => {
    render(<CategorySection categoryId="power" products={powerProducts} defaultExpanded={true} />);
    expect(screen.getByText('Power')).toBeInTheDocument();
    expect(screen.getByText('5 items')).toBeInTheDocument();
  });

  it('shows singular "1 item" for single product', () => {
    render(<CategorySection categoryId="medical" products={[AMAZON_PRODUCTS.find((p) => p.id === 'med-first-aid')!]} defaultExpanded={true} />);
    expect(screen.getByText('1 item')).toBeInTheDocument();
  });

  it('renders expanded by default when defaultExpanded is true', () => {
    render(<CategorySection categoryId="power" products={powerProducts} defaultExpanded={true} />);
    const toggle = screen.getByRole('button');
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });

  it('renders collapsed by default when defaultExpanded is false', () => {
    render(<CategorySection categoryId="power" products={powerProducts} defaultExpanded={false} />);
    const toggle = screen.getByRole('button');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  it('toggles expand/collapse on click', () => {
    render(<CategorySection categoryId="power" products={powerProducts} defaultExpanded={false} />);
    const toggle = screen.getByRole('button');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  it('has aria-controls linking header to panel', () => {
    render(<CategorySection categoryId="power" products={powerProducts} defaultExpanded={true} />);
    const toggle = screen.getByRole('button');
    const controlsId = toggle.getAttribute('aria-controls');
    expect(controlsId).toBeTruthy();
    const panel = document.getElementById(controlsId!);
    expect(panel).toBeInTheDocument();
    expect(panel).toHaveAttribute('role', 'region');
  });

  it('displays product names when expanded', () => {
    render(<CategorySection categoryId="power" products={powerProducts} defaultExpanded={true} />);
    expect(screen.getByText('Portable Power Station')).toBeInTheDocument();
    expect(screen.getByText('Solar Panel')).toBeInTheDocument();
  });
});
