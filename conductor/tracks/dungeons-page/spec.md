# Specification: Dungeons Page

## 1. Objective
Implement the Dungeons page to display a comprehensive list of all dungeons in Persona 4 Golden, providing users with critical information like deadlines and dungeon order.

## 2. Requirements
- **Dungeon Listing**:
  - Load data from `src/data/dungeons.json`.
  - Display a vertical list or grid of dungeons.
- **Card Content**:
  - Dungeon Name.
  - Deadline (e.g., "4/29").
  - Dungeon Order/Number.
  - Special Badges: "Golden Exclusive" (for Hollow Forest) and "True Ending" (for Yomotsu Hirasaka).
- **Aesthetic**:
  - High-contrast P4G styling.
  - Card design consistent with `SocialLinkCard` or `DayCard` (using `clip-path` and yellow accents).
- **Interactions**:
  - Visual hover effects.
  - Placeholder for "Detailed View" (as the scraper data for floors is currently minimal).

## 3. Success Criteria
- The "Dungeons" tab in the main navigation successfully renders the `DungeonsPage`.
- All dungeons from the JSON are visible with their respective deadlines.
- The layout is responsive on mobile and desktop.