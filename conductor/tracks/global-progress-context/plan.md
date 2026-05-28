# Implementation Plan: Global Progress Context

## Phase 1: Create Context & Provider
1. Create `src/context/ProgressContext.tsx`.
   - Define the interface for the context value (state and handlers).
   - Implement the `ProgressProvider` component.
   - Use `localStorage` logic inside the provider to initialize and persist state.
2. Update the `useProgress` hook in `src/hooks/useProgress.ts` to use `useContext(ProgressContext)` instead of having its own internal state.

## Phase 2: Wrap Application
1. Wrap the `<App />` component (or its content) with the `<ProgressProvider />` in `src/main.tsx` or `src/App.tsx`.

## Phase 3: Cleanup & Refactor
1. Review `src/App.tsx` and `src/components/organisms/DayList.tsx`.
2. Ensure both are using the updated `useProgress` hook.
3. Remove any redundant state logic if it exists.

## Phase 4: Verification
1. Mark several days as completed.
2. Refresh the page to ensure persistence.
3. Click "Reset All Data" and verify that:
   - Header percentage becomes 0.00%.
   - All cards instantly revert to their original state.
4. Final lint and type check.