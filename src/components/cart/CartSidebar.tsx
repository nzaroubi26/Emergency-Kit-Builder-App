import { type FC, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useKitStore } from '../../store/kitStore';
import { ITEMS, CATEGORIES } from '../../data/kitItems';
import {
  CONTAINER_PRICES,
  calculateSubkitCartTotal,
  calculateCartGrandTotal,
} from '../../utils/cartCalculations';
import { getCategoryColor, getCategoryIcon } from '../../utils/categoryUtils';
import { resolveIcon } from '../../utils/iconResolver';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartSidebar: FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const { selectedSubkits, itemSelections, emptyContainers } = useKitStore();
  const { toggleItem, setItemQuantity } = useKitStore();

  useEffect(() => {
    if (isOpen) panelRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const sortedSubkits = [...selectedSubkits].sort(
    (a, b) => a.selectionOrder - b.selectionOrder
  );

  const showEmptyState = sortedSubkits.length === 0;

  const grandTotal = calculateCartGrandTotal(
    selectedSubkits,
    itemSelections,
    ITEMS
  ).toFixed(2);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          style={{ transition: 'opacity 200ms cubic-bezier(0.4,0,0.2,1)' }}
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Cart"
        tabIndex={-1}
        className={`fixed inset-y-0 right-0 w-80 bg-white z-50 flex flex-col focus:outline-none ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          boxShadow: '0 20px 25px rgba(0,0,0,0.12)',
          transition: 'transform 240ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-[var(--color-neutral-200)]">
          <h2 className="text-[18px] font-semibold text-[var(--color-neutral-900)]">
            Cart
          </h2>
          <button
            onClick={onClose}
            aria-label="Close cart"
            className="text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-900)]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          {showEmptyState ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-[14px] text-[var(--color-neutral-400)] text-center">
                Your kit is empty. Start by selecting subkits.
              </p>
            </div>
          ) : (
            sortedSubkits.map((subkit, index) => {
              const colors = getCategoryColor(subkit.categoryId);
              const categoryBaseColor = colors?.base ?? '#666';
              const categoryName =
                CATEGORIES[subkit.categoryId]?.name ?? subkit.categoryId;
              const iconName = getCategoryIcon(subkit.categoryId);
              const IconComponent = iconName
                ? resolveIcon(iconName)
                : undefined;
              const isEmptyContainer = emptyContainers.includes(
                subkit.subkitId
              );
              const includedItems = Object.values(itemSelections)
                .filter(
                  (sel) =>
                    sel.subkitId === subkit.subkitId && sel.included
                )
                .sort((a, b) => a.itemId.localeCompare(b.itemId));
              const subtotal = calculateSubkitCartTotal(
                subkit,
                itemSelections,
                ITEMS
              ).toFixed(2);
              const sizeLabel =
                subkit.size === 'large' ? 'Large' : 'Regular';
              const containerPrice = CONTAINER_PRICES[subkit.size];

              return (
                <div key={subkit.subkitId}>
                  {index > 0 && (
                    <hr className="border-[var(--color-neutral-100)] my-3" />
                  )}
                  <div
                    className="border-b border-[var(--color-neutral-100)] mb-1 pl-2 py-1 flex items-center justify-between"
                    style={{
                      borderLeftWidth: '4px',
                      borderLeftStyle: 'solid',
                      borderLeftColor: categoryBaseColor,
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      {IconComponent && (
                        <IconComponent size={16} />
                      )}
                      <span className="text-[14px] font-medium text-[var(--color-neutral-900)]">
                        {categoryName}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[12px] text-[var(--color-neutral-500)]">
                        {sizeLabel}
                      </span>
                      <span className="text-[12px] text-[var(--color-neutral-500)]">
                        ${containerPrice}
                      </span>
                    </div>
                  </div>

                  {isEmptyContainer ? (
                    <div className="text-[12px] text-[var(--color-neutral-400)] italic py-2 px-1">
                      ◈ Empty container
                    </div>
                  ) : (
                    includedItems.map((sel) => {
                      const item = ITEMS.find(
                        (i) => i.id === sel.itemId
                      );
                      if (!item) return null;
                      const lineTotal =
                        item.pricePlaceholder !== null
                          ? `$${(item.pricePlaceholder * sel.quantity).toFixed(2)}`
                          : '—';

                      return (
                        <div
                          key={sel.itemId}
                          className="flex items-center gap-2 py-1 pl-2"
                          style={{
                            borderLeftWidth: '4px',
                            borderLeftStyle: 'solid',
                            borderLeftColor: categoryBaseColor,
                          }}
                        >
                          <span className="text-[14px] text-[var(--color-neutral-700)] truncate flex-1 min-w-0">
                            {item.name}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() =>
                                setItemQuantity(
                                  sel.subkitId,
                                  sel.itemId,
                                  sel.quantity - 1
                                )
                              }
                              disabled={sel.quantity === 1}
                              className={`w-6 h-6 rounded-sm border border-[var(--color-neutral-200)] text-[12px] text-[var(--color-neutral-600)] ${
                                sel.quantity === 1
                                  ? 'opacity-40 cursor-not-allowed'
                                  : ''
                              }`}
                              aria-label={`Decrease quantity of ${item.name}`}
                            >
                              −
                            </button>
                            <span className="text-[12px] text-[var(--color-neutral-600)] w-4 text-center">
                              {sel.quantity}
                            </span>
                            <button
                              onClick={() =>
                                setItemQuantity(
                                  sel.subkitId,
                                  sel.itemId,
                                  sel.quantity + 1
                                )
                              }
                              disabled={sel.quantity === 10}
                              className={`w-6 h-6 rounded-sm border border-[var(--color-neutral-200)] text-[12px] text-[var(--color-neutral-600)] ${
                                sel.quantity === 10
                                  ? 'opacity-40 cursor-not-allowed'
                                  : ''
                              }`}
                              aria-label={`Increase quantity of ${item.name}`}
                            >
                              +
                            </button>
                          </div>
                          <span className="text-[12px] text-[var(--color-neutral-500)] whitespace-nowrap">
                            {lineTotal}
                          </span>
                          <button
                            onClick={() =>
                              toggleItem(sel.subkitId, sel.itemId)
                            }
                            aria-label={`Remove ${item.name} from cart`}
                            className="text-[var(--color-neutral-400)] hover:text-[var(--color-neutral-700)]"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      );
                    })
                  )}

                  <div className="flex justify-between items-center pt-2 mt-1 border-t border-[var(--color-neutral-100)]">
                    <span className="text-[12px] text-[var(--color-neutral-500)]">
                      Subtotal
                    </span>
                    <span className="text-[14px] font-medium text-[var(--color-neutral-700)]">
                      ${subtotal}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="flex-shrink-0 border-t border-[var(--color-neutral-200)] px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-medium text-[var(--color-neutral-700)]">
              Total
            </span>
            <span className="text-[18px] font-semibold text-[var(--color-neutral-900)]">
              ${grandTotal}
            </span>
          </div>
          <p className="text-[12px] text-[var(--color-neutral-400)] mt-1">
            Container prices included
          </p>
        </div>
      </div>
    </>
  );
};
