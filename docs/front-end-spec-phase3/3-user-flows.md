# 3. User Flows

## Flow 6: Essentials Kit — End-to-End (Sprint 1 Primary)

**Goal:** Complete MCQ, select Essentials path, reach Review & Order
**Success:** User arrives at Review & Order with Essentials bundle displayed, in under 2 minutes

Key path:
1. Land on S0 (Cover) → Click "Build My Kit" → Navigate to `/build` (MCQ-1)
2. Select ≥1 emergency type tile → "Next" CTA activates
3. Click "Next" → Navigate to `/build/household` (MCQ-2)
4. Select ≥1 household option (or "None of the Above") → "Next" CTA activates
5. Click "Next" → MCQ answers saved to store → Navigate to `/choose` (Fork)
6. Click "Get The Essentials Kit" card → Essentials bundle written to kit store → Navigate to `/review` (Review & Order)
7. Review & Order displays Essentials bundle summary + delivery options + "Place Order" CTA

**Edge cases:**
- Refresh on MCQ-2 → persisted Q1 answers restored; Q2 answers restored if previously set
- Back from Fork → MCQ-2 with selections intact
- Back from Review & Order → Fork screen
- Browser back from MCQ-1 → Cover page

---

## Flow 7: Build My Own — MCQ to Existing Flow

**Goal:** Complete MCQ, select Build My Own path, enter existing kit builder
**Success:** User arrives at SubkitSelectionScreen with MCQ answers persisted

Key path:
1. Land on S0 → "Build My Kit" → MCQ-1 → MCQ-2 → Fork
2. Click "Build My Own Kit" card → Navigate to `/builder` (existing SubkitSelectionScreen)
3. Existing flow proceeds unchanged: select subkits → configure items → summary

**Edge cases:**
- MCQ answers are persisted but do not influence the existing flow in Sprint 1
- Back from `/builder` returns to Fork screen (not MCQ)

---

## Flow 8: MCQ "None of the Above" Mutex Behavior

**Goal:** "None of the Above" correctly mutex-toggles with other Q2 options

Key states:
- Select "Kids" → "Kids" tile selected; NOTA unselected
- Select "Pets" → "Kids" + "Pets" selected; NOTA unselected
- Select "None of the Above" → "Kids" + "Pets" immediately deselected; NOTA selected
- Select "Older Adults" while NOTA active → NOTA immediately deselected; "Older Adults" selected
- Deselect all Q2 options → "Next" CTA returns to disabled state

---

## Flow 9: MCQ "Extreme Heat" Disabled State

**Goal:** "Extreme Heat" is clearly non-interactive

Key states:
- Tile renders grayed out with "Coming Soon" badge on load
- Click/tap does nothing — no state change, no selection, no error
- Keyboard: tile is focusable but `aria-disabled="true"` prevents activation
- Screen reader: announces "Extreme Heat, Coming Soon, disabled"

---
