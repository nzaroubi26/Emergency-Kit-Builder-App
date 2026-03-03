import { type FC, useEffect, useRef } from 'react';

interface CustomSubkitScreenProps {}

export const CustomSubkitScreen: FC<CustomSubkitScreenProps> = () => {
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
        Custom Subkit
      </h1>
      <p className="mt-3 text-[var(--color-neutral-700)]">
        Browse items from all categories to create your custom subkit.
      </p>
      <div className="mt-6 rounded-[var(--radius-md)] border border-[var(--color-neutral-200)] bg-[var(--color-neutral-white)] p-6">
        <p className="text-sm text-[var(--color-neutral-500)]">
          All-category item browser will be displayed here in a future story.
        </p>
      </div>
    </div>
  );
};
