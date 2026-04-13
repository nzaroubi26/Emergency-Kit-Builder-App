# 2. Requirements

## Functional Requirements

**MCQ Step**

- **FR1:** Two new MCQ screens shall be inserted into the user flow between the app entry point ("Build My Kit" CTA) and the fork screen. Screen 1 (emergency type) at `/build`, Screen 2 (household composition) at `/build/household`.
- **FR2:** Each MCQ screen presents one multi-select question. Both screens must be completed (or Q2 explicitly skipped via "None of the Above") before the user can proceed to the fork.
- **FR3 — Q1:** "What type of emergency are you prepping for?" — five visual tiles: Flood, Tornado, Hurricane, Tropical Storm, Extreme Heat. "Extreme Heat" renders as a disabled, grayed-out tile with a "Coming Soon" label — non-selectable. Only four values exist in the `EmergencyType` union (`extreme-heat` excluded per YAGNI — added when the tile becomes selectable).
- **FR4 — Q2:** "Who will you be caring for?" — five options: Kids, Older Adults, Person with a Disability, Pets, None of the Above. Selecting "None of the Above" immediately deselects all other Q2 options. Selecting any other Q2 option while "None of the Above" is active immediately deselects it.
- **FR5:** The primary CTA to proceed is disabled until at least one Q1 answer and one Q2 answer are selected. "None of the Above" satisfies the Q2 requirement.
- **FR6:** MCQ answers are stored in a new Zustand store (`mcqStore`) and persisted to sessionStorage under key `emergency-mcq-v1`. The MCQ store is separate from the existing kit store.
- **FR7:** MCQ answers do not determine which fork option is shown. Both options are always displayed.
- **FR8:** MCQ answers do not modify the Essentials Kit bundle contents.

**Fork Screen**

- **FR9:** After completing the MCQ, the user is taken to a fork screen presenting two co-equal options: "Get The Essentials Kit" and "Build My Own Kit."
- **FR10:** Both options are displayed as equal-weight cards. Neither appears visually superior. The "Get The Essentials Kit" option may carry a "Recommended for most households" badge.
- **FR11:** "Get The Essentials Kit" card displays the bundle contents directly on the card: Power (Large), Cooking (Regular), Medical (Regular), Communications (Regular).
- **FR12:** Selecting "Get The Essentials Kit" writes the Essentials bundle to the kit store, sets `kitPath: 'essentials'` in the MCQ store, and routes directly to the Review & Order shell (`/review`). There is no separate Essentials display screen (Sally Decision 19).
- **FR13:** Selecting "Build My Own Kit" sets `kitPath: 'custom'` in the MCQ store and routes to the existing subkit selection screen (`/builder` — current version, no UI refresh yet).
- **FR14:** Back navigation returns the user to the household MCQ screen (`/build/household`) from the fork screen.

**Review & Order Shell**

- **FR15:** A Review & Order shell screen is built at `/review` in Sprint 1. It displays the kit summary (Essentials bundle), a delivery section with address/pickup options, and a "Place Order" CTA.
- **FR16:** The kit summary section uses a `KitSummaryCard` component that branches on `kitPath`. In Sprint 1, only the `'essentials'` path is functional. The `'custom'` path is scaffolded for Sprint 2.
- **FR17:** The "Place Order" CTA navigates to the existing `/confirmation` (OrderConfirmationScreen) as a prototype endpoint. No real fulfillment or payment processing.
- **FR18:** Back navigation returns the user to the fork screen (`/choose`).
- **FR19:** The delivery section offers two radio options: "Deliver to my address" (with address fields) and "Pick up at a location" (with mock location dropdown). Prototype-only — no validation beyond basic field presence.

## Non-Functional Requirements

- **NFR1:** MCQ state (`emergencyTypes: EmergencyType[]`, `householdComposition: HouseholdOption[]`, `kitPath: KitPath`) is stored in a new separate Zustand store (`mcqStore.ts`). The existing kit store shape for `selectedSubkits`, `itemSelections`, and `slotAssignments` is unchanged.
- **NFR2:** MCQ state is persisted to sessionStorage under key `emergency-mcq-v1` via custom Zustand `persist` storage adapter. `kitPath` is excluded from persistence via `partialize` — resets on tab close/refresh.
- **NFR3:** Four new screens each have a dedicated route (`/build`, `/build/household`, `/choose`, `/review`). No existing routes are modified. Route guards enforce sequential progression.
- **NFR4:** All new screens and components conform to the coding standards in `docs/architecture.md` Section 11.
- **NFR5:** All new interactive elements meet WCAG 2.1 AA: keyboard navigable, appropriate ARIA attributes, sufficient color contrast.
- **NFR6:** MCQ tile selection states (selected/deselected/disabled) are visually unambiguous at all supported viewport sizes.
- **NFR7:** Phase 3 Sprint 1 routes bypass the existing `MobileInterstitial` guard via an exemption list in `AppShell.tsx`. These screens are mobile-first.

## Compatibility Requirements

- **CR1:** The existing subkit selection flow (SubkitSelectionScreen → ItemConfigScreen → SummaryScreen) is unchanged. Sprint 1 adds new screens before the fork without modifying any existing screen except the Cover Page CTA route target.
- **CR2:** The existing Zustand kit store shape is unchanged. MCQ state lives in a separate store.
- **CR3:** The existing `CATEGORIES` and `ITEMS` data structures in `kitItems.ts` are not modified in Sprint 1.
- **CR4:** The Essentials bundle is hardcoded via config constant (`ESSENTIALS_BUNDLE` in `essentialsConfig.ts`) in Sprint 1. No dynamic computation.

---
