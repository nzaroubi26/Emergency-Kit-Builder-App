# 3. User Flows

## Flow 1: Complete End-to-End Kit Configuration

**Goal:** Build complete kit from entry to Summary Page
**Success:** ≥3 subkits selected, all item config complete, Summary Page reached

Key path:
1. Land on S0 (Cover Page) → Click "Build My Kit" → Navigate to S1 at `/builder`
2. Select subkit cards → Size toggles appear → Visualizer updates
3. ≥3 subkits → Configure Items CTA activates
4. Item Config × N subkits → toggle items, set quantities, optionally empty container
5. Final subkit → Review My Kit → Summary Page
6. Summary → Get My Kit CTA / Edit Kit / Print / Start Over

**Edge cases:**
- Refresh mid-flow → kit configuration restored from localStorage (Phase 2); no data loss
- Browser back → React Router returns to previous subkit; state intact
- Direct nav to `/summary` with no state → redirect to `/builder`
- Direct nav to `/builder` or any configure route → works correctly; bypasses cover page

---

## Flow 2: Subkit Selection & Slot Constraint Enforcement

**Goal:** Select 3–6 subkits with Regular/Large sizes without exceeding 6 slots

Key states:
- Select card → fills next slot top-to-bottom → size toggle appears inline
- Regular → Large: checks if 2 adjacent slots free; if not, amber inline message on toggle
- Large → Regular: shrinks block, frees 1 slot immediately
- 6 slots full: remaining unselected cards go to disabled state (200ms); slot full indicator appears
- Deselect: slot clears; slots below shift up; disabled cards re-enable

**Edge cases:**
- Regular → Large when 0 slots remain → inline message, no modal
- Deselecting mid-sequence → remaining subkits shift up; order preserved for item config

---

## Flow 3: Item Configuration — Standard Subkit

**Goal:** Select items, set quantities, optionally mark as empty container

Key states:
- All items excluded by default
- Toggle ON → included state; qty selector activates at 1; max 10
- Toggle OFF → excluded; qty resets to 1 internally
- `−` at qty 1 → disabled; does not toggle item off
- Empty Container → item grid dims (opacity-35, pointer-events none); confirmation inline
- Back → previous subkit or S1 (first subkit); confirmation modal on secondary back link
- Next Subkit → advance; final subkit → Review My Kit → S3

---

## Flow 4: Custom Subkit Item Browser

**Goal:** Select items from across all 8 categories for a personalized subkit

Key states:
- Items grouped by parent category with CategoryGroupHeader
- Category jump nav at top for quick orientation
- Same toggle + quantity controls as standard subkit
- Items in Custom do not conflict with items in other subkits
- Empty Container option present — identical behavior to standard subkits: selecting it deselects all Custom items, dims the item grid (opacity-35, pointer-events none), and displays an inline confirmation in the Custom category color
- The empty container state is reflected on the Summary Page under the Custom category label
- CTA: "Next Subkit" or "Review My Kit" depending on position in sequence

---

## Flow 5: Summary Page & Exit Paths

**Goal:** Review completed kit; print, edit, or proceed to purchase

Exit paths:
- **Get My Kit** → triggers `initiateCheckout()` API call; on success, redirects in the **same window** (`window.location.href`). A new tab is not used — same-window is the correct e-commerce pattern. Kit configuration is preserved in localStorage (Story 6.1) and fully restored if the user navigates back.
- **Edit My Kit** → returns to S1 with full state preserved
- **Print** → `window.print()` — no separate route; @media print CSS applied
- **Start Over** → confirmation modal → clears all state → fresh S1

---
