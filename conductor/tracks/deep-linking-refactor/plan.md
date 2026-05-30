# Implementation Plan: Deep Linking & Dungeon Revamp

## Phase 1: Walkthrough Deep Linking
1. **Update `App.tsx`**:
   - Add a `<Route path="/" element={<Navigate to="/walkthrough/april" replace />} />`.
   - Change the walkthrough route to `<Route path="/walkthrough/:monthSlug" element={<WalkthroughView />} />`.
   - Extract the inline Walkthrough JSX in `App.tsx` into a new `WalkthroughView` component (or keep it inline but use `useParams()`).
2. **Update `MonthSelector.tsx`**:
   - Modify the buttons to act as `<NavLink>` components pointing to `/walkthrough/${month.month}`.

## Phase 2: Dungeons UI Redesign
1. **Create `DungeonSelector.tsx` (Organisms)**:
   - A horizontal, scrollable navigation bar mapping over `dungeons.json`.
   - Uses `<NavLink to={'/dungeons/' + dungeon.id}>`.
2. **Refactor `DungeonCard.tsx` -> `DungeonDetail.tsx`**:
   - Strip out the `isExpanded` state and toggle logic.
   - The Bestiary and Boss sections should render unconditionally.
3. **Update `DungeonsPage.tsx`**:
   - Remove the `expandedCards` state and the "Collapse All" button.
   - Read the `:slug` via `useParams()`.
   - If no slug is provided (i.e., user visits `/dungeons`), redirect to the first dungeon (e.g., `/dungeons/shopping`).
   - Render the `DungeonSelector` at the top and the `DungeonDetail` for the matched slug below it.

## Phase 3: Validation
1. Verify URL updates when clicking different months.
2. Verify URL updates when clicking different dungeons.
3. Confirm that the Bestiary and Boss layout remains visually intact in the new permanently-expanded view.