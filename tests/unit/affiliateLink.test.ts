import { describe, it, expect } from 'vitest';
import { buildAffiliateUrl, AFFILIATE_TAG } from '../../src/utils/affiliateLink';

describe('buildAffiliateUrl', () => {
  it('returns correct URL format with default tag', () => {
    const url = buildAffiliateUrl('B082TMBYR6');
    expect(url).toBe(`https://www.amazon.com/dp/B082TMBYR6?tag=${AFFILIATE_TAG}`);
  });

  it('uses custom tag when provided', () => {
    const url = buildAffiliateUrl('B082TMBYR6', 'my-custom-tag');
    expect(url).toBe('https://www.amazon.com/dp/B082TMBYR6?tag=my-custom-tag');
  });

  it('encodes special characters in tag', () => {
    const url = buildAffiliateUrl('B082TMBYR6', 'tag with spaces');
    expect(url).toBe('https://www.amazon.com/dp/B082TMBYR6?tag=tag%20with%20spaces');
  });

  it('exports AFFILIATE_TAG as a non-empty string', () => {
    expect(AFFILIATE_TAG).toBeTruthy();
    expect(typeof AFFILIATE_TAG).toBe('string');
  });
});
