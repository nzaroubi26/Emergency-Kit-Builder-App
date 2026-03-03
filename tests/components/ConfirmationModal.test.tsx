import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { ConfirmationModal } from '../../src/components/ui/ConfirmationModal';

expect.extend(matchers);

const defaultProps = {
  open: true,
  title: 'Go Back?',
  message: 'Going back will keep all your selections.',
  confirmLabel: 'Go Back',
  cancelLabel: 'Stay Here',
  onConfirm: vi.fn(),
  onCancel: vi.fn(),
};

describe('ConfirmationModal', () => {
  it('renders title, message, and buttons when open', () => {
    render(<ConfirmationModal {...defaultProps} />);
    expect(screen.getByText('Go Back?')).toBeInTheDocument();
    expect(screen.getByText('Going back will keep all your selections.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go Back' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Stay Here' })).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<ConfirmationModal {...defaultProps} open={false} />);
    expect(screen.queryByText('Go Back?')).not.toBeInTheDocument();
  });

  it('calls onConfirm when confirm button clicked', () => {
    const onConfirm = vi.fn();
    render(<ConfirmationModal {...defaultProps} onConfirm={onConfirm} />);
    fireEvent.click(screen.getByRole('button', { name: 'Go Back' }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('calls onCancel when cancel button clicked', () => {
    const onCancel = vi.fn();
    render(<ConfirmationModal {...defaultProps} onCancel={onCancel} />);
    fireEvent.click(screen.getByRole('button', { name: 'Stay Here' }));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('calls onCancel on Escape key', () => {
    const onCancel = vi.fn();
    render(<ConfirmationModal {...defaultProps} onCancel={onCancel} />);
    const dialog = screen.getByRole('alertdialog');
    fireEvent.keyDown(dialog, { key: 'Escape' });
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('has role=alertdialog with aria-modal', () => {
    render(<ConfirmationModal {...defaultProps} />);
    const dialog = screen.getByRole('alertdialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('focuses cancel button on open', () => {
    render(<ConfirmationModal {...defaultProps} />);
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Stay Here' }));
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<ConfirmationModal {...defaultProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
