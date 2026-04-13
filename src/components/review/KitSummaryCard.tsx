import { type FC } from 'react';
import { ESSENTIALS_BUNDLE } from '../../data/essentialsConfig';
import { CATEGORIES } from '../../data/kitItems';

interface KitSummaryCardProps {
  path: 'essentials' | 'custom';
}

const SIZE_LABELS: Record<string, string> = {
  regular: 'Regular',
  large: 'Large',
};

const EssentialsKitSummary: FC = () => {
  const slotCount = ESSENTIALS_BUNDLE.reduce(
    (sum, item) => sum + (item.size === 'large' ? 2 : 1),
    0
  );

  return (
    <>
      <h3
        className="mb-3 text-lg font-semibold"
        style={{ color: '#111827' }}
      >
        The Essentials Kit
      </h3>
      <div className="space-y-2">
        {ESSENTIALS_BUNDLE.map((item) => {
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
      <div
        className="mt-3 border-t pt-3 text-sm font-medium"
        style={{ borderColor: '#E5E7EB', color: '#374151' }}
      >
        {slotCount} of 6 slots used
      </div>
    </>
  );
};

export const KitSummaryCard: FC<KitSummaryCardProps> = ({ path }) => {
  return (
    <div
      className="rounded-2xl p-6"
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5E7EB',
      }}
    >
      {path === 'essentials' ? (
        <EssentialsKitSummary />
      ) : (
        <div style={{ color: '#6B7280' }}>Custom kit summary — Sprint 2</div>
      )}
    </div>
  );
};
