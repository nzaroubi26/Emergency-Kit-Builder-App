import { type FC, useState, useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { CATEGORIES } from '../../data/kitItems';
import type { AmazonProduct } from '../../data/amazonProducts';
import { resolveIcon } from '../../utils/iconResolver';
import { buildAffiliateUrl } from '../../utils/affiliateLink';
import { ProductCard } from './ProductCard';

interface CategorySectionProps {
  categoryId: string;
  products: AmazonProduct[];
  defaultExpanded: boolean;
}

export const CategorySection: FC<CategorySectionProps> = ({ categoryId, products, defaultExpanded }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const id = useId();
  const headerId = `${id}-header`;
  const panelId = `${id}-panel`;

  const category = CATEGORIES[categoryId];
  if (!category) return null;

  const Icon = resolveIcon(category.icon);
  const itemCount = products.length;
  const itemLabel = itemCount === 1 ? '1 item' : `${itemCount} items`;

  return (
    <div className="rounded-lg overflow-hidden border border-[var(--color-neutral-200)]">
      <button
        id={headerId}
        type="button"
        aria-expanded={isExpanded}
        aria-controls={panelId}
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left cursor-pointer"
        style={{
          borderTop: `4px solid ${category.colorBase}`,
          backgroundColor: category.colorTint,
        }}
      >
        {Icon && <Icon size={20} style={{ color: category.colorBase }} aria-hidden="true" />}
        <span className="font-semibold text-[var(--color-neutral-900)] flex-1">{category.name}</span>
        <span className="text-sm text-[var(--color-neutral-500)]">{itemLabel}</span>
        <ChevronDown
          size={18}
          className="transition-transform duration-200"
          style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', color: 'var(--color-neutral-500)' }}
          aria-hidden="true"
        />
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        className="transition-[max-height] overflow-hidden"
        style={{
          maxHeight: isExpanded ? '5000px' : '0px',
          transitionDuration: isExpanded ? '200ms' : '180ms',
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              affiliateUrl={buildAffiliateUrl(product.asin)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
