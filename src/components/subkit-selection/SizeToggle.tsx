import { type FC } from 'react';
import type { SubkitSize } from '../../types';

interface SizeToggleProps {
  currentSize: SubkitSize;
  colorBase: string;
  onSizeChange: (size: SubkitSize) => void;
}

export const SizeToggle: FC<SizeToggleProps> = ({
  currentSize,
  colorBase,
  onSizeChange,
}) => {
  const isRegular = currentSize === 'regular';
  const isLarge = currentSize === 'large';

  const activeStyle: React.CSSProperties = {
    backgroundColor: colorBase,
    color: 'white',
  };

  const inactiveStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    color: 'var(--color-neutral-700)',
  };

  const regularStyle = isRegular ? activeStyle : inactiveStyle;
  const largeStyle = isLarge ? activeStyle : inactiveStyle;

  const handleRegular = () => onSizeChange('regular');
  const handleLarge = () => onSizeChange('large');

  return (
    <div
      role="radiogroup"
      aria-label="Subkit size"
      className="mt-2 flex overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-neutral-200)]"
    >
      <button
        type="button"
        role="radio"
        aria-checked={isRegular}
        onClick={handleRegular}
        className="flex-1 px-3 py-1.5 text-xs font-medium"
        style={regularStyle}
      >
        Regular (1 slot)
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={isLarge}
        onClick={handleLarge}
        className="flex-1 px-3 py-1.5 text-xs font-medium"
        style={largeStyle}
      >
        Large (2 slots)
      </button>
    </div>
  );
};
