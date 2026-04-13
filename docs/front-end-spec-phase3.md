# Emergency Prep Kit Builder — Phase 3 Sprint 1 UI/UX Specification

**Document version:** 1.0 | **Date:** 2026-04-13 | **Author:** Sally, UX Expert
**Status:** Complete — Sprint 1 scope (MCQ, Fork, Review & Order shell)

---

## Table of Contents

1. Decisions Log
2. Information Architecture
3. User Flows
4. Wireframes & Mockups
5. Component Library / Design System
6. Accessibility Requirements
7. Animation & Micro-interactions
8. Responsiveness Strategy
9. Next Steps

---

## Scope

This document covers **Phase 3 Sprint 1 only** — four new screens inserted before the existing kit-building flow. It extends the base spec (`docs/front-end-spec.md`) and inherits all branding, typography, color, spacing, and accessibility standards defined there.

**New screens:**
- MCQ Screen 1 — Emergency type selection (`/build`)
- MCQ Screen 2 — Household composition (`/build/household`)
- Fork Screen — Essentials vs. Build My Own (`/choose`)
- Review & Order Page — Shell (`/review`)

**Modified screens:**
- Cover Page (`/`) — CTA route updated from `/builder` to `/build`

**Unchanged:** All existing screens (SubkitSelectionScreen, ItemConfigScreen, CustomSubkitScreen, SummaryScreen, OrderConfirmationScreen) are unchanged.

---

## 1. Decisions Log

| # | Decision | Resolution |
|---|----------|------------|
| 16 | MCQ layout: one screen or two? | **Two separate screens** — one question per screen. Mobile-first: avoids scroll-heavy cognitive overload. Conversational flow reduces mental load. Step indicator ("Step 1 of 2") communicates brevity. |
| 17 | MCQ validation treatment | **Disabled button** — "Next" CTA stays disabled until ≥1 option selected. No validation toast or error nudge. With only 4–5 visible options, a disabled button is instantly understandable. |
| 18 | "None of the Above" visual treatment | **Visually separated** — placed below a subtle `neutral-200` divider, full-width, no icon, outlined style. It's a different kind of answer, not a lesser one. |
| 19 | Essentials Display Screen | **Eliminated** — bundle preview lives directly on the fork card. Selecting "Get The Essentials Kit" routes straight to Review & Order. One less screen, faster path to confidence. |
| 20 | Fork card co-equality | **Enforced by spec** — identical dimensions, padding, border radius, elevation, CTA size. Essentials adds trust badge + bundle preview; Build My Own adds feature description. Neither visually dominates. |
| 21 | Review & Order scope | **Shell only** — prototype surface. No real fulfillment, no payment processing. Serves both Essentials and Build My Own paths with the same layout. |
| 22 | Step indicator scope | **MCQ only** — "Step 1 of 2" / "Step 2 of 2" on MCQ screens. Does not span the fork or Review & Order. The main `StepProgressIndicator` does not appear on any Phase 3 Sprint 1 screen. |
| 23 | Copy tone | **Warm authority** for Essentials ("We've done the research..."), **empowering confidence** for Build My Own ("You know your household best..."). Confirmed by stakeholder. |
| 24 | "Build My Own" Sprint 1 destination | Routes to existing `/builder` (SubkitSelectionScreen). No placeholder or coming-soon state — the existing flow is fully functional. |
| 25 | Back navigation pattern | **Consistent top-left back link** — `← Back` text link on all new screens. Not in the AppHeader; positioned at the top of the content area. |

---

## 2. Information Architecture

### 2.1 Updated Site Map

Phase 3 Sprint 1 inserts four screens between the Cover Page (S0) and the existing Subkit Selection (S1). Two paths diverge at the Fork screen.

| ID | Screen | Route | Notes |
|----|--------|-------|-------|
| S0 | Cover / Landing Page | `/` | CTA updated: routes to `/build` instead of `/builder` |
| **MCQ-1** | **MCQ: Emergency Type** | **`/build`** | **New — Q1 multi-select** |
| **MCQ-2** | **MCQ: Household** | **`/build/household`** | **New — Q2 multi-select with NOTA mutex** |
| **F1** | **Fork Screen** | **`/choose`** | **New — two co-equal path cards** |
| **RO** | **Review & Order** | **`/review`** | **New — shell, serves both paths** |
| S1 | Subkit Selection | `/builder` | Unchanged — "Build My Own" path entry |
| S2 | Item Configuration | `/configure/:subkitId` | Unchanged |
| S2-C | Custom Subkit Browser | `/configure/custom` | Unchanged |
| S3 | Summary Page | `/summary` | Unchanged |
| S4 | Order Confirmation | `/confirmation` | Unchanged |

### 2.2 Navigation Structure

**Essentials Path:**
```
S0 (Cover) → MCQ-1 → MCQ-2 → F1 (Fork) → RO (Review & Order)
```

**Build My Own Path:**
```
S0 (Cover) → MCQ-1 → MCQ-2 → F1 (Fork) → S1 (Builder) → S2 × N → S3 (Summary)
```

**Back navigation chain:**
```
RO → F1 → MCQ-2 → MCQ-1 → S0
```

**Key routing rules:**
- The main `StepProgressIndicator` (Step 1/2/3) does NOT appear on MCQ, Fork, or Review & Order screens
- MCQ screens show their own lightweight step indicator ("Step 1 of 2" / "Step 2 of 2")
- Direct navigation to `/build/household` without Q1 answers → redirect to `/build`
- Direct navigation to `/choose` without MCQ completion → redirect to `/build`
- Direct navigation to `/review` without a kit path selected → redirect to `/choose`

---

## 3. User Flows

### Flow 6: Essentials Kit — End-to-End (Sprint 1 Primary)

**Goal:** Complete MCQ, select Essentials path, reach Review & Order
**Success:** User arrives at Review & Order with Essentials bundle displayed, in under 2 minutes

Key path:
1. Land on S0 (Cover) → Click "Build My Kit" → Navigate to `/build` (MCQ-1)
2. Select ≥1 emergency type tile → "Next" CTA activates
3. Click "Next" → Navigate to `/build/household` (MCQ-2)
4. Select ≥1 household option (or "None of the Above") → "Next" CTA activates
5. Click "Next" → MCQ answers saved to store → Navigate to `/choose` (Fork)
6. Click "Get The Essentials Kit" card → Essentials bundle written to kit store → Navigate to `/review` (Review & Order)
7. Review & Order displays Essentials bundle summary + delivery options + "Place Order" CTA

**Edge cases:**
- Refresh on MCQ-2 → persisted Q1 answers restored; Q2 answers restored if previously set
- Back from Fork → MCQ-2 with selections intact
- Back from Review & Order → Fork screen
- Browser back from MCQ-1 → Cover page

---

### Flow 7: Build My Own — MCQ to Existing Flow

**Goal:** Complete MCQ, select Build My Own path, enter existing kit builder
**Success:** User arrives at SubkitSelectionScreen with MCQ answers persisted

Key path:
1. Land on S0 → "Build My Kit" → MCQ-1 → MCQ-2 → Fork
2. Click "Build My Own Kit" card → Navigate to `/builder` (existing SubkitSelectionScreen)
3. Existing flow proceeds unchanged: select subkits → configure items → summary

**Edge cases:**
- MCQ answers are persisted but do not influence the existing flow in Sprint 1
- Back from `/builder` returns to Fork screen (not MCQ)

---

### Flow 8: MCQ "None of the Above" Mutex Behavior

**Goal:** "None of the Above" correctly mutex-toggles with other Q2 options

Key states:
- Select "Kids" → "Kids" tile selected; NOTA unselected
- Select "Pets" → "Kids" + "Pets" selected; NOTA unselected
- Select "None of the Above" → "Kids" + "Pets" immediately deselected; NOTA selected
- Select "Older Adults" while NOTA active → NOTA immediately deselected; "Older Adults" selected
- Deselect all Q2 options → "Next" CTA returns to disabled state

---

### Flow 9: MCQ "Extreme Heat" Disabled State

**Goal:** "Extreme Heat" is clearly non-interactive

Key states:
- Tile renders grayed out with "Coming Soon" badge on load
- Click/tap does nothing — no state change, no selection, no error
- Keyboard: tile is focusable but `aria-disabled="true"` prevents activation
- Screen reader: announces "Extreme Heat, Coming Soon, disabled"

---

## 4. Wireframes & Mockups

All new screens inherit the existing design system: `neutral-50` page background, Inter font, 4px spacing grid, `brand-primary` (#1F4D35) CTAs. No new design tokens are introduced.

---

### Screen MCQ-1: Emergency Type Selection

**Route:** `/build` — New Phase 3 entry point. Replaces `/builder` as CTA destination from Cover Page.

**Layout:** Centered single-column. Max-width 640px. No AppHeader step indicator — uses its own lightweight MCQ step indicator.

```
┌──────────────────────────────────────────────────────────┐
│  ← Back                                  Step 1 of 2    │
│                                                          │
│         "What type of emergency are                      │
│          you prepping for?"                              │
│                                                          │
│         "Select all that apply."                         │
│                                                          │
│  ┌─────────────────┐  ┌─────────────────┐               │
│  │  🌊  Flood      │  │  🌪️  Tornado    │               │
│  └─────────────────┘  └─────────────────┘               │
│  ┌─────────────────┐  ┌─────────────────┐               │
│  │  🌀  Hurricane  │  │  ⛈  Tropical   │               │
│  │                 │  │     Storm       │               │
│  └─────────────────┘  └─────────────────┘               │
│  ┌─────────────────────────────────────┐                │
│  │  🌡  Extreme Heat      Coming Soon  │  ← grayed out  │
│  └─────────────────────────────────────┘                │
│                                                          │
│              [ Next → ]  ← disabled until ≥1 selected    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Key Element Specs:**

| Element | Treatment |
|---------|----------|
| Page background | `neutral-50` (`#F8F9FA`) |
| Back link | `← Back` — `text-label` (14px/500), `neutral-500`, top-left of content area. Routes to `/` (Cover). Hover: `neutral-700` |
| Step indicator | `Step 1 of 2` — `text-caption` (12px/400), `neutral-400`, top-right of content area, same line as back link |
| Question heading | `text-h1` (28px/700), `neutral-900`, centered, `mb-2` |
| Instruction text | `text-body-lg` (16px/400), `neutral-500`, centered, `mb-8` |
| Tile grid | 2 columns, `gap-3` (12px). Full-width within max-w container |
| Extreme Heat tile | Spans full width (2 columns). Grayed out treatment |
| Next CTA | `PrimaryButton` — `brand-primary` fill, white text, full-width (max-w-sm centered), `mt-8`. Disabled state: `neutral-300` fill, `cursor-not-allowed` |
| Content container | `max-w-[640px] mx-auto px-6` |
| Spacing — heading to tiles | `space-8` (32px) |
| Spacing — tiles to CTA | `space-8` (32px) |

**MCQ Tile States (Q1):**

| State | Background | Border | Text | Icon |
|-------|-----------|--------|------|------|
| Unselected | `#FFFFFF` | 2px solid `neutral-200` (`#E5E7EB`) | `neutral-700` (`#374151`) | `neutral-500` (`#6B7280`) 24px |
| Selected | `brand-primary-light` (`#E8F5EE`) | 2px solid `brand-primary` (`#1F4D35`) | `brand-primary` (`#1F4D35`) | `brand-primary` (`#1F4D35`) 24px |
| Disabled | `neutral-100` (`#F3F4F6`) | 2px solid `neutral-200` (`#E5E7EB`) | `neutral-400` (`#9CA3AF`) | `neutral-400` (`#9CA3AF`) 24px |

**Tile dimensions:** min-height 72px, `radius-md` (10px), `px-4 py-3`, flex row with `gap-3`, icon left + label center-left.

**Selected indicator:** Small `brand-accent` (`#22C55E`) checkmark circle (20px) at top-right corner of tile, `position: absolute`. Only visible when selected.

**Disabled "Coming Soon" badge:** `text-caption` (12px/400), `neutral-400`, `neutral-200` background pill (`px-2 py-0.5 radius-full`), right-aligned within tile.

**Icons (lucide-react):**

| Option | Icon |
|--------|------|
| Flood | `Waves` |
| Tornado | `Tornado` |
| Hurricane | `CloudLightning` |
| Tropical Storm | `CloudRainWind` |
| Extreme Heat | `Thermometer` |

**Transition to MCQ-2:**
- "Next" saves Q1 selections to MCQ store, navigates to `/build/household`
- Screen transition: forward direction (exit left, enter from right) per existing Animation #16

---

### Screen MCQ-2: Household Composition

**Route:** `/build/household` — Second MCQ screen. Requires Q1 completion (redirect to `/build` if `emergencyTypes` is empty).

**Layout:** Same centered single-column as MCQ-1. Max-width 640px.

```
┌──────────────────────────────────────────────────────────┐
│  ← Back                                  Step 2 of 2    │
│                                                          │
│         "Who will you be caring for?"                    │
│                                                          │
│         "Select all that apply."                         │
│                                                          │
│  ┌─────────────────┐  ┌─────────────────┐               │
│  │  👶  Kids       │  │  🤝  Older      │               │
│  │                 │  │     Adults      │               │
│  └─────────────────┘  └─────────────────┘               │
│  ┌─────────────────┐  ┌─────────────────┐               │
│  │  ♿  Person with │  │  🐾  Pets       │               │
│  │   a Disability  │  │                 │               │
│  └─────────────────┘  └─────────────────┘               │
│                                                          │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  ← divider     │
│                                                          │
│  ┌─────────────────────────────────────┐                │
│  │     None of the Above              │  ← full-width   │
│  └─────────────────────────────────────┘                │
│                                                          │
│              [ Next → ]  ← disabled until ≥1 selected    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Key Element Specs:**

All specs identical to MCQ-1 except:

| Element | Treatment |
|---------|----------|
| Back link | Routes to `/build` (MCQ-1) |
| Step indicator | `Step 2 of 2` |
| Question heading | "Who will you be caring for?" |
| Divider | `neutral-200` (`#E5E7EB`), 1px solid, `my-4` (16px above and below), full-width within tile grid |

**"None of the Above" Tile — Special Treatment:**

| Property | Spec |
|----------|------|
| Width | Full-width — spans both grid columns |
| Icon | None — text-only |
| Background (unselected) | `#FFFFFF` |
| Border (unselected) | 2px solid `neutral-200` (`#E5E7EB`) |
| Text (unselected) | `neutral-500` (`#6B7280`), centered |
| Background (selected) | `neutral-100` (`#F3F4F6`) |
| Border (selected) | 2px solid `neutral-700` (`#374151`) |
| Text (selected) | `neutral-700` (`#374151`), centered |
| Checkmark | `neutral-700` checkmark circle (not `brand-accent`) — visually distinct from standard tile selection |
| Min-height | 56px (shorter than standard tiles — no icon to accommodate) |

**Mutex behavior:**
- Selecting NOTA: all other Q2 tiles animate to unselected state (150ms, standard easing)
- Selecting any other Q2 tile while NOTA is active: NOTA animates to unselected (150ms)
- Both transitions feel immediate and responsive — no delay

**Icons (lucide-react):**

| Option | Icon |
|--------|------|
| Kids | `Baby` |
| Older Adults | `HeartHandshake` |
| Person with a Disability | `Accessibility` |
| Pets | `PawPrint` |
| None of the Above | *(none)* |

**Transition to Fork:**
- "Next" saves Q2 selections to MCQ store, navigates to `/choose`
- Screen transition: forward direction

---

### Screen F1: Fork Screen

**Route:** `/choose` — Requires MCQ completion (redirect to `/build` if MCQ store is empty).

**Layout:** Centered, max-width 800px. Two cards side-by-side on desktop (≥768px), stacked on mobile/tablet (<768px).

```
┌──────────────────────────────────────────────────────────────┐
│  ← Back                                                      │
│                                                              │
│            "How would you like to build                      │
│             your emergency kit?"                             │
│                                                              │
│  ┌───────────────────────┐    ┌───────────────────────┐     │
│  │                       │    │                       │     │
│  │    [ShieldCheck]      │    │    [SlidersHorizontal]│     │
│  │                       │    │                       │     │
│  │  Get The              │    │  Build My             │     │
│  │  Essentials Kit       │    │  Own Kit              │     │
│  │                       │    │                       │     │
│  │  ┌─ Recommended ─┐   │    │  You know your        │     │
│  │  └────────────────┘   │    │  household best.      │     │
│  │                       │    │  Customize every      │     │
│  │  We've done the       │    │  detail of your       │     │
│  │  research. This kit   │    │  emergency kit to     │     │
│  │  covers what matters  │    │  match your specific  │     │
│  │  most.                │    │  needs and situation.  │     │
│  │                       │    │                       │     │
│  │  What's included:     │    │  You'll choose:       │     │
│  │  ┌──────────────────┐│    │  • Which subkit       │     │
│  │  │ ⚡ Power (Large) ││    │    categories to      │     │
│  │  │ 🍳 Cooking (Reg) ││    │    include            │     │
│  │  │ 🏥 Medical (Reg) ││    │  • Regular or Large   │     │
│  │  │ 📡 Comms (Reg)   ││    │    sizes for each     │     │
│  │  └──────────────────┘│    │  • Specific items &   │     │
│  │                       │    │    quantities         │     │
│  │  [ Get The Essentials │    │                       │     │
│  │    Kit → ]            │    │  [ Start Building → ] │     │
│  │                       │    │                       │     │
│  └───────────────────────┘    └───────────────────────┘     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Key Element Specs:**

| Element | Treatment |
|---------|----------|
| Page background | `neutral-50` (`#F8F9FA`) |
| Back link | `← Back` — routes to `/build/household` (MCQ-2). Same style as MCQ screens |
| Page heading | `text-h1` (28px/700), `neutral-900`, centered, `mb-8` |
| Card container | `flex gap-6` desktop; `flex-col gap-4` mobile |
| Content container | `max-w-[800px] mx-auto px-6` |

**Card Specs (both cards identical structure):**

| Property | Spec |
|----------|------|
| Background | `#FFFFFF` |
| Border | 1px solid `neutral-200` (`#E5E7EB`) |
| Border radius | `radius-lg` (16px) |
| Elevation | `shadow-1` (`0 1px 3px rgba(0,0,0,0.08)`) |
| Hover elevation | `shadow-2` (`0 4px 6px rgba(0,0,0,0.07)`) — transition 150ms standard |
| Padding | `p-6` (24px) |
| Width | `flex-1` — both cards take equal width |
| Min-height | None enforced — cards align to tallest via `items-stretch` on parent flex |

**Essentials Card — Specific Elements:**

| Element | Treatment |
|---------|----------|
| Icon | `ShieldCheck` from lucide-react, 40px, `brand-primary` (`#1F4D35`), `mb-4` |
| Heading | "Get The Essentials Kit" — `text-h2` (22px/600), `neutral-900`, `mb-2` |
| Trust badge | "Recommended for most households" — `text-caption` (12px/400), `brand-primary` text on `brand-primary-light` (`#E8F5EE`) background, `radius-full`, `px-3 py-1`, `mb-3`. Positioned above body copy |
| Body copy | "We've done the research. This kit covers what matters most." — `text-body-lg` (16px/400), `neutral-500`, `mb-4` |
| Bundle label | "What's included:" — `text-label` (14px/500), `neutral-700`, `mb-2` |
| Bundle preview | 4 rows in a `neutral-50` rounded container (`radius-md`, `p-3`). Each row: category icon (16px, category base color) + name + size badge. `text-body` (14px/400). `gap-2` between rows |
| Bundle row — Power | `Zap` icon `#C2410C` + "Power" `neutral-700` + "(Large)" badge `text-caption neutral-500` |
| Bundle row — Cooking | `UtensilsCrossed` icon `#15803D` + "Cooking" + "(Regular)" |
| Bundle row — Medical | `HeartPulse` icon `#991B1B` + "Medical" + "(Regular)" |
| Bundle row — Comms | `Radio` icon `#1D4ED8` + "Communications" + "(Regular)" |
| CTA | "Get The Essentials Kit →" — `PrimaryButton`, full-width within card, `mt-6` |

**Build My Own Card — Specific Elements:**

| Element | Treatment |
|---------|----------|
| Icon | `SlidersHorizontal` from lucide-react, 40px, `brand-primary`, `mb-4` |
| Heading | "Build My Own Kit" — `text-h2` (22px/600), `neutral-900`, `mb-2` |
| Body copy | "You know your household best. Customize every detail of your emergency kit to match your specific needs and situation." — `text-body-lg` (16px/400), `neutral-500`, `mb-4` |
| Feature label | "You'll choose:" — `text-label` (14px/500), `neutral-700`, `mb-2` |
| Feature list | Bulleted list, `text-body` (14px/400), `neutral-500`, `gap-1`. Items: "Which subkit categories to include", "Regular or Large sizes for each", "Specific items & quantities" |
| CTA | "Start Building →" — `PrimaryButton`, full-width within card, `mt-6` |

**Essentials CTA behavior:**
1. Write Essentials bundle to kit store (using `ESSENTIALS_BUNDLE` from `essentialsConfig.ts`)
2. Set `kitPath: 'essentials'` in MCQ store
3. Navigate to `/review`

**Build My Own CTA behavior:**
1. Set `kitPath: 'custom'` in MCQ store
2. Navigate to `/builder`

---

### Screen RO: Review & Order Page (Shell)

**Route:** `/review` — Requires a kit path to be set (redirect to `/choose` if no path selected).

**Layout:** Centered single-column. Max-width 720px.

```
┌──────────────────────────────────────────────────────────┐
│  ← Back                                                  │
│                                                          │
│         "Review & Order"                                 │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  YOUR KIT                                          │ │
│  │                                                    │ │
│  │  ┌──────────────────────────────────────────────┐ │ │
│  │  │  ⚡ Power                          Large     │ │ │
│  │  ├──────────────────────────────────────────────┤ │ │
│  │  │  🍳 Cooking                        Regular   │ │ │
│  │  ├──────────────────────────────────────────────┤ │ │
│  │  │  🏥 Medical                        Regular   │ │ │
│  │  ├──────────────────────────────────────────────┤ │ │
│  │  │  📡 Communications                 Regular   │ │ │
│  │  └──────────────────────────────────────────────┘ │ │
│  │                                                    │ │
│  │  Essentials Kit  ·  5 slots used                  │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  DELIVERY                                          │ │
│  │                                                    │ │
│  │  ○  Deliver to my address                         │ │
│  │     ┌──────────────────────────────────────────┐  │ │
│  │     │  Street Address                          │  │ │
│  │     ├──────────────────────────────────────────┤  │ │
│  │     │  City         │  State  │  ZIP           │  │ │
│  │     └──────────────────────────────────────────┘  │ │
│  │                                                    │ │
│  │  ○  Pick up at a location                         │ │
│  │     ┌──────────────────────────────────────────┐  │ │
│  │     │  Select a pickup location          ▼     │  │ │
│  │     └──────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│              [ Place Order → ]                           │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Key Element Specs:**

| Element | Treatment |
|---------|----------|
| Page background | `neutral-50` (`#F8F9FA`) |
| Back link | `← Back` — routes to `/choose` (Fork). Same style as other new screens |
| Page heading | "Review & Order" — `text-h1` (28px/700), `neutral-900`, centered, `mb-6` |
| Content container | `max-w-[720px] mx-auto px-6` |

**Kit Summary Section:**

| Element | Treatment |
|---------|----------|
| Container | White card, `shadow-1`, `radius-lg` (16px), `p-6`, `mb-6` |
| Section label | "YOUR KIT" — `text-label` (14px/500), `neutral-400`, uppercase, letter-spacing 0.05em, `mb-4` |
| Subkit rows | White inner container, `neutral-200` border, `radius-md` (10px), divide-y `neutral-200` |
| Each subkit row | `px-4 py-3`, flex row: category icon (20px, category base color) + name (`text-body` 14px/400, `neutral-700`) + size badge (`text-caption` 12px/400, `neutral-500`, `ml-auto`) |
| Kit path label | Below subkit rows, `mt-3`: path name ("Essentials Kit" or "Custom Kit") + `·` separator + slot count — `text-caption` (12px/400), `neutral-400` |

**Delivery Section:**

| Element | Treatment |
|---------|----------|
| Container | White card, `shadow-1`, `radius-lg` (16px), `p-6`, `mb-8` |
| Section label | "DELIVERY" — `text-label` (14px/500), `neutral-400`, uppercase, letter-spacing 0.05em, `mb-4` |
| Radio options | Two radio buttons. Unselected: `neutral-300` circle. Selected: `brand-primary` filled circle. `text-body-lg` (16px/400), `neutral-700` label. `gap-4` between options |
| Address fields | Revealed when "Deliver to my address" is selected. `mt-3 ml-6`. Standard text inputs: `neutral-200` border, `radius-md`, `px-3 py-2`, `text-body` (14px/400). Full-width Street Address; City/State/ZIP in 3-column row `gap-3`. Placeholder text in `neutral-400` |
| Pickup selector | Revealed when "Pick up at a location" is selected. `mt-3 ml-6`. Dropdown/select: `neutral-200` border, `radius-md`, `px-3 py-2`, `text-body`. Placeholder: "Select a pickup location". Populated with mock locations for prototype |
| Default state | "Deliver to my address" pre-selected; address fields visible |

**Mock pickup locations (prototype):**
- "Downtown Emergency Supply Center"
- "Westside Community Hub"
- "County Emergency Management Office"

**Place Order CTA:**

| Element | Treatment |
|---------|----------|
| Button | `PrimaryButton` — `brand-primary` fill, white text, full-width (max-w-sm centered) |
| Label | "Place Order →" |
| Behavior (prototype) | On click: navigate to `/confirmation` (existing OrderConfirmationScreen). No real fulfillment. |
| Disabled state | Disabled if delivery option requires input and fields are empty. For prototype: always enabled once a delivery option is selected |

**Content for both paths:**
- **Essentials path:** Kit summary shows the 4 Essentials bundle subkits. Path label: "Essentials Kit". Bundle sourced from `ESSENTIALS_BUNDLE` constant.
- **Build My Own path:** Kit summary shows user-selected subkits from kit store. Path label: "Custom Kit". Data sourced from existing `selectedSubkits` in kit store.

**Sprint 1 prototype note:** The Review & Order page is a demonstration surface. Address validation, real fulfillment, and payment processing are out of scope. Input fields accept any text. The "Place Order" CTA navigates to the existing confirmation screen as a prototype endpoint.

---

## 5. Component Library

### New Component Summary

| Component | Screens | Key States |
|-----------|---------|------------|
| MCQTile | MCQ-1, MCQ-2 | Unselected, Selected, Disabled |
| MCQNotaTile | MCQ-2 | Unselected, Selected |
| MCQStepIndicator | MCQ-1, MCQ-2 | Step 1 of 2, Step 2 of 2 |
| ForkCard | F1 | Default, Hover |
| BundlePreview | F1 (Essentials card) | Static |
| KitSummaryCard | RO | Essentials variant, Custom variant |
| DeliverySection | RO | Deliver selected, Pickup selected |
| BackLink | MCQ-1, MCQ-2, F1, RO | Static |

---

### MCQTile

Reusable multi-select tile for MCQ questions. Used for all standard options on both Q1 and Q2.

```typescript
interface MCQTileProps {
  label: string;
  icon: string;             // lucide-react icon name
  selected: boolean;
  disabled?: boolean;       // default false
  disabledLabel?: string;   // e.g., "Coming Soon"
  onClick: () => void;
}
```

| State | Background | Border | Text Color | Icon Color |
|-------|-----------|--------|------------|------------|
| Unselected | `#FFFFFF` | 2px `#E5E7EB` | `#374151` | `#6B7280` |
| Selected | `#E8F5EE` | 2px `#1F4D35` | `#1F4D35` | `#1F4D35` |
| Disabled | `#F3F4F6` | 2px `#E5E7EB` | `#9CA3AF` | `#9CA3AF` |

- Dimensions: min-height 72px, `radius-md` (10px), `px-4 py-3`
- Layout: `flex items-center gap-3` — icon (24px) left, label center-left
- Selected checkmark: `brand-accent` (`#22C55E`) circle (20px) with white check, positioned absolute top-right (`top-2 right-2`)
- Disabled badge: pill right-aligned, `neutral-200` bg, `neutral-400` text, `text-caption`
- Touch target: entire tile is clickable, min 44px height
- Hover (non-disabled): `shadow-1` transition 150ms
- Cursor: `pointer` (default), `not-allowed` (disabled)

---

### MCQNotaTile

"None of the Above" tile variant. Text-only, no icon, full-width, visually distinct from standard tiles.

```typescript
interface MCQNotaTileProps {
  selected: boolean;
  onClick: () => void;
}
```

| State | Background | Border | Text Color |
|-------|-----------|--------|------------|
| Unselected | `#FFFFFF` | 2px `#E5E7EB` | `#6B7280` |
| Selected | `#F3F4F6` | 2px `#374151` | `#374151` |

- Dimensions: min-height 56px, full-width (spans grid), `radius-md` (10px), `px-4 py-3`
- Layout: `flex items-center justify-center` — label centered
- Selected checkmark: `neutral-700` (`#374151`) circle (not green) — distinct from standard tile
- Separated from main grid by `neutral-200` 1px divider with `my-4` spacing

---

### MCQStepIndicator

Lightweight "Step X of 2" text indicator for MCQ screens only. Not related to the main `StepProgressIndicator`.

```typescript
interface MCQStepIndicatorProps {
  currentStep: 1 | 2;
  totalSteps: 2;
}
```

- Text: "Step {currentStep} of {totalSteps}" — `text-caption` (12px/400), `neutral-400`
- Position: top-right of content area, same line as BackLink (flex row, justify-between)

---

### ForkCard

Presentational card for the fork screen. Both instances share the same structural shell; content is passed as children or via props.

```typescript
interface ForkCardProps {
  icon: string;              // lucide-react icon name
  heading: string;
  children: React.ReactNode; // body content (copy, badge, bundle preview, feature list)
  ctaLabel: string;
  onCtaClick: () => void;
}
```

- Card shell: white bg, 1px `neutral-200` border, `radius-lg` (16px), `shadow-1`, `p-6`
- Hover: `shadow-2`, transition 150ms standard
- Icon: 40px, `brand-primary`, `mb-4`
- Heading: `text-h2` (22px/600), `neutral-900`, `mb-2`
- CTA: `PrimaryButton`, full-width within card, `mt-6`
- Width: `flex-1` in parent flex container (equal width)

---

### BundlePreview

Static display of the Essentials bundle contents. Used inside the Essentials ForkCard.

```typescript
interface BundlePreviewProps {
  bundle: EssentialsBundleItem[]; // from essentialsConfig.ts
}
```

- Container: `neutral-50` bg, `radius-md`, `p-3`
- Each row: flex row, `gap-2`, `py-1`. Category icon (16px, category base color) + name (`text-body` 14px, `neutral-700`) + size label (`text-caption` 12px, `neutral-500`, `ml-auto`)
- Dividers: none between rows — spacing (`gap-2`) is sufficient

---

### BackLink

Consistent back navigation used on all four new screens.

```typescript
interface BackLinkProps {
  to: string;               // route path
  label?: string;           // default "Back"
}
```

- Text: `← {label}` — `text-label` (14px/500), `neutral-500`
- Hover: `neutral-700`, transition 100ms
- Position: top-left of content area, flex row with MCQStepIndicator (on MCQ screens) or standalone
- Uses React Router `<Link>` — not `window.history.back()`
- `mb-6` below before page heading

---

## 6. Accessibility Requirements

All Phase 3 Sprint 1 screens conform to **WCAG 2.1 Level AA** per the base spec. The following are additive requirements for the new screens.

### MCQ Tile Accessibility

**Semantic structure:**
```html
<fieldset>
  <legend>What type of emergency are you prepping for?</legend>
  <div role="group" class="tile-grid">
    <button role="checkbox" aria-checked="true" aria-label="Flood">
      <!-- icon + label -->
    </button>
    <button role="checkbox" aria-checked="false" aria-disabled="true"
            aria-label="Extreme Heat, Coming Soon">
      <!-- icon + label + badge -->
    </button>
  </div>
</fieldset>
```

- Each MCQ question is wrapped in `<fieldset>` with `<legend>`
- Each tile uses `role="checkbox"` with `aria-checked` reflecting selection state
- Disabled tiles use `aria-disabled="true"` (not HTML `disabled`) — tile remains in tab order for discoverability
- "None of the Above" uses the same `role="checkbox"` pattern

### Keyboard Navigation

| Screen | Tab Order | Special Behavior |
|--------|-----------|------------------|
| MCQ-1 | Back link → Tiles (left-to-right, top-to-bottom) → Next CTA | Space/Enter toggles tile selection |
| MCQ-2 | Back link → Standard tiles → NOTA tile → Next CTA | Space/Enter toggles; NOTA mutex is immediate |
| Fork | Back link → Essentials card CTA → Build My Own card CTA | Enter activates card CTA |
| Review & Order | Back link → Kit summary (read-only) → Delivery radios → Address/Pickup fields → Place Order CTA | Arrow keys switch radio; Tab moves to input fields |

### ARIA Live Regions

| Event | Announcement | Type |
|-------|-------------|------|
| Q1 tile selected | "[Type] selected." | `polite` |
| Q1 tile deselected | "[Type] deselected." | `polite` |
| Q2 tile selected | "[Option] selected." | `polite` |
| Q2 NOTA selected | "None of the Above selected. All other options cleared." | `polite` |
| Q2 NOTA deselected | "None of the Above deselected." | `polite` |
| Next CTA enabled | "You can now proceed to the next step." | `polite` |
| Fork card activated | "Navigating to [destination]." | `assertive` |

### Focus Management

```typescript
// On screen transition, focus the page heading
useEffect(() => {
  headingRef.current?.focus();
}, [location.pathname]);
```

- Each new screen focuses its `<h1>` on mount via `tabIndex={-1}` + `ref.focus()`
- Fork card CTAs do not auto-focus — user navigates via Tab
- Review & Order: focus moves to heading on arrival; delivery radio group is standard tab-order

### Color Contrast Verification

| Context | Foreground | Background | Ratio | Status |
|---------|-----------|------------|-------|--------|
| Selected tile text on brand-primary-light | `#1F4D35` | `#E8F5EE` | ~8.5:1 | PASS |
| NOTA selected text on neutral-100 | `#374151` | `#F3F4F6` | ~9.5:1 | PASS |
| Disabled tile text on neutral-100 | `#9CA3AF` | `#F3F4F6` | ~2.3:1 | PASS (WCAG exception for disabled) |
| Trust badge text on brand-primary-light | `#1F4D35` | `#E8F5EE` | ~8.5:1 | PASS |
| Step indicator on neutral-50 | `#9CA3AF` | `#F8F9FA` | ~2.1:1 | Decorative — non-essential info |

---

## 7. Animation & Micro-interactions

All animations use existing motion tokens from the base spec. `prefers-reduced-motion: reduce` is respected — all durations collapse to 0.01ms.

### New Animations

| # | Animation | Trigger | Duration | Easing | Properties |
|---|-----------|---------|----------|--------|------------|
| 21 | MCQ tile select | Tile clicked | 150ms | standard | `border-color`, `background-color`; checkmark scales in from 0 → 1 (80ms delay, spring easing) |
| 22 | MCQ tile deselect | Tile clicked | 130ms | accelerate | Reverse of select; checkmark scales out |
| 23 | NOTA mutex clear | NOTA selected or deselected | 150ms | standard | All affected tiles transition simultaneously |
| 24 | CTA enable | Validation met | 200ms | decelerate | `background-color` transitions from `neutral-300` to `brand-primary`; `opacity: 0.6` → `1` |
| 25 | Fork card hover | Mouse enter | 150ms | standard | `box-shadow` transitions from `shadow-1` to `shadow-2` |
| 26 | Fork card press | Mouse down | 80ms | accelerate | `transform: scale(0.99)` — subtle press feedback |
| 27 | Screen transition (MCQ) | Next/Back clicked | 240ms | standard | Same as existing Animation #16/#17 — exit translateX + fade, enter from opposite side |
| 28 | Delivery option reveal | Radio selected | 180ms | decelerate | `max-height: 0` → measured; `opacity: 0` → `1` (same pattern as SizeToggle #5) |

---

## 8. Responsiveness Strategy

### MCQ Screens (MCQ-1, MCQ-2)

| Property | Desktop (≥1024px) | Tablet (768–1023px) | Mobile (< 768px) |
|----------|-------------------|---------------------|-------------------|
| Content max-width | 640px centered | 640px centered | 100% with `px-6` |
| Tile grid columns | 2 | 2 | 2 (tiles scale down) |
| Tile min-height | 72px | 72px | 64px |
| Extreme Heat tile | Spans 2 cols | Spans 2 cols | Spans 2 cols |
| NOTA tile | Full-width | Full-width | Full-width |

**Mobile note:** Phase 3 screens are designed mobile-first. Unlike the existing builder flow (which shows `MobileInterstitial` below 768px), the MCQ, Fork, and Review & Order screens work at all viewport widths. The `MobileInterstitial` guard should NOT apply to Phase 3 routes.

### Fork Screen (F1)

| Property | Desktop (≥768px) | Mobile (< 768px) |
|----------|-------------------|-------------------|
| Content max-width | 800px centered | 100% with `px-6` |
| Card layout | Side-by-side (`flex-row gap-6`) | Stacked (`flex-col gap-4`) |
| Card width | `flex-1` (50% each) | Full-width |
| Card min-height | None — align via `items-stretch` | None |

### Review & Order (RO)

| Property | Desktop (≥1024px) | Tablet (768–1023px) | Mobile (< 768px) |
|----------|-------------------|---------------------|-------------------|
| Content max-width | 720px centered | 720px centered | 100% with `px-6` |
| Address fields | City/State/ZIP in 3-col row | 3-col row | City full-width; State/ZIP 2-col row |

---

## 9. Next Steps

### Immediate Actions

1. **Coordinate with Winston** — Confirm route naming (`/build`, `/build/household`, `/choose`, `/review`), MCQ store shape, `kitPath` field addition, and Review & Order stub approach
2. **Confirm icon availability** — Verify `Tornado`, `CloudRainWind`, `Accessibility`, `HeartHandshake`, `PawPrint`, `ShieldCheck`, `SlidersHorizontal` exist in the project's lucide-react version
3. **MobileInterstitial exemption** — Confirm with Winston that Phase 3 routes bypass the `MobileInterstitial` guard since these screens are mobile-first
4. **Hand off to James** — Stories 11.2 and 12.1 can begin implementation once Winston's architecture doc is finalized

### Design Handoff Checklist

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

### Sprint 2 Forward-Looking Notes

As noted in the brief, Sprint 2 will introduce visual distinction between MCQ-elevated subkits and user-selected subkits in the visualizer. The MCQ data model (locked in Sprint 1) will drive this. Sally will spec the visual treatment in the Sprint 2 front-end spec — keeping it in mind but not designing it now.

---

*Emergency Prep Kit Builder — Phase 3 Sprint 1 UI/UX Specification | Version 1.0 | 2026-04-13 | Sally, UX Expert*
