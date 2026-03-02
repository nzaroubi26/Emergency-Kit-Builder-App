# 6. Data Layer

No API calls exist in this application. All data is static TypeScript imported at build time.

The following corrections from the UX Spec Developer Notes are applied in `kitItems.ts`:
- ✅ Add: Feminine Hygiene Products (Hygiene)
- ✅ Add: Ice Packs (Medical)
- ✅ Add: Clothing category with Ponchos + Shoe Covers
- ✅ Remove: Repairs/Tools category entirely
- ✅ Remove: Starlink from Communications

```typescript
// src/data/kitItems.ts
import type { KitCategory, KitItem } from '../types';

export const CATEGORIES: Record<string, KitCategory> = {
  power:          { id: 'power',          name: 'Power',          colorBase: '#C2410C', colorTint: '#FFF7ED', icon: 'Zap',              description: 'Charge devices and power essentials without the grid',          sizeOptions: ['regular', 'large'] },
  lighting:       { id: 'lighting',       name: 'Lighting',       colorBase: '#A16207', colorTint: '#FEFCE8', icon: 'Lightbulb',        description: 'Stay oriented and safe when the lights go out',               sizeOptions: ['regular', 'large'] },
  communications: { id: 'communications', name: 'Communications', colorBase: '#1D4ED8', colorTint: '#EFF6FF', icon: 'Radio',            description: 'Stay informed and in contact with your household',            sizeOptions: ['regular', 'large'] },
  hygiene:        { id: 'hygiene',        name: 'Hygiene',        colorBase: '#0F766E', colorTint: '#F0FDFA', icon: 'Droplets',         description: 'Maintain health and sanitation for your household',           sizeOptions: ['regular', 'large'] },
  cooking:        { id: 'cooking',        name: 'Cooking',        colorBase: '#15803D', colorTint: '#F0FDF4', icon: 'UtensilsCrossed',  description: 'Prepare food and purify water without utilities',             sizeOptions: ['regular', 'large'] },
  medical:        { id: 'medical',        name: 'Medical',        colorBase: '#991B1B', colorTint: '#FEF2F2', icon: 'HeartPulse',       description: 'Handle injuries and health needs during an emergency',        sizeOptions: ['regular', 'large'] },
  comfort:        { id: 'comfort',        name: 'Comfort',        colorBase: '#6D28D9', colorTint: '#F5F3FF', icon: 'Smile',            description: 'Reduce stress and maintain wellbeing during extended events', sizeOptions: ['regular', 'large'] },
  clothing:       { id: 'clothing',       name: 'Clothing',       colorBase: '#334155', colorTint: '#F8FAFC', icon: 'Shirt',            description: 'Protect against weather conditions and debris',              sizeOptions: ['regular', 'large'] },
  custom:         { id: 'custom',         name: 'Custom',         colorBase: '#3730A3', colorTint: '#EEF2FF', icon: 'Settings2',        description: 'Choose any items from across all categories',                sizeOptions: ['regular', 'large'] },
};

export const ITEMS: KitItem[] = [
  // Power
  { id: 'power-station',    categoryId: 'power',    name: 'Portable Power Station', description: 'Lithium battery for device charging',        productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'power-solar',      categoryId: 'power',    name: 'Solar Panel',            description: 'Foldable panel for off-grid charging',       productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'power-cables',     categoryId: 'power',    name: 'Charging Cables',        description: 'USB-C and USB-A multi-cable set',            productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'power-banks',      categoryId: 'power',    name: 'Power Banks',            description: 'Pocket-sized backup battery',                productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'power-batteries',  categoryId: 'power',    name: 'Batteries AA/AAA',       description: 'Standard alkaline multi-pack',               productId: null, pricePlaceholder: null, imageSrc: null },
  // Lighting
  { id: 'light-matches',    categoryId: 'lighting', name: 'Matches',                description: 'Waterproof strike-anywhere matches',         productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'light-flashlight', categoryId: 'lighting', name: 'Flashlights',            description: 'High-lumen LED flashlight',                  productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'light-lantern',    categoryId: 'lighting', name: 'Electric Lanterns',      description: 'Rechargeable 360 degree area lantern',       productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'light-headlamp',   categoryId: 'lighting', name: 'Headlamp',               description: 'Hands-free adjustable headlamp',             productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'light-candles',    categoryId: 'lighting', name: 'Candles',                description: 'Long-burn emergency candles',                productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'light-lighter',    categoryId: 'lighting', name: 'Lighter',                description: 'Windproof refillable lighter',               productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'light-string',     categoryId: 'lighting', name: 'String Lights',          description: 'Battery-powered ambient lighting',           productId: null, pricePlaceholder: null, imageSrc: null },
  // Communications — Starlink removed
  { id: 'comms-radio',      categoryId: 'communications', name: 'Hand Crank Radio',  description: 'NOAA weather + AM/FM, no power needed',      productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'comms-walkie',     categoryId: 'communications', name: 'Walkie Talkies',   description: 'Two-way communication up to 35 miles',       productId: null, pricePlaceholder: null, imageSrc: null },
  // Hygiene — Feminine Hygiene Products added
  { id: 'hygiene-dental',   categoryId: 'hygiene',  name: 'Dental Hygiene Kit',     description: 'Travel toothbrush, toothpaste, floss',       productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'hygiene-cups',     categoryId: 'hygiene',  name: 'Paper Cups',             description: 'Disposable cups for clean water use',        productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'hygiene-tp',       categoryId: 'hygiene',  name: 'Toilet Paper',           description: 'Compact emergency-use rolls',                productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'hygiene-wipes',    categoryId: 'hygiene',  name: 'Baby Wipes',             description: 'No-rinse full-body cleansing wipes',         productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'hygiene-feminine', categoryId: 'hygiene',  name: 'Feminine Hygiene Products', description: 'Assorted period care essentials',         productId: null, pricePlaceholder: null, imageSrc: null },
  // Cooking
  { id: 'cook-lifestraw',   categoryId: 'cooking',  name: 'Lifestraw',              description: 'Personal water filtration straw',            productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'cook-propane',     categoryId: 'cooking',  name: 'Propane Tank',           description: '1lb canister for camp stove',                productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'cook-stove',       categoryId: 'cooking',  name: 'Camping Stove',          description: 'Compact single-burner propane stove',        productId: null, pricePlaceholder: null, imageSrc: null },
  // Medical — Ice Packs added
  { id: 'med-first-aid',    categoryId: 'medical',  name: 'First Aid Kit',          description: 'Comprehensive 200-piece trauma kit',         productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'med-ice-packs',    categoryId: 'medical',  name: 'Ice Packs',              description: 'Instant cold compress packs',                productId: null, pricePlaceholder: null, imageSrc: null },
  // Comfort
  { id: 'comfort-fan',      categoryId: 'comfort',  name: 'Portable Fan',           description: 'Battery-powered USB desk fan',               productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'comfort-earplugs', categoryId: 'comfort',  name: 'Ear Plugs',              description: 'High-NRR foam ear plugs',                    productId: null, pricePlaceholder: null, imageSrc: null },
  // Clothing — new category; Repairs/Tools removed entirely
  { id: 'cloth-ponchos',    categoryId: 'clothing', name: 'Ponchos',                description: 'Waterproof hooded emergency ponchos',        productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'cloth-shoe-covers',categoryId: 'clothing', name: 'Shoe Covers',            description: 'Heavy-duty waterproof boot covers',          productId: null, pricePlaceholder: null, imageSrc: null },
];

/** Items grouped by categoryId — used by Custom subkit browser. */
export const ITEMS_BY_CATEGORY: Record<string, KitItem[]> = ITEMS.reduce(
  (acc, item) => ({ ...acc, [item.categoryId]: [...(acc[item.categoryId] ?? []), item] }),
  {} as Record<string, KitItem[]>
);

/** Standard category IDs in display order — excludes 'custom'. */
export const STANDARD_CATEGORY_IDS = [
  'power', 'lighting', 'communications', 'hygiene',
  'cooking', 'medical', 'comfort', 'clothing',
] as const;

/**
 * lucide-react icon names for items that need non-category icons.
 * Per UX spec Section 6 — new items for added categories.
 */
export const ITEM_ICON_OVERRIDES: Record<string, string> = {
  'hygiene-feminine':  'Droplet',
  'med-ice-packs':     'Snowflake',
  'cloth-ponchos':     'CloudRain',
  'cloth-shoe-covers': 'Footprints',
};
```

---
