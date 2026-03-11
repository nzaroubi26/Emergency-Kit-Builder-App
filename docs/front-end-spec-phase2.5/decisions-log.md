# Decisions Log

| # | Decision | Resolution |
|---|----------|------------|
| 1 | Regular/Large size toggle | Keep per PRD — user chooses size, visualizer reflects it |
| 2 | Slot filling direction | Top-to-bottom |
| 3 | Theme | Light theme — full authority granted to UX Expert |
| 4 | Weight tracking | Phase 2 — removed from MVP spec |
| 5 | Category list | Strict PRD — 8 standard + Custom; no Repairs/Tools |
| 6 | Custom subkit | PRD approach — cross-category browser from predefined items |
| 7 | Minimum subkits | 3-subkit minimum enforced per PRD |
| 8 | Master Kit Selection step | Set aside — not in MVP scope |
| 9 | Visualizer placement | Stacked above cards (centered, max-w-sm) |
| 10 | Item display | Grid of image cards with designed placeholder in MVP |
| 11 | Cover page layout | Text-forward, no hero image — headline + value proposition paragraph + single CTA. Brand-primary background with white text. Mobile-ready from day one. |
| 12 | Weight display (Phase 2.5) | Informational only — `~X.X lbs` per subkit on SubkitStatsStrip on ItemConfig; total `~X.X lbs total` on Summary. No warnings, no thresholds, no color changes at any weight level. |
| 13 | Volume display (Phase 2.5) | Live `% filled` progress bar per subkit on SubkitStatsStrip; compact inline `XX% filled` badge per subkit on Summary. Container capacities: Regular = 1,728 in³, Large = 3,456 in³ (from Phase 1 PRD Story 1.2). No overflow warnings — purely informational. Bar fill clamped to 100% width for display; label shows true computed integer value. |
| 14 | Visualizer exterior redesign (Phase 2.5) | Visual shell only — `neutral-400` outer frame (`rounded-xl`, `p-3`/`pb-2`) wrapping slot grid; hollow `border-neutral-400` handle tab (80×24px) as sibling div above frame with negative margin overlap; `neutral-600` wheel guards (24×48px, `rounded-sm`) absolutely positioned outside frame via negative offsets. Zero changes to `HousingUnitVisualizer` props interface or `SlotState` data model. |
| 15 | Get My Kit CTA outcome (Phase 2.6) | Phase 2.6 override: "Get My Kit" on `SummaryScreen` calls `navigate('/confirmation')` — not `initiateCheckout()`. Flow 5 in Section 3 is superseded by Epic 11 Story 11.4. `checkoutService.ts` is retained entirely intact for Phase 3 re-activation. `Analytics.ctaClicked()` continues to fire before navigation. |

---
