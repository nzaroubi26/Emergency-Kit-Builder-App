# Handoff to Dev Agent

Epic 11 stories are sequenced as a strict dependency chain:

```
11.1 (pricing data + pure functions)
  └── 11.2 (cart shell + AppHeader badge + AppShell wiring)
        └── 11.3 (CartSidebar live content)
              └── 11.4 (SummaryScreen CTA + OrderConfirmationScreen + route)
```

Each story must be merged to `main` before the next story branch is cut. Story branches follow the convention `story/11.1-cart-pricing-functions`, `story/11.2-cart-shell`, `story/11.3-cart-content`, `story/11.4-confirmation-screen`.

The architecture document (`docs/architecture.md` v2.2, Section 1 Phase 2.6 table and Section 7 routing) is the authoritative reference for all file locations, component interfaces, and coding constraints. Stories 11.1–11.4 together deliver the complete Phase 2.6 Cart & Checkout MVP scope.

---

*Emergency Prep Kit Builder — Epic 11: Cart & Checkout MVP | Version 1.0 | 2026-03-10 | John, PM / Sarah, PO*
