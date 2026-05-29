# Specification: React Router Migration

## 1. Objective
Refactor the application's root component and navigation menus to use `react-router-dom`. Replace the current state-based view switching (`currentView` string state) with standard URL paths, enabling proper browser history management and deep linking.

## 2. Target Architecture
- The application will be wrapped in a `<BrowserRouter>`.
- The `App.tsx` component will act as the root layout, containing the `MainLayout` and defining the `<Routes>`.
- `NavTabs` will be updated to use `<NavLink>` components from React Router, automatically handling the "active" state based on the current URL.

## 3. URL Structure Map
- `/` or `/walkthrough` -> `DayList` / Walkthrough Timeline
- `/social-links` -> `SocialLinksPage`
- `/dungeons` -> `DungeonsPage`
- `/exams` -> `ExamsPage`

## 4. Success Criteria
- Reloading the page while on the Dungeons tab should keep the user on the Dungeons tab, not reset to the Walkthrough.
- Clicking the browser's "Back" button after navigating from Walkthrough to Dungeons should return the user to Walkthrough without exiting the web app.
- The aesthetic skew styling and active states on the `NavTabs` remain perfectly intact.