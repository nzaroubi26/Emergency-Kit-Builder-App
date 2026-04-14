import { describe, it, expect } from 'vitest';
import { buildCartUrl } from '../../src/utils/cartUrl';
import { AFFILIATE_TAG } from '../../src/utils/affiliateLink';
import { AMAZON_PRODUCTS } from '../../src/data/amazonProducts';

describe('buildCartUrl', () => {
  it('returns empty string for empty array', () => {
    expect(buildCartUrl([])).toBe('');
  });

  it('constructs correct URL for a single ASIN', () => {
    const url = buildCartUrl(['B082TMBYR6']);
    expect(url).toContain('https://www.amazon.com/gp/aws/cart/add.html?');
    expect(url).toContain(`AssociateTag=${AFFILIATE_TAG}`);
    expect(url).toContain(`tag=${AFFILIATE_TAG}`);
    expect(url).toContain('ASIN.1=B082TMBYR6');
    expect(url).toContain('Quantity.1=1');
  });

  it('constructs correct URL for multiple ASINs with sequential numbering', () => {
    const url = buildCartUrl(['B082TMBYR6', 'B0B9SP6BNH', 'B0DYZJFSH9']);
    expect(url).toContain('ASIN.1=B082TMBYR6');
    expect(url).toContain('Quantity.1=1');
    expect(url).toContain('ASIN.2=B0B9SP6BNH');
    expect(url).toContain('Quantity.2=1');
    expect(url).toContain('ASIN.3=B0DYZJFSH9');
    expect(url).toContain('Quantity.3=1');
  });

  it('uses custom tag when provided', () => {
    const url = buildCartUrl(['B082TMBYR6'], 'my-tag-20');
    expect(url).toContain('AssociateTag=my-tag-20');
    expect(url).toContain('tag=my-tag-20');
    expect(url).not.toContain(AFFILIATE_TAG);
  });

  it('includes both AssociateTag and tag parameters', () => {
    const url = buildCartUrl(['B082TMBYR6']);
    const params = new URLSearchParams(url.split('?')[1]);
    expect(params.get('AssociateTag')).toBe(AFFILIATE_TAG);
    expect(params.get('tag')).toBe(AFFILIATE_TAG);
  });

  it('URL length is under 2000 characters for all 31 catalog ASINs', () => {
    const allAsins = AMAZON_PRODUCTS.map((p) => p.asin);
    expect(allAsins).toHaveLength(31);
    const url = buildCartUrl(allAsins);
    expect(url.length).toBeLessThan(2000);
  });
});
