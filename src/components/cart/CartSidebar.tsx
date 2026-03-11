import { type FC, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartSidebar: FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const panelRef = useRef<HTMLDivElement>(null);

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

        <div className="flex-1 overflow-y-auto px-4 py-3 flex items-center justify-center">
          <p className="text-[14px] text-[var(--color-neutral-400)]">
            Your cart is empty.
          </p>
        </div>

        <div className="flex-shrink-0 border-t border-[var(--color-neutral-200)] px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-medium text-[var(--color-neutral-700)]">
              Total
            </span>
            <span className="text-[14px] font-medium text-[var(--color-neutral-700)]">
              $0.00
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
