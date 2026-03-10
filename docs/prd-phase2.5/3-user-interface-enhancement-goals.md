# 3. User Interface Enhancement Goals

## Integration with Existing UI

All Phase 2.5 additions use the existing design token system, Tailwind v4 utility class patterns, and the category color system. `SubkitStatsStrip` uses `neutral-100` background, `neutral-500` text, and the subkit's category base color for the volume bar — all already defined tokens. The visualizer exterior uses `neutral-500` and `neutral-600` — both already in the token set. No new design system primitives are required. Dynamic category colors continue to use inline `style` prop per the existing architectural rule.

## Modified / New Screens and Views

| Screen | Change Type | Description |
|--------|------------|-------------|
| Item Configuration (`/configure/:subkitId`) | Modified | Add `SubkitStatsStrip` between subkit heading and item grid |
| Custom Subkit Screen (`/configure/custom`) | Modified | Add `SubkitStatsStrip` between subkit heading and item grid |
| Summary Page (`/summary`) | Modified | Add kit-level stats row above subkit list; add per-subkit inline weight/volume to each `SubkitSummarySection` heading |
| Housing Unit Visualizer (component, all screens) | Modified | Add outer frame, handle tab, and wheel guards — cosmetic shell only |

## UI Consistency Requirements

- `SubkitStatsStrip` strip container uses `neutral-100` background and `radius-md` (10px) — consistent with secondary background patterns throughout the app.
- Weight label and volume label use `text-caption` (12px / 400) in `neutral-500` — matching existing `text-caption` usage for slot counters and sub-labels.
- Volume bar fill uses the subkit's category base color — consistent with how category colors are applied to progress bars, card borders, and slot fills throughout the app.
- The kit-level stats row on the Summary Page uses the same `neutral-100` background pill pattern as `SubkitStatsStrip`.
- Per-subkit inline stats sit in the heading row using `ml-auto` — consistent with existing right-side badge treatment in `SubkitSummarySection`.
- The visualizer outer frame (`neutral-500`) and wheel guards (`neutral-600`) use grays already in the design token system. No new color values introduced.

---
