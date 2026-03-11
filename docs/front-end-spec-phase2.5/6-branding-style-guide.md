# 6. Branding & Style Guide

## Why Light Theme

1. Category color system reads with full clarity on white — tint contrast works correctly
2. Print readiness is a stated MVP requirement — light theme prints with near-zero extra work
3. "Reassuring" tone is better served by confident typography on white than a dark background

---

## Brand Colors

| Token | Hex | Use |
|-------|-----|-----|
| `brand-primary` | `#1F4D35` | Primary CTAs, focus rings |
| `brand-primary-hover` | `#163828` | CTA hover state |
| `brand-primary-light` | `#E8F5EE` | Brand callout backgrounds |
| `brand-accent` | `#22C55E` | Success states, checkmarks |

## Neutral Palette

| Token | Hex | Use |
|-------|-----|-----|
| `neutral-white` | `#FFFFFF` | Card surfaces, modal backgrounds |
| `neutral-50` | `#F8F9FA` | Page background |
| `neutral-100` | `#F3F4F6` | Secondary backgrounds |
| `neutral-200` | `#E5E7EB` | Borders, dividers |
| `neutral-300` | `#D1D5DB` | Dashed borders |
| `neutral-400` | `#9CA3AF` | Placeholder text, disabled labels |
| `neutral-500` | `#6B7280` | Secondary body text |
| `neutral-700` | `#374151` | Primary body text |
| `neutral-900` | `#111827` | Headings, high-emphasis text |

## Semantic Colors

| Token | Hex | Use |
|-------|-----|-----|
| `status-success` | `#16A34A` | Confirmed states |
| `status-warning` | `#D97706` | Slot full indicator |
| `status-error` | `#DC2626` | Form errors |
| `status-info` | `#2563EB` | Informational callouts |

## Category Color System

| # | Category | Base Hex | Tint Hex | Icon |
|---|----------|----------|----------|------|
| 1 | Power | `#C2410C` | `#FFF7ED` | `Zap` |
| 2 | Lighting | `#A16207` | `#FEFCE8` | `Lightbulb` |
| 3 | Communications | `#1D4ED8` | `#EFF6FF` | `Radio` |
| 4 | Hygiene | `#0F766E` | `#F0FDFA` | `Droplets` |
| 5 | Cooking | `#15803D` | `#F0FDF4` | `UtensilsCrossed` |
| 6 | Medical | `#991B1B` | `#FEF2F2` | `HeartPulse` |
| 7 | Comfort | `#6D28D9` | `#F5F3FF` | `Smile` |
| 8 | Clothing | `#334155` | `#F8FAFC` | `Shirt` |
| 9 | Custom | `#3730A3` | `#EEF2FF` | `Settings2` |

**Rules:**
- Base = visualizer fills + borders. Tint = card selected backgrounds only.
- Color is NEVER the sole differentiator — always paired with text or icon.
- Power and Lighting: verify 4.5:1 contrast with white text at implementation. Darken to `#B83709` / `#95680A` if needed.

## Typography

**Font:** Inter (Google Fonts)
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
```

| Token | Size | Weight | Use |
|-------|------|--------|-----|
| `text-display` | 36px | 700 | Summary hero heading |
| `text-h1` | 28px | 700 | Page titles |
| `text-h2` | 22px | 600 | Section headings |
| `text-h3` | 18px | 600 | Visualizer slot names, card titles |
| `text-body-lg` | 16px | 400 | Primary descriptive text |
| `text-body` | 14px | 400 | Item names, descriptions |
| `text-label` | 14px | 500 | Button labels, badges |
| `text-caption` | 12px | 400 | Slot counter, sub-labels |

## Iconography

**Library:** `lucide-react` exclusively

New icons needed for added PRD items:
- Feminine Hygiene Products: `Droplet`
- Ice Packs: `Snowflake`
- Ponchos: `CloudRain`
- Shoe Covers: `Footprints`

## Spacing

Base unit: 4px. All spacing is a multiple of 4.

| Token | px | Tailwind |
|-------|-----|----------|
| space-1 | 4px | p-1 |
| space-2 | 8px | p-2 |
| space-3 | 12px | p-3 |
| space-4 | 16px | p-4 |
| space-6 | 24px | p-6 |
| space-8 | 32px | p-8 |
| space-12 | 48px | p-12 |

**Max content widths:** Item config: 720px | Summary: 960px | App: 1280px

## Border Radius

| Token | Value | Use |
|-------|-------|-----|
| radius-sm | 6px | Badges, qty buttons |
| radius-md | 10px | Cards, inputs |
| radius-lg | 16px | Visualizer container, modals |
| radius-full | 9999px | Progress dots, number badges |

## Elevation

| Level | CSS | Use |
|-------|-----|-----|
| shadow-1 | `0 1px 3px rgba(0,0,0,0.08)` | Cards at rest |
| shadow-2 | `0 4px 6px rgba(0,0,0,0.07)` | Cards on hover, visualizer |
| shadow-3 | `0 20px 25px rgba(0,0,0,0.12)` | Modals |

## Design Token File

```typescript
// design-tokens.ts
export const colors = {
  brand: {
    primary: '#1F4D35',
    primaryHover: '#163828',
    primaryLight: '#E8F5EE',
    accent: '#22C55E',
  },
  neutral: {
    white: '#FFFFFF', 50: '#F8F9FA', 100: '#F3F4F6',
    200: '#E5E7EB', 300: '#D1D5DB', 400: '#9CA3AF',
    500: '#6B7280', 700: '#374151', 900: '#111827',
  },
  status: {
    success: '#16A34A', warning: '#D97706',
    error: '#DC2626', info: '#2563EB',
  },
  categories: {
    Power:          { base: '#C2410C', tint: '#FFF7ED' },
    Lighting:       { base: '#A16207', tint: '#FEFCE8' },
    Communications: { base: '#1D4ED8', tint: '#EFF6FF' },
    Hygiene:        { base: '#0F766E', tint: '#F0FDFA' },
    Cooking:        { base: '#15803D', tint: '#F0FDF4' },
    Medical:        { base: '#991B1B', tint: '#FEF2F2' },
    Comfort:        { base: '#6D28D9', tint: '#F5F3FF' },
    Clothing:       { base: '#334155', tint: '#F8FAFC' },
    Custom:         { base: '#3730A3', tint: '#EEF2FF' },
  },
} as const;

export const motion = {
  duration: {
    instant: '0ms', fast: '130ms', default: '150ms',
    moderate: '200ms', standard: '220ms', screen: '240ms', reward: '360ms',
  },
  easing: {
    standard:   'cubic-bezier(0.4, 0, 0.2, 1)',
    decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
    accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
    spring:     'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const;
```

## Print Styles

```css
@media print {
  header, .step-progress-indicator, .cta-primary,
  .cta-secondary, .btn-edit, .btn-start-over,
  .btn-print { display: none !important; }
  body { background: white; font-size: 12pt; color: #000; }
  .summary-subkit-section { page-break-inside: avoid; }
  .visualizer-slot-empty::after { content: none; }
}
```

---
