import { type FC } from 'react';
import { StepProgressIndicator } from './StepProgressIndicator';

interface AppHeaderProps {}

export const AppHeader: FC<AppHeaderProps> = () => {
  return (
    <header className="border-b border-[var(--color-neutral-200)] bg-[var(--color-neutral-white)] px-4 py-3">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <span className="text-lg font-semibold text-[var(--color-neutral-900)]">
          Emergency Prep Kit Builder
        </span>
        <StepProgressIndicator />
      </div>
    </header>
  );
};
