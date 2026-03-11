import { type FC, type ChangeEvent } from 'react';
import type { SubkitSize } from '../../types';
import { CONTAINER_PRICES } from '../../utils/cartCalculations';

interface EmptyContainerOptionProps {
  checked: boolean;
  categoryColor: string;
  containerSize: SubkitSize;
  onChange: () => void;
}

export const EmptyContainerOption: FC<EmptyContainerOptionProps> = ({
  checked,
  categoryColor,
  containerSize,
  onChange,
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    void e;
    onChange();
  };

  const checkboxAccentStyle: React.CSSProperties = checked
    ? { accentColor: categoryColor }
    : {};

  const formattedPrice = '$' + CONTAINER_PRICES[containerSize].toFixed(2);

  const confirmationContent = checked
    ? (
      <p className="mt-1 text-xs font-medium" style={{ color: categoryColor }}>
        This subkit will be shipped as an empty container.
      </p>
    )
    : null;

  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--color-neutral-200)] p-3">
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          className="mt-0.5 h-4 w-4 rounded"
          style={checkboxAccentStyle}
          aria-label="Send an empty container for this subkit"
        />
        <span className="text-sm text-[var(--color-neutral-700)]">
          Send an empty container
          <span className="block text-xs font-normal text-[var(--color-neutral-500)]">
            {formattedPrice}
          </span>
        </span>
      </label>
      {confirmationContent}
    </div>
  );
};
