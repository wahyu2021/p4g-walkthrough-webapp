# Implementation Plan: Month Selector

## Phase 1: Data Types & Setup
1. Create `src/types/walkthrough.ts`.
2. Define the TypeScript interfaces matching the JSON structure:
   - `Entry` (type, title, content)
   - `Day` (date, day_num, month_num, date_label, entries)
   - `WalkthroughMonth` (month, month_num, days)
3. Create a utility file `src/utils/dataFetcher.ts` (or simply import directly where needed) to cleanly import the JSON data and cast it to the correct types.

## Phase 2: Building Components (Atomic Design)
1. **Molecule**: Create `src/components/molecules/MonthTab.tsx`. A simple clickable tab that receives `isActive`, `monthName`, and `onClick`. Use Tailwind v4 to style it to look like P4G (e.g., black background with yellow text when inactive, yellow background with black text when active).
2. **Organism**: Create `src/components/organisms/MonthSelector.tsx`. This component takes the list of months and the `activeMonth` state, rendering a flex row of `MonthTab` components. Ensure it handles overflow (horizontal scrolling) on smaller screens.

## Phase 3: Integrating into Application Layout
1. **Template**: Create `src/components/templates/MainLayout.tsx` which includes a header (the P4G Walkthrough title) and a content area for the Month Selector and eventually the Day Cards.
2. Update `src/App.tsx` to hold the `activeMonth` state (using `useState`).
3. Import the JSON data in `App.tsx` to pass the list of months to the `MonthSelector` component.
4. Render `MainLayout` and `MonthSelector` within `App.tsx`.

## Phase 4: Verification
1. Run `npm run dev` to verify the UI.
2. Confirm the month tabs display correctly in order.
3. Confirm clicking tabs changes the active state visually.
4. Run `npm run lint` and `npx tsc` to ensure type safety.