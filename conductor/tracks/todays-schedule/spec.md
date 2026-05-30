# Specification: Today's Schedule Widget

## 1. Objective
Create a floating or prominently placed widget that automatically identifies and displays the player's next task (the first uncompleted day in the walkthrough timeline) based on their saved progress.

## 2. Component Design (`TodaysSchedule.tsx`)
- **Organism**: `TodaysSchedule` (placed in `src/components/organisms/`)
- **Logic**:
  - Consume `useProgress()` to get `completedDays`.
  - Fetch all walkthrough data via `getWalkthroughData()`.
  - Iterate through all months and days in chronological order.
  - The "Today" target is the **first day** where `completedDays[dayKey]` is not `true`.
  - If all days are completed, show a "100% Completed" congratulatory message.
- **UI**:
  - Needs to look distinct from regular `DayCard`s. Use a TV aesthetic with strong Yellow/Black contrast.
  - Should display the Date (e.g., "April 11") and a summarized list of entries for that day.
  - Clicking the widget should idealy scroll the user to that specific day on the timeline or provide a link to the correct month.

## 3. Placement
- Inside the main Sidebar (below the timeline/month selector), so it's always visible on Desktop, or as a pinned banner at the top of the Walkthrough view on Mobile.

## 4. Success Criteria
- Checking a day in the main timeline immediately updates the widget to show the next day.
- Unchecking a previous day reverts the widget to that earlier uncompleted day.