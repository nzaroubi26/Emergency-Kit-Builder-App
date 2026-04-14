# Sprint 3 — MCQ-to-Product Mapping Rules

**Prepared by:** John, Product Manager
**Date:** 2026-04-14
**Purpose:** Define how MCQ answers influence the "Fill Your Kit" experience in Sprint 3A. Covers subkit display ordering and conditional product logic.
**Status:** Approved for Sprint 3A scope.

---

## Scope

Sprint 3A uses MCQ answers for two purposes:
1. **Subkit display order** — Emergency type determines which subkits appear first
2. **Conditional item/category gates** — Household composition shows/hides specific products or categories

Per-product recommendation logic (e.g., different product variants based on MCQ answers) is deferred to Sprint 3B/4.

---

## 1. Default Subkit Display Order

When no emergency-type-specific ordering applies, subkits are displayed in this sequence:

| Rank | Category | Notes |
|------|----------|-------|
| 1 | Power | Always #1 — user research confirms this |
| 2 | Medical | — |
| 3 | Communications | — |
| 4 | Lighting | — |
| 5 | Cooking | — |
| 6 | Hygiene | — |
| 7 | Comfort | — |
| 8 | Clothing | — |
| 9 | Custom | — |
| 10 | Pets | Conditional — only if "pets" selected in household composition. Always last when shown. |

---

## 2. Emergency Type Priority Ordering

Each emergency type defines a **top 3** that gets pulled to the front of the display order. Remaining subkits follow the default order from Section 1.

| Emergency Type | #1 | #2 | #3 |
|----------------|----|----|-----|
| Hurricane | Power | Medical | Communications |
| Flood | Power | Clothing | Medical |
| Tornado | Power | Cooking | Medical |
| Tropical Storm | Power | Medical | Communications |

### Multi-Select Rule

If the user selects multiple emergency types, the **first selected type wins** — its top 3 determines the ordering. This keeps the logic simple and predictable for the prototype.

### Ordering Example: Flood

| Position | Category | Source |
|----------|----------|--------|
| 1 | Power | Flood top 3 |
| 2 | Clothing | Flood top 3 |
| 3 | Medical | Flood top 3 |
| 4 | Communications | Default order |
| 5 | Lighting | Default order |
| 6 | Cooking | Default order |
| 7 | Hygiene | Default order |
| 8 | Comfort | Default order |
| 9 | Custom | Default order |
| 10 | Pets | Conditional, always last |

### Ordering Example: Tornado

| Position | Category | Source |
|----------|----------|--------|
| 1 | Power | Tornado top 3 |
| 2 | Cooking | Tornado top 3 |
| 3 | Medical | Tornado top 3 |
| 4 | Communications | Default order |
| 5 | Lighting | Default order |
| 6 | Hygiene | Default order |
| 7 | Comfort | Default order |
| 8 | Clothing | Default order |
| 9 | Custom | Default order |
| 10 | Pets | Conditional, always last |

---

## 3. Household Composition — Conditional Logic

### Active in Sprint 3A

| Household Option | Effect |
|------------------|--------|
| Kids | Show "Rain Poncho (Kids)" item in Clothing category |
| Pets | Show entire Pets category (2 items: Pet First Aid Kit, Collapsible Bowl) |

### Deferred (no Sprint 3A effect)

| Household Option | Status |
|------------------|--------|
| Older Adults | No effect — revisit when products are curated for this group |
| Disability | No effect — revisit when products are curated for this group |
| None | No conditional items shown |

---

## 4. Implementation Notes

### For the dev team

- The ordering algorithm is: take the top 3 from the user's emergency type, then append remaining subkits in default order (skipping any already placed), then Pets last (if applicable).
- Conditional product gates are simple boolean checks against `householdComposition` in the MCQ store.
- Kids Rain Poncho is a **new item** not currently in `kitItems.ts` — it needs to be added (ASIN: B07QCVMCF8, see product catalog).
- The "first selected wins" multi-select rule maps to `emergencyTypes[0]` in the MCQ store.

### What this does NOT cover

- Per-product MCQ logic beyond the two boolean gates above
- Dynamic pricing or availability
- Personalized product variants (e.g., kid-sized headlamp)
- Subkit content changes based on household composition

These are all Sprint 3B/4 concerns.

---

## 5. Reference

- **Product catalog:** `docs/sprint-3-product-catalog.md`
- **PM brief:** `docs/sprint-3-pm-brief.md`
- **MCQ store:** `src/store/mcqStore.ts`
- **Kit items data:** `src/data/kitItems.ts`

---

*Emergency Prep Kit Builder — Sprint 3 MCQ Mapping | John, PM | 2026-04-14*
