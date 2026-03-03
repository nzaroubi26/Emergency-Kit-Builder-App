import { type FC } from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  visible: boolean;
}

export const QuantitySelector: FC<QuantitySelectorProps> = ({
  quantity,
  onIncrement,
  onDecrement,
  visible,
}) => {
  const isAtMin = quantity <= 1;
  const isAtMax = quantity >= 10;

  const containerStyles: React.CSSProperties = {
    opacity: visible ? 1 : 0,
    pointerEvents: visible ? 'auto' : 'none',
    transition: `opacity var(--duration-fast) var(--ease-standard)`,
  };

  const decrementDisabledStyle: React.CSSProperties = isAtMin
    ? { opacity: 0.4, cursor: 'not-allowed' }
    : {};

  const incrementDisabledStyle: React.CSSProperties = isAtMax
    ? { opacity: 0.4, cursor: 'not-allowed' }
    : {};

  return (
    <div className="flex items-center gap-2" style={containerStyles}>
      <button
        type="button"
        onClick={onDecrement}
        aria-label="Decrease quantity"
        aria-disabled={isAtMin}
        className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--color-neutral-200)] text-[var(--color-neutral-700)]"
        style={decrementDisabledStyle}
      >
        <Minus size={14} aria-hidden="true" />
      </button>
      <span
        className="min-w-[1.5rem] text-center text-sm font-semibold text-[var(--color-neutral-900)]"
        aria-live="polite"
      >
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrement}
        aria-label="Increase quantity"
        aria-disabled={isAtMax}
        className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--color-neutral-200)] text-[var(--color-neutral-700)]"
        style={incrementDisabledStyle}
      >
        <Plus size={14} aria-hidden="true" />
      </button>
    </div>
  );
};
