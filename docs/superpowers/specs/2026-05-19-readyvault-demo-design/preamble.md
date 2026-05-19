# ReadyVault — Shared Design System Preamble

Paste this preamble verbatim at the top of every per-screen prompt for Claude Design. It defines the visual language so each screen renders consistently with the others.

---

## Brand & vibe

**ReadyVault** is a premium emergency-preparedness brand. The aesthetic is **calm domestic prep** — prepared, not scared. Think editorial DTC (Open Spaces, Away, Quip) crossed with quiet outdoor brands (Filson, Tracksmith). The visual promise is *"we've thought about this so you don't have to panic."* Never tactical, never military, never alarmist.

## Color tokens

Use these exact values. Do not introduce new colors.

```
--forest:       #1F3A2E   /* Primary. Buttons, active states, key accents, eyebrows. */
--forest-2:     #2D4A3E   /* Primary hover. */
--forest-soft:  #E8EFE9   /* Tint background for selected/active states. */

--sand:         #F5F1EA   /* Hero-screen background. */
--sand-2:       #EFEADD   /* Card hero-image backdrops, secondary surfaces. */
--cream:        #FAFAF7   /* Default page background for working screens. */
--paper:        #FFFFFF   /* Card surfaces, elevated surfaces. */

--ink:          #1A1A1A   /* Headings, primary text. */
--ink-2:        #4A4A4A   /* Body text. */
--ink-3:        #6B6B6B   /* Captions, sub-copy, meta. */
--ink-4:        #9A9A95   /* Disabled, separators. */

--line:         #E5E0D5   /* Default borders. */
--line-2:       #D8D2C3   /* Hover borders, deeper separators. */

--amber:        #C8902B   /* Warmth accent. In-progress states, "Coming soon" badges. */
--amber-soft:   #FAEFD6   /* Amber pill backgrounds. */
--success:      #2D7D5F   /* Completed states. */
--success-soft: #DDEEE5   /* Success pill backgrounds. */
--danger:       #B85450   /* Errors only. Use sparingly. */
```

**Working screens** (MCQs, configurators) use `--cream` background.
**Hero screens** (Choose Your Path, Visualizer, Cover) use `--sand` background.

## Typography

**Font family:** Inter (weights 400/500/600/700). System fallback: `-apple-system, BlinkMacSystemFont, sans-serif`.

**Type scale and rules:**

- **Eyebrow** — 11px, weight 500, `text-transform: uppercase`, `letter-spacing: 0.08em` (or 0.12em for the cover/hero), color `--forest`. Sits above every page H1.
- **H1 (page title)** — 32px on working screens, 42px on hero screens. Weight 600. `letter-spacing: -0.02em`. `line-height: 1.15`. Color `--ink`.
- **H2 (card title)** — 24–26px, weight 600, `letter-spacing: -0.01em`. Color `--ink`.
- **Sub / page-sub** — 14.5px, color `--ink-3`, `max-width: 580px`, `line-height: 1.55`.
- **Body** — 15px, weight 400, color `--ink-2`.
- **Caption / meta** — 12.5–13px, color `--ink-3`.
- **Price (large)** — 32–36px, weight 600, `letter-spacing: -0.01em`, color `--ink`. Always paired with a caption beneath (e.g. "kit total").

Numbers in prices and step indicators use `font-variant-numeric: tabular-nums`.

## Component grammar

**Radii.** Default `10px`. Cards `14px`. Pills `999px`. Buttons `8px`.

**Shadows.**
- `--shadow-sm: 0 1px 2px rgba(31,58,46,0.06)` — resting cards.
- `--shadow-md: 0 4px 16px rgba(31,58,46,0.08)` — hover state, elevated cards.

**Cards.** Paper background, 1.5px `--line` border, 14px radius. Hover: border becomes `--line-2`, shadow lifts to `--shadow-md`, transform `translateY(-1px)`. Active/selected: forest border + `--forest-soft` fill on icon area.

**Buttons.**
- **Primary** — `--forest` background, `--cream` text, 8px radius, 12–14px vertical padding, 22–26px horizontal, 14–15px weight 500. Hover background `--forest-2`.
- **Secondary** — paper background, `--ink` text, 1px `--line-2` border, same dimensions.
- **Ghost** — text only, `--ink-2`, hover `--sand` background.

**Pills / badges.** 999px radius, 3–6px vertical padding, 8–12px horizontal, 11–12.5px text. Variants:
- Forest pill on `--forest-soft` — for active context.
- Amber pill on `--amber-soft` (`#8A6116` text) — for "Coming soon" / warnings.
- Success pill on `--success-soft` — for completed states.

**Tiles (MCQ).** ~140px tall, paper bg, line border, 14px radius. Icon top-left (~28px, forest, 85% opacity), label bottom-left (16px weight 600). Selected: forest border + forest-soft fill + small forest checkmark top-right. Disabled: 55% opacity + amber-soft "Coming soon" pill.

**Eyebrow + H1 + sub** is the canonical page-header rhythm. Eyebrow always above H1. Sub always immediately below H1.

**Step indicator.** Small pills with a numbered circle + label. Active pill: forest background, cream text, weight 500. Completed: success-tinted circle. Inactive: line background, ink-2 text.

## Iconography

Lucide or Tabler icons, stroke style (not filled). ~14–28px depending on context. Color matches surrounding text (forest for accent, ink-2 for default).

## Voice & copy

- **Direct, calm, premium.** "Pick the kit that fits your plan." not "Find Your Perfect Kit!"
- **No exclamation marks.** Ever.
- **No fear language.** "Be prepared" not "Don't get caught off guard."
- **Sentence case** everywhere except eyebrows (all caps) and proper nouns.
- **Numbers as numerals.** "3 pre-packed subkits" not "three pre-packed subkits".
- **Prices unstyled.** `$245` not `$245.00` or `USD 245`.

## Layout

- **Page container.** `max-width: 1200–1380px`, centered, `padding: 24px`.
- **Working screens** use a centered single column, `max-width: 640px`.
- **Hero screens** use the full container width.
- **Generous whitespace** above H1 (~48–80px on hero screens).

## Photography direction

When photography is requested for a screen:
- Subjects on **sand `#F5F1EA`** or **sand-2 `#EFEADD`** backdrops — never pure white, never dark.
- Soft directional lighting, no harsh shadows.
- Products centered with breathing room. Real-feel, not over-styled stock.
- Hub/Vault renderings: photoreal but slightly stylized, soft drop shadow on the sand-2 surface.
- No people in the demo set. Product-only.

## What this design system explicitly is NOT

- Not tactical, military, or "operator." No black-on-orange. No camo.
- Not playful or cartoonish. No bright primary colors, no rounded-blob illustrations.
- Not over-styled DTC. No gradient buttons, no neon accents, no glassmorphism.

---

End of preamble. Per-screen brief follows below.
