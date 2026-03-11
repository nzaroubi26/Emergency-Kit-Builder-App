# Emergency Prep Kit Builder — UI/UX Specification

**Document version:** 1.2 | **Date:** 2026-03-09 | **Author:** Sally, UX Expert
**Status:** Complete — awaiting Figma asset links and physical product drawing

---

## Table of Contents

1. UX Goals & Principles
2. Information Architecture
3. User Flows
4. Wireframes & Mockups
5. Component Library / Design System
6. Branding & Style Guide
7. Accessibility Requirements
8. Responsiveness Strategy
9. Animation & Micro-interactions
10. Performance Considerations
11. Next Steps

---

## Decisions Log

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

## Developer Implementation Notes

| File | Issue | Change Required |
|------|-------|------------------|
| `SubkitTypeSelectionNew.tsx` | Fills bottom-up | Change to top-to-bottom |
| `SubkitTypeSelectionNew.tsx` | Minimum check `> 0` | Change to `>= 3` with message |
| `SubkitTypeSelectionNew.tsx` | Blue/purple only colors | Replace with 9-category color system |
| `SubkitTypeSelectionNew.tsx` | No Regular/Large toggle | Add SizeToggle per PRD FR4 |
| `SubkitTypeSelectionNew.tsx` | Max = 6 count-based | Replace with slot-based constraint (Regular=1, Large=2, max 6 slots) |
| `SubkitTypeSelectionNew.tsx` | Disabled state behavioral only | Add `opacity-45 cursor-not-allowed` |
| `SummaryPage.tsx` | No visualizer | Add HousingUnitVisualizer (readOnly={true}) |
| `SummaryPage.tsx` | No purchase CTA | Add "Get My Kit" above visualizer |
| `SummaryPage.tsx` | .txt export | Replace with window.print() + @media print |
| `SummaryPage.tsx` | Weight/volume shown | Remove — Phase 2 |
| `ItemQuestionnaireFlow.tsx` | Dual volume bars shown | Remove — Phase 2 |
| `ItemQuestionnaireFlow.tsx` | No Empty Container option | Add EmptyContainerOption per PRD FR9 |
| `ItemQuestionnaireFlow.tsx` | No quantity maximum | Cap at 10 per PRD Story 4.2 AC4 |
| `ItemQuestionnaireFlow.tsx` | Custom = free-form input | Replace with cross-category browser per PRD FR13 |
| `kitItems.ts` | Missing items | Add: Feminine Hygiene Products, Ice Packs, Ponchos, Shoe Covers |
| `kitItems.ts` | No Clothing category | Add with Ponchos and Shoe Covers |
| `kitItems.ts` | Repairs/Tools present | Remove entirely |
| `kitItems.ts` | Starlink present | Remove — not in PRD scope |
| All files | Dark theme | Replace with light theme per Section 6 |
| `ImageWithFallback` | No designed fallback | Fallback = category tint bg + centered category icon |

---

## 1. UX Goals & Principles

### 1.1 Target User Personas

**Persona 1: The Overwhelmed Homeowner** *(Primary)*
- Homeowner in hurricane-prone region; paralyzed by complexity
- Time-constrained; motivated by family safety
- Key JTBD: *"Help me feel like I've done something real without spending a whole weekend on it."*

**Persona 2: The Informed Optimizer** *(Secondary)*
- Has scattered supplies; wants to systematize and fill gaps
- Likely to use the empty container option
- Key JTBD: *"Let me build on what I already have rather than starting from scratch."*

**Persona 3: The Caring Purchaser** *(Tertiary)*
- Configuring a kit for a family member
- Trusts expert-backed defaults; wants a verifiable finished kit
- Key JTBD: *"Give me something a trusted expert would approve of."*

### 1.2 Usability Goals

1. New users understand the 3-step flow within 30 seconds — no tutorial required
2. 80% of users complete full configuration in under 10 minutes
3. Users never accidentally violate housing unit constraints — UI prevents invalid states
4. Users identify each subkit's purpose and slot cost without external docs
5. Users arrive at Summary Page feeling they've built something real, not filled out a form
6. Any selection can be reversed at any point with zero friction

### 1.3 Design Principles

1. **Guide, don't gatekeep** — Constraints are explained in friendly, motivating language
2. **Show before you tell** — The Visualizer communicates impact before copy does
3. **One decision at a time** — Subkit selection completes fully before item config begins
4. **Reversibility always** — Nothing is permanent; zero penalty for exploration
5. **Organized confidence** — The color-coded system makes users feel their preparedness is organized

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-03-02 | 1.0 | Initial full spec | Sally, UX Expert |
| 2026-03-04 | 1.1 | Phase 2 cover page addition: Screen 0 wireframe and element specs added to Section 4; site map updated (S0 added, S1 route updated to /builder); Flow 1 updated to reflect new entry point; Decisions Log entry added; Responsiveness note added for cover page mobile-readiness | Sally, UX Expert |
| 2026-03-09 | 1.2 | Phase 2.5 additions: Decisions Log entries 12–14; Screen 2 visualizer exterior redesign spec (outer frame, handle tab, wheel guards — visual shell only, zero props changes); Screen 3 SubkitStatsStrip component spec (weight + volume display on ItemConfig); Screen 5 weight/volume compact readout on Summary; SubkitStatsStrip added to Component Library | Sally, UX Expert |

---

## 2. Information Architecture

### 2.1 Site Map / Screen Inventory

Linear 3-stage flow. No branching paths. Custom subkit is a screen variant, not a separate branch.

| ID | Screen | Route | Notes |
|----|--------|-------|-------|
| S0 | Cover / Landing Page | `/` | **Phase 2 entry point**; static; no store dependency; brand-primary bg; single CTA to /builder |
| S1 | Subkit Selection | `/builder` | Kit builder entry; visualizer above cards *(route renamed from `/` in Phase 2)* |
| S2 | Item Configuration | `/configure/:subkitId` | One per selected subkit |
| S2-C | Custom Subkit Browser | `/configure/custom` | All-category item grid |
| S3 | Summary Page | `/summary` | Read-only; print-ready; CTA prominent |
| OL1 | Slot Full Indicator | Inline on S1 | Not a route |
| OL2 | Back to Selection Confirm | Modal on S2 | Triggered by secondary back link |
| OL3 | Start Over Confirm | Modal on S3 | Triggered by Start Over |
| EXT1 | Purchase Page | External URL | Phase 2: real checkout endpoint |
| PRINT | Print View | CSS @media print | Triggered from S3 |

### 2.2 Navigation Structure

**Step progression:**
```
Step 1: Build Your Kit  →  Step 2: Configure Items  →  Step 3: Review Kit
```
- Forward: CTAs — Configure Items / Next Subkit / Review My Kit
- Back: Always available; Edit Kit link from S3
- Step indicator: Informational only — not clickable in MVP

**Destructive Action Confirmations:**

| Action | Modal Message |
|--------|---------------|
| Back to Subkit Selection (from S2) | "Going back will keep all your selections. You can return at any time." |
| Start Over (from S3) | "Starting over will clear your entire kit configuration. Are you sure?" |

---

## 3. User Flows

### Flow 1: Complete End-to-End Kit Configuration

**Goal:** Build complete kit from entry to Summary Page
**Success:** ≥3 subkits selected, all item config complete, Summary Page reached

Key path:
1. Land on S0 (Cover Page) → Click "Build My Kit" → Navigate to S1 at `/builder`
2. Select subkit cards → Size toggles appear → Visualizer updates
3. ≥3 subkits → Configure Items CTA activates
4. Item Config × N subkits → toggle items, set quantities, optionally empty container
5. Final subkit → Review My Kit → Summary Page
6. Summary → Get My Kit CTA / Edit Kit / Print / Start Over

**Edge cases:**
- Refresh mid-flow → kit configuration restored from localStorage (Phase 2); no data loss
- Browser back → React Router returns to previous subkit; state intact
- Direct nav to `/summary` with no state → redirect to `/builder`
- Direct nav to `/builder` or any configure route → works correctly; bypasses cover page

---

### Flow 2: Subkit Selection & Slot Constraint Enforcement

**Goal:** Select 3–6 subkits with Regular/Large sizes without exceeding 6 slots

Key states:
- Select card → fills next slot top-to-bottom → size toggle appears inline
- Regular → Large: checks if 2 adjacent slots free; if not, amber inline message on toggle
- Large → Regular: shrinks block, frees 1 slot immediately
- 6 slots full: remaining unselected cards go to disabled state (200ms); slot full indicator appears
- Deselect: slot clears; slots below shift up; disabled cards re-enable

**Edge cases:**
- Regular → Large when 0 slots remain → inline message, no modal
- Deselecting mid-sequence → remaining subkits shift up; order preserved for item config

---

### Flow 3: Item Configuration — Standard Subkit

**Goal:** Select items, set quantities, optionally mark as empty container

Key states:
- All items excluded by default
- Toggle ON → included state; qty selector activates at 1; max 10
- Toggle OFF → excluded; qty resets to 1 internally
- `−` at qty 1 → disabled; does not toggle item off
- Empty Container → item grid dims (opacity-35, pointer-events none); confirmation inline
- Back → previous subkit or S1 (first subkit); confirmation modal on secondary back link
- Next Subkit → advance; final subkit → Review My Kit → S3

---

### Flow 4: Custom Subkit Item Browser

**Goal:** Select items from across all 8 categories for a personalized subkit

Key states:
- Items grouped by parent category with CategoryGroupHeader
- Category jump nav at top for quick orientation
- Same toggle + quantity controls as standard subkit
- Items in Custom do not conflict with items in other subkits
- Empty Container option present — identical behavior to standard subkits: selecting it deselects all Custom items, dims the item grid (opacity-35, pointer-events none), and displays an inline confirmation in the Custom category color
- The empty container state is reflected on the Summary Page under the Custom category label
- CTA: "Next Subkit" or "Review My Kit" depending on position in sequence

---

### Flow 5: Summary Page & Exit Paths

**Goal:** Review completed kit; print, edit, or proceed to purchase

Exit paths:
- **Get My Kit** → triggers `initiateCheckout()` API call; on success, redirects in the **same window** (`window.location.href`). A new tab is not used — same-window is the correct e-commerce pattern. Kit configuration is preserved in localStorage (Story 6.1) and fully restored if the user navigates back.
- **Edit My Kit** → returns to S1 with full state preserved
- **Print** → `window.print()` — no separate route; @media print CSS applied
- **Start Over** → confirmation modal → clears all state → fresh S1

---

## 4. Wireframes & Mockups

**Primary Design Files:** *(To be linked — awaiting Figma update to light theme)*
**Physical Product Drawing:** *(Still outstanding — needed for visualizer outer container styling)*

---

### Screen 0: Cover / Landing Page (S0)

**Route:** `/` — Phase 2 entry point. Static screen with no Zustand store dependency.

**Layout:** Centered, single-column. Full-viewport-height section. Brand-primary background. Mobile-ready from day one — no breakpoint changes required in Story 7.3.

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│                                                          │
│          [Brand logo / app name — white]                 │
│                                                          │
│                                                          │
│   ┌──────────────────────────────────────────────────┐  │
│   │                                                  │  │
│   │   "Be Ready Before the Storm."                  │  │
│   │                                                  │  │
│   │   Build a personalized emergency kit that        │  │
│   │   maps directly to a real, modular storage       │  │
│   │   unit — engineered for severe weather.          │  │
│   │                                                  │  │
│   │                                                  │  │
│   │         [ Build My Kit → ]                       │  │
│   │                                                  │  │
│   └──────────────────────────────────────────────────┘  │
│                                                          │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Key Element Specs:**

| Element | Treatment |
|---------|----------|
| Page background | `#1F4D35` (`brand-primary`) — full viewport |
| App name / logo | White, `text-h2`, centered, top of content block |
| Headline | White, `text-display` (36px / 700), centered, max-width 560px |
| Value proposition | White at `opacity-90`, `text-body-lg` (16px / 400), centered, max-width 480px, mt-4 |
| CTA button | White background, `brand-primary` text, `text-label`, radius-full, px-8 py-4, min-h-[44px]; hover: `brand-primary-light` bg |
| CTA label | "Build My Kit →" |
| Content block | Centered vertically and horizontally; max-width 640px; px-6 |
| Spacing — headline to body | `space-4` (16px) |
| Spacing — body to CTA | `space-8` (32px) |
| Accent detail | Optional: thin `brand-accent` (#22C55E) horizontal rule or underline on headline — use sparingly |

**Accessibility:**
- `<main>` landmark wraps content block
- Headline is `<h1>`
- CTA uses `<PrimaryButton>` component — standard keyboard focus ring applies
- No ARIA live regions needed — static screen
- Contrast: white on `#1F4D35` exceeds 12:1 — WCAG AAA

**Responsiveness:**
- Mobile (375px): headline reduces to `text-h1` (28px); body text unchanged; CTA full-width with mx-6
- Tablet (768px+): all specs above apply unchanged
- Desktop (1024px+): content block centered with generous vertical whitespace

**Transition to S1:**
- "Build My Kit" CTA navigates to `/builder` using React Router `<Link>` — not `window.location`
- Screen transition animation: forward direction (exit left, enter from right) per Section 9 Animation #16
- No confirmation modal, no state dependency, no guard

---

### Screen 1: Subkit Selection (S1)

**Layout:** Stacked, centered. Visualizer above cards. Max-w-sm centered.

```
┌──────────────────────────────────────────────────────────┐
│  HEADER: App Name  ·  Step 1 ──── Step 2 ──── Step 3    │
├──────────────────────────────────────────────────────────┤
│           "Build Your Kit"                               │
│    "Choose 3–6 categories for your kit"                  │
│                                                          │
│         ┌──────────────────┐                            │
│         │  HOUSING UNIT    │  max-w-sm centered         │
│         │ ┌──────────────┐ │  Slot 1 (top) — Empty      │
│         │ │      +       │ │                            │
│         │ ├──────────────┤ │  Slot 2 — Filled (orange)  │
│         │ │  ██ POWER ██ │ │                            │
│         │ ├──────────────┤ │  Slot 3 — Large start      │
│         │ │  ██ MEDICAL  │ │                            │
│         │ │  ████████   │ │  Slot 4 — Large end         │
│         │ ├──────────────┤ │  Slot 5 — Empty            │
│         │ │      +       │ │                            │
│         │ ├──────────────┤ │  Slot 6 — Empty            │
│         │ │      +       │ │                            │
│         │ └──────────────┘ │                            │
│         │  3 of 6 slots used                            │
│         └──────────────────┘                            │
│                                                          │
│  STANDARD CATEGORIES — 3-col desktop, 2-col tablet      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐               │
│  │⚡ Power  │ │💡Lighting│ │📡 Comms  │               │
│  │①✓[Reg|Lg]│ │          │ │          │               │
│  └──────────┘ └──────────┘ └──────────┘               │
│  ... (9 cards total; Custom card last, visually distinct)│
│                                                          │
│         [Configure Items →]  ← disabled < 3 subkits     │
│     "Select at least 3 subkits to continue"             │
└──────────────────────────────────────────────────────────┘
```

**Key Element Specs:**

| Element | Treatment |
|---------|----------|
| Page bg | `#F8F9FA` |
| Visualizer container | White card, shadow-2, radius-lg, neutral-200 border, 16px padding |
| Slot — empty | White fill, neutral-300 dashed border, neutral-400 `+` icon |
| Slot — filled Regular | Category base color fill, white name text-h3 |
| Slot — filled Large | Category base color spans both rows, no internal divider, name centered in full block |
| Slot — unit full (empty) | `#F3F4F6` fill, `#E5E7EB` dashed border, muted `+` |
| Slot counter | text-caption, neutral-500 |
| Card — unselected | White, shadow-1, 3px left border in category base color, category icon in category base color |
| Card — selected | Category tint bg, 2px full border in category base color, selection order badge (top-left), checkmark (top-right) |
| Card — disabled | opacity-45, cursor-not-allowed, pointer-events none |
| SizeToggle | Slides in below card description on selection (max-height 180ms); [Regular][Large] toggle |
| Large — disabled on toggle | Amber inline message: "Not enough space" |
| Slot full indicator | Amber `#D97706`, inline below visualizer, fade+slide-up 200ms |
| Configure Items CTA | `#1F4D35` fill, white text; disabled = neutral-300 fill |
| Custom card | Dashed neutral-300 border unselected; Indigo `#3730A3` border+tint selected; Settings2 icon |

---

### Screen 2: Housing Unit Visualizer — Component Detail

**Orientation:** 1 column × 6 rows. Top-to-bottom fill. Slot 1 = top, Slot 6 = bottom.
**Confirmed slot height:** 40px. Total height: ~300px.

| State | Background | Border | Text |
|-------|-----------|--------|------|
| Empty | `#FFFFFF` | 2px dashed `#D1D5DB` | `#9CA3AF` `+` centered |
| Filled Regular | Category base hex | None | `#FFFFFF` name centered |
| Filled Large | Category base hex (spans 2 rows) | None | `#FFFFFF` name centered in full block |
| Empty — unit full | `#F3F4F6` | 2px dashed `#E5E7EB` | `+` muted to `#D1D5DB` |
| Read-only empty | `#F8F9FA` | 1px solid `#E5E7EB` | No `+` icon |

**Large block behavior:** Both rows animate simultaneously (220ms). Internal divider fades to 0 opacity — rows read as single continuous block.

**Phase 2:** `onSlotClick` is active on `SubkitSelectionScreen` (Story 7.2). Filled slots display `cursor-pointer` and `hover:brightness-95` affordance — clicking navigates to `/configure/:subkitId` for that subkit. Empty slots remain non-interactive: no cursor change, no click handler, no navigation. `readOnly` mode on `SummaryScreen` does not pass `onSlotClick` — all slots remain non-interactive. Each slot has `data-slot-index` (0–5).

**Phase 2.5 — Exterior Redesign (Visual Shell Only):**

The `HousingUnitVisualizer` receives a new outer visual shell wrapping the existing slot grid. **Zero changes to the `HousingUnitVisualizer` props interface or `SlotState` data model.** All changes are purely cosmetic CSS/markup applied to the wrapper element around the slot grid.

```
┌──────────────────────────────┐
│        [handle tab]          │  ← centered tab, top edge
│  ┌────────────────────────┐  │
│  │  Slot 1  (empty/filled)│  │
│  ├────────────────────────┤  │
│  │  Slot 2                │  │
│  ├────────────────────────┤  │
│  │  Slot 3                │  │
│  ├────────────────────────┤  │
│  │  Slot 4                │  │
│  ├────────────────────────┤  │
│  │  Slot 5                │  │
│  ├────────────────────────┤  │
│  │  Slot 6                │  │
│  └────────────────────────┘  │
│ [wheel]              [wheel] │  ← positioned outside frame
└──────────────────────────────┘
```

| Element | Spec |
|---------|------|
| Outer frame | `neutral-400` (`#9CA3AF`) background; `rounded-xl` (12px); padding: `p-3` (12px all sides), `pb-2` (8px bottom) |
| Handle tab | Centered horizontally as a sibling div above the outer frame; 80px wide (`w-20`) × 24px tall (`h-6`); hollow border (`border-neutral-400`, `bg-transparent`) with 6px top border and side borders; `rounded-t-md` (6px) top corners, 0 bottom; visually protrudes upward via negative bottom margin overlap |
| Wheel guards | Two rectangular blocks, absolutely positioned outside the outer frame; each 24px wide (`w-6`) × 48px tall (`h-12`); `neutral-600` (`#4B5563`) fill; `rounded-sm` (3px all corners, symmetric); positioned using negative offsets (`-bottom-3 -left-6` / `-right-6`) |
| Slot grid | Unchanged — sits inside the outer frame exactly as before; the frame is a visual wrapper only |
| Read-only variant (Summary Page) | Outer frame, handle tab, and wheel guards all present — same spec; `readOnly` mode is unaffected |

**Implementation note:** Wrap the existing slot grid `div` in a new `div.visualizer-outer-shell` element. The outer shell provides the gray frame and wheel guards (two absolutely-positioned child `div`s outside the frame via negative offsets). The handle tab is a sibling `div` rendered above the outer frame with a negative bottom margin overlap. The `HousingUnitVisualizer` component's exported props interface is unchanged — the shell is interior to the component's root element.

---

### Screen 3: Item Configuration (S2)

**Layout:** Single-column, centered, item card grid

```
┌──────────────────────────────────────────────────────────┐
│  HEADER: Step 1 ✓ ──── [Step 2] ──── Step 3            │
│  ████████████████████░░░  Subkit 2 of 4                 │
│                                                          │
│  ← Back   ⚡ POWER   [Category color accent bar]        │
│  "Select the items you want in your Power subkit."      │
│                                                          │
│  ITEMS GRID — 2 cols mobile / 3 tablet / 4 desktop      │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ │
│  │ [96px image   │ │ [96px image   │ │ [96px image   │ │
│  │  cat tint+    │ │  cat tint+    │ │  cat tint+    │ │
│  │  icon]     ✓  │ │  icon]     ○  │ │  icon]     ○  │ │
│  ├───────────────┤ ├───────────────┤ ├───────────────┤ │
│  │ ⚡ Solar Panel│ │ ⚡ Power Stn  │ │ ⚡ Cables     │ │
│  │   Foldable... │ │   Lithium...  │ │   USB-C...    │ │
│  ├───────────────┤ └───────────────┘ └───────────────┘ │
│  │   [−]  2  [+] │  ← included card; qty bar at bottom │
│  └───────────────┘                                      │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ □  I already own these — send me an empty          │ │
│  │    container instead                               │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  [← Back to Subkit Selection]      [Next Subkit →]      │
└──────────────────────────────────────────────────────────┘
```

**Key Element Specs:**

| Element | Treatment |
|---------|----------|
| Progress bar | 8px, neutral-200 bg, category base color fill, radius-full |
| Subkit heading | text-h1, neutral-900; category icon 24px in category base color |
| Category accent bar | 4px left border in category base color |
| Item card — excluded | White, shadow-1, neutral-200 border; image: category tint + icon |
| Selection indicator excluded | neutral-300 hollow circle top-right of image |
| Selection indicator included | Category base color solid circle + white checkmark |
| Item card — included | Category base color border 2px, category tint shadow glow |
| Quantity bar | neutral-100 strip; `−`/`+` in neutral-200; qty in neutral-900 bold; `−` disabled at 1, `+` disabled at 10 |
| Image placeholder MVP | Category tint bg + category icon 32px centered + bottom gradient overlay |
| Empty Container | White panel, neutral-200 border; selected: item grid dims opacity-35 |
| Next Subkit CTA | brand-primary fill; final subkit label: "Review My Kit" |
| SubkitStatsStrip | Inline strip below subkit heading, above item grid — see Phase 2.5 spec below |

**Phase 2.5 — SubkitStatsStrip Component (Weight + Volume Display):**

A new `SubkitStatsStrip` component renders between the subkit heading/accent bar and the item grid on `ItemConfigScreen` and `CustomSubkitScreen`. It displays two live stats for the current subkit: estimated weight and estimated volume fill. Both are purely informational — no warnings, no thresholds, no color changes at any value.

```
┌──────────────────────────────────────────────────────────┐
│  ⚡ POWER   [category color accent bar]                  │
│  "Select the items you want in your Power subkit."      │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  ~2.4 lbs          ████████░░░░░░░  48% filled    │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ITEMS GRID ...                                          │
└──────────────────────────────────────────────────────────┘
```

| Element | Spec |
|---------|------|
| Strip container | Full-width; `neutral-100` background; `radius-md` (10px); padding: `py-2 px-3`; `mb-3` gap before item grid |
| Layout | Single row; `flex items-center justify-between gap-4` |
| Weight label | Left side; `~X.X lbs` format (one decimal, tilde prefix); `text-caption` (12px / 400); `neutral-500` color; no icon |
| Volume bar | Center-right; flex row `items-center gap-2`; bar + percentage label |
| Volume bar track | `neutral-200` background; `radius-full`; height 6px; width 120px fixed |
| Volume bar fill | Category base color fill; `radius-full`; width computed as `min(fillPct, 100)%`; transition `width 150ms standard` on item toggle |
| Volume bar label | `XX% filled` — integer percentage, no decimal; `text-caption` (12px / 400); `neutral-500` color |
| Updates | Both values update live as items are toggled or quantities change — same render cycle as the item card state change |
| No warnings | No color change, no icon, no text change at any weight or volume level — informational only at all values including >100% |
| Empty container state | Strip remains visible; weight shows `~0.0 lbs`; volume bar shows `0% filled` (empty bar) — the empty container itself has no weight or volume contribution |
| Accessibility | Strip has `aria-label="Subkit stats — [weight] lbs, [pct]% of container capacity filled"`; bar track has `role="progressbar" aria-valuenow={fillPct} aria-valuemin={0} aria-valuemax={100} aria-label="Container volume"`; all text has sufficient contrast on `neutral-100` |

**Weight computation:** Sum `weightGrams` for all included items × their quantities. Convert to lbs: `(totalGrams / 453.592)`. Display as `~X.X` (one decimal, always show tilde). Zero included items = `~0.0 lbs`.

**Volume computation:** Sum `volumeIn3` for all included items × their quantities. Divide by container capacity (Regular = 1,728 in³; Large = 3,456 in³). Multiply by 100, round to integer. Zero included items = `0%`. Display value is uncapped (can exceed 100% numerically); bar fill width is clamped to `min(pct, 100)%`.

---

### Screen 4: Custom Subkit Browser (S2-C)

Same layout as S2 with category group structure:

- Category jump nav (horizontal scrollable strip) below subkit header
- Items grouped under `CategoryGroupHeader` per parent category
- Each category group uses that category's color — not Indigo/Custom
- Empty Container option present — identical behavior to standard subkits: selecting dims item grid to `opacity-35` with `pointer-events-none`, deselects all Custom items, and displays an inline confirmation in the Custom/Indigo category color (`#3730A3`). Reflected on Summary Page under the Custom category label.
- CTA: "Review My Kit" if Custom is final subkit

---

### Screen 5: Summary Page (S3)

```
┌──────────────────────────────────────────────────────────┐
│  HEADER: Step 1 ✓ ──── Step 2 ✓ ──── Step 3 ✓          │
│                                                          │
│       "Your Emergency Kit is Ready."                    │
│   "You've built a personalized kit for your household." │
│                                                          │
│       ┌──────────────────────────────────────┐         │
│       │         [ Get My Kit → ]              │         │
│       └──────────────────────────────────────┘         │
│                                                          │
│           ┌────────────────────┐                        │
│           │ POWER     ███████  │  Slot 1 — orange       │
│           ├────────────────────┤                        │
│           │ MEDICAL   ███████  │  Slot 2 — crimson ↓   │
│           │ (Large)            │  Slot 3 — crimson ↑   │
│           ├────────────────────┤                        │
│           │ HYGIENE   ███████  │  Slot 4 — teal         │
│           ├────────────────────┤                        │
│           │                    │  Slot 5 — empty        │
│           ├────────────────────┤                        │
│           │                    │  Slot 6 — empty        │
│           └────────────────────┘                        │
│               4 of 6 slots used                         │
│                                                          │
│  KIT SUMMARY                                            │
│  ┌──────────────────────────────────────────────────┐  │
│  │ ▌ ⚡ POWER — Regular                            │  │
│  │   • Solar Panel × 2  • Power Banks × 1          │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ ▌ 🏥 MEDICAL — Large   ◈ Empty Container        │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ ▌ 🚿 HYGIENE — Regular                          │  │
│  │   • Toilet Paper × 2  • Baby Wipes × 1          │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  [← Edit My Kit]    [🖨 Print]    [Start Over]          │
└──────────────────────────────────────────────────────────┘
```

**Key Element Specs:**

| Element | Treatment |
|---------|----------|
| Hero heading | text-display, neutral-900 |
| Get My Kit CTA | `#1F4D35` fill, white text, max-width 400px; on success redirects same window via `window.location.href` |
| Visualizer | readOnly={true}, max-width 320px centered, slot height 44px, no `+` icons |
| Subkit summary section | White card, shadow-1, radius-md, 4px left border in category base color |
| Subkit heading | Category icon 20px + name text-h2 + size badge text-caption |
| Empty container badge | "◈ Empty Container" in category base color |
| Item list | "• Name × qty" — neutral-700 name, neutral-400 qty |

**Phase 2.5 — Weight and Volume Compact Readout on Summary Page:**

A compact stats row appears at the top of the Kit Summary section, spanning the full width above the individual subkit cards. It shows total kit weight and a per-subkit volume summary. Both are purely informational — no warnings, no thresholds.

```
┌──────────────────────────────────────────────────────────┐
│  KIT SUMMARY                                            │
│  ┌──────────────────────────────────────────────────┐  │
│  │  ~12.4 lbs total   ·   3 subkits configured      │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ ▌ ⚡ POWER — Regular          ~2.4 lbs · 48% ▓  │  │
│  │   • Solar Panel × 2  • Power Banks × 1          │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ ▌ 🏥 MEDICAL — Large         ~0.0 lbs · 0%  ▓  │  │
│  │   ◈ Empty Container                             │  │
│  └──────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

| Element | Spec |
|---------|------|
| Kit-level stats row | Full-width `neutral-100` background pill; `radius-md`; `py-2 px-4`; `mb-4` below it; `flex items-center gap-3`; `text-caption` `neutral-500` |
| Total weight | `~X.X lbs total` — tilde prefix, one decimal, "total" suffix; leftmost item in row |
| Separator | `·` (middle dot) `neutral-300`; `mx-1` |
| Subkit count | `N subkits configured` — integer count of non-empty subkits |
| Per-subkit inline stats | Appended to the right of each `SubkitSummarySection` heading row (same line as category name + size badge): `~X.X lbs · XX%` — weight one decimal, volume integer, separated by `·`; `text-caption` `neutral-400`; right-aligned within heading row via `ml-auto` |
| Per-subkit volume mini-bar | 40px wide × 4px tall `neutral-200` track with category base color fill; `radius-full`; `ml-1` after the `XX%` label; capped at 100% width for display |
| Empty container subkit | Shows `~0.0 lbs · 0%` with empty bar — consistent with non-empty subkits |
| Print behavior | Weight and volume stats are included in printed output — they are informational metadata useful on a printed kit summary |
| No warnings | No color change, no icon change, no text change at any value — informational only |

**Print (@media print):**
- Hide: header, CTAs, Edit/Print/Start Over buttons
- `page-break-inside: avoid` on each subkit section
- Visualizer empty slots: no `+` icon

---

## 5. Component Library

### Component Summary

| Component | Screens | Key States |
|-----------|---------|------------|
| HousingUnitVisualizer | S1, S3 | Empty, Filled Regular, Filled Large, Full, Read-only |
| SubkitCard | S1 | Default, Selected, Disabled |
| SizeToggle | S1 (in SubkitCard) | Regular, Large, Large-disabled |
| ItemCard | S2, S2-C | Excluded, Included |
| QuantitySelector | S2, S2-C | Inactive, Active, At-min (1), At-max (10) |
| EmptyContainerOption | S2, S2-C | Default, Selected |
| StepProgressIndicator | Header all screens | Completed, Current, Upcoming |
| SubkitProgressIndicator | S2 header | Progress bar + label |
| PrimaryButton | S1, S2, S3 | Active, Disabled |
| SecondaryButton | S2, S3 | Default, Modal-trigger variant |
| ConfirmationModal | S2, S3 | Open, Dismissed |
| SlotFullIndicator | S1 | Hidden, Visible |
| CategoryGroupHeader | S2-C, S3 custom | Static label |
| SubkitStatsStrip | S2, S2-C | Live (updates on item toggle/qty change), Empty container state |

---

### SubkitStatsStrip

**Phase 2.5 component.** Renders between the subkit heading and the item grid on `ItemConfigScreen` and `CustomSubkitScreen`. Displays estimated subkit weight (`~X.X lbs`) and live volume fill percentage with a progress bar. Purely informational — no thresholds, no warnings, no state stored in Zustand.

```typescript
interface SubkitStatsStripProps {
  weightGrams: number;          // sum of included item weights × quantities
  volumeIn3: number;            // sum of included item volumes × quantities
  containerCapacityIn3: number; // 1728 (Regular) or 3456 (Large)
  categoryColor: string;        // category base hex — used for volume bar fill
}
```

| Prop | Source |
|------|--------|
| `weightGrams` | Computed from `itemSelections` × `KitItem.weightGrams` in parent component |
| `volumeIn3` | Computed from `itemSelections` × `KitItem.volumeIn3` in parent component |
| `containerCapacityIn3` | Derived from `SubkitSelection.size` — Regular = 1,728 in³; Large = 3,456 in³ |
| `categoryColor` | Category base color hex from category color system |

**Key behaviors:**
- Weight display: `(weightGrams / 453.592).toFixed(1)` prefixed with `~`
- Volume display: `Math.round((volumeIn3 / containerCapacityIn3) * 100)` as integer; bar width clamped to `min(pct, 100)%`
- Both values react instantly to item toggles and quantity changes (derived from props, no internal state)
- Empty container state: parent passes `weightGrams=0` and `volumeIn3=0`; strip renders `~0.0 lbs` and `0% filled`
- No unit tests needed beyond the two pure calculation functions in `slotCalculations.ts`

---

### HousingUnitVisualizer

```typescript
interface HousingUnitVisualizerProps {
  slots: SlotState[];           // index 0 = top slot
  readOnly?: boolean;
  onSlotClick?: (slotIndex: number) => void;  // Phase 2 — active on SubkitSelectionScreen (Story 7.2)
}

interface SlotState {
  status: 'empty' | 'filled';
  subkitId?: string;
  subkitName?: string;
  subkitColor?: string;         // Hex from category color system
  size: 'regular' | 'large';
  isLargeStart?: boolean;
  isLargeEnd?: boolean;
}
```

- All constraint logic calculated externally; component is purely presentational
- Slot update must render within 100ms (PRD NFR2)
- Large block: both rows fill simultaneously, internal divider fades to 0

---

### SubkitCard

| State | Visual |
|-------|--------|
| Default | White, shadow-1, 3px left border in category base color |
| Selected | Category tint bg, 2px full border, selection order badge, checkmark, SizeToggle visible |
| Disabled | opacity-45, cursor-not-allowed |

**SizeToggle:** Slides in on card selection (max-height 180ms). Inline on card. Blocked Large shows amber "Not enough space" message.

---

### ItemCard

**Structure:** Image area (96px) + content area + quantity bar (when included)

```typescript
interface ItemCardProps {
  item: KitItem;
  category: KitCategory;
  included: boolean;
  quantity: number;             // 1–10
  onToggle: () => void;
  onQuantityChange: (qty: number) => void;
  imageSrc?: string;           // Phase 2
}
```

**Image placeholder (MVP):** Category tint bg + category lucide icon 32px centered + bottom gradient overlay

| State | Visual |
|-------|--------|
| Excluded | White, shadow-1, neutral-200 border; hollow circle indicator top-right |
| Included | Category base color 2px border, category tint shadow glow; solid circle + checkmark indicator |

---

### QuantitySelector

`[−]  [1]  [+]`

- Min: 1, Max: 10
- `−` disabled at 1; does not toggle item off
- `+` disabled at 10
- Container always reserves layout space — never causes layout shift

---

### EmptyContainerOption

`[Checkbox] "I already own these — send me an empty container instead"`

- Present on both standard subkit screens (S2) and the Custom subkit browser (S2-C)
- Selected: item grid dims to opacity-35, pointer-events none; inline confirmation in category base color
- Reversed: item grid re-enables; all previously set states restored
- Still counts toward 3-subkit minimum and 6-slot constraint

---

### ConfirmationModal

| Trigger | Title | Confirm | Cancel |
|---------|-------|---------|--------|
| Back to Subkit Selection | "Go back to subkit selection?" | "Go Back" | "Stay Here" |
| Start Over | "Start over?" | "Start Over" | "Keep My Kit" |

- Fade-in 180ms, scale 0.97 → 1.0
- Focus trapped within modal; returns to trigger on close
- Escape = cancel; Enter does NOT confirm
- Backdrop: `rgba(0,0,0,0.4)`

---

### SlotFullIndicator

`[Icon] Housing unit full — deselect a subkit to make room`

- Amber `#D97706` — informational tone, not error
- Inline below visualizer; fade+slide-up 200ms on appear; reverses immediately when slot freed

---

## 6. Branding & Style Guide

### Why Light Theme

1. Category color system reads with full clarity on white — tint contrast works correctly
2. Print readiness is a stated MVP requirement — light theme prints with near-zero extra work
3. "Reassuring" tone is better served by confident typography on white than a dark background

---

### Brand Colors

| Token | Hex | Use |
|-------|-----|-----|
| `brand-primary` | `#1F4D35` | Primary CTAs, focus rings |
| `brand-primary-hover` | `#163828` | CTA hover state |
| `brand-primary-light` | `#E8F5EE` | Brand callout backgrounds |
| `brand-accent` | `#22C55E` | Success states, checkmarks |

### Neutral Palette

| Token | Hex | Use |
|-------|-----|-----|
| `neutral-white` | `#FFFFFF` | Card surfaces, modal backgrounds |
| `neutral-50` | `#F8F9FA` | Page background |
| `neutral-100` | `#F3F4F6` | Secondary backgrounds |
| `neutral-200` | `#E5E7EB` | Borders, dividers |
| `neutral-300` | `#D1D5DB` | Dashed borders |
| `neutral-400` | `#9CA3AF` | Placeholder text, disabled labels |
| `neutral-500` | `#6B7280` | Secondary body text |
| `neutral-700` | `#374151` | Primary body text |
| `neutral-900` | `#111827` | Headings, high-emphasis text |

### Semantic Colors

| Token | Hex | Use |
|-------|-----|-----|
| `status-success` | `#16A34A` | Confirmed states |
| `status-warning` | `#D97706` | Slot full indicator |
| `status-error` | `#DC2626` | Form errors |
| `status-info` | `#2563EB` | Informational callouts |

### Category Color System

| # | Category | Base Hex | Tint Hex | Icon |
|---|----------|----------|----------|------|
| 1 | Power | `#C2410C` | `#FFF7ED` | `Zap` |
| 2 | Lighting | `#A16207` | `#FEFCE8` | `Lightbulb` |
| 3 | Communications | `#1D4ED8` | `#EFF6FF` | `Radio` |
| 4 | Hygiene | `#0F766E` | `#F0FDFA` | `Droplets` |
| 5 | Cooking | `#15803D` | `#F0FDF4` | `UtensilsCrossed` |
| 6 | Medical | `#991B1B` | `#FEF2F2` | `HeartPulse` |
| 7 | Comfort | `#6D28D9` | `#F5F3FF` | `Smile` |
| 8 | Clothing | `#334155` | `#F8FAFC` | `Shirt` |
| 9 | Custom | `#3730A3` | `#EEF2FF` | `Settings2` |

**Rules:**
- Base = visualizer fills + borders. Tint = card selected backgrounds only.
- Color is NEVER the sole differentiator — always paired with text or icon.
- Power and Lighting: verify 4.5:1 contrast with white text at implementation. Darken to `#B83709` / `#95680A` if needed.

### Typography

**Font:** Inter (Google Fonts)
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
```

| Token | Size | Weight | Use |
|-------|------|--------|-----|
| `text-display` | 36px | 700 | Summary hero heading |
| `text-h1` | 28px | 700 | Page titles |
| `text-h2` | 22px | 600 | Section headings |
| `text-h3` | 18px | 600 | Visualizer slot names, card titles |
| `text-body-lg` | 16px | 400 | Primary descriptive text |
| `text-body` | 14px | 400 | Item names, descriptions |
| `text-label` | 14px | 500 | Button labels, badges |
| `text-caption` | 12px | 400 | Slot counter, sub-labels |

### Iconography

**Library:** `lucide-react` exclusively

New icons needed for added PRD items:
- Feminine Hygiene Products: `Droplet`
- Ice Packs: `Snowflake`
- Ponchos: `CloudRain`
- Shoe Covers: `Footprints`

### Spacing

Base unit: 4px. All spacing is a multiple of 4.

| Token | px | Tailwind |
|-------|-----|----------|
| space-1 | 4px | p-1 |
| space-2 | 8px | p-2 |
| space-3 | 12px | p-3 |
| space-4 | 16px | p-4 |
| space-6 | 24px | p-6 |
| space-8 | 32px | p-8 |
| space-12 | 48px | p-12 |

**Max content widths:** Item config: 720px | Summary: 960px | App: 1280px

### Border Radius

| Token | Value | Use |
|-------|-------|-----|
| radius-sm | 6px | Badges, qty buttons |
| radius-md | 10px | Cards, inputs |
| radius-lg | 16px | Visualizer container, modals |
| radius-full | 9999px | Progress dots, number badges |

### Elevation

| Level | CSS | Use |
|-------|-----|-----|
| shadow-1 | `0 1px 3px rgba(0,0,0,0.08)` | Cards at rest |
| shadow-2 | `0 4px 6px rgba(0,0,0,0.07)` | Cards on hover, visualizer |
| shadow-3 | `0 20px 25px rgba(0,0,0,0.12)` | Modals |

### Design Token File

```typescript
// design-tokens.ts
export const colors = {
  brand: {
    primary: '#1F4D35',
    primaryHover: '#163828',
    primaryLight: '#E8F5EE',
    accent: '#22C55E',
  },
  neutral: {
    white: '#FFFFFF', 50: '#F8F9FA', 100: '#F3F4F6',
    200: '#E5E7EB', 300: '#D1D5DB', 400: '#9CA3AF',
    500: '#6B7280', 700: '#374151', 900: '#111827',
  },
  status: {
    success: '#16A34A', warning: '#D97706',
    error: '#DC2626', info: '#2563EB',
  },
  categories: {
    Power:          { base: '#C2410C', tint: '#FFF7ED' },
    Lighting:       { base: '#A16207', tint: '#FEFCE8' },
    Communications: { base: '#1D4ED8', tint: '#EFF6FF' },
    Hygiene:        { base: '#0F766E', tint: '#F0FDFA' },
    Cooking:        { base: '#15803D', tint: '#F0FDF4' },
    Medical:        { base: '#991B1B', tint: '#FEF2F2' },
    Comfort:        { base: '#6D28D9', tint: '#F5F3FF' },
    Clothing:       { base: '#334155', tint: '#F8FAFC' },
    Custom:         { base: '#3730A3', tint: '#EEF2FF' },
  },
} as const;

export const motion = {
  duration: {
    instant: '0ms', fast: '130ms', default: '150ms',
    moderate: '200ms', standard: '220ms', screen: '240ms', reward: '360ms',
  },
  easing: {
    standard:   'cubic-bezier(0.4, 0, 0.2, 1)',
    decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
    accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
    spring:     'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const;
```

### Print Styles

```css
@media print {
  header, .step-progress-indicator, .cta-primary,
  .cta-secondary, .btn-edit, .btn-start-over,
  .btn-print { display: none !important; }
  body { background: white; font-size: 12pt; color: #000; }
  .summary-subkit-section { page-break-inside: avoid; }
  .visualizer-slot-empty::after { content: none; }
}
```

---

## 7. Accessibility Requirements

### Compliance Target

**WCAG 2.1 Level AA** — minimum floor, not a ceiling.

### Color Contrast

| Context | Foreground | Background | Required | Status |
|---------|-----------|------------|----------|--------|
| Visualizer white name on category base | `#FFFFFF` | Category base | 4.5:1 | Power + Lighting borderline — verify at build |
| Primary button | `#FFFFFF` | `#1F4D35` | 4.5:1 | PASS (~12:1) |
| Body text on white | `#374151` | `#FFFFFF` | 4.5:1 | PASS |
| Body text on neutral-50 | `#374151` | `#F8F9FA` | 4.5:1 | PASS |
| Secondary text on white | `#6B7280` | `#FFFFFF` | 4.5:1 | MARGINAL (~4.6:1) — do not use on tinted bg |
| Caption text | `#9CA3AF` | Any | 4.5:1 | FAIL — use `#6B7280` minimum |
| Disabled elements | Any | Any | 3:1 | PASS — WCAG exception |

**Critical rule:** Color is never the sole differentiator. Every category element must include redundant text or icon identification.

### Focus Indicators

```css
:focus-visible {
  outline: 2px solid #1F4D35;
  outline-offset: 2px;
  border-radius: 4px;
}
.subkit-card:focus-visible {
  outline: 3px solid #1F4D35;
  outline-offset: 0px;
}
:focus:not(:focus-visible) { outline: none; }
```

### Keyboard Navigation

| Screen | Tab Order | Special Behavior |
|--------|-----------|------------------|
| S1 | Header → Visualizer (skip) → Subkit cards → Configure Items CTA | Space/Enter selects card; Tab within selected card reaches SizeToggle |
| S2 | Header → Back → EmptyContainerOption → Item cards → Next CTA → Back to Selection link | Space/Enter toggles item; Tab from active toggle reaches QuantitySelector |
| S2-C | Same as S2 + category jump nav before item grid | Enter on jump link scrolls to anchor |
| S3 | Header → Get My Kit CTA → Visualizer (skip) → Summary sections → Edit My Kit → Print → Start Over | Enter on Get My Kit triggers `initiateCheckout()`; on success redirects same window via `window.location.href` |
| Modals | Focus trapped within; Escape closes (cancel) | Focus returns to trigger on close |

**Configure Items CTA when disabled:** Use `aria-disabled="true"` — not `disabled` — so keyboard users can reach it and read the status message.

**Focus management on screen transitions:**
```typescript
useEffect(() => {
  if (currentScreen !== previousScreen) {
    mainHeadingRef.current?.focus();
  }
}, [currentScreen]);
<h1 ref={mainHeadingRef} tabIndex={-1}>Configure Your {subkit.name} Subkit</h1>
```

### Touch Targets

Minimum 44×44px for all interactive elements.

### Semantic HTML

```html
<ul role="list" aria-label="Subkit categories">
  <li>
    <button aria-pressed="true"
            aria-label="Power subkit — selected, Regular size, 1 slot used">
    </button>
  </li>
</ul>

<section aria-label="Housing unit — 3 of 6 slots used" aria-live="polite"></section>

<div role="group" aria-label="Quantity for Solar Panel">
  <button aria-label="Decrease quantity">−</button>
  <span aria-live="polite" aria-atomic="true">2</span>
  <button aria-label="Increase quantity">+</button>
</div>

<div role="dialog" aria-modal="true"
     aria-labelledby="modal-title" aria-describedby="modal-desc">
</div>
```

### ARIA Live Regions

| Event | Announcement | Type |
|-------|-------------|------|
| Subkit selected | "[Name] added. [N] of 6 slots used." | `polite` |
| Subkit deselected | "[Name] removed. [N] of 6 slots used." | `polite` |
| Size changed | "[Name] changed to Large. [N] of 6 slots used." | `polite` |
| Slots full | "Housing unit full. Deselect a subkit to add more." | `polite` |
| Minimum not met | "Select at least 3 subkits. You have [N]." | `assertive` |
| Item included | "[Item] included. Quantity: 1." | `polite` |
| Item excluded | "[Item] removed." | `polite` |
| Quantity changed | "Quantity updated to [N]." | `polite` |
| Empty container | "Empty container selected. All items deselected." | `polite` |

### Accessibility Testing

**Automated:** `@axe-core/react` (dev), `eslint-plugin-jsx-a11y` (CI), Lighthouse (per PR)

**Manual (required at epic completion):**

| Test | Tool |
|------|------|
| Keyboard-only navigation | Keyboard only |
| Screen reader full flow | NVDA+Chrome or VoiceOver+Safari |
| 200% zoom | Chrome zoom |
| Color vision simulation | Chrome DevTools → Rendering |
| High contrast mode | Windows High Contrast |
| Print preview | Browser print preview |

**Accessibility AC added to all stories in Epics 2–5:**
> *All interactive elements are keyboard operable, have visible focus indicators, and have programmatically associated labels or ARIA attributes. State changes are announced via the appropriate `aria-live` region.*

---

## 8. Responsiveness Strategy

### Guiding Principle

**Desktop-first** per PRD NFR3. Working range: 768px–1920px. Below 768px: graceful degradation interstitial.

### Breakpoints

| Token | Min Width | Max Width | Tailwind Prefix |
|-------|-----------|-----------|------------------|
| desktop-lg | 1280px | — | `2xl:` |
| desktop | 1024px | 1279px | `lg:` |
| tablet | 768px | 1023px | `md:` |
| tablet-sm | 640px | 767px | `sm:` |
| mobile | 0px | 639px | base — interstitial only |

### Layout Adaptations

**S1 — Subkit Selection:**

| Property | Desktop | Tablet |
|----------|---------|--------|
| Card grid columns | 3 | 2 |
| Visualizer width | max-w-sm | max-w-xs |
| Card description | Full | Truncates to 1 line |
| Size toggle | Horizontal | May stack vertically |

**S2 — Item Configuration:**

| Property | Desktop | Tablet |
|----------|---------|--------|
| Content max-width | 720px centered | 100% with 32px padding |
| Item grid columns | 4 | 3 |

**S3 — Summary Page:**

| Property | Desktop | Tablet |
|----------|---------|--------|
| Content max-width | 960px centered | 100% with 32px padding |
| Visualizer max-width | 320px | 280px |
| Slot height (read-only) | 44px | 40px |

### Content Priority (always preserved at 768px+)

- Full 6-row visualizer (no rows hidden)
- All 9 subkit category cards
- All item names (no truncation on primary label)
- Configure Items CTA and minimum message
- All navigation buttons

### Graceful Degradation Below 768px

```tsx
function MobileInterstitial() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-8 text-center">
      <div className="max-w-sm">
        <Monitor className="w-12 h-12 text-brand-primary mx-auto mb-6" />
        <h1 className="text-h2 text-neutral-900 mb-3">Best on a larger screen</h1>
        <p className="text-body-lg text-neutral-500">
          The Kit Builder is designed for desktop and tablet.
          Open it on a larger device for the full experience.
        </p>
      </div>
    </div>
  );
}
```

### Key Tailwind Patterns

```tsx
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"> // Item grid
<main className="w-full max-w-[720px] mx-auto px-4 md:px-8">  // S2
<main className="w-full max-w-[960px] mx-auto px-4 md:px-8">  // S3
```

**Critical:** Do not use `overflow-hidden` on any ancestor of a sticky element. Use `items-start` not `items-stretch` on flex parents of cards with variable height.

---

## 9. Animation & Micro-interactions

### Motion Principles

Animation serves three purposes only: communicate state change, provide spatial orientation, confirm system response. All animations use `transform` and `opacity` only — GPU-composited, no layout reflow.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Animation Reference

| # | Animation | Trigger | Duration | Easing | Properties |
|---|-----------|---------|----------|--------|------------|
| 1 | Visualizer slot fill | Subkit selected | 220ms | standard | `background-color`; text opacity delayed 80ms |
| 2 | Visualizer slot clear | Subkit deselected | 180ms | accelerate | Text fades first; color clears; `+` fades in at 100ms |
| 3 | Slot reorder | Slot freed mid-sequence | 200ms | standard | `transform: translateY()` |
| 4 | Card selection | Card clicked | 150ms | standard | `border-color`, `background-color`, `box-shadow` |
| 5 | SizeToggle reveal | Card selected | 180ms | decelerate | `max-height: 0` → `48px`, `opacity: 0` → `1` |
| 6 | Card deselection | Card body clicked | 130ms | accelerate | Reverse of selection |
| 7 | Cards disabled | 6th slot fills | 200ms | standard | `opacity: 1` → `0.45` (all simultaneously) |
| 8 | Slot full indicator | 6 slots used | 200ms | decelerate | `opacity` + `translateY(4px)` → `0` |
| 9 | Large slot fill | Large subkit selected | 220ms | standard | Both rows simultaneously; divider opacity → 0 |
| 10 | Item card toggle | Item included/excluded | 150ms | standard | `background-color`; left bar `scaleX(0)` → `1` |
| 11 | Qty selector activate | Item included | 120ms | decelerate | `opacity: 0.3` → `1` |
| 12 | Qty increment | + clicked | 140ms | standard | Old number exits up, new enters from below |
| 13 | Qty decrement | − clicked | 140ms | standard | Old exits down, new enters from above |
| 14 | Qty button limit shake | Disabled button clicked | 300ms | spring | `translateX` oscillates: 0 → 3px → -3px → 2px → -2px → 0 |
| 15 | Empty container select | Checkbox checked | 200ms | standard | Item list opacity → 0.35; confirmation +80ms delay |
| 16 | Screen transition forward | CTA clicked | 240ms | standard | Exit translateX(-16px) + fade; enter from +16px |
| 17 | Screen transition back | Back clicked | 240ms | standard | Direction reverses |
| 18 | Modal open | Trigger clicked | 180ms | decelerate | opacity + scale(0.97) → 1 |
| 19 | Modal close | Cancel/Escape | 140ms | accelerate | Reverse of open |
| 20 | Step completion | Step advances | 360ms | decelerate | SVG checkmark `stroke-dashoffset` draw |

### Animation Tokens

```typescript
export const motion = {
  duration: {
    instant: '0ms', fast: '130ms', default: '150ms',
    moderate: '200ms', standard: '220ms', screen: '240ms', reward: '360ms',
  },
  easing: {
    standard:   'cubic-bezier(0.4, 0, 0.2, 1)',
    decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
    accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
    spring:     'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const;
```

---

## 10. Performance Considerations

### Goals

| Metric | Target | Source |
|--------|--------|--------|
| Page load | < 3 seconds | PRD NFR7 |
| Visualizer slot update | < 100ms perceived | PRD NFR2 |
| Time to Interactive | < 4 seconds | |
| First Contentful Paint | < 1.5 seconds | |
| Cumulative Layout Shift | < 0.1 | |

### Design Strategies

**lucide-react — named imports only:**
```typescript
import { Zap, Lightbulb, Radio } from 'lucide-react'; // correct
import * as Icons from 'lucide-react'; // never
```

**Visualizer — purely presentational:**
```typescript
// Correct — all calculation in state layer
const slots = calculateSlotState(selectedSubkits);
return <HousingUnitVisualizer slots={slots} />;
```

**CLS prevention:**
1. QuantitySelector container reserves layout space at all times — only opacity and pointer-events change
2. Card grid uses `items-start` so cards grow independently without shifting adjacent cards

**Item list:** ~30–35 items max — no virtualization needed in MVP.

---

## 11. Next Steps

### Immediate Actions

1. **Share Figma design files** — Link updated light-theme frames for each screen to finalize Section 4
2. **Share physical product drawing** — Interior slot arrangement; required for visualizer outer container styling
3. **Verify category colors in browser** — Power (`#C2410C`) and Lighting (`#A16207`) with white text; darken if below 4.5:1
4. **Rectify `kitItems.ts`** — Add 4 missing items, add Clothing category, remove Repairs/Tools and Starlink
5. **Hand off to Winston** — Use Architect Prompt below

### Design Handoff Checklist

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

### Architect Prompt

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
