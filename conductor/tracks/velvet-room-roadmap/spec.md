# Specification: Velvet Room: Fusion Roadmap

## 1. Objective
Build a dedicated page (`/velvet-room`) that guides players on which Personas to fuse at every stage of the game. The guide must provide specific, optimized fusion recipes (e.g., getting Invigorate 2 on an early-game Persona).

## 2. Component Design
- **Data Structure (`src/data/fusions.json`)**:
  - We will manually construct a high-quality JSON file containing curated Persona builds, since standard scrapers only get base stats, not optimal inherited skill paths.
  - Schema: `{ tier: "Early" | "Mid" | "Late" | "End", level_req: number, result_persona: string, arcana: string, goal_skills: string[], recipe: [ { persona1: string, persona2: string, result: string, notes: string } ], strategy: string }`
- **UI Elements**:
  - **Velvet Room Aesthetic**: Deep blue backgrounds (`#0B1B3D` to `#1A365D`), elegant serif typography or contrasting elements to differentiate it from the standard yellow UI.
  - **Progression Timeline**: A vertical timeline or tabbed interface (Early, Mid, Late, End Game).
  - **Recipe Card**: An expandable card showing the step-by-step fusion math.

## 3. Core Features
- **Early Game Survival**: Highlight SP-regen Personas (Sarasvati).
- **Mid Game Power**: Highlight physical sweepers (Ose, Black Frost).
- **End Game Gods**: Highlight Yoshitsune and Trumpeter.
- **Margaret's Requests**: (Optional expansion) A sub-tab to track fusions required for the Empress Social Link.

## 4. Success Criteria
- A visually distinct route (`/velvet-room`) is accessible from the NavTabs.
- Users can clearly see a chronological list of recommended Personas to build.
- The step-by-step recipes are clear and easy to read on mobile.