import type { HouseholdOption } from '../store/mcqStore';

export interface AmazonProduct {
  id: string;
  categoryId: string;
  kitItemId: string;
  name: string;
  asin: string;
  price: number;
  brand: string;
  imageSrc: string;
  mcqCondition?: {
    field: 'householdComposition';
    includes: HouseholdOption;
  };
}

export const AMAZON_PRODUCTS: AmazonProduct[] = [
  // Power (5)
  { id: 'power-station',   categoryId: 'power', kitItemId: 'power-station',   name: 'Portable Power Station', asin: 'B082TMBYR6', price: 199.00, brand: 'Jackery Explorer',              imageSrc: '/products/B082TMBYR6.jpg' },
  { id: 'power-solar',     categoryId: 'power', kitItemId: 'power-solar',     name: 'Solar Panel',            asin: 'B0B9SP6BNH', price: 149.99, brand: 'GRECELL Portable Foldable',     imageSrc: '/products/B0B9SP6BNH.jpg' },
  { id: 'power-cables',    categoryId: 'power', kitItemId: 'power-cables',    name: 'Charging Cables',        asin: 'B0DYZJFSH9', price: 13.48,  brand: 'Multi-charging',                imageSrc: '/products/B0DYZJFSH9.jpg' },
  { id: 'power-banks',     categoryId: 'power', kitItemId: 'power-banks',     name: 'Power Bank',             asin: 'B0D5CLSMFB', price: 19.98,  brand: 'Anker Travel-Ready',            imageSrc: '/products/B0D5CLSMFB.jpg' },
  { id: 'power-batteries', categoryId: 'power', kitItemId: 'power-batteries', name: 'Batteries AA/AAA',       asin: 'B094D3JGLT', price: 16.70,  brand: 'Amazon Basics',                 imageSrc: '/products/B094D3JGLT.jpg' },

  // Lighting (7)
  { id: 'light-matches',    categoryId: 'lighting', kitItemId: 'light-matches',    name: 'Matches',         asin: 'B004U4JCDS', price: 8.99,  brand: 'Diamond Strike Anywhere',    imageSrc: '/products/B004U4JCDS.jpg' },
  { id: 'light-flashlight', categoryId: 'lighting', kitItemId: 'light-flashlight', name: 'Flashlight',      asin: 'B079PDYNCQ', price: 15.99, brand: 'Coleman Battery Guard',      imageSrc: '/products/B079PDYNCQ.jpg' },
  { id: 'light-lantern',    categoryId: 'lighting', kitItemId: 'light-lantern',    name: 'Electric Lantern', asin: 'B07HF226B4', price: 53.49, brand: 'Coleman Water-Resistant',    imageSrc: '/products/B07HF226B4.jpg' },
  { id: 'light-headlamp',   categoryId: 'lighting', kitItemId: 'light-headlamp',   name: 'Headlamp',        asin: 'B014JUMTXM', price: 9.97,  brand: 'Foxelli Waterproof',         imageSrc: '/products/B014JUMTXM.jpg' },
  { id: 'light-candles',    categoryId: 'lighting', kitItemId: 'light-candles',    name: 'Candles',          asin: 'B07ZYB6RN9', price: 14.99, brand: 'Hyoola Emergency',           imageSrc: '/products/B07ZYB6RN9.jpg' },
  { id: 'light-lighter',    categoryId: 'lighting', kitItemId: 'light-lighter',    name: 'Lighter',          asin: 'B00GUQWAS8', price: 14.99, brand: 'BIC Multi-purpose',          imageSrc: '/products/B00GUQWAS8.jpg' },
  { id: 'light-string',     categoryId: 'lighting', kitItemId: 'light-string',     name: 'String Lights',    asin: 'B0B4NT4J28', price: 30.59, brand: 'Brightever Shatterproof',    imageSrc: '/products/B0B4NT4J28.jpg' },

  // Communications (2)
  { id: 'comms-radio',  categoryId: 'communications', kitItemId: 'comms-radio',  name: 'Hand Crank Radio', asin: 'B0BMKN9JQX', price: 22.99, brand: 'Esky Portable Rechargeable', imageSrc: '/products/B0BMKN9JQX.jpg' },
  { id: 'comms-walkie', categoryId: 'communications', kitItemId: 'comms-walkie', name: 'Walkie Talkies',   asin: 'B08MKT9B7X', price: 54.99, brand: 'Pxton Rechargeable',         imageSrc: '/products/B08MKT9B7X.jpg' },

  // Hygiene (5)
  { id: 'hygiene-dental',   categoryId: 'hygiene', kitItemId: 'hygiene-dental',   name: 'Dental Kit',               asin: 'B0DFGWVSWV', price: 9.99,  brand: 'Lilingsty Travel Toothbrush Set',  imageSrc: '/products/B0DFGWVSWV.jpg' },
  { id: 'hygiene-cups',     categoryId: 'hygiene', kitItemId: 'hygiene-cups',     name: 'Paper Plates & Utensils',  asin: 'B0B3QFXLH5', price: 28.99, brand: 'Compostable Sugarcane Dinnerware', imageSrc: '/products/B0B3QFXLH5.jpg' },
  { id: 'hygiene-tp',       categoryId: 'hygiene', kitItemId: 'hygiene-tp',       name: 'Toilet Paper',             asin: 'B07BGLT25K', price: 6.49,  brand: 'Scott ComfortPlus',                imageSrc: '/products/B07BGLT25K.jpg' },
  { id: 'hygiene-wipes',    categoryId: 'hygiene', kitItemId: 'hygiene-wipes',    name: 'Baby Wipes',               asin: 'B08QRT84WJ', price: 13.35, brand: 'Huggies Sensitive Unscented',      imageSrc: '/products/B08QRT84WJ.jpg' },
  { id: 'hygiene-feminine', categoryId: 'hygiene', kitItemId: 'hygiene-feminine', name: 'Feminine Hygiene Kit',     asin: 'B093TSF8HY', price: 39.99, brand: 'Menstrual Convenience Kit',        imageSrc: '/products/B093TSF8HY.jpg' },

  // Cooking (3)
  { id: 'cook-stove',     categoryId: 'cooking', kitItemId: 'cook-stove',     name: 'Camping Stove', asin: 'B0009PUR5E', price: 49.64, brand: 'Coleman',                  imageSrc: '/products/B0009PUR5E.jpg' },
  { id: 'cook-propane',   categoryId: 'cooking', kitItemId: 'cook-propane',   name: 'Propane Tank',  asin: 'B003VCPGHG', price: 25.75, brand: 'Coleman Propane',           imageSrc: '/products/B003VCPGHG.jpg' },
  { id: 'cook-lifestraw', categoryId: 'cooking', kitItemId: 'cook-lifestraw', name: 'LifeStraw',     asin: 'B0DTRLCKH2', price: 59.95, brand: 'LifeStraw Personal',        imageSrc: '/products/B0DTRLCKH2.jpg' },

  // Medical (2)
  { id: 'med-first-aid', categoryId: 'medical', kitItemId: 'med-first-aid', name: 'First Aid Kit',  asin: 'B09NWH8553', price: 24.47, brand: 'Johnson & Johnson All-Purpose', imageSrc: '/products/B09NWH8553.jpg' },
  { id: 'med-ice-packs', categoryId: 'medical', kitItemId: 'med-ice-packs', name: 'Hot/Cold Pack',  asin: 'B0BCDWGDMZ', price: 14.97, brand: 'Flexible Ice Pack',             imageSrc: '/products/B0BCDWGDMZ.jpg' },

  // Comfort (2)
  { id: 'comfort-fan',      categoryId: 'comfort', kitItemId: 'comfort-fan',      name: 'Portable Fan', asin: 'B0DP4F63BV', price: 39.99, brand: 'Warmco 10000mAh Ultra-thin', imageSrc: '/products/B0DP4F63BV.jpg' },
  { id: 'comfort-earplugs', categoryId: 'comfort', kitItemId: 'comfort-earplugs', name: 'Ear Plugs',    asin: 'B0BFRTLW7L', price: 8.90,  brand: 'Amazon Basic Care',          imageSrc: '/products/B0BFRTLW7L.jpg' },

  // Clothing (3)
  { id: 'cloth-ponchos',      categoryId: 'clothing', kitItemId: 'cloth-ponchos',      name: 'Rain Poncho (Adult)', asin: 'B076ZHMR3S', price: 14.99, brand: 'Hagon PRO Premium',       imageSrc: '/products/B076ZHMR3S.jpg' },
  { id: 'cloth-ponchos-kids', categoryId: 'clothing', kitItemId: 'cloth-ponchos-kids', name: 'Rain Poncho (Kids)',  asin: 'B07QCVMCF8', price: 12.99, brand: 'SINGON Disposable',       imageSrc: '/products/B07QCVMCF8.jpg', mcqCondition: { field: 'householdComposition', includes: 'kids' } },
  { id: 'cloth-shoe-covers',  categoryId: 'clothing', kitItemId: 'cloth-shoe-covers',  name: 'Shoe Covers',         asin: 'B0G3ZRY3X8', price: 5.99,  brand: 'Waterproof Disposable',   imageSrc: '/products/B0G3ZRY3X8.jpg' },

  // Pets (2) — conditional on household including pets
  { id: 'pets-first-aid', categoryId: 'pets', kitItemId: 'pets-first-aid', name: 'Pet First Aid Kit', asin: 'B07WRPCLYR', price: 35.90, brand: 'ARCA PET Travel Emergency', imageSrc: '/products/B07WRPCLYR.jpg', mcqCondition: { field: 'householdComposition', includes: 'pets' } },
  { id: 'pets-water',     categoryId: 'pets', kitItemId: 'pets-water',     name: 'Collapsible Bowl',  asin: 'B07VT1468W', price: 4.97,  brand: 'Collapsible Portable',      imageSrc: '/products/B07VT1468W.jpg', mcqCondition: { field: 'householdComposition', includes: 'pets' } },
];

export const PRODUCTS_BY_CATEGORY: Record<string, AmazonProduct[]> = AMAZON_PRODUCTS.reduce(
  (acc, product) => ({ ...acc, [product.categoryId]: [...(acc[product.categoryId] ?? []), product] }),
  {} as Record<string, AmazonProduct[]>,
);
