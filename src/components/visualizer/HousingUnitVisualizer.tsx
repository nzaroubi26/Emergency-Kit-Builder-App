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
      className="w-full max-w-sm mx-auto flex flex-col items-center"
      role="region"
      aria-label="Housing unit visualizer showing 6 storage slots"
    >
      <div
        data-testid="handle-tab"
        className="h-6 w-20 rounded-t-md border-t-[6px] border-x-[6px] border-neutral-400 bg-transparent mb-[-2px] z-10"
      />

      <div
        data-testid="outer-frame"
        className="relative w-full bg-neutral-400 rounded-xl p-3 pb-2 z-20"
      >
        <div className="bg-neutral-50 rounded-lg w-full overflow-hidden flex flex-col">
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

        <div
          data-testid="wheel-guard-left"
          className="absolute -bottom-3 -left-6 h-12 w-6 bg-neutral-600 rounded-sm"
        />
        <div
          data-testid="wheel-guard-right"
          className="absolute -bottom-3 -right-6 h-12 w-6 bg-neutral-600 rounded-sm"
        />
      </div>
    </div>
  );
};
