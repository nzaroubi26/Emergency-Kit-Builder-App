import { type FC, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { HousingUnitVisualizer } from '../visualizer/HousingUnitVisualizer';
import { SlotFullIndicator } from '../visualizer/SlotFullIndicator';
import { SubkitCard } from './SubkitCard';
import { ElevationGroupHeader } from './ElevationGroupHeader';
import { PrimaryButton } from '../ui/PrimaryButton';
import { useSlotState, useTotalSlotsUsed, useIsAtCapacity, useCanProceedToConfig } from '../../hooks/useKitStore';
import { useKitStore } from '../../store/kitStore';
import { CATEGORIES } from '../../data';
import { useMCQStore } from '../../store/mcqStore';
import { announcePolite } from '../../utils/announce';
import { Analytics } from '../../utils/analytics';
import { calculateTotalSlots } from '../../utils/slotCalculations';
import { computeElevatedSubkits } from '../../utils/elevationRules';
import type { KitCategory, SubkitSize } from '../../types';

interface SubkitSelectionScreenProps {}

const ALL_CATEGORIES: KitCategory[] = Object.values(CATEGORIES);

export const SubkitSelectionScreen: FC<SubkitSelectionScreenProps> = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const navigate = useNavigate();
  const slots = useSlotState();
  const totalSlotsUsed = useTotalSlotsUsed();
  const isAtCapacity = useIsAtCapacity();
  const canProceed = useCanProceedToConfig();
  const selectedSubkits = useKitStore((s) => s.selectedSubkits);
  const selectSubkit = useKitStore((s) => s.selectSubkit);
  const deselectSubkit = useKitStore((s) => s.deselectSubkit);
  const setSubkitSize = useKitStore((s) => s.setSubkitSize);
  const setCurrentConfigIndex = useKitStore((s) => s.setCurrentConfigIndex);

  const emergencyTypes = useMCQStore((s) => s.emergencyTypes);
  const householdComposition = useMCQStore((s) => s.householdComposition);

  const { elevated, q2Elevated } = computeElevatedSubkits(emergencyTypes, householdComposition);

  const q2Categories = ALL_CATEGORIES.filter((c) => q2Elevated.has(c.id));
  const q1OnlyCategories = ALL_CATEGORIES.filter((c) => elevated.has(c.id) && !q2Elevated.has(c.id));
  const nonElevated = ALL_CATEGORIES.filter((c) => !elevated.has(c.id));
  const sortedCategories = [...q2Categories, ...q1OnlyCategories, ...nonElevated];

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const selectedIds = new Set(selectedSubkits.map((s) => s.subkitId));
  const sizeMap = new Map(selectedSubkits.map((s) => [s.subkitId, s.size]));

  const handleSelect = (categoryId: string) => {
    const category = CATEGORIES[categoryId];
    const categoryName = category?.name ?? categoryId;

    if (selectedIds.has(categoryId)) {
      deselectSubkit(categoryId);
      announcePolite(`${categoryName} removed`);
    } else {
      const currentSlots = calculateTotalSlots(selectedSubkits);
      const newSlotIndex = currentSlots + 1;
      selectSubkit(categoryId);
      Analytics.subkitSelected(categoryId, 'regular');
      announcePolite(`${categoryName} added to slot ${newSlotIndex}`);
    }
  };

  const handleSizeChange = (categoryId: string, size: SubkitSize): boolean => {
    const success = setSubkitSize(categoryId, size);
    if (success) {
      const category = CATEGORIES[categoryId];
      const categoryName = category?.name ?? categoryId;
      announcePolite(`${categoryName} changed to ${size}`);
    }
    return success;
  };

  const hasElevated = elevated.size > 0;

  const cardGrid = sortedCategories.map((category, index) => {
    const isSelected = selectedIds.has(category.id);
    const isDisabled = isAtCapacity;
    const currentSize = sizeMap.get(category.id) ?? 'regular';
    const isElevated = elevated.has(category.id);
    const isLastElevated = isElevated && (index + 1 >= sortedCategories.length || !elevated.has(sortedCategories[index + 1].id));

    return (
      <div key={category.id} className={isLastElevated && hasElevated ? 'mb-4' : ''}>
        <SubkitCard
          category={category}
          selected={isSelected}
          disabled={isDisabled}
          currentSize={currentSize}
          elevated={isElevated}
          onSelect={handleSelect}
          onSizeChange={handleSizeChange}
        />
      </div>
    );
  });

  const minMessageId = 'min-subkit-message';
  const ctaDisabled = !canProceed;

  const handleProceed = () => {
    if (!canProceed) return;
    const sorted = [...selectedSubkits].sort((a, b) => a.selectionOrder - b.selectionOrder);
    const firstSubkitId = sorted[0]?.subkitId;
    if (!firstSubkitId) return;
    setCurrentConfigIndex(0);
    navigate(`/configure/${firstSubkitId}`);
  };

  const minMessage = ctaDisabled
    ? (
      <p id={minMessageId} className="text-sm" style={{ color: 'var(--color-status-warning)' }}>
        Choose at least 3 categories to continue
      </p>
    )
    : null;

  return (
    <div className="mx-auto max-w-[1120px] px-6" style={{ backgroundColor: 'var(--color-neutral-50, #F8F9FA)' }}>
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="text-2xl font-bold text-[var(--color-neutral-900)] text-center outline-none"
      >
        Build Your Emergency Kit
      </h1>
      <p className="mt-1 text-sm text-[var(--color-neutral-500)] text-center">
        Choose 3–6 categories for your kit
      </p>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:gap-8">
        {/* Left column: visualizer + slot bar + CTA */}
        <div className="w-full lg:w-[40%] lg:sticky lg:top-6 lg:self-start">
          <HousingUnitVisualizer
            slots={slots}
            onSlotClick={(slotIndex) => {
              const slot = slots[slotIndex];
              if (slot && slot.status === 'filled' && slot.subkitId) {
                navigate(`/configure/${slot.subkitId}`);
              }
            }}
          />
          <p className="mt-3 text-center text-sm text-[var(--color-neutral-500)]">
            {totalSlotsUsed} of 6 slots used
          </p>
          <SlotFullIndicator isAtCapacity={isAtCapacity} />
          <div className="mt-4 flex flex-col items-center gap-2">
            {minMessage}
            <PrimaryButton
              onClick={handleProceed}
              ariaDisabled={ctaDisabled}
              ariaDescribedBy={ctaDisabled ? minMessageId : undefined}
            >
              Configure Items
            </PrimaryButton>
          </div>
        </div>

        {/* Right column: subkit cards */}
        <div className="w-full lg:w-[60%]">
          {hasElevated && (
            <section aria-label="Suggested subkits for your situation">
              <ElevationGroupHeader visible={hasElevated} />
            </section>
          )}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            {cardGrid}
          </div>
        </div>
      </div>
    </div>
  );
};
