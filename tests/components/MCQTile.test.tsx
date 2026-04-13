import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { Droplets } from 'lucide-react';
import { MCQTile } from '../../src/components/mcq/MCQTile';

expect.extend(matchers);

describe('MCQTile', () => {
  it('renders label and icon', () => {
    render(<MCQTile label="Flood" icon={Droplets} selected={false} onClick={() => {}} />);
    expect(screen.getByText('Flood')).toBeInTheDocument();
  });

  it('shows unselected state with role=checkbox and aria-checked=false', () => {
    render(<MCQTile label="Flood" icon={Droplets} selected={false} onClick={() => {}} />);
    const tile = screen.getByRole('checkbox', { name: 'Flood' });
    expect(tile).toHaveAttribute('aria-checked', 'false');
  });

  it('shows selected state with aria-checked=true', () => {
    render(<MCQTile label="Flood" icon={Droplets} selected onClick={() => {}} />);
    const tile = screen.getByRole('checkbox', { name: 'Flood' });
    expect(tile).toHaveAttribute('aria-checked', 'true');
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<MCQTile label="Flood" icon={Droplets} selected={false} onClick={onClick} />);
    fireEvent.click(screen.getByRole('checkbox', { name: 'Flood' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not call onClick when disabled', () => {
    const onClick = vi.fn();
    render(<MCQTile label="Extreme Heat" icon={Droplets} selected={false} disabled onClick={onClick} />);
    fireEvent.click(screen.getByRole('checkbox', { name: 'Extreme Heat' }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('shows disabled label when disabled with disabledLabel', () => {
    render(<MCQTile label="Extreme Heat" icon={Droplets} selected={false} disabled disabledLabel="Coming Soon" onClick={() => {}} />);
    expect(screen.getByText('Coming Soon')).toBeInTheDocument();
  });

  it('has aria-disabled=true when disabled', () => {
    render(<MCQTile label="Extreme Heat" icon={Droplets} selected={false} disabled onClick={() => {}} />);
    const tile = screen.getByRole('checkbox', { name: 'Extreme Heat' });
    expect(tile).toHaveAttribute('aria-disabled', 'true');
  });

  it('responds to keyboard Enter', () => {
    const onClick = vi.fn();
    render(<MCQTile label="Flood" icon={Droplets} selected={false} onClick={onClick} />);
    fireEvent.keyDown(screen.getByRole('checkbox', { name: 'Flood' }), { key: 'Enter' });
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('responds to keyboard Space', () => {
    const onClick = vi.fn();
    render(<MCQTile label="Flood" icon={Droplets} selected={false} onClick={onClick} />);
    fireEvent.keyDown(screen.getByRole('checkbox', { name: 'Flood' }), { key: ' ' });
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <MCQTile label="Flood" icon={Droplets} selected={false} onClick={() => {}} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
