# 3. User Interface Enhancement Goals

## New Screens

| Screen | Route | Description |
|---|---|---|
| MCQ Screen 1 — Emergency Type | `/build` | Q1 multi-select tiles; "Next" CTA to Q2 |
| MCQ Screen 2 — Household | `/build/household` | Q2 multi-select tiles with NOTA mutex; "Next" CTA to fork |
| Fork Screen | `/choose` | Two co-equal path cards; Essentials → `/review`, Build My Own → `/builder` |
| Review & Order Shell | `/review` | Kit summary, delivery options, "Place Order" CTA (prototype) |

*Route names confirmed by Winston (architecture-phase3.md).*

## Modified Screens

The only modification to an existing screen is the "Build My Kit" CTA on the cover/landing page — its route target changes from the visualizer to the new MCQ screen.

## UI Design Principles

**MCQ Screens (two screens, one question each):**
- Each screen displays a single multi-select tile grid. Each tile shows icon + label. Selected state is visually clear with `brand-accent` checkmark. Disabled "Extreme Heat" tile is grayed with "Coming Soon" badge.
- "None of the Above" on Q2 is visually separated below a divider, full-width, no icon, outlined style. Behaves as a mutex with all other Q2 options.
- Per-screen "Next" CTA enabled only when ≥1 tile is selected on that screen.
- Lightweight "Step 1 of 2" / "Step 2 of 2" indicator on MCQ screens only (Sally Decision 22).

**Fork Screen:**
- Two equal-weight cards, side-by-side desktop (≥768px) / stacked mobile (<768px).
- Essentials card shows inline bundle preview (Power L, Cooking R, Medical R, Comms R with category colors) plus "Recommended for most households" trust badge. CTA routes directly to `/review`.
- Build My Own card shows feature description. CTA routes to `/builder`.
- Both cards feel like equally valid, complete choices — enforced by identical dimensions, elevation, and border treatment (Sally Decision 20).

**Review & Order Shell:**
- Kit summary card shows Essentials bundle subkits with category colors, names, sizes, and slot count.
- Delivery section with radio toggle: address form or pickup location dropdown.
- "Place Order" CTA routes to existing `/confirmation` as prototype endpoint.

## UI Consistency Requirements

- All new screens use the existing Tailwind v4 token system, color palette, and typography scale without exception.
- Dynamic category colors continue to use inline `style` prop per the existing architectural rule.
- Multi-select tiles follow the same visual pattern conventions (border, fill, transition) used elsewhere in the app.

---
