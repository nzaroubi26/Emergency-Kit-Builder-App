# 3. User Interface Design Goals

## Overall UX Vision

The Emergency Prep Kit Builder should feel like a confident, trustworthy guide - not an overwhelming form. The experience should be clean, focused, and rewarding at every step. The tone is: organized, reassuring, and modern.

## Key Interaction Paradigms

- **Progressive disclosure:** Users move through configuration one step at a time - subkit selection first, then item configuration per subkit
- **Real-time visual feedback:** The housing unit visualizer responds immediately to every selection
- **Non-prescriptive flexibility:** Users are never forced into a specific kit
- **Forgiving interactions:** Users can go back, change selections, and adjust items freely without losing progress

## Core Screens and Views

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

## Accessibility

WCAG AA compliance as a baseline target.

## Branding

- Visual style: durable, modern, clean, and organized
- Each subkit category assigned a unique color for the visualizer
- Color palette to be finalized with design team
- Physical product drawings to be provided to UX team for visualizer reference

## Target Platforms

- **Primary:** Desktop web (modern browsers)
- **Secondary:** Tablet web (responsive)
- **Out of scope for MVP:** Mobile app, native iOS/Android

---
