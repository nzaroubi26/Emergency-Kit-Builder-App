import { describe, it, expect, beforeEach } from 'vitest';
import { useMCQStore } from '../../src/store/mcqStore';

const sessionStorageMock: Record<string, string> = {};

Object.defineProperty(globalThis, 'sessionStorage', {
  value: {
    getItem: (key: string) => sessionStorageMock[key] ?? null,
    setItem: (key: string, value: string) => { sessionStorageMock[key] = value; },
    removeItem: (key: string) => { delete sessionStorageMock[key]; },
    clear: () => { Object.keys(sessionStorageMock).forEach((k) => delete sessionStorageMock[k]); },
  },
  writable: true,
});

function resetStore() {
  useMCQStore.setState({
    emergencyTypes: [],
    householdComposition: [],
    kitPath: null,
  });
}

describe('mcqStore', () => {
  beforeEach(() => {
    resetStore();
    sessionStorage.clear();
  });

  it('setEmergencyTypes sets and reads back correctly', () => {
    useMCQStore.getState().setEmergencyTypes(['flood', 'tornado']);
    expect(useMCQStore.getState().emergencyTypes).toEqual(['flood', 'tornado']);
  });

  it('setHouseholdComposition sets and reads back correctly', () => {
    useMCQStore.getState().setHouseholdComposition(['kids', 'pets']);
    expect(useMCQStore.getState().householdComposition).toEqual(['kids', 'pets']);
  });

  it('setKitPath sets and reads back correctly', () => {
    useMCQStore.getState().setKitPath('essentials');
    expect(useMCQStore.getState().kitPath).toBe('essentials');

    useMCQStore.getState().setKitPath('custom');
    expect(useMCQStore.getState().kitPath).toBe('custom');
  });

  it('resetMCQ resets all fields to initial values', () => {
    useMCQStore.getState().setEmergencyTypes(['hurricane']);
    useMCQStore.getState().setHouseholdComposition(['older-adults']);
    useMCQStore.getState().setKitPath('custom');

    useMCQStore.getState().resetMCQ();

    const state = useMCQStore.getState();
    expect(state.emergencyTypes).toEqual([]);
    expect(state.householdComposition).toEqual([]);
    expect(state.kitPath).toBeNull();
  });

  it('persists emergencyTypes and householdComposition to sessionStorage', () => {
    useMCQStore.getState().setEmergencyTypes(['flood']);
    useMCQStore.getState().setHouseholdComposition(['kids']);

    // Verify sessionStorage was written
    const stored = sessionStorage.getItem('emergency-mcq-v1');
    expect(stored).not.toBeNull();

    const parsed = JSON.parse(stored!);
    expect(parsed.state.emergencyTypes).toEqual(['flood']);
    expect(parsed.state.householdComposition).toEqual(['kids']);
  });

  it('kitPath does not survive sessionStorage round-trip', () => {
    useMCQStore.getState().setKitPath('essentials');
    useMCQStore.getState().setEmergencyTypes(['tornado']);

    // Verify kitPath is NOT in persisted state
    const stored = sessionStorage.getItem('emergency-mcq-v1');
    expect(stored).not.toBeNull();

    const parsed = JSON.parse(stored!);
    expect(parsed.state).not.toHaveProperty('kitPath');
  });
});
