import { type FC, useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { CATEGORIES, ITEMS_BY_CATEGORY, STANDARD_CATEGORY_IDS } from '../../data';
import { useKitStore } from '../../store/kitStore';
import { useIsEmptyContainer } from '../../hooks/useKitStore';
import { ItemCard } from './ItemCard';
import { SubkitProgressIndicator } from './SubkitProgressIndicator';
import { EmptyContainerOption } from './EmptyContainerOption';
import { CategoryGroupHeader } from './CategoryGroupHeader';
import { PrimaryButton } from '../ui/PrimaryButton';
import { ConfirmationModal } from '../ui/ConfirmationModal';

interface CustomSubkitScreenProps {}

const SUBKIT_ID = 'custom';

export const CustomSubkitScreen: FC<CustomSubkitScreenProps> = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const navigate = useNavigate();
  const [showBackModal, setShowBackModal] = useState(false);

  const selectedSubkits = useKitStore((s) => s.selectedSubkits);
  const itemSelections = useKitStore((s) => s.itemSelections);
  const toggleItem = useKitStore((s) => s.toggleItem);
  const setItemQuantity = useKitStore((s) => s.setItemQuantity);
  const toggleEmptyContainer = useKitStore((s) => s.toggleEmptyContainer);
  const setCurrentConfigIndex = useKitStore((s) => s.setCurrentConfigIndex);
  const isEmpty = useIsEmptyContainer(SUBKIT_ID);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const sorted = [...selectedSubkits].sort((a, b) => a.selectionOrder - b.selectionOrder);
  const currentIndex = sorted.findIndex((s) => s.subkitId === SUBKIT_ID);
  const totalSubkits = sorted.length;
  const isLastSubkit = currentIndex === totalSubkits - 1;

  useEffect(() => {
    if (currentIndex >= 0) {
      setCurrentConfigIndex(currentIndex);
    }
  }, [currentIndex, setCurrentConfigIndex]);

  const category = CATEGORIES[SUBKIT_ID];

  const handleToggle = useCallback(
    (itemId: string) => {
      toggleItem(SUBKIT_ID, itemId);
    },
    [toggleItem]
  );

  const handleIncrement = useCallback(
    (itemId: string) => {
      const key = `${SUBKIT_ID}::${itemId}`;
      const current = useKitStore.getState().itemSelections[key];
      if (current) {
        setItemQuantity(SUBKIT_ID, itemId, current.quantity + 1);
      }
    },
    [setItemQuantity]
  );

  const handleDecrement = useCallback(
    (itemId: string) => {
      const key = `${SUBKIT_ID}::${itemId}`;
      const current = useKitStore.getState().itemSelections[key];
      if (current) {
        setItemQuantity(SUBKIT_ID, itemId, current.quantity - 1);
      }
    },
    [setItemQuantity]
  );

  const handleBack = () => {
    if (currentIndex === 0) {
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
    navigate('/');
  };

  const handleCancelBack = () => {
    setShowBackModal(false);
  };

  const handleJump = (categoryId: string) => {
    const el = document.getElementById(`category-${categoryId}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const jumpNav = STANDARD_CATEGORY_IDS.map((catId) => {
    const cat = CATEGORIES[catId];
    if (!cat) return null;
    return (
      <button
        key={catId}
        type="button"
        onClick={() => handleJump(catId)}
        className="rounded-full px-3 py-1 text-xs font-medium border"
        style={{ borderColor: cat.colorBase, color: cat.colorBase }}
      >
        {cat.name}
      </button>
    );
  });

  const categoryGroups = STANDARD_CATEGORY_IDS.map((catId) => {
    const cat = CATEGORIES[catId];
    const items = ITEMS_BY_CATEGORY[catId] ?? [];
    if (!cat || items.length === 0) return null;

    const itemCards = items.map((item) => {
      const selKey = `${SUBKIT_ID}::${item.id}`;
      const selection = itemSelections[selKey];
      const included = !!selection;
      const qty = selection?.quantity ?? 1;
      return (
        <ItemCard
          key={item.id}
          item={item}
          category={cat}
          included={included}
          quantity={qty}
          onToggle={handleToggle}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
        />
      );
    });

    return (
      <div key={catId} className="flex flex-col gap-3">
        <CategoryGroupHeader category={cat} />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {itemCards}
        </div>
      </div>
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
        style={{ borderLeftColor: category.colorBase }}
      >
        Build Your Custom Subkit
      </h1>
      <p className="mt-1 text-sm text-[var(--color-neutral-500)]">
        Browse items from all categories
      </p>
      <div className="mt-4">
        <EmptyContainerOption
          checked={isEmpty}
          categoryColor={category.colorBase}
          onChange={() => toggleEmptyContainer(SUBKIT_ID)}
        />
      </div>
      <nav className="mt-4 flex flex-wrap gap-2" aria-label="Jump to category">
        {jumpNav}
      </nav>
      <div
        className="mt-6 flex flex-col gap-8"
        style={{
          opacity: isEmpty ? 0.35 : 1,
          pointerEvents: isEmpty ? 'none' : 'auto',
          transition: 'opacity var(--duration-default) var(--ease-standard)',
        }}
      >
        {categoryGroups}
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
