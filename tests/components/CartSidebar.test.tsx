import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { CartSidebar } from '../../src/components/cart/CartSidebar';

expect.extend(matchers);

describe('CartSidebar', () => {
  it('has translate-x-full class when isOpen is false', () => {
    render(<CartSidebar isOpen={false} onClose={vi.fn()} />);
    const panel = screen.getByRole('dialog');
    expect(panel.classList.contains('translate-x-full')).toBe(true);
  });

  it('does not have translate-x-full class when isOpen is true', () => {
    render(<CartSidebar isOpen={true} onClose={vi.fn()} />);
    const panel = screen.getByRole('dialog');
    expect(panel.classList.contains('translate-x-full')).toBe(false);
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    render(<CartSidebar isOpen={true} onClose={onClose} />);
    const backdrop = document.querySelector('[aria-hidden="true"]')!;
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when X button is clicked', () => {
    const onClose = vi.fn();
    render(<CartSidebar isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByLabelText('Close cart'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('has role="dialog" and aria-label="Cart" on panel root', () => {
    render(<CartSidebar isOpen={true} onClose={vi.fn()} />);
    const panel = screen.getByRole('dialog');
    expect(panel).toHaveAttribute('aria-label', 'Cart');
  });

  it('has no accessibility violations when open', async () => {
    const { container } = render(
      <CartSidebar isOpen={true} onClose={vi.fn()} />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
