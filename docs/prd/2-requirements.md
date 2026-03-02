# 2. Requirements

## Functional Requirements

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

## Non-Functional Requirements

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
