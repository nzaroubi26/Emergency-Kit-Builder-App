import { type FC } from 'react';
import { ESSENTIALS_BUNDLE } from '../../data/essentialsConfig';
import { CATEGORIES, ITEMS } from '../../data/kitItems';
import { useKitStore } from '../../store/kitStore';
import { calculateSubkitCartTotal } from '../../utils/cartCalculations';
import { calculateTotalSlots } from '../../utils/slotCalculations';

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
          const category = CATEGORIES[item.subkit];
          if (!category) return null;
          return (
            <div key={item.subkit} className="flex items-center gap-2 py-1">
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

const CustomKitSummary: FC = () => {
  const selectedSubkits = useKitStore((s) => s.selectedSubkits);
  const itemSelections = useKitStore((s) => s.itemSelections);

  const sorted = [...selectedSubkits].sort((a, b) => a.selectionOrder - b.selectionOrder);
  const slotCount = calculateTotalSlots(selectedSubkits);

  return (
    <>
      <h3
        className="mb-3 text-lg font-semibold"
        style={{ color: '#111827' }}
      >
        Your Custom Kit
      </h3>
      <div className="divide-y" style={{ borderColor: '#E5E7EB' }}>
        {sorted.map((subkit) => {
          const category = CATEGORIES[subkit.categoryId];
          if (!category) return null;

          const itemCount = Object.values(itemSelections)
            .filter((sel) => sel.subkitId === subkit.subkitId && sel.included)
            .length;

          const subtotal = calculateSubkitCartTotal(subkit, itemSelections, ITEMS);

          return (
            <div key={subkit.subkitId} className="px-4 py-3">
              <div className="flex items-center">
                <span
                  className="inline-block h-2 w-2 rounded-full mr-2 shrink-0"
                  style={{ backgroundColor: category.colorBase }}
                  aria-hidden="true"
                />
                <span className="text-sm" style={{ color: '#374151' }}>
                  {category.name}
                </span>
                <span className="ml-auto text-xs" style={{ color: '#6B7280' }}>
                  {SIZE_LABELS[subkit.size] ?? subkit.size}
                </span>
              </div>
              <div className="mt-1 text-xs" style={{ color: '#6B7280' }}>
                {itemCount > 0
                  ? `${itemCount} items · $${subtotal.toFixed(2)}`
                  : <span style={{ color: '#9CA3AF' }}>No items configured</span>
                }
              </div>
            </div>
          );
        })}
      </div>
      <div
        className="mt-3 text-xs"
        style={{ color: '#9CA3AF' }}
      >
        Custom Kit · {slotCount} slots used
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
        <CustomKitSummary />
      )}
    </div>
  );
};
