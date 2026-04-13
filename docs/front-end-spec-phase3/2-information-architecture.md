# 2. Information Architecture

## 2.1 Updated Site Map

Phase 3 Sprint 1 inserts four screens between the Cover Page (S0) and the existing Subkit Selection (S1). Two paths diverge at the Fork screen.

| ID | Screen | Route | Notes |
|----|--------|-------|-------|
| S0 | Cover / Landing Page | `/` | CTA updated: routes to `/build` instead of `/builder` |
| **MCQ-1** | **MCQ: Emergency Type** | **`/build`** | **New — Q1 multi-select** |
| **MCQ-2** | **MCQ: Household** | **`/build/household`** | **New — Q2 multi-select with NOTA mutex** |
| **F1** | **Fork Screen** | **`/choose`** | **New — two co-equal path cards** |
| **RO** | **Review & Order** | **`/review`** | **New — shell, serves both paths** |
| S1 | Subkit Selection | `/builder` | Unchanged — "Build My Own" path entry |
| S2 | Item Configuration | `/configure/:subkitId` | Unchanged |
| S2-C | Custom Subkit Browser | `/configure/custom` | Unchanged |
| S3 | Summary Page | `/summary` | Unchanged |
| S4 | Order Confirmation | `/confirmation` | Unchanged |

## 2.2 Navigation Structure

**Essentials Path:**
```
S0 (Cover) → MCQ-1 → MCQ-2 → F1 (Fork) → RO (Review & Order)
```

**Build My Own Path:**
```
S0 (Cover) → MCQ-1 → MCQ-2 → F1 (Fork) → S1 (Builder) → S2 × N → S3 (Summary)
```

**Back navigation chain:**
```
RO → F1 → MCQ-2 → MCQ-1 → S0
```

**Key routing rules:**
- The main `StepProgressIndicator` (Step 1/2/3) does NOT appear on MCQ, Fork, or Review & Order screens
- MCQ screens show their own lightweight step indicator ("Step 1 of 2" / "Step 2 of 2")
- Direct navigation to `/build/household` without Q1 answers → redirect to `/build`
- Direct navigation to `/choose` without MCQ completion → redirect to `/build`
- Direct navigation to `/review` without a kit path selected → redirect to `/choose`

---
