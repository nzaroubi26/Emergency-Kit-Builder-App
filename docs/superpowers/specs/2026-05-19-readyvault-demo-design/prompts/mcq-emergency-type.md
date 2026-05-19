# Claude Design Prompt — MCQ #1: Emergency Type

> Paste the contents of `../preamble.md` at the top, then this entire block beneath it.

---

## Screen to design

**Screen name:** MCQ #1 — Emergency Type
**Position in flow:** Step 1 of 2 in the kit-building intake quiz.
**Purpose:** Capture which emergency types the user is preparing for. Multi-select. Drives downstream subkit recommendations.

**Viewport:** Desktop only. Render at 1440×900. The screen content should comfortably fit above the fold.

## Layout

Centered single-column layout, max-width 640px. Background uses `--cream`. Generous top padding (~80px).

**Top utility row** (full container width, above the centered column):
- Left: small back-link — chevron-left icon + "Back" — color `--ink-2`, hover `--ink`.
- Right: step indicator — two small pills side by side, separated by a thin chevron-right separator (`--ink-4`). First pill active (forest bg, cream text, weight 500, numbered circle "1"). Second pill inactive (line bg, ink-2 text, numbered circle "2"). Labels: "Emergency type" / "Household".

**Page header** (left-aligned within the centered column):
- Eyebrow: `STEP 1 OF 2` in forest, all caps, 11px, weight 500, letter-spacing 0.08em. Margin-bottom 10px.
- H1: "What type of emergency are you prepping for?" — 32px, weight 600, letter-spacing -0.02em, line-height 1.15, color `--ink`. Margin-bottom 8px.
- Sub: "Select all that apply." — 14.5px, color `--ink-3`. Margin-bottom 32px.

**Tile grid:**
- 2-column CSS grid, 12px gap.
- Five tiles, in this order:
  1. **Flood** — icon: Droplets (lucide-react)
  2. **Tornado** — icon: Tornado
  3. **Hurricane** — icon: CloudRainWind
  4. **Tropical Storm** — icon: CloudRainWind (yes, same icon as Hurricane is fine)
  5. **Extreme Heat** — icon: Thermometer — disabled state with "Coming soon" badge
- Tiles 1–4 sit in the 2×2 grid. Tile 5 spans either the 5th cell alone (leaving a blank 6th cell) or the full row beneath. Use whichever reads better visually — I'd suggest tile 5 alone in the 5th cell, full-width across both columns optional.

**Tile anatomy:**
- Height ~140px.
- Background `--paper`, 1.5px solid `--line` border, 14px radius.
- Icon top-left at ~20px inset, 28px size, color `--forest`, 0.85 opacity.
- Label bottom-left at ~20px inset, 16px weight 600, color `--ink`.
- Subtle internal padding: 20px on all sides.
- Hover: border becomes `--line-2`, `--shadow-md`, transform `translateY(-1px)`.

**Selected tile:**
- Border becomes `--forest` (still 1.5px).
- Subtle `--forest-soft` fill behind the icon, top-left quadrant.
- Small forest checkmark icon (lucide CheckCircle filled) in the top-right corner, ~18px.

**Disabled tile (Extreme Heat):**
- Whole tile at 55% opacity.
- Small amber-soft pill in the top-right with text "Coming soon" in `#8A6116`.
- Cursor `not-allowed`.

**Primary CTA button** (beneath the grid):
- Full width of the centered column.
- "Continue" label, with a chevron-right icon to the right.
- Forest background, cream text, weight 500, 14px font, 14px vertical padding, 8px radius.
- Margin-top 32px.

## States to render in the demo

Render **two side-by-side artboards** (or two stacked sections) labeled as follows:

**(A) Default state** — caption "Default · no selection"
- All four active tiles unselected (paper, line border).
- Extreme Heat tile in disabled state with "Coming soon" badge.
- Continue button shown in disabled visual state (50% opacity, no hover).

**(B) Two tiles selected** — caption "Two selected · button active"
- Hurricane and Tropical Storm tiles selected (forest border, forest-soft tint, checkmark top-right).
- Other two active tiles unselected.
- Extreme Heat tile still disabled.
- Continue button in full active state.

## Tone & content rules

- All copy must be sentence-case except the eyebrow.
- No exclamation marks.
- Use numerals, not spelled-out numbers.
- The H1 ends with a question mark.

## Out of scope for this screen

- No photography.
- No hero treatment.
- No third-party brand chrome (no logos other than ReadyVault if you choose to include a small wordmark in the top-left of the utility row — optional).
- No mobile rendering.

## Deliverable

A static high-fidelity desktop mockup at 1440×900 (per artboard), showing both states (A) and (B) clearly labeled. Pixel-precise to the design tokens in the preamble.
