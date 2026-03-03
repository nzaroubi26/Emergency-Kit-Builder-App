import { type FC, useEffect, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';
import { announcePolite } from '../../utils/announce';

interface SlotFullIndicatorProps {
  isAtCapacity: boolean;
}

export const SlotFullIndicator: FC<SlotFullIndicatorProps> = ({
  isAtCapacity,
}) => {
  const prevCapacityRef = useRef(false);

  useEffect(() => {
    if (isAtCapacity && !prevCapacityRef.current) {
      announcePolite('Your housing unit is full. Remove or resize a subkit to make room.');
    }
    prevCapacityRef.current = isAtCapacity;
  }, [isAtCapacity]);

  const containerStyles: React.CSSProperties = {
    opacity: isAtCapacity ? 1 : 0,
    transition: 'opacity var(--duration-default) var(--ease-standard)',
  };

  const content = isAtCapacity
    ? (
      <div
        className="mt-3 flex items-center justify-center gap-2 rounded-[var(--radius-sm)] px-4 py-2 text-sm font-medium"
        style={{ backgroundColor: 'var(--color-status-warning)', color: 'white', ...containerStyles }}
        role="status"
      >
        <AlertTriangle size={16} aria-hidden="true" />
        <span>Your housing unit is full! Remove or resize a subkit to make room.</span>
      </div>
    )
    : null;

  return content;
};
