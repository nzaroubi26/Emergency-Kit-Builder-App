# 1. Decisions Log

| # | Decision | Resolution |
|---|----------|------------|
| 16 | MCQ layout: one screen or two? | **Two separate screens** — one question per screen. Mobile-first: avoids scroll-heavy cognitive overload. Conversational flow reduces mental load. Step indicator ("Step 1 of 2") communicates brevity. |
| 17 | MCQ validation treatment | **Disabled button** — "Next" CTA stays disabled until ≥1 option selected. No validation toast or error nudge. With only 4–5 visible options, a disabled button is instantly understandable. |
| 18 | "None of the Above" visual treatment | **Visually separated** — placed below a subtle `neutral-200` divider, full-width, no icon, outlined style. It's a different kind of answer, not a lesser one. |
| 19 | Essentials Display Screen | **Eliminated** — bundle preview lives directly on the fork card. Selecting "Get The Essentials Kit" routes straight to Review & Order. One less screen, faster path to confidence. |
| 20 | Fork card co-equality | **Enforced by spec** — identical dimensions, padding, border radius, elevation, CTA size. Essentials adds trust badge + bundle preview; Build My Own adds feature description. Neither visually dominates. |
| 21 | Review & Order scope | **Shell only** — prototype surface. No real fulfillment, no payment processing. Spec covers both Essentials and Custom Kit variants for layout completeness, but **Sprint 1 implementation is Essentials-only**. The Build My Own path does not reach `/review` in Sprint 1 — Custom Kit variant is Sprint 2 wiring. Winston: design the `kitPath` field and `KitSummaryCard` interface to accept both variants, but only the Essentials code path needs to function in Sprint 1. |
| 22 | Step indicator scope | **MCQ only** — "Step 1 of 2" / "Step 2 of 2" on MCQ screens. Does not span the fork or Review & Order. The main `StepProgressIndicator` does not appear on any Phase 3 Sprint 1 screen. |
| 23 | Copy tone | **Warm authority** for Essentials ("We've done the research..."), **empowering confidence** for Build My Own ("You know your household best..."). Confirmed by stakeholder. |
| 24 | "Build My Own" Sprint 1 destination | Routes to existing `/builder` (SubkitSelectionScreen). No placeholder or coming-soon state — the existing flow is fully functional. |
| 25 | Back navigation pattern | **Consistent top-left back link** — `← Back` text link on all new screens. Not in the AppHeader; positioned at the top of the content area. |

---
