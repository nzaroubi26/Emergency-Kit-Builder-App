import { type FC, useEffect, useRef } from 'react';

interface SummaryScreenProps {}

export const SummaryScreen: FC<SummaryScreenProps> = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div>
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="text-2xl font-bold text-[var(--color-neutral-900)] outline-none"
      >
        Review Your Kit
      </h1>
      <p className="mt-3 text-[var(--color-neutral-700)]">
        Review your emergency preparedness kit configuration before finalizing.
      </p>
      <div className="mt-6 rounded-[var(--radius-md)] border border-[var(--color-neutral-200)] bg-[var(--color-neutral-white)] p-6">
        <p className="text-sm text-[var(--color-neutral-500)]">
          Kit summary and housing unit visualizer will be displayed here in a future story.
        </p>
      </div>
    </div>
  );
};
