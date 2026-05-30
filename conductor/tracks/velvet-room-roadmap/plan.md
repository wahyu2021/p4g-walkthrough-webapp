# Implementation Plan: Velvet Room: Fusion Roadmap

## Phase 1: Data Preparation
1. **Create `fusions.json`**:
   - Manually compile a curated list of top-tier Persona builds.
   - Include: Early (Sarasvati, Rakshasa), Mid (Black Frost, Ose), Late (Tam Lin, Trumpeter), End (Yoshitsune, Alice).
   - Define exact step-by-step fusion paths to get the required inherited skills.

## Phase 2: Page & UI Components
1. **Create `VelvetRoomPage.tsx`**:
   - Implement the deep blue UI aesthetic.
   - Add a Tier Selector (Early, Mid, Late, End).
2. **Create `RecipeCard.tsx` (Organism)**:
   - Display the target Persona, required Level, and key inherited skills.
   - Implement an accordion/dropdown to reveal the step-by-step mathematical fusion formula.

## Phase 3: Integration
1. **Update `App.tsx` and `NavTabs.tsx`**:
   - Add the `/velvet-room` route.
   - Add "Velvet Room" to the main navigation menu.

## Phase 4: Validation
1. Verify the blue styling doesn't aggressively clash with the global layout.
2. Ensure recipes render correctly, especially complex multi-step ones like Yoshitsune.