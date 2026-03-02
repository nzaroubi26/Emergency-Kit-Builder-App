# 8. Next Steps

## UX Expert Prompt

Sally - the PRD for the Emergency Prep Kit Builder is complete and ready for your review. Please create a Front-End Spec using the front-end-spec-tmpl. Key areas to focus on:
- The Housing Unit Visualizer - single-row 6-slot layout, color-coded subkit blocks, + empty state icons, Regular vs Large sizing behavior
- The Subkit Selection screen - category cards, size toggle, constraint enforcement
- The Item Configuration flow - stepped per-subkit walkthrough, quantity selectors, empty container option, Custom subkit browser
- The Summary Page - clean visual layout, visualizer in read-only state, prominent CTA, print readiness
The user has existing wireframes and designs to share - please incorporate those as your primary visual reference. Detailed physical product drawings for the visualizer will also be provided.

## Architect Prompt

Winston - the PRD for the Emergency Prep Kit Builder is complete and ready for your review. Please create a Frontend Architecture document using the front-end-architecture-tmpl. Key technical considerations:
- React SPA with TypeScript and Tailwind CSS
- No backend in MVP - session-based state only; static TypeScript data files for subkit and item catalog
- Housing Unit Visualizer - self-contained React component, props-driven, slot state managed externally, onSlotClick callback wired but dormant for Phase 2
- State management - React Context API or Zustand for kit configuration state across the 3-screen flow
- Data architecture - typed subkit/item data structure supporting future branded product mapping
- Deployment - static site hosting via Vercel or Netlify
- Phase 2 readiness - e-commerce integration, clickable visualizer, user profiles, Bazaarvoice reviews
