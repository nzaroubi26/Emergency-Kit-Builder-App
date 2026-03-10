# 1. Intro Project Analysis and Context

## Analysis Source

IDE-based analysis using existing project documentation: `docs/prd-phase2.md` (v1.2), `docs/architecture.md` (v2.1), and `docs/front-end-spec.md` (v1.2).

## Current Project State

- **Primary Purpose:** A client-side React SPA guiding homeowners through building a personalized emergency preparedness kit mapped to a physical modular storage system.
- **Current Tech Stack:** Vite 6.x + React 18.x + TypeScript 5.x strict + Tailwind CSS v4 + Zustand 5.x + React Router 6.4+ + Vitest + Playwright + Vercel.
- **Architecture Style:** Single-Page Application, fully client-side, no backend, localStorage-persisted state (Phase 2).
- **Deployment:** Static SPA on Vercel with branch preview deployments.
- **Phase 2 Status:** All Phase 2 epics (6, 7, 8) delivered and complete. localStorage persistence, analytics, E2E suite, cover page, Fill my kit for me, clickable visualizer slots, hardcoded star ratings, and e-commerce checkout are all live.

## Available Documentation

- ✅ Tech Stack Documentation (`docs/architecture.md` Section 2)
- ✅ Source Tree / Architecture (`docs/architecture.md` Section 3)
- ✅ Coding Standards (`docs/architecture.md` Sections 4 and 11)
- ✅ Phase 3+ Roadmap (`docs/architecture.md` Section 12) — weight tracking listed as Phase 3 extension point; pulled forward to Phase 2.5
- ✅ Phase 2 PRD (`docs/prd-phase2.md`)
- ✅ UX Specification v1.2 (`docs/front-end-spec.md`) — Decisions Log entries 12–14 and Phase 2.5 screen specs are the primary UX authority for this PRD

## Enhancement Scope Definition

**Enhancement Type:** New Feature Addition — two new data fields, two new pure calculation functions, one new component, one visual redesign.

**Enhancement Description:** Phase 2.5 adds three tightly scoped features to the completed Phase 2 application: (1) weight tracking, surfacing estimated item weights as a live per-subkit lbs readout on the Item Configuration screen and a total kit weight readout on the Summary Page; (2) volume tracking, surfacing estimated item volumes as a live percentage-filled progress bar per subkit on the Item Configuration screen and a compact per-subkit readout on the Summary Page; and (3) a visual exterior redesign of the Housing Unit Visualizer — a cosmetic-only update adding a gray outer frame, centered handle tab, and rectangular wheel guards with zero changes to the component's props interface or the SlotState data model. All three features are purely informational and additive. No warnings, no thresholds, no new routes, no store shape changes, no new env vars.

**Impact Assessment:** Minimal Impact. Two new nullable fields on `KitItem`, two new pure functions in `slotCalculations.ts`, one new `SubkitStatsStrip` component, targeted additions to `ItemConfigScreen`, `CustomSubkitScreen`, and `SummaryScreen`, and a cosmetic wrapper change inside `HousingUnitVisualizer`. Phase 2 is the stable foundation — Phase 2.5 builds cleanly on top.

## Goals and Background Context

### Goals

- Give users a concrete sense of their kit's physical footprint before purchase by surfacing estimated weight per subkit and for the total kit
- Help users understand how efficiently they are using each storage container via a live volume-fill progress bar, supporting more intentional item selection
- Elevate the realism and product identity of the Housing Unit Visualizer by adding a physical exterior shell — frame, handle, and wheels — that mirrors the actual product's appearance
- Deliver all three features as zero-risk additive changes: no existing functionality altered, no store shape changes, no new routes

### Background Context

Phase 2 activated the commercial layer of the kit builder. Phase 2.5 enriches the configuration experience with two categories of informational metadata — weight and volume — that give users a more grounded, physical understanding of what they are building. Both features were noted as Phase 3 extension points in `docs/architecture.md` Section 12 and are now pulled forward as a focused Phase 2.5 release ahead of the larger Phase 3 Bazaarvoice and mobile work package.

The visualizer exterior redesign addresses outstanding product design feedback: the current visualizer renders as a bare grid with no outer context. Adding the frame, handle tab, and wheel guards transforms it into a recognizable representation of the actual physical storage unit, strengthening the product's visual identity without touching any functional code.

All Phase 2.5 work respects the hard constraints established in the Phase 2 architecture: additive only, no store shape changes, no new routes, no new env vars.

## Change Log

| Change | Date | Version | Description | Author |
|--------|------|---------|-------------|--------|
| Initial draft | 2026-03-09 | 1.0 | Phase 2.5 PRD created from front-end-spec.md v1.2 Decisions Log entries 12–14 and architecture.md Phase 3 extension points | John, PM |

---
