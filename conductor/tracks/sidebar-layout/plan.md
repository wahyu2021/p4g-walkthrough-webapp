# Implementation Plan: Sidebar Layout Refactor

## Phase 1: Update MainLayout
1. Modify `src/components/templates/MainLayout.tsx`.
   - Add a `sidebar` prop (ReactNode).
   - Change the layout from a simple container to a responsive structure:
     - `flex flex-col md:flex-row`
     - Sidebar container: `md:w-64 md:sticky md:top-[60px] md:h-[calc(100vh-60px)] md:overflow-y-auto`
     - Content container: `flex-1`

## Phase 2: Responsive MonthSelector
1. Modify `src/components/organisms/MonthSelector.tsx`.
   - Update the container classes to be responsive:
     - Mobile: `flex-row overflow-x-auto overflow-y-hidden`
     - Desktop: `md:flex-col md:overflow-x-hidden md:overflow-y-auto md:space-x-0 md:space-y-4 md:px-4 md:py-4`
   - Adjust the `handleWheel` logic to only apply horizontal scroll on mobile/horizontal mode if necessary, or disable it if it interferes with natural vertical sidebar scroll.

## Phase 3: MonthTab Styling
1. Modify `src/components/molecules/MonthTab.tsx`.
   - Ensure the width is consistent in vertical mode (e.g., `w-full` on desktop).
   - Check if the `skewX` needs adjustment for vertical lists to prevent overlapping or clipping.

## Phase 4: Integration in App.tsx
1. Update `src/App.tsx`.
   - Move the `<MonthSelector />` into the `sidebar` slot of `<MainLayout />`.
   - Adjust the spacing and search bar placement for the new two-column layout.

## Phase 5: Verification
1. Test desktop view (sticky sidebar, vertical list).
2. Test mobile view (top horizontal scroll).
3. Verify search still works correctly.
4. Final lint and type check.