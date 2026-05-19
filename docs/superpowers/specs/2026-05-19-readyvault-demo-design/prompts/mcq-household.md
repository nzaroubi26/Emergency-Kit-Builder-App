# Claude Design Prompt — MCQ #2: Household

> Paste the contents of `../preamble.md` at the top, then this entire block beneath it.

---

## Screen to design

**Screen name:** MCQ #2 — Household
**Position in flow:** Step 2 of 2 in the kit-building intake quiz. Appears immediately after MCQ #1 (Emergency Type).
**Purpose:** Capture who the user is prepping for. Multi-select. Drives downstream subkit recommendations (medications, mobility supplies, kid-specific items, pet food, etc.).

**Viewport:** Desktop only. Render at 1440×900. The screen content should comfortably fit above the fold.

## Layout

Centered single-column layout, max-width 640px. Background uses `--cream`. Generous top padding (~80px). This screen is a near-clone of MCQ #1 — match its grammar exactly except for the differences called out below.

**Top utility row** (full container width, above the centered column):
- Left: small back-link — chevron-left icon + "Back" — color `--ink-2`, hover `--ink`.
- Right: step indicator — two small pills side by side, separated by a thin chevron-right separator (`--ink-4`).
  - **First pill — completed.** Cream/line background, ink-2 text, weight 500. The numbered "1" circle is replaced with a small **check icon in a success-tinted circle** (`--success-soft` fill, `--success` stroke). Label "Emergency type".
  - **Second pill — active.** Forest background, cream text, weight 500, numbered circle "2". Label "Household".

**Page header** (left-aligned within the centered column):
- Eyebrow: `STEP 2 OF 2` in forest, all caps, 11px, weight 500, letter-spacing 0.08em. Margin-bottom 10px.
- H1: "Who are you prepping for?" — 32px, weight 600, letter-spacing -0.02em, line-height 1.15, color `--ink`. Margin-bottom 8px.
- Sub: "Select all that apply." — 14.5px, color `--ink-3`. Margin-bottom 32px.

**Tile grid:**
- 2-column CSS grid, 12px gap. Four tiles arranged in a clean 2×2:
  1. **Kids** — icon: Baby (lucide-react)
  2. **Older Adults** — icon: User (lucide-react). If the designer has access to a more elder-specific icon, use it; otherwise the generic single-figure User is fine.
  3. **Person with a Disability** — icon: Accessibility (lucide-react)
  4. **Pets** — icon: PawPrint (lucide-react)

**"None of the Above" tile** (separate, beneath the grid):
- Full-width single tile (spans both grid columns). 12px gap above it from the 2×2 grid.
- Same anatomy as the other tiles (paper bg, 1.5px `--line` border, 14px radius), but reduced height (~64px — half the tile height) since it has no icon.
- Label only, centered vertically: "None of the above" — 15px, weight 500, color `--ink-2`.
- No icon. The visual reduction is intentional — it's an "opt-out" affordance, not a category.

**Tile anatomy** (matches MCQ #1 exactly for the four conceptual tiles):
- Height ~140px.
- Background `--paper`, 1.5px solid `--line` border, 14px radius.
- Icon top-left at ~20px inset, 28px size, color `--forest`, 0.85 opacity.
- Label bottom-left at ~20px inset, 16px weight 600, color `--ink`.
- 20px internal padding.
- Hover: border `--line-2`, `--shadow-md`, transform `translateY(-1px)`.

**Selected tile:**
- Border becomes `--forest` (still 1.5px).
- Subtle `--forest-soft` fill behind the icon, top-left quadrant. (Match the same fill shape rendered on MCQ #1 — the soft quarter-circle behind the icon.)
- Small forest checkmark icon (lucide CheckCircle filled) in the top-right corner, ~18px.

**Selection logic (for the designer's mental model — render only the variants below):**
- The four conceptual tiles are independent multi-select.
- "None of the above" is **mutually exclusive** with the four:
  - Selecting "None of the above" deselects any of the four.
  - Selecting any of the four deselects "None of the above".

**Primary CTA button** (beneath the "None of the above" tile):
- Full width of the centered column.
- "Continue" label, with a chevron-right icon to the right.
- Forest background, cream text, weight 500, 14px font, 14px vertical padding, 8px radius.
- Margin-top 32px.

## States to render in the demo

Render **two side-by-side artboards** (or two stacked sections) labeled as follows:

**(A) Default state** — caption "Default · no selection"
- All four conceptual tiles unselected (paper, line border).
- "None of the above" tile unselected.
- Continue button shown in disabled visual state (50% opacity, no hover).

**(B) "Kids" selected** — caption "Kids selected · button active"
- Kids tile in selected state: forest border, forest-soft quarter-circle fill behind the icon, small forest checkmark top-right.
- Older Adults, Person with a Disability, Pets, and "None of the above" all unselected.
- Continue button in full active state (forest, cream text, no opacity reduction).

## Tone & content rules

- All copy must be sentence-case except the eyebrow (`STEP 2 OF 2`).
- No exclamation marks.
- Use numerals, not spelled-out numbers.
- The H1 ends with a question mark.
- Treat "Older Adults" and "Person with a Disability" with the same dignity as the other tiles — same visual weight, same icon size, no qualifiers in the label.

## Out of scope for this screen

- No photography — icons only.
- No hero treatment. This is a working screen on `--cream`.
- No mobile rendering.
- No "Back" interaction flow — just the chevron-left affordance in the top-left.

## Deliverable

A static high-fidelity desktop mockup at 1440×900 (per artboard), showing both states (A) and (B) clearly labeled. Pixel-precise to the design tokens in the preamble. The two states should be visually distinguishable at a glance so a reviewer can tell what changed.
