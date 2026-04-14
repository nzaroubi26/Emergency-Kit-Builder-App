# Sprint 3 — API Feasibility Spike Results

**Prepared by:** Winston, Architect
**Date:** 2026-04-14
**Type:** Research-only feasibility spike (no implementation)
**Scope:** Amazon Cart URL mechanism + PA-API 5.0 / Creators API assessment
**References:** `docs/sprint-3-pm-brief.md` (D4, D5, D6, D7, Q5), `docs/sprint-3-product-catalog.md`

---

## Executive Summary

| API | Verdict | Confidence | Sprint 3B Impact |
|-----|---------|------------|-------------------|
| Add to Cart URL | **GO** | High | Client-side only, no backend needed |
| PA-API 5.0 / Creators API | **NO-GO** | High | Static data approach continues |

---

## API 1: Amazon Add to Cart URL — "Add All to Amazon Cart"

### Verdict: GO

### Context

The original Amazon Cart API (CartCreate, CartAdd, CartGet, CartModify, CartClear) was a set of programmatic REST operations available in PA-API 4.0. **These were fully removed in the PA-API 4.0 to 5.0 migration and no longer exist as API endpoints.**

However, Amazon continues to support and document an **Add to Cart HTML form / URL mechanism** that achieves the same user-facing result. This is not an API in the traditional sense — it is a URL-based redirect that constructs an Amazon shopping cart and lands the user on Amazon's cart page.

### Spike Questions Answered

**1. Can we programmatically add N items to an Amazon cart without the user being pre-authenticated to Amazon?**

**Yes.** The mechanism works via a simple GET URL:

```
https://www.amazon.com/gp/aws/cart/add.html
  ?AssociateTag={AFFILIATE_TAG}
  &tag={AFFILIATE_TAG}
  &ASIN.1={ASIN_1}&Quantity.1=1
  &ASIN.2={ASIN_2}&Quantity.2=1
  &ASIN.3={ASIN_3}&Quantity.3=1
  ...
```

The user does not need to be pre-authenticated. When they click the link, Amazon adds the items to their cart (creating one if needed) and presents them with Amazon's standard cart page. The user then logs in on Amazon's side to complete purchase.

With 31 products in the catalog, this URL would have ~65 query parameters — well within URL length limits (browsers support 2,000+ characters; this URL would be approximately 1,500 characters for all 31 products).

**2. Does this require an approved Associates account or API keys?**

**No API keys required.** The only identifier needed is the `AssociateTag` string — the affiliate tracking tag assigned when you join Amazon Associates. This is a plain text value embedded in the URL, not a secret credential.

Note: The affiliate tag works structurally even before the Associates account is fully approved. The tag just won't earn commissions until approved. This aligns with PM brief decision D4.

**3. Are there CORS/browser restrictions that prevent client-side calls?**

**No.** This is not a fetch/XHR call — it is a standard URL navigation (equivalent to clicking a link or submitting a form). The browser navigates to `amazon.com/gp/aws/cart/add.html` as a top-level page load. CORS does not apply to top-level navigation. No cross-origin restrictions exist.

**4. Does Amazon still actively support this?**

**Yes.** Evidence:
- The mechanism is documented in the current PA-API 5.0 documentation under "Add to Cart form"
- The endpoint `https://www.amazon.com/gp/aws/cart/add.html` is live and responsive
- Multiple third-party affiliate tools (Helium 10, AiHello, Chrome extensions) actively generate these URLs as of 2026
- Amazon Associates Central references this as a supported linking strategy
- The 90-day cookie window (vs. 24-hour for standard product links) indicates this is a first-class affiliate feature, not a deprecated endpoint

**5. Go/no-go recommendation**

### **GO** — with high confidence

**Reasoning:**
- Zero external dependencies (no API keys, no backend, no approval process)
- Works entirely client-side as URL construction
- Supported and documented by Amazon
- Superior affiliate cookie duration (90 days vs. 24 hours for standard links)
- The "fallback" (individual product links) is also supported but the multi-item cart URL is actually the better primary approach
- Trivial engineering lift — it's string concatenation

### Minimum Integration Path

**Client-side only. No backend required.**

```
User clicks "Add All to Amazon Cart"
  → App constructs URL from kit ASINs + affiliate tag
  → window.open(url, '_blank')
  → User lands on Amazon cart page with items pre-loaded
```

Implementation is a single utility function that:
1. Takes an array of ASINs (from the product catalog data)
2. Constructs the URL with numbered ASIN/Quantity parameters
3. Appends the AssociateTag
4. Opens in a new tab

Estimated scope: One small story, no architectural changes.

### Risks and Considerations

| Risk | Severity | Mitigation |
|------|----------|------------|
| Amazon could deprecate the endpoint | Low — it's been stable for 10+ years and is actively documented | Fallback to individual `/dp/{ASIN}?tag=` links is trivial |
| URL length limits with very large carts | None for us — 31 products is well within limits | Only relevant for 100+ item carts |
| Items may be out of stock when user arrives | Low — Amazon handles this gracefully on their cart page | Not our problem to solve |
| No guarantee on item prices at checkout | Expected — prices are dynamic on Amazon | Static prices in our UI are snapshots; Amazon shows real price in cart |

---

## API 2: PA-API 5.0 / Creators API — Product Advertising API

### Verdict: NO-GO (for the prototype)

### Critical Discovery: PA-API 5.0 Deprecation

**PA-API 5.0 is being deprecated on or around April 30, 2026 — approximately 16 days from the date of this spike.** Amazon is migrating all affiliates to the new **Creators API**, which uses OAuth 2.0 authentication and new credential management through Associates Central.

This finding fundamentally changes the assessment. We are not evaluating one API — we are evaluating a dying API and its newborn replacement.

### Spike Questions Answered

**1. What are the auth requirements?**

| Requirement | PA-API 5.0 (deprecated) | Creators API (replacement) |
|-------------|--------------------------|---------------------------|
| Associates account | Required, approved | Required, approved |
| Credentials | AWS Access Key + Secret Key | OAuth 2.0 tokens (new credentials via Associates Central) |
| Sales threshold (initial) | 3 qualifying sales within 180 days | Same or similar (under Associates program rules) |
| Sales threshold (ongoing) | **10 qualifying sales in trailing 30 days** | **Same — 10 qualifying sales in trailing 30 days** |
| Account review | Standard Associates review | Standard Associates review |

The 10-sales-per-month ongoing requirement is the critical barrier. A prototype with zero production traffic will have zero qualifying sales, meaning API access would be denied or immediately revoked.

**2. What are the rate limits?**

PA-API 5.0 (and expected similar for Creators API):
- **Initial:** 1 TPS (transaction per second), 8,640 TPD (transactions per day) for first 30 days
- **Scaling:** 1 TPD per $0.05 shipped item revenue; 1 TPS (up to 10 max) per $4,320 shipped item revenue
- **Practical impact:** A prototype generating $0 in affiliate revenue would be capped at the minimum rate tier after the initial 30-day period
- **Pricing operations:** GetListingOffersBatch is the most restrictive at 0.1 req/sec

For our 31-product catalog, even the minimum rate is technically sufficient (we'd need ~31 calls to hydrate all products). But without qualifying sales, we may not even have access to make those calls.

**3. Can we retrieve price + image + availability for a given ASIN?**

**Yes** — the GetItems operation returns:
- **Price:** Via `Offers.Listings.Price` resource (including savings/discount data)
- **Images:** URLs in Small, Medium, Large sizes (all available product images)
- **Availability:** Via `Offers.Listings.Availability.Message` (e.g., "In Stock", "Temporarily out of stock") plus `MaxOrderQuantity`, `MinOrderQuantity`, and type enum
- **Also:** Title, features, DetailPageURL, merchant info, delivery info

The data capabilities are not the issue. The access requirements are.

**4. Does it require a backend?**

**Yes.** Both PA-API 5.0 (AWS signing) and Creators API (OAuth 2.0 tokens) require server-side credential management. API keys/tokens cannot be exposed in client-side code.

Architecture would require:
- Backend proxy (serverless function or lightweight server)
- Credential storage (environment variables or secrets manager)
- Token refresh logic (OAuth 2.0 for Creators API)

This directly conflicts with the current fully client-side architecture (React SPA, no backend).

**5. What's the latency like?**

- Standard REST API latency (~200-500ms per call, variable)
- For 31 products: sequential calls would take 6-15 seconds; batched/parallel would be faster but still noticeable
- **Page-load calls without caching are not viable** — would need a caching layer
- Recommended: Cache product data with 1-24 hour TTL, refresh in background

**6. Go/no-go recommendation**

### **NO-GO** — with high confidence for the prototype phase

**Reasoning:**

1. **PA-API 5.0 dies in ~16 days.** Any work against it is immediately throwaway.

2. **Creators API requires 10 sales/month to maintain access.** A prototype with no production traffic will never meet this threshold. This is a chicken-and-egg problem: you need the API to show dynamic prices, but you need sales to access the API.

3. **Requires backend infrastructure.** The current architecture is a pure client-side React SPA. Adding a backend proxy for a single API that we can't access anyway is premature complexity.

4. **Static data is explicitly sufficient for prototype goals.** Per the PM brief (D3): "The prototype needs to demonstrate the business model, not prove conversion rates." Point-in-time price snapshots from the product catalog achieve this. A stakeholder watching a demo will not know or care whether the $199.00 Jackery price is live or cached.

5. **Rate limits scale with revenue we don't have.** Even if we got access, we'd be on minimum-tier rate limits with no path to scale until post-prototype.

6. **The replacement API (Creators API) is still maturing.** OAuth 2.0 migration is actively in progress across the ecosystem. Third-party libraries are still being updated. This is not the time to build against a moving target.

### Static Data Approach Confirmation

The fallback is not a compromise — it is the correct architectural choice for Sprint 3A:

- Product catalog (`sprint-3-product-catalog.md`) provides all 31 products with ASINs, prices, and brand names
- Images will be downloaded locally (per catalog instructions — do not hotlink from Amazon)
- Prices are point-in-time snapshots, displayed with appropriate "prices may vary" language
- This pattern mirrors `kitItems.ts` — no new architectural patterns needed

---

## Architecture Recommendations for Sprint 3B

Based on these findings, here is the recommended architecture posture:

### What to build in Sprint 3A (confirmed)

| Component | Approach | Backend? |
|-----------|----------|----------|
| Product data | Static TypeScript file (like `kitItems.ts`) | No |
| Product images | Downloaded locally, served as static assets | No |
| Affiliate links | URL construction: `/dp/{ASIN}?tag={TAG}` | No |
| "Add All to Cart" CTA | URL construction: `gp/aws/cart/add.html?...` | No |
| Price display | Static snapshots with "prices may vary" disclaimer | No |

**Architecture impact: Zero.** Sprint 3A remains fully client-side.

### What Sprint 3B could add (if/when viable)

| Component | Prerequisite | Approach |
|-----------|-------------|----------|
| Live pricing | Approved Associates account + 10 sales/month + Creators API credentials | Backend proxy (serverless function) → Creators API → cache → client |
| Availability badges | Same as live pricing | Same data source, different field |
| Dynamic images | Same as live pricing | Same data source, different field |
| Per-product MCQ mapping | Mapping matrix from John + Stakeholder | Client-side logic, no API needed |

### When to revisit the Creators API

Revisit when **all** of these are true:
1. Associates account is approved and generating qualifying sales
2. Creators API has stabilized post-PA-API deprecation (give it 2-3 months)
3. There is a demonstrated user need for live pricing that static data doesn't satisfy
4. A backend is justified by other requirements (not just this one API)

---

## Appendix: Add to Cart URL Reference

For Sprint 3B implementation, here is the exact URL format:

```
https://www.amazon.com/gp/aws/cart/add.html
  ?AssociateTag={AFFILIATE_TAG}
  &tag={AFFILIATE_TAG}
  &ASIN.1=B082TMBYR6&Quantity.1=1    // Jackery Explorer
  &ASIN.2=B0B9SP6BNH&Quantity.2=1    // GRECELL Solar Panel
  &ASIN.3=B0DYZJFSH9&Quantity.3=1    // Multi-charging cables
  ...
```

**Parameters:**
- `AssociateTag` / `tag`: Your Amazon Associates tracking tag (include both for compatibility)
- `ASIN.{n}`: The Amazon Standard Identification Number for product n
- `Quantity.{n}`: Quantity for product n (typically 1)
- Products are numbered sequentially starting at 1

**Cookie duration:** 90 days (items placed in cart via this mechanism earn affiliate commission if purchased within 90 days — 90x longer than the standard 24-hour affiliate link cookie).

---

## Sources

- [Add to Cart form — PA-API 5.0 Documentation](https://webservices.amazon.com/paapi5/documentation/add-to-cart-form.html)
- [PA-API 5.0 Rate Limits](https://webservices.amazon.com/paapi5/documentation/troubleshooting/api-rates.html)
- [PA-API 5.0 Registration](https://webservices.amazon.com/paapi5/documentation/register-for-pa-api.html)
- [PA-API 5.0 GetItems Operation](https://webservices.amazon.com/paapi5/documentation/get-items.html)
- [Amazon Creators API Documentation](https://affiliate-program.amazon.com/creatorsapi/docs/)
- [Amazon Creators API Migration Guide — affiliate-toolkit](https://www.affiliate-toolkit.com/affiliate-toolkit-3-8-5-amazon-creators-api-support-why-you-need-to-migrate-before-may-15-2026/)
- [PA-API AssociateNotEligible 10-Sales Rule](https://www.keywordrush.com/blog/amazon-pa-api-associatenoteligible-error-is-there-a-new-10-sales-rule/)
- [Amazon Creators API: What Changed — KeywordRush](https://www.keywordrush.com/blog/amazon-creator-api-what-changed-and-how-to-switch/)
- [Multi-Item Add to Cart URL Example — GitHub Gist](https://gist.github.com/ericdfields/3d4ed9c7f7b559289a102207facd61a7)
- [Add to Cart vs Affiliate Link — Warrior Forum](https://www.warriorforum.com/main-internet-marketing-discussion-forum/751729-amazon-add-cart-vs-affiliate-link.html)
- [Amazon Associates Help — Add to Cart Links](https://affiliate-program.amazon.com/help/node/topic/GP38PJ6EUR6PFBEC)

---

*Emergency Prep Kit Builder — Sprint 3 API Spike Results | Winston, Architect | 2026-04-14*
