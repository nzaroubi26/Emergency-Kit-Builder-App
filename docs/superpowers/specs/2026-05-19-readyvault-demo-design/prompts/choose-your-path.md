# Claude Design Prompt — Choose Your Path (3-tier fork)

> Paste the contents of `../preamble.md` at the top, then this entire block beneath it.

---

## Screen to design

**Screen name:** Choose Your Path
**Position in flow:** Step 3 — appears immediately after the user completes the two MCQ screens.
**Purpose:** Let the user choose one of three tiers (Base, Essentials, Pro). Each tier's value must be instantly legible from a single glance at its card. This is the most strategically important screen in the flow.

**Viewport:** Desktop only. Render at 1440×900 minimum; the design may extend taller to comfortably fit three full-height cards.

## Layout

This is a **hero screen**. Use `--sand` (`#F5F1EA`) as the page background, generous whitespace, and larger type than working screens.

**Top utility row** (full container width, ~24px padding):
- Left: small back-link — chevron-left + "Back".
- Right: optional step indicator showing "3" of N (subtle, ink-3). May omit entirely if it adds clutter.

**Hero header** (centered text block):
- Eyebrow: `CHOOSE YOUR PATH` — forest, 11px, all caps, letter-spacing 0.12em. Margin-top ~64px.
- H1: "Pick the kit that fits your plan." — 42px, weight 600, letter-spacing -0.02em, line-height 1.1, color `--ink`. Margin-top 12px.
- Sub: "Three ways to be ready. All built around the ReadyVault hub." — 16px, color `--ink-3`, max-width 560px, centered. Margin-top 12px, margin-bottom 56px.

**Card row:**
- Three cards in a single row, equal width.
- Container max-width 1200px, centered.
- Card width ~360px, 24px gap between cards.
- **Treat all three cards as equal peers.** No "Most popular" badge, no border or elevation differentiation between them. Identical structure, identical visual weight. Content is what makes each tier distinctive.

## Card anatomy

Each card uses paper background, 1.5px `--line` border, 14px radius, `--shadow-sm` resting state. Hover: border `--line-2`, `--shadow-md`, transform `translateY(-2px)`.

**Top of card — hero image area (~300px tall):**
- Background: `--sand-2` (`#EFEADD`).
- Centered photoreal rendering of the ReadyVault hub for that tier (described below).
- Soft drop shadow beneath the rendering (large, low-opacity, forest-tinted).
- No text overlays on the image area.

**Body of card (24px padding all sides):**

1. **Tier name** — H2, 26px, weight 600, letter-spacing -0.01em, color `--ink`. (e.g. "Base", "Essentials", "Pro".) Margin-bottom 6px.

2. **One-line positioning** — 14.5px, color `--ink-2`, weight 400. (See copy below.) Margin-bottom 20px.

3. **Price block:**
   - Large numeral: `$245` / `$500` / `$700` — 36px, weight 600, letter-spacing -0.01em, color `--ink`. Tabular numerals.
   - Caption beneath: "Kit total" — 12px, weight 500, all caps, letter-spacing 0.06em, color `--ink-3`.
   - Margin-bottom 24px.

4. **Divider** — 1px dashed `--line`, full card width minus padding. Margin 0 0 20px 0.

5. **"What's included" header** — 11px, all caps, weight 500, letter-spacing 0.08em, color `--ink-3`, text "WHAT'S INCLUDED". Margin-bottom 12px.

6. **Bullet list** — 3–5 items per card. Each row:
   - Small forest check icon (lucide Check, 16px, `--forest`, 0.8 opacity).
   - Label: 13.5px, weight 400, color `--ink-2`, line-height 1.5.
   - 8px gap between rows.

7. **Primary CTA button** — full card width, forest background, cream text. Label: "Choose Base" / "Choose Essentials" / "Choose Pro". Chevron-right icon to the right of the label. 12px vertical padding, 8px radius. Margin-top 24px.

## Copy for each card

### Card 1 — Base · $245

- **Positioning line:** "Empty hub. Pack it your way."
- **What's included:**
  - ReadyVault Storage Hub
  - 6 empty subkits
  - Bring your own supplies
  - Build at your own pace
- **CTA:** "Choose Base"
- **Rendering:** The ReadyVault hub with 6 empty subkit slots clearly visible — open, no contents inside.

### Card 2 — Essentials · $500

- **Positioning line:** "Hub plus three pre-packed essentials. Pick the rest."
- **What's included:**
  - ReadyVault Storage Hub
  - 3 pre-packed subkits of your choice
  - 2 empty subkits to fill yourself
  - Recommended pre-packs: Power & Lighting, Medical, Cooking
- **CTA:** "Choose Essentials"
- **Rendering:** The ReadyVault hub with 3 visibly stocked subkits (showing contents) and 2 visibly empty slots. Power & Lighting takes 2 slots (it's a large subkit), Medical and Cooking each take 1 slot, 2 empty slots remain.

### Card 3 — Pro · $700

- **Positioning line:** "Fully stocked. Ready day one."
- **What's included:**
  - ReadyVault Storage Hub
  - Power & Lighting
  - Medical
  - Cooking
  - Hygiene
  - Communications
- **CTA:** "Choose Pro"
- **Rendering:** The ReadyVault hub fully stocked — every slot filled with a packed subkit, no empties. Power & Lighting fills 2 slots; Medical, Cooking, Hygiene, Communications each fill 1.

## States to render in the demo

Render **two artboards** (or two sections in the same canvas):

**(A) Default state** — caption "Default · resting"
- All three cards in resting state.
- No hover, no selection.
- Header, three cards, no other chrome.

**(B) Hover state on Essentials** — caption "Hover · middle card"
- Same as (A), but the Essentials card has the hover treatment applied: border `--line-2`, `--shadow-md`, slight upward translate.
- Other two cards unchanged.

## Asset notes

The three ReadyVault renderings exist in the brand asset library. For the mockup, render approximations that read as the same physical product:
- A modular hub object with a 6-slot grid.
- Subkits are clearly removable / insertable from the front.
- The hub itself is consistent across all three renderings — only its contents differ.
- Soft directional lighting from upper-left.
- Subjects sit on the `--sand-2` surface as if photographed in a studio with a warm-neutral backdrop.

If the rendering vocabulary needs invention for this mockup, lean toward soft photoreal — like a high-end DTC product page (Away luggage, Coyuchi linens), not a CAD render or marketing illustration.

## Tone & content rules

- Sentence case throughout (except eyebrow and "WHAT'S INCLUDED" header).
- No exclamation marks.
- Use numerals.
- Tier names always capitalized as proper nouns: Base, Essentials, Pro.
- The H1 ends with a period, not a question mark — this is a declarative invitation.

## Out of scope for this screen

- No comparison table.
- No FAQ or supporting content beneath the cards. The three cards are the entire screen.
- No mobile.

## Deliverable

A static high-fidelity desktop mockup, at least 1440×900 (taller if needed to fit the cards comfortably), showing both states (A) and (B) clearly labeled. Pixel-precise to the design tokens in the preamble.
