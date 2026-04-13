# 7. Animation & Micro-interactions

All animations use existing motion tokens from the base spec. `prefers-reduced-motion: reduce` is respected — all durations collapse to 0.01ms.

## New Animations

| # | Animation | Trigger | Duration | Easing | Properties |
|---|-----------|---------|----------|--------|------------|
| 21 | MCQ tile select | Tile clicked | 150ms | standard | `border-color`, `background-color`; checkmark scales in from 0 → 1 (80ms delay, spring easing) |
| 22 | MCQ tile deselect | Tile clicked | 130ms | accelerate | Reverse of select; checkmark scales out |
| 23 | NOTA mutex clear | NOTA selected or deselected | 150ms | standard | All affected tiles transition simultaneously |
| 24 | CTA enable | Validation met | 200ms | decelerate | `background-color` transitions from `neutral-300` to `brand-primary`; `opacity: 0.6` → `1` |
| 25 | Fork card hover | Mouse enter | 150ms | standard | `box-shadow` transitions from `shadow-1` to `shadow-2` |
| 26 | Fork card press | Mouse down | 80ms | accelerate | `transform: scale(0.99)` — subtle press feedback |
| 27 | Screen transition (MCQ) | Next/Back clicked | 240ms | standard | Same as existing Animation #16/#17 — exit translateX + fade, enter from opposite side |
| 28 | Delivery option reveal | Radio selected | 180ms | decelerate | `max-height: 0` → measured; `opacity: 0` → `1` (same pattern as SizeToggle #5) |

---
