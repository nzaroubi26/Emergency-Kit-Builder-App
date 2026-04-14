import type { EmergencyType, HouseholdOption } from '../store/mcqStore';

export interface ElevationResult {
  elevated: Set<string>;
  q2Elevated: Set<string>;
}

const Q2_RULES: Record<string, string[]> = {
  kids: ['hygiene', 'medical', 'comfort'],
  'older-adults': ['medical', 'comfort'],
  disability: ['medical', 'comfort'],
  pets: ['pets'],
  none: [],
};

const Q1_RULES: Record<string, string[]> = {
  flood: ['power', 'communications', 'cooking'],
  hurricane: ['power', 'communications', 'cooking'],
  'tropical-storm': ['power', 'communications'],
  tornado: ['medical', 'lighting', 'clothing'],
};

export function computeElevatedSubkits(
  emergencyTypes: EmergencyType[],
  householdComposition: HouseholdOption[]
): ElevationResult {
  const elevated = new Set<string>();
  const q2Elevated = new Set<string>();

  for (const option of householdComposition) {
    const categories = Q2_RULES[option];
    if (categories) {
      for (const id of categories) {
        elevated.add(id);
        q2Elevated.add(id);
      }
    }
  }

  for (const type of emergencyTypes) {
    const categories = Q1_RULES[type];
    if (categories) {
      for (const id of categories) {
        elevated.add(id);
      }
    }
  }

  return { elevated, q2Elevated };
}
