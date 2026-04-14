# 1. Intro Project Analysis and Context

## Analysis Source

Sprint 1 PRD (`docs/prd-phase3.md` v1.1), Sprint 1 architecture (`docs/architecture-phase3.md`), Sprint 1 front-end spec (`docs/front-end-spec-phase3.md`), existing codebase (`src/data/kitItems.ts`, `src/store/kitStore.ts`, `src/components/visualizer/`, `src/components/summary/`, `src/components/confirmation/`), and locked MCQ surfacing rules from architecture Section 11.

## Current Project State

- **Sprint 1 Status:** Complete. MCQ two-screen flow, fork screen, Essentials → Review & Order shell, MCQ Zustand store with sessionStorage persistence — all delivered.
- **Sprint 1 Deliverables:** 4 new routes (`/build`, `/build/household`, `/choose`, `/review`), `mcqStore.ts`, `essentialsConfig.ts`, MCQEmergencyTypeScreen, MCQHouseholdScreen, ForkScreen, ReviewOrderScreen, KitSummaryCard (Essentials path only), route guards, MobileInterstitial bypass.
- **What Sprint 1 Designed For But Did Not Build:** MCQ → subkit surfacing, Build My Own → `/review` wiring, `KitSummaryCard` custom path, Pets subkit, visualizer refresh, Order Confirmation update.

## Sprint 2 Scope

Sprint 2 completes the Build My Own path end-to-end and connects both paths to a unified order flow:

1. **Pets Subkit** — new category + items added to `kitItems.ts`, selectable in the visualizer
2. **Visualizer UI Refresh** — layout change from top-to-bottom to left-to-right display, color updates (Build My Own path only)
3. **MCQ → Subkit Surfacing Logic** — MCQ answers visually prioritize relevant subkits at the top of the visualizer list (elevated, not pre-selected)
4. **MCQ Visual Distinction** — visual differentiation between MCQ-suggested subkits and user-actively-selected subkits in the visualizer
5. **Build My Own → `/review` Wiring** — custom path `KitSummaryCard` implementation, connecting Build My Own flow to the Review & Order page
6. **Order Confirmation + "Now Let's Fill Your Kit" CTA** — updated confirmation screen with entry point to Part 2

**Out of scope for Sprint 2:**
- Amazon product recommendations (Sprint 3)
- `extreme-heat` emergency type activation (still Coming Soon)
- Any fulfillment, payment, or logistics backend
- Mobile responsiveness for existing visualizer screens (existing `MobileInterstitial` still applies to `/builder`, `/configure/*`, `/summary`)

## Subkit Catalog After Sprint 2 (10 subkits)

| Subkit | Status | Sizes |
|---|---|---|
| Power | Existing | Regular, Large |
| Lighting | Existing | Regular, Large |
| Communications | Existing | Regular, Large |
| Hygiene | Existing | Regular, Large |
| Cooking | Existing | Regular, Large |
| Medical | Existing | Regular, Large |
| Comfort | Existing | Regular, Large |
| Clothing | Existing | Regular, Large |
| Custom | Existing | Regular, Large |
| **Pets** | **New — Sprint 2** | **Regular, Large** |

## Goals

- Complete the Build My Own path so both forks reach Review & Order — users who chose "Build My Own Kit" at the fork now flow through the visualizer, configure items, and arrive at `/review` with their custom kit summarized
- Make the visualizer smarter by surfacing MCQ-relevant subkits at the top of the list with clear visual distinction from user selections — the app now feels like it understands the user's situation
- Refresh the visualizer layout from vertical to horizontal, modernizing the Build My Own experience
- Add the Pets subkit to the catalog so households with pets see a relevant option surfaced by MCQ when they selected "Pets" in Q2
- Deliver a unified Order Confirmation that serves both Essentials and Custom paths and provides a "Now Let's Fill Your Kit" CTA as the entry point to Part 2 of the product experience

## Pre-Sprint 2 Dependencies

| Dependency | Owner | Status |
|---|---|---|
| MCQ store shape (`emergencyTypes`, `householdComposition`, `kitPath`) | Winston (Sprint 1) | Delivered ✅ |
| `KitSummaryCard` scaffold with `path` prop branching | Winston (Sprint 1) | Delivered ✅ |
| `reviewGuard` accepting `kitPath === 'custom'` | Winston (Sprint 1) | Designed ✅ (truthy check) |
| Surfacing rules (Q1 + Q2 elevation tables) | John + Winston (Sprint 1 arch Section 11) | Locked ✅ |
| Subkit taxonomy | Team | Locked ✅ |
| Pets item catalog content (names, weights, volumes) | John | Locked ✅ (see Story 15.1) |

## Change Log

| Change | Date | Version | Description | Author |
|---|---|---|---|---|
| Initial draft | 2026-04-13 | 1.0 | Phase 3 Sprint 2 PRD — Pets subkit, visualizer refresh, MCQ surfacing, Build My Own → /review, Order Confirmation | John, PM |
| Sally review flags | 2026-04-13 | 1.1 | (1) Renumbered Epics 13/14 → 15/16 to avoid story file collision with Sprint 1, (2) "Start Over" routes to `/` (cover) for both paths, (3) BackLink on `/review` is path-aware (explicit AC), (4) Sprint 1 deferred story 14.4 superseded by Story 15.1 | John, PM |
