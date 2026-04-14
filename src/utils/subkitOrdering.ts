import type { EmergencyType, HouseholdOption } from '../store/mcqStore';

const PRIORITY_MAP: Record<EmergencyType, [string, string, string]> = {
  hurricane:        ['power', 'medical', 'communications'],
  flood:            ['power', 'clothing', 'medical'],
  tornado:          ['power', 'cooking', 'medical'],
  'tropical-storm': ['power', 'medical', 'communications'],
};

const DEFAULT_ORDER: string[] = [
  'power', 'medical', 'communications', 'lighting',
  'cooking', 'hygiene', 'comfort', 'clothing',
];

export function getOrderedCategories(
  emergencyType: EmergencyType | undefined,
  householdComposition: HouseholdOption[],
): string[] {
  const top3: string[] = emergencyType ? [...PRIORITY_MAP[emergencyType]] : [];
  const rest = DEFAULT_ORDER.filter((id) => !top3.includes(id));
  const ordered = [...top3, ...rest];

  if (householdComposition.includes('pets')) {
    ordered.push('pets');
  }

  return ordered;
}
