import { type FC, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKitStore } from '../../store/kitStore';
import { useSlotState, useTotalSlotsUsed } from '../../hooks/useKitStore';
import { CATEGORIES, ITEMS } from '../../data';
import { HousingUnitVisualizer } from '../visualizer/HousingUnitVisualizer';
import { SubkitSummarySection } from './SubkitSummarySection';
import { PrimaryButton } from '../ui/PrimaryButton';
import { SecondaryButton } from '../ui/SecondaryButton';
import { ConfirmationModal } from '../ui/ConfirmationModal';
import { ENV } from '../../tokens/env';
import '../../styles/print.css';

interface SummaryScreenProps {}

export const SummaryScreen: FC<SummaryScreenProps> = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const navigate = useNavigate();
  const [showStartOverModal, setShowStartOverModal] = useState(false);

  const selectedSubkits = useKitStore((s) => s.selectedSubkits);
  const itemSelections = useKitStore((s) => s.itemSelections);
  const emptyContainers = useKitStore((s) => s.emptyContainers);
  const resetKit = useKitStore((s) => s.resetKit);
  const slots = useSlotState();
  const totalSlotsUsed = useTotalSlotsUsed();

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const sorted = [...selectedSubkits].sort((a, b) => a.selectionOrder - b.selectionOrder);
  const totalSubkits = sorted.length;

  const handleGetMyKit = () => {
    window.open(ENV.purchaseUrl, '_blank', 'noopener,noreferrer');
  };

  const handleEditMyKit = () => {
    navigate('/');
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
    navigate('/');
  };

  const handleCancelStartOver = () => {
    setShowStartOverModal(false);
  };

  const subkitSections = sorted.map((subkit) => {
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

    return (
      <SubkitSummarySection
        key={subkit.subkitId}
        subkit={subkit}
        category={category}
        items={subkitItems}
        isEmpty={isEmpty}
      />
    );
  });

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
          <PrimaryButton onClick={handleGetMyKit} className="btn-get-my-kit">
            Get My Kit
          </PrimaryButton>
          <SecondaryButton onClick={handleEditMyKit} className="btn-edit">
            Edit My Kit
          </SecondaryButton>
        </div>
      </div>

      <div className="mt-8">
        <HousingUnitVisualizer slots={slots} readOnly={true} />
      </div>

      <div className="mt-8 flex flex-col gap-4">
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
