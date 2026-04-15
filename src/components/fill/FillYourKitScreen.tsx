import { type FC, useEffect, useRef } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useMCQStore } from '../../store/mcqStore';
import { useKitStore } from '../../store/kitStore';
import { ESSENTIALS_BUNDLE } from '../../data/essentialsConfig';
import { PRODUCTS_BY_CATEGORY } from '../../data/amazonProducts';
import { getOrderedCategories } from '../../utils/subkitOrdering';
import { buildCartUrl } from '../../utils/cartUrl';
import { CategorySection } from './CategorySection';

export const FillYourKitScreen: FC = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);

  const kitPath = useMCQStore((s) => s.kitPath);
  const emergencyTypes = useMCQStore((s) => s.emergencyTypes);
  const householdComposition = useMCQStore((s) => s.householdComposition);
  const selectedSubkits = useKitStore((s) => s.selectedSubkits);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  // 1. Determine active category IDs
  const activeCategoryIds: string[] = kitPath === 'essentials'
    ? ESSENTIALS_BUNDLE.map((b) => b.subkit)
    : selectedSubkits.map((s) => s.categoryId);

  // 2. Get ordered categories
  const orderedCategories = getOrderedCategories(emergencyTypes[0], householdComposition);

  // 3. Filter to active categories only (also excludes Custom since it's not in orderedCategories)
  const displayCategories = orderedCategories.filter((id) => activeCategoryIds.includes(id));

  // 4. Build category data with filtered products
  const categoryData = displayCategories
    .map((categoryId) => {
      const products = (PRODUCTS_BY_CATEGORY[categoryId] ?? []).filter((p) => {
        if (!p.mcqCondition) return true;
        return householdComposition.includes(p.mcqCondition.includes);
      });
      return { categoryId, products };
    })
    .filter((entry) => entry.products.length > 0);

  // 5. Collect all visible product ASINs for cart URL
  const allVisibleAsins = categoryData.flatMap((entry) => entry.products.map((p) => p.asin));
  const cartUrl = buildCartUrl(allVisibleAsins);

  const handleAddAllToCart = () => {
    if (cartUrl) {
      window.open(cartUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const addAllCta = cartUrl ? (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={handleAddAllToCart}
        aria-label="Add all displayed products to Amazon cart"
        className="w-full max-w-[400px] flex items-center justify-center gap-2 py-3 px-6 text-[15px] font-semibold text-white rounded-[var(--radius-md,8px)] cursor-pointer"
        style={{ backgroundColor: 'var(--color-brand-primary, #1F4D35)' }}
      >
        <ShoppingCart size={18} aria-hidden="true" />
        Add All to Amazon Cart
      </button>
      <p className="text-[12px] text-[var(--color-neutral-400)] text-center mt-2">
        Prices may vary on Amazon
      </p>
    </div>
  ) : null;

  return (
    <div className="max-w-[960px] mx-auto px-4 md:px-8">
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="text-[36px] font-bold text-[var(--color-neutral-900)] text-center outline-none"
      >
        Fill Your Kit
      </h1>
      <p className="text-[16px] text-[var(--color-neutral-500)] text-center mt-2">
        Shop for the items to fill your emergency subkits. Each product links directly to Amazon.
      </p>

      <div className="mt-6">{addAllCta}</div>

      <div className="mt-8 flex flex-col gap-4">
        {categoryData.map((entry, index) => (
          <CategorySection
            key={entry.categoryId}
            categoryId={entry.categoryId}
            products={entry.products}
            defaultExpanded={index < 3}
          />
        ))}
      </div>

      <div className="mt-8 mb-8">{addAllCta}</div>
    </div>
  );
};
