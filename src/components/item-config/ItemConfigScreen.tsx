import { type FC, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

interface ItemConfigScreenProps {}

export const ItemConfigScreen: FC<ItemConfigScreenProps> = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { subkitId } = useParams<{ subkitId: string }>();

  useEffect(() => {
    headingRef.current?.focus();
  }, [subkitId]);

  return (
    <div>
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="text-2xl font-bold text-[var(--color-neutral-900)] outline-none"
      >
        Configure Items
      </h1>
      <p className="mt-3 text-[var(--color-neutral-700)]">
        Select and configure items for your <strong>{subkitId}</strong> subkit.
      </p>
      <div className="mt-6 rounded-[var(--radius-md)] border border-[var(--color-neutral-200)] bg-[var(--color-neutral-white)] p-6">
        <p className="text-sm text-[var(--color-neutral-500)]">
          Item configuration cards will be displayed here in a future story.
        </p>
      </div>
    </div>
  );
};
