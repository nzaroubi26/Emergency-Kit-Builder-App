# Sprint 3 — API Spike Exit Criteria

**Prepared by:** John, Product Manager
**Date:** 2026-04-14
**Owner:** Winston, Architect
**Purpose:** Define scope, exit criteria, and deliverable for the Amazon API feasibility spike.
**Status:** Ready for Winston to execute.

---

## Overview

Sprint 3 is the first external API dependency. Before committing to any architecture, Winston assesses two Amazon APIs and provides a go/no-go recommendation for each. This is research only — no implementation.

---

## API 1: Cart API — "Add All to Amazon Cart"

### Goal

Determine if we can programmatically generate an Amazon cart pre-loaded with a user's recommended products via a single CTA button.

### Exit Criteria

Winston must answer:

| # | Question |
|---|----------|
| 1 | Can we programmatically add N items to an Amazon cart without the user being pre-authenticated to Amazon? |
| 2 | Does this require an approved Associates account or API keys? |
| 3 | Are there CORS/browser restrictions that prevent client-side calls? |
| 4 | Does Amazon still actively support this? (Their Cart API has been deprecated and revived multiple times) |
| 5 | **Go/no-go recommendation with reasoning** |

### If Go

- What's the minimum integration path?
- Client-side only, or do we need a backend proxy?
- What are the constraints (item limits, URL length, etc.)?

### If No-Go

- Confirm the fallback works: a single URL that opens Amazon with multiple ASINs (the "Add to Cart" URL construction method)
- Document the fallback URL format

---

## API 2: PA-API 5.0 — Product Advertising API

### Goal

Determine if we can retrieve live product data (pricing, images, availability) from Amazon to replace static data in a future sprint.

### Exit Criteria

Winston must answer:

| # | Question |
|---|----------|
| 1 | What are the auth requirements? (Associates account, API keys, approval process) |
| 2 | What are the rate limits? (Requests per second, daily caps) |
| 3 | Can we retrieve price + image + availability for a given ASIN? |
| 4 | Does it require a backend? (API keys can't be exposed client-side) |
| 5 | What's the latency like — can we call it on page load or do we need caching? |
| 6 | **Go/no-go recommendation with reasoning** |

### If Go

- What's the architecture impact? (Backend proxy, caching layer, API key management)
- What's the minimum viable integration for a prototype?

### If No-Go

- Static data approach (as defined in `docs/sprint-3-product-catalog.md`) continues indefinitely
- This is acceptable for the prototype

---

## Out of Scope

- Any implementation or code
- Performance benchmarking
- Cost analysis beyond "is free tier viable for a prototype"

---

## Deliverable

A single document: `docs/sprint-3-api-spike-results.md`

Contents:
1. Go/no-go on Cart API with supporting evidence
2. Go/no-go on PA-API 5.0 with supporting evidence
3. Architecture recommendations for Sprint 3B if either is a go
4. Fallback confirmation if either is a no-go

---

## What Depends on This Spike

| Downstream | Dependency |
|------------|-----------|
| Sprint 3B scoping | Go/no-go determines whether Sprint 3B exists and what it contains |
| Architecture brief (A7) | Winston's architecture recommendations feed directly into this |
| Decision D7 (from PM brief) | Whether the app stays client-side or needs a backend is answered here |

---

## Reference

- **PM brief:** `docs/sprint-3-pm-brief.md`
- **Product catalog:** `docs/sprint-3-product-catalog.md`
- **MCQ mapping:** `docs/sprint-3-mcq-mapping.md`

---

*Emergency Prep Kit Builder — Sprint 3 Spike Criteria | John, PM | 2026-04-14*
