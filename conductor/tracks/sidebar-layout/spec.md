# Specification: Sidebar Layout Refactor

## 1. Objective
Refactor the application layout to move the Month Selector from a top-scrolling bar to a sticky sidebar on desktop devices. This ensures the month navigation remains visible even when scrolling through long lists of daily activities.

## 2. Requirements
- **Responsive Layout**:
  - **Desktop (md and up)**: A two-column layout. Left column is a sticky sidebar for month navigation. Right column is the scrollable walkthrough content.
  - **Mobile**: Maintain the current top horizontal scrolling bar for months.
- **Component Updates**:
  - **`MainLayout`**: Update to support a sidebar slot and use responsive flexbox/grid.
  - **`MonthSelector`**: Support a vertical list format for the sidebar while keeping the horizontal format for mobile.
  - **`MonthTab`**: Ensure the skewed styling looks good in both horizontal and vertical stacks.
- **Interactions**:
  - The sidebar should be `sticky` so it stays in place while the user scrolls the main content area.

## 3. Success Criteria
- On desktop, the month list is visible on the left and doesn't disappear when scrolling down.
- On mobile, the app still uses the horizontal month bar to save screen real estate.
- The P4G aesthetic is maintained throughout the transition.
- No regression in search or progress tracking functionality.