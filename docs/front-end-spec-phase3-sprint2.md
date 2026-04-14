# Emergency Prep Kit Builder — Phase 3 Sprint 2 UI/UX Specification (Addendum)

**Document version:** 1.0 | **Date:** 2026-04-13 | **Author:** Sally, UX Expert
**Status:** Complete — Sprint 2 scope (Pets subkit, visualizer refresh, MCQ surfacing, Build My Own order flow, confirmation)
**Extends:** `docs/front-end-spec-phase3.md` (Sprint 1 spec, v1.0)

---

## Scope

This document covers **Phase 3 Sprint 2 only** — modifications to the SubkitSelectionScreen layout, MCQ elevation visuals, Build My Own order wiring, and Order Confirmation updates. It extends the Sprint 1 spec and inherits all branding, typography, color, spacing, and accessibility standards defined in the base spec (`docs/front-end-spec.md`) and Sprint 1 spec.

**Modified screens:**
- SubkitSelectionScreen (`/builder`) — Layout refresh, elevation sorting, visual distinction
- SummaryScreen (`/summary`) — "Get My Kit" CTA re-routed to `/review`
- ReviewOrderScreen (`/review`) — `KitSummaryCard` custom path implemented, path-aware back link
- OrderConfirmationScreen (`/confirmation`) — Dual-path support, "Fill Your Kit" CTA

**New components:**
- `ElevationBadge` — Visual indicator on MCQ-elevated subkits
- `ElevationGroupHeader` — Section header for elevated subkit group
- `CustomKitSummary` — Kit summary content for Build My Own path
- `FillKitStubModal` — Placeholder modal for Part 2 bridge

**Unchanged:** MCQ screens, Fork screen, Cover page, ItemConfigScreen, CustomSubkitScreen, all Sprint 1 components.

---

## 1. Decisions Log

All decisions are numbered to match the Sprint 2 Sally Prompt for cross-reference.

| # | Decision | Resolution |
|---|----------|------------|
| 1 | Side-by-side column ratio | **40 / 60** — visualizer left (40%), subkit card list right (60%). The visualizer is a compact visual anchor; the card list needs scroll room. At 1024px minimum, left column is ~400px (ample for the housing unit), right column is ~600px (comfortable single-column card width). |
| 2 | SubkitCard compact variant? | **No compact variant needed.** At ~580px effective width in the right panel, the existing SubkitCard layout (icon + name + description + size toggle) renders comfortably. Cards scale within their existing flex layout. On tablet/mobile stacked view, the 2-column grid uses the same card component at narrower widths — the existing min-width and text truncation handle this gracefully. |
| 3 | Slot usage indicator positioning | **Pinned under the visualizer in the left column.** SlotUsageBar, SlotFullIndicator, and "Configure Items" CTA stay in the left column below the housing unit. Mental model: left = your kit state + actions, right = options to browse. On stacked mobile, these elements sit between the visualizer and the card list. |
| 4 | Stacked breakpoint | **Confirmed at >=1024px for side-by-side.** Below 1024px, layout stacks (visualizer top, cards below). This aligns with the existing `MobileInterstitial` guard at 768px — between 768–1023px users see a stacked but functional layout. |
| 5 | Existing color changes? | **No changes to existing colorBase/colorTint values.** All 9 existing category colors are well-differentiated and established. Changing them creates unnecessary visual disruption and test churn. Sprint 2 color work is additive only (Pets). |
| 6 | Pets subkit colors | **colorBase: `#BE185D`** (rose-700), **colorTint: `#FFF1F2`** (rose-50). Rose/pink is the only warm-spectrum family not yet claimed. Visually distinct from all 9 existing categories. Contrast ratio `#BE185D` on `#FFF1F2` is ~6.2:1 (PASS AA). |
| 7 | ElevationBadge unselected+elevated | **Badge pill + left border accent.** Card receives a 3px left border in `#22C55E` (brand-accent). An inline pill badge reading "Suggested for you" appears below the category name. No background tint change — card stays white. See Section 4 wireframe for exact positioning. |
| 8 | Selected+elevated state | **Badge disappears entirely.** When the user selects an elevated subkit, the standard selection styling takes over (colorTint background, colorBase border, checkmark). The elevation badge and left border accent are removed. The user's active choice is the only visual signal. |
| 9 | Elevation badge WCAG text label | **"Suggested for you"** — clear, personal, non-prescriptive. Avoids "Recommended" (too authoritative) and "Based on your answers" (too wordy). Paired with the `brand-accent` left border, this meets WCAG 2.1 AA distinction-without-color-alone. |
| 10 | Elevated group separator | **Section header + spacing gap.** A small header "Suggested for your situation" (`text-caption`, `neutral-500`) appears above the elevated group. A `16px` spacing gap separates the elevated group from the non-elevated group below. No divider line — the header + gap is sufficient and cleaner. All elevated subkits (Q2 and Q1) appear under this single header. |
| 11 | Screen reader aria-label | **Confirmed: "[Name] — Suggested for your situation"** (e.g., "Power — Suggested for your situation"). Applied via `aria-label` on the card's root button/container. Non-elevated cards retain their existing label (category name only). |
| 12 | CustomKitSummary row layout | **Two-line row extending the Essentials pattern.** Top line: category color dot + name + size badge (matches Essentials). Bottom line: item count + dot separator + subtotal in `text-caption neutral-500`. See Section 4 wireframe. |
| 13 | "Custom Kit" heading treatment | **Yes — same treatment as "Essentials Kit."** Path label in the card footer uses identical `text-caption` (12px/400), `neutral-400` styling. "Custom Kit · N slots used" mirrors "Essentials Kit · 5 slots used". |
| 14 | Confirmation page heading | **Universal heading, path-specific subheading.** Heading: "Your kit is on its way." (both paths). Subheading: "Here's your Essentials Kit summary." (essentials) / "Here's your custom kit summary." (custom). |
| 15 | "Now Let's Fill Your Kit" CTA | **Primary button**, full-width (`max-w-sm` centered), positioned below kit total with `mt-6`. `brand-primary` fill, white text. Copy: **"Now Let's Fill Your Kit →"**. "Start Over" remains below as secondary. |
| 16 | "Fill Your Kit" stub treatment | **Option (c) — Modal.** Tapping the CTA opens a centered modal with a forward-looking message. Feels intentional and optimistic, not broken. See Section 4 for modal spec. |
| 17 | Back link label from `/review` | **Path-aware label.** Essentials: `← Back` (routes to `/choose`). Custom: `← Back to Kit Summary` (routes to `/summary`). The more specific label orients returning custom-path users. |
| 18 | Copy: Elevation badge label | "Suggested for you" |
| 19 | Copy: Elevation group header | "Suggested for your situation" |
| 20 | Copy: Fill Your Kit CTA | "Now Let's Fill Your Kit →" |
| 21 | Copy: Confirmation subheading | Essentials: "Here's your Essentials Kit summary." / Custom: "Here's your custom kit summary." |
| 22 | Copy: Stub modal | Heading: "Coming Soon" / Body: "We're building the next phase of your emergency prep experience. Check back soon to fill your kit with recommended products." / CTA: "Got It" |

---

## 2. Information Architecture

### 2.1 Updated Site Map (Sprint 2 Additions)

No new routes are added in Sprint 2. The existing route structure is unchanged. Sprint 2 modifies behavior and content on existing routes.

| ID | Screen | Route | Sprint 2 Change |
|----|--------|-------|-----------------|
| S0 | Cover / Landing Page | `/` | "Start Over" target (from confirmation) |
| MCQ-1 | MCQ: Emergency Type | `/build` | Unchanged |
| MCQ-2 | MCQ: Household | `/build/household` | Unchanged |
| F1 | Fork Screen | `/choose` | Unchanged |
| RO | Review & Order | `/review` | Custom path `KitSummaryCard`, path-aware back link |
| S1 | Subkit Selection | `/builder` | **Layout refresh**, **elevation sorting**, **visual distinction**, **Pets subkit** |
| S2 | Item Configuration | `/configure/:subkitId` | Unchanged (Pets items available via data) |
| S2-C | Custom Subkit Browser | `/configure/custom` | Unchanged |
| S3 | Summary Page | `/summary` | "Get My Kit" CTA re-routed to `/review` |
| S4 | Order Confirmation | `/confirmation` | **Dual-path support**, **"Fill Your Kit" CTA**, "Start Over" → `/` |

### 2.2 Updated Navigation

**Build My Own Path (Sprint 2 — now complete end-to-end):**
```
S0 (Cover) → MCQ-1 → MCQ-2 → F1 (Fork) → S1 (Builder) → S2 × N → S3 (Summary) → RO (Review & Order) → S4 (Confirmation)
```

**Back navigation chain (Custom path):**
```
S4 → (no back link) | RO → S3 (Summary) → S1 (Builder) → F1 → MCQ-2 → MCQ-1 → S0
```

**Back navigation chain (Essentials path — unchanged from Sprint 1):**
```
S4 → (no back link) | RO → F1 → MCQ-2 → MCQ-1 → S0
```

**Key Sprint 2 routing changes:**
- SummaryScreen "Get My Kit" CTA → sets `kitPath: 'custom'` → navigates to `/review`
- ReviewOrderScreen back link → path-aware: `essentials` → `/choose`, `custom` → `/summary`
- OrderConfirmationScreen "Start Over" → `/` (both paths), calls `resetKit()` + `resetMCQ()`
- OrderConfirmationScreen "Now Let's Fill Your Kit" → opens `FillKitStubModal`

---

## 3. User Flows

### Flow 10: Build My Own — End-to-End (Sprint 2 Primary)

**Goal:** Complete MCQ, build custom kit, review, and place order
**Success:** User arrives at Order Confirmation with custom kit summary displayed

Key path:
1. Land on S0 (Cover) → "Build My Kit" → MCQ-1 → MCQ-2 → Fork
2. Click "Build My Own Kit" → Navigate to `/builder`
3. **Sprint 2:** Elevated subkits appear at top of list with "Suggested for you" badges
4. Select subkits → configure items → arrive at `/summary`
5. Click "Get My Kit" → `kitPath` set to `'custom'` → Navigate to `/review`
6. Review & Order displays custom `KitSummaryCard` with user's selections
7. Select delivery option → Click "Place Order" → Navigate to `/confirmation`
8. Confirmation shows custom kit summary + "Now Let's Fill Your Kit" CTA

**Edge cases:**
- Back from `/review` (custom) → returns to `/summary` (not `/choose`)
- "Start Over" from confirmation → resets kit + MCQ, navigates to `/`
- "Now Let's Fill Your Kit" → opens stub modal

### Flow 11: MCQ Elevation — Subkit Surfacing

**Goal:** MCQ answers visually prioritize relevant subkits in the visualizer
**Success:** User sees suggested subkits at top of list with clear visual distinction

Key states:
- Flood + Pets selected in MCQ → Power, Communications, Cooking (Q1-elevated) + Pets (Q2-elevated) appear at top
- Q2-elevated subkits appear first within elevated group (Pets above Power/Comms/Cooking)
- Elevated cards show "Suggested for you" badge + green left border accent
- User selects an elevated subkit → badge disappears, standard selection styling takes over
- User selects a non-elevated subkit → no elevation indicators, standard behavior
- Direct navigation to `/builder` without MCQ → default catalog order, no elevation

### Flow 12: "Fill Your Kit" Stub

**Goal:** Bridge to Part 2 without feeling broken
**Success:** User taps CTA, sees forward-looking modal, dismisses and remains on confirmation

Key states:
1. User on confirmation screen → "Now Let's Fill Your Kit →" button visible below kit total
2. Click CTA → modal opens with "Coming Soon" heading and encouraging message
3. Click "Got It" or click outside modal → modal closes, user remains on confirmation
4. "Start Over" remains available as secondary action

---

## 4. Wireframes & Mockups

All screens inherit the existing design system. No new design tokens are introduced — Sprint 2 uses existing brand, neutral, semantic, and category color tokens.

---

### Screen S1 (Modified): SubkitSelectionScreen — Layout Refresh + Elevation

**Route:** `/builder` — Existing route, new layout.

**Desktop Layout (>=1024px):** Side-by-side. Visualizer left (40%), subkit card list right (60%).

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ← Back                                                                 │
│                                                                         │
│         "Build Your Emergency Kit"                                      │
│                                                                         │
│  ┌──────────────────────────┐  ┌──────────────────────────────────────┐ │
│  │                          │  │  Suggested for your situation        │ │
│  │   ┌────────────────────┐ │  │                                      │ │
│  │   │  [Housing Unit     │ │  │  ┌──────────────────────────────┐   │ │
│  │   │   Visualizer]      │ │  │  │ ▌🐾 Pets                    │   │ │
│  │   │                    │ │  │  │ ▌ Essential supplies for...  │   │ │
│  │   │   6 slots          │ │  │  │ ▌ ⌜Suggested for you⌝       │   │ │
│  │   │   shown            │ │  │  └──────────────────────────────┘   │ │
│  │   │                    │ │  │  ┌──────────────────────────────┐   │ │
│  │   └────────────────────┘ │  │  │ ▌⚡ Power                   │   │ │
│  │                          │  │  │ ▌ Portable power for...     │   │ │
│  │  ┌─────────────────────┐ │  │  │ ▌ ⌜Suggested for you⌝       │   │ │
│  │  │ ■■■□□□ 2/6 slots   │ │  │  └──────────────────────────────┘   │ │
│  │  └─────────────────────┘ │  │  ┌──────────────────────────────┐   │ │
│  │                          │  │  │ ▌📡 Communications           │   │ │
│  │  [ Configure Items → ]   │  │  │ ▌ Stay connected...         │   │ │
│  │                          │  │  │ ▌ ⌜Suggested for you⌝       │   │ │
│  └──────────────────────────┘  │  └──────────────────────────────┘   │ │
│                                │                                      │ │
│                                │         ← 16px gap →                 │ │
│                                │                                      │ │
│                                │  ┌──────────────────────────────┐   │ │
│                                │  │  🔦 Lighting                 │   │ │
│                                │  │  Reliable light sources...   │   │ │
│                                │  └──────────────────────────────┘   │ │
│                                │  ┌──────────────────────────────┐   │ │
│                                │  │  🍳 Cooking                  │   │ │
│                                │  │  Cook and prepare food...    │   │ │
│                                │  └──────────────────────────────┘   │ │
│                                │  ... (remaining non-elevated)        │ │
│                                └──────────────────────────────────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Stacked Layout (<1024px):** Visualizer top, cards below in 2-column grid.

```
┌──────────────────────────────────────────┐
│  ← Back                                  │
│                                          │
│       "Build Your Emergency Kit"         │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  [Housing Unit Visualizer]         │  │
│  │  ■■■□□□ 2/6 slots                 │  │
│  │  [ Configure Items → ]            │  │
│  └────────────────────────────────────┘  │
│                                          │
│  Suggested for your situation            │
│                                          │
│  ┌───────────────┐ ┌───────────────┐    │
│  │ ▌🐾 Pets      │ │ ▌⚡ Power     │    │
│  │ ▌ Suggested   │ │ ▌ Suggested   │    │
│  └───────────────┘ └───────────────┘    │
│  ┌───────────────┐                       │
│  │ ▌📡 Comms     │                       │
│  │ ▌ Suggested   │                       │
│  └───────────────┘                       │
│                                          │
│  ┌───────────────┐ ┌───────────────┐    │
│  │ 🔦 Lighting   │ │ 🍳 Cooking    │    │
│  └───────────────┘ └───────────────┘    │
│  ...                                     │
└──────────────────────────────────────────┘
```

**Key Element Specs — Desktop Layout:**

| Element | Treatment |
|---------|----------|
| Page background | `neutral-50` (`#F8F9FA`) |
| Content container | `max-w-[1120px] mx-auto px-6` |
| Layout grid | `flex gap-8` (32px) on desktop; `flex-col gap-6` below 1024px |
| Left column | `w-[40%]` — sticky at `top-6` so visualizer stays visible while scrolling cards |
| Right column | `w-[60%]` — scrollable, `overflow-y: auto` |
| Back link | `← Back` — routes to `/choose`. Same style as Sprint 1 screens |
| Page heading | "Build Your Emergency Kit" — `text-h1` (28px/700), `neutral-900`, centered, `mb-6` |

**Left Column Elements:**

| Element | Treatment |
|---------|----------|
| HousingUnitVisualizer | Unchanged internally. Container: `w-full`, centered within left column |
| SlotUsageBar | Below visualizer, `mt-4`. Existing component, no changes |
| SlotFullIndicator | Conditionally rendered below SlotUsageBar when at capacity. Existing component |
| "Configure Items" CTA | `PrimaryButton`, full-width within left column, `mt-4`. Disabled until >=3 subkits selected |

**Right Column — Card List:**

| Element | Treatment |
|---------|----------|
| Desktop | Single-column scrollable list. Each SubkitCard is full-width within the column |
| Tablet/Mobile (<1024px) | 2-column grid, `gap-3` (12px). Same grid pattern as current layout |
| Elevation group header | "Suggested for your situation" — `text-caption` (12px/400), `neutral-500`, `mb-3`, only rendered when elevated subkits exist |
| Elevation gap | `mb-4` (16px) after the last elevated card, before the first non-elevated card |
| Card ordering | Q2-elevated first → Q1-only elevated → non-elevated (default catalog order within each group) |

---

### ElevationBadge Visual Treatment

**Elevated + Unselected SubkitCard:**

| Property | Spec |
|----------|------|
| Left border | 3px solid `brand-accent` (`#22C55E`). Replaces the standard left edge of the card. Applied via `border-left: 3px solid #22C55E` |
| Badge pill | Inline below category name, before description. `text-caption` (12px/400), `brand-primary` (`#1F4D35`) text on `brand-primary-light` (`#E8F5EE`) background, `radius-full`, `px-2 py-0.5`, `mt-1 mb-1` |
| Badge copy | "Suggested for you" |
| Badge icon | `Sparkles` from lucide-react, 10px, `brand-primary`, inline before text with `mr-1` |
| Card background | `#FFFFFF` (unchanged from standard unselected) |
| Card border (other 3 sides) | 2px solid `neutral-200` (`#E5E7EB`) — standard unselected |

**Elevated + Selected SubkitCard:**

| Property | Spec |
|----------|------|
| Left border | Removed — replaced by standard selected border: 2px solid `colorBase` (all 4 sides) |
| Badge pill | **Hidden** (`display: none`) — user's active selection is the primary signal |
| Card background | `colorTint` — standard selected state |
| Checkmark | Standard selection checkmark (top-right, `brand-accent` circle) |
| All other styling | Identical to non-elevated selected state |

**Not Elevated SubkitCard:**

| Property | Spec |
|----------|------|
| All styling | Unchanged from existing Sprint 1 behavior. No badge, no border accent |

**Contrast Verification — ElevationBadge:**

| Context | Foreground | Background | Ratio | Status |
|---------|-----------|------------|-------|--------|
| Badge text on brand-primary-light | `#1F4D35` | `#E8F5EE` | ~8.5:1 | PASS |
| Left border accent on white card | `#22C55E` | `#FFFFFF` | ~2.5:1 | Decorative — text label provides non-color distinction |

---

### Pets Subkit Color Spec

| Property | Value | Notes |
|----------|-------|-------|
| `colorBase` | `#BE185D` (rose-700) | Deep pink/rose — distinct from all 9 existing categories |
| `colorTint` | `#FFF1F2` (rose-50) | Light rose for card/section backgrounds |
| `icon` | `PawPrint` | Confirmed available in lucide-react (Sprint 1 arch Section 8.5) |

**Contrast Verification — Pets:**

| Context | Foreground | Background | Ratio | Status |
|---------|-----------|------------|-------|--------|
| colorBase on colorTint (selected card) | `#BE185D` | `#FFF1F2` | ~6.2:1 | PASS |
| colorBase on white (icon/text) | `#BE185D` | `#FFFFFF` | ~5.6:1 | PASS AA |
| colorBase on neutral-50 (visualizer slot) | `#BE185D` | `#F8F9FA` | ~5.4:1 | PASS AA |

**Full Category Color Palette (Sprint 2 — 10 categories):**

| Category | colorBase | colorTint | Icon | Status |
|----------|-----------|-----------|------|--------|
| Power | `#C2410C` | `#FFF7ED` | `Zap` | Unchanged |
| Lighting | `#A16207` | `#FEFCE8` | `Lightbulb` | Unchanged |
| Communications | `#1D4ED8` | `#EFF6FF` | `Radio` | Unchanged |
| Hygiene | `#0F766E` | `#F0FDFA` | `Droplets` | Unchanged |
| Cooking | `#15803D` | `#F0FDF4` | `UtensilsCrossed` | Unchanged |
| Medical | `#991B1B` | `#FEF2F2` | `HeartPulse` | Unchanged |
| Comfort | `#6D28D9` | `#F5F3FF` | `Smile` | Unchanged |
| Clothing | `#334155` | `#F8FAFC` | `Shirt` | Unchanged |
| Custom | `#3730A3` | `#EEF2FF` | `Settings2` | Unchanged |
| **Pets** | **`#BE185D`** | **`#FFF1F2`** | **`PawPrint`** | **New — Sprint 2** |

---

### Screen RO (Modified): ReviewOrderScreen — Custom Path

**Route:** `/review` — Existing route, now serves both Essentials and Custom paths.

**Layout:** Unchanged from Sprint 1 spec. Centered single-column, max-width 720px.

**Sprint 2 changes:**
1. `KitSummaryCard` renders custom path variant when `kitPath === 'custom'`
2. Back link is path-aware

**Custom KitSummaryCard Wireframe:**

```
┌────────────────────────────────────────────────────┐
│  YOUR KIT                                          │
│                                                    │
│  ┌──────────────────────────────────────────────┐ │
│  │  ⚡ Power                          Large     │ │
│  │     3 items · $74.97                         │ │
│  ├──────────────────────────────────────────────┤ │
│  │  🐾 Pets                          Regular    │ │
│  │     2 items · $43.98                         │ │
│  ├──────────────────────────────────────────────┤ │
│  │  🏥 Medical                       Regular    │ │
│  │     4 items · $89.96                         │ │
│  └──────────────────────────────────────────────┘ │
│                                                    │
│  Custom Kit  ·  4 slots used                      │
└────────────────────────────────────────────────────┘
```

**Custom KitSummaryCard Row Spec:**

| Element | Treatment |
|---------|----------|
| Row container | `px-4 py-3`, `divide-y neutral-200` between rows |
| Top line | Flex row: category color dot (8px circle, `colorBase`, `mr-2`) + category name (`text-body` 14px/400, `neutral-700`) + size badge (`text-caption` 12px/400, `neutral-500`, `ml-auto`) |
| Bottom line | `mt-1`: item count + " · " + subtotal — `text-caption` (12px/400), `neutral-500`. E.g., "3 items · $74.97" |
| Empty state | If a subkit is selected but has 0 items configured: bottom line reads "No items configured" in `neutral-400` |

**Path Label:**

| Path | Label | Slot Count |
|------|-------|------------|
| Essentials | "Essentials Kit · 5 slots used" | Computed from `ESSENTIALS_BUNDLE` |
| Custom | "Custom Kit · N slots used" | Computed from `calculateTotalSlots` |

**Back Link (Path-Aware):**

| Path | Label | Route |
|------|-------|-------|
| Essentials | `← Back` | `/choose` |
| Custom | `← Back to Kit Summary` | `/summary` |

---

### Screen S4 (Modified): OrderConfirmationScreen — Dual-Path + Fill Kit CTA

**Route:** `/confirmation` — Existing route, now serves both paths.

**Layout:** Centered single-column, max-width 960px (unchanged).

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│              ✓  "Your kit is on its way."                │
│                                                          │
│         "Here's your custom kit summary."                │
│                  (or Essentials)                          │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  SubkitSummarySection × N                          │ │
│  │  (path-appropriate content)                        │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Kit Total: $XXX.XX                                │ │
│  │  Containers included · Items priced individually   │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│       [ Now Let's Fill Your Kit → ]  ← primary           │
│                                                          │
│            [ Start Over ]  ← secondary                   │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Key Element Specs:**

| Element | Treatment |
|---------|----------|
| Page heading | "Your kit is on its way." — `text-display` (36px/700), `neutral-900`, centered. Preceded by `brand-accent` (`#22C55E`) checkmark circle (48px), `mb-4` |
| Subheading | Path-specific — `text-body-lg` (16px/400), `neutral-500`, centered, `mb-8` |
| Kit summary | **Essentials:** renders `ESSENTIALS_BUNDLE` subkits via existing `SubkitSummarySection`. **Custom:** renders user's `selectedSubkits` + `itemSelections` from kit store via `SubkitSummarySection` |
| Kit total | Same as existing: `text-h2` (22px/600), `neutral-900`, right-aligned. Note below in `text-caption`, `neutral-400` |
| "Fill Your Kit" CTA | `PrimaryButton` — `brand-primary` fill, white text, `max-w-sm` centered, full-width within max-w, `mt-6`. Label: "Now Let's Fill Your Kit →" |
| "Start Over" CTA | `SecondaryButton` — `neutral-200` border, `neutral-700` text, `max-w-sm` centered, full-width within max-w, `mt-3`. Label: "Start Over". On click: `resetKit()` + `resetMCQ()` → navigate to `/` |

**Path Branching:**

| Element | Essentials Path | Custom Path |
|---------|----------------|-------------|
| Subheading | "Here's your Essentials Kit summary." | "Here's your custom kit summary." |
| Kit summary source | `ESSENTIALS_BUNDLE` | `useKitStore().selectedSubkits` + `itemSelections` |
| Kit total source | Bundle pricing | Kit store pricing |
| "Fill Your Kit" CTA | Present | Present |
| "Start Over" route | `/` | `/` |

---

### FillKitStubModal

**Trigger:** "Now Let's Fill Your Kit →" CTA on OrderConfirmationScreen.

```
┌──────────────────────────────────────────┐
│                                          │
│              📦                           │
│                                          │
│          "Coming Soon"                   │
│                                          │
│   We're building the next phase of       │
│   your emergency prep experience.        │
│   Check back soon to fill your kit       │
│   with recommended products.             │
│                                          │
│           [ Got It ]                     │
│                                          │
└──────────────────────────────────────────┘
```

**Modal Specs:**

| Element | Treatment |
|---------|----------|
| Overlay | `rgba(0,0,0,0.4)`, covers full viewport, click-to-dismiss |
| Modal container | White bg, `radius-lg` (16px), `shadow-3`, `p-8`, `max-w-[400px]`, centered vertically and horizontally |
| Icon | `Package` from lucide-react, 48px, `brand-primary` (`#1F4D35`), centered, `mb-4` |
| Heading | "Coming Soon" — `text-h2` (22px/600), `neutral-900`, centered, `mb-3` |
| Body | "We're building the next phase of your emergency prep experience. Check back soon to fill your kit with recommended products." — `text-body-lg` (16px/400), `neutral-500`, centered, `mb-6` |
| CTA | "Got It" — `PrimaryButton`, `max-w-[200px]`, centered. Closes modal on click |
| Dismiss | Click overlay or press `Escape` → close modal |
| Focus trap | Focus locked within modal while open. On open: focus CTA button. On close: return focus to trigger button |

---

## 5. Component Library

### New Component Summary

| Component | Screens | Key States |
|-----------|---------|------------|
| ElevationBadge | SubkitSelectionScreen | Visible (elevated+unselected), Hidden (elevated+selected or not elevated) |
| ElevationGroupHeader | SubkitSelectionScreen | Rendered (elevated subkits exist), Hidden (no elevation) |
| CustomKitSummary | ReviewOrderScreen | Populated (subkits with items), Empty edge case |
| FillKitStubModal | OrderConfirmationScreen | Open, Closed |

### Modified Component Summary

| Component | Change |
|-----------|--------|
| SubkitCard | New `elevated?: boolean` prop; renders `ElevationBadge` conditionally; left border accent when elevated+unselected |
| SubkitSelectionScreen | Layout refresh (vertical → horizontal); elevation sorting; `ElevationGroupHeader` rendering |
| KitSummaryCard | Custom path implementation via `CustomKitSummary`; path-aware data source |
| SummaryScreen | "Get My Kit" CTA re-routed to `/review` with `kitPath: 'custom'` |
| OrderConfirmationScreen | Dual-path branching; "Fill Your Kit" CTA; "Start Over" → `/`; `FillKitStubModal` |
| ReviewOrderScreen | Path-aware `BackLink` label and route |

---

### ElevationBadge

Inline badge indicating MCQ-driven elevation. Rendered inside SubkitCard, below the category name.

```typescript
interface ElevationBadgeProps {
  visible: boolean;  // elevated && !selected
}
```

| State | Rendering |
|-------|-----------|
| `visible: true` | Pill badge: `Sparkles` icon (10px) + "Suggested for you" text. `brand-primary` text on `brand-primary-light` bg, `radius-full`, `px-2 py-0.5` |
| `visible: false` | Not rendered (`null`) |

- Font: `text-caption` (12px/400)
- Spacing: `mt-1 mb-1` — sits between category name and description
- Icon: `Sparkles` from lucide-react, 10px, `brand-primary`, `mr-1` inline with text
- No hover state — badge is informational only

---

### ElevationGroupHeader

Section header rendered above the elevated subkit group in the card list.

```typescript
interface ElevationGroupHeaderProps {
  visible: boolean;  // true when any elevated subkits exist
}
```

- Text: "Suggested for your situation" — `text-caption` (12px/400), `neutral-500`
- Spacing: `mb-3` below header, `mb-4` (16px) gap after last elevated card
- Only rendered when `computeElevatedSubkits` returns a non-empty set
- Not rendered when MCQ store is empty (direct `/builder` navigation)

---

### CustomKitSummary

Content renderer for the custom path variant of `KitSummaryCard`. Replaces the Essentials bundle display.

```typescript
interface CustomKitSummaryProps {
  selectedSubkits: SelectedSubkit[];
  itemSelections: Record<string, ItemSelection[]>;
}
```

- Renders a list of subkit rows within the existing `KitSummaryCard` card shell
- Each row: two lines (see Decision #12 and Section 4 wireframe)
  - Line 1: color dot (8px, `colorBase`) + name (`text-body`, `neutral-700`) + size badge (`text-caption`, `neutral-500`, `ml-auto`)
  - Line 2: `text-caption` (12px/400), `neutral-500`. Format: `"{N} items · ${XX.XX}"`. Zero items: `"No items configured"` in `neutral-400`
- Rows separated by `divide-y neutral-200`
- Footer: "Custom Kit · N slots used" — `text-caption` (12px/400), `neutral-400`, `mt-3`

---

### FillKitStubModal

Modal overlay for the Part 2 bridge CTA. Simple, forward-looking placeholder.

```typescript
interface FillKitStubModalProps {
  open: boolean;
  onClose: () => void;
}
```

- See Section 4 for full visual spec
- Uses standard modal pattern: overlay + centered card + focus trap
- Icon: `Package` (lucide-react, 48px, `brand-primary`)
- Single CTA: "Got It" → calls `onClose`
- Accessible: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to heading, `Escape` key closes

---

### SubkitCard (Modified)

Existing component receives new prop:

```typescript
// Added to existing SubkitCardProps
interface SubkitCardProps {
  // ... existing props unchanged
  elevated?: boolean;  // New — MCQ elevation indicator
}
```

**Behavioral changes:**

| Condition | Left Border | ElevationBadge | All Other Styling |
|-----------|------------|----------------|-------------------|
| `elevated && !selected` | 3px solid `#22C55E` | Visible ("Suggested for you") | Standard unselected |
| `elevated && selected` | Standard selected (2px `colorBase`) | Hidden | Standard selected |
| `!elevated && !selected` | Standard unselected (2px `#E5E7EB`) | Hidden | Standard unselected |
| `!elevated && selected` | Standard selected (2px `colorBase`) | Hidden | Standard selected |

**Aria enhancement:**
- When `elevated && !selected`: `aria-label="{categoryName} — Suggested for your situation"`
- When `elevated && selected`: `aria-label="{categoryName}, selected"`
- Otherwise: existing behavior

---

## 6. Accessibility Requirements

All Sprint 2 screens conform to **WCAG 2.1 Level AA**. The following are additive requirements for Sprint 2 changes.

### Elevation Badge Accessibility

**Non-color distinction (Decision #9):**
The elevation indicator uses three independent channels:
1. **Text label** — "Suggested for you" badge pill (readable without color perception)
2. **Border accent** — 3px green left border (supplementary, not sole indicator)
3. **Spatial grouping** — Elevated cards grouped under "Suggested for your situation" header

Any one of these channels is sufficient to understand the elevation. Together they provide robust multi-modal communication.

**Screen reader pattern:**

```html
<!-- Elevated + Unselected -->
<div role="button" aria-label="Power — Suggested for your situation"
     aria-pressed="false">
  <!-- card content -->
  <span class="elevation-badge" aria-hidden="true">
    <!-- Sparkles icon + "Suggested for you" — visual only, info in aria-label -->
  </span>
</div>

<!-- Elevated + Selected -->
<div role="button" aria-label="Power, selected"
     aria-pressed="true">
  <!-- card content, no badge -->
</div>

<!-- Not Elevated -->
<div role="button" aria-label="Power"
     aria-pressed="false">
  <!-- card content -->
</div>
```

### Elevation Group Header Accessibility

```html
<section aria-label="Suggested subkits for your situation">
  <h2 class="text-caption neutral-500">Suggested for your situation</h2>
  <!-- elevated SubkitCards -->
</section>
<!-- gap -->
<section aria-label="All subkits">
  <!-- non-elevated SubkitCards -->
</section>
```

### FillKitStubModal Accessibility

```html
<div role="dialog" aria-modal="true" aria-labelledby="stub-heading">
  <h2 id="stub-heading">Coming Soon</h2>
  <p>We're building the next phase...</p>
  <button autofocus>Got It</button>
</div>
```

- Focus trapped within modal while open
- `Escape` key closes modal
- On close: focus returns to "Now Let's Fill Your Kit" button
- Overlay click closes modal

### Keyboard Navigation Updates

| Screen | Tab Order Change |
|--------|-----------------|
| SubkitSelectionScreen | Back link → Elevated cards (top to bottom) → Non-elevated cards → SlotUsageBar → Configure Items CTA. Elevation group header is not focusable (decorative heading) |
| OrderConfirmationScreen | Heading → Kit summary (read-only) → "Now Let's Fill Your Kit" CTA → "Start Over" CTA |

### ARIA Live Regions (Sprint 2 Additions)

| Event | Announcement | Type |
|-------|-------------|------|
| Elevated subkit selected | "[Name] selected." | `polite` |
| Elevated subkit deselected | "[Name] deselected." | `polite` |
| "Fill Your Kit" modal opened | "Coming Soon dialog opened." | `polite` |
| "Fill Your Kit" modal closed | "Dialog closed." | `polite` |

### Color Contrast Verification (Sprint 2 Additions)

| Context | Foreground | Background | Ratio | Status |
|---------|-----------|------------|-------|--------|
| Pets colorBase on colorTint | `#BE185D` | `#FFF1F2` | ~6.2:1 | PASS |
| Pets colorBase on white | `#BE185D` | `#FFFFFF` | ~5.6:1 | PASS AA |
| ElevationBadge text on badge bg | `#1F4D35` | `#E8F5EE` | ~8.5:1 | PASS |
| Group header on page bg | `#6B7280` | `#F8F9FA` | ~4.8:1 | PASS AA |
| Stub modal body on white | `#6B7280` | `#FFFFFF` | ~5.0:1 | PASS AA |

---

## 7. Animation & Micro-interactions

All animations use existing motion tokens. `prefers-reduced-motion: reduce` collapses all durations to 0.01ms.

### New Animations

| # | Animation | Trigger | Duration | Easing | Properties |
|---|-----------|---------|----------|--------|------------|
| 29 | Elevation badge fade-out | Elevated card selected | 130ms | accelerate | `opacity: 1` → `0`; left border transitions from `#22C55E` to `colorBase` simultaneously |
| 30 | Elevation badge fade-in | Elevated card deselected | 150ms | decelerate | `opacity: 0` → `1`; left border transitions from `colorBase` to `#22C55E` |
| 31 | Layout shift (desktop) | SubkitSelectionScreen mount | 240ms | standard | Left/right columns enter together; existing Animation #16 (screen transition) handles page-level entry |
| 32 | Stub modal enter | CTA clicked | 200ms | decelerate | Overlay: `opacity: 0` → `0.4`. Modal: `opacity: 0, scale(0.95)` → `opacity: 1, scale(1)` |
| 33 | Stub modal exit | Dismiss triggered | 150ms | accelerate | Reverse of enter. Overlay fades to 0, modal scales down and fades |

---

## 8. Responsiveness Strategy

### SubkitSelectionScreen (Layout Refresh)

| Property | Desktop (>=1024px) | Tablet (768–1023px) | Mobile (<768px) |
|----------|-------------------|---------------------|-----------------|
| Layout | Side-by-side: 40/60 split | Stacked: visualizer top, cards below | Stacked (same as tablet) |
| Content max-width | 1120px centered | 100% with `px-6` | 100% with `px-4` |
| Left column | `w-[40%]`, sticky `top-6` | Full-width | Full-width |
| Right column | `w-[60%]`, scrollable | Full-width | Full-width |
| Card grid (right) | Single-column list | 2-column grid, `gap-3` | 2-column grid, `gap-3` |
| Visualizer | Centered in left column | Full-width, centered | Full-width, centered |
| SlotUsageBar | Below visualizer (left col) | Below visualizer (above cards) | Below visualizer (above cards) |
| Configure CTA | Below SlotUsageBar (left col) | Below SlotUsageBar (above cards) | Below SlotUsageBar (above cards) |
| Elevation header | Above card list (right col) | Above card grid | Above card grid |

**Note:** The `MobileInterstitial` guard still applies to `/builder` below 768px. The stacked layout between 768–1023px is the tablet experience. The 2-column card grid on tablet/mobile matches the existing pre-refresh layout pattern, ensuring familiar interaction at narrower widths.

### OrderConfirmationScreen (Unchanged Responsiveness)

No responsive changes. Existing max-width 960px centered layout serves both paths. The "Fill Your Kit" and "Start Over" CTAs stack naturally within the existing `max-w-sm` centered column.

### ReviewOrderScreen (Unchanged Responsiveness)

No responsive changes. The custom `KitSummaryCard` variant uses the same card shell and max-width as the Essentials variant.

---

## 9. Next Steps

### Immediate Actions

1. **Hand off to Winston** — Architecture addendum for Sprint 2: confirm `elevationRules.ts` function signature, `SubkitCard` prop addition, `KitSummaryCard` data flow, back navigation mechanism, stub modal approach
2. **Confirm icon availability** — Verify `Sparkles`, `Package` exist in the project's lucide-react version (for ElevationBadge and FillKitStubModal)
3. **Hand off to James** — Stories 15.1 and 15.2 can begin implementation once architecture is finalized. Story 16.1 can run in parallel

### Design Handoff Checklist

- [x] All 22 decisions documented and numbered
- [x] Modified screens wireframed (SubkitSelectionScreen desktop + mobile, ReviewOrderScreen custom variant, OrderConfirmationScreen)
- [x] New component inventory complete (4 new components, 6 modified)
- [x] ElevationBadge states fully specified (elevated+unselected, elevated+selected, not elevated)
- [x] Pets category color specified with contrast verification
- [x] Full category color palette documented (10 categories)
- [x] CustomKitSummary row layout specified
- [x] FillKitStubModal fully specified
- [x] Accessibility requirements defined for all new/modified components
- [x] Animation specs defined (5 new animations: #29–33)
- [x] Responsive strategy defined for layout refresh
- [x] Copy finalized for all badges, headers, CTAs, and modal content
- [x] Path-aware back navigation specified
- [x] WCAG 2.1 AA contrast verification for all new colors
- [ ] Winston architecture alignment — **pending**
- [ ] Icon availability verified (`Sparkles`, `Package`) — **pending**

---

*Emergency Prep Kit Builder — Phase 3 Sprint 2 UI/UX Specification (Addendum) | Version 1.0 | 2026-04-14 | Sally, UX Expert*
