# Implementation Plan: React Router Migration

## Phase 1: Dependency Installation
1. Install `react-router-dom` and its type definitions (if needed) in the `webapp/` directory:
   `npm install react-router-dom`

## Phase 2: Refactoring Components
1. **Update `main.tsx`**:
   - Wrap the `<App />` component in a `<BrowserRouter>`.
2. **Update `NavTabs.tsx`**:
   - Replace `<button>` elements with `<NavLink>` from `react-router-dom`.
   - Utilize the `isActive` render prop provided by `<NavLink>` to conditionally apply the active styling (yellow background).
   - Remove the `currentView` and `onViewChange` props, as they are no longer needed.
3. **Update `App.tsx`**:
   - Remove `useState` for `currentView`.
   - Setup a `<Routes>` block in the main content area inside `MainLayout`.
   - Define `<Route>` for `/`, `/social-links`, `/dungeons`, and `/exams`.
   - Move the `MonthSelector` logic to only render inside the Walkthrough route.

## Phase 3: Validation
1. Run `npm run dev`.
2. Verify all tabs route to the correct URL.
3. Test browser Back/Forward navigation.
4. Refresh the page on `/dungeons` and verify it stays on the Dungeons page.