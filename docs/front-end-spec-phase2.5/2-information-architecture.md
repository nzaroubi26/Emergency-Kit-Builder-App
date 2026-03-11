# 2. Information Architecture

## 2.1 Site Map / Screen Inventory

Linear 3-stage flow. No branching paths. Custom subkit is a screen variant, not a separate branch.

| ID | Screen | Route | Notes |
|----|--------|-------|-------|
| S0 | Cover / Landing Page | `/` | **Phase 2 entry point**; static; no store dependency; brand-primary bg; single CTA to /builder |
| S1 | Subkit Selection | `/builder` | Kit builder entry; visualizer above cards *(route renamed from `/` in Phase 2)* |
| S2 | Item Configuration | `/configure/:subkitId` | One per selected subkit |
| S2-C | Custom Subkit Browser | `/configure/custom` | All-category item grid |
| S3 | Summary Page | `/summary` | Read-only; print-ready; CTA prominent |
| OL1 | Slot Full Indicator | Inline on S1 | Not a route |
| OL2 | Back to Selection Confirm | Modal on S2 | Triggered by secondary back link |
| OL3 | Start Over Confirm | Modal on S3 | Triggered by Start Over |
| EXT1 | Purchase Page | External URL | Phase 2: real checkout endpoint |
| PRINT | Print View | CSS @media print | Triggered from S3 |

## 2.2 Navigation Structure

**Step progression:**
```
Step 1: Build Your Kit  →  Step 2: Configure Items  →  Step 3: Review Kit
```
- Forward: CTAs — Configure Items / Next Subkit / Review My Kit
- Back: Always available; Edit Kit link from S3
- Step indicator: Informational only — not clickable in MVP

**Destructive Action Confirmations:**

| Action | Modal Message |
|--------|---------------|
| Back to Subkit Selection (from S2) | "Going back will keep all your selections. You can return at any time." |
| Start Over (from S3) | "Starting over will clear your entire kit configuration. Are you sure?" |

---
