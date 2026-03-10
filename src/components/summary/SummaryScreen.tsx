import { type FC, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKitStore } from '../../store/kitStore';
import { useSlotState, useTotalSlotsUsed } from '../../hooks/useKitStore';
import { CATEGORIES, ITEMS, ITEMS_BY_CATEGORY } from '../../data';
import { calculateSubkitWeightLbs, calculateSubkitVolumePct } from '../../utils/slotCalculations';
import { HousingUnitVisualizer } from '../visualizer/HousingUnitVisualizer';
import { SubkitSummarySection } from './SubkitSummarySection';
import { PrimaryButton } from '../ui/PrimaryButton';
import { SecondaryButton } from '../ui/SecondaryButton';
import { ConfirmationModal } from '../ui/ConfirmationModal';
import { Analytics } from '../../utils/analytics';
import { initiateCheckout } from '../../services/checkoutService';
import '../../styles/print.css';

const REGULAR_CAPACITY_IN3 = 1728;
const LARGE_CAPACITY_IN3 = 3456;

interface SummaryScreenProps {}

export const SummaryScreen: FC<SummaryScreenProps> = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const navigate = useNavigate();
  const [showStartOverModal, setShowStartOverModal] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const selectedSubkits = useKitStore((s) => s.selectedSubkits);
  const itemSelections = useKitStore((s) => s.itemSelections);
  const emptyContainers = useKitStore((s) => s.emptyContainers);
  const resetKit = useKitStore((s) => s.resetKit);
  const slots = useSlotState();
  const totalSlotsUsed = useTotalSlotsUsed();

  useEffect(() => {
    headingRef.current?.focus();
    Analytics.kitCompleted();
  }, []);

  const sorted = [...selectedSubkits].sort((a, b) => a.selectionOrder - b.selectionOrder);
  const totalSubkits = sorted.length;

  const handleGetMyKit = async () => {
    if (checkoutLoading) return;
    Analytics.ctaClicked();
    setCheckoutError(null);
    setCheckoutLoading(true);
    const result = await initiateCheckout(selectedSubkits, itemSelections, emptyContainers);
    setCheckoutLoading(false);
    if (result.success) {
      window.location.href = result.redirectUrl;
    } else {
      setCheckoutError(result.errorMessage);
    }
  };

  const handleEditMyKit = () => {
    navigate('/builder');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleStartOver = () => {
    setShowStartOverModal(true);
  };

  const handleConfirmStartOver = () => {
    setShowStartOverModal(false);
    resetKit();
    navigate('/builder');
  };

  const handleCancelStartOver = () => {
    setShowStartOverModal(false);
  };

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

    return { subkit, category, subkitItems, isEmpty, weightLbs, volumePct };
  }).filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  const totalKitWeightLbs = subkitData.reduce((sum, d) => sum + d.weightLbs, 0);
  const nonEmptySubkitCount = subkitData.filter((d) => !d.isEmpty && d.subkitItems.length > 0).length;

  const subkitSections = subkitData.map((d) => (
    <SubkitSummarySection
      key={d.subkit.subkitId}
      subkit={d.subkit}
      category={d.category}
      items={d.subkitItems}
      isEmpty={d.isEmpty}
      weightLbs={d.weightLbs}
      volumePct={d.volumePct}
    />
  ));

  return (
    <div>
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="text-2xl font-bold text-[var(--color-neutral-900)] outline-none"
      >
        Review Your Kit
      </h1>
      <p className="mt-1 text-sm text-[var(--color-neutral-500)]">
        {totalSubkits} subkits using {totalSlotsUsed} of 6 slots
      </p>

      <div className="mt-6">
        <p className="text-center text-lg font-medium text-[var(--color-neutral-800)]">
          Your emergency kit is ready. Take the next step to protect your family.
        </p>
        <div className="mt-4 flex flex-col items-center gap-3">
          <PrimaryButton
            onClick={handleGetMyKit}
            ariaDisabled={checkoutLoading}
            className="btn-get-my-kit"
          >
            {checkoutLoading ? 'Processing...' : 'Get My Kit'}
          </PrimaryButton>
          {checkoutError && (
            <div role="alert" className="flex items-center gap-2 rounded-md bg-red-50 px-4 py-2 text-sm text-red-700">
              <span>{checkoutError}</span>
              <button
                type="button"
                onClick={() => setCheckoutError(null)}
                className="ml-1 font-medium underline"
                aria-label="Dismiss error"
              >
                Dismiss
              </button>
            </div>
          )}
          <SecondaryButton onClick={handleEditMyKit} className="btn-edit">
            Edit My Kit
          </SecondaryButton>
        </div>
      </div>

      <div className="mt-8">
        <HousingUnitVisualizer slots={slots} readOnly={true} />
      </div>

      <div className="mt-8 flex flex-col gap-4">
        <div
          className="flex items-center gap-3 py-2 px-4 mb-4"
          style={{ backgroundColor: '#F3F4F6', borderRadius: '10px' }}
          data-testid="kit-stats-row"
        >
          <span className="text-xs font-normal text-[var(--color-neutral-500)]">
            ~{totalKitWeightLbs.toFixed(1)} lbs total
          </span>
          <span className="text-[var(--color-neutral-300)] mx-1">·</span>
          <span className="text-xs font-normal text-[var(--color-neutral-500)]">
            {nonEmptySubkitCount} subkits configured
          </span>
        </div>
        {subkitSections}
      </div>

      <div className="mt-8 flex flex-col items-center gap-3">
        <SecondaryButton onClick={handlePrint} className="btn-print">
          Print My Kit
        </SecondaryButton>
        <button
          type="button"
          onClick={handleStartOver}
          className="btn-start-over text-sm text-[var(--color-neutral-500)] underline"
        >
          Start Over
        </button>
      </div>

      <ConfirmationModal
        open={showStartOverModal}
        title="Start Over?"
        message="Starting over will clear your entire kit configuration. Are you sure?"
        confirmLabel="Start Over"
        cancelLabel="Cancel"
        onConfirm={handleConfirmStartOver}
        onCancel={handleCancelStartOver}
      />
    </div>
  );
};
