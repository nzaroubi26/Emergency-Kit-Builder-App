# 7. Accessibility Requirements

## Compliance Target

**WCAG 2.1 Level AA** — minimum floor, not a ceiling.

## Color Contrast

| Context | Foreground | Background | Required | Status |
|---------|-----------|------------|----------|--------|
| Visualizer white name on category base | `#FFFFFF` | Category base | 4.5:1 | Power + Lighting borderline — verify at build |
| Primary button | `#FFFFFF` | `#1F4D35` | 4.5:1 | PASS (~12:1) |
| Body text on white | `#374151` | `#FFFFFF` | 4.5:1 | PASS |
| Body text on neutral-50 | `#374151` | `#F8F9FA` | 4.5:1 | PASS |
| Secondary text on white | `#6B7280` | `#FFFFFF` | 4.5:1 | MARGINAL (~4.6:1) — do not use on tinted bg |
| Caption text | `#9CA3AF` | Any | 4.5:1 | FAIL — use `#6B7280` minimum |
| Disabled elements | Any | Any | 3:1 | PASS — WCAG exception |

**Critical rule:** Color is never the sole differentiator. Every category element must include redundant text or icon identification.

## Focus Indicators

```css
:focus-visible {
  outline: 2px solid #1F4D35;
  outline-offset: 2px;
  border-radius: 4px;
}
.subkit-card:focus-visible {
  outline: 3px solid #1F4D35;
  outline-offset: 0px;
}
:focus:not(:focus-visible) { outline: none; }
```

## Keyboard Navigation

| Screen | Tab Order | Special Behavior |
|--------|-----------|------------------|
| S1 | Header → Visualizer (skip) → Subkit cards → Configure Items CTA | Space/Enter selects card; Tab within selected card reaches SizeToggle |
| S2 | Header → Back → EmptyContainerOption → Item cards → Next CTA → Back to Selection link | Space/Enter toggles item; Tab from active toggle reaches QuantitySelector |
| S2-C | Same as S2 + category jump nav before item grid | Enter on jump link scrolls to anchor |
| S3 | Header → Get My Kit CTA → Visualizer (skip) → Summary sections → Edit My Kit → Print → Start Over | Enter on Get My Kit triggers `initiateCheckout()`; on success redirects same window via `window.location.href` |
| Modals | Focus trapped within; Escape closes (cancel) | Focus returns to trigger on close |

**Configure Items CTA when disabled:** Use `aria-disabled="true"` — not `disabled` — so keyboard users can reach it and read the status message.

**Focus management on screen transitions:**
```typescript
useEffect(() => {
  if (currentScreen !== previousScreen) {
    mainHeadingRef.current?.focus();
  }
}, [currentScreen]);
<h1 ref={mainHeadingRef} tabIndex={-1}>Configure Your {subkit.name} Subkit</h1>
```

## Touch Targets

Minimum 44×44px for all interactive elements.

## Semantic HTML

```html
<ul role="list" aria-label="Subkit categories">
  <li>
    <button aria-pressed="true"
            aria-label="Power subkit — selected, Regular size, 1 slot used">
    </button>
  </li>
</ul>

<section aria-label="Housing unit — 3 of 6 slots used" aria-live="polite"></section>

<div role="group" aria-label="Quantity for Solar Panel">
  <button aria-label="Decrease quantity">−</button>
  <span aria-live="polite" aria-atomic="true">2</span>
  <button aria-label="Increase quantity">+</button>
</div>

<div role="dialog" aria-modal="true"
     aria-labelledby="modal-title" aria-describedby="modal-desc">
</div>
```

## ARIA Live Regions

| Event | Announcement | Type |
|-------|-------------|------|
| Subkit selected | "[Name] added. [N] of 6 slots used." | `polite` |
| Subkit deselected | "[Name] removed. [N] of 6 slots used." | `polite` |
| Size changed | "[Name] changed to Large. [N] of 6 slots used." | `polite` |
| Slots full | "Housing unit full. Deselect a subkit to add more." | `polite` |
| Minimum not met | "Select at least 3 subkits. You have [N]." | `assertive` |
| Item included | "[Item] included. Quantity: 1." | `polite` |
| Item excluded | "[Item] removed." | `polite` |
| Quantity changed | "Quantity updated to [N]." | `polite` |
| Empty container | "Empty container selected. All items deselected." | `polite` |

## Accessibility Testing

**Automated:** `@axe-core/react` (dev), `eslint-plugin-jsx-a11y` (CI), Lighthouse (per PR)

**Manual (required at epic completion):**

| Test | Tool |
|------|------|
| Keyboard-only navigation | Keyboard only |
| Screen reader full flow | NVDA+Chrome or VoiceOver+Safari |
| 200% zoom | Chrome zoom |
| Color vision simulation | Chrome DevTools → Rendering |
| High contrast mode | Windows High Contrast |
| Print preview | Browser print preview |

**Accessibility AC added to all stories in Epics 2–5:**
> *All interactive elements are keyboard operable, have visible focus indicators, and have programmatically associated labels or ARIA attributes. State changes are announced via the appropriate `aria-live` region.*

---
