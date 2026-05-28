# Implementation Plan: Search & UI Polish

## Phase 1: Search Implementation
1. Create `src/components/atoms/SearchInput.tsx`.
   - Style it with a skewed P4G look (yellow border, black background).
   - Use an icon (e.g., Lucide search) if possible.
2. Update `App.tsx` to include `searchQuery` state.
3. Pass `searchQuery` to `DayList`.
4. Update `DayList.tsx` to filter the `days` and their `entries` based on the query.
   - If a query is active, only show entries that contain the string.
   - Only show the `DayCard` if it has at least one matching entry.

## Phase 2: Sticky Day Headers
1. Update `src/components/molecules/DayCard.tsx`.
   - Make the header div `sticky` with `top-[60px]` (or matching the main header height).
   - Ensure the `z-index` is correctly set so it stays above the entries but below the main header.
   - Add a slight background blur or shadow to the sticky header for better contrast.

## Phase 3: Smooth Transitions & UX
1. Add a "Scroll to Top" button (Organism/Molecule) that appears when the user scrolls down.
2. Add a CSS-based "fade and slide" animation in `index.css` or using Tailwind classes for when the `DayList` content changes.
3. Improve the search empty state in `DayList`.

## Phase 4: Final Refinements
1. Test on mobile view to ensure sticky headers don't take too much space.
2. Final type check and linting.