# 5. Epic and Story Structure

Two epics, ordered by dependency.

- **Epic 15 — Pets Subkit, Visualizer Refresh & MCQ Surfacing:** Adds the Pets subkit to the catalog, refreshes the visualizer layout, implements MCQ elevation logic, and adds visual distinction for suggested subkits. Stories 15.1 (Pets data) and 15.2 (layout refresh) can run in parallel. Story 15.3 (elevation logic) depends on 15.1. Story 15.4 (visual distinction) depends on 15.3.
- **Epic 16 — Build My Own Order Flow & Confirmation:** Wires the Build My Own path to Review & Order, implements the custom `KitSummaryCard`, and updates Order Confirmation for dual-path support with the "Fill Your Kit" CTA. Story 16.1 (KitSummaryCard) can start in parallel with Epic 15. Story 16.2 (wiring) depends on 16.1. Story 16.3 (confirmation) depends on 16.2.

---
