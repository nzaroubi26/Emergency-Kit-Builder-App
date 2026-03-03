import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { QuantitySelector } from '../../src/components/item-config/QuantitySelector';

expect.extend(matchers);

describe('QuantitySelector', () => {
  it('renders current quantity', () => {
    render(<QuantitySelector quantity={3} onIncrement={vi.fn()} onDecrement={vi.fn()} visible={true} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('calls onIncrement when + clicked', () => {
    const handleIncrement = vi.fn();
    render(<QuantitySelector quantity={3} onIncrement={handleIncrement} onDecrement={vi.fn()} visible={true} />);
    fireEvent.click(screen.getByRole('button', { name: /Increase quantity/i }));
    expect(handleIncrement).toHaveBeenCalledOnce();
  });

  it('calls onDecrement when − clicked', () => {
    const handleDecrement = vi.fn();
    render(<QuantitySelector quantity={3} onIncrement={vi.fn()} onDecrement={handleDecrement} visible={true} />);
    fireEvent.click(screen.getByRole('button', { name: /Decrease quantity/i }));
    expect(handleDecrement).toHaveBeenCalledOnce();
  });

  it('decrement button is aria-disabled at quantity 1', () => {
    render(<QuantitySelector quantity={1} onIncrement={vi.fn()} onDecrement={vi.fn()} visible={true} />);
    const btn = screen.getByRole('button', { name: /Decrease quantity/i });
    expect(btn).toHaveAttribute('aria-disabled', 'true');
  });

  it('increment button is aria-disabled at quantity 10', () => {
    render(<QuantitySelector quantity={10} onIncrement={vi.fn()} onDecrement={vi.fn()} visible={true} />);
    const btn = screen.getByRole('button', { name: /Increase quantity/i });
    expect(btn).toHaveAttribute('aria-disabled', 'true');
  });

  it('decrement button is not disabled above quantity 1', () => {
    render(<QuantitySelector quantity={5} onIncrement={vi.fn()} onDecrement={vi.fn()} visible={true} />);
    const btn = screen.getByRole('button', { name: /Decrease quantity/i });
    expect(btn).toHaveAttribute('aria-disabled', 'false');
  });

  it('increment button is not disabled below quantity 10', () => {
    render(<QuantitySelector quantity={5} onIncrement={vi.fn()} onDecrement={vi.fn()} visible={true} />);
    const btn = screen.getByRole('button', { name: /Increase quantity/i });
    expect(btn).toHaveAttribute('aria-disabled', 'false');
  });

  it('has opacity 0 when not visible', () => {
    const { container } = render(
      <QuantitySelector quantity={1} onIncrement={vi.fn()} onDecrement={vi.fn()} visible={false} />
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.style.opacity).toBe('0');
    expect(wrapper.style.pointerEvents).toBe('none');
  });

  it('has opacity 1 when visible', () => {
    const { container } = render(
      <QuantitySelector quantity={1} onIncrement={vi.fn()} onDecrement={vi.fn()} visible={true} />
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.style.opacity).toBe('1');
    expect(wrapper.style.pointerEvents).toBe('auto');
  });

  it('has aria-live polite on quantity display', () => {
    render(<QuantitySelector quantity={3} onIncrement={vi.fn()} onDecrement={vi.fn()} visible={true} />);
    const qtyDisplay = screen.getByText('3');
    expect(qtyDisplay).toHaveAttribute('aria-live', 'polite');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <QuantitySelector quantity={3} onIncrement={vi.fn()} onDecrement={vi.fn()} visible={true} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
