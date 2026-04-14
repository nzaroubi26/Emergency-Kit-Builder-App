import { type FC, type ReactNode, type KeyboardEvent, useState, useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import type { KitCategory, SubkitSize } from '../../types';
import { resolveIcon } from '../../utils/iconResolver';
import { SizeToggle } from './SizeToggle';
import { ElevationBadge } from './ElevationBadge';
import { announceAssertive } from '../../utils/announce';

interface SubkitCardProps {
  category: KitCategory;
  selected: boolean;
  disabled: boolean;
  currentSize?: SubkitSize;
  elevated?: boolean;
  onSelect: (categoryId: string) => void;
  onSizeChange?: (categoryId: string, size: SubkitSize) => boolean;
}

export const SubkitCard: FC<SubkitCardProps> = ({
  category,
  selected,
  disabled,
  currentSize = 'regular',
  elevated,
  onSelect,
  onSizeChange,
}) => {
  const IconComponent = resolveIcon(category.icon);
  const isCustom = category.id === 'custom';
  const [sizeBlocked, setSizeBlocked] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleClick = () => {
    if (disabled && !selected) return;
    onSelect(category.id);
    setSizeBlocked(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const handleSizeChange = (size: SubkitSize) => {
    if (!onSizeChange) return;
    const success = onSizeChange(category.id, size);
    if (!success) {
      setSizeBlocked(true);
      announceAssertive('Not enough slots for Large size. Remove or resize another subkit.');
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setSizeBlocked(false), 3000);
    } else {
      setSizeBlocked(false);
    }
  };

  const showElevation = elevated && !selected;

  const selectedBorderStyle: React.CSSProperties = selected
    ? { borderColor: category.colorBase, borderWidth: '2px', backgroundColor: category.colorTint }
    : showElevation
      ? { borderLeftColor: '#22C55E', borderLeftWidth: '3px' }
      : {};

  const disabledStyle: React.CSSProperties = disabled && !selected
    ? { opacity: 0.45, cursor: 'not-allowed', transition: 'opacity 200ms var(--ease-standard)' }
    : { transition: 'opacity 200ms var(--ease-standard)' };

  const customBorderClass = isCustom && !selected
    ? 'border-dashed'
    : '';

  const containerClasses = `subkit-card relative flex flex-col rounded-[var(--radius-md)] border p-4 ${customBorderClass}`;

  const containerStyles: React.CSSProperties = {
    ...selectedBorderStyle,
    ...disabledStyle,
  };

  const iconColor = selected ? category.colorBase : 'var(--color-neutral-500)';

  const iconContent: ReactNode = IconComponent
    ? <IconComponent size={24} style={{ color: iconColor }} aria-hidden="true" />
    : null;

  const checkContent: ReactNode = selected
    ? (
      <div
        className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full"
        style={{ backgroundColor: category.colorBase }}
      >
        <Check size={12} className="text-white" aria-hidden="true" />
      </div>
    )
    : null;

  const badgeContent: ReactNode = isCustom
    ? <span className="text-xs font-medium" style={{ color: category.colorBase }}>Mix & Match</span>
    : null;

  const showSizeToggle = selected && category.sizeOptions.includes('large');

  const sizeBlockedContent: ReactNode = sizeBlocked
    ? (
      <p className="mt-1 text-xs font-medium" style={{ color: 'var(--color-status-warning)' }} role="alert">
        Not enough slots for Large size. Remove or resize another subkit.
      </p>
    )
    : null;

  const ariaLabel = selected
    ? `${category.name}, selected`
    : showElevation
      ? `${category.name} — Suggested for your situation`
      : `${category.name} subkit`;

  return (
    <div className={containerClasses} style={containerStyles} data-testid={`subkit-card-${category.id}`}>
      {checkContent}
      <div
        role="button"
        tabIndex={0}
        aria-pressed={selected}
        aria-disabled={disabled && !selected}
        aria-label={ariaLabel}
        className="flex flex-col gap-2"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center gap-3">
          {iconContent}
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-[var(--color-neutral-900)]">{category.name}</span>
            {badgeContent}
          </div>
        </div>
        <ElevationBadge visible={!!showElevation} />
        <p className="text-xs text-[var(--color-neutral-500)]">{category.description}</p>
      </div>
      {showSizeToggle && (
        <SizeToggle currentSize={currentSize} colorBase={category.colorBase} onSizeChange={handleSizeChange} />
      )}
      {sizeBlockedContent}
    </div>
  );
};
