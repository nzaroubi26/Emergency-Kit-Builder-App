import { type FC, useState } from 'react';
import { Package } from 'lucide-react';
import type { AmazonProduct } from '../../data/amazonProducts';

interface ProductCardProps {
  product: AmazonProduct;
  affiliateUrl: string;
}

export const ProductCard: FC<ProductCardProps> = ({ product, affiliateUrl }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-white rounded-[var(--radius-md,8px)] border border-[var(--color-neutral-200)] p-4 flex flex-col items-center text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
      <div className="w-[160px] h-[160px] sm:w-[140px] sm:h-[140px] lg:w-[160px] lg:h-[160px] flex items-center justify-center bg-[var(--color-neutral-100,#F5F5F5)] rounded">
        {imgError ? (
          <Package size={48} style={{ color: 'var(--color-neutral-300, #D4D4D4)' }} aria-hidden="true" />
        ) : (
          <img
            src={product.imageSrc}
            alt={product.name}
            loading="lazy"
            className="object-contain max-w-full max-h-full"
            onError={() => setImgError(true)}
          />
        )}
      </div>
      <p className="mt-3 text-[14px] font-medium text-[var(--color-neutral-900)] line-clamp-2 min-h-[40px]">
        {product.name}
      </p>
      <p className="mt-1 text-[12px] text-[var(--color-neutral-500)] truncate w-full">
        {product.brand}
      </p>
      <p className="mt-2 text-[18px] font-semibold text-[var(--color-neutral-900)]">
        ${product.price.toFixed(2)}
      </p>
      <a
        href={affiliateUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View ${product.name} by ${product.brand} on Amazon`}
        className="mt-3 w-full py-2 px-4 text-[13px] font-medium rounded-[var(--radius-md,8px)] border-2 border-[var(--color-brand-accent,#22C55E)] text-[var(--color-brand-accent,#22C55E)] bg-white hover:bg-[var(--color-brand-accent,#22C55E)] hover:text-white transition-colors duration-150 text-center inline-block"
      >
        View on Amazon
      </a>
    </div>
  );
};
