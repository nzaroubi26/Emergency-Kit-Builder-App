# Claude Design Prompt — Essentials Tier Landing

> Paste the contents of `../preamble.md` at the top, then this entire block beneath it.

---

## Screen to design

**Screen name:** Essentials Tier Landing
**Position in flow:** Step 4 — appears immediately after the user clicks "Choose Essentials" on the Choose Your Path screen.
**Purpose:** Confirm what's in the Essentials kit, let the user inspect their 3 pre-packed subkits (with a swap affordance), and make the 2 empty slots feel intentional. The page is the user's last look at the kit before checkout.

**Viewport:** Desktop only. Render at 1440×900 minimum; may extend taller to comfortably fit all sections.

## Layout

This is a **hero screen**. Use `--sand` (`#F5F1EA`) as the page background, generous whitespace, larger type than working screens. Cards sit on the sand background; cards themselves use paper.

**Top utility row** (full container width, ~24px padding):
- Left: small back-link — chevron-left + "Back" — color `--ink-2`.
- Right: optional small ReadyVault wordmark. No step indicator on this screen (the user is past the MCQ flow).

**Hero header** (centered text block):
- Eyebrow: `ESSENTIALS · $500` — forest, 11px, all caps, letter-spacing 0.12em, weight 500. Margin-top ~56px.
- H1: "Your Essentials kit." — 42px, weight 600, letter-spacing -0.02em, line-height 1.1, color `--ink`. Margin-top 12px.
- Sub: "Hub plus 3 pre-packed subkits. 2 empty slots ready for you to pack." — 16px, color `--ink-3`, max-width 580px, centered, line-height 1.5. Margin-top 14px, margin-bottom 56px.

**Section: Pre-packed**
- Section label `PRE-PACKED` — 11px, all caps, weight 500, letter-spacing 0.08em, color `--ink-3`. Left-aligned to the card grid. Margin-bottom 16px.
- 3 cards in a single row, equal width.
- Container max-width 1200px, centered.
- Card width ~360px (matches Choose Your Path), 24px gap between cards.

**Section: Empty slots**
- Section label `EMPTY SLOTS` — same styling as `PRE-PACKED`. Margin-top 48px, margin-bottom 16px.
- 2 cards in a row, equal width (same ~360px width as the prepacked cards). Left-aligned (cards 1 and 2 of the implicit 3-column grid above), leaving the rightmost column empty. This produces visual rhythm with the prepacked row and reinforces that the user is choosing how to fill these later.

**Footer (kit total + Continue)**
- Right-aligned cluster, margin-top 56px, margin-bottom 80px.
- Above the button: small caption "KIT TOTAL" (11px, all caps, letter-spacing 0.08em, weight 500, color `--ink-3`) + price `$500` (24px, weight 600, color `--ink`, tabular numerals) on the same line, separated by ~12px.
- CTA button: "Continue to checkout" with a chevron-right icon. Primary forest button, 14–15px label weight 500, 14px vertical padding, 24px horizontal, 8px radius. To the right of the price block, ~24px gap.

## Card anatomy — pre-packed subkit cards

Each card uses paper background, 1.5px `--line` border, 14px radius, `--shadow-sm` resting state. Hover: border `--line-2`, `--shadow-md`, transform `translateY(-2px)`, swap link transitions to its hover state (see below).

**Top — photo area (~240px tall):**
- Background `--sand-2`.
- Real-feel product photo of the subkit's contents — laid out as if photographed top-down on a warm-neutral backdrop. Soft directional lighting, no harsh shadows.
- No text overlays on the photo.

**Body (24px padding all sides):**

1. **Subkit name** — H3, 20px, weight 600, letter-spacing -0.01em, color `--ink`. Margin-bottom 8px.

2. **Contents preview** — 13.5px, weight 400, color `--ink-2`, line-height 1.5. Two or three lines, comma-separated. (Examples in the copy block below.) Margin-bottom 20px.

3. **Swap link** — text link with chevron-right icon. Label "Swap subkit", color `--forest`, weight 500, 13.5px. Sits at the bottom of the body. Underline appears on hover; in default state no underline.

## Card anatomy — empty slot cards

Visually distinct from the prepacked cards. The goal is **intentional placeholder, not missing**.

- Same dimensions as the prepacked cards (width and total height matched).
- Background `--paper` with a subtle `--sand-2` tint (or just paper if cleaner).
- **1.5px dashed border in `--line-2`** (this is the key visual signal).
- 14px radius.
- No photo area — the whole card is body.
- Centered content vertically.

**Content (centered):**
- Small icon — lucide `Package` or `PackageOpen` at 28px, color `--ink-4`, opacity 0.7. Margin-bottom 12px.
- Heading: "Empty slot" — 16px, weight 500, color `--ink-2`.
- Sub: "Pack at home" — 13px, color `--ink-3`. Margin-top 4px.

Empty cards do not have hover state in this mockup — they are illustrative, not yet interactive in the designed flow.

## Copy for the 3 pre-packed cards

### Card 1 — Power & Lighting

- **Photo:** Items laid out: a folding lantern, a power bank, a flashlight, packs of batteries, a small headlamp. Sand-2 backdrop, top-down view.
- **Subkit name:** Power & Lighting
- **Contents preview:** Folding lantern, USB power bank, flashlight, AA + AAA batteries, headlamp.
- **Swap link:** Swap subkit →

### Card 2 — Medical

- **Photo:** Items laid out: a labeled first-aid case, bandages, gauze, sealed medication packets, antiseptic, scissors, tape. Sand-2 backdrop, top-down view.
- **Subkit name:** Medical
- **Contents preview:** First-aid case, bandages and gauze, antiseptic, scissors, tape, sealed essentials.
- **Swap link:** Swap subkit →

### Card 3 — Cooking

- **Photo:** Items laid out: a compact backpacker stove, a fuel canister, a mess kit (nested pots), a spork, a small lighter, a coffee press. Sand-2 backdrop, top-down view.
- **Subkit name:** Cooking
- **Contents preview:** Backpacker stove, fuel canister, mess kit, spork, lighter, coffee press.
- **Swap link:** Swap subkit →

## States to render in the demo

Render **two artboards** (or two stacked sections in the same canvas):

**(A) Default state** — caption "Default · resting"
- All 3 prepacked cards in resting state. All 2 empty slot cards in resting state.
- No hover applied anywhere.
- Footer total + Continue button visible.

**(B) Hover on Medical card** — caption "Hover · pre-packed card"
- Same as (A), but the Medical card has the hover treatment: border `--line-2`, `--shadow-md`, slight upward translate, swap link underlined.
- Other cards unchanged.

## Tone & content rules

- Sentence case throughout (except eyebrow and section labels).
- No exclamation marks.
- Use numerals.
- The H1 ends with a period.
- The empty slot copy is calm and unalarmed — "Pack at home" not "Missing" or "Add yours."
- "Swap subkit" — not "Change", not "Replace", not "Edit."

## Out of scope for this screen

- No comparison to other tiers.
- No upsell content ("upgrade to Pro").
- No "remove subkit" affordance.
- No subkit-detail expansion (clicking a card to see contents in full).
- No mobile rendering.
- No actual swap interaction or modal — only the affordance link is shown.

## Asset notes

- Three real-feel product photographs (Power & Lighting / Medical / Cooking). If the designer doesn't have access to source images, render approximations consistent with the photography direction in the preamble (warm-neutral backdrop, soft top-down lighting, real-feel composition).
- No people in any photograph.

## Deliverable

A static high-fidelity desktop mockup at 1440×900 minimum (taller if needed to fit comfortably), showing both states (A) and (B) clearly labeled. Pixel-precise to the design tokens in the preamble.
