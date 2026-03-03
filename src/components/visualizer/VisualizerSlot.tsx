import { type FC, type ReactNode } from 'react';
import { Plus } from 'lucide-react';
import type { SlotState } from '../../types';

interface VisualizerSlotProps {
  slot: SlotState;
  slotIndex: number;
  readOnly?: boolean;
  onSlotClick?: (slotIndex: number) => void;
}

export const VisualizerSlot: FC<VisualizerSlotProps> = ({
  slot,
  slotIndex,
  readOnly = false,
  onSlotClick,
}) => {
  const isFilled = slot.status === 'filled';
  const showPlusIcon = !isFilled && !readOnly;
  const slotHeight = readOnly ? '44px' : '64px';

  const borderClasses = slot.isLargeEnd
    ? 'border-b border-l border-r border-[var(--color-neutral-200)]'
    : slot.isLargeStart
      ? 'border-t border-l border-r border-[var(--color-neutral-200)]'
      : 'border border-[var(--color-neutral-200)]';

  const fillClasses = isFilled
    ? 'text-white font-medium text-sm'
    : 'bg-[var(--color-neutral-white)]';

  const containerClasses = `flex items-center justify-center ${borderClasses} ${fillClasses}`;

  const bgColor = isFilled && slot.subkitColor ? slot.subkitColor : undefined;

  const isInteractive = !readOnly && !!onSlotClick;

  const cursorStyle = isInteractive ? 'pointer' : undefined;

  const containerStyles: React.CSSProperties = {
    height: slotHeight,
    backgroundColor: bgColor,
    cursor: cursorStyle,
    transition: 'background-color var(--duration-standard) var(--ease-standard)',
  };

  const nameOpacity = isFilled ? 1 : 0;

  const nameStyles: React.CSSProperties = {
    opacity: nameOpacity,
    transition: 'opacity var(--duration-standard) var(--ease-standard) 80ms',
  };

  const slotLabel = isFilled
    ? `Slot ${slotIndex + 1}: ${slot.subkitName}`
    : `Slot ${slotIndex + 1}: empty`;

  const role = isInteractive ? 'button' : 'group';

  const handleClick = isInteractive
    ? () => onSlotClick!(slotIndex)
    : undefined;

  const showName = isFilled && slot.subkitName && !slot.isLargeEnd;

  const nameContent: ReactNode = showName
    ? <span style={nameStyles}>{slot.subkitName}</span>
    : null;

  const plusContent: ReactNode = showPlusIcon
    ? <Plus size={20} className="text-[var(--color-neutral-400)]" aria-hidden="true" />
    : null;

  return (
    <div
      data-testid={`slot-${slotIndex}`}
      className={containerClasses}
      style={containerStyles}
      onClick={handleClick}
      role={role}
      aria-label={slotLabel}
    >
      {nameContent}
      {plusContent}
    </div>
  );
};
