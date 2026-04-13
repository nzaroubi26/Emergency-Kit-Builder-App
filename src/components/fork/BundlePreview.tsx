import { type FC } from 'react';
import type { EssentialsBundleItem } from '../../data/essentialsConfig';
import { CATEGORIES } from '../../data/kitItems';

interface BundlePreviewProps {
  bundle: EssentialsBundleItem[];
}

const SIZE_LABELS: Record<string, string> = {
  regular: 'Regular',
  large: 'Large',
};

export const BundlePreview: FC<BundlePreviewProps> = ({ bundle }) => {
  return (
    <div
      className="rounded-[var(--radius-md)] p-3"
      style={{ backgroundColor: '#F9FAFB' }}
    >
      {bundle.map((item) => {
        const category = CATEGORIES[item.categoryId];
        if (!category) return null;
        return (
          <div key={item.categoryId} className="flex items-center gap-2 py-1">
            <span
              className="inline-block h-4 w-4 rounded-full"
              style={{ backgroundColor: category.colorBase }}
              aria-hidden="true"
            />
            <span className="text-sm" style={{ color: '#374151' }}>
              {category.name}
            </span>
            <span className="ml-auto text-xs" style={{ color: '#6B7280' }}>
              {SIZE_LABELS[item.size] ?? item.size}
            </span>
          </div>
        );
      })}
    </div>
  );
};
