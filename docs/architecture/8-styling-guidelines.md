# 8. Styling Guidelines

## Approach

**Tailwind CSS v4 + CSS Custom Properties.** All design tokens from `design-tokens.ts` are mirrored as CSS custom properties in the `@theme` block in `globals.css`. This creates one authoritative styling pipeline:

```
design-tokens.ts  →  globals.css @theme  →  Tailwind utility classes in components
```

**Dynamic category colors** (visualizer fills, card borders, progress bar fills) must use **inline styles** — Tailwind cannot generate classes for runtime hex values:

```tsx
// Correct — dynamic color as inline style
<div style={{ backgroundColor: category.colorBase }} className="h-10 rounded-[var(--radius-md)]" />

// Wrong — Tailwind cannot generate this at runtime
<div className={`bg-[${category.colorBase}]`} />
```

**All static structural UI** (layout, spacing, neutral colors, typography sizing) uses Tailwind utility classes.

## globals.css

```css
/* src/styles/globals.css */
@import "tailwindcss";
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

@theme {
  /* Font */
  --font-sans: 'Inter', system-ui, sans-serif;

  /* Brand */
  --color-brand-primary:       #1F4D35;
  --color-brand-primary-hover: #163828;
  --color-brand-primary-light: #E8F5EE;
  --color-brand-accent:        #22C55E;

  /* Neutrals */
  --color-neutral-white: #FFFFFF;
  --color-neutral-50:    #F8F9FA;
  --color-neutral-100:   #F3F4F6;
  --color-neutral-200:   #E5E7EB;
  --color-neutral-300:   #D1D5DB;
  --color-neutral-400:   #9CA3AF;
  --color-neutral-500:   #6B7280;
  --color-neutral-700:   #374151;
  --color-neutral-900:   #111827;

  /* Semantic */
  --color-status-success: #16A34A;
  --color-status-warning: #D97706;
  --color-status-error:   #DC2626;
  --color-status-info:    #2563EB;

  /* Border radius */
  --radius-sm:   6px;
  --radius-md:   10px;
  --radius-lg:   16px;
  --radius-full: 9999px;

  /* Elevation */
  --shadow-1: 0 1px 3px rgba(0,0,0,0.08);
  --shadow-2: 0 4px 6px rgba(0,0,0,0.07);
  --shadow-3: 0 20px 25px rgba(0,0,0,0.12);

  /* Motion durations */
  --duration-instant:  0ms;
  --duration-fast:     130ms;
  --duration-default:  150ms;
  --duration-moderate: 200ms;
  --duration-standard: 220ms;
  --duration-screen:   240ms;
  --duration-reward:   360ms;

  /* Motion easings */
  --ease-standard:   cubic-bezier(0.4, 0, 0.2, 1);
  --ease-decelerate: cubic-bezier(0, 0, 0.2, 1);
  --ease-accelerate: cubic-bezier(0.4, 0, 1, 1);
  --ease-spring:     cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Global base */
:root {
  font-family: var(--font-sans);
  background-color: var(--color-neutral-50);
  color: var(--color-neutral-700);
  -webkit-font-smoothing: antialiased;
}

/* Focus indicators — per UX spec Section 7 */
:focus-visible {
  outline: 2px solid var(--color-brand-primary);
  outline-offset: 2px;
  border-radius: 4px;
}
.subkit-card:focus-visible {
  outline: 3px solid var(--color-brand-primary);
  outline-offset: 0;
}
:focus:not(:focus-visible) { outline: none; }

/* Reduced motion — hard requirement from UX spec Section 9 */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## print.css

Imported **only** in `SummaryScreen.tsx` — not global.

```css
/* src/styles/print.css */
@media print {
  header,
  .step-progress-indicator,
  .btn-get-my-kit,
  .btn-edit,
  .btn-print,
  .btn-start-over { display: none !important; }

  body { background: white; font-size: 12pt; color: #000; }

  .summary-subkit-section { page-break-inside: avoid; }

  /* No + icons in print — empty slots render as clean boxes */
  .visualizer-slot-empty::after { content: none; }
  .visualizer-slot-empty {
    background-color: #f8f9fa !important;
    border: 1px solid #e5e7eb !important;
  }
}
```

## Animation Rules

All animations use **`transform` and `opacity` only** — GPU-composited, zero layout reflow. This is the hard architectural constraint behind NFR2 (slot updates < 100ms).

```tsx
// Correct — GPU-composited properties only
style={{ opacity: filled ? 1 : 0, transition: `opacity var(--duration-standard) var(--ease-standard)` }}
style={{ transform: 'translateX(0)', transition: `transform var(--duration-screen) var(--ease-standard)` }}

// Never animate these — they cause layout reflow:
// width, height, top, left, right, bottom, padding, margin
```

**Slot fill animation detail** (Animation #1 from UX spec):
- The slot `div` transitions `background-color` over 220ms
- The name `span` inside delays its `opacity` transition by 80ms
- These are two separate CSS transitions on two separate elements — not a single combined transition

**Large block behavior** (Animation #9):
- Both rows (`isLargeStart` and `isLargeEnd`) receive the same `background-color` transition simultaneously
- The internal divider between them transitions `opacity` to 0 — both rows visually merge into one continuous block

---
