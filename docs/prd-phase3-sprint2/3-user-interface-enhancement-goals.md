# 3. User Interface Enhancement Goals

## Modified Screens

| Screen | Route | Modification |
|---|---|---|
| SubkitSelectionScreen | `/builder` | Layout refresh (vertical → horizontal), MCQ elevation + visual distinction |
| SummaryScreen | `/summary` | "Get My Kit" CTA re-routed to `/review` |
| ReviewOrderScreen | `/review` | `KitSummaryCard` custom path implemented |
| OrderConfirmationScreen | `/confirmation` | Dual-path support, "Now Let's Fill Your Kit" CTA added |

## New Components

| Component | Screen | Purpose |
|---|---|---|
| `ElevationBadge` | SubkitSelectionScreen | Visual indicator on MCQ-elevated subkits |
| `ElevationGroupHeader` | SubkitSelectionScreen | Section header for elevated subkit group |
| `CustomKitSummary` | ReviewOrderScreen | Kit summary card for the Build My Own path |
| `FillKitStubModal` | OrderConfirmationScreen | Placeholder modal for Part 2 bridge CTA |

## UI Design Principles

**Visualizer Refresh:**
- Housing unit visualizer and subkit list displayed side-by-side on desktop (visualizer left 40%, subkit cards right 60%). Stacked on mobile (visualizer top, cards below).
- SubkitCards retain all existing functionality but adapt to the horizontal layout's narrower card width.
- No existing category colors change. Pets subkit uses `colorBase: #BE185D`, `colorTint: #FFF1F2` (rose).

**MCQ Elevation:**
- Elevated subkits appear in a visually distinct group at the top of the subkit list, under a "Suggested for your situation" section header with a 16px gap separating them from non-elevated subkits.
- The elevation indicator (pill badge "Suggested for you" + 3px `#22C55E` left border accent) communicates suggestion without implying obligation.
- Once a user selects an elevated subkit, the badge and border accent disappear entirely — the user's active choice takes precedence over the system's suggestion.

**Build My Own → Review & Order:**
- The custom `KitSummaryCard` mirrors the structure of the Essentials variant but shows user-selected subkits, item counts, and pricing from the kit store.
- Path label changes from "Essentials Kit" to "Custom Kit". Slot count is computed from the user's selections.

**Order Confirmation:**
- Unified layout serves both paths. Heading: "Your kit is on its way." (universal). Subheading is path-specific.
- "Now Let's Fill Your Kit →" primary CTA opens a forward-looking "Coming Soon" modal — feels intentional and optimistic, not broken.
- "Start Over" routes to `/` (cover page) for both paths, calls both `resetKit()` and `resetMCQ()`.
