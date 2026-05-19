# ReadyVault Demo — Design Spec

**Date:** 2026-05-19
**Status:** Pilot landed; in-flight (4 of 6 screens briefed)
**Deliverable:** Claude Design prompts that produce desktop mockups of 6 key screens for a demo. No application code changes.

## Goal

Produce a set of high-fidelity desktop mockups that showcase a redesigned ReadyVault user flow with a new 3-tier product model. The mockups are pasted into a pitch / demo — they do not need to be wired up to the live app.

## Out of scope

- Any change to `src/` (components, router, store, data, styles).
- Mobile mockups (deferred — desktop only for v1; mobile if time allows).
- Checkout / shipping screens (deferred).
- Review / cart redesign (deferred).
- Building the new flows for real in the React app.

## Product model (locked)

Three tiers. All occupy 6 subkit slots in the ReadyVault hub. Power & Lighting is a "large" subkit and takes 2 slots when present.

| Tier | Price | Description | Slot composition |
|---|---|---|---|
| **Base** | $245 | ReadyVault Storage Hub + 6 empty subkits. Buy and pack your own supplies. | 6 empty × 1 slot = 6 slots |
| **Essentials** | $500 | ReadyVault hub + 3 pre-packed subkits (Power & Lighting always included; Medical and Cooking by default, swappable). 2 remaining slots can be filled with add-ons. | P&L (2) + 2 subkits (1+1) + up to 2 add-ons (1+1) = up to 6 slots |
| **Pro** | $700 | Fully stocked ReadyVault. Power & Lighting, Medical, Cooking, Hygiene, Communications. | P&L (2) + Medical + Cooking + Hygiene + Communications (1+1+1+1) = 6 slots |

### Essentials add-on subkits (locked 2026-05-19)

Available as add-ons or swap-ins on the Essentials tier landing. Swapping in (replacing Medical or Cooking) keeps the kit total at $500. Adding (filling an empty slot) increases the total by the price below.

| Add-on | Price | Notes |
|---|---|---|
| Hygiene | +$30 | Personal care for 72 hours away from home. |
| Communications | +$75 | Hand-crank radio, two-way radio, notebook, whistle. |
| Comfort | +$75 | Emergency blanket, sleeping pad, warm socks, pillow, hand warmers. |

### Parked product-model questions

1. **Essentials slot math when user picks 3 singles.** ~~If a user picks 3 standard subkits (no P&L), total = 3 prepacked + 2 empty = 5 slots, leaving 1 unaccounted for.~~ **Resolved 2026-05-19:** force P&L silently. User can swap Medical or Cooking but not P&L. Restriction not surfaced in demo copy.
2. **"Build My Own" terminology.** In the new model, Base is effectively the "build my own" experience. Resolve copy when briefing Choose Your Path and the Cover.
3. **"Comfort" category dropped from Pro.** Original Pro listed 7 categories; we removed Comfort to hit 6 slots. Comfort remains available as an Essentials add-on. Confirm this is the final cut before production copy.

## Demo screens

Sequential user-flow order. Briefing order modified to defer the Cover redesign to last.

| # | Screen | Brief status | Hero treatment | Photography |
|---|---|---|---|---|
| 1 | Cover / landing (redesigned) | TBD — last | Hero | Yes (renderings + lifestyle) |
| 2 | MCQ #1 — emergency type | **Briefed** | No (working screen) | No (icons only) |
| 3 | MCQ #2 — household | **Briefed** | No (working screen) | No (icons only) |
| 4 | Choose Your Path (3-card fork) | **Briefed** | Hero | Yes (3 ReadyVault renderings) |
| 5 | Essentials tier landing | **Briefed** | Hero | Yes (subkit photos) |
| 6 | ReadyVault visualizer | TBD (maybe) | Hero | Yes (Vault rendering) |

## Strategy

### Prompt strategy: per-screen + shared preamble

One reusable design-system preamble pasted into every per-screen prompt. Each screen prompt = `preamble` + `screen brief`. Lets us iterate one screen at a time without losing visual consistency across the set.

### Visual direction: calm domestic prep

Adopting the existing wireframe reference (forest `#1F3A2E` + sand `#F5F1EA` + cream `#FAFAF7` + amber `#C8902B` accent, Inter typeface, editorial typography rhythm) as the baseline design system. See `preamble.md` for the full token set.

Three deltas added on top of the reference:

1. **Photography lift.** Real product imagery in cards instead of icon tiles, wherever it fits (subkit cards, tier cards). Icons retained for abstract concept screens (MCQs).
2. **Vault metaphor.** The physical ReadyVault hub with slots is visually expressed on the hero screens — Choose Your Path uses tier-specific renderings; the Visualizer makes the hub itself the subject.
3. **Hero pacing.** Choose Your Path and Visualizer get bigger type, sand background, generous whitespace. MCQ and other working screens stay dense and efficient on cream.

### Pilot pair

Validate the framework on two screens before writing the remaining four:

- **MCQ #1** — plumbing test. Confirms the preamble produces correct palette, type, tile grammar.
- **Choose Your Path** — ambition test. Exercises all three deltas (photography, Vault metaphor, hero treatment).

If both come back strong, brief the remaining four. If either fails, tune the preamble or per-screen format before proceeding.

## Locked screen briefs

### Screen #2 — MCQ Emergency Type

**Purpose.** Capture which emergency types the user is prepping for. Multi-select. Step 1 of 2.

**Layout (desktop).**
- Centered single column, max-width ~640px.
- Top row: back-link (left) + step indicator "1 / 2" (right).
- Eyebrow `STEP 1 OF 2` (small caps, forest, wide letter-spacing).
- H1: "What type of emergency are you prepping for?" (~32px, tight tracking).
- Sub: "Select all that apply." (ink-3, 14.5px).
- 2-column tile grid. Five tiles: Flood, Tornado, Hurricane, Tropical Storm, Extreme Heat (last disabled with amber-soft "Coming soon" badge).
- Full-width primary "Continue" button, disabled until ≥1 selected.

**Tile anatomy.**
- ~140px tall, paper background, 1.5px line border, 14px radius.
- Lucide icon top-left (~28px, forest, 85% opacity).
- Label bottom-left (16px, 600 weight).
- Selected state: forest border, forest-soft fill, small forest checkmark top-right.
- Disabled state: 55% opacity, amber-soft "Coming soon" pill.

**Variants in demo.**
- Default (nothing selected, button disabled).
- Two tiles selected (e.g. Hurricane + Tropical Storm), button active.

**Photography.** None. Disaster imagery clashes with the calm-domestic-prep brand promise.

**Hero treatment.** None. Working screen.

**Asset needs.** Lucide icons only — Droplets, Tornado, CloudRainWind, Thermometer.

### Screen #4 — Choose Your Path

**Purpose.** User chooses one of three tiers and continues to that tier's landing page. The most strategic screen — each tier's value has to be instantly legible.

**Layout (desktop).**
- Centered container, max-width ~1200px.
- Background shifts to sand `#F5F1EA` to differentiate from working screens (cream).
- Top header block: eyebrow `CHOOSE YOUR PATH`, H1 ~42px ("Pick the kit that fits your plan."), sub ink-3.
- Three cards in a row, equal width (~360px), 24px gap.
- All three cards treated as equal peers — no "Most popular" badge, no border or elevation differentiation. Content carries the choice.

**Hero treatment.** Bigger type, more whitespace, sand background. Let it breathe.

**Card anatomy (each).**
- Hero image area: ~300px tall, sand-2 backdrop, the ReadyVault rendering for that tier centered with a soft drop shadow.
- Tier name: H2 ~26px, 600.
- One-line positioning under the name.
- Price block: `$X` large (~36px, 600, tight tracking) + ink-3 caption "kit total" beneath.
- Description: 2–3 sentences, ink-2, 14.5px.
- "What's included" list: 3–4 bullets, small forest check icons, 13px ink-2.
- CTA: full-width primary forest button, e.g. "Choose Essentials".

**Placeholder copy (override anywhere).**
- **Base · $245** — "Empty hub. Pack it your way." Bullets: ReadyVault Storage Hub · 6 empty subkits · Bring your own supplies · Build at your pace.
- **Essentials · $500** — "Hub plus three pre-packed essentials. Pick the rest." Bullets: ReadyVault Storage Hub · 3 pre-packed subkits (recommended: Power & Lighting, Medical, Cooking) · 2 empty subkits · Mix prepared with personal.
- **Pro · $700** — "Fully stocked. Ready day one." Bullets: ReadyVault Storage Hub · Power & Lighting · Medical · Cooking · Hygiene · Communications.

**Variants in demo.**
- Default (no hover, no selection).
- Hover on Essentials (subtle lift + slight shadow bump).

**Asset needs.**
- Three ReadyVault renderings — Base (empty hub), Essentials (hub with 3 prepacked + 2 empty slots visible), Pro (fully stocked).

### Screen #3 — MCQ Household

**Purpose.** Capture who the user is prepping for. Multi-select. Step 2 of 2.

**Layout (desktop).**
- Near-clone of MCQ #1 grammar. Centered single column, max-width ~640px, cream background.
- Step indicator: pill 1 completed (success-tinted check circle, "Emergency type" label), pill 2 active (forest, "Household" label).
- Eyebrow `STEP 2 OF 2`, H1 "Who are you prepping for?", sub "Select all that apply."
- 2-column tile grid with four conceptual tiles: Kids, Older Adults, Person with a Disability, Pets.
- Separate full-width "None of the above" tile beneath the grid, half-height, no icon — visually de-emphasized.
- Full-width primary Continue button, disabled until ≥1 selected.

**Tile anatomy.** Same as MCQ #1 (paper bg, line border, icon top-left, label bottom-left, selected = forest border + forest-soft quarter-circle + checkmark top-right).

**Selection logic.** "None of the above" is mutually exclusive with the four conceptual tiles.

**Variants in demo.**
- Default (nothing selected, button disabled).
- Kids selected only, button active.

**Photography.** None. Lucide icons (Baby, User, Accessibility, PawPrint).

**Hero treatment.** None. Working screen.

### Screen #5 — Essentials tier landing

**Purpose.** User has just chosen Essentials. Confirm the kit, let them inspect each pre-packed subkit at the item level (expandable cards), and surface other subkits they can add to the hub. This is the last look at the kit before checkout.

**Layout (desktop).**
- Hero screen on `--sand`. Container max-width ~1200px.
- Top utility row (back link + wordmark — no step indicator).
- Hero header: eyebrow `ESSENTIALS · $500`, H1 "Your Essentials kit.", sub "Hub plus 3 pre-packed subkits. Add more anytime."
- `YOUR KIT` section: 3 photo cards in a row (Power & Lighting, Medical, Cooking). Each card has a "See items" expand toggle and a "Swap subkit" link.
- `ADD MORE TO YOUR HUB` section: 3 photo cards (Hygiene +$30, Communications +$75, Comfort +$75). Each card has an outlined "Add to kit" button.
- Footer: right-aligned `KIT TOTAL $500` + "Continue to checkout" forest CTA.

**Card anatomy.**
- Your Kit cards: ~240px photo on sand-2 + subkit name + 2-line contents preview + footer row with "See items" toggle (left) and "Swap subkit →" link (right). Expanded state opens an "Includes" item list with ~48px thumbnail photos per item.
- Add More cards: ~200px photo + name + 1-line description + `+$XX` forest price + outlined forest "Add to kit" button.

**Product model.**
- P&L is silently locked (no swap actually wired, but link visible for symmetry).
- Medical and Cooking are swappable for Hygiene/Comms/Comfort — kit total stays $500.
- Adding any Add More subkit increases the total by its `+$XX` price.
- No capacity hint is surfaced anywhere ("2 slots remaining" etc.).

**Variants in demo.**
- (A) Default resting — all cards collapsed, kit total $500.
- (B) Medical expanded — Medical card opens to show its 6 items with thumbnails. Row becomes staggered (P&L and Cooking stay collapsed at their original height).

**Photography.** Six top-down product shots on sand-2 — three subkit-level (P&L, Medical, Cooking, Hygiene, Comms, Comfort) plus six item-level thumbnails in the Medical expanded state.

**Hero treatment.** Yes — sand background, generous whitespace, 42px H1.

## TBD screen briefs

### Screen #6 — ReadyVault visualizer

The Vault metaphor expressed as a hero rendering of the physical hub with its 6 slots — some filled, some empty, depending on tier or current cart state. Most novel screen visually; brief after pilot returns so we know how Claude Design handles the renderings.

### Screen #1 — Cover (redesigned)

Last screen briefed. Needs hero imagery (TBD), Build My Kit CTA, brand-level positioning. Deferred so we know what the rest of the system looks like before designing the front door.

## Process from here

1. Run pilot prompts (MCQ #1 and Choose Your Path) through Claude Design.
2. Review outputs. If both land, brief MCQ #2, Essentials tier landing, Visualizer, and the redesigned Cover.
3. If outputs miss, tune the preamble or per-screen brief structure before continuing.
4. Once all 6 screens have shipped mockups, package them for the demo.
