# Specification: Day Cards & Progress Tracking

## 1. Objective
Render the daily activities and dialogue choices for the selected month in an interactive "card" format. Implement a local storage-based tracking system that allows users to mark days as completed.

## 2. Requirements
- **Components**:
  - **Atom**: `ActivityEntry` (Renders a single entry with its title and content, styled by type).
  - **Molecule**: `DayCard` (Renders the date header, a list of `ActivityEntry` components, and a completion checkbox).
  - **Organism**: `DayList` (Renders a vertical list of `DayCard` components for the currently active month).
- **Styling**:
  - P4G aesthetics: Yellow highlights for key info, sharp card borders, high contrast.
  - Interactive states: Fading or collapsing a `DayCard` when it is marked as completed.
- **State Management**:
  - Create a custom hook `useProgress` to manage the completion state of each day in `localStorage`.
  - State format: `{ [dateKey]: boolean }` where `dateKey` is likely the `date` string (e.g., "4/11").
- **Filtering**:
  - Only show days belonging to the `activeMonth`.

## 3. Success Criteria
- User can see a scrollable list of days for the selected month.
- Each entry within a day is styled distinctively based on its type (info, social, activity, etc.).
- Clicking a "Complete" button/checkbox on a day card persists that state to `localStorage`.
- Completed cards visually change (e.g., dimming or showing a "COMPLETED" stamp).