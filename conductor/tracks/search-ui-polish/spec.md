# Specification: Search & UI Polish

## 1. Objective
Enhance the usability and visual appeal of the P4G Walkthrough app by adding a search feature, improving navigation with sticky headers, and adding smooth transitions.

## 2. Requirements
- **Search Functionality**:
  - A search bar that filters the days and entries in the currently active month.
  - Matches should be found in entry titles or content.
  - If a day has no matching entries, the day card should be hidden.
- **Sticky Day Headers**:
  - The date bar on each `DayCard` should stick to the top (just below the main header) as the user scrolls through long days.
- **Visual Refinements**:
  - Add smooth transitions when switching between months.
  - Add a "Scroll to Top" button for long lists.
  - Enhance the empty state when no search results are found.

## 3. Success Criteria
- Typing in the search bar instantly filters the visible guide content.
- Users can always see the current date as they scroll through activities.
- Switching months feels smooth and modern.
- All P4G aesthetics (colors, shapes) are maintained.