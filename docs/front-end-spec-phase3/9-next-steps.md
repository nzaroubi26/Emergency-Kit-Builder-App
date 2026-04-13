# 9. Next Steps

## Immediate Actions

1. **Coordinate with Winston** — Confirm route naming (`/build`, `/build/household`, `/choose`, `/review`), MCQ store shape, `kitPath` field addition, and Review & Order stub approach
2. **Confirm icon availability** — Verify `Tornado`, `CloudRainWind`, `Accessibility`, `HeartHandshake`, `PawPrint`, `ShieldCheck`, `SlidersHorizontal` exist in the project's lucide-react version
3. **MobileInterstitial exemption** — Confirm with Winston that Phase 3 routes bypass the `MobileInterstitial` guard since these screens are mobile-first
4. **Hand off to James** — Stories 11.2 and 12.1 can begin implementation once Winston's architecture doc is finalized

## Design Handoff Checklist

- [x] All new user flows documented (4 flows: 6–9)
- [x] All new screens wireframed (4 screens: MCQ-1, MCQ-2, F1, RO)
- [x] New component inventory complete (8 components)
- [x] Accessibility requirements defined for all new screens
- [x] Animation specs defined (8 new animations: #21–28)
- [x] Responsive strategy defined for all new screens
- [x] Copy finalized for all headings, CTAs, and body text
- [x] MCQ tile states fully specified (unselected, selected, disabled, NOTA)
- [x] Fork card co-equality enforced by spec
- [x] Review & Order shell serves both paths
- [ ] Winston architecture alignment — **pending**
- [ ] Icon availability verified — **pending**

## Sprint 2 Forward-Looking Notes

As noted in the brief, Sprint 2 will introduce visual distinction between MCQ-elevated subkits and user-selected subkits in the visualizer. The MCQ data model (locked in Sprint 1) will drive this. Sally will spec the visual treatment in the Sprint 2 front-end spec — keeping it in mind but not designing it now.

---

*Emergency Prep Kit Builder — Phase 3 Sprint 1 UI/UX Specification | Version 1.0 | 2026-04-13 | Sally, UX Expert*
