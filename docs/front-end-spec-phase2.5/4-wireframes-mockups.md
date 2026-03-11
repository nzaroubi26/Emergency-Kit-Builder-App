# 4. Wireframes & Mockups

**Primary Design Files:** *(To be linked — awaiting Figma update to light theme)*
**Physical Product Drawing:** *(Still outstanding — needed for visualizer outer container styling)*

---

## Screen 0: Cover / Landing Page (S0)

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

## Screen 1: Subkit Selection (S1)

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

## Screen 2: Housing Unit Visualizer — Component Detail

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

## Screen 3: Item Configuration (S2)

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

## Screen 4: Custom Subkit Browser (S2-C)

Same layout as S2 with category group structure:

- Category jump nav (horizontal scrollable strip) below subkit header
- Items grouped under `CategoryGroupHeader` per parent category
- Each category group uses that category's color — not Indigo/Custom
- Empty Container option present — identical behavior to standard subkits: selecting dims item grid to `opacity-35` with `pointer-events-none`, deselects all Custom items, and displays an inline confirmation in the Custom/Indigo category color (`#3730A3`). Reflected on Summary Page under the Custom category label.
- CTA: "Review My Kit" if Custom is final subkit

---

## Screen 5: Summary Page (S3)

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
