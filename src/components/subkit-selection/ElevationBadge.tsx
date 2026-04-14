import { type FC } from 'react';
import { Sparkles } from 'lucide-react';

interface ElevationBadgeProps {
  visible: boolean;
}

export const ElevationBadge: FC<ElevationBadgeProps> = ({ visible }) => {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5"
      aria-hidden={!visible}
      style={{
        backgroundColor: '#E8F5EE',
        color: '#1F4D35',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: visible
          ? 'opacity 150ms var(--ease-standard, ease)'
          : 'opacity 130ms var(--ease-standard, ease)',
      }}
    >
      <Sparkles size={10} aria-hidden="true" />
      <span className="text-xs font-medium">Suggested for you</span>
    </span>
  );
};
