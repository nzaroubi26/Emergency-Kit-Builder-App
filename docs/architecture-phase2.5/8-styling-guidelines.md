# 8. Styling Guidelines

Unchanged from Phase 1. All Phase 2 components follow the identical Tailwind v4 + CSS custom properties pipeline, dynamic category colors via inline styles, and GPU-composited animation rules.

## StarRating Styling Notes

- Filled stars use `var(--color-brand-accent)` (#22C55E) — consistent with existing brand palette
- Empty stars use `var(--color-neutral-200)`
- Star SVG size: `w-3.5 h-3.5` — sized to sit comfortably below item name/description without crowding the toggle row
- The `aria-label` on the wrapper `div` conveys the full rating to screen readers; the star SVGs are `aria-hidden`

## Cover Page Styling

`CoverScreen` uses brand tokens only. It is a simple static full-viewport screen built mobile-ready from day one — no breakpoint changes are required in Phase 2 for any other screen.

- Background: `var(--color-brand-primary)` `#1F4D35` — full viewport (not neutral-50; the cover page is a branded full-bleed screen)
- Headline: white (`#FFFFFF`), `font-bold`, large type scale (`text-display` 36px)
- Value proposition: white at `opacity-90`, `text-body-lg` (16px)
- CTA button: **inverted variant** — white background with `--color-brand-primary` text. The standard `PrimaryButton` (dark green fill, white text) would be near-invisible against the dark green background. Use `className="bg-white text-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary-light)]"` on the `PrimaryButton` or pass an `inverted` prop if one is added. Min height 44px per NFR3.
- Accent elements: `var(--color-brand-accent)` sparingly (e.g. thin horizontal rule or headline underline)

## Mobile Responsiveness — Breakpoint Strategy

**Phase 2 retains the Phase 1 desktop-first strategy.** Full mobile responsiveness is deferred to Phase 3 alongside Bazaarvoice. `MobileInterstitial.tsx` and `useResponsive.ts` remain in place and are unchanged.

| Breakpoint | Min Width | Max Width | Usage |
|-----------|-----------|-----------|-------|
| desktop-lg | 1280px | — | `2xl:` |
| desktop | 1024px | 1279px | `lg:` |
| tablet | 768px | 1023px | `md:` |
| tablet-sm | 640px | 767px | `sm:` |
| mobile | 0px | 639px | MobileInterstitial — graceful degradation only |

**Phase 2 breakpoint behaviour:** No new breakpoint values or mobile layout classes are introduced in Phase 2. Users below 768px continue to see the `MobileInterstitial` screen. All Phase 2 layout work targets the 768px–1920px working range. The `CoverScreen` is an exception — it is built mobile-ready from day one as it is a simple static full-viewport screen with no complex layout, but no other screens receive mobile layout changes in Phase 2.

**Phase 3 mobile work (deferred):** `MobileInterstitial` removal, mobile layout variants for all five screens, WCAG 2.1 AA touch target enforcement (44×44px), and single-column grid on mobile. See Phase 3+ Roadmap.

## SummaryScreen Checkout States

Two new visual states added to `SummaryScreen` — both use existing design tokens:

```tsx
{/* Loading state — CTA disabled during API call */}
<PrimaryButton
  disabled
  aria-disabled="true"
  className="opacity-70 cursor-not-allowed"
>
  Processing...
</PrimaryButton>

{/* Error state — dismissible, below CTA */}
{checkoutError && (
  <div
    role="alert"
    className="mt-3 flex items-start gap-2 rounded-[var(--radius-md)] bg-red-50 border border-red-200 p-3 text-sm text-[var(--color-status-error)]"
  >
    <span className="flex-1">{checkoutError}</span>
    <button
      onClick={() => setCheckoutError(null)}
      aria-label="Dismiss error"
      className="shrink-0 text-[var(--color-neutral-400)] hover:text-[var(--color-neutral-700)]"
    >
      <X size={16} />
    </button>
  </div>
)}
```

Kit state is never cleared on checkout failure — `checkoutError` lives in local component state only.

---
