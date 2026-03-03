import { type FC } from 'react';
import { VisualizerSlot } from './VisualizerSlot';
import type { HousingUnitVisualizerProps } from '../../types';

export const HousingUnitVisualizer: FC<HousingUnitVisualizerProps> = ({
  slots,
  readOnly = false,
  onSlotClick,
}) => {
  return (
    <div
      className="mx-auto max-w-sm overflow-hidden"
      style={{
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-2)',
      }}
      role="region"
      aria-label="Housing unit visualizer showing 6 storage slots"
    >
      {slots.map((slot, index) => (
        <VisualizerSlot
          key={index}
          slot={slot}
          slotIndex={index}
          readOnly={readOnly}
          onSlotClick={onSlotClick}
        />
      ))}
    </div>
  );
};
