# Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-03-02 | 1.0 | Initial architecture document | Winston, Architect |
| 2026-03-02 | 1.1 | Vercel selected; rollback strategy added; analytics Phase 2 deferral noted | Sarah, PO |
| 2026-03-04 | 1.2 | itemImages.ts added to project structure; product photography confirmed no Phase 2 work needed | Sarah, PO |
| 2026-03-04 | 1.3 | Cover page and Fill my kit for me added as Phase 2; Bazaarvoice moved to Phase 3 | Sarah, PO |
| 2026-03-04 | 2.0 | Phase 2 brownfield enhancement: localStorage persist, GA4 analytics, Playwright E2E + GitHub Actions CI, Fill my kit for me (derived state), clickable visualizer slots, hardcoded star ratings (KitItem.rating + KitItem.reviewCount), e-commerce checkoutService.ts, cover page + route restructure (/ to CoverScreen, /builder to SubkitSelectionScreen). Section 12 converted to Phase 3+ Roadmap. MobileInterstitial retained — mobile responsiveness deferred to Phase 3. | Winston, Architect |
| 2026-03-04 | 2.1 | Mobile responsiveness (Story 7.3) formally deferred to Phase 3; Section 8 breakpoint strategy reverted to Phase 1 desktop-first; MobileInterstitial and useResponsive.ts marked Unchanged; Phase 3+ Roadmap updated. | Sarah, PO |
| 2026-03-09 | 2.2 | Phase 2.5: KitItem extended with weightGrams + volumeIn3; two new pure functions in slotCalculations.ts; new SubkitStatsStrip component; ItemConfigScreen, CustomSubkitScreen, SummaryScreen updated with weight/volume readouts; HousingUnitVisualizer exterior shell added. Zero store changes, zero new routes, zero new env vars. | Winston, Architect |

---
