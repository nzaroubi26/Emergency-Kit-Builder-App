import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ShieldCheck } from 'lucide-react';
import { ForkCard } from '../../src/components/fork/ForkCard';

describe('ForkCard', () => {
  it('renders heading and CTA label', () => {
    render(
      <ForkCard icon={ShieldCheck} heading="Test Heading" ctaLabel="Click Me" onCtaClick={() => {}}>
        <p>Card body</p>
      </ForkCard>
    );
    expect(screen.getByRole('heading', { name: 'Test Heading' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Click Me' })).toBeInTheDocument();
  });

  it('renders children content', () => {
    render(
      <ForkCard icon={ShieldCheck} heading="Heading" ctaLabel="CTA" onCtaClick={() => {}}>
        <p>Custom body content</p>
      </ForkCard>
    );
    expect(screen.getByText('Custom body content')).toBeInTheDocument();
  });

  it('calls onCtaClick when CTA is clicked', () => {
    const onClick = vi.fn();
    render(
      <ForkCard icon={ShieldCheck} heading="Heading" ctaLabel="CTA" onCtaClick={onClick}>
        <p>Body</p>
      </ForkCard>
    );
    fireEvent.click(screen.getByRole('button', { name: 'CTA' }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
