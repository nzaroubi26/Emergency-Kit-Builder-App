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
      className="relative mx-auto inline-flex max-w-sm flex-col items-center"
      role="region"
      aria-label="Housing unit visualizer showing 6 storage slots"
    >
      <div
        data-testid="handle-tab"
        className="z-10 h-5 w-14 rounded-md border-2 border-neutral-400 bg-neutral-500 mb-[-2px]"
      />

      <div
        data-testid="outer-frame"
        className="z-20 rounded-xl bg-neutral-500 p-3 pb-2"
      >
        <div className="rounded-lg bg-neutral-50">
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
      </div>

      <div
        data-testid="wheel-guard-left"
        className="absolute bottom-0 -left-4 z-0 h-6 w-4 rounded-sm bg-neutral-500"
      />
      <div
        data-testid="wheel-guard-right"
        className="absolute bottom-0 -right-4 z-0 h-6 w-4 rounded-sm bg-neutral-500"
      />
    </div>
  );
};
