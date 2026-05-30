# Implementation Plan: Today's Schedule Widget

## Phase 1: Logic and State Handling
1. **Create `useNextDay.ts` Hook (Optional but clean)**:
   - Encapsulate the logic for finding the first uncompleted day.
   - Return `{ nextDay: Day | null, monthSlug: string }`.

## Phase 2: Component Creation
1. **Create `TodaysSchedule.tsx`**:
   - Implement the UI according to the spec using Tailwind CSS.
   - Include a "Jump to Day" `<NavLink>` button if the day is in a different month.

## Phase 3: Integration
1. **Update `App.tsx`**:
   - Render `<TodaysSchedule />` in the `sidebarContent` right above or below the `MonthSelector`.

## Phase 4: Validation
1. Verify the widget accurately reflects the first uncompleted day.
2. Verify clicking checkboxes in the timeline causes the widget to update instantly.