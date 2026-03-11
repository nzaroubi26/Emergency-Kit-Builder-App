import { type FC, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKitStore } from '../../store/kitStore';
import { CATEGORIES, ITEMS, ITEMS_BY_CATEGORY } from '../../data';
import { SubkitSummarySection } from '../summary/SubkitSummarySection';
import { SecondaryButton } from '../ui/SecondaryButton';
import { calculateCartGrandTotal, calculateSubkitCartTotal } from '../../utils/cartCalculations';
import { calculateSubkitWeightLbs, calculateSubkitVolumePct } from '../../utils/slotCalculations';

const REGULAR_CAPACITY_IN3 = 1728;
const LARGE_CAPACITY_IN3 = 3456;

export const OrderConfirmationScreen: FC = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const navigate = useNavigate();
  const { selectedSubkits, itemSelections, emptyContainers, resetKit } = useKitStore();

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const grandTotal = calculateCartGrandTotal(selectedSubkits, itemSelections, ITEMS);
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
    navigate('/builder');
  };

  const subkitSections = subkitData.map((d) => (
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
        Here's a summary of what you configured.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        {subkitSections}
      </div>

      <div className="flex justify-between items-center mt-6 pt-4 border-t border-[var(--color-neutral-200)]">
        <span className="text-[14px] font-medium text-[var(--color-neutral-700)]">Kit Total</span>
        <div className="text-right">
          <span className="text-[22px] font-semibold text-[var(--color-neutral-900)]">
            ${grandTotal.toFixed(2)}
          </span>
          <p className="text-[12px] text-[var(--color-neutral-400)]">
            Containers included · Items priced individually
          </p>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <SecondaryButton onClick={handleStartOver}>
          Start Over
        </SecondaryButton>
      </div>
    </div>
  );
};
