import { type FC, type ElementType } from 'react';
import { Check } from 'lucide-react';

interface MCQTileProps {
  label: string;
  icon: ElementType;
  selected: boolean;
  disabled?: boolean;
  disabledLabel?: string;
  onClick: () => void;
}

export const MCQTile: FC<MCQTileProps> = ({
  label,
  icon: Icon,
  selected,
  disabled = false,
  disabledLabel,
  onClick,
}) => {
  const handleClick = () => {
    if (disabled) return;
    onClick();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onClick();
    }
  };

  const bgColor = disabled ? '#F3F4F6' : selected ? '#E8F5EE' : '#FFFFFF';
  const borderColor = disabled ? '#E5E7EB' : selected ? '#1F4D35' : '#E5E7EB';
  const textColor = disabled ? '#9CA3AF' : selected ? '#1F4D35' : '#374151';
  const iconColor = disabled ? '#9CA3AF' : selected ? '#1F4D35' : '#6B7280';
  const cursor = disabled ? 'not-allowed' : 'pointer';

  return (
    <div
      role="checkbox"
      aria-checked={selected}
      aria-disabled={disabled}
      aria-label={label}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="relative flex min-h-[72px] items-center rounded-[var(--radius-md)] transition-shadow duration-150 hover:shadow-md"
      style={{
        backgroundColor: bgColor,
        border: `2px solid ${borderColor}`,
        cursor,
        padding: '12px 16px',
      }}
    >
      <Icon size={24} style={{ color: iconColor, flexShrink: 0 }} />
      <span
        className="ml-3 text-sm font-medium"
        style={{ color: textColor }}
      >
        {label}
      </span>

      {selected && (
        <span
          className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full"
          style={{ backgroundColor: '#22C55E' }}
        >
          <Check size={12} color="#FFFFFF" strokeWidth={3} />
        </span>
      )}

      {disabled && disabledLabel && (
        <span
          className="ml-auto rounded-full px-2 py-0.5 text-xs"
          style={{ backgroundColor: '#E5E7EB', color: '#9CA3AF' }}
        >
          {disabledLabel}
        </span>
      )}
    </div>
  );
};
