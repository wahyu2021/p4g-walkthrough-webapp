# Implementation Plan: Main Navigation & Social Links

## Phase 1: Data & Types
1. Copy `data/social_links.json` and `data/dungeons.json` to `webapp/src/data/`.
2. Update `src/types/walkthrough.ts` to include `SocialLink` and `Dungeon` interfaces.
3. Update `src/utils/dataFetcher.ts` to include functions for fetching social links and dungeons.

## Phase 2: Navigation System
1. Create a `NavTabs` molecule (`src/components/molecules/NavTabs.tsx`).
   - Style it with P4G aesthetic (sharp edges, yellow/black).
2. Update `App.tsx` to handle `currentView` state (values: `'walkthrough'`, `'social'`, `'dungeons'`).
3. Conditionally render the `sidebar` prop in `MainLayout` only when `currentView === 'walkthrough'`.

## Phase 3: Social Link Components
1. Create `src/components/molecules/SocialLinkCard.tsx`.
   - Display: Arcana (e.g., "Magician"), Arcana Number (0-21), Name, and Start Condition.
   - Use a distinctive P4G card style.
2. Create `src/pages/SocialLinksPage.tsx` (or an Organism `SocialLinkList`).
   - Map through the social links data and render `SocialLinkCard` components in a responsive grid.

## Phase 4: Integration
1. Update `App.tsx` to switch the main content area based on `currentView`.
2. Ensure the "Dungeons" tab shows a "Coming Soon" placeholder for now.

## Phase 5: Verification
1. Verify switching between tabs works.
2. Verify Social Link data is correctly displayed.
3. Verify the sidebar correctly appears/disappears based on the active tab.
4. Final lint and type check.