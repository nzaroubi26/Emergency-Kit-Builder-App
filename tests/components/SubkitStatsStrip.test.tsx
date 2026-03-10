import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { SubkitStatsStrip } from '../../src/components/item-config/SubkitStatsStrip';

expect.extend(matchers);

describe('SubkitStatsStrip', () => {
  it('renders correct weight label for weightLbs={2.3}', () => {
    render(<SubkitStatsStrip weightLbs={2.3} volumePct={48} categoryColor="#C2410C" />);
    expect(screen.getByText('~2.3 lbs')).toBeInTheDocument();
  });

  it('renders correct volume label for volumePct={48}', () => {
    render(<SubkitStatsStrip weightLbs={2.3} volumePct={48} categoryColor="#C2410C" />);
    expect(screen.getByText('48% filled')).toBeInTheDocument();
  });

  it('clamps bar fill width at 100% for volumePct={112} while label shows 112% filled', () => {
    const { container } = render(
      <SubkitStatsStrip weightLbs={5.0} volumePct={112} categoryColor="#C2410C" />
    );
    expect(screen.getByText('112% filled')).toBeInTheDocument();
    const progressbar = container.querySelector('[role="progressbar"]');
    const fill = progressbar?.firstElementChild as HTMLElement;
    expect(fill.style.width).toBe('100%');
  });

  it('renders correct aria-label on wrapper for given weight and pct', () => {
    const { container } = render(
      <SubkitStatsStrip weightLbs={2.3} volumePct={48} categoryColor="#C2410C" />
    );
    const wrapper = container.querySelector('[aria-label]');
    expect(wrapper?.getAttribute('aria-label')).toBe(
      'Subkit stats — 2.3 lbs, 48% of container capacity filled'
    );
  });

  it('renders correct aria-valuenow on bar track', () => {
    const { container } = render(
      <SubkitStatsStrip weightLbs={2.3} volumePct={48} categoryColor="#C2410C" />
    );
    const progressbar = container.querySelector('[role="progressbar"]');
    expect(progressbar?.getAttribute('aria-valuenow')).toBe('48');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <SubkitStatsStrip weightLbs={2.3} volumePct={48} categoryColor="#C2410C" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
