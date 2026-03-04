export type SubkitSize = 'regular' | 'large';

export interface KitCategory {
  id: string;
  name: string;
  colorBase: string;
  colorTint: string;
  icon: string;
  description: string;
  sizeOptions: SubkitSize[];
}

export interface KitItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  rating: number | null;
  reviewCount: number | null;
  productId: string | null;
  pricePlaceholder: number | null;
  imageSrc: string | null;
}

export interface SubkitSelection {
  subkitId: string;
  categoryId: string;
  size: SubkitSize;
  selectionOrder: number;
}

export interface ItemSelection {
  itemId: string;
  subkitId: string;
  quantity: number;
}
