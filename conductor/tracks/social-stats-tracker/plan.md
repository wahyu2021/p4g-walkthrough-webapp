# Implementation Plan: Social Stats Tracker

## Phase 1: Context & State
1. **Extend `ProgressContext.tsx`**:
   - Add `socialStats` state: `{ knowledge: number, courage: number, diligence: number, understanding: number, expression: number }`.
   - Add `updateStat(statName, level)` function.
   - Save/load this alongside `completedDays` in `localStorage`.

## Phase 2: Tracker Page & Components
1. **Create `StatBar.tsx` (Molecule)**:
   - A component showing the stat name and 5 clickable segments to set the level.
2. **Create `TrackerPage.tsx` (Page)**:
   - A new page that imports `StatBar` for all 5 stats.
   - Includes placeholder sections for "Books" and "Quests" to be filled later using the scraped JSON data.
3. **Update `App.tsx` & `NavTabs.tsx`**:
   - Add `/tracker` to the Router.
   - Add a "Tracker" tab to the `NavTabs`.

## Phase 3: Validation
1. Click the NavTab to go to the Tracker.
2. Adjust stats, refresh the page, and ensure the stats are preserved via Context/LocalStorage.