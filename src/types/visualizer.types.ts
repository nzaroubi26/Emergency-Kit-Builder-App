import type { SubkitSize } from './kit.types';

export interface SlotState {
  status: 'empty' | 'filled';
  subkitId?: string;
  subkitName?: string;
  subkitColor?: string;
  size: SubkitSize;
  isLargeStart?: boolean;
  isLargeEnd?: boolean;
}

export interface HousingUnitVisualizerProps {
  slots: SlotState[];
  readOnly?: boolean;
  onSlotClick?: (slotIndex: number) => void;
}
