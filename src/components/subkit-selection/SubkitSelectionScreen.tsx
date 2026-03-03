import { type FC, useEffect, useRef } from 'react';

interface SubkitSelectionScreenProps {}

export const SubkitSelectionScreen: FC<SubkitSelectionScreenProps> = () => {
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
        Build Your Kit
      </h1>
      <p className="mt-3 text-[var(--color-neutral-700)]">
        Select at least 3 subkit categories to include in your emergency preparedness kit.
        Each subkit maps to a physical container in your modular storage unit.
      </p>
      <div className="mt-6 rounded-[var(--radius-md)] border border-[var(--color-neutral-200)] bg-[var(--color-neutral-white)] p-6">
        <p className="text-sm text-[var(--color-neutral-500)]">
          Subkit category cards will be displayed here in a future story.
        </p>
      </div>
    </div>
  );
};
