import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { SlotFullIndicator } from '../../src/components/visualizer/SlotFullIndicator';
import { useKitStore } from '../../src/store/kitStore';

expect.extend(matchers);

describe('SlotFullIndicator', () => {
  it('renders nothing when not at capacity', () => {
    const { container } = render(<SlotFullIndicator isAtCapacity={false} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders warning message when at capacity', () => {
    render(<SlotFullIndicator isAtCapacity={true} />);
    expect(screen.getByText(/housing unit is full/i)).toBeInTheDocument();
  });

  it('has role="status" for screen reader announcement', () => {
    render(<SlotFullIndicator isAtCapacity={true} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<SlotFullIndicator isAtCapacity={true} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('Store constraint enforcement', () => {
  beforeEach(() => {
    useKitStore.getState().resetKit();
  });

  it('blocks selection when at 6-slot capacity', () => {
    const store = useKitStore.getState();
    store.selectSubkit('power');
    store.selectSubkit('lighting');
    store.selectSubkit('communications');
    store.selectSubkit('hygiene');
    store.selectSubkit('cooking');
    store.selectSubkit('medical');
    expect(useKitStore.getState().selectedSubkits).toHaveLength(6);
    store.selectSubkit('comfort');
    expect(useKitStore.getState().selectedSubkits).toHaveLength(6);
  });

  it('blocks duplicate category selection', () => {
    const store = useKitStore.getState();
    store.selectSubkit('power');
    store.selectSubkit('power');
    expect(useKitStore.getState().selectedSubkits).toHaveLength(1);
  });

  it('blocks size change to large when insufficient slots', () => {
    const store = useKitStore.getState();
    store.selectSubkit('power');
    store.selectSubkit('lighting');
    store.selectSubkit('communications');
    store.selectSubkit('hygiene');
    store.selectSubkit('cooking');
    store.selectSubkit('medical');
    const result = store.setSubkitSize('medical', 'large');
    expect(result).toBe(false);
    const medical = useKitStore.getState().selectedSubkits.find((s) => s.subkitId === 'medical');
    expect(medical?.size).toBe('regular');
  });

  it('allows size change to large when slots available', () => {
    const store = useKitStore.getState();
    store.selectSubkit('power');
    store.selectSubkit('lighting');
    const result = store.setSubkitSize('power', 'large');
    expect(result).toBe(true);
    const power = useKitStore.getState().selectedSubkits.find((s) => s.subkitId === 'power');
    expect(power?.size).toBe('large');
  });

  it('frees slot when switching from large to regular', () => {
    const store = useKitStore.getState();
    store.selectSubkit('power');
    store.setSubkitSize('power', 'large');
    store.selectSubkit('lighting');
    store.selectSubkit('communications');
    store.selectSubkit('hygiene');
    store.selectSubkit('cooking');
    expect(useKitStore.getState().selectedSubkits).toHaveLength(5);
    store.setSubkitSize('power', 'regular');
    store.selectSubkit('medical');
    expect(useKitStore.getState().selectedSubkits).toHaveLength(6);
  });

  it('re-indexes selection order after deselect', () => {
    const store = useKitStore.getState();
    store.selectSubkit('power');
    store.selectSubkit('lighting');
    store.selectSubkit('communications');
    store.deselectSubkit('lighting');
    const orders = useKitStore.getState().selectedSubkits.map((s) => s.selectionOrder);
    expect(orders).toEqual([1, 2]);
  });

  it('cleans up item selections on deselect', () => {
    const store = useKitStore.getState();
    store.selectSubkit('power');
    store.toggleItem('power', 'power-station');
    expect(useKitStore.getState().itemSelections['power::power-station']).toBeTruthy();
    store.deselectSubkit('power');
    expect(useKitStore.getState().itemSelections['power::power-station']).toBeUndefined();
  });

  it('requires at least 3 subkits to proceed', () => {
    const store = useKitStore.getState();
    store.selectSubkit('power');
    store.selectSubkit('lighting');
    expect(useKitStore.getState().selectedSubkits.length >= 3).toBe(false);
    store.selectSubkit('communications');
    expect(useKitStore.getState().selectedSubkits.length >= 3).toBe(true);
  });
});
