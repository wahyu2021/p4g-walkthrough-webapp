# Specification: Global Progress Context

## 1. Objective
Solve the state synchronization bug where resetting the progress clears the percentage bar but does not update the visual status of individual day cards.

## 2. Requirements
- **Global State Management**:
  - Implement a `ProgressProvider` using React Context API.
  - Move the `completedDays` state and management logic (toggle, reset) from the hook into the provider.
- **Unified State Access**:
  - The `useProgress` hook should now simply consume the `ProgressContext`.
  - All components (`App.tsx` for the progress bar, `DayList.tsx` for the cards) will share the **same** source of truth.
- **Local Storage Persistence**:
  - Ensure the provider still reads from and writes to `localStorage`.

## 3. Success Criteria
- Clicking "Reset All Data" in the header instantly clears the progress bar AND turns all "CLEARED" cards back to "COMPLETE" across all months.
- The application remains performant and avoids unnecessary re-renders.
- All existing features (Search, Sidebar, etc.) continue to work perfectly.