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

/**
 * Props for the HousingUnitVisualizer component.
 *
 * Phase 2 Extension Points:
 * - `onSlotClick`: Currently dormant in MVP. In Phase 2, pass a handler to enable
 *   click-to-assign functionality. Clicking an empty slot will open a subkit assignment
 *   picker; clicking a filled slot will open edit/remove options. When provided, slots
 *   render with `role="button"` and `cursor-pointer` styling.
 * - The component is fully store-agnostic — all state derivation happens in the parent.
 *   This allows reuse in any context (selection screen, summary, print view).
 */
export interface HousingUnitVisualizerProps {
  /** Always length 6; index 0 = top slot. Derived via useSlotState() in parent. */
  slots: SlotState[];
  /** When true, hides plus icons and uses compact 44px height. Used on Summary Page. */
  readOnly?: boolean;
  /** Phase 2: Called with slot index (0-5) when a slot is clicked. Dormant in MVP. */
  onSlotClick?: (slotIndex: number) => void;
}
