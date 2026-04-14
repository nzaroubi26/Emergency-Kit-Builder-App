import { type FC } from 'react';
import { Sparkles } from 'lucide-react';

interface ElevationBadgeProps {
  visible: boolean;
}

export const ElevationBadge: FC<ElevationBadgeProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5"
      style={{
        backgroundColor: '#E8F5EE',
        color: '#1F4D35',
        transition: 'opacity 150ms var(--ease-standard, ease)',
      }}
    >
      <Sparkles size={10} aria-hidden="true" />
      <span className="text-xs font-medium">Suggested for you</span>
    </span>
  );
};
