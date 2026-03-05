import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { StarRating } from '../../src/components/ui/StarRating';

expect.extend(matchers);

describe('StarRating', () => {
  it('renders rating text with one decimal place', () => {
    render(<StarRating rating={4.5} reviewCount={312} />);
    expect(screen.getByText(/4\.5/)).toBeInTheDocument();
  });

  it('renders review count with locale formatting', () => {
    render(<StarRating rating={4.2} reviewCount={1234} />);
    expect(screen.getByText(/1,234 reviews/)).toBeInTheDocument();
  });

  it('has role="img" with descriptive aria-label', () => {
    render(<StarRating rating={3.8} reviewCount={89} />);
    const el = screen.getByRole('img');
    expect(el).toHaveAttribute('aria-label', 'Rated 3.8 out of 5 based on 89 reviews');
  });

  it('renders filled star width proportional to rating', () => {
    const { container } = render(<StarRating rating={4} reviewCount={100} />);
    const filledStars = container.querySelector('[class*="overflow-hidden"]') as HTMLElement;
    expect(filledStars).toHaveStyle({ width: '80%' });
  });

  it('renders 0% width for zero rating', () => {
    const { container } = render(<StarRating rating={0} reviewCount={0} />);
    const filledStars = container.querySelector('[class*="overflow-hidden"]') as HTMLElement;
    expect(filledStars).toHaveStyle({ width: '0%' });
  });

  it('renders 100% width for perfect rating', () => {
    const { container } = render(<StarRating rating={5} reviewCount={500} />);
    const filledStars = container.querySelector('[class*="overflow-hidden"]') as HTMLElement;
    expect(filledStars).toHaveStyle({ width: '100%' });
  });

  it('marks star characters as aria-hidden', () => {
    const { container } = render(<StarRating rating={4.5} reviewCount={312} />);
    const hiddenElements = container.querySelectorAll('[aria-hidden="true"]');
    expect(hiddenElements.length).toBe(2);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<StarRating rating={4.5} reviewCount={312} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
