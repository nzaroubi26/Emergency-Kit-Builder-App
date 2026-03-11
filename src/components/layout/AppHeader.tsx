import { type FC, type RefObject } from 'react';
import { ShoppingCart } from 'lucide-react';
import { StepProgressIndicator } from './StepProgressIndicator';
import { useKitStore } from '../../store/kitStore';

interface AppHeaderProps {
  onCartToggle?: () => void;
  cartOpen?: boolean;
  cartButtonRef?: RefObject<HTMLButtonElement>;
}

export const AppHeader: FC<AppHeaderProps> = ({
  onCartToggle,
  cartOpen,
  cartButtonRef,
}) => {
  const itemSelections = useKitStore((s) => s.itemSelections);

  const cartItemCount = Object.values(itemSelections)
    .filter((sel) => sel.included)
    .reduce((sum, sel) => sum + sel.quantity, 0);

  return (
    <header className="border-b border-[var(--color-neutral-200)] bg-[var(--color-neutral-white)] px-4 py-3">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <span className="text-lg font-semibold text-[var(--color-neutral-900)]">
          Emergency Prep Kit Builder
        </span>
        <div className="flex items-center gap-3">
          <StepProgressIndicator />
          <button
            ref={cartButtonRef}
            onClick={onCartToggle}
            aria-label="Open cart"
            aria-expanded={cartOpen}
            className="relative text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-900)]"
          >
            <ShoppingCart size={22} />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[var(--color-brand-primary)] text-white text-[10px] font-medium flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
