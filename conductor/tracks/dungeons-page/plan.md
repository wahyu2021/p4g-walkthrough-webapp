# Implementation Plan: Dungeons Page

## Phase 1: Component Building
1. Create `src/components/molecules/DungeonCard.tsx`.
   - Use the `Dungeon` interface from `src/types/walkthrough.ts`.
   - Implement the visual design: Skewed/clipped background, P4G yellow highlights.
   - Display Deadline prominently (as it's the most important gameplay info).
   - Add badges for `is_golden_exclusive` and `is_true_ending`.

## Phase 2: Page Implementation
1. Create `src/pages/DungeonsPage.tsx`.
   - Fetch dungeon data using `getDungeons()`.
   - Render a list of `DungeonCard` components.
   - Add a header section with a P4G-styled title (similar to `SocialLinksPage`).

## Phase 3: Integration
1. Update `src/App.tsx`.
   - Replace the "Coming Soon" placeholder in the `currentView === 'dungeons'` block with `<DungeonsPage />`.

## Phase 4: Verification
1. Verify the dungeons are displayed in the correct order.
2. Verify the deadlines match the JSON data.
3. Check responsive behavior.
4. Final lint and type check.