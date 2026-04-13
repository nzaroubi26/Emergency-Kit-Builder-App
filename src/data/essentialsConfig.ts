import type { SubkitSize } from '../types';

export interface EssentialsBundleItem {
  categoryId: string;
  size: SubkitSize;
}

export const ESSENTIALS_BUNDLE: EssentialsBundleItem[] = [
  { categoryId: 'power', size: 'large' },
  { categoryId: 'cooking', size: 'regular' },
  { categoryId: 'medical', size: 'regular' },
  { categoryId: 'communications', size: 'regular' },
];
