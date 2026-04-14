import { type FC, useEffect, useRef, type KeyboardEvent } from 'react';
import { Package } from 'lucide-react';

interface FillKitStubModalProps {
  open: boolean;
  onClose: () => void;
}

export const FillKitStubModal: FC<FillKitStubModalProps> = ({ open, onClose }) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement as HTMLElement;
      closeRef.current?.focus();
    } else if (triggerRef.current) {
      triggerRef.current.focus();
      triggerRef.current = null;
    }
  }, [open]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key === 'Tab') {
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="fill-kit-modal-title"
          className="pointer-events-auto mx-4 w-full max-w-[400px] rounded-2xl bg-white p-8 text-center"
          style={{ boxShadow: 'var(--shadow-3, 0 10px 25px rgba(0,0,0,0.1))' }}
          onKeyDown={handleKeyDown}
        >
          <Package size={48} style={{ color: '#1F4D35' }} className="mx-auto" aria-hidden="true" />
          <h2
            id="fill-kit-modal-title"
            className="mt-4 text-[22px] font-semibold"
            style={{ color: '#111827' }}
          >
            Coming Soon
          </h2>
          <p className="mt-2 text-base" style={{ color: '#6B7280' }}>
            We're building the next phase of your emergency prep experience. Check back soon to fill your kit with recommended products.
          </p>
          <div className="mt-6 flex justify-center">
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="rounded-[var(--radius-md)] px-8 py-3 text-sm font-semibold text-white max-w-[200px] w-full"
              style={{ backgroundColor: 'var(--color-brand-primary, #1F4D35)', cursor: 'pointer' }}
            >
              Got It
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
