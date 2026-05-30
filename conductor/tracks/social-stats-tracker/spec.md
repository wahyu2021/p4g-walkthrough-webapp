# Specification: Social Stats & Collection Tracker

## 1. Objective
Provide a dedicated interface (or sidebar widget) for users to manually track their five primary Social Stats, as well as the status of Books and Quests, mimicking the in-game status screen.

## 2. Component Design
- **State Management**:
  - Extend the existing `ProgressContext` or create a new `TrackerContext` backed by `localStorage` to save:
    - `socialStats`: `{ knowledge: 1, courage: 1, diligence: 1, understanding: 1, expression: 1 }` (Max 5 each).
    - `collections`: `{ books: Record<string, boolean>, quests: Record<string, boolean> }`.
- **UI Elements**:
  - **Pentagon Graph / Stats Bars**: A visual representation of the 5 stats. Since a dynamic SVG pentagon might be complex, we can start with 5 stylized horizontal progress bars (1 to 5 "stars" or musical notes, fitting the UI).
  - **Collection Lists**: Simple toggleable lists for Books and Quests.
- **Integration**:
  - Create a new route `/tracker` and add it to the `NavTabs`.
  - Alternatively, if we only focus on Social Stats for now, it could be a smaller widget in the Sidebar or the header of the Walkthrough page.

## 3. Success Criteria
- Users can click to increase or decrease their social stat levels (1-5).
- State persists across page reloads.
- Visuals align with the P4G UI (Yellow/Black, skewed elements, distinct icons).