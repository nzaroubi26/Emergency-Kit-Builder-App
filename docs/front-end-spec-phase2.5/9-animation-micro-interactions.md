# 9. Animation & Micro-interactions

## Motion Principles

Animation serves three purposes only: communicate state change, provide spatial orientation, confirm system response. All animations use `transform` and `opacity` only — GPU-composited, no layout reflow.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Animation Reference

| # | Animation | Trigger | Duration | Easing | Properties |
|---|-----------|---------|----------|--------|------------|
| 1 | Visualizer slot fill | Subkit selected | 220ms | standard | `background-color`; text opacity delayed 80ms |
| 2 | Visualizer slot clear | Subkit deselected | 180ms | accelerate | Text fades first; color clears; `+` fades in at 100ms |
| 3 | Slot reorder | Slot freed mid-sequence | 200ms | standard | `transform: translateY()` |
| 4 | Card selection | Card clicked | 150ms | standard | `border-color`, `background-color`, `box-shadow` |
| 5 | SizeToggle reveal | Card selected | 180ms | decelerate | `max-height: 0` → `48px`, `opacity: 0` → `1` |
| 6 | Card deselection | Card body clicked | 130ms | accelerate | Reverse of selection |
| 7 | Cards disabled | 6th slot fills | 200ms | standard | `opacity: 1` → `0.45` (all simultaneously) |
| 8 | Slot full indicator | 6 slots used | 200ms | decelerate | `opacity` + `translateY(4px)` → `0` |
| 9 | Large slot fill | Large subkit selected | 220ms | standard | Both rows simultaneously; divider opacity → 0 |
| 10 | Item card toggle | Item included/excluded | 150ms | standard | `background-color`; left bar `scaleX(0)` → `1` |
| 11 | Qty selector activate | Item included | 120ms | decelerate | `opacity: 0.3` → `1` |
| 12 | Qty increment | + clicked | 140ms | standard | Old number exits up, new enters from below |
| 13 | Qty decrement | − clicked | 140ms | standard | Old exits down, new enters from above |
| 14 | Qty button limit shake | Disabled button clicked | 300ms | spring | `translateX` oscillates: 0 → 3px → -3px → 2px → -2px → 0 |
| 15 | Empty container select | Checkbox checked | 200ms | standard | Item list opacity → 0.35; confirmation +80ms delay |
| 16 | Screen transition forward | CTA clicked | 240ms | standard | Exit translateX(-16px) + fade; enter from +16px |
| 17 | Screen transition back | Back clicked | 240ms | standard | Direction reverses |
| 18 | Modal open | Trigger clicked | 180ms | decelerate | opacity + scale(0.97) → 1 |
| 19 | Modal close | Cancel/Escape | 140ms | accelerate | Reverse of open |
| 20 | Step completion | Step advances | 360ms | decelerate | SVG checkmark `stroke-dashoffset` draw |

## Animation Tokens

```typescript
export const motion = {
  duration: {
    instant: '0ms', fast: '130ms', default: '150ms',
    moderate: '200ms', standard: '220ms', screen: '240ms', reward: '360ms',
  },
  easing: {
    standard:   'cubic-bezier(0.4, 0, 0.2, 1)',
    decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
    accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
    spring:     'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const;
```

---
