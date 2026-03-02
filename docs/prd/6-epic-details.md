# 6. Epic Details

## Epic 1: Foundation and Core Infrastructure

### Story 1.1 - Project Scaffolding and Setup

As a developer, I want a fully configured React project with Tailwind CSS, routing, and a deployment pipeline, so that the team has a clean, working foundation to build all features upon.

Acceptance Criteria:
1. React application initialized with TypeScript support
2. Tailwind CSS configured and working with a sample utility class rendered on screen
3. React Router configured with placeholder routes for Kit Builder, Item Configuration, and Summary Page
4. Project deployable to Vercel with a publicly accessible URL
5. Basic README documents how to run, build, and deploy the project locally

### Story 1.2 - Subkit and Item Data Architecture

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

### Story 1.3 - Application Shell and Navigation

As a user, I want to land on a working application with clear navigation between the main screens, so that I can move through the kit building flow from start to finish.

Acceptance Criteria:
1. Landing page renders the Kit Builder (Subkit Selection) screen as the entry point
2. Navigation correctly routes between Kit Builder, Item Configuration, and Summary Page
3. A persistent header is present across all screens showing the app name and current step
4. A step progress indicator shows the user's position in the flow
5. Placeholder content is displayed on Item Configuration and Summary Page screens
6. Application is deployed and accessible via public URL

---

## Epic 2: Housing Unit Visualizer

### Story 2.1 - Static Visualizer Component

As a user, I want to see a visual representation of my housing unit with 6 empty slots, so that I can understand the physical structure of the storage system before making any selections.

Acceptance Criteria:
1. A self-contained Visualizer React component is created and rendered at the top of the Subkit Selection screen
2. The visualizer displays a single vertical column of 6 equal-sized rectangular slots, stacked top to bottom
3. Each empty slot displays a + icon centered within it
4. The visualizer is styled to resemble the interior of a rectangular storage container
5. The component accepts slot state as props - fully controlled and stateless internally
6. The visualizer renders correctly on desktop and tablet screen sizes
7. Component is documented with a clear props interface in TypeScript

### Story 2.2 - Dynamic Slot State and Subkit Rendering

As a user, I want the visualizer to update in real time when I select a subkit, so that I can immediately see how my selections fill the housing unit.

Acceptance Criteria:
1. When a Regular subkit is selected, its slot fills with a colored block displaying the subkit name
2. When a Large subkit is selected, it spans 2 adjacent slots with a single colored block
3. Each subkit category renders in its unique assigned color consistently throughout the app
4. Slot state updates render within 100ms of a user interaction
5. When a subkit is deselected, its slot returns to the empty + state
6. The visualizer correctly handles mixed configurations (e.g., 2 Large + 2 Regular = 6 slots)
7. Filled slots display the subkit name in legible, appropriately sized typography

### Story 2.3 - Slot Constraint Enforcement

As a user, I want the visualizer to prevent me from exceeding the 6-slot housing unit capacity, so that my kit configuration always reflects a physically valid storage arrangement.

Acceptance Criteria:
1. The app tracks total slot usage in real time (Regular = 1 slot, Large = 2 slots)
2. When all 6 slots are occupied, remaining unselected subkit options are visually disabled
3. A clear visual indicator communicates when the housing unit is full
4. Switching a subkit from Regular to Large is blocked if insufficient slots remain - user is notified
5. Switching from Large to Regular correctly frees 1 slot and updates the visualizer immediately
6. Minimum slot constraint (3 subkits) is surfaced if user attempts to proceed with fewer selections

### Story 2.4 - Visualizer Extensibility for Phase 2

As a developer, I want the visualizer component architected for future clickable slot interactivity, so that Phase 2 slot-click-to-assign functionality can be added without rebuilding the component.

Acceptance Criteria:
1. The visualizer exposes an optional onSlotClick callback prop - dormant in MVP but wired for Phase 2
2. Each slot is rendered as an individually addressable element with a unique slot index
3. Component architecture is documented noting Phase 2 extension points
4. No regressions introduced to existing slot rendering or state management
5. Code is reviewed and approved as Phase 2 ready by the development team

---

## Epic 3: Subkit Selection Flow

### Story 3.1 - Subkit Category Cards

As a user, I want to browse and select subkit categories from a clear, visual set of options, so that I can quickly identify and choose the subkits that best fit my household needs.

Acceptance Criteria:
1. All 9 subkit categories are displayed as individual selectable cards
2. Each card displays the subkit name, icon, and a brief one-line description
3. Selected cards are visually distinguished from unselected cards
4. Each card reflects the subkit assigned color consistently with the visualizer
5. Cards are arranged in a clean, scannable grid layout on desktop and tablet
6. The Custom subkit card is visually distinguishable as a flexible open option

### Story 3.2 - Regular/Large Size Selection Per Subkit

As a user, I want to choose whether each selected subkit is Regular or Large sized, so that I can allocate more space to the subkits that matter most to my household.

Acceptance Criteria:
1. Upon selecting a subkit card, the user is presented with a size option - Regular or Large
2. Regular and Large options clearly communicate their slot usage (1 slot vs 2 slots)
3. Size selection is displayed inline on the subkit card - no full-page navigation required
4. Selecting Large when insufficient slots remain shows a clear, friendly error message
5. The user can change a subkit size at any time - the visualizer updates immediately
6. Default size is Regular unless the user explicitly chooses Large

### Story 3.3 - Visualizer Integration with Subkit Selection

As a user, I want the housing unit visualizer to respond instantly to my subkit selections and size choices, so that I always have a real-time view of how my kit fills the housing unit.

Acceptance Criteria:
1. The visualizer updates immediately upon any subkit selection, deselection, or size change
2. Selected subkits appear in the visualizer in the correct slot position, color, and size
3. Deselected subkits are immediately removed and their slots revert to the + empty state
4. The visualizer and subkit cards remain in sync at all times
5. Slots fill from top to bottom in the order subkits are selected
6. If a Large subkit is switched to Regular, the freed slot is made available immediately

### Story 3.4 - Proceed to Item Configuration

As a user, I want to confirm my subkit selections and proceed to configure items within each subkit, so that I can complete my kit with the specific items I need.

Acceptance Criteria:
1. A clearly labeled Configure Items CTA button is displayed on the Subkit Selection screen
2. The CTA is disabled until the user has selected a minimum of 3 subkits
3. A friendly message is shown when fewer than 3 subkits are selected explaining the minimum requirement
4. Upon clicking the CTA, the app transitions to Item Configuration beginning with the first selected subkit
5. The order of subkit configuration follows the order in which they were selected
6. Subkit selections and size choices are preserved in application state throughout the flow

---

## Epic 4: Item Configuration Flow

### Story 4.1 - Subkit Item Configuration Screen

As a user, I want to see all available items for each of my selected subkits and choose what to include, so that I can build a kit that reflects exactly what I need without duplicating things I already own.

Acceptance Criteria:
1. The Item Configuration screen displays one subkit at a time in a clear, focused layout
2. All predefined items for the current subkit are listed with their name and a brief description
3. Each item has an include/exclude toggle - all items excluded by default
4. A progress indicator shows which subkit is being configured and how many remain
5. The current subkit assigned color is used as a visual accent for continuity
6. The user can navigate back to the previous subkit without losing selections
7. Item selections and quantities are preserved as the user moves between subkits

### Story 4.2 - Item Quantity Selection

As a user, I want to set the quantity of each item I include in my subkit, so that I can account for my household size and specific needs.

Acceptance Criteria:
1. Each included item displays a quantity selector with increment and decrement buttons
2. Quantity selector is only active when an item is toggled as included
3. Minimum quantity is 1 when an item is included
4. Maximum quantity per item is 10 for MVP
5. Quantity defaults to 1 when an item is first included
6. Quantity changes are reflected immediately in application state
7. Item quantity is displayed on the Summary Page

### Story 4.3 - Empty Subkit Option

As a user, I want the option to order a completely empty subkit container, so that I can use the storage slot for supplies I already own without purchasing duplicate items.

Acceptance Criteria:
1. Each subkit configuration screen includes a clearly labeled empty container option
2. Selecting empty container deselects all items and disables the item list for that subkit
3. A clear visual indicator confirms the subkit is set to empty
4. The user can reverse this selection at any time and re-enable item selection
5. The Summary Page clearly indicates which subkits are empty containers
6. Empty container subkits still count toward the 3-6 subkit constraint

### Story 4.4 - Custom Subkit Item Browser

As a user, I want to browse and select items from across all predefined subkit categories for my Custom subkit, so that I can build a fully personalized subkit tailored to my unique household needs.

Acceptance Criteria:
1. The Custom subkit screen displays all items from all 8 predefined categories in a single browsable list
2. Items are grouped by their parent subkit category for easy navigation
3. Each item has the same include/exclude toggle and quantity selector as standard subkits
4. The Custom subkit screen is visually consistent with standard item configuration screens
5. Items selected in the Custom subkit do not conflict with items selected in other subkits
6. The Summary Page displays Custom subkit items grouped under the Custom category label
7. The Custom subkit screen includes an empty container option with identical behavior to standard subkits — selecting it deselects all Custom items and the empty container state is clearly reflected on the Summary Page

### Story 4.5 - Navigation and Flow Completion

As a user, I want to move smoothly through all my subkit configurations and proceed to my summary when done, so that I can complete my kit configuration efficiently and without confusion.

Acceptance Criteria:
1. A clearly labeled Next Subkit CTA advances the user to the next subkit in their sequence
2. On the final subkit, the CTA changes to Review My Kit - transitioning to the Summary Page
3. A Back button allows the user to return to the previous subkit without losing selections
4. A Back to Subkit Selection option is available with a confirmation prompt
5. All item selections, quantities, and empty container choices are preserved throughout the flow
6. The progress indicator updates correctly at every step

---

## Epic 5: Summary Page

### Story 5.1 - Kit Summary Display

As a user, I want to see a complete, organized overview of my configured kit, so that I can review everything I have selected and feel confident my kit is complete.

Acceptance Criteria:
1. The Summary Page displays all selected subkits in the order they were configured
2. Each subkit section shows the name, assigned color accent, size, and all included items with quantities
3. Subkits configured as empty containers are clearly labeled as Empty Container
4. Custom subkit items are displayed grouped under the Custom category label
5. Overall kit configuration shown at a glance - total subkits selected, total slots used out of 6
6. The Summary Page is clean, well-spaced, and visually organized

### Story 5.2 - Housing Unit Visualizer on Summary Page

As a user, I want to see the housing unit visualizer on my Summary Page showing my completed kit, so that I get a final satisfying visual confirmation of how my kit fills the storage unit.

Acceptance Criteria:
1. The housing unit visualizer is displayed on the Summary Page in a read-only completed state
2. All selected subkits are shown in their correct slots, colors, sizes, and names
3. The visualizer on the Summary Page is non-interactive (display only)
4. The visualizer reinforces the physical reality of the kit

### Story 5.3 - Call-to-Action and Purchase Intent

As a user, I want a clear next step presented at the end of my kit summary, so that I know how to move forward and acquire my configured kit.

Acceptance Criteria:
1. A prominent CTA button is displayed on the Summary Page (e.g., Get My Kit or Order Now)
2. The CTA is visually distinct and positioned prominently above the fold on desktop
3. For MVP, the CTA links to a placeholder URL or contact/inquiry page
4. A brief compelling message accompanies the CTA reinforcing the value of the kit
5. A secondary option allows the user to go back and edit their kit configuration
6. CTA and messaging reflect the brand tone - confident, trustworthy, and reassuring

### Story 5.4 - Summary Page Presentation and Print Readiness

As a user, I want my kit summary to be clearly formatted and easy to save or reference later, so that I can keep a record of my configuration for future reference.

Acceptance Criteria:
1. The Summary Page layout is clean and well-structured for easy reading on desktop and tablet
2. The page is print-friendly - a browser print produces a clean, readable document
3. Section headings, subkit names, and item lists are clearly hierarchically structured
4. The page does not include unnecessary UI chrome that would distract from the summary content
5. A Start Over option is available with a confirmation prompt to reset the entire configuration

---
