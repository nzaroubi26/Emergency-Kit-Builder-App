import { CATEGORIES } from '../data';
import type { KitCategory } from '../types';

export function getCategoryById(categoryId: string): KitCategory | undefined {
  return CATEGORIES[categoryId];
}

export function getCategoryColor(categoryId: string): { base: string; tint: string } | undefined {
  const category = CATEGORIES[categoryId];
  if (!category) return undefined;
  return { base: category.colorBase, tint: category.colorTint };
}

export function getCategoryIcon(categoryId: string): string | undefined {
  const category = CATEGORIES[categoryId];
  return category?.icon;
}
