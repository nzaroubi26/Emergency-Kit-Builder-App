# Claude Design Prompt — Essentials Tier Landing

> Paste the contents of `../preamble.md` at the top, then this entire block beneath it.

---

## Screen to design

**Screen name:** Essentials Tier Landing
**Position in flow:** Step 4 — appears immediately after the user clicks "Choose Essentials" on the Choose Your Path screen.
**Purpose:** Confirm what's in the Essentials kit, let the user inspect each pre-packed subkit at the item level, and surface other subkits they can add to the hub. This is the last look at the kit before checkout.

**Viewport:** Desktop only. Render at 1440×900 minimum; may extend taller to comfortably fit all sections.

## Product model context (for the designer)

Essentials is a fixed $500 kit with three pre-packed subkits: Power & Lighting, Medical, Cooking. The ReadyVault hub has 6 slots: P&L is a "large" subkit that takes 2 slots, Medical and Cooking each take 1 slot — that fills 4 of the 6 slots. The remaining 2 slots can be filled with add-on subkits (Hygiene, Communications, Comfort), each of which increases the kit total. The user can also **swap** any of the three pre-packed subkits for one of the add-ons; if they swap, the kit total stays at $500.

The demo does not need to render the slot-capacity math anywhere. Buyers don't need to think about slots — the page is about subkits and items, not slot economy.

## Layout

This is a **hero screen**. Use `--sand` (`#F5F1EA`) as the page background. Cards sit on the sand background; cards themselves use paper.

**Top utility row** (full container width, ~24px padding):
- Left: small back-link — chevron-left + "Back" — color `--ink-2`.
- Right: small ReadyVault wordmark.
- No step indicator on this screen — the user is past the MCQ flow.

**Hero header** (centered text block):
- Eyebrow: `ESSENTIALS · $500` — forest, 11px, all caps, letter-spacing 0.12em, weight 500. Margin-top ~56px.
- H1: "Your Essentials kit." — 42px, weight 600, letter-spacing -0.02em, line-height 1.1, color `--ink`. Margin-top 12px.
- Sub: "Hub plus 3 pre-packed subkits. Add more anytime." — 16px, color `--ink-3`, max-width 580px, centered. Margin-top 14px, margin-bottom 56px.

**Section: Your kit**
- Section label `YOUR KIT` — 11px, all caps, weight 500, letter-spacing 0.08em, color `--ink-3`. Left-aligned to the card grid. Margin-bottom 16px.
- 3 cards in a single row, equal width.
- Container max-width 1200px, centered.
- Card width ~360px, 24px gap between cards.

**Section: Add more to your hub**
- Section label `ADD MORE TO YOUR HUB` — same styling as `YOUR KIT`. Margin-top 56px, margin-bottom 16px.
- 3 cards in a single row, equal width, matching the column rhythm of the Your Kit row above.
- Same card width (~360px), same 24px gap.

**Footer (kit total + Continue)**
- Right-aligned cluster, margin-top 64px, margin-bottom 80px.
- Caption "KIT TOTAL" (11px, all caps, letter-spacing 0.08em, weight 500, color `--ink-3`) + price `$500` (28px, weight 600, color `--ink`, tabular numerals) on the same line, ~12px gap between them.
- CTA: "Continue to checkout" with a chevron-right icon. Primary forest button, 14–15px label weight 500, 14px vertical padding, 28px horizontal, 8px radius. To the right of the price block, ~32px gap.

## Card anatomy — Your Kit (pre-packed) cards

Each card uses paper background, 1.5px `--line` border, 14px radius, `--shadow-sm` resting state. Hover: border `--line-2`, `--shadow-md`, transform `translateY(-2px)`.

**Top — photo area (~240px tall):**
- Background `--sand-2`.
- Real-feel product photo of the subkit's contents, laid out top-down on a warm-neutral backdrop. Soft directional lighting, no harsh shadows.
- No text overlays.

**Body (24px padding all sides):**

1. **Subkit name** — H3, 20px, weight 600, letter-spacing -0.01em, color `--ink`. Margin-bottom 8px.
2. **Contents preview** — 13.5px, weight 400, color `--ink-2`, line-height 1.5. 2 lines, comma-separated headline of what's inside. Margin-bottom 18px.
3. **Footer row** — flex, justify-between:
   - Left: **See items toggle** — chevron-down icon + "See items" text, 13.5px, weight 500, color `--ink-2`. Becomes "Hide items" with chevron-up when expanded.
   - Right: **Swap link** — "Swap subkit" with chevron-right icon, 13.5px, weight 500, color `--forest`. Underline appears on hover.

**Two states per card: collapsed and expanded.**

### Collapsed state (default)

As described above. ~240px photo + ~140px body = ~380px total card height.

### Expanded state

The card grows downward to reveal an items list. Photo and body stay as in collapsed; below the footer row, an items section opens.

**Items section:**
- 1px solid `--line` divider above (margin-top 16px).
- "Includes" small label (11px, all caps, weight 500, letter-spacing 0.08em, color `--ink-3`) above the list. Margin-bottom 12px.
- Vertical list of item rows. Each row:
  - Small thumbnail photo, ~48×48px, sand-2 backdrop, 8px radius.
  - To the right of the thumbnail: item name (14px, weight 500, color `--ink`) on line 1, optional descriptor (12.5px, color `--ink-3`) on line 2.
  - 12px gap between rows.
- Items list margin-bottom 8px (card maintains its 24px bottom padding).

When one card in the row is expanded, the row becomes **staggered** — the expanded card extends taller while sibling cards stay at their collapsed height (aligned to the top of the row). Do not stretch sibling cards to match.

## Card anatomy — Add More to Your Hub (add-on) cards

Same paper/line/14px-radius/sand-2-photo grammar as Your Kit cards. Slightly different body — these cards sell, they don't unfold.

**Top — photo area (~200px tall):**
- Background `--sand-2`.
- Product photo top-down on warm-neutral backdrop. Slightly smaller height than the Your Kit photo area, so the card has clear secondary visual weight.

**Body (24px padding all sides):**

1. **Subkit name** — H3, 20px, weight 600, color `--ink`. Margin-bottom 6px.
2. **One-line description** — 13.5px, weight 400, color `--ink-2`, line-height 1.5. Margin-bottom 20px.
3. **Price** — `+$30` / `+$75` — 24px, weight 600, color `--forest`, tabular numerals. The `+` prefix is intentional — signals additive. Margin-bottom 16px.
4. **Add to kit button** — full card width, paper background, 1.5px solid `--forest` border, forest text, 12px vertical padding, 8px radius, label "Add to kit" with a small plus icon on the left. Weight 500, 14.5px. Hover: forest background, cream text.

The Add-to-kit button is **secondary** (outlined forest, not filled) — these subkits are optional. Filling them would draw too much attention from the primary "Continue to checkout" CTA.

## Copy & assets — Your Kit cards

### Card 1 — Power & Lighting
- **Subkit name:** Power & Lighting
- **Contents preview:** Folding lantern, USB power bank, flashlight, batteries, headlamp.
- **Photo:** Top-down arrangement of a folding lantern, a USB power bank, a flashlight, packs of AA and AAA batteries, a headlamp. Sand-2 backdrop.
- **Items in expanded state (~6 rows):**
  - Folding lantern — 350-lumen, USB-rechargeable
  - USB power bank — 10,000 mAh
  - LED flashlight — water-resistant
  - AA battery pack — 12 count
  - AAA battery pack — 8 count
  - Headlamp — adjustable strap

### Card 2 — Medical
- **Subkit name:** Medical
- **Contents preview:** First-aid case, bandages and gauze, antiseptic, scissors, sealed essentials.
- **Photo:** Top-down arrangement of a labeled first-aid case, bandages in assorted sizes, gauze pads, antiseptic wipes, medical scissors, tape, sealed medication packets. Sand-2 backdrop.
- **Items in expanded state (~6 rows):**
  - First-aid case — hardshell, labeled
  - Bandages — assorted sizes, 30 ct
  - Gauze pads — sterile, 10 ct
  - Antiseptic wipes — 24 ct
  - Medical scissors — stainless steel
  - Sealed OTC essentials — pain reliever, antihistamine

### Card 3 — Cooking
- **Subkit name:** Cooking
- **Contents preview:** Backpacker stove, fuel canister, mess kit, spork, lighter, coffee press.
- **Photo:** Top-down arrangement of a compact backpacker stove, a fuel canister, a nested mess kit (two pots), a spork, a small lighter, a coffee press. Sand-2 backdrop.
- **Items in expanded state (~6 rows):**
  - Backpacker stove — single-burner
  - Fuel canister — 8 oz
  - Mess kit — nested 2-pot
  - Spork — titanium
  - Stormproof lighter
  - Coffee press — 12 oz

## Copy & assets — Add More cards

### Add-on 1 — Hygiene
- **Subkit name:** Hygiene
- **Description:** Personal care for 72 hours away from home.
- **Price:** +$30
- **Photo:** Top-down arrangement of biodegradable soap, wet wipes, toothbrush + toothpaste, microfiber towel, hand sanitizer. Sand-2 backdrop.

### Add-on 2 — Communications
- **Subkit name:** Communications
- **Description:** Stay reachable when the grid is not.
- **Price:** +$75
- **Photo:** Top-down arrangement of a hand-crank emergency radio, a small two-way radio, a notebook + pen, a whistle. Sand-2 backdrop.

### Add-on 3 — Comfort
- **Subkit name:** Comfort
- **Description:** Warmth, rest, and morale supplies.
- **Price:** +$75
- **Photo:** Top-down arrangement of an emergency blanket, a compact sleeping pad, a pair of warm socks, an inflatable pillow, hand warmers. Sand-2 backdrop.

## States to render in the demo

Render **two artboards** (or two stacked sections in the same canvas):

**(A) Default state** — caption "Default · resting"
- All 3 Your Kit cards collapsed.
- All 3 Add More cards in resting state.
- No hover, no expand.
- Footer shows `KIT TOTAL $500` + active Continue button.

**(B) Medical expanded** — caption "Medical · expanded"
- Same as (A), but the Medical card is in its expanded state — showing the items list with thumbnails.
- The row containing Your Kit cards becomes staggered: Medical extends taller, P&L and Cooking stay at their collapsed height.
- Add More cards unchanged.
- Footer unchanged ($500 — no add-on has been added).

## Tone & content rules

- Sentence case throughout (except eyebrow and section labels).
- No exclamation marks.
- Numerals always.
- The H1 ends with a period.
- "Swap subkit" — not "Change", "Replace", or "Edit."
- "Add to kit" — not "Buy", "Get", or "Add to cart."
- Add-on prices always prefixed with `+` — `+$30` not `$30`.
- Item names are noun-first ("Folding lantern" not "350-lumen folding lantern"). The descriptor line carries the detail.

## Out of scope for this screen

- No comparison to other tiers.
- No upsell beyond the three named add-ons.
- No swap picker / modal — only the "Swap subkit" affordance is shown, not the picker UI.
- No "added to kit" / "remove from kit" state — every Add More card stays in default state in both demo variants.
- No capacity hint ("2 slots remaining") anywhere.
- No mobile rendering.

## Asset notes

- Six subkit photographs total — three for Your Kit (P&L / Medical / Cooking) and three for Add More (Hygiene / Communications / Comfort). All top-down on warm-neutral backdrop, soft directional lighting, no people.
- In the expanded Medical card, six item thumbnails. If real product photos aren't available to the designer, render approximations consistent with the photography direction in the preamble.

## Deliverable

A static high-fidelity desktop mockup at 1440×900 minimum (taller as needed), showing both states (A) and (B) clearly labeled. Pixel-precise to the design tokens in the preamble.
