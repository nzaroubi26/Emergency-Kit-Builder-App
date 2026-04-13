import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type EmergencyType = 'flood' | 'tornado' | 'hurricane' | 'tropical-storm';
export type HouseholdOption = 'kids' | 'older-adults' | 'disability' | 'pets' | 'none';
export type KitPath = 'essentials' | 'custom' | null;

export interface MCQState {
  emergencyTypes: EmergencyType[];
  householdComposition: HouseholdOption[];
  kitPath: KitPath;
}

export interface MCQActions {
  setEmergencyTypes: (types: EmergencyType[]) => void;
  setHouseholdComposition: (options: HouseholdOption[]) => void;
  setKitPath: (path: KitPath) => void;
  resetMCQ: () => void;
}

type MCQStore = MCQState & MCQActions;

const initial: MCQState = {
  emergencyTypes: [],
  householdComposition: [],
  kitPath: null,
};

export const useMCQStore = create<MCQStore>()(persist((set) => ({
  ...initial,
  setEmergencyTypes: (types) => set({ emergencyTypes: types }),
  setHouseholdComposition: (options) => set({ householdComposition: options }),
  setKitPath: (path) => set({ kitPath: path }),
  resetMCQ: () => set({ ...initial }),
}), {
  name: 'emergency-mcq-v1',
  storage: {
    getItem: (name) => {
      const val = sessionStorage.getItem(name);
      return val ? JSON.parse(val) : null;
    },
    setItem: (name, value) => {
      sessionStorage.setItem(name, JSON.stringify(value));
    },
    removeItem: (name) => {
      sessionStorage.removeItem(name);
    },
  },
  partialize: (state) => ({
    emergencyTypes: state.emergencyTypes,
    householdComposition: state.householdComposition,
  }) as unknown as MCQStore,
}));
