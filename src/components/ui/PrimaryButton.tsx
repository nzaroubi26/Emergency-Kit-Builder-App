import { type FC, type ReactNode, type MouseEvent } from 'react';

interface PrimaryButtonProps {
  children: ReactNode;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  ariaDisabled?: boolean;
  ariaDescribedBy?: string;
  className?: string;
}

export const PrimaryButton: FC<PrimaryButtonProps> = ({
  children,
  onClick,
  ariaDisabled = false,
  ariaDescribedBy,
  className = '',
}) => {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (ariaDisabled) return;
    onClick(e);
  };

  const bgColor = ariaDisabled ? 'var(--color-neutral-400)' : 'var(--color-brand-primary)';
  const cursor = ariaDisabled ? 'not-allowed' : 'pointer';

  const buttonStyles: React.CSSProperties = {
    backgroundColor: bgColor,
    cursor,
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-disabled={ariaDisabled}
      aria-describedby={ariaDescribedBy}
      className={`rounded-[var(--radius-md)] px-8 py-3 text-sm font-semibold text-white transition-colors ${className}`}
      style={buttonStyles}
    >
      {children}
    </button>
  );
};
