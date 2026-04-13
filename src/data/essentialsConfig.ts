import type { SubkitSize } from '../types';

export interface EssentialsBundleItem {
  subkit: string;
  size: SubkitSize;
}

export const ESSENTIALS_BUNDLE: EssentialsBundleItem[] = [
  { subkit: 'power', size: 'large' },
  { subkit: 'cooking', size: 'regular' },
  { subkit: 'medical', size: 'regular' },
  { subkit: 'communications', size: 'regular' },
];
