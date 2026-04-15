import { type FC, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKitStore } from '../../store/kitStore';
import { useMCQStore } from '../../store/mcqStore';
import { CATEGORIES, ITEMS, ITEMS_BY_CATEGORY } from '../../data/kitItems';
import { ESSENTIALS_BUNDLE } from '../../data/essentialsConfig';
import { SubkitSummarySection } from '../summary/SubkitSummarySection';
import { PrimaryButton } from '../ui/PrimaryButton';
import { SecondaryButton } from '../ui/SecondaryButton';

import { CONTAINER_PRICES, calculateCartGrandTotal, calculateSubkitCartTotal } from '../../utils/cartCalculations';
import { calculateSubkitWeightLbs, calculateSubkitVolumePct } from '../../utils/slotCalculations';

const REGULAR_CAPACITY_IN3 = 1728;
const LARGE_CAPACITY_IN3 = 3456;

export const OrderConfirmationScreen: FC = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const navigate = useNavigate();
  const kitPath = useMCQStore((s) => s.kitPath);
  const resetMCQ = useMCQStore((s) => s.resetMCQ);
  const { selectedSubkits, itemSelections, emptyContainers, resetKit } = useKitStore();

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const isEssentials = kitPath === 'essentials';

  // Essentials total: ESSENTIALS_BUNDLE container prices
  const essentialsTotal = ESSENTIALS_BUNDLE.reduce(
    (sum, item) => sum + CONTAINER_PRICES[item.size],
    0
  );

  // Custom total: from kit store
  const customTotal = calculateCartGrandTotal(selectedSubkits, itemSelections, ITEMS);

  const kitTotal = isEssentials ? essentialsTotal : customTotal;

  // Custom path subkit data
  const sorted = [...selectedSubkits].sort((a, b) => a.selectionOrder - b.selectionOrder);
  const subkitData = sorted.map((subkit) => {
    const category = CATEGORIES[subkit.categoryId];
    if (!category) return null;
    const isEmpty = emptyContainers.includes(subkit.subkitId);
    const subkitItems = Object.values(itemSelections)
      .filter((sel) => sel.subkitId === subkit.subkitId)
      .map((sel) => {
        const item = ITEMS.find((i) => i.id === sel.itemId);
        return item ? { item, quantity: sel.quantity } : null;
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null);
    const categoryItems = subkit.categoryId === 'custom'
      ? ITEMS
      : (ITEMS_BY_CATEGORY[subkit.categoryId] ?? []);
    const capacityIn3 = subkit.size === 'large' ? LARGE_CAPACITY_IN3 : REGULAR_CAPACITY_IN3;
    const weightLbs = calculateSubkitWeightLbs(categoryItems, itemSelections, subkit.subkitId);
    const volumePct = calculateSubkitVolumePct(categoryItems, itemSelections, subkit.subkitId, capacityIn3);
    const subtotal = calculateSubkitCartTotal(subkit, itemSelections, ITEMS);
    return { subkit, category, subkitItems, isEmpty, weightLbs, volumePct, subtotal };
  }).filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  const handleStartOver = () => {
    resetKit();
    resetMCQ();
    navigate('/');
  };

  const handleOpenFillKit = () => {
    navigate('/fill');
  };

  // Essentials path: display bundle subkits
  const essentialsSummary = ESSENTIALS_BUNDLE.map((item) => {
    const category = CATEGORIES[item.subkit];
    if (!category) return null;
    return (
      <div key={item.subkit} className="flex items-center gap-3 py-2">
        <span
          className="inline-block h-4 w-4 rounded-full shrink-0"
          style={{ backgroundColor: category.colorBase }}
          aria-hidden="true"
        />
        <span className="text-sm" style={{ color: '#374151' }}>{category.name}</span>
        <span className="ml-auto text-xs" style={{ color: '#6B7280' }}>
          {item.size === 'large' ? 'Large' : 'Regular'}
        </span>
      </div>
    );
  });

  // Custom path: subkit sections
  const customSections = subkitData.map((d) => (
    <SubkitSummarySection
      key={d.subkit.subkitId}
      subkit={d.subkit}
      category={d.category}
      items={d.subkitItems}
      isEmpty={d.isEmpty}
      weightLbs={d.weightLbs}
      volumePct={d.volumePct}
      subtotal={d.subtotal}
    />
  ));

  return (
    <div className="max-w-[960px] mx-auto px-4 md:px-8">
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="text-[36px] font-bold text-[var(--color-neutral-900)] text-center outline-none"
      >
        Your kit is on its way.
      </h1>
      <p className="text-[16px] text-[var(--color-neutral-500)] text-center mt-2">
        {isEssentials
          ? "Here's your Essentials Kit summary."
          : "Here's your custom kit summary."
        }
      </p>

      <div className="mt-8 flex flex-col gap-4">
        {isEssentials ? (
          <div className="space-y-1">{essentialsSummary}</div>
        ) : (
          customSections
        )}
      </div>

      <div className="flex justify-between items-center mt-6 pt-4 border-t border-[var(--color-neutral-200)]">
        <span className="text-[14px] font-medium text-[var(--color-neutral-700)]">Kit Total</span>
        <div className="text-right">
          <span className="text-[22px] font-semibold text-[var(--color-neutral-900)]">
            ${kitTotal.toFixed(2)}
          </span>
          <p className="text-[12px] text-[var(--color-neutral-400)]">
            Containers included · Items priced individually
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-3 max-w-sm mx-auto">
        <PrimaryButton onClick={handleOpenFillKit} className="w-full">
          Now Let's Fill Your Kit →
        </PrimaryButton>
        <SecondaryButton onClick={handleStartOver} className="w-full">
          Start Over
        </SecondaryButton>
      </div>

    </div>
  );
};
