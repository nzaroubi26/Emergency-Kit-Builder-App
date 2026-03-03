import { type FC, useEffect, useRef, type KeyboardEvent } from 'react';

interface ConfirmationModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: FC<ConfirmationModalProps> = ({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}) => {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      cancelRef.current?.focus();
    }
  }, [open]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onCancel();
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
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onClick={onCancel}
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div
          ref={dialogRef}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-message"
          className="pointer-events-auto mx-4 w-full max-w-md rounded-[var(--radius-lg)] bg-[var(--color-neutral-white)] p-6"
          style={{ boxShadow: 'var(--shadow-3)' }}
          onKeyDown={handleKeyDown}
        >
          <h2 id="modal-title" className="text-lg font-semibold text-[var(--color-neutral-900)]">
            {title}
          </h2>
          <p id="modal-message" className="mt-2 text-sm text-[var(--color-neutral-500)]">
            {message}
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              ref={cancelRef}
              type="button"
              onClick={onCancel}
              className="rounded-[var(--radius-md)] px-4 py-2 text-sm font-medium text-[var(--color-neutral-700)] border border-[var(--color-neutral-200)]"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="rounded-[var(--radius-md)] px-4 py-2 text-sm font-semibold text-white"
              style={{ backgroundColor: 'var(--color-brand-primary)' }}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
