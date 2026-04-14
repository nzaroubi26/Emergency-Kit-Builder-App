# Sprint 3 — Product Catalog: Amazon Affiliate Items

**Prepared by:** John, Product Manager (with stakeholder input)
**Date:** 2026-04-14
**Purpose:** Complete product curation for Sprint 3A static data file. Maps each subkit category to specific Amazon products with ASINs, prices, and affiliate link data.
**Status:** A1 (Product Curation) complete. Ready for dev integration.

---

## Overview

- **31 products** across **9 categories** (Custom has no dedicated products)
- All prices are point-in-time snapshots (2026-04-14) — static for the prototype
- Affiliate links will be constructed as: `https://www.amazon.com/dp/{ASIN}?tag={AFFILIATE_TAG}`
- Images should be downloaded locally — do not hotlink from Amazon

---

## 1. Power (5 items)

| # | Item | ASIN | Price | Brand/Product | Item ID (current) |
|---|------|------|-------|---------------|--------------------|
| 1 | Portable Power Station | B082TMBYR6 | $199.00 | Jackery Explorer | power-station |
| 2 | Solar Panel | B0B9SP6BNH | $149.99 | GRECELL Portable Foldable | power-solar |
| 3 | Charging Cables | B0DYZJFSH9 | $13.48 | Multi-charging (Lightning/Universal) | power-cables |
| 4 | Power Bank | B0D5CLSMFB | $19.98 | Anker Travel-Ready | power-banks |
| 5 | Batteries AA/AAA | B094D3JGLT | $16.70 | Amazon Basics combo pack | power-batteries |

---

## 2. Lighting (7 items)

| # | Item | ASIN | Price | Brand/Product | Item ID (current) |
|---|------|------|-------|---------------|--------------------|
| 1 | Matches | B004U4JCDS | $8.99 | Diamond Strike Anywhere | light-matches |
| 2 | Flashlight | B079PDYNCQ | $15.99 | Coleman Battery Guard | light-flashlight |
| 3 | Electric Lantern | B07HF226B4 | $53.49 | Coleman Water-Resistant | light-lantern |
| 4 | Headlamp | B014JUMTXM | $9.97 | Foxelli Waterproof | light-headlamp |
| 5 | Candles | B07ZYB6RN9 | $14.99 | Hyoola Emergency 24-pack | light-candles |
| 6 | Lighter | B00GUQWAS8 | $14.99 | BIC Multi-purpose (4-pack) | light-lighter |
| 7 | String Lights | B0B4NT4J28 | $30.59 | Brightever Shatterproof | light-string |

---

## 3. Communications (2 items)

| # | Item | ASIN | Price | Brand/Product | Item ID (current) |
|---|------|------|-------|---------------|--------------------|
| 1 | Hand Crank Radio | B0BMKN9JQX | $22.99 | Esky Portable Rechargeable | comms-radio |
| 2 | Walkie Talkies | B08MKT9B7X | $54.99 | Pxton Rechargeable (4-pack) | comms-walkie |

> **Note:** Lean category — revisit for potential merging with another category pre-Sprint 4.

---

## 4. Hygiene (5 items)

| # | Item | ASIN | Price | Brand/Product | Item ID (current) | Action Required |
|---|------|------|-------|---------------|--------------------|-----------------|
| 1 | Dental Kit | B0DFGWVSWV | $9.99 | Lilingsty Travel Toothbrush Set | hygiene-dental | — |
| 2 | Paper Plates & Utensils | B0B3QFXLH5 | $28.99 | Compostable Sugarcane Dinnerware | hygiene-cups | **Rename from "Paper Cups"** |
| 3 | Toilet Paper | B07BGLT25K | $6.49 | Scott ComfortPlus Double Roll | hygiene-tp | — |
| 4 | Baby Wipes | B08QRT84WJ | $13.35 | Huggies Sensitive Unscented | hygiene-wipes | — |
| 5 | Feminine Hygiene Kit | B093TSF8HY | $39.99 | Menstrual Convenience Kit | hygiene-feminine | **Confirm rename** |

---

## 5. Cooking (3 items)

| # | Item | ASIN | Price | Brand/Product | Item ID (current) |
|---|------|------|-------|---------------|--------------------|
| 1 | Camping Stove | B0009PUR5E | $49.64 | Coleman | cook-stove |
| 2 | Propane Tank | B003VCPGHG | $25.75 | Coleman Propane (2-pack) | cook-propane |
| 3 | LifeStraw | B0DTRLCKH2 | $59.95 | LifeStraw Personal | cook-lifestraw |

> **Note:** LifeStraw is water filtration — consider whether it belongs in Cooking or a future Water/Hydration category during category review.

---

## 6. Medical (2 items)

| # | Item | ASIN | Price | Brand/Product | Item ID (current) |
|---|------|------|-------|---------------|--------------------|
| 1 | First Aid Kit | B09NWH8553 | $24.47 | Johnson & Johnson All-Purpose | med-first-aid |
| 2 | Hot/Cold Pack | B0BCDWGDMZ | $14.97 | Flexible Ice Pack | med-ice-packs |

> **Note:** Lean category — revisit for potential expansion pre-Sprint 4.

---

## 7. Comfort (2 items)

| # | Item | ASIN | Price | Brand/Product | Item ID (current) |
|---|------|------|-------|---------------|--------------------|
| 1 | Portable Fan | B0DP4F63BV | $39.99 | Warmco 10000mAh Ultra-thin | comfort-fan |
| 2 | Ear Plugs | B0BFRTLW7L | $8.90 | Amazon Basic Care | comfort-earplugs |

> **Note:** Lean category — revisit for potential expansion pre-Sprint 4.

---

## 8. Clothing (3 items)

| # | Item | ASIN | Price | Brand/Product | Item ID (current) | MCQ Logic |
|---|------|------|-------|---------------|--------------------|-----------|
| 1 | Rain Poncho (Adult) | B076ZHMR3S | $14.99 | Hagon PRO Premium | cloth-ponchos | Always shown |
| 2 | Rain Poncho (Kids) | B07QCVMCF8 | $12.99 | SINGON Disposable | — (new item) | **Only if kids in household** |
| 3 | Shoe Covers | B0G3ZRY3X8 | $5.99 | Waterproof Disposable | cloth-shoe-covers | Always shown |

---

## 9. Pets (2 items)

| # | Item | ASIN | Price | Brand/Product | Item ID (current) | MCQ Logic |
|---|------|------|-------|---------------|--------------------|-----------|
| 1 | Pet First Aid Kit | B07WRPCLYR | $35.90 | ARCA PET Travel Emergency | pets-first-aid (updated) | **Only if pets in household** |
| 2 | Collapsible Bowl | B07VT1468W | $4.97 | Collapsible Portable w/ Carabiners | pets-water (updated) | **Only if pets in household** |

---

## 10. Custom

No dedicated products. Users pull items from other categories.

---

## Data Changes Required in `kitItems.ts`

These changes should be included in the Sprint 3A product data story:

### Renames
| Current Name | New Name | Item ID |
|--------------|----------|---------|
| Paper Cups | Paper Plates & Utensils | hygiene-cups |
| Feminine Hygiene Products | Feminine Hygiene Kit (confirm) | hygiene-feminine |
| Pet Water & Bowl Kit | Collapsible Bowl | pets-water |
| Pet First Aid & Comfort Kit | Pet First Aid Kit | pets-first-aid |

### Removals
| Item | Item ID | Reason |
|------|---------|--------|
| Pet Food Supply (3-Day) | pets-food | Users already have their own pet food — we don't want to prescribe choices here |

### Additions
| Item | Category | MCQ Condition |
|------|----------|---------------|
| Rain Poncho (Kids) | clothing | Only shown if kids in household |

---

## MCQ-Conditional Items Summary

| Item | Category | Condition |
|------|----------|-----------|
| Rain Poncho (Kids) | Clothing | Kids in household |
| All Pets items | Pets | Pets in household |

> **Sprint 3A approach:** MCQ answers determine subkit *display order* only. Per-product MCQ logic (like the kids poncho) is deferred to Sprint 3B/4 unless trivially implementable.

---

## Pre-Sprint 4 Review Items

1. **Category consolidation** — Communications (2), Medical (2), and Comfort (2) are lean. Consider merging.
2. **LifeStraw placement** — Water filtration in Cooking category, may warrant its own Water/Hydration category.
3. **Per-product MCQ mapping** — Define full mapping matrix if Sprint 3B proceeds.
4. **Dynamic pricing** — Contingent on PA-API 5.0 spike results.

---

*Emergency Prep Kit Builder — Sprint 3 Product Catalog | John, PM | 2026-04-14*
