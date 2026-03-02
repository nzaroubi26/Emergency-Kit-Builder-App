# Emergency Prep Kit Builder - Product Requirements Document (PRD)

**Prepared by:** John, Product Manager
**Date:** 2025
**Version:** 1.0
**Status:** Draft - Ready for UX Expert and Architect

---

## 1. Goals and Background Context

### Goals

- Provide homeowners in hurricane-prone regions with a streamlined, intuitive tool to configure a personalized emergency preparedness kit
- Remove the mental load of emergency planning by offering a research-validated, guided kit-building experience
- Drive sales of the physical modular emergency storage system by connecting digital configuration to purchase intent
- Build brand trust and authority in the emergency preparedness space through a clean, reliable, expert-backed experience
- Deliver a satisfying, real-time visual experience via the housing unit visualizer that helps users feel confident and organized
- Close the gap left by incomplete, incompatible, and clutter-inducing competitor solutions by offering a unified, modular system that works with what users already own

### Background Context

Emergency preparedness is a recurring and growing challenge for millions of homeowners in hurricane and storm-prone regions. Increasing frequency and severity of weather events have heightened homeowner awareness - yet meaningful preparation remains elusive for most households. People face real structural barriers to action:

- **Uncertainty and underestimation:** Many do not know what to expect from a severe weather event, making it difficult to prepare with confidence
- **Competing priorities:** Preparation is consistently deprioritized against everyday demands - work, family, caregiving - until it is too late
- **Inadequate solutions:** Available products are difficult to research, costly, clutter-inducing, hard to maintain, and rarely tailored to specific household needs

The competitive landscape offers no complete answer. Existing solutions are incompatible with items users already own, forcing gear into suboptimal spots buried behind clutter. DIY kits fail because they are time-consuming, complex, and overwhelming to build from scratch.

The Emergency Prep Kit Builder addresses this gap as the digital companion to a purpose-built physical modular storage system. Built on three rounds of customer research, the app empowers users to build a personalized emergency kit that integrates what they already own, fills what they are missing, and maps directly to a real, purchasable storage solution engineered for severe weather.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025 | 1.0 | Initial PRD draft | John, PM |

---

## 2. Requirements

### Functional Requirements

- **FR1:** The app shall provide a Kit Builder interface where users can select between 3-6 subkits from 9 predefined categories without requiring account creation or an intake questionnaire
- **FR2:** The app shall display a dynamic Housing Unit Visualizer at the top of the Subkit Selection screen, showing a single-row arrangement of 6 rectangular slots representing the physical storage unit
- **FR3:** The visualizer shall update in real time as users make subkit selections - filling slots with color-coded, named blocks corresponding to each selected subkit category
- **FR4:** The visualizer shall support two subkit sizes: Regular (occupies 1 slot) and Large (occupies 2 adjacent slots), enforcing the constraint that the housing unit holds a maximum of 6 Regular-equivalent slots
- **FR5:** Empty slots in the visualizer shall display a + icon to indicate availability and invite selection
- **FR6:** Each subkit category shall be assigned a unique color in the visualizer for clear visual differentiation
- **FR7:** The app shall enforce the physical housing unit constraint at all times - preventing users from exceeding 6 slots total
- **FR8:** For each selected subkit, the app shall walk the user through the available items within that subkit category, allowing them to select which items to include and set quantities per item
- **FR9:** Users shall have the option to order a completely empty subkit container for any selected subkit, including the Custom subkit, accommodating users who already own some or all of the relevant supplies
- **FR10:** The item catalog shall be data-driven and easily expandable - new items and subkit categories can be added without requiring changes to core application logic
- **FR11:** The app shall display a Summary Page at the end of the configuration flow, showing all selected subkits and their respective items and quantities in a clear visual layout
- **FR12:** The app shall enforce a minimum selection of 3 subkits before a user can proceed to the Summary Page
- **FR13:** The Custom subkit slot (9th category) shall allow users to select any items from across all other predefined subkit categories, with full quantity control

### Non-Functional Requirements

- **NFR1:** The application shall be a standalone web app accessible via all modern browsers with no installation required
- **NFR2:** The visualizer shall update in real time with no perceptible lag - slot state changes shall commit to application state and begin rendering within 100ms of a user interaction. The visual fill animation may complete over up to 220ms.
- **NFR3:** The app shall be desktop-first with acceptable responsiveness on tablet and mobile web browsers
- **NFR4:** The application architecture shall be designed to support future integration of an e-commerce/checkout layer (Phase 2) without requiring significant refactoring
- **NFR5:** The item catalog and subkit data shall be structured to support future mapping to branded company products (Phase 2)
- **NFR6:** The visualizer component shall be built as a self-contained, extensible module to support Phase 2 clickable slot interactivity without a full rebuild
- **NFR7:** Page load time for the initial kit builder screen shall not exceed 3 seconds on a standard broadband connection
- **NFR8:** The application shall not require user authentication or data persistence in the MVP - all state is session-based
- **NFR9:** The codebase shall follow component-based architecture principles to enable maintainability and future feature additions
- **NFR10:** The app shall be designed with future Bazaarvoice reviews integration and educational content layers in mind

---

## 3. User Interface Design Goals

### Overall UX Vision

The Emergency Prep Kit Builder should feel like a confident, trustworthy guide - not an overwhelming form. The experience should be clean, focused, and rewarding at every step. The tone is: organized, reassuring, and modern.

### Key Interaction Paradigms

- **Progressive disclosure:** Users move through configuration one step at a time - subkit selection first, then item configuration per subkit
- **Real-time visual feedback:** The housing unit visualizer responds immediately to every selection
- **Non-prescriptive flexibility:** Users are never forced into a specific kit
- **Forgiving interactions:** Users can go back, change selections, and adjust items freely without losing progress

### Core Screens and Views

1. **Kit Builder - Subkit Selection Screen**
   - Housing Unit Visualizer at top, persistent, single-row 6-slot representation
   - Subkit selection cards below the visualizer
   - Regular/Large size toggle per subkit
   - Real-time slot constraint enforcement

2. **Item Configuration Screen (per subkit)**
   - Stepped walkthrough - one subkit at a time
   - Item list with include/exclude toggle and quantity selector
   - Option to mark subkit as empty
   - Progress indicator showing subkits remaining

3. **Custom Subkit Screen**
   - All items from all categories available in one browser
   - Items grouped by parent subkit category
   - Same include/exclude and quantity controls as standard subkits

4. **Summary Page**
   - Full visual overview of selected subkits and configured items
   - Housing unit visualizer in read-only completed state
   - Clear call-to-action toward purchase
   - Print-ready layout

### Accessibility

WCAG AA compliance as a baseline target.

### Branding

- Visual style: durable, modern, clean, and organized
- Each subkit category assigned a unique color for the visualizer
- Color palette to be finalized with design team
- Physical product drawings to be provided to UX team for visualizer reference

### Target Platforms

- **Primary:** Desktop web (modern browsers)
- **Secondary:** Tablet web (responsive)
- **Out of scope for MVP:** Mobile app, native iOS/Android

---

## 4. Technical Assumptions

### Repository Structure
Monorepo - single repository housing the frontend application and supporting data/configuration files.

### Service Architecture
Single-Page Application (SPA) - fully client-side rendered. No backend required for MVP. All kit configuration state managed client-side within the session.

### Analytics

User behavior tracking is formally deferred to Phase 2. Priority metrics to instrument at that stage include: kit completion rate, subkit selection frequency, item inclusion rates, and Summary Page CTA conversion. A lightweight privacy-friendly tool (e.g., Plausible or Google Analytics 4) is recommended.

### Testing Requirements
- Unit tests for core logic (slot constraint enforcement, size calculations, item catalog filtering)
- Component tests for key UI components (visualizer, item configurator, summary page)
- Manual testing for end-to-end flows in MVP - automated E2E deferred to Phase 2

### Technology Stack

- **Framework:** React with TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Context API or Zustand
- **Data:** Structured TypeScript data files for subkit categories and item catalog
- **Visualizer:** Self-contained React component, props-driven, onSlotClick callback wired for Phase 2
- **Backend:** None in MVP - static data only
- **Deployment:** Vercel (static site hosting)
- **Future readiness:** Architecture anticipates Phase 2 e-commerce, reviews, branded catalog, user profiles

---

## 5. Epic List

| Epic | Title | Goal |
|------|-------|------|
| 1 | Foundation and Core Infrastructure | Project scaffolding, routing, data architecture, deployable shell |
| 2 | Housing Unit Visualizer | Dynamic real-time visualizer as self-contained React component |
| 3 | Subkit Selection Flow | Category cards, sizing, constraints, visualizer integration |
| 4 | Item Configuration Flow | Stepped item walkthrough including Custom subkit browser |
| 5 | Summary Page | Kit overview, visualizer, CTA, and print readiness |

---

## 6. Epic Details

### Epic 1: Foundation and Core Infrastructure

#### Story 1.1 - Project Scaffolding and Setup

As a developer, I want a fully configured React project with Tailwind CSS, routing, and a deployment pipeline, so that the team has a clean, working foundation to build all features upon.

Acceptance Criteria:
1. React application initialized with TypeScript support
2. Tailwind CSS configured and working with a sample utility class rendered on screen
3. React Router configured with placeholder routes for Kit Builder, Item Configuration, and Summary Page
4. Project deployable to Vercel with a publicly accessible URL
5. Basic README documents how to run, build, and deploy the project locally

#### Story 1.2 - Subkit and Item Data Architecture

As a developer, I want a structured, typed data file defining all subkit categories and their associated items, so that all application features can consume a single source of truth for kit content.

Acceptance Criteria:
1. A typed TypeScript data structure defines all 9 subkit categories (name, id, color, size options)
2. All items for each of the 8 predefined subkits are defined (name, id, parent subkit)
3. Custom subkit category is defined and references all items across all other categories
4. Data structure supports item quantity configuration
5. Data structure includes fields for future branded product mapping (productId, price placeholder)
6. All data is importable as a module by any component in the application

Subkit Categories and Items:

| Subkit | Items |
|--------|-------|
| Power | Portable Power Station, Solar Panel, Charging Cables, Power Banks, Batteries AA/AAA |
| Communications | Hand Crank Radio, Walkie Talkies |
| Lighting | Matches, Flashlights, Electric Lanterns, Headlamp, Candles, Lighter, String Lights |
| Hygiene | Dental Hygiene Kit, Paper Cups, Toilet Paper, Baby Wipes, Feminine Hygiene Products |
| Cooking | Lifestraw, Propane Tank, Camping Stove |
| Medical | First Aid Kit, Ice Packs |
| Comfort | Portable Fan, Ear Plugs |
| Clothing | Ponchos, Shoe Covers |
| Custom | All items from all categories above |

Physical Product Specifications:

| Subkit Type | Height | Length | Width | Slots Used |
|-------------|--------|--------|-------|------------|
| Regular | 6 in | 24 in | 12 in | 1 of 6 |
| Large | 12 in | 24 in | 12 in | 2 of 6 |

#### Story 1.3 - Application Shell and Navigation

As a user, I want to land on a working application with clear navigation between the main screens, so that I can move through the kit building flow from start to finish.

Acceptance Criteria:
1. Landing page renders the Kit Builder (Subkit Selection) screen as the entry point
2. Navigation correctly routes between Kit Builder, Item Configuration, and Summary Page
3. A persistent header is present across all screens showing the app name and current step
4. A step progress indicator shows the user's position in the flow
5. Placeholder content is displayed on Item Configuration and Summary Page screens
6. Application is deployed and accessible via public URL

---

### Epic 2: Housing Unit Visualizer

#### Story 2.1 - Static Visualizer Component

As a user, I want to see a visual representation of my housing unit with 6 empty slots, so that I can understand the physical structure of the storage system before making any selections.

Acceptance Criteria:
1. A self-contained Visualizer React component is created and rendered at the top of the Subkit Selection screen
2. The visualizer displays a single vertical column of 6 equal-sized rectangular slots, stacked top to bottom
3. Each empty slot displays a + icon centered within it
4. The visualizer is styled to resemble the interior of a rectangular storage container
5. The component accepts slot state as props - fully controlled and stateless internally
6. The visualizer renders correctly on desktop and tablet screen sizes
7. Component is documented with a clear props interface in TypeScript

#### Story 2.2 - Dynamic Slot State and Subkit Rendering

As a user, I want the visualizer to update in real time when I select a subkit, so that I can immediately see how my selections fill the housing unit.

Acceptance Criteria:
1. When a Regular subkit is selected, its slot fills with a colored block displaying the subkit name
2. When a Large subkit is selected, it spans 2 adjacent slots with a single colored block
3. Each subkit category renders in its unique assigned color consistently throughout the app
4. Slot state updates render within 100ms of a user interaction
5. When a subkit is deselected, its slot returns to the empty + state
6. The visualizer correctly handles mixed configurations (e.g., 2 Large + 2 Regular = 6 slots)
7. Filled slots display the subkit name in legible, appropriately sized typography

#### Story 2.3 - Slot Constraint Enforcement

As a user, I want the visualizer to prevent me from exceeding the 6-slot housing unit capacity, so that my kit configuration always reflects a physically valid storage arrangement.

Acceptance Criteria:
1. The app tracks total slot usage in real time (Regular = 1 slot, Large = 2 slots)
2. When all 6 slots are occupied, remaining unselected subkit options are visually disabled
3. A clear visual indicator communicates when the housing unit is full
4. Switching a subkit from Regular to Large is blocked if insufficient slots remain - user is notified
5. Switching from Large to Regular correctly frees 1 slot and updates the visualizer immediately
6. Minimum slot constraint (3 subkits) is surfaced if user attempts to proceed with fewer selections

#### Story 2.4 - Visualizer Extensibility for Phase 2

As a developer, I want the visualizer component architected for future clickable slot interactivity, so that Phase 2 slot-click-to-assign functionality can be added without rebuilding the component.

Acceptance Criteria:
1. The visualizer exposes an optional onSlotClick callback prop - dormant in MVP but wired for Phase 2
2. Each slot is rendered as an individually addressable element with a unique slot index
3. Component architecture is documented noting Phase 2 extension points
4. No regressions introduced to existing slot rendering or state management
5. Code is reviewed and approved as Phase 2 ready by the development team

---

### Epic 3: Subkit Selection Flow

#### Story 3.1 - Subkit Category Cards

As a user, I want to browse and select subkit categories from a clear, visual set of options, so that I can quickly identify and choose the subkits that best fit my household needs.

Acceptance Criteria:
1. All 9 subkit categories are displayed as individual selectable cards
2. Each card displays the subkit name, icon, and a brief one-line description
3. Selected cards are visually distinguished from unselected cards
4. Each card reflects the subkit assigned color consistently with the visualizer
5. Cards are arranged in a clean, scannable grid layout on desktop and tablet
6. The Custom subkit card is visually distinguishable as a flexible open option

#### Story 3.2 - Regular/Large Size Selection Per Subkit

As a user, I want to choose whether each selected subkit is Regular or Large sized, so that I can allocate more space to the subkits that matter most to my household.

Acceptance Criteria:
1. Upon selecting a subkit card, the user is presented with a size option - Regular or Large
2. Regular and Large options clearly communicate their slot usage (1 slot vs 2 slots)
3. Size selection is displayed inline on the subkit card - no full-page navigation required
4. Selecting Large when insufficient slots remain shows a clear, friendly error message
5. The user can change a subkit size at any time - the visualizer updates immediately
6. Default size is Regular unless the user explicitly chooses Large

#### Story 3.3 - Visualizer Integration with Subkit Selection

As a user, I want the housing unit visualizer to respond instantly to my subkit selections and size choices, so that I always have a real-time view of how my kit fills the housing unit.

Acceptance Criteria:
1. The visualizer updates immediately upon any subkit selection, deselection, or size change
2. Selected subkits appear in the visualizer in the correct slot position, color, and size
3. Deselected subkits are immediately removed and their slots revert to the + empty state
4. The visualizer and subkit cards remain in sync at all times
5. Slots fill from top to bottom in the order subkits are selected
6. If a Large subkit is switched to Regular, the freed slot is made available immediately

#### Story 3.4 - Proceed to Item Configuration

As a user, I want to confirm my subkit selections and proceed to configure items within each subkit, so that I can complete my kit with the specific items I need.

Acceptance Criteria:
1. A clearly labeled Configure Items CTA button is displayed on the Subkit Selection screen
2. The CTA is disabled until the user has selected a minimum of 3 subkits
3. A friendly message is shown when fewer than 3 subkits are selected explaining the minimum requirement
4. Upon clicking the CTA, the app transitions to Item Configuration beginning with the first selected subkit
5. The order of subkit configuration follows the order in which they were selected
6. Subkit selections and size choices are preserved in application state throughout the flow

---

### Epic 4: Item Configuration Flow

#### Story 4.1 - Subkit Item Configuration Screen

As a user, I want to see all available items for each of my selected subkits and choose what to include, so that I can build a kit that reflects exactly what I need without duplicating things I already own.

Acceptance Criteria:
1. The Item Configuration screen displays one subkit at a time in a clear, focused layout
2. All predefined items for the current subkit are listed with their name and a brief description
3. Each item has an include/exclude toggle - all items excluded by default
4. A progress indicator shows which subkit is being configured and how many remain
5. The current subkit assigned color is used as a visual accent for continuity
6. The user can navigate back to the previous subkit without losing selections
7. Item selections and quantities are preserved as the user moves between subkits

#### Story 4.2 - Item Quantity Selection

As a user, I want to set the quantity of each item I include in my subkit, so that I can account for my household size and specific needs.

Acceptance Criteria:
1. Each included item displays a quantity selector with increment and decrement buttons
2. Quantity selector is only active when an item is toggled as included
3. Minimum quantity is 1 when an item is included
4. Maximum quantity per item is 10 for MVP
5. Quantity defaults to 1 when an item is first included
6. Quantity changes are reflected immediately in application state
7. Item quantity is displayed on the Summary Page

#### Story 4.3 - Empty Subkit Option

As a user, I want the option to order a completely empty subkit container, so that I can use the storage slot for supplies I already own without purchasing duplicate items.

Acceptance Criteria:
1. Each subkit configuration screen includes a clearly labeled empty container option
2. Selecting empty container deselects all items and disables the item list for that subkit
3. A clear visual indicator confirms the subkit is set to empty
4. The user can reverse this selection at any time and re-enable item selection
5. The Summary Page clearly indicates which subkits are empty containers
6. Empty container subkits still count toward the 3-6 subkit constraint

#### Story 4.4 - Custom Subkit Item Browser

As a user, I want to browse and select items from across all predefined subkit categories for my Custom subkit, so that I can build a fully personalized subkit tailored to my unique household needs.

Acceptance Criteria:
1. The Custom subkit screen displays all items from all 8 predefined categories in a single browsable list
2. Items are grouped by their parent subkit category for easy navigation
3. Each item has the same include/exclude toggle and quantity selector as standard subkits
4. The Custom subkit screen is visually consistent with standard item configuration screens
5. Items selected in the Custom subkit do not conflict with items selected in other subkits
6. The Summary Page displays Custom subkit items grouped under the Custom category label
7. The Custom subkit screen includes an empty container option with identical behavior to standard subkits — selecting it deselects all Custom items and the empty container state is clearly reflected on the Summary Page

#### Story 4.5 - Navigation and Flow Completion

As a user, I want to move smoothly through all my subkit configurations and proceed to my summary when done, so that I can complete my kit configuration efficiently and without confusion.

Acceptance Criteria:
1. A clearly labeled Next Subkit CTA advances the user to the next subkit in their sequence
2. On the final subkit, the CTA changes to Review My Kit - transitioning to the Summary Page
3. A Back button allows the user to return to the previous subkit without losing selections
4. A Back to Subkit Selection option is available with a confirmation prompt
5. All item selections, quantities, and empty container choices are preserved throughout the flow
6. The progress indicator updates correctly at every step

---

### Epic 5: Summary Page

#### Story 5.1 - Kit Summary Display

As a user, I want to see a complete, organized overview of my configured kit, so that I can review everything I have selected and feel confident my kit is complete.

Acceptance Criteria:
1. The Summary Page displays all selected subkits in the order they were configured
2. Each subkit section shows the name, assigned color accent, size, and all included items with quantities
3. Subkits configured as empty containers are clearly labeled as Empty Container
4. Custom subkit items are displayed grouped under the Custom category label
5. Overall kit configuration shown at a glance - total subkits selected, total slots used out of 6
6. The Summary Page is clean, well-spaced, and visually organized

#### Story 5.2 - Housing Unit Visualizer on Summary Page

As a user, I want to see the housing unit visualizer on my Summary Page showing my completed kit, so that I get a final satisfying visual confirmation of how my kit fills the storage unit.

Acceptance Criteria:
1. The housing unit visualizer is displayed on the Summary Page in a read-only completed state
2. All selected subkits are shown in their correct slots, colors, sizes, and names
3. The visualizer on the Summary Page is non-interactive (display only)
4. The visualizer reinforces the physical reality of the kit

#### Story 5.3 - Call-to-Action and Purchase Intent

As a user, I want a clear next step presented at the end of my kit summary, so that I know how to move forward and acquire my configured kit.

Acceptance Criteria:
1. A prominent CTA button is displayed on the Summary Page (e.g., Get My Kit or Order Now)
2. The CTA is visually distinct and positioned prominently above the fold on desktop
3. For MVP, the CTA links to a placeholder URL or contact/inquiry page
4. A brief compelling message accompanies the CTA reinforcing the value of the kit
5. A secondary option allows the user to go back and edit their kit configuration
6. CTA and messaging reflect the brand tone - confident, trustworthy, and reassuring

#### Story 5.4 - Summary Page Presentation and Print Readiness

As a user, I want my kit summary to be clearly formatted and easy to save or reference later, so that I can keep a record of my configuration for future reference.

Acceptance Criteria:
1. The Summary Page layout is clean and well-structured for easy reading on desktop and tablet
2. The page is print-friendly - a browser print produces a clean, readable document
3. Section headings, subkit names, and item lists are clearly hierarchically structured
4. The page does not include unnecessary UI chrome that would distract from the summary content
5. A Start Over option is available with a confirmation prompt to reset the entire configuration

---

## 7. Checklist Results

| Category | Status | Notes |
|----------|--------|-------|
| 1. Problem Definition and Context | PASS | Clear problem statement, personas, JTBD, competitive gaps, and Why Now all documented |
| 2. MVP Scope Definition | PASS | Core features defined, Phase 2 explicitly separated, MVP success criteria stated |
| 3. User Experience Requirements | PASS | All core screens defined, interaction paradigms established, WCAG AA target set |
| 4. Functional Requirements | PASS | 13 FRs covering all features - specific, testable, and user-focused |
| 5. Non-Functional Requirements | PASS | 10 NFRs covering performance, extensibility, and future readiness |
| 6. Epic and Story Structure | PASS | 5 logically sequenced epics, 18 stories with clear acceptance criteria |
| 7. Technical Guidance | PASS | Stack defined (React, TypeScript, Tailwind), architecture clear, future readiness documented |
| 8. Cross-Functional Requirements | PARTIAL | Data structure defined; analytics and session persistence noted as minor gaps |
| 9. Clarity and Communication | PASS | Consistent language, well-structured, all terms defined |

### Minor Observations

- Analytics: No user behavior tracking defined for MVP - recommend adding a basic analytics tool in Epic 1 to capture kit completion rates and subkit adoption from day one
- Session persistence: Recommend dev team establishes a localStorage strategy to prevent users losing configuration on accidental page refresh
- Color palette: Subkit colors referenced throughout but not yet defined - to be resolved before or during the UX spec phase

### Final Decision

READY FOR UX EXPERT AND ARCHITECT - The PRD is comprehensive, properly structured, and ready for the next phase.

---

## 8. Next Steps

### UX Expert Prompt

Sally - the PRD for the Emergency Prep Kit Builder is complete and ready for your review. Please create a Front-End Spec using the front-end-spec-tmpl. Key areas to focus on:
- The Housing Unit Visualizer - single-row 6-slot layout, color-coded subkit blocks, + empty state icons, Regular vs Large sizing behavior
- The Subkit Selection screen - category cards, size toggle, constraint enforcement
- The Item Configuration flow - stepped per-subkit walkthrough, quantity selectors, empty container option, Custom subkit browser
- The Summary Page - clean visual layout, visualizer in read-only state, prominent CTA, print readiness
The user has existing wireframes and designs to share - please incorporate those as your primary visual reference. Detailed physical product drawings for the visualizer will also be provided.

### Architect Prompt

Winston - the PRD for the Emergency Prep Kit Builder is complete and ready for your review. Please create a Frontend Architecture document using the front-end-architecture-tmpl. Key technical considerations:
- React SPA with TypeScript and Tailwind CSS
- No backend in MVP - session-based state only; static TypeScript data files for subkit and item catalog
- Housing Unit Visualizer - self-contained React component, props-driven, slot state managed externally, onSlotClick callback wired but dormant for Phase 2
- State management - React Context API or Zustand for kit configuration state across the 3-screen flow
- Data architecture - typed subkit/item data structure supporting future branded product mapping
- Deployment - static site hosting via Vercel or Netlify
- Phase 2 readiness - e-commerce integration, clickable visualizer, user profiles, Bazaarvoice reviews
