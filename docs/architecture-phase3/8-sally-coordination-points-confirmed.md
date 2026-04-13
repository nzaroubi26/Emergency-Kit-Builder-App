# 8. Sally Coordination Points — Confirmed

## 8.1 Route Names

`/build`, `/build/household`, `/choose`, `/review` — **confirmed**. No conflicts with existing routes. Pattern is consistent with existing routing conventions.

## 8.2 MCQ Store Shape

| Type | Values | Status |
|------|--------|--------|
| `EmergencyType` | `'flood' \| 'tornado' \| 'hurricane' \| 'tropical-storm'` | Confirmed |
| `HouseholdOption` | `'kids' \| 'older-adults' \| 'disability' \| 'pets' \| 'none'` | Confirmed |
| `KitPath` | `'essentials' \| 'custom' \| null` | Confirmed |

Action names: `setEmergencyTypes`, `setHouseholdComposition`, `setKitPath` — Sally's components call these directly from the store.

## 8.3 `kitPath` Field

- Field name: `kitPath` — **confirmed**
- Values: `'essentials' | 'custom' | null` — **confirmed**
- Sally's Fork screen CTAs call `useMCQStore.getState().setKitPath('essentials')` or `setKitPath('custom')` then navigate

## 8.4 MobileInterstitial Exemption

Mechanism: `MOBILE_EXEMPT_ROUTES` array in `AppShell.tsx` — **confirmed**. Lightweight, explicit, no route tree restructure.

## 8.5 Icon Availability

All seven icons Sally's spec references are **verified present** in `lucide-react@^0.576.0`:

| Icon | Status |
|------|--------|
| `Tornado` | FOUND |
| `CloudRainWind` | FOUND |
| `Accessibility` | FOUND |
| `HeartHandshake` | FOUND |
| `PawPrint` | FOUND |
| `ShieldCheck` | FOUND |
| `SlidersHorizontal` | FOUND |

These are not in the current `iconResolver.ts` map — they don't need to be. The MCQ and Fork screens import them directly as named imports per the project's coding standard (never wildcard imports).

---
