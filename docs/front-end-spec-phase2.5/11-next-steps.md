# 11. Next Steps

## Immediate Actions

1. **Share Figma design files** — Link updated light-theme frames for each screen to finalize Section 4
2. **Share physical product drawing** — Interior slot arrangement; required for visualizer outer container styling
3. **Verify category colors in browser** — Power (`#C2410C`) and Lighting (`#A16207`) with white text; darken if below 4.5:1
4. **Rectify `kitItems.ts`** — Add 4 missing items, add Clothing category, remove Repairs/Tools and Starlink
5. **Hand off to Winston** — Use Architect Prompt below

## Design Handoff Checklist

- [x] All user flows documented (5 flows)
- [x] Component inventory complete (13 components)
- [x] Accessibility requirements defined (WCAG 2.1 AA)
- [x] Responsive strategy defined (desktop-first, 768px+ working range)
- [x] Brand guidelines defined (light theme, Inter, 9-category color system)
- [x] Performance goals established
- [x] Animation tokens defined (20 animations)
- [x] Developer implementation corrections documented
- [ ] Figma design files linked — **awaiting asset share**
- [ ] Physical product drawing incorporated — **awaiting asset share**
- [ ] Category color contrast verified in browser
- [ ] Print layout tested in browser

## Architect Prompt

Winston — the UI/UX Specification for the Emergency Prep Kit Builder is complete. Please create a Frontend Architecture document using `front-end-architecture-tmpl`.

**Key technical inputs:**

- **Stack:** React SPA, TypeScript, Tailwind v4 — no backend. No localStorage in MVP — state is session-based only; loss on page refresh is acceptable.
- **HousingUnitVisualizer:** Self-contained, fully props-driven, stateless internally. All slot state passed in as `slots: SlotState[]`. `onSlotClick` wired but dormant in MVP. Filling is top-to-bottom (index 0 = top). Regular = 1 row, Large = 2 rows. 6-row constraint enforced in state layer. Slot height: 40px (interactive), 44px (read-only).
- **State management:** React Context API or Zustand. Covers: selected subkits + sizes, slot state, item selections, empty container flags, quantities. Session-based only (Phase 2: localStorage).
- **Design tokens:** `design-tokens.ts` TypeScript constants file, consumed by Tailwind v4 CSS variables.
- **`kitItems.ts` corrections:** Add 4 items + Clothing category; remove Repairs/Tools and Starlink.
- **Animation:** `transform` and `opacity` only. Slot updates < 100ms. `prefers-reduced-motion` respected.
- **Responsiveness:** Desktop-first. Visualizer stacked above cards (max-w-sm centered) — NOT a sidebar. Single column on S2 and S3. Interstitial below 768px.
- **Item display:** Grid of image cards. `ImageWithFallback` fallback = category tint bg + centered category icon (Phase 2: product photography).
- **Empty Container:** Available on both standard subkit screens and the Custom subkit browser. Behavior is identical across both: selecting dims item grid, deselects all items, shows inline confirmation in category color. Reflected on Summary Page.
- **Print:** `@media print` on Summary Page only. No separate route.
- **Phase 2:** `onSlotClick`, localStorage, weight tracking, e-commerce, product photography, mobile.

---

*Emergency Prep Kit Builder — UI/UX Specification | Version 1.2 | 2026-03-09 | Sally, UX Expert*
