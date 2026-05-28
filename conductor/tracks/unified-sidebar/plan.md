# Implementation Plan: Unified Sidebar Navigation

## Phase 1: Update Navigation Component
1. Modify `src/components/molecules/NavTabs.tsx`.
   - Update to support a vertical layout for sidebar use.
   - Standardize the button style to be consistent with `MonthTab` (using `w-full` in sidebar mode).
   - Remove internal horizontal scroll if used in sidebar mode.

## Phase 2: Refactor App Layout Structure
1. Update `src/App.tsx`.
   - Remove `NavTabs` from the `headerContent` slot.
   - Create a unified `SidebarContent` component or block.
   - Structure the sidebar:
     - Section: "MAIN MENU" -> Render `NavTabs`.
     - Section: "TIMELINE" (conditional) -> Render `MonthSelector`.
   - Pass the unified sidebar to `MainLayout`.

## Phase 3: Visual Polish & Responsiveness
1. Update `src/components/templates/MainLayout.tsx`.
   - Ensure the sidebar area handles multiple vertical sections gracefully.
   - Adjust mobile padding to accommodate two rows of navigation (Tabs + Months) if necessary.
2. Add section headers in the sidebar with P4G styling (e.g., small yellow text on black background).

## Phase 4: Verification
1. Verify view switching via sidebar.
2. Verify month switching (when in walkthrough).
3. Check mobile view for overlap or clipping.
4. Final lint and type check.