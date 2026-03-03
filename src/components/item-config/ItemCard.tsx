import { type FC, type KeyboardEvent } from 'react';
import type { KitItem, KitCategory } from '../../types';
import { ITEM_IMAGES } from '../../data';
import { ImageWithFallback } from '../ui/ImageWithFallback';
import { QuantitySelector } from './QuantitySelector';

interface ItemCardProps {
  item: KitItem;
  category: KitCategory;
  included: boolean;
  quantity: number;
  onToggle: (itemId: string) => void;
  onIncrement: (itemId: string) => void;
  onDecrement: (itemId: string) => void;
}

export const ItemCard: FC<ItemCardProps> = ({
  item,
  category,
  included,
  quantity,
  onToggle,
  onIncrement,
  onDecrement,
}) => {
  const handleClick = () => {
    onToggle(item.id);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const handleIncrement = () => {
    onIncrement(item.id);
  };

  const handleDecrement = () => {
    onDecrement(item.id);
  };

  const borderStyle: React.CSSProperties = included
    ? { borderColor: category.colorBase, borderWidth: '2px' }
    : {};

  const opacityStyle: React.CSSProperties = included
    ? {}
    : { opacity: 0.65 };

  const containerStyles: React.CSSProperties = {
    ...borderStyle,
    ...opacityStyle,
    transition: 'opacity 200ms var(--ease-standard)',
  };

  const ariaLabel = included
    ? `${item.name}, included`
    : `${item.name}, excluded`;

  return (
    <div
      className="flex flex-col overflow-hidden rounded-[var(--radius-md)] border"
      style={containerStyles}
    >
      <div
        role="button"
        tabIndex={0}
        aria-pressed={included}
        aria-label={ariaLabel}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className="cursor-pointer"
      >
        <ImageWithFallback
          src={ITEM_IMAGES[item.id] ?? item.imageSrc}
          alt={item.name}
          categoryIcon={category.icon}
          categoryTint={category.colorTint}
          categoryColor={category.colorBase}
          className="h-28"
        />
        <div className="flex flex-col gap-1 p-3">
          <span className="text-sm font-semibold text-[var(--color-neutral-900)]">{item.name}</span>
          <p className="text-xs text-[var(--color-neutral-500)]">{item.description}</p>
        </div>
      </div>
      <div className="px-3 pb-3">
        <QuantitySelector
          quantity={quantity}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          visible={included}
        />
      </div>
    </div>
  );
};
