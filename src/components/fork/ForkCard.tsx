import { type FC, type ReactNode, type ElementType } from 'react';
import { PrimaryButton } from '../ui/PrimaryButton';

interface ForkCardProps {
  icon: ElementType;
  heading: string;
  children: ReactNode;
  ctaLabel: string;
  onCtaClick: () => void;
}

export const ForkCard: FC<ForkCardProps> = ({
  icon: Icon,
  heading,
  children,
  ctaLabel,
  onCtaClick,
}) => {
  return (
    <div
      className="flex flex-1 flex-col rounded-2xl p-6 transition-shadow duration-150 hover:shadow-lg"
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5E7EB',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <Icon size={40} style={{ color: 'var(--color-brand-primary, #1F4D35)', marginBottom: '16px' }} />
      <h2
        className="text-[22px] font-semibold"
        style={{ color: '#111827', marginBottom: '8px' }}
      >
        {heading}
      </h2>
      <div className="flex-1">{children}</div>
      <div className="mt-6">
        <PrimaryButton onClick={onCtaClick} className="w-full">
          {ctaLabel}
        </PrimaryButton>
      </div>
    </div>
  );
};
