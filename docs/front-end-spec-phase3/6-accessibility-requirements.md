# 6. Accessibility Requirements

All Phase 3 Sprint 1 screens conform to **WCAG 2.1 Level AA** per the base spec. The following are additive requirements for the new screens.

## MCQ Tile Accessibility

**Semantic structure:**
```html
<fieldset>
  <legend>What type of emergency are you prepping for?</legend>
  <div role="group" class="tile-grid">
    <button role="checkbox" aria-checked="true" aria-label="Flood">
      <!-- icon + label -->
    </button>
    <button role="checkbox" aria-checked="false" aria-disabled="true"
            aria-label="Extreme Heat, Coming Soon">
      <!-- icon + label + badge -->
    </button>
  </div>
</fieldset>
```

- Each MCQ question is wrapped in `<fieldset>` with `<legend>`
- Each tile uses `role="checkbox"` with `aria-checked` reflecting selection state
- Disabled tiles use `aria-disabled="true"` (not HTML `disabled`) — tile remains in tab order for discoverability
- "None of the Above" uses the same `role="checkbox"` pattern

## Keyboard Navigation

| Screen | Tab Order | Special Behavior |
|--------|-----------|------------------|
| MCQ-1 | Back link → Tiles (left-to-right, top-to-bottom) → Next CTA | Space/Enter toggles tile selection |
| MCQ-2 | Back link → Standard tiles → NOTA tile → Next CTA | Space/Enter toggles; NOTA mutex is immediate |
| Fork | Back link → Essentials card CTA → Build My Own card CTA | Enter activates card CTA |
| Review & Order | Back link → Kit summary (read-only) → Delivery radios → Address/Pickup fields → Place Order CTA | Arrow keys switch radio; Tab moves to input fields |

## ARIA Live Regions

| Event | Announcement | Type |
|-------|-------------|------|
| Q1 tile selected | "[Type] selected." | `polite` |
| Q1 tile deselected | "[Type] deselected." | `polite` |
| Q2 tile selected | "[Option] selected." | `polite` |
| Q2 NOTA selected | "None of the Above selected. All other options cleared." | `polite` |
| Q2 NOTA deselected | "None of the Above deselected." | `polite` |
| Next CTA enabled | "You can now proceed to the next step." | `polite` |
| Fork card activated | "Navigating to [destination]." | `assertive` |

## Focus Management

```typescript
// On screen transition, focus the page heading
useEffect(() => {
  headingRef.current?.focus();
}, [location.pathname]);
```

- Each new screen focuses its `<h1>` on mount via `tabIndex={-1}` + `ref.focus()`
- Fork card CTAs do not auto-focus — user navigates via Tab
- Review & Order: focus moves to heading on arrival; delivery radio group is standard tab-order

## Color Contrast Verification

| Context | Foreground | Background | Ratio | Status |
|---------|-----------|------------|-------|--------|
| Selected tile text on brand-primary-light | `#1F4D35` | `#E8F5EE` | ~8.5:1 | PASS |
| NOTA selected text on neutral-100 | `#374151` | `#F3F4F6` | ~9.5:1 | PASS |
| Disabled tile text on neutral-100 | `#9CA3AF` | `#F3F4F6` | ~2.3:1 | PASS (WCAG exception for disabled) |
| Trust badge text on brand-primary-light | `#1F4D35` | `#E8F5EE` | ~8.5:1 | PASS |
| Step indicator on neutral-50 | `#9CA3AF` | `#F8F9FA` | ~2.1:1 | Decorative — non-essential info |

---
