# 2. Requirements

## Functional Requirements

**Pets Subkit**

- **FR1:** A new `pets` category is added to `CATEGORIES` in `kitItems.ts` with all required fields: `id`, `name`, `colorBase`, `colorTint`, `icon`, `description`, `sizeOptions: ['regular', 'large']`. Color and icon must be visually distinct from existing 9 categories.
- **FR2:** A minimum of 3 items are added to `ITEMS` with `categoryId: 'pets'`. All fields populated including `weightGrams`, `volumeIn3`, and `pricePlaceholder`.
- **FR3:** The Pets subkit is selectable in the Build My Own visualizer. It renders with its category color in the housing unit slots and is configurable via the existing ItemConfigScreen flow.

**Visualizer UI Refresh**

- **FR4:** The SubkitSelectionScreen layout is updated from a vertical (top-to-bottom) card grid to a horizontal (left-to-right) layout. Housing unit visualizer and subkit list are side-by-side on desktop, stacked on mobile.
- **FR5:** Category colors in the visualizer are updated per Sally's Sprint 2 spec. Existing `colorBase` and `colorTint` values in `CATEGORIES` may be adjusted.
- **FR6:** The existing 6-slot capacity system, size toggle (Regular/Large), and "Configure Items" CTA flow are unchanged. The refresh is layout and visual only.
- **FR7:** The SubkitCard component is updated to reflect the new layout but retains all existing functionality: select/deselect, size toggle, slot count impact.

**MCQ → Subkit Surfacing Logic**

- **FR8:** When a user arrives at the SubkitSelectionScreen via the Build My Own path, the app reads `emergencyTypes` and `householdComposition` from the MCQ store and computes an elevation set — the subkits that are relevant to the user's answers.
- **FR9:** Elevated subkits are sorted to the top of the subkit list in the visualizer. Non-elevated subkits appear below in their default order. Elevation is visual ordering only — not pre-selection.
- **FR10:** Elevation rules follow the locked tables from the Sprint 1 architecture (Section 11):

  **Q2 (household) — additive elevation:**

  | Household Option | Elevated Subkits |
  |---|---|
  | Kids | Hygiene, Medical, Comfort |
  | Older Adults | Medical, Comfort |
  | Disability | Medical, Comfort |
  | Pets | Pets |
  | None | No effect |

  **Q1 (emergency type) — additive elevation:**

  | Emergency Type | Elevated Subkits |
  |---|---|
  | Flood / Hurricane | Power, Communications, Cooking |
  | Tropical Storm | Power, Communications |
  | Tornado | Medical, Lighting, Clothing |

  Elevation is additive when multiple MCQ answers are selected. If both Q1 and Q2 elevate the same subkit, it is still elevated once (deduplicated). Q2 takes visual priority over Q1 when both elevate — Q2-elevated subkits appear first within the elevated group.

- **FR11:** Subkits that reach the visualizer without MCQ context (e.g., direct navigation to `/builder` without completing MCQ) display in their default catalog order with no elevation applied.
- **FR12:** Elevation is informational only. Users can select any subkit regardless of elevation status. Elevated subkits are not auto-selected.

**MCQ Visual Distinction**

- **FR13:** Elevated (MCQ-suggested) subkits in the visualizer carry a visual indicator that distinguishes them from non-elevated subkits. Sally to specify the exact treatment (badge, border accent, background tint, or icon). The indicator is present in the unselected state and may change or disappear when the user actively selects the subkit.
- **FR14:** The visual distinction must be understandable without color alone (WCAG 2.1 AA). A text label or icon supplement is required.
- **FR15:** The distinction does not imply obligation — the copy and visual treatment must feel like a suggestion, not a requirement.

**Build My Own → `/review` Wiring**

- **FR16:** When a user completes the existing Build My Own flow (SubkitSelection → ItemConfig → Summary) and clicks "Get My Kit" on the Summary screen, the app navigates to `/review` with `kitPath === 'custom'`.
- **FR17:** The `KitSummaryCard` component's `path === 'custom'` branch is implemented. It reads `selectedSubkits` and `itemSelections` from the existing kit store and renders the user's custom kit with category colors, names, sizes, item counts, and pricing.
- **FR18:** The Review & Order page's delivery section and "Place Order" CTA function identically for both Essentials and Custom paths.
- **FR19:** Back navigation from `/review` when `kitPath === 'custom'` returns to `/summary` (not to `/choose`).

**Order Confirmation + "Now Let's Fill Your Kit" CTA**

- **FR20:** The Order Confirmation screen (`/confirmation`) is updated to serve both Essentials and Custom paths. It displays the ordered kit summary appropriate to the path taken.
- **FR21:** For the Essentials path: confirmation shows the 4 Essentials bundle subkits (sourced from `ESSENTIALS_BUNDLE`).
- **FR22:** For the Custom path: confirmation shows the user's selected subkits with configured items (sourced from kit store).
- **FR23:** A new "Now Let's Fill Your Kit" CTA is added below the order summary. This is the entry point to Part 2 of the product experience. For Sprint 2, this CTA routes to a placeholder/stub — Part 2 scope is not Sprint 2. Sally and Winston to align on stub treatment.

## Non-Functional Requirements

- **NFR1:** Elevation logic is implemented as a pure function (`computeElevatedSubkits(emergencyTypes, householdComposition)`) that returns an `ElevationResult` struct containing `elevated: Set<string>` (all elevated category IDs) and `q2Elevated: Set<string>` (Q2-sourced subset for sort priority). This function is independently testable with no component or store dependencies. *(Updated per Winston's architecture addendum — revised from flat `Set<string>` to support Q2-priority sorting.)*
- **NFR2:** The Pets subkit addition is fully additive — no existing category data, store logic, or component behavior is modified. All existing consumers are TypeScript-safe.
- **NFR3:** The visualizer layout refresh does not change the underlying state model. `selectedSubkits`, `slotAssignments`, capacity calculations, and size toggles are unaffected.
- **NFR4:** The `KitSummaryCard` custom path reads from the existing kit store. No new store fields are added for Sprint 2.
- **NFR5:** All new and modified components meet WCAG 2.1 AA: elevation indicators are understandable without color alone, keyboard navigation is maintained through the refreshed layout.

## Compatibility Requirements

- **CR1:** The Essentials path (MCQ → Fork → `/review` → `/confirmation`) continues to function exactly as delivered in Sprint 1. Sprint 2 does not modify any Essentials-path component.
- **CR2:** The existing ItemConfigScreen and its per-subkit configuration flow are unchanged. Sprint 2 modifies the SubkitSelectionScreen layout and ordering but not the downstream configuration flow.
- **CR3:** The existing SummaryScreen continues to function but its "Get My Kit" CTA is re-routed to `/review` instead of `/confirmation`.
- **CR4:** All existing unit and E2E tests pass without modification after Sprint 2 changes, with the exception of tests that assert on the SubkitSelectionScreen layout (which will need updating to match the new horizontal layout).
