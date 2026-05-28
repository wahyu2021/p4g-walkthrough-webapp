# Implementation Plan: Day Cards & Progress Tracking

## Phase 1: Progress State (Hook)
1. Create `src/hooks/useProgress.ts`.
2. Implement logic to read/write a `completedDays` object from `localStorage`.
3. Provide a `toggleDay(date: string)` function to mark/unmark a day.
4. Export the hook for use in components.

## Phase 2: Atomic Components for Entries
1. Create `src/components/atoms/ActivityEntry.tsx`.
   - Take `type`, `title`, and `content` as props.
   - Use a switch/case or object lookup to apply specific Tailwind classes based on `type` (e.g., `story` might have a blue accent, `social` a pink one, `info` yellow).
   - Ensure "Options" or choices within content are easily readable.

## Phase 3: Building DayCard & DayList
1. Create `src/components/molecules/DayCard.tsx`.
   - Display the date (e.g., "April 11th").
   - Include a "Complete" toggle button styled with P4G aesthetics.
   - Map over the `entries` to render `ActivityEntry` components.
   - Add conditional styling: if `isCompleted`, reduce opacity and maybe add a "DONE" overlay/label.
2. Create `src/components/organisms/DayList.tsx`.
   - Take the `days` array as a prop.
   - Map over the array to render `DayCard` components.
   - Use `useProgress` hook to pass the `isCompleted` state and `onToggle` handler to each card.

## Phase 4: Integration
1. Update `src/App.tsx`.
   - Filter the full `walkthroughData` to get the days for the `activeMonth`.
   - Replace the placeholder with the `<DayList />` component.
2. Add a global "Progress Summary" to the header if possible (e.g., "Days Completed: X/Y").

## Phase 5: Verification
1. Verify that selecting different months updates the list of days.
2. Verify that clicking "Complete" persists after a page refresh.
3. Verify mobile responsiveness (vertical stacking of cards).
4. Run `npm run lint` and `npx tsc`.