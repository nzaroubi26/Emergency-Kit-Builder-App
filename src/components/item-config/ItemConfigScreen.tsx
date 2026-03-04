import { type FC, useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { CATEGORIES, ITEMS_BY_CATEGORY } from '../../data';
import { useKitStore } from '../../store/kitStore';
import { useIsEmptyContainer } from '../../hooks/useKitStore';
import { ItemCard } from './ItemCard';
import { SubkitProgressIndicator } from './SubkitProgressIndicator';
import { EmptyContainerOption } from './EmptyContainerOption';
import { PrimaryButton } from '../ui/PrimaryButton';
import { ConfirmationModal } from '../ui/ConfirmationModal';
import { Analytics } from '../../utils/analytics';

interface ItemConfigScreenProps {}

export const ItemConfigScreen: FC<ItemConfigScreenProps> = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { subkitId } = useParams<{ subkitId: string }>();
  const navigate = useNavigate();
  const [showBackModal, setShowBackModal] = useState(false);

  const selectedSubkits = useKitStore((s) => s.selectedSubkits);
  const itemSelections = useKitStore((s) => s.itemSelections);
  const toggleItem = useKitStore((s) => s.toggleItem);
  const setItemQuantity = useKitStore((s) => s.setItemQuantity);
  const toggleEmptyContainer = useKitStore((s) => s.toggleEmptyContainer);
  const setCurrentConfigIndex = useKitStore((s) => s.setCurrentConfigIndex);
  const isEmpty = useIsEmptyContainer(subkitId ?? '');

  useEffect(() => {
    headingRef.current?.focus();
  }, [subkitId]);

  const category = subkitId ? CATEGORIES[subkitId] : undefined;
  const items = subkitId ? (ITEMS_BY_CATEGORY[subkitId] ?? []) : [];

  const isAllFilled = useMemo(
    () => items.length > 0 && items.every((item) => !!itemSelections[`${subkitId}::${item.id}`]),
    [items, itemSelections, subkitId]
  );

  const handleFillToggle = useCallback(() => {
    if (!subkitId) return;
    if (isAllFilled) {
      items
        .filter((item) => !!itemSelections[`${subkitId}::${item.id}`])
        .forEach((item) => toggleItem(subkitId, item.id));
    } else {
      items
        .filter((item) => !itemSelections[`${subkitId}::${item.id}`])
        .forEach((item) => toggleItem(subkitId, item.id));
    }
  }, [subkitId, isAllFilled, items, itemSelections, toggleItem]);

  const sorted = [...selectedSubkits].sort((a, b) => a.selectionOrder - b.selectionOrder);
  const currentIndex = sorted.findIndex((s) => s.subkitId === subkitId);
  const totalSubkits = sorted.length;
  const isFirstSubkit = currentIndex === 0;
  const isLastSubkit = currentIndex === totalSubkits - 1;

  useEffect(() => {
    if (currentIndex >= 0) {
      setCurrentConfigIndex(currentIndex);
    }
  }, [currentIndex, setCurrentConfigIndex]);

  const handleToggle = useCallback(
    (itemId: string) => {
      if (!subkitId) return;
      const key = `${subkitId}::${itemId}`;
      const isCurrentlySelected = !!useKitStore.getState().itemSelections[key];
      toggleItem(subkitId, itemId);
      if (!isCurrentlySelected) {
        Analytics.itemIncluded(subkitId, itemId);
      }
    },
    [subkitId, toggleItem]
  );

  const handleIncrement = useCallback(
    (itemId: string) => {
      if (!subkitId) return;
      const key = `${subkitId}::${itemId}`;
      const current = useKitStore.getState().itemSelections[key];
      if (current) {
        setItemQuantity(subkitId, itemId, current.quantity + 1);
      }
    },
    [subkitId, setItemQuantity]
  );

  const handleDecrement = useCallback(
    (itemId: string) => {
      if (!subkitId) return;
      const key = `${subkitId}::${itemId}`;
      const current = useKitStore.getState().itemSelections[key];
      if (current) {
        setItemQuantity(subkitId, itemId, current.quantity - 1);
      }
    },
    [subkitId, setItemQuantity]
  );

  const handleBack = () => {
    if (isFirstSubkit) {
      setShowBackModal(true);
    } else {
      const prevSubkit = sorted[currentIndex - 1];
      if (prevSubkit) {
        navigate(`/configure/${prevSubkit.subkitId}`);
      }
    }
  };

  const handleNext = () => {
    if (isLastSubkit) {
      navigate('/summary');
    } else {
      const nextSubkit = sorted[currentIndex + 1];
      if (nextSubkit) {
        const route = nextSubkit.categoryId === 'custom'
          ? '/configure/custom'
          : `/configure/${nextSubkit.subkitId}`;
        navigate(route);
      }
    }
  };

  const handleBackToSelection = () => {
    setShowBackModal(true);
  };

  const handleConfirmBack = () => {
    setShowBackModal(false);
    navigate('/builder');
  };

  const handleCancelBack = () => {
    setShowBackModal(false);
  };

  if (!category || !subkitId) {
    return null;
  }

  const headingColor: React.CSSProperties = {
    borderLeftColor: category.colorBase,
  };

  const itemCards = items.map((item) => {
    const selKey = `${subkitId}::${item.id}`;
    const selection = itemSelections[selKey];
    const included = !!selection;
    const qty = selection?.quantity ?? 1;
    return (
      <ItemCard
        key={item.id}
        item={item}
        category={category}
        included={included}
        quantity={qty}
        onToggle={handleToggle}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
      />
    );
  });

  return (
    <div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleBack}
          aria-label="Go back"
          className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-neutral-200)] text-[var(--color-neutral-700)]"
        >
          <ArrowLeft size={18} aria-hidden="true" />
        </button>
        <div className="flex-1">
          <SubkitProgressIndicator
            current={currentIndex + 1}
            total={totalSubkits}
            categoryColor={category.colorBase}
          />
        </div>
      </div>
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="mt-4 text-2xl font-bold text-[var(--color-neutral-900)] outline-none border-l-4 pl-3"
        style={headingColor}
      >
        Configure Your {category.name} Subkit
      </h1>
      <p className="mt-1 text-sm text-[var(--color-neutral-500)]">
        Select the items you want to include
      </p>
      <div className="mt-4">
        <EmptyContainerOption
          checked={isEmpty}
          categoryColor={category.colorBase}
          onChange={() => toggleEmptyContainer(subkitId)}
        />
      </div>
      <div
        className="mt-3 rounded-[var(--radius-md)] border border-[var(--color-neutral-200)] p-3"
        style={{
          opacity: isEmpty ? 0.45 : 1,
          cursor: isEmpty ? 'not-allowed' : 'auto',
          transition: 'opacity var(--duration-default) var(--ease-standard)',
        }}
      >
        <label className="flex cursor-pointer items-start gap-3" style={{ cursor: isEmpty ? 'not-allowed' : 'pointer' }}>
          <input
            type="checkbox"
            checked={isAllFilled}
            disabled={isEmpty}
            onChange={handleFillToggle}
            className="mt-0.5 h-4 w-4 rounded"
            style={isAllFilled ? { accentColor: category.colorBase } : {}}
            aria-label="Fill my kit for me"
          />
          <span className="text-sm text-[var(--color-neutral-700)]">
            Fill my kit for me
          </span>
        </label>
      </div>
      <div
        className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3"
        style={{
          opacity: isEmpty ? 0.35 : 1,
          pointerEvents: isEmpty ? 'none' : 'auto',
          transition: 'opacity var(--duration-default) var(--ease-standard)',
        }}
      >
        {itemCards}
      </div>
      <div className="mt-8 flex flex-col items-center gap-3">
        <PrimaryButton onClick={handleNext}>
          {isLastSubkit ? 'Review My Kit' : 'Next Subkit'}
        </PrimaryButton>
        <button
          type="button"
          onClick={handleBackToSelection}
          className="text-sm text-[var(--color-neutral-500)] underline"
        >
          Back to Subkit Selection
        </button>
      </div>
      <ConfirmationModal
        open={showBackModal}
        title="Go Back to Selection?"
        message="Going back will keep all your selections. You can return at any time."
        confirmLabel="Go Back"
        cancelLabel="Stay Here"
        onConfirm={handleConfirmBack}
        onCancel={handleCancelBack}
      />
    </div>
  );
};
