import { describe, it, expect } from 'vitest';
import { AMAZON_PRODUCTS, PRODUCTS_BY_CATEGORY } from '../../src/data/amazonProducts';
import { CATEGORIES } from '../../src/data/kitItems';

describe('AMAZON_PRODUCTS data validation', () => {
  it('contains exactly 31 products', () => {
    expect(AMAZON_PRODUCTS).toHaveLength(31);
  });

  it('every product has a valid ASIN (non-empty, 10 characters)', () => {
    for (const product of AMAZON_PRODUCTS) {
      expect(product.asin, `${product.id} ASIN`).toHaveLength(10);
      expect(product.asin, `${product.id} ASIN`).toBeTruthy();
    }
  });

  it('every product has price > 0', () => {
    for (const product of AMAZON_PRODUCTS) {
      expect(product.price, `${product.id} price`).toBeGreaterThan(0);
    }
  });

  it('every product references a valid categoryId from CATEGORIES', () => {
    const validCategoryIds = Object.keys(CATEGORIES);
    for (const product of AMAZON_PRODUCTS) {
      expect(validCategoryIds, `${product.id} categoryId`).toContain(product.categoryId);
    }
  });

  it('every product has id === kitItemId (1:1 mapping)', () => {
    for (const product of AMAZON_PRODUCTS) {
      expect(product.kitItemId, `${product.id} kitItemId`).toBe(product.id);
    }
  });

  it('every product has a non-empty name and brand', () => {
    for (const product of AMAZON_PRODUCTS) {
      expect(product.name, `${product.id} name`).toBeTruthy();
      expect(product.brand, `${product.id} brand`).toBeTruthy();
    }
  });

  it('every product has an imageSrc matching /products/{ASIN}.jpg', () => {
    for (const product of AMAZON_PRODUCTS) {
      expect(product.imageSrc, `${product.id} imageSrc`).toBe(`/products/${product.asin}.jpg`);
    }
  });

  it('no duplicate ASINs', () => {
    const asins = AMAZON_PRODUCTS.map((p) => p.asin);
    expect(new Set(asins).size).toBe(asins.length);
  });
});

describe('mcqCondition gates', () => {
  it('Kids Rain Poncho has kids mcqCondition', () => {
    const kidsPoncho = AMAZON_PRODUCTS.find((p) => p.id === 'cloth-ponchos-kids');
    expect(kidsPoncho?.mcqCondition).toEqual({ field: 'householdComposition', includes: 'kids' });
  });

  it('all Pets products have pets mcqCondition', () => {
    const petsProducts = AMAZON_PRODUCTS.filter((p) => p.categoryId === 'pets');
    expect(petsProducts.length).toBeGreaterThan(0);
    for (const product of petsProducts) {
      expect(product.mcqCondition, `${product.id} mcqCondition`).toEqual({ field: 'householdComposition', includes: 'pets' });
    }
  });

  it('non-conditional products have no mcqCondition', () => {
    const unconditional = AMAZON_PRODUCTS.filter(
      (p) => p.categoryId !== 'pets' && p.id !== 'cloth-ponchos-kids',
    );
    for (const product of unconditional) {
      expect(product.mcqCondition, `${product.id} should have no mcqCondition`).toBeUndefined();
    }
  });
});

describe('PRODUCTS_BY_CATEGORY', () => {
  it('has entries for all categories with products', () => {
    const categoriesWithProducts = [...new Set(AMAZON_PRODUCTS.map((p) => p.categoryId))];
    for (const catId of categoriesWithProducts) {
      expect(PRODUCTS_BY_CATEGORY[catId], `${catId}`).toBeDefined();
      expect(PRODUCTS_BY_CATEGORY[catId].length).toBeGreaterThan(0);
    }
  });

  it('Power has 5 products', () => {
    expect(PRODUCTS_BY_CATEGORY['power']).toHaveLength(5);
  });

  it('Lighting has 7 products', () => {
    expect(PRODUCTS_BY_CATEGORY['lighting']).toHaveLength(7);
  });

  it('Pets has 2 products', () => {
    expect(PRODUCTS_BY_CATEGORY['pets']).toHaveLength(2);
  });
});
