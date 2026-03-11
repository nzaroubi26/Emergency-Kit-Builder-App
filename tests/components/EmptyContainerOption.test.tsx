import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { EmptyContainerOption } from '../../src/components/item-config/EmptyContainerOption';

expect.extend(matchers);

describe('EmptyContainerOption', () => {
  it('renders checkbox label text', () => {
    render(<EmptyContainerOption checked={false} categoryColor="#C2410C" containerSize="regular" onChange={vi.fn()} />);
    expect(screen.getByText(/send an empty container/i)).toBeInTheDocument();
  });

  it('checkbox is unchecked by default', () => {
    render(<EmptyContainerOption checked={false} categoryColor="#C2410C" containerSize="regular" onChange={vi.fn()} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('checkbox is checked when checked prop is true', () => {
    render(<EmptyContainerOption checked={true} categoryColor="#C2410C" containerSize="regular" onChange={vi.fn()} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('calls onChange when checkbox clicked', () => {
    const handleChange = vi.fn();
    render(<EmptyContainerOption checked={false} categoryColor="#C2410C" containerSize="regular" onChange={handleChange} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(handleChange).toHaveBeenCalledOnce();
  });

  it('shows confirmation message when checked', () => {
    render(<EmptyContainerOption checked={true} categoryColor="#C2410C" containerSize="regular" onChange={vi.fn()} />);
    expect(screen.getByText(/shipped as an empty container/i)).toBeInTheDocument();
  });

  it('does not show confirmation message when unchecked', () => {
    render(<EmptyContainerOption checked={false} categoryColor="#C2410C" containerSize="regular" onChange={vi.fn()} />);
    expect(screen.queryByText(/shipped as an empty container/i)).not.toBeInTheDocument();
  });

  it('has no accessibility violations unchecked', async () => {
    const { container } = render(
      <EmptyContainerOption checked={false} categoryColor="#C2410C" containerSize="regular" onChange={vi.fn()} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations checked', async () => {
    const { container } = render(
      <EmptyContainerOption checked={true} categoryColor="#C2410C" containerSize="regular" onChange={vi.fn()} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders $40.00 for regular size', () => {
    render(<EmptyContainerOption checked={false} categoryColor="#C2410C" containerSize="regular" onChange={vi.fn()} />);
    expect(screen.getByText('$40.00')).toBeInTheDocument();
  });

  it('renders $60.00 for large size', () => {
    render(<EmptyContainerOption checked={false} categoryColor="#C2410C" containerSize="large" onChange={vi.fn()} />);
    expect(screen.getByText('$60.00')).toBeInTheDocument();
  });
});
