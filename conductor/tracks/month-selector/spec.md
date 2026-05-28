# Specification: Month Selector

## 1. Objective
Implement a functional Month Selector UI that allows users to navigate between the different months of the Persona 4 Golden timeline (April to March). It will establish the core layout structure and the application state for the current active month.

## 2. Requirements
- Create TypeScript interfaces for the JSON data (`WalkthroughMonth`, `Day`, `Entry`) in `src/types/walkthrough.ts`.
- Implement a Month Selector component following the Atomic Design principles (e.g., `MonthTab` as a Molecule, `MonthSelector` as an Organism).
- Use React state to track the `activeMonth` (default to 'april').
- Parse the `walkthrough.json` data to dynamically generate the list of available months.
- The UI should reflect the Persona 4 Golden aesthetic (Yellow/Black contrast, slanted edges/tabs if possible).

## 3. Success Criteria
- The application displays a horizontal scrolling list or a grid of tabs representing the months from April to March.
- Clicking on a month tab updates the active state and visually highlights the selected month.
- The app successfully imports and type-checks the `walkthrough.json` data.