import { AFFILIATE_TAG } from './affiliateLink';

const CART_BASE = 'https://www.amazon.com/gp/aws/cart/add.html';

export function buildCartUrl(asins: string[], tag: string = AFFILIATE_TAG): string {
  if (asins.length === 0) return '';

  const params = new URLSearchParams();
  params.set('AssociateTag', tag);
  params.set('tag', tag);

  asins.forEach((asin, i) => {
    const n = i + 1;
    params.set(`ASIN.${n}`, asin);
    params.set(`Quantity.${n}`, '1');
  });

  return `${CART_BASE}?${params.toString()}`;
}
