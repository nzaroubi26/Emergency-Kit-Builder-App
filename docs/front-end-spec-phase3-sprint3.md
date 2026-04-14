# Emergency Prep Kit Builder — Phase 3 Sprint 3A UI/UX Specification (Addendum)

**Document version:** 1.0 | **Date:** 2026-04-14 | **Author:** Sally, UX Expert
**Status:** Complete — Sprint 3A scope (Fill Your Kit screen, product cards, affiliate CTAs, Add All to Cart)
**Extends:** `docs/front-end-spec-phase3-sprint2.md` (Sprint 2 spec, v1.0)

---

## Scope

This document covers **Phase 3 Sprint 3A only** — the "Fill Your Kit" screen at `/fill`, which presents Amazon product recommendations organized by subkit category with affiliate links. It extends the Sprint 2 spec and inherits all branding, typography, color, spacing, and accessibility standards defined in the base spec (`docs/front-end-spec.md`), Sprint 1 spec, and Sprint 2 spec.

**New screens:**
- Fill Your Kit (`/fill`) — MCQ-ordered product recommendations per subkit with affiliate links

**New components:**
- `FillYourKitScreen` — Main screen shell at `/fill`
- `CategorySection` — Collapsible category container with product grid
- `ProductCard` — Individual product card with affiliate CTA

**Modified screens:**
- OrderConfirmationScreen (`/confirmation`) — "Now Let's Fill Your Kit" CTA rewired from `FillKitStubModal` to `navigate('/fill')`

**Deleted components:**
- `FillKitStubModal` — Replaced by real `/fill` route

**Unchanged:** MCQ screens, Fork screen, Cover page, SubkitSelectionScreen, ItemConfigScreen, CustomSubkitScreen, SummaryScreen, ReviewOrderScreen.

---

## 1. Decisions Log

All decisions continue the numbering sequence from Sprint 2 (last decision was #22).

| # | Decision | Resolution |
|---|----------|------------|
| 23 | Expand/collapse implementation | **React state + ARIA (Option B)** per Winston's recommendation in Section 10 of the architecture brief. `useState` per `CategorySection`, initialized from `defaultExpanded` prop. Gives full control over transition animations and matches the app's existing approach to interactive UI (React-controlled state with explicit ARIA attributes). Native `<details>`/`<summary>` was considered but rejected due to animation limitations. |
| 24 | Default expanded count | **First 3 categories expanded, rest collapsed.** These are the MCQ priority categories — the ones most relevant to the user's emergency type. If fewer than 3 categories are displayed, all are expanded. |
| 25 | "Add All to Amazon Cart" CTA placement | **Top of page only** — positioned below the page subtitle, above the first category section. A single prominent CTA keeps the page clean and establishes the primary action before the user scrolls. No sticky footer, no bottom repeat. The individual "View on Amazon" CTAs per product card provide ongoing action throughout the scroll. |
| 26 | Product card image treatment | **Square container, 1:1 aspect ratio, object-fit contain.** Consistent sizing across all 31 products regardless of original Amazon image dimensions. 160x160px on desktop, 140x140px on tablet, 160x160px centered on mobile (1-col). White background container to handle product images with varying background colors. `object-contain` preserves the full product silhouette without cropping — critical for product recognition. |
| 27 | Price display format | **`$XX.XX` — always two decimal places.** Formatted at the component level using `toFixed(2)`. Consistent with existing `pricePlaceholder` rendering in ItemConfigScreen and SummaryScreen. |
| 28 | Category section color bar | **4px top border using `colorBase`.** Minimal, distinctive, consistent with the category color system used across SubkitCard, ItemConfigScreen, and SummaryScreen. Applied to the section header container, not the expand/collapse toggle. |
| 29 | Product grid gap | **`gap-4` (16px).** Matches the card spacing used in the existing SubkitSelectionScreen card grid. Sufficient breathing room without wasting vertical space on content-dense product sections. |
| 30 | Empty category behavior | **Not rendered.** If a category has zero products after MCQ conditional filtering (e.g., Clothing with only the Kids poncho, and no kids in household — but adult poncho + shoe covers remain, so this is unlikely), the category section is omitted entirely. No empty state, no "No products" message. Same pattern as Pets category exclusion when no pets selected. |
| 31 | Disclaimer copy positioning | **Inline below the "Add All to Amazon Cart" button.** `text-caption` size, `neutral-400`, centered. Visible without scrolling, directly associated with the CTA it qualifies. |
| 32 | Brand text treatment | **Separate line below product name.** `text-caption` size, `neutral-500`, truncated with ellipsis if longer than card width. Keeps the product name visually dominant while the brand provides recognition context. |
| 33 | "View on Amazon" CTA style | **Outlined button, not filled.** `brand-accent` (`#22C55E`) border and text, white background, `radius-md`. Avoids visual competition with the primary "Add All to Amazon Cart" CTA. On hover: fills with `brand-accent`, text turns white. |
| 34 | Page entry from Order Confirmation | **Standard forward navigation.** Same screen transition as existing flow (exit left, enter from right) per Animation #16/#17. No special entrance animation. The "Now Let's Fill Your Kit" CTA on Order Confirmation navigates via `navigate('/fill')` — replaces the `FillKitStubModal`. |

---

## 2. Information Architecture

### 2.1 Updated Site Map (Sprint 3A Addition)

One new route is added in Sprint 3A. One component is deleted.

| ID | Screen | Route | Sprint 3A Change |
|----|--------|-------|-----------------|
| S0 | Cover / Landing Page | `/` | Unchanged |
| MCQ-1 | MCQ: Emergency Type | `/build` | Unchanged |
| MCQ-2 | MCQ: Household | `/build/household` | Unchanged |
| F1 | Fork Screen | `/choose` | Unchanged |
| RO | Review & Order | `/review` | Unchanged |
| S1 | Subkit Selection | `/builder` | Unchanged |
| S2 | Item Configuration | `/configure/:subkitId` | Unchanged |
| S2-C | Custom Subkit Browser | `/configure/custom` | Unchanged |
| S3 | Summary Page | `/summary` | Unchanged |
| S4 | Order Confirmation | `/confirmation` | **CTA rewired:** "Now Let's Fill Your Kit" navigates to `/fill` instead of opening `FillKitStubModal` |
| **FK** | **Fill Your Kit** | **`/fill`** | **New — product recommendations per subkit with affiliate links** |

### 2.2 Updated Navigation

**Essentials Path (Sprint 3A — complete end-to-end):**
```
S0 (Cover) → MCQ-1 → MCQ-2 → F1 (Fork) → RO (Review & Order) → S4 (Confirmation) → FK (Fill Your Kit)
```

**Build My Own Path (Sprint 3A — complete end-to-end):**
```
S0 (Cover) → MCQ-1 → MCQ-2 → F1 (Fork) → S1 (Builder) → S2 x N → S3 (Summary) → RO (Review & Order) → S4 (Confirmation) → FK (Fill Your Kit)
```

**Key Sprint 3A routing changes:**
- OrderConfirmationScreen "Now Let's Fill Your Kit" CTA → `navigate('/fill')` (replaces `FillKitStubModal`)
- `FillKitStubModal.tsx` deleted — no longer needed
- Route guard on `/fill`: redirects to `/` if no valid kit context (see Winston's architecture brief Section 7 for dual-path guard logic)
- `/fill` added to `MOBILE_EXEMPT_ROUTES` in `AppShell.tsx` — screen is fully responsive

**Back navigation from Fill Your Kit:**
- No back link on the Fill Your Kit screen. This is a destination screen (like Order Confirmation). The user arrived here after completing their order — there is no meaningful "back" action. Browser back button returns to `/confirmation` naturally.

---

## 3. User Flows

### Flow 13: Fill Your Kit — Essentials Path

**Goal:** After placing an Essentials order, browse and shop for Amazon products organized by subkit
**Success:** User sees product cards for their Essentials bundle categories, can click through to Amazon

Key path:
1. User completes order flow → arrives at `/confirmation`
2. Click "Now Let's Fill Your Kit →" → Navigate to `/fill`
3. Fill Your Kit screen loads with categories from `ESSENTIALS_BUNDLE` (Power, Cooking, Medical, Communications)
4. Categories ordered by MCQ emergency type priority (e.g., Hurricane → Power, Medical, Communications first)
5. First 3 categories expanded, showing product cards in responsive grid
6. User clicks "View on Amazon" on a product card → Amazon product page opens in new tab with affiliate tag
7. User clicks "Add All to Amazon Cart" → Amazon cart page opens in new tab with all displayed products

**Edge cases:**
- Direct navigation to `/fill` without kit context → redirect to `/`
- Essentials path: `selectedSubkits` is empty but `kitPath === 'essentials'` → guard passes (see Winston Section 7)

### Flow 14: Fill Your Kit — Custom Path

**Goal:** After placing a Custom Kit order, browse Amazon products for selected subkits only
**Success:** User sees product cards only for subkits they selected, ordered by MCQ priority

Key path:
1. User completes custom kit order flow → arrives at `/confirmation`
2. Click "Now Let's Fill Your Kit →" → Navigate to `/fill`
3. Fill Your Kit screen loads with only the user's selected subkit categories
4. Categories ordered by MCQ emergency type priority, filtered to user's selections
5. Browsing and shopping behavior identical to Essentials path

**Edge cases:**
- Custom user selected only 2 subkits → both expanded by default (fewer than 3)
- Custom user selected Pets but MCQ household has no pets → Pets category excluded despite being in `selectedSubkits`

### Flow 15: Expand/Collapse Category Sections

**Goal:** User can expand collapsed sections and collapse expanded sections
**Success:** Smooth toggle with content revealed/hidden, keyboard accessible

Key states:
1. Page loads → first 3 categories expanded, remainder collapsed
2. Click collapsed section header → section expands with slide-down animation (200ms)
3. Click expanded section header → section collapses with slide-up animation (180ms)
4. Keyboard: `Enter` or `Space` on focused section header toggles expand/collapse
5. Expand/collapse state is local to each `CategorySection` — toggling one does not affect others

### Flow 16: Add All to Amazon Cart

**Goal:** One-click action to add all displayed products to an Amazon cart
**Success:** Amazon cart page opens in new tab with all currently displayed products

Key states:
1. CTA visible at top of page, below subtitle
2. Click CTA → `buildCartUrl()` called with ASINs of all displayed products (respecting all MCQ filters)
3. `window.open(url, '_blank', 'noopener,noreferrer')` → Amazon cart opens in new tab
4. If all products filtered out (extremely unlikely edge case) → CTA hidden

---

## 4. Wireframes — Fill Your Kit Screen Layout

### 4.1 Page Structure

```
┌─────────────────────────────────────────────────────────────┐
│  AppShell (AppHeader + main content area)                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  h1: "Fill Your Kit"                                  │  │
│  │  subtitle: "Shop for the items..."                    │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  [🛒 Add All to Amazon Cart]  (PrimaryButton)   │  │  │
│  │  │  "Prices may vary on Amazon"  (disclaimer)      │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                       │  │
│  │  ┌─ CategorySection (expanded) ────────────────────┐  │  │
│  │  │  [▐ color bar] [icon] Power (5 items)    [▼]    │  │  │
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐        │  │  │
│  │  │  │ProductCard│ │ProductCard│ │ProductCard│        │  │  │
│  │  │  │  [image]  │ │  [image]  │ │  [image]  │        │  │  │
│  │  │  │  Name     │ │  Name     │ │  Name     │        │  │  │
│  │  │  │  Brand    │ │  Brand    │ │  Brand    │        │  │  │
│  │  │  │  $XX.XX   │ │  $XX.XX   │ │  $XX.XX   │        │  │  │
│  │  │  │[View on ▸]│ │[View on ▸]│ │[View on ▸]│        │  │  │
│  │  │  └──────────┘ └──────────┘ └──────────┘        │  │  │
│  │  │  ┌──────────┐ ┌──────────┐                      │  │  │
│  │  │  │ProductCard│ │ProductCard│                      │  │  │
│  │  │  └──────────┘ └──────────┘                      │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                       │  │
│  │  ┌─ CategorySection (collapsed) ───────────────────┐  │  │
│  │  │  [▐ color bar] [icon] Comfort (2 items)  [▶]    │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Page Header

```
max-w-[960px] mx-auto px-4 md:px-8     ← matches OrderConfirmationScreen
```

| Element | Style |
|---------|-------|
| h1 | `text-[28px] font-bold text-[var(--color-neutral-900)] text-center` |
| Subtitle | `text-[16px] text-[var(--color-neutral-500)] text-center mt-2 max-w-[600px] mx-auto` |
| CTA container | `mt-6 flex flex-col items-center gap-2` |
| CTA button | `PrimaryButton` with cart icon, full width up to `max-w-[400px]` |
| Disclaimer | `text-[12px] text-[var(--color-neutral-400)] text-center` |
| Category sections | `mt-8 flex flex-col gap-4` |

**Data Flow — Rendering Pipeline:**

The `FillYourKitScreen` component reads from two Zustand stores and computes the display list:

```
1. Determine active category IDs:
   kitPath === 'essentials'
     ? ESSENTIALS_BUNDLE.map(b => b.subkit)       // ['power', 'cooking', 'medical', 'communications']
     : selectedSubkits.map(s => s.categoryId)      // user's selections

2. Get ordered categories via getOrderedCategories(emergencyTypes[0], householdComposition)

3. Filter to active categories only:
   orderedCategories.filter(id => activeCategoryIds.includes(id))

4. For each category, get visible products:
   PRODUCTS_BY_CATEGORY[categoryId]
     .filter(p => !p.mcqCondition || householdComposition.includes(p.mcqCondition.includes))

5. Skip categories with 0 products after filtering (safety net)

6. First 3 categories → defaultExpanded={true}, rest → defaultExpanded={false}

7. Compute Add All to Cart URL (once, at screen level):
   buildCartUrl(allVisibleProducts.map(p => p.asin))
```

**Category metadata** for section headers comes from `CATEGORIES` in `kitItems.ts` — the same source used by `SubkitCard` and `ItemConfigScreen`. Each category provides `colorBase`, `colorTint`, `icon`, and `name`. Visual consistency across screens is automatic.

---

## 5. Component Library — Sprint 3A Components

### 5.1 CategorySection

**Purpose:** Collapsible container for a subkit category's product grid.

**Props interface** (from Winston's architecture brief):
```typescript
interface CategorySectionProps {
  categoryId: string;           // CATEGORIES key
  products: AmazonProduct[];    // pre-filtered by parent
  defaultExpanded: boolean;     // true for first 3 categories
  householdComposition: HouseholdOption[];  // for per-product mcqCondition filtering
}
```

**Section Header Layout:**

```
┌─────────────────────────────────────────────────────────────┐
│ ▐ [Icon]  Category Name                    (N items)  [▼]  │
│ 4px       24px   text-[16px] font-semibold  badge    chevron│
│ colorBase neutral-600                      neutral-400      │
└─────────────────────────────────────────────────────────────┘
```

| Element | Style |
|---------|-------|
| Container | `rounded-lg overflow-hidden` with `border-t-4` using `colorBase` inline style |
| Background | `colorTint` as inline `backgroundColor` (e.g., `#FFF7ED` for Power) |
| Header button | `w-full flex items-center gap-3 px-4 py-3 cursor-pointer` — full-width clickable area |
| Icon | Resolved via `iconResolver.ts`, size 20, color `colorBase` |
| Category name | `text-[16px] font-semibold text-[var(--color-neutral-700)]` |
| Item count badge | `text-[13px] text-[var(--color-neutral-400)] ml-auto mr-2` — e.g., "5 items" |
| Chevron | `ChevronDown` from lucide-react, size 18, `neutral-400`, rotates 180deg when expanded |
| Product grid | Inside collapsible region, `px-4 pb-4` padding |

**Expand/Collapse behavior:**
- `useState<boolean>(defaultExpanded)` manages open state
- Header `<button>` has `aria-expanded={isExpanded}` and `aria-controls={panelId}`
- Content panel has `id={panelId}` and `role="region"` with `aria-labelledby={headerId}`
- Keyboard: `Enter` or `Space` on header toggles state

### 5.2 ProductCard

**Purpose:** Displays a single Amazon product with image, details, and affiliate link CTA.

**Props interface:**
```typescript
interface ProductCardProps {
  product: AmazonProduct;
  affiliateUrl: string;
}
```

**Card Layout:**

```
┌──────────────────────┐
│  ┌────────────────┐  │
│  │                │  │
│  │  Product Image │  │  160x160 desktop, 140x140 tablet
│  │   (1:1 ratio)  │  │  object-fit: cover, bg-white
│  │                │  │
│  └────────────────┘  │
│                      │
│  Portable Power      │  text-[14px] font-medium neutral-900
│  Station             │  line-clamp-2
│                      │
│  Jackery Explorer    │  text-[12px] neutral-500, truncate
│                      │
│  $199.00             │  text-[18px] font-semibold neutral-900
│                      │
│  [View on Amazon →]  │  outlined button, brand-accent border
│                      │
└──────────────────────┘
```

| Element | Style |
|---------|-------|
| Card container | `bg-white rounded-[var(--radius-md)] border border-[var(--color-neutral-200)] p-4 flex flex-col items-center text-center` |
| Hover state | `hover:shadow-md hover:-translate-y-0.5 transition-all duration-150` |
| Image container | `w-[160px] h-[160px] lg:w-[160px] md:w-[140px] bg-white rounded-md flex items-center justify-center overflow-hidden` |
| Image | `object-contain max-w-full max-h-full` with `loading="lazy"` and `alt={product.name}` |
| Product name | `mt-3 text-[14px] font-medium text-[var(--color-neutral-900)] line-clamp-2 min-h-[40px]` |
| Brand | `mt-1 text-[12px] text-[var(--color-neutral-500)] truncate w-full` |
| Price | `mt-2 text-[18px] font-semibold text-[var(--color-neutral-900)]` |
| CTA button | `mt-3 w-full py-2 px-4 text-[13px] font-medium rounded-[var(--radius-md)] border-2 border-[var(--color-brand-accent)] text-[var(--color-brand-accent)] bg-white hover:bg-[var(--color-brand-accent)] hover:text-white transition-colors duration-150` |
| CTA link | `<a href={affiliateUrl} target="_blank" rel="noopener noreferrer">` wrapping button styling |

**Product grid within CategorySection:**

```css
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4
```

### 5.3 "Add All to Amazon Cart" CTA

| Element | Style |
|---------|-------|
| Container | `flex flex-col items-center gap-2` |
| Button | `PrimaryButton` component with `ShoppingCart` icon (lucide-react), label "Add All to Amazon Cart" |
| Button width | `w-full max-w-[400px]` |
| Button action | `onClick` → `window.open(buildCartUrl(displayedAsins), '_blank', 'noopener,noreferrer')` |
| Disclaimer | `text-[12px] text-[var(--color-neutral-400)] text-center` — "Prices may vary on Amazon" |

---

## 6. Responsive Breakpoints

| Breakpoint | Width | Product Grid | Image Size | Layout Notes |
|------------|-------|-------------|------------|--------------|
| Desktop | >=1024px (`lg:`) | 3 columns | 160x160 | Full page width up to `max-w-[960px]` |
| Tablet | >=640px (`sm:`) | 2 columns | 140x140 | Same page padding |
| Mobile | <640px | 1 column | Full width card, image centered at 160px | Category sections full-bleed within padding |

All breakpoints use Tailwind's default values — consistent with Sprint 1/2.

Category section headers remain single-row at all breakpoints (name truncates if needed on mobile).

---

## 7. Empty/Edge States

| Scenario | Behavior |
|----------|----------|
| Category has 0 products after MCQ filtering | Category section not rendered (Decision #30) |
| Only 1-2 categories displayed | All expanded by default (fewer than 3) |
| All Pets items filtered (no pets in household) | Pets section not rendered — `getOrderedCategories` excludes it |
| Kids poncho filtered (no kids) + adult poncho + shoe covers remain | Clothing section renders with 2 products instead of 3 |
| Essentials path (4 categories) | 3 expanded, 1 collapsed (standard behavior) |
| Custom path with 3 subkits selected | All 3 expanded |
| User navigates to `/fill` with no context | Route guard redirects to `/` |
| Product image fails to load | Show neutral placeholder — `bg-[var(--color-neutral-100)]` container with `Package` icon (lucide-react) centered, `neutral-300`, size 48 |

---

## 8. Accessibility Specification

### 8.1 Expand/Collapse (CategorySection)

| Attribute | Element | Value |
|-----------|---------|-------|
| `role` | Header button | `button` (native) |
| `aria-expanded` | Header button | `true` / `false` |
| `aria-controls` | Header button | `fill-section-{categoryId}` |
| `id` | Header button | `fill-header-{categoryId}` |
| `role` | Content panel | `region` |
| `id` | Content panel | `fill-section-{categoryId}` |
| `aria-labelledby` | Content panel | `fill-header-{categoryId}` |

Keyboard: `Enter` / `Space` toggles expand/collapse. `Tab` moves between section headers and into expanded content.

### 8.2 Product Cards and Links

| Element | Accessibility |
|---------|--------------|
| Product image | `alt="{product.name}"` — descriptive alt text |
| "View on Amazon" link | `aria-label="View {product.name} by {product.brand} on Amazon"` |
| Price | Visible text `$XX.XX` — no additional ARIA needed |
| Card container | Not focusable — the CTA link inside is the interactive element |

### 8.3 Add All to Cart CTA

| Element | Accessibility |
|---------|--------------|
| Button | `aria-label="Add all displayed products to Amazon cart"` |
| Disclaimer | Associated via proximity — no `aria-describedby` needed (visible text) |

### 8.4 Page Heading

`h1` receives `ref` and `tabIndex={-1}` with `outline-none` for programmatic focus on navigation — same pattern as `OrderConfirmationScreen`.

### 8.5 Focus Management

On page load, focus moves to the `h1`. Tab order flows: h1 → Add All CTA → first category header → (if expanded) product cards within → next category header → etc.

---

## 9. Copy

| Element | Copy |
|---------|------|
| Page heading (h1) | "Fill Your Kit" |
| Page subtitle | "Shop for the items to fill your emergency subkits. Each product links directly to Amazon." |
| Add All CTA label | "Add All to Amazon Cart" |
| Add All disclaimer | "Prices may vary on Amazon" |
| View product CTA | "View on Amazon →" |
| Item count badge | "{N} items" (e.g., "5 items", "2 items") |
| Collapsed chevron | `aria-label="Expand {category name}"` |
| Expanded chevron | `aria-label="Collapse {category name}"` |

---

## 10. Animation & Transitions

| # | Element | Animation | Duration | Easing |
|---|---------|-----------|----------|--------|
| A1 | Category expand | `max-height` from 0 to scrollHeight + `opacity` 0→1 | 200ms | `ease-out` |
| A2 | Category collapse | `max-height` to 0 + `opacity` 1→0 | 180ms | `ease-in` |
| A3 | Chevron rotation | `rotate(0deg)` ↔ `rotate(180deg)` on expand/collapse | 200ms | `ease-out` |
| A4 | ProductCard hover | `translateY(-2px)` + `shadow-md` | 150ms | `ease-out` |
| A5 | "View on Amazon" hover | Border fill: `bg-transparent` → `bg-brand-accent`, text white | 150ms | `ease-out` |
| A6 | Page entry | Standard forward navigation (matches existing flow transitions) | — | — |

All animations respect `prefers-reduced-motion: reduce` — transitions set to `0ms` duration when the user preference is active. Implemented via Tailwind's `motion-reduce:` variant.

---

*Emergency Prep Kit Builder — Phase 3 Sprint 3A UI/UX Specification | Version 1.0 | 2026-04-14 | Sally, UX Expert*
