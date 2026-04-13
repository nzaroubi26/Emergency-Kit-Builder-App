import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BundlePreview } from '../../src/components/fork/BundlePreview';
import { ESSENTIALS_BUNDLE } from '../../src/data/essentialsConfig';

describe('BundlePreview', () => {
  it('renders all four essential subkits', () => {
    render(<BundlePreview bundle={ESSENTIALS_BUNDLE} />);
    expect(screen.getByText('Power')).toBeInTheDocument();
    expect(screen.getByText('Cooking')).toBeInTheDocument();
    expect(screen.getByText('Medical')).toBeInTheDocument();
    expect(screen.getByText('Communications')).toBeInTheDocument();
  });

  it('shows correct size labels', () => {
    render(<BundlePreview bundle={ESSENTIALS_BUNDLE} />);
    expect(screen.getByText('Large')).toBeInTheDocument();
    expect(screen.getAllByText('Regular')).toHaveLength(3);
  });

  it('renders category color indicators', () => {
    const { container } = render(<BundlePreview bundle={ESSENTIALS_BUNDLE} />);
    const colorDots = container.querySelectorAll('[aria-hidden="true"]');
    expect(colorDots.length).toBe(4);
  });
});
