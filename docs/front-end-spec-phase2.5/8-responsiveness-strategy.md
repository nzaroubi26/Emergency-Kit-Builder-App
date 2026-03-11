# 8. Responsiveness Strategy

## Guiding Principle

**Desktop-first** per PRD NFR3. Working range: 768px–1920px. Below 768px: graceful degradation interstitial.

## Breakpoints

| Token | Min Width | Max Width | Tailwind Prefix |
|-------|-----------|-----------|------------------|
| desktop-lg | 1280px | — | `2xl:` |
| desktop | 1024px | 1279px | `lg:` |
| tablet | 768px | 1023px | `md:` |
| tablet-sm | 640px | 767px | `sm:` |
| mobile | 0px | 639px | base — interstitial only |

## Layout Adaptations

**S1 — Subkit Selection:**

| Property | Desktop | Tablet |
|----------|---------|--------|
| Card grid columns | 3 | 2 |
| Visualizer width | max-w-sm | max-w-xs |
| Card description | Full | Truncates to 1 line |
| Size toggle | Horizontal | May stack vertically |

**S2 — Item Configuration:**

| Property | Desktop | Tablet |
|----------|---------|--------|
| Content max-width | 720px centered | 100% with 32px padding |
| Item grid columns | 4 | 3 |

**S3 — Summary Page:**

| Property | Desktop | Tablet |
|----------|---------|--------|
| Content max-width | 960px centered | 100% with 32px padding |
| Visualizer max-width | 320px | 280px |
| Slot height (read-only) | 44px | 40px |

## Content Priority (always preserved at 768px+)

- Full 6-row visualizer (no rows hidden)
- All 9 subkit category cards
- All item names (no truncation on primary label)
- Configure Items CTA and minimum message
- All navigation buttons

## Graceful Degradation Below 768px

```tsx
function MobileInterstitial() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-8 text-center">
      <div className="max-w-sm">
        <Monitor className="w-12 h-12 text-brand-primary mx-auto mb-6" />
        <h1 className="text-h2 text-neutral-900 mb-3">Best on a larger screen</h1>
        <p className="text-body-lg text-neutral-500">
          The Kit Builder is designed for desktop and tablet.
          Open it on a larger device for the full experience.
        </p>
      </div>
    </div>
  );
}
```

## Key Tailwind Patterns

```tsx
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"> // Item grid
<main className="w-full max-w-[720px] mx-auto px-4 md:px-8">  // S2
<main className="w-full max-w-[960px] mx-auto px-4 md:px-8">  // S3
```

**Critical:** Do not use `overflow-hidden` on any ancestor of a sticky element. Use `items-start` not `items-stretch` on flex parents of cards with variable height.

---
