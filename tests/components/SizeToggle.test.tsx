import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { SizeToggle } from '../../src/components/subkit-selection/SizeToggle';

expect.extend(matchers);

describe('SizeToggle', () => {
  it('renders Regular and Large options', () => {
    render(<SizeToggle currentSize="regular" colorBase="#C2410C" onSizeChange={vi.fn()} />);
    expect(screen.getByText('Regular (1 slot)')).toBeInTheDocument();
    expect(screen.getByText('Large (2 slots)')).toBeInTheDocument();
  });

  it('has role="radiogroup" on container', () => {
    render(<SizeToggle currentSize="regular" colorBase="#C2410C" onSizeChange={vi.fn()} />);
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
  });

  it('marks Regular as checked when currentSize is regular', () => {
    render(<SizeToggle currentSize="regular" colorBase="#C2410C" onSizeChange={vi.fn()} />);
    const radios = screen.getAllByRole('radio');
    expect(radios[0].getAttribute('aria-checked')).toBe('true');
    expect(radios[1].getAttribute('aria-checked')).toBe('false');
  });

  it('marks Large as checked when currentSize is large', () => {
    render(<SizeToggle currentSize="large" colorBase="#C2410C" onSizeChange={vi.fn()} />);
    const radios = screen.getAllByRole('radio');
    expect(radios[0].getAttribute('aria-checked')).toBe('false');
    expect(radios[1].getAttribute('aria-checked')).toBe('true');
  });

  it('calls onSizeChange with "large" when Large clicked', () => {
    const handleChange = vi.fn();
    render(<SizeToggle currentSize="regular" colorBase="#C2410C" onSizeChange={handleChange} />);
    fireEvent.click(screen.getByText('Large (2 slots)'));
    expect(handleChange).toHaveBeenCalledWith('large');
  });

  it('calls onSizeChange with "regular" when Regular clicked', () => {
    const handleChange = vi.fn();
    render(<SizeToggle currentSize="large" colorBase="#C2410C" onSizeChange={handleChange} />);
    fireEvent.click(screen.getByText('Regular (1 slot)'));
    expect(handleChange).toHaveBeenCalledWith('regular');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <SizeToggle currentSize="regular" colorBase="#C2410C" onSizeChange={vi.fn()} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
