import { type FC } from 'react';
import { Check } from 'lucide-react';

interface MCQNotaTileProps {
  selected: boolean;
  onClick: () => void;
}

export const MCQNotaTile: FC<MCQNotaTileProps> = ({ selected, onClick }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onClick();
    }
  };

  const bgColor = selected ? '#F3F4F6' : '#FFFFFF';
  const borderColor = selected ? '#374151' : '#E5E7EB';
  const textColor = selected ? '#374151' : '#6B7280';

  return (
    <>
      <hr className="my-4" style={{ borderColor: '#E5E7EB' }} />
      <div
        role="checkbox"
        aria-checked={selected}
        aria-label="None of the Above"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        className="relative flex min-h-[56px] w-full items-center justify-center rounded-[var(--radius-md)] transition-shadow duration-150 hover:shadow-md"
        style={{
          backgroundColor: bgColor,
          border: `2px solid ${borderColor}`,
          cursor: 'pointer',
          padding: '12px 16px',
        }}
      >
        <span className="text-sm font-medium" style={{ color: textColor }}>
          None of the Above
        </span>

        {selected && (
          <span
            className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full"
            style={{ backgroundColor: '#22C55E' }}
          >
            <Check size={12} color="#FFFFFF" strokeWidth={3} />
          </span>
        )}
      </div>
    </>
  );
};
