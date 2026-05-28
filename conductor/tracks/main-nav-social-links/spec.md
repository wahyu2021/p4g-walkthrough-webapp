# Specification: Main Navigation & Social Links Page

## 1. Objective
Enable users to switch between different major sections of the guide (Walkthrough, Social Links, and Dungeons) and implement the listing page for Social Links.

## 2. Requirements
- **App Navigation**:
  - Implement a "Main Menu" or "Tabs" in the Header.
  - Tabs: **Walkthrough**, **Social Links**, **Dungeons**.
  - Use React state to manage the active `currentView`.
- **Social Links Page**:
  - Create a new page/view that displays a grid of Social Link characters.
  - Data: Load from `src/data/social_links.json`.
  - Content: Show Arcana, Arcana Number, Character Name, and Start Date.
  - Aesthetic: Use card styling similar to the game's Social Link menu (Yellow accents, stylized icons if possible, or clear typography).
- **Responsive Layout**:
  - The navigation should work well on mobile (maybe a bottom nav or condensed top tabs).
  - The grid should adjust from 1 column on mobile to 2 or 3 on desktop.

## 3. Success Criteria
- User can switch between "Walkthrough" and "Social Links" without page reloads.
- The Social Links page correctly renders all characters from the JSON file.
- The active tab in the header is clearly highlighted.
- The sidebar (Month Selector) should only appear when the "Walkthrough" view is active.