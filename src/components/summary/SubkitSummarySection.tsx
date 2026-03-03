import { type FC } from 'react';
import * as Icons from 'lucide-react';
import type { SubkitSelection } from '../../types';
import type { KitCategory, KitItem } from '../../types';

interface SubkitSummarySectionProps {
  subkit: SubkitSelection;
  category: KitCategory;
  items: Array<{ item: KitItem; quantity: number }>;
  isEmpty: boolean;
}

export const SubkitSummarySection: FC<SubkitSummarySectionProps> = ({
  subkit,
  category,
  items,
  isEmpty,
}) => {
  const IconComponent = (Icons as unknown as Record<string, FC<{ size?: number; 'aria-hidden'?: string }>>)[category.icon];
  const sizeLabel = subkit.size === 'large' ? 'Large' : 'Regular';

  const itemList = items.map(({ item, quantity }) => (
    <li key={item.id} className="flex items-center justify-between py-1.5">
      <span className="text-sm text-[var(--color-neutral-700)]">{item.name}</span>
      <span
        className="ml-2 min-w-[2rem] rounded-full px-2 py-0.5 text-center text-xs font-medium"
        style={{ backgroundColor: category.colorTint, color: category.colorBase }}
      >
        ×{quantity}
      </span>
    </li>
  ));

  return (
    <div
      className="summary-subkit-section overflow-hidden rounded-[var(--radius-md)]"
      style={{ boxShadow: 'var(--shadow-1)' }}
    >
      <div
        className="flex items-center gap-3 px-4 py-3"
        style={{ backgroundColor: category.colorTint }}
      >
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full"
          style={{ backgroundColor: category.colorBase }}
        >
          {IconComponent && <IconComponent size={16} aria-hidden="true" />}
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-semibold" style={{ color: category.colorBase }}>
            {category.name}
          </h2>
          <p className="text-xs text-[var(--color-neutral-500)]">{sizeLabel} Subkit</p>
        </div>
      </div>
      <div
        className="border-l-4 bg-[var(--color-neutral-white)] px-4 py-3"
        style={{ borderLeftColor: category.colorBase }}
      >
        {isEmpty ? (
          <div
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
            style={{ backgroundColor: category.colorTint, color: category.colorBase }}
          >
            <Icons.Package size={12} aria-hidden="true" />
            Empty Container
          </div>
        ) : items.length > 0 ? (
          <ul className="divide-y divide-[var(--color-neutral-100)]">
            {itemList}
          </ul>
        ) : (
          <p className="text-sm text-[var(--color-neutral-400)]">No items configured</p>
        )}
      </div>
    </div>
  );
};
