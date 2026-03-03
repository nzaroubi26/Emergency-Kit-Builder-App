import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { PrimaryButton } from '../../src/components/ui/PrimaryButton';

expect.extend(matchers);

describe('PrimaryButton', () => {
  it('renders children text', () => {
    render(<PrimaryButton onClick={vi.fn()}>Click Me</PrimaryButton>);
    expect(screen.getByRole('button', { name: 'Click Me' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<PrimaryButton onClick={handleClick}>Go</PrimaryButton>);
    fireEvent.click(screen.getByRole('button', { name: 'Go' }));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('does not call onClick when aria-disabled', () => {
    const handleClick = vi.fn();
    render(<PrimaryButton onClick={handleClick} ariaDisabled>Go</PrimaryButton>);
    fireEvent.click(screen.getByRole('button', { name: 'Go' }));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('sets aria-disabled attribute', () => {
    render(<PrimaryButton onClick={vi.fn()} ariaDisabled>Go</PrimaryButton>);
    const btn = screen.getByRole('button', { name: 'Go' });
    expect(btn).toHaveAttribute('aria-disabled', 'true');
  });

  it('is focusable when aria-disabled', () => {
    render(<PrimaryButton onClick={vi.fn()} ariaDisabled>Go</PrimaryButton>);
    const btn = screen.getByRole('button', { name: 'Go' });
    btn.focus();
    expect(document.activeElement).toBe(btn);
  });

  it('sets aria-describedby when provided', () => {
    render(<PrimaryButton onClick={vi.fn()} ariaDisabled ariaDescribedBy="msg-1">Go</PrimaryButton>);
    const btn = screen.getByRole('button', { name: 'Go' });
    expect(btn).toHaveAttribute('aria-describedby', 'msg-1');
  });

  it('does not set aria-describedby when not provided', () => {
    render(<PrimaryButton onClick={vi.fn()}>Go</PrimaryButton>);
    const btn = screen.getByRole('button', { name: 'Go' });
    expect(btn).not.toHaveAttribute('aria-describedby');
  });

  it('applies custom className', () => {
    render(<PrimaryButton onClick={vi.fn()} className="extra-class">Go</PrimaryButton>);
    const btn = screen.getByRole('button', { name: 'Go' });
    expect(btn.className).toContain('extra-class');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<PrimaryButton onClick={vi.fn()}>Go</PrimaryButton>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations when aria-disabled', async () => {
    const { container } = render(
      <PrimaryButton onClick={vi.fn()} ariaDisabled ariaDescribedBy="msg">Go</PrimaryButton>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
