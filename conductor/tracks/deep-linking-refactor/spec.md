# Specification: Deep Linking & Dungeon Revamp

## 1. Objective
Enhance the existing React Router implementation by introducing parameterized routes (deep links) for both the Walkthrough months and the Dungeons. Concurrently, redesign the Dungeons page to display a single, fully expanded dungeon at a time to improve readability.

## 2. Route Architecture
- **Root Redirect**: `/` automatically redirects to `/walkthrough/april`.
- **Walkthrough**: `/walkthrough/:monthSlug` (e.g., `/walkthrough/may`).
  - Reads the `:monthSlug` parameter to determine which month's data to display.
- **Dungeons**: `/dungeons/:slug` (e.g., `/dungeons/yukiko`).
  - Uses the `id` field from `dungeons.json` as the `slug`.
  - Reads the `:slug` parameter to render the specific dungeon's data.

## 3. UI/UX Changes
- **Month Selector**: Replaced button `onClick` state mutations with `<NavLink>` or programmatic navigation to change the URL.
- **Dungeon Page**:
  - Introduce a new `DungeonSelector` (Organism) analogous to the `MonthSelector`. It will display a scrollable list of dungeon names.
  - Remove the grid layout.
  - The main area will display one `DungeonDetail` component (repurposed from `DungeonCard`) that is *always expanded*, showing the "Target Shadows" and "Midnight Bestiary" without requiring the user to click an "Expand" button.
  - The "Collapse All Hubs" button is no longer needed and will be removed.

## 4. Success Criteria
- Navigating to `/walkthrough/june` directly loads the June timeline.
- Navigating to `/dungeons/bathhouse` directly loads the Steamy Bathhouse details.
- Changing months or dungeons updates the browser URL and history, allowing the Back button to work perfectly between months and dungeons.