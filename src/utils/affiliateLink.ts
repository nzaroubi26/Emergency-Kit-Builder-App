export const AFFILIATE_TAG = 'placeholder-20';

export function buildAffiliateUrl(asin: string, tag: string = AFFILIATE_TAG): string {
  return `https://www.amazon.com/dp/${asin}?tag=${encodeURIComponent(tag)}`;
}
