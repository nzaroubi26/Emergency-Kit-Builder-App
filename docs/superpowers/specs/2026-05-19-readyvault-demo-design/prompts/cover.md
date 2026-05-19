# Claude Design Prompt — Cover (Landing Page)

> Paste the contents of `../preamble.md` at the top, then this entire block beneath it.

---

## Screen to design

**Screen name:** Cover / Landing Page
**Position in flow:** Step 0 — the front door. The user lands here from a paid ad, an email, or a direct visit. Their next action is to start the kit-building flow.
**Purpose:** Establish the brand promise (calm-domestic-prep), anchor the JTBD ("protect the people you love"), show the product in a real home, build credibility, and drive a single primary action: start the flow.

This is a demo cover — not a full marketing site. One hero + one supporting strip. Focused, premium, restrained.

**Viewport:** Desktop only. Render at 1440×900 minimum; may extend taller to fit the "How it works" strip comfortably below the hero.

## Layout

This is a **hero screen**. Use `--sand` (`#F5F1EA`) as the page background.

### Top utility row (full container width, ~24px padding)

- Left: ReadyVault logo + wordmark.
- Right: minimal nav — two text links followed by a small ghost button:
  - "How it works" (14px, color `--ink-2`, weight 500)
  - "Buy" (14px, ghost button — paper background, 1px `--line-2` border, `--ink` text, 6px vertical / 14px horizontal padding, 8px radius)

### Hero (split layout, ~50/50)

Container max-width ~1280px, centered. Two columns, ~32px gap. Vertical alignment: copy block centered to the photo's height.

**Left column — copy block (~520px wide):**

1. **Eyebrow** — `EMERGENCY PREPAREDNESS, HANDLED.` in forest, 12px, all caps, letter-spacing 0.12em, weight 500. Margin-bottom 16px.
2. **H1** — "Built for the people you love." — 56px, weight 600, letter-spacing -0.025em, line-height 1.05, color `--ink`. May wrap to two lines. Margin-bottom 16px.
3. **Sub** — "Modular emergency kits, packed and ready when you are." — 17px, color `--ink-3`, line-height 1.55, max-width 460px. Margin-bottom 32px.
4. **Primary CTA** — "Build my kit" with a chevron-right icon. Forest background, cream text, 8px radius, 14px vertical / 28px horizontal padding, 15px label weight 500. Hover: `--forest-2` background, slight `translateY(-1px)`. Margin-bottom 32px.
5. **Trust strip** — three claims in a vertical or horizontal layout (horizontal preferred at this width). Each row: small forest check icon (lucide Check, 14px, `--forest`) + label (13.5px, color `--ink-2`, weight 500). 24px horizontal gap between items.
   - FEMA Ready aligned
   - 72-hour coverage
   - Free shipping

**Right column — hero photograph:**

A photoreal lifestyle shot of the Vault in a real domestic environment. Container ~580px wide × ~620px tall (slightly portrait). Image fills the container, 14px radius on all corners.

See "Asset notes" below for photo direction.

### How it works (below hero)

After the hero, a horizontal section. Margin-top 96px. Background remains `--sand`.

**Section header (centered):**
- Eyebrow: `HOW IT WORKS` — same eyebrow styling. Margin-bottom 14px.
- H2: "Three steps to ready." — 32px, weight 600, letter-spacing -0.02em, color `--ink`. Margin-bottom 48px.

**Step row (3 columns, centered, max-width 1080px):**

Three step blocks in a row, ~280px each, 48px gap. Between each block, a small chevron-right separator (24px, `--ink-4`, vertically centered in the gap).

**Each step block:**
- **Numbered badge** — a forest-filled circle, 40px, with the step number (1, 2, 3) inside in cream, tabular numerals, 16px, weight 600. Centered horizontally.
- **Title** — 17px, weight 600, color `--ink`, centered. Margin-top 16px.
- **Description** — 14px, weight 400, color `--ink-2`, centered, line-height 1.55, max-width 240px. Margin-top 8px.

**Step content:**

| # | Title | Description |
|---|---|---|
| 1 | Tell us about your home | Two-minute quiz. We learn what you need to be ready for. |
| 2 | Pick your kit | Base, Essentials, or Pro. Or build it yourself. |
| 3 | Be ready | Your kit ships ready. Stash it. Forget about it. |

### Footer (minimal)

Margin-top 120px. Background remains `--sand`. Top border 1px `--line`.

- Left: small ReadyVault wordmark (12px, `--ink-3`).
- Right: three text links — "Privacy" / "Terms" / "Contact" — 12px, `--ink-3`, 24px gap.
- 32px vertical padding.

## States to render in the demo

**Single state.** No hover variants — the Cover is one continuous canvas at rest. The CTA, the nav button, and the step blocks all render in their default visual state.

Render the entire page from the top utility row through the footer, at 1440 width × however tall is needed to comfortably fit all sections. Caption the artboard simply: "Cover · default".

## Tone & content rules

- Sentence case throughout (except eyebrows and section labels).
- No exclamation marks.
- Numerals always.
- The H1 ends with a period.
- Trust strip phrasing — concise nouns/adjective phrases, not full sentences.
- Voice is calm, declarative, confident. Never "Don't get caught off guard" language. Never "Survive anything" language.

## Out of scope for this screen

- No tier preview (Base / Essentials / Pro cards). The Choose Your Path screen owns that reveal.
- No testimonials or user quotes.
- No FAQ.
- No newsletter signup.
- No second CTA (the entire page funnels to "Build my kit").
- No mobile rendering.
- No "Founded by" or about-section content.

## Asset notes

**Hero photograph — lifestyle mode (this is the new photography pattern; see the updated preamble).**

A photoreal image of the Vault in a real domestic environment. The Vault is the subject; the environment is the supporting cast.

- Setting: a corner of a real home — a mudroom, a hallway, a small foyer, a tidy garage corner. Indoor.
- Light: natural daylight, soft and warm, coming from one direction. No studio lighting, no harsh shadows.
- Composition: the Vault sits to one side of the frame, with context objects on the other side at lower visual weight (a bicycle, a fire extinguisher, a pair of boots, a houseplant, a basket). Lived-in but tidy.
- Mood: calm, unposed, the kind of photograph that could appear in a slow-living magazine or a Kinfolk feature.
- Aspect ratio: roughly square or slightly portrait (matches container ~580×620). 14px radius corners.
- **No people. No fear imagery. No tactical / military framing. No debris, broken windows, smoke, or candles-in-the-dark.**

If the designer doesn't have access to a brand photograph, render a believable approximation consistent with the above direction.

**Logo / wordmark:** small shield icon (lucide Shield, ~22px, `--forest`) + "ReadyVault" wordmark (16px, weight 600, color `--ink`, letter-spacing -0.01em). Used in both the top utility row and the footer.

## Deliverable

A single static high-fidelity desktop mockup at 1440 width (height extends naturally), showing the full page top-to-bottom. Pixel-precise to the design tokens in the preamble (with the lifestyle-photography mode introduced).
