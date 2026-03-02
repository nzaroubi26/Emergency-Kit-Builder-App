# 4. Technical Assumptions

## Repository Structure
Monorepo - single repository housing the frontend application and supporting data/configuration files.

## Service Architecture
Single-Page Application (SPA) - fully client-side rendered. No backend required for MVP. All kit configuration state managed client-side within the session.

## Analytics

User behavior tracking is formally deferred to Phase 2. Priority metrics to instrument at that stage include: kit completion rate, subkit selection frequency, item inclusion rates, and Summary Page CTA conversion. A lightweight privacy-friendly tool (e.g., Plausible or Google Analytics 4) is recommended.

## Testing Requirements
- Unit tests for core logic (slot constraint enforcement, size calculations, item catalog filtering)
- Component tests for key UI components (visualizer, item configurator, summary page)
- Manual testing for end-to-end flows in MVP - automated E2E deferred to Phase 2

## Technology Stack

- **Framework:** React with TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Context API or Zustand
- **Data:** Structured TypeScript data files for subkit categories and item catalog
- **Visualizer:** Self-contained React component, props-driven, onSlotClick callback wired for Phase 2
- **Backend:** None in MVP - static data only
- **Deployment:** Vercel (static site hosting)
- **Future readiness:** Architecture anticipates Phase 2 e-commerce, reviews, branded catalog, user profiles

---
