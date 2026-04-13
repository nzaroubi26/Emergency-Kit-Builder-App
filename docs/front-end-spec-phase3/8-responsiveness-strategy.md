# 8. Responsiveness Strategy

## MCQ Screens (MCQ-1, MCQ-2)

| Property | Desktop (≥1024px) | Tablet (768–1023px) | Mobile (< 768px) |
|----------|-------------------|---------------------|-------------------|
| Content max-width | 640px centered | 640px centered | 100% with `px-6` |
| Tile grid columns | 2 | 2 | 2 (tiles scale down) |
| Tile min-height | 72px | 72px | 64px |
| Extreme Heat tile | Spans 2 cols | Spans 2 cols | Spans 2 cols |
| NOTA tile | Full-width | Full-width | Full-width |

**Mobile note:** Phase 3 screens are designed mobile-first. Unlike the existing builder flow (which shows `MobileInterstitial` below 768px), the MCQ, Fork, and Review & Order screens work at all viewport widths. The `MobileInterstitial` guard should NOT apply to Phase 3 routes.

## Fork Screen (F1)

| Property | Desktop (≥768px) | Mobile (< 768px) |
|----------|-------------------|-------------------|
| Content max-width | 800px centered | 100% with `px-6` |
| Card layout | Side-by-side (`flex-row gap-6`) | Stacked (`flex-col gap-4`) |
| Card width | `flex-1` (50% each) | Full-width |
| Card min-height | None — align via `items-stretch` | None |

## Review & Order (RO)

| Property | Desktop (≥1024px) | Tablet (768–1023px) | Mobile (< 768px) |
|----------|-------------------|---------------------|-------------------|
| Content max-width | 720px centered | 720px centered | 100% with `px-6` |
| Address fields | City/State/ZIP in 3-col row | 3-col row | City full-width; State/ZIP 2-col row |

---
