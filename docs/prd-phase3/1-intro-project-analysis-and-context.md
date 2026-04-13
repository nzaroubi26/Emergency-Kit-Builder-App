# 1. Intro Project Analysis and Context

## Analysis Source

IDE-based analysis using existing project documentation: `docs/prd-phase2.5.md` (v1.0), `docs/architecture-phase2.5.md`, `docs/front-end-spec-phase2.5.md`, and `src/data/kitItems.ts` for current subkit catalog.

## Current Project State

- **Primary Purpose:** A client-side React SPA guiding homeowners through building a personalized emergency preparedness kit mapped to a physical modular storage system.
- **Current Tech Stack:** Vite 6.x + React 18.x + TypeScript 5.x strict + Tailwind CSS v4 + Zustand 5.x + React Router 6.4+ + Vitest + Playwright + Vercel.
- **Architecture Style:** Single-Page Application, fully client-side, no backend, localStorage-persisted state.
- **Deployment:** Static SPA on Vercel with branch preview deployments.
- **Phase 2.5 Status:** Complete. Weight/volume tracking and visualizer exterior redesign all delivered.

## Current Subkit Catalog (10 subkits)

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

*Note: Lighting, Clothing, Comfort, and Custom are deferred candidates for consolidation or retirement. Not Sprint 1 scope. Pets subkit is planned but deferred from Sprint 1 per architecture exclusions — the MCQ data model captures `'pets'` in `householdComposition` to support Sprint 2 surfacing.*

## Sprint 1 Scope

Sprint 1 delivers the decision-making front-end of the new flow:

1. **MCQ Step** — two separate screens (`/build` for emergency type, `/build/household` for household composition) capturing context before kit-building begins
2. **Fork Screen** — two co-equal options: "Get The Essentials Kit" (with inline bundle preview on card) and "Build My Own Kit"
3. **Review & Order Shell** — Essentials CTA on fork card routes directly to `/review` shell screen, built in Sprint 1
4. **MCQ Data Model** — new Zustand store with sessionStorage persistence, including `kitPath` field for fork selection, ready for downstream Sprint 2 and Sprint 3 use

**Out of scope for Sprint 1:**
- Visualizer UI refresh (Sprint 2)
- Build My Own path wiring to `/review` (Sprint 2 — only Essentials path reaches `/review` in Sprint 1)
- Order Confirmation + "Fill Your Kit" CTA (Sprint 2)
- MCQ → subkit surfacing logic in visualizer (Sprint 2)
- Pets subkit catalog addition (deferred — store shape supports `'pets'` in `householdComposition`, but no `CATEGORIES`/`ITEMS` data added in Sprint 1)
- `extreme-heat` emergency type activation (Coming Soon tile only — excluded from type union per YAGNI)
- Amazon product recommendations (Sprint 3)

## Goals and Background Context

### Goals

- Insert two focused questions before kit-building begins so the app understands the user's emergency context and household composition before making any recommendations
- Give users a genuine fork: a trusted expert-curated Essentials bundle for users who want a fast, confident path, or a custom-build path for users who want control
- Lock the MCQ data model in Sprint 1 so Sprint 2's visualizer surfacing logic and Sprint 3's Amazon recommendations can both consume it without rework
- Capture `'pets'` in the MCQ data model so Sprint 2 can introduce the Pets subkit catalog entry and surfacing logic without store rework

### Background Context

The current flow drops users directly into subkit selection with no context about their situation. The Phase 3 redesign front-loads two light-touch questions and then forks based on user preference — not based on their answers. MCQ answers inform what the app suggests, but the fork itself is always a user-driven choice.

The Essentials path is positioned as the "trust us" path: expert-curated, speed-optimized, and reassuring. The Build My Own path is the "agency" path for users who want to understand and customize every element. Both are equally valid and must be designed as co-equal options.

This is a prototype — where there is a gap between prototype and production, we default to prototype scope. No real fulfillment backend, no payment processing, and no live Amazon integration are required for Sprint 1.

## Change Log

| Change | Date | Version | Description | Author |
|---|---|---|---|---|
| Initial draft | 2026-04-11 | 1.0 | Phase 3 Sprint 1 PRD — MCQ step, fork screen, Essentials path, MCQ data model | John, PM |
| Reconciliation | 2026-04-13 | 1.1 | Reconciled with locked arch + FE spec decisions: (1) Q2 field → `householdComposition`/`HouseholdOption`, (2) `extreme-heat` removed from type union (YAGNI), (3) Essentials display screen eliminated — bundle preview on fork card → `/review`, (4) Review & Order shell in Sprint 1, (5) MCQ split to two screens `/build` + `/build/household`, (6) Added `kitPath` field and route guards, (7) sessionStorage replaces localStorage for MCQ, (8) Pets subkit deferred per architecture exclusions | John, PM |

---
