import { type FC } from 'react';

interface ElevationGroupHeaderProps {
  visible: boolean;
}

export const ElevationGroupHeader: FC<ElevationGroupHeaderProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <p className="mb-3 text-xs" style={{ color: 'var(--color-neutral-500, #6B7280)' }}>
      Suggested for your situation
    </p>
  );
};
