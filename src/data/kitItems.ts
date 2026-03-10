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
  { id: 'power-station',    categoryId: 'power',    name: 'Portable Power Station', description: 'Lithium battery for device charging',        rating: 4.8, reviewCount: 342, weightGrams: 1587, volumeIn3: 120, productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'power-solar',      categoryId: 'power',    name: 'Solar Panel',            description: 'Foldable panel for off-grid charging',       rating: 4.6, reviewCount: 218, weightGrams: 680,  volumeIn3: 108, productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'power-cables',     categoryId: 'power',    name: 'Charging Cables',        description: 'USB-C and USB-A multi-cable set',            rating: 4.5, reviewCount: 512, weightGrams: 227,  volumeIn3: 42,  productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'power-banks',      categoryId: 'power',    name: 'Power Banks',            description: 'Pocket-sized backup battery',                rating: 4.7, reviewCount: 289, weightGrams: 227,  volumeIn3: 12,  productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'power-batteries',  categoryId: 'power',    name: 'Batteries AA/AAA',       description: 'Standard alkaline multi-pack',               rating: 4.4, reviewCount: 731, weightGrams: 454,  volumeIn3: 28,  productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'light-matches',    categoryId: 'lighting', name: 'Matches',                description: 'Waterproof strike-anywhere matches',         rating: 4.3, reviewCount: 198, weightGrams: 113,  volumeIn3: 6,   productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'light-flashlight', categoryId: 'lighting', name: 'Flashlights',            description: 'High-lumen LED flashlight',                  rating: 4.8, reviewCount: 456, weightGrams: 227,  volumeIn3: 14,  productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'light-lantern',    categoryId: 'lighting', name: 'Electric Lanterns',      description: 'Rechargeable 360 degree area lantern',       rating: 4.7, reviewCount: 324, weightGrams: 454,  volumeIn3: 96,  productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'light-headlamp',   categoryId: 'lighting', name: 'Headlamp',               description: 'Hands-free adjustable headlamp',             rating: 4.9, reviewCount: 612, weightGrams: 113,  volumeIn3: 18,  productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'light-candles',    categoryId: 'lighting', name: 'Candles',                description: 'Long-burn emergency candles',                rating: 4.2, reviewCount: 143, weightGrams: 340,  volumeIn3: 42,  productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'light-lighter',    categoryId: 'lighting', name: 'Lighter',                description: 'Windproof refillable lighter',               rating: 4.5, reviewCount: 387, weightGrams: 85,   volumeIn3: 3,   productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'light-string',     categoryId: 'lighting', name: 'String Lights',          description: 'Battery-powered ambient lighting',           rating: 3.9, reviewCount: 97,  weightGrams: 170,  volumeIn3: 36,  productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'comms-radio',      categoryId: 'communications', name: 'Hand Crank Radio',  description: 'NOAA weather + AM/FM, no power needed',     rating: 4.8, reviewCount: 521, weightGrams: 454,  volumeIn3: 42,  productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'comms-walkie',     categoryId: 'communications', name: 'Walkie Talkies',   description: 'Two-way communication up to 35 miles',       rating: 4.4, reviewCount: 276, weightGrams: 340,  volumeIn3: 48,  productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'hygiene-dental',   categoryId: 'hygiene',  name: 'Dental Hygiene Kit',     description: 'Travel toothbrush, toothpaste, floss',       rating: 4.3, reviewCount: 189, weightGrams: 142,  volumeIn3: 36,  productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'hygiene-cups',     categoryId: 'hygiene',  name: 'Paper Cups',             description: 'Disposable cups for clean water use',        rating: 4.1, reviewCount: 234, weightGrams: 170,  volumeIn3: 60,  productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'hygiene-tp',       categoryId: 'hygiene',  name: 'Toilet Paper',           description: 'Compact emergency-use rolls',                rating: 4.6, reviewCount: 445, weightGrams: 340,  volumeIn3: 120, productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'hygiene-wipes',    categoryId: 'hygiene',  name: 'Baby Wipes',             description: 'No-rinse full-body cleansing wipes',         rating: 4.7, reviewCount: 398, weightGrams: 454,  volumeIn3: 120, productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'hygiene-feminine', categoryId: 'hygiene',  name: 'Feminine Hygiene Products', description: 'Assorted period care essentials',         rating: 4.5, reviewCount: 312, weightGrams: 227,  volumeIn3: 60,  productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'cook-lifestraw',   categoryId: 'cooking',  name: 'Lifestraw',              description: 'Personal water filtration straw',            rating: 4.9, reviewCount: 687, weightGrams: 57,   volumeIn3: 10,  productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'cook-propane',     categoryId: 'cooking',  name: 'Propane Tank',           description: '1lb canister for camp stove',                rating: 4.5, reviewCount: 203, weightGrams: 370,  volumeIn3: 90,  productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'cook-stove',       categoryId: 'cooking',  name: 'Camping Stove',          description: 'Compact single-burner propane stove',        rating: 4.7, reviewCount: 318, weightGrams: 454,  volumeIn3: 108, productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'med-first-aid',    categoryId: 'medical',  name: 'First Aid Kit',          description: 'Comprehensive 200-piece trauma kit',         rating: 4.8, reviewCount: 524, weightGrams: 1134, volumeIn3: 252, productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'med-ice-packs',    categoryId: 'medical',  name: 'Ice Packs',              description: 'Instant cold compress packs',                rating: 4.4, reviewCount: 167, weightGrams: 454,  volumeIn3: 56,  productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'comfort-fan',      categoryId: 'comfort',  name: 'Portable Fan',           description: 'Battery-powered USB desk fan',               rating: 4.3, reviewCount: 241, weightGrams: 227,  volumeIn3: 96,  productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'comfort-earplugs', categoryId: 'comfort',  name: 'Ear Plugs',              description: 'High-NRR foam ear plugs',                    rating: 4.6, reviewCount: 378, weightGrams: 85,   volumeIn3: 18,  productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'cloth-ponchos',    categoryId: 'clothing', name: 'Ponchos',                description: 'Waterproof hooded emergency ponchos',        rating: 4.2, reviewCount: 134, weightGrams: 227,  volumeIn3: 28,  productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'cloth-shoe-covers',categoryId: 'clothing', name: 'Shoe Covers',            description: 'Heavy-duty waterproof boot covers',          rating: 3.8, reviewCount: 89,  weightGrams: 170,  volumeIn3: 36,  productId: null, pricePlaceholder: null, imageSrc: null },
];

export const ITEMS_BY_CATEGORY: Record<string, KitItem[]> = ITEMS.reduce(
  (acc, item) => ({ ...acc, [item.categoryId]: [...(acc[item.categoryId] ?? []), item] }),
  {} as Record<string, KitItem[]>
);

export const STANDARD_CATEGORY_IDS = [
  'power', 'lighting', 'communications', 'hygiene',
  'cooking', 'medical', 'comfort', 'clothing',
] as const;

export const ITEM_ICON_OVERRIDES: Record<string, string> = {
  'hygiene-feminine':  'Droplet',
  'med-ice-packs':     'Snowflake',
  'cloth-ponchos':     'CloudRain',
  'cloth-shoe-covers': 'Footprints',
};
