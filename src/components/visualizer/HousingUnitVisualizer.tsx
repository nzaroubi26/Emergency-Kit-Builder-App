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
      <div
        data-testid="handle-tab"
        className="mx-auto"
        style={{
          width: '48px',
          height: '14px',
          backgroundColor: '#6B7280',
          borderRadius: '6px 6px 0 0',
        }}
      />
      <div
        data-testid="outer-frame"
        style={{
          backgroundColor: '#6B7280',
          borderRadius: 'var(--radius-md)',
          padding: '28px 12px 20px 12px',
        }}
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
        <div className="flex justify-between" style={{ marginTop: '0px' }}>
          <div
            data-testid="wheel-guard-left"
            style={{
              width: '18px',
              height: '22px',
              backgroundColor: '#4B5563',
              borderRadius: '0 0 0 6px',
            }}
          />
          <div
            data-testid="wheel-guard-right"
            style={{
              width: '18px',
              height: '22px',
              backgroundColor: '#4B5563',
              borderRadius: '0 0 6px 0',
            }}
          />
        </div>
      </div>
    </div>
  );
};
