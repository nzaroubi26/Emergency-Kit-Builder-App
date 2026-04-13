# 4. Wireframes & Mockups

All new screens inherit the existing design system: `neutral-50` page background, Inter font, 4px spacing grid, `brand-primary` (#1F4D35) CTAs. No new design tokens are introduced.

---

## Screen MCQ-1: Emergency Type Selection

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

## Screen MCQ-2: Household Composition

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

## Screen F1: Fork Screen

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

## Screen RO: Review & Order Page (Shell)

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

**Content for both paths (spec-level — see Sprint 1 note below):**
- **Essentials path:** Kit summary shows the 4 Essentials bundle subkits. Path label: "Essentials Kit". Bundle sourced from `ESSENTIALS_BUNDLE` constant.
- **Build My Own path:** Kit summary shows user-selected subkits from kit store. Path label: "Custom Kit". Data sourced from existing `selectedSubkits` in kit store.

**Sprint 1 implementation scope (PO-confirmed):** Only the Essentials path reaches `/review` in Sprint 1. The Build My Own path routes to `/builder` → existing flow → `/summary` and never hits this page. James should implement only the Essentials variant of `KitSummaryCard` in Sprint 1. The Custom Kit variant is Sprint 2 wiring — the spec documents it here so the component interface and store shape are designed to accept it without rework, but the code path does not need to function yet.

**Sprint 1 prototype note:** The Review & Order page is a demonstration surface. Address validation, real fulfillment, and payment processing are out of scope. Input fields accept any text. The "Place Order" CTA navigates to the existing confirmation screen as a prototype endpoint.

---
