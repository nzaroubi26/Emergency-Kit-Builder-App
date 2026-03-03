import { type FC, type ReactNode, type MouseEvent } from 'react';

interface SecondaryButtonProps {
  children: ReactNode;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

export const SecondaryButton: FC<SecondaryButtonProps> = ({
  children,
  onClick,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[var(--radius-md)] border border-[var(--color-neutral-200)] px-6 py-2.5 text-sm font-medium text-[var(--color-neutral-700)] transition-colors ${className}`}
    >
      {children}
    </button>
  );
};
