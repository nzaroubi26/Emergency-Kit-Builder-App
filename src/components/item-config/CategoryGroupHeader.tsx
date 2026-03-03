import { type FC } from 'react';
import type { KitCategory } from '../../types';
import { resolveIcon } from '../../utils/iconResolver';

interface CategoryGroupHeaderProps {
  category: KitCategory;
}

export const CategoryGroupHeader: FC<CategoryGroupHeaderProps> = ({ category }) => {
  const IconComponent = resolveIcon(category.icon);

  const iconContent = IconComponent
    ? <IconComponent size={20} style={{ color: category.colorBase }} aria-hidden="true" />
    : null;

  return (
    <div
      id={`category-${category.id}`}
      className="flex items-center gap-2 border-b pb-2"
      style={{ borderBottomColor: category.colorBase }}
    >
      {iconContent}
      <h2 className="text-base font-semibold" style={{ color: category.colorBase }}>
        {category.name}
      </h2>
    </div>
  );
};
